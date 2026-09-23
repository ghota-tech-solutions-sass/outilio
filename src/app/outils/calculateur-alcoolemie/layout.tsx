import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Alcoolémie Gratuit - Widmark, Limite 0,5 g/L",
  description:
    "Estimez votre taux d'alcoolémie avec la formule de Widmark : verres consommés, poids, sexe, temps écoulé. Repères légaux 0,2 et 0,5 g/L, temps de retour à 0. Outil purement éducatif.",
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
    title: "Calculateur Alcoolémie Gratuit - Widmark, Limite 0,5 g/L",
    description:
      "Estimation éducative du taux d'alcoolémie selon Widmark. Repères légaux et temps de retour à zéro.",
    url: "https://outilis.fr/outils/calculateur-alcoolemie",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
