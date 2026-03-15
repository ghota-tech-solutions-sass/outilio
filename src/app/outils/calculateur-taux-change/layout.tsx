import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertisseur de devises - Taux de change EUR USD GBP CHF",
  description:
    "Convertissez entre les principales devises : EUR, USD, GBP, CHF, CAD, JPY, MAD, XOF. Taux de change indicatifs, conversion instantanee et gratuite.",
  keywords: [
    "convertisseur devises",
    "taux de change",
    "conversion euro dollar",
    "convertisseur monnaie",
    "EUR USD",
    "taux change CHF",
    "convertisseur XOF",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
