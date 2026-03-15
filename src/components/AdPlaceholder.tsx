"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PROMOS = [
  {
    title: "Calculez votre salaire net",
    description: "Brut \u2192 Net en 1 clic. Cadre, non-cadre, fonction publique.",
    href: "/outils/calculateur-salaire",
    icon: "\u{1F4B0}",
    accent: true,
  },
  {
    title: "Simulateur pret immobilier",
    description: "Mensualites, cout total, tableau d'amortissement.",
    href: "/outils/calculateur-pret-immobilier",
    icon: "\u{1F3E0}",
  },
  {
    title: "Freelance vs CDI",
    description: "Comparez vos revenus nets reels. TJM equivalent inclus.",
    href: "/outils/freelance-vs-cdi",
    icon: "\u{1F4BC}",
    accent: true,
  },
  {
    title: "Simulateur impot 2024",
    description: "Bareme officiel, quotient familial, detail par tranche.",
    href: "/outils/simulateur-impot",
    icon: "\u{1F4CB}",
  },
  {
    title: "Generateur de factures",
    description: "Factures PDF conformes, gratuites, sans inscription.",
    href: "/outils/generateur-facture",
    icon: "\u{1F4C4}",
    accent: true,
  },
  {
    title: "Age depart retraite",
    description: "Reforme 2023. Trimestres requis selon votre annee de naissance.",
    href: "/outils/calculateur-retraite",
    icon: "\u{1F9D3}",
  },
  {
    title: "Calculateur TVA",
    description: "HT \u2194 TTC instantane. Tous les taux francais.",
    href: "/outils/calculateur-tva",
    icon: "\u{1F4B1}",
  },
  {
    title: "Generateur mot de passe",
    description: "Mots de passe forts et securises. 100% local.",
    href: "/outils/generateur-mot-de-passe",
    icon: "\u{1F512}",
    accent: true,
  },
  {
    title: "Rentabilite locative",
    description: "Rendement brut/net, cashflow, effort d'epargne.",
    href: "/outils/calculateur-rentabilite-locative",
    icon: "\u{1F3D8}\uFE0F",
  },
  {
    title: "Convertisseur couleurs",
    description: "HEX, RGB, HSL. Color picker et copie en un clic.",
    href: "/outils/convertisseur-couleurs",
    icon: "\u{1F3A8}",
    accent: true,
  },
];

export default function AdPlaceholder({ className = "" }: { className?: string }) {
  const [promo, setPromo] = useState(PROMOS[0]);

  useEffect(() => {
    const idx = Math.floor(Math.random() * PROMOS.length);
    setPromo(PROMOS[idx]);
  }, []);

  const isLarge = className.includes("600");

  return (
    <Link
      href={promo.href}
      className={`group flex flex-col items-center justify-center rounded-2xl border p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg ${className}`}
      style={{
        borderColor: promo.accent ? "var(--primary)" : "var(--border)",
        background: promo.accent
          ? "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)"
          : "var(--surface)",
      }}
    >
      <span className={`${isLarge ? "text-5xl" : "text-3xl"}`}>{promo.icon}</span>
      <h4
        className={`${isLarge ? "mt-4 text-xl" : "mt-3 text-base"} font-semibold tracking-tight`}
        style={{
          fontFamily: "var(--font-display)",
          color: promo.accent ? "white" : "var(--foreground)",
        }}
      >
        {promo.title}
      </h4>
      <p
        className={`${isLarge ? "mt-2 text-sm" : "mt-1 text-xs"} leading-relaxed`}
        style={{ color: promo.accent ? "rgba(255,255,255,0.8)" : "var(--muted)" }}
      >
        {promo.description}
      </p>
      <span
        className={`${isLarge ? "mt-4" : "mt-3"} inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-semibold transition-all group-hover:gap-2`}
        style={{
          background: promo.accent ? "rgba(255,255,255,0.15)" : "var(--surface-alt)",
          color: promo.accent ? "white" : "var(--primary)",
        }}
      >
        Essayer gratuitement
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </span>
    </Link>
  );
}
