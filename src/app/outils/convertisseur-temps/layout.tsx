import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de temps - Secondes, minutes, heures, jours",
  description:
    "Convertissez entre secondes, minutes, heures, jours, semaines, mois et annees. Conversion bidirectionnelle instantanee. 100% gratuit.",
  keywords: [
    "convertisseur temps",
    "conversion heures minutes",
    "secondes en heures",
    "jours en semaines",
    "convertir duree",
    "calculateur temps",
  ],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-temps" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
