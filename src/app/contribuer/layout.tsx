import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribuer - Suggérez un outil ou contribuez au code",
  description:
    "Proposez de nouveaux outils pour Outilis.fr ou contribuez au code open source. Rejoignez la communauté et aidez à simplifier le quotidien de milliers de Français.",
  keywords: [
    "contribuer",
    "open source",
    "suggestion outil",
    "outilis",
    "github",
  ],
  alternates: { canonical: "https://outilis.fr/contribuer" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
