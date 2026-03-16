import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editeur Photo Avance - Courbes, Calques, Filtres VSCO",
  description:
    "Retouche photo avancee dans votre navigateur : courbes de luminosite, systeme de calques, 15 filtres VSCO/Instagram, histogramme temps reel, auto-enhance. 100% gratuit et local.",
  keywords: [
    "editeur photo",
    "retouche photo",
    "courbe luminosite",
    "calques photo",
    "filtre VSCO",
    "filtre Instagram",
    "histogramme",
    "photo editor",
    "retouche en ligne",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
