import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparateur de texte - Diff en ligne gratuit",
  description:
    "Comparez deux textes et visualisez les differences ligne par ligne. Ajouts en vert, suppressions en rouge. Algorithme LCS. Outil gratuit sans inscription.",
  keywords: [
    "comparateur texte",
    "diff en ligne",
    "comparer deux textes",
    "differences texte",
    "text diff",
    "outil diff gratuit",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
