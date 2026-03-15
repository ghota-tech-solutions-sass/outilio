import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur consommation essence - Cout trajet et L/100km",
  description:
    "Calculez votre consommation de carburant en L/100km, le cout par kilometre et estimez le budget essence de vos trajets. Gratuit et instantane.",
  keywords: [
    "calculateur consommation essence",
    "L/100km",
    "cout carburant",
    "cout trajet essence",
    "consommation voiture",
    "prix essence",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
