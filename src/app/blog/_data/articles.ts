// Source unique des articles du blog : index (/blog), métadonnées SEO,
// JSON-LD, byline et blocs « À lire aussi ».
// Les dates sont au format ISO (AAAA-MM-JJ).

export type BlogArticle = {
  slug: string;
  /** Titre affiché (H1 et carte de l'index). */
  title: string;
  /** Balise <title> (sans le suffixe « | Outilis.fr »), idéalement < 60 caractères. */
  seoTitle: string;
  description: string;
  category: string;
  keywords: string[];
  datePublished: string;
  dateModified: string;
  readTime: string;
  /** Slugs d'articles liés (maillage interne). */
  related: string[];
};

export const BLOG_AUTHOR = {
  name: "Mickaël Villers",
  url: "https://outilis.fr/mentions-legales",
};

export const ARTICLES: BlogArticle[] = [
  {
    slug: "guide-immobilier-2026",
    title: "Acheter sa résidence principale en 2026 : budget, financement et frais, étape par étape",
    seoTitle: "Acheter un logement en 2026 : budget et financement",
    description:
      "Capacité d'emprunt (règle HCSF des 35 %), apport, frais de notaire, PTZ, assurance emprunteur : un plan de financement complet et chiffré pour acheter en 2026.",
    category: "Immobilier",
    keywords: [
      "acheter résidence principale 2026",
      "plan de financement immobilier",
      "capacité d'emprunt 2026",
      "frais de notaire 2026",
      "taux immobilier septembre 2026",
      "apport personnel",
    ],
    datePublished: "2026-03-27",
    dateModified: "2026-09-23",
    readTime: "12 min",
    related: ["ptz-2026-nouveautes", "rachat-credit-immo-2026", "dpe-f-g-logement-energivore"],
  },
  {
    slug: "rachat-credit-immo-2026",
    title: "Rachat de crédit immo 2026 : quand ça vaut vraiment le coup ?",
    seoTitle: "Rachat de crédit immo 2026 : quand ça vaut le coup ?",
    description:
      "Écart de taux minimum, frais à anticiper, délai d'amortissement, exemple chiffré. Tous les critères pour décider de racheter ou non.",
    category: "Immobilier",
    keywords: ["rachat crédit immobilier 2026", "renégociation prêt", "IRA", "frais rachat crédit"],
    datePublished: "2026-04-28",
    dateModified: "2026-09-23",
    readTime: "6 min",
    related: ["guide-immobilier-2026", "ptz-2026-nouveautes"],
  },
  {
    slug: "dpe-f-g-logement-energivore",
    title: "DPE F ou G : que faire avec un logement énergivore en 2026",
    seoTitle: "DPE F ou G en 2026 : que faire avec un logement énergivore ?",
    description:
      "Calendrier des interdictions de location, nouveau calcul du DPE, MaPrimeRénov' 2026, décote à la revente, travaux prioritaires : le guide pour décider.",
    category: "Immobilier",
    keywords: ["DPE F", "DPE G", "passoire thermique 2026", "interdiction location DPE"],
    datePublished: "2026-04-22",
    dateModified: "2026-09-23",
    readTime: "8 min",
    related: ["guide-immobilier-2026", "rachat-credit-immo-2026"],
  },
  {
    slug: "ptz-2026-nouveautes",
    title: "PTZ 2026 : ce qui a changé avec le nouveau dispositif élargi",
    seoTitle: "PTZ 2026 : ce qui a changé avec le dispositif élargi",
    description:
      "Le prêt à taux zéro 2026 étendu à toute la France. Quotités selon la tranche de revenus, plafonds, exemple chiffré à Lyon : tout savoir.",
    category: "Immobilier",
    keywords: ["PTZ 2026", "prêt à taux zéro 2026", "primo-accédant", "plafond ressources PTZ"],
    datePublished: "2026-04-15",
    dateModified: "2026-09-23",
    readTime: "7 min",
    related: ["guide-immobilier-2026", "dpe-f-g-logement-energivore"],
  },
  {
    slug: "guide-creation-entreprise-2026",
    title: "Micro, EI, EURL ou SASU : quel statut choisir pour créer son entreprise en 2026 ?",
    seoTitle: "Micro, EURL ou SASU : quel statut choisir en 2026 ?",
    description:
      "Comparatif chiffré des statuts à 40 000, 70 000 et 120 000 € de chiffre d'affaires : cotisations, IS à 15 %, dividendes au PFU 31,4 %, taxe PUMa, coûts de création et pièges.",
    category: "Business",
    keywords: [
      "choisir statut juridique 2026",
      "SASU ou micro-entreprise",
      "EURL ou SASU",
      "impôt sur les sociétés 2026",
      "dividendes flat tax 31,4",
      "créer son entreprise 2026",
      "taxe PUMa",
      "IS taux réduit 15 %",
    ],
    datePublished: "2026-03-20",
    dateModified: "2026-09-23",
    readTime: "12 min",
    related: ["simulateur-auto-entrepreneur-2026", "guide-freelance-2026", "guide-impots-revenus-2026"],
  },
  {
    slug: "simulateur-auto-entrepreneur-2026",
    title: "Micro-entreprise 2026 : cotisations, plafonds, ACRE et revenu net réel",
    seoTitle: "Auto-entrepreneur 2026 : cotisations, plafonds, net",
    description:
      "Taux URSSAF 2026 (12,3 %, 21,2 %, 25,6 %), plafonds 83 600 / 203 100 €, franchise de TVA, ACRE à 25 %, versement libératoire : calcul du revenu net avec exemples.",
    category: "Business",
    keywords: [
      "auto-entrepreneur 2026",
      "cotisations micro-entreprise 2026",
      "plafond micro-entreprise 2026",
      "ACRE 2026",
      "versement libératoire",
      "franchise TVA 2026",
    ],
    datePublished: "2026-02-17",
    dateModified: "2026-09-23",
    readTime: "12 min",
    related: ["guide-creation-entreprise-2026", "guide-freelance-2026"],
  },
  {
    slug: "guide-freelance-2026",
    title: "Freelance en 2026 : calculer son TJM et facturer sans erreur",
    seoTitle: "Freelance 2026 : calculer son TJM et bien facturer",
    description:
      "Méthode pas à pas pour fixer un TJM rentable (jours facturables, charges, statut), mentions obligatoires des factures et calendrier de la facturation électronique.",
    category: "Business",
    keywords: [
      "calcul TJM freelance 2026",
      "TJM freelance",
      "jours facturables",
      "facture freelance mentions obligatoires",
      "facturation électronique 2026",
    ],
    datePublished: "2026-03-24",
    dateModified: "2026-09-23",
    readTime: "10 min",
    related: ["simulateur-auto-entrepreneur-2026", "guide-creation-entreprise-2026"],
  },
  {
    slug: "guide-impots-revenus-2026",
    title: "Impôt sur le revenu 2026 : barème, calcul pas à pas et leviers pour payer moins",
    seoTitle: "Impôt sur le revenu 2026 : barème et calcul pas à pas",
    description:
      "Barème 2026 (revenus 2025), quotient familial plafonné à 1 807 €, décote, prélèvement à la source, PFU 31,4 % : quatre foyers chiffrés pas à pas et les leviers légaux.",
    category: "Finance",
    keywords: [
      "impôt sur le revenu 2026",
      "barème impôt 2026",
      "calcul impôt revenus 2025",
      "quotient familial 2026",
      "décote 2026",
      "taux prélèvement à la source",
    ],
    datePublished: "2026-03-17",
    dateModified: "2026-09-23",
    readTime: "11 min",
    related: ["calculer-salaire-net-2026", "guide-epargne-investissement-2026", "simulateur-apl-2026"],
  },
  {
    slug: "calculer-salaire-net-2026",
    title: "Salaire brut en net 2026 : le calcul expliqué ligne par ligne",
    seoTitle: "Salaire brut en net 2026 : calcul et exemples",
    description:
      "Cotisations salariales, CSG/CRDS, net à payer, net imposable, prélèvement à la source : comment passer du brut au net en 2026, avec exemples au SMIC, à 3 000 € et pour un cadre à 4 500 €.",
    category: "Finance",
    keywords: [
      "salaire brut en net 2026",
      "calcul salaire net",
      "SMIC 2026 net",
      "net imposable",
      "cotisations salariales 2026",
    ],
    datePublished: "2026-02-10",
    dateModified: "2026-09-23",
    readTime: "9 min",
    related: ["guide-impots-revenus-2026", "simulateur-apl-2026"],
  },
  {
    slug: "guide-epargne-investissement-2026",
    title: "Où placer son épargne en 2026 : livrets, assurance-vie, PEA, PER comparés",
    seoTitle: "Où placer son épargne en 2026 : le comparatif",
    description:
      "Livret A à 1,7 %, LEP, assurance-vie, PEA, PER : rendement, fiscalité 2026 (PFU 31,4 %, exceptions à 17,2 %), plafonds et ordre de priorité pour placer son argent.",
    category: "Finance",
    keywords: [
      "où placer son argent 2026",
      "taux livret A 2026",
      "assurance-vie fiscalité 2026",
      "PEA 2026",
      "PER déduction",
      "flat tax 31,4",
      "prélèvements sociaux 17,2 % assurance-vie",
    ],
    datePublished: "2026-03-13",
    dateModified: "2026-09-23",
    readTime: "11 min",
    related: ["guide-impots-revenus-2026", "guide-immobilier-2026"],
  },
  {
    slug: "simulateur-apl-2026",
    title: "APL 2026 : conditions, calcul et montant selon votre loyer",
    seoTitle: "APL 2026 : conditions, calcul et montant",
    description:
      "Plafonds de loyer par zone, formule de calcul CAF, ressources des 12 derniers mois, étudiants, colocation : estimez vos APL 2026 avec des exemples chiffrés.",
    category: "Logement",
    keywords: [
      "APL 2026",
      "calcul APL",
      "plafond loyer APL 2026",
      "APL étudiant 2026",
      "revalorisation APL octobre 2026",
      "APL étudiant boursier",
    ],
    datePublished: "2026-02-20",
    dateModified: "2026-09-23",
    readTime: "9 min",
    related: ["calculer-salaire-net-2026", "guide-impots-revenus-2026"],
  },
];

/**
 * Articles retirés : slug -> cible de la redirection (chemin absolu).
 * Pages conservées comme redirections (GitHub Pages ne gère pas les 301).
 */
export const REDIRECTS: Record<string, string> = {
  "declaration-impots-2026": "/blog/guide-impots-revenus-2026",
  "freelance-sasu-micro-2026": "/blog/guide-creation-entreprise-2026",
  "simulateur-impot-societes-2026": "/blog/guide-creation-entreprise-2026",
  "guide-budget-quotidien": "/blog/guide-epargne-investissement-2026",
  "guide-outils-developpeur": "/categories/dev",
  "guide-outils-image-video": "/categories/image",
  "guide-sante-bien-etre": "/categories/sante",
  "guide-securite-numerique": "/categories/securite",
};

export function getArticle(slug: string): BlogArticle {
  const a = ARTICLES.find((x) => x.slug === slug);
  if (!a) throw new Error(`Article de blog inconnu : ${slug}`);
  return a;
}

/** Articles triés du plus récemment mis à jour / publié au plus ancien. */
export function sortedArticles(): BlogArticle[] {
  return [...ARTICLES].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
}

const MOIS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d === 1 ? "1er" : d} ${MOIS[m - 1]} ${y}`;
}
