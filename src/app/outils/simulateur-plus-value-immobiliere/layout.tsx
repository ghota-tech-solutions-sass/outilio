import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Plus-Value Immobilière - Calcul IR, PS, Surtaxe - Gratuit",
  description:
    "Calculez la plus-value immobilière sur la vente de votre bien. Abattements par durée de détention, impôt sur le revenu, prélèvements sociaux et surtaxe. Outil gratuit et sans inscription.",
  keywords: [
    "plus-value immobiliere",
    "simulateur plus-value",
    "calcul plus-value immobiliere",
    "abattement plus-value",
    "impot plus-value",
    "prelevements sociaux immobilier",
    "surtaxe plus-value",
  ],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-plus-value-immobiliere" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
