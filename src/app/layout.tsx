import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const displayFont = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Outilis.fr - Outils en ligne gratuits",
    template: "%s | Outilis.fr",
  },
  description:
    "Outils en ligne gratuits : calculateur salaire net/brut, simulateur pret immobilier, generateur de factures, QR codes, mots de passe et plus.",
  keywords: [
    "outils en ligne",
    "calculateur salaire",
    "salaire brut net",
    "simulateur pret",
    "generateur facture",
    "outils gratuits",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Outilis.fr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
