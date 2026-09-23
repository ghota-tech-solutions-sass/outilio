import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur d'unités en ligne - Longueur, poids, température",
  description:
    "Convertissez entre unités de longueur, poids, température, surface et volume. Outil gratuit, instantané et sans inscription.",
  keywords: ["convertisseur unites", "conversion longueur", "conversion poids", "conversion temperature", "convertisseur mesures"],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-unites" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
