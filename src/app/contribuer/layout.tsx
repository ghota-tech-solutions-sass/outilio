import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribuer - Suggerez un outil ou contribuez au code",
  description:
    "Proposez de nouveaux outils pour Outilis.fr ou contribuez au code open source. Rejoignez la communaute et aidez a simplifier le quotidien de milliers de Francais.",
  keywords: [
    "contribuer",
    "open source",
    "suggestion outil",
    "outilis",
    "github",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
