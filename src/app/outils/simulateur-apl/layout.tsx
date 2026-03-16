import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur APL 2026 - Estimation aide au logement gratuite",
  description:
    "Estimez votre aide personnalisee au logement (APL) gratuitement. Calcul par zone, composition du foyer et revenus. Baremes officiels 2025-2026 mis a jour.",
  keywords: [
    "simulateur APL",
    "aide personnalisee au logement",
    "calcul APL",
    "APL 2026",
    "estimation APL",
    "CAF APL",
    "aide au logement",
    "plafond loyer APL",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
