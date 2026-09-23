// Logique de calcul pure du simulateur de capacité d'emprunt (sans dépendance React).
//
// Règles et sources :
// - HCSF, décision n° D-HCSF-2021-7 du 29 septembre 2021 (juridiquement contraignante depuis le
//   1er janvier 2022, ajustée par D-HCSF-2023-2 et D-HCSF-2023-6) :
//   https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000044178669
//   https://www.economie.gouv.fr/hcsf/mesures/mesure-relative-loctroi-de-credits-immobiliers
//   * taux d'effort ≤ 35 % : charges annuelles d'emprunt (assurance emprunteur comprise) / revenus
//     annuels nets avant impôt ;
//   * maturité ≤ 25 ans (27 ans si différé d'amortissement lié à une livraison différée, neuf/VEFA) ;
//   * 20 % de la production trimestrielle peut déroger, prioritairement résidence principale
//     et primo-accédants.
// - Revenus locatifs : l'article 4 de la décision retient les loyers bruts diminués d'une décote
//   de risque fixée par le prêteur. La pondération à 70 % est la pratique bancaire courante,
//   pas une règle réglementaire.
// - Taux par défaut : moyennes de l'Observatoire Crédit Logement/CSA, août 2026
//   (15 ans 3,14 %, 20 ans 3,27 %, 25 ans 3,35 %) :
//   https://lobservatoire.creditlogement.fr/publications/analyse-marche-immobilier-aout-2026/
// - Frais de notaire : ordres de grandeur indicatifs (≈ 7,5 % dans l'ancien, ≈ 2,5 % dans le neuf),
//   à affiner avec /outils/calculateur-frais-notaire.
// - Reste à vivre : aucune norme réglementaire, chaque banque applique sa propre grille.
//   Repères indicatifs utilisés ici : 800 € par adulte et 300 € par enfant.

export const TAUX_ENDETTEMENT_MAX = 0.35;
export const PONDERATION_LOYERS = 0.7;
export const FRAIS_NOTAIRE_ANCIEN = 0.075;
export const FRAIS_NOTAIRE_NEUF = 0.025;
export const RAV_ADULTE = 800;
export const RAV_ENFANT = 300;

export const TAUX_MOYENS_2026: Record<number, number> = { 15: 3.14, 20: 3.27, 25: 3.35 };

/** Convertit une saisie utilisateur (virgule française acceptée) en nombre ≥ 0. */
export function parseNum(v: string): number {
  const n = parseFloat(String(v).replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Mensualité (hors assurance) pour 1 € emprunté.
 * tauxAnnuel en %, dureeAns en années. Taux nul : remboursement linéaire 1/n.
 */
export function facteurMensualite(tauxAnnuel: number, dureeAns: number): number {
  const n = Math.round(dureeAns * 12);
  if (n <= 0) return 0;
  const r = tauxAnnuel / 100 / 12;
  if (r <= 0) return 1 / n;
  return r / (1 - Math.pow(1 + r, -n));
}

/**
 * Capital empruntable pour une mensualité maximale donnée, assurance comprise.
 * L'assurance est calculée sur le capital initial (prime constante) : M = P × (a + tAss/12).
 */
export function capitalMax(
  mensualiteMax: number,
  tauxAnnuel: number,
  dureeAns: number,
  tauxAssuranceAnnuel: number,
): number {
  if (mensualiteMax <= 0) return 0;
  const a = facteurMensualite(Math.max(0, tauxAnnuel), dureeAns);
  const k = a + Math.max(0, tauxAssuranceAnnuel) / 100 / 12;
  return k > 0 ? mensualiteMax / k : 0;
}

export type EntreeCapacite = {
  revenus: number; // salaires nets mensuels cumulés (avant impôt)
  loyers: number; // loyers bruts mensuels perçus
  autresCredits: number; // mensualités des crédits en cours conservés
  apport: number;
  dureeAns: number;
  taux: number; // taux nominal annuel en %
  tauxAssurance: number; // taux annuel total d'assurance (toutes quotités) en % du capital initial
  adultes: number;
  enfants: number;
  neuf: boolean;
};

export type ResultatCapacite = {
  revenusRetenus: number;
  chargesMax: number;
  mensualiteMax: number;
  capital: number;
  assuranceMensuelle: number;
  mensualiteHorsAssurance: number;
  coutInterets: number;
  coutAssurance: number;
  budgetTotal: number;
  tauxFraisNotaire: number;
  prixMaxBien: number;
  fraisNotaireEstimes: number;
  resteAVivre: number;
  resteAVivreRepere: number;
  capaciteNulle: boolean;
};

export function calculerCapacite(e: EntreeCapacite): ResultatCapacite | null {
  const revenusRetenus = e.revenus + PONDERATION_LOYERS * e.loyers;
  if (revenusRetenus <= 0 || e.dureeAns <= 0) return null;

  const chargesMax = TAUX_ENDETTEMENT_MAX * revenusRetenus;
  const mensualiteMax = Math.max(0, chargesMax - e.autresCredits);
  const capital = capitalMax(mensualiteMax, e.taux, e.dureeAns, e.tauxAssurance);
  const n = Math.round(e.dureeAns * 12);
  const assuranceMensuelle = (capital * e.tauxAssurance) / 100 / 12;
  const mensualiteHorsAssurance = mensualiteMax - assuranceMensuelle;
  const coutInterets = Math.max(0, mensualiteHorsAssurance * n - capital);
  const coutAssurance = assuranceMensuelle * n;

  const budgetTotal = capital + e.apport;
  const tauxFraisNotaire = e.neuf ? FRAIS_NOTAIRE_NEUF : FRAIS_NOTAIRE_ANCIEN;
  // Budget = prix + frais de notaire = prix × (1 + f)  ⇒  prix = budget / (1 + f)
  const prixMaxBien = budgetTotal / (1 + tauxFraisNotaire);
  const fraisNotaireEstimes = budgetTotal - prixMaxBien;

  // Reste à vivre : revenus retenus − toutes les charges de crédit (nouvelle mensualité incluse)
  const resteAVivre = revenusRetenus - e.autresCredits - mensualiteMax;
  const resteAVivreRepere = RAV_ADULTE * Math.max(1, e.adultes) + RAV_ENFANT * Math.max(0, e.enfants);

  return {
    revenusRetenus,
    chargesMax,
    mensualiteMax,
    capital,
    assuranceMensuelle,
    mensualiteHorsAssurance,
    coutInterets,
    coutAssurance,
    budgetTotal,
    tauxFraisNotaire,
    prixMaxBien,
    fraisNotaireEstimes,
    resteAVivre,
    resteAVivreRepere,
    capaciteNulle: mensualiteMax <= 0,
  };
}

/** Tableau de sensibilité : capital empruntable par durée (lignes) et taux −0,5 / actuel / +0,5 pt. */
export function tableauSensibilite(
  mensualiteMax: number,
  taux: number,
  tauxAssurance: number,
  durees: number[] = [15, 20, 25],
): { duree: number; valeurs: { taux: number; capital: number }[] }[] {
  const tauxListe = [Math.max(0, taux - 0.5), taux, taux + 0.5];
  return durees.map((duree) => ({
    duree,
    valeurs: tauxListe.map((t) => ({ taux: t, capital: capitalMax(mensualiteMax, t, duree, tauxAssurance) })),
  }));
}
