import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de Facture Gratuit en Ligne - PDF Instantané",
  description:
    "Créez des factures professionnelles en PDF gratuitement : mentions obligatoires françaises, franchise de TVA (art. 293 B), auto-entrepreneur et société. Sans inscription.",
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
