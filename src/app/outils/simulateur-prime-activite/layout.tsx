import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Prime d'Activite 2026 - Estimation Gratuite",
  description:
    "Estimez votre prime d'activite 2026. Montant forfaitaire, majorations, bonification, forfait logement. Calcul instantane selon votre situation. Outil gratuit.",
  keywords: [
    "prime d'activite",
    "simulateur prime activite",
    "calcul prime activite",
    "prime activite 2026",
    "CAF prime activite",
    "montant prime activite",
    "eligibilite prime activite",
  ],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-prime-activite" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
