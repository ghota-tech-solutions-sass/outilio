import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur âge de départ à la retraite - Gratuit",
  description:
    "Estimez votre âge de départ à la retraite selon la réforme 2023 et sa suspension (LFSS 2026). Calcul basé sur votre année de naissance et vos trimestres cotisés.",
  keywords: ["age retraite", "depart retraite", "reforme retraite 2023", "suspension reforme retraite 2026", "calculateur retraite", "trimestres retraite"],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-retraite" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
