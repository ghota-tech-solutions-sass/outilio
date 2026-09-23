import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur allocation chômage (ARE) - Calcul gratuit",
  description:
    "Estimez votre allocation chômage ARE gratuitement. Salaire journalier de référence, durée d'indemnisation, montant mensuel. Calcul instantané et détaillé.",
  keywords: ["simulateur chomage", "allocation chomage", "ARE", "calcul chomage", "indemnisation chomage", "pole emploi", "France Travail"],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-allocation-chomage" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
