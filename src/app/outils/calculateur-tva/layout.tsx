import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur TVA 2026 - HT / TTC Instantane Gratuit",
  description:
    "Calculez la TVA en 1 seconde. Conversion HT en TTC et inversement, taux 20 %, 10 %, 5,5 %, 2,1 %. Reperes franchise en base, restauration, travaux, autoliquidation. Sans inscription.",
  keywords: [
    "calculateur TVA",
    "TVA",
    "HT TTC",
    "calcul TVA",
    "taux TVA France",
    "convertir HT en TTC",
    "convertir TTC en HT",
    "TVA 20",
    "TVA 10",
    "TVA 5.5",
    "TVA 2.1",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-tva",
  },
  openGraph: {
    title: "Calculateur TVA 2026 - HT / TTC Instantane",
    description:
      "Conversion HT/TTC instantanee, tous les taux francais. Pour entrepreneurs, comptables et freelances.",
    url: "https://outilis.fr/outils/calculateur-tva",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
