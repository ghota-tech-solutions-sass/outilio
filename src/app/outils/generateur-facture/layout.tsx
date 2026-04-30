import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de Facture Gratuit en Ligne - PDF Instantane",
  description:
    "Creez des factures professionnelles en PDF gratuitement. Conforme a la legislation francaise, auto-entrepreneur et societe. Sans inscription.",
  keywords: [
    "generateur de facture",
    "generateur de facture gratuit",
    "generateur facture",
    "facture gratuite",
    "creer facture",
    "facture PDF",
    "facture en ligne gratuite",
    "auto-entrepreneur facture",
  ],
  alternates: { canonical: "https://outilis.fr/outils/generateur-facture" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
