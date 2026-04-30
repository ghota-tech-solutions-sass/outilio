import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur PX / REM - Outil CSS gratuit",
  description:
    "Convertissez les pixels en rem et inversement. Taille de base personnalisable. Tableau de correspondances. Outil essentiel pour le responsive design.",
  keywords: [
    "px to rem",
    "rem to px",
    "convertisseur px rem",
    "css converter",
    "pixel rem",
    "responsive design",
    "taille police css",
  ],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-px-rem" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
