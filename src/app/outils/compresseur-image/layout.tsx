import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compresser Image en Ligne Gratuit - JPEG, PNG, WebP",
  description:
    "Compressez vos images JPEG, PNG, WebP en ligne. Ajustez la qualite, comparez avant/apres. Telechargement instantane, gratuit et sans inscription.",
  keywords: [
    "compresser image en ligne",
    "compresser une image",
    "compression image",
    "compresseur image",
    "reduire taille image en ligne",
    "compresser photo",
    "logiciel compression photo gratuit",
  ],
  alternates: { canonical: "https://outilis.fr/outils/compresseur-image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
