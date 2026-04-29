import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Alcoolemie Gratuit - Widmark, Limite 0,5 g/L | Outilis.fr",
  description:
    "Estimez votre taux d'alcoolemie avec la formule de Widmark : verres consommes, poids, sexe, temps ecoule. Reperes legaux 0,2 et 0,5 g/L, temps de retour a 0. Outil purement educatif.",
  keywords: [
    "calculateur alcoolemie",
    "taux alcool sang",
    "alcoolemie",
    "grammes alcool",
    "temps elimination alcool",
    "Widmark",
    "limite alcool conduite",
    "0.5 g/L",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-alcoolemie",
  },
  openGraph: {
    title: "Calculateur Alcoolemie Gratuit - Widmark, Limite 0,5 g/L",
    description:
      "Estimation educative du taux d'alcoolemie selon Widmark. Reperes legaux et temps de retour a zero.",
    url: "https://outilis.fr/outils/calculateur-alcoolemie",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
