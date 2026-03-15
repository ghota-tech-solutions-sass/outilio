import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de mot de passe WiFi - Securise et lisible",
  description:
    "Generez des mots de passe WiFi securises et faciles a retenir. Option prononcable, QR code pour partager facilement. 100% gratuit.",
  keywords: [
    "generateur mot de passe wifi",
    "mot de passe wifi securise",
    "qr code wifi",
    "password wifi generator",
    "mot de passe prononcable",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
