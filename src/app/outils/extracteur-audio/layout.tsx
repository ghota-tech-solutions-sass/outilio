import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extracteur Audio - Extraire l'audio d'une video en ligne gratuit",
  description:
    "Extrayez la piste audio de vos videos. Visualisation de la forme d'onde, telechargement en WebM. 100% gratuit, traitement local.",
  keywords: [
    "extraire audio video",
    "audio extractor",
    "video vers audio",
    "extraire son video",
    "convertir video audio",
    "extracteur audio gratuit",
  ],
  alternates: { canonical: "https://outilis.fr/outils/extracteur-audio" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
