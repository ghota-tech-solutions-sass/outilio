"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function SimulateurFlatTaxCrypto() {
  const [prixAcquisition, setPrixAcquisition] = useState("5000");
  const [prixCession, setPrixCession] = useState("12000");
  const [montantCession, setMontantCession] = useState("3000");
  const [totalCessionsAnnuelles, setTotalCessionsAnnuelles] = useState("3000");

  const results = useMemo(() => {
    const acq = parseFloat(prixAcquisition) || 0;
    const cess = parseFloat(prixCession) || 0;
    const montant = parseFloat(montantCession) || 0;
    const totalCessions = parseFloat(totalCessionsAnnuelles) || 0;

    if (acq <= 0 || cess <= 0 || montant <= 0) return null;

    const plusValue = montant - (acq * (montant / cess));
    const exonere = totalCessions < 305;

    const tauxIR = 0.128;
    const tauxPS = 0.172;
    const tauxTotal = 0.30;

    const montantIR = exonere ? 0 : Math.max(0, plusValue * tauxIR);
    const montantPS = exonere ? 0 : Math.max(0, plusValue * tauxPS);
    const impotTotal = exonere ? 0 : Math.max(0, plusValue * tauxTotal);
    const netApresImpot = montant - Math.max(0, impotTotal);

    return {
      plusValue,
      montantIR,
      montantPS,
      impotTotal,
      netApresImpot,
      exonere,
      tauxEffectif: montant > 0 ? (impotTotal / montant) * 100 : 0,
    };
  }, [prixAcquisition, prixCession, montantCession, totalCessionsAnnuelles]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>Flat Tax Crypto</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez l&apos;impot sur vos plus-values de cession de cryptomonnaies en France. Flat tax 30% (PFU).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix d&apos;acquisition total du portefeuille</label>
                  <div className="relative mt-2">
                    <input type="number" value={prixAcquisition} onChange={(e) => setPrixAcquisition(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 pr-10 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Valeur globale du portefeuille au moment de la cession</label>
                  <div className="relative mt-2">
                    <input type="number" value={prixCession} onChange={(e) => setPrixCession(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 pr-10 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant de la cession</label>
                  <div className="relative mt-2">
                    <input type="number" value={montantCession} onChange={(e) => setMontantCession(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 pr-10 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total cessions annuelles</label>
                  <div className="relative mt-2">
                    <input type="number" value={totalCessionsAnnuelles} onChange={(e) => setTotalCessionsAnnuelles(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 pr-10 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            {results && (
              <>
                {results.exonere && (
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "#16a34a" }}>
                    <p className="text-sm font-bold" style={{ color: "#16a34a" }}>Exoneration applicable : total des cessions annuelles inferieur a 305 &euro;</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Vous n&apos;etes pas imposable sur ces plus-values.</p>
                  </div>
                )}

                <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Plus-value imposable</p>
                  <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: results.plusValue >= 0 ? "#16a34a" : "#dc2626" }}>
                    {fmt(results.plusValue)} &euro;
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                    {results.plusValue >= 0 ? "Gain" : "Moins-value (non imposable)"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Impot sur le revenu</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(results.montantIR)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>12,8%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prelevements sociaux</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(results.montantPS)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>17,2%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Impot total (PFU)</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#dc2626" }}>{fmt(results.impotTotal)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>30%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Net apres impot</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#16a34a" }}>{fmt(results.netApresImpot)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>sur {fmt(parseFloat(montantCession) || 0)} &euro;</p>
                  </div>
                </div>

                {/* Detail breakdown */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Detail du calcul</h2>
                  <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                    <div className="flex justify-between">
                      <span>Prix d&apos;acquisition total</span>
                      <span className="font-medium text-[var(--foreground)]">{fmt(parseFloat(prixAcquisition) || 0)} &euro;</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valeur globale portefeuille</span>
                      <span className="font-medium text-[var(--foreground)]">{fmt(parseFloat(prixCession) || 0)} &euro;</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Montant de la cession</span>
                      <span className="font-medium text-[var(--foreground)]">{fmt(parseFloat(montantCession) || 0)} &euro;</span>
                    </div>
                    <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
                      <div className="flex justify-between">
                        <span>Quote-part d&apos;acquisition</span>
                        <span className="font-medium text-[var(--foreground)]">{fmt((parseFloat(prixAcquisition) || 0) * ((parseFloat(montantCession) || 0) / (parseFloat(prixCession) || 1)))} &euro;</span>
                      </div>
                    </div>
                    <div className="flex justify-between font-semibold text-[var(--foreground)]">
                      <span>Plus-value</span>
                      <span>{fmt(results.plusValue)} &euro;</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux effectif d&apos;imposition</span>
                      <span className="font-medium text-[var(--foreground)]">{results.tauxEffectif.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Flat Tax crypto : comment ca marche ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>En France, les plus-values realisees lors de la cession d&apos;actifs numeriques (Bitcoin, Ethereum, etc.) sont soumises au Prelevement Forfaitaire Unique (PFU), communement appele &laquo; flat tax &raquo;, au taux de 30%.</p>
                <p><strong className="text-[var(--foreground)]">Decomposition de la flat tax</strong> :</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">12,8%</strong> d&apos;impot sur le revenu (IR)</li>
                  <li><strong className="text-[var(--foreground)]">17,2%</strong> de prelevements sociaux (PS)</li>
                </ul>
                <p><strong className="text-[var(--foreground)]">Calcul de la plus-value</strong> : Plus-value = Prix de cession - (Prix total d&apos;acquisition x Montant de la cession / Valeur globale du portefeuille). Cette formule prend en compte la quote-part d&apos;acquisition proportionnelle au montant cede.</p>
                <p><strong className="text-[var(--foreground)]">Seuil d&apos;exoneration</strong> : si le total de vos cessions annuelles est inferieur a 305 &euro;, vous etes exonere d&apos;impot sur les plus-values crypto.</p>
                <p>Les moins-values (pertes) ne sont pas deductibles des revenus d&apos;autres categories mais peuvent etre compensees avec les plus-values de meme nature sur la meme annee fiscale.</p>
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Regles fiscales crypto en France (2026)
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Fait generateur</strong> : la conversion de crypto en monnaie fiduciaire (EUR) ou le paiement d&apos;un bien/service declenche l&apos;imposition. Les echanges crypto-crypto ne sont pas imposables.</li>
                  <li><strong className="text-[var(--foreground)]">Declaration obligatoire</strong> : tout compte sur une plateforme etrangere doit etre declare (formulaire 3916-bis). Les plus-values se declarent via le formulaire 2086.</li>
                  <li><strong className="text-[var(--foreground)]">Option bareme progressif</strong> : vous pouvez opter pour le bareme progressif de l&apos;IR au lieu de la flat tax si c&apos;est plus avantageux (TMI inferieure a 12,8%).</li>
                  <li><strong className="text-[var(--foreground)]">Activite professionnelle</strong> : les traders professionnels relevent des BIC (Benefices Industriels et Commerciaux) avec des regles differentes.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Les echanges crypto-crypto sont-ils imposables ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non. En France, seules les conversions en monnaie fiduciaire (euros, dollars) ou les achats de biens/services avec des cryptomonnaies declenchent l&apos;imposition. Echanger du Bitcoin contre de l&apos;Ethereum, par exemple, n&apos;est pas un fait generateur d&apos;impot.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Que se passe-t-il si je fais une moins-value ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Une moins-value (perte) n&apos;entraine aucune imposition. Elle peut venir en deduction des plus-values realisees sur d&apos;autres cessions de la meme annee fiscale. En revanche, elle ne peut pas etre reportee sur les annees suivantes ni deduite de vos autres revenus.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Puis-je choisir le bareme progressif plutot que la flat tax ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, vous pouvez opter pour le bareme progressif de l&apos;impot sur le revenu lors de votre declaration. C&apos;est avantageux si votre tranche marginale d&apos;imposition (TMI) est inferieure a 12,8%. Attention : ce choix s&apos;applique a l&apos;ensemble de vos revenus soumis au PFU (dividendes, interets, etc.).</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Dois-je declarer mes comptes crypto a l&apos;etranger ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, tout compte ouvert sur une plateforme situee a l&apos;etranger (Binance, Kraken, Coinbase, etc.) doit etre declare chaque annee via le formulaire 3916-bis. Le non-respect de cette obligation peut entrainer une amende de 750 &euro; par compte non declare, portee a 1 500 &euro; pour les comptes d&apos;une valeur superieure a 50 000 &euro;.</p>
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
