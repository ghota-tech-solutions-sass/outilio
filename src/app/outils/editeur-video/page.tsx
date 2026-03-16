"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ═══════════════════════════ TYPES ═══════════════════════════ */

interface VideoInfo { name: string; size: number; type: string; duration: number; width: number; height: number; url: string; file: File }

type EffectType = "trim" | "resize" | "speed" | "rotate" | "mute";
type QuickAction = "gif" | "capture";

interface TrimCfg { start: number; end: number }
interface ResizeCfg { w: number; h: number; label: string }
interface SpeedCfg { value: number; label: string }
interface RotateCfg { filter: string; label: string }
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface MuteCfg {}

type EffectCfg = TrimCfg | ResizeCfg | SpeedCfg | RotateCfg | MuteCfg;

interface PipelineEffect { id: string; type: EffectType; config: EffectCfg }

/* ═══════════════════════════ PRESETS ═══════════════════════════ */

const EFX: Record<EffectType, { label: string; icon: string; color: string }> = {
  trim:   { label: "Couper",   icon: "✂️",  color: "#0d4f3c" },
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

function buildArgs(pipeline: PipelineEffect[], fmt: "mp4" | "webm", quality: number): string[] {
  const args: string[] = [], vf: string[] = [], af: string[] = [];
  let muted = false;

  const trim = pipeline.find((e) => e.type === "trim");
  if (trim) { const c = trim.config as TrimCfg; args.push("-ss", c.start.toFixed(2), "-to", c.end.toFixed(2)); }

  for (const e of pipeline) {
    if (e.type === "resize") { const c = e.config as ResizeCfg; vf.push(`scale=${c.w}:${c.h}:force_original_aspect_ratio=decrease,pad=${c.w}:${c.h}:(ow-iw)/2:(oh-ih)/2`); }
    if (e.type === "rotate") { vf.push((e.config as RotateCfg).filter); }
    if (e.type === "speed") {
      const s = (e.config as SpeedCfg).value;
      vf.push(`setpts=${(1 / s).toFixed(4)}*PTS`);
      let r = s;
      while (r > 2) { af.push("atempo=2.0"); r /= 2; }
      while (r < 0.5) { af.push("atempo=0.5"); r /= 0.5; }
      if (Math.abs(r - 1) > 0.001) af.push(`atempo=${r.toFixed(4)}`);
    }
    if (e.type === "mute") muted = true;
  }

  const needsEnc = vf.length > 0;
  if (vf.length) args.push("-vf", vf.join(","));
  if (muted) args.push("-an");
  else if (af.length) args.push("-af", af.join(","));

  if (needsEnc) {
    if (fmt === "mp4") { args.push("-c:v", "libx264", "-crf", String(quality), "-preset", "fast"); if (!muted && !af.length) args.push("-c:a", "aac"); }
    else { args.push("-c:v", "libvpx-vp9", "-crf", String(quality), "-b:v", "0"); if (!muted && !af.length) args.push("-c:a", "libvorbis"); }
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
  const needsEnc = useMemo(() => pipeline.some((e) => ["resize", "speed", "rotate"].includes(e.type)), [pipeline]);
  const estDuration = useMemo(() => {
    if (!video) return 0;
    let d = trimCfg ? trimCfg.end - trimCfg.start : video.duration;
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
    if (type === "trim") config = { start: 0, end: video?.duration ?? 10 } as TrimCfg;
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
    const args = buildArgs(pipeline, exportFmt, exportQ);
    execFFmpeg(args, `output.${exportFmt}`, exportFmt === "mp4" ? "video/mp4" : "video/webm", exportFmt);
  };
  const handleGif = () => { if (!video) return; execFFmpeg(["-ss", gifStart.toFixed(2), "-t", gifDur.toFixed(2), "-vf", `fps=${gifFps},scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`, "-loop", "0"], "output.gif", "image/gif", "gif"); };
  const handleCapture = () => { if (!video) return; execFFmpeg(["-ss", capTime.toFixed(2), "-frames:v", "1", "-q:v", "2"], "output.jpg", "image/jpeg", "jpg"); };
  const resetAll = () => { if (video?.url) URL.revokeObjectURL(video.url); if (result?.url) URL.revokeObjectURL(result.url); setVideo(null); setResult(null); setPipeline([]); setSelectedId(null); setError(""); setQuickAction(null); };

  const pctOf = (t: number) => video ? (t / video.duration) * 100 : 0;

  /* ═══════════════════════════ RENDER ═══════════════════════════ */

  return (
    <>
      {/* Header - compact */}
      <section className="py-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Editeur <span style={{ color: "var(--primary)" }}>Video</span>
              </h1>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Combinez plusieurs effets, previsualiser sur la timeline, exportez en un clic.</p>
            </div>
            {video && (
              <div className="flex items-center gap-2">
                <span className="hidden text-xs sm:block" style={{ color: "var(--muted)" }}>{video.name} &middot; {video.width}x{video.height} &middot; {fmtTime(video.duration)}</span>
                <button onClick={resetAll} className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:bg-red-50" style={{ borderColor: "var(--border)", color: "#dc2626" }}>Nouveau</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* ─── DROP ZONE ─── */}
        {!video && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && loadVideo(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            className="mx-auto max-w-xl cursor-pointer rounded-2xl border-2 border-dashed p-14 text-center transition-all hover:shadow-lg"
            style={{ borderColor: dragOver ? "var(--primary)" : "var(--border)", background: dragOver ? "rgba(13,79,60,0.04)" : "var(--surface)" }}
          >
            <input ref={inputRef} type="file" accept="video/*,.mp4,.webm,.mov,.avi,.mkv" className="hidden" onChange={(e) => e.target.files?.[0] && loadVideo(e.target.files[0])} />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(13,79,60,0.08)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--primary)" }}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
            </div>
            <p className="mt-4 text-base tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Deposez votre video ici</p>
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>MP4, WebM, MOV — max 500 Mo</p>
          </div>
        )}

        {error && <div className="mx-auto mt-4 max-w-xl rounded-xl border p-3 text-sm" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>{error}</div>}

        {/* ─── EDITOR ─── */}
        {video && !processing && !result && (
          <div className="space-y-4">
            {/* ── Video Preview ── */}
            <div className="overflow-hidden rounded-xl" style={{ background: "#0a0a0a" }}>
              <video ref={videoRef} src={video.url} className="mx-auto block" style={{ maxHeight: "340px", width: "100%" }} crossOrigin="anonymous" onClick={togglePlay} />
            </div>

            {/* ── Transport bar ── */}
            <div className="flex items-center gap-3 rounded-xl border px-4 py-2" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <button onClick={togglePlay} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110" style={{ background: "var(--primary)" }}>
                {playing ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                )}
              </button>
              <span className="w-24 text-center font-mono text-xs font-bold" style={{ color: "var(--primary)" }}>{fmtTimeFine(playhead)}</span>
              <span className="text-xs" style={{ color: "var(--muted)" }}>/ {fmtTime(video.duration)}</span>
              <div className="ml-auto flex gap-1.5">
                {pipeline.map((e) => (
                  <span key={e.id} className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white" style={{ background: EFX[e.type].color }}>{EFX[e.type].icon}</span>
                ))}
              </div>
            </div>

            {/* ══════════ TIMELINE ══════════ */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)", background: "#1a1a1a" }}>

              {/* Video track + playhead */}
              <div ref={timelineRef} className="relative h-14 cursor-crosshair select-none" onClick={handleTimelineClick} style={{ background: "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)" }}>
                {/* Time markers */}
                {video.duration > 0 && Array.from({ length: Math.min(Math.ceil(video.duration), 20) }, (_, i) => {
                  const t = (i / Math.min(Math.ceil(video.duration), 20)) * video.duration;
                  return <div key={i} className="absolute top-0 h-2 border-l" style={{ left: `${pctOf(t)}%`, borderColor: "rgba(255,255,255,0.1)" }} />;
                })}

                {/* Trim overlay */}
                {trimCfg && (
                  <>
                    {/* Dimmed outside trim */}
                    <div className="absolute inset-y-0 left-0" style={{ width: `${pctOf(trimCfg.start)}%`, background: "rgba(0,0,0,0.6)" }} />
                    <div className="absolute inset-y-0 right-0" style={{ width: `${100 - pctOf(trimCfg.end)}%`, background: "rgba(0,0,0,0.6)" }} />
                    {/* Trim range */}
                    <div className="absolute inset-y-0" style={{ left: `${pctOf(trimCfg.start)}%`, width: `${pctOf(trimCfg.end) - pctOf(trimCfg.start)}%`, borderTop: "2px solid var(--primary)", borderBottom: "2px solid var(--primary)" }} />
                    {/* Left handle */}
                    <div className="absolute inset-y-0 z-10 w-3 cursor-col-resize" style={{ left: `calc(${pctOf(trimCfg.start)}% - 6px)` }} onMouseDown={(e) => handleTimelineMouseDown(e, "trimL")}>
                      <div className="absolute inset-y-1 left-1 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
                    </div>
                    {/* Right handle */}
                    <div className="absolute inset-y-0 z-10 w-3 cursor-col-resize" style={{ left: `calc(${pctOf(trimCfg.end)}% - 6px)` }} onMouseDown={(e) => handleTimelineMouseDown(e, "trimR")}>
                      <div className="absolute inset-y-1 left-1 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
                    </div>
                  </>
                )}

                {/* Active region glow */}
                <div className="absolute inset-y-0" style={{ left: `${pctOf(trimCfg?.start ?? 0)}%`, width: `${pctOf((trimCfg?.end ?? video.duration) - (trimCfg?.start ?? 0))}%`, background: "linear-gradient(90deg, rgba(13,79,60,0.08), rgba(13,79,60,0.15), rgba(13,79,60,0.08))" }} />

                {/* Playhead */}
                <div className="absolute top-0 bottom-0 z-20 w-0.5 -translate-x-1/2" style={{ left: `${pctOf(playhead)}%`, background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,0.5)" }} onMouseDown={(e) => handleTimelineMouseDown(e, "playhead")}>
                  <div className="absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-white" />
                </div>
              </div>

              {/* Effect layers */}
              <div className="space-y-px" style={{ background: "#111" }}>
                {pipeline.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => { setSelectedId(e.id); setQuickAction(null); }}
                    className="relative flex h-7 cursor-pointer items-center gap-2 px-3 transition-all"
                    style={{ background: selectedId === e.id ? `${EFX[e.type].color}25` : "#1a1a1a" }}
                  >
                    <span className="w-16 shrink-0 text-[10px] font-bold" style={{ color: EFX[e.type].color }}>{EFX[e.type].icon} {EFX[e.type].label}</span>
                    {/* Effect bar */}
                    <div className="relative h-3 flex-1 overflow-hidden rounded-sm" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="absolute inset-y-0 rounded-sm" style={{
                        left: e.type === "trim" ? `${pctOf((e.config as TrimCfg).start)}%` : `${pctOf(trimCfg?.start ?? 0)}%`,
                        width: e.type === "trim" ? `${pctOf((e.config as TrimCfg).end - (e.config as TrimCfg).start)}%` : `${pctOf((trimCfg?.end ?? video.duration) - (trimCfg?.start ?? 0))}%`,
                        background: `${EFX[e.type].color}60`,
                        borderLeft: `2px solid ${EFX[e.type].color}`,
                        borderRight: `2px solid ${EFX[e.type].color}`,
                      }} />
                    </div>
                    <button onClick={(ev) => { ev.stopPropagation(); removeEffect(e.id); }} className="shrink-0 text-xs opacity-40 hover:opacity-100" style={{ color: "#fff" }}>✕</button>
                  </div>
                ))}

                {/* Add layer button */}
                <div className="relative">
                  <button onClick={() => setShowAddMenu(!showAddMenu)} className="flex h-7 w-full items-center justify-center gap-1.5 text-[10px] font-semibold transition-all hover:bg-white/5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <span>+</span> Ajouter un calque
                  </button>
                  {showAddMenu && (
                    <div className="absolute bottom-full left-0 right-0 z-30 overflow-hidden rounded-t-lg border shadow-xl" style={{ background: "#1e1e1e", borderColor: "#333" }}>
                      {(["trim", "resize", "speed", "rotate", "mute"] as EffectType[]).map((type) => (
                        <button key={type} disabled={hasType(type)} onClick={() => addEffect(type)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-xs text-white transition-all hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed">
                          <span>{EFX[type].icon}</span>
                          <span className="font-semibold">{EFX[type].label}</span>
                          {hasType(type) && <span className="ml-auto text-[9px] opacity-50">Ajoute</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Time ruler */}
              <div className="flex items-center justify-between px-3 py-1" style={{ background: "#111" }}>
                <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>0:00</span>
                <div className="flex gap-3 text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {pipeline.length > 0 && <span>Duree: <strong style={{ color: "rgba(255,255,255,0.6)" }}>{fmtTime(estDuration)}</strong></span>}
                  {needsEnc && <span style={{ color: "#e8963e" }}>Re-encodage</span>}
                  {!needsEnc && pipeline.length > 0 && <span style={{ color: "#22c55e" }}>Copie directe</span>}
                </div>
                <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{fmtTime(video.duration)}</span>
              </div>
            </div>

            {/* ── Properties panel + Quick actions ── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
              {/* Properties */}
              <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                {!selEffect && !quickAction && (
                  <div className="py-8 text-center">
                    <p className="text-2xl">🎬</p>
                    <p className="mt-2 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>{pipeline.length === 0 ? "Ajoutez un calque sur la timeline" : "Selectionnez un calque"}</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Cliquez sur un calque pour le configurer, ou ajoutez-en un nouveau.</p>
                  </div>
                )}

                {/* TRIM */}
                {selEffect?.type === "trim" && (() => { const c = selEffect.config as TrimCfg; return (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: EFX.trim.color }}>✂️ Coupe</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[10px] uppercase" style={{ color: "var(--muted)" }}>Debut</label><input type="range" min={0} max={video.duration} step={0.1} value={c.start} onChange={(e) => { const v = Math.min(+e.target.value, c.end - 0.5); updateCfg(selEffect.id, { ...c, start: v }); if (videoRef.current) videoRef.current.currentTime = v; }} className="mt-1 w-full accent-[#0d4f3c]" /><p className="text-center text-xs font-bold">{fmtTimeFine(c.start)}</p></div>
                      <div><label className="text-[10px] uppercase" style={{ color: "var(--muted)" }}>Fin</label><input type="range" min={0} max={video.duration} step={0.1} value={c.end} onChange={(e) => { const v = Math.max(+e.target.value, c.start + 0.5); updateCfg(selEffect.id, { ...c, end: v }); if (videoRef.current) videoRef.current.currentTime = v; }} className="mt-1 w-full accent-[#0d4f3c]" /><p className="text-center text-xs font-bold">{fmtTimeFine(c.end)}</p></div>
                    </div>
                    <p className="text-center text-xs" style={{ color: "var(--primary)" }}>Duree : {fmtTime(c.end - c.start)} — Glissez les poignees sur la timeline</p>
                  </div>
                ); })()}

                {/* RESIZE */}
                {selEffect?.type === "resize" && (() => { const c = selEffect.config as ResizeCfg; return (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: EFX.resize.color }}>📐 Taille</h3>
                    <div className="grid grid-cols-4 gap-2">{RESIZE_P.map((p) => (<button key={p.label} onClick={() => updateCfg(selEffect.id, p)} className="rounded-lg border p-2 text-center text-xs font-bold transition-all" style={{ borderColor: c.label === p.label ? EFX.resize.color : "var(--border)", background: c.label === p.label ? `${EFX.resize.color}10` : "transparent" }}>{p.label}</button>))}</div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{video.width}x{video.height} → <strong>{c.w}x{c.h}</strong></p>
                  </div>
                ); })()}

                {/* SPEED */}
                {selEffect?.type === "speed" && (() => { const c = selEffect.config as SpeedCfg; return (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: EFX.speed.color }}>⚡ Vitesse</h3>
                    <div className="grid grid-cols-6 gap-2">{SPEED_P.map((p) => (<button key={p.label} onClick={() => updateCfg(selEffect.id, p)} className="rounded-lg border p-2 text-center text-xs font-bold transition-all" style={{ borderColor: c.label === p.label ? EFX.speed.color : "var(--border)", background: c.label === p.label ? `${EFX.speed.color}10` : "transparent" }}>{p.label}</button>))}</div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>Duree estimee : <strong>{fmtTime(estDuration)}</strong></p>
                  </div>
                ); })()}

                {/* ROTATE */}
                {selEffect?.type === "rotate" && (() => { const c = selEffect.config as RotateCfg; return (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: EFX.rotate.color }}>🔄 Rotation</h3>
                    <div className="grid grid-cols-5 gap-2">{ROTATE_P.map((p) => (<button key={p.label} onClick={() => updateCfg(selEffect.id, p)} className="rounded-lg border p-2 text-center text-[10px] font-bold transition-all" style={{ borderColor: c.label === p.label ? EFX.rotate.color : "var(--border)", background: c.label === p.label ? `${EFX.rotate.color}10` : "transparent" }}>{p.label}</button>))}</div>
                  </div>
                ); })()}

                {/* MUTE */}
                {selEffect?.type === "mute" && (
                  <div className="flex items-center gap-3 rounded-lg p-4" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-2xl">🔇</span>
                    <div><p className="text-sm font-semibold">Audio supprime</p><p className="text-xs" style={{ color: "var(--muted)" }}>Pas de re-encodage, quasi instantane.</p></div>
                  </div>
                )}

                {/* GIF */}
                {quickAction === "gif" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>🎞️ Extraire GIF</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[10px] uppercase" style={{ color: "var(--muted)" }}>Debut</label><input type="range" min={0} max={video.duration} step={0.1} value={gifStart} onChange={(e) => { setGifStart(+e.target.value); if (videoRef.current) videoRef.current.currentTime = +e.target.value; }} className="mt-1 w-full accent-[#e8963e]" /><p className="text-center text-xs font-bold">{fmtTime(gifStart)}</p></div>
                      <div><label className="text-[10px] uppercase" style={{ color: "var(--muted)" }}>Duree</label><input type="range" min={1} max={Math.min(10, video.duration - gifStart)} step={0.5} value={gifDur} onChange={(e) => setGifDur(+e.target.value)} className="mt-1 w-full accent-[#e8963e]" /><p className="text-center text-xs font-bold">{gifDur}s</p></div>
                    </div>
                    <div className="flex gap-2">{[10, 15, 20].map((f) => (<button key={f} onClick={() => setGifFps(f)} className="flex-1 rounded-lg border py-1.5 text-xs font-bold" style={{ borderColor: gifFps === f ? "var(--accent)" : "var(--border)", color: gifFps === f ? "var(--accent)" : "var(--muted)" }}>{f} fps</button>))}</div>
                    <button onClick={handleGif} className="w-full rounded-lg py-3 text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>Extraire</button>
                  </div>
                )}

                {/* CAPTURE */}
                {quickAction === "capture" && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>📸 Capturer image</h3>
                    <input type="range" min={0} max={video.duration} step={0.1} value={capTime} onChange={(e) => { setCapTime(+e.target.value); if (videoRef.current) videoRef.current.currentTime = +e.target.value; }} className="w-full accent-[#0d4f3c]" />
                    <p className="text-center text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmtTimeFine(capTime)}</p>
                    <button onClick={handleCapture} className="w-full rounded-lg py-3 text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>Capturer</button>
                  </div>
                )}
              </div>

              {/* Quick actions sidebar */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Actions rapides</p>
                <button onClick={() => { setQuickAction("gif"); setSelectedId(null); }} className="flex w-full items-center gap-2 rounded-lg border p-3 text-xs font-semibold transition-all hover:bg-[var(--surface-alt)]" style={{ borderColor: quickAction === "gif" ? "var(--accent)" : "var(--border)", background: quickAction === "gif" ? "rgba(232,150,62,0.04)" : "var(--surface)" }}>🎞️ Extraire GIF</button>
                <button onClick={() => { setQuickAction("capture"); setSelectedId(null); }} className="flex w-full items-center gap-2 rounded-lg border p-3 text-xs font-semibold transition-all hover:bg-[var(--surface-alt)]" style={{ borderColor: quickAction === "capture" ? "var(--primary)" : "var(--border)", background: quickAction === "capture" ? "rgba(13,79,60,0.04)" : "var(--surface)" }}>📸 Capturer image</button>

                {/* Export settings */}
                {pipeline.length > 0 && (
                  <div className="space-y-3 rounded-lg border p-4" style={{ borderColor: "var(--primary)", background: "rgba(13,79,60,0.02)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>Export</p>
                    <div className="flex gap-2">
                      {(["mp4", "webm"] as const).map((f) => (
                        <button key={f} onClick={() => setExportFmt(f)} className="flex-1 rounded-lg border py-1.5 text-xs font-bold transition-all" style={{ borderColor: exportFmt === f ? "var(--primary)" : "var(--border)", color: exportFmt === f ? "var(--primary)" : "var(--muted)" }}>{f.toUpperCase()}</button>
                      ))}
                    </div>
                    {needsEnc && (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: "var(--muted)" }}>CRF</span>
                        <input type="range" min={18} max={35} value={exportQ} onChange={(e) => setExportQ(+e.target.value)} className="flex-1 accent-[#0d4f3c]" />
                        <span className="w-5 text-xs font-bold" style={{ color: "var(--primary)" }}>{exportQ}</span>
                      </div>
                    )}
                    <button onClick={handleExport} className="w-full rounded-lg py-3 text-sm font-semibold text-white transition-all hover:scale-[1.01]" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                      Exporter ({fmtTime(estDuration)})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── PROCESSING ─── */}
        {processing && (
          <div className="mx-auto max-w-md rounded-xl border p-8 text-center" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "rgba(13,79,60,0.08)" }}>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
            </div>
            <p className="mt-3 text-sm font-semibold">{progressMsg || "Traitement..."}</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{progress}%</p>
          </div>
        )}

        {/* ─── RESULT ─── */}
        {result && video && (
          <div className="mx-auto max-w-md space-y-4">
            <div className="rounded-xl border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "rgba(22,163,74,0.1)" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div><div><p className="text-sm font-semibold">Export termine</p><p className="text-xs" style={{ color: "var(--muted)" }}>{result.name}</p></div></div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-lg border p-2 text-center" style={{ borderColor: "var(--border)" }}><p className="text-[9px] uppercase" style={{ color: "var(--muted)" }}>Original</p><p className="text-xs font-bold">{fmtSize(video.size)}</p></div>
                <div className="rounded-lg border p-2 text-center" style={{ borderColor: "rgba(22,163,74,0.3)", background: "rgba(22,163,74,0.04)" }}><p className="text-[9px] uppercase" style={{ color: "#16a34a" }}>Resultat</p><p className="text-xs font-bold" style={{ color: "#16a34a" }}>{fmtSize(result.size)}</p></div>
                <div className="rounded-lg border p-2 text-center" style={{ borderColor: "var(--border)" }}><p className="text-[9px] uppercase" style={{ color: "var(--muted)" }}>Diff</p><p className="text-xs font-bold" style={{ color: "var(--primary)" }}>{result.size < video.size ? `-${Math.round((1 - result.size / video.size) * 100)}%` : result.size > video.size ? `+${Math.round((result.size / video.size - 1) * 100)}%` : "="}</p></div>
              </div>
              {result.type.startsWith("image/") && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="Capture" className="mt-3 w-full rounded-lg" />
              )}
              {result.type.startsWith("video/") && <video src={result.url} controls className="mt-3 w-full rounded-lg" style={{ maxHeight: "250px", background: "#0a0a0a" }} />}
              <a href={result.url} download={result.name} className="mt-3 block w-full rounded-lg py-3 text-center text-sm font-semibold text-white" style={{ background: "var(--primary)" }}>Telecharger</a>
              <button onClick={() => { if (result?.url) URL.revokeObjectURL(result.url); setResult(null); setProgress(0); }} className="mt-2 w-full rounded-lg border py-2.5 text-sm font-semibold" style={{ borderColor: "var(--border)" }}>Continuer l&apos;edition</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
