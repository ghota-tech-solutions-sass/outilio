import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur d'inflation - Pouvoir d'achat dans le temps",
  description:
    "Calculez l'equivalent d'un montant dans le temps avec l'inflation francaise. Donnees IPC historiques. Pouvoir d'achat et depreciation. Gratuit.",
  keywords: [
    "calculateur inflation",
    "pouvoir achat",
    "inflation france",
    "equivalent euros",
    "depreciation monnaie",
    "indice prix consommation",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
