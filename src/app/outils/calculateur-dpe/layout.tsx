import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur DPE Gratuit en Ligne - Diagnostic Énergétique 2026",
  description:
    "Estimez la classe énergétique de votre logement (DPE A à G). Consommation kWh/m²/an, émissions CO2, coût annuel. Gratuit et sans inscription.",
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
  alternates: { canonical: "https://outilis.fr/outils/calculateur-dpe" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
