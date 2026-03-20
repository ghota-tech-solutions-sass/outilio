import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur TDEE / Calories Journalieres - Gratuit",
  description:
    "Calculez votre depense energetique totale (TDEE) et vos besoins caloriques journaliers. Formule Mifflin-St Jeor, repartition macros. Outil gratuit.",
  keywords: ["calculateur TDEE", "calories journalieres", "depense energetique", "BMR", "metabolisme de base", "macros", "Mifflin-St Jeor"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
