"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const PRESETS_PRIX = [
  { label: "Studio", value: 120000 },
  { label: "T2", value: 220000 },
  { label: "T3", value: 380000 },
  { label: "Maison", value: 600000 },
];

// ---------------------------------------------------------------------------
// Baremes officiels frais de notaire (source: loi de finances, decrets)
// ---------------------------------------------------------------------------

// Emoluments du notaire - bareme proportionnel degressif par tranches
// (article A444-91 du Code de commerce, arrete du 28/02/2020, proroge)
const TRANCHES_EMOLUMENTS = [
  { min: 0, max: 6500, taux: 0.0387 },
  { min: 6500, max: 17000, taux: 0.01596 },
  { min: 17000, max: 60000, taux: 0.01064 },
  { min: 60000, max: Infinity, taux: 0.00799 },
];

// TVA sur emoluments : 20% en metropole, 8,5% en Guadeloupe, Martinique et a La Reunion,
// non applicable en Guyane et a Mayotte (art. 294 et 296 CGI)
function getTauxTVA(codeDept: string): number {
  if (["971", "972", "974"].includes(codeDept)) return 0.085;
  if (["973", "976"].includes(codeDept)) return 0;
  return 0.20;
}

// Droits de mutation (DMTO) - Ancien
// Taux departemental : 4.50% (standard) ou 5.00% (majore, loi finances 2025,
// actes du 01/04/2025 au 31/03/2028 ; primo-accedants exoneres de la majoration)
// Taxe communale : 1.20%
// Frais d'assiette et recouvrement Etat : 2.37% du taux departemental
const TAUX_COMMUNAL = 0.012; // 1.20%
const TAUX_ASSIETTE_ETAT = 0.0237; // 2.37% du taux departemental

// Droits de mutation - Neuf (taxe de publicite fonciere)
const TAUX_TPF_NEUF = 0.00715; // 0.715%

// Debours forfaitaires estimes
const DEBOURS_FORFAIT = 1400; // environ 1 400 EUR (documents urbanisme, cadastre, hypotheques)

// Contribution de securite immobiliere (ex-salaire du conservateur)
const TAUX_SECURITE_IMMOBILIERE = 0.001; // 0.10% du prix

// Departements a taux reduit (3.80%) - source: tableau DGFiP au 01/06/2026
const DEPARTEMENTS_TAUX_REDUIT: Record<string, number> = {
  "36": 0.038, // Indre
};

// Departements restes a 4.50% (n'ayant pas vote la majoration) - tableau DGFiP au 01/06/2026
const DEPARTEMENTS_NON_MAJORES = [
  "05", // Hautes-Alpes
  "06", // Alpes-Maritimes
  "07", // Ardeche
  "16", // Charente
  "26", // Drome
  "48", // Lozere
  "60", // Oise
  "65", // Hautes-Pyrenees
  "71", // Saone-et-Loire
  "971", // Guadeloupe
  "976", // Mayotte (depuis le 01/06/2026)
];

const TAUX_DEPARTEMENTAL_NORMAL = 0.045;

// Liste des departements francais
const DEPARTEMENTS = [
  { code: "01", nom: "Ain" },
  { code: "02", nom: "Aisne" },
  { code: "03", nom: "Allier" },
  { code: "04", nom: "Alpes-de-Haute-Provence" },
  { code: "05", nom: "Hautes-Alpes" },
  { code: "06", nom: "Alpes-Maritimes" },
  { code: "07", nom: "Ardèche" },
  { code: "08", nom: "Ardennes" },
  { code: "09", nom: "Ariège" },
  { code: "10", nom: "Aube" },
  { code: "11", nom: "Aude" },
  { code: "12", nom: "Aveyron" },
  { code: "13", nom: "Bouches-du-Rhône" },
  { code: "14", nom: "Calvados" },
  { code: "15", nom: "Cantal" },
  { code: "16", nom: "Charente" },
  { code: "17", nom: "Charente-Maritime" },
  { code: "18", nom: "Cher" },
  { code: "19", nom: "Corrèze" },
  { code: "2A", nom: "Corse-du-Sud" },
  { code: "2B", nom: "Haute-Corse" },
  { code: "21", nom: "Côte-d'Or" },
  { code: "22", nom: "Côtes-d'Armor" },
  { code: "23", nom: "Creuse" },
  { code: "24", nom: "Dordogne" },
  { code: "25", nom: "Doubs" },
  { code: "26", nom: "Drôme" },
  { code: "27", nom: "Eure" },
  { code: "28", nom: "Eure-et-Loir" },
  { code: "29", nom: "Finistère" },
  { code: "30", nom: "Gard" },
  { code: "31", nom: "Haute-Garonne" },
  { code: "32", nom: "Gers" },
  { code: "33", nom: "Gironde" },
  { code: "34", nom: "Hérault" },
  { code: "35", nom: "Ille-et-Vilaine" },
  { code: "36", nom: "Indre" },
  { code: "37", nom: "Indre-et-Loire" },
  { code: "38", nom: "Isère" },
  { code: "39", nom: "Jura" },
  { code: "40", nom: "Landes" },
  { code: "41", nom: "Loir-et-Cher" },
  { code: "42", nom: "Loire" },
  { code: "43", nom: "Haute-Loire" },
  { code: "44", nom: "Loire-Atlantique" },
  { code: "45", nom: "Loiret" },
  { code: "46", nom: "Lot" },
  { code: "47", nom: "Lot-et-Garonne" },
  { code: "48", nom: "Lozère" },
  { code: "49", nom: "Maine-et-Loire" },
  { code: "50", nom: "Manche" },
  { code: "51", nom: "Marne" },
  { code: "52", nom: "Haute-Marne" },
  { code: "53", nom: "Mayenne" },
  { code: "54", nom: "Meurthe-et-Moselle" },
  { code: "55", nom: "Meuse" },
  { code: "56", nom: "Morbihan" },
  { code: "57", nom: "Moselle" },
  { code: "58", nom: "Nièvre" },
  { code: "59", nom: "Nord" },
  { code: "60", nom: "Oise" },
  { code: "61", nom: "Orne" },
  { code: "62", nom: "Pas-de-Calais" },
  { code: "63", nom: "Puy-de-Dôme" },
  { code: "64", nom: "Pyrénées-Atlantiques" },
  { code: "65", nom: "Hautes-Pyrénées" },
  { code: "66", nom: "Pyrénées-Orientales" },
  { code: "67", nom: "Bas-Rhin" },
  { code: "68", nom: "Haut-Rhin" },
  { code: "69", nom: "Rhône" },
  { code: "70", nom: "Haute-Saône" },
  { code: "71", nom: "Saône-et-Loire" },
  { code: "72", nom: "Sarthe" },
  { code: "73", nom: "Savoie" },
  { code: "74", nom: "Haute-Savoie" },
  { code: "75", nom: "Paris" },
  { code: "76", nom: "Seine-Maritime" },
  { code: "77", nom: "Seine-et-Marne" },
  { code: "78", nom: "Yvelines" },
  { code: "79", nom: "Deux-Sèvres" },
  { code: "80", nom: "Somme" },
  { code: "81", nom: "Tarn" },
  { code: "82", nom: "Tarn-et-Garonne" },
  { code: "83", nom: "Var" },
  { code: "84", nom: "Vaucluse" },
  { code: "85", nom: "Vendée" },
  { code: "86", nom: "Vienne" },
  { code: "87", nom: "Haute-Vienne" },
  { code: "88", nom: "Vosges" },
  { code: "89", nom: "Yonne" },
  { code: "90", nom: "Territoire de Belfort" },
  { code: "91", nom: "Essonne" },
  { code: "92", nom: "Hauts-de-Seine" },
  { code: "93", nom: "Seine-Saint-Denis" },
  { code: "94", nom: "Val-de-Marne" },
  { code: "95", nom: "Val-d'Oise" },
  { code: "971", nom: "Guadeloupe" },
  { code: "972", nom: "Martinique" },
  { code: "973", nom: "Guyane" },
  { code: "974", nom: "La Réunion" },
  { code: "976", nom: "Mayotte" },
];

// ---------------------------------------------------------------------------
// Calcul
// ---------------------------------------------------------------------------

function getTauxDepartemental(codeDept: string, primoAccedant = false): number {
  if (DEPARTEMENTS_TAUX_REDUIT[codeDept] !== undefined) {
    return DEPARTEMENTS_TAUX_REDUIT[codeDept];
  }
  if (DEPARTEMENTS_NON_MAJORES.includes(codeDept)) {
    return TAUX_DEPARTEMENTAL_NORMAL; // 4.50%
  }
  // 5.00% (majore - majorite des departements depuis avril 2025), sauf primo-accedant
  return primoAccedant ? TAUX_DEPARTEMENTAL_NORMAL : 0.05;
}

function calculerEmoluments(prix: number): { total: number; details: { tranche: string; base: number; taux: number; montant: number }[] } {
  let total = 0;
  const details: { tranche: string; base: number; taux: number; montant: number }[] = [];

  for (const t of TRANCHES_EMOLUMENTS) {
    if (prix <= t.min) break;
    const base = Math.min(prix, t.max) - t.min;
    const montant = base * t.taux;
    total += montant;
    if (base > 0) {
      details.push({
        tranche: `${t.min.toLocaleString("fr-FR")} - ${t.max === Infinity ? "+" : t.max.toLocaleString("fr-FR")} \u20AC`,
        base,
        taux: t.taux,
        montant,
      });
    }
  }

  return { total, details };
}

interface ResultatFraisNotaire {
  prix: number;
  typeBien: string;
  // Droits de mutation
  tauxDepartemental: number;
  droitDepartemental: number;
  droitCommunal: number;
  fraisAssiette: number;
  totalDroitsMutation: number;
  // Emoluments
  emolumentsHT: number;
  tvaTaux: number;
  tvaEmoluments: number;
  emolumentsTTC: number;
  emolumentsDetails: { tranche: string; base: number; taux: number; montant: number }[];
  // Debours & formalites
  debours: number;
  securiteImmobiliere: number;
  // Totaux
  totalFrais: number;
  pourcentage: number;
}

function calculerFraisNotaire(prix: number, typeBien: "ancien" | "neuf", codeDept: string, primoAccedant = false): ResultatFraisNotaire {
  // Emoluments du notaire (identiques ancien/neuf)
  const emol = calculerEmoluments(prix);
  const emolumentsHT = emol.total;
  const tvaTaux = getTauxTVA(codeDept);
  const tvaEmoluments = emolumentsHT * tvaTaux;
  const emolumentsTTC = emolumentsHT + tvaEmoluments;

  // Contribution de securite immobiliere
  const securiteImmobiliere = Math.max(15, prix * TAUX_SECURITE_IMMOBILIERE);

  // Debours forfaitaires
  const debours = DEBOURS_FORFAIT;

  let tauxDepartemental: number;
  let droitDepartemental: number;
  let droitCommunal: number;
  let fraisAssiette: number;
  let totalDroitsMutation: number;

  if (typeBien === "ancien") {
    // Droits de mutation dans l'ancien
    tauxDepartemental = getTauxDepartemental(codeDept, primoAccedant);
    droitDepartemental = prix * tauxDepartemental;
    droitCommunal = prix * TAUX_COMMUNAL;
    fraisAssiette = droitDepartemental * TAUX_ASSIETTE_ETAT;
    totalDroitsMutation = droitDepartemental + droitCommunal + fraisAssiette;
  } else {
    // Neuf : taxe de publicite fonciere au taux reduit
    tauxDepartemental = TAUX_TPF_NEUF;
    droitDepartemental = prix * TAUX_TPF_NEUF;
    droitCommunal = 0;
    fraisAssiette = 0;
    totalDroitsMutation = droitDepartemental;
  }

  const totalFrais = totalDroitsMutation + emolumentsTTC + debours + securiteImmobiliere;
  const pourcentage = prix > 0 ? (totalFrais / prix) * 100 : 0;

  return {
    prix,
    typeBien,
    tauxDepartemental,
    droitDepartemental,
    droitCommunal,
    fraisAssiette,
    totalDroitsMutation,
    emolumentsHT,
    tvaTaux,
    tvaEmoluments,
    emolumentsTTC,
    emolumentsDetails: emol.details,
    debours,
    securiteImmobiliere,
    totalFrais,
    pourcentage,
  };
}

// ---------------------------------------------------------------------------
// Composants
// ---------------------------------------------------------------------------

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

function DonutChartFraisNotaire({
  droits,
  emoluments,
  debours,
  pct,
}: {
  droits: number;
  emoluments: number;
  debours: number;
  pct: number;
}) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const stroke = 22;
  const total = droits + emoluments + debours > 0 ? droits + emoluments + debours : 1;
  const droitsPct = Math.max(0, droits) / total;
  const emolPct = Math.max(0, emoluments) / total;
  const deboursPct = Math.max(0, debours) / total;
  const droitsLen = droitsPct * c;
  const emolLen = emolPct * c;
  const deboursLen = deboursPct * c;
  return (
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Répartition des frais de notaire">
      <circle cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <g transform="rotate(-90)">
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#dc2626"
          strokeWidth={stroke}
          strokeDasharray={`${droitsLen} ${c}`}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#e8963e"
          strokeWidth={stroke}
          strokeDasharray={`${emolLen} ${c}`}
          strokeDashoffset={-droitsLen}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#0d4f3c"
          strokeWidth={stroke}
          strokeDasharray={`${deboursLen} ${c}`}
          strokeDashoffset={-(droitsLen + emolLen)}
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
        % du prix
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
        {pct.toFixed(1)}%
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

// ---------------------------------------------------------------------------
// Page principale
// ---------------------------------------------------------------------------

export default function CalculateurFraisNotaire() {
  const [prix, setPrix] = useState("250000");
  const [typeBien, setTypeBien] = useState<"ancien" | "neuf">("ancien");
  const [departement, setDepartement] = useState("75");
  const [primoAccedant, setPrimoAccedant] = useState(false);

  const prixNum = Math.max(0, parseFloat(prix) || 0);
  const result = useMemo(
    () => calculerFraisNotaire(prixNum, typeBien, departement, primoAccedant),
    [prixNum, typeBien, departement, primoAccedant]
  );

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtPct = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const deptNom = DEPARTEMENTS.find((d) => d.code === departement)?.nom ?? "";
  const tauxDeptLabel = typeBien === "ancien"
    ? `${(result.tauxDepartemental * 100).toFixed(2)}%`
    : "0,715% (TPF neuf)";

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Immobilier</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>frais de notaire</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez les frais de notaire pour votre achat immobilier. Barèmes officiels 2025-2026, taux départementaux mis à jour.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Formulaire de saisie */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="space-y-4">
                {/* Prix d'achat */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Prix d&apos;achat du bien
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      value={prix}
                      onChange={(e) => setPrix(e.target.value)}
                      min="0"
                      step="1000"
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                  {/* Slider */}
                  <input
                    type="range"
                    min={50000}
                    max={1500000}
                    step={5000}
                    value={Math.min(Math.max(parseFloat(prix) || 0, 50000), 1500000)}
                    onChange={(e) => setPrix(e.target.value)}
                    className="mt-3 w-full accent-[#0d4f3c]"
                    aria-label="Curseur prix du bien"
                  />
                  {/* Presets */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRESETS_PRIX.map((p) => {
                      const isActive = parseFloat(prix) === p.value;
                      return (
                        <button
                          key={p.label}
                          onClick={() => setPrix(String(p.value))}
                          className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                          style={{
                            borderColor: isActive ? "var(--primary)" : "var(--border)",
                            color: isActive ? "var(--primary)" : "var(--muted)",
                            background: isActive ? "rgba(13,79,60,0.06)" : "transparent",
                          }}
                        >
                          {p.label}{" "}
                          <span style={{ color: isActive ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                            {p.value.toLocaleString("fr-FR")} &euro;
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Type de bien */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Type de bien
                    </label>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setTypeBien("ancien")}
                        className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                        style={{
                          borderColor: typeBien === "ancien" ? "var(--primary)" : "var(--border)",
                          background: typeBien === "ancien" ? "var(--primary)" : "var(--surface)",
                          color: typeBien === "ancien" ? "white" : "var(--foreground)",
                        }}
                      >
                        Ancien
                      </button>
                      <button
                        onClick={() => setTypeBien("neuf")}
                        className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                        style={{
                          borderColor: typeBien === "neuf" ? "var(--primary)" : "var(--border)",
                          background: typeBien === "neuf" ? "var(--primary)" : "var(--surface)",
                          color: typeBien === "neuf" ? "white" : "var(--foreground)",
                        }}
                      >
                        Neuf / VEFA
                      </button>
                    </div>
                  </div>

                  {/* Departement */}
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Département
                    </label>
                    <select
                      value={departement}
                      onChange={(e) => setDepartement(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {DEPARTEMENTS.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.code} - {d.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {typeBien === "ancien" && (
                  <label className="flex items-start gap-3 text-sm" style={{ color: "var(--foreground)" }}>
                    <input
                      type="checkbox"
                      checked={primoAccedant}
                      onChange={(e) => setPrimoAccedant(e.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#0d4f3c]"
                    />
                    <span>
                      Primo-accédant achetant sa résidence principale
                      <span className="block text-xs" style={{ color: "var(--muted)" }}>
                        Exonéré de la majoration de 0,5 point : taux départemental plafonné à 4,50 %.
                      </span>
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Resultats principaux */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox label="Frais totaux" value={`${fmt(result.totalFrais)} \u20AC`} primary />
              <StatBox label="% du prix" value={`${fmtPct(result.pourcentage)}%`} accent />
              <StatBox label="Droits mutation" value={`${fmt(result.totalDroitsMutation)} \u20AC`} />
              <StatBox label="Émoluments TTC" value={`${fmt(result.emolumentsTTC)} \u20AC`} />
            </div>

            {/* Cout total acquisition */}
            <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Coût total de l&apos;acquisition</p>
              <p className="mt-2 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {fmt(prixNum + result.totalFrais)} &euro;
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Prix {fmt(prixNum)} &euro; + Frais {fmt(result.totalFrais)} &euro;
              </p>
            </div>

            {/* Visualisation donut */}
            <div className="animate-scale-in stagger-2 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Répartition des frais
              </h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                <div className="flex justify-center">
                  <DonutChartFraisNotaire
                    droits={result.totalDroitsMutation}
                    emoluments={result.emolumentsTTC}
                    debours={result.debours + result.securiteImmobiliere}
                    pct={result.pourcentage}
                  />
                </div>
                <div className="space-y-1">
                  <Row label="Droits de mutation" value={`${fmt(result.totalDroitsMutation)} \u20AC`} sub dotColor="#dc2626" />
                  <Row label="Émoluments notaire (TTC)" value={`${fmt(result.emolumentsTTC)} \u20AC`} sub dotColor="#e8963e" />
                  <Row label="Débours et formalités" value={`${fmt(result.debours + result.securiteImmobiliere)} \u20AC`} sub dotColor="#0d4f3c" />
                  <Row label="Total des frais" value={`${fmt(result.totalFrais)} \u20AC`} highlight primary dotColor="var(--primary)" />
                </div>
              </div>

              {/* Cartes contextuelles */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Total à prévoir
                  </p>
                  <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(result.totalFrais)} &euro;
                  </p>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                    À régler le jour de la signature de l&apos;acte authentique chez le notaire.
                  </p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Soit X% du prix du bien
                  </p>
                  <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: result.pourcentage >= 7 ? "#dc2626" : "var(--accent)" }}>
                    {fmtPct(result.pourcentage)}%
                  </p>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                    {typeBien === "neuf"
                      ? "Ratio typique pour du neuf (2 à 3%) grâce au taux réduit de TPF."
                      : "Ratio typique pour de l'ancien (7 à 8%) avec DMTO majoritairement à 5%."}
                  </p>
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
                  href="/outils/calculateur-pret-immobilier"
                  emoji="🏠"
                  title="Simuler le prêt"
                  desc="Mensualité et capacité d&apos;emprunt selon HCSF"
                />
                <CrossLinkCard
                  href="/outils/simulateur-plus-value-immobiliere"
                  emoji="📈"
                  title="Plus-value immo"
                  desc="Imposition sur la revente d&apos;un bien"
                />
                <CrossLinkCard
                  href="/outils/simulateur-ptz-2026"
                  emoji="🆓"
                  title="PTZ 2026"
                  desc="Prêt à taux zéro pour primo-accédants"
                />
              </div>
            </div>

            {/* Detail des droits de mutation */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Détail des droits de mutation {typeBien === "neuf" ? "(Taxe publicité foncière)" : "(DMTO)"}
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="pb-3 text-left font-medium">Poste</th>
                      <th className="pb-3 text-right font-medium">Taux</th>
                      <th className="pb-3 text-right font-medium">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeBien === "ancien" ? (
                      <>
                        <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                          <td className="py-3">
                            Taxe départementale ({deptNom})
                          </td>
                          <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>{tauxDeptLabel}</td>
                          <td className="py-3 text-right">{fmt(result.droitDepartemental)} &euro;</td>
                        </tr>
                        <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                          <td className="py-3">Taxe communale</td>
                          <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>1,20%</td>
                          <td className="py-3 text-right">{fmt(result.droitCommunal)} &euro;</td>
                        </tr>
                        <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                          <td className="py-3">Frais d&apos;assiette et recouvrement (État)</td>
                          <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>2,37% de la taxe dept.</td>
                          <td className="py-3 text-right">{fmt(result.fraisAssiette)} &euro;</td>
                        </tr>
                      </>
                    ) : (
                      <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                        <td className="py-3">Taxe de publicité foncière (taux réduit neuf)</td>
                        <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>0,715%</td>
                        <td className="py-3 text-right">{fmt(result.droitDepartemental)} &euro;</td>
                      </tr>
                    )}
                    <tr className="border-t-2" style={{ borderColor: "var(--primary)" }}>
                      <td className="py-3 font-semibold" colSpan={2}>Total droits de mutation</td>
                      <td className="py-3 text-right text-lg font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                        {fmt(result.totalDroitsMutation)} &euro;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail des emoluments */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Détail des émoluments du notaire
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="pb-3 text-left font-medium">Tranche</th>
                      <th className="pb-3 text-right font-medium">Taux</th>
                      <th className="pb-3 text-right font-medium">Base</th>
                      <th className="pb-3 text-right font-medium">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.emolumentsDetails.map((d, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                        <td className="py-3">{d.tranche}</td>
                        <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>{(d.taux * 100).toFixed(3)}%</td>
                        <td className="py-3 text-right">{fmt(d.base)} &euro;</td>
                        <td className="py-3 text-right">{fmt(d.montant)} &euro;</td>
                      </tr>
                    ))}
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3" colSpan={3}>Émoluments HT</td>
                      <td className="py-3 text-right font-semibold">{fmt(result.emolumentsHT)} &euro;</td>
                    </tr>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3" colSpan={3}>TVA ({(result.tvaTaux * 100).toLocaleString("fr-FR")}%)</td>
                      <td className="py-3 text-right">{fmt(result.tvaEmoluments)} &euro;</td>
                    </tr>
                    <tr className="border-t-2" style={{ borderColor: "var(--primary)" }}>
                      <td className="py-3 font-semibold" colSpan={3}>Émoluments TTC</td>
                      <td className="py-3 text-right text-lg font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                        {fmt(result.emolumentsTTC)} &euro;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail debours */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Débours et formalités
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="pb-3 text-left font-medium">Poste</th>
                      <th className="pb-3 text-right font-medium">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3">Débours (documents urbanisme, cadastre, hypothèques...)</td>
                      <td className="py-3 text-right">{fmt(result.debours)} &euro;</td>
                    </tr>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3">Contribution de sécurité immobilière (0,10%)</td>
                      <td className="py-3 text-right">{fmt(result.securiteImmobiliere)} &euro;</td>
                    </tr>
                    <tr className="border-t-2" style={{ borderColor: "var(--primary)" }}>
                      <td className="py-3 font-semibold">Total débours et formalités</td>
                      <td className="py-3 text-right text-lg font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                        {fmt(result.debours + result.securiteImmobiliere)} &euro;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recap final */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Récapitulatif
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3">Droits de mutation {typeBien === "neuf" ? "(TPF)" : "(DMTO)"}</td>
                      <td className="py-3 text-right font-semibold">{fmt(result.totalDroitsMutation)} &euro;</td>
                    </tr>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3">Émoluments du notaire TTC</td>
                      <td className="py-3 text-right font-semibold">{fmt(result.emolumentsTTC)} &euro;</td>
                    </tr>
                    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                      <td className="py-3">Débours et formalités</td>
                      <td className="py-3 text-right font-semibold">{fmt(result.debours + result.securiteImmobiliere)} &euro;</td>
                    </tr>
                    <tr className="border-t-2" style={{ borderColor: "var(--primary)" }}>
                      <td className="py-3 text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>Total frais de notaire</td>
                      <td className="py-3 text-right text-2xl font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                        {fmt(result.totalFrais)} &euro;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <ToolHowToSection
              title="Comment estimer vos frais de notaire en 4 étapes"
              description="Le calculateur applique les barèmes officiels 2026 (loi de finances) avec gestion ancien / neuf et taux départementaux à jour."
              steps={[
                {
                  name: "Saisir le prix d'achat du bien",
                  text:
                    "Indiquez le prix net vendeur, hors mobilier et hors honoraires d'agence. Si une portion du prix correspond à du mobilier (cuisine équipée, électroménager), elle peut être déduite de l'assiette des droits de mutation : prévoyez de la valoriser dans le compromis (typiquement 2-5 % du prix).",
                },
                {
                  name: "Choisir ancien ou neuf",
                  text:
                    "Bien ANCIEN (revenu vendu plus de 5 ans après construction ou après première mutation) : frais ~7 à 8 % du prix. Bien NEUF (VEFA, première mutation moins de 5 ans après construction) : frais ~2 à 3 % du prix grâce au taux réduit de TPF (0,715 %), la TVA est payée par le promoteur.",
                },
                {
                  name: "Sélectionner le département",
                  text:
                    "Le taux départemental varie : 5,00 % dans la majorité des départements depuis avril 2025, 4,50 % dans 11 départements (et pour les primo-accédants achetant leur résidence principale), 3,80 % dans l'Indre. Choisissez votre département pour un calcul précis.",
                },
                {
                  name: "Lire le détail",
                  text:
                    "Le calculateur affiche : DMTO (droits de mutation, partie fiscale), émoluments du notaire (barème proportionnel dégressif), débours et TVA. Le total est arrondi et indicatif. Le notaire vous remettra un devis précis avant signature.",
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
                Comment se décomposent les frais de notaire
              </h2>
              <div className="mt-4 space-y-3 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  Les &laquo; frais de notaire &raquo; se composent en réalité de{" "}
                  <strong>trois postes principaux</strong> :
                </p>
                <p>
                  <strong>1. Les droits de mutation (DMTO)</strong> : c&apos;est la part fiscale,
                  reversée à l&apos;État et aux collectivités. Pour un bien ancien, ils
                  représentent environ 5,80 % à 6,32 % du prix selon le département. Pour un bien
                  neuf, seule la taxe de publicité foncière au taux réduit de 0,715 % s&apos;applique.
                </p>
                <p>
                  <strong>2. Les émoluments du notaire</strong> : c&apos;est la rémunération du
                  notaire, calculée selon un barème proportionnel dégressif fixé par décret. Ils
                  représentent environ 1 % du prix de vente, auxquels s&apos;ajoute la TVA (20 % en métropole, 8,5 % ou 0 % en outre-mer).
                </p>
                <p>
                  <strong>3. Les débours et formalités</strong> : ce sont les frais avancés par le
                  notaire pour le compte de l&apos;acheteur (documents d&apos;urbanisme, cadastre,
                  extraits hypothécaires, contribution de sécurité immobilière).
                </p>
                <p className="rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <strong>Hausse 2025-2028 :</strong> La loi de finances 2025 autorise les
                  départements à majorer de 0,5 point le taux départemental (de 4,50 % à 5 %)
                  pour les actes signés du 1er avril 2025 au 31 mars 2028. La majorité des départements ont voté cette hausse.
                  Les primo-accédants en sont exemptés.
                </p>
                <p>
                  <strong>Source.</strong> Code général des impôts art. 1594 D et 1594 H, décrets
                  fixant les émoluments du notaire (Décret n2016-230 modifié). Vérifications à
                  notaires.fr.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus fréquentes sur les frais de notaire en France."
              items={[
                {
                  question: "Quels sont les frais de notaire pour un bien ancien en 2026 ?",
                  answer:
                    "Environ 7,5 à 8 % du prix d'achat dans la majorité des départements (taux 5 %), un peu moins dans les départements à 4,5 % (~7 %). Exemple : pour un appartement ancien à 300 000 € dans un département majoré, comptez environ 23 000 à 24 000 € de frais.",
                },
                {
                  question: "Et pour un bien neuf (VEFA) ?",
                  answer:
                    "Environ 2 à 3 % du prix car les droits de mutation sont remplacés par la taxe de publicité foncière au taux réduit de 0,715 %. La TVA à 20 % est payée par le vendeur (incluse dans le prix de vente affiché). Exemple : pour 300 000 € en neuf, comptez ~7 200 € de frais notaire.",
                },
                {
                  question: "Les frais de notaire sont-ils négociables ?",
                  answer:
                    "Les émoluments du notaire (sa rémunération) sont fixés par décret donc non négociables sur les premiers 100 000 €. Depuis 2021, le notaire peut accorder une remise jusqu'à 20 % sur les émoluments calculés sur la partie du prix excédant 100 000 € (art. R444-10 du Code de commerce). Les DMTO (partie fiscale) ne sont pas négociables.",
                },
                {
                  question: "Quand paie-t-on les frais de notaire ?",
                  answer:
                    "Le jour de la signature de l'acte authentique de vente, soit en moyenne 2-3 mois après le compromis. Le notaire vous demandera une provision (à peu près égale aux frais estimés) quelques jours avant. Le solde éventuel est ajusté après régularisation des comptes.",
                },
                {
                  question: "Peut-on inclure les frais de notaire dans le prêt immobilier ?",
                  answer:
                    "Oui, on parle alors de 'prêt à 110 %'. Les banques l'accordent surtout aux primo-accédants ayant des revenus stables. Cela augmente le coût total du prêt et peut dépasser le seuil HCSF de 35 % d'endettement. Dans la pratique, un apport couvrant les frais de notaire reste fortement recommandé.",
                },
                {
                  question: "Les primo-accédants bénéficient-ils d'une réduction ?",
                  answer:
                    "Depuis avril 2025, les primo-accédants achetant leur résidence principale sont exemptés de la majoration de 0,5 point du taux départemental. Le taux applicable reste à 4,50 % au lieu de 5 % dans les départements concernés. Économie typique : ~1 500 € pour un bien à 300 000 €.",
                },
                {
                  question: "Que valent les débours dans les frais de notaire ?",
                  answer:
                    "Les débours et frais de formalités représentent en général 800 à 1 200 €, fixes pour la plupart : extrait cadastral, état hypothécaire, copie du titre, contributions de sécurité immobilière, frais d'enregistrement. Le calculateur applique une moyenne réaliste.",
                },
                {
                  question: "Le calculateur garde-t-il mes données ?",
                  answer:
                    "Non. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée saisie (prix, département, type) n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription.",
                },
              ]}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Ancien vs Neuf</h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li><strong className="text-[var(--foreground)]">Ancien</strong> : DMTO ~6,32% (dept. majoré) ou ~5,81% (dept. non majoré)</li>
                <li><strong className="text-[var(--foreground)]">Neuf / VEFA</strong> : TPF 0,715% seulement (TVA payée par le vendeur)</li>
                <li><strong className="text-[var(--foreground)]">Total ancien</strong> : ~8% du prix</li>
                <li><strong className="text-[var(--foreground)]">Total neuf</strong> : ~2-3% du prix</li>
              </ul>
            </div>
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Taux départemental</h3>
              <div className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">5,00%</strong> : majorité des départements (depuis avril 2025)</p>
                <p><strong className="text-[var(--foreground)]">4,50%</strong> : Hautes-Alpes, Alpes-Maritimes, Ardèche, Charente, Drôme, Lozère, Oise, Hautes-Pyrénées, Saône-et-Loire, Guadeloupe, Mayotte</p>
                <p><strong className="text-[var(--foreground)]">3,80%</strong> : Indre</p>
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
