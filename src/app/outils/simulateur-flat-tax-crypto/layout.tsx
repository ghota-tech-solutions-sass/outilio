import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Flat Tax Crypto - Imposition Plus-Values France",
  description:
    "Calculez l'impot sur vos plus-values crypto en France. Flat tax 31,4% (PFU 2026), seuil 305 euros, IR et prelevements sociaux. Simulateur gratuit.",
  keywords: ["flat tax crypto 2026", "imposition crypto", "plus-value crypto", "PFU 31.4%", "fiscalite crypto France", "flat tax 31.4%", "prelevements sociaux"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
