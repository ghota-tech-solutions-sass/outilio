import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editeur Photo IA - Courbes, Calques, Filtres VSCO, Background Removal",
  description:
    "Retouche photo avancee avec IA dans votre navigateur : suppression arriere-plan, effet bokeh, super resolution, courbes de luminosite, calques, 15 filtres VSCO. 100% gratuit et local.",
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
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
