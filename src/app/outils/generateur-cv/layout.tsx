import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de CV Gratuit en Ligne - PDF Sans Inscription",
  description:
    "Créez un CV professionnel en ligne gratuitement. 2 modèles (classique et moderne), export PDF A4 via l’impression du navigateur. Sans inscription ni paiement.",
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
  alternates: { canonical: "https://outilis.fr/outils/generateur-cv" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
