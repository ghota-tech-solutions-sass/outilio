import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fusionneur PDF - Combiner des PDF en ligne gratuit",
  description:
    "Fusionnez plusieurs fichiers PDF en un seul document. Glissez-deposez, reordonnez, telechargez. 100% gratuit, traitement local.",
  keywords: [
    "fusionner pdf",
    "combiner pdf",
    "merger pdf",
    "assembler pdf",
    "pdf en ligne",
    "fusionneur pdf gratuit",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
