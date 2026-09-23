import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testeur de Regex - Expressions régulières en ligne",
  description:
    "Testez vos expressions régulières en temps réel. Surlignage des correspondances, groupes de capture, drapeaux. Bibliothèque de patterns courants.",
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
