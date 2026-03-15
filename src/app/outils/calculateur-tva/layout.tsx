import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de TVA en ligne - HT / TTC gratuit",
  description:
    "Calculez la TVA instantanement. Convertissez HT en TTC et inversement. Taux 20%, 10%, 5.5%, 2.1%. Outil gratuit pour auto-entrepreneurs et entreprises.",
  keywords: ["calculateur TVA", "TVA", "HT TTC", "calcul TVA", "taux TVA France"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
