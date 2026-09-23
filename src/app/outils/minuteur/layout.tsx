import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minuteur et chronomètre en ligne - Timer gratuit",
  description:
    "Minuteur avec compte à rebours et chronomètre en ligne. Alarme sonore, démarrer, arrêter, réinitialiser. Gratuit et sans inscription.",
  keywords: [
    "minuteur en ligne",
    "chronometre",
    "timer",
    "compte a rebours",
    "minuterie",
    "chronometre en ligne",
  ],
  alternates: { canonical: "https://outilis.fr/outils/minuteur" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
