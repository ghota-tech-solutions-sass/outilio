import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF vers Texte - Extracteur de texte PDF en ligne gratuit",
  description:
    "Extrayez les metadonnees et le contenu de vos PDF. Pages, auteur, date de creation. Telechargez des pages individuelles. Gratuit et 100% local.",
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
