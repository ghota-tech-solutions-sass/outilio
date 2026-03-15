import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de pourcentage en ligne - Gratuit",
  description:
    "Calculez des pourcentages facilement : X% de Y, variation en %, pourcentage d'un total. Outil gratuit et instantane.",
  keywords: ["calculateur pourcentage", "pourcentage", "calcul pourcentage", "variation pourcentage"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
