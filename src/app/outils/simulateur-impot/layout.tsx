import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur impot sur le revenu - Calcul gratuit",
  description:
    "Simulez votre impot sur le revenu gratuitement. Baremes mis a jour chaque annee, quotient familial, taux marginal d'imposition. Calcul instantane et detaille.",
  keywords: ["simulateur impot", "impot sur le revenu", "calcul impot", "bareme impot", "taux imposition"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
