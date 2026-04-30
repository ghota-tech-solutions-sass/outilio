import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calcul Vitesse Distance Temps - Calculateur Gratuit",
  description:
    "Calculez vitesse, distance ou temps a partir de 2 valeurs. Conversions km/h, m/s, mph incluses. Gratuit et instantane, sans inscription.",
  keywords: [
    "calcul vitesse",
    "calcul vitesse km/h",
    "calculateur vitesse",
    "distance vitesse",
    "calcul de vitesse",
    "calculateur vitesse distance",
    "vitesse moyenne",
    "temps de parcours",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-vitesse" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
