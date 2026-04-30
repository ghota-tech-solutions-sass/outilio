import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur rentabilite locative - Simulation gratuite",
  description:
    "Calculez la rentabilite brute et nette de votre investissement locatif. Rendement, cashflow, effort d'epargne. Simulateur immobilier gratuit.",
  keywords: ["rentabilite locative", "rendement locatif", "investissement locatif", "simulateur immobilier", "cashflow immobilier"],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-rentabilite-locative" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
