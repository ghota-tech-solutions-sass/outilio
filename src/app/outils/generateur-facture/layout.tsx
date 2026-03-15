import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de factures gratuit - PDF en ligne",
  description:
    "Creez des factures professionnelles gratuitement. Conforme a la legislation francaise. Generez et telechargez vos factures en PDF sans inscription.",
  keywords: [
    "generateur facture",
    "facture gratuite",
    "creer facture",
    "facture PDF",
    "modele facture",
    "auto-entrepreneur facture",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
