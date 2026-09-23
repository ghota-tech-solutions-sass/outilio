import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur Calories Brûlées - 18 Sports, Méthode MET",
  description:
    "Estimez les calories brûlées selon votre poids, l'activité et la durée. 18 sports (course, vélo, natation, HIIT, yoga, musculation). Méthode MET du Compendium of Physical Activities. Gratuit, instantané.",
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
    title: "Calculateur Calories Brûlées - 18 Sports, Méthode MET",
    description:
      "Dépense énergétique selon poids, durée et activité. Méthode MET, comparaison entre sports.",
    url: "https://outilis.fr/outils/calculateur-calories",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
