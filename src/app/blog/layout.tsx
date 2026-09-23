import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog : guides argent, immobilier et entreprise",
  description:
    "Guides chiffrés et sourcés, à jour des règles 2026 : achat immobilier, PTZ, impôt sur le revenu, salaire net, épargne, APL, choix du statut et micro-entreprise.",
  keywords: [
    "guide achat immobilier 2026",
    "impôt sur le revenu 2026",
    "salaire brut en net 2026",
    "statut juridique 2026",
    "micro-entreprise 2026",
    "épargne 2026",
  ],
  alternates: { canonical: "https://outilis.fr/blog" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Outilis.fr",
    url: "https://outilis.fr/blog",
    title: "Blog Outilis.fr : guides argent, immobilier et entreprise",
    description:
      "Guides chiffrés et sourcés sur l’immobilier, la fiscalité, l’épargne et la création d’entreprise, à jour des règles 2026.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
