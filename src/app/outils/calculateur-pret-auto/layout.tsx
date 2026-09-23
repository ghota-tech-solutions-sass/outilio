import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Crédit Auto 2026 - Mensualité et Amortissement",
  description:
    "Simulateur de crédit auto gratuit : calculez la mensualité, le coût total des intérêts et le tableau d'amortissement. Repères TAEG 2026, rétractation 14 jours, LOA vs crédit classique. Sans inscription.",
  keywords: [
    "calculateur pret auto",
    "credit voiture",
    "simulateur credit auto",
    "mensualite voiture",
    "tableau amortissement auto",
    "credit auto 2026",
    "credit affecte",
    "pret personnel",
    "TAEG auto",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-pret-auto",
  },
  openGraph: {
    title: "Simulateur Crédit Auto 2026 - Mensualité et Amortissement",
    description:
      "Calcul mensualité, coût total et amortissement pour votre crédit voiture. Repères TAEG et conseils 2026.",
    url: "https://outilis.fr/outils/calculateur-pret-auto",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
