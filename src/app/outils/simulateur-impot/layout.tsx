import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Impot Revenu 2026 - Bareme + TMI + Quotient",
  description:
    "Calculez votre impot sur le revenu 2026 instantanement : bareme officiel a jour, quotient familial, TMI, decote, plafonnement. Resultat detaille tranche par tranche, gratuit, sans inscription.",
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
    "simulateur impot facile",
    "calcul TMI",
    "quotient familial",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/simulateur-impot",
  },
  openGraph: {
    title: "Simulateur Impot Revenu 2026 - Bareme + TMI + Quotient",
    description:
      "Impot sur le revenu 2026 calcule en 1 clic. Bareme, TMI, decote et quotient familial.",
    url: "https://outilis.fr/outils/simulateur-impot",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
