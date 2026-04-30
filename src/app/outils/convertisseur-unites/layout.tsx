import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur d'unites en ligne - Longueur, poids, temperature",
  description:
    "Convertissez entre unites de longueur, poids, temperature, surface et volume. Outil gratuit, instantane et sans inscription.",
  keywords: ["convertisseur unites", "conversion longueur", "conversion poids", "conversion temperature", "convertisseur mesures"],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-unites" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
