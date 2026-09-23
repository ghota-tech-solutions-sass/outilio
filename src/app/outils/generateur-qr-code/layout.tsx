import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Générateur QR Code Gratuit 2026 - URL, Wi-Fi, vCard",
  description:
    "Créez un QR Code instantané : URL, réseau Wi-Fi, email, téléphone, SMS ou carte de visite vCard. Couleurs personnalisables, téléchargement PNG jusqu'à 1024 px. Sans inscription, sans limite, 100 % gratuit.",
  keywords: [
    "generateur QR code",
    "QR code gratuit",
    "creer QR code",
    "QR code en ligne",
    "QR code wifi",
    "QR code vcard",
    "QR code personnalise",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/generateur-qr-code",
  },
  openGraph: {
    title: "Générateur QR Code Gratuit - URL, Wi-Fi, vCard",
    description:
      "Créez un QR Code instantané pour URL, Wi-Fi, vCard, email. Personnalisable, sans inscription.",
    url: "https://outilis.fr/outils/generateur-qr-code",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
