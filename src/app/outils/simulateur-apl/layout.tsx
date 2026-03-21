import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulation APL 2026 - Simulateur Aide au Logement Gratuit",
  description:
    "Estimez vos APL 2026 gratuitement. Calcul selon votre zone, loyer, revenus et composition du foyer. Baremes CAF officiels a jour. Sans inscription.",
  keywords: [
    "simulation apl",
    "simulateur apl",
    "simulation apl 2026",
    "apl simulation",
    "simulateur apl 2026",
    "estimation apl",
    "calcul apl",
    "aide au logement",
    "CAF APL",
    "apl 2026 montant",
    "aide personnalisee au logement",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
