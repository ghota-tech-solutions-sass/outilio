import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Indemnite Rupture Conventionnelle 2026 - Gratuit",
  description:
    "Calculez votre indemnite de rupture conventionnelle gratuitement. Indemnite legale, fiscalite, CSG/CRDS, IR. Simulateur mis a jour 2026.",
  keywords: ["rupture conventionnelle", "indemnite rupture conventionnelle", "simulateur rupture conventionnelle", "calcul indemnite licenciement", "indemnite legale", "CSG CRDS rupture"],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-rupture-conventionnelle" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
