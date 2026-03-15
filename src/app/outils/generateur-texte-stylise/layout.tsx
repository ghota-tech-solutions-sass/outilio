import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de texte stylise - Bold, italic, monospace Unicode",
  description:
    "Convertissez votre texte en caracteres Unicode stylises : gras, italique, monospace, barre, bulle et plus. Copiez et collez partout. Gratuit.",
  keywords: [
    "texte stylise",
    "texte unicode",
    "generateur texte gras",
    "texte italique unicode",
    "texte barre",
    "texte bulle",
    "texte monospace",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
