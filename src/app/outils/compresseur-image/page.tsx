"use client";

import { useState, useRef, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
}

/** Size in bytes of the data encoded in a base64 data URL (without decoding it) */
function dataURLByteSize(dataURL: string): number {
  const b64 = dataURL.slice(dataURL.indexOf(",") + 1);
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - padding);
}

/** Actual MIME type produced (browsers silently fall back to PNG for unsupported formats) */
function dataURLMime(dataURL: string): string {
  return dataURL.slice(5, dataURL.indexOf(";"));
}

export default function CompresseurImage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalURL, setOriginalURL] = useState("");
  const [compressedURL, setCompressedURL] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState<"image/jpeg" | "image/webp">("image/jpeg");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [outputMime, setOutputMime] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const compress = useCallback((img: HTMLImageElement, q: number, fmt: "image/jpeg" | "image/webp") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // JPEG has no alpha channel: transparent areas would turn black without a white background
    if (fmt === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL(fmt, q / 100);
    if (dataURL.length < 30) {
      setError("Image trop grande pour être traitée par votre navigateur.");
      return;
    }
    setError("");
    setCompressedURL(dataURL);
    setCompressedSize(dataURLByteSize(dataURL));
    setOutputMime(dataURLMime(dataURL));
  }, []);

  const handleFile = useCallback((file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Ce fichier n'est pas une image. Formats acceptés : JPEG, PNG, WebP.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setOriginalFile(file);
        setOriginalSize(file.size);
        setOriginalURL(url);
        compress(img, quality, format);
      };
      img.onerror = () => {
        setError("Impossible de lire cette image. Le format (HEIC, TIFF...) n'est peut-être pas pris en charge par votre navigateur : convertissez-la d'abord en JPEG ou PNG.");
      };
      img.src = url;
    };
    reader.onerror = () => setError("Impossible de lire ce fichier.");
    reader.readAsDataURL(file);
  }, [quality, format, compress]);

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (imgRef.current) compress(imgRef.current, q, format);
  };

  const handleFormatChange = (fmt: "image/jpeg" | "image/webp") => {
    setFormat(fmt);
    if (imgRef.current) compress(imgRef.current, quality, fmt);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const download = () => {
    if (!compressedURL || !originalFile) return;
    // Use the format really produced (e.g. PNG if the browser cannot encode WebP)
    const ext = outputMime === "image/webp" ? "webp" : outputMime === "image/png" ? "png" : "jpg";
    const link = document.createElement("a");
    link.download = originalFile.name.replace(/\.[^.]+$/, "") + `-compresse.${ext}`;
    link.href = compressedURL;
    link.click();
  };

  const ratio = originalSize > 0 ? ((1 - compressedSize / originalSize) * 100) : 0;
  const formatFallback = outputMime !== "" && outputMime !== format;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Image</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Compresseur <span style={{ color: "var(--primary)" }}>Image</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Réduisez la taille de vos images sans perte visible de qualité. Ajustez la compression et comparez avant/après.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* Drop zone */}
            {!originalFile && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
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
                aria-label="Choisir une image à compresser"
                className="cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-all"
                style={{
                  borderColor: dragging ? "var(--primary)" : "var(--border)",
                  background: dragging ? "rgba(13,79,60,0.04)" : "var(--surface)",
                }}
              >
                <div className="text-5xl mb-4">🖼️</div>
                <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Glissez une image ici
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  ou cliquez pour parcourir (PNG, JPEG, WebP)
                </p>
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (file) handleFile(file);
                }} />
              </div>
            )}

            {error && (
              <div role="alert" className="rounded-xl border p-4 text-sm" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                {error}
              </div>
            )}

            {originalFile && (
              <>
                {/* Controls */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Paramètres</h2>
                    <button onClick={() => { setOriginalFile(null); setOriginalURL(""); setCompressedURL(""); setOriginalSize(0); setCompressedSize(0); setOutputMime(""); setError(""); imgRef.current = null; }}
                      className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                      Nouvelle image
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        Format de sortie
                      </label>
                      <div className="mt-2 flex gap-2">
                        {([["image/jpeg", "JPEG"], ["image/webp", "WebP"]] as const).map(([val, label]) => (
                          <button key={val} onClick={() => handleFormatChange(val)} aria-pressed={format === val}
                            className="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                            style={{
                              borderColor: format === val ? "var(--primary)" : "var(--border)",
                              background: format === val ? "rgba(13,79,60,0.05)" : "transparent",
                              color: format === val ? "var(--primary)" : "var(--muted)",
                            }}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <label htmlFor="compress-quality" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                          Qualité
                        </label>
                        <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>{quality}%</span>
                      </div>
                      <input id="compress-quality" type="range" min="1" max="100" value={quality} onChange={(e) => handleQualityChange(Number(e.target.value))}
                        className="mt-2 w-full" />
                      <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                        <span>Petite taille</span>
                        <span>Haute qualité</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Original</p>
                    <p className="mt-1 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{formatSize(originalSize)}</p>
                  </div>
                  <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Compressé</p>
                    <p className="mt-1 text-xl font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>{formatSize(compressedSize)}</p>
                  </div>
                  <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Réduction</p>
                    <p className="mt-1 text-xl font-bold" style={{ color: ratio > 0 ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                      {ratio > 0 ? `-${ratio.toFixed(1)}%` : `+${Math.abs(ratio).toFixed(1)}%`}
                    </p>
                  </div>
                </div>

                {(ratio <= 0 || formatFallback) && (
                  <div className="rounded-xl border p-4 text-sm" style={{ background: "rgba(232,150,62,0.08)", borderColor: "rgba(232,150,62,0.3)", color: "var(--foreground)" }}>
                    {formatFallback && <p>Votre navigateur ne sait pas encoder ce format : l&apos;image est produite en {outputMime === "image/png" ? "PNG" : outputMime}.</p>}
                    {ratio <= 0 && <p>Le fichier compressé n&apos;est pas plus léger que l&apos;original : baissez la qualité, essayez WebP ou gardez l&apos;image d&apos;origine (déjà optimisée).</p>}
                  </div>
                )}

                {/* Preview */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--muted)" }}>Comparaison</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>Avant ({formatSize(originalSize)})</p>
                      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={originalURL} alt="Original" className="w-full h-auto" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--primary)" }}>Après ({formatSize(compressedSize)})</p>
                      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--primary)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={compressedURL} alt="Compressé" className="w-full h-auto" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <button onClick={download}
                      className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                      Télécharger l&apos;image compressée
                    </button>
                  </div>
                </div>
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment fonctionne la compression ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>La compression d&apos;image réduit la taille du fichier en ajustant la qualité d&apos;encodage. Les formats JPEG et WebP utilisent une compression avec perte qui élimine les détails imperceptibles à l&apos;œil nu.</p>
                <p>Les images PNG sont converties en JPEG ou WebP : la transparence est conservée en WebP, remplacée par un fond blanc en JPEG. Les métadonnées (EXIF, GPS) ne sont pas conservées.</p>
                <p>WebP offre généralement une meilleure compression que JPEG pour une qualité équivalente. À 75 % de qualité, vous obtiendrez un bon compromis taille/qualité pour le web.</p>
                <p>Tout le traitement est effectué localement dans votre navigateur. Aucune image n&apos;est envoyée sur un serveur.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
