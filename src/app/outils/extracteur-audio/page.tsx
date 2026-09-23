"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import { FFmpegSession, baseName, safeExtension, type ProbeInfo } from "@/lib/ffmpeg";

interface VideoFileInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
  url: string;
  file: File;
}

type OutputMode = "copy" | "mp3" | "wav";
type Mp3Bitrate = "128k" | "192k" | "320k";

interface ExtractResult {
  url: string;
  size: number;
  name: string;
  label: string;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024;
/** Above this estimate the WAV (PCM 16 bits) output is refused: it would not fit in the browser memory */
const MAX_WAV_SIZE = 400 * 1024 * 1024;
/** The waveform is decoded at 8 kHz: 30 min ≈ 115 Mo of samples in memory for a stereo track */
const WAVEFORM_MAX_DURATION = 30 * 60;

const VIDEO_EXT = /\.(mp4|m4v|webm|mov|mkv|avi|ogv|3gp|ts|mts|m2ts|flv|wmv|mpg|mpeg)$/i;

/** Containers used when the audio stream is copied as is (no re-encoding) */
function copyTarget(codec: string): { ext: string; mime: string; label: string } | null {
  switch (codec) {
    case "aac":
      return { ext: "m4a", mime: "audio/mp4", label: "AAC" };
    case "alac":
      return { ext: "m4a", mime: "audio/mp4", label: "ALAC" };
    case "mp3":
      return { ext: "mp3", mime: "audio/mpeg", label: "MP3" };
    case "opus":
      return { ext: "ogg", mime: "audio/ogg", label: "Opus" };
    case "vorbis":
      return { ext: "ogg", mime: "audio/ogg", label: "Vorbis" };
    case "flac":
      return { ext: "flac", mime: "audio/flac", label: "FLAC" };
    case "pcm_s16le":
    case "pcm_s24le":
    case "pcm_s32le":
    case "pcm_f32le":
    case "pcm_f64le":
    case "pcm_u8":
      return { ext: "wav", mime: "audio/wav", label: "PCM" };
    default:
      // Big-endian PCM (common in MOV), AC-3, E-AC-3, DTS, WMA...: converted instead
      return null;
  }
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

function describeAudio(a: NonNullable<ProbeInfo["audio"]>): string {
  const parts = [a.codec.toUpperCase()];
  if (a.sampleRate) parts.push(`${(a.sampleRate / 1000).toLocaleString("fr-FR")} kHz`);
  parts.push(a.channels === 1 ? "mono" : a.channels === 2 ? "stéréo" : `${a.channels} canaux`);
  if (a.bitrateKbps) parts.push(`${a.bitrateKbps} kb/s`);
  return parts.join(", ");
}

export default function ExtracteurAudio() {
  const [videoFile, setVideoFile] = useState<VideoFileInfo | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [probing, setProbing] = useState(false);
  const [probe, setProbe] = useState<ProbeInfo | null>(null);
  const [mode, setMode] = useState<OutputMode>("copy");
  const [mp3Bitrate, setMp3Bitrate] = useState<Mp3Bitrate>("192k");
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [waveformStatus, setWaveformStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const sessionRef = useRef<FFmpegSession | null>(null);
  const cancelledRef = useRef(false);
  // Incremented for each new file: results of an outdated probe are ignored
  const fileTokenRef = useRef(0);

  // Revoke each object URL when it is replaced or on unmount (one effect per URL)
  const videoUrl = videoFile?.url;
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

  const getSession = useCallback(async (): Promise<FFmpegSession> => {
    if (sessionRef.current && !sessionRef.current.terminated) return sessionRef.current;
    const session = await FFmpegSession.create(setStatus);
    sessionRef.current = session;
    return session;
  }, []);

  const dropSession = () => {
    sessionRef.current?.terminate();
    sessionRef.current = null;
  };

  const analyse = useCallback(
    async (file: File, token: number) => {
      setProbing(true);
      setStatus("Chargement de FFmpeg...");
      let cleanup: (() => Promise<void>) | null = null;
      try {
        const session = await getSession();
        if (token !== fileTokenRef.current) return;
        setStatus("Analyse des pistes de la vidéo...");
        const input = await session.mountInput(file, safeExtension(file.name, "mp4"));
        cleanup = input.cleanup;
        const info = await session.probe(input.path);
        if (token !== fileTokenRef.current) return;
        if (!info.hasAudio || !info.audio) {
          setError("Cette vidéo ne contient aucune piste audio : il n'y a rien à extraire.");
          return;
        }
        setProbe(info);
        setMode(copyTarget(info.audio.codec) ? "copy" : "mp3");
        if (info.duration > 0) {
          setVideoFile((prev) => (prev && prev.file === file && !prev.duration ? { ...prev, duration: info.duration } : prev));
        }
      } catch (e) {
        console.error("FFmpeg probe error:", e);
        if (token !== fileTokenRef.current) return;
        dropSession();
        setError(
          "Impossible de charger ou d'exécuter FFmpeg. Vérifiez votre connexion internet ou désactivez un éventuel bloqueur de scripts, puis réessayez."
        );
      } finally {
        if (cleanup && sessionRef.current) await cleanup();
        if (token === fileTokenRef.current) {
          setProbing(false);
          setStatus("");
        }
      }
    },
    [getSession]
  );

  const loadVideo = useCallback(
    (file: File) => {
      setError("");
      setResult(null);
      setProgress(0);
      setProbe(null);
      setPreviewError(false);
      setWaveformStatus("");

      if (!file.type.startsWith("video/") && !VIDEO_EXT.test(file.name)) {
        setError("Seuls les fichiers vidéo sont acceptés (MP4, MOV, WebM, MKV, AVI...).");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("Fichier trop volumineux : 500 Mo maximum pour un traitement dans le navigateur.");
        return;
      }

      fileTokenRef.current += 1;
      // Duration is read from the <video> preview (onLoadedMetadata) or from the FFmpeg analysis
      setVideoFile({ name: file.name, size: file.size, type: file.type, duration: 0, url: URL.createObjectURL(file), file });
      analyse(file, fileTokenRef.current);
    },
    [analyse]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) loadVideo(file);
    },
    [loadVideo]
  );

  const audio = probe?.audio ?? null;
  const copy = audio ? copyTarget(audio.codec) : null;
  const duration = videoFile?.duration || probe?.duration || 0;
  const wavEstimate = audio && duration ? duration * (audio.sampleRate || 48000) * audio.channels * 2 : 0;

  const extractAudio = async () => {
    if (!videoFile || !audio) return;
    if (mode === "copy" && !copy) return;
    if (mode === "wav" && wavEstimate > MAX_WAV_SIZE) {
      setError(
        `Le WAV ferait environ ${formatSize(wavEstimate)}, trop lourd pour la mémoire du navigateur. Choisissez le MP3 ou la piste d'origine.`
      );
      return;
    }

    setExtracting(true);
    setProgress(0);
    setResult(null);
    setError("");
    setWaveformStatus("");
    cancelledRef.current = false;

    let session: FFmpegSession | null = null;
    let cleanup: (() => Promise<void>) | null = null;
    let target: { ext: string; mime: string; label: string };
    const codecArgs: string[] = [];
    if (mode === "copy") {
      target = copy!;
      codecArgs.push("-c:a", "copy");
      if (target.ext === "m4a") codecArgs.push("-movflags", "+faststart");
    } else if (mode === "mp3") {
      target = { ext: "mp3", mime: "audio/mpeg", label: `MP3 ${mp3Bitrate.replace("k", " kbps")}` };
      codecArgs.push("-c:a", "libmp3lame", "-b:a", mp3Bitrate);
      // The MP3 format is limited to 2 channels
      if (audio.channels > 2) codecArgs.push("-ac", "2");
    } else {
      target = { ext: "wav", mime: "audio/wav", label: "WAV PCM 16 bits" };
      codecArgs.push("-c:a", "pcm_s16le");
    }
    const outPath = `/extract_${Date.now()}.${target.ext}`;

    try {
      session = await getSession();
      setStatus("Préparation du fichier...");
      const input = await session.mountInput(videoFile.file, safeExtension(videoFile.name, "mp4"));
      cleanup = input.cleanup;
      setStatus(mode === "copy" ? "Copie de la piste audio..." : "Conversion de la piste audio...");
      const code = await session.exec(["-i", input.path, "-map", "0:a:0", "-vn", "-sn", "-dn", ...codecArgs, "-y", outPath], {
        duration,
        onProgress: (r) => setProgress(Math.round(r * 100)),
      });
      if (code !== 0) {
        console.error(session.getLogs().slice(-15).join("\n"));
        setError(
          mode === "copy"
            ? "La copie directe de la piste a échoué. Essayez la conversion en MP3."
            : "L'extraction a échoué : la piste audio est peut-être protégée (DRM) ou dans un format non pris en charge."
        );
        return;
      }
      setStatus("Lecture du résultat...");
      const data = await session.readFile(outPath);
      const blob = new Blob([data as BlobPart], { type: target.mime });
      if (blob.size === 0) {
        setError("Le fichier produit est vide : la piste audio de cette vidéo semble vide.");
        return;
      }
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        name: `${baseName(videoFile.name)}_audio.${target.ext}`,
        label: mode === "copy" ? `${target.label} d'origine (.${target.ext})` : target.label,
      });
      setProgress(100);
    } catch (e) {
      if (!cancelledRef.current) {
        console.error("Extraction error:", e);
        setError(
          "Erreur pendant l'extraction : la vidéo est peut-être trop lourde pour la mémoire du navigateur. Essayez la conversion en MP3 ou un fichier plus court."
        );
      }
      // The worker may be dead (cancelled or out of memory): a fresh one is created next time
      dropSession();
    } finally {
      if (session && !session.terminated) {
        if (cleanup) await cleanup();
        await session.deleteFile(outPath);
      }
      setExtracting(false);
      setStatus("");
    }
  };

  const cancelExtraction = () => {
    cancelledRef.current = true;
    dropSession();
  };

  const waveformTooLong = result ? duration > WAVEFORM_MAX_DURATION || (!duration && result.size > 100 * 1024 * 1024) : false;

  // Waveform of the extracted audio, decoded by the browser at a low sample rate (cheap in memory)
  useEffect(() => {
    if (!result) return;
    const canvas = waveformRef.current;
    if (!canvas) return;
    if (waveformTooLong) return;
    let cancelled = false;
    (async () => {
      try {
        setWaveformStatus("Calcul de la forme d'onde...");
        const buf = await (await fetch(result.url)).arrayBuffer();
        const ctxAudio = new OfflineAudioContext(1, 1, 8000);
        const audioBuffer = await ctxAudio.decodeAudioData(buf);
        if (cancelled) return;
        const data = audioBuffer.getChannelData(0);
        const ctx = canvas.getContext("2d")!;
        const { width, height } = canvas;
        const css = getComputedStyle(document.documentElement);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = css.getPropertyValue("--surface").trim() || "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = css.getPropertyValue("--primary").trim() || "#0d4f3c";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const step = Math.max(1, Math.ceil(data.length / width));
        const amp = height / 2;
        for (let i = 0; i < width; i++) {
          let min = 1;
          let max = -1;
          for (let j = 0; j < step; j++) {
            const v = data[i * step + j];
            if (v === undefined) break;
            if (v < min) min = v;
            if (v > max) max = v;
          }
          if (min > max) break;
          ctx.moveTo(i, (1 + min) * amp);
          ctx.lineTo(i, (1 + max) * amp);
        }
        ctx.stroke();
        ctx.strokeStyle = css.getPropertyValue("--muted").trim() || "#8a8578";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, amp);
        ctx.lineTo(width, amp);
        ctx.stroke();
        ctx.setLineDash([]);
        setWaveformStatus("");
      } catch {
        if (!cancelled) setWaveformStatus("Forme d'onde indisponible : ce format n'est pas décodable par votre navigateur (le fichier reste valide).");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result, waveformTooLong]);

  const reset = () => {
    fileTokenRef.current += 1;
    setVideoFile(null);
    setProbe(null);
    setProbing(false);
    setStatus("");
    setResult(null);
    setProgress(0);
    setError("");
    setWaveformStatus("");
    setPreviewError(false);
  };

  const modeOptions: { key: OutputMode; label: string; desc: string; disabled: boolean }[] = [
    {
      key: "copy",
      label: copy ? `Piste d'origine (.${copy.ext})` : "Piste d'origine",
      desc: copy
        ? "Copie sans réencodage : instantané et sans perte"
        : "Indisponible pour ce codec : choisissez MP3 ou WAV",
      disabled: !copy,
    },
    { key: "mp3", label: "MP3", desc: "Compatible partout, fichier léger", disabled: false },
    {
      key: "wav",
      label: "WAV",
      desc: wavEstimate > MAX_WAV_SIZE ? `Trop lourd ici (≈ ${formatSize(wavEstimate)})` : "Non compressé (PCM 16 bits), pour le montage",
      disabled: wavEstimate > MAX_WAV_SIZE,
    },
  ];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Audio
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Extracteur <span style={{ color: "var(--primary)" }}>Audio</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Extrayez la piste audio de vos vidéos sans réencodage (qualité d&apos;origine) ou convertissez-la en MP3 ou WAV. Traitement local avec FFmpeg : vos fichiers restent sur votre appareil.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Drop zone */}
            {!videoFile && (
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
                aria-label="Choisir une vidéo dont extraire l'audio"
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
                <p className="text-4xl">🎵</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Glissez une vidéo ici
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  MP4, MOV, WebM, MKV, AVI... jusqu&apos;à 500 Mo, ou cliquez pour parcourir
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border p-4 text-sm" role="alert" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                {error}
              </div>
            )}

            {/* Video info */}
            {videoFile && (
              <>
                <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Vidéo source
                    </h2>
                    <button
                      onClick={reset}
                      disabled={extracting}
                      className="text-xs font-semibold transition-colors hover:opacity-70 disabled:opacity-40"
                      style={{ color: "#dc2626" }}
                    >
                      Changer de vidéo
                    </button>
                  </div>
                  <div className="p-5">
                    {!previewError ? (
                      <video
                        src={videoFile.url}
                        controls
                        preload="metadata"
                        className="w-full rounded-xl"
                        style={{ maxHeight: "250px", background: "#000" }}
                        onLoadedMetadata={(e) => {
                          const d = e.currentTarget.duration;
                          if (Number.isFinite(d) && d > 0) {
                            setVideoFile((prev) => (prev && prev.url === videoFile.url ? { ...prev, duration: d } : prev));
                          }
                        }}
                        onError={() => setPreviewError(true)}
                      />
                    ) : (
                      <p className="rounded-xl p-4 text-xs" style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>
                        Aperçu indisponible : votre navigateur ne sait pas lire ce format (MKV, AVI...). L&apos;extraction avec FFmpeg reste possible.
                      </p>
                    )}
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: "Taille", value: formatSize(videoFile.size) },
                        { label: "Durée", value: duration ? formatDuration(duration) : probing ? "..." : "Inconnue" },
                        { label: "Format", value: safeExtension(videoFile.name, "?").toUpperCase() },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>{item.label}</p>
                          <p className="text-sm font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    {audio && (
                      <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                        Piste audio détectée : <strong className="text-[var(--foreground)]">{describeAudio(audio)}</strong>
                      </p>
                    )}
                  </div>
                </div>

                {/* Analysis in progress */}
                {probing && (
                  <div className="rounded-2xl border p-5 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--muted)" }}>
                    {status || "Analyse de la vidéo..."}
                  </div>
                )}

                {/* Output options */}
                {audio && !extracting && !result && (
                  <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Format de sortie
                    </h3>
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {modeOptions.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setMode(opt.key)}
                          disabled={opt.disabled}
                          aria-pressed={mode === opt.key}
                          className="rounded-xl border p-3 text-left transition-all disabled:opacity-50"
                          style={{
                            borderColor: mode === opt.key ? "var(--primary)" : "var(--border)",
                            background: mode === opt.key ? "rgba(13,79,60,0.04)" : "transparent",
                          }}
                        >
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{opt.desc}</p>
                        </button>
                      ))}
                    </div>

                    {mode === "mp3" && (
                      <>
                        <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                          Bitrate MP3
                        </h3>
                        <div className="mt-3 grid grid-cols-3 gap-3">
                          {(["128k", "192k", "320k"] as const).map((br) => (
                            <button
                              key={br}
                              onClick={() => setMp3Bitrate(br)}
                              aria-pressed={mp3Bitrate === br}
                              className="rounded-xl border p-2.5 text-center text-sm font-semibold transition-all"
                              style={{
                                borderColor: mp3Bitrate === br ? "var(--primary)" : "var(--border)",
                                background: mp3Bitrate === br ? "rgba(13,79,60,0.04)" : "transparent",
                              }}
                            >
                              {br.replace("k", " kbps")}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    <button
                      onClick={extractAudio}
                      className="mt-5 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "var(--primary)" }}
                    >
                      Extraire la piste audio
                    </button>
                  </div>
                )}

                {/* Progress */}
                {extracting && (
                  <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                        {status || "Extraction en cours..."}
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
                      {mode === "copy"
                        ? "La piste est copiée telle quelle : quelques secondes suffisent, même pour une longue vidéo."
                        : "La piste est réencodée par FFmpeg dans votre navigateur. Gardez cet onglet ouvert."}
                    </p>
                    <button
                      onClick={cancelExtraction}
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
                      Audio extrait : {result.label}
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>Vidéo originale</p>
                        <p className="text-sm font-bold mt-1">{formatSize(videoFile.size)}</p>
                      </div>
                      <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgba(22,163,74,0.3)", background: "rgba(22,163,74,0.06)" }}>
                        <p className="text-xs" style={{ color: "#16a34a" }}>Audio extrait</p>
                        <p className="text-sm font-bold mt-1" style={{ color: "#16a34a" }}>{formatSize(result.size)}</p>
                      </div>
                    </div>
                    <canvas
                      ref={waveformRef}
                      width={700}
                      height={100}
                      role="img"
                      aria-label="Forme d'onde de l'audio extrait"
                      className="mt-4 w-full rounded-xl border"
                      style={{ borderColor: "var(--border)", height: "100px" }}
                    />
                    {(waveformTooLong || waveformStatus) && (
                      <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                        {waveformTooLong ? "Piste trop longue pour afficher la forme d'onde (le fichier audio est bien disponible)." : waveformStatus}
                      </p>
                    )}
                    <div className="mt-4">
                      <audio key={result.url} controls preload="metadata" className="w-full" src={result.url} aria-label="Écouter l'audio extrait" />
                    </div>
                    <a
                      href={result.url}
                      download={result.name}
                      className="mt-4 block w-full rounded-xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:opacity-90"
                      style={{ background: "var(--primary)" }}
                    >
                      Télécharger l&apos;audio
                    </a>
                    <button
                      onClick={() => { setResult(null); setProgress(0); setWaveformStatus(""); }}
                      className="mt-2 w-full rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Extraire dans un autre format
                    </button>
                  </div>
                )}
              </>
            )}

            {!videoFile && !error && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-4xl">🎧</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Déposez une vidéo pour extraire l&apos;audio
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  La piste audio est analysée puis extraite avec FFmpeg, directement dans votre navigateur.
                </p>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>À propos de l&apos;extracteur</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">FFmpeg WebAssembly</strong> : la vidéo est lue par FFmpeg compilé en WebAssembly, directement dans votre navigateur. Le moteur (environ 30 Mo) est téléchargé une seule fois au premier usage.</p>
                <p><strong className="text-[var(--foreground)]">Sans réencodage</strong> : quand le codec le permet, la piste audio est copiée telle quelle dans le bon conteneur (AAC en .m4a, MP3 en .mp3, Opus ou Vorbis en .ogg, FLAC en .flac, PCM en .wav). Aucune perte de qualité, et c&apos;est quasi instantané.</p>
                <p><strong className="text-[var(--foreground)]">Conversion</strong> : MP3 (128, 192 ou 320 kbps) ou WAV PCM 16 bits si vous préférez un format universel.</p>
                <p><strong className="text-[var(--foreground)]">Limites</strong> : 500 Mo maximum par vidéo ; seule la première piste audio est extraite ; le WAV est refusé au-delà d&apos;environ 400 Mo estimés.</p>
                <p><strong className="text-[var(--foreground)]">100% local</strong> : aucun fichier n&apos;est envoyé sur un serveur.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment extraire l&apos;audio d&apos;une vidéo en ligne
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Cet outil récupère la bande son d&apos;une vidéo directement dans votre navigateur : musique d&apos;un clip, interview à transcrire, podcast filmé...
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Importez votre vidéo</strong> : glissez-déposez un fichier MP4, MOV, WebM, MKV ou AVI (500 Mo maximum).</li>
                  <li><strong className="text-[var(--foreground)]">Vérifiez la piste détectée</strong> : l&apos;outil affiche le codec audio trouvé (AAC, Opus, MP3...) et prévient si la vidéo n&apos;a pas de son.</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez le format</strong> : piste d&apos;origine (sans perte, instantané), MP3 ou WAV.</li>
                  <li><strong className="text-[var(--foreground)]">Téléchargez le résultat</strong> : écoutez l&apos;aperçu, visualisez la forme d&apos;onde puis téléchargez le fichier audio.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel format audio vais-je obtenir ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Avec l&apos;option « Piste d&apos;origine », vous récupérez exactement le son contenu dans la vidéo, dans le conteneur adapté : la plupart des vidéos MP4 et MOV de smartphone donnent un fichier .m4a (AAC), les vidéos WebM un fichier .ogg (Opus ou Vorbis). Si le codec ne peut pas être copié (AC-3, DTS, PCM big-endian...), choisissez MP3 ou WAV.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien de temps dure l&apos;extraction ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La copie de la piste d&apos;origine prend généralement quelques secondes, car rien n&apos;est réencodé. La conversion en MP3 ou WAV demande plus de calcul et dépend de la durée de la vidéo et de la puissance de votre appareil. Au premier usage, il faut aussi télécharger le moteur FFmpeg (environ 30 Mo).</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi un message « aucune piste audio » ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Certaines vidéos (captures d&apos;écran, GIF convertis, exports sans son) ne contiennent tout simplement pas de piste audio. L&apos;outil l&apos;indique dès l&apos;analyse plutôt que de produire un fichier vide.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Ma vidéo est-elle envoyée sur un serveur ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non, l&apos;extraction est entièrement réalisée dans votre navigateur. Seul le moteur FFmpeg est téléchargé ; vos fichiers vidéo ne quittent jamais votre appareil.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Formats</h3>
              <p className="mt-3 text-xs font-semibold" style={{ color: "var(--primary)" }}>Vidéos acceptées</p>
              <ul className="mt-1 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                {["MP4, M4V, MOV", "WebM", "MKV, AVI", "Autres formats lus par FFmpeg"].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span style={{ color: "var(--primary)" }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold" style={{ color: "var(--accent)" }}>Audio produit</p>
              <ul className="mt-1 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                {["Piste d'origine : M4A, MP3, OGG, FLAC ou WAV", "MP3 (128 à 320 kbps)", "WAV PCM 16 bits"].map((f) => (
                  <li key={f} className="flex gap-2">
                    <span style={{ color: "var(--accent)" }}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                500 Mo maximum par vidéo. L&apos;aperçu vidéo dépend de votre navigateur, pas l&apos;extraction.
              </p>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
