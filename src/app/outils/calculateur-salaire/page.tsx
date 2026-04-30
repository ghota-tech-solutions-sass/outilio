"use client";

import { useState } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const RATES: Record<string, { label: string; rate: number }> = {
  "non-cadre": { label: "Non-cadre (prive)", rate: 0.22 },
  cadre: { label: "Cadre (prive)", rate: 0.25 },
  public: { label: "Fonction publique", rate: 0.17 },
};

// Bareme IR 2026 sur revenus 2025 (LF 2026, +0.9%)
const TAX_BRACKETS = [
  { max: 11600, rate: 0 },
  { max: 29579, rate: 0.11 },
  { max: 84577, rate: 0.3 },
  { max: 181917, rate: 0.41 },
  { max: Infinity, rate: 0.45 },
];

// SMIC 2026 brut mensuel (35h)
const SMIC_BRUT_2026 = 1801;
const SMIC_NET_2026 = 1426;

const PRESETS_BRUT = [
  { label: "SMIC", value: SMIC_BRUT_2026 },
  { label: "Median", value: 2820 },
  { label: "Cadre", value: 5333 },
  { label: "Top 10%", value: 10670 },
];

const PRESETS_NET = [
  { label: "SMIC", value: SMIC_NET_2026 },
  { label: "Median", value: 2200 },
  { label: "Cadre", value: 4000 },
  { label: "Top 10%", value: 8000 },
];

function calcTax(annualNet: number) {
  let tax = 0;
  let prev = 0;
  for (const b of TAX_BRACKETS) {
    if (annualNet <= prev) break;
    const taxable = Math.min(annualNet, b.max) - prev;
    tax += taxable * b.rate;
    prev = b.max;
  }
  return tax;
}

function getTMI(annualNetTaxable: number, parts: number): number {
  const quotient = annualNetTaxable / parts;
  if (quotient <= 11600) return 0;
  if (quotient <= 29579) return 11;
  if (quotient <= 84577) return 30;
  if (quotient <= 181917) return 41;
  return 45;
}

export default function CalculateurSalaire() {
  const [amount, setAmount] = useState<string>("3000");
  const [mode, setMode] = useState<"brut-to-net" | "net-to-brut">("brut-to-net");
  const [status, setStatus] = useState<string>("non-cadre");
  const [parts, setParts] = useState<string>("1");
  const [period, setPeriod] = useState<"mensuel" | "annuel">("mensuel");

  const rawVal = parseFloat(amount) || 0;
  const val = period === "annuel" ? rawVal / 12 : rawVal;
  const rate = RATES[status]?.rate ?? 0.22;

  let brut: number, net: number;
  if (mode === "brut-to-net") {
    brut = val;
    net = val * (1 - rate);
  } else {
    net = val;
    brut = val / (1 - rate);
  }

  const isHighMonthly = val > 15000;

  const annualNet = net * 12;
  const nbParts = parseFloat(parts) || 1;
  const annualTax = calcTax(annualNet / nbParts) * nbParts;
  const monthlyTax = annualTax / 12;
  const netApresImpot = net - monthlyTax;
  const charges = brut - net;
  const tmi = getTMI(annualNet, nbParts);
  const vsSmic = SMIC_NET_2026 > 0 ? ((netApresImpot / SMIC_NET_2026) - 1) * 100 : 0;

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Finance
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Calculateur salaire <span style={{ color: "var(--primary)" }}>net / brut</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez instantanement votre salaire brut en net et inversement.
            Estimation de l&apos;impot sur le revenu incluse.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <div className="animate-scale-in rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                <button
                  onClick={() => setMode("brut-to-net")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: mode === "brut-to-net" ? "var(--primary)" : "transparent",
                    color: mode === "brut-to-net" ? "white" : "var(--muted)",
                  }}
                >
                  Brut &rarr; Net
                </button>
                <button
                  onClick={() => setMode("net-to-brut")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: mode === "net-to-brut" ? "var(--primary)" : "transparent",
                    color: mode === "net-to-brut" ? "white" : "var(--muted)",
                  }}
                >
                  Net &rarr; Brut
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Salaire {mode === "brut-to-net" ? "brut" : "net"} {period}
                  </label>
                  <div className="flex gap-1 rounded-lg p-0.5 text-xs" style={{ background: "var(--surface-alt)" }}>
                    <button
                      onClick={() => {
                        if (period === "annuel") {
                          const v = parseFloat(amount) || 0;
                          setAmount(String(Math.round(v / 12)));
                        }
                        setPeriod("mensuel");
                      }}
                      className="rounded-md px-2.5 py-1 font-semibold transition-all"
                      style={{
                        background: period === "mensuel" ? "var(--primary)" : "transparent",
                        color: period === "mensuel" ? "white" : "var(--muted)",
                      }}
                    >
                      Mois
                    </button>
                    <button
                      onClick={() => {
                        if (period === "mensuel") {
                          const v = parseFloat(amount) || 0;
                          setAmount(String(Math.round(v * 12)));
                        }
                        setPeriod("annuel");
                      }}
                      className="rounded-md px-2.5 py-1 font-semibold transition-all"
                      style={{
                        background: period === "annuel" ? "var(--primary)" : "transparent",
                        color: period === "annuel" ? "white" : "var(--muted)",
                      }}
                    >
                      Annuel
                    </button>
                  </div>
                </div>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    placeholder={period === "mensuel" ? "3000" : "36000"}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>&euro;</span>
                </div>
                {/* Slider */}
                <input
                  type="range"
                  min={period === "mensuel" ? 1000 : 12000}
                  max={period === "mensuel" ? 15000 : 180000}
                  step={period === "mensuel" ? 50 : 500}
                  value={Math.min(parseFloat(amount) || 0, period === "mensuel" ? 15000 : 180000)}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-3 w-full accent-[#0d4f3c]"
                  aria-label="Curseur salaire"
                />
                {/* Presets */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(mode === "brut-to-net" ? PRESETS_BRUT : PRESETS_NET).map((p) => {
                    const presetVal = period === "annuel" ? p.value * 12 : p.value;
                    const isActive = parseFloat(amount) === presetVal;
                    return (
                      <button
                        key={p.label}
                        onClick={() => setAmount(String(presetVal))}
                        className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                        style={{
                          borderColor: isActive ? "var(--primary)" : "var(--border)",
                          color: isActive ? "var(--primary)" : "var(--muted)",
                          background: isActive ? "rgba(13,79,60,0.06)" : "transparent",
                        }}
                      >
                        {p.label}{" "}
                        <span style={{ color: isActive ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                          {fmt(presetVal)} €
                        </span>
                      </button>
                    );
                  })}
                </div>
                {isHighMonthly && period === "mensuel" && (
                  <button
                    onClick={() => {
                      setAmount(String(Math.round(rawVal)));
                      setPeriod("annuel");
                    }}
                    className="mt-2 w-full rounded-lg px-3 py-2 text-left text-xs"
                    style={{ background: "#fef3cd", color: "#856404" }}
                  >
                    💡 {fmt(rawVal)} &euro;/mois semble eleve. Vous vouliez dire{" "}
                    <strong>{fmt(rawVal)} &euro;/an</strong> ? Cliquez ici pour corriger.
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Statut</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {Object.entries(RATES).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Parts fiscales</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={parts}
                    onChange={(e) => setParts(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="animate-scale-in stagger-2 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Resultats
              </h2>
              {/* Visualisation donut + détail */}
              <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                <div className="flex justify-center">
                  <DonutChart
                    cotisations={charges}
                    impot={monthlyTax}
                    net={netApresImpot}
                    brut={brut}
                  />
                </div>
                <div className="space-y-1">
                  <Row label="Salaire brut mensuel" value={`${fmt(brut)} €`} />
                  <Row label="Cotisations salariales" value={`- ${fmt(charges)} €`} sub dotColor="#dc2626" />
                  <Row label="Salaire net avant impot" value={`${fmt(net)} €`} highlight />
                  <Row label="Impot sur le revenu (estimation)" value={`- ${fmt(monthlyTax)} €`} sub dotColor="#e8963e" />
                  <Row label="Salaire net en poche" value={`${fmt(netApresImpot)} €`} highlight primary dotColor="#0d4f3c" />
                </div>
              </div>

              {/* TMI + repere SMIC */}
              {netApresImpot > 0 && (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Tranche marginale d&apos;imposition
                    </p>
                    <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: tmi >= 30 ? "#dc2626" : "var(--primary)" }}>
                      {tmi}%
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                      {tmi === 0 && "Vous n'etes pas imposable."}
                      {tmi === 11 && "Tranche basse — chaque euro additionnel est taxe a 11%."}
                      {tmi === 30 && "Tranche intermediaire — optimisez vos deductions (PER, dons)."}
                      {tmi === 41 && "Tranche haute — pensez au PER, dispositifs Pinel, FCPI/FIP."}
                      {tmi === 45 && "Tranche maximale — strategie patrimoniale recommandee."}
                    </p>
                  </div>
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Repere vs SMIC net 2026
                    </p>
                    <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: vsSmic >= 0 ? "var(--primary)" : "#dc2626" }}>
                      {vsSmic >= 0 ? "+" : ""}{vsSmic.toFixed(0)}%
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                      {vsSmic > 200 && "Vous etes parmi le top 10% des salaires francais."}
                      {vsSmic > 50 && vsSmic <= 200 && "Au-dessus du salaire median (~2 200 € net)."}
                      {vsSmic >= 0 && vsSmic <= 50 && `Au-dessus du SMIC net (${fmt(SMIC_NET_2026)} €).`}
                      {vsSmic < 0 && `En-dessous du SMIC net (${fmt(SMIC_NET_2026)} €).`}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Recapitulatif annuel
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                  <span style={{ color: "var(--muted)" }}>Brut annuel</span>
                  <span className="text-right font-semibold">{fmt(brut * 12)} &euro;</span>
                  <span style={{ color: "var(--muted)" }}>Net annuel avant impot</span>
                  <span className="text-right font-semibold">{fmt(net * 12)} &euro;</span>
                  <span style={{ color: "var(--muted)" }}>Impot annuel (estimation)</span>
                  <span className="text-right font-semibold">{fmt(annualTax)} &euro;</span>
                  <span style={{ color: "var(--muted)" }}>Net annuel apres impot</span>
                  <span className="text-right text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(netApresImpot * 12)} &euro;
                  </span>
                </div>
              </div>
            </div>

            {/* Cross-link CTAs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Vous pourriez aussi vouloir
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CrossLinkCard
                  href="/outils/freelance-vs-cdi"
                  emoji="💼"
                  title="Comparer CDI / Freelance"
                  desc="Quel TJM pour egaliser votre net ?"
                />
                <CrossLinkCard
                  href="/outils/simulateur-impot"
                  emoji="📋"
                  title="Simulateur impot 2026"
                  desc="Bareme officiel + TMI detaille"
                />
                <CrossLinkCard
                  href="/outils/calculateur-pret-immobilier"
                  emoji="🏠"
                  title="Capacite d'emprunt"
                  desc="Mensualite max selon HCSF 35%"
                />
              </div>
            </div>

            <ToolHowToSection
              title="Comment calculer votre salaire net en 4 etapes"
              description="Le calculateur applique les taux moyens de cotisations salariales 2026 par statut et integre une estimation du prelevement a la source."
              steps={[
                {
                  name: "Choisir votre statut",
                  text:
                    "Non-cadre prive (~22 % de charges salariales), cadre prive (~25 %), fonction publique (~17 %). Les ecarts proviennent principalement de la retraite complementaire AGIRC-ARRCO (cadres) et des regimes specifiques de la fonction publique.",
                },
                {
                  name: "Saisir votre salaire brut",
                  text:
                    "Indiquez le brut mensuel (ce qui figure en haut de votre fiche de paie, avant cotisations). Pour un brut annuel, divisez par 12. Pour 13 mois ou primes, calculez d'abord le brut moyen mensuel.",
                },
                {
                  name: "Renseigner votre situation fiscale",
                  text:
                    "Nombre de parts fiscales (1 pour celibataire, 2 pour couple, +0,5 ou +1 par enfant a charge selon le rang). Le calculateur estime le prelevement a la source en appliquant le bareme progressif 2026 sur le revenu net imposable.",
                },
                {
                  name: "Lire le resultat",
                  text:
                    "Le calculateur affiche le net avant impot, le prelevement a la source estime et le net 'en poche' apres impot. Pour un calcul precis, comparez avec votre derniere fiche de paie ou votre avis d'imposition.",
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
                Comment passer du brut au net en France
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  Pour convertir un salaire brut en net, il faut deduire les cotisations salariales.
                  Le taux varie selon votre statut :
                </p>
                <ul className="ml-6 list-disc space-y-1" style={{ color: "var(--muted)" }}>
                  <li><strong style={{ color: "var(--foreground)" }}>Non-cadre prive</strong> : ~22 % de charges (coefficient 0,78)</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Cadre prive</strong> : ~25 % de charges (coefficient 0,75)</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Fonction publique</strong> : ~17 % de charges (coefficient 0,83)</li>
                </ul>
                <p>
                  <strong>Formule simplifiee</strong> : Salaire net = Salaire brut x (1 - taux de cotisations).
                  Exemple : 3 000 EUR brut non-cadre = 2 340 EUR net avant impot.
                </p>
                <p>
                  <strong>Le PAS depuis 2019.</strong> L&apos;impot sur le revenu est preleve
                  directement sur le salaire via le prelevement a la source. Le taux est calcule
                  par la DGFiP en fonction de votre derniere declaration. Vous pouvez le moduler a
                  tout moment sur impots.gouv.fr en cas de changement de situation (mariage,
                  naissance, perte d&apos;emploi).
                </p>
                <p>
                  <strong>Source.</strong> Taux moyens 2026 issus des baremes URSSAF, AGIRC-ARRCO,
                  CSG/CRDS et bareme progressif IR (DGFiP). Pour un calcul exact, votre bulletin de
                  paie reste la reference.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur le calcul du salaire net en France."
              items={[
                {
                  question: "Comment calculer son salaire net en 2026 ?",
                  answer:
                    "En 2026, pour obtenir votre salaire net a partir du brut, appliquez le taux de cotisations salariales correspondant a votre statut. Pour un salarie non-cadre du secteur prive, deduisez environ 22 % du salaire brut. Pour un cadre, comptez environ 25 %. Les fonctionnaires ont un taux plus faible, autour de 17 %. Le prelevement a la source de l'impot sur le revenu est ensuite retranchi pour obtenir le net 'en poche'.",
                },
                {
                  question: "Quelle difference entre salaire brut et net ?",
                  answer:
                    "Le salaire brut est la remuneration totale avant toute deduction. Le salaire net est ce que vous percevez reellement apres deduction des cotisations salariales (assurance maladie, retraite, chomage, CSG, CRDS). En France, la difference represente entre 17 % et 25 % du brut selon votre statut. Depuis 2019, le net 'apres impot' figurant sur votre fiche de paie tient egalement compte du prelevement a la source.",
                },
                {
                  question: "Quel est le taux de charges salariales en 2026 ?",
                  answer:
                    "En 2026, les cotisations salariales representent en moyenne 22 % du salaire brut pour un non-cadre et 25 % pour un cadre dans le secteur prive. Ces charges incluent la CSG (9,2 % dont 6,8 % deductibles), la CRDS (0,5 %), les cotisations retraite de base et complementaire, et l'assurance chomage. Les taux exacts dependent de votre convention collective et de votre tranche de salaire.",
                },
                {
                  question: "Comment est calcule le prelevement a la source ?",
                  answer:
                    "Le prelevement a la source (PAS) est preleve chaque mois directement sur votre salaire par votre employeur. Le taux est calcule par l'administration fiscale en fonction de votre derniere declaration de revenus. Il tient compte de l'ensemble de vos revenus et de votre situation familiale (nombre de parts fiscales). Vous pouvez demander une modulation de votre taux a tout moment sur impots.gouv.fr si votre situation change.",
                },
                {
                  question: "Pourquoi mon salaire net diminue-t-il quand je passe cadre ?",
                  answer:
                    "Le statut cadre s'accompagne de cotisations supplementaires, notamment la retraite complementaire AGIRC-ARRCO et la prevoyance cadre. A salaire brut egal, un cadre touche donc legerement moins en net qu'un non-cadre, mais beneficie en contrepartie d'une meilleure retraite et de protections sociales etendues.",
                },
                {
                  question: "Comment calculer son salaire annuel net ?",
                  answer:
                    "Multipliez votre net mensuel par 12 (ou 13 si vous avez un 13e mois). Attention : pour un calcul precis, n'oubliez pas les primes (interessement, participation, anciennete), qui peuvent etre soumises a des regles fiscales differentes (PEE, PERCO).",
                },
                {
                  question: "Le calculateur garde-t-il mes donnees ?",
                  answer:
                    "Non. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee saisie (salaire, statut, situation familiale) n'est envoyee a un serveur ni stockee. L'outil fonctionne sans inscription.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>A propos</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Ce calculateur utilise les taux moyens de cotisations salariales en France.
                Les resultats sont des estimations. Consultez votre bulletin de paie pour un calcul precis.
              </p>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
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
        className={`font-semibold ${primary ? "text-xl" : ""}`}
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
  cotisations,
  impot,
  net,
  brut,
}: {
  cotisations: number;
  impot: number;
  net: number;
  brut: number;
}) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const stroke = 22;
  const total = brut > 0 ? brut : 1;
  const cotPct = Math.max(0, cotisations) / total;
  const impotPct = Math.max(0, impot) / total;
  const netPct = Math.max(0, net) / total;
  const cotLen = cotPct * c;
  const impotLen = impotPct * c;
  const netLen = netPct * c;
  return (
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Repartition du salaire brut">
      <circle cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <g transform="rotate(-90)">
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#dc2626"
          strokeWidth={stroke}
          strokeDasharray={`${cotLen} ${c}`}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#e8963e"
          strokeWidth={stroke}
          strokeDasharray={`${impotLen} ${c}`}
          strokeDashoffset={-cotLen}
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
          strokeDashoffset={-(cotLen + impotLen)}
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
        Net en poche
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
