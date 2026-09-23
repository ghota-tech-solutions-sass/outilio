import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de slug URL - Texte vers URL SEO-friendly",
  description:
    "Transformez n'importe quel texte en slug URL optimisé pour le SEO. Suppression des accents, caractères spéciaux, espaces en tirets. Gratuit.",
  keywords: [
    "generateur slug",
    "slug url",
    "url seo friendly",
    "convertir texte url",
    "generateur url",
    "slugify texte",
  ],
  alternates: { canonical: "https://outilis.fr/outils/generateur-slug" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
