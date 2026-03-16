"use client";

import { useState, useRef, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
}

function dataURLtoBlob(dataURL: string): Blob {
  const parts = dataURL.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const raw = atob(parts[1]);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return new Blob([arr], { type: mime });
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
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL(fmt, q / 100);
    setCompressedURL(dataURL);
    setCompressedSize(dataURLtoBlob(dataURL).size);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setOriginalURL(url);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        compress(img, quality, format);
      };
      img.src = url;
    };
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
    const ext = format === "image/webp" ? "webp" : "jpg";
    const link = document.createElement("a");
    link.download = originalFile.name.replace(/\.[^.]+$/, "") + `-compresse.${ext}`;
    link.href = compressedURL;
    link.click();
  };

  const ratio = originalSize > 0 ? ((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Image</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Compresseur <span style={{ color: "var(--primary)" }}>Image</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Reduisez la taille de vos images sans perte visible de qualite. Ajustez la compression et comparez avant/apres.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* Drop zone */}
            {!originalFile && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
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
                  if (file) handleFile(file);
                }} />
              </div>
            )}

            {originalFile && (
              <>
                {/* Controls */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Parametres</h2>
                    <button onClick={() => { setOriginalFile(null); setOriginalURL(""); setCompressedURL(""); setOriginalSize(0); setCompressedSize(0); }}
                      className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
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
                          <button key={val} onClick={() => handleFormatChange(val)}
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
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                          Qualite
                        </label>
                        <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>{quality}%</span>
                      </div>
                      <input type="range" min="1" max="100" value={quality} onChange={(e) => handleQualityChange(Number(e.target.value))}
                        className="mt-2 w-full" />
                      <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                        <span>Petite taille</span>
                        <span>Haute qualite</span>
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
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Compresse</p>
                    <p className="mt-1 text-xl font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>{formatSize(compressedSize)}</p>
                  </div>
                  <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Reduction</p>
                    <p className="mt-1 text-xl font-bold" style={{ color: ratio > 0 ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                      {ratio > 0 ? `-${ratio.toFixed(1)}%` : "+0%"}
                    </p>
                  </div>
                </div>

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
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--primary)" }}>Apres ({formatSize(compressedSize)})</p>
                      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--primary)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={compressedURL} alt="Compresse" className="w-full h-auto" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <button onClick={download}
                      className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                      Telecharger l&apos;image compressee
                    </button>
                  </div>
                </div>
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment fonctionne la compression ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>La compression d&apos;image reduit la taille du fichier en ajustant la qualite d&apos;encodage. Les formats JPEG et WebP utilisent une compression avec perte qui elimine les details imperceptibles a l&apos;oeil nu.</p>
                <p>WebP offre generalement une meilleure compression que JPEG pour une qualite equivalente. A 75% de qualite, vous obtiendrez un bon compromis taille/qualite pour le web.</p>
                <p>Tout le traitement est effectue localement dans votre navigateur. Aucune image n&apos;est envoyee sur un serveur.</p>
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
