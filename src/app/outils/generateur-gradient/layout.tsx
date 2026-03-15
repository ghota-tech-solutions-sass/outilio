import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de gradient CSS - Degrades en ligne",
  description:
    "Creez des degrades CSS lineaires et radiaux. Choisissez les couleurs, l'angle, les stops. Apercu en direct et code CSS pret a copier.",
  keywords: [
    "gradient css",
    "generateur degrade",
    "css gradient generator",
    "degrade lineaire",
    "degrade radial",
    "background gradient",
    "css degrade",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
