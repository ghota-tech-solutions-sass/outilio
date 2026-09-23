import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code couleur HEX RGB HSL - Convertisseur et tableau des couleurs",
  description:
    "Convertissez un code couleur HEX en RGB ou HSL (et inversement) instantanément. Color picker et tableau des codes couleur courants (rouge, bleu, vert...). Gratuit.",
  keywords: ["code couleur hex rgb", "convertisseur couleur", "hex en rgb", "rgb en hex", "RGB HSL", "color picker", "code couleur"],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-couleurs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
