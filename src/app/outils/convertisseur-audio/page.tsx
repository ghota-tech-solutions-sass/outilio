"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface AudioFileInfo {
  name: string;
  size: number;
  type: string;
  duration: number;
  url: string;
  file: File;
}

type OutputFormat = "mp3" | "wav" | "ogg" | "aac";
type Bitrate = "128k" | "192k" | "256k" | "320k";

const FORMAT_OPTIONS: { key: OutputFormat; label: string; ext: string; mime: string }[] = [
  { key: "mp3", label: "MP3", ext: "mp3", mime: "audio/mpeg" },
  { key: "wav", label: "WAV", ext: "wav", mime: "audio/wav" },
  { key: "ogg", label: "OGG", ext: "ogg", mime: "audio/ogg" },
  { key: "aac", label: "AAC", ext: "aac", mime: "audio/aac" },
];

const BITRATE_OPTIONS: { key: Bitrate; label: string; desc: string }[] = [
  { key: "128k", label: "128 kbps", desc: "Standard" },
  { key: "192k", label: "192 kbps", desc: "Bonne qualite" },
  { key: "256k", label: "256 kbps", desc: "Haute qualite" },
  { key: "320k", label: "320 kbps", desc: "Maximale" },
];

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

export default function ConvertisseurAudio() {
  const [audioFile, setAudioFile] = useState<AudioFileInfo | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("mp3");
  const [bitrate, setBitrate] = useState<Bitrate>("192k");
  const [result, setResult] = useState<{ url: string; size: number; name: string } | null>(null);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (audioFile?.url) URL.revokeObjectURL(audioFile.url);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [audioFile, result]);

  // Register COI service worker for SharedArrayBuffer support
  useEffect(() => {
    if (typeof window !== "undefined" && !window.crossOriginIsolated) {
      const script = document.createElement("script");
      script.src = "/coi-serviceworker.js";
      document.head.appendChild(script);
    }
  }, []);

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current?.loaded) {
      setFfmpegLoaded(true);
      return true;
    }

    setFfmpegLoading(true);
    setProgressMessage("Chargement de FFmpeg...");

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.min(Math.round(p * 100), 100));
      });

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      ffmpegRef.current = ffmpeg;
      setFfmpegLoaded(true);
      setFfmpegLoading(false);
      setProgressMessage("");
      return true;
    } catch (e) {
      console.error("FFmpeg load error:", e);
      setError(
        "Impossible de charger FFmpeg. Verifiez que votre navigateur supporte SharedArrayBuffer (Chrome, Firefox, Edge recents)."
      );
      setFfmpegLoading(false);
      setProgressMessage("");
      return false;
    }
  }, []);

  const loadAudio = useCallback(async (file: File) => {
    setError("");
    setResult(null);
    setProgress(0);

    const audioTypes = [
      "audio/mpeg", "audio/mp3", "audio/wav", "audio/wave", "audio/x-wav",
      "audio/ogg", "audio/aac", "audio/flac", "audio/x-flac",
      "audio/mp4", "audio/x-m4a", "audio/webm", "audio/x-aiff",
    ];

    const isAudio = audioTypes.some((t) => file.type.startsWith(t.split("/")[0])) ||
      file.name.match(/\.(mp3|wav|ogg|aac|flac|m4a|webm|wma|aiff|opus)$/i);

    if (!isAudio) {
      setError("Seuls les fichiers audio sont acceptes (MP3, WAV, OGG, AAC, FLAC, etc.).");
      return;
    }

    const url = URL.createObjectURL(file);

    // Get audio duration
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.src = url;

    let duration = 0;
    try {
      await new Promise<void>((resolve, reject) => {
        audio.onloadedmetadata = () => {
          duration = audio.duration;
          resolve();
        };
        audio.onerror = () => reject(new Error("Impossible de lire l'audio."));
        setTimeout(() => resolve(), 3000); // Fallback timeout
      });
    } catch {
      // Duration unknown is acceptable
    }

    setAudioFile({
      name: file.name,
      size: file.size,
      type: file.type,
      duration: duration || 0,
      url,
      file,
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) loadAudio(file);
    },
    [loadAudio]
  );

  const convertAudio = async () => {
    if (!audioFile) return;

    setConverting(true);
    setProgress(0);
    setResult(null);
    setError("");
    setProgressMessage("Chargement de FFmpeg...");

    // Load FFmpeg if not already loaded
    const loaded = await loadFFmpeg();
    if (!loaded) {
      setConverting(false);
      return;
    }

    const ffmpeg = ffmpegRef.current;
    if (!ffmpeg) {
      setError("FFmpeg n'est pas charge.");
      setConverting(false);
      return;
    }

    setProgressMessage("Preparation du fichier...");
    setProgress(0);

    try {
      const { fetchFile } = await import("@ffmpeg/util");

      // Determine input extension
      const inputExt = audioFile.name.split(".").pop()?.toLowerCase() || "mp3";
      const inputFileName = `input.${inputExt}`;
      const formatInfo = FORMAT_OPTIONS.find((f) => f.key === outputFormat)!;
      const outputFileName = `output.${formatInfo.ext}`;

      // Write input file to FFmpeg virtual filesystem
      const inputData = await fetchFile(audioFile.file);
      await ffmpeg.writeFile(inputFileName, inputData);

      setProgressMessage("Conversion en cours...");

      // Build FFmpeg command based on output format
      const args: string[] = ["-i", inputFileName];

      switch (outputFormat) {
        case "mp3":
          args.push("-codec:a", "libmp3lame", "-b:a", bitrate);
          break;
        case "wav":
          args.push("-codec:a", "pcm_s16le");
          break;
        case "ogg":
          args.push("-codec:a", "libvorbis", "-b:a", bitrate);
          break;
        case "aac":
          args.push("-codec:a", "aac", "-b:a", bitrate);
          break;
      }

      args.push(outputFileName);

      // Execute conversion
      const exitCode = await ffmpeg.exec(args);

      if (exitCode !== 0) {
        setError("Erreur lors de la conversion. Essayez un format ou bitrate different.");
        setConverting(false);
        setProgressMessage("");
        return;
      }

      // Read output file
      const outputData = await ffmpeg.readFile(outputFileName);
      const outputBlob = new Blob([outputData], { type: formatInfo.mime });
      const resultUrl = URL.createObjectURL(outputBlob);

      const outputName = audioFile.name.replace(/\.[^.]+$/, `.${formatInfo.ext}`);

      setResult({
        url: resultUrl,
        size: outputBlob.size,
        name: outputName,
      });
      setProgress(100);

      // Cleanup virtual filesystem
      try {
        await ffmpeg.deleteFile(inputFileName);
        await ffmpeg.deleteFile(outputFileName);
      } catch {
        // Ignore cleanup errors
      }
    } catch (e) {
      console.error("Conversion error:", e);
      setError("Erreur lors de la conversion. Le format d'entree n'est peut-etre pas supporte.");
    }

    setConverting(false);
    setProgressMessage("");
  };

  const reset = () => {
    if (audioFile?.url) URL.revokeObjectURL(audioFile.url);
    if (result?.url) URL.revokeObjectURL(result.url);
    setAudioFile(null);
    setResult(null);
    setProgress(0);
    setError("");
    setProgressMessage("");
  };

  const getReduction = () => {
    if (!audioFile || !result) return null;
    if (result.size < audioFile.size) {
      return `-${Math.round((1 - result.size / audioFile.size) * 100)}%`;
    }
    return `+${Math.round((result.size / audioFile.size - 1) * 100)}%`;
  };

  const getInputFormat = () => {
    const ext = audioFile?.name.split(".").pop()?.toUpperCase();
    return ext || "N/A";
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Audio
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Convertisseur <span style={{ color: "var(--primary)" }}>Audio</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Convertissez vos fichiers audio entre MP3, WAV, OGG et AAC. Choisissez le bitrate et
            telechargez le resultat. 100% local, aucun envoi sur un serveur.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Drop zone */}
            {!audioFile && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className="animate-fade-up stagger-3 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all"
                style={{
                  borderColor: dragOver ? "var(--primary)" : "var(--border)",
                  background: dragOver ? "rgba(13,79,60,0.04)" : "var(--surface)",
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="audio/*,.mp3,.wav,.ogg,.aac,.flac,.m4a,.webm,.wma,.aiff,.opus"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && loadAudio(e.target.files[0])}
                />
                <p className="text-4xl">&#127925;</p>
                <p
                  className="mt-3 text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Glissez un fichier audio ici
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  MP3, WAV, OGG, AAC, FLAC, M4A ou cliquez pour parcourir
                </p>
              </div>
            )}

            {error && (
              <div
                className="rounded-xl border p-4 text-sm"
                style={{
                  background: "rgba(220,38,38,0.06)",
                  borderColor: "rgba(220,38,38,0.2)",
                  color: "#dc2626",
                }}
              >
                {error}
              </div>
            )}

            {/* Audio file info */}
            {audioFile && (
              <>
                <div
                  className="rounded-2xl border overflow-hidden"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div
                    className="px-5 py-3 border-b flex items-center justify-between"
                    style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
                  >
                    <h2
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                      style={{ color: "var(--accent)" }}
                    >
                      Fichier source
                    </h2>
                    <button
                      onClick={reset}
                      className="text-xs font-semibold transition-colors hover:opacity-70"
                      style={{ color: "#dc2626" }}
                    >
                      Changer de fichier
                    </button>
                  </div>
                  <div className="p-5">
                    <audio controls className="w-full" src={audioFile.url} />
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: "Taille", value: formatSize(audioFile.size) },
                        {
                          label: "Duree",
                          value: audioFile.duration ? formatDuration(audioFile.duration) : "N/A",
                        },
                        { label: "Format", value: getInputFormat() },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border p-3 text-center"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <p className="text-xs" style={{ color: "var(--muted)" }}>
                            {item.label}
                          </p>
                          <p
                            className="text-sm font-bold mt-1"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conversion options */}
                {!converting && !result && (
                  <div
                    className="rounded-2xl border p-5"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  >
                    {/* Output format selector */}
                    <h3
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                      style={{ color: "var(--accent)" }}
                    >
                      Format de sortie
                    </h3>
                    <div className="mt-3 grid grid-cols-4 gap-3">
                      {FORMAT_OPTIONS.map((fmt) => (
                        <button
                          key={fmt.key}
                          onClick={() => setOutputFormat(fmt.key)}
                          className="rounded-xl border p-3 text-center transition-all"
                          style={{
                            borderColor:
                              outputFormat === fmt.key ? "var(--primary)" : "var(--border)",
                            background:
                              outputFormat === fmt.key ? "rgba(13,79,60,0.04)" : "transparent",
                          }}
                        >
                          <p className="text-sm font-semibold">{fmt.label}</p>
                          <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--muted)" }}>
                            .{fmt.ext}
                          </p>
                        </button>
                      ))}
                    </div>

                    {/* Bitrate selector (hidden for WAV since it's lossless) */}
                    {outputFormat !== "wav" && (
                      <>
                        <h3
                          className="mt-5 text-xs font-semibold uppercase tracking-[0.15em]"
                          style={{ color: "var(--accent)" }}
                        >
                          Bitrate
                        </h3>
                        <div className="mt-3 grid grid-cols-4 gap-3">
                          {BITRATE_OPTIONS.map((br) => (
                            <button
                              key={br.key}
                              onClick={() => setBitrate(br.key)}
                              className="rounded-xl border p-3 text-center transition-all"
                              style={{
                                borderColor:
                                  bitrate === br.key ? "var(--primary)" : "var(--border)",
                                background:
                                  bitrate === br.key ? "rgba(13,79,60,0.04)" : "transparent",
                              }}
                            >
                              <p className="text-sm font-semibold">{br.label}</p>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: "var(--muted)" }}
                              >
                                {br.desc}
                              </p>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {outputFormat === "wav" && (
                      <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
                        Le format WAV est sans compression (PCM 16 bits). Le bitrate ne
                        s&apos;applique pas.
                      </p>
                    )}

                    <button
                      onClick={convertAudio}
                      disabled={ffmpegLoading}
                      className="mt-5 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: "var(--primary)" }}
                    >
                      {ffmpegLoading
                        ? "Chargement de FFmpeg..."
                        : `Convertir en ${FORMAT_OPTIONS.find((f) => f.key === outputFormat)!.label}`}
                    </button>
                  </div>
                )}

                {/* Progress */}
                {converting && (
                  <div
                    className="rounded-2xl border p-5"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className="text-xs font-semibold uppercase tracking-[0.15em]"
                        style={{ color: "var(--accent)" }}
                      >
                        {progressMessage || "Conversion en cours..."}
                      </h3>
                      <span
                        className="text-sm font-bold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div
                      className="w-full h-3 rounded-full overflow-hidden"
                      style={{ background: "var(--surface-alt)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, background: "var(--primary)" }}
                      />
                    </div>
                    <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                      La conversion utilise FFmpeg WebAssembly directement dans votre navigateur. Ne
                      fermez pas cet onglet.
                    </p>
                  </div>
                )}

                {/* Result */}
                {result && (
                  <div
                    className="rounded-2xl border p-5"
                    style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                  >
                    <h3
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                      style={{ color: "var(--accent)" }}
                    >
                      Resultat
                    </h3>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div
                        className="rounded-xl border p-3 text-center"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          Original
                        </p>
                        <p className="text-sm font-bold mt-1">{formatSize(audioFile.size)}</p>
                      </div>
                      <div
                        className="rounded-xl border p-3 text-center"
                        style={{
                          borderColor: "rgba(22,163,74,0.3)",
                          background: "rgba(22,163,74,0.06)",
                        }}
                      >
                        <p className="text-xs" style={{ color: "#16a34a" }}>
                          Converti
                        </p>
                        <p className="text-sm font-bold mt-1" style={{ color: "#16a34a" }}>
                          {formatSize(result.size)}
                        </p>
                      </div>
                      <div
                        className="rounded-xl border p-3 text-center"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          Difference
                        </p>
                        <p
                          className="text-sm font-bold mt-1"
                          style={{ color: "var(--primary)" }}
                        >
                          {getReduction()}
                        </p>
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
                      Telecharger le fichier converti
                    </a>
                    <button
                      onClick={() => {
                        if (result?.url) URL.revokeObjectURL(result.url);
                        setResult(null);
                        setProgress(0);
                      }}
                      className="mt-2 w-full rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Recommencer
                    </button>
                  </div>
                )}
              </>
            )}

            {!audioFile && !error && (
              <div
                className="animate-fade-up stagger-4 rounded-2xl border p-8 text-center"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <p className="text-4xl">&#127911;</p>
                <p
                  className="mt-3 text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Deposez un fichier audio pour commencer
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  La conversion se fait entierement dans votre navigateur grace a FFmpeg
                  WebAssembly.
                </p>
              </div>
            )}

            {/* About */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                A propos du convertisseur
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  <strong className="text-[var(--foreground)]">FFmpeg WebAssembly</strong> :
                  Utilise FFmpeg compile en WebAssembly pour une conversion audio de qualite
                  professionnelle directement dans votre navigateur.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">4 formats</strong> : MP3 (LAME),
                  WAV (PCM 16 bits), OGG (Vorbis), AAC. Choisissez le bitrate adapte a votre
                  besoin.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Bitrate ajustable</strong> : De
                  128 kbps (standard) a 320 kbps (maximale) pour les formats compresses.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">100% local</strong> : Aucun
                  fichier n&apos;est envoye sur un serveur. Tout se passe dans votre navigateur.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Formats supportes
              </h3>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                    Entree
                  </p>
                  <ul className="mt-1 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                    {["MP3", "WAV", "OGG", "AAC", "FLAC", "M4A", "WebM", "AIFF", "Opus"].map(
                      (fmt) => (
                        <li key={fmt} className="flex gap-2">
                          <span style={{ color: "var(--primary)" }}>&#10003;</span>
                          <span>{fmt}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    Sortie
                  </p>
                  <ul className="mt-1 space-y-1 text-xs" style={{ color: "var(--muted)" }}>
                    {FORMAT_OPTIONS.map((fmt) => (
                      <li key={fmt.key} className="flex gap-2">
                        <span style={{ color: "var(--accent)" }}>&#10003;</span>
                        <span>{fmt.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Conseils
              </h3>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>192 kbps est un bon equilibre qualite/taille</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>WAV est sans perte mais le fichier sera plus lourd</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>OGG Vorbis offre une bonne qualite a bitrate equivalent</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>Chrome, Firefox et Edge sont recommandes</span>
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
