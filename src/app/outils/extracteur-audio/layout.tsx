import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extracteur Audio - Extraire l'audio d'une vidéo en ligne gratuit",
  description:
    "Extrayez la piste audio de vos vidéos (MP4, MOV, WebM, MKV) sans réencodage ou en MP3 / WAV, avec FFmpeg dans le navigateur. Gratuit, traitement 100% local.",
  keywords: [
    "extraire audio video",
    "audio extractor",
    "video vers audio",
    "extraire son video",
    "convertir video audio",
    "extracteur audio gratuit",
    "extraire mp3 video",
    "mp4 en mp3",
  ],
  alternates: { canonical: "https://outilis.fr/outils/extracteur-audio" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
