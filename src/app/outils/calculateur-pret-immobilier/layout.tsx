import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur pret immobilier - Calcul mensualites gratuit",
  description:
    "Calculez vos mensualites de pret immobilier, le cout total du credit et visualisez le tableau d'amortissement. Simulateur gratuit et instantane.",
  keywords: [
    "simulateur pret immobilier",
    "calcul mensualite",
    "pret immobilier",
    "tableau amortissement",
    "taux immobilier",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
