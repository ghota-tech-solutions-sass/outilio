import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur Mot de Passe Wi-Fi 2026 - Sécurisé + QR Code",
  description:
    "Créez un mot de passe Wi-Fi fort, prononçable ou aléatoire, en 1 clic. QR Code de partage instantané pour vos invités (iOS et Android). 100 % local, sans inscription, gratuit.",
  keywords: [
    "generateur de mot de passe wifi",
    "generateur mot de passe wifi",
    "mot de passe wifi",
    "mot de passe wifi securise",
    "qr code wifi",
    "password wifi generator",
    "mot de passe prononcable",
    "mot de passe wifi en ligne",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/generateur-mot-de-passe-wifi",
  },
  openGraph: {
    title: "Générateur Mot de Passe Wi-Fi 2026 - Sécurisé + QR Code",
    description:
      "Mot de passe Wi-Fi fort + QR Code de partage. 100 % local, sans inscription.",
    url: "https://outilis.fr/outils/generateur-mot-de-passe-wifi",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
