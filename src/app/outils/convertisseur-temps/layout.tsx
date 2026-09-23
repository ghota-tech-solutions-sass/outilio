import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secondes en jours, heures, minutes - Convertisseur de temps",
  description:
    "Une journée = 86 400 secondes. 1 million de secondes = 11,57 jours, 1 milliard = 11 574 jours (31,7 ans). Convertissez secondes, minutes, heures, jours, semaines et années.",
  keywords: [
    "convertisseur temps",
    "combien de secondes dans une journée",
    "secondes en jours",
    "1 milliard de secondes en jours",
    "1 million de secondes en jours",
    "conversion heures minutes",
    "secondes en heures",
    "convertir durée",
  ],
  alternates: { canonical: "https://outilis.fr/outils/convertisseur-temps" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
