import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redimensionneur d'Image en Ligne - Gratuit",
  description:
    "Redimensionnez vos images en pixels ou pourcentage. Verrouillez le ratio, previsualisation en direct, telechargement instantane. 100% gratuit.",
  keywords: ["redimensionner image", "resize image", "changer taille image", "reduire image", "agrandir image"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
