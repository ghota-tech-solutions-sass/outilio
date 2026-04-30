import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Partage de Frais - Qui doit combien a qui ? Gratuit",
  description:
    "Partagez les frais equitablement entre amis, colocs ou collegues. Ajoutez les depenses, l'outil calcule qui doit rembourser qui. Gratuit et sans inscription.",
  keywords: [
    "partage de frais",
    "calculateur partage depenses",
    "qui doit combien a qui",
    "partage addition",
    "split expenses",
    "tricount",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-partage-frais" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
