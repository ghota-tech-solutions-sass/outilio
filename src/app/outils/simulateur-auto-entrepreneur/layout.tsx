import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur charges auto-entrepreneur 2026 - Calcul gratuit",
  description:
    "Calculez vos charges de micro-entrepreneur : cotisations sociales, impot sur le revenu, CFP, CFE. Taux 2025-2026 a jour, ACRE, versement liberatoire. Resultat instantane.",
  keywords: [
    "simulateur auto-entrepreneur",
    "charges micro-entreprise",
    "cotisations sociales auto-entrepreneur",
    "ACRE",
    "versement liberatoire",
    "simulateur micro-entreprise",
    "revenu net auto-entrepreneur",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
