"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import { parseProbe, readWavDuration } from "@/lib/ffmpeg";

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
  { key: "192k", label: "192 kbps", desc: "Bonne qualité" },
  { key: "256k", label: "256 kbps", desc: "Haute qualité" },
  { key: "320k", label: "320 kbps", desc: "Maximale" },
];

const MAX_FILE_SIZE = 500 * 1024 * 1024;
const FFMPEG_CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

async function toBlobURL(url: string, type: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  return URL.createObjectURL(new Blob([buf], { type }));
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
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null);
  const logsRef = useRef<string[]>([]);

  // Revoke each object URL when it is replaced or on unmount (one effect per URL)
  const sourceUrl = audioFile?.url;
  const resultUrl = result?.url;
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  // Terminate the FFmpeg worker when leaving the page
  useEffect(() => {
    return () => {
      try {
        ffmpegRef.current?.terminate();
      } catch {
        // ignore
      }
    };
  }, []);

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current?.loaded) {
      return true;
    }

    setFfmpegLoading(true);
    setProgressMessage("Chargement de FFmpeg...");

    try {
      // UMD build served from /public/ffmpeg (the npm ESM build breaks once bundled by Next.js)
      await new Promise<void>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).FFmpegWASM) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = "/ffmpeg/ffmpeg.js";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Échec du chargement de /ffmpeg/ffmpeg.js"));
        document.head.appendChild(s);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { FFmpeg } = (window as any).FFmpegWASM;
      const ffmpeg = new FFmpeg();

      ffmpeg.on("log", ({ message }: { message: string }) => {
        logsRef.current.push(message);
        if (logsRef.current.length > 300) logsRef.current.shift();
      });
      ffmpeg.on("progress", ({ progress: p }: { progress: number }) => {
        if (Number.isFinite(p)) setProgress(Math.max(0, Math.min(Math.round(p * 100), 100)));
      });

      setProgressMessage("Téléchargement du moteur de conversion...");
      const [coreURL, wasmURL] = await Promise.all([
        toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
        toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
      ]);
      await ffmpeg.load({ coreURL, wasmURL });

      ffmpegRef.current = ffmpeg;
      setFfmpegLoading(false);
      setProgressMessage("");
      return true;
    } catch (e) {
      console.error("FFmpeg load error:", e);
      setError(
        "Impossible de charger le moteur de conversion (FFmpeg). Vérifiez votre connexion internet ou désactivez un éventuel bloqueur de scripts, puis réessayez."
      );
      setFfmpegLoading(false);
      setProgressMessage("");
      return false;
    }
  }, []);

  const loadAudio = useCallback((file: File) => {
    setError("");
    setResult(null);
    setProgress(0);

    const isAudio = file.type.startsWith("audio/") ||
      /\.(mp3|wav|ogg|oga|aac|flac|m4a|webm|wma|aif|aiff|opus)$/i.test(file.name);

    if (!isAudio) {
      setError("Seuls les fichiers audio sont acceptés (MP3, WAV, OGG, AAC, FLAC, M4A, etc.).");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Fichier trop volumineux : 500 Mo maximum pour une conversion dans le navigateur.");
      return;
    }

    // Duration: <audio> player metadata (deferred by Chrome in background tabs and absent for codecs the
    // browser cannot play), WAV header, then the FFmpeg logs of the conversion as a last resort
    setAudioFile({
      name: file.name,
      size: file.size,
      type: file.type,
      duration: 0,
      url: URL.createObjectURL(file),
      file,
    });
    readWavDuration(file).then((d) => {
      if (d > 0) setAudioFile((prev) => (prev && prev.file === file && !prev.duration ? { ...prev, duration: d } : prev));
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
      setError("FFmpeg n'est pas chargé.");
      setConverting(false);
      return;
    }

    setProgressMessage("Préparation du fichier...");
    setProgress(0);

    // Keep a safe ASCII extension for the virtual filesystem
    const rawExt = audioFile.name.includes(".") ? audioFile.name.split(".").pop()!.toLowerCase() : "";
    const inputExt = /^[a-z0-9]{1,5}$/.test(rawExt) ? rawExt : "bin";
    const inputFileName = `input.${inputExt}`;
    const formatInfo = FORMAT_OPTIONS.find((f) => f.key === outputFormat)!;
    const outputFileName = `output.${formatInfo.ext}`;

    // -vn drops embedded cover art (MP3/M4A) that would otherwise break OGG/AAC output
    const buildArgs = (vorbisQualityFallback = false): string[] => {
      const args: string[] = ["-i", inputFileName, "-vn"];
      switch (outputFormat) {
        case "mp3":
          args.push("-codec:a", "libmp3lame", "-b:a", bitrate);
          break;
        case "wav":
          args.push("-codec:a", "pcm_s16le");
          break;
        case "ogg":
          // Vorbis refuses some bitrates at low sample rates: fall back to VBR quality
          if (vorbisQualityFallback) args.push("-codec:a", "libvorbis", "-q:a", "6");
          else args.push("-codec:a", "libvorbis", "-b:a", bitrate);
          break;
        case "aac":
          args.push("-codec:a", "aac", "-b:a", bitrate);
          break;
      }
      args.push("-y", outputFileName);
      return args;
    };

    try {
      // Write input file to FFmpeg virtual filesystem
      await ffmpeg.writeFile(inputFileName, new Uint8Array(await audioFile.file.arrayBuffer()));

      setProgressMessage("Conversion en cours...");

      logsRef.current = [];
      let exitCode = await ffmpeg.exec(buildArgs());
      const probed = parseProbe(logsRef.current).duration;
      if (probed > 0) {
        const src = audioFile.file;
        setAudioFile((prev) => (prev && prev.file === src && !prev.duration ? { ...prev, duration: probed } : prev));
      }
      if (exitCode !== 0 && outputFormat === "ogg") {
        exitCode = await ffmpeg.exec(buildArgs(true));
      }

      if (exitCode !== 0) {
        setError(
          "La conversion a échoué. Le fichier est peut-être protégé (DRM), corrompu ou dans un format non pris en charge. Essayez un autre format de sortie."
        );
        return;
      }

      // Read output file
      const outputData = await ffmpeg.readFile(outputFileName);
      const outputBlob = new Blob([outputData], { type: formatInfo.mime });

      if (outputBlob.size === 0) {
        setError("La conversion n'a produit aucun son. Le fichier contient-il bien une piste audio ?");
        return;
      }

      const baseName = audioFile.name.includes(".") ? audioFile.name.replace(/\.[^.]+$/, "") : audioFile.name;

      setResult({
        url: URL.createObjectURL(outputBlob),
        size: outputBlob.size,
        name: `${baseName}.${formatInfo.ext}`,
      });
      setProgress(100);
    } catch (e) {
      console.error("Conversion error:", e);
      setError(
        "Erreur lors de la conversion. Le fichier est peut-être trop volumineux pour la mémoire du navigateur ou dans un format non pris en charge."
      );
      // The worker may be dead (e.g. out of memory): force a fresh instance next time
      try {
        ffmpeg.terminate();
      } catch {
        // ignore
      }
      ffmpegRef.current = null;
    } finally {
      // Always clean the virtual filesystem, even after a failure
      if (ffmpegRef.current) {
        for (const f of [inputFileName, outputFileName]) {
          try {
            await ffmpeg.deleteFile(f);
          } catch {
            // file may not exist
          }
        }
      }
      setConverting(false);
      setProgressMessage("");
    }
  };

  // loadedmetadata or durationchange (some files report an infinite duration first)
  const updateDurationFromPlayer = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const el = e.currentTarget;
    const d = el.duration;
    const url = el.currentSrc || el.src;
    if (Number.isFinite(d) && d > 0) {
      setAudioFile((prev) => (prev && prev.url === url ? { ...prev, duration: d } : prev));
    }
  };

  const reset = () => {
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
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
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
            téléchargez le résultat. 100% local : vos fichiers ne sont envoyés sur aucun serveur.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Choisir un fichier audio à convertir"
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
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) loadAudio(f);
                  }}
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
                      disabled={converting}
                      className="text-xs font-semibold transition-colors hover:opacity-70 disabled:opacity-40"
                      style={{ color: "#dc2626" }}
                    >
                      Changer de fichier
                    </button>
                  </div>
                  <div className="p-5">
                    <audio
                      controls
                      className="w-full"
                      src={audioFile.url}
                      aria-label="Écouter le fichier source"
                      preload="metadata"
                      onLoadedMetadata={updateDurationFromPlayer}
                      onDurationChange={updateDurationFromPlayer}
                    />
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: "Taille", value: formatSize(audioFile.size) },
                        {
                          label: "Durée",
                          value: audioFile.duration ? formatDuration(audioFile.duration) : "Inconnue",
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
                          aria-pressed={outputFormat === fmt.key}
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
                              aria-pressed={bitrate === br.key}
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
                      Résultat
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
                          Différence
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
                      <audio key={result.url} controls preload="metadata" className="w-full" src={result.url} aria-label="Écouter le fichier converti" />
                    </div>
                    <a
                      href={result.url}
                      download={result.name}
                      className="mt-4 block w-full rounded-xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:opacity-90"
                      style={{ background: "var(--primary)" }}
                    >
                      Télécharger le fichier converti
                    </a>
                    <button
                      onClick={() => {
                        setResult(null);
                        setProgress(0);
                      }}
                      className="mt-2 w-full rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Convertir dans un autre format
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
                  Déposez un fichier audio pour commencer
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  La conversion se fait entièrement dans votre navigateur grâce à FFmpeg
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
                À propos du convertisseur
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  <strong className="text-[var(--foreground)]">FFmpeg WebAssembly</strong> :
                  Utilise FFmpeg compilé en WebAssembly pour une conversion audio de qualité
                  professionnelle directement dans votre navigateur.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">4 formats</strong> : MP3 (LAME),
                  WAV (PCM 16 bits), OGG (Vorbis), AAC. Choisissez le bitrate adapté à votre
                  besoin.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Bitrate ajustable</strong> : De
                  128 kbps (standard) à 320 kbps (maximale) pour les formats compressés.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">100% local</strong> : Aucun
                  fichier n&apos;est envoyé sur un serveur. Tout se passe dans votre navigateur.
                </p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le convertisseur audio en ligne
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Notre convertisseur audio gratuit vous permet de transformer vos fichiers sonores d&apos;un format à un autre directement depuis votre navigateur, sans installation ni inscription. L&apos;outil prend en charge les formats les plus courants : MP3, WAV, OGG, AAC, FLAC et bien d&apos;autres.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Déposez votre fichier</strong> : glissez un fichier audio dans la zone de dépôt ou cliquez pour le sélectionner depuis votre ordinateur.</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez le format de sortie</strong> : sélectionnez parmi MP3, WAV, OGG ou AAC selon votre besoin.</li>
                  <li><strong className="text-[var(--foreground)]">Ajustez le bitrate</strong> : pour les formats compressés, choisissez entre 128 kbps (taille réduite) et 320 kbps (qualité maximale).</li>
                  <li><strong className="text-[var(--foreground)]">Lancez la conversion</strong> : cliquez sur le bouton de conversion et attendez quelques secondes. Téléchargez ensuite le fichier converti.</li>
                </ul>
                <p>
                  La conversion s&apos;effectue entièrement dans votre navigateur grâce à la technologie FFmpeg WebAssembly. Vos fichiers audio ne sont envoyés sur aucun serveur distant : ils restent sur votre appareil.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la différence entre MP3 et WAV ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Le MP3 est un format compressé avec perte : il réduit la taille du fichier en supprimant certaines fréquences inaudibles. Le WAV est un format non compressé (PCM 16 bits) qui conserve toute la qualité audio d&apos;origine, mais produit des fichiers beaucoup plus volumineux. Pour la musique et les podcasts, le MP3 à 192 ou 320 kbps offre un excellent compromis qualité/taille.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Mes fichiers audio sont-ils envoyés sur un serveur ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Non. La conversion est réalisée à 100 % dans votre navigateur grâce à FFmpeg compilé en WebAssembly. Vos fichiers ne quittent jamais votre appareil. C&apos;est idéal pour les enregistrements confidentiels ou les fichiers volumineux que vous ne souhaitez pas télécharger vers un service tiers.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel bitrate choisir pour une bonne qualité ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour une écoute standard (podcasts, musique de fond), 128 kbps est suffisant. Pour une bonne qualité musicale, 192 kbps est recommandé. Pour une qualité audiophile ou un archivage, choisissez 320 kbps. Le format WAV n&apos;utilise pas de compression et offre la meilleure fidélité, mais les fichiers seront nettement plus lourds.
                  </p>
                </div>
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
                Formats supportés
              </h3>
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                    Entrée
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
                  <span>192 kbps est un bon équilibre qualité/taille</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>WAV est sans perte mais le fichier sera plus lourd</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>OGG Vorbis offre une bonne qualité à bitrate équivalent</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#8226;</span>
                  <span>Chrome, Firefox et Edge sont recommandés</span>
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
