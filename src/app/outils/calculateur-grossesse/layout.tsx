import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Date d'Accouchement Gratuit - DPA, SA, Trimestre",
  description:
    "Calculez votre date prévue d'accouchement (DPA) et suivez votre grossesse en semaines d'aménorrhée (SA). Échographies, étapes clés, règle de Naegele. Outil indicatif gratuit, sans inscription. Le suivi médical reste indispensable.",
  keywords: [
    "calculateur grossesse",
    "date accouchement",
    "semaine grossesse",
    "DPA",
    "trimestre grossesse",
    "regle de Naegele",
    "semaine amenorrhee",
    "calcul DPA",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-grossesse",
  },
  openGraph: {
    title: "Calculateur Date d'Accouchement Gratuit - DPA, SA, Trimestre",
    description:
      "Estimez la DPA et les étapes clés de votre grossesse selon la règle de Naegele. Indicatif, sans inscription.",
    url: "https://outilis.fr/outils/calculateur-grossesse",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
