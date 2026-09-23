import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales - Outilis.fr",
  description: "Mentions légales du site Outilis.fr, édité par Ghota Tech Solutions (GTS), EURL basée à Lyon.",
  alternates: { canonical: "https://outilis.fr/mentions-legales" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
