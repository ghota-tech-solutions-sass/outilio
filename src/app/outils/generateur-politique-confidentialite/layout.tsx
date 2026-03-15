import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de politique de confidentialite gratuit - RGPD",
  description:
    "Generez une politique de confidentialite conforme au RGPD pour votre site web. Gratuit, personnalisable et copie en un clic.",
  keywords: ["politique de confidentialite", "generateur RGPD", "privacy policy", "protection donnees", "RGPD site web"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
