// Logique de calcul pure du simulateur d'économie sur l'assurance emprunteur (loi Lemoine).
//
// Règles et sources :
// - Loi n° 2022-270 du 28 février 2022 (« loi Lemoine ») :
//   https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000045268729
// - Résiliation à tout moment (prêts en cours depuis le 1er septembre 2022, nouvelles offres depuis
//   le 1er juin 2022) ; la résiliation prend effet 10 jours après réception par l'assureur de la
//   décision d'acceptation du prêteur, ou à la date d'effet du nouveau contrat si elle est postérieure :
//   art. L113-12-2 du Code des assurances
//   Résiliation « sans frais » ni pénalité : economie.gouv.fr, « Achat immobilier : pouvez-vous changer
//   d'assurance emprunteur ? » https://www.economie.gouv.fr/particuliers/emprunter-et-sassurer/achat-immobilier-pouvez-vous-changer-dassurance-emprunteur
//   https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045271930
// - Le prêteur notifie son acceptation ou son refus dans un délai de dix jours ouvrés, émet l'avenant
//   dans le même délai et ne peut facturer de frais pour cet avenant : art. L313-31 du Code de la
//   consommation https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045271953
//   Tout refus est explicite et comporte l'intégralité des motifs : art. L313-39 C. conso.
// - Le prêteur ne peut refuser un contrat présentant un niveau de garantie équivalent (art. L313-30),
//   ni modifier le taux, le mode d'amortissement ou exiger des frais d'analyse en contrepartie (art. L313-32) :
//   https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038775234/
//   https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038775217/2020-12-01
// - Suppression du questionnaire de santé si la part assurée sur l'encours cumulé des crédits
//   n'excède pas 200 000 € par assuré ET si le crédit se termine avant le 60e anniversaire de l'assuré :
//   art. L113-2-1 du Code des assurances
//   https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000045271000
// - Équivalence du niveau de garantie : liste CCSF de 18 critères (décès, PTIA, incapacité, invalidité),
//   dont la banque retient au plus 11, plus 4 au plus pour la perte d'emploi ; ils figurent sur la
//   fiche standardisée d'information (FSI). Bilan CCSF :
//   https://www.banque-france.fr/en/node/32448
// - Taux indicatifs par âge (moyennes non-fumeur observées en 2026, non contractuelles) :
//   Meilleurtaux, 25 ans 0,10 %, 35 ans 0,13 %, 45 ans 0,24 %, 55 ans 0,47 % ; fumeurs +50 à 100 %.
//   https://www.meilleurtaux.com/assurance-de-pret/le-guide-de-l-assurance-de-pret/taux-assurance-pret-immobilier.html
//   60 ans et plus : fourchette 0,50 à 0,90 % relevée par des comparateurs (sources secondaires).

export const PLAFOND_SANS_QUESTIONNAIRE = 200_000;
export const AGE_FIN_SANS_QUESTIONNAIRE = 60;

export type PresetAge = { label: string; taux: number; note: string };

export const PRESETS_AGE: PresetAge[] = [
  { label: "Moins de 30 ans", taux: 0.1, note: "moyenne indicative à 25 ans" },
  { label: "30-39 ans", taux: 0.13, note: "moyenne indicative à 35 ans" },
  { label: "40-49 ans", taux: 0.24, note: "moyenne indicative à 45 ans" },
  { label: "50-59 ans", taux: 0.47, note: "moyenne indicative à 55 ans" },
  { label: "60 ans et plus", taux: 0.8, note: "fourchette indicative 0,50 à 0,90 %" },
];

export type ModeActuel = "prime" | "taux-initial" | "taux-crd";
export type BaseAlternative = "crd" | "initial";

/** Convertit une saisie utilisateur (virgule française acceptée) en nombre ≥ 0. */
export function parseNum(v: string): number {
  const n = parseFloat(String(v).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Capital restant dû au début de chaque mois restant (mois 1 = mois en cours),
 * pour un prêt amortissable à échéances constantes. Taux nul : amortissement linéaire.
 */
export function echeancierCRD(crd: number, tauxAnnuel: number, mois: number): number[] {
  const n = Math.round(mois);
  const res: number[] = [];
  if (crd <= 0 || n <= 0) return res;
  const r = Math.max(0, tauxAnnuel) / 100 / 12;
  const mensualite = r === 0 ? crd / n : (crd * r) / (1 - Math.pow(1 + r, -n));
  let restant = crd;
  for (let k = 0; k < n; k++) {
    res.push(Math.max(0, restant));
    restant -= mensualite - restant * r;
  }
  return res;
}

/** Coût d'une assurance calculée sur le capital restant dû (prime dégressive). */
export function coutSurCRD(crdMensuels: number[], tauxAnnuel: number, quotite: number): number {
  return crdMensuels.reduce((s, c) => s + (c * tauxAnnuel) / 100 / 12, 0) * quotite;
}

export type EntreeAssurance = {
  crd: number; // capital restant dû
  moisRestants: number;
  tauxPret: number; // taux nominal du prêt en % (pour projeter le CRD)
  capitalInitial: number; // capital emprunté à l'origine (mode « taux sur capital initial »)
  modeActuel: ModeActuel;
  primeActuelle: number; // €/mois, toutes personnes assurées
  tauxActuel: number; // % annuel par assuré
  tauxAlternatif: number; // % annuel par assuré
  baseAlternative: BaseAlternative;
  quotite: number; // 1 = 100 %, 2 = 200 %
};

export type ResultatAssurance = {
  coutActuel: number;
  coutAlternatif: number;
  economie: number;
  economieMensuelle: number;
  primeActuelleMensuelle: number; // prime du mois en cours
  primeAlternativePremierMois: number;
  primeAlternativeMoyenne: number;
  mois: number;
};

export function calculerEconomie(e: EntreeAssurance): ResultatAssurance | null {
  const mois = Math.round(e.moisRestants);
  if (e.crd <= 0 || mois <= 0 || e.quotite <= 0) return null;

  const crdMensuels = echeancierCRD(e.crd, e.tauxPret, mois);

  // Contrat actuel
  let coutActuel = 0;
  let primeActuelleMensuelle = 0;
  if (e.modeActuel === "prime") {
    // Prime saisie (quotité déjà incluse), supposée constante jusqu'au terme
    primeActuelleMensuelle = e.primeActuelle;
    coutActuel = e.primeActuelle * mois;
  } else if (e.modeActuel === "taux-initial") {
    // Contrat groupe type : taux appliqué au capital emprunté à l'origine, prime constante
    const base = e.capitalInitial > 0 ? e.capitalInitial : e.crd;
    primeActuelleMensuelle = (base * e.tauxActuel) / 100 / 12 * e.quotite;
    coutActuel = primeActuelleMensuelle * mois;
  } else {
    primeActuelleMensuelle = (e.crd * e.tauxActuel) / 100 / 12 * e.quotite;
    coutActuel = coutSurCRD(crdMensuels, e.tauxActuel, e.quotite);
  }

  // Contrat alternatif (délégation). Pour un nouveau contrat souscrit en cours de prêt, la base
  // « capital initial » est le capital restant dû au jour de la substitution, figé ensuite.
  let coutAlternatif: number;
  let primeAlternativePremierMois: number;
  if (e.baseAlternative === "initial") {
    primeAlternativePremierMois = (e.crd * e.tauxAlternatif) / 100 / 12 * e.quotite;
    coutAlternatif = primeAlternativePremierMois * mois;
  } else {
    primeAlternativePremierMois = (e.crd * e.tauxAlternatif) / 100 / 12 * e.quotite;
    coutAlternatif = coutSurCRD(crdMensuels, e.tauxAlternatif, e.quotite);
  }

  const economie = coutActuel - coutAlternatif;
  return {
    coutActuel,
    coutAlternatif,
    economie,
    economieMensuelle: economie / mois,
    primeActuelleMensuelle,
    primeAlternativePremierMois,
    primeAlternativeMoyenne: coutAlternatif / mois,
    mois,
  };
}

/**
 * Vérification indicative des conditions de dispense de questionnaire de santé (art. L113-2-1).
 * partMax = quotité la plus élevée d'un assuré (1 = 100 %). ageAine = âge actuel du plus âgé.
 * Les autres crédits immobiliers assurés s'ajoutent à l'encours : non pris en compte ici.
 */
export function dispenseQuestionnaire(crd: number, partMax: number, ageAine: number, moisRestants: number) {
  const partAssuree = crd * partMax;
  const ageFin = ageAine + moisRestants / 12;
  const plafondOk = partAssuree <= PLAFOND_SANS_QUESTIONNAIRE;
  const ageOk = ageAine > 0 ? ageFin < AGE_FIN_SANS_QUESTIONNAIRE : null;
  return { partAssuree, ageFin, plafondOk, ageOk, eligible: plafondOk && ageOk === true };
}
