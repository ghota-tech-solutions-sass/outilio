import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de gradient CSS - Dégradés en ligne",
  description:
    "Créez des dégradés CSS linéaires et radiaux. Choisissez les couleurs, l'angle, les stops. Aperçu en direct et code CSS prêt à copier.",
  keywords: [
    "gradient css",
    "generateur degrade",
    "css gradient generator",
    "degrade lineaire",
    "degrade radial",
    "background gradient",
    "css degrade",
  ],
  alternates: { canonical: "https://outilis.fr/outils/generateur-gradient" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
