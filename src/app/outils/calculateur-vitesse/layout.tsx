import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur vitesse / distance / temps",
  description:
    "Calculez la vitesse, la distance ou le temps a partir de deux valeurs connues. Conversions km/h, m/s, mph. Gratuit et instantane.",
  keywords: [
    "calculateur vitesse",
    "calcul distance temps",
    "vitesse moyenne",
    "conversion km/h m/s",
    "calculateur trajet",
    "temps de parcours",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
