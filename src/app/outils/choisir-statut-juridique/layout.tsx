import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quel statut juridique choisir ? Comparateur micro, EI, EURL, SASU 2026",
  description:
    "Micro-entreprise, EI, EURL ou SASU ? Comparez cotisations, impôts, revenu net, protection sociale et coûts de création 2026, puis obtenez une recommandation personnalisée. Gratuit.",
  keywords: [
    "quel statut juridique choisir",
    "choisir statut juridique",
    "comparateur statut juridique",
    "micro-entreprise ou SASU",
    "EURL ou SASU",
    "statut juridique freelance",
    "coût création entreprise",
    "SASU ou micro-entreprise 2026",
    "EI ou EURL",
  ],
  alternates: { canonical: "https://outilis.fr/outils/choisir-statut-juridique" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
