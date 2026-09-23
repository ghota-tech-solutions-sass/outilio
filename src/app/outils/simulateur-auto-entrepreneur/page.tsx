"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";
import { impotRevenu as calculerImpotRevenu } from "@/lib/impot";

const PRESETS_CA = [
  { label: "Démarrage", value: 15000 },
  { label: "Confirmé", value: 35000 },
  { label: "Bien établi", value: 60000 },
  { label: "Plafond services", value: 83600 },
];

// ---------------------------------------------------------------------------
// Types d'activite
// ---------------------------------------------------------------------------
type ActivityType = "vente" | "service_bic" | "liberal_bnc";

interface ActivityConfig {
  label: string;
  shortLabel: string;
  description: string;
}

const ACTIVITIES: Record<ActivityType, ActivityConfig> = {
  vente: {
    label: "Vente de marchandises (BIC)",
    shortLabel: "Vente BIC",
    description: "Achat-revente, fourniture de denrées, hébergement",
  },
  service_bic: {
    label: "Prestation de services (BIC)",
    shortLabel: "Service BIC",
    description: "Artisanat, services commerciaux",
  },
  liberal_bnc: {
    label: "Activité libérale (BNC)",
    shortLabel: "Libéral BNC",
    description: "Professions libérales, conseil, formation",
  },
};

// ---------------------------------------------------------------------------
// Taux parametres par annee (source : URSSAF, loi de finances)
// Pour les annees futures sans bareme officiel, on garde les derniers taux connus.
// ---------------------------------------------------------------------------
interface YearRates {
  // Cotisations sociales (taux normal)
  cotisations: Record<ActivityType, number>;
  // ACRE : taux reduit pendant ~12 mois (exoneration de 50% avant le 01/07/2026, 25% ensuite)
  acre: Record<ActivityType, number>;
  // Versement liberatoire IR
  versementLiberatoire: Record<ActivityType, number>;
  // Abattement forfaitaire IR (regime micro)
  abattementIR: Record<ActivityType, number>;
  // Contribution Formation Professionnelle
  cfp: Record<ActivityType, number>;
  // Plafonds CA annuel
  plafondCA: Record<ActivityType, number>;
}

const RATES_BY_YEAR: Record<number, YearRates> = {
  2025: {
    cotisations: { vente: 0.123, service_bic: 0.212, liberal_bnc: 0.246 },
    acre: { vente: 0.0615, service_bic: 0.106, liberal_bnc: 0.123 },
    versementLiberatoire: { vente: 0.01, service_bic: 0.017, liberal_bnc: 0.022 },
    abattementIR: { vente: 0.71, service_bic: 0.50, liberal_bnc: 0.34 },
    cfp: { vente: 0.001, service_bic: 0.003, liberal_bnc: 0.002 },
    plafondCA: { vente: 188700, service_bic: 77700, liberal_bnc: 77700 },
  },
  2026: {
    cotisations: { vente: 0.123, service_bic: 0.212, liberal_bnc: 0.256 },
    // ACRE 2026 : creations a compter du 01/07/2026 = exoneration de 25% (75% du taux normal)
    acre: { vente: 0.09225, service_bic: 0.159, liberal_bnc: 0.192 },
    versementLiberatoire: { vente: 0.01, service_bic: 0.017, liberal_bnc: 0.022 },
    abattementIR: { vente: 0.71, service_bic: 0.50, liberal_bnc: 0.34 },
    cfp: { vente: 0.001, service_bic: 0.003, liberal_bnc: 0.002 },
    plafondCA: { vente: 203100, service_bic: 83600, liberal_bnc: 83600 },
  },
};

// ---------------------------------------------------------------------------
// CFE : estimation par tranche de CA (montant median, tres variable par commune)
// ---------------------------------------------------------------------------
function estimerCFE(ca: number): number {
  if (ca <= 5000) return 0;
  if (ca <= 10000) return 350;
  if (ca <= 32600) return 550;
  if (ca <= 100000) return 900;
  if (ca <= 250000) return 1500;
  return 2500;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getRatesForYear(year: number): YearRates {
  if (RATES_BY_YEAR[year]) return RATES_BY_YEAR[year];
  // Fallback : dernier bareme connu
  const knownYears = Object.keys(RATES_BY_YEAR).map(Number).sort((a, b) => b - a);
  return RATES_BY_YEAR[knownYears[0]];
}

function getAvailableYears(): number[] {
  const now = new Date().getFullYear();
  const knownYears = Object.keys(RATES_BY_YEAR).map(Number);
  const minYear = Math.min(...knownYears);
  const maxYear = Math.max(now, Math.max(...knownYears));
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);
  return years;
}

// IR au bareme 2026 (revenus 2025, declaration 2026) : quotient familial, plafonnement
// du quotient familial et decote, via le module partage src/lib/impot.ts
function calcImpotIR(revenuImposable: number, parts: number, couple: boolean, parentIsole = false): number {
  return calculerImpotRevenu({ revenuImposable, parts, couple, parentIsole }).impotNet;
}

// ---------------------------------------------------------------------------
// Simulation principale
// ---------------------------------------------------------------------------
interface SimulationResult {
  caAnnuel: number;
  caMensuel: number;
  cotisationsSociales: number;
  tauxCotisations: number;
  cfp: number;
  impotRevenu: number;
  modeIR: string;
  cfeEstime: number;
  totalCharges: number;
  revenuNetAnnuel: number;
  revenuNetMensuel: number;
  tauxChargesGlobal: number;
  plafondCA: number;
  depassePlafond: boolean;
  revenuImposableIR: number;
}

function simuler(
  caAnnuel: number,
  activite: ActivityType,
  annee: number,
  acre: boolean,
  versementLiberatoire: boolean,
  partsIR: number,
  coupleIR: boolean = false,
  parentIsoleIR: boolean = false,
): SimulationResult {
  const rates = getRatesForYear(annee);

  // Cotisations sociales
  const tauxCotisations = acre ? rates.acre[activite] : rates.cotisations[activite];
  const cotisationsSociales = caAnnuel * tauxCotisations;

  // CFP
  const cfp = caAnnuel * rates.cfp[activite];

  // Impot sur le revenu
  let impotRevenu: number;
  let modeIR: string;
  let revenuImposableIR: number;

  if (versementLiberatoire) {
    impotRevenu = caAnnuel * rates.versementLiberatoire[activite];
    modeIR = "Versement libératoire";
    revenuImposableIR = caAnnuel * (1 - rates.abattementIR[activite]);
  } else {
    // Regime classique : abattement forfaitaire puis bareme progressif
    revenuImposableIR = caAnnuel * (1 - rates.abattementIR[activite]);
    impotRevenu = calcImpotIR(revenuImposableIR, partsIR, coupleIR, parentIsoleIR);
    modeIR = "Barème progressif";
  }

  // CFE
  const cfeEstime = estimerCFE(caAnnuel);

  // Totaux
  const totalCharges = cotisationsSociales + cfp + impotRevenu + cfeEstime;
  const revenuNetAnnuel = caAnnuel - totalCharges;
  const tauxChargesGlobal = caAnnuel > 0 ? (totalCharges / caAnnuel) * 100 : 0;

  return {
    caAnnuel,
    caMensuel: caAnnuel / 12,
    cotisationsSociales,
    tauxCotisations,
    cfp,
    impotRevenu,
    modeIR,
    cfeEstime,
    totalCharges,
    revenuNetAnnuel,
    revenuNetMensuel: revenuNetAnnuel / 12,
    tauxChargesGlobal,
    plafondCA: rates.plafondCA[activite],
    depassePlafond: caAnnuel > rates.plafondCA[activite],
    revenuImposableIR,
  };
}

// ---------------------------------------------------------------------------
// Composants
// ---------------------------------------------------------------------------
function StatBox({
  label,
  value,
  sub,
  primary,
  accent,
  warn,
}: {
  label: string;
  value: string;
  sub?: string;
  primary?: boolean;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-4 text-center"
      style={{ background: "var(--surface)", borderColor: warn ? "var(--accent)" : "var(--border)" }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <p
        className="mt-1 text-lg font-bold"
        style={{
          fontFamily: "var(--font-display)",
          color: warn ? "#c0392b" : primary ? "var(--primary)" : accent ? "var(--accent)" : "var(--foreground)",
        }}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-0.5 text-[10px]" style={{ color: "var(--muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all"
      style={{
        borderColor: checked ? "var(--primary)" : "var(--border)",
        background: checked ? "rgba(13, 79, 60, 0.04)" : "transparent",
      }}
    >
      <div
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{ background: checked ? "var(--primary)" : "var(--border)" }}
      >
        <div
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
        />
      </div>
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && (
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {description}
          </p>
        )}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------
export default function SimulateurAutoEntrepreneur() {
  const [caInput, setCaInput] = useState("35000");
  const [periodeCA, setPeriodeCA] = useState<"annuel" | "mensuel">("annuel");
  const [activite, setActivite] = useState<ActivityType>("service_bic");
  const [annee, setAnnee] = useState(() => {
    const now = new Date().getFullYear();
    return RATES_BY_YEAR[now] ? now : Math.max(...Object.keys(RATES_BY_YEAR).map(Number));
  });
  const [acre, setAcre] = useState(false);
  const [versementLiberatoire, setVersementLiberatoire] = useState(false);
  const [partsIR, setPartsIR] = useState("1");
  const [coupleIR, setCoupleIR] = useState(false);
  const [parentIsoleIR, setParentIsoleIR] = useState(false);

  const caNum = parseFloat(caInput) || 0;
  const caAnnuel = periodeCA === "mensuel" ? caNum * 12 : caNum;
  const partsNum = Math.max(1, parseFloat(partsIR) || 1);
  const years = useMemo(() => getAvailableYears(), []);
  const rates = useMemo(() => getRatesForYear(annee), [annee]);
  const isEstime = !RATES_BY_YEAR[annee];

  const result = useMemo(
    () => simuler(caAnnuel, activite, annee, acre, versementLiberatoire, partsNum, coupleIR, parentIsoleIR && !coupleIR && partsNum >= 1.5),
    [caAnnuel, activite, annee, acre, versementLiberatoire, partsNum, coupleIR, parentIsoleIR],
  );

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtPct = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const fmtInt = (n: number) => Math.round(n).toLocaleString("fr-FR");

  // Repartition graphique
  const parts = [
    { label: "Cotisations sociales", value: result.cotisationsSociales, color: "var(--primary)" },
    { label: "Impôt sur le revenu", value: result.impotRevenu, color: "var(--accent)" },
    { label: "CFE (estimation)", value: result.cfeEstime, color: "#8a8578" },
    { label: "CFP", value: result.cfp, color: "#c0a875" },
  ];
  const totalForBar = parts.reduce((s, p) => s + p.value, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Auto-entrepreneur
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simulateur{" "}
            <span style={{ color: "var(--primary)" }}>charges micro-entreprise</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Estimez vos cotisations sociales, impôt sur le revenu, CFE et revenu net en tant
            qu&apos;auto-entrepreneur. Taux {annee} à jour
            {isEstime ? " (estimés)" : ""}.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ---- Colonne principale ---- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulaire */}
            <div
              className="animate-fade-up stagger-2 rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="space-y-4">
                {/* Annee */}
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Année
                  </label>
                  <select
                    value={annee}
                    onChange={(e) => setAnnee(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                        {!RATES_BY_YEAR[y] ? " (estimé)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type d'activite */}
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Type d&apos;activité
                  </label>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {(Object.entries(ACTIVITIES) as [ActivityType, ActivityConfig][]).map(
                      ([key, cfg]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setActivite(key)}
                          className="rounded-xl border px-4 py-3 text-left transition-all"
                          style={{
                            borderColor:
                              activite === key ? "var(--primary)" : "var(--border)",
                            background:
                              activite === key ? "rgba(13, 79, 60, 0.06)" : "transparent",
                          }}
                        >
                          <p
                            className="text-sm font-semibold"
                            style={{
                              color:
                                activite === key ? "var(--primary)" : "var(--foreground)",
                            }}
                          >
                            {cfg.shortLabel}
                          </p>
                          <p className="mt-0.5 text-[10px] leading-tight" style={{ color: "var(--muted)" }}>
                            {cfg.description}
                          </p>
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Chiffre d'affaires */}
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Chiffre d&apos;affaires
                  </label>
                  <div className="mt-2 flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={caInput}
                        onChange={(e) => setCaInput(e.target.value)}
                        className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                        style={{
                          borderColor: "var(--border)",
                          fontFamily: "var(--font-display)",
                        }}
                        min="0"
                      />
                      <span
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-lg"
                        style={{ color: "var(--muted)" }}
                      >
                        &euro;
                      </span>
                    </div>
                    <select
                      value={periodeCA}
                      onChange={(e) => setPeriodeCA(e.target.value as "annuel" | "mensuel")}
                      className="rounded-xl border px-4 py-3 text-sm font-semibold"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <option value="annuel">/ an</option>
                      <option value="mensuel">/ mois</option>
                    </select>
                  </div>
                  {result.depassePlafond && (
                    <p className="mt-2 text-xs font-semibold" style={{ color: "#c0392b" }}>
                      Attention : votre CA dépasse le plafond micro-entreprise de{" "}
                      {fmtInt(result.plafondCA)} &euro; pour cette activité.
                    </p>
                  )}
                  {/* Slider CA annuel */}
                  <input
                    type="range"
                    min={0}
                    max={200000}
                    step={1000}
                    value={Math.min(Math.max(caAnnuel, 0), 200000)}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      const display = periodeCA === "mensuel" ? Math.round(v / 12) : v;
                      setCaInput(String(display));
                    }}
                    className="mt-3 w-full accent-[#0d4f3c]"
                    aria-label="Curseur chiffre d'affaires annuel"
                  />
                  {/* Presets pills */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRESETS_CA.map((p) => {
                      const presetDisplay = periodeCA === "mensuel" ? Math.round(p.value / 12) : p.value;
                      const isActive = parseFloat(caInput) === presetDisplay;
                      return (
                        <button
                          key={p.label}
                          onClick={() => setCaInput(String(presetDisplay))}
                          className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                          style={{
                            borderColor: isActive ? "var(--primary)" : "var(--border)",
                            color: isActive ? "var(--primary)" : "var(--muted)",
                            background: isActive ? "rgba(13,79,60,0.06)" : "transparent",
                          }}
                        >
                          {p.label}{" "}
                          <span style={{ color: isActive ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                            {fmtInt(p.value)} &euro;
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Parts IR (seulement si pas versement liberatoire) */}
                {!versementLiberatoire && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="ae-situation"
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Situation (pour estimation IR)
                      </label>
                      <select
                        id="ae-situation"
                        value={coupleIR ? "couple" : "seul"}
                        onChange={(e) => {
                          const estCouple = e.target.value === "couple";
                          setCoupleIR(estCouple);
                          if (estCouple && (parseFloat(partsIR) || 1) < 2) setPartsIR("2");
                          if (!estCouple && partsIR === "2") setPartsIR("1");
                        }}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                      >
                        <option value="seul">Personne seule</option>
                        <option value="couple">Couple marié ou pacsé</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Parts fiscales (pour estimation IR)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        value={partsIR}
                        onChange={(e) => setPartsIR(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                        style={{ borderColor: "var(--border)" }}
                      />
                    </div>
                  </div>
                )}
                {!versementLiberatoire && !coupleIR && partsNum >= 1.5 && (
                  <div>
                    {!coupleIR && partsNum >= 1.5 && (
                      <label className="flex items-start gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                        <input
                          type="checkbox"
                          checked={parentIsoleIR}
                          onChange={(e) => setParentIsoleIR(e.target.checked)}
                          className="mt-0.5 h-4 w-4"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <span>
                          Parent isolé (case T)
                          <span className="block text-xs" style={{ color: "var(--muted)" }}>
                            Vous vivez seul avec vos enfants à charge (2 parts avec 1 enfant en garde exclusive).
                          </span>
                        </span>
                      </label>
                    )}
                    {!coupleIR && partsNum >= 2 && !parentIsoleIR && (
                      <p className="mt-3 rounded-lg border-l-4 px-3 py-2 text-xs" style={{ borderColor: "var(--accent)", background: "var(--surface-alt)", color: "var(--foreground)" }}>
                        Marié ou pacsé ? Choisissez « Couple » : une personne seule avec 2 parts ou plus est soumise au
                        plafonnement du quotient familial. Si vous élevez seul vos enfants, cochez « Parent isolé ».
                      </p>
                    )}
                  </div>
                )}

                {/* Toggles */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Toggle
                    checked={acre}
                    onChange={setAcre}
                    label="ACRE"
                    description={annee >= 2026 ? "Création depuis le 01/07/2026 : -25 %" : "Taux réduit de 50 % (~12 mois)"}
                  />
                  <Toggle
                    checked={versementLiberatoire}
                    onChange={setVersementLiberatoire}
                    label="Versement libératoire"
                    description="IR prélevé sur le CA"
                  />
                </div>
              </div>
            </div>

            {/* Resultats principaux */}
            <div className="animate-fade-up stagger-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox
                label="Revenu net annuel"
                value={`${fmtInt(result.revenuNetAnnuel)} \u20AC`}
                primary
              />
              <StatBox
                label="Revenu net mensuel"
                value={`${fmtInt(result.revenuNetMensuel)} \u20AC`}
              />
              <StatBox
                label="Total charges"
                value={`${fmtInt(result.totalCharges)} \u20AC`}
                accent
              />
              <StatBox
                label="Taux global"
                value={`${fmtPct(result.tauxChargesGlobal)}%`}
                warn={result.tauxChargesGlobal > 50}
              />
            </div>

            {/* Revenu net encadre */}
            <div
              className="animate-fade-up stagger-4 rounded-2xl border p-6 text-center"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                Revenu net après charges
              </p>
              <p
                className="mt-2 text-4xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
              >
                {fmt(result.revenuNetAnnuel)} &euro;/an
              </p>
              <p className="mt-1 text-lg" style={{ color: "var(--muted)" }}>
                soit {fmt(result.revenuNetMensuel)} &euro;/mois
              </p>
            </div>

            {/* DonutChart + cartes contextuelles */}
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Visualisation
              </h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                <div className="flex justify-center">
                  <DonutChart
                    cotisations={result.cotisationsSociales + result.cfp + result.cfeEstime}
                    impot={result.impotRevenu}
                    net={Math.max(0, result.revenuNetAnnuel)}
                    total={Math.max(1, caAnnuel)}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {(() => {
                    const plafondVente = rates.plafondCA.vente;
                    const plafondServices = rates.plafondCA.service_bic;
                    const isVente = activite === "vente";
                    const plafond = isVente ? plafondVente : plafondServices;
                    const seuilAlerte = isVente ? plafond * 0.85 : plafond * 0.9;
                    const proche = caAnnuel > seuilAlerte;
                    return (
                      <div
                        className="rounded-xl border p-4"
                        style={{
                          borderColor: proche ? "#dc2626" : "var(--border)",
                          background: proche ? "rgba(220,38,38,0.05)" : "var(--surface-alt)",
                        }}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                          Approche du plafond
                        </p>
                        <p
                          className="mt-1 text-2xl font-bold"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: proche ? "#dc2626" : "var(--primary)",
                          }}
                        >
                          {Math.round((caAnnuel / plafond) * 100)}%
                        </p>
                        <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                          {proche
                            ? `Vous approchez du plafond ${fmtInt(plafond)} €. Envisagez le passage en SASU/EURL.`
                            : `CA actuel ${fmtInt(caAnnuel)} € / plafond ${fmtInt(plafond)} €.`}
                        </p>
                      </div>
                    );
                  })()}
                  {(() => {
                    const isVente = activite === "vente";
                    const seuilTVA = isVente ? 85000 : 37500;
                    const redevableTVA = caAnnuel > seuilTVA;
                    return (
                      <div
                        className="rounded-xl border p-4"
                        style={{
                          borderColor: redevableTVA ? "var(--accent)" : "var(--border)",
                          background: redevableTVA ? "rgba(232,150,62,0.05)" : "var(--surface-alt)",
                        }}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                          Franchise TVA
                        </p>
                        <p
                          className="mt-1 text-2xl font-bold"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: redevableTVA ? "var(--accent)" : "var(--primary)",
                          }}
                        >
                          {redevableTVA ? "Redevable" : "En franchise"}
                        </p>
                        <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                          {redevableTVA
                            ? `Au-delà de ${fmtInt(seuilTVA)} €, vous devez facturer la TVA et la reverser.`
                            : `Sous le seuil ${fmtInt(seuilTVA)} € — mention "TVA non applicable, art. 293 B du CGI".`}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Detail des charges */}
            <div
              className="animate-fade-up stagger-5 rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Détail des charges
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="pb-3 text-left font-medium">Poste</th>
                      <th className="pb-3 text-right font-medium">Taux</th>
                      <th className="pb-3 text-right font-medium">Annuel</th>
                      <th className="pb-3 text-right font-medium">Mensuel</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3">
                        Cotisations sociales
                        {acre && (
                          <span
                            className="ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: "rgba(13, 79, 60, 0.08)", color: "var(--primary)" }}
                          >
                            ACRE
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>
                        {fmtPct(result.tauxCotisations * 100)}%
                      </td>
                      <td className="py-3 text-right">{fmt(result.cotisationsSociales)} &euro;</td>
                      <td className="py-3 text-right" style={{ color: "var(--muted)" }}>
                        {fmt(result.cotisationsSociales / 12)} &euro;
                      </td>
                    </tr>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3">
                        Impôt sur le revenu
                        <span
                          className="ml-2 inline-block rounded-full px-2 py-0.5 text-[10px]"
                          style={{ background: "var(--surface-alt)", color: "var(--muted)" }}
                        >
                          {result.modeIR}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>
                        {caAnnuel > 0
                          ? `${fmtPct((result.impotRevenu / caAnnuel) * 100)}%`
                          : "0,0%"}
                      </td>
                      <td className="py-3 text-right">{fmt(result.impotRevenu)} &euro;</td>
                      <td className="py-3 text-right" style={{ color: "var(--muted)" }}>
                        {fmt(result.impotRevenu / 12)} &euro;
                      </td>
                    </tr>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3">CFE (estimation)</td>
                      <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>
                        -
                      </td>
                      <td className="py-3 text-right">{fmt(result.cfeEstime)} &euro;</td>
                      <td className="py-3 text-right" style={{ color: "var(--muted)" }}>
                        {fmt(result.cfeEstime / 12)} &euro;
                      </td>
                    </tr>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3">Formation professionnelle (CFP)</td>
                      <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>
                        {fmtPct(rates.cfp[activite] * 100)}%
                      </td>
                      <td className="py-3 text-right">{fmt(result.cfp)} &euro;</td>
                      <td className="py-3 text-right" style={{ color: "var(--muted)" }}>
                        {fmt(result.cfp / 12)} &euro;
                      </td>
                    </tr>
                    <tr className="border-t-2" style={{ borderColor: "var(--primary)" }}>
                      <td className="py-3 font-semibold" colSpan={2}>
                        Total des charges
                      </td>
                      <td
                        className="py-3 text-right text-lg font-bold"
                        style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}
                      >
                        {fmt(result.totalCharges)} &euro;
                      </td>
                      <td
                        className="py-3 text-right font-semibold"
                        style={{ color: "var(--primary)" }}
                      >
                        {fmt(result.totalCharges / 12)} &euro;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Repartition visuelle */}
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Répartition des charges
              </h2>
              {totalForBar > 0 && (
                <div className="mt-4 flex h-8 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                  {parts.map(
                    (p, i) =>
                      p.value > 0 && (
                        <div
                          key={i}
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${(p.value / totalForBar) * 100}%`,
                            background: p.color,
                            opacity: 0.85,
                          }}
                          title={`${p.label}: ${fmt(p.value)} \u20AC`}
                        />
                      ),
                  )}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-4">
                {parts.map(
                  (p, i) =>
                    p.value > 0 && (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ background: p.color, opacity: 0.85 }}
                        />
                        <span style={{ color: "var(--muted)" }}>
                          {p.label} : <strong className="text-[var(--foreground)]">{fmt(p.value)} &euro;</strong>
                        </span>
                      </div>
                    ),
                )}
              </div>

              {/* CA vs Net bar */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-28 text-right text-xs font-bold" style={{ color: "var(--muted)" }}>
                    CA
                  </span>
                  <div className="h-6 flex-1 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: "100%", background: "var(--border)" }}
                    />
                  </div>
                  <span className="w-24 text-right text-xs font-semibold">{fmtInt(caAnnuel)} &euro;</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-28 text-right text-xs font-bold" style={{ color: "var(--primary)" }}>
                    Revenu net
                  </span>
                  <div className="h-6 flex-1 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: caAnnuel > 0 ? `${Math.max(0, (result.revenuNetAnnuel / caAnnuel) * 100)}%` : "0%",
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                  <span className="w-24 text-right text-xs font-semibold" style={{ color: "var(--primary)" }}>
                    {fmtInt(Math.max(0, result.revenuNetAnnuel))} &euro;
                  </span>
                </div>
              </div>
            </div>

            {/* Explications */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Comment sont calculées les charges
              </h2>
              <div
                className="mt-4 space-y-3 leading-relaxed"
                style={{ color: "var(--foreground)" }}
              >
                <p>
                  <strong>Cotisations sociales</strong> : elles sont calculées en pourcentage de
                  votre chiffre d&apos;affaires. Le taux dépend de votre type d&apos;activité
                  ({fmtPct(rates.cotisations.vente * 100)} % en vente,{" "}
                  {fmtPct(rates.cotisations.service_bic * 100)} % en prestation BIC,{" "}
                  {fmtPct(rates.cotisations.liberal_bnc * 100)} % en libéral BNC pour {annee}).
                </p>
                <p>
                  <strong>ACRE</strong> : l&apos;Aide à la Création ou Reprise d&apos;Entreprise
                  réduit vos cotisations pendant environ 12 mois (jusqu&apos;à la fin du 3e trimestre
                  civil suivant le début d&apos;activité). Pour les créations à compter du 1er juillet
                  2026, l&apos;exonération est de 25 % (taux appliqué par le simulateur en 2026) ; les
                  créations antérieures conservent l&apos;exonération de 50 %.
                </p>
                <p>
                  <strong>Versement libératoire</strong> : vous payez l&apos;IR directement sur
                  votre CA à un taux fixe ({fmtPct(rates.versementLiberatoire.vente * 100)} %,{" "}
                  {fmtPct(rates.versementLiberatoire.service_bic * 100)} % ou{" "}
                  {fmtPct(rates.versementLiberatoire.liberal_bnc * 100)} % selon l&apos;activité) au
                  lieu du barème progressif avec abattement forfaitaire (
                  {(rates.abattementIR.vente * 100).toFixed(0)} %,{" "}
                  {(rates.abattementIR.service_bic * 100).toFixed(0)} % ou{" "}
                  {(rates.abattementIR.liberal_bnc * 100).toFixed(0)} %). Au barème, le simulateur
                  applique le quotient familial, son plafonnement et la décote (barème 2026 sur les
                  revenus 2025), en supposant qu&apos;il n&apos;y a pas d&apos;autre revenu dans le foyer.
                </p>
                <p>
                  <strong>CFE</strong> : la Cotisation Foncière des Entreprises varie
                  considérablement selon votre commune. Le montant affiché est une estimation
                  médiane. Vous êtes exonéré si votre CA est inférieur à 5 000 €.
                </p>
                <p>
                  <strong>CFP</strong> : la Contribution à la Formation Professionnelle est
                  calculée sur le CA et payée avec chaque déclaration mensuelle ou trimestrielle.
                </p>
                <p>
                  <strong>Source.</strong> URSSAF, articles L613-7 et suivants du Code de la
                  sécurité sociale, articles 102 ter et 151-0 du CGI. Vérifications à urssaf.fr et
                  autoentrepreneur.urssaf.fr.
                </p>
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
                  emoji="📊"
                  title="Comparer avec CDI"
                  desc="Quel revenu net micro vs salariat ?"
                />
                <CrossLinkCard
                  href="/outils/generateur-facture"
                  emoji="📄"
                  title="Générer facture"
                  desc="Devis et factures conformes en PDF"
                />
                <CrossLinkCard
                  href="/outils/calculateur-tjm-freelance"
                  emoji="💼"
                  title="Calculer son TJM"
                  desc="Tarif journalier pour atteindre votre cible"
                />
              </div>
            </div>

            <ToolHowToSection
              title="Comment estimer vos cotisations d'auto-entrepreneur"
              description="Le simulateur applique les taux URSSAF officiels par type d'activité et intègre ACRE, versement libératoire et CFE."
              steps={[
                {
                  name: "Choisir votre type d'activité",
                  text:
                    "Vente de marchandises ou hébergement (12,3 % cotisations en 2026), prestation de service BIC (21,2 %), profession libérale BNC non réglementée (25,6 %, 23,2 % pour la CIPAV). Le taux dépend de votre code APE et de la nature exacte de votre activité. Vérifiez avec votre attestation INSEE.",
                },
                {
                  name: "Saisir votre CA mensuel ou annuel",
                  text:
                    "Le CA est le total des facturations encaissées, hors TVA si vous êtes en franchise (cas standard). Plafonds 2026 : 203 100 € pour la vente, 83 600 € pour les services et BNC. Au-delà, vous basculez en régime réel.",
                },
                {
                  name: "Cocher ACRE si applicable",
                  text:
                    "L'ACRE réduit vos cotisations pendant environ 12 mois (jusqu'à la fin du 3e trimestre suivant le début d'activité) : -50 % pour les créations avant le 1er juillet 2026, -25 % depuis. Elle est réservée à certains publics (demandeurs d'emploi, bénéficiaires du RSA ou de l'ASS, jeunes de 18 à 25 ans, etc.). La demande se fait auprès de l'Urssaf dans les 60 jours suivant le début d'activité.",
                },
                {
                  name: "Choisir entre IR barème ou versement libératoire",
                  text:
                    "Versement libératoire = paiement IR au taux forfaitaire chaque mois/trimestre (1 %, 1,7 % ou 2,2 % selon activité). IR barème classique = abattement forfaitaire (71 %, 50 % ou 34 %) puis barème progressif. Activez ou non l'option dans le simulateur pour comparer les deux.",
                },
              ]}
            />

            <ToolFaqSection
              intro="Les questions les plus posées sur le statut d'auto-entrepreneur en France."
              items={[
                {
                  question: "Quels sont les plafonds de CA en 2026 ?",
                  answer:
                    "203 100 € pour la vente de marchandises et hébergement (BIC). 83 600 € pour les prestations de services BIC et les professions libérales BNC. Si vous dépassez ces plafonds 2 années consécutives, vous basculez automatiquement au régime réel (BIC ou BNC). Pendant la 1re année de dépassement, vous restez en micro.",
                },
                {
                  question: "Quel est le taux de cotisations sociales auto-entrepreneur 2026 ?",
                  answer:
                    "Pour 2026 : 12,3 % en vente / hébergement, 21,2 % en prestation de services BIC, 25,6 % en profession libérale BNC non réglementée (23,2 % pour la CIPAV). Ces taux incluent les cotisations URSSAF, retraite et la CSG/CRDS. Ils sont appliqués directement sur le CA encaissé, sans abattement.",
                },
                {
                  question: "Quand vaut-il mieux choisir le versement libératoire ?",
                  answer:
                    "Le versement libératoire (IR forfaitaire payé avec les cotisations) n'est accessible que si le revenu fiscal de référence N-2 ne dépasse pas 29 315 € par part (RFR 2024 pour 2026). Il est surtout intéressant si votre taux marginal d'imposition est élevé ; avec un foyer peu ou pas imposable, le barème progressif avec abattement est souvent plus avantageux. Activez ou non l'option dans le simulateur pour comparer.",
                },
                {
                  question: "L'ACRE est-elle automatique ?",
                  answer:
                    "Non. L'ACRE doit être demandée au plus tard 60 jours après la création de votre auto-entreprise via le formulaire en ligne sur autoentrepreneur.urssaf.fr. Si elle est accordée, elle s'applique automatiquement aux cotisations URSSAF. Pas de rétroactivité : tardez et vous perdez le bénéfice.",
                },
                {
                  question: "Comment fonctionne la franchise en base TVA ?",
                  answer:
                    "Tant que vous êtes sous le seuil de franchise en base (vérifier les seuils en vigueur sur impots.gouv.fr), vous facturez sans TVA et la mention 'TVA non applicable, art. 293 B du CGI' doit figurer. Au-delà des seuils, la TVA devient obligatoire et vous devez facturer, collecter et reverser via vos déclarations périodiques.",
                },
                {
                  question: "Suis-je redevable de la CFE en tant qu'auto-entrepreneur ?",
                  answer:
                    "Oui après la 1re année d'activité (exonération la 1re année). Le montant dépend de votre commune et de votre CA. Plafond plancher de 237 € à 562 € par an selon le CA pour 2026. Exonération totale si votre CA annuel reste inférieur à 5 000 € (preuve par avis de situation à fournir).",
                },
                {
                  question: "Puis-je cumuler micro-entreprise et salariat ?",
                  answer:
                    "Oui, c'est même très fréquent. Un salarié peut créer son auto-entreprise sans en informer son employeur, sauf clause d'exclusivité ou conflit d'intérêts. Vérifiez votre contrat et votre convention collective. Vos cotisations sociales sont séparées : salariat = régime général, auto-entreprise = micro-social.",
                },
                {
                  question: "Le simulateur garde-t-il mes données ?",
                  answer:
                    "Non. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée saisie (CA, type d'activité, ACRE) n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription.",
                },
              ]}
            />
          </div>

          {/* ---- Sidebar ---- */}
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />

            {/* Taux en vigueur */}
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Taux {annee}
                {isEstime ? " (estimés)" : ""}
              </h3>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                <li>
                  Vente :{" "}
                  <strong className="text-[var(--foreground)]">
                    {fmtPct(rates.cotisations.vente * 100)}%
                  </strong>
                </li>
                <li>
                  Service BIC :{" "}
                  <strong className="text-[var(--foreground)]">
                    {fmtPct(rates.cotisations.service_bic * 100)}%
                  </strong>
                </li>
                <li>
                  Libéral BNC :{" "}
                  <strong className="text-[var(--foreground)]">
                    {fmtPct(rates.cotisations.liberal_bnc * 100)}%
                  </strong>
                </li>
              </ul>
            </div>

            {/* Plafonds CA */}
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Plafonds CA {annee}
              </h3>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                <li>
                  Micro-BIC vente :{" "}
                  <strong className="text-[var(--foreground)]">
                    {fmtInt(rates.plafondCA.vente)} &euro;
                  </strong>
                </li>
                <li>
                  Micro-BIC services :{" "}
                  <strong className="text-[var(--foreground)]">
                    {fmtInt(rates.plafondCA.service_bic)} &euro;
                  </strong>
                </li>
                <li>
                  Micro-BNC :{" "}
                  <strong className="text-[var(--foreground)]">
                    {fmtInt(rates.plafondCA.liberal_bnc)} &euro;
                  </strong>
                </li>
              </ul>
            </div>

            {/* Versement liberatoire */}
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Versement libératoire
              </h3>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                <li>
                  Vente :{" "}
                  <strong className="text-[var(--foreground)]">
                    {fmtPct(rates.versementLiberatoire.vente * 100)}%
                  </strong>
                </li>
                <li>
                  Service BIC :{" "}
                  <strong className="text-[var(--foreground)]">
                    {fmtPct(rates.versementLiberatoire.service_bic * 100)}%
                  </strong>
                </li>
                <li>
                  Libéral BNC :{" "}
                  <strong className="text-[var(--foreground)]">
                    {fmtPct(rates.versementLiberatoire.liberal_bnc * 100)}%
                  </strong>
                </li>
                <li className="pt-1" style={{ borderTop: "1px solid var(--border)" }}>
                  RFR max/part :{" "}
                  <strong className="text-[var(--foreground)]">29 315 &euro;</strong>{" "}
                  (RFR 2024, avis 2025)
                </li>
              </ul>
            </div>

            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function DonutChart({
  cotisations,
  impot,
  net,
  total,
}: {
  cotisations: number;
  impot: number;
  net: number;
  total: number;
}) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const stroke = 22;
  const safeTotal = total > 0 ? total : 1;
  const cotPct = Math.max(0, cotisations) / safeTotal;
  const impotPct = Math.max(0, impot) / safeTotal;
  const netPct = Math.max(0, net) / safeTotal;
  const cotLen = cotPct * c;
  const impotLen = impotPct * c;
  const netLen = netPct * c;
  return (
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Répartition du chiffre d'affaires">
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
        Net
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
