import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur d'email professionnel - Modèles gratuits",
  description:
    "Générez des emails professionnels en français : relance, remerciement, prise de contact, demande de réunion, démission. Copiez et envoyez. Gratuit.",
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
