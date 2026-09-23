"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

type Tranche = { min: number; max: number; rate: number; label: string };

const PRESETS_REVENU = [
  { label: "SMIC", value: 17100 },
  { label: "Médian", value: 26400 },
  { label: "Cadre", value: 48000 },
  { label: "Top 10%", value: 96000 },
];

const REVENU_MIN = 10000;
const REVENU_MAX = 200000;
const REVENU_STEP = 1000;

// Baremes officiels connus (source: loi de finances)
// Les seuils sont revalorises chaque annee en fonction de l'inflation.
// Pour les annees futures sans bareme officiel, on extrapole a partir du dernier
// bareme connu avec le taux de revalorisation moyen (~2%).
// Cle = annee des revenus (imposition l'annee suivante).
type ParamsAnnee = {
  seuils: number[]; // [seuil_0%, seuil_11%, seuil_30%, seuil_41%]
  plafondDemiPart: number; // plafonnement du quotient familial par demi-part
  decoteSeul: number; // forfait decote celibataire (decote = forfait - 45,25% x impot brut)
  decoteCouple: number; // forfait decote imposition commune
  plafondParentIsole: number; // plafond de la part du 1er enfant d'un parent isole (case T, CGI 194-II)
};

const BAREMES_OFFICIELS: Record<number, ParamsAnnee> = {
  // Revenus 2023 (LF 2024, +4,8%)
  2023: { seuils: [11294, 28797, 82341, 177106], plafondDemiPart: 1759, decoteSeul: 873, decoteCouple: 1444, plafondParentIsole: 4149 },
  // Revenus 2024 (LF 2025, +1,8%)
  2024: { seuils: [11497, 29315, 83823, 180294], plafondDemiPart: 1791, decoteSeul: 889, decoteCouple: 1470, plafondParentIsole: 4224 },
  // Revenus 2025 (LF 2026, +0,9%) - service-public.gouv.fr F1419 et F35120 (parent isole), BOI-IR-LIQ-20-20-20
  2025: { seuils: [11600, 29579, 84577, 181917], plafondDemiPart: 1807, decoteSeul: 897, decoteCouple: 1483, plafondParentIsole: 4262 },
};

const TAUX_DECOTE = 0.4525;

const TAUX = [0, 0.11, 0.30, 0.41, 0.45];
const TAUX_LABELS = ["0%", "11%", "30%", "41%", "45%"];
const REVALORISATION = 0.02; // ~2% annuel moyen

function getLastOfficiel(): { annee: number; params: ParamsAnnee } {
  const annees = Object.keys(BAREMES_OFFICIELS).map(Number).sort((a, b) => b - a);
  const annee = annees[0];
  return { annee, params: BAREMES_OFFICIELS[annee] };
}

function getParamsPourAnnee(annee: number): ParamsAnnee {
  if (BAREMES_OFFICIELS[annee]) return BAREMES_OFFICIELS[annee];
  const last = getLastOfficiel();
  const delta = annee - last.annee;
  if (delta <= 0) return last.params; // annee avant le plus ancien connu
  const factor = Math.pow(1 + REVALORISATION, delta);
  const p = last.params;
  return {
    seuils: p.seuils.map((s) => Math.round(s * factor)),
    plafondDemiPart: Math.round(p.plafondDemiPart * factor),
    decoteSeul: Math.round(p.decoteSeul * factor),
    decoteCouple: Math.round(p.decoteCouple * factor),
    plafondParentIsole: Math.round(p.plafondParentIsole * factor),
  };
}

function buildTranches(seuils: number[]): Tranche[] {
  const limits = [0, ...seuils, Infinity];
  return TAUX.map((rate, i) => ({
    min: limits[i],
    max: limits[i + 1],
    rate,
    label: TAUX_LABELS[i],
  }));
}

function buildBaremes() {
  const now = new Date();
  const currentYear = now.getFullYear();
  // Couvrir de 2023 jusqu'a l'annee en cours
  const startYear = Math.min(...Object.keys(BAREMES_OFFICIELS).map(Number));
  const endYear = currentYear;
  const result: { annee: number; label: string; tranches: Tranche[]; params: ParamsAnnee; estime: boolean }[] = [];
  for (let y = endYear; y >= startYear; y--) {
    const params = getParamsPourAnnee(y);
    result.push({
      annee: y,
      label: `Revenus ${y} (déclaration ${y + 1})`,
      tranches: buildTranches(params.seuils),
      params,
      estime: !BAREMES_OFFICIELS[y],
    });
  }
  return result;
}

const BAREMES = buildBaremes();

function getDefaultAnnee(): number {
  // Par defaut : dernier bareme officiel connu (jamais une annee extrapolee)
  return BAREMES.find((b) => !b.estime)?.annee ?? BAREMES[0].annee;
}

function impotBareme(revenuNet: number, parts: number, tranches: Tranche[]): number {
  const quotient = revenuNet / parts;
  let impotParPart = 0;
  for (const t of tranches) {
    if (quotient <= t.min) break;
    impotParPart += (Math.min(quotient, t.max) - t.min) * t.rate;
  }
  return impotParPart * parts;
}

function simulerImpot(revenuNet: number, parts: number, partsBase: number, couple: boolean, tranches: Tranche[], params: ParamsAnnee, parentIsole = false) {
  const quotient = revenuNet / parts;
  let impotParPart = 0;
  const details: { tranche: string; base: number; taux: number; impot: number }[] = [];

  for (const t of tranches) {
    if (quotient <= t.min) break;
    const base = Math.min(quotient, t.max) - t.min;
    const imp = base * t.rate;
    impotParPart += imp;
    if (base > 0) {
      details.push({ tranche: `${t.min.toLocaleString("fr-FR")} - ${t.max === Infinity ? "+" : t.max.toLocaleString("fr-FR")} €`, taux: t.rate, base, impot: imp });
    }
  }

  const impotQuotient = impotParPart * parts;

  // Plafonnement du quotient familial (art. 197 I-2 CGI) : l'avantage procure par
  // chaque demi-part au-dela de 1 part (celibataire) ou 2 parts (couple) est plafonne.
  // Parent isole (case T, CGI 194-II) : la part du 1er enfant (2 demi-parts) est plafonnee a
  // plafondParentIsole (4 262 EUR pour les revenus 2025), les demi-parts suivantes au plafond general.
  const demiPartsSupp = Math.max(0, (parts - partsBase) * 2);
  const impotSansQF = impotBareme(revenuNet, partsBase, tranches);
  const demiPartsIsole = parentIsole && !couple ? Math.min(2, demiPartsSupp) : 0;
  const plafondTotal = (params.plafondParentIsole / 2) * demiPartsIsole + params.plafondDemiPart * (demiPartsSupp - demiPartsIsole);
  const impotPlafonne = impotSansQF - plafondTotal;
  const plafonnement = Math.max(0, impotPlafonne - impotQuotient);
  const impotBrut = Math.max(impotQuotient, impotPlafonne);

  // Decote (art. 197 I-4 CGI)
  const forfaitDecote = couple ? params.decoteCouple : params.decoteSeul;
  const seuilDecote = forfaitDecote / TAUX_DECOTE;
  const decote = impotBrut > 0 && impotBrut < seuilDecote
    ? Math.min(impotBrut, Math.max(0, forfaitDecote - TAUX_DECOTE * impotBrut))
    : 0;

  const impotTotal = Math.max(0, impotBrut - decote);
  const tauxMoyen = revenuNet > 0 ? (impotTotal / revenuNet) * 100 : 0;
  const tauxMarginal = tranches.findLast((t) => quotient > t.min)?.rate ?? 0;
  const revenuApresImpot = revenuNet - impotTotal;

  return { impotTotal, impotQuotient, plafonnement, decote, tauxMoyen, tauxMarginal, revenuApresImpot, details, impotParPart };
}

export default function SimulateurImpot() {
  const [revenu, setRevenu] = useState("35000");
  const [parts, setParts] = useState("1");
  const [situation, setSituation] = useState("celibataire");
  const [parentIsole, setParentIsole] = useState(false);
  const [annee, setAnnee] = useState(() => getDefaultAnnee());

  const partsNum = Math.max(1, parseFloat(parts) || 1);
  const revenuNum = parseFloat(revenu) || 0;
  const bareme = BAREMES.find((b) => b.annee === annee) ?? BAREMES[0];
  const couple = situation === "couple";
  const partsBase = Math.min(couple ? 2 : 1, partsNum);
  const parentIsolePossible = !couple && partsNum >= 1.5;
  const parentIsoleActif = parentIsole && parentIsolePossible;

  const result = useMemo(
    () => simulerImpot(revenuNum, partsNum, partsBase, couple, bareme.tranches, bareme.params, parentIsoleActif),
    [revenuNum, partsNum, partsBase, couple, bareme.tranches, bareme.params, parentIsoleActif]
  );

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtPct = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>impôt sur le revenu</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre impôt sur les revenus {annee} avec le barème officiel. Quotient familial et taux marginal inclus.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="space-y-4">
                {/* Annee de revenus */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Année de revenus
                  </label>
                  <select
                    value={annee}
                    onChange={(e) => setAnnee(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {BAREMES.map((b) => (
                      <option key={b.annee} value={b.annee}>
                        {b.label}{b.estime ? " (estimé)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Revenu net imposable annuel
                  </label>
                  <div className="relative mt-2">
                    <input type="number" value={revenu} onChange={(e) => setRevenu(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>&euro;/an</span>
                  </div>
                  {/* Slider */}
                  <input
                    type="range"
                    min={REVENU_MIN}
                    max={REVENU_MAX}
                    step={REVENU_STEP}
                    value={Math.min(Math.max(parseFloat(revenu) || 0, REVENU_MIN), REVENU_MAX)}
                    onChange={(e) => setRevenu(e.target.value)}
                    className="mt-3 w-full accent-[#0d4f3c]"
                    aria-label="Curseur revenu net imposable"
                  />
                  {/* Presets */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRESETS_REVENU.map((p) => {
                      const isActive = parseFloat(revenu) === p.value;
                      return (
                        <button
                          key={p.label}
                          onClick={() => setRevenu(String(p.value))}
                          className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                          style={{
                            borderColor: isActive ? "var(--primary)" : "var(--border)",
                            color: isActive ? "var(--primary)" : "var(--muted)",
                            background: isActive ? "rgba(13,79,60,0.06)" : "transparent",
                          }}
                        >
                          {p.label}{" "}
                          <span style={{ color: isActive ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                            {p.value.toLocaleString("fr-FR")} €
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Situation</label>
                    <select value={situation} onChange={(e) => {
                      const v = e.target.value;
                      setSituation(v);
                      if (v === "couple" && (parseFloat(parts) || 1) < 2) setParts("2");
                      if (v === "celibataire" && parts === "2") setParts("1");
                    }}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }}>
                      <option value="celibataire">Célibataire</option>
                      <option value="couple">Couple (marié/pacsé)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre de parts</label>
                    <input type="number" step="0.5" min="1" value={parts} onChange={(e) => setParts(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }} />
                  </div>
                </div>
                {parentIsolePossible && (
                  <label className="mt-4 flex items-start gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                    <input type="checkbox" checked={parentIsole} onChange={(e) => setParentIsole(e.target.checked)}
                      className="mt-0.5 h-4 w-4" style={{ accentColor: "var(--primary)" }} />
                    <span>
                      Parent isolé (case T)
                      <span className="block text-xs" style={{ color: "var(--muted)" }}>
                        Vous vivez seul avec vos enfants à charge : 2 parts avec 1 enfant, 2,5 avec 2 enfants (garde exclusive). La part du 1er enfant est plafonnée à {bareme.params.plafondParentIsole.toLocaleString("fr-FR")} €.
                      </span>
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Big results */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox label="Impôt total" value={`${fmt(result.impotTotal)} €`} primary />
              <StatBox label="Par mois" value={`${fmt(result.impotTotal / 12)} €`} />
              <StatBox label="Taux moyen" value={`${fmtPct(result.tauxMoyen)}%`} />
              <StatBox label="Taux marginal" value={`${(result.tauxMarginal * 100).toFixed(0)}%`} accent />
            </div>

            {/* Remaining income + Donut visualisation */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Répartition du revenu
              </h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                <div className="flex justify-center">
                  <DonutChart
                    impot={result.impotTotal}
                    net={result.revenuApresImpot}
                    revenu={revenuNum}
                  />
                </div>
                <div className="space-y-1">
                  <Row label="Revenu net imposable" value={`${fmt(revenuNum)} €`} />
                  <Row label="Impôt sur le revenu" value={`- ${fmt(result.impotTotal)} €`} sub dotColor="#dc2626" />
                  <Row label="Revenu net après impôt" value={`${fmt(result.revenuApresImpot)} €`} highlight primary dotColor="#0d4f3c" />
                  <Row label="Soit par mois" value={`${fmt(result.revenuApresImpot / 12)} €`} />
                </div>
              </div>

              {/* TMI + Taux moyen contextuels */}
              {revenuNum > 0 && (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Votre TMI (Taux Marginal)
                    </p>
                    <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: result.tauxMarginal >= 0.30 ? "#dc2626" : "var(--primary)" }}>
                      {(result.tauxMarginal * 100).toFixed(0)}%
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                      {result.tauxMarginal === 0 && "Vous n'êtes pas imposable."}
                      {result.tauxMarginal === 0.11 && "Tranche basse — chaque euro additionnel taxé à 11%."}
                      {result.tauxMarginal === 0.30 && "Tranche intermédiaire — optimisez vos déductions (PER, dons)."}
                      {result.tauxMarginal === 0.41 && "Tranche haute — pensez au PER, Pinel, FCPI/FIP."}
                      {result.tauxMarginal === 0.45 && "Tranche maximale — stratégie patrimoniale recommandée."}
                    </p>
                  </div>
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Taux moyen d&apos;imposition
                    </p>
                    <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                      {fmtPct(result.tauxMoyen)}%
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                      {result.tauxMoyen < 5 && "Imposition très faible — profitez-en pour épargner."}
                      {result.tauxMoyen >= 5 && result.tauxMoyen < 12 && "Imposition modérée — proche de la moyenne française."}
                      {result.tauxMoyen >= 12 && result.tauxMoyen < 20 && "Imposition conséquente — un PER peut réduire la facture."}
                      {result.tauxMoyen >= 20 && "Imposition élevée — stratégie de défiscalisation conseillée."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cross-link CTAs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Vous pourriez aussi vouloir
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CrossLinkCard
                  href="/outils/calculateur-salaire"
                  emoji="💼"
                  title="Salaire net en poche"
                  desc="Brut vers net + impôt mensuel estimé"
                />
                <CrossLinkCard
                  href="/outils/freelance-vs-cdi"
                  emoji="🏢"
                  title="Statut freelance"
                  desc="Quel TJM pour égaliser votre net ?"
                />
                <CrossLinkCard
                  href="/outils/simulateur-prime-activite"
                  emoji="💰"
                  title="Prime d'activité"
                  desc="Éligibilité et montant CAF estimé"
                />
              </div>
            </div>

            {/* Breakdown by bracket */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Détail par tranche
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="pb-3 text-left font-medium">Tranche</th>
                      <th className="pb-3 text-right font-medium">Taux</th>
                      <th className="pb-3 text-right font-medium">Base imposable</th>
                      <th className="pb-3 text-right font-medium">Impôt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.details.map((d, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                        <td className="py-3">{d.tranche}</td>
                        <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>{(d.taux * 100).toFixed(0)}%</td>
                        <td className="py-3 text-right">{fmt(d.base)} &euro;</td>
                        <td className="py-3 text-right font-semibold">{fmt(d.impot)} &euro;</td>
                      </tr>
                    ))}
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3" colSpan={3}>Impôt brut (x {partsNum} part{partsNum > 1 ? "s" : ""})</td>
                      <td className="py-3 text-right font-semibold">{fmt(result.impotQuotient)} &euro;</td>
                    </tr>
                    {result.plafonnement > 0 && (
                      <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                        <td className="py-3" colSpan={3}>Plafonnement du quotient familial</td>
                        <td className="py-3 text-right font-semibold">+ {fmt(result.plafonnement)} &euro;</td>
                      </tr>
                    )}
                    {result.decote > 0 && (
                      <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                        <td className="py-3" colSpan={3}>Décote</td>
                        <td className="py-3 text-right font-semibold">- {fmt(result.decote)} &euro;</td>
                      </tr>
                    )}
                    <tr className="border-t-2" style={{ borderColor: "var(--primary)" }}>
                      <td className="py-3 font-semibold" colSpan={3}>Impôt net</td>
                      <td className="py-3 text-right text-lg font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                        {fmt(result.impotTotal)} &euro;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual bar chart */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Barème {annee + 1} (revenus {annee})</h2>
              <div className="mt-4 space-y-2">
                {bareme.tranches.map((t, i) => {
                  const quotient = revenuNum / partsNum;
                  const isActive = quotient > t.min;
                  const fill = isActive ? Math.min(100, ((Math.min(quotient, t.max) - t.min) / (t.max === Infinity ? 200000 : t.max - t.min)) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-8 text-right text-xs font-bold" style={{ color: isActive ? "var(--primary)" : "var(--muted)" }}>{t.label}</span>
                      <div className="h-6 flex-1 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${fill}%`, background: isActive ? "var(--primary)" : "var(--border)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <ToolHowToSection
              title="Comment simuler votre impôt sur le revenu en 4 étapes"
              description="Le simulateur applique le barème officiel 2026 (loi de finances) avec quotient familial, décote pour faibles revenus et plafonnement."
              steps={[
                {
                  name: "Saisir votre revenu net imposable",
                  text:
                    "C'est votre revenu net annuel APRÈS abattement de 10 % (salaires) ou frais réels. Si vous avez votre avis d'imposition, prenez la ligne 'Revenu net imposable'. Sinon, multipliez votre net mensuel par 12 et soustrayez 10 %.",
                },
                {
                  name: "Renseigner votre situation familiale",
                  text:
                    "Célibataire = 1 part. Couple marié ou pacsé = 2 parts. Chacun des 2 premiers enfants ajoute 0,5 part. À partir du 3e enfant : +1 part. Parent isolé (case T, vivant seul avec ses enfants) : +0,5 part supplémentaire, soit 2 parts avec 1 enfant ; cochez alors la case « Parent isolé ».",
                },
                {
                  name: "Choisir l'année fiscale",
                  text:
                    "Sélectionnez l'année de déclaration. Le barème 2026 (revenus 2025) intègre la revalorisation de 0,9 % décidée par la loi de finances pour neutraliser l'inflation. Les seuils des tranches sont relevés chaque année.",
                },
                {
                  name: "Lire le détail par tranche",
                  text:
                    "Le simulateur affiche : le quotient familial, l'impôt total, le taux moyen, le TMI (Taux Marginal d'Imposition) et la répartition par tranche d'imposition. Pour déclarer officiellement, utilisez impots.gouv.fr.",
                },
              ]}
            />

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Comment fonctionne l&apos;impôt sur le revenu en France
              </h2>
              <div className="mt-4 space-y-3 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  L&apos;impôt sur le revenu en France est <strong>progressif</strong> : il augmente
                  par tranches. Votre revenu est divisé par le nombre de parts fiscales (quotient
                  familial), puis chaque tranche est imposée à son taux.
                </p>
                <p>
                  <strong>Taux marginal (TMI)</strong> : c&apos;est le taux de la dernière tranche
                  atteinte. Il s&apos;applique uniquement à la partie du revenu dans cette tranche.
                  Beaucoup confondent TMI et taux moyen.
                </p>
                <p>
                  <strong>Taux moyen</strong> : c&apos;est le rapport entre l&apos;impôt total et le
                  revenu. Il est toujours inférieur au TMI. C&apos;est lui qui représente votre vrai
                  taux d&apos;imposition global.
                </p>
                <p>
                  <strong>Décote.</strong> Pour les revenus modestes, une décote réduit
                  automatiquement l&apos;impôt. Elle s&apos;applique si l&apos;impôt brut est inférieur à
                  1 982 € (célibataire) ou 3 277 € (couple marié/pacsé) pour les revenus 2025 :
                  décote = 897 € (ou 1 483 €) - 45,25 % de l&apos;impôt brut.
                </p>
                <p>
                  <strong>Plafonnement du quotient familial.</strong> L&apos;avantage fiscal procuré
                  par chaque demi-part supplémentaire est plafonné (1 807 € par demi-part pour
                  les revenus 2025). Au-delà, l&apos;avantage est ramené à ce plafond. Pour un parent
                  isolé (case T), la part du premier enfant est plafonnée à 4 262 €.
                </p>
                <p>
                  <strong>Source.</strong> Barème officiel issu de la loi de finances 2026 et
                  articles 197 à 197 bis du Code général des impôts. Pour déclaration officielle :
                  impots.gouv.fr.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posées sur le calcul de l'impôt sur le revenu en France."
              items={[
                {
                  question: "Quel est le barème de l'impôt sur le revenu 2026 ?",
                  answer:
                    "Le barème 2026 (applicable aux revenus 2025) a été revalorisé de 0,9 % par la loi de finances 2026 pour tenir compte de l'inflation. Les tranches sont les suivantes : 0 % jusqu'à 11 600 €, 11 % de 11 601 à 29 579 €, 30 % de 29 580 à 84 577 €, 41 % de 84 578 à 181 917 €, et 45 % au-delà. Ces seuils s'appliquent par part de quotient familial.",
                },
                {
                  question: "Comment fonctionne le quotient familial ?",
                  answer:
                    "Le quotient familial divise votre revenu net imposable par le nombre de parts fiscales de votre foyer. Un célibataire a 1 part, un couple marié ou pacsé a 2 parts. Chacun des deux premiers enfants à charge ajoute 0,5 part, et chaque enfant à partir du troisième ajoute 1 part. L'impôt est calculé sur ce quotient, puis multiplié par le nombre de parts. Le plafonnement limite l'avantage à 1 807 € par demi-part supplémentaire pour les revenus 2025 (4 262 € pour la part du premier enfant d'un parent isolé, case T, prise en compte par le simulateur en garde exclusive).",
                },
                {
                  question: "Quand déclarer ses impôts en 2026 ?",
                  answer:
                    "La déclaration des revenus 2025 s'effectue au printemps 2026. Le service en ligne sur impots.gouv.fr ouvre généralement mi-avril. Les dates limites varient selon votre département : fin mai pour les départements 01 à 19, début juin pour les 20 à 54, et mi-juin pour les 55 et au-delà. La déclaration papier doit être déposée fin mai. Le prélèvement à la source est ajusté en septembre après traitement.",
                },
                {
                  question: "Quelle est la différence entre TMI et taux moyen ?",
                  answer:
                    "Le TMI (Taux Marginal d'Imposition) est le taux de la dernière tranche atteinte. Il s'applique uniquement à la partie du revenu dans cette tranche. Le taux moyen est l'impôt total divisé par le revenu : c'est votre véritable taux global, toujours inférieur au TMI. Exemple : un TMI de 30 % peut correspondre à un taux moyen de 12 %.",
                },
                {
                  question: "Le simulateur prend-il en compte les crédits et réductions d'impôt ?",
                  answer:
                    "Non. Le simulateur calcule l'impôt brut à partir du barème et du quotient familial. Il ne déduit pas les réductions et crédits d'impôt (dons, emploi à domicile, frais de garde d'enfants, etc.). Pour un calcul complet, utilisez le simulateur officiel sur impots.gouv.fr.",
                },
                {
                  question: "Quels revenus déclarer dans le revenu net imposable ?",
                  answer:
                    "Le revenu net imposable inclut : salaires (après abattement 10 % ou frais réels), pensions de retraite, revenus fonciers (locations), BIC, BNC, dividendes (après abattement 40 % si option barème), plus-values mobilières et immobilières. L'abattement de 10 % sur salaires est compris entre 509 € et 14 555 € par personne sur les revenus 2025.",
                },
                {
                  question: "Le simulateur garde-t-il mes données ?",
                  answer:
                    "Non. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée saisie (revenus, situation familiale) n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parts fiscales</h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Célibataire : <strong className="text-[var(--foreground)]">1 part</strong></li>
                <li>Couple : <strong className="text-[var(--foreground)]">2 parts</strong></li>
                <li>1er et 2e enfant : <strong className="text-[var(--foreground)]">+0,5 part</strong></li>
                <li>3e enfant et suivants : <strong className="text-[var(--foreground)]">+1 part</strong></li>
                <li>Parent isolé (case T) : <strong className="text-[var(--foreground)]">+0,5 part</strong></li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function StatBox({ label, value, primary, accent }: { label: string; value: string; primary?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="mt-1 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: primary ? "var(--primary)" : accent ? "var(--accent)" : "var(--foreground)" }}>
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  primary,
  sub,
  dotColor,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  primary?: boolean;
  sub?: boolean;
  dotColor?: string;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-3"
      style={highlight ? { background: "var(--surface-alt)" } : {}}
    >
      <span className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
        {dotColor && (
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: dotColor }} />
        )}
        {label}
      </span>
      <span
        className={`font-semibold ${primary ? "text-xl" : ""} ${sub ? "" : ""}`}
        style={{
          color: primary ? "var(--primary)" : "var(--foreground)",
          fontFamily: primary ? "var(--font-display)" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function DonutChart({
  impot,
  net,
  revenu,
}: {
  impot: number;
  net: number;
  revenu: number;
}) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const stroke = 22;
  const total = revenu > 0 ? revenu : 1;
  const impotPct = Math.max(0, impot) / total;
  const netPct = Math.max(0, net) / total;
  const impotLen = impotPct * c;
  const netLen = netPct * c;
  return (
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Répartition net vs impôt">
      <circle cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <g transform="rotate(-90)">
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#dc2626"
          strokeWidth={stroke}
          strokeDasharray={`${impotLen} ${c}`}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#0d4f3c"
          strokeWidth={stroke}
          strokeDasharray={`${netLen} ${c}`}
          strokeDashoffset={-impotLen}
          strokeLinecap="butt"
        />
      </g>
      <text
        x="0"
        y="-4"
        textAnchor="middle"
        fontSize="10"
        fill="var(--muted)"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Net conservé
      </text>
      <text
        x="0"
        y="14"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="var(--primary)"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {Math.round(netPct * 100)}%
      </text>
    </svg>
  );
}

function CrossLinkCard({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold transition-colors group-hover:text-[#0d4f3c]"
          style={{ color: "var(--foreground)" }}
        >
          {title} <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
