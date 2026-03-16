import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compresseur d'Image en Ligne - Gratuit",
  description:
    "Compressez vos images JPEG, PNG, WebP en ligne. Ajustez la qualite, comparez avant/apres, telechargez le resultat. 100% gratuit.",
  keywords: ["compresseur image", "compression image", "reduire taille image", "optimiser image", "JPEG compressor"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
