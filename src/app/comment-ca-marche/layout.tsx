import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comment ca marche - Outilis.fr",
  description:
    "Decouvrez comment Outilis.fr protege vos donnees. Tous les outils fonctionnent 100% dans votre navigateur. Code open source. Aucune donnee envoyee.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
