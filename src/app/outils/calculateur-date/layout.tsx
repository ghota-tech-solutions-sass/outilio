import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de date en ligne - Jours entre deux dates",
  description:
    "Calculez le nombre de jours entre deux dates ou ajoutez/soustrayez des jours a une date. Outil gratuit, rapide et sans inscription.",
  keywords: ["calculateur date", "jours entre deux dates", "ajouter jours date", "difference dates", "calcul date"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
