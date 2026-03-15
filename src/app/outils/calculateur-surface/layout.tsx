import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de surface - Aire en m2 pour toutes les formes",
  description:
    "Calculez la surface en m2 de rectangles, cercles, triangles et trapezoides. Conversion en autres unites de surface. Gratuit et instantane.",
  keywords: [
    "calculateur surface",
    "calcul aire",
    "surface en m2",
    "calculateur aire piece",
    "surface rectangle cercle triangle",
    "conversion surface",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
