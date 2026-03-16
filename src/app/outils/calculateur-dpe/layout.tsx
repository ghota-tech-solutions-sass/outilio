import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur DPE - Diagnostic Performance Energetique Gratuit",
  description:
    "Estimez la classe energetique de votre logement (DPE A a G). Consommation kWh/m2/an, emissions CO2, cout annuel. Simulateur DPE gratuit en ligne.",
  keywords: [
    "DPE",
    "diagnostic performance energetique",
    "classe energetique",
    "consommation energetique",
    "passoire thermique",
    "etiquette energie",
    "kWh m2 an",
    "emission CO2 logement",
    "calculateur DPE gratuit",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
