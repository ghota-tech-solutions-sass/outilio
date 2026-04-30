import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur TJM Freelance - Taux Journalier Moyen Gratuit",
  description:
    "Calculez votre TJM freelance ideal a partir de votre salaire net souhaite. Charges, conges, frais pro inclus. Outil gratuit et sans inscription.",
  keywords: [
    "calculateur TJM",
    "TJM freelance",
    "taux journalier moyen",
    "tarif freelance",
    "calcul TJM auto-entrepreneur",
    "taux horaire freelance",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-tjm-freelance" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
