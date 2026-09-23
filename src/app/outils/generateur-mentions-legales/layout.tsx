import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur de mentions légales gratuit - Conforme LCEN 2026",
  description:
    "Générez les mentions légales de votre site (LCEN art. 1-1, loi SREN) : éditeur, directeur de la publication, hébergeur. Particulier, EI ou société. Gratuit, copie en un clic.",
  keywords: ["mentions legales", "generateur mentions legales", "RGPD", "mentions legales site web", "obligations legales site internet"],
  alternates: { canonical: "https://outilis.fr/outils/generateur-mentions-legales" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
