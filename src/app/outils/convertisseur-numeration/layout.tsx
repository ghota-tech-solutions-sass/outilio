import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de Base Numérique - Gratuit",
  description:
    "Convertissez entre décimal, binaire, octal et hexadécimal. Conversion bidirectionnelle instantanée entre bases de numération.",
  keywords: ["convertisseur binaire", "decimal hexadecimal", "conversion base", "binaire decimal", "octal hexadecimal"],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-numeration" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
