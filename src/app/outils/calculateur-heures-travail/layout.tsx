import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur d'heures de travail - Heures supplémentaires",
  description:
    "Calculez vos heures de travail, heures supplémentaires et totaux hebdomadaires. Outil gratuit pour salariés et employeurs.",
  keywords: ["calculateur heures travail", "heures supplementaires", "temps de travail", "calcul heures", "pointage heures"],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-heures-travail" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
