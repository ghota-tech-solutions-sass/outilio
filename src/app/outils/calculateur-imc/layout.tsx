import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur IMC 2026 - Indice Masse Corporelle Gratuit",
  description:
    "Calculez votre IMC selon les normes OMS : 7 catégories (dénutrition à obésité morbide), fourchette de poids idéal, limites de l'indicateur expliquées. Outil de dépistage adultes 18-65 ans, indicatif. Sans inscription.",
  keywords: [
    "calcul imc",
    "calculateur imc",
    "imc calcul",
    "calculer imc",
    "imc gratuit",
    "indice masse corporelle",
    "calcul imc en ligne",
    "imc OMS",
    "poids ideal",
    "calculer imc gratuit",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-imc",
  },
  openGraph: {
    title: "Calculateur IMC 2026 - Indice Masse Corporelle Gratuit",
    description:
      "IMC selon normes OMS, 7 catégories, poids idéal pour votre taille. Outil indicatif gratuit.",
    url: "https://outilis.fr/outils/calculateur-imc",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
