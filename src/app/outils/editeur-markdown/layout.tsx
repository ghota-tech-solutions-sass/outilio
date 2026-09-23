import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Éditeur Markdown en ligne - Preview HTML en temps réel gratuit",
  description:
    "Éditeur Markdown avec preview HTML en temps réel. Toolbar de formatage, export HTML et .md, compteur de mots. 100% gratuit, sans inscription, traitement local.",
  keywords: [
    "editeur markdown",
    "markdown en ligne",
    "markdown preview",
    "markdown to html",
    "editeur markdown gratuit",
    "convertisseur markdown html",
    "markdown live preview",
  ],
  alternates: { canonical: "https://outilis.fr/outils/editeur-markdown" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
