import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encodeur / Decodeur Base64 - Convertir texte en Base64",
  description:
    "Encodez du texte en Base64 ou decodez du Base64 en texte. Copie en un clic. Outil gratuit pour developpeurs.",
  keywords: [
    "encodeur base64",
    "decodeur base64",
    "base64 encode",
    "base64 decode",
    "convertir base64",
    "outil base64",
  ],
  alternates: { canonical: "https://outilis.fr/outils/encodeur-base64" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
