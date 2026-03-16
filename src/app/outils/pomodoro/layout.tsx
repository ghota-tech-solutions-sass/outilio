import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chronometre Pomodoro en ligne - Timer gratuit",
  description:
    "Timer Pomodoro gratuit avec cercle anime, enchainement automatique des sessions, notification sonore et statistiques. Methode Pomodoro : 25 min travail, 5 min pause.",
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
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
