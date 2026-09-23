import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capacité d’emprunt 2026 : combien puis-je emprunter ? - Gratuit",
  description:
    "Calculez votre capacité d’emprunt immobilier 2026 selon la règle HCSF des 35 % (assurance comprise) : mensualité maximale, capital empruntable, budget total avec apport, frais de notaire, reste à vivre et sensibilité au taux et à la durée. Gratuit, sans inscription.",
  keywords: [
    "capacité d'emprunt",
    "calcul capacité d'emprunt",
    "simulateur capacité d'emprunt 2026",
    "combien puis-je emprunter",
    "combien emprunter avec 3000 euros par mois",
    "taux d'endettement 35 %",
    "règle HCSF",
    "reste à vivre",
    "budget achat immobilier",
  ],
  alternates: { canonical: "https://outilis.fr/outils/capacite-emprunt" },
  openGraph: {
    title: "Capacité d’emprunt 2026 : combien puis-je emprunter ?",
    description:
      "Mensualité maximale à 35 % d’endettement, capital empruntable, budget total et tableau de sensibilité taux/durée.",
    url: "https://outilis.fr/outils/capacite-emprunt",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
