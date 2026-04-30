import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rachat de credit immo 2026 : quand ca vaut vraiment le coup ?",
  description:
    "Ecart de taux minimum, frais de rachat, delai d&apos;amortissement, exemple chiffre. Le guide pour decider en 2026 si renegocier ou racheter votre pret.",
  keywords: [
    "rachat credit immobilier 2026",
    "renegociation pret immo",
    "ecart taux rachat",
    "indemnite remboursement anticipe",
    "delai amortissement frais",
    "loi Lemoine assurance",
  ],
  alternates: {
    canonical: "https://outilis.fr/blog/rachat-credit-immo-2026",
  },
  openGraph: {
    type: "article",
    title: "Rachat de credit immo 2026 : quand ca vaut vraiment le coup",
    description:
      "Calcul de l&apos;ecart minimum, exemples concrets et delai d&apos;amortissement.",
    url: "https://outilis.fr/blog/rachat-credit-immo-2026",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
