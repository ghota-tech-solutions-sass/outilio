import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur age de depart a la retraite - Gratuit",
  description:
    "Estimez votre age de depart a la retraite selon la reforme 2023. Calcul base sur votre annee de naissance et vos trimestres cotises.",
  keywords: ["age retraite", "depart retraite", "reforme retraite 2023", "calculateur retraite", "trimestres retraite"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
