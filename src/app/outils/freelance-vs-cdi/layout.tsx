import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparateur Freelance vs CDI - Simulateur gratuit",
  description:
    "Comparez le revenu net d'un freelance (micro-entreprise, SASU, EURL) vs un salarie CDI. TJM equivalent, charges, impots. Simulateur complet et gratuit.",
  keywords: ["freelance vs CDI", "comparateur freelance", "TJM equivalent salaire", "freelance ou salarie", "simulateur freelance"],
  alternates: { canonical: "https://outilis.fr/outils/freelance-vs-cdi" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
