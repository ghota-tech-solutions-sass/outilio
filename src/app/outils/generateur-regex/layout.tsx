import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testeur de Regex - Expressions regulieres en ligne",
  description:
    "Testez vos expressions regulieres en temps reel. Surlignage des correspondances, groupes de capture, drapeaux. Bibliotheque de patterns courants.",
  keywords: [
    "regex tester",
    "testeur regex",
    "expression reguliere",
    "regexp en ligne",
    "regex online",
    "regex pattern",
    "expression reguliere test",
  ],
  alternates: { canonical: "https://outilis.fr/outils/generateur-regex" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
