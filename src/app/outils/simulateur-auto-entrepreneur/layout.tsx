import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Auto-Entrepreneur 2026 - Charges et Revenu Net",
  description:
    "Calculez vos charges auto-entrepreneur 2026 : cotisations, impot, CFP, CFE. Taux a jour, ACRE, versement liberatoire. Gratuit et sans inscription.",
  keywords: [
    "simulateur auto entrepreneur",
    "simulation auto entrepreneur",
    "simulateur auto-entrepreneur",
    "charges auto entrepreneur",
    "calculatrice auto entrepreneur",
    "simulateur micro entreprise",
    "charges micro-entreprise",
    "ACRE",
    "revenu net auto-entrepreneur",
  ],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-auto-entrepreneur" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
