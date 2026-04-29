import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Consommation Essence 2026 - L/100km, Cout Trajet",
  description:
    "Calculez votre consommation reelle en L/100 km et estimez le cout de vos trajets : Lyon-Paris, Marseille-Lille... Conseils eco-conduite (-25 % de consommation), bareme indicatif. Gratuit, sans inscription.",
  keywords: [
    "calculateur consommation essence",
    "L/100km",
    "cout carburant",
    "cout trajet essence",
    "consommation voiture",
    "prix essence",
    "calcul consommation gazole",
    "eco conduite",
    "covoiturage prix",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-consommation-essence",
  },
  openGraph: {
    title: "Calculateur Consommation Essence 2026 - L/100km, Cout Trajet",
    description:
      "Conso reelle, cout au km, estimation de trajet. Conseils eco-conduite et reperes par type de vehicule.",
    url: "https://outilis.fr/outils/calculateur-consommation-essence",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
