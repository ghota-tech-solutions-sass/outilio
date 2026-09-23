// Registre des partenaires d'affiliation.
//
// Un partenaire n'est affiché que si `url` est renseignée : tant que le lien
// d'affiliation n'est pas obtenu, rien n'apparaît sur le site.
// Pour activer un partenaire : renseigner `name` et `url` (lien de tracking
// fourni par la plateforme d'affiliation), puis vérifier les mentions légales
// (voir `requiresCreditNotice`).

export type PartnerCategory =
  | "courtier-immo"
  | "assurance-emprunteur"
  | "rachat-credit"
  | "renovation"
  | "creation-entreprise"
  | "banque-pro"
  | "facturation"
  | "banque-en-ligne"
  | "epargne"
  | "crypto";

export type Partner = {
  id: string;
  category: PartnerCategory;
  /** Nom commercial du partenaire (affiché). */
  name: string;
  /** Accroche courte, factuelle, sans promesse chiffrée non vérifiée. */
  pitch: string;
  /** Libellé du bouton. */
  cta: string;
  /** Lien d'affiliation. `null` = partenaire désactivé. */
  url: string | null;
  /**
   * Crédit à la consommation / regroupement de crédits : la mention
   * « Un crédit vous engage et doit être remboursé... » est obligatoire
   * (art. L312-5 du Code de la consommation).
   */
  requiresCreditNotice?: boolean;
};

// Pistes de programmes (à vérifier, conditions et statut ORIAS éventuel) :
// - courtier-immo / rachat-credit : courtiers en ligne (programmes via Awin, Effiliation, Kwanko)
// - assurance-emprunteur : comparateurs / délégataires d'assurance de prêt
// - renovation : plateformes de mise en relation avec artisans RGE (ex. proposition JeCompareLesDevis)
// - creation-entreprise : services juridiques en ligne
// - banque-pro / facturation : néobanques pro, logiciels de facturation électronique (PDP)
// - banque-en-ligne / epargne : banques en ligne, assurance-vie en ligne
// - crypto : plateformes enregistrées PSAN / agréées MiCA uniquement
export const PARTNERS: Partner[] = [
  { id: "courtier-immo", category: "courtier-immo", name: "", pitch: "Comparez les offres de prêt de dizaines de banques en une seule demande.", cta: "Comparer les taux", url: null },
  { id: "assurance-emprunteur", category: "assurance-emprunteur", name: "", pitch: "Changez d'assurance de prêt à tout moment grâce à la loi Lemoine.", cta: "Comparer les assurances", url: null },
  { id: "rachat-credit", category: "rachat-credit", name: "", pitch: "Étude gratuite de regroupement de vos crédits.", cta: "Demander une étude", url: null, requiresCreditNotice: true },
  { id: "renovation", category: "renovation", name: "", pitch: "Recevez des devis d'artisans RGE près de chez vous.", cta: "Obtenir des devis", url: null },
  { id: "creation-entreprise", category: "creation-entreprise", name: "", pitch: "Créez votre entreprise en ligne, formalités incluses.", cta: "Créer mon entreprise", url: null },
  { id: "banque-pro", category: "banque-pro", name: "", pitch: "Ouvrez un compte professionnel en ligne en quelques minutes.", cta: "Ouvrir un compte pro", url: null },
  { id: "facturation", category: "facturation", name: "", pitch: "Émettez et recevez des factures électroniques conformes à la réforme 2026.", cta: "Découvrir", url: null },
  { id: "banque-en-ligne", category: "banque-en-ligne", name: "", pitch: "Une banque en ligne sans frais de tenue de compte.", cta: "Voir l'offre", url: null },
  { id: "epargne", category: "epargne", name: "", pitch: "Faites travailler votre épargne avec une assurance-vie en ligne.", cta: "Voir l'offre", url: null },
  { id: "crypto", category: "crypto", name: "", pitch: "Une plateforme enregistrée auprès de l'AMF pour acheter des cryptoactifs.", cta: "Voir la plateforme", url: null },
];

// Catégories de partenaires proposées sur chaque outil (par ordre de pertinence).
export const TOOL_PARTNERS: Record<string, PartnerCategory[]> = {
  "/outils/calculateur-pret-immobilier": ["courtier-immo", "assurance-emprunteur"],
  "/outils/capacite-emprunt": ["courtier-immo", "assurance-emprunteur"],
  "/outils/simulateur-ptz-2026": ["courtier-immo"],
  "/outils/calculateur-frais-notaire": ["courtier-immo"],
  "/outils/assurance-emprunteur": ["assurance-emprunteur"],
  "/outils/calculateur-rachat-credit": ["rachat-credit", "courtier-immo"],
  "/outils/calculateur-rentabilite-locative": ["courtier-immo"],
  "/outils/simulateur-plus-value-immobiliere": ["courtier-immo"],
  "/outils/calculateur-dpe": ["renovation"],
  "/outils/simulateur-maprimerenov": ["renovation"],
  "/outils/simulateur-auto-entrepreneur": ["creation-entreprise", "banque-pro"],
  "/outils/choisir-statut-juridique": ["creation-entreprise", "banque-pro"],
  "/outils/freelance-vs-cdi": ["creation-entreprise", "banque-pro"],
  "/outils/calculateur-tjm-freelance": ["banque-pro", "facturation"],
  "/outils/generateur-facture": ["facturation", "banque-pro"],
  "/outils/calculateur-marge": ["banque-pro"],
  "/outils/calculateur-tva": ["facturation"],
  "/outils/calculateur-epargne": ["epargne", "banque-en-ligne"],
  "/outils/calculateur-inflation": ["epargne"],
  "/outils/simulateur-impot": ["epargne"],
  "/outils/simulateur-flat-tax-crypto": ["crypto"],
  "/outils/calculateur-salaire": ["banque-en-ligne"],
};

export function partnersForTool(pathname: string): Partner[] {
  const categories = TOOL_PARTNERS[pathname] ?? [];
  return categories
    .map((c) => PARTNERS.find((p) => p.category === c && p.url && p.name))
    .filter((p): p is Partner => Boolean(p));
}
