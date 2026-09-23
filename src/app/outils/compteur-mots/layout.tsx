import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compteur de mots et caractères en ligne - Gratuit",
  description:
    "Comptez les mots, caractères, phrases et paragraphes de vos textes. Temps de lecture et de parole estimés. Outil gratuit et instantané.",
  keywords: [
    "compteur de mots",
    "compteur caracteres",
    "compter mots",
    "nombre de mots",
    "word counter",
  ],
  alternates: { canonical: "https://outilis.fr/outils/compteur-mots" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
