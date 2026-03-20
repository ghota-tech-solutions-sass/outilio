import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Flat Tax Crypto - Imposition Plus-Values France",
  description:
    "Calculez l'impot sur vos plus-values crypto en France. Flat tax 30%, seuil 305 euros, IR et prelevements sociaux. Simulateur gratuit 2026.",
  keywords: ["flat tax crypto", "imposition crypto", "plus-value crypto", "PFU", "fiscalite crypto France", "30% crypto", "prelevements sociaux"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
