import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";

export const dynamic = "force-static";

const BASE_URL = "https://outilis.fr";

const HIGH_PRIORITY_TOOLS = new Set([
  "/outils/calculateur-salaire",
  "/outils/simulateur-impot",
  "/outils/simulateur-apl",
  "/outils/calculateur-imc",
  "/outils/comparateur-texte",
  "/outils/simulateur-auto-entrepreneur",
]);

const MEDIUM_PRIORITY_TOOLS = new Set([
  "/outils/calculateur-pret-immobilier",
  "/outils/freelance-vs-cdi",
  "/outils/calculateur-tva",
  "/outils/generateur-facture",
  "/outils/calculateur-rentabilite-locative",
  "/outils/calculateur-retraite",
  "/outils/calculateur-rachat-credit",
  "/outils/calculateur-surface",
  "/outils/editeur-video",
  "/outils/redimensionneur-image",
  "/outils/generateur-signature-email",
  "/outils/compresseur-image",
  "/outils/generateur-cv",
  "/outils/calculateur-dpe",
  "/outils/calculateur-beton",
  "/outils/compresseur-video",
  "/outils/generateur-mot-de-passe-wifi",
]);

function getToolPriority(href: string): number {
  if (HIGH_PRIORITY_TOOLS.has(href)) return 0.9;
  if (MEDIUM_PRIORITY_TOOLS.has(href)) return 0.8;
  return 0.7;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function getUniqueCategories(): string[] {
  const seen = new Set<string>();
  for (const t of tools) {
    seen.add(slugify(t.category));
  }
  return Array.from(seen);
}

// Date of last major update (used as lastmod for all pages)
const LAST_UPDATE = new Date("2026-04-30").toISOString();

const BLOG_ARTICLES: { slug: string; date: string }[] = [
  { slug: "declaration-impots-2026", date: "2026-02-03" },
  { slug: "freelance-sasu-micro-2026", date: "2026-02-06" },
  { slug: "calculer-salaire-net-2026", date: "2026-02-10" },
  { slug: "simulateur-impot-societes-2026", date: "2026-02-13" },
  { slug: "simulateur-auto-entrepreneur-2026", date: "2026-02-17" },
  { slug: "simulateur-apl-2026", date: "2026-02-20" },
  { slug: "guide-securite-numerique", date: "2026-02-24" },
  { slug: "guide-outils-image-video", date: "2026-02-27" },
  { slug: "guide-sante-bien-etre", date: "2026-03-03" },
  { slug: "guide-outils-developpeur", date: "2026-03-06" },
  { slug: "guide-budget-quotidien", date: "2026-03-10" },
  { slug: "guide-epargne-investissement-2026", date: "2026-03-13" },
  { slug: "guide-impots-revenus-2026", date: "2026-03-17" },
  { slug: "guide-creation-entreprise-2026", date: "2026-03-20" },
  { slug: "guide-freelance-2026", date: "2026-03-24" },
  { slug: "guide-immobilier-2026", date: "2026-03-27" },
  { slug: "ptz-2026-nouveautes", date: "2026-04-30" },
  { slug: "dpe-f-g-logement-energivore", date: "2026-04-30" },
  { slug: "rachat-credit-immo-2026", date: "2026-04-30" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: LAST_UPDATE,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/contribuer`,
      lastModified: LAST_UPDATE,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/comment-ca-marche`,
      lastModified: LAST_UPDATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: LAST_UPDATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = getUniqueCategories().map(
    (slug) => ({
      url: `${BASE_URL}/categories/${slug}`,
      lastModified: LAST_UPDATE,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}${tool.href}`,
    lastModified: LAST_UPDATE,
    changeFrequency: "monthly",
    priority: getToolPriority(tool.href),
  }));

  const blogIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: LAST_UPDATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = BLOG_ARTICLES.map(({ slug, date }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(date).toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogIndex, ...blogPages, ...categoryPages, ...toolPages];
}
