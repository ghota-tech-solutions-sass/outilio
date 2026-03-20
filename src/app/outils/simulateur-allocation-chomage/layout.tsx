import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur allocation chomage (ARE) - Calcul gratuit",
  description:
    "Estimez votre allocation chomage ARE gratuitement. Salaire journalier de reference, duree d'indemnisation, montant mensuel. Calcul instantane et detaille.",
  keywords: ["simulateur chomage", "allocation chomage", "ARE", "calcul chomage", "indemnisation chomage", "pole emploi", "France Travail"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
