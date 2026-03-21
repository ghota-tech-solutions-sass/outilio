import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur salaire net / brut 2026 - Gratuit",
  description:
    "Convertissez votre salaire brut en net instantanement. Cadre, non-cadre, fonction publique. Estimation de l'impot sur le revenu incluse. 100% gratuit.",
  keywords: [
    "salaire brut net",
    "calculateur salaire",
    "convertir brut en net",
    "salaire net",
    "simulation salaire",
    "charges salariales",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
