import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulation Rachat de Credit 2026 - Calculatrice Regroupement Gratuite",
  description:
    "Simulez votre rachat de credit 2026 : comparez mensualites, calculez l'economie reelle apres frais (IRA + dossier), evaluez l'interet d'un regroupement de prets. Plusieurs credits cumulables, resultat instantane, sans inscription.",
  keywords: [
    "simulation rachat de credit",
    "rachat de credit simulation",
    "simulateur rachat credit",
    "rachat de credit",
    "regroupement de credits",
    "calculatrice rachat de credit",
    "rachat credit simulation",
    "simulation rachat credit gratuit",
    "calcul rachat credit",
    "rachat de credit 2026",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-rachat-credit",
  },
  openGraph: {
    title: "Simulation Rachat de Credit 2026 - Calculatrice Regroupement",
    description:
      "Comparez vos mensualites avant/apres rachat, frais inclus. Plusieurs credits cumulables. Gratuit, sans inscription.",
    url: "https://outilis.fr/outils/calculateur-rachat-credit",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
