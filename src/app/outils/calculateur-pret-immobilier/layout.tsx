import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Pret Immobilier 2026 - Mensualite + Amortissement | Outilis.fr",
  description:
    "Simulez votre pret immobilier 2026 : mensualite, assurance emprunteur, cout total des interets et tableau d'amortissement annuel. Regles HCSF 35 %, loi Lemoine et reperes taux a jour. Gratuit, instantane, sans inscription.",
  keywords: [
    "simulateur pret immobilier",
    "simulation pret immobilier",
    "calcul pret immobilier",
    "calcul mensualite",
    "calculette pret immobilier",
    "simulateur pret immobilier gratuit",
    "calcul emprunt immobilier",
    "calculatrice emprunt immobilier",
    "tableau amortissement",
    "taux pret immobilier 2026",
    "assurance emprunteur",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-pret-immobilier",
  },
  openGraph: {
    title: "Simulateur Pret Immobilier 2026 - Mensualite + Amortissement",
    description:
      "Mensualite, assurance, cout total des interets et tableau d'amortissement. Reperes HCSF et taux 2026.",
    url: "https://outilis.fr/outils/calculateur-pret-immobilier",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
