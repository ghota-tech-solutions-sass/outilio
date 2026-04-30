import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de Pourboire - Gratuit",
  description:
    "Calculez le pourboire ideal. Montant de l'addition, pourcentage, nombre de personnes. Pourboire et total par personne.",
  keywords: ["calculateur pourboire", "tip calculator", "pourboire restaurant", "partage addition", "calcul pourboire"],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-pourboire" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
