import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de Pourcentage 2026 - 3 Modes Gratuits | Outilis.fr",
  description:
    "3 modes de calcul de pourcentage : X % de Y, variation entre 2 valeurs, part en %. Pour remises, evolution de prix, conversion, repartition de budget. Pieges classiques expliques. Gratuit, sans inscription.",
  keywords: [
    "calculateur pourcentage",
    "pourcentage",
    "calcul pourcentage",
    "variation pourcentage",
    "calculer pourcentage",
    "calcul variation",
    "evolution pourcentage",
    "remise pourcentage",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-pourcentage",
  },
  openGraph: {
    title: "Calculateur de Pourcentage 2026 - 3 Modes Gratuits",
    description:
      "Pourcentage, variation et part en %. Pour remises, evolution, repartition. Calculs locaux gratuits.",
    url: "https://outilis.fr/outils/calculateur-pourcentage",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
