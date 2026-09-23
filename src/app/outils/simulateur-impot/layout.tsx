import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Impôt Revenu 2026 - Barème + TMI + Quotient",
  description:
    "Calculez votre impôt sur le revenu 2026 instantanément : barème officiel à jour, quotient familial, TMI, décote, plafonnement. Résultat détaillé tranche par tranche, gratuit, sans inscription.",
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
    title: "Simulateur Impôt Revenu 2026 - Barème + TMI + Quotient",
    description:
      "Impôt sur le revenu 2026 calculé en 1 clic. Barème, TMI, décote et quotient familial.",
    url: "https://outilis.fr/outils/simulateur-impot",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
