import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de Base Numerique - Gratuit",
  description:
    "Convertissez entre decimal, binaire, octal et hexadecimal. Conversion bidirectionnelle instantanee entre bases de numeration.",
  keywords: ["convertisseur binaire", "decimal hexadecimal", "conversion base", "binaire decimal", "octal hexadecimal"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
