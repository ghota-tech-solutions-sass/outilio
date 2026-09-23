import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur JSON / CSV en ligne - Gratuit",
  description:
    "Convertissez vos données entre JSON et CSV en un clic. Formatage automatique et téléchargement. Outil gratuit sans inscription.",
  keywords: [
    "convertisseur JSON CSV",
    "JSON to CSV",
    "CSV to JSON",
    "conversion donnees",
  ],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-json-csv" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
