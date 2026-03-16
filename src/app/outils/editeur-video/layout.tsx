import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editeur Video en ligne - Couper, convertir, GIF, redimensionner",
  description:
    "Editez vos videos directement dans le navigateur. Couper, convertir MP4/WebM, extraire GIF, redimensionner, capturer image, supprimer audio. 100% gratuit et local.",
  keywords: [
    "editeur video en ligne",
    "couper video",
    "convertir video",
    "extraire gif",
    "redimensionner video",
    "supprimer audio video",
    "video gratuit",
    "montage video navigateur",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
