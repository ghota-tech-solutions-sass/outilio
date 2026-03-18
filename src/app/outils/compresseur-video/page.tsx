"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface VideoInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
  width: number;
  height: number;
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

export default function CompresseurVideo() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState<"high" | "medium" | "low">("medium");
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    return () => {
      if (videoInfo?.url) URL.revokeObjectURL(videoInfo.url);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [videoInfo, result]);

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

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Impossible de lire la video."));
    });

    setVideoInfo({
      name: file.name,
      size: file.size,
      type: file.type,
      duration: video.duration,
      width: video.videoWidth,
      height: video.videoHeight,
      url,
    });
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

  const compress = async () => {
    if (!videoInfo || !videoRef.current || !canvasRef.current) return;

    setCompressing(true);
    setProgress(0);
    setResult(null);
    setError("");
    abortRef.current = false;

    const bitrateMap = { high: 2500000, medium: 1000000, low: 500000 };
    const bitrate = bitrateMap[quality];

    const scaleMap = { high: 1, medium: 0.75, low: 0.5 };
    const scale = scaleMap[quality];

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const cw = Math.round(videoInfo.width * scale);
    const ch = Math.round(videoInfo.height * scale);
    canvas.width = cw;
    canvas.height = ch;

    const ctx = canvas.getContext("2d")!;
    video.currentTime = 0;
    video.muted = true;

    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
      video.currentTime = 0;
    });

    // Use canvas stream + audio from video
    const canvasStream = canvas.captureStream(30);
    try {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(video);
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      source.connect(audioCtx.destination);
      const audioTrack = dest.stream.getAudioTracks()[0];
      if (audioTrack) canvasStream.addTrack(audioTrack);
    } catch {
      // Video may not have audio, continue without it
    }

    const mimeTypes = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];
    let selectedMime = "";
    for (const mime of mimeTypes) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(mime)) {
        selectedMime = mime;
        break;
      }
    }

    if (!selectedMime) {
      setError("Votre navigateur ne supporte pas la compression video. Essayez Chrome ou Firefox.");
      setCompressing(false);
      return;
    }

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(canvasStream, {
      mimeType: selectedMime,
      videoBitsPerSecond: bitrate,
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const done = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    recorder.start(100);

    video.play();

    // Draw frames to canvas
    const drawFrame = () => {
      if (abortRef.current || video.ended || video.paused) {
        recorder.stop();
        video.pause();
        return;
      }
      ctx.drawImage(video, 0, 0, cw, ch);
      const pct = Math.min((video.currentTime / videoInfo.duration) * 100, 100);
      setProgress(pct);
      requestAnimationFrame(drawFrame);
    };

    video.onended = () => {
      if (recorder.state === "recording") recorder.stop();
    };

    drawFrame();
    await done;

    if (abortRef.current) {
      setCompressing(false);
      return;
    }

    const blob = new Blob(chunks, { type: selectedMime });
    const resultUrl = URL.createObjectURL(blob);
    const ext = selectedMime.includes("webm") ? "webm" : "mp4";
    setResult({
      url: resultUrl,
      size: blob.size,
      name: videoInfo.name.replace(/\.[^.]+$/, `_compresse.${ext}`),
    });
    setProgress(100);
    setCompressing(false);
  };

  const cancelCompression = () => {
    abortRef.current = true;
  };

  const reset = () => {
    if (videoInfo?.url) URL.revokeObjectURL(videoInfo.url);
    if (result?.url) URL.revokeObjectURL(result.url);
    setVideoInfo(null);
    setResult(null);
    setProgress(0);
    setError("");
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Video
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Compresseur <span style={{ color: "var(--primary)" }}>Video</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Reduisez la taille de vos videos directement dans le navigateur. Choisissez le niveau de qualite souhaite.
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
                <p className="text-4xl">&#127910;</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Glissez une video ici
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  MP4, WebM, MOV, AVI ou cliquez pour parcourir
                </p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border p-4 text-sm" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                {error}
              </div>
            )}

            {/* Video info */}
            {videoInfo && (
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
                      src={videoInfo.url}
                      controls
                      className="w-full rounded-xl"
                      style={{ maxHeight: "300px", background: "#000" }}
                      crossOrigin="anonymous"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: "Taille", value: formatSize(videoInfo.size) },
                        { label: "Duree", value: formatDuration(videoInfo.duration) },
                        { label: "Resolution", value: `${videoInfo.width}x${videoInfo.height}` },
                        { label: "Format", value: videoInfo.type.split("/")[1]?.toUpperCase() || "N/A" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>{item.label}</p>
                          <p className="text-sm font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quality selector */}
                {!compressing && !result && (
                  <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Qualite de compression
                    </h3>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {([
                        { key: "high", label: "Haute", desc: "Qualite proche de l'original", bitrate: "2.5 Mbps" },
                        { key: "medium", label: "Moyenne", desc: "Bon equilibre taille/qualite", bitrate: "1 Mbps" },
                        { key: "low", label: "Basse", desc: "Taille minimale", bitrate: "0.5 Mbps" },
                      ] as const).map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setQuality(opt.key)}
                          className="rounded-xl border p-4 text-left transition-all"
                          style={{
                            borderColor: quality === opt.key ? "var(--primary)" : "var(--border)",
                            background: quality === opt.key ? "rgba(13,79,60,0.04)" : "transparent",
                          }}
                        >
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{opt.desc}</p>
                          <p className="text-xs mt-1 font-mono" style={{ color: "var(--primary)" }}>{opt.bitrate}</p>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={compress}
                      className="mt-4 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "var(--primary)" }}
                    >
                      Compresser la video
                    </button>
                  </div>
                )}

                {/* Progress */}
                {compressing && (
                  <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                        Compression en cours...
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
                      La video est en cours de re-encodage dans votre navigateur. Ne fermez pas cet onglet.
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
                      Resultat
                    </h3>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>Original</p>
                        <p className="text-sm font-bold mt-1">{formatSize(videoInfo.size)}</p>
                      </div>
                      <div className="rounded-xl border p-3 text-center" style={{ borderColor: "rgba(22,163,74,0.3)", background: "rgba(22,163,74,0.06)" }}>
                        <p className="text-xs" style={{ color: "#16a34a" }}>Compresse</p>
                        <p className="text-sm font-bold mt-1" style={{ color: "#16a34a" }}>{formatSize(result.size)}</p>
                      </div>
                      <div className="rounded-xl border p-3 text-center" style={{ borderColor: "var(--border)" }}>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>Reduction</p>
                        <p className="text-sm font-bold mt-1" style={{ color: "var(--primary)" }}>
                          {result.size < videoInfo.size
                            ? `-${Math.round((1 - result.size / videoInfo.size) * 100)}%`
                            : `+${Math.round((result.size / videoInfo.size - 1) * 100)}%`}
                        </p>
                      </div>
                    </div>
                    <a
                      href={result.url}
                      download={result.name}
                      className="mt-4 block w-full rounded-xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:opacity-90"
                      style={{ background: "var(--primary)" }}
                    >
                      Telecharger la video compressee
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

            {!videoInfo && !error && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-4xl">&#127909;</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Deposez une video pour commencer
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  La compression se fait entierement dans votre navigateur.
                </p>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A propos du compresseur</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">MediaRecorder API</strong> : Utilise les capacites natives du navigateur pour re-encoder la video a un debit inferieur.</p>
                <p><strong className="text-[var(--foreground)]">3 niveaux de qualite</strong> : Haute (2.5 Mbps), Moyenne (1 Mbps), Basse (0.5 Mbps).</p>
                <p><strong className="text-[var(--foreground)]">100% local</strong> : Aucun fichier n&apos;est envoye sur un serveur. Tout se passe dans votre navigateur.</p>
                <p><strong className="text-[var(--foreground)]">Format de sortie</strong> : WebM (VP9/VP8) selon la compatibilite de votre navigateur.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conseils</h3>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>Chrome et Firefox offrent les meilleurs resultats</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>Les videos courtes se compressent plus rapidement</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>La qualite &quot;Moyenne&quot; est recommandee pour la plupart des usages</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>Le format de sortie est WebM</span>
                </li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
