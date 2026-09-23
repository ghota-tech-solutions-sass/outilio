import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur MaPrimeRénov’ 2026 : montant, plafonds, catégorie - Gratuit",
  description:
    "Simulez votre aide MaPrimeRénov’ 2026 : catégorie de revenus (bleu, jaune, violet, rose), forfaits pompe à chaleur depuis le 1er septembre 2026, rénovation d’ampleur, écrêtement et reste à charge. Gratuit.",
  keywords: [
    "simulateur maprimerenov",
    "simulateur maprimerenov 2026",
    "maprimerenov 2026",
    "plafond de ressources maprimerenov 2026",
    "maprimerenov pompe à chaleur montant",
    "maprimerenov rénovation d'ampleur",
    "maprimerenov par geste",
    "barème anah 2026",
    "aide rénovation énergétique",
  ],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-maprimerenov" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
