import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulateur PTZ (Pret a Taux Zero) 2026 - Gratuit",
  description:
    "Simulez votre eligibilite au Pret a Taux Zero 2026. Montant PTZ, duree, differe, mensualites. Zones A bis, A, B1, B2, C. Outil gratuit.",
  keywords: ["PTZ 2026", "pret a taux zero", "simulateur PTZ", "PTZ neuf ancien", "aide accession propriete", "pret immobilier taux zero"],
  alternates: { canonical: "https://outilis.fr/outils/simulateur-ptz-2026" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
