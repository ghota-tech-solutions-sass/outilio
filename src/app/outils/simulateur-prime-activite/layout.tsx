import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur Prime d'Activité 2026 - Estimation Gratuite",
  description:
    "Estimez votre prime d'activité 2026 : montant forfaitaire, majoration parent isolé, bonification pour chaque membre du couple, forfait logement si aide au logement. Calcul instantané et gratuit.",
  keywords: [
    "prime d'activité",
    "simulateur prime d'activité",
    "calcul prime d'activité",
    "prime d'activité 2026",
    "CAF prime d'activité",
    "montant prime d'activité",
    "éligibilité prime d'activité",
    "prime d'activité parent isolé",
    "prime d'activité couple",
  ],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-prime-activite" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
