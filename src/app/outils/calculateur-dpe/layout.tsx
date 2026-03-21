import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur DPE Gratuit en Ligne - Diagnostic Energetique 2026",
  description:
    "Estimez la classe energetique de votre logement (DPE A a G). Consommation kWh/m2/an, emissions CO2, cout annuel. Gratuit et sans inscription.",
  keywords: [
    "simulateur dpe",
    "simulateur dpe gratuit",
    "dpe gratuit en ligne",
    "simulateur dpe en ligne",
    "simulation dpe",
    "dpe gratuit",
    "diagnostic performance energetique",
    "classe energetique",
    "calculateur dpe gratuit",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
