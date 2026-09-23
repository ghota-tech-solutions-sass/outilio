import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calcul Surface en m² - Calculateur d'Aire Gratuit",
  description:
    "Calculez la surface en m² de toutes les formes : rectangle, cercle, triangle, trapèze. Conversion d'unités incluse. Gratuit et sans inscription.",
  keywords: [
    "calcul surface",
    "calcul m2",
    "calcule m2",
    "surface aire",
    "calcul surface m2",
    "calculateur surface",
    "calcul metre carre",
    "calculer surface en m2",
    "surface en m2",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-surface" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
