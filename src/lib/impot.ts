/*
 * Impôt sur le revenu (IR) : barème progressif, quotient familial, plafonnement du
 * quotient familial et décote. Fonctions pures, sans dépendance, partagées par les outils
 * qui estiment l'IR (salaire, auto-entrepreneur, freelance vs CDI, statut juridique…).
 *
 * Algorithme identique à /outils/simulateur-impot (audité le 23/09/2026) :
 *  1. impôt au quotient = barème(revenu / parts) × parts ;
 *  2. plafonnement du QF (CGI art. 197 I-2) : impôt calculé avec les parts de base
 *     (1 célibataire, 2 couple) diminué de plafond × nombre de demi-parts supplémentaires ;
 *     l'impôt brut retenu est le plus élevé des deux. Parent isolé (case T, CGI art. 194-II) :
 *     la part accordée au titre du premier enfant (2 demi-parts en garde exclusive) est
 *     plafonnée à 4 262 € (soit 2 131 € par demi-part), les demi-parts suivantes à 1 807 € ;
 *  3. décote (CGI art. 197 I-4) : forfait − 45,25 % × impôt brut, si l'impôt brut est
 *     inférieur à forfait / 45,25 %, sans pouvoir dépasser l'impôt brut.
 * Aucun arrondi n'est appliqué (les montants sont arrondis à l'affichage).
 *
 * Sources officielles :
 *  - Barème 2026 sur les revenus 2025 (LF 2026, revalorisation de 0,9 %) : 0 % jusqu'à 11 600 €,
 *    11 % jusqu'à 29 579 €, 30 % jusqu'à 84 577 €, 41 % jusqu'à 181 917 €, 45 % au-delà ;
 *    décote 897 € (personne seule) / 1 483 € (couple) ; plafond 1 807 € par demi-part :
 *    https://www.service-public.gouv.fr/particuliers/vosdroits/F1419
 *  - Parent isolé (case T) : 2 parts avec 1 enfant en garde exclusive, 2,5 avec 2, +1 par enfant
 *    à partir du 3e ; plafond de 4 262 € pour le premier enfant (revenus 2025) :
 *    https://www.service-public.gouv.fr/particuliers/vosdroits/F35120
 *  - BOFiP BOI-IR-LIQ-20-20-20 (plafonnement des effets du quotient familial, 1 807 € et 4 262 €
 *    pour les revenus 2025, § 10 et suivants) et
 *    BOI-IR-LIQ-20-20-30 (décote) : https://bofip.impots.gouv.fr
 *  - Code général des impôts, art. 197 (Légifrance)
 * Non gérés : résidence alternée (plafonds divisés par deux, approximés ici par 2 131 € pour
 * la première demi-part), autres plafonds spécifiques (invalidité, ancien combattant…),
 * réductions et crédits d'impôt, contribution exceptionnelle sur les hauts revenus.
 */

export type ParamsAnnee = {
  /** Seuils des tranches 11 %, 30 %, 41 % et 45 % (par part). */
  seuils: number[];
  /** Plafonnement du quotient familial par demi-part supplémentaire. */
  plafondDemiPart: number;
  /** Forfait de décote pour une personne seule. */
  decoteSeul: number;
  /** Forfait de décote pour un couple soumis à imposition commune. */
  decoteCouple: number;
  /** Plafond de la part du premier enfant d'un parent isolé (case T, CGI art. 194-II). */
  plafondParentIsole: number;
};

/** Barèmes officiels, clé = année des revenus (imposition l'année suivante). */
export const BAREMES_OFFICIELS: Record<number, ParamsAnnee> = {
  // Revenus 2023 (LF 2024, +4,8 %)
  2023: { seuils: [11294, 28797, 82341, 177106], plafondDemiPart: 1759, decoteSeul: 873, decoteCouple: 1444, plafondParentIsole: 4149 },
  // Revenus 2024 (LF 2025, +1,8 %)
  2024: { seuils: [11497, 29315, 83823, 180294], plafondDemiPart: 1791, decoteSeul: 889, decoteCouple: 1470, plafondParentIsole: 4224 },
  // Revenus 2025 (LF 2026, +0,9 %) - service-public.gouv.fr F1419, BOI-IR-LIQ-20-20-20
  2025: { seuils: [11600, 29579, 84577, 181917], plafondDemiPart: 1807, decoteSeul: 897, decoteCouple: 1483, plafondParentIsole: 4262 },
};

/** Année de revenus du barème 2026 (revenus 2025, déclaration 2026), utilisée par défaut. */
export const ANNEE_REVENUS_DEFAUT = 2025;

/** Paramètres du barème 2026 (revenus 2025). */
export const PARAMS_IR_2026: ParamsAnnee = BAREMES_OFFICIELS[ANNEE_REVENUS_DEFAUT];

/** Taux des tranches (0 %, 11 %, 30 %, 41 %, 45 %). */
export const TAUX_IR = [0, 0.11, 0.3, 0.41, 0.45];

/** Taux de la décote : décote = forfait − 45,25 % × impôt brut. */
export const TAUX_DECOTE = 0.4525;

/** Revalorisation annuelle moyenne utilisée pour extrapoler une année sans barème officiel. */
export const REVALORISATION = 0.02;

export type TrancheIR = { min: number; max: number; rate: number };

/** Paramètres d'une année de revenus ; au-delà du dernier barème officiel, extrapolation (+2 %/an). */
export function getParamsPourAnnee(annee: number): ParamsAnnee {
  if (BAREMES_OFFICIELS[annee]) return BAREMES_OFFICIELS[annee];
  const annees = Object.keys(BAREMES_OFFICIELS).map(Number).sort((a, b) => b - a);
  const derniere = annees[0];
  const last = BAREMES_OFFICIELS[derniere];
  const delta = annee - derniere;
  if (delta <= 0) return last;
  const factor = Math.pow(1 + REVALORISATION, delta);
  return {
    seuils: last.seuils.map((s) => Math.round(s * factor)),
    plafondDemiPart: Math.round(last.plafondDemiPart * factor),
    decoteSeul: Math.round(last.decoteSeul * factor),
    decoteCouple: Math.round(last.decoteCouple * factor),
    plafondParentIsole: Math.round(last.plafondParentIsole * factor),
  };
}

export function buildTranches(seuils: number[]): TrancheIR[] {
  const limits = [0, ...seuils, Infinity];
  return TAUX_IR.map((rate, i) => ({ min: limits[i], max: limits[i + 1], rate }));
}

/** Tranches du barème 2026 (revenus 2025). */
export const TRANCHES_IR_2026: TrancheIR[] = buildTranches(PARAMS_IR_2026.seuils);

/** Impôt au barème pour un revenu et un nombre de parts (sans plafonnement ni décote). */
export function impotBareme(revenu: number, parts: number, tranches: TrancheIR[] = TRANCHES_IR_2026): number {
  const quotient = revenu / parts;
  let impotParPart = 0;
  for (const t of tranches) {
    if (quotient <= t.min) break;
    impotParPart += (Math.min(quotient, t.max) - t.min) * t.rate;
  }
  return impotParPart * parts;
}

export type ImpotRevenuInput = {
  /** Revenu net imposable du foyer (après abattements), en euros par an. */
  revenuImposable: number;
  /** Nombre de parts de quotient familial (minimum 1). */
  parts: number;
  /** true : couple marié ou pacsé (imposition commune) ; false : personne seule. */
  couple: boolean;
  /** Année des revenus (défaut : 2025, barème 2026). */
  annee?: number;
  /** Parent isolé (case T) : sans effet pour un couple. */
  parentIsole?: boolean;
};

export type ImpotRevenuResult = {
  /** Impôt au quotient familial, avant plafonnement. */
  impotBrutAvantPlafonnement: number;
  /** Impôt brut après plafonnement du quotient familial, avant décote. */
  impotApresPlafonnement: number;
  /** Montant de la décote. */
  decote: number;
  /** Impôt net dû (après décote, jamais négatif). */
  impotNet: number;
  /** Taux marginal d'imposition, en fraction (0, 0.11, 0.3, 0.41 ou 0.45). */
  tmi: number;
  /** Taux moyen d'imposition, en pourcentage du revenu imposable (0 à 45). */
  tauxMoyen: number;
};

/**
 * Plafonnement total des demi-parts supplémentaires. Parent isolé : les 2 premières demi-parts
 * (part du premier enfant) sont plafonnées à plafondParentIsole / 2 chacune, les suivantes au plafond général.
 */
export function plafondQuotientFamilial(demiPartsSupp: number, params: ParamsAnnee, parentIsole = false): number {
  if (!parentIsole) return params.plafondDemiPart * demiPartsSupp;
  const premiers = Math.min(2, demiPartsSupp);
  return (params.plafondParentIsole / 2) * premiers + params.plafondDemiPart * (demiPartsSupp - premiers);
}

/** Impôt sur le revenu d'un foyer : barème, plafonnement du quotient familial, décote. */
export function impotRevenu({ revenuImposable, parts, couple, annee = ANNEE_REVENUS_DEFAUT, parentIsole = false }: ImpotRevenuInput): ImpotRevenuResult {
  const params = getParamsPourAnnee(annee);
  const tranches = buildTranches(params.seuils);
  const revenu = Number.isFinite(revenuImposable) ? Math.max(0, revenuImposable) : 0;
  const p = Number.isFinite(parts) ? Math.max(1, parts) : 1;
  const partsBase = Math.min(couple ? 2 : 1, p);

  const impotQuotient = impotBareme(revenu, p, tranches);

  // Plafonnement du quotient familial : avantage limité par demi-part au-delà des parts de base.
  const demiPartsSupp = Math.max(0, (p - partsBase) * 2);
  const impotPlafonne = impotBareme(revenu, partsBase, tranches) - plafondQuotientFamilial(demiPartsSupp, params, parentIsole && !couple);
  const impotBrut = Math.max(impotQuotient, impotPlafonne);

  // Décote
  const forfait = couple ? params.decoteCouple : params.decoteSeul;
  const seuilDecote = forfait / TAUX_DECOTE;
  const decote = impotBrut > 0 && impotBrut < seuilDecote
    ? Math.min(impotBrut, Math.max(0, forfait - TAUX_DECOTE * impotBrut))
    : 0;

  const impotNet = Math.max(0, impotBrut - decote);
  const quotient = revenu / p;
  const tmi = tranches.findLast((t) => quotient > t.min)?.rate ?? 0;
  const tauxMoyen = revenu > 0 ? (impotNet / revenu) * 100 : 0;

  return {
    impotBrutAvantPlafonnement: impotQuotient,
    impotApresPlafonnement: impotBrut,
    decote,
    impotNet,
    tmi,
    tauxMoyen,
  };
}
