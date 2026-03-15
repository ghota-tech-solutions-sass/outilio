import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur impot sur le revenu 2024 - Calcul gratuit",
  description:
    "Simulez votre impot sur le revenu gratuitement. Bareme 2024, quotient familial, taux marginal d'imposition. Calcul instantane et detaille.",
  keywords: ["simulateur impot", "impot sur le revenu", "calcul impot", "bareme impot 2024", "taux imposition"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
