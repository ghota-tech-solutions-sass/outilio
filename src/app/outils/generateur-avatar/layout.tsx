import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur d'Avatar Initiales - Gratuit",
  description:
    "Generez un avatar avec vos initiales. Cercle colore, plusieurs styles et couleurs. Telechargez en PNG gratuitement.",
  keywords: ["generateur avatar", "avatar initiales", "avatar texte", "image profil", "initiales PNG"],
  alternates: { canonical: "https://outilis.fr/outils/generateur-avatar" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
