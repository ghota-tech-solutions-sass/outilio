import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Flat Tax Crypto 2026 - Imposition Plus-Values France",
  description:
    "Calculez l'impot sur vos plus-values crypto en France. Flat tax 30% (PFU 2026 : 12,8% IR + 17,2% PS), seuil 305 euros. Simulateur gratuit.",
  keywords: ["flat tax crypto 2026", "imposition crypto", "plus-value crypto", "PFU 30%", "fiscalite crypto France", "flat tax 30%", "prelevements sociaux"],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-flat-tax-crypto" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
