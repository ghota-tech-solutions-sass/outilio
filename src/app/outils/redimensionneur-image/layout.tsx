import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redimensionner Image en Ligne Gratuit - Sans Inscription",
  description:
    "Redimensionnez vos images en pixels ou pourcentage. Ratio verrouillable, previsualisation en direct, telechargement instantane. 100% gratuit.",
  keywords: [
    "redimensionner image en ligne",
    "redimensionner une image",
    "redimensionner image",
    "redimensionner image gratuit",
    "changer taille image",
    "reduire taille image en ligne",
    "redimensionner photo",
  ],
  alternates: { canonical: "https://outilis.fr/outils/redimensionneur-image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
