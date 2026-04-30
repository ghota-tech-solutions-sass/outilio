import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPE F ou G en 2026 : que faire avec un logement energivore ?",
  description:
    "Logement classe F ou G : interdiction de location, decote a la revente, MaPrimeRenov, travaux prioritaires. Le guide pour decider en 2026.",
  keywords: [
    "DPE F G 2026",
    "passoire thermique",
    "interdiction location DPE",
    "MaPrimeRenov 2026",
    "renovation energetique",
    "decote DPE F",
    "calendrier interdiction DPE",
  ],
  alternates: {
    canonical: "https://outilis.fr/blog/dpe-f-g-logement-energivore",
  },
  openGraph: {
    type: "article",
    title: "DPE F ou G en 2026 : que faire avec un logement energivore",
    description:
      "Calendrier d&apos;interdiction, MaPrimeRenov, decote a la revente : le guide complet pour decider.",
    url: "https://outilis.fr/blog/dpe-f-g-logement-energivore",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
