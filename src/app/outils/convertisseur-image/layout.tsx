import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de Format Image - Gratuit",
  description:
    "Convertissez vos images entre PNG, JPEG, WebP et BMP. Comparaison des tailles avant/apres. 100% gratuit et en ligne.",
  keywords: ["convertisseur image", "PNG vers JPEG", "JPEG vers WebP", "convertir format image", "image converter"],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
