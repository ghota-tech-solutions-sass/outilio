"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type CalcMode = "forward" | "reverse";

export default function CalculateurMarge() {
  const [mode, setMode] = useState<CalcMode>("forward");
  const [prixAchat, setPrixAchat] = useState("60");
  const [prixVente, setPrixVente] = useState("100");
  const [margeTarget, setMargeTarget] = useState("40");
  const [prixAchatReverse, setPrixAchatReverse] = useState("60");

  const resultForward = useMemo(() => {
    if (mode !== "forward") return null;
    const achat = parseFloat(prixAchat) || 0;
    const vente = parseFloat(prixVente) || 0;
    if (achat <= 0 || vente <= 0) return null;

    const profit = vente - achat;
    const margePct = (profit / vente) * 100;
    const markupPct = (profit / achat) * 100;

    return { achat, vente, profit, margePct, markupPct };
  }, [mode, prixAchat, prixVente]);

  const resultReverse = useMemo(() => {
    if (mode !== "reverse") return null;
    const achat = parseFloat(prixAchatReverse) || 0;
    const marge = parseFloat(margeTarget) || 0;
    if (achat <= 0 || marge <= 0 || marge >= 100) return null;

    const venteCible = achat / (1 - marge / 100);
    const profit = venteCible - achat;
    const markupPct = (profit / achat) * 100;

    return { achat, vente: venteCible, profit, margePct: marge, markupPct };
  }, [mode, prixAchatReverse, margeTarget]);

  const result = mode === "forward" ? resultForward : resultReverse;

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Business</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>marge</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre marge commerciale, taux de marge et markup. Calcul direct ou inverse.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Mode de calcul</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={() => setMode("forward")}
                  className="rounded-xl border px-4 py-3 text-center transition-all"
                  style={{
                    borderColor: mode === "forward" ? "var(--primary)" : "var(--border)",
                    background: mode === "forward" ? "var(--primary)" : "transparent",
                    color: mode === "forward" ? "#fff" : "inherit",
                  }}>
                  <span className="block text-sm font-bold">Calcul direct</span>
                  <span className="block text-[10px] opacity-80">Prix achat + vente</span>
                </button>
                <button onClick={() => setMode("reverse")}
                  className="rounded-xl border px-4 py-3 text-center transition-all"
                  style={{
                    borderColor: mode === "reverse" ? "var(--primary)" : "var(--border)",
                    background: mode === "reverse" ? "var(--primary)" : "transparent",
                    color: mode === "reverse" ? "#fff" : "inherit",
                  }}>
                  <span className="block text-sm font-bold">Calcul inverse</span>
                  <span className="block text-[10px] opacity-80">Prix achat + marge cible</span>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parametres</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {mode === "forward" ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix d&apos;achat HT (&euro;)</label>
                      <input type="number" step="0.01" value={prixAchat} onChange={(e) => setPrixAchat(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix de vente HT (&euro;)</label>
                      <input type="number" step="0.01" value={prixVente} onChange={(e) => setPrixVente(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix d&apos;achat HT (&euro;)</label>
                      <input type="number" step="0.01" value={prixAchatReverse} onChange={(e) => setPrixAchatReverse(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Marge souhaitee (%)</label>
                      <input type="number" step="0.1" value={margeTarget} onChange={(e) => setMargeTarget(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                  </>
                )}
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Benefice</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.profit)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux de marge</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>{result.margePct.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux de markup</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.markupPct.toFixed(1)}%</p>
                  </div>
                </div>

                {mode === "reverse" && (
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--primary)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.8)" }}>Prix de vente recommande</p>
                    <p className="mt-2 text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.vente)} &euro;</p>
                  </div>
                )}

                {/* Visual bar */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Repartition du prix de vente</h2>
                  <div className="mt-4 flex h-8 overflow-hidden rounded-full">
                    <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${(result.achat / result.vente) * 100}%`, background: "var(--primary)", minWidth: "20%" }}>
                      Cout {fmt(result.achat)} &euro;
                    </div>
                    <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${(result.profit / result.vente) * 100}%`, background: "var(--accent)", minWidth: "15%" }}>
                      Marge {fmt(result.profit)} &euro;
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Marge vs Markup</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Taux de marge</strong> = (Prix vente - Prix achat) / Prix vente x 100. C&apos;est le pourcentage du prix de vente qui est du profit.</p>
                <p><strong className="text-[var(--foreground)]">Taux de markup</strong> = (Prix vente - Prix achat) / Prix achat x 100. C&apos;est le pourcentage d&apos;augmentation par rapport au cout.</p>
                <p><strong className="text-[var(--foreground)]">Exemple</strong> : Un produit achete 60 &euro; et vendu 100 &euro; a une marge de 40% mais un markup de 66,7%.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Marges par secteur</h3>
              <div className="mt-3 space-y-2">
                {[
                  { secteur: "Grande distribution", marge: "~2-5%" },
                  { secteur: "Restauration", marge: "~60-70%" },
                  { secteur: "Mode / Vetements", marge: "~50-60%" },
                  { secteur: "SaaS / Logiciel", marge: "~70-90%" },
                  { secteur: "E-commerce", marge: "~20-40%" },
                  { secteur: "Artisanat", marge: "~30-50%" },
                ].map((s) => (
                  <div key={s.secteur} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{s.secteur}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{s.marge}</span>
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
