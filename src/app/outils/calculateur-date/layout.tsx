import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de Date - Jours Entre 2 Dates, Ajouter Jours | Outilis.fr",
  description:
    "Calculez le nombre de jours, semaines, mois et annees entre deux dates. Ajoutez ou soustrayez des jours, calculez vos delais (retractation 14 jours, preavis, anciennete). Format ISO et FR. Gratuit, sans inscription.",
  keywords: [
    "calculateur date",
    "jours entre deux dates",
    "ajouter jours date",
    "difference dates",
    "calcul date",
    "delai retractation",
    "preavis location",
    "anciennete",
    "calcul echeance",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-date",
  },
  openGraph: {
    title: "Calculateur de Date - Jours Entre 2 Dates, Ajouter Jours",
    description:
      "Difference, addition et soustraction de jours entre deux dates. Delais juridiques, preavis, anciennete.",
    url: "https://outilis.fr/outils/calculateur-date",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
