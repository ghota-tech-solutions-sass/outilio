import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur robots.txt - Créer un fichier robots.txt valide",
  description:
    "Générez un fichier robots.txt valide pour votre site web. Bloquer des chemins, autoriser les robots, définir le sitemap. Gratuit.",
  keywords: [
    "generateur robots.txt",
    "robots txt generator",
    "fichier robots",
    "seo robots txt",
    "bloquer crawl",
    "sitemap robots",
  ],
  alternates: { canonical: "https://outilis.fr/outils/generateur-robots-txt" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
