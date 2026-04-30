import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testeur de vitesse de frappe - Test WPM gratuit",
  description:
    "Testez votre vitesse de frappe au clavier en francais. Mesurez vos mots par minute (WPM), votre precision et ameliorez votre dactylographie. Gratuit et sans inscription.",
  keywords: [
    "test vitesse frappe",
    "vitesse de frappe",
    "WPM",
    "mots par minute",
    "test dactylographie",
    "typing test",
    "test clavier",
    "vitesse clavier",
  ],
  alternates: { canonical: "https://outilis.fr/outils/testeur-vitesse-frappe" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
