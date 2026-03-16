import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";

export const dynamic = "force-static";

const BASE_URL = "https://outilis.fr";

const HIGH_PRIORITY_TOOLS = new Set([
  "/outils/calculateur-salaire",
  "/outils/simulateur-impot",
]);

const MEDIUM_PRIORITY_TOOLS = new Set([
  "/outils/calculateur-pret-immobilier",
  "/outils/freelance-vs-cdi",
  "/outils/calculateur-tva",
  "/outils/generateur-facture",
  "/outils/calculateur-rentabilite-locative",
  "/outils/calculateur-retraite",
]);

function getToolPriority(href: string): number {
  if (HIGH_PRIORITY_TOOLS.has(href)) return 0.9;
  if (MEDIUM_PRIORITY_TOOLS.has(href)) return 0.8;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/contribuer`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/comment-ca-marche`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}${tool.href}`,
    changeFrequency: "monthly",
    priority: getToolPriority(tool.href),
  }));

  return [...staticPages, ...toolPages];
}
