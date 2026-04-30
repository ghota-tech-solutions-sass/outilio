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
  alternates: {
    canonical: "https://outilis.fr/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Outilis.fr",
    url: "https://outilis.fr",
    title: "Outilis.fr - Outils en ligne gratuits",
    description:
      "Calculateurs, generateurs et convertisseurs gratuits. 100% dans votre navigateur.",
    images: [
      {
        url: "https://outilis.fr/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Outilis.fr - 78 outils en ligne gratuits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Outilis.fr - Outils en ligne gratuits",
    description: "78 outils gratuits : calculateurs, generateurs, convertisseurs. 100% navigateur.",
    images: ["https://outilis.fr/og-image.svg"],
    creator: "@MickaelV79228",
  },
  metadataBase: new URL("https://outilis.fr"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="Index pour LLMs (llms.txt)" />
        <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Documentation complete pour LLMs" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2869830072536269"
          crossOrigin="anonymous"
        />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://outilis.fr/#website",
                  "name": "Outilis.fr",
                  "url": "https://outilis.fr",
                  "inLanguage": "fr-FR",
                  "description":
                    "88 outils en ligne 100 % gratuits, sans inscription : calculateurs, simulateurs, generateurs, convertisseurs. Tout dans le navigateur, donnees a jour 2026.",
                  "publisher": { "@id": "https://outilis.fr/#organization" },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://outilis.fr/?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "Organization",
                  "@id": "https://outilis.fr/#organization",
                  "name": "Outilis.fr",
                  "url": "https://outilis.fr",
                  "logo": "https://outilis.fr/og-image.svg",
                  "founder": {
                    "@type": "Person",
                    "name": "Mickael Villers",
                  },
                  "parentOrganization": {
                    "@type": "Organization",
                    "name": "Ghota Tech Solutions",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": "Lyon",
                      "addressCountry": "FR",
                    },
                  },
                  "sameAs": ["https://x.com/MickaelV79228"],
                },
              ],
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
