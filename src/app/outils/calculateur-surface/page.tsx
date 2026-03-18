"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type Shape = "rectangle" | "circle" | "triangle" | "trapezoid";

export default function CalculateurSurface() {
  const [shape, setShape] = useState<Shape>("rectangle");
  const [largeur, setLargeur] = useState("5");
  const [longueur, setLongueur] = useState("8");
  const [rayon, setRayon] = useState("3");
  const [base, setBase] = useState("6");
  const [hauteur, setHauteur] = useState("4");
  const [grandeBase, setGrandeBase] = useState("8");
  const [petiteBase, setPetiteBase] = useState("5");
  const [hauteurTrap, setHauteurTrap] = useState("4");

  const result = useMemo(() => {
    let areaM2 = 0;

    switch (shape) {
      case "rectangle":
        areaM2 = (parseFloat(largeur) || 0) * (parseFloat(longueur) || 0);
        break;
      case "circle":
        areaM2 = Math.PI * Math.pow(parseFloat(rayon) || 0, 2);
        break;
      case "triangle":
        areaM2 = ((parseFloat(base) || 0) * (parseFloat(hauteur) || 0)) / 2;
        break;
      case "trapezoid":
        areaM2 = (((parseFloat(grandeBase) || 0) + (parseFloat(petiteBase) || 0)) * (parseFloat(hauteurTrap) || 0)) / 2;
        break;
    }

    if (areaM2 <= 0) return null;

    return {
      m2: areaM2,
      cm2: areaM2 * 10000,
      km2: areaM2 / 1000000,
      hectares: areaM2 / 10000,
      ares: areaM2 / 100,
      sqft: areaM2 * 10.7639,
    };
  }, [shape, largeur, longueur, rayon, base, hauteur, grandeBase, petiteBase, hauteurTrap]);

  const fmt = (n: number, dec = 2) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  const shapes: { key: Shape; label: string; icon: string }[] = [
    { key: "rectangle", label: "Rectangle", icon: "\u25AD" },
    { key: "circle", label: "Cercle", icon: "\u25CB" },
    { key: "triangle", label: "Triangle", icon: "\u25B3" },
    { key: "trapezoid", label: "Trapeze", icon: "\u2B22" },
  ];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Maths</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>surface</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez la surface de rectangles, cercles, triangles et trapezes. Resultat en m&sup2; et conversion en autres unites.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Shape selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Forme</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {shapes.map((s) => (
                  <button key={s.key} onClick={() => setShape(s.key)}
                    className="rounded-xl border px-4 py-4 text-center transition-all"
                    style={{
                      borderColor: shape === s.key ? "var(--primary)" : "var(--border)",
                      background: shape === s.key ? "var(--primary)" : "transparent",
                      color: shape === s.key ? "#fff" : "inherit",
                    }}>
                    <span className="block text-2xl">{s.icon}</span>
                    <span className="mt-1 block text-xs font-semibold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Dimensions (en metres)</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {shape === "rectangle" && (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Longueur (m)</label>
                      <input type="number" step="0.01" value={longueur} onChange={(e) => setLongueur(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Largeur (m)</label>
                      <input type="number" step="0.01" value={largeur} onChange={(e) => setLargeur(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                  </>
                )}
                {shape === "circle" && (
                  <div className="col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Rayon (m)</label>
                    <input type="number" step="0.01" value={rayon} onChange={(e) => setRayon(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                )}
                {shape === "triangle" && (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Base (m)</label>
                      <input type="number" step="0.01" value={base} onChange={(e) => setBase(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Hauteur (m)</label>
                      <input type="number" step="0.01" value={hauteur} onChange={(e) => setHauteur(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                  </>
                )}
                {shape === "trapezoid" && (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Grande base (m)</label>
                      <input type="number" step="0.01" value={grandeBase} onChange={(e) => setGrandeBase(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Petite base (m)</label>
                      <input type="number" step="0.01" value={petiteBase} onChange={(e) => setPetiteBase(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Hauteur (m)</label>
                      <input type="number" step="0.01" value={hauteurTrap} onChange={(e) => setHauteurTrap(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {result && (
              <>
                <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Surface</p>
                  <p className="mt-2 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.m2)} m&sup2;</p>
                </div>

                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Conversions</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      { label: "cm\u00B2", value: fmt(result.cm2, 0) },
                      { label: "m\u00B2", value: fmt(result.m2) },
                      { label: "km\u00B2", value: fmt(result.km2, 6) },
                      { label: "Hectares", value: fmt(result.hectares, 4) },
                      { label: "Ares", value: fmt(result.ares, 4) },
                      { label: "sq ft", value: fmt(result.sqft) },
                    ].map((conv) => (
                      <div key={conv.label} className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
                        <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>{conv.label}</p>
                        <p className="mt-1 text-sm font-bold">{conv.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Formules de calcul</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Rectangle</strong> : Aire = Longueur x Largeur</p>
                <p><strong className="text-[var(--foreground)]">Cercle</strong> : Aire = &pi; x Rayon&sup2;</p>
                <p><strong className="text-[var(--foreground)]">Triangle</strong> : Aire = (Base x Hauteur) / 2</p>
                <p><strong className="text-[var(--foreground)]">Trapeze</strong> : Aire = ((Grande base + Petite base) x Hauteur) / 2</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Surfaces de reference</h3>
              <div className="mt-3 space-y-2">
                {[
                  { nom: "Studio", surface: "~20 m\u00B2" },
                  { nom: "T2", surface: "~40 m\u00B2" },
                  { nom: "T3", surface: "~65 m\u00B2" },
                  { nom: "Maison moyenne", surface: "~100 m\u00B2" },
                  { nom: "Terrain de tennis", surface: "~260 m\u00B2" },
                  { nom: "Terrain de foot", surface: "~7 000 m\u00B2" },
                ].map((r) => (
                  <div key={r.nom} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{r.nom}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{r.surface}</span>
                  </div>
                ))}
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
