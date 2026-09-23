import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de remise et promotion - Prix après réduction",
  description:
    "Calculez le prix après remise, le montant économisé et cumulez plusieurs réductions. Soldes, promotions, bons de réduction. Gratuit.",
  keywords: [
    "calculateur remise",
    "calculateur reduction",
    "prix apres remise",
    "calculateur soldes",
    "promotion pourcentage",
    "cumul reductions",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-remise" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
