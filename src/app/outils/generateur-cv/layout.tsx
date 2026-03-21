import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de CV Gratuit en Ligne - PDF Sans Inscription",
  description:
    "Creez un CV professionnel en ligne gratuitement. Plusieurs modeles, export PDF instantane. Sans inscription ni paiement.",
  keywords: [
    "generateur de cv",
    "cv en ligne gratuit pdf",
    "generateur cv",
    "cv gratuit",
    "creer cv en ligne",
    "cv pdf gratuit",
    "modele cv",
    "faire un cv",
    "curriculum vitae",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
