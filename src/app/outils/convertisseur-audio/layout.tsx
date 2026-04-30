import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur Audio - Convertir MP3, WAV, OGG, AAC gratuit",
  description:
    "Convertissez vos fichiers audio entre MP3, WAV, OGG et AAC. Choix du bitrate, barre de progression, comparaison taille avant/apres. 100% gratuit, traitement local.",
  keywords: [
    "convertisseur audio",
    "convertir mp3",
    "convertir wav",
    "convertir ogg",
    "convertir aac",
    "audio converter",
    "convertir fichier audio",
    "convertisseur audio en ligne",
    "mp3 vers wav",
    "wav vers mp3",
  ],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-audio" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
