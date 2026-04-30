"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

type Tranche = { min: number; max: number; rate: number; label: string };

const PRESETS_REVENU = [
  { label: "SMIC", value: 17100 },
  { label: "Median", value: 26400 },
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
const BAREMES_OFFICIELS: Record<number, number[]> = {
  // [seuil_0%, seuil_11%, seuil_30%, seuil_41%]
  // Source: lois de finances successives
  2023: [11294, 28797, 82341, 177106],
  2024: [11497, 29315, 83823, 180294],  // LF 2024 (+4.8%)
  2025: [11600, 29579, 84577, 181917],  // LF 2026 applicable revenus 2025 (+0.9%)
};

const TAUX = [0, 0.11, 0.30, 0.41, 0.45];
const TAUX_LABELS = ["0%", "11%", "30%", "41%", "45%"];
const REVALORISATION = 0.02; // ~2% annuel moyen

function getLastOfficiel(): { annee: number; seuils: number[] } {
  const annees = Object.keys(BAREMES_OFFICIELS).map(Number).sort((a, b) => b - a);
  const annee = annees[0];
  return { annee, seuils: BAREMES_OFFICIELS[annee] };
}

function getSeuilsPourAnnee(annee: number): number[] {
  if (BAREMES_OFFICIELS[annee]) return BAREMES_OFFICIELS[annee];
  const last = getLastOfficiel();
  const delta = annee - last.annee;
  if (delta <= 0) return last.seuils; // annee avant le plus ancien connu
  const factor = Math.pow(1 + REVALORISATION, delta);
  return last.seuils.map((s) => Math.round(s * factor));
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
  const result: { annee: number; label: string; tranches: Tranche[]; estime: boolean }[] = [];
  for (let y = endYear; y >= startYear; y--) {
    result.push({
      annee: y,
      label: `Revenus ${y} (declaration ${y + 1})`,
      tranches: buildTranches(getSeuilsPourAnnee(y)),
      estime: !BAREMES_OFFICIELS[y],
    });
  }
  return result;
}

const BAREMES = buildBaremes();

function getDefaultAnnee(): number {
  const now = new Date();
  const year = now.getFullYear();
  // Avant septembre : on declare les revenus de l'annee precedente
  const target = now.getMonth() < 9 ? year - 1 : year;
  return BAREMES.find((b) => b.annee <= target)?.annee ?? BAREMES[0].annee;
}

function simulerImpot(revenuNet: number, parts: number, tranches: Tranche[]) {
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

  const impotTotal = impotParPart * parts;
  const tauxMoyen = revenuNet > 0 ? (impotTotal / revenuNet) * 100 : 0;
  const tauxMarginal = tranches.findLast((t) => quotient > t.min)?.rate ?? 0;
  const revenuApresImpot = revenuNet - impotTotal;

  return { impotTotal, tauxMoyen, tauxMarginal, revenuApresImpot, details, impotParPart };
}

export default function SimulateurImpot() {
  const [revenu, setRevenu] = useState("35000");
  const [parts, setParts] = useState("1");
  const [situation, setSituation] = useState("celibataire");
  const [annee, setAnnee] = useState(() => getDefaultAnnee());

  const partsNum = parseFloat(parts) || 1;
  const revenuNum = parseFloat(revenu) || 0;
  const bareme = BAREMES.find((b) => b.annee === annee) ?? BAREMES[0];

  const result = useMemo(() => simulerImpot(revenuNum, partsNum, bareme.tranches), [revenuNum, partsNum, bareme.tranches]);

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtPct = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>impot sur le revenu</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre impot sur les revenus {annee} avec le bareme officiel. Quotient familial et taux marginal inclus.
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
                    Annee de revenus
                  </label>
                  <select
                    value={annee}
                    onChange={(e) => setAnnee(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {BAREMES.map((b) => (
                      <option key={b.annee} value={b.annee}>
                        {b.label}{b.estime ? " (estime)" : ""}
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
                    <select value={situation} onChange={(e) => setSituation(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }}>
                      <option value="celibataire">Celibataire</option>
                      <option value="couple">Couple (marie/pacse)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre de parts</label>
                    <input type="number" step="0.5" min="1" value={parts} onChange={(e) => setParts(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Big results */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox label="Impot total" value={`${fmt(result.impotTotal)} €`} primary />
              <StatBox label="Par mois" value={`${fmt(result.impotTotal / 12)} €`} />
              <StatBox label="Taux moyen" value={`${fmtPct(result.tauxMoyen)}%`} />
              <StatBox label="Taux marginal" value={`${(result.tauxMarginal * 100).toFixed(0)}%`} accent />
            </div>

            {/* Remaining income + Donut visualisation */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Repartition du revenu
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
                  <Row label="Impot sur le revenu" value={`- ${fmt(result.impotTotal)} €`} sub dotColor="#dc2626" />
                  <Row label="Revenu net apres impot" value={`${fmt(result.revenuApresImpot)} €`} highlight primary dotColor="#0d4f3c" />
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
                      {result.tauxMarginal === 0 && "Vous n'etes pas imposable."}
                      {result.tauxMarginal === 0.11 && "Tranche basse — chaque euro additionnel taxe a 11%."}
                      {result.tauxMarginal === 0.30 && "Tranche intermediaire — optimisez vos deductions (PER, dons)."}
                      {result.tauxMarginal === 0.41 && "Tranche haute — pensez au PER, Pinel, FCPI/FIP."}
                      {result.tauxMarginal === 0.45 && "Tranche maximale — strategie patrimoniale recommandee."}
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
                      {result.tauxMoyen < 5 && "Imposition tres faible — profitez-en pour epargner."}
                      {result.tauxMoyen >= 5 && result.tauxMoyen < 12 && "Imposition moderee — proche de la moyenne francaise."}
                      {result.tauxMoyen >= 12 && result.tauxMoyen < 20 && "Imposition consequente — un PER peut reduire la facture."}
                      {result.tauxMoyen >= 20 && "Imposition elevee — strategie de defiscalisation conseillee."}
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
                  desc="Brut vers net + impot mensuel estime"
                />
                <CrossLinkCard
                  href="/outils/freelance-vs-cdi"
                  emoji="🏢"
                  title="Statut freelance"
                  desc="Quel TJM pour egaliser votre net ?"
                />
                <CrossLinkCard
                  href="/outils/simulateur-prime-activite"
                  emoji="💰"
                  title="Prime d'activite"
                  desc="Eligibilite et montant CAF estime"
                />
              </div>
            </div>

            {/* Breakdown by bracket */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Detail par tranche
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="pb-3 text-left font-medium">Tranche</th>
                      <th className="pb-3 text-right font-medium">Taux</th>
                      <th className="pb-3 text-right font-medium">Base imposable</th>
                      <th className="pb-3 text-right font-medium">Impot</th>
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
                    <tr className="border-t-2" style={{ borderColor: "var(--primary)" }}>
                      <td className="py-3 font-semibold" colSpan={3}>Total (x {partsNum} part{partsNum > 1 ? "s" : ""})</td>
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
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Bareme {annee + 1} (revenus {annee})</h2>
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
              title="Comment simuler votre impot sur le revenu en 4 etapes"
              description="Le simulateur applique le bareme officiel 2026 (loi de finances) avec quotient familial, decote pour faibles revenus et plafonnement."
              steps={[
                {
                  name: "Saisir votre revenu net imposable",
                  text:
                    "C'est votre revenu net annuel APRES abattement de 10 % (salaires) ou frais reels. Si vous avez votre avis d'imposition, prenez la ligne 'Revenu net imposable'. Sinon, multipliez votre net mensuel par 12 et soustrayez 10 %.",
                },
                {
                  name: "Renseigner votre situation familiale",
                  text:
                    "Celibataire = 1 part. Couple marie ou pacse = 2 parts. Chacun des 2 premiers enfants ajoute 0,5 part. A partir du 3e enfant : +1 part. Parent isole avec enfant : +0,5 part supplementaire.",
                },
                {
                  name: "Choisir l'annee fiscale",
                  text:
                    "Selectionnez l'annee de declaration. Le bareme 2026 (revenus 2025) integre la revalorisation de 0,9 % decidee par la loi de finances pour neutraliser l'inflation. Les seuils des tranches sont releves chaque annee.",
                },
                {
                  name: "Lire le detail par tranche",
                  text:
                    "Le simulateur affiche : le quotient familial, l'impot total, le taux moyen, le TMI (Taux Marginal d'Imposition) et la repartition par tranche d'imposition. Pour declarer officiellement, utilisez impots.gouv.fr.",
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
                Comment fonctionne l&apos;impot sur le revenu en France
              </h2>
              <div className="mt-4 space-y-3 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  L&apos;impot sur le revenu en France est <strong>progressif</strong> : il augmente
                  par tranches. Votre revenu est divise par le nombre de parts fiscales (quotient
                  familial), puis chaque tranche est imposee a son taux.
                </p>
                <p>
                  <strong>Taux marginal (TMI)</strong> : c&apos;est le taux de la derniere tranche
                  atteinte. Il s&apos;applique uniquement a la partie du revenu dans cette tranche.
                  Beaucoup confondent TMI et taux moyen.
                </p>
                <p>
                  <strong>Taux moyen</strong> : c&apos;est le rapport entre l&apos;impot total et le
                  revenu. Il est toujours inferieur au TMI. C&apos;est lui qui represente votre vrai
                  taux d&apos;imposition global.
                </p>
                <p>
                  <strong>Decote.</strong> Pour les revenus modestes, une decote reduit
                  automatiquement l&apos;impot. Plafonds 2026 : 1 964 EUR pour un celibataire,
                  3 248 EUR pour un couple marie/pacse.
                </p>
                <p>
                  <strong>Plafonnement du quotient familial.</strong> L&apos;avantage fiscal procure
                  par chaque demi-part supplementaire est plafonne (1 759 EUR par demi-part en
                  2026). Au-dela, l&apos;avantage est ramene a ce plafond.
                </p>
                <p>
                  <strong>Source.</strong> Bareme officiel issu de la loi de finances 2026 et
                  articles 197 a 197 bis du Code general des impots. Pour declaration officielle :
                  impots.gouv.fr.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur le calcul de l'impot sur le revenu en France."
              items={[
                {
                  question: "Quel est le bareme de l'impot sur le revenu 2026 ?",
                  answer:
                    "Le bareme 2026 (applicable aux revenus 2025) a ete revalorise de 0,9 % par la loi de finances 2026 pour tenir compte de l'inflation. Les tranches sont les suivantes : 0 % jusqu'a 11 600 EUR, 11 % de 11 601 a 29 579 EUR, 30 % de 29 580 a 84 577 EUR, 41 % de 84 578 a 181 917 EUR, et 45 % au-dela. Ces seuils s'appliquent par part de quotient familial.",
                },
                {
                  question: "Comment fonctionne le quotient familial ?",
                  answer:
                    "Le quotient familial divise votre revenu net imposable par le nombre de parts fiscales de votre foyer. Un celibataire a 1 part, un couple marie ou pacse a 2 parts. Chacun des deux premiers enfants a charge ajoute 0,5 part, et chaque enfant a partir du troisieme ajoute 1 part. L'impot est calcule sur ce quotient, puis multiplie par le nombre de parts. Le plafonnement limite l'avantage a environ 1 759 EUR par demi-part supplementaire en 2026.",
                },
                {
                  question: "Quand declarer ses impots en 2026 ?",
                  answer:
                    "La declaration des revenus 2025 s'effectue au printemps 2026. Le service en ligne sur impots.gouv.fr ouvre generalement mi-avril. Les dates limites varient selon votre departement : fin mai pour les departements 01 a 19, debut juin pour les 20 a 54, et mi-juin pour les 55 et au-dela. La declaration papier doit etre deposee fin mai. Le prelevement a la source est ajuste en septembre apres traitement.",
                },
                {
                  question: "Quelle est la difference entre TMI et taux moyen ?",
                  answer:
                    "Le TMI (Taux Marginal d'Imposition) est le taux de la derniere tranche atteinte. Il s'applique uniquement a la partie du revenu dans cette tranche. Le taux moyen est l'impot total divise par le revenu : c'est votre veritable taux global, toujours inferieur au TMI. Exemple : un TMI de 30 % peut correspondre a un taux moyen de 12 %.",
                },
                {
                  question: "Le simulateur prend-il en compte les credits et reductions d'impot ?",
                  answer:
                    "Non. Le simulateur calcule l'impot brut a partir du bareme et du quotient familial. Il ne deduit pas les reductions et credits d'impot (dons, emploi a domicile, frais de garde d'enfants, etc.). Pour un calcul complet, utilisez le simulateur officiel sur impots.gouv.fr.",
                },
                {
                  question: "Quels revenus declarer dans le revenu net imposable ?",
                  answer:
                    "Le revenu net imposable inclut : salaires (apres abattement 10 % ou frais reels), pensions de retraite, revenus fonciers (locations), BIC, BNC, dividendes (apres abattement 40 % si option bareme), plus-values mobilieres et immobilieres. L'abattement de 10 % sur salaires est plafonne a environ 14 426 EUR par actif en 2026.",
                },
                {
                  question: "Le simulateur garde-t-il mes donnees ?",
                  answer:
                    "Non. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee saisie (revenus, situation familiale) n'est envoyee a un serveur ni stockee. L'outil fonctionne sans inscription.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parts fiscales</h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Celibataire : <strong className="text-[var(--foreground)]">1 part</strong></li>
                <li>Couple : <strong className="text-[var(--foreground)]">2 parts</strong></li>
                <li>1er et 2e enfant : <strong className="text-[var(--foreground)]">+0,5 part</strong></li>
                <li>3e enfant et suivants : <strong className="text-[var(--foreground)]">+1 part</strong></li>
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
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Repartition net vs impot">
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
        Net conserve
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
