import type { MetadataRoute } from "next";

const BASE_URL = "https://outilio.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "/outils/calculateur-salaire",
    "/outils/calculateur-pret-immobilier",
    "/outils/generateur-facture",
    "/outils/generateur-qr-code",
    "/outils/generateur-mot-de-passe",
    "/outils/compteur-mots",
    "/outils/convertisseur-json-csv",
  ];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: `${BASE_URL}${tool}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
