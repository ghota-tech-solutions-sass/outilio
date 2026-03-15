"use client";

import { useState, useRef, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const COLORS = [
  "#0d4f3c", "#16785c", "#e8963e", "#3b82f6", "#8b5cf6",
  "#ef4444", "#ec4899", "#14b8a6", "#f59e0b", "#6366f1",
  "#059669", "#dc2626",
];

const STYLES = [
  { id: "circle", label: "Cercle" },
  { id: "rounded", label: "Carre arrondi" },
  { id: "square", label: "Carre" },
];

const SIZES = [64, 128, 256, 512];

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}

export default function GenerateurAvatar() {
  const [name, setName] = useState("Jean Dupont");
  const [color, setColor] = useState(COLORS[0]);
  const [style, setStyle] = useState("circle");
  const [size, setSize] = useState(256);
  const [fontSize, setFontSize] = useState(40);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initials = getInitials(name) || "?";

  const borderRadius = style === "circle" ? "50%" : style === "rounded" ? "20%" : "0%";

  const drawAndDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = color;
    if (style === "circle") {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "rounded") {
      const r = size * 0.2;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size * (fontSize / 100)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, size / 2, size / 2 + size * 0.02);

    const link = document.createElement("a");
    link.download = `avatar-${initials.toLowerCase()}-${size}px.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [size, color, style, fontSize, initials]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Design</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur <span style={{ color: "var(--primary)" }}>Avatar</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Creez un avatar avec vos initiales. Choisissez la couleur, le style et telechargez en PNG.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nom complet</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont"
                className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Couleur</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setColor(c)}
                      className="h-10 w-10 rounded-full transition-all" style={{ background: c, outline: color === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }} />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Style</label>
                <div className="mt-2 flex gap-2">
                  {STYLES.map((s) => (
                    <button key={s.id} onClick={() => setStyle(s.id)}
                      className="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                      style={{ borderColor: style === s.id ? "var(--primary)" : "var(--border)", background: style === s.id ? "rgba(13,79,60,0.05)" : "transparent", color: style === s.id ? "var(--primary)" : "var(--muted)" }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taille (px)</label>
                  <select value={size} onChange={(e) => setSize(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }}>
                    {SIZES.map((s) => <option key={s} value={s}>{s} x {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taille police (%)</label>
                  <input type="range" min="20" max="60" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                    className="mt-4 w-full" />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{fontSize}%</span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Apercu</p>
              <div className="mt-6 flex justify-center">
                <div className="flex items-center justify-center text-white font-bold"
                  style={{ width: "200px", height: "200px", background: color, borderRadius, fontSize: `${200 * (fontSize / 100)}px` }}>
                  {initials}
                </div>
              </div>
              <button onClick={drawAndDownload}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                Telecharger en PNG ({size}x{size})
              </button>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A quoi sert un avatar initiales ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Les avatars a initiales sont utilises dans de nombreuses applications : messageries, listes de contacts, CRM, forums. Ils permettent d&apos;identifier rapidement un utilisateur sans photo.</p>
                <p>Cet outil genere une image PNG que vous pouvez utiliser comme photo de profil, icone d&apos;application ou placeholder dans vos maquettes.</p>
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
