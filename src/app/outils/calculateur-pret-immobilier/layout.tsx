import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Prêt Immobilier 2026 - Mensualité + Amortissement",
  description:
    "Simulez votre prêt immobilier 2026 : mensualité, assurance emprunteur, coût total des intérêts et tableau d'amortissement annuel. Règles HCSF 35 %, loi Lemoine et repères taux à jour. Gratuit, instantané, sans inscription.",
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
    title: "Simulateur Prêt Immobilier 2026 - Mensualité + Amortissement",
    description:
      "Mensualité, assurance, coût total des intérêts et tableau d'amortissement. Repères HCSF et taux 2026.",
    url: "https://outilis.fr/outils/calculateur-pret-immobilier",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
