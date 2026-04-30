import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur d'email professionnel - Modeles gratuits",
  description:
    "Generez des emails professionnels en francais : relance, remerciement, demande de reunion, candidature, demission. Copiez et envoyez. Gratuit.",
  keywords: [
    "generateur email professionnel",
    "modele email",
    "email relance",
    "email remerciement",
    "email demission",
    "email professionnel gratuit",
  ],
  alternates: { canonical: "https://outilis.fr/outils/generateur-email-professionnel" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
