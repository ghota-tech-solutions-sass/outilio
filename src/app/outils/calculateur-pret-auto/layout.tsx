import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur pret auto - Simulateur credit voiture gratuit",
  description:
    "Calculez vos mensualites de credit auto, le cout total du pret et visualisez le tableau d'amortissement. Simulateur gratuit et instantane.",
  keywords: [
    "calculateur pret auto",
    "credit voiture",
    "simulateur credit auto",
    "mensualite voiture",
    "tableau amortissement auto",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
