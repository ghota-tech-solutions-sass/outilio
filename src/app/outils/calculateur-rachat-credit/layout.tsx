import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulation Rachat de Crédit 2026 - Calculatrice Regroupement Gratuite",
  description:
    "Simulez votre rachat de crédit 2026 : comparez mensualités, calculez l'économie réelle après frais (IRA + dossier), évaluez l'intérêt d'un regroupement de prêts. Plusieurs crédits cumulables, résultat instantané, sans inscription.",
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
    title: "Simulation Rachat de Crédit 2026 - Calculatrice Regroupement",
    description:
      "Comparez vos mensualités avant/après rachat, frais inclus. Plusieurs crédits cumulables. Gratuit, sans inscription.",
    url: "https://outilis.fr/outils/calculateur-rachat-credit",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
