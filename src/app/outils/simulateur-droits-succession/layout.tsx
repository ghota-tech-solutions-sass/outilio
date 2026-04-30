import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur droits de succession - Calcul gratuit",
  description:
    "Calculez vos droits de succession gratuitement. Abattements par lien de parente, bareme progressif, taux effectif. Estimation instantanee et detaillee.",
  keywords: ["droits de succession", "simulateur succession", "heritage", "calcul succession", "abattement succession", "bareme succession"],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-droits-succession" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
