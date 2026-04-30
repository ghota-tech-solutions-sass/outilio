import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PTZ 2026 : ce qui a change avec le nouveau dispositif elargi",
  description:
    "Le Pret a Taux Zero 2026 a ete elargi a toute la France. Quotites 50 % en collectif neuf, plafonds de revenus, conditions, exemples chiffres : tout savoir.",
  keywords: [
    "PTZ 2026",
    "pret a taux zero 2026",
    "primo accedant",
    "plafond ressources PTZ",
    "PTZ neuf collectif",
    "PTZ zone B2 C",
    "duree differe PTZ",
  ],
  alternates: {
    canonical: "https://outilis.fr/blog/ptz-2026-nouveautes",
  },
  openGraph: {
    type: "article",
    title: "PTZ 2026 : ce qui a change avec le nouveau dispositif elargi",
    description:
      "Le PTZ 2026 a ete elargi a toute la France. Quotites, plafonds, exemples concrets.",
    url: "https://outilis.fr/blog/ptz-2026-nouveautes",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
