import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de marge - Marge brute, taux de marge et markup",
  description:
    "Calculez votre marge commerciale, taux de marge et taux de markup. Prix d'achat, prix de vente, benefice. Calcul inverse inclus. Gratuit.",
  keywords: [
    "calculateur marge",
    "taux de marge",
    "marge commerciale",
    "calcul markup",
    "marge beneficiaire",
    "calculateur profit",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-marge" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
