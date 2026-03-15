import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Volume de Beton - Gratuit",
  description:
    "Calculez le volume de beton necessaire en m3. Dalle, fondation, poteau. Nombre de sacs 25kg et 35kg. Outil gratuit pour vos travaux.",
  keywords: ["calculateur beton", "volume beton", "nombre sacs beton", "dalle beton", "quantite beton"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
