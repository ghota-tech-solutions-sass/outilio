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
const LAST_UPDATE = new Date("2026-03-21").toISOString();

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

  return [...staticPages, ...categoryPages, ...toolPages];
}
