import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Alcoolemie - Gratuit",
  description:
    "Estimez votre taux d'alcoolemie. Nombre de verres, poids, sexe, duree. Temps de retour a zero. Outil educatif.",
  keywords: ["calculateur alcoolemie", "taux alcool sang", "alcoolemie", "grammes alcool", "temps elimination alcool"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
