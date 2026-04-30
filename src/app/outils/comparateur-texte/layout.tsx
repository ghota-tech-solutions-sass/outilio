import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparateur de Texte en Ligne Gratuit - Diff Online",
  description:
    "Comparez deux textes et visualisez les differences instantanement. Ajouts en vert, suppressions en rouge. Diff en ligne gratuit, sans inscription.",
  keywords: [
    "comparateur de texte",
    "comparateur de texte gratuit",
    "diff en ligne",
    "diff online",
    "comparer deux textes",
    "comparer texte en ligne",
    "text diff",
    "outil diff gratuit",
  ],
  alternates: { canonical: "https://outilis.fr/outils/comparateur-texte" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
