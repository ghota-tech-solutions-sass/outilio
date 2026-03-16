"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";

/* ─────────────────────────── Types ─────────────────────────── */

interface VideoInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
  width: number;
  height: number;
  url: string;
  file: File;
}

type Operation = "trim" | "convert" | "resize" | "gif" | "capture" | "mute" | "rotate" | "speed";

interface OpDef {
  key: Operation;
  label: string;
  icon: string;
  desc: string;
}

const OPERATIONS: OpDef[] = [
  { key: "trim", label: "Couper", icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z", desc: "Decouper un segment" },
  { key: "convert", label: "Convertir", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", desc: "Changer de format" },
  { key: "resize", label: "Taille", icon: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4", desc: "Redimensionner" },
  { key: "gif", label: "GIF", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z", desc: "Extraire un GIF" },
  { key: "capture", label: "Image", icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z", desc: "Capturer une image" },
  { key: "mute", label: "Muet", icon: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2", desc: "Supprimer l'audio" },
  { key: "rotate", label: "Rotation", icon: "M4 4v5h.582m0 0a8.001 8.001 0 0115.356 2M4.582 9H9", desc: "Pivoter la video" },
  { key: "speed", label: "Vitesse", icon: "M13 10V3L4 14h7v7l9-11h-7z", desc: "Accelerer / Ralentir" },
];

type ResizePreset = { label: string; w: number; h: number; tag: string };
const RESIZE_PRESETS: ResizePreset[] = [
  { label: "1080p", w: 1920, h: 1080, tag: "Full HD" },
  { label: "720p", w: 1280, h: 720, tag: "HD" },
  { label: "480p", w: 854, h: 480, tag: "SD" },
  { label: "360p", w: 640, h: 360, tag: "Mobile" },
];

type RotateOption = { label: string; value: string; icon: string };
const ROTATE_OPTIONS: RotateOption[] = [
  { label: "90° droite", value: "transpose=1", icon: "↻" },
  { label: "90° gauche", value: "transpose=2", icon: "↺" },
  { label: "180°", value: "transpose=1,transpose=1", icon: "↕" },
  { label: "Miroir H", value: "hflip", icon: "⇔" },
  { label: "Miroir V", value: "vflip", icon: "⇕" },
];

const SPEED_OPTIONS = [
  { label: "0.25x", value: 0.25, tag: "Tres lent" },
  { label: "0.5x", value: 0.5, tag: "Ralenti" },
  { label: "0.75x", value: 0.75, tag: "Lent" },
  { label: "1.5x", value: 1.5, tag: "Rapide" },
  { label: "2x", value: 2, tag: "Tres rapide" },
  { label: "4x", value: 4, tag: "Ultra rapide" },
];

/* ─────────────────────────── Utils ─────────────────────────── */

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function timeToSeconds(str: string): number {
  const parts = str.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

/* ─────────────────────────── Main ─────────────────────────── */

export default function EditeurVideo() {
  // File state
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Operation state
  const [activeOp, setActiveOp] = useState<Operation>("trim");

  // FFmpeg state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null);
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [result, setResult] = useState<{ url: string; size: number; name: string; type: string } | null>(null);

  // Trim params
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  // Convert params
  const [convertFormat, setConvertFormat] = useState<"mp4" | "webm">("mp4");
  const [convertQuality, setConvertQuality] = useState(23);

  // Resize params
  const [resizePreset, setResizePreset] = useState(1);

  // GIF params
  const [gifStart, setGifStart] = useState(0);
  const [gifDuration, setGifDuration] = useState(5);
  const [gifFps, setGifFps] = useState(15);

  // Capture params
  const [captureTime, setCaptureTime] = useState(0);

  // Rotate params
  const [rotateOption, setRotateOption] = useState(0);

  // Speed params
  const [speedOption, setSpeedOption] = useState(3); // 1.5x default

  // COI service worker
  useEffect(() => {
    if (typeof window !== "undefined" && !window.crossOriginIsolated) {
      const script = document.createElement("script");
      script.src = "/coi-serviceworker.js";
      document.head.appendChild(script);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (video?.url) URL.revokeObjectURL(video.url);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [video, result]);

  /* ─── FFmpeg loading ─── */
  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current?.loaded) { setFfmpegReady(true); return true; }
    setProgressMsg("Chargement de FFmpeg...");
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.min(Math.round(p * 100), 100)));
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = ffmpeg;
      setFfmpegReady(true);
      setProgressMsg("");
      return true;
    } catch {
      setError("Impossible de charger FFmpeg. Utilisez Chrome, Firefox ou Edge recent.");
      setProgressMsg("");
      return false;
    }
  }, []);

  /* ─── Video loading ─── */
  const loadVideo = useCallback(async (file: File) => {
    setError(""); setResult(null); setProgress(0);
    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|webm|mov|avi|mkv|m4v)$/i)) {
      setError("Seuls les fichiers video sont acceptes."); return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 500 Mo pour le traitement navigateur)."); return;
    }
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata"; v.src = url;
    try {
      await new Promise<void>((res, rej) => { v.onloadedmetadata = () => res(); v.onerror = () => rej(); });
    } catch { setError("Impossible de lire cette video."); URL.revokeObjectURL(url); return; }
    const info: VideoInfo = { name: file.name, size: file.size, type: file.type, duration: v.duration, width: v.videoWidth, height: v.videoHeight, url, file };
    setVideo(info);
    setTrimEnd(v.duration);
    setGifStart(0);
    setGifDuration(Math.min(5, v.duration));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadVideo(file);
  }, [loadVideo]);

  /* ─── Execute FFmpeg ─── */
  const exec = useCallback(async (args: string[], outputFile: string, mime: string, ext: string) => {
    if (!video) return;
    setProcessing(true); setProgress(0); setResult(null); setError("");
    setProgressMsg("Chargement de FFmpeg...");
    const loaded = await loadFFmpeg();
    if (!loaded) { setProcessing(false); return; }
    const ffmpeg = ffmpegRef.current;
    setProgressMsg("Preparation...");
    try {
      const { fetchFile } = await import("@ffmpeg/util");
      const inputExt = video.name.split(".").pop()?.toLowerCase() || "mp4";
      const inputFile = `input.${inputExt}`;
      await ffmpeg.writeFile(inputFile, await fetchFile(video.file));
      setProgressMsg("Traitement en cours...");
      const fullArgs = ["-i", inputFile, ...args, "-y", outputFile];
      const code = await ffmpeg.exec(fullArgs);
      if (code !== 0) { setError("Erreur FFmpeg. Essayez d'autres parametres."); setProcessing(false); setProgressMsg(""); return; }
      const data = await ffmpeg.readFile(outputFile);
      const blob = new Blob([data], { type: mime });
      const url = URL.createObjectURL(blob);
      setResult({ url, size: blob.size, name: video.name.replace(/\.[^.]+$/, `_edit.${ext}`), type: mime });
      setProgress(100);
      try { await ffmpeg.deleteFile(inputFile); await ffmpeg.deleteFile(outputFile); } catch { /* ok */ }
    } catch (e) { console.error(e); setError("Erreur lors du traitement."); }
    setProcessing(false); setProgressMsg("");
  }, [video, loadFFmpeg]);

  /* ─── Operation handlers ─── */
  const handleTrim = () => {
    const ss = trimStart.toFixed(2);
    const to = trimEnd.toFixed(2);
    exec(["-ss", ss, "-to", to, "-c", "copy"], "output.mp4", "video/mp4", "mp4");
  };

  const handleConvert = () => {
    const args = convertFormat === "mp4"
      ? ["-c:v", "libx264", "-crf", String(convertQuality), "-preset", "fast", "-c:a", "aac"]
      : ["-c:v", "libvpx-vp9", "-crf", String(convertQuality), "-b:v", "0", "-c:a", "libvorbis"];
    exec(args, `output.${convertFormat}`, convertFormat === "mp4" ? "video/mp4" : "video/webm", convertFormat);
  };

  const handleResize = () => {
    const p = RESIZE_PRESETS[resizePreset];
    exec(["-vf", `scale=${p.w}:${p.h}:force_original_aspect_ratio=decrease,pad=${p.w}:${p.h}:(ow-iw)/2:(oh-ih)/2`, "-c:a", "copy"], "output.mp4", "video/mp4", "mp4");
  };

  const handleGif = () => {
    const ss = gifStart.toFixed(2);
    const t = gifDuration.toFixed(2);
    exec(["-ss", ss, "-t", t, "-vf", `fps=${gifFps},scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`, "-loop", "0"], "output.gif", "image/gif", "gif");
  };

  const handleCapture = () => {
    exec(["-ss", captureTime.toFixed(2), "-frames:v", "1", "-q:v", "2"], "output.jpg", "image/jpeg", "jpg");
  };

  const handleMute = () => {
    exec(["-an", "-c:v", "copy"], "output.mp4", "video/mp4", "mp4");
  };

  const handleRotate = () => {
    const filter = ROTATE_OPTIONS[rotateOption].value;
    exec(["-vf", filter, "-c:a", "copy"], "output.mp4", "video/mp4", "mp4");
  };

  const handleSpeed = () => {
    const spd = SPEED_OPTIONS[speedOption].value;
    const vf = `setpts=${(1 / spd).toFixed(4)}*PTS`;
    const af = spd <= 0.5 ? `atempo=0.5,atempo=${spd / 0.5}` : spd > 2 ? `atempo=2.0,atempo=${spd / 2}` : `atempo=${spd}`;
    exec(["-vf", vf, "-af", af], "output.mp4", "video/mp4", "mp4");
  };

  const reset = () => {
    if (video?.url) URL.revokeObjectURL(video.url);
    if (result?.url) URL.revokeObjectURL(result.url);
    setVideo(null); setResult(null); setProgress(0); setError(""); setProgressMsg("");
  };

  const clearResult = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null); setProgress(0);
  };

  /* ─── Seek video preview on trim/capture slider ─── */
  const seekTo = useCallback((t: number) => {
    if (videoRef.current) videoRef.current.currentTime = t;
  }, []);

  /* ─── Duration text ─── */
  const trimDuration = useMemo(() => trimEnd - trimStart, [trimStart, trimEnd]);

  /* ─────────────────────────── Render ─────────────────────────── */

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-6xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Video
          </p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Editeur <span style={{ color: "var(--primary)" }}>Video</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Couper, convertir, redimensionner, extraire GIF et plus. Tout se passe dans votre navigateur, rien n&apos;est envoye.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Drop zone */}
        {!video && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="animate-fade-up stagger-3 mx-auto max-w-2xl cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-all hover:shadow-lg"
            style={{
              borderColor: dragOver ? "var(--primary)" : "var(--border)",
              background: dragOver ? "rgba(13,79,60,0.04)" : "var(--surface)",
            }}
          >
            <input ref={inputRef} type="file" accept="video/*,.mp4,.webm,.mov,.avi,.mkv" className="hidden"
              onChange={(e) => e.target.files?.[0] && loadVideo(e.target.files[0])} />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "rgba(13,79,60,0.08)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <p className="mt-5 text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Deposez votre video ici
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
              MP4, WebM, MOV, AVI — max 500 Mo
            </p>
          </div>
        )}

        {error && (
          <div className="mx-auto mt-4 max-w-2xl rounded-xl border p-4 text-sm"
            style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
            {error}
          </div>
        )}

        {/* Editor */}
        {video && (
          <div className="space-y-6">
            {/* Video Theater */}
            <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
              {/* Dark preview area */}
              <div className="relative" style={{ background: "#0a0a0a" }}>
                <video
                  ref={videoRef}
                  src={video.url}
                  controls
                  className="mx-auto block"
                  style={{ maxHeight: "420px", width: "100%" }}
                  crossOrigin="anonymous"
                />
              </div>
              {/* Info bar */}
              <div className="flex flex-wrap items-center gap-4 border-t px-5 py-3"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <span className="text-xs font-semibold truncate max-w-[200px]" title={video.name}>{video.name}</span>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
                  <span>{video.width}x{video.height}</span>
                  <span className="h-3 w-px" style={{ background: "var(--border)" }} />
                  <span>{formatTime(video.duration)}</span>
                  <span className="h-3 w-px" style={{ background: "var(--border)" }} />
                  <span>{formatSize(video.size)}</span>
                </div>
                <button onClick={reset} className="ml-auto text-xs font-semibold transition-colors hover:opacity-70" style={{ color: "#dc2626" }}>
                  Changer
                </button>
              </div>
            </div>

            {/* Operation tabs */}
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <div className="flex min-w-max border-b" style={{ borderColor: "var(--border)" }}>
                {OPERATIONS.map((op) => (
                  <button
                    key={op.key}
                    onClick={() => { setActiveOp(op.key); clearResult(); }}
                    className="relative flex items-center gap-2 px-5 py-3.5 text-xs font-semibold transition-all"
                    style={{
                      color: activeOp === op.key ? "var(--primary)" : "var(--muted)",
                      background: activeOp === op.key ? "rgba(13,79,60,0.04)" : "transparent",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={op.icon} />
                    </svg>
                    {op.label}
                    {activeOp === op.key && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "var(--primary)" }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Operation panel */}
              <div className="p-6">
                {!processing && !result && (
                  <>
                    {/* TRIM */}
                    {activeOp === "trim" && (
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Plage de coupe</p>
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs" style={{ color: "var(--muted)" }}>Debut</label>
                              <input type="range" min={0} max={video.duration} step={0.1} value={trimStart}
                                onChange={(e) => { const v = parseFloat(e.target.value); setTrimStart(Math.min(v, trimEnd - 0.5)); seekTo(v); }}
                                className="mt-1 w-full accent-[#0d4f3c]" />
                              <p className="mt-1 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{formatTime(trimStart)}</p>
                            </div>
                            <div>
                              <label className="text-xs" style={{ color: "var(--muted)" }}>Fin</label>
                              <input type="range" min={0} max={video.duration} step={0.1} value={trimEnd}
                                onChange={(e) => { const v = parseFloat(e.target.value); setTrimEnd(Math.max(v, trimStart + 0.5)); seekTo(v); }}
                                className="mt-1 w-full accent-[#0d4f3c]" />
                              <p className="mt-1 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{formatTime(trimEnd)}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl py-2" style={{ background: "rgba(13,79,60,0.04)" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--primary)" }}>
                              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                              Duree du segment : {formatTime(trimDuration)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 rounded-xl p-3" style={{ background: "var(--surface-alt)" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
                            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>Mode copie directe — pas de re-encodage, quasi instantane.</p>
                        </div>
                        <button onClick={handleTrim} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                          Couper la video
                        </button>
                      </div>
                    )}

                    {/* CONVERT */}
                    {activeOp === "convert" && (
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Format de sortie</p>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            {(["mp4", "webm"] as const).map((fmt) => (
                              <button key={fmt} onClick={() => setConvertFormat(fmt)}
                                className="rounded-xl border p-4 text-left transition-all"
                                style={{ borderColor: convertFormat === fmt ? "var(--primary)" : "var(--border)", background: convertFormat === fmt ? "rgba(13,79,60,0.04)" : "transparent" }}>
                                <p className="text-sm font-bold">{fmt.toUpperCase()}</p>
                                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{fmt === "mp4" ? "H.264 + AAC — Compatible partout" : "VP9 + Vorbis — Web optimise"}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Qualite (CRF)</p>
                            <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{convertQuality}</span>
                          </div>
                          <input type="range" min={18} max={35} value={convertQuality} onChange={(e) => setConvertQuality(parseInt(e.target.value))}
                            className="mt-2 w-full accent-[#0d4f3c]" />
                          <div className="flex justify-between text-[10px]" style={{ color: "var(--muted)" }}>
                            <span>Haute qualite</span><span>Fichier leger</span>
                          </div>
                        </div>
                        <button onClick={handleConvert} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                          Convertir en {convertFormat.toUpperCase()}
                        </button>
                      </div>
                    )}

                    {/* RESIZE */}
                    {activeOp === "resize" && (
                      <div className="space-y-5">
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Resolution cible</p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {RESIZE_PRESETS.map((p, i) => (
                            <button key={p.label} onClick={() => setResizePreset(i)}
                              className="rounded-xl border p-4 text-center transition-all"
                              style={{ borderColor: resizePreset === i ? "var(--primary)" : "var(--border)", background: resizePreset === i ? "rgba(13,79,60,0.04)" : "transparent" }}>
                              <p className="text-sm font-bold">{p.label}</p>
                              <p className="mt-0.5 text-[10px]" style={{ color: "var(--muted)" }}>{p.w}x{p.h}</p>
                              <p className="mt-1 text-[10px] font-semibold" style={{ color: "var(--accent)" }}>{p.tag}</p>
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
                          <span>Actuel : <strong style={{ color: "var(--foreground)" }}>{video.width}x{video.height}</strong></span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          <span>Cible : <strong style={{ color: "var(--primary)" }}>{RESIZE_PRESETS[resizePreset].w}x{RESIZE_PRESETS[resizePreset].h}</strong></span>
                        </div>
                        <button onClick={handleResize} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                          Redimensionner
                        </button>
                      </div>
                    )}

                    {/* GIF */}
                    {activeOp === "gif" && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Debut</label>
                            <input type="range" min={0} max={video.duration} step={0.1} value={gifStart}
                              onChange={(e) => { setGifStart(parseFloat(e.target.value)); seekTo(parseFloat(e.target.value)); }}
                              className="mt-2 w-full accent-[#e8963e]" />
                            <p className="mt-1 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{formatTime(gifStart)}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Duree (max 10s)</label>
                            <input type="range" min={1} max={Math.min(10, video.duration - gifStart)} step={0.5} value={gifDuration}
                              onChange={(e) => setGifDuration(parseFloat(e.target.value))}
                              className="mt-2 w-full accent-[#e8963e]" />
                            <p className="mt-1 text-center text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{gifDuration}s</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Images par seconde</p>
                          <div className="mt-2 flex gap-2">
                            {[10, 15, 20, 25].map((fps) => (
                              <button key={fps} onClick={() => setGifFps(fps)}
                                className="flex-1 rounded-lg border py-2 text-xs font-semibold transition-all"
                                style={{ borderColor: gifFps === fps ? "var(--accent)" : "var(--border)", background: gifFps === fps ? "rgba(232,150,62,0.08)" : "transparent", color: gifFps === fps ? "var(--accent)" : "var(--muted)" }}>
                                {fps} fps
                              </button>
                            ))}
                          </div>
                        </div>
                        <button onClick={handleGif} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, var(--accent) 0%, #d4822e 100%)" }}>
                          Extraire le GIF
                        </button>
                      </div>
                    )}

                    {/* CAPTURE */}
                    {activeOp === "capture" && (
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Timestamp de capture</p>
                          <input type="range" min={0} max={video.duration} step={0.1} value={captureTime}
                            onChange={(e) => { setCaptureTime(parseFloat(e.target.value)); seekTo(parseFloat(e.target.value)); }}
                            className="mt-3 w-full accent-[#0d4f3c]" />
                          <p className="mt-2 text-center text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{formatTime(captureTime)}</p>
                          <p className="text-center text-xs" style={{ color: "var(--muted)" }}>Deplacez le curseur et verifiez le preview ci-dessus</p>
                        </div>
                        <button onClick={handleCapture} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                          Capturer l&apos;image
                        </button>
                      </div>
                    )}

                    {/* MUTE */}
                    {activeOp === "mute" && (
                      <div className="space-y-5">
                        <div className="flex items-center gap-4 rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(13,79,60,0.1)" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
                              <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              <line x1="17" y1="14" x2="21" y2="10" /><line x1="17" y1="10" x2="21" y2="14" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Supprimer la piste audio</p>
                            <p className="text-xs" style={{ color: "var(--muted)" }}>La video sera identique, sans le son. Pas de re-encodage, quasi instantane.</p>
                          </div>
                        </div>
                        <button onClick={handleMute} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                          Supprimer l&apos;audio
                        </button>
                      </div>
                    )}

                    {/* ROTATE */}
                    {activeOp === "rotate" && (
                      <div className="space-y-5">
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Transformation</p>
                        <div className="grid grid-cols-5 gap-2">
                          {ROTATE_OPTIONS.map((opt, i) => (
                            <button key={opt.label} onClick={() => setRotateOption(i)}
                              className="rounded-xl border p-3 text-center transition-all"
                              style={{ borderColor: rotateOption === i ? "var(--primary)" : "var(--border)", background: rotateOption === i ? "rgba(13,79,60,0.04)" : "transparent" }}>
                              <p className="text-xl">{opt.icon}</p>
                              <p className="mt-1 text-[10px] font-semibold">{opt.label}</p>
                            </button>
                          ))}
                        </div>
                        <button onClick={handleRotate} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                          Appliquer la rotation
                        </button>
                      </div>
                    )}

                    {/* SPEED */}
                    {activeOp === "speed" && (
                      <div className="space-y-5">
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Vitesse de lecture</p>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                          {SPEED_OPTIONS.map((opt, i) => (
                            <button key={opt.label} onClick={() => setSpeedOption(i)}
                              className="rounded-xl border p-3 text-center transition-all"
                              style={{ borderColor: speedOption === i ? "var(--primary)" : "var(--border)", background: speedOption === i ? "rgba(13,79,60,0.04)" : "transparent" }}>
                              <p className="text-sm font-bold">{opt.label}</p>
                              <p className="mt-0.5 text-[10px]" style={{ color: "var(--muted)" }}>{opt.tag}</p>
                            </button>
                          ))}
                        </div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>
                          Duree estimee : <strong style={{ color: "var(--foreground)" }}>{formatTime(video.duration / SPEED_OPTIONS[speedOption].value)}</strong>
                        </div>
                        <button onClick={handleSpeed} className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                          Appliquer la vitesse {SPEED_OPTIONS[speedOption].label}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Progress */}
                {processing && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>{progressMsg || "Traitement..."}</p>
                      <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)" }} />
                    </div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      Le traitement utilise FFmpeg WebAssembly. Ne fermez pas cet onglet.
                    </p>
                  </div>
                )}

                {/* Result */}
                {result && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(22,163,74,0.1)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Traitement termine</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>{result.name}</p>
                      </div>
                    </div>

                    {/* Size comparison */}
                    <div className="grid grid-cols-3 gap-3">
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

                    {/* Preview for images */}
                    {result.type.startsWith("image/") && (
                      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={result.url} alt="Capture" className="w-full" />
                      </div>
                    )}

                    {/* Preview for video */}
                    {result.type.startsWith("video/") && (
                      <video src={result.url} controls className="w-full rounded-xl" style={{ maxHeight: "300px", background: "#0a0a0a" }} />
                    )}

                    {/* Download */}
                    <a href={result.url} download={result.name}
                      className="block w-full rounded-xl py-3.5 text-center text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "var(--primary)" }}>
                      Telecharger {result.type.startsWith("image/") ? "l'image" : result.name.endsWith(".gif") ? "le GIF" : "la video"}
                    </a>
                    <button onClick={clearResult}
                      className="w-full rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)" }}>
                      Autre operation
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Capabilities info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Rapide", desc: "Couper et muet sont quasi instantanes (pas de re-encodage)" },
                { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Prive", desc: "Tout se passe dans votre navigateur, rien n'est envoye" },
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Gratuit", desc: "Aucune limite, aucun watermark, aucun compte requis" },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
                    <path d={f.icon} />
                  </svg>
                  <p className="mt-2 text-sm font-semibold">{f.title}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
