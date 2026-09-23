import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de texte stylisé - Bold, italic, monospace Unicode",
  description:
    "Convertissez votre texte en caractères Unicode stylisés : gras, italique, monospace, barré, bulle et plus. Copiez et collez partout. Gratuit.",
  keywords: [
    "texte stylise",
    "texte unicode",
    "generateur texte gras",
    "texte italique unicode",
    "texte barre",
    "texte bulle",
    "texte monospace",
  ],
  alternates: { canonical: "https://outilis.fr/outils/generateur-texte-stylise" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
