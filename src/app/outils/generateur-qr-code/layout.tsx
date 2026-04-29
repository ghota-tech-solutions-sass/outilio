import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur QR Code Gratuit 2026 - URL, Wi-Fi, vCard | Outilis.fr",
  description:
    "Creez un QR Code instantane : URL, reseau Wi-Fi, email, telephone, SMS ou carte de visite vCard. Couleurs personnalisables, telechargement PNG jusqu'a 1024 px. Sans inscription, sans limite, 100 % gratuit.",
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
    title: "Generateur QR Code Gratuit - URL, Wi-Fi, vCard",
    description:
      "Creez un QR Code instantane pour URL, Wi-Fi, vCard, email. Personnalisable, sans inscription.",
    url: "https://outilis.fr/outils/generateur-qr-code",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
