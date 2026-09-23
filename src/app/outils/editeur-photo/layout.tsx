import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Éditeur Photo IA - Courbes, Calques, Filtres VSCO, Background Removal",
  description:
    "Retouche photo avancée avec IA dans votre navigateur : suppression arrière-plan, effet bokeh, super-résolution, courbes de luminosité, calques, 15 filtres VSCO. 100% gratuit et local.",
  keywords: [
    "editeur photo ia",
    "retouche photo",
    "supprimer arriere plan",
    "background removal",
    "effet bokeh",
    "super resolution",
    "courbe luminosite",
    "calques photo",
    "filtre VSCO",
    "photo editor",
  ],
  alternates: { canonical: "https://outilis.fr/outils/editeur-photo" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
