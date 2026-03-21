import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Impot sur le Revenu 2026 - Calcul Gratuit",
  description:
    "Simulez votre impot sur le revenu 2026 gratuitement. Baremes a jour, quotient familial, TMI, decote. Resultat detaille et instantane, sans inscription.",
  keywords: [
    "simulateur impot",
    "simulateur impot gratuit",
    "calcul impot",
    "simulation impot 2026",
    "impot sur le revenu",
    "calcul impot revenu",
    "simulateur impot revenu",
    "bareme impot",
    "taux imposition",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
