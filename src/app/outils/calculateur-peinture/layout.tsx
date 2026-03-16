import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de Peinture - Litres et Pots Necessaires - Gratuit",
  description:
    "Calculez la quantite de peinture necessaire pour votre piece. Surface murs et plafond, deduction portes et fenetres, nombre de pots. Outil gratuit et instantane.",
  keywords: [
    "calculateur peinture",
    "quantite peinture",
    "calcul peinture piece",
    "litres peinture",
    "nombre pots peinture",
    "surface murs peinture",
    "peinture metre carre",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
