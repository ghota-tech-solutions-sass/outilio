import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Réduire Taille Vidéo en Ligne Gratuit - Compresseur Vidéo",
  description:
    "Compressez vos vidéos en MP4 H.264 dans le navigateur avec FFmpeg : qualité (CRF) et résolution au choix, comparaison avant/après. Gratuit et 100% local.",
  keywords: [
    "reduire taille video",
    "compresser video",
    "compression video",
    "reduire taille video gratuit",
    "compresseur video en ligne",
    "reduire video en ligne",
    "compresser mp4",
    "compresser video gratuit",
  ],
  alternates: { canonical: "https://outilis.fr/outils/compresseur-video" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
