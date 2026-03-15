import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compteur de mots et caracteres en ligne - Gratuit",
  description:
    "Comptez les mots, caracteres, phrases et paragraphes de vos textes. Temps de lecture et de parole estimes. Outil gratuit et instantane.",
  keywords: [
    "compteur de mots",
    "compteur caracteres",
    "compter mots",
    "nombre de mots",
    "word counter",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
