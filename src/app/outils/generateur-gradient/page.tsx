"use client";

import { useState, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

const PRESETS = [
  { name: "Coucher de soleil", stops: [{ color: "#ff6b6b", position: 0 }, { color: "#feca57", position: 100 }], angle: 135 },
  { name: "Ocean", stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }], angle: 135 },
  { name: "Foret", stops: [{ color: "#0d4f3c", position: 0 }, { color: "#16785c", position: 50 }, { color: "#a8e063", position: 100 }], angle: 135 },
  { name: "Aurore", stops: [{ color: "#a18cd1", position: 0 }, { color: "#fbc2eb", position: 100 }], angle: 120 },
  { name: "Nuit", stops: [{ color: "#0f0c29", position: 0 }, { color: "#302b63", position: 50 }, { color: "#24243e", position: 100 }], angle: 180 },
  { name: "Peche", stops: [{ color: "#ffecd2", position: 0 }, { color: "#fcb69f", position: 100 }], angle: 135 },
  { name: "Menthe", stops: [{ color: "#00b09b", position: 0 }, { color: "#96c93d", position: 100 }], angle: 90 },
  { name: "Flamme", stops: [{ color: "#f83600", position: 0 }, { color: "#f9d423", position: 100 }], angle: 45 },
];

let nextId = 3;

export default function GenerateurGradient() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [radialShape, setRadialShape] = useState<"circle" | "ellipse">("circle");
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: "#0d4f3c", position: 0 },
    { id: 2, color: "#e8963e", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const generateCSS = useCallback(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");
    if (type === "linear") {
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    }
    return `radial-gradient(${radialShape}, ${stopsStr})`;
  }, [type, angle, radialShape, stops]);

  const cssValue = generateCSS();
  const fullCSS = `background: ${cssValue};`;

  const addStop = () => {
    const positions = stops.map((s) => s.position).sort((a, b) => a - b);
    let newPos = 50;
    if (positions.length >= 2) {
      let maxGap = 0;
      let gapStart = 0;
      for (let i = 1; i < positions.length; i++) {
        const gap = positions[i] - positions[i - 1];
        if (gap > maxGap) {
          maxGap = gap;
          gapStart = positions[i - 1];
        }
      }
      newPos = Math.round(gapStart + maxGap / 2);
    }
    setStops([...stops, { id: nextId++, color: "#888888", position: newPos }]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  const updateStop = (id: number, field: "color" | "position", value: string | number) => {
    setStops(stops.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setStops(preset.stops.map((s, i) => ({ id: nextId++, color: s.color, position: s.position || (i * 100 / (preset.stops.length - 1)) })));
    setAngle(preset.angle);
    setType("linear");
  };

  const copyCSS = async () => {
    await navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const randomGradient = () => {
    const randomColor = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    const numStops = 2 + Math.floor(Math.random() * 2);
    const newStops: ColorStop[] = [];
    for (let i = 0; i < numStops; i++) {
      newStops.push({ id: nextId++, color: randomColor(), position: Math.round((i / (numStops - 1)) * 100) });
    }
    setStops(newStops);
    setAngle(Math.round(Math.random() * 360));
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Design</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur de <span style={{ color: "var(--primary)" }}>gradient</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Creez des degrades CSS personnalises. Choisissez les couleurs, l&apos;angle, le type. Apercu en direct et code pret a copier.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <div
                className="w-full"
                style={{
                  background: cssValue,
                  height: "280px",
                  borderRadius: "16px 16px 0 0",
                }}
              />
              <div className="p-5" style={{ background: "var(--surface)" }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Apercu</h2>
                  <button
                    onClick={copyCSS}
                    className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: copied ? "var(--accent)" : "var(--primary)" }}
                  >
                    {copied ? "Copie !" : "Copier le CSS"}
                  </button>
                </div>
              </div>
            </div>

            {/* Type selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Type de degrade</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setType("linear")}
                  className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    borderColor: type === "linear" ? "var(--primary)" : "var(--border)",
                    background: type === "linear" ? "var(--primary)" : "transparent",
                    color: type === "linear" ? "#fff" : "inherit",
                  }}
                >
                  Lineaire
                </button>
                <button
                  onClick={() => setType("radial")}
                  className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    borderColor: type === "radial" ? "var(--primary)" : "var(--border)",
                    background: type === "radial" ? "var(--primary)" : "transparent",
                    color: type === "radial" ? "#fff" : "inherit",
                  }}
                >
                  Radial
                </button>
              </div>

              {type === "linear" && (
                <div className="mt-5">
                  <label className="text-sm font-medium">Angle : {angle}&deg;</label>
                  <div className="mt-2 flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="flex-1"
                      style={{ accentColor: "var(--primary)" }}
                    />
                    <input
                      type="number"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-16 rounded-lg border px-3 py-2 text-center text-sm"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <button
                        key={a}
                        onClick={() => setAngle(a)}
                        className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
                        style={{
                          borderColor: angle === a ? "var(--primary)" : "var(--border)",
                          background: angle === a ? "var(--primary)" : "transparent",
                          color: angle === a ? "#fff" : "inherit",
                        }}
                      >
                        {a}&deg;
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {type === "radial" && (
                <div className="mt-5">
                  <label className="text-sm font-medium">Forme :</label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setRadialShape("circle")}
                      className="rounded-xl border px-4 py-2 text-sm font-semibold transition-all"
                      style={{
                        borderColor: radialShape === "circle" ? "var(--primary)" : "var(--border)",
                        background: radialShape === "circle" ? "var(--primary)" : "transparent",
                        color: radialShape === "circle" ? "#fff" : "inherit",
                      }}
                    >
                      Cercle
                    </button>
                    <button
                      onClick={() => setRadialShape("ellipse")}
                      className="rounded-xl border px-4 py-2 text-sm font-semibold transition-all"
                      style={{
                        borderColor: radialShape === "ellipse" ? "var(--primary)" : "var(--border)",
                        background: radialShape === "ellipse" ? "var(--primary)" : "transparent",
                        color: radialShape === "ellipse" ? "#fff" : "inherit",
                      }}
                    >
                      Ellipse
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Color stops */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Couleurs ({stops.length} stops)</h2>
                <button
                  onClick={addStop}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  + Ajouter
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {stops.sort((a, b) => a.position - b.position).map((stop) => (
                  <div key={stop.id} className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                      className="h-10 w-10 cursor-pointer rounded-lg border-0"
                      style={{ padding: 0 }}
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                      className="w-24 rounded-lg border px-3 py-2 text-xs font-mono"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))}
                        className="flex-1"
                        style={{ accentColor: stop.color }}
                      />
                      <span className="text-xs font-semibold w-10 text-right" style={{ color: "var(--muted)" }}>{stop.position}%</span>
                    </div>
                    {stops.length > 2 && (
                      <button
                        onClick={() => removeStop(stop.id)}
                        className="rounded-lg p-1.5 text-xs transition-all hover:bg-red-50"
                        style={{ color: "#dc2626" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={randomGradient}
                className="rounded-xl border px-5 py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                style={{ borderColor: "var(--border)" }}
              >
                Aleatoire
              </button>
              <button
                onClick={copyCSS}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "var(--primary)" }}
              >
                {copied ? "Copie !" : "Copier le CSS"}
              </button>
            </div>

            {/* CSS Output */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Code CSS</h2>
              <div className="mt-4 rounded-xl p-4" style={{ background: "#1a1a1a" }}>
                <pre className="text-sm whitespace-pre-wrap break-all" style={{ fontFamily: "monospace", color: "#e8e8e8" }}>
                  <span style={{ color: "#9333ea" }}>background</span>
                  <span style={{ color: "#e8e8e8" }}>: </span>
                  <span style={{ color: "#feca57" }}>{cssValue}</span>
                  <span style={{ color: "#e8e8e8" }}>;</span>
                </pre>
              </div>
            </div>

            {/* Presets */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Presets</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRESETS.map((preset) => {
                  const previewStops = preset.stops.map((s) => `${s.color} ${s.position}%`).join(", ");
                  const previewCSS = `linear-gradient(${preset.angle}deg, ${previewStops})`;
                  return (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="rounded-xl overflow-hidden border transition-all hover:scale-[1.03]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <div className="h-16" style={{ background: previewCSS }} />
                      <p className="py-2 text-xs font-semibold text-center">{preset.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Astuces</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li><strong className="text-[var(--foreground)]">Angle 0&deg;</strong> : de bas en haut</li>
                <li><strong className="text-[var(--foreground)]">Angle 90&deg;</strong> : de gauche a droite</li>
                <li><strong className="text-[var(--foreground)]">Angle 135&deg;</strong> : diagonal (le plus populaire)</li>
                <li><strong className="text-[var(--foreground)]">3+ stops</strong> : pour des degrades complexes</li>
                <li><strong className="text-[var(--foreground)]">Radial</strong> : ideal pour les boutons et badges</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
