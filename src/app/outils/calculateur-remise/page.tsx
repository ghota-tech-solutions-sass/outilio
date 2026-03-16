"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface Discount {
  id: number;
  type: "percent" | "fixed";
  value: string;
}

let nextId = 1;

export default function CalculateurRemise() {
  const [prixOriginal, setPrixOriginal] = useState("100");
  const [discounts, setDiscounts] = useState<Discount[]>([
    { id: nextId++, type: "percent", value: "20" },
  ]);

  const addDiscount = () => {
    setDiscounts((prev) => [...prev, { id: nextId++, type: "percent", value: "10" }]);
  };

  const removeDiscount = (id: number) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDiscount = (id: number, field: "type" | "value", val: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: val } : d))
    );
  };

  const result = useMemo(() => {
    const original = parseFloat(prixOriginal) || 0;
    if (original <= 0) return null;

    let currentPrice = original;
    const steps: { label: string; reduction: number; priceAfter: number }[] = [];

    for (const d of discounts) {
      const val = parseFloat(d.value) || 0;
      if (val <= 0) continue;

      let reduction: number;
      let label: string;

      if (d.type === "percent") {
        reduction = currentPrice * (val / 100);
        label = `-${val}%`;
      } else {
        reduction = Math.min(val, currentPrice);
        label = `-${val.toFixed(2)} €`;
      }

      currentPrice -= reduction;
      steps.push({ label, reduction, priceAfter: currentPrice });
    }

    const totalSaved = original - currentPrice;
    const totalPercentSaved = original > 0 ? (totalSaved / original) * 100 : 0;

    return { finalPrice: currentPrice, totalSaved, totalPercentSaved, steps };
  }, [prixOriginal, discounts]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Shopping</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>remise</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le prix final apres une ou plusieurs reductions. Cumulez pourcentages et montants fixes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Original price */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Prix original</h2>
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant (&euro;)</label>
                <input type="number" step="0.01" value={prixOriginal} onChange={(e) => setPrixOriginal(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
              </div>
            </div>

            {/* Discounts */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Reductions</h2>
              <div className="mt-4 space-y-3">
                {discounts.map((d, i) => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>#{i + 1}</span>
                    <select value={d.type} onChange={(e) => updateDiscount(d.id, "type", e.target.value)}
                      className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                      <option value="percent">Pourcentage (%)</option>
                      <option value="fixed">Montant fixe (&euro;)</option>
                    </select>
                    <input type="number" step="0.01" value={d.value} onChange={(e) => updateDiscount(d.id, "value", e.target.value)}
                      className="w-24 rounded-lg border px-3 py-2 text-sm font-bold" style={{ borderColor: "var(--border)" }} />
                    {discounts.length > 1 && (
                      <button onClick={() => removeDiscount(d.id)} className="ml-auto text-xs font-semibold transition-all hover:opacity-70" style={{ color: "var(--muted)" }}>
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addDiscount}
                className="mt-4 w-full rounded-xl border-2 border-dashed py-3 text-xs font-semibold transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                + Ajouter une reduction
              </button>
            </div>

            {/* Result */}
            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix final</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.finalPrice)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Economie</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>-{fmt(result.totalSaved)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Reduction totale</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>-{result.totalPercentSaved.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Steps */}
                {result.steps.length > 1 && (
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Detail des reductions</h2>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-xl px-4 py-2" style={{ background: "var(--surface-alt)" }}>
                        <span className="text-xs font-semibold">Prix de depart</span>
                        <span className="text-sm font-bold">{fmt(parseFloat(prixOriginal) || 0)} &euro;</span>
                      </div>
                      {result.steps.map((step, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2" style={{ background: "var(--surface-alt)" }}>
                          <span className="text-xs font-semibold">
                            Reduction {i + 1} <span style={{ color: "var(--accent)" }}>({step.label})</span>
                          </span>
                          <span className="text-sm font-bold">{fmt(step.priceAfter)} &euro;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual bar */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="flex h-8 overflow-hidden rounded-full">
                    <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${((result.finalPrice) / (parseFloat(prixOriginal) || 1)) * 100}%`, background: "var(--primary)", minWidth: "20%" }}>
                      {fmt(result.finalPrice)} &euro;
                    </div>
                    <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${result.totalPercentSaved}%`, background: "var(--accent)", minWidth: result.totalSaved > 0 ? "15%" : "0%" }}>
                      -{fmt(result.totalSaved)} &euro;
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Cumul de reductions</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Reductions successives</strong> : Quand vous cumulez plusieurs remises, elles s&apos;appliquent en cascade. 20% + 10% ne font pas 30%, mais 28% au total (le second s&apos;applique sur le prix deja reduit).</p>
                <p><strong className="text-[var(--foreground)]">Exemple</strong> : Sur un article a 100 &euro;, une remise de 20% donne 80 &euro;. Puis 10% supplementaires sur 80 &euro; = 72 &euro; final (soit 28% d&apos;economie totale).</p>
                <p><strong className="text-[var(--foreground)]">Montant fixe</strong> : Les reductions en montant fixe (bons d&apos;achat, coupons) se deduisent directement du prix courant.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Raccourcis remises</h3>
              <div className="mt-3 space-y-2">
                {[
                  { pct: "10%", sur100: "90 €" },
                  { pct: "20%", sur100: "80 €" },
                  { pct: "25%", sur100: "75 €" },
                  { pct: "30%", sur100: "70 €" },
                  { pct: "50%", sur100: "50 €" },
                  { pct: "70%", sur100: "30 €" },
                ].map((r) => (
                  <div key={r.pct} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{r.pct}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{r.sur100} / 100</span>
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
