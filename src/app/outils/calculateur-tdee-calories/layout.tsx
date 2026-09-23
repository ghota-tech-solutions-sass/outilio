import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur TDEE / Calories Journalières - Gratuit",
  description:
    "Calculez votre dépense énergétique totale (TDEE) et vos besoins caloriques journaliers. Formule Mifflin-St Jeor, répartition macros. Outil gratuit.",
  keywords: ["calculateur TDEE", "calories journalieres", "depense energetique", "BMR", "metabolisme de base", "macros", "Mifflin-St Jeor"],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-tdee-calories" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
