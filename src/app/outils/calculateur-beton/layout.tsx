import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calcul Beton - Volume m3 et Nombre de Sacs Gratuit",
  description:
    "Calculez le volume de beton en m3 pour dalle, fondation ou poteau. Nombre de sacs 25kg et 35kg. Outil gratuit pour vos travaux, sans inscription.",
  keywords: [
    "calcul beton",
    "cubage beton",
    "calcul m3 beton",
    "calcul volume beton",
    "quantite beton",
    "calculer beton",
    "calcul dalle beton",
    "calculateur beton",
    "nombre sacs beton",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-beton" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
