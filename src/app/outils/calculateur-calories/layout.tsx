import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Calories Brulees - 18 Sports, Methode MET",
  description:
    "Estimez les calories brulees selon votre poids, l'activite et la duree. 18 sports (course, velo, natation, HIIT, yoga, musculation). Methode MET du Compendium of Physical Activities. Gratuit, instantane.",
  keywords: [
    "calculateur calories",
    "calories brulees",
    "depense calorique",
    "calories sport",
    "calories course a pied",
    "calories velo",
    "calories natation",
    "MET activite",
    "depense energetique",
  ],
  alternates: {
    canonical: "https://outilis.fr/outils/calculateur-calories",
  },
  openGraph: {
    title: "Calculateur Calories Brulees - 18 Sports, Methode MET",
    description:
      "Depense energetique selon poids, duree et activite. Methode MET, comparaison entre sports.",
    url: "https://outilis.fr/outils/calculateur-calories",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
