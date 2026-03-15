import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Date d'Accouchement - Gratuit",
  description:
    "Calculez votre date prevue d'accouchement. Semaine de grossesse, trimestre, etapes cles. A partir de vos dernieres regles.",
  keywords: ["calculateur grossesse", "date accouchement", "semaine grossesse", "DPA", "trimestre grossesse"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
