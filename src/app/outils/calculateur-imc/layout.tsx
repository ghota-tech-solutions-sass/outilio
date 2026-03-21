import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calcul IMC en Ligne Gratuit - Indice de Masse Corporelle",
  description:
    "Calculez votre IMC (Indice de Masse Corporelle) gratuitement. Interpretation selon les normes OMS, conseils personnalises. Rapide et sans inscription.",
  keywords: [
    "calcul imc",
    "calculateur imc",
    "imc calcul",
    "calculer imc",
    "imc gratuit",
    "indice masse corporelle",
    "calcul imc en ligne",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
