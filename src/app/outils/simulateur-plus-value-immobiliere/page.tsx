"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

function calcAbattementIR(annees: number): number {
  if (annees <= 5) return 0;
  if (annees <= 21) return (annees - 5) * 6;
  if (annees === 22) return (21 - 5) * 6 + 4;
  return 100;
}

function calcAbattementPS(annees: number): number {
  if (annees <= 5) return 0;
  if (annees <= 21) return (annees - 5) * 1.65;
  if (annees === 22) return (21 - 5) * 1.65 + 1.6;
  if (annees <= 30) return (21 - 5) * 1.65 + 1.6 + (annees - 22) * 9;
  return 100;
}

// Taxe sur les plus-values immobilieres elevees (art. 1609 nonies G CGI) :
// le taux s'applique a la TOTALITE de la plus-value imposable, avec un lissage
// a l'entree de chaque tranche.
function calcSurtaxe(pvNetteIR: number): number {
  const pv = Math.floor(pvNetteIR);
  if (pv <= 50000) return 0;
  if (pv <= 60000) return 0.02 * pv - (60000 - pv) / 20;
  if (pv <= 100000) return 0.02 * pv;
  if (pv <= 110000) return 0.03 * pv - (110000 - pv) / 10;
  if (pv <= 150000) return 0.03 * pv;
  if (pv <= 160000) return 0.04 * pv - (160000 - pv) * 0.15;
  if (pv <= 200000) return 0.04 * pv;
  if (pv <= 210000) return 0.05 * pv - (210000 - pv) * 0.2;
  if (pv <= 250000) return 0.05 * pv;
  if (pv <= 260000) return 0.06 * pv - (260000 - pv) * 0.25;
  return 0.06 * pv;
}

export default function SimulateurPlusValueImmobiliere() {
  const [prixAchat, setPrixAchat] = useState("200000");
  const [prixVente, setPrixVente] = useState("300000");
  const [anneeAchat, setAnneeAchat] = useState("2015");
  const [fraisMode, setFraisMode] = useState<"pourcentage" | "montant">("pourcentage");
  const [fraisPourcentage, setFraisPourcentage] = useState("7.5");
  const [fraisMontant, setFraisMontant] = useState("0");
  const [travaux, setTravaux] = useState("0");

  const resultats = useMemo(() => {
    const achat = parseFloat(prixAchat) || 0;
    const vente = parseFloat(prixVente) || 0;
    const annee = parseInt(anneeAchat) || 2020;
    const montantTravaux = parseFloat(travaux) || 0;

    const fraisAcquisition =
      fraisMode === "pourcentage"
        ? achat * ((parseFloat(fraisPourcentage) || 0) / 100)
        : parseFloat(fraisMontant) || 0;

    const anneeVente = new Date().getFullYear();
    const dureeDetention = Math.max(0, anneeVente - annee);

    const pvBrute = vente - (achat + fraisAcquisition + montantTravaux);

    if (pvBrute <= 0) {
      return {
        pvBrute,
        dureeDetention,
        abattementIRPct: 0,
        abattementPSPct: 0,
        pvNetteIR: 0,
        pvNettePS: 0,
        ir: 0,
        ps: 0,
        surtaxe: 0,
        impotTotal: 0,
        pvNette: pvBrute,
        fraisAcquisition,
      };
    }

    const abattementIRPct = calcAbattementIR(dureeDetention);
    const abattementPSPct = calcAbattementPS(dureeDetention);

    const pvNetteIR = pvBrute * (1 - abattementIRPct / 100);
    const pvNettePS = pvBrute * (1 - abattementPSPct / 100);

    const ir = pvNetteIR * 0.19;
    const ps = pvNettePS * 0.172;
    const surtaxe = calcSurtaxe(pvNetteIR);

    const impotTotal = ir + ps + surtaxe;
    const pvNette = pvBrute - impotTotal;

    return {
      pvBrute,
      dureeDetention,
      abattementIRPct,
      abattementPSPct,
      pvNetteIR,
      pvNettePS,
      ir,
      ps,
      surtaxe,
      impotTotal,
      pvNette,
      fraisAcquisition,
    };
  }, [prixAchat, prixVente, anneeAchat, fraisMode, fraisPourcentage, fraisMontant, travaux]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtPct = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Immobilier</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>Plus-Value Immobilière</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez l&apos;impôt sur la plus-value de votre bien immobilier : IR, prélèvements sociaux, surtaxe et abattements par durée de détention.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix d&apos;achat (&euro;)</label>
                  <input type="number" value={prixAchat} onChange={(e) => setPrixAchat(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix de vente (&euro;)</label>
                  <input type="number" value={prixVente} onChange={(e) => setPrixVente(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Année d&apos;achat</label>
                  <input type="number" value={anneeAchat} onChange={(e) => setAnneeAchat(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant des travaux (&euro;)</label>
                  <input type="number" value={travaux} onChange={(e) => setTravaux(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Frais d&apos;acquisition</label>
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => setFraisMode("pourcentage")}
                    className="rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
                    style={{
                      borderColor: fraisMode === "pourcentage" ? "var(--primary)" : "var(--border)",
                      background: fraisMode === "pourcentage" ? "var(--primary)" : "transparent",
                      color: fraisMode === "pourcentage" ? "white" : "var(--foreground)",
                    }}
                  >
                    % du prix
                  </button>
                  <button
                    onClick={() => setFraisMode("montant")}
                    className="rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
                    style={{
                      borderColor: fraisMode === "montant" ? "var(--primary)" : "var(--border)",
                      background: fraisMode === "montant" ? "var(--primary)" : "transparent",
                      color: fraisMode === "montant" ? "white" : "var(--foreground)",
                    }}
                  >
                    Montant fixe
                  </button>
                </div>
                <div className="mt-3">
                  {fraisMode === "pourcentage" ? (
                    <div>
                      <input type="number" value={fraisPourcentage} onChange={(e) => setFraisPourcentage(e.target.value)}
                        className="w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Défaut : 7,5% (frais de notaire estimées)</p>
                    </div>
                  ) : (
                    <input type="number" value={fraisMontant} onChange={(e) => setFraisMontant(e.target.value)}
                      className="w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  )}
                </div>
              </div>
            </div>

            {/* Resultats principaux */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Plus-value nette après impôt</p>
              <p className="mt-3 text-6xl font-bold" style={{
                fontFamily: "var(--font-display)",
                color: resultats.pvNette >= 0 ? "var(--primary)" : "#dc2626",
              }}>
                {fmt(resultats.pvNette)} &euro;
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Durée de détention : <strong className="text-[var(--foreground)]">{resultats.dureeDetention} ans</strong>
              </p>
            </div>

            {/* Detail calcul */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détail du calcul</h2>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Plus-value brute", value: `${fmt(resultats.pvBrute)} \u20AC` },
                  { label: "Frais d'acquisition", value: `${fmt(resultats.fraisAcquisition)} \u20AC` },
                  { label: "Abattement IR", value: `${fmtPct(resultats.abattementIRPct)} %` },
                  { label: "Abattement PS", value: `${fmtPct(resultats.abattementPSPct)} %` },
                  { label: "PV nette IR (après abattement)", value: `${fmt(resultats.pvNetteIR)} \u20AC` },
                  { label: "PV nette PS (après abattement)", value: `${fmt(resultats.pvNettePS)} \u20AC` },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>{item.label}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Impots */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Imposition</h2>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "IR (19%)", value: fmt(resultats.ir), color: "#ea580c" },
                  { label: "PS (17,2%)", value: fmt(resultats.ps), color: "#ea580c" },
                  { label: "Surtaxe", value: fmt(resultats.surtaxe), color: resultats.surtaxe > 0 ? "#dc2626" : "var(--muted)" },
                  { label: "Total impôt", value: fmt(resultats.impotTotal), color: "#dc2626" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
                    <p className="text-xs font-semibold uppercase" style={{ color: "var(--muted)" }}>{item.label}</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: item.color }}>{item.value} &euro;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bareme abattements */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Barème des abattements</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th className="py-2 text-left font-semibold" style={{ color: "var(--muted)" }}>Durée</th>
                      <th className="py-2 text-right font-semibold" style={{ color: "var(--muted)" }}>Abattement IR</th>
                      <th className="py-2 text-right font-semibold" style={{ color: "var(--muted)" }}>Abattement PS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { duree: "0 à 5 ans", ir: "0%", ps: "0%" },
                      { duree: "6 à 21 ans", ir: "6% / an", ps: "1,65% / an" },
                      { duree: "22e année", ir: "4%", ps: "1,60%" },
                      { duree: "23 à 30 ans", ir: "-", ps: "9% / an" },
                      { duree: "Au-delà 22 ans", ir: "Exonéré", ps: "-" },
                      { duree: "Au-delà 30 ans", ir: "Exonéré", ps: "Exonéré" },
                    ].map((row) => (
                      <tr key={row.duree} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td className="py-2 font-medium">{row.duree}</td>
                        <td className="py-2 text-right" style={{ color: "var(--muted)" }}>{row.ir}</td>
                        <td className="py-2 text-right" style={{ color: "var(--muted)" }}>{row.ps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment calculer la plus-value immobilière
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>La plus-value immobilière correspond à la différence entre le prix de vente et le prix d&apos;acquisition d&apos;un bien immobilier. Elle est soumise à l&apos;impôt sur le revenu (19%) et aux prélèvements sociaux (17,2%), avec des abattements progressifs selon la durée de détention.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Prix d&apos;acquisition</strong> : prix d&apos;achat + frais d&apos;acquisition (forfait 7,5% ou frais réels) + travaux (forfait 15% après 5 ans ou montant réel).</li>
                  <li><strong className="text-[var(--foreground)]">Abattements IR</strong> : exonération totale après 22 ans de détention. 6% par an de la 6e à la 21e année, puis 4% la 22e année.</li>
                  <li><strong className="text-[var(--foreground)]">Abattements PS</strong> : exonération totale après 30 ans. 1,65% par an de la 6e à la 21e année, 1,60% la 22e, puis 9% par an jusqu&apos;à la 30e année.</li>
                  <li><strong className="text-[var(--foreground)]">Surtaxe</strong> : si la plus-value nette dépasse 50 000 &euro;, une surtaxe de 2% à 6% s&apos;applique progressivement.</li>
                </ul>
                <p>La résidence principale est exonérée de toute imposition sur la plus-value. Ce simulateur concerne les résidences secondaires et les investissements locatifs.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Ma résidence principale est-elle concernée ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non. La vente de votre résidence principale est totalement exonérée d&apos;impôt sur la plus-value, quelle que soit la durée de détention ou le montant de la plus-value. Cette exonération est l&apos;un des principaux avantages fiscaux liés à la propriété en France.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien de temps faut-il garder un bien pour ne pas payer d&apos;impôt ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Pour être totalement exonéré d&apos;impôt sur le revenu (IR), il faut détenir le bien plus de 22 ans. Pour être aussi exonéré des prélèvements sociaux (PS), il faut attendre plus de 30 ans de détention. Entre 22 et 30 ans, vous ne payez que les prélèvements sociaux avec un abattement progressif.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qu&apos;est-ce que la surtaxe sur les plus-values ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Lorsque la plus-value nette imposable (après abattement pour durée de détention) dépasse 50 000 &euro;, une surtaxe progressive s&apos;ajoute à l&apos;IR et aux PS. Son taux varie de 2% (entre 50 001 et 60 000 &euro;) à 6% (au-delà de 260 000 &euro;). Elle est calculée sur la totalité de la plus-value nette.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Les travaux sont-ils déductibles ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui. Les travaux de construction, reconstruction, agrandissement ou amélioration peuvent être ajoutés au prix d&apos;acquisition pour réduire la plus-value. Après 5 ans de détention, vous pouvez aussi opter pour un forfait de 15% du prix d&apos;achat sans avoir à fournir de justificatifs.</p>
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
