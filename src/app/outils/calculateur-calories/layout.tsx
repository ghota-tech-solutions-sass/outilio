import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de calories brulees - Par activite sportive",
  description:
    "Estimez les calories brulees selon votre activite physique, duree et poids. Course, velo, natation, marche et plus. Gratuit et instantane.",
  keywords: [
    "calculateur calories",
    "calories brulees",
    "depense calorique",
    "calories sport",
    "calories course a pied",
    "calories velo",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
