import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de Tailles de Vetements - Gratuit",
  description:
    "Convertissez les tailles de vetements et chaussures entre EU, US et UK. Tableaux de correspondance homme et femme avec pointures.",
  keywords: [
    "convertisseur taille",
    "correspondance taille vetement",
    "taille EU US UK",
    "pointure chaussure",
    "taille americaine",
    "taille anglaise",
    "conversion taille homme femme",
    "guide des tailles",
  ],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-tailles" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
