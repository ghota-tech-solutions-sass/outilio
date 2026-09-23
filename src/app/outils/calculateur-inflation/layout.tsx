import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur d'inflation - Pouvoir d'achat dans le temps",
  description:
    "Calculez l'équivalent d'un montant dans le temps avec l'inflation française. Données IPC historiques. Pouvoir d'achat et dépréciation. Gratuit.",
  keywords: [
    "calculateur inflation",
    "pouvoir achat",
    "inflation france",
    "equivalent euros",
    "depreciation monnaie",
    "indice prix consommation",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-inflation" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
