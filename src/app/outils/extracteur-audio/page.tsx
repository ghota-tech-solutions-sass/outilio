"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface VideoFileInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
  url: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ExtracteurAudio() {
  const [videoFile, setVideoFile] = useState<VideoFileInfo | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      if (videoFile?.url) URL.revokeObjectURL(videoFile.url);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [videoFile, result]);

  const drawWaveform = useCallback(async (file: File) => {
    const canvas = waveformRef.current;
    if (!canvas) return;

    try {
      const audioCtx = new AudioContext();
      const buffer = await file.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(buffer);
      const data = audioBuffer.getChannelData(0);
      const ctx = canvas.getContext("2d")!;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background
      const computedStyle = getComputedStyle(document.documentElement);
      const surfaceColor = computedStyle.getPropertyValue("--surface").trim() || "#ffffff";
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);

      // Draw waveform
      const primaryColor = computedStyle.getPropertyValue("--primary").trim() || "#0d4f3c";
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1;
      ctx.beginPath();

      const step = Math.ceil(data.length / width);
      const amp = height / 2;
      for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
          const datum = data[i * step + j];
          if (datum !== undefined) {
            if (datum < min) min = datum;
            if (datum > max) max = datum;
          }
        }
        ctx.moveTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
      }
      ctx.stroke();

      // Center line
      const mutedColor = computedStyle.getPropertyValue("--muted").trim() || "#8a8578";
      ctx.strokeStyle = mutedColor;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, amp);
      ctx.lineTo(width, amp);
      ctx.stroke();
      ctx.setLineDash([]);

      audioCtx.close();
    } catch {
      // Waveform drawing is optional; silently fail
    }
  }, []);

  const loadVideo = useCallback(async (file: File) => {
    setError("");
    setResult(null);
    setProgress(0);

    if (!file.type.startsWith("video/")) {
      setError("Seuls les fichiers video sont acceptes.");
      return;
    }

    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;

    try {
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Impossible de lire la video."));
      });
    } catch {
      setError("Impossible de lire cette video.");
      return;
    }

    setVideoFile({
      name: file.name,
      size: file.size,
      type: file.type,
      duration: video.duration,
      url,
    });

    // Draw waveform in background
    drawWaveform(file);
  }, [drawWaveform]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) loadVideo(file);
    },
    [loadVideo]
  );

  const extractAudio = async () => {
    if (!videoFile || !videoRef.current) return;

    setExtracting(true);
    setProgress(0);
    setResult(null);
    setError("");
    abortRef.current = false;

    const video = videoRef.current;
    video.currentTime = 0;
    video.muted = false;

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
      video.currentTime = 0;
    });

    let audioCtx: AudioContext;
    let source: MediaElementAudioSourceNode;
    let dest: MediaStreamAudioDestinationNode;

    try {
      audioCtx = new AudioContext();
      source = audioCtx.createMediaElementSource(video);
      dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      // Don't connect to speakers to avoid playback noise
    } catch (e) {
      setError("Impossible d'acceder a la piste audio. La video ne contient peut-etre pas d'audio.");
      setExtracting(false);
      return;
    }

    const mimeTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
    ];
    let selectedMime = "";
    for (const mime of mimeTypes) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    if (!selectedMime) {
      setError("Votre navigateur ne supporte pas l'extraction audio. Essayez Chrome ou Firefox.");
      setExtracting(false);
      audioCtx.close();
      return;
    }

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(dest.stream, { mimeType: selectedMime });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const done = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    recorder.start(100);
    video.play();

    // Track progress
    const progressInterval = setInterval(() => {
      if (abortRef.current) {
        clearInterval(progressInterval);
        return;
      }
      const pct = Math.min((video.currentTime / videoFile.duration) * 100, 100);
      setProgress(pct);
    }, 200);

    video.onended = () => {
      clearInterval(progressInterval);
      if (recorder.state === "recording") recorder.stop();
    };

    // Handle abort
    const checkAbort = setInterval(() => {
      if (abortRef.current) {
        clearInterval(checkAbort);
        clearInterval(progressInterval);
        video.pause();
        if (recorder.state === "recording") recorder.stop();
      }
    }, 200);

    await done;
    clearInterval(checkAbort);
    clearInterval(progressInterval);

    // Disconnect audio
    try {
      source.disconnect();
      audioCtx.close();
    } catch {
      // ignore
    }

    if (abortRef.current) {
      setExtracting(false);
      return;
    }

    const ext = selectedMime.includes("ogg") ? "ogg" : "webm";
    const blob = new Blob(chunks, { type: selectedMime });
    const resultUrl = URL.createObjectURL(blob);
    setResult({
      url: resultUrl,
      size: blob.size,
      name: videoFile.name.replace(/\.[^.]+$/, `_audio.${ext}`),
    });
    setProgress(100);
    setExtracting(false);
  };

  const cancelExtraction = () => {
    abortRef.current = true;
  };

  const reset = () => {
    if (videoFile?.url) URL.revokeObjectURL(videoFile.url);
    if (result?.url) URL.revokeObjectURL(result.url);
    setVideoFile(null);
    setResult(null);
    setProgress(0);
    setError("");
  };

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
            Extrayez la piste audio de vos videos. Visualisation de la forme d&apos;onde et telechargement du fichier audio.
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
                className="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all"
                style={{
                  borderColor: dragOver ? "var(--primary)" : "var(--border)",
                  background: dragOver ? "rgba(13,79,60,0.04)" : "var(--surface)",
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && loadVideo(e.target.files[0])}
                />
                <p className="text-4xl">&#127925;</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Glissez une video ici
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  MP4, WebM, MOV ou cliquez pour parcourir
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border p-4 text-sm" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                {error}
              </div>
            )}

            {/* Video info */}
            {videoFile && (
              <>
                <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Video source
                    </h2>
                    <button
                      onClick={reset}
                      className="text-xs font-semibold transition-colors hover:opacity-70"
                      style={{ color: "#dc2626" }}
                    >
                      Changer de video
                    </button>
                  </div>
                  <div className="p-5">
                    <video
                      ref={videoRef}
                      src={videoFile.url}
                      controls
                      className="w-full rounded-xl"
                      style={{ maxHeight: "250px", background: "#000" }}
                    />
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: "Taille", value: formatSize(videoFile.size) },
                        { label: "Duree", value: formatDuration(videoFile.duration) },
                        { label: "Format", value: videoFile.type.split("/")[1]?.toUpperCase() || "N/A" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>{item.label}</p>
                          <p className="text-sm font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Waveform */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Forme d&apos;onde
                    </h2>
                  </div>
                  <div className="p-5">
                    <canvas
                      ref={waveformRef}
                      width={700}
                      height={120}
                      className="w-full rounded-xl border"
                      style={{ borderColor: "var(--border)", height: "120px" }}
                    />
                    <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                      Apercu de la forme d&apos;onde audio du fichier video.
                    </p>
                  </div>
                </div>

                {/* Extract button */}
                {!extracting && !result && (
                  <button
                    onClick={extractAudio}
                    className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "var(--primary)" }}
                  >
                    Extraire la piste audio
                  </button>
                )}

                {/* Progress */}
                {extracting && (
                  <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                        Extraction en cours...
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
                      La piste audio est en cours d&apos;extraction. La video est lue en accelere pour capturer l&apos;audio.
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
                      Audio extrait
                    </h3>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>Video originale</p>
                        <p className="text-sm font-bold mt-1">{formatSize(videoFile.size)}</p>
                      </div>
                      <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgba(22,163,74,0.3)", background: "rgba(22,163,74,0.06)" }}>
                        <p className="text-xs" style={{ color: "#16a34a" }}>Audio extrait</p>
                        <p className="text-sm font-bold mt-1" style={{ color: "#16a34a" }}>{formatSize(result.size)}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <audio controls className="w-full" src={result.url} />
                    </div>
                    <a
                      href={result.url}
                      download={result.name}
                      className="mt-4 block w-full rounded-xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:opacity-90"
                      style={{ background: "var(--primary)" }}
                    >
                      Telecharger l&apos;audio
                    </a>
                    <button
                      onClick={() => { setResult(null); setProgress(0); }}
                      className="mt-2 w-full rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Recommencer
                    </button>
                  </div>
                )}
              </>
            )}

            {!videoFile && !error && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-4xl">&#127911;</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Deposez une video pour extraire l&apos;audio
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  La piste audio sera extraite et proposee en telechargement.
                </p>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A propos de l&apos;extracteur</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Web Audio API</strong> : Utilise l&apos;API Web Audio pour capturer la piste audio de la video.</p>
                <p><strong className="text-[var(--foreground)]">Forme d&apos;onde</strong> : Visualisation de l&apos;amplitude sonore du fichier.</p>
                <p><strong className="text-[var(--foreground)]">Format de sortie</strong> : WebM audio (Opus) pour une qualite optimale.</p>
                <p><strong className="text-[var(--foreground)]">100% local</strong> : Aucun fichier n&apos;est envoye sur un serveur. Tout se passe dans votre navigateur.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Formats supportes</h3>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>MP4 (H.264, H.265)</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>WebM (VP8, VP9)</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>MOV (QuickTime)</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>AVI</span>
                </li>
              </ul>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                La compatibilite depend de votre navigateur.
              </p>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
