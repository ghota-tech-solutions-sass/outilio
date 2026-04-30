import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de Mot de Passe Prononcable - Gratuit",
  description:
    "Generez des mots de passe faciles a prononcer et retenir. Syllabes, indicateur de force. Securite et memorisation.",
  keywords: ["mot de passe prononcable", "password generator", "mot de passe memorable", "generateur mot de passe", "mot de passe facile"],
  alternates: { canonical: "https://outilis.fr/outils/generateur-mdp-prononcable" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
