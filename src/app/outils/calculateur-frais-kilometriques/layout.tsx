import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur frais kilométriques 2026 - Barème fiscal (revenus 2025)",
  description:
    "Calculez vos frais kilométriques déductibles avec le barème fiscal officiel 2026 (revenus 2025). Voiture, moto, scooter, véhicule électrique (+20%). Gratuit et instantané.",
  keywords: [
    "frais kilometriques",
    "bareme kilometrique 2026",
    "bareme kilometrique 2025",
    "indemnites kilometriques",
    "frais reels",
    "deduction fiscale",
    "bareme fiscal voiture",
    "frais kilometriques moto",
    "vehicule electrique majoration",
    "puissance fiscale",
    "declaration impots",
  ],
  alternates: { canonical: "https://outilis.fr/outils/calculateur-frais-kilometriques" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
