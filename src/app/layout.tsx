import type { Metadata } from "next";
import Script from "next/script";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientProviders from "@/components/ClientProviders";
import "./globals.css";

const GA_ID = "G-GPSSC5CMYK";

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
    title: "Outilis.fr - 40+ outils en ligne gratuits",
    description:
      "Calculateurs, generateurs et convertisseurs gratuits. 100% dans votre navigateur.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Outilis.fr",
              "url": "https://outilis.fr",
              "description": "Outils en ligne gratuits : calculateurs, generateurs et convertisseurs.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://outilis.fr/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className={`${displayFont.variable} ${bodyFont.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ClientProviders />
      </body>
    </html>
  );
}
