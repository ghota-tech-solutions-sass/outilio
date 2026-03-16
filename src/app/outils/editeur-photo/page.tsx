"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
}

interface Filters {
  brightness: number;
  contrast: number;
  saturate: number;
  blur: number;
  grayscale: number;
  sepia: number;
  invert: number;
  hueRotate: number;
}

const DEFAULT_FILTERS: Filters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  hueRotate: 0,
};

const FILTER_DEFS: { key: keyof Filters; label: string; min: number; max: number; unit: string; step: number }[] = [
  { key: "brightness", label: "Luminosite", min: 0, max: 300, unit: "%", step: 1 },
  { key: "contrast", label: "Contraste", min: 0, max: 300, unit: "%", step: 1 },
  { key: "saturate", label: "Saturation", min: 0, max: 300, unit: "%", step: 1 },
  { key: "blur", label: "Flou", min: 0, max: 20, unit: "px", step: 0.5 },
  { key: "grayscale", label: "Niveaux de gris", min: 0, max: 100, unit: "%", step: 1 },
  { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%", step: 1 },
  { key: "invert", label: "Inversion", min: 0, max: 100, unit: "%", step: 1 },
  { key: "hueRotate", label: "Rotation teinte", min: 0, max: 360, unit: "deg", step: 1 },
];

function buildFilterString(f: Filters): string {
  return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) blur(${f.blur}px) grayscale(${f.grayscale}%) sepia(${f.sepia}%) invert(${f.invert}%) hue-rotate(${f.hueRotate}deg)`;
}

const PRESETS: { name: string; filters: Partial<Filters> }[] = [
  { name: "Vintage", filters: { sepia: 60, brightness: 110, contrast: 85, saturate: 70 } },
  { name: "Noir & Blanc", filters: { grayscale: 100, contrast: 120 } },
  { name: "Vif", filters: { saturate: 180, contrast: 120, brightness: 110 } },
  { name: "Froid", filters: { hueRotate: 200, saturate: 80, brightness: 105 } },
  { name: "Chaud", filters: { hueRotate: 30, saturate: 130, brightness: 105 } },
  { name: "Dramatique", filters: { contrast: 180, brightness: 90, saturate: 60 } },
];

export default function EditeurPhoto() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalURL, setOriginalURL] = useState("");
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS });
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const drawFiltered = useCallback(() => {
    const canvas = displayCanvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate display size (fit in container)
    const maxW = Math.min(800, window.innerWidth - 80);
    const maxH = 500;
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;

    ctx.filter = buildFilterString(filters);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, [filters]);

  useEffect(() => {
    drawFiltered();
  }, [drawFiltered]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setOriginalFile(file);
    setFilters({ ...DEFAULT_FILTERS });
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setOriginalURL(url);
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        drawFiltered();
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, [drawFiltered]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const updateFilter = (key: keyof Filters, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS });
  };

  const applyPreset = (preset: Partial<Filters>) => {
    setFilters({ ...DEFAULT_FILTERS, ...preset });
  };

  const download = () => {
    const img = imgRef.current;
    const offscreen = canvasRef.current;
    if (!img || !offscreen || !originalFile) return;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    // Full resolution for download
    offscreen.width = img.naturalWidth;
    offscreen.height = img.naturalHeight;
    ctx.filter = buildFilterString(filters);
    ctx.drawImage(img, 0, 0);

    const link = document.createElement("a");
    link.download = originalFile.name.replace(/\.[^.]+$/, "") + "-edite.png";
    link.href = offscreen.toDataURL("image/png");
    link.click();
  };

  const hasChanges = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Image</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Editeur <span style={{ color: "var(--primary)" }}>Photo</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Retouchez vos photos avec des filtres : luminosite, contraste, saturation, flou, sepia et plus encore.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
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
                <div className="text-5xl mb-4">🎨</div>
                <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Glissez une photo ici
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
                {/* Dark editing workspace */}
                <div className="rounded-2xl overflow-hidden" style={{ background: "#1a1a1a" }}>
                  {/* Toolbar */}
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #333" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Editeur</span>
                      <span className="text-xs text-gray-500">{originalFile.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setOriginalFile(null); setOriginalURL(""); }}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-700">
                        Nouvelle image
                      </button>
                    </div>
                  </div>

                  {/* Canvas display */}
                  <div className="flex justify-center p-6" style={{ background: "repeating-conic-gradient(#222 0% 25%, #1a1a1a 0% 50%) 0 0 / 20px 20px" }}>
                    <canvas ref={displayCanvasRef} style={{ maxWidth: "100%", maxHeight: "500px", borderRadius: "4px" }} />
                  </div>
                </div>

                {/* Presets */}
                <div className="rounded-2xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--muted)" }}>Presets</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <button key={p.name} onClick={() => applyPreset(p.filters)}
                        className="rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50"
                        style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter sliders */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Filtres</h2>
                    <button onClick={resetFilters} disabled={!hasChanges}
                      className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50 disabled:opacity-40"
                      style={{ borderColor: "var(--border)", color: "var(--accent)" }}>
                      Reinitialiser
                    </button>
                  </div>

                  <div className="space-y-5">
                    {FILTER_DEFS.map((fd) => {
                      const val = filters[fd.key];
                      const defaultVal = DEFAULT_FILTERS[fd.key];
                      const isChanged = val !== defaultVal;
                      return (
                        <div key={fd.key}>
                          <div className="flex justify-between mb-1">
                            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: isChanged ? "var(--primary)" : "var(--muted)" }}>
                              {fd.label}
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold" style={{ color: isChanged ? "var(--primary)" : "var(--muted)" }}>
                                {fd.key === "blur" ? val.toFixed(1) : val}{fd.unit}
                              </span>
                              {isChanged && (
                                <button onClick={() => updateFilter(fd.key, defaultVal)}
                                  className="text-xs px-1.5 py-0.5 rounded transition-colors hover:bg-gray-100"
                                  style={{ color: "var(--muted)" }}>
                                  ↩
                                </button>
                              )}
                            </div>
                          </div>
                          <input type="range" min={fd.min} max={fd.max} step={fd.step} value={val}
                            onChange={(e) => updateFilter(fd.key, Number(e.target.value))}
                            className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Download */}
                <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                    Image originale : {formatSize(originalFile.size)}
                  </p>
                  <button onClick={download}
                    className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                    Telecharger la photo editee
                  </button>
                  <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>Export en PNG, resolution originale</p>
                </div>
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Retouche photo en ligne</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Cet editeur utilise les filtres CSS du Canvas pour modifier vos photos en temps reel. Les filtres sont combines et appliques dans l&apos;ordre affiche.</p>
                <p><strong>Luminosite</strong> eclaircit ou assombrit l&apos;image. <strong>Contraste</strong> accentue les differences entre clair et sombre. <strong>Saturation</strong> intensifie ou attenue les couleurs.</p>
                <p>Utilisez les presets pour un rendu rapide, puis affinez avec les curseurs. Tout le traitement est effectue dans votre navigateur.</p>
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
