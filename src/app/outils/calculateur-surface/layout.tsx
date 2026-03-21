import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calcul Surface en m2 - Calculateur d'Aire Gratuit",
  description:
    "Calculez la surface en m2 de toutes les formes : rectangle, cercle, triangle, trapeze. Conversion d'unites incluse. Gratuit et sans inscription.",
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
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
