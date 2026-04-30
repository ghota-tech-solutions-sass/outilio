import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions legales - Outilis.fr",
  description: "Mentions legales du site Outilis.fr, edite par Ghota Tech Solutions (GTS), EURL basee a Lyon.",
  alternates: { canonical: "https://outilis.fr/mentions-legales" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
