import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Économie assurance emprunteur 2026 (loi Lemoine) - Gratuit",
  description:
    "Changer d’assurance de prêt immobilier : calculez l’économie réalisable avec la loi Lemoine. Coût restant de votre contrat, coût d’une délégation, gain total et par mois, conditions sans questionnaire de santé et délai de réponse de la banque. Gratuit, sans inscription.",
  keywords: [
    "changer d'assurance de prêt",
    "loi Lemoine",
    "économie assurance emprunteur",
    "simulateur assurance emprunteur",
    "délégation d'assurance",
    "résiliation assurance prêt immobilier",
    "questionnaire de santé loi Lemoine",
    "équivalence des garanties CCSF",
    "taux assurance emprunteur 2026",
  ],
  alternates: { canonical: "https://outilis.fr/outils/assurance-emprunteur" },
  openGraph: {
    title: "Économie assurance emprunteur 2026 (loi Lemoine)",
    description:
      "Combien pouvez-vous économiser en changeant d’assurance de prêt ? Coût restant, délégation, gain total et mensuel.",
    url: "https://outilis.fr/outils/assurance-emprunteur",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
