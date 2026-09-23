// Catégories d'outils. La valeur `category` de src/data/tools.ts donne le slug
// (/categories/<slug>) ; le libellé affiché vient d'ici.

export const CATEGORY_LABELS: Record<string, string> = {
  Immobilier: "Immobilier & travaux",
  Finance: "Argent & impôts",
  Emploi: "Emploi & salaire",
  Business: "Entreprise & freelance",
  Dev: "Développeur & web",
  Image: "Image, vidéo & PDF",
  Sante: "Santé",
  Securite: "Sécurité",
  Conversion: "Conversions & calculs",
  Texte: "Texte",
  Outils: "Quotidien",
};

// Type schema.org `applicationCategory` pour le JSON-LD des outils.
export const CATEGORY_SCHEMA: Record<string, string> = {
  Immobilier: "FinanceApplication",
  Finance: "FinanceApplication",
  Emploi: "FinanceApplication",
  Business: "BusinessApplication",
  Dev: "DeveloperApplication",
  Image: "MultimediaApplication",
  Sante: "HealthApplication",
  Securite: "SecurityApplication",
  Conversion: "UtilitiesApplication",
  Texte: "UtilitiesApplication",
  Outils: "UtilitiesApplication",
};

// Anciennes catégories (fusionnées en septembre 2026) -> nouvelle catégorie.
// Les pages /categories/<ancien-slug> redirigent vers la nouvelle.
export const CATEGORY_REDIRECTS: Record<string, string> = {
  maths: "conversion",
  carriere: "business",
  retraite: "finance",
  design: "dev",
  travail: "emploi",
  legal: "business",
  auto: "outils",
  shopping: "outils",
  environnement: "outils",
  construction: "immobilier",
  restaurant: "outils",
  seo: "dev",
  pdf: "image",
  video: "image",
  audio: "image",
  quotidien: "outils",
};

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
