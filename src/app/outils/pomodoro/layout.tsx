import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chronomètre Pomodoro en ligne - Timer gratuit",
  description:
    "Timer Pomodoro gratuit avec cercle animé, enchaînement automatique des sessions, notification sonore et statistiques. Méthode Pomodoro : 25 min travail, 5 min pause.",
  keywords: [
    "pomodoro",
    "timer pomodoro",
    "chronometre pomodoro",
    "methode pomodoro",
    "technique pomodoro",
    "minuteur pomodoro",
    "productivite",
    "gestion du temps",
  ],
  alternates: { canonical: "https://outilis.fr/outils/pomodoro" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
