import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de remise et promotion - Prix apres reduction",
  description:
    "Calculez le prix apres remise, le montant economise et cumulez plusieurs reductions. Soldes, promotions, bons de reduction. Gratuit.",
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
