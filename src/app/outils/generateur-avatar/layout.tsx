import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur d'Avatar Initiales - Gratuit",
  description:
    "Générez un avatar avec vos initiales. Cercle coloré, plusieurs styles et couleurs. Téléchargez en PNG gratuitement.",
  keywords: ["generateur avatar", "avatar initiales", "avatar texte", "image profil", "initiales PNG"],
  alternates: { canonical: "https://outilis.fr/outils/generateur-avatar" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
