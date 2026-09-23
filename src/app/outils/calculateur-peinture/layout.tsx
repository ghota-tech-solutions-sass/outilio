import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de Peinture - Litres et Pots Nécessaires - Gratuit",
  description:
    "Calculez la quantité de peinture nécessaire pour votre pièce. Surface murs et plafond, déduction portes et fenêtres, nombre de pots. Outil gratuit et instantané.",
  keywords: [
    "calculateur peinture",
    "quantite peinture",
    "calcul peinture piece",
    "litres peinture",
    "nombre pots peinture",
    "surface murs peinture",
    "peinture metre carre",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-peinture" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
