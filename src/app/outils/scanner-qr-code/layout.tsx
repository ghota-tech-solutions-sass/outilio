import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scanner QR Code en Ligne Gratuit - Caméra + Image",
  description:
    "Scannez n'importe quel QR Code en ligne, depuis la caméra ou en chargeant une image. Décodage instantané, historique des scans, ouverture des liens en un clic. Traitement local, sans inscription.",
  keywords: [
    "scanner QR code",
    "lire QR code en ligne",
    "decoder QR code",
    "QR code camera",
    "scanner QR code image",
    "QR code gratuit",
    "scan QR code en ligne",
    "lecteur QR code",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/scanner-qr-code",
  },
  openGraph: {
    title: "Scanner QR Code en Ligne Gratuit - Caméra + Image",
    description:
      "Scan QR Code instantané via caméra ou image, sans installation. 100 % local et gratuit.",
    url: "https://outilis.fr/outils/scanner-qr-code",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
