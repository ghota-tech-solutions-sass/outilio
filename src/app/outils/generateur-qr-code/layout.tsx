import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de QR Code gratuit - Personnalisable",
  description:
    "Generez des QR codes gratuits et personnalisables. Couleurs, taille au choix. Telechargez en PNG. Pour URLs, texte, email, Wi-Fi.",
  keywords: [
    "generateur QR code",
    "QR code gratuit",
    "creer QR code",
    "QR code en ligne",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
