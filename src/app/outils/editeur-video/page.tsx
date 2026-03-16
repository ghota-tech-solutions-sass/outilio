"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ═══════════════════════════════ TYPES ═══════════════════════════════ */

interface VideoInfo {
  name: string; size: number; type: string; duration: number;
  width: number; height: number; url: string; file: File;
}

type EffectType = "trim" | "resize" | "speed" | "rotate" | "mute";
type QuickAction = "gif" | "capture";

interface TrimConfig { start: number; end: number }
interface ResizeConfig { w: number; h: number; label: string }
interface SpeedConfig { value: number; label: string }
interface RotateConfig { filter: string; label: string }
type MuteConfig = Record<string, never>;

type EffectConfig = TrimConfig | ResizeConfig | SpeedConfig | RotateConfig | MuteConfig;

interface PipelineEffect {
  id: string;
  type: EffectType;
  config: EffectConfig;
}

const EFFECT_META: Record<EffectType, { label: string; icon: string; color: string }> = {
  trim: { label: "Couper", icon: "✂️", color: "#0d4f3c" },
  resize: { label: "Taille", icon: "📐", color: "#6366f1" },
  speed: { label: "Vitesse", icon: "⚡", color: "#e8963e" },
  rotate: { label: "Rotation", icon: "🔄", color: "#ec4899" },
  mute: { label: "Muet", icon: "🔇", color: "#dc2626" },
};

const RESIZE_PRESETS = [
  { w: 1920, h: 1080, label: "1080p" },
  { w: 1280, h: 720, label: "720p" },
  { w: 854, h: 480, label: "480p" },
  { w: 640, h: 360, label: "360p" },
];

const SPEED_PRESETS = [
  { value: 0.25, label: "0.25x" }, { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" }, { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" }, { value: 4, label: "4x" },
];

const ROTATE_PRESETS = [
  { filter: "transpose=1", label: "90° →" },
  { filter: "transpose=2", label: "90° ←" },
  { filter: "transpose=1,transpose=1", label: "180°" },
  { filter: "hflip", label: "Miroir ↔" },
  { filter: "vflip", label: "Miroir ↕" },
];

/* ═══════════════════════════════ UTILS ═══════════════════════════════ */

function uid() { return Math.random().toString(36).slice(2, 8); }
function formatSize(b: number) { return b < 1048576 ? (b / 1024).toFixed(1) + " Ko" : (b / 1048576).toFixed(1) + " Mo"; }
function formatTime(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : `${m}:${String(sec).padStart(2, "0")}`;
}

/* ═══════════════════════ FFmpeg COMMAND BUILDER ═══════════════════════ */

function buildFFmpegArgs(pipeline: PipelineEffect[], format: "mp4" | "webm", quality: number): string[] {
  const args: string[] = [];
  const vFilters: string[] = [];
  let hasAudioFilter = false;
  const aFilters: string[] = [];
  let muted = false;

  // 1. Trim (must come before -i or as -ss/-to)
  const trim = pipeline.find((e) => e.type === "trim") as PipelineEffect | undefined;
  if (trim) {
    const c = trim.config as TrimConfig;
    args.push("-ss", c.start.toFixed(2), "-to", c.end.toFixed(2));
  }

  // 2. Collect video filters
  for (const effect of pipeline) {
    if (effect.type === "resize") {
      const c = effect.config as ResizeConfig;
      vFilters.push(`scale=${c.w}:${c.h}:force_original_aspect_ratio=decrease,pad=${c.w}:${c.h}:(ow-iw)/2:(oh-ih)/2`);
    }
    if (effect.type === "rotate") {
      const c = effect.config as RotateConfig;
      vFilters.push(c.filter);
    }
    if (effect.type === "speed") {
      const c = effect.config as SpeedConfig;
      vFilters.push(`setpts=${(1 / c.value).toFixed(4)}*PTS`);
      hasAudioFilter = true;
      // atempo only supports 0.5-2.0, chain for extremes
      let spd = c.value;
      while (spd > 2) { aFilters.push("atempo=2.0"); spd /= 2; }
      while (spd < 0.5) { aFilters.push("atempo=0.5"); spd /= 0.5; }
      if (spd !== 1) aFilters.push(`atempo=${spd.toFixed(4)}`);
    }
    if (effect.type === "mute") muted = true;
  }

  // 3. Build output args
  // If there are video filters, we must re-encode
  const needsReencode = vFilters.length > 0;

  if (vFilters.length > 0) args.push("-vf", vFilters.join(","));
  if (muted) {
    args.push("-an");
  } else if (aFilters.length > 0) {
    args.push("-af", aFilters.join(","));
  }

  if (needsReencode) {
    if (format === "mp4") {
      args.push("-c:v", "libx264", "-crf", String(quality), "-preset", "fast");
      if (!muted && !hasAudioFilter) args.push("-c:a", "aac");
    } else {
      args.push("-c:v", "libvpx-vp9", "-crf", String(quality), "-b:v", "0");
      if (!muted && !hasAudioFilter) args.push("-c:a", "libvorbis");
    }
  } else {
    // No re-encode needed (trim only, or mute only)
    args.push("-c:v", "copy");
    if (!muted) args.push("-c:a", "copy");
  }

  return args;
}

/* ═══════════════════════════════ MAIN ═══════════════════════════════ */

export default function EditeurVideo() {
  /* ─── Video state ─── */
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ─── Pipeline state ─── */
  const [pipeline, setPipeline] = useState<PipelineEffect[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  /* ─── Export settings ─── */
  const [exportFormat, setExportFormat] = useState<"mp4" | "webm">("mp4");
  const [exportQuality, setExportQuality] = useState(23);

  /* ─── Quick action state ─── */
  const [quickAction, setQuickAction] = useState<QuickAction | null>(null);
  const [gifStart, setGifStart] = useState(0);
  const [gifDuration, setGifDuration] = useState(5);
  const [gifFps, setGifFps] = useState(15);
  const [captureTime, setCaptureTime] = useState(0);

  /* ─── FFmpeg state ─── */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressStep, setProgressStep] = useState(0);
  const [result, setResult] = useState<{ url: string; size: number; name: string; type: string } | null>(null);

  /* ─── Derived ─── */
  const selectedEffect = useMemo(() => pipeline.find((e) => e.id === selectedId), [pipeline, selectedId]);
  const hasTrim = pipeline.some((e) => e.type === "trim");
  const hasType = (t: EffectType) => pipeline.some((e) => e.type === t);

  const estimatedDuration = useMemo(() => {
    if (!video) return 0;
    let dur = video.duration;
    const trim = pipeline.find((e) => e.type === "trim");
    if (trim) { const c = trim.config as TrimConfig; dur = c.end - c.start; }
    const speed = pipeline.find((e) => e.type === "speed");
    if (speed) { dur /= (speed.config as SpeedConfig).value; }
    return dur;
  }, [video, pipeline]);

  const needsReencode = useMemo(() =>
    pipeline.some((e) => e.type === "resize" || e.type === "speed" || e.type === "rotate"),
  [pipeline]);

  /* ─── COI service worker ─── */
  useEffect(() => {
    if (typeof window !== "undefined" && !window.crossOriginIsolated) {
      const script = document.createElement("script");
      script.src = "/coi-serviceworker.js";
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => () => {
    if (video?.url) URL.revokeObjectURL(video.url);
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [video, result]);

  /* ─── FFmpeg ─── */
  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) return true;
    setProgressMsg("Chargement de FFmpeg...");
    try {
      // Load FFmpeg UMD via script tag to bypass Turbopack bundler issues
      await new Promise<void>((resolve, reject) => {
        if ((window as any).FFmpegWASM) { resolve(); return; }
        const s = document.createElement("script");
        s.src = "/ffmpeg/ffmpeg.js";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Echec chargement FFmpeg"));
        document.head.appendChild(s);
      });

      const { FFmpeg } = (window as any).FFmpegWASM;
      const ffmpeg = new FFmpeg();
      ffmpeg.on("log", ({ message }: { message: string }) => console.log("[FFmpeg]", message));
      ffmpeg.on("progress", ({ progress: p }: { progress: number }) => setProgress(Math.min(Math.round(p * 100), 100)));

      // Inline toBlobURL (avoids loading @ffmpeg/util which has UMD global issues)
      const toBlobURL = async (url: string, type: string) => {
        const buf = await (await fetch(url)).arrayBuffer();
        return URL.createObjectURL(new Blob([buf], { type }));
      };
      // Inline fetchFile
      const fetchFileLocal = async (file: File) => new Uint8Array(await file.arrayBuffer());

      setProgressMsg("Telechargement du moteur WASM...");
      const coreBase = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      const coreURL = await toBlobURL(`${coreBase}/ffmpeg-core.js`, "text/javascript");
      const wasmURL = await toBlobURL(`${coreBase}/ffmpeg-core.wasm`, "application/wasm");

      setProgressMsg("Initialisation de FFmpeg...");
      await ffmpeg.load({ coreURL, wasmURL });
      ffmpegRef.current = { ffmpeg, fetchFile: fetchFileLocal };
      return true;
    } catch (e) {
      console.error("FFmpeg load error:", e);
      setError(`Erreur FFmpeg : ${e instanceof Error ? e.message : String(e)}. Verifiez votre connexion et utilisez Chrome, Firefox ou Edge.`);
      return false;
    }
  }, []);

  const execFFmpeg = useCallback(async (args: string[], outFile: string, mime: string, ext: string) => {
    if (!video) return;
    setProcessing(true); setProgress(0); setResult(null); setError("");
    setProgressMsg("Chargement de FFmpeg..."); setProgressStep(1);
    if (!(await loadFFmpeg())) { setProcessing(false); return; }
    const { ffmpeg, fetchFile } = ffmpegRef.current;
    setProgressMsg("Preparation du fichier..."); setProgressStep(2);
    try {
      const inExt = video.name.split(".").pop()?.toLowerCase() || "mp4";
      const inFile = `input.${inExt}`;
      await ffmpeg.writeFile(inFile, await fetchFile(video.file));
      setProgressMsg("Traitement en cours..."); setProgressStep(3);
      const code = await ffmpeg.exec(["-i", inFile, ...args, "-y", outFile]);
      if (code !== 0) { setError("Erreur FFmpeg. Essayez d'autres parametres."); setProcessing(false); return; }
      const data = await ffmpeg.readFile(outFile);
      try { await ffmpeg.deleteFile(inFile); await ffmpeg.deleteFile(outFile); } catch { /**/ }
      const blob = new Blob([data], { type: mime });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, name: video.name.replace(/\.[^.]+$/, `_edit.${ext}`), type: mime });
      setProgress(100); setProgressStep(4);
    } catch (e) { console.error("FFmpeg exec error:", e); setError(`Erreur : ${e instanceof Error ? e.message : String(e)}`); }
    setProcessing(false); setProgressMsg("");
  }, [video, loadFFmpeg]);

  /* ─── Video loading ─── */
  const loadVideo = useCallback(async (file: File) => {
    setError(""); setResult(null); setPipeline([]); setSelectedId(null); setQuickAction(null);
    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|webm|mov|avi|mkv)$/i)) {
      setError("Format video non reconnu."); return;
    }
    if (file.size > 500 * 1024 * 1024) { setError("Fichier trop volumineux (max 500 Mo)."); return; }
    const url = URL.createObjectURL(file);
    const v = document.createElement("video"); v.preload = "metadata"; v.src = url;
    try { await new Promise<void>((res, rej) => { v.onloadedmetadata = () => res(); v.onerror = () => rej(); }); }
    catch { setError("Impossible de lire cette video."); URL.revokeObjectURL(url); return; }
    setVideo({ name: file.name, size: file.size, type: file.type, duration: v.duration, width: v.videoWidth, height: v.videoHeight, url, file });
  }, []);

  /* ─── Pipeline ops ─── */
  const addEffect = (type: EffectType) => {
    if (hasType(type)) return; // one of each type
    let config: EffectConfig;
    if (type === "trim") config = { start: 0, end: video?.duration ?? 10 } as TrimConfig;
    else if (type === "resize") config = RESIZE_PRESETS[1]; // 720p default
    else if (type === "speed") config = SPEED_PRESETS[3]; // 1.5x
    else if (type === "rotate") config = ROTATE_PRESETS[0]; // 90 right
    else config = {} as MuteConfig;
    const id = uid();
    setPipeline((p) => [...p, { id, type, config }]);
    setSelectedId(id);
    setShowAddMenu(false);
  };

  const removeEffect = (id: string) => {
    setPipeline((p) => p.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateConfig = (id: string, config: EffectConfig) => {
    setPipeline((p) => p.map((e) => (e.id === id ? { ...e, config } : e)));
  };

  const moveEffect = (id: string, dir: -1 | 1) => {
    setPipeline((p) => {
      const idx = p.findIndex((e) => e.id === id);
      if (idx < 0) return p;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= p.length) return p;
      const arr = [...p]; [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  /* ─── Export ─── */
  const handleExport = () => {
    if (!video || pipeline.length === 0) return;
    const ext = exportFormat;
    const mime = ext === "mp4" ? "video/mp4" : "video/webm";
    const args = buildFFmpegArgs(pipeline, exportFormat, exportQuality);
    execFFmpeg(args, `output.${ext}`, mime, ext);
  };

  const handleGif = () => {
    if (!video) return;
    const ss = gifStart.toFixed(2), t = gifDuration.toFixed(2);
    execFFmpeg(["-ss", ss, "-t", t, "-vf", `fps=${gifFps},scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`, "-loop", "0"], "output.gif", "image/gif", "gif");
  };

  const handleCapture = () => {
    if (!video) return;
    execFFmpeg(["-ss", captureTime.toFixed(2), "-frames:v", "1", "-q:v", "2"], "output.jpg", "image/jpeg", "jpg");
  };

  const seekTo = useCallback((t: number) => { if (videoRef.current) videoRef.current.currentTime = t; }, []);

  const resetAll = () => {
    if (video?.url) URL.revokeObjectURL(video.url);
    if (result?.url) URL.revokeObjectURL(result.url);
    setVideo(null); setResult(null); setPipeline([]); setSelectedId(null); setError(""); setQuickAction(null);
  };

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */

  return (
    <>
      {/* Header */}
      <section className="relative py-12" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-6xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Video</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Editeur <span style={{ color: "var(--primary)" }}>Video</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Combinez plusieurs effets et exportez en une seule fois. Tout se passe dans votre navigateur.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* ─── DROP ZONE ─── */}
        {!video && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && loadVideo(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            className="animate-fade-up stagger-3 mx-auto max-w-2xl cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-all hover:shadow-lg"
            style={{ borderColor: dragOver ? "var(--primary)" : "var(--border)", background: dragOver ? "rgba(13,79,60,0.04)" : "var(--surface)" }}
          >
            <input ref={inputRef} type="file" accept="video/*,.mp4,.webm,.mov,.avi,.mkv" className="hidden"
              onChange={(e) => e.target.files?.[0] && loadVideo(e.target.files[0])} />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "rgba(13,79,60,0.08)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--primary)" }}>
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <p className="mt-5 text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Deposez votre video ici</p>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>MP4, WebM, MOV, AVI — max 500 Mo</p>
          </div>
        )}

        {error && (
          <div className="mx-auto mt-4 max-w-2xl rounded-xl border p-4 text-sm" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>{error}</div>
        )}

        {/* ─── EDITOR ─── */}
        {video && !processing && !result && (
          <div className="space-y-5">

            {/* Video preview + info */}
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
              <div style={{ background: "#0a0a0a" }}>
                <video ref={videoRef} src={video.url} controls className="mx-auto block" style={{ maxHeight: "380px", width: "100%" }} crossOrigin="anonymous" />
              </div>
              {/* Timeline bar */}
              {hasTrim && (() => {
                const trim = pipeline.find((e) => e.type === "trim");
                const c = trim?.config as TrimConfig;
                const leftPct = (c.start / video.duration) * 100;
                const widthPct = ((c.end - c.start) / video.duration) * 100;
                return (
                  <div className="relative h-8 border-t" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    {/* Full bar */}
                    <div className="absolute inset-0 opacity-30" style={{ background: "repeating-linear-gradient(90deg, var(--border) 0, var(--border) 1px, transparent 1px, transparent 10%)" }} />
                    {/* Selected range */}
                    <div className="absolute top-0 bottom-0 rounded-sm" style={{ left: `${leftPct}%`, width: `${widthPct}%`, background: "rgba(13,79,60,0.15)", borderLeft: "2px solid var(--primary)", borderRight: "2px solid var(--primary)" }}>
                      <div className="flex h-full items-center justify-center text-[9px] font-bold" style={{ color: "var(--primary)" }}>
                        {formatTime(c.end - c.start)}
                      </div>
                    </div>
                    {/* Timestamps */}
                    <span className="absolute bottom-0.5 left-1 text-[9px]" style={{ color: "var(--muted)" }}>0:00</span>
                    <span className="absolute bottom-0.5 right-1 text-[9px]" style={{ color: "var(--muted)" }}>{formatTime(video.duration)}</span>
                  </div>
                );
              })()}
              {/* Info bar + effect badges */}
              <div className="flex flex-wrap items-center gap-3 border-t px-4 py-2.5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <span className="truncate text-xs font-semibold" style={{ maxWidth: 160 }} title={video.name}>{video.name}</span>
                <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
                  <span>{video.width}x{video.height}</span>
                  <span style={{ color: "var(--border)" }}>|</span>
                  <span>{formatTime(video.duration)}</span>
                  <span style={{ color: "var(--border)" }}>|</span>
                  <span>{formatSize(video.size)}</span>
                </div>
                {/* Effect badges */}
                {pipeline.length > 0 && (
                  <div className="ml-auto flex flex-wrap gap-1.5">
                    {pipeline.map((e) => (
                      <span key={e.id} className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: EFFECT_META[e.type].color }}>
                        {EFFECT_META[e.type].icon} {EFFECT_META[e.type].label}
                      </span>
                    ))}
                  </div>
                )}
                <button onClick={resetAll} className="text-[11px] font-semibold hover:opacity-70" style={{ color: "#dc2626" }}>Changer</button>
              </div>
            </div>

            {/* Main editor: Pipeline + Config */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">

              {/* Left: Pipeline list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Effets ({pipeline.length})</h2>
                </div>

                {/* Effect list */}
                <div className="space-y-2">
                  {pipeline.map((effect, idx) => (
                    <div
                      key={effect.id}
                      onClick={() => { setSelectedId(effect.id); setQuickAction(null); }}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all"
                      style={{
                        borderColor: selectedId === effect.id ? EFFECT_META[effect.type].color : "var(--border)",
                        background: selectedId === effect.id ? `${EFFECT_META[effect.type].color}08` : "var(--surface)",
                        boxShadow: selectedId === effect.id ? `0 0 0 1px ${EFFECT_META[effect.type].color}30` : "none",
                      }}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm" style={{ background: `${EFFECT_META[effect.type].color}15` }}>
                        {EFFECT_META[effect.type].icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold">{EFFECT_META[effect.type].label}</p>
                        <p className="truncate text-[10px]" style={{ color: "var(--muted)" }}>
                          {effect.type === "trim" && `${formatTime((effect.config as TrimConfig).start)} → ${formatTime((effect.config as TrimConfig).end)}`}
                          {effect.type === "resize" && (effect.config as ResizeConfig).label}
                          {effect.type === "speed" && (effect.config as SpeedConfig).label}
                          {effect.type === "rotate" && (effect.config as RotateConfig).label}
                          {effect.type === "mute" && "Audio supprime"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5">
                        {idx > 0 && <button onClick={(ev) => { ev.stopPropagation(); moveEffect(effect.id, -1); }} className="rounded p-1 hover:bg-black/5" title="Monter"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg></button>}
                        {idx < pipeline.length - 1 && <button onClick={(ev) => { ev.stopPropagation(); moveEffect(effect.id, 1); }} className="rounded p-1 hover:bg-black/5" title="Descendre"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg></button>}
                        <button onClick={(ev) => { ev.stopPropagation(); removeEffect(effect.id); }} className="rounded p-1 hover:bg-red-50" style={{ color: "#dc2626" }} title="Supprimer"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add effect button */}
                <div className="relative">
                  <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3 text-xs font-semibold transition-all hover:border-[var(--primary)] hover:bg-[rgba(13,79,60,0.02)]"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
                    Ajouter un effet
                  </button>
                  {showAddMenu && (
                    <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border shadow-lg" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      {(["trim", "resize", "speed", "rotate", "mute"] as EffectType[]).map((type) => (
                        <button
                          key={type}
                          disabled={hasType(type)}
                          onClick={() => addEffect(type)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-xs transition-all hover:bg-[var(--surface-alt)] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <span>{EFFECT_META[type].icon}</span>
                          <span className="font-semibold">{EFFECT_META[type].label}</span>
                          {hasType(type) && <span className="ml-auto text-[10px]" style={{ color: "var(--muted)" }}>Deja ajoute</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Actions rapides</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button onClick={() => { setQuickAction("gif"); setSelectedId(null); }}
                      className="rounded-lg border p-2.5 text-center text-xs font-semibold transition-all hover:border-[var(--accent)]"
                      style={{ borderColor: quickAction === "gif" ? "var(--accent)" : "var(--border)", background: quickAction === "gif" ? "rgba(232,150,62,0.06)" : "transparent" }}>
                      🎞️ Extraire GIF
                    </button>
                    <button onClick={() => { setQuickAction("capture"); setSelectedId(null); }}
                      className="rounded-lg border p-2.5 text-center text-xs font-semibold transition-all hover:border-[var(--primary)]"
                      style={{ borderColor: quickAction === "capture" ? "var(--primary)" : "var(--border)", background: quickAction === "capture" ? "rgba(13,79,60,0.04)" : "transparent" }}>
                      📸 Capturer image
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Config panel */}
              <div className="rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <div className="p-5">
                  {/* Empty state */}
                  {!selectedEffect && !quickAction && (
                    <div className="py-12 text-center">
                      <p className="text-3xl">🎬</p>
                      <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                        {pipeline.length === 0 ? "Ajoutez des effets pour commencer" : "Selectionnez un effet a configurer"}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                        Combinez coupe, taille, vitesse, rotation et plus. Exportez en un clic.
                      </p>
                    </div>
                  )}

                  {/* ─── TRIM CONFIG ─── */}
                  {selectedEffect?.type === "trim" && (() => {
                    const c = selectedEffect.config as TrimConfig;
                    return (
                      <div className="space-y-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: EFFECT_META.trim.color }}>✂️ Configuration de la coupe</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs" style={{ color: "var(--muted)" }}>Debut</label>
                            <input type="range" min={0} max={video!.duration} step={0.1} value={c.start}
                              onChange={(e) => { const v = Math.min(parseFloat(e.target.value), c.end - 0.5); updateConfig(selectedEffect.id, { ...c, start: v }); seekTo(v); }}
                              className="mt-1 w-full accent-[#0d4f3c]" />
                            <p className="mt-1 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{formatTime(c.start)}</p>
                          </div>
                          <div>
                            <label className="text-xs" style={{ color: "var(--muted)" }}>Fin</label>
                            <input type="range" min={0} max={video!.duration} step={0.1} value={c.end}
                              onChange={(e) => { const v = Math.max(parseFloat(e.target.value), c.start + 0.5); updateConfig(selectedEffect.id, { ...c, end: v }); seekTo(v); }}
                              className="mt-1 w-full accent-[#0d4f3c]" />
                            <p className="mt-1 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{formatTime(c.end)}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 rounded-xl py-2" style={{ background: "rgba(13,79,60,0.04)" }}>
                          <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>Duree : {formatTime(c.end - c.start)}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ─── RESIZE CONFIG ─── */}
                  {selectedEffect?.type === "resize" && (() => {
                    const c = selectedEffect.config as ResizeConfig;
                    return (
                      <div className="space-y-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: EFFECT_META.resize.color }}>📐 Resolution cible</h3>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {RESIZE_PRESETS.map((p) => (
                            <button key={p.label} onClick={() => updateConfig(selectedEffect.id, p)}
                              className="rounded-xl border p-3 text-center transition-all"
                              style={{ borderColor: c.label === p.label ? EFFECT_META.resize.color : "var(--border)", background: c.label === p.label ? `${EFFECT_META.resize.color}08` : "transparent" }}>
                              <p className="text-sm font-bold">{p.label}</p>
                              <p className="text-[10px]" style={{ color: "var(--muted)" }}>{p.w}x{p.h}</p>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>{video!.width}x{video!.height} → <strong style={{ color: "var(--foreground)" }}>{c.w}x{c.h}</strong></p>
                      </div>
                    );
                  })()}

                  {/* ─── SPEED CONFIG ─── */}
                  {selectedEffect?.type === "speed" && (() => {
                    const c = selectedEffect.config as SpeedConfig;
                    return (
                      <div className="space-y-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: EFFECT_META.speed.color }}>⚡ Vitesse de lecture</h3>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                          {SPEED_PRESETS.map((p) => (
                            <button key={p.label} onClick={() => updateConfig(selectedEffect.id, p)}
                              className="rounded-xl border p-3 text-center transition-all"
                              style={{ borderColor: c.label === p.label ? EFFECT_META.speed.color : "var(--border)", background: c.label === p.label ? `${EFFECT_META.speed.color}08` : "transparent" }}>
                              <p className="text-sm font-bold">{p.label}</p>
                            </button>
                          ))}
                        </div>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>Duree estimee : <strong style={{ color: "var(--foreground)" }}>{formatTime(estimatedDuration)}</strong></p>
                      </div>
                    );
                  })()}

                  {/* ─── ROTATE CONFIG ─── */}
                  {selectedEffect?.type === "rotate" && (() => {
                    const c = selectedEffect.config as RotateConfig;
                    return (
                      <div className="space-y-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: EFFECT_META.rotate.color }}>🔄 Transformation</h3>
                        <div className="grid grid-cols-5 gap-2">
                          {ROTATE_PRESETS.map((p) => (
                            <button key={p.label} onClick={() => updateConfig(selectedEffect.id, p)}
                              className="rounded-xl border p-3 text-center transition-all"
                              style={{ borderColor: c.label === p.label ? EFFECT_META.rotate.color : "var(--border)", background: c.label === p.label ? `${EFFECT_META.rotate.color}08` : "transparent" }}>
                              <p className="text-xs font-semibold">{p.label}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  {/* ─── MUTE CONFIG ─── */}
                  {selectedEffect?.type === "mute" && (
                    <div className="flex items-center gap-4 rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                      <span className="text-3xl">🔇</span>
                      <div>
                        <p className="text-sm font-semibold">Audio supprime</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>La piste audio sera entierement retiree de la video exportee.</p>
                      </div>
                    </div>
                  )}

                  {/* ─── GIF QUICK ACTION ─── */}
                  {quickAction === "gif" && (
                    <div className="space-y-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>🎞️ Extraire un GIF</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs" style={{ color: "var(--muted)" }}>Debut</label>
                          <input type="range" min={0} max={video!.duration} step={0.1} value={gifStart}
                            onChange={(e) => { setGifStart(parseFloat(e.target.value)); seekTo(parseFloat(e.target.value)); }}
                            className="mt-1 w-full accent-[#e8963e]" />
                          <p className="mt-1 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{formatTime(gifStart)}</p>
                        </div>
                        <div>
                          <label className="text-xs" style={{ color: "var(--muted)" }}>Duree (max 10s)</label>
                          <input type="range" min={1} max={Math.min(10, video!.duration - gifStart)} step={0.5} value={gifDuration}
                            onChange={(e) => setGifDuration(parseFloat(e.target.value))}
                            className="mt-1 w-full accent-[#e8963e]" />
                          <p className="mt-1 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{gifDuration}s</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs" style={{ color: "var(--muted)" }}>FPS</label>
                        <div className="mt-2 flex gap-2">
                          {[10, 15, 20, 25].map((f) => (
                            <button key={f} onClick={() => setGifFps(f)} className="flex-1 rounded-lg border py-2 text-xs font-semibold transition-all"
                              style={{ borderColor: gifFps === f ? "var(--accent)" : "var(--border)", color: gifFps === f ? "var(--accent)" : "var(--muted)" }}>
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button onClick={handleGif} className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--accent) 0%, #d4822e 100%)" }}>
                        Extraire le GIF
                      </button>
                    </div>
                  )}

                  {/* ─── CAPTURE QUICK ACTION ─── */}
                  {quickAction === "capture" && (
                    <div className="space-y-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--primary)" }}>📸 Capturer une image</h3>
                      <div>
                        <input type="range" min={0} max={video!.duration} step={0.1} value={captureTime}
                          onChange={(e) => { setCaptureTime(parseFloat(e.target.value)); seekTo(parseFloat(e.target.value)); }}
                          className="w-full accent-[#0d4f3c]" />
                        <p className="mt-2 text-center text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{formatTime(captureTime)}</p>
                      </div>
                      <button onClick={handleCapture} className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                        Capturer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Export bar */}
            {pipeline.length > 0 && (
              <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--primary)", background: "rgba(13,79,60,0.02)" }}>
                <div className="flex flex-wrap items-center gap-4 p-5">
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                      {pipeline.length} effet{pipeline.length > 1 ? "s" : ""} — Duree estimee : {formatTime(estimatedDuration)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {pipeline.map((e) => (
                        <span key={e.id} className="text-[10px]" style={{ color: "var(--muted)" }}>
                          {EFFECT_META[e.type].icon} {EFFECT_META[e.type].label}
                        </span>
                      ))}
                      {needsReencode && <span className="text-[10px]" style={{ color: "var(--accent)" }}>• Re-encodage</span>}
                      {!needsReencode && <span className="text-[10px]" style={{ color: "var(--primary)" }}>• Copie directe (rapide)</span>}
                    </div>
                  </div>
                  {/* Format + quality */}
                  <div className="flex items-center gap-2">
                    <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as "mp4" | "webm")}
                      className="rounded-lg border px-3 py-2 text-xs font-semibold" style={{ borderColor: "var(--border)" }}>
                      <option value="mp4">MP4</option>
                      <option value="webm">WebM</option>
                    </select>
                    {needsReencode && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: "var(--muted)" }}>CRF</span>
                        <input type="range" min={18} max={35} value={exportQuality} onChange={(e) => setExportQuality(parseInt(e.target.value))}
                          className="w-20 accent-[#0d4f3c]" />
                        <span className="w-5 text-xs font-bold" style={{ color: "var(--primary)" }}>{exportQuality}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={handleExport}
                    className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                    Exporter la video
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── PROCESSING ─── */}
        {processing && (
          <div className="mx-auto max-w-lg rounded-2xl border p-8" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(13,79,60,0.08)" }}>
                <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <p className="mt-4 text-sm font-semibold">{progressMsg || "Traitement..."}</p>
              {/* Step indicators */}
              <div className="mt-4 flex items-center justify-center gap-1">
                {["FFmpeg", "Fichier", "Traitement", "Resultat"].map((s, i) => (
                  <div key={s} className="flex items-center gap-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ background: progressStep > i ? "var(--primary)" : "var(--border)" }}>
                      {progressStep > i ? "✓" : i + 1}
                    </div>
                    {i < 3 && <div className="h-px w-6" style={{ background: progressStep > i + 1 ? "var(--primary)" : "var(--border)" }} />}
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)" }} />
              </div>
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{progress}% — Ne fermez pas cet onglet</p>
            </div>
          </div>
        )}

        {/* ─── RESULT ─── */}
        {result && video && (
          <div className="mx-auto max-w-lg space-y-5">
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(22,163,74,0.1)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">Export termine</p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>{result.name}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--muted)" }}>Original</p>
                  <p className="mt-1 text-sm font-bold">{formatSize(video.size)}</p>
                </div>
                <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgba(22,163,74,0.3)", background: "rgba(22,163,74,0.04)" }}>
                  <p className="text-[10px] font-semibold uppercase" style={{ color: "#16a34a" }}>Resultat</p>
                  <p className="mt-1 text-sm font-bold" style={{ color: "#16a34a" }}>{formatSize(result.size)}</p>
                </div>
                <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--muted)" }}>Diff</p>
                  <p className="mt-1 text-sm font-bold" style={{ color: "var(--primary)" }}>
                    {result.size < video.size ? `-${Math.round((1 - result.size / video.size) * 100)}%` : result.size > video.size ? `+${Math.round((result.size / video.size - 1) * 100)}%` : "="}
                  </p>
                </div>
              </div>

              {result.type.startsWith("image/") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="Capture" className="mt-4 w-full rounded-xl" />
              )}
              {result.type.startsWith("video/") && (
                <video src={result.url} controls className="mt-4 w-full rounded-xl" style={{ maxHeight: "300px", background: "#0a0a0a" }} />
              )}

              <a href={result.url} download={result.name}
                className="mt-4 block w-full rounded-xl py-3.5 text-center text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "var(--primary)" }}>
                Telecharger
              </a>
              <button onClick={() => { if (result?.url) URL.revokeObjectURL(result.url); setResult(null); setProgress(0); }}
                className="mt-2 w-full rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                style={{ borderColor: "var(--border)" }}>
                Continuer l&apos;edition
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
