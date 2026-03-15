"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const COMMON_PX = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

export default function ConvertisseurPxRem() {
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [pxValue, setPxValue] = useState("");
  const [remValue, setRemValue] = useState("");
  const [mode, setMode] = useState<"px-to-rem" | "rem-to-px">("px-to-rem");
  const [copied, setCopied] = useState<string | null>(null);

  const convertedValue = useMemo(() => {
    if (mode === "px-to-rem") {
      const px = parseFloat(pxValue);
      if (isNaN(px)) return "";
      return (px / baseFontSize).toFixed(4).replace(/\.?0+$/, "");
    } else {
      const rem = parseFloat(remValue);
      if (isNaN(rem)) return "";
      return (rem * baseFontSize).toFixed(2).replace(/\.?0+$/, "");
    }
  }, [pxValue, remValue, baseFontSize, mode]);

  const conversionTable = useMemo(() => {
    return COMMON_PX.map((px) => ({
      px,
      rem: (px / baseFontSize).toFixed(4).replace(/\.?0+$/, ""),
    }));
  }, [baseFontSize]);

  const copyValue = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur <span style={{ color: "var(--primary)" }}>PX / REM</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez les pixels en rem et inversement. Taille de base personnalisable. Indispensable pour le responsive design.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Base font size */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Taille de base (html font-size)</h2>
              <div className="mt-4 flex items-center gap-4">
                <input
                  type="range"
                  min="8"
                  max="32"
                  step="1"
                  value={baseFontSize}
                  onChange={(e) => setBaseFontSize(Number(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: "var(--primary)" }}
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={baseFontSize}
                    onChange={(e) => setBaseFontSize(Number(e.target.value) || 16)}
                    className="w-16 rounded-lg border px-3 py-2 text-center text-sm font-semibold"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>px</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[12, 14, 16, 18, 20].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBaseFontSize(size)}
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      borderColor: baseFontSize === size ? "var(--primary)" : "var(--border)",
                      background: baseFontSize === size ? "var(--primary)" : "transparent",
                      color: baseFontSize === size ? "#fff" : "inherit",
                    }}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

            {/* Mode selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Mode de conversion</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setMode("px-to-rem"); setRemValue(""); }}
                  className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    borderColor: mode === "px-to-rem" ? "var(--primary)" : "var(--border)",
                    background: mode === "px-to-rem" ? "var(--primary)" : "transparent",
                    color: mode === "px-to-rem" ? "#fff" : "inherit",
                  }}
                >
                  PX &rarr; REM
                </button>
                <button
                  onClick={() => { setMode("rem-to-px"); setPxValue(""); }}
                  className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    borderColor: mode === "rem-to-px" ? "var(--primary)" : "var(--border)",
                    background: mode === "rem-to-px" ? "var(--primary)" : "transparent",
                    color: mode === "rem-to-px" ? "#fff" : "inherit",
                  }}
                >
                  REM &rarr; PX
                </button>
              </div>
            </div>

            {/* Converter */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: mode === "px-to-rem" ? "var(--accent)" : "var(--muted)" }}>
                    {mode === "px-to-rem" ? "Pixels (entree)" : "REM (entree)"}
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={mode === "px-to-rem" ? pxValue : remValue}
                      onChange={(e) => mode === "px-to-rem" ? setPxValue(e.target.value) : setRemValue(e.target.value)}
                      className="w-full rounded-xl border px-4 py-3 text-lg font-semibold"
                      style={{ borderColor: "var(--border)", fontFamily: "monospace" }}
                      placeholder={mode === "px-to-rem" ? "16" : "1"}
                      step="any"
                    />
                    <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
                      {mode === "px-to-rem" ? "px" : "rem"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "var(--surface-alt)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: mode === "rem-to-px" ? "var(--accent)" : "var(--muted)" }}>
                    {mode === "px-to-rem" ? "REM (resultat)" : "Pixels (resultat)"}
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="w-full rounded-xl border px-4 py-3 text-lg font-semibold min-h-[50px] flex items-center"
                      style={{ borderColor: "var(--primary)", fontFamily: "monospace", background: "rgba(13,79,60,0.04)", color: "var(--primary)" }}
                    >
                      {convertedValue || "\u2014"}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
                      {mode === "px-to-rem" ? "rem" : "px"}
                    </span>
                  </div>
                </div>
              </div>

              {convertedValue && (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => copyValue(`${convertedValue}${mode === "px-to-rem" ? "rem" : "px"}`, "value")}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: copied === "value" ? "var(--accent)" : "var(--primary)" }}
                  >
                    {copied === "value" ? "Copie !" : `Copier ${convertedValue}${mode === "px-to-rem" ? "rem" : "px"}`}
                  </button>
                  <button
                    onClick={() => copyValue(`font-size: ${convertedValue}${mode === "px-to-rem" ? "rem" : "px"};`, "css")}
                    className="rounded-lg border px-4 py-2 text-xs font-semibold transition-all hover:bg-[var(--surface-alt)]"
                    style={{ borderColor: "var(--border)", color: copied === "css" ? "var(--accent)" : "inherit" }}
                  >
                    {copied === "css" ? "Copie !" : "Copier en CSS"}
                  </button>
                </div>
              )}
            </div>

            {/* Quick convert buttons */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Conversion rapide</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {COMMON_PX.slice(0, 10).map((px) => (
                  <button
                    key={px}
                    onClick={() => { setMode("px-to-rem"); setPxValue(String(px)); }}
                    className="rounded-lg border px-3 py-2 text-xs font-semibold transition-all hover:bg-[var(--surface-alt)]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {px}px
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion table */}
            <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                  Tableau de correspondance (base : {baseFontSize}px)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "var(--surface-alt)" }}>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Pixels</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>REM</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>CSS</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Apercu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversionTable.map((row) => (
                      <tr key={row.px} className="border-t" style={{ borderColor: "var(--border)" }}>
                        <td className="px-5 py-2.5 text-sm font-semibold" style={{ fontFamily: "monospace" }}>{row.px}px</td>
                        <td className="px-5 py-2.5 text-sm font-semibold" style={{ fontFamily: "monospace", color: "var(--primary)" }}>{row.rem}rem</td>
                        <td className="px-5 py-2.5">
                          <button
                            onClick={() => copyValue(`font-size: ${row.rem}rem;`, `css-${row.px}`)}
                            className="text-xs font-mono px-2 py-1 rounded hover:bg-[var(--surface-alt)] transition-all"
                            style={{ color: "var(--muted)" }}
                          >
                            {copied === `css-${row.px}` ? "Copie !" : `font-size: ${row.rem}rem;`}
                          </button>
                        </td>
                        <td className="px-5 py-2.5">
                          <span style={{ fontSize: `${row.px}px`, lineHeight: 1.2 }}>Aa</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>PX vs REM : guide rapide</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">PX (pixels)</strong> : Unite fixe, ne change pas selon les preferences utilisateur. Ideal pour les bordures et les ombres.</p>
                <p><strong className="text-[var(--foreground)]">REM (root em)</strong> : Relative a la taille de police racine (html). S&apos;adapte aux preferences d&apos;accessibilite de l&apos;utilisateur.</p>
                <p><strong className="text-[var(--foreground)]">Formule</strong> : <code style={{ fontFamily: "monospace", background: "var(--surface-alt)", padding: "2px 6px", borderRadius: "4px" }}>rem = px / base</code> ou base est generalement 16px.</p>
                <p><strong className="text-[var(--foreground)]">Bonne pratique</strong> : Utilisez rem pour les tailles de police, marges et paddings. Gardez px pour les bordures et les dimensions fixes.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Formules</h3>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl p-3" style={{ background: "var(--surface-alt)" }}>
                  <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>PX vers REM</p>
                  <code className="text-xs" style={{ fontFamily: "monospace" }}>rem = px / {baseFontSize}</code>
                </div>
                <div className="rounded-xl p-3" style={{ background: "var(--surface-alt)" }}>
                  <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>REM vers PX</p>
                  <code className="text-xs" style={{ fontFamily: "monospace" }}>px = rem * {baseFontSize}</code>
                </div>
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
