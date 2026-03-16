import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compresseur Video - Reduire la taille en ligne gratuit",
  description:
    "Compressez vos videos directement dans le navigateur. Choisissez la qualite, visualisez le gain de taille. 100% gratuit et local.",
  keywords: [
    "compresser video",
    "reduire taille video",
    "compresseur video en ligne",
    "video compressor",
    "compresser mp4",
    "reduire video gratuit",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
