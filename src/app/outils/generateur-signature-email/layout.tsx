import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur Signature Email HTML 2026 - 3 Templates | Outilis.fr",
  description:
    "Creez une signature email HTML professionnelle en 30 secondes : 3 templates (classique, moderne, minimal), 7 couleurs, LinkedIn et Twitter inclus. Compatible Gmail, Outlook, Apple Mail. Code HTML pret a coller.",
  keywords: [
    "generateur de signature mail gratuit",
    "signature mail html gratuit",
    "generateur signature mail",
    "signature html gratuite",
    "signature email professionnelle",
    "html signature generator",
    "signature gmail",
    "signature outlook",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/generateur-signature-email",
  },
  openGraph: {
    title: "Generateur Signature Email HTML 2026 - 3 Templates",
    description:
      "Signature email HTML pro en 30 secondes. 3 templates, couleurs personnalisables, compatible Gmail, Outlook, Apple Mail.",
    url: "https://outilis.fr/outils/generateur-signature-email",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
