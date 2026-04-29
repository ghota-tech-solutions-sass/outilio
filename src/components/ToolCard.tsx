"use client";

import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Finance: "#0d4f3c",
  Immobilier: "#8b6914",
  Business: "#1a5276",
  Carriere: "#1a5276",
  Sante: "#922b21",
  Texte: "#6c3483",
  Dev: "#1a5276",
  Outils: "#566573",
  Legal: "#0d4f3c",
  Securite: "#922b21",
  Conversion: "#1a5276",
  Design: "#8b6914",
  Maths: "#0d4f3c",
  Retraite: "#566573",
  Auto: "#1a5276",
  Travail: "#566573",
  Shopping: "#e8963e",
  Restaurant: "#922b21",
  Environnement: "#0d4f3c",
  Construction: "#8b6914",
  SEO: "#1a5276",
  Image: "#6c3483",
  PDF: "#922b21",
  Video: "#6c3483",
  Audio: "#1a5276",
};

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  Populaire: { bg: "linear-gradient(135deg, #0d4f3c, #16785c)", text: "white" },
  Pro: { bg: "linear-gradient(135deg, #1a5276, #2e86c1)", text: "white" },
  Nouveau: { bg: "linear-gradient(135deg, #e8963e, #d4822e)", text: "white" },
};

export default function ToolCard({ title, description, href, icon, badge, category }: ToolCardProps) {
  const catColor = CATEGORY_COLORS[category] || "#0d4f3c";
  const badgeStyle = badge ? BADGE_STYLES[badge] || { bg: "var(--accent)", text: "white" } : null;

  return (
    <Link
      href={href}
      className="arrow-bounce group relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "var(--shadow-xl)";
        el.style.borderColor = `${catColor}25`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "var(--shadow-sm)";
        el.style.borderColor = "var(--border)";
      }}
    >
      {/* Shine effect inner wrapper - doesn't clip badges */}
      <div className="card-shine-inner" />

      {/* Top accent line on hover */}
      <div
        className="absolute left-4 right-4 top-0 h-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, ${catColor}, ${catColor}66, transparent)` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${catColor}08`, border: `1px solid ${catColor}12` }}
        >
          {icon}
        </div>
        <div className="flex items-center gap-2">
          {badge && badgeStyle && (
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: badgeStyle.bg, color: badgeStyle.text }}
            >
              {badge}
            </span>
          )}
          <span
            className="rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: "var(--surface-alt)", color: "var(--muted)" }}
          >
            {category}
          </span>
        </div>
      </div>

      <h3
        className="relative z-10 mt-4 text-[17px] font-semibold leading-snug tracking-tight transition-colors group-hover:text-[#0d4f3c]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>

      <p className="relative z-10 mt-2 text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
        {description}
      </p>

      <div
        className="relative z-10 mt-auto flex items-center gap-1.5 pt-5 text-xs font-semibold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:opacity-100"
        style={{ color: "var(--primary)" }}
      >
        Utiliser
        <svg className="arrow-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  );
}
