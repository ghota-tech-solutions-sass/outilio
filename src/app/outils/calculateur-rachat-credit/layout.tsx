import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de rachat de credit - Simulation gratuite",
  description:
    "Simulez votre rachat de credit : comparez vos mensualites actuelles avec un nouveau credit unique. Calculez l'economie mensuelle, le cout total et les frais de rachat.",
  keywords: [
    "rachat de credit",
    "regroupement de credits",
    "simulation rachat credit",
    "restructuration dette",
    "rachat pret",
    "calculateur rachat credit",
    "indemnites remboursement anticipe",
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
