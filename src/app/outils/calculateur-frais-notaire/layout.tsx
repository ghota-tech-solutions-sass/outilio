import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur frais de notaire - Estimation gratuite",
  description:
    "Estimez vos frais de notaire pour un achat immobilier ancien ou neuf. Droits de mutation (DMTO), emoluments, debours. Baremes officiels 2025-2026 mis a jour.",
  keywords: [
    "frais de notaire",
    "calculateur frais notaire",
    "simulateur frais notaire",
    "droits de mutation",
    "DMTO",
    "emoluments notaire",
    "frais acquisition immobilier",
    "frais notaire ancien",
    "frais notaire neuf",
    "achat immobilier",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-frais-notaire" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
