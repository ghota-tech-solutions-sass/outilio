import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generateur de Signature Email HTML - Gratuit",
  description:
    "Creez une signature email professionnelle en HTML. Nom, poste, telephone, reseaux sociaux. Copiez le code HTML en un clic.",
  keywords: ["signature email", "generateur signature", "signature HTML", "signature professionnelle", "email signature"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
