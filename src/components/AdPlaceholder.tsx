"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { tools } from "@/data/tools";

type Promo = {
  title: string;
  description: string;
  href: string;
  icon: string;
  accent?: boolean;
  /** Catégories d'outils (voir src/data/tools.ts) sur lesquelles la promo est pertinente. */
  categories: string[];
};

// Outils mis en avant dans la barre latérale. Priorité aux outils qui mènent
// vers des partenaires (immobilier, crédit, création d'entreprise, épargne).
const PROMOS: Promo[] = [
  { title: "Capacité d'emprunt", description: "Combien pouvez-vous emprunter selon vos revenus ?", href: "/outils/capacite-emprunt", icon: "\u{1F3E6}", accent: true, categories: ["Immobilier", "Finance"] },
  { title: "Simulateur prêt immobilier", description: "Mensualités, coût total, tableau d'amortissement.", href: "/outils/calculateur-pret-immobilier", icon: "\u{1F3E0}", categories: ["Immobilier", "Finance"] },
  { title: "Assurance de prêt", description: "Combien économiser en changeant d'assurance (loi Lemoine) ?", href: "/outils/assurance-emprunteur", icon: "\u{1F6E1}\uFE0F", accent: true, categories: ["Immobilier", "Finance"] },
  { title: "Simulateur PTZ 2026", description: "Éligibilité et montant du prêt à taux zéro.", href: "/outils/simulateur-ptz-2026", icon: "\u{1F511}", categories: ["Immobilier"] },
  { title: "MaPrimeRénov' 2026", description: "Estimez vos aides à la rénovation énergétique.", href: "/outils/simulateur-maprimerenov", icon: "\u{1F33F}", accent: true, categories: ["Immobilier", "Environnement"] },
  { title: "Quel statut juridique ?", description: "Micro, EURL ou SASU : comparez votre revenu net.", href: "/outils/choisir-statut-juridique", icon: "\u{2696}\uFE0F", accent: true, categories: ["Business", "Carriere", "Emploi", "Travail"] },
  { title: "Freelance vs CDI", description: "Comparez vos revenus nets réels. TJM équivalent inclus.", href: "/outils/freelance-vs-cdi", icon: "\u{1F4BC}", categories: ["Business", "Carriere", "Emploi", "Travail"] },
  { title: "Générateur de factures", description: "Factures PDF gratuites, sans inscription.", href: "/outils/generateur-facture", icon: "\u{1F4C4}", categories: ["Business"] },
  { title: "Calculez votre salaire net", description: "Brut → net en 1 clic. Cadre, non-cadre, fonction publique.", href: "/outils/calculateur-salaire", icon: "\u{1F4B0}", categories: ["Emploi", "Travail", "Finance"] },
  { title: "Simulateur impôt 2026", description: "Barème officiel, quotient familial, décote.", href: "/outils/simulateur-impot", icon: "\u{1F4CB}", categories: ["Finance", "Emploi"] },
  { title: "Calculateur d'épargne", description: "Intérêts composés et projection de votre épargne.", href: "/outils/calculateur-epargne", icon: "\u{1F4C8}", categories: ["Finance"] },
  { title: "Rentabilité locative", description: "Rendement brut/net, cashflow, effort d'épargne.", href: "/outils/calculateur-rentabilite-locative", icon: "\u{1F3D8}\uFE0F", categories: ["Immobilier", "Finance"] },
];

export default function AdPlaceholder({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const [promo, setPromo] = useState(PROMOS[0]);

  useEffect(() => {
    const category = tools.find((t) => t.href === pathname)?.category;
    const others = PROMOS.filter((p) => p.href !== pathname);
    const related = category ? others.filter((p) => p.categories.includes(category)) : [];
    const pool = related.length > 0 ? related : others;
    const timer = setTimeout(() => {
      setPromo(pool[Math.floor(Math.random() * pool.length)]);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

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
