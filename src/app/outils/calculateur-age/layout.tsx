import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur d'âge exact - Années, mois et jours",
  description:
    "Calculez votre âge exact en années, mois et jours. Décompte avant votre prochain anniversaire. Gratuit et instantané.",
  keywords: ["calculateur age", "calcul age exact", "age en jours", "prochain anniversaire", "combien de jours ai-je"],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-age" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
