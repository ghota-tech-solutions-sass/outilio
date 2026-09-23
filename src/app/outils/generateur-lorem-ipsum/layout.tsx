import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de Lorem Ipsum - Texte factice gratuit",
  description:
    "Générez du texte Lorem Ipsum pour vos maquettes et projets. Paragraphes, mots ou phrases. Copie en un clic. Gratuit.",
  keywords: ["lorem ipsum", "generateur texte", "texte factice", "faux texte", "placeholder text"],
  alternates: { canonical: "https://outilis.fr/outils/generateur-lorem-ipsum" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
