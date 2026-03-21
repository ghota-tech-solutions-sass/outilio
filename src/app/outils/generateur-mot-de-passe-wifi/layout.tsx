import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de Mot de Passe WiFi Gratuit et Securise",
  description:
    "Generez un mot de passe WiFi securise en 1 clic. Option prononcable, QR code pour partager avec vos invites. 100% gratuit, sans inscription.",
  keywords: [
    "generateur de mot de passe wifi",
    "generateur mot de passe wifi",
    "mot de passe wifi",
    "mot de passe wifi securise",
    "qr code wifi",
    "password wifi generator",
    "mot de passe prononcable",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
