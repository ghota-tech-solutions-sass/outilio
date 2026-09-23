import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur d'épargne - Intérêts composés et projection",
  description:
    "Simulez la croissance de votre épargne avec les intérêts composés. Capital initial, versements mensuels, taux et durée. Graphique de projection gratuit.",
  keywords: [
    "calculateur epargne",
    "interets composes",
    "simulateur placement",
    "projection epargne",
    "rendement placement",
    "calculateur investissement",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-epargne" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
