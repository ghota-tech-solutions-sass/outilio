import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scanner de QR Code en ligne gratuit - Camera et Image",
  description:
    "Scannez des QR codes gratuitement depuis votre camera ou une image. Decodage instantane, historique des scans, ouverture de liens. 100% local, sans inscription.",
  keywords: [
    "scanner QR code",
    "lire QR code en ligne",
    "decoder QR code",
    "QR code camera",
    "scanner QR code image",
    "QR code gratuit",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
