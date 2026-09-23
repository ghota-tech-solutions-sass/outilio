import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ça marche - Outilis.fr",
  description:
    "Découvrez comment Outilis.fr protège vos données. Tous les outils fonctionnent 100 % dans votre navigateur : vos saisies ne sont jamais envoyées à un serveur. Code open source.",
  alternates: { canonical: "https://outilis.fr/comment-ca-marche" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
