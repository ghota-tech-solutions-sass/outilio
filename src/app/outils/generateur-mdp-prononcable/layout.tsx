import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de Mot de Passe Prononçable - Gratuit",
  description:
    "Générez des mots de passe faciles à prononcer et retenir. Syllabes, indicateur de force. Sécurité et mémorisation.",
  keywords: ["mot de passe prononcable", "password generator", "mot de passe memorable", "generateur mot de passe", "mot de passe facile"],
  alternates: { canonical: "https://outilis.fr/outils/generateur-mdp-prononcable" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
