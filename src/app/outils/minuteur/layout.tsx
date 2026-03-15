import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minuteur et chronometre en ligne - Timer gratuit",
  description:
    "Minuteur avec compte a rebours et chronometre en ligne. Alarme sonore, demarrer, arreter, reinitialiser. Gratuit et sans inscription.",
  keywords: [
    "minuteur en ligne",
    "chronometre",
    "timer",
    "compte a rebours",
    "minuterie",
    "chronometre en ligne",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
