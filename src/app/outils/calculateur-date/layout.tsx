import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de Date - Jours Entre 2 Dates, Ajouter Jours",
  description:
    "Calculez le nombre de jours, semaines, mois et années entre deux dates. Ajoutez ou soustrayez des jours, calculez vos délais (rétractation 14 jours, préavis, ancienneté). Format ISO et FR. Gratuit, sans inscription.",
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
      "Différence, addition et soustraction de jours entre deux dates. Délais juridiques, préavis, ancienneté.",
    url: "https://outilis.fr/outils/calculateur-date",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
