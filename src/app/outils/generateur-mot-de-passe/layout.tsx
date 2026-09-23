import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de mot de passe sécurisé - Gratuit",
  description:
    "Générez des mots de passe sécurisés et personnalisables. Choisissez la longueur, les caractères et évaluez la force. 100% local et gratuit.",
  keywords: [
    "generateur mot de passe",
    "mot de passe securise",
    "password generator",
    "mot de passe fort",
  ],
  alternates: { canonical: "https://outilis.fr/outils/generateur-mot-de-passe" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
