"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import { FFmpegSession, baseName, safeExtension } from "@/lib/ffmpeg";

interface VideoInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
  /** Display size read by the browser (0 when the browser cannot read the file) */
  width: number;
  height: number;
  url: string;
  file: File;
}

type Quality = "high" | "medium" | "low";
type Resolution = "original" | "1080" | "720" | "480";

interface CompressResult {
  url: string;
  size: number;
  name: string;
  audioNote: string;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024;
const VIDEO_EXT = /\.(mp4|m4v|webm|mov|mkv|avi|ogv|3gp|ts|mts|m2ts|flv|wmv|mpg|mpeg)$/i;

const QUALITY_OPTIONS: { key: Quality; label: string; desc: string; crf: number; preset: string }[] = [
  { key: "high", label: "Haute", desc: "Proche de l'original", crf: 23, preset: "veryfast" },
  { key: "medium", label: "Moyenne", desc: "Bon équilibre taille/qualité", crf: 28, preset: "veryfast" },
  { key: "low", label: "Faible", desc: "Fichier le plus léger, plus rapide", crf: 32, preset: "ultrafast" },
];

const RESOLUTION_OPTIONS: { key: Resolution; label: string; short: number }[] = [
  { key: "original", label: "Originale", short: 0 },
  { key: "1080", label: "1080p", short: 1080 },
  { key: "720", label: "720p", short: 720 },
  { key: "480", label: "480p", short: 480 },
];

/**
 * Video filter: the short side is reduced to `short` pixels (never enlarged), portrait videos included
 * (FFmpeg applies the rotation metadata before the filter). Sizes are kept even, as required by H.264 4:2:0.
 */
function buildScaleFilter(short: number): string {
  if (!short) return "scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=1";
  return `scale=w='if(gte(iw,ih),-2,min(${short},trunc(iw/2)*2))':h='if(gte(iw,ih),min(${short},trunc(ih/2)*2),-2)',setsar=1`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CompresseurVideo() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [quality, setQuality] = useState<Quality>("medium");
  const [resolution, setResolution] = useState<Resolution>("720");
  const [result, setResult] = useState<CompressResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionRef = useRef<FFmpegSession | null>(null);
  const cancelledRef = useRef(false);

  // Revoke each object URL when it is replaced or on unmount (one effect per URL)
  const videoUrl = videoInfo?.url;
  const resultUrl = result?.url;
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  // Kill the FFmpeg worker when leaving the page
  useEffect(() => {
    return () => {
      sessionRef.current?.terminate();
      sessionRef.current = null;
    };
  }, []);

  // Elapsed time counter while compressing
  useEffect(() => {
    if (!compressing) return;
    const start = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, [compressing]);

  const loadVideo = useCallback((file: File) => {
    setError("");
    setResult(null);
    setProgress(0);
    setPreviewError(false);

    if (!file.type.startsWith("video/") && !VIDEO_EXT.test(file.name)) {
      setError("Seuls les fichiers vidéo sont acceptés (MP4, MOV, WebM, MKV, AVI...).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Fichier trop volumineux : 500 Mo maximum pour une compression dans le navigateur.");
      return;
    }
    // Size and duration are filled by the <video> preview (onLoadedMetadata)
    setVideoInfo({ name: file.name, size: file.size, type: file.type, duration: 0, width: 0, height: 0, url: URL.createObjectURL(file), file });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) loadVideo(file);
    },
    [loadVideo]
  );

  const shortSide = videoInfo && videoInfo.width && videoInfo.height ? Math.min(videoInfo.width, videoInfo.height) : 0;
  // Only offer resolutions smaller than the source (when it is known)
  const resolutionChoices = RESOLUTION_OPTIONS.filter((r) => !r.short || !shortSide || r.short < shortSide);
  const effectiveResolution: Resolution = resolutionChoices.some((r) => r.key === resolution) ? resolution : "original";

  const getSession = async (): Promise<FFmpegSession> => {
    if (sessionRef.current && !sessionRef.current.terminated) return sessionRef.current;
    const session = await FFmpegSession.create(setStatus);
    sessionRef.current = session;
    return session;
  };

  const dropSession = () => {
    sessionRef.current?.terminate();
    sessionRef.current = null;
  };

  const compress = async () => {
    if (!videoInfo) return;
    setCompressing(true);
    setElapsed(0);
    setProgress(0);
    setResult(null);
    setError("");
    cancelledRef.current = false;

    const q = QUALITY_OPTIONS.find((o) => o.key === quality)!;
    const res = RESOLUTION_OPTIONS.find((o) => o.key === effectiveResolution)!;
    const outPath = `/compress_${Date.now()}.mp4`;
    let session: FFmpegSession | null = null;
    let cleanup: (() => Promise<void>) | null = null;

    try {
      session = await getSession();
      setStatus("Analyse de la vidéo...");
      const input = await session.mountInput(videoInfo.file, safeExtension(videoInfo.name, "mp4"));
      cleanup = input.cleanup;
      const info = await session.probe(input.path);
      if (!info.hasVideo) {
        setError("Aucune piste vidéo n'a été trouvée dans ce fichier (fichier audio ou endommagé ?).");
        return;
      }
      const duration = info.duration || videoInfo.duration;
      if (!videoInfo.duration && info.duration) {
        setVideoInfo((prev) => (prev && prev.file === videoInfo.file ? { ...prev, duration: info.duration } : prev));
      }

      const audioArgs: string[] = [];
      let audioNote = "Sans piste audio";
      if (info.audio) {
        audioArgs.push("-map", "0:a:0");
        if (info.audio.codec === "aac") {
          audioArgs.push("-c:a", "copy");
          audioNote = "Audio AAC d'origine conservé";
        } else {
          audioArgs.push("-c:a", "aac", "-b:a", "128k");
          audioNote = `Audio ${info.audio.codec.toUpperCase()} converti en AAC 128 kbps`;
        }
      }

      setStatus("Compression H.264 en cours...");
      const code = await session.exec(
        [
          "-i", input.path,
          "-map", "0:v:0",
          ...audioArgs,
          "-vf", buildScaleFilter(res.short),
          "-c:v", "libx264", "-preset", q.preset, "-crf", String(q.crf), "-pix_fmt", "yuv420p",
          "-movflags", "+faststart",
          "-y", outPath,
        ],
        { duration, onProgress: (r) => setProgress(Math.round(r * 100)) }
      );
      if (code !== 0) {
        console.error(session.getLogs().slice(-15).join("\n"));
        setError("La compression a échoué : le codec de cette vidéo n'est peut-être pas pris en charge ou le fichier est endommagé.");
        return;
      }
      setStatus("Lecture du résultat...");
      const data = await session.readFile(outPath);
      const blob = new Blob([data as BlobPart], { type: "video/mp4" });
      if (blob.size === 0) {
        setError("Le fichier produit est vide.");
        return;
      }
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: `${baseName(videoInfo.name)}_compresse.mp4`,
        audioNote,
      });
      setProgress(100);
    } catch (e) {
      if (!cancelledRef.current) {
        console.error("Compression error:", e);
        setError(
          "Erreur pendant la compression : la vidéo est peut-être trop lourde pour la mémoire du navigateur. Essayez une résolution plus basse ou un fichier plus court."
        );
      }
      // The worker may be dead (cancelled or out of memory): a fresh one is created next time
      dropSession();
    } finally {
      if (session && !session.terminated) {
        if (cleanup) await cleanup();
        await session.deleteFile(outPath);
      }
      setCompressing(false);
      setStatus("");
    }
  };

  const cancelCompression = () => {
    cancelledRef.current = true;
    dropSession();
  };

  const reset = () => {
    setVideoInfo(null);
    setResult(null);
    setProgress(0);
    setError("");
    setPreviewError(false);
  };

  const bigger = result && videoInfo ? result.size >= videoInfo.size : false;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Vidéo
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Compresseur <span style={{ color: "var(--primary)" }}>Vidéo</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Réduisez la taille de vos vidéos en MP4 H.264 directement dans le navigateur : choisissez la qualité et la résolution. Traitement local avec FFmpeg, aucun envoi sur un serveur.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Drop zone */}
            {!videoInfo && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Choisir une vidéo à compresser"
                className="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all"
                style={{
                  borderColor: dragOver ? "var(--primary)" : "var(--border)",
                  background: dragOver ? "rgba(13,79,60,0.04)" : "var(--surface)",
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="video/*,.mkv,.avi,.mts,.m2ts,.ts,.flv,.wmv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) loadVideo(f);
                  }}
                />
                <p className="text-4xl">🎬</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Glissez une vidéo ici
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  MP4, MOV, WebM, MKV... jusqu&apos;à 500 Mo, ou cliquez pour parcourir
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border p-4 text-sm" role="alert" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                {error}
              </div>
            )}

            {/* Video info */}
            {videoInfo && (
              <>
                <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Vidéo source
                    </h2>
                    <button
                      onClick={reset}
                      disabled={compressing}
                      className="text-xs font-semibold transition-colors hover:opacity-70 disabled:opacity-40"
                      style={{ color: "#dc2626" }}
                    >
                      Changer de vidéo
                    </button>
                  </div>
                  <div className="p-5">
                    {!previewError ? (
                      <video
                        src={videoInfo.url}
                        controls
                        preload="metadata"
                        className="w-full rounded-xl"
                        style={{ maxHeight: "300px", background: "#000" }}
                        onLoadedMetadata={(e) => {
                          const v = e.currentTarget;
                          const url = videoInfo.url;
                          setVideoInfo((prev) =>
                            prev && prev.url === url
                              ? {
                                  ...prev,
                                  duration: Number.isFinite(v.duration) && v.duration > 0 ? v.duration : prev.duration,
                                  width: v.videoWidth,
                                  height: v.videoHeight,
                                }
                              : prev
                          );
                        }}
                        onError={() => setPreviewError(true)}
                      />
                    ) : (
                      <p className="rounded-xl p-4 text-xs" style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>
                        Aperçu indisponible : votre navigateur ne sait pas lire ce format. La compression avec FFmpeg reste possible.
                      </p>
                    )}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Taille", value: formatSize(videoInfo.size) },
                        { label: "Durée", value: videoInfo.duration ? formatDuration(videoInfo.duration) : "..." },
                        { label: "Résolution", value: videoInfo.width ? `${videoInfo.width}×${videoInfo.height}` : "..." },
                        { label: "Format", value: safeExtension(videoInfo.name, "?").toUpperCase() },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>{item.label}</p>
                          <p className="text-sm font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings */}
                {!compressing && !result && (
                  <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Qualité
                    </h3>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {QUALITY_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setQuality(opt.key)}
                          aria-pressed={quality === opt.key}
                          className="rounded-xl border p-3 text-left transition-all"
                          style={{
                            borderColor: quality === opt.key ? "var(--primary)" : "var(--border)",
                            background: quality === opt.key ? "rgba(13,79,60,0.04)" : "transparent",
                          }}
                        >
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{opt.desc}</p>
                          <p className="text-xs mt-1 font-mono" style={{ color: "var(--primary)" }}>CRF {opt.crf}</p>
                        </button>
                      ))}
                    </div>

                    <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Résolution
                    </h3>
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {resolutionChoices.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setResolution(opt.key)}
                          aria-pressed={effectiveResolution === opt.key}
                          className="rounded-xl border p-2.5 text-center text-sm font-semibold transition-all"
                          style={{
                            borderColor: effectiveResolution === opt.key ? "var(--primary)" : "var(--border)",
                            background: effectiveResolution === opt.key ? "rgba(13,79,60,0.04)" : "transparent",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                      La compression recalcule chaque image sur votre appareil, sans accélération matérielle : en HD, elle peut durer plus longtemps que la vidéo elle-même. Réduire la résolution l&apos;accélère nettement.
                    </p>

                    <button
                      onClick={compress}
                      className="mt-4 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "var(--primary)" }}
                    >
                      Compresser en MP4
                    </button>
                  </div>
                )}

                {/* Progress */}
                {compressing && (
                  <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                        {status || "Compression en cours..."}
                      </h3>
                      <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, background: "var(--primary)" }}
                      />
                    </div>
                    <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                      Temps écoulé : {formatDuration(elapsed)}. Gardez cet onglet ouvert jusqu&apos;à la fin.
                    </p>
                    <button
                      onClick={cancelCompression}
                      className="mt-3 rounded-xl border px-5 py-2 text-xs font-semibold transition-all hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)", color: "#dc2626" }}
                    >
                      Annuler
                    </button>
                  </div>
                )}

                {/* Result */}
                {result && (
                  <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Résultat : MP4 H.264
                    </h3>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>Original</p>
                        <p className="text-sm font-bold mt-1">{formatSize(videoInfo.size)}</p>
                      </div>
                      <div
                        className="rounded-xl border p-3 text-center"
                        style={bigger ? { borderColor: "rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.06)" } : { borderColor: "rgba(22,163,74,0.3)", background: "rgba(22,163,74,0.06)" }}
                      >
                        <p className="text-xs" style={{ color: bigger ? "#dc2626" : "#16a34a" }}>Compressé</p>
                        <p className="text-sm font-bold mt-1" style={{ color: bigger ? "#dc2626" : "#16a34a" }}>{formatSize(result.size)}</p>
                      </div>
                      <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>Différence</p>
                        <p className="text-sm font-bold mt-1" style={{ color: bigger ? "#dc2626" : "var(--primary)" }}>
                          {result.size < videoInfo.size
                            ? `-${Math.round((1 - result.size / videoInfo.size) * 100)}%`
                            : `+${Math.round((result.size / videoInfo.size - 1) * 100)}%`}
                        </p>
                      </div>
                    </div>
                    {bigger && (
                      <p className="mt-3 rounded-xl border p-3 text-xs" style={{ borderColor: "rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.06)", color: "#dc2626" }}>
                        La vidéo compressée est plus lourde que l&apos;originale : la source était déjà très compressée. Gardez l&apos;original, ou réessayez avec une qualité plus faible ou une résolution inférieure.
                      </p>
                    )}
                    <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>{result.audioNote}.</p>
                    <video key={result.url} src={result.url} controls preload="metadata" className="mt-4 w-full rounded-xl" style={{ maxHeight: "300px", background: "#000" }} />
                    <a
                      href={result.url}
                      download={result.name}
                      className="mt-4 block w-full rounded-xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:opacity-90"
                      style={{ background: "var(--primary)" }}
                    >
                      Télécharger la vidéo compressée
                    </a>
                    <button
                      onClick={() => { setResult(null); setProgress(0); }}
                      className="mt-2 w-full rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Essayer d&apos;autres réglages
                    </button>
                  </div>
                )}
              </>
            )}

            {!videoInfo && !error && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-4xl">🎥</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Déposez une vidéo pour commencer
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  La compression se fait entièrement dans votre navigateur, avec FFmpeg.
                </p>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>À propos du compresseur</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">FFmpeg WebAssembly</strong> : la vidéo est réencodée par FFmpeg (encodeur x264) directement dans votre navigateur. Le moteur (environ 30 Mo) est téléchargé une seule fois au premier usage.</p>
                <p><strong className="text-[var(--foreground)]">MP4 H.264</strong> : le format le plus compatible (smartphones, messageries, réseaux sociaux, lecteurs). Le fichier est optimisé pour la lecture en streaming (faststart).</p>
                <p><strong className="text-[var(--foreground)]">Qualité constante (CRF)</strong> : Haute (CRF 23), Moyenne (CRF 28) ou Faible (CRF 32). Plus le CRF est élevé, plus le fichier est léger.</p>
                <p><strong className="text-[var(--foreground)]">Audio</strong> : une piste AAC est conservée telle quelle ; les autres codecs sont convertis en AAC 128 kbps.</p>
                <p><strong className="text-[var(--foreground)]">Limites</strong> : 500 Mo maximum ; calcul sur un seul cœur du processeur, donc lent pour les vidéos longues en haute définition ; seules la première piste vidéo et la première piste audio sont conservées (pas de sous-titres).</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le compresseur vidéo en ligne
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Ce compresseur vidéo gratuit réduit la taille de vos fichiers directement dans votre navigateur, sans envoyer votre vidéo sur un serveur. Il accepte les formats lus par FFmpeg : MP4, MOV, WebM, MKV, AVI...
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Déposez votre vidéo</strong> : glissez un fichier vidéo (500 Mo maximum) dans la zone de dépôt ou cliquez pour le sélectionner.</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez la qualité</strong> : Haute, Moyenne (recommandée) ou Faible.</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez la résolution</strong> : gardez l&apos;originale ou réduisez en 1080p, 720p ou 480p ; seules les résolutions inférieures à la source sont proposées.</li>
                  <li><strong className="text-[var(--foreground)]">Téléchargez le résultat</strong> : comparez la taille avant/après, prévisualisez puis téléchargez le MP4 compressé.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Ma vidéo est-elle envoyée sur un serveur ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Non. Le traitement se fait dans votre navigateur grâce à FFmpeg compilé en WebAssembly : seul le moteur est téléchargé, votre vidéo ne quitte pas votre appareil.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi la compression est-elle lente ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Chaque image est réencodée en H.264 par le processeur, sur un seul cœur et sans l&apos;accélération matérielle d&apos;un logiciel installé. En 1080p, cela peut prendre plusieurs fois la durée de la vidéo selon votre appareil. Choisir 720p ou 480p, ou la qualité « Faible », accélère fortement le traitement.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi le fichier compressé est-il parfois plus lourd ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Si la vidéo d&apos;origine est déjà très compressée (par exemple une vidéo téléchargée depuis un réseau social), la réencoder en qualité Haute peut produire un fichier plus gros. L&apos;outil vous prévient dans ce cas : gardez l&apos;original ou baissez la qualité ou la résolution.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel réglage choisir ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour un envoi par messagerie ou email, la qualité « Moyenne » en 720p est un bon compromis. Pour conserver un rendu proche de l&apos;original, choisissez « Haute » sans réduire la résolution. « Faible » en 480p donne les fichiers les plus légers, pour un aperçu ou une limite de taille stricte.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conseils</h3>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                {[
                  "La qualité « Moyenne » en 720p convient à la plupart des usages",
                  "Réduire la résolution est le moyen le plus efficace de gagner en taille et en vitesse",
                  "Sortie en MP4 H.264 + AAC, lisible partout",
                  "500 Mo maximum par vidéo",
                ].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span style={{ color: "var(--primary)" }}>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
