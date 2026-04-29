import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Credit Auto 2026 - Mensualite et Amortissement",
  description:
    "Simulateur de credit auto gratuit : calculez la mensualite, le cout total des interets et le tableau d'amortissement. Reperes TAEG 2026, retractation 14 jours, LOA vs credit classique. Sans inscription.",
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
    title: "Simulateur Credit Auto 2026 - Mensualite et Amortissement",
    description:
      "Calcul mensualite, cout total et amortissement pour votre credit voiture. Reperes TAEG et conseils 2026.",
    url: "https://outilis.fr/outils/calculateur-pret-auto",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
