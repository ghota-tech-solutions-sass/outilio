import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de politique de confidentialité gratuit - RGPD",
  description:
    "Générez une politique de confidentialité pour votre site : informations de l'article 13 du RGPD, bases légales, cookies selon la CNIL, transferts hors UE. Gratuit, copie en un clic.",
  keywords: ["politique de confidentialite", "generateur RGPD", "privacy policy", "protection donnees", "RGPD site web"],
  alternates: { canonical: "https://outilis.fr/outils/generateur-politique-confidentialite" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
