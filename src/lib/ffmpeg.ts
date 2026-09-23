/**
 * Shared FFmpeg.wasm helper (client-side only).
 *
 * Loading method: the UMD build of @ffmpeg/ffmpeg served from /public/ffmpeg (the npm ESM build
 * breaks once bundled by Next.js) + the single-thread @ffmpeg/core 0.12.6 from unpkg.
 * The single-thread core does not need SharedArrayBuffer / cross-origin isolation.
 *
 * Known limits of this core: the libvpx VP9 encoder crashes (use VP8 for WebM) and the
 * image encoders (mjpeg/png) crash (use a canvas for still frames).
 */

const FFMPEG_SCRIPT_URL = "/ffmpeg/ffmpeg.js";
const FFMPEG_CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

/** Minimal typing of the FFmpeg class exposed by /ffmpeg/ffmpeg.js (window.FFmpegWASM) */
interface FFmpegInstance {
  loaded: boolean;
  load(config: { coreURL: string; wasmURL: string }): Promise<boolean>;
  exec(args: string[]): Promise<number>;
  writeFile(path: string, data: Uint8Array): Promise<boolean>;
  readFile(path: string): Promise<Uint8Array | string>;
  deleteFile(path: string): Promise<boolean>;
  createDir(path: string): Promise<boolean>;
  deleteDir(path: string): Promise<boolean>;
  mount(fsType: string, options: { files?: File[] }, mountPoint: string): Promise<boolean>;
  unmount(mountPoint: string): Promise<boolean>;
  on(event: "log", cb: (e: { type: string; message: string }) => void): void;
  on(event: "progress", cb: (e: { progress: number; time: number }) => void): void;
  terminate(): void;
}

declare global {
  interface Window {
    FFmpegWASM?: { FFmpeg: new () => FFmpegInstance };
  }
}

let scriptPromise: Promise<void> | null = null;
let corePromise: Promise<{ coreURL: string; wasmURL: string }> | null = null;

function loadScript(): Promise<void> {
  if (window.FFmpegWASM) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = FFMPEG_SCRIPT_URL;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Échec du chargement de ${FFMPEG_SCRIPT_URL}`));
      document.head.appendChild(s);
    }).catch((e) => {
      scriptPromise = null;
      throw e;
    });
  }
  return scriptPromise;
}

async function toBlobURL(url: string, type: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  return URL.createObjectURL(new Blob([buf], { type }));
}

/** The core (~30 Mo) is downloaded once per page and reused, e.g. after a cancellation. */
function loadCoreURLs(): Promise<{ coreURL: string; wasmURL: string }> {
  if (!corePromise) {
    corePromise = Promise.all([
      toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
      toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
    ])
      .then(([coreURL, wasmURL]) => ({ coreURL, wasmURL }))
      .catch((e) => {
        corePromise = null;
        throw e;
      });
  }
  return corePromise;
}

export interface ProbeInfo {
  /** Seconds, 0 when unknown */
  duration: number;
  hasVideo: boolean;
  hasAudio: boolean;
  /** First audio stream (the one selected by -map 0:a:0) */
  audio: { codec: string; sampleRate: number; channels: number; bitrateKbps: number } | null;
  /** First video stream (coded size, before rotation) */
  video: { codec: string; width: number; height: number } | null;
}

function parseChannels(desc: string): number {
  if (/\bmono\b/.test(desc)) return 1;
  if (/\bstereo\b/.test(desc)) return 2;
  const n = desc.match(/\b(\d+) channels\b/);
  if (n) return Number(n[1]);
  const layout = desc.match(/\b(\d)\.(\d)(?:\(|,|\s|$)/);
  if (layout) return Number(layout[1]) + Number(layout[2]);
  return 2;
}

/** Parses "HH:MM:SS.xx" (as printed by FFmpeg) into seconds */
export function parseTimestamp(ts: string): number {
  const m = ts.match(/(\d+):(\d{2}):(\d{2}(?:\.\d+)?)/);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

/** Extracts the input description printed by `ffmpeg -i <file>` */
export function parseProbe(logs: string[]): ProbeInfo {
  const info: ProbeInfo = { duration: 0, hasVideo: false, hasAudio: false, audio: null, video: null };
  for (const line of logs) {
    const d = line.match(/Duration:\s*(\d+:\d{2}:\d{2}(?:\.\d+)?)/);
    if (d && !info.duration) info.duration = parseTimestamp(d[1]);

    const s = line.match(/Stream #\d+:\d+.*?: (Audio|Video): (.*)$/);
    if (!s) continue;
    const desc = s[2];
    const codec = desc.split(/[\s,]/)[0].toLowerCase();
    if (s[1] === "Audio") {
      info.hasAudio = true;
      if (!info.audio) {
        const sr = desc.match(/(\d+) Hz/);
        const br = desc.match(/(\d+) kb\/s/);
        info.audio = {
          codec,
          sampleRate: sr ? Number(sr[1]) : 0,
          channels: parseChannels(desc),
          bitrateKbps: br ? Number(br[1]) : 0,
        };
      }
    } else {
      // Cover art (attached picture) is not a real video track
      if (/attached pic/.test(desc)) continue;
      info.hasVideo = true;
      if (!info.video) {
        const wh = desc.match(/, (\d{2,5})x(\d{2,5})/);
        info.video = { codec, width: wh ? Number(wh[1]) : 0, height: wh ? Number(wh[2]) : 0 };
      }
    }
  }
  return info;
}

/** Lower-case ASCII extension of a file name, or the fallback */
export function safeExtension(name: string, fallback: string): string {
  const raw = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";
  return /^[a-z0-9]{1,5}$/.test(raw) ? raw : fallback;
}

export function baseName(name: string): string {
  return name.includes(".") ? name.replace(/\.[^.]+$/, "") : name;
}

let jobCounter = 0;

/**
 * One FFmpeg worker. Create it with FFmpegSession.create(); terminate() kills the worker
 * (a running exec() then rejects) and the session can no longer be used.
 */
export class FFmpegSession {
  private ff: FFmpegInstance;
  private logs: string[] = [];
  private progressCb: ((ratio: number) => void) | null = null;
  private expectedDuration = 0;
  private lastRatio = 0;
  terminated = false;

  private constructor(ff: FFmpegInstance) {
    this.ff = ff;
    ff.on("log", ({ message }) => {
      this.logs.push(message);
      if (this.logs.length > 500) this.logs.shift();
      // "time=00:01:02.34" of the -stats line: reliable progress when the duration is known
      if (this.progressCb && this.expectedDuration > 0) {
        const t = message.match(/time=\s*(\d+:\d{2}:\d{2}(?:\.\d+)?)/);
        if (t) this.report(parseTimestamp(t[1]) / this.expectedDuration);
      }
    });
    ff.on("progress", ({ progress }) => {
      if (this.progressCb && this.expectedDuration <= 0) this.report(progress);
    });
  }

  private report(ratio: number) {
    if (!Number.isFinite(ratio) || !this.progressCb) return;
    const r = Math.max(0, Math.min(ratio, 1));
    if (r < this.lastRatio) return;
    this.lastRatio = r;
    this.progressCb(r);
  }

  static async create(onStatus?: (message: string) => void): Promise<FFmpegSession> {
    onStatus?.("Chargement de FFmpeg...");
    await loadScript();
    const Ctor = window.FFmpegWASM?.FFmpeg;
    if (!Ctor) throw new Error("FFmpegWASM indisponible");
    onStatus?.("Téléchargement du moteur FFmpeg (environ 30 Mo, une seule fois)...");
    const urls = await loadCoreURLs();
    onStatus?.("Initialisation de FFmpeg...");
    const ff = new Ctor();
    await ff.load(urls);
    return new FFmpegSession(ff);
  }

  /** Runs FFmpeg. `duration` (seconds) enables progress computed from the log time stamps. */
  async exec(args: string[], opts?: { duration?: number; onProgress?: (ratio: number) => void }): Promise<number> {
    this.logs.length = 0;
    this.expectedDuration = opts?.duration ?? 0;
    this.lastRatio = 0;
    this.progressCb = opts?.onProgress ?? null;
    try {
      return await this.ff.exec(["-hide_banner", ...args]);
    } finally {
      this.progressCb = null;
    }
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  /** Describes the streams of an input (the probe command itself exits with an error by design). */
  async probe(path: string): Promise<ProbeInfo> {
    await this.exec(["-i", path]);
    return parseProbe(this.logs);
  }

  /**
   * Makes a File readable by FFmpeg. WORKERFS reads it lazily (no copy of the whole file in memory);
   * falls back to writing it into MEMFS. Call the returned cleanup() when done.
   */
  async mountInput(file: File, ext: string): Promise<{ path: string; cleanup: () => Promise<void> }> {
    jobCounter += 1;
    const dir = `/job${jobCounter}`;
    const name = `input.${ext}`;
    try {
      await this.ff.createDir(dir);
      // Wrapping the File renames it (no odd characters in FFmpeg arguments) without copying the data
      await this.ff.mount("WORKERFS", { files: [new File([file], name, { type: file.type })] }, dir);
      return {
        path: `${dir}/${name}`,
        cleanup: async () => {
          try {
            await this.ff.unmount(dir);
            await this.ff.deleteDir(dir);
          } catch {
            // worker may be gone
          }
        },
      };
    } catch {
      try {
        await this.ff.deleteDir(dir);
      } catch {
        // may not exist
      }
      const path = `/input${jobCounter}.${ext}`;
      await this.ff.writeFile(path, new Uint8Array(await file.arrayBuffer()));
      return { path, cleanup: () => this.deleteFile(path) };
    }
  }

  async readFile(path: string): Promise<Uint8Array> {
    const data = await this.ff.readFile(path);
    return typeof data === "string" ? new TextEncoder().encode(data) : data;
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await this.ff.deleteFile(path);
    } catch {
      // may not exist
    }
  }

  terminate() {
    this.terminated = true;
    try {
      this.ff.terminate();
    } catch {
      // ignore
    }
  }
}

/**
 * Duration of a WAV file read from its RIFF header (works even when the browser cannot play the
 * codec, e.g. ADPCM, or when media loading is deferred in a background tab). Returns 0 if unknown.
 */
export async function readWavDuration(file: File): Promise<number> {
  try {
    const head = new DataView(await file.slice(0, 1024 * 1024).arrayBuffer());
    if (head.byteLength < 12) return 0;
    const tag = (o: number) => String.fromCharCode(head.getUint8(o), head.getUint8(o + 1), head.getUint8(o + 2), head.getUint8(o + 3));
    if (tag(0) !== "RIFF" || tag(8) !== "WAVE") return 0;
    let offset = 12;
    let byteRate = 0;
    while (offset + 8 <= head.byteLength) {
      const id = tag(offset);
      const size = head.getUint32(offset + 4, true);
      if (id === "fmt " && offset + 16 <= head.byteLength) {
        byteRate = head.getUint32(offset + 16, true);
      } else if (id === "data") {
        if (!byteRate) return 0;
        // Streamed WAVs may declare 0 or 0xFFFFFFFF: use the real remaining size instead
        const available = file.size - (offset + 8);
        const dataSize = size === 0 || size === 0xffffffff || size > available ? available : size;
        return dataSize / byteRate;
      }
      offset += 8 + size + (size % 2);
    }
  } catch {
    // ignore
  }
  return 0;
}
