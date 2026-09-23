import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF vers Texte - Extracteur de texte PDF en ligne gratuit",
  description:
    "Extrayez le texte de vos PDF (copie ou fichier .txt), consultez les métadonnées (pages, auteur, date de création) et téléchargez des pages individuelles. Gratuit et 100% local.",
  keywords: [
    "pdf vers texte",
    "extraire texte pdf",
    "convertir pdf texte",
    "pdf text extractor",
    "metadonnees pdf",
    "pdf en ligne gratuit",
  ],
  alternates: { canonical: "https://outilis.fr/outils/pdf-vers-texte" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
