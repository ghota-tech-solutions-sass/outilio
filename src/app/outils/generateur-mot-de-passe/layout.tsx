import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de mot de passe securise - Gratuit",
  description:
    "Generez des mots de passe securises et personnalisables. Choisissez la longueur, les caracteres et evaluez la force. 100% local et gratuit.",
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
