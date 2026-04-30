import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Optimiseur JSON - Formatter, valider et minifier du JSON",
  description:
    "Formatez, validez et minifiez du JSON en ligne. Indentation personnalisable, tri des cles, coloration syntaxique. Outil gratuit pour developpeurs.",
  keywords: [
    "json formatter",
    "json validator",
    "json minifier",
    "formater json",
    "valider json",
    "minifier json",
    "json en ligne",
  ],
  alternates: { canonical: "https://outilis.fr/outils/optimiseur-json" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
