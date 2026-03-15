import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de mentions legales gratuit - RGPD conforme",
  description:
    "Generez des mentions legales conformes a la loi francaise et au RGPD pour votre site web. Gratuit, personnalisable, copie en un clic.",
  keywords: ["mentions legales", "generateur mentions legales", "RGPD", "mentions legales site web", "obligations legales site internet"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
