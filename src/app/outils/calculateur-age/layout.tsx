import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur d'age exact - Annees, mois et jours",
  description:
    "Calculez votre age exact en annees, mois et jours. Decompte avant votre prochain anniversaire. Gratuit et instantane.",
  keywords: ["calculateur age", "calcul age exact", "age en jours", "prochain anniversaire", "combien de jours ai-je"],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-age" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
