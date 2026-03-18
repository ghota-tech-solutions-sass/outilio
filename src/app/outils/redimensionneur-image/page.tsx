"use client";

import { useState, useRef, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
}

export default function RedimensionneurImage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalURL, setOriginalURL] = useState("");
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  const [targetW, setTargetW] = useState(0);
  const [targetH, setTargetH] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [mode, setMode] = useState<"px" | "pct">("px");
  const [pctValue, setPctValue] = useState(100);
  const [previewURL, setPreviewURL] = useState("");
  const [resultSize, setResultSize] = useState(0);
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const doResize = useCallback((img: HTMLImageElement, w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas || w <= 0 || h <= 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, 0, 0, w, h);
    const dataURL = canvas.toDataURL("image/png");
    setPreviewURL(dataURL);
    const parts = dataURL.split(",");
    const raw = atob(parts[1]);
    setResultSize(raw.length);
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
        setOrigW(img.naturalWidth);
        setOrigH(img.naturalHeight);
        setTargetW(img.naturalWidth);
        setTargetH(img.naturalHeight);
        setPctValue(100);
        doResize(img, img.naturalWidth, img.naturalHeight);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, [doResize]);

  const updateWidth = (w: number) => {
    setTargetW(w);
    if (lockRatio && origW > 0) {
      const h = Math.round((w / origW) * origH);
      setTargetH(h);
      if (imgRef.current) doResize(imgRef.current, w, h);
    } else {
      if (imgRef.current) doResize(imgRef.current, w, targetH);
    }
  };

  const updateHeight = (h: number) => {
    setTargetH(h);
    if (lockRatio && origH > 0) {
      const w = Math.round((h / origH) * origW);
      setTargetW(w);
      if (imgRef.current) doResize(imgRef.current, w, h);
    } else {
      if (imgRef.current) doResize(imgRef.current, targetW, h);
    }
  };

  const updatePct = (pct: number) => {
    setPctValue(pct);
    const w = Math.round(origW * pct / 100);
    const h = Math.round(origH * pct / 100);
    setTargetW(w);
    setTargetH(h);
    if (imgRef.current) doResize(imgRef.current, w, h);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const download = () => {
    if (!previewURL || !originalFile) return;
    const link = document.createElement("a");
    link.download = originalFile.name.replace(/\.[^.]+$/, "") + `-${targetW}x${targetH}.png`;
    link.href = previewURL;
    link.click();
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Image</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Redimensionneur <span style={{ color: "var(--primary)" }}>Image</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Changez les dimensions de vos images en pixels ou en pourcentage. Ratio verrouillable, apercu en direct.
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
                <div className="text-5xl mb-4">📐</div>
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
                    <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Dimensions</h2>
                    <button onClick={() => { setOriginalFile(null); setOriginalURL(""); setPreviewURL(""); }}
                      className="text-sm font-medium px-4 py-2 rounded-lg border transition-colors hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                      Nouvelle image
                    </button>
                  </div>

                  <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>
                    Taille originale : {origW} x {origH} px ({formatSize(originalFile.size)})
                  </p>

                  {/* Mode toggle */}
                  <div className="flex gap-2 mb-4">
                    {([["px", "Pixels"], ["pct", "Pourcentage"]] as const).map(([val, label]) => (
                      <button key={val} onClick={() => setMode(val)}
                        className="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                        style={{
                          borderColor: mode === val ? "var(--primary)" : "var(--border)",
                          background: mode === val ? "rgba(13,79,60,0.05)" : "transparent",
                          color: mode === val ? "var(--primary)" : "var(--muted)",
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {mode === "px" ? (
                    <div className="space-y-4">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Largeur (px)</label>
                          <input type="number" min="1" max="10000" value={targetW}
                            onChange={(e) => updateWidth(Number(e.target.value))}
                            className="mt-1 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                            style={{ borderColor: "var(--border)" }} />
                        </div>
                        <button onClick={() => setLockRatio(!lockRatio)}
                          className="mb-1 flex h-12 w-12 items-center justify-center rounded-xl border text-lg transition-all"
                          style={{
                            borderColor: lockRatio ? "var(--primary)" : "var(--border)",
                            background: lockRatio ? "rgba(13,79,60,0.05)" : "transparent",
                            color: lockRatio ? "var(--primary)" : "var(--muted)",
                          }}
                          title={lockRatio ? "Ratio verrouille" : "Ratio libre"}>
                          {lockRatio ? "🔗" : "🔓"}
                        </button>
                        <div className="flex-1">
                          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Hauteur (px)</label>
                          <input type="number" min="1" max="10000" value={targetH}
                            onChange={(e) => updateHeight(Number(e.target.value))}
                            className="mt-1 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                            style={{ borderColor: "var(--border)" }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Pourcentage</label>
                        <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>{pctValue}%</span>
                      </div>
                      <input type="range" min="1" max="500" value={pctValue} onChange={(e) => updatePct(Number(e.target.value))}
                        className="mt-2 w-full" />
                      <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                        <span>1%</span>
                        <span>500%</span>
                      </div>
                      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                        Resultat : {targetW} x {targetH} px
                      </p>
                    </div>
                  )}

                  {/* Quick presets */}
                  <div className="mt-4">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Presets</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[25, 50, 75, 100, 150, 200].map((p) => (
                        <button key={p} onClick={() => { setMode("pct"); updatePct(p); }}
                          className="rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:bg-[var(--surface-alt)]"
                          style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                          {p}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Original</p>
                    <p className="mt-1 text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>{origW} x {origH}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{formatSize(originalFile.size)}</p>
                  </div>
                  <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Redimensionne</p>
                    <p className="mt-1 text-lg font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>{targetW} x {targetH}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{formatSize(resultSize)}</p>
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: "var(--muted)" }}>Apercu</p>
                  <div className="flex justify-center rounded-xl overflow-hidden border p-4" style={{ borderColor: "var(--border)", background: "repeating-conic-gradient(#e8e8e8 0% 25%, transparent 0% 50%) 0 0 / 20px 20px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewURL} alt="Redimensionne" style={{ maxWidth: "100%", maxHeight: "500px" }} />
                  </div>
                  <div className="mt-6 text-center">
                    <button onClick={download}
                      className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                      Telecharger ({targetW} x {targetH})
                    </button>
                  </div>
                </div>
              </>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Redimensionner une image</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Le redimensionnement modifie les dimensions en pixels de votre image. Verrouillez le ratio d&apos;aspect pour eviter les deformations.</p>
                <p>Le mode pourcentage est pratique pour reduire uniformement. Les presets 50%, 75% couvrent les besoins courants pour le web.</p>
                <p>Tout le traitement est effectue dans votre navigateur. Aucune image n&apos;est envoyee a un serveur.</p>
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
