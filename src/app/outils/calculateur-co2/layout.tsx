import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Empreinte Carbone CO2 - Gratuit",
  description:
    "Estimez votre empreinte carbone : voiture, avion, train, energie domestique. Calculez vos emissions de CO2 et comparez les modes de transport.",
  keywords: ["calculateur CO2", "empreinte carbone", "emissions CO2", "bilan carbone", "transport ecologique"],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-co2" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
