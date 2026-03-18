import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Guides et astuces",
  description:
    "Guides pratiques, astuces et actualites sur la finance, la fiscalite et les outils en ligne. Calcul de salaire, statut freelance, declaration d'impots et plus.",
  keywords: [
    "blog outils en ligne",
    "guide salaire net",
    "fiscalite freelance",
    "declaration impots 2026",
    "SASU vs micro-entreprise",
    "bareme impot 2026",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Outilis.fr",
    url: "https://outilis.fr/blog",
    title: "Blog Outilis.fr - Guides et astuces",
    description:
      "Guides pratiques sur la finance, la fiscalite et les outils en ligne.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
