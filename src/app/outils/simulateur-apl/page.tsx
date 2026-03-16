"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

/* ==========================================================================
   PARAMETRES APL PAR ANNEE
   Sources : arrete du 5 septembre 2025, decret n2025-1401 du 28 dec 2025.
   Les parametres sont structures par annee pour faciliter la mise a jour.
   ========================================================================== */

type Zone = "1" | "2" | "3";
type TypeLogement = "location" | "colocation" | "foyer";
type Situation = "celibataire" | "couple";

interface AplParams {
  label: string;
  // Plafonds de loyer mensuels : [personne seule, couple, +1 enfant, par pers. supp.]
  plafondLoyer: Record<Zone, [number, number, number, number]>;
  // Plafonds colocation (60% du plafond location)
  colocationRatio: number;
  // Plafonds foyer : montant unique par zone
  plafondFoyer: Record<Zone, number>;
  // Forfait charges : [isolé/couple sans enfant, par personne supplementaire]
  forfaitCharges: [number, number];
  // Forfait charges foyer (montant unique)
  forfaitChargesFoyer: number;
  // Participation minimale P0
  P0: number;
  // Abattement forfaitaire de 5 euros
  abattement: number;
  // R0 : plancher de ressources sous lequel l'APL est maximale
  // [seul, couple, +1enf, +2enf, +3enf, +4enf, +5enf, +6enf, par pers. supp.]
  R0: number[];
  // Taux de participation TF selon le nombre de personnes au foyer
  // index 0 = 1 pers, 1 = 2 pers, 2 = 3 pers, etc.
  TF: number[];
  // Loyer de reference LR par zone
  LR: Record<Zone, number>;
  // Coefficients pour TL (taux loyer) : tranches de RL
  // TL = somme des (taux * min(part dans la tranche, largeur tranche))
  // Tranches de RL : [0, 0.45], [0.45, 0.75], [0.75, +inf]
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
    colocationRatio: 0.6,
    plafondFoyer: {
      "1": 298.07,
      "2": 260.15,
      "3": 243.82,
    },
    forfaitCharges: [60.59, 13.74],
    forfaitChargesFoyer: 30.30,
    P0: 39.56,
    abattement: 5,
    R0: [5235, 7501, 8947, 9148, 9498, 9851, 10202, 10554, 346],
    // TF en % (exprime en decimal) : 1 pers = 2.83%, 2 = 3.15%, 3 = 2.70%, 4+ = 2.50%, 5+ = 2.29%, 6+ = 2.06%
    TF: [0.0283, 0.0315, 0.0270, 0.0250, 0.0229, 0.0206],
    LR: {
      "1": 268.86,
      "2": 233.07,
      "3": 217.38,
    },
    TL_bornes: [0, 0.45, 0.75],
    TL_taux: [0.0045, 0.0068, 0.0098],
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

function getNbPersonnes(situation: Situation, nbEnfants: number): number {
  return (situation === "couple" ? 2 : 1) + nbEnfants;
}

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

  if (situation === "celibataire" && nbEnfants === 0) {
    plafond = z[0]; // personne seule
  } else if (situation === "couple" && nbEnfants === 0) {
    plafond = z[1]; // couple sans enfant
  } else if (nbEnfants >= 1) {
    // Couple ou seul + enfants : base = plafond 3e colonne + supp par enfant au-dela de 1
    plafond = z[2] + Math.max(0, nbEnfants - 1) * z[3];
  } else {
    plafond = z[0];
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
  const nbPersonnes = getNbPersonnes(situation, nbEnfants);
  return params.forfaitCharges[0] + Math.max(0, nbPersonnes - 1) * params.forfaitCharges[1];
}

function getR0(params: AplParams, situation: Situation, nbEnfants: number): number {
  const nbPersonnes = getNbPersonnes(situation, nbEnfants);
  // R0 array: index 0 = 1 pers, 1 = 2 pers, ..., 7 = 8 pers, 8 = supp par pers
  if (nbPersonnes <= 8) {
    return params.R0[nbPersonnes - 1];
  }
  return params.R0[7] + (nbPersonnes - 8) * params.R0[8];
}

function getTF(params: AplParams, situation: Situation, nbEnfants: number): number {
  const nbPersonnes = getNbPersonnes(situation, nbEnfants);
  const idx = Math.min(nbPersonnes - 1, params.TF.length - 1);
  return params.TF[idx];
}

function calculerTL(params: AplParams, RL: number): number {
  // TL est calcule par tranches progressives de RL
  // Tranche 1: 0 a 0.45 -> taux 0.45%
  // Tranche 2: 0.45 a 0.75 -> taux 0.68%
  // Tranche 3: au-dela de 0.75 -> taux 0.98%
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
  const LR = params.LR[zone];
  const RL = LR > 0 ? loyerRetenu / LR : 0;
  details.push(`Loyer de reference (LR) : ${LR.toFixed(2)} euros`);
  details.push(`Rapport RL = loyer retenu / LR = ${RL.toFixed(4)}`);

  // 4. Taux TF et TL
  const tf = getTF(params, situation, nbEnfants);
  const tl = calculerTL(params, RL);
  const tp = tf + tl;
  details.push(`TF (taux famille) : ${(tf * 100).toFixed(3)}%`);
  details.push(`TL (taux loyer) : ${(tl * 100).toFixed(3)}%`);
  details.push(`TP = TF + TL = ${(tp * 100).toFixed(3)}%`);

  // 5. R0 et RP
  const r0 = getR0(params, situation, nbEnfants);
  const rp = Math.max(0, ressourcesAnnuelles - r0);
  details.push(`R0 (plancher ressources) : ${r0.toLocaleString("fr-FR")} euros/an`);
  details.push(`RP = max(0, ${ressourcesAnnuelles.toLocaleString("fr-FR")} - ${r0.toLocaleString("fr-FR")}) = ${rp.toLocaleString("fr-FR")} euros`);

  // 6. Participation personnelle PP = max(P0, P0 + TP * RP)
  const pp = params.P0 + tp * (rp / 12);
  const participationPersonnelle = Math.max(params.P0, pp);
  details.push(`PP = P0 + TP x (RP/12) = ${params.P0.toFixed(2)} + ${(tp * 100).toFixed(3)}% x ${(rp / 12).toFixed(2)} = ${pp.toFixed(2)} euros`);

  // 7. Montant APL = L + C - PP - abattement
  const aplBrut = loyerRetenu + charges - participationPersonnelle - params.abattement;
  const montantAPL = Math.max(0, Math.round(aplBrut * 100) / 100);
  details.push(`APL = ${loyerRetenu.toFixed(2)} + ${charges.toFixed(2)} - ${participationPersonnelle.toFixed(2)} - ${params.abattement.toFixed(2)} = ${aplBrut.toFixed(2)} euros`);

  // Seuil de versement : pas d'APL si < 15 euros
  const eligible = montantAPL >= 15;
  if (!eligible && montantAPL > 0) {
    details.push("Montant inferieur a 15 euros : l'APL n'est pas versee.");
  }

  return {
    montantAPL: eligible ? montantAPL : 0,
    loyerRetenu,
    plafondLoyer: plafond,
    forfaitCharges: charges,
    participationPersonnelle,
    P0: params.P0,
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
  const [ressources, setRessources] = useState("15000");
  const [showDetails, setShowDetails] = useState(false);

  const paramYear = getDefaultParamYear();
  const params = PARAMS[paramYear];

  const result = useMemo(() => {
    const loyerNum = parseFloat(loyer) || 0;
    const enfantsNum = parseInt(nbEnfants) || 0;
    const ressourcesNum = parseFloat(ressources) || 0;
    return calculerAPL(loyerNum, zone, situation, enfantsNum, typeLogement, ressourcesNum, params);
  }, [loyer, zone, situation, nbEnfants, typeLogement, ressources, params]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const loyerNum = parseFloat(loyer) || 0;
  const resteACharge = Math.max(0, loyerNum - result.montantAPL);

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
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
            Estimez votre aide personnalisee au logement selon les baremes officiels {paramYear}-{paramYear + 1}. Calcul instantane et detaille.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-5xl px-5 py-10">
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
                </div>

                {/* Zone + type logement */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Zone geographique
                    </label>
                    <select
                      value={zone}
                      onChange={(e) => setZone(e.target.value as Zone)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <option value="1">Zone 1 - Ile-de-France</option>
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
                      <option value="foyer">Foyer / Residence</option>
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
                      <option value="celibataire">Celibataire</option>
                      <option value="couple">Couple</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Nombre d&apos;enfants a charge
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
                    Salaires, allocations chomage, pensions, revenus du patrimoine...
                  </p>
                </div>
              </div>
            </div>

            {/* Resultat principal */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox
                label="APL estimee"
                value={result.montantAPL > 0 ? `${fmt(result.montantAPL)} \u20AC` : "0 \u20AC"}
                primary
              />
              <StatBox label="Reste a charge" value={`${fmt(resteACharge)} \u20AC`} />
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
                  : "Montant trop faible pour etre verse (seuil : 15 \u20AC)"}
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
                    <p className="text-xs" style={{ color: "var(--muted)" }}>Reste a charge</p>
                    <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
                      {fmt(resteACharge)} &euro;
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Barre visuelle */}
            {result.montantAPL > 0 && loyerNum > 0 && (
              <div
                className="rounded-2xl border p-6"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--accent)" }}
                >
                  Repartition du loyer
                </h2>
                <div className="mt-4 h-8 flex overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (result.montantAPL / loyerNum) * 100)}%`,
                      background: "var(--primary)",
                    }}
                  />
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (resteACharge / loyerNum) * 100)}%`,
                      background: "var(--accent)",
                    }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span style={{ color: "var(--primary)" }}>
                    APL : {((result.montantAPL / loyerNum) * 100).toFixed(1)}%
                  </span>
                  <span style={{ color: "var(--accent)" }}>
                    A votre charge : {((resteACharge / loyerNum) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

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
                  Detail du calcul
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
                          <th className="pb-3 text-left font-medium">Parametre</th>
                          <th className="pb-3 text-right font-medium">Valeur</th>
                        </tr>
                      </thead>
                      <tbody>
                        <ParamRow label="Loyer saisi" value={`${fmt(loyerNum)} \u20AC`} />
                        <ParamRow label="Plafond de loyer (zone)" value={`${fmt(result.plafondLoyer)} \u20AC`} />
                        <ParamRow label="Loyer retenu (L)" value={`${fmt(result.loyerRetenu)} \u20AC`} highlight />
                        <ParamRow label="Forfait charges (C)" value={`${fmt(result.forfaitCharges)} \u20AC`} />
                        <ParamRow label="Loyer de reference (LR)" value={`${fmt(result.loyerReference)} \u20AC`} />
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
                Le calcul officiel est realise par la CAF et peut differer selon votre situation precise (patrimoine, abattements specifiques, statut etudiant, etc.).
                Consultez{" "}
                <a
                  href="https://www.caf.fr/allocataires/mes-services-en-ligne/faire-une-simulation"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--primary)", textDecoration: "underline" }}
                >
                  le simulateur officiel de la CAF
                </a>{" "}
                pour un resultat definitif.
              </p>
            </div>

            {/* Explications */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Comment est calculee l&apos;APL ?
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  L&apos;aide personnalisee au logement (APL) est calculee selon la formule :{" "}
                  <strong className="text-[var(--foreground)]">APL = L + C - PP - 5 euros</strong>, ou L est
                  le loyer retenu dans la limite d&apos;un plafond, C le forfait charges et PP votre participation
                  personnelle.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">La participation personnelle</strong> depend de
                  vos ressources et de la taille de votre foyer. Elle est calculee avec la formule PP = P0 + TP x RP,
                  ou P0 est un minimum incompressible ({fmt(params.P0)} euros), TP un taux progressif et RP vos
                  ressources au-dela du plancher R0.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Les zones geographiques</strong> :
                  la zone 1 correspond a l&apos;Ile-de-France, la zone 2 aux agglomerations de plus de 100 000
                  habitants et a la Corse, la zone 3 au reste du territoire.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Les ressources</strong> prises en compte
                  sont celles des 12 derniers mois glissants : salaires, allocations chomage, pensions, revenus
                  du patrimoine. Un plancher R0 est applique : en dessous de ce seuil, vous percevez l&apos;APL
                  maximale.
                </p>
              </div>
            </div>
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
                Si vos ressources sont inferieures au R0, vous percevez l&apos;APL maximale.
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
                  <strong className="text-[var(--foreground)]">Zone 1</strong> : Ile-de-France
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
                Bon a savoir
              </h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>L&apos;APL n&apos;est pas versee si le montant est inferieur a <strong className="text-[var(--foreground)]">15 &euro;/mois</strong>.</li>
                <li>La CAF revise vos droits <strong className="text-[var(--foreground)]">tous les trimestres</strong>.</li>
                <li>Un abattement de <strong className="text-[var(--foreground)]">5 &euro;</strong> est systematiquement applique.</li>
                <li>La participation minimale est de <strong className="text-[var(--foreground)]">{fmt(params.P0)} &euro;</strong>.</li>
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
