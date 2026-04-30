import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editeur Video en Ligne Gratuit - Couper, Convertir, Redimensionner",
  description:
    "Editez vos videos dans le navigateur : couper, convertir MP4/WebM, extraire GIF, redimensionner. 100% gratuit, local et sans inscription.",
  keywords: [
    "editeur video en ligne",
    "editer video en ligne",
    "redimensionner video en ligne",
    "couper video",
    "convertir video",
    "decoupeur video en ligne",
    "editeur video gratuit",
    "extraire gif",
    "montage video navigateur",
  ],
  alternates: { canonical: "https://outilis.fr/outils/editeur-video" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
