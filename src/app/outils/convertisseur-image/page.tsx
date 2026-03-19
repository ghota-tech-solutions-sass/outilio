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
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
  const raw = atob(parts[1]);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

const FORMATS = [
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/webp", label: "WebP", ext: "webp" },
  { value: "image/bmp", label: "BMP", ext: "bmp" },
] as const;

type FormatValue = typeof FORMATS[number]["value"];

function detectFormat(type: string): string {
  if (type.includes("png")) return "PNG";
  if (type.includes("jpeg") || type.includes("jpg")) return "JPEG";
  if (type.includes("webp")) return "WebP";
  if (type.includes("bmp")) return "BMP";
  return type;
}

export default function ConvertisseurImage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalURL, setOriginalURL] = useState("");
  const [convertedURL, setConvertedURL] = useState("");
  const [convertedSize, setConvertedSize] = useState(0);
  const [targetFormat, setTargetFormat] = useState<FormatValue>("image/png");
  const [quality, setQuality] = useState(92);
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const convert = useCallback((img: HTMLImageElement, fmt: FormatValue, q: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Fill white background for JPEG (no alpha support)
    if (fmt === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);
    const qualityParam = (fmt === "image/jpeg" || fmt === "image/webp") ? q / 100 : undefined;
    const dataURL = canvas.toDataURL(fmt, qualityParam);
    setConvertedURL(dataURL);
    setConvertedSize(dataURLtoBlob(dataURL).size);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setOriginalURL(url);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        convert(img, targetFormat, quality);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, [targetFormat, quality, convert]);

  const handleFormatChange = (fmt: FormatValue) => {
    setTargetFormat(fmt);
    if (imgRef.current) convert(imgRef.current, fmt, quality);
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (imgRef.current) convert(imgRef.current, targetFormat, q);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const download = () => {
    if (!convertedURL || !originalFile) return;
    const ext = FORMATS.find(f => f.value === targetFormat)?.ext || "png";
    const link = document.createElement("a");
    link.download = originalFile.name.replace(/\.[^.]+$/, "") + `.${ext}`;
    link.href = convertedURL;
    link.click();
  };

  const showQuality = targetFormat === "image/jpeg" || targetFormat === "image/webp";
  const sizeDiff = originalFile ? ((convertedSize - originalFile.size) / originalFile.size * 100) : 0;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Image</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur <span style={{ color: "var(--primary)" }}>Format Image</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez vos images entre PNG, JPEG, WebP et BMP. Comparez les tailles et telechargez le resultat.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

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
                <div className="text-5xl mb-4">🔄</div>
                <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Glissez une image ici
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                  ou cliquez pour parcourir (PNG, JPEG, WebP, BMP)
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
                    <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conversion</h2>
                    <button onClick={() => { setOriginalFile(null); setOriginalURL(""); setConvertedURL(""); setConvertedSize(0); }}
                      className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                      Nouvelle image
                    </button>
                  </div>

                  {/* Arrow conversion display */}
                  <div className="flex items-center justify-center gap-4 mb-6 py-4 rounded-xl" style={{ background: "var(--surface-alt)" }}>
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Source</p>
                      <p className="mt-1 text-lg font-bold" style={{ color: "var(--accent)" }}>{detectFormat(originalFile.type)}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{formatSize(originalFile.size)}</p>
                    </div>
                    <div className="text-2xl" style={{ color: "var(--primary)" }}>→</div>
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Cible</p>
                      <p className="mt-1 text-lg font-bold" style={{ color: "var(--primary)" }}>
                        {FORMATS.find(f => f.value === targetFormat)?.label}
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{formatSize(convertedSize)}</p>
                    </div>
                  </div>

                  {/* Format selector */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Format de sortie
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {FORMATS.map((f) => (
                        <button key={f.value} onClick={() => handleFormatChange(f.value)}
                          className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-all"
                          style={{
                            borderColor: targetFormat === f.value ? "var(--primary)" : "var(--border)",
                            background: targetFormat === f.value ? "rgba(13,79,60,0.05)" : "transparent",
                            color: targetFormat === f.value ? "var(--primary)" : "var(--muted)",
                          }}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality slider for JPEG/WebP */}
                  {showQuality && (
                    <div className="mt-4">
                      <div className="flex justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Qualite</label>
                        <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>{quality}%</span>
                      </div>
                      <input type="range" min="1" max="100" value={quality} onChange={(e) => handleQualityChange(Number(e.target.value))}
                        className="mt-2 w-full" />
                    </div>
                  )}
                </div>

                {/* Size comparison */}
                <div className="rounded-2xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Difference de taille</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {formatSize(originalFile.size)} → {formatSize(convertedSize)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{
                        color: sizeDiff <= 0 ? "var(--primary)" : "var(--accent)",
                        fontFamily: "var(--font-display)",
                      }}>
                        {sizeDiff <= 0 ? "" : "+"}{sizeDiff.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                    <div className="h-full rounded-full transition-all" style={{
                      width: `${Math.min(100, Math.max(5, (convertedSize / originalFile.size) * 100))}%`,
                      background: sizeDiff <= 0 ? "var(--primary)" : "var(--accent)",
                    }} />
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--muted)" }}>Apercu</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
                        Original ({detectFormat(originalFile.type)})
                      </p>
                      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={originalURL} alt="Original" className="w-full h-auto" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--primary)" }}>
                        Converti ({FORMATS.find(f => f.value === targetFormat)?.label})
                      </p>
                      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--primary)" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={convertedURL} alt="Converti" className="w-full h-auto" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <button onClick={download}
                      className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                      Telecharger en {FORMATS.find(f => f.value === targetFormat)?.label}
                    </button>
                  </div>
                </div>
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Quel format choisir ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong>PNG</strong> : compression sans perte, ideal pour les logos, illustrations et images avec transparence.</p>
                <p><strong>JPEG</strong> : compression avec perte, parfait pour les photos. Fichiers plus legers mais pas de transparence.</p>
                <p><strong>WebP</strong> : format moderne offrant une meilleure compression que JPEG et PNG. Supporte par tous les navigateurs modernes.</p>
                <p><strong>BMP</strong> : format non compresse, fichiers tres lourds. Utile uniquement pour des cas specifiques.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le convertisseur d&apos;images en ligne
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Ce convertisseur d&apos;images gratuit transforme vos fichiers entre les formats PNG, JPEG, WebP et BMP en quelques secondes. Tout se passe dans votre navigateur : aucune image n&apos;est envoyee sur un serveur.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Deposez votre image</strong> : glissez-la dans la zone de depot ou cliquez pour la selectionner sur votre appareil.</li>
                  <li><strong className="text-[var(--foreground)]">Selectionnez le format cible</strong> : choisissez PNG, JPEG, WebP ou BMP selon votre besoin.</li>
                  <li><strong className="text-[var(--foreground)]">Ajustez la qualite</strong> : pour JPEG et WebP, un curseur permet de regler la qualite de compression (1 a 100 %).</li>
                  <li><strong className="text-[var(--foreground)]">Comparez et telechargez</strong> : visualisez l&apos;apercu cote a cote avec la difference de taille, puis telechargez le resultat.</li>
                </ul>
                <p>
                  L&apos;outil est particulierement utile pour optimiser vos images avant de les publier sur un site web. Convertir en WebP peut reduire la taille de 25 a 50 % par rapport au JPEG, ce qui ameliore les temps de chargement et le referencement naturel.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi convertir mes images en WebP ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Le format WebP, developpe par Google, offre une compression superieure au JPEG et au PNG. A qualite visuelle equivalente, un fichier WebP est en moyenne 25 a 35 % plus leger qu&apos;un JPEG. Tous les navigateurs modernes (Chrome, Firefox, Edge, Safari) le supportent. C&apos;est le format recommande par Google pour ameliorer les performances web et le score PageSpeed.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>La conversion conserve-t-elle la transparence ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Cela depend du format cible. Le PNG et le WebP supportent la transparence (canal alpha). En revanche, le JPEG ne gere pas la transparence : les zones transparentes seront remplies en blanc. Le BMP ne supporte pas non plus la transparence dans la plupart des implementations.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle qualite de compression choisir pour JPEG ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour les photos destinees au web, une qualite entre 75 et 85 % offre un bon equilibre entre taille de fichier et rendu visuel. Pour l&apos;impression ou l&apos;archivage, montez a 90-95 %. En dessous de 60 %, les artefacts de compression deviennent visibles, surtout sur les zones de texte et les bords nets.
                  </p>
                </div>
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
