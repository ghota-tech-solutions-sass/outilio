import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur PTZ (Prêt à Taux Zéro) 2026 - Gratuit",
  description:
    "Simulez votre éligibilité au Prêt à Taux Zéro 2026. Montant PTZ, durée, différé, mensualités. Zones A bis, A, B1, B2, C. Outil gratuit.",
  keywords: ["PTZ 2026", "pret a taux zero", "simulateur PTZ", "PTZ neuf ancien", "aide accession propriete", "pret immobilier taux zero"],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-ptz-2026" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
