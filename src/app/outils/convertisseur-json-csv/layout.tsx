import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur JSON / CSV en ligne - Gratuit",
  description:
    "Convertissez vos donnees entre JSON et CSV en un clic. Formatage automatique et telechargement. Outil gratuit sans inscription.",
  keywords: [
    "convertisseur JSON CSV",
    "JSON to CSV",
    "CSV to JSON",
    "conversion donnees",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
