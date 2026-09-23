import { impotRevenu } from "@/lib/impot";

/*
 * Logique de calcul pure du comparateur de statuts juridiques (micro / EI / EURL / SASU).
 * Aucun import React : testable en isolation.
 *
 * Paramètres alignés sur /outils/freelance-vs-cdi et /outils/simulateur-auto-entrepreneur
 * (audités en septembre 2026). Sources officielles :
 *  - Taux micro-social 2026 (12,3 % vente, 21,2 % BIC services, 25,6 % BNC) :
 *    https://www.urssaf.fr/accueil/actualites/taux-cotisations-autoentrepeneur.html
 *  - Plafonds micro 2026-2028 (203 100 € / 83 600 €) et abattements 71 / 50 / 34 % (min. 305 €) :
 *    https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/toutes-les-actualites/2026--modification-des-seuils-de.html
 *    https://entreprendre.service-public.gouv.fr/vosdroits/F32353 ; CGI art. 50-0 et 102 ter
 *  - Franchise en base de TVA 2026 (85 000 € / 37 500 €, réforme à 25 000 € abrogée par la
 *    loi n° 2025-1044 du 3/11/2025) : https://entreprendre.service-public.gouv.fr/vosdroits/F21746
 *  - IS : 15 % jusqu'à 42 500 € de bénéfice (PME), 25 % au-delà : CGI art. 219 ;
 *    https://entreprendre.service-public.gouv.fr/vosdroits/F23575
 *  - PFU 2026 : 12,8 % IR + 18,6 % prélèvements sociaux = 31,4 % (LFSS 2026) : CGI art. 200 A
 *  - Dividendes EURL (gérant majoritaire) > 10 % du capital + comptes courants soumis aux
 *    cotisations TNS : Code de la sécurité sociale, art. L131-6 (Légifrance)
 *  - PASS 2026 : 48 060 € (arrêté du 22/12/2025)
 *  - Barème IR 2026 (revenus 2025), quotient familial, plafonnement du QF (1 807 € par demi-part)
 *    et décote (897 € / 1 483 €), parent isolé (case T, 4 262 €) : module partagé src/lib/impot.ts ;
 *    https://www.service-public.gouv.fr/particuliers/vosdroits/F1419 ; BOFiP BOI-IR-LIQ-20-20-20
 *  - Abattement 10 % sur rémunérations de gérant (art. 62 CGI) et salaires : CGI art. 83
 *  - Taxe PUMa (cotisation subsidiaire maladie) : CSS art. L380-2
 *  - Validation d'un trimestre de retraite 2026 : 150 × SMIC horaire au 1/1/2026 (12,02 €) = 1 803 €
 *    https://www.service-public.gouv.fr/particuliers/vosdroits/F1761 (SMIC horaire 2026 : 12,02 €)
 *  - Validation trimestre : 1 803 € confirmé sur F1761 (consulté le 23/09/2026)
 *  - Coût des formalités 2026 (société commerciale 33,83 € + bénéficiaires effectifs 19,33 €,
 *    page vérifiée le 18/03/2026) : https://entreprendre.service-public.gouv.fr/vosdroits/F37688
 *  - Annonce légale de constitution, forfait 2026 France métropolitaine (arrêté du 19/11/2025,
 *    JO du 28/12/2025) : SASU 142 € HT, EURL 124 € HT :
 *    https://entreprendre.service-public.gouv.fr/actualites/A18724
 *    https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053177549
 *  - Protection du patrimoine personnel de l'EI (loi n° 2022-172 du 14/02/2022) :
 *    https://entreprendre.service-public.gouv.fr/vosdroits/F36354
 *  - Choix de la forme juridique : https://entreprendre.service-public.gouv.fr/vosdroits/F23844
 *  - Cumul ARE / création, ARCE (60 % des droits restants) :
 *    https://entreprendre.service-public.gouv.fr/vosdroits/F15252
 */

export type Activite = "vente" | "services_bic" | "liberal_bnc";
export type StatutKey = "micro" | "ei" | "eurl" | "sasu";

export const STATUTS: StatutKey[] = ["micro", "ei", "eurl", "sasu"];

export const STATUT_LABELS: Record<StatutKey, string> = {
  micro: "Micro-entreprise",
  ei: "EI au réel",
  eurl: "EURL à l'IS",
  sasu: "SASU",
};

/* ─── Paramètres 2026 ─── */
export const PASS_2026 = 48060;
export const PFU_2026 = 0.314; // 12,8 % IR + 18,6 % PS
export const PFU_PART_IR = 0.128;
export const IS_SEUIL_REDUIT = 42500;
export const IS_TAUX_REDUIT = 0.15;
export const IS_TAUX_NORMAL = 0.25;

export const MICRO_TAUX: Record<Activite, number> = {
  vente: 0.123,
  services_bic: 0.212,
  liberal_bnc: 0.256,
};
export const MICRO_ABATTEMENT: Record<Activite, number> = {
  vente: 0.71,
  services_bic: 0.5,
  liberal_bnc: 0.34,
};
export const MICRO_ABATTEMENT_MIN = 305;
export const MICRO_PLAFOND: Record<Activite, number> = {
  vente: 203100,
  services_bic: 83600,
  liberal_bnc: 83600,
};
export const SEUIL_TVA: Record<Activite, number> = {
  vente: 85000,
  services_bic: 37500,
  liberal_bnc: 37500,
};

/* Taux simplifiés identiques à freelance-vs-cdi (paramètres par défaut) */
export const TAUX_TNS = 0.45; // cotisations TNS rapportées au revenu net (EI réel, gérant EURL)
export const TAUX_PATRONAL_SASU = 0.45; // président assimilé salarié (pas d'assurance chômage)
export const TAUX_SALARIAL_SASU = 0.22;

/* Retraite : 1 trimestre = 150 × SMIC horaire au 1er janvier 2026 (12,02 €) */
export const SEUIL_TRIMESTRE_2026 = 1803;

/* ─── Coûts de création (TTC) ─── */
const GREFFE_SOCIETE_COMMERCIALE = 33.83;
const DECLARATION_BENEFICIAIRES = 19.33;
const TVA = 0.2;
const ANNONCE_SASU_HT = 142;
const ANNONCE_EURL_HT = 124;

export interface CoutsCreation {
  greffe: number;
  beneficiaires: number;
  annonce: number;
  total: number;
}
function creation(greffe: number, rbe: number, annonceHT: number): CoutsCreation {
  const annonce = annonceHT * (1 + TVA);
  return { greffe, beneficiaires: rbe, annonce, total: greffe + rbe + annonce };
}
/*
 * Entreprise individuelle (https://entreprendre.service-public.gouv.fr/vosdroits/F23282?profil=entrepreneur-individuel) :
 * micro-entreprise gratuite (sauf agent commercial : 23,21 €) ; EI au réel : 21,74 € en activité
 * commerciale, 45 € en activité artisanale, gratuit en libéral.
 * Hypothèse : « services BIC » traité comme commercial (21,74 €) ; 45 € si l'activité est artisanale.
 */
const EI_FORMALITE: Record<Activite, number> = { vente: 21.74, services_bic: 21.74, liberal_bnc: 0 };

export function coutsCreation(activite: Activite): Record<StatutKey, CoutsCreation> {
  return {
    micro: creation(0, 0, 0),
    ei: creation(EI_FORMALITE[activite], 0, 0),
    eurl: creation(GREFFE_SOCIETE_COMMERCIALE, DECLARATION_BENEFICIAIRES, ANNONCE_EURL_HT),
    sasu: creation(GREFFE_SOCIETE_COMMERCIALE, DECLARATION_BENEFICIAIRES, ANNONCE_SASU_HT),
  };
}
export const COUTS_CREATION = coutsCreation("liberal_bnc");

/* ─── Frais annuels de fonctionnement (estimations moyennes, non réglementées) ─── */
export interface FraisAnnuels {
  comptable: number;
  banque: number;
  juridique: number; // approbation des comptes, dépôt au greffe, secrétariat juridique
  total: number;
}
function frais(comptable: number, banque: number, juridique: number): FraisAnnuels {
  return { comptable, banque, juridique, total: comptable + banque + juridique };
}
export const FRAIS_ANNUELS: Record<StatutKey, FraisAnnuels> = {
  micro: frais(0, 0, 0), // livre des recettes ; compte dédié (peut être un compte personnel séparé)
  ei: frais(900, 120, 0), // comptabilité d'engagement, liasse 2035/2031
  eurl: frais(1800, 180, 150), // bilan, liasse IS, approbation et dépôt des comptes
  sasu: frais(2000, 180, 150), // idem + bulletins de paie du président
};

/* ─── Barèmes ─── */
/** IR net au barème 2026 (quotient familial, plafonnement et décote) : voir src/lib/impot.ts. */
export function calcIR(revenu: number, parts: number, couple = false, parentIsole = false): number {
  if (revenu <= 0) return 0;
  return impotRevenu({ revenuImposable: revenu, parts: parts > 0 ? parts : 1, couple, parentIsole }).impotNet;
}

export function calcIS(benefice: number): number {
  if (benefice <= 0) return 0;
  if (benefice <= IS_SEUIL_REDUIT) return benefice * IS_TAUX_REDUIT;
  return IS_SEUIL_REDUIT * IS_TAUX_REDUIT + (benefice - IS_SEUIL_REDUIT) * IS_TAUX_NORMAL;
}

function trimestres(base: number): number {
  return Math.max(0, Math.min(4, Math.floor(base / SEUIL_TRIMESTRE_2026)));
}

/*
 * Cumul ARE / revenus d'activité (règle France Travail) : l'ARE mensuelle est réduite de 70 %
 * des rémunérations brutes de l'activité. Revenu retenu (simplifié) : CA après abattement en
 * micro, bénéfice en EI, rémunération du gérant / salaire brut du président en société
 * (les dividendes ne sont pas pris en compte). Horizon : 12 mois maximum.
 */
export function calcAREPercue(i: Inputs, revenuActiviteAnnuel: number): number {
  if (!i.are || i.areMensuel <= 0 || i.areMois <= 0) return 0;
  const mois = Math.min(12, Math.max(0, i.areMois));
  const mensuelle = Math.max(0, i.areMensuel - 0.7 * Math.max(0, revenuActiviteAnnuel) / 12);
  return mensuelle * mois;
}

/* ─── Entrées / sorties ─── */
export interface Inputs {
  activite: Activite;
  ca: number; // chiffre d'affaires annuel HT
  charges: number; // charges annuelles (achats, matériel, déplacements…) hors frais de fonctionnement
  pctRemuneration: number; // 0..1 : part du résultat disponible versée en rémunération (EURL/SASU)
  parts: number; // parts fiscales du foyer
  couple?: boolean; // couple marié ou pacsé (imposition commune) ; défaut : personne seule
  parentIsole?: boolean; // parent isolé (case T, CGI art. 194-II) : plafond de 4 262 € pour le 1er enfant
  capitalEurl: number; // capital social + comptes courants d'associé (EURL)
  inclureFrais: boolean; // déduire les frais annuels estimés (comptable, banque…)
  protegerPatrimoine: boolean;
  associes: boolean; // associés à venir / levée de fonds
  are: boolean; // allocations chômage (ARE) en cours
  areMensuel: number; // montant mensuel brut de l'ARE
  areMois: number; // mois de droits restants (plafonné à 12 : horizon de la simulation)
  optimiser: boolean; // appliquer la meilleure répartition rémunération / dividendes par statut
}

export interface ResultatStatut {
  key: StatutKey;
  eligible: boolean;
  motifIneligibilite?: string;
  ca: number;
  charges: number;
  fraisFonctionnement: number;
  cotisationsSociales: number;
  is: number;
  prelevementsDividendes: number; // PFU, cotisations TNS sur dividendes EURL, taxe PUMa
  impotRevenu: number; // barème progressif (hors part IR du PFU)
  remunerationNette: number;
  pctRemuneration: number; // répartition réellement utilisée (EURL / SASU)
  areRecue: number; // ARE estimée perçue sur 12 mois (0 si pas d'ARE)
  dividendesNets: number;
  netAnnuel: number;
  netMensuel: number;
  trimestresRetraite: number;
  taxePuma: number; // SASU uniquement
  dividendesSoumisTNS: number; // EURL uniquement
  detail: [string, number][];
}

function fraisFonct(key: StatutKey, i: Inputs): number {
  return i.inclureFrais ? FRAIS_ANNUELS[key].total : 0;
}

export function calcMicro(i: Inputs): ResultatStatut {
  const ca = Math.max(0, i.ca);
  const ff = fraisFonct("micro", i);
  const cotisations = ca * MICRO_TAUX[i.activite];
  const abattement = Math.min(ca, Math.max(MICRO_ABATTEMENT_MIN, ca * MICRO_ABATTEMENT[i.activite]));
  const revenuImposable = ca - abattement;
  const ir = calcIR(revenuImposable, i.parts, i.couple, i.parentIsole);
  // Les charges réelles ne sont pas déductibles en micro, mais elles sont bien payées.
  const net = ca - i.charges - ff - cotisations - ir;
  const plafond = MICRO_PLAFOND[i.activite];
  const eligible = ca <= plafond && !i.associes;
  return {
    key: "micro",
    eligible,
    motifIneligibilite: i.associes
      ? "Impossible d'avoir des associés"
      : ca > plafond
        ? `CA supérieur au plafond de ${plafond.toLocaleString("fr-FR")} €`
        : undefined,
    ca,
    charges: i.charges,
    fraisFonctionnement: ff,
    cotisationsSociales: cotisations,
    is: 0,
    prelevementsDividendes: 0,
    impotRevenu: ir,
    remunerationNette: ca - i.charges - ff - cotisations,
    pctRemuneration: 1,
    areRecue: calcAREPercue(i, revenuImposable),
    dividendesNets: 0,
    netAnnuel: net,
    netMensuel: net / 12,
    trimestresRetraite: trimestres(revenuImposable),
    taxePuma: 0,
    dividendesSoumisTNS: 0,
    detail: [
      ["Revenu imposable après abattement", revenuImposable],
    ],
  };
}

export function calcEI(i: Inputs): ResultatStatut {
  const ca = Math.max(0, i.ca);
  const ff = fraisFonct("ei", i);
  const beneficeAvantCotis = ca - i.charges - ff;
  // Cotisations TNS modélisées comme TAUX_TNS du revenu net : cotis = B × t / (1 + t)
  const cotisations = Math.max(0, beneficeAvantCotis) * (TAUX_TNS / (1 + TAUX_TNS));
  const revenuPro = beneficeAvantCotis - cotisations;
  const ir = calcIR(Math.max(0, revenuPro), i.parts, i.couple, i.parentIsole);
  const net = revenuPro - ir;
  return {
    key: "ei",
    eligible: !i.associes,
    motifIneligibilite: i.associes ? "Impossible d'avoir des associés" : undefined,
    ca,
    charges: i.charges,
    fraisFonctionnement: ff,
    cotisationsSociales: cotisations,
    is: 0,
    prelevementsDividendes: 0,
    impotRevenu: ir,
    remunerationNette: revenuPro,
    pctRemuneration: 1,
    areRecue: calcAREPercue(i, revenuPro),
    dividendesNets: 0,
    netAnnuel: net,
    netMensuel: net / 12,
    trimestresRetraite: trimestres(Math.max(0, revenuPro)),
    taxePuma: 0,
    dividendesSoumisTNS: 0,
    detail: [["Bénéfice imposable", revenuPro]],
  };
}

export function calcEURL(i: Inputs, pct = i.pctRemuneration): ResultatStatut {
  const ca = Math.max(0, i.ca);
  const ff = fraisFonct("eurl", i);
  const disponible = Math.max(0, ca - i.charges - ff);
  const budget = disponible * pct;
  const remuneration = budget / (1 + TAUX_TNS);
  const cotisRemu = remuneration * TAUX_TNS;
  const beneficeAvantIS = ca - i.charges - ff - budget;
  const is = calcIS(beneficeAvantIS);
  const dividendesBruts = Math.max(0, beneficeAvantIS - is);
  const seuil10 = Math.max(0, i.capitalEurl) * 0.1;
  const partFranchise = Math.min(dividendesBruts, seuil10);
  const partAuDela = dividendesBruts - partFranchise;
  const pfu = partFranchise * PFU_2026;
  const cotisDividendes = partAuDela * TAUX_TNS;
  const irDividendesAuDela = partAuDela * PFU_PART_IR;
  const prelevementsDividendes = pfu + cotisDividendes + irDividendesAuDela;
  const dividendesNets = dividendesBruts - prelevementsDividendes;
  const ir = calcIR(remuneration * 0.9, i.parts, i.couple, i.parentIsole);
  const net = remuneration - ir + dividendesNets;
  return {
    key: "eurl",
    eligible: true,
    ca,
    charges: i.charges,
    fraisFonctionnement: ff,
    cotisationsSociales: cotisRemu,
    is,
    prelevementsDividendes,
    impotRevenu: ir,
    remunerationNette: remuneration,
    pctRemuneration: pct,
    areRecue: calcAREPercue(i, remuneration),
    dividendesNets,
    netAnnuel: net,
    netMensuel: net / 12,
    trimestresRetraite: trimestres(remuneration + partAuDela),
    taxePuma: 0,
    dividendesSoumisTNS: partAuDela,
    detail: [
      ["Bénéfice avant IS", beneficeAvantIS],
      ["Dividendes bruts", dividendesBruts],
      ["Dividendes soumis aux cotisations TNS (> 10 % du capital)", partAuDela],
    ],
  };
}

export function calcSASU(i: Inputs, pct = i.pctRemuneration): ResultatStatut {
  const ca = Math.max(0, i.ca);
  const ff = fraisFonct("sasu", i);
  const disponible = Math.max(0, ca - i.charges - ff);
  const budget = disponible * pct; // super-brut
  const brut = budget / (1 + TAUX_PATRONAL_SASU);
  const patronales = brut * TAUX_PATRONAL_SASU;
  const salariales = brut * TAUX_SALARIAL_SASU;
  const netSalaire = brut - salariales;
  const beneficeAvantIS = ca - i.charges - ff - budget;
  const is = calcIS(beneficeAvantIS);
  const dividendesBruts = Math.max(0, beneficeAvantIS - is);
  const pfu = dividendesBruts * PFU_2026;
  const seuilPuma = PASS_2026 * 0.2;
  const taxePuma =
    brut < seuilPuma
      ? 0.065 * Math.max(0, dividendesBruts - PASS_2026 * 0.5) * (1 - brut / seuilPuma)
      : 0;
  const dividendesNets = dividendesBruts - pfu - taxePuma;
  const ir = calcIR(netSalaire * 0.9, i.parts, i.couple, i.parentIsole);
  const net = netSalaire - ir + dividendesNets;
  return {
    key: "sasu",
    eligible: true,
    ca,
    charges: i.charges,
    fraisFonctionnement: ff,
    cotisationsSociales: patronales + salariales,
    is,
    prelevementsDividendes: pfu + taxePuma,
    impotRevenu: ir,
    remunerationNette: netSalaire,
    pctRemuneration: pct,
    areRecue: calcAREPercue(i, brut),
    dividendesNets,
    netAnnuel: net,
    netMensuel: net / 12,
    trimestresRetraite: trimestres(brut),
    taxePuma,
    dividendesSoumisTNS: 0,
    detail: [
      ["Salaire brut du président", brut],
      ["Bénéfice avant IS", beneficeAvantIS],
      ["Dividendes bruts", dividendesBruts],
      ["Taxe PUMa", taxePuma],
    ],
  };
}

/** Répartition rémunération / dividendes maximisant le net (pas de 5 %). */
export function meilleureRepartition(i: Inputs, key: "eurl" | "sasu"): { pct: number; net: number } {
  let best = { pct: 0, net: -Infinity };
  for (let p = 0; p <= 100; p += 5) {
    const r = key === "eurl" ? calcEURL(i, p / 100) : calcSASU(i, p / 100);
    if (r.netAnnuel > best.net + 0.5) best = { pct: p, net: r.netAnnuel };
  }
  return best;
}

/* ─── Recommandation ─── */
export interface Recommandation {
  statut: StatutKey;
  scores: Record<StatutKey, number>;
  raisons: string[];
  vigilance: string[];
}

const calcFn = { eurl: calcEURL, sasu: calcSASU };

const fmtEur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;

export function comparer(i: Inputs): { resultats: Record<StatutKey, ResultatStatut>; reco: Recommandation } {
  const resultats: Record<StatutKey, ResultatStatut> = {
    micro: calcMicro(i),
    ei: calcEI(i),
    eurl: calcEURL(i, i.optimiser ? meilleureRepartition(i, "eurl").pct / 100 : i.pctRemuneration),
    sasu: calcSASU(i, i.optimiser ? meilleureRepartition(i, "sasu").pct / 100 : i.pctRemuneration),
  };
  // Critère financier = net d'activité + ARE conservée sur 12 mois
  const total = (k: StatutKey) => resultats[k].netAnnuel + resultats[k].areRecue;

  const eligibles = STATUTS.filter((k) => resultats[k].eligible);
  const bestNet = Math.max(...eligibles.map((k) => total(k)));

  /*
   * Score transparent : 100 points pour le meilleur net, -1 point par % d'écart,
   * puis bonus qualitatifs (simplicité, protection, ARE, associés).
   */
  const scores = {} as Record<StatutKey, number>;
  for (const k of STATUTS) {
    const r = resultats[k];
    if (!r.eligible) {
      scores[k] = -Infinity;
      continue;
    }
    const ecart = bestNet > 0 ? ((bestNet - total(k)) / bestNet) * 100 : 0;
    let s = 100 - ecart;
    if (k === "micro") s += 8; // simplicité maximale
    if (k === "ei") s += 3;
    if (i.protegerPatrimoine && (k === "eurl" || k === "sasu")) s += 5;
    if (i.associes && k === "sasu") s += 25; // SAS : entrée d'associés, levée de fonds, BSPCE
    if (i.associes && k === "eurl") s += 5; // SARL : cessions de parts plus encadrées
    scores[k] = s;
  }
  const statut = STATUTS.reduce((a, b) => (scores[b] > scores[a] ? b : a), eligibles[0] ?? "sasu");
  const r = resultats[statut];

  const raisons: string[] = [];
  const vigilance: string[] = [];
  const ecartMeilleur = bestNet - total(statut);
  const meilleurNetKey = eligibles.find((k) => total(k) === bestNet);

  if (ecartMeilleur < 1) {
    raisons.push(
      r.areRecue > 0
        ? `Meilleur total des statuts éligibles : ${fmtEur(r.netAnnuel)} de revenu net + ${fmtEur(r.areRecue)} d'ARE conservée sur 12 mois.`
        : `Revenu net disponible le plus élevé des statuts éligibles${i.optimiser ? "" : " avec la répartition choisie"} : ${fmtEur(r.netAnnuel)} par an.`,
    );
  } else if (meilleurNetKey) {
    raisons.push(
      `Écart de ${fmtEur(ecartMeilleur)} par an avec le meilleur net (${STATUT_LABELS[meilleurNetKey]}), compensé par les critères ci-dessous.`,
    );
  }

  if (!i.optimiser) {
    for (const k of ["eurl", "sasu"] as const) {
      const opt = meilleureRepartition(i, k);
      const gain = opt.net + calcFn[k](i, opt.pct / 100).areRecue - total(statut);
      if (k !== statut && gain > 500) {
        raisons.push(
          `À noter : avec une répartition optimisée (${opt.pct} % de rémunération), ${k === "eurl" ? "l'EURL" : "la SASU"} atteindrait ${fmtEur(opt.net)} de net (+${fmtEur(gain)}). Cochez « répartition optimisée » pour comparer.`,
        );
      }
    }
  }

  if (statut === "micro") {
    raisons.push("Formalités gratuites, pas de bilan ni d'expert-comptable obligatoire, cotisations proportionnelles au CA encaissé.");
    if (i.charges < i.ca * (1 - MICRO_ABATTEMENT[i.activite]) * 0.6)
      raisons.push("Vos charges réelles restent nettement inférieures à l'abattement forfaitaire : la micro vous est favorable.");
    if (i.are) raisons.push("Cumul possible avec l'ARE : l'allocation est réduite de 70 % du revenu déclaré (CA après abattement), ou versée en capital (ARCE).");
  }
  if (statut === "ei") {
    raisons.push("Charges réelles déductibles sans créer de société : pas de capital, d'annonce légale ni de greffe.");
    raisons.push("Depuis mai 2022, votre patrimoine personnel est séparé par défaut de votre patrimoine professionnel.");
  }
  if (statut === "eurl") {
    raisons.push("Cotisations TNS moins élevées qu'en SASU pour une même rémunération.");
    raisons.push("Bénéfice imposé à l'IS (15 % jusqu'à 42 500 €) : vous pouvez laisser une partie en réserve dans la société.");
  }
  if (statut === "sasu") {
    raisons.push("Président assimilé salarié : régime général (hors chômage) et grande liberté dans le choix salaire / dividendes.");
    if (i.associes) raisons.push("La SAS facilite l'entrée d'associés et d'investisseurs (actions, BSPCE, statuts sur mesure).");
    if (i.are && r.pctRemuneration < 0.3)
      raisons.push("Avec peu ou pas de salaire, le président conserve l'essentiel de son ARE : les dividendes ne réduisent pas l'allocation.");
  }
  if (i.protegerPatrimoine && (statut === "eurl" || statut === "sasu"))
    raisons.push("Responsabilité limitée aux apports : patrimoine personnel protégé (hors caution personnelle ou faute de gestion).");

  // Points de vigilance
  const plafond = MICRO_PLAFOND[i.activite];
  if (i.associes) {
    // micro et EI déjà exclues : pas d'alerte de plafond
  } else if (i.ca > plafond)
    vigilance.push(`Au-delà de ${fmtEur(plafond)} de CA, la micro-entreprise n'est plus possible (sortie après 2 années consécutives de dépassement).`);
  else if (i.ca > plafond * 0.85)
    vigilance.push(`Votre CA approche le plafond micro de ${fmtEur(plafond)} : prévoyez le passage au réel.`);
  const seuilTva = SEUIL_TVA[i.activite];
  if (i.ca > seuilTva)
    vigilance.push(`CA supérieur au seuil de franchise de TVA (${fmtEur(seuilTva)}) : vous devrez facturer et reverser la TVA, quel que soit le statut.`);
  if (statut === "sasu" && resultats.sasu.taxePuma > 0)
    vigilance.push("Rémunération inférieure à 20 % du PASS avec d'importants dividendes : la taxe PUMa s'applique. Un petit salaire peut l'éviter.");
  if (statut === "sasu" && r.pctRemuneration === 0)
    vigilance.push("100 % dividendes : aucun trimestre de retraite ni indemnités journalières. Un salaire minimal améliore votre protection.");
  if (statut === "eurl" && resultats.eurl.dividendesSoumisTNS > 0)
    vigilance.push("En EURL, les dividendes au-delà de 10 % du capital et des comptes courants supportent les cotisations TNS : privilégiez la rémunération.");
  if (i.are)
    vigilance.push("Demandeur d'emploi indemnisé : vous êtes en principe éligible à l'ACRE (exonération partielle de cotisations la première année), non intégrée dans ce comparatif.");
  if (i.are)
    vigilance.push("ARE estimée sur 12 mois maximum, avant impôt (l'ARE est imposable). L'ARCE (60 % des droits restants versés en capital) est une alternative : faites valider votre cas par France Travail.");
  if (i.associes && (statut === "sasu" || statut === "eurl"))
    vigilance.push("Avec des associés, il s'agira d'une SAS (ou d'une SARL) pluripersonnelle : rédigez un pacte d'associés.");
  if (r.trimestresRetraite < 4)
    vigilance.push(`Seulement ${r.trimestresRetraite} trimestre(s) de retraite validé(s) avec ces hypothèses (seuil 2026 : ${fmtEur(SEUIL_TRIMESTRE_2026)} par trimestre).`);

  return { resultats, reco: { statut, scores, raisons, vigilance } };
}
