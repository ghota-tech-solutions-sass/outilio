import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Pret Immobilier 2026 - Calcul Mensualite Gratuit",
  description:
    "Simulez votre pret immobilier : mensualites, cout total et tableau d'amortissement detaille. Taux 2026 a jour. Gratuit et sans inscription.",
  keywords: [
    "simulateur pret immobilier",
    "simulation pret immobilier",
    "calcul pret immobilier",
    "calcul mensualite",
    "calculette pret immobilier",
    "simulateur pret immobilier gratuit",
    "calcul emprunt immobilier",
    "calculatrice emprunt immobilier",
    "tableau amortissement",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
