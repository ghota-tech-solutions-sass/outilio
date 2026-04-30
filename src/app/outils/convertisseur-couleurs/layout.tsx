import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de couleurs HEX RGB HSL - Gratuit",
  description:
    "Convertissez vos couleurs entre HEX, RGB et HSL instantanement. Color picker inclus. Outil gratuit pour designers et developpeurs.",
  keywords: ["convertisseur couleur", "HEX RGB", "RGB HSL", "color picker", "code couleur"],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-couleurs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
