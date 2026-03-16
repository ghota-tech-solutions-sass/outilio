import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editeur Photo en Ligne - Gratuit",
  description:
    "Editez vos photos : luminosite, contraste, saturation, flou, niveaux de gris, sepia, inversion, rotation teinte. Telechargez le resultat. 100% gratuit.",
  keywords: ["editeur photo", "retouche photo", "filtre photo", "editeur image en ligne", "photo editor"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
