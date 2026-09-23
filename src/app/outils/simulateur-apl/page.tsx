"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const PRESETS_LOYER = [
  { label: "Studio étudiant", value: 450 },
  { label: "T2 province", value: 650 },
  { label: "T2 Lyon/Bordeaux", value: 800 },
  { label: "T2 Paris", value: 1100 },
];

/* ==========================================================================
   PARAMETRES APL PAR ANNEE
   Sources : arrete du 5 septembre 2025, decret n2025-1401 du 28 dec 2025.
   Les parametres sont structures par annee pour faciliter la mise a jour.
   ========================================================================== */

type Zone = "1" | "2" | "3";
type TypeLogement = "location" | "colocation" | "foyer";
type Situation = "celibataire" | "couple";
type StatutEtudiant = "non" | "etudiant" | "boursier";

// Forfait de ressources des étudiants (art. R822-20 et suivants du CCH, réforme 2021) :
// la CAF retient le plus élevé des ressources réelles et du forfait. Montants 2026, non revalorisés.
const FORFAIT_ETUDIANT: Record<Exclude<StatutEtudiant, "non">, { location: number; foyer: number }> = {
  etudiant: { location: 8600, foyer: 6600 },
  boursier: { location: 6900, foyer: 5400 },
};

interface AplParams {
  label: string;
  // Plafonds de loyer mensuels : [personne seule, couple, 1 pers. a charge, par pers. a charge supp.]
  plafondLoyer: Record<Zone, [number, number, number, number]>;
  // Plafonds colocation (75% du plafond location, art. 16 arrete 27/09/2019)
  colocationRatio: number;
  // Plafonds foyer : montant unique par zone
  plafondFoyer: Record<Zone, number>;
  // Forfait charges : [isole ou couple sans pers. a charge, par personne a charge]
  forfaitCharges: [number, number];
  // Forfait charges colocation : [isole, couple, par personne a charge]
  forfaitChargesColocation: [number, number, number];
  // Forfait charges foyer (montant unique)
  forfaitChargesFoyer: number;
  // Participation minimale P0 = max(tauxP0 x (L + C), P0)
  P0: number;
  tauxP0: number;
  // Minoration forfaitaire de 5 euros
  abattement: number;
  // Seuil de non-versement (allocations de logement)
  seuilVersement: number;
  // R0 : plancher de ressources sous lequel l'APL est maximale
  // [seul, couple, 1 pers. a charge, 2, 3, 4, 5, 6, par pers. a charge supp.]
  R0: number[];
  // Taux famille TF selon la composition
  // [seul, couple, 1 pers. a charge, 2, 3, 4, 5, 6] puis reduction par pers. supp.
  TF: number[];
  TF_reduction_supp: number;
  // Loyer de reference LR selon la composition (= plafonds zone 2)
  // [seul, couple, 1 pers. a charge, par pers. a charge supp.]
  LR: [number, number, number, number];
  // Taux loyer TL : tranches de RL [0, 45%], [45%, 75%], [75%, +inf]
  // TL = somme des (taux * part de RL dans la tranche)
  TL_bornes: number[];
  TL_taux: number[];
}

const PARAMS: Record<number, AplParams> = {
  2025: {
    label: "Octobre 2025 - Septembre 2026",
    plafondLoyer: {
      "1": [333.14, 401.78, 454.10, 65.89],
      "2": [290.34, 355.38, 399.89, 58.21],
      "3": [272.12, 329.88, 369.88, 53.01],
    },
    colocationRatio: 0.75,
    plafondFoyer: {
      "1": 298.07,
      "2": 260.15,
      "3": 243.82,
    },
    forfaitCharges: [60.59, 13.74],
    forfaitChargesColocation: [30.29, 60.59, 13.74],
    forfaitChargesFoyer: 30.30,
    P0: 39.56,
    tauxP0: 0.085,
    abattement: 5,
    seuilVersement: 10,
    R0: [5235, 7501, 8947, 9148, 9498, 9851, 10202, 10554, 346],
    // TF (art. 14) : seul 2,83%, couple 3,15%, 1 pers. a charge 2,70%, 2 : 2,38%, 3 : 2,01%,
    // 4 : 1,85%, 5 : 1,79%, 6 : 1,73%, puis -0,06% par pers. a charge supp.
    TF: [0.0283, 0.0315, 0.0270, 0.0238, 0.0201, 0.0185, 0.0179, 0.0173],
    TF_reduction_supp: 0.0006,
    LR: [290.34, 355.38, 399.89, 58.21],
    TL_bornes: [0, 0.45, 0.75],
    TL_taux: [0, 0.0045, 0.0068],
  },
};

// Annee de parametres par defaut : la plus recente
function getDefaultParamYear(): number {
  const years = Object.keys(PARAMS).map(Number).sort((a, b) => b - a);
  return years[0];
}

/* ==========================================================================
   FONCTIONS DE CALCUL
   ========================================================================== */

function getPlafondLoyer(
  params: AplParams,
  zone: Zone,
  situation: Situation,
  nbEnfants: number,
  typeLogement: TypeLogement
): number {
  if (typeLogement === "foyer") {
    return params.plafondFoyer[zone];
  }

  const z = params.plafondLoyer[zone];
  let plafond: number;

  if (nbEnfants >= 1) {
    // Seul ou couple avec personnes a charge : base 1 pers. a charge + supp par pers. au-dela
    plafond = z[2] + Math.max(0, nbEnfants - 1) * z[3];
  } else if (situation === "couple") {
    plafond = z[1]; // couple sans personne a charge
  } else {
    plafond = z[0]; // personne seule
  }

  if (typeLogement === "colocation") {
    plafond = plafond * params.colocationRatio;
  }

  return plafond;
}

function getForfaitCharges(
  params: AplParams,
  situation: Situation,
  nbEnfants: number,
  typeLogement: TypeLogement
): number {
  if (typeLogement === "foyer") {
    return params.forfaitChargesFoyer;
  }
  if (typeLogement === "colocation") {
    const [seul, couple, supp] = params.forfaitChargesColocation;
    if (nbEnfants >= 1) return couple + nbEnfants * supp;
    return situation === "couple" ? couple : seul;
  }
  // Forfait majore par personne a charge (pas pour le conjoint)
  return params.forfaitCharges[0] + Math.max(0, nbEnfants) * params.forfaitCharges[1];
}

function getR0(params: AplParams, situation: Situation, nbEnfants: number): number {
  // R0 array: 0 = seul, 1 = couple, 2..7 = 1 a 6 pers. a charge, 8 = supp par pers. a charge
  if (nbEnfants === 0) {
    return situation === "couple" ? params.R0[1] : params.R0[0];
  }
  if (nbEnfants <= 6) {
    return params.R0[nbEnfants + 1];
  }
  return params.R0[7] + (nbEnfants - 6) * params.R0[8];
}

function getTF(params: AplParams, situation: Situation, nbEnfants: number): number {
  if (nbEnfants === 0) {
    return situation === "couple" ? params.TF[1] : params.TF[0];
  }
  if (nbEnfants <= 6) {
    return params.TF[nbEnfants + 1];
  }
  return Math.max(0, params.TF[7] - (nbEnfants - 6) * params.TF_reduction_supp);
}

function getLoyerReference(params: AplParams, situation: Situation, nbEnfants: number): number {
  const lr = params.LR;
  if (nbEnfants >= 1) return lr[2] + (nbEnfants - 1) * lr[3];
  return situation === "couple" ? lr[1] : lr[0];
}

function calculerTL(params: AplParams, RL: number): number {
  // TL est calcule par tranches progressives de RL
  // Tranche 1: 0 a 45% -> taux 0%
  // Tranche 2: 45% a 75% -> taux 0.45%
  // Tranche 3: au-dela de 75% -> taux 0.68%
  const bornes = params.TL_bornes;
  const taux = params.TL_taux;
  let tl = 0;

  for (let i = 0; i < taux.length; i++) {
    const min = bornes[i];
    const max = i < bornes.length - 1 ? bornes[i + 1] : Infinity;
    if (RL <= min) break;
    const part = Math.min(RL, max) - min;
    tl += part * taux[i];
  }

  return tl;
}

interface AplResult {
  montantAPL: number;
  loyerRetenu: number;
  plafondLoyer: number;
  forfaitCharges: number;
  participationPersonnelle: number;
  P0: number;
  TP: number;
  TF: number;
  TL: number;
  RL: number;
  RP: number;
  R0: number;
  loyerReference: number;
  eligible: boolean;
  details: string[];
}

function calculerAPL(
  loyer: number,
  zone: Zone,
  situation: Situation,
  nbEnfants: number,
  typeLogement: TypeLogement,
  ressourcesAnnuelles: number,
  params: AplParams
): AplResult {
  const details: string[] = [];

  // 1. Plafond de loyer
  const plafond = getPlafondLoyer(params, zone, situation, nbEnfants, typeLogement);
  const loyerRetenu = Math.min(loyer, plafond);
  details.push(`Loyer retenu : min(${loyer.toFixed(2)}, ${plafond.toFixed(2)}) = ${loyerRetenu.toFixed(2)} euros`);

  // 2. Forfait charges
  const charges = getForfaitCharges(params, situation, nbEnfants, typeLogement);
  details.push(`Forfait charges : ${charges.toFixed(2)} euros`);

  // 3. Loyer de reference et RL
  const LR = getLoyerReference(params, situation, nbEnfants);
  const RL = LR > 0 ? loyerRetenu / LR : 0;
  details.push(`Loyer de référence (LR) : ${LR.toFixed(2)} euros`);
  details.push(`Rapport RL = loyer retenu / LR = ${RL.toFixed(4)}`);

  // 4. Taux TF et TL
  const tf = getTF(params, situation, nbEnfants);
  const tl = calculerTL(params, RL);
  const tp = tf + tl;
  details.push(`TF (taux famille) : ${(tf * 100).toFixed(3)}%`);
  details.push(`TL (taux loyer) : ${(tl * 100).toFixed(3)}%`);
  details.push(`TP = TF + TL = ${(tp * 100).toFixed(3)}%`);

  // 5. R0 et RP (ressources arrondies a la centaine d'euros superieure, art. D823-17 CCH)
  const r0 = getR0(params, situation, nbEnfants);
  const ressourcesArrondies = Math.ceil(Math.max(0, ressourcesAnnuelles) / 100) * 100;
  const rp = Math.max(0, ressourcesArrondies - r0);
  details.push(`R0 (plancher ressources) : ${r0.toLocaleString("fr-FR")} euros/an`);
  details.push(`RP = max(0, ${ressourcesArrondies.toLocaleString("fr-FR")} - ${r0.toLocaleString("fr-FR")}) = ${rp.toLocaleString("fr-FR")} euros`);

  // 6. Participation personnelle PP = P0 + TP x RP (RP annuel, PP mensuelle)
  // P0 = max(8,5% x (L + C), 39,56 euros)
  const p0 = Math.max(params.tauxP0 * (loyerRetenu + charges), params.P0);
  const pp = p0 + tp * rp;
  const participationPersonnelle = pp;
  details.push(`P0 = max(8,5% x (L + C), ${params.P0.toFixed(2)}) = ${p0.toFixed(2)} euros`);
  details.push(`PP = P0 + TP x RP = ${p0.toFixed(2)} + ${(tp * 100).toFixed(3)}% x ${rp.toLocaleString("fr-FR")} = ${pp.toFixed(2)} euros`);

  // 7. Montant APL = L + C - PP - abattement
  const aplBrut = loyerRetenu + charges - participationPersonnelle - params.abattement;
  const montantAPL = Math.max(0, Math.round(aplBrut * 100) / 100);
  details.push(`APL = ${loyerRetenu.toFixed(2)} + ${charges.toFixed(2)} - ${participationPersonnelle.toFixed(2)} - ${params.abattement.toFixed(2)} = ${aplBrut.toFixed(2)} euros`);

  // Seuil de versement : aide non versee si < 10 euros
  const eligible = montantAPL >= params.seuilVersement;
  if (!eligible && montantAPL > 0) {
    details.push(`Montant inférieur à ${params.seuilVersement} euros : l'aide n'est pas versée.`);
  }

  return {
    montantAPL: eligible ? montantAPL : 0,
    loyerRetenu,
    plafondLoyer: plafond,
    forfaitCharges: charges,
    participationPersonnelle,
    P0: p0,
    TP: tp,
    TF: tf,
    TL: tl,
    RL,
    RP: rp,
    R0: r0,
    loyerReference: LR,
    eligible,
    details,
  };
}

/* ==========================================================================
   COMPOSANT PRINCIPAL
   ========================================================================== */

export default function SimulateurAPL() {
  const [loyer, setLoyer] = useState("500");
  const [zone, setZone] = useState<Zone>("2");
  const [situation, setSituation] = useState<Situation>("celibataire");
  const [nbEnfants, setNbEnfants] = useState("0");
  const [typeLogement, setTypeLogement] = useState<TypeLogement>("location");
  const [ressources, setRessources] = useState("8000");
  const [statutEtudiant, setStatutEtudiant] = useState<StatutEtudiant>("non");
  const [showDetails, setShowDetails] = useState(false);

  const paramYear = getDefaultParamYear();
  const params = PARAMS[paramYear];

  const result = useMemo(() => {
    const loyerNum = parseFloat(loyer) || 0;
    const enfantsNum = parseInt(nbEnfants) || 0;
    const ressourcesSaisies = parseFloat(ressources) || 0;
    const forfait =
      statutEtudiant === "non"
        ? 0
        : FORFAIT_ETUDIANT[statutEtudiant][typeLogement === "foyer" ? "foyer" : "location"];
    const ressourcesNum = Math.max(ressourcesSaisies, forfait);
    return calculerAPL(loyerNum, zone, situation, enfantsNum, typeLogement, ressourcesNum, params);
  }, [loyer, zone, situation, nbEnfants, typeLogement, ressources, statutEtudiant, params]);

  const forfaitEtudiant =
    statutEtudiant === "non"
      ? 0
      : FORFAIT_ETUDIANT[statutEtudiant][typeLogement === "foyer" ? "foyer" : "location"];

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const loyerNum = parseFloat(loyer) || 0;
  const resteACharge = Math.max(0, loyerNum - result.montantAPL);

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Logement
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simulateur <span style={{ color: "var(--primary)" }}>APL</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Estimez votre aide personnalisée au logement selon les barèmes officiels {paramYear}-{paramYear + 1}. Calcul instantané et détaillé.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Formulaire */}
            <div
              className="animate-fade-up stagger-3 rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="space-y-4">
                {/* Loyer */}
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Loyer mensuel (hors charges)
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      min="0"
                      value={loyer}
                      onChange={(e) => setLoyer(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    />
                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg"
                      style={{ color: "var(--muted)" }}
                    >
                      &euro;/mois
                    </span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={1500}
                    step={25}
                    value={Math.min(Math.max(parseFloat(loyer) || 0, 200), 1500)}
                    onChange={(e) => setLoyer(e.target.value)}
                    className="mt-3 w-full accent-[#0d4f3c]"
                    aria-label="Curseur loyer mensuel"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRESETS_LOYER.map((p) => {
                      const isActive = parseFloat(loyer) === p.value;
                      return (
                        <button
                          key={p.label}
                          onClick={() => setLoyer(String(p.value))}
                          className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                          style={{
                            borderColor: isActive ? "var(--primary)" : "var(--border)",
                            color: isActive ? "var(--primary)" : "var(--muted)",
                            background: isActive ? "rgba(13,79,60,0.06)" : "transparent",
                          }}
                        >
                          {p.label}{" "}
                          <span style={{ color: isActive ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                            {p.value} &euro;
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Zone + type logement */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Zone géographique
                    </label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value as Zone)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <option value="1">Zone 1 - Île-de-France</option>
                      <option value="2">Zone 2 - Grandes villes</option>
                      <option value="3">Zone 3 - Reste de la France</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Type de logement
                    </label>
                    <select
                      value={typeLogement}
                      onChange={(e) => setTypeLogement(e.target.value as TypeLogement)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <option value="location">Location classique</option>
                      <option value="colocation">Colocation</option>
                      <option value="foyer">Foyer / Résidence</option>
                    </select>
                  </div>
                </div>

                {/* Situation + enfants */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Situation
                    </label>
                    <select
                      value={situation}
                      onChange={(e) => setSituation(e.target.value as Situation)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <option value="celibataire">Célibataire</option>
                      <option value="couple">Couple</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Nombre d&apos;enfants à charge
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={nbEnfants}
                      onChange={(e) => setNbEnfants(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                </div>

                {/* Ressources */}
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Ressources annuelles du foyer (12 derniers mois)
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      min="0"
                      value={ressources}
                      onChange={(e) => setRessources(e.target.value)}
                      className="w-full rounded-xl border px-4 py-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      &euro;/an
                    </span>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    Salaires, allocations chômage, pensions, revenus du patrimoine...
                  </p>
                </div>

                {/* Statut étudiant */}
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Étudiant ?
                  </label>
                  <select
                    value={statutEtudiant}
                    onChange={(e) => setStatutEtudiant(e.target.value as StatutEtudiant)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="non">Non</option>
                    <option value="etudiant">Oui, non boursier</option>
                    <option value="boursier">Oui, boursier</option>
                  </select>
                  {forfaitEtudiant > 0 && (
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      Forfait étudiant : la CAF retient au moins {forfaitEtudiant.toLocaleString("fr-FR")} €/an de ressources
                      {typeLogement === "foyer" ? " (résidence ou foyer)" : ""}, même si vous gagnez moins.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Resultat principal */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox
                label="APL estimée"
                value={result.montantAPL > 0 ? `${fmt(result.montantAPL)} \u20AC` : "0 \u20AC"}
                primary
              />
              <StatBox label="Reste à charge" value={`${fmt(resteACharge)} \u20AC`} />
              <StatBox
                label="Loyer retenu"
                value={`${fmt(result.loyerRetenu)} \u20AC`}
              />
              <StatBox
                label="Plafond zone"
                value={`${fmt(result.plafondLoyer)} \u20AC`}
                accent
              />
            </div>

            {/* Grand encart resultat */}
            <div
              className="rounded-2xl border p-6 text-center"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                Estimation mensuelle APL
              </p>
              <p
                className="mt-2 text-4xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
              >
                {result.montantAPL > 0 ? `${fmt(result.montantAPL)} \u20AC/mois` : "Pas d\u0027APL"}
              </p>
              <p className="mt-1 text-lg" style={{ color: "var(--muted)" }}>
                {result.montantAPL > 0
                  ? `soit ${fmt(result.montantAPL * 12)} \u20AC/an`
                  : result.eligible
                  ? ""
                  : "Montant trop faible pour être versé (seuil : 10 \u20AC)"}
              </p>
              {result.montantAPL > 0 && (
                <div className="mt-4 flex items-center justify-center gap-8">
                  <div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>Loyer</p>
                    <p className="text-lg font-semibold">{fmt(loyerNum)} &euro;</p>
                  </div>
                  <div className="text-2xl" style={{ color: "var(--primary)" }}>&minus;</div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>APL</p>
                    <p className="text-lg font-semibold" style={{ color: "var(--primary)" }}>
                      {fmt(result.montantAPL)} &euro;
                    </p>
                  </div>
                  <div className="text-2xl" style={{ color: "var(--accent)" }}>=</div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>Reste à charge</p>
                    <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
                      {fmt(resteACharge)} &euro;
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Visualisation Donut + cartes contextuelles */}
            {result.montantAPL > 0 && loyerNum > 0 && (
              <div
                className="rounded-2xl border p-6"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--accent)" }}
                >
                  Répartition du loyer
                </h2>
                <div className="mt-4 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                  <div className="flex justify-center">
                    <DonutChart
                      apl={result.montantAPL}
                      reste={resteACharge}
                      loyer={loyerNum}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        APL mensuelle
                      </p>
                      <p
                        className="mt-1 text-3xl font-bold"
                        style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
                      >
                        {fmt(result.montantAPL)} &euro;
                      </p>
                      <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                        soit {fmt(result.montantAPL * 12)} &euro;/an versés par la CAF.
                      </p>
                    </div>
                    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                        Loyer net après APL
                      </p>
                      <p
                        className="mt-1 text-3xl font-bold"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: resteACharge / loyerNum < 0.5 ? "var(--primary)" : "var(--accent)",
                        }}
                      >
                        {fmt(resteACharge)} &euro;
                      </p>
                      <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                        {((result.montantAPL / loyerNum) * 100).toFixed(0)}% du loyer pris en charge par l&apos;APL.
                        {resteACharge / loyerNum < 0.5 && " Très bonne couverture."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cross-link CTAs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Vous pourriez aussi vouloir
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CrossLinkCard
                  href="/outils/simulateur-prime-activite"
                  emoji="💰"
                  title="Prime activité"
                  desc="Estimer votre complément de revenu"
                />
                <CrossLinkCard
                  href="/outils/calculateur-salaire"
                  emoji="💼"
                  title="Salaire net"
                  desc="Brut, net, impôt après PAS"
                />
                <CrossLinkCard
                  href="/outils/simulateur-allocation-chomage"
                  emoji="📊"
                  title="Allocation chômage"
                  desc="ARE selon France Travail"
                />
              </div>
            </div>

            {/* Detail du calcul */}
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex w-full items-center justify-between text-left"
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--accent)" }}
                >
                  Détail du calcul
                </h2>
                <span
                  className="text-sm transition-transform duration-200"
                  style={{
                    color: "var(--muted)",
                    transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  &#9660;
                </span>
              </button>
              {showDetails && (
                <div className="mt-4 space-y-4">
                  {/* Tableau parametres */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ color: "var(--muted)" }}>
                          <th className="pb-3 text-left font-medium">Paramètre</th>
                          <th className="pb-3 text-right font-medium">Valeur</th>
                        </tr>
                      </thead>
                      <tbody>
                        <ParamRow label="Loyer saisi" value={`${fmt(loyerNum)} \u20AC`} />
                        <ParamRow label="Plafond de loyer (zone)" value={`${fmt(result.plafondLoyer)} \u20AC`} />
                        <ParamRow label="Loyer retenu (L)" value={`${fmt(result.loyerRetenu)} \u20AC`} highlight />
                        <ParamRow label="Forfait charges (C)" value={`${fmt(result.forfaitCharges)} \u20AC`} />
                        <ParamRow label="Loyer de référence (LR)" value={`${fmt(result.loyerReference)} \u20AC`} />
                        <ParamRow label="Rapport RL = L / LR" value={result.RL.toFixed(4)} />
                        <ParamRow label="TF (taux famille)" value={`${(result.TF * 100).toFixed(3)}%`} />
                        <ParamRow label="TL (taux loyer)" value={`${(result.TL * 100).toFixed(3)}%`} />
                        <ParamRow label="TP = TF + TL" value={`${(result.TP * 100).toFixed(3)}%`} highlight />
                        <ParamRow label="R0 (plancher ressources)" value={`${result.R0.toLocaleString("fr-FR")} \u20AC/an`} />
                        <ParamRow label="RP = ressources - R0" value={`${result.RP.toLocaleString("fr-FR")} \u20AC/an`} />
                        <ParamRow label="P0 (participation min.)" value={`${fmt(result.P0)} \u20AC`} />
                        <ParamRow label="Participation personnelle" value={`${fmt(result.participationPersonnelle)} \u20AC`} highlight />
                        <ParamRow label="Abattement" value={`${fmt(params.abattement)} \u20AC`} />
                      </tbody>
                    </table>
                  </div>

                  {/* Formule */}
                  <div
                    className="rounded-xl p-4 text-sm"
                    style={{ background: "var(--surface-alt)" }}
                  >
                    <p className="font-semibold">Formule :</p>
                    <p className="mt-1 font-mono text-xs" style={{ color: "var(--muted)" }}>
                      APL = L + C - PP - {params.abattement}
                    </p>
                    <p className="mt-1 font-mono text-xs" style={{ color: "var(--muted)" }}>
                      APL = {fmt(result.loyerRetenu)} + {fmt(result.forfaitCharges)} - {fmt(result.participationPersonnelle)} - {fmt(params.abattement)}
                    </p>
                    <p
                      className="mt-1 font-mono text-sm font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      = {fmt(result.montantAPL)} &euro;/mois
                    </p>
                  </div>

                  {/* Etapes detaillees */}
                  <div className="space-y-1">
                    {result.details.map((d, i) => (
                      <p key={i} className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                        {i + 1}. {d}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tableau plafonds par zone */}
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Plafonds de loyer {paramYear}-{paramYear + 1}
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="pb-3 text-left font-medium">Composition</th>
                      <th className="pb-3 text-right font-medium">Zone 1</th>
                      <th className="pb-3 text-right font-medium">Zone 2</th>
                      <th className="pb-3 text-right font-medium">Zone 3</th>
                    </tr>
                  </thead>
                  <tbody>
                    <PlafondRow label="Personne seule" z1={params.plafondLoyer["1"][0]} z2={params.plafondLoyer["2"][0]} z3={params.plafondLoyer["3"][0]} />
                    <PlafondRow label="Couple" z1={params.plafondLoyer["1"][1]} z2={params.plafondLoyer["2"][1]} z3={params.plafondLoyer["3"][1]} />
                    <PlafondRow label="+ 1 enfant" z1={params.plafondLoyer["1"][2]} z2={params.plafondLoyer["2"][2]} z3={params.plafondLoyer["3"][2]} />
                    <PlafondRow label="Par pers. supp." z1={params.plafondLoyer["1"][3]} z2={params.plafondLoyer["2"][3]} z3={params.plafondLoyer["3"][3]} />
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notice */}
            <div
              className="rounded-2xl border p-4 text-center text-xs"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)", color: "var(--muted)" }}
            >
              <p>
                <strong style={{ color: "var(--foreground)" }}>Estimation indicative.</strong>{" "}
                Le calcul officiel est réalisé par la CAF et peut différer selon votre situation précise (patrimoine, abattements spécifiques, statut étudiant, etc.).
                Consultez{" "}
                <a
                  href="https://www.caf.fr/allocataires/mes-services-en-ligne/faire-une-simulation"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--primary)", textDecoration: "underline" }}
                >
                  le simulateur officiel de la CAF
                </a>{" "}
                pour un résultat définitif.
              </p>
            </div>

            <ToolHowToSection
              title="Comment estimer votre APL en 4 étapes"
              description="Le simulateur applique la formule officielle CAF avec paramètres revalorisés au 1er octobre 2025 (arrêté du 5 septembre 2025, +1,04%) et R0 gelé pour 2026 (décret n2025-1401)."
              steps={[
                {
                  name: "Identifier votre zone géographique",
                  text:
                    "Zone 1 : Île-de-France. Zone 2 : agglomérations de plus de 100 000 habitants, Corse, DOM. Zone 3 : reste du territoire (zones rurales et petites villes). Vous pouvez vérifier votre zone exacte avec votre code postal sur le site de la CAF.",
                },
                {
                  name: "Saisir le loyer hors charges",
                  text:
                    "Indiquez votre loyer mensuel HORS charges. Si votre bail mentionne un loyer global, déduisez les charges locatives (eau, ordures, ascenseur, chauffage collectif). Le loyer retenu pour l'APL est plafonné : tout dépassement du plafond ne génère pas d'APL supplémentaire.",
                },
                {
                  name: "Renseigner la composition du foyer",
                  text:
                    "Personne seule, couple, présence d'enfants ou de personnes à charge. Le forfait charges (C) augmente avec le nombre de personnes à charge. Pour une personne seule ou un couple sans enfant, le forfait charges est de 60,59 € ; pour un couple avec 2 enfants, 88,07 €.",
                },
                {
                  name: "Indiquer vos ressources annuelles",
                  text:
                    "La CAF retient les ressources des 12 derniers mois glissants : salaires, allocations chômage, pensions, revenus du patrimoine. Un plancher R0 est appliqué : si vos ressources sont en dessous, vous percevez l'APL maximale. R0 varie selon la composition du foyer.",
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
                La formule de calcul de l&apos;APL
              </h2>
              <div className="mt-4 space-y-3 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  L&apos;aide personnalisée au logement (APL) est calculée selon la formule :{" "}
                  <strong>APL = L + C - PP - 5 €</strong>, où L est le loyer retenu dans la
                  limite d&apos;un plafond, C le forfait charges et PP votre participation
                  personnelle.
                </p>
                <p>
                  <strong>La participation personnelle</strong> dépend de vos ressources et de la
                  taille de votre foyer. Elle est calculée avec la formule PP = P0 + TP x RP, où P0
                  est un minimum incompressible (8,5% de L + C, au moins {fmt(params.P0)} €), TP un taux progressif et RP
                  vos ressources au-delà du plancher R0.
                </p>
                <p>
                  <strong>Les zones géographiques</strong> : la zone 1 correspond à
                  l&apos;Île-de-France, la zone 2 aux agglomérations de plus de 100 000 habitants et
                  à la Corse, la zone 3 au reste du territoire.
                </p>
                <p>
                  <strong>Les ressources</strong> prises en compte sont celles des 12 derniers mois
                  glissants : salaires, allocations chômage, pensions, revenus du patrimoine. Un
                  plancher R0 est appliqué : en dessous de ce seuil, vous percevez l&apos;APL
                  maximale.
                </p>
                <p>
                  <strong>Source.</strong> Arrêté du 5 septembre 2025, décret n2025-1401 du
                  28 décembre 2025. Réglementation : articles L823-1 et suivants du Code de la
                  construction et de l&apos;habitation.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posées sur l'APL et l'aide au logement en France."
              items={[
                {
                  question: "Qui peut bénéficier de l'APL en 2026 ?",
                  answer:
                    "L'APL est versée aux locataires (logement conventionné) ou accédants (prêt conventionné, prêt à l'accession sociale). Conditions : être Français ou en séjour régulier, occuper le logement comme résidence principale au moins 8 mois par an, avoir des ressources sous certains plafonds. Étudiants, salariés, retraites, demandeurs d'emploi sont éligibles.",
                },
                {
                  question: "Comment faire une demande d'APL ?",
                  answer:
                    "La demande se fait en ligne sur caf.fr (créer son espace si vous n'êtes pas allocataire). Documents nécessaires : bail signé ou attestation de loyer du propriétaire, RIB, justificatif d'identité. Le versement débute le mois suivant celui de la demande. Pas de rétroactivité : faites la demande dès l'entrée dans les lieux.",
                },
                {
                  question: "Quelle différence entre APL, ALF et ALS ?",
                  answer:
                    "L'APL concerne les logements conventionnés (HLM, accession sociale, certains parcs privés). L'ALF (Allocation de Logement Familiale) concerne les familles avec enfants ou jeunes mariés dans logements non conventionnés. L'ALS (Allocation de Logement Sociale) concerne les autres cas (étudiants, isolés). Le calculateur estime principalement l'APL : pour une situation précise, le simulateur officiel CAF est définitif.",
                },
                {
                  question: "L'APL est-elle compatible avec d'autres aides ?",
                  answer:
                    "L'APL n'est pas cumulable avec l'ALF ou l'ALS pour le même logement (une seule aide à la fois selon votre situation). Elle est compatible avec le RSA, la prime d'activité, les bourses étudiantes. En revanche, percevoir l'APL exclut une dépendance fiscale à un parent imposable (rattachement fiscal).",
                },
                {
                  question: "L'APL est-elle calculée sur les revenus N-2 ou les revenus actuels ?",
                  answer:
                    "Depuis janvier 2021, l'APL est calculée sur les revenus des 12 derniers mois glissants (et non plus N-2 comme avant). Cette réforme appelée 'APL contemporaine' permet une adaptation rapide aux variations de ressources. La CAF révise vos droits chaque trimestre.",
                },
                {
                  question: "Est-ce qu'un propriétaire peut bénéficier de l'APL ?",
                  answer:
                    "Oui, dans le cadre d'une accession à la propriété avec un Prêt Conventionné (PC) ou un Prêt à l'Accession Sociale (PAS). Cette aide est appelée 'APL accession'. Conditions : achat de la résidence principale, prêt signé avant 2018 pour le neuf ou avant 2020 pour l'ancien (la mesure ayant été supprimée depuis pour le neuf et l'ancien standard).",
                },
                {
                  question: "Le simulateur garde-t-il mes données ?",
                  answer:
                    "Non. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée saisie (loyer, ressources, composition du foyer) n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription.",
                },
              ]}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Plancher R0 ({paramYear})
              </h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>
                  Personne seule :{" "}
                  <strong className="text-[var(--foreground)]">
                    {params.R0[0].toLocaleString("fr-FR")} &euro;
                  </strong>
                </li>
                <li>
                  Couple :{" "}
                  <strong className="text-[var(--foreground)]">
                    {params.R0[1].toLocaleString("fr-FR")} &euro;
                  </strong>
                </li>
                <li>
                  + 1 enfant :{" "}
                  <strong className="text-[var(--foreground)]">
                    {params.R0[2].toLocaleString("fr-FR")} &euro;
                  </strong>
                </li>
                <li>
                  + 2 enfants :{" "}
                  <strong className="text-[var(--foreground)]">
                    {params.R0[3].toLocaleString("fr-FR")} &euro;
                  </strong>
                </li>
              </ul>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Si vos ressources sont inférieures au R0, vous percevez l&apos;APL maximale.
              </p>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Zones APL
              </h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>
                  <strong className="text-[var(--foreground)]">Zone 1</strong> : Île-de-France
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Zone 2</strong> : Agglo. &gt; 100 000 hab., Corse, DOM
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">Zone 3</strong> : Reste du territoire
                </li>
              </ul>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Bon à savoir
              </h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>L&apos;aide au logement n&apos;est pas versée si le montant est inférieur à <strong className="text-[var(--foreground)]">10 &euro;/mois</strong>.</li>
                <li>La CAF révise vos droits <strong className="text-[var(--foreground)]">tous les trimestres</strong>.</li>
                <li>Un abattement de <strong className="text-[var(--foreground)]">5 &euro;</strong> est systématiquement appliqué.</li>
                <li>La participation minimale est de <strong className="text-[var(--foreground)]">8,5% du loyer retenu + charges</strong>, avec un minimum de {fmt(params.P0)} &euro;.</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

/* ==========================================================================
   SOUS-COMPOSANTS
   ========================================================================== */

function StatBox({
  label,
  value,
  primary,
  accent,
}: {
  label: string;
  value: string;
  primary?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-4 text-center"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-lg font-bold"
        style={{
          fontFamily: "var(--font-display)",
          color: primary ? "var(--primary)" : accent ? "var(--accent)" : "var(--foreground)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function ParamRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
      <td className="py-2" style={{ color: highlight ? "var(--foreground)" : "var(--muted)" }}>
        {highlight ? <strong>{label}</strong> : label}
      </td>
      <td
        className="py-2 text-right font-semibold"
        style={{ color: highlight ? "var(--primary)" : "var(--foreground)" }}
      >
        {value}
      </td>
    </tr>
  );
}

function PlafondRow({
  label,
  z1,
  z2,
  z3,
}: {
  label: string;
  z1: number;
  z2: number;
  z3: number;
}) {
  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
      <td className="py-2">{label}</td>
      <td className="py-2 text-right font-semibold">{fmt(z1)} &euro;</td>
      <td className="py-2 text-right font-semibold">{fmt(z2)} &euro;</td>
      <td className="py-2 text-right font-semibold">{fmt(z3)} &euro;</td>
    </tr>
  );
}

function DonutChart({
  apl,
  reste,
  loyer,
}: {
  apl: number;
  reste: number;
  loyer: number;
}) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const stroke = 22;
  const total = loyer > 0 ? loyer : 1;
  const aplPct = Math.max(0, Math.min(apl, loyer)) / total;
  const restePct = Math.max(0, reste) / total;
  const aplLen = aplPct * c;
  const resteLen = restePct * c;
  const couverturePct = Math.round(aplPct * 100);
  return (
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Répartition APL et reste à charge">
      <circle cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <g transform="rotate(-90)">
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#0d4f3c"
          strokeWidth={stroke}
          strokeDasharray={`${aplLen} ${c}`}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#dc2626"
          strokeWidth={stroke}
          strokeDasharray={`${resteLen} ${c}`}
          strokeDashoffset={-aplLen}
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
        Couverture APL
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
        {couverturePct}%
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
