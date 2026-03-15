import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de Lorem Ipsum - Texte factice gratuit",
  description:
    "Generez du texte Lorem Ipsum pour vos maquettes et projets. Paragraphes, mots ou phrases. Copie en un clic. Gratuit.",
  keywords: ["lorem ipsum", "generateur texte", "texte factice", "faux texte", "placeholder text"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
