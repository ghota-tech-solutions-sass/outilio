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
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Shopping</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>remise</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le prix final apres une ou plusieurs reductions. Cumulez pourcentages et montants fixes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
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

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur de remise
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce calculateur de remise vous permet de connaitre instantanement le prix final d&apos;un article apres une ou plusieurs reductions. Ideal pendant les soldes, le Black Friday ou pour verifier une promotion en magasin.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Entrez le prix original</strong> : saisissez le prix de depart de l&apos;article en euros avant toute reduction.</li>
                  <li><strong className="text-[var(--foreground)]">Ajoutez une ou plusieurs reductions</strong> : choisissez entre un pourcentage (ex : -20%) ou un montant fixe (ex : -10 &euro;) pour chaque remise.</li>
                  <li><strong className="text-[var(--foreground)]">Cumulez les promotions</strong> : ajoutez autant de reductions que necessaire. Elles s&apos;appliquent en cascade sur le prix deja reduit.</li>
                  <li><strong className="text-[var(--foreground)]">Consultez le detail</strong> : visualisez l&apos;economie totale, le pourcentage de reduction reel et le detail etape par etape.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi deux remises de 20% et 10% ne font-elles pas 30% ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Lorsque plusieurs remises se cumulent, chaque reduction s&apos;applique sur le prix deja reduit, pas sur le prix initial. Par exemple, sur 100 &euro; : la premiere remise de 20% donne 80 &euro;, puis la seconde de 10% s&apos;applique sur 80 &euro; (soit -8 &euro;), pour un total de 72 &euro; &mdash; ce qui correspond a 28% de reduction reelle.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la reglementation des soldes en France ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>En France, les soldes se deroulent deux fois par an sur des periodes de 4 semaines fixees par arrete prefectoral. Les commercants doivent afficher clairement le prix de reference (le prix le plus bas pratique dans les 30 jours precedents) et le nouveau prix solde, conformement a la directive europeenne Omnibus.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Peut-on cumuler un code promo avec une remise en magasin ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Cela depend de la politique du commercant. Certaines enseignes autorisent le cumul d&apos;un code promotionnel avec les soldes ou les remises en cours, tandis que d&apos;autres l&apos;interdisent. Utilisez notre calculateur pour simuler le resultat final quel que soit le scenario.</p>
                </div>
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
