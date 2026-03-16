import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de CV gratuit - Creez votre CV en ligne en PDF",
  description:
    "Creez un CV professionnel gratuitement en ligne. Choisissez parmi plusieurs modeles, remplissez vos informations et telechargez votre CV en PDF. Sans inscription.",
  keywords: [
    "generateur CV",
    "CV gratuit",
    "creer CV en ligne",
    "CV PDF",
    "modele CV",
    "curriculum vitae",
    "CV professionnel",
    "faire un CV",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
