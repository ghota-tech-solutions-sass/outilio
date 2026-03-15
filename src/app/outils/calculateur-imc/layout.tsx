import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur IMC (Indice de Masse Corporelle) - Gratuit",
  description:
    "Calculez votre IMC gratuitement. Interpretez votre indice de masse corporelle selon les normes OMS. Outil rapide et sans inscription.",
  keywords: ["calculateur IMC", "IMC", "indice masse corporelle", "poids ideal", "calcul IMC"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
