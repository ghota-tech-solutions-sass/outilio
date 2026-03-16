"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ═══════════════════════════ TYPES ═══════════════════════════ */

interface VideoInfo { name: string; size: number; type: string; duration: number; width: number; height: number; url: string; file: File }

type EffectType = "trim" | "resize" | "speed" | "rotate" | "mute";
type QuickAction = "gif" | "capture";

interface CutZone { id: string; start: number; end: number }
interface TrimCfg { start: number; end: number; cuts: CutZone[] }
interface ResizeCfg { w: number; h: number; label: string }
interface SpeedCfg { value: number; label: string }
interface RotateCfg { filter: string; label: string }
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MuteCfg {}

type EffectCfg = TrimCfg | ResizeCfg | SpeedCfg | RotateCfg | MuteCfg;

interface PipelineEffect { id: string; type: EffectType; config: EffectCfg }

/* ═══════════════════════════ PRESETS ═══════════════════════════ */

const EFX: Record<EffectType, { label: string; icon: string; color: string }> = {
  trim:   { label: "Couper",   icon: "✂️",  color: "#22c55e" },
  resize: { label: "Taille",   icon: "📐",  color: "#6366f1" },
  speed:  { label: "Vitesse",  icon: "⚡",  color: "#e8963e" },
  rotate: { label: "Rotation", icon: "🔄",  color: "#ec4899" },
  mute:   { label: "Muet",     icon: "🔇",  color: "#dc2626" },
};

const RESIZE_P = [
  { w: 1920, h: 1080, label: "1080p" }, { w: 1280, h: 720, label: "720p" },
  { w: 854, h: 480, label: "480p" }, { w: 640, h: 360, label: "360p" },
];
const SPEED_P = [
  { value: 0.25, label: "0.25x" }, { value: 0.5, label: "0.5x" }, { value: 0.75, label: "0.75x" },
  { value: 1.5, label: "1.5x" }, { value: 2, label: "2x" }, { value: 4, label: "4x" },
];
const ROTATE_P = [
  { filter: "transpose=1", label: "90° →" }, { filter: "transpose=2", label: "90° ←" },
  { filter: "transpose=1,transpose=1", label: "180°" }, { filter: "hflip", label: "Miroir ↔" }, { filter: "vflip", label: "Miroir ↕" },
];

/* ═══════════════════════════ UTILS ═══════════════════════════ */

function uid() { return Math.random().toString(36).slice(2, 8); }
function fmtSize(b: number) { return b < 1048576 ? (b / 1024).toFixed(1) + " Ko" : (b / 1048576).toFixed(1) + " Mo"; }
function fmtTime(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
}
function fmtTimeFine(s: number) {
  const m = Math.floor(s / 60), sec = Math.floor(s % 60), ms = Math.floor((s % 1) * 10);
  return `${m}:${String(sec).padStart(2, "0")}.${ms}`;
}

/* ═══════════════════════ FFMPEG CMD BUILDER ═══════════════════════ */

/** Compute "keep" segments from trim config (start/end range + cut zones to remove) */
function getKeepSegments(cfg: TrimCfg): { start: number; end: number }[] {
  const sortedCuts = [...cfg.cuts].sort((a, b) => a.start - b.start);
  const keeps: { start: number; end: number }[] = [];
  let cursor = cfg.start;
  for (const cut of sortedCuts) {
    if (cut.start > cursor) keeps.push({ start: cursor, end: Math.min(cut.start, cfg.end) });
    cursor = Math.max(cursor, cut.end);
  }
  if (cursor < cfg.end) keeps.push({ start: cursor, end: cfg.end });
  return keeps.filter((k) => k.end - k.start > 0.1);
}

function buildArgs(pipeline: PipelineEffect[], fmt: "mp4" | "webm", quality: number, duration: number): string[] {
  let muted = false;
  const extraVf: string[] = [], extraAf: string[] = [];

  for (const e of pipeline) {
    if (e.type === "resize") { const c = e.config as ResizeCfg; extraVf.push(`scale=${c.w}:${c.h}:force_original_aspect_ratio=decrease,pad=${c.w}:${c.h}:(ow-iw)/2:(oh-ih)/2`); }
    if (e.type === "rotate") { extraVf.push((e.config as RotateCfg).filter); }
    if (e.type === "speed") {
      const s = (e.config as SpeedCfg).value;
      extraVf.push(`setpts=${(1 / s).toFixed(4)}*PTS`);
      let r = s;
      while (r > 2) { extraAf.push("atempo=2.0"); r /= 2; }
      while (r < 0.5) { extraAf.push("atempo=0.5"); r /= 0.5; }
      if (Math.abs(r - 1) > 0.001) extraAf.push(`atempo=${r.toFixed(4)}`);
    }
    if (e.type === "mute") muted = true;
  }

  const trim = pipeline.find((e) => e.type === "trim");
  const trimCfg = trim ? trim.config as TrimCfg : null;

  // Multi-cut: use filter_complex with trim+concat
  if (trimCfg && trimCfg.cuts.length > 0) {
    const keeps = getKeepSegments(trimCfg);
    if (keeps.length === 0) return ["-t", "0"]; // nothing to keep

    const n = keeps.length;
    const vParts: string[] = [], aParts: string[] = [], vLabels: string[] = [], aLabels: string[] = [];
    for (let i = 0; i < n; i++) {
      const k = keeps[i];
      const vExtra = extraVf.length ? "," + extraVf.join(",") : "";
      const aExtra = extraAf.length ? "," + extraAf.join(",") : "";
      vParts.push(`[0:v]trim=${k.start.toFixed(2)}:${k.end.toFixed(2)},setpts=PTS-STARTPTS${vExtra}[v${i}]`);
      if (!muted) aParts.push(`[0:a]atrim=${k.start.toFixed(2)}:${k.end.toFixed(2)},asetpts=PTS-STARTPTS${aExtra}[a${i}]`);
      vLabels.push(`[v${i}]`);
      aLabels.push(`[a${i}]`);
    }
    let fc = vParts.join(";") + ";" + vLabels.join("") + `concat=n=${n}:v=1:a=0[outv]`;
    if (!muted && aParts.length) fc += ";" + aParts.join(";") + ";" + aLabels.join("") + `concat=n=${n}:v=0:a=1[outa]`;

    const args = ["-filter_complex", fc, "-map", "[outv]"];
    if (!muted && aParts.length) args.push("-map", "[outa]");
    else if (muted) args.push("-an");

    if (fmt === "mp4") { args.push("-c:v", "libx264", "-crf", String(quality), "-preset", "fast"); if (!muted) args.push("-c:a", "aac"); }
    else { args.push("-c:v", "libvpx-vp9", "-crf", String(quality), "-b:v", "0"); if (!muted) args.push("-c:a", "libvorbis"); }
    return args;
  }

  // Simple trim (no cuts) or no trim
  const args: string[] = [];
  if (trimCfg) args.push("-ss", trimCfg.start.toFixed(2), "-to", trimCfg.end.toFixed(2));

  const needsEnc = extraVf.length > 0;
  if (extraVf.length) args.push("-vf", extraVf.join(","));
  if (muted) args.push("-an");
  else if (extraAf.length) args.push("-af", extraAf.join(","));

  if (needsEnc) {
    if (fmt === "mp4") { args.push("-c:v", "libx264", "-crf", String(quality), "-preset", "fast"); if (!muted && !extraAf.length) args.push("-c:a", "aac"); }
    else { args.push("-c:v", "libvpx-vp9", "-crf", String(quality), "-b:v", "0"); if (!muted && !extraAf.length) args.push("-c:a", "libvorbis"); }
  } else { args.push("-c:v", "copy"); if (!muted) args.push("-c:a", "copy"); }
  return args;
}

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */

export default function EditeurVideo() {
  /* ─── State ─── */
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [pipeline, setPipeline] = useState<PipelineEffect[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [quickAction, setQuickAction] = useState<QuickAction | null>(null);

  const [exportFmt, setExportFmt] = useState<"mp4" | "webm">("mp4");
  const [exportQ, setExportQ] = useState(23);

  const [gifStart, setGifStart] = useState(0);
  const [gifDur, setGifDur] = useState(5);
  const [gifFps, setGifFps] = useState(15);
  const [capTime, setCapTime] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [result, setResult] = useState<{ url: string; size: number; name: string; type: string } | null>(null);

  /* ─── Timeline state ─── */
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const [dragging, setDragging] = useState<"playhead" | "trimL" | "trimR" | null>(null);

  /* ─── Derived ─── */
  const selEffect = useMemo(() => pipeline.find((e) => e.id === selectedId), [pipeline, selectedId]);
  const hasType = (t: EffectType) => pipeline.some((e) => e.type === t);
  const trimCfg = useMemo(() => {
    const t = pipeline.find((e) => e.type === "trim");
    return t ? (t.config as TrimCfg) : null;
  }, [pipeline]);
  const needsEnc = useMemo(() => {
    if (pipeline.some((e) => ["resize", "speed", "rotate"].includes(e.type))) return true;
    if (trimCfg && trimCfg.cuts.length > 0) return true; // multi-cut requires re-encoding for concat
    return false;
  }, [pipeline, trimCfg]);
  const estDuration = useMemo(() => {
    if (!video) return 0;
    let d: number;
    if (trimCfg) {
      if (trimCfg.cuts.length > 0) {
        d = getKeepSegments(trimCfg).reduce((sum, k) => sum + (k.end - k.start), 0);
      } else {
        d = trimCfg.end - trimCfg.start;
      }
    } else { d = video.duration; }
    const sp = pipeline.find((e) => e.type === "speed");
    if (sp) d /= (sp.config as SpeedCfg).value;
    return d;
  }, [video, pipeline, trimCfg]);

  /* ─── COI ─── */
  useEffect(() => {
    if (typeof window !== "undefined" && !window.crossOriginIsolated) {
      const s = document.createElement("script"); s.src = "/coi-serviceworker.js"; document.head.appendChild(s);
    }
  }, []);

  useEffect(() => () => { if (video?.url) URL.revokeObjectURL(video.url); if (result?.url) URL.revokeObjectURL(result.url); }, [video, result]);

  /* ─── Playhead sync ─── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const update = () => { setPlayhead(v.currentTime); if (!v.paused) animRef.current = requestAnimationFrame(update); };
    const onPlay = () => { setPlaying(true); animRef.current = requestAnimationFrame(update); };
    const onPause = () => { setPlaying(false); cancelAnimationFrame(animRef.current); };
    const onSeek = () => setPlayhead(v.currentTime);
    v.addEventListener("play", onPlay); v.addEventListener("pause", onPause); v.addEventListener("seeked", onSeek); v.addEventListener("timeupdate", onSeek);
    return () => { v.removeEventListener("play", onPlay); v.removeEventListener("pause", onPause); v.removeEventListener("seeked", onSeek); v.removeEventListener("timeupdate", onSeek); cancelAnimationFrame(animRef.current); };
  }, [video]);

  /* ─── FFmpeg ─── */
  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) return true;
    setProgressMsg("Chargement de FFmpeg...");
    try {
      await new Promise<void>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).FFmpegWASM) { resolve(); return; }
        const s = document.createElement("script"); s.src = "/ffmpeg/ffmpeg.js";
        s.onload = () => resolve(); s.onerror = () => reject(new Error("Echec chargement FFmpeg"));
        document.head.appendChild(s);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { FFmpeg } = (window as any).FFmpegWASM;
      const ffmpeg = new FFmpeg();
      ffmpeg.on("log", ({ message }: { message: string }) => console.log("[FFmpeg]", message));
      ffmpeg.on("progress", ({ progress: p }: { progress: number }) => setProgress(Math.min(Math.round(p * 100), 100)));
      const toBlobURL = async (url: string, type: string) => { const buf = await (await fetch(url)).arrayBuffer(); return URL.createObjectURL(new Blob([buf], { type })); };
      setProgressMsg("Telechargement du moteur WASM...");
      const base = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      const [coreURL, wasmURL] = await Promise.all([toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"), toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm")]);
      setProgressMsg("Initialisation...");
      await ffmpeg.load({ coreURL, wasmURL });
      const fetchFile = async (f: File) => new Uint8Array(await f.arrayBuffer());
      ffmpegRef.current = { ffmpeg, fetchFile };
      return true;
    } catch (e) { console.error("FFmpeg load error:", e); setError(`Erreur FFmpeg : ${e instanceof Error ? e.message : String(e)}`); return false; }
  }, []);

  const execFFmpeg = useCallback(async (args: string[], outFile: string, mime: string, ext: string) => {
    if (!video) return;
    setProcessing(true); setProgress(0); setResult(null); setError("");
    if (!(await loadFFmpeg())) { setProcessing(false); return; }
    const { ffmpeg, fetchFile } = ffmpegRef.current;
    setProgressMsg("Preparation...");
    try {
      const inExt = video.name.split(".").pop()?.toLowerCase() || "mp4";
      const inFile = `input.${inExt}`;
      await ffmpeg.writeFile(inFile, await fetchFile(video.file));
      setProgressMsg("Traitement...");
      const code = await ffmpeg.exec(["-i", inFile, ...args, "-y", outFile]);
      if (code !== 0) { setError("Erreur FFmpeg."); setProcessing(false); return; }
      const data = await ffmpeg.readFile(outFile);
      const blob = new Blob([data], { type: mime });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, name: video.name.replace(/\.[^.]+$/, `_edit.${ext}`), type: mime });
      setProgress(100);
      try { await ffmpeg.deleteFile(inFile); await ffmpeg.deleteFile(outFile); } catch { /**/ }
    } catch (e) { console.error(e); setError(`Erreur : ${e instanceof Error ? e.message : String(e)}`); }
    setProcessing(false); setProgressMsg("");
  }, [video, loadFFmpeg]);

  /* ─── Video loading ─── */
  const loadVideo = useCallback(async (file: File) => {
    setError(""); setResult(null); setPipeline([]); setSelectedId(null); setQuickAction(null); setPlayhead(0);
    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|webm|mov|avi|mkv)$/i)) { setError("Format video non reconnu."); return; }
    if (file.size > 500 * 1024 * 1024) { setError("Max 500 Mo."); return; }
    const url = URL.createObjectURL(file);
    const v = document.createElement("video"); v.preload = "metadata"; v.src = url;
    try { await new Promise<void>((res, rej) => { v.onloadedmetadata = () => res(); v.onerror = () => rej(); }); }
    catch { setError("Impossible de lire cette video."); URL.revokeObjectURL(url); return; }
    setVideo({ name: file.name, size: file.size, type: file.type, duration: v.duration, width: v.videoWidth, height: v.videoHeight, url, file });
  }, []);

  /* ─── Pipeline ops ─── */
  const addEffect = (type: EffectType) => {
    if (hasType(type)) return;
    let config: EffectCfg;
    if (type === "trim") config = { start: 0, end: video?.duration ?? 10, cuts: [] } as TrimCfg;
    else if (type === "resize") config = RESIZE_P[1];
    else if (type === "speed") config = SPEED_P[3];
    else if (type === "rotate") config = ROTATE_P[0];
    else config = {} as MuteCfg;
    const id = uid();
    setPipeline((p) => [...p, { id, type, config }]);
    setSelectedId(id); setShowAddMenu(false); setQuickAction(null);
  };

  const removeEffect = (id: string) => { setPipeline((p) => p.filter((e) => e.id !== id)); if (selectedId === id) setSelectedId(null); };
  const updateCfg = (id: string, config: EffectCfg) => { setPipeline((p) => p.map((e) => (e.id === id ? { ...e, config } : e))); };

  /* ─── Timeline interaction ─── */
  const getTimeFromX = useCallback((clientX: number) => {
    if (!timelineRef.current || !video) return 0;
    const rect = timelineRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return pct * video.duration;
  }, [video]);

  const handleTimelineMouseDown = useCallback((e: React.MouseEvent, target: "playhead" | "trimL" | "trimR") => {
    e.preventDefault(); e.stopPropagation();
    setDragging(target);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const t = getTimeFromX(e.clientX);
      if (dragging === "playhead") { setPlayhead(t); if (videoRef.current) videoRef.current.currentTime = t; }
      else if (dragging === "trimL" && trimCfg) {
        const id = pipeline.find((x) => x.type === "trim")!.id;
        updateCfg(id, { ...trimCfg, start: Math.min(t, trimCfg.end - 0.5) });
      } else if (dragging === "trimR" && trimCfg) {
        const id = pipeline.find((x) => x.type === "trim")!.id;
        updateCfg(id, { ...trimCfg, end: Math.max(t, trimCfg.start + 0.5) });
      }
    };
    const onUp = () => setDragging(null);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging, getTimeFromX, trimCfg, pipeline, updateCfg]);

  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (dragging) return;
    const t = getTimeFromX(e.clientX);
    setPlayhead(t);
    if (videoRef.current) videoRef.current.currentTime = t;
  }, [getTimeFromX, dragging]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  }, []);

  /* ─── Handlers ─── */
  const handleExport = () => {
    if (!video || !pipeline.length) return;
    const args = buildArgs(pipeline, exportFmt, exportQ, video.duration);
    execFFmpeg(args, `output.${exportFmt}`, exportFmt === "mp4" ? "video/mp4" : "video/webm", exportFmt);
  };
  const handleGif = () => { if (!video) return; execFFmpeg(["-ss", gifStart.toFixed(2), "-t", gifDur.toFixed(2), "-vf", `fps=${gifFps},scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`, "-loop", "0"], "output.gif", "image/gif", "gif"); };
  const handleCapture = () => { if (!video) return; execFFmpeg(["-ss", capTime.toFixed(2), "-frames:v", "1", "-q:v", "2"], "output.jpg", "image/jpeg", "jpg"); };
  const resetAll = () => { if (video?.url) URL.revokeObjectURL(video.url); if (result?.url) URL.revokeObjectURL(result.url); setVideo(null); setResult(null); setPipeline([]); setSelectedId(null); setError(""); setQuickAction(null); };

  const pctOf = (t: number) => video ? (t / video.duration) * 100 : 0;

  /* ═══════════════════════════ RENDER ═══════════════════════════ */

  /* ── Shared dark panel colors ── */
  const dk = { bg: "#141416", bg2: "#1c1c1f", bg3: "#232327", border: "#2a2a2f", text: "#a0a0a8", textBright: "#e4e4e7", accent: "#4ade80" };

  /* ── Effect config renderer ── */
  const renderConfig = () => {
    if (selEffect?.type === "trim") { const c = selEffect.config as TrimCfg;
      const addCut = () => {
        const mid = (c.start + c.end) / 2;
        const cutLen = Math.min(1, (c.end - c.start) * 0.15);
        updateCfg(selEffect.id, { ...c, cuts: [...c.cuts, { id: uid(), start: mid - cutLen, end: mid + cutLen }] });
      };
      const removeCut = (cutId: string) => {
        updateCfg(selEffect.id, { ...c, cuts: c.cuts.filter((x) => x.id !== cutId) });
      };
      const updateCut = (cutId: string, field: "start" | "end", val: number) => {
        updateCfg(selEffect.id, { ...c, cuts: c.cuts.map((x) => x.id === cutId ? { ...x, [field]: val } : x) });
      };
      const keeps = getKeepSegments(c);
      return (
      <div className="space-y-4">
        {/* Range */}
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-[10px] uppercase tracking-wider" style={{ color: dk.text }}>Debut</label><input type="range" min={0} max={video!.duration} step={0.1} value={c.start} onChange={(e) => { const v = Math.min(+e.target.value, c.end - 0.5); updateCfg(selEffect.id, { ...c, start: v }); if (videoRef.current) videoRef.current.currentTime = v; }} className="mt-2 w-full accent-[#4ade80]" /><p className="mt-1 text-center font-mono text-xs" style={{ color: dk.accent }}>{fmtTimeFine(c.start)}</p></div>
          <div><label className="text-[10px] uppercase tracking-wider" style={{ color: dk.text }}>Fin</label><input type="range" min={0} max={video!.duration} step={0.1} value={c.end} onChange={(e) => { const v = Math.max(+e.target.value, c.start + 0.5); updateCfg(selEffect.id, { ...c, end: v }); if (videoRef.current) videoRef.current.currentTime = v; }} className="mt-2 w-full accent-[#4ade80]" /><p className="mt-1 text-center font-mono text-xs" style={{ color: dk.accent }}>{fmtTimeFine(c.end)}</p></div>
        </div>
        {/* Cut zones */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-wider" style={{ color: dk.text }}>Zones a supprimer ({c.cuts.length})</label>
            <button onClick={addCut} className="rounded px-2 py-0.5 text-[10px] font-bold transition-all hover:scale-105" style={{ background: "#ef444420", color: "#ef4444" }}>+ Couper ici</button>
          </div>
          {c.cuts.length > 0 && (
            <div className="mt-2 space-y-2">
              {c.cuts.map((cut, i) => (
                <div key={cut.id} className="flex items-center gap-2 rounded-lg p-2" style={{ background: "#ef444410" }}>
                  <span className="text-[10px] font-bold" style={{ color: "#ef4444" }}>#{i + 1}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-[9px]" style={{ color: dk.text }}>De</span>
                      <input type="range" min={c.start} max={c.end} step={0.1} value={cut.start} onChange={(e) => { updateCut(cut.id, "start", Math.min(+e.target.value, cut.end - 0.3)); if (videoRef.current) videoRef.current.currentTime = +e.target.value; }} className="flex-1 accent-[#ef4444]" />
                      <span className="w-12 text-right font-mono text-[10px]" style={{ color: "#ef4444" }}>{fmtTimeFine(cut.start)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8 text-[9px]" style={{ color: dk.text }}>A</span>
                      <input type="range" min={c.start} max={c.end} step={0.1} value={cut.end} onChange={(e) => { updateCut(cut.id, "end", Math.max(+e.target.value, cut.start + 0.3)); if (videoRef.current) videoRef.current.currentTime = +e.target.value; }} className="flex-1 accent-[#ef4444]" />
                      <span className="w-12 text-right font-mono text-[10px]" style={{ color: "#ef4444" }}>{fmtTimeFine(cut.end)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeCut(cut.id)} className="text-[10px] opacity-50 hover:opacity-100" style={{ color: "#ef4444" }}>✕</button>
                </div>
              ))}
            </div>
          )}
          {c.cuts.length === 0 && <p className="mt-2 text-[10px]" style={{ color: dk.text }}>Aucune zone coupee. Cliquez &quot;+ Couper ici&quot; pour supprimer des parties.</p>}
        </div>
        {/* Summary */}
        <div className="rounded-lg px-3 py-2 text-center text-xs font-semibold" style={{ background: "rgba(74,222,128,0.08)", color: dk.accent }}>
          {keeps.length} segment{keeps.length > 1 ? "s" : ""} conserve{keeps.length > 1 ? "s" : ""} — {fmtTime(keeps.reduce((s, k) => s + k.end - k.start, 0))}
        </div>
      </div>
    ); }
    if (selEffect?.type === "resize") { const c = selEffect.config as ResizeCfg; return (
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-1.5">{RESIZE_P.map((p) => (<button key={p.label} onClick={() => updateCfg(selEffect.id, p)} className="rounded-lg py-2.5 text-center text-[11px] font-bold transition-all" style={{ background: c.label === p.label ? EFX.resize.color : dk.bg3, color: c.label === p.label ? "#fff" : dk.text }}>{p.label}</button>))}</div>
        <p className="text-xs" style={{ color: dk.text }}>{video!.width}x{video!.height} → <span style={{ color: dk.textBright }}>{c.w}x{c.h}</span></p>
      </div>
    ); }
    if (selEffect?.type === "speed") { const c = selEffect.config as SpeedCfg; return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-1.5">{SPEED_P.map((p) => (<button key={p.label} onClick={() => updateCfg(selEffect.id, p)} className="rounded-lg py-2.5 text-center text-[11px] font-bold transition-all" style={{ background: c.label === p.label ? EFX.speed.color : dk.bg3, color: c.label === p.label ? "#fff" : dk.text }}>{p.label}</button>))}</div>
        <p className="text-xs" style={{ color: dk.text }}>Duree : <span style={{ color: dk.textBright }}>{fmtTime(estDuration)}</span></p>
      </div>
    ); }
    if (selEffect?.type === "rotate") { const c = selEffect.config as RotateCfg; return (
      <div className="grid grid-cols-5 gap-1.5">{ROTATE_P.map((p) => (<button key={p.label} onClick={() => updateCfg(selEffect.id, p)} className="rounded-lg py-2.5 text-center text-[10px] font-bold transition-all" style={{ background: c.label === p.label ? EFX.rotate.color : dk.bg3, color: c.label === p.label ? "#fff" : dk.text }}>{p.label}</button>))}</div>
    ); }
    if (selEffect?.type === "mute") return <p className="text-xs" style={{ color: dk.text }}>La piste audio sera supprimee. Pas de re-encodage.</p>;
    if (quickAction === "gif") return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="text-[10px] uppercase" style={{ color: dk.text }}>Debut</label><input type="range" min={0} max={video!.duration} step={0.1} value={gifStart} onChange={(e) => { setGifStart(+e.target.value); if (videoRef.current) videoRef.current.currentTime = +e.target.value; }} className="mt-1 w-full accent-[#e8963e]" /><p className="text-center font-mono text-[11px]" style={{ color: "#e8963e" }}>{fmtTime(gifStart)}</p></div>
          <div><label className="text-[10px] uppercase" style={{ color: dk.text }}>Duree</label><input type="range" min={1} max={Math.min(10, video!.duration - gifStart)} step={0.5} value={gifDur} onChange={(e) => setGifDur(+e.target.value)} className="mt-1 w-full accent-[#e8963e]" /><p className="text-center font-mono text-[11px]" style={{ color: "#e8963e" }}>{gifDur}s</p></div>
        </div>
        <div className="flex gap-1.5">{[10, 15, 20].map((f) => (<button key={f} onClick={() => setGifFps(f)} className="flex-1 rounded-lg py-2 text-[11px] font-bold transition-all" style={{ background: gifFps === f ? "#e8963e" : dk.bg3, color: gifFps === f ? "#fff" : dk.text }}>{f} fps</button>))}</div>
        <button onClick={handleGif} className="w-full rounded-lg py-2.5 text-xs font-bold text-white" style={{ background: "#e8963e" }}>Extraire le GIF</button>
      </div>
    );
    if (quickAction === "capture") return (
      <div className="space-y-3">
        <input type="range" min={0} max={video!.duration} step={0.1} value={capTime} onChange={(e) => { setCapTime(+e.target.value); if (videoRef.current) videoRef.current.currentTime = +e.target.value; }} className="w-full accent-[#4ade80]" />
        <p className="text-center font-mono text-lg font-bold" style={{ color: dk.accent }}>{fmtTimeFine(capTime)}</p>
        <button onClick={handleCapture} className="w-full rounded-lg py-2.5 text-xs font-bold text-black" style={{ background: dk.accent }}>Capturer l&apos;image</button>
      </div>
    );
    return null;
  };

  const configTitle = selEffect ? `${EFX[selEffect.type].icon} ${EFX[selEffect.type].label}` : quickAction === "gif" ? "🎞️ GIF" : quickAction === "capture" ? "📸 Capture" : null;

  return (
    <>
      {/* ─── Drop zone (light, before video loaded) ─── */}
      {!video && (
        <div className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Video</p>
              <h1 className="mt-2 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Editeur <span style={{ color: "var(--primary)" }}>Video</span></h1>
              <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "var(--muted)" }}>Combinez coupe, vitesse, rotation et plus. Exportez en un clic. 100% dans votre navigateur.</p>
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && loadVideo(e.dataTransfer.files[0]); }}
              onClick={() => inputRef.current?.click()}
              className="mx-auto mt-10 max-w-lg cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all hover:shadow-xl hover:scale-[1.01]"
              style={{ borderColor: dragOver ? "var(--primary)" : "var(--border)", background: dragOver ? "rgba(13,79,60,0.04)" : "var(--surface)" }}
            >
              <input ref={inputRef} type="file" accept="video/*,.mp4,.webm,.mov,.avi,.mkv" className="hidden" onChange={(e) => e.target.files?.[0] && loadVideo(e.target.files[0])} />
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "rgba(13,79,60,0.08)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--primary)" }}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
              </div>
              <p className="mt-4 text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Deposez votre video ici</p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>MP4, WebM, MOV, AVI — max 500 Mo</p>
            </div>
          </div>
        </div>
      )}

      {error && <div className="mx-auto max-w-xl px-5 py-3"><div className="rounded-xl border p-3 text-sm" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>{error}</div></div>}

      {/* ═══════════ DARK WORKSPACE ═══════════ */}
      {video && !processing && !result && (
        <div style={{ background: dk.bg, minHeight: "calc(100vh - 64px)" }}>
          {/* ── Top bar ── */}
          <div className="flex items-center gap-4 border-b px-4 py-2" style={{ borderColor: dk.border }}>
            <button onClick={togglePlay} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-all hover:scale-110" style={{ background: dk.accent }}>
              {playing
                ? <svg width="10" height="10" viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                : <svg width="10" height="10" viewBox="0 0 24 24" fill="#000"><polygon points="5 3 19 12 5 21" /></svg>}
            </button>
            <span className="font-mono text-xs font-bold tabular-nums" style={{ color: dk.accent }}>{fmtTimeFine(playhead)}</span>
            <span className="text-[10px]" style={{ color: dk.text }}>/ {fmtTime(video.duration)}</span>
            <div className="mx-3 h-4 w-px" style={{ background: dk.border }} />
            <span className="truncate text-[10px]" style={{ color: dk.text, maxWidth: 200 }}>{video.name}</span>
            <span className="text-[10px]" style={{ color: dk.text }}>{video.width}x{video.height}</span>
            <span className="text-[10px]" style={{ color: dk.text }}>{fmtSize(video.size)}</span>
            <div className="ml-auto flex items-center gap-2">
              {pipeline.length > 0 && <span className="text-[10px] font-semibold" style={{ color: dk.accent }}>{pipeline.length} effet{pipeline.length > 1 ? "s" : ""}</span>}
              {pipeline.length > 0 && (
                <button onClick={handleExport} className="rounded-md px-4 py-1.5 text-[11px] font-bold text-black transition-all hover:scale-105" style={{ background: dk.accent }}>
                  Exporter
                </button>
              )}
              <button onClick={resetAll} className="rounded-md px-3 py-1.5 text-[10px] font-semibold transition-all hover:bg-white/5" style={{ color: dk.text, border: `1px solid ${dk.border}` }}>Nouveau</button>
            </div>
          </div>

          {/* ── Main area: Preview + Sidebar ── */}
          <div className="flex" style={{ height: "calc(100vh - 64px - 40px - 220px)" }}>
            {/* Preview */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden" style={{ background: "#000" }}>
              <video ref={videoRef} src={video.url} className="max-h-full max-w-full" crossOrigin="anonymous" onClick={togglePlay} style={{ cursor: "pointer" }} />
              {/* Play overlay */}
              {!playing && <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21" /></svg></div></div>}
            </div>

            {/* Sidebar */}
            <div className="flex w-72 shrink-0 flex-col border-l" style={{ borderColor: dk.border, background: dk.bg2 }}>
              {/* Properties */}
              <div className="flex-1 overflow-y-auto p-4">
                {configTitle ? (
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: dk.textBright }}>{configTitle}</h3>
                      {selEffect && <button onClick={() => removeEffect(selEffect.id)} className="text-[10px] transition-all hover:opacity-100" style={{ color: "#ef4444", opacity: 0.6 }}>Supprimer</button>}
                    </div>
                    <div className="mt-4">{renderConfig()}</div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <p className="text-[11px]" style={{ color: dk.text }}>Selectionnez un calque ou ajoutez-en un</p>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="border-t p-3 space-y-1.5" style={{ borderColor: dk.border }}>
                <div className="flex gap-1.5">
                  <button onClick={() => { setQuickAction("gif"); setSelectedId(null); }} className="flex-1 rounded-md py-2 text-[10px] font-semibold transition-all" style={{ background: quickAction === "gif" ? "#e8963e" : dk.bg3, color: quickAction === "gif" ? "#fff" : dk.text }}>🎞️ GIF</button>
                  <button onClick={() => { setQuickAction("capture"); setSelectedId(null); }} className="flex-1 rounded-md py-2 text-[10px] font-semibold transition-all" style={{ background: quickAction === "capture" ? dk.accent : dk.bg3, color: quickAction === "capture" ? "#000" : dk.text }}>📸 Capture</button>
                </div>
                {/* Export settings */}
                {pipeline.length > 0 && (
                  <div className="space-y-2 rounded-md p-2.5" style={{ background: dk.bg3 }}>
                    <div className="flex gap-1">{(["mp4", "webm"] as const).map((f) => (<button key={f} onClick={() => setExportFmt(f)} className="flex-1 rounded py-1 text-[10px] font-bold transition-all" style={{ background: exportFmt === f ? dk.accent : "transparent", color: exportFmt === f ? "#000" : dk.text }}>{f.toUpperCase()}</button>))}</div>
                    {needsEnc && <div className="flex items-center gap-2"><span className="text-[9px]" style={{ color: dk.text }}>Qualite</span><input type="range" min={18} max={35} value={exportQ} onChange={(e) => setExportQ(+e.target.value)} className="flex-1 accent-[#4ade80]" /><span className="font-mono text-[10px] font-bold" style={{ color: dk.accent }}>{exportQ}</span></div>}
                    <div className="flex items-center gap-2 text-[9px]" style={{ color: dk.text }}>
                      <span>{fmtTime(estDuration)}</span>
                      <span style={{ color: needsEnc ? "#e8963e" : dk.accent }}>{needsEnc ? "Re-encodage" : "Copie directe"}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ══════════ TIMELINE ══════════ */}
          <div style={{ background: dk.bg2, borderTop: `1px solid ${dk.border}` }}>
            {/* Scrubber / Video track */}
            <div ref={timelineRef} className="relative mx-3 mt-2 h-16 cursor-crosshair select-none overflow-hidden rounded-lg" onClick={handleTimelineClick} style={{ background: dk.bg3 }}>
              {/* Tick marks */}
              {video.duration > 0 && Array.from({ length: Math.min(Math.ceil(video.duration * 2), 40) }, (_, i) => {
                const t = (i / Math.min(Math.ceil(video.duration * 2), 40)) * video.duration;
                const isMajor = i % 4 === 0;
                return (
                  <div key={i} className="absolute top-0" style={{ left: `${pctOf(t)}%` }}>
                    <div style={{ width: 1, height: isMajor ? 10 : 5, background: isMajor ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)" }} />
                    {isMajor && <span className="absolute top-2.5 -translate-x-1/2 text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>{fmtTime(t)}</span>}
                  </div>
                );
              })}
              {/* Trim regions */}
              {trimCfg && <>
                <div className="absolute inset-y-0 left-0" style={{ width: `${pctOf(trimCfg.start)}%`, background: "rgba(0,0,0,0.55)", borderRight: `2px solid ${dk.accent}` }} />
                <div className="absolute inset-y-0 right-0" style={{ width: `${100 - pctOf(trimCfg.end)}%`, background: "rgba(0,0,0,0.55)", borderLeft: `2px solid ${dk.accent}` }} />
                <div className="absolute inset-y-0 z-10 w-4 cursor-col-resize" style={{ left: `calc(${pctOf(trimCfg.start)}% - 8px)` }} onMouseDown={(e) => handleTimelineMouseDown(e, "trimL")}><div className="mx-auto mt-1 h-4 w-1 rounded-full" style={{ background: dk.accent }} /></div>
                <div className="absolute inset-y-0 z-10 w-4 cursor-col-resize" style={{ left: `calc(${pctOf(trimCfg.end)}% - 8px)` }} onMouseDown={(e) => handleTimelineMouseDown(e, "trimR")}><div className="mx-auto mt-1 h-4 w-1 rounded-full" style={{ background: dk.accent }} /></div>
                {/* Cut zones (red) */}
                {trimCfg.cuts.map((cut) => (
                  <div key={cut.id} className="absolute inset-y-0 z-5" style={{
                    left: `${pctOf(cut.start)}%`,
                    width: `${pctOf(cut.end) - pctOf(cut.start)}%`,
                    background: "rgba(239,68,68,0.25)",
                    borderLeft: "2px solid #ef4444",
                    borderRight: "2px solid #ef4444",
                  }}>
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[8px] font-bold" style={{ color: "rgba(239,68,68,0.7)" }}>CUT</span>
                    </div>
                  </div>
                ))}
              </>}
              {/* Video track bar */}
              <div className="absolute bottom-0 left-0 right-0 h-7 rounded-b-lg" style={{ background: "linear-gradient(90deg, rgba(74,222,128,0.1), rgba(74,222,128,0.05))" }}>
                <div className="flex h-full items-center px-3"><span className="text-[9px] font-bold" style={{ color: "rgba(74,222,128,0.5)" }}>VIDEO</span></div>
              </div>
              {/* Playhead */}
              <div className="absolute top-0 bottom-0 z-20" style={{ left: `${pctOf(playhead)}%`, transform: "translateX(-50%)" }} onMouseDown={(e) => handleTimelineMouseDown(e, "playhead")}>
                <div style={{ width: 2, height: "100%", background: "#fff", boxShadow: "0 0 8px rgba(255,255,255,0.4)" }} />
                <div className="absolute -top-1 left-1/2 -translate-x-1/2"><div className="h-0 w-0" style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "6px solid #fff" }} /></div>
              </div>
            </div>

            {/* Effect layers */}
            <div className="mx-3 mt-1 space-y-0.5">
              {pipeline.map((e) => (
                <div key={e.id} onClick={() => { setSelectedId(e.id); setQuickAction(null); }} className="relative flex h-8 cursor-pointer items-center rounded-md px-2 transition-all" style={{ background: selectedId === e.id ? `${EFX[e.type].color}20` : dk.bg3, outline: selectedId === e.id ? `1px solid ${EFX[e.type].color}50` : "none" }}>
                  <span className="w-20 shrink-0 text-[10px] font-bold" style={{ color: EFX[e.type].color }}>{EFX[e.type].icon} {EFX[e.type].label}</span>
                  <div className="relative h-4 flex-1 overflow-hidden rounded-sm" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="absolute inset-y-0 rounded-sm transition-all" style={{
                      left: e.type === "trim" ? `${pctOf((e.config as TrimCfg).start)}%` : `${pctOf(trimCfg?.start ?? 0)}%`,
                      width: e.type === "trim" ? `${pctOf((e.config as TrimCfg).end - (e.config as TrimCfg).start)}%` : `${pctOf((trimCfg?.end ?? video.duration) - (trimCfg?.start ?? 0))}%`,
                      background: `${EFX[e.type].color}40`,
                      borderLeft: `2px solid ${EFX[e.type].color}`,
                      borderRight: `2px solid ${EFX[e.type].color}`,
                    }} />
                  </div>
                  <button onClick={(ev) => { ev.stopPropagation(); removeEffect(e.id); }} className="ml-2 shrink-0 rounded px-1 text-[10px] opacity-30 transition-all hover:opacity-100" style={{ color: "#fff" }}>✕</button>
                </div>
              ))}
            </div>

            {/* Add layer + info */}
            <div className="relative mx-3 mt-1 mb-2 flex items-center">
              <button onClick={() => setShowAddMenu(!showAddMenu)} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-semibold transition-all hover:bg-white/5" style={{ color: dk.text, border: `1px dashed ${dk.border}` }}>
                + Calque
              </button>
              {showAddMenu && (
                <div className="absolute bottom-full left-0 z-30 mb-1 overflow-hidden rounded-lg shadow-2xl" style={{ background: dk.bg3, border: `1px solid ${dk.border}`, minWidth: 160 }}>
                  {(["trim", "resize", "speed", "rotate", "mute"] as EffectType[]).map((type) => (
                    <button key={type} disabled={hasType(type)} onClick={() => addEffect(type)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] transition-all hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed" style={{ color: dk.textBright }}>
                      <span>{EFX[type].icon}</span><span className="font-semibold">{EFX[type].label}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="ml-auto flex items-center gap-3 text-[10px]" style={{ color: dk.text }}>
                {pipeline.length > 0 && <span>Duree : <strong style={{ color: dk.textBright }}>{fmtTime(estDuration)}</strong></span>}
                {needsEnc && <span className="rounded-full px-2 py-0.5" style={{ background: "rgba(232,150,62,0.15)", color: "#e8963e" }}>Re-encodage</span>}
                {!needsEnc && pipeline.length > 0 && <span className="rounded-full px-2 py-0.5" style={{ background: "rgba(74,222,128,0.1)", color: dk.accent }}>Copie directe</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PROCESSING ─── */}
      {processing && (
        <div style={{ background: dk.bg, minHeight: "calc(100vh - 64px)" }} className="flex items-center justify-center">
          <div className="w-full max-w-sm rounded-2xl p-8 text-center" style={{ background: dk.bg2 }}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(74,222,128,0.1)" }}>
              <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dk.accent} strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
            </div>
            <p className="mt-4 text-sm font-semibold" style={{ color: dk.textBright }}>{progressMsg || "Traitement..."}</p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full" style={{ background: dk.bg3 }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: dk.accent }} />
            </div>
            <p className="mt-2 font-mono text-xs" style={{ color: dk.accent }}>{progress}%</p>
          </div>
        </div>
      )}

      {/* ─── RESULT ─── */}
      {result && video && (
        <div style={{ background: dk.bg, minHeight: "calc(100vh - 64px)" }} className="flex items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: dk.bg2 }}>
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(74,222,128,0.15)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={dk.accent} strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div><div><p className="text-sm font-semibold" style={{ color: dk.textBright }}>Export termine</p><p className="text-[11px]" style={{ color: dk.text }}>{result.name}</p></div></div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-lg p-2.5 text-center" style={{ background: dk.bg3 }}><p className="text-[9px] uppercase" style={{ color: dk.text }}>Original</p><p className="text-xs font-bold" style={{ color: dk.textBright }}>{fmtSize(video.size)}</p></div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: "rgba(74,222,128,0.08)" }}><p className="text-[9px] uppercase" style={{ color: dk.accent }}>Resultat</p><p className="text-xs font-bold" style={{ color: dk.accent }}>{fmtSize(result.size)}</p></div>
              <div className="rounded-lg p-2.5 text-center" style={{ background: dk.bg3 }}><p className="text-[9px] uppercase" style={{ color: dk.text }}>Diff</p><p className="text-xs font-bold" style={{ color: dk.accent }}>{result.size < video.size ? `-${Math.round((1 - result.size / video.size) * 100)}%` : result.size > video.size ? `+${Math.round((result.size / video.size - 1) * 100)}%` : "="}</p></div>
            </div>
            {result.type.startsWith("image/") && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result.url} alt="Capture" className="mt-4 w-full rounded-lg" />
            )}
            {result.type.startsWith("video/") && <video src={result.url} controls className="mt-4 w-full rounded-lg" style={{ maxHeight: "280px", background: "#000" }} />}
            <a href={result.url} download={result.name} className="mt-4 block w-full rounded-lg py-3 text-center text-sm font-bold text-black" style={{ background: dk.accent }}>Telecharger</a>
            <button onClick={() => { if (result?.url) URL.revokeObjectURL(result.url); setResult(null); setProgress(0); }} className="mt-2 w-full rounded-lg py-2.5 text-sm font-semibold transition-all hover:bg-white/5" style={{ color: dk.text, border: `1px solid ${dk.border}` }}>Continuer l&apos;edition</button>
          </div>
        </div>
      )}
    </>
  );
}
