"use client";

import { useState, useMemo } from "react";
import ToolCard from "./ToolCard";

interface Tool {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  category: string;
}

const CATEGORIES = [
  { id: "all", label: "Tous", icon: "\u{2728}" },
  { id: "Finance", label: "Finance", icon: "\u{1F4B0}" },
  { id: "Immobilier", label: "Immobilier", icon: "\u{1F3E0}" },
  { id: "Business", label: "Business", icon: "\u{1F4BC}" },
  { id: "Carriere", label: "Carriere", icon: "\u{1F4BC}" },
  { id: "Sante", label: "Sante", icon: "\u{1F3CB}\uFE0F" },
  { id: "Texte", label: "Texte", icon: "\u{1F4DD}" },
  { id: "Dev", label: "Dev", icon: "\u{1F4BB}" },
  { id: "Outils", label: "Outils", icon: "\u{1F527}" },
  { id: "Legal", label: "Legal", icon: "\u{2696}\uFE0F" },
  { id: "Securite", label: "Securite", icon: "\u{1F512}" },
  { id: "Conversion", label: "Conversion", icon: "\u{1F504}" },
  { id: "Design", label: "Design", icon: "\u{1F3A8}" },
  { id: "Maths", label: "Maths", icon: "\u{1F4CA}" },
];

export default function ToolSearchFilter({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = useMemo(() => {
    let result = tools;

    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      result = result.filter((t) => {
        const text = `${t.title} ${t.description} ${t.category}`
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        return text.includes(q);
      });
    }

    return result;
  }, [tools, query, activeCategory]);

  // Only show categories that have tools
  const visibleCategories = CATEGORIES.filter(
    (c) => c.id === "all" || tools.some((t) => t.category === c.id)
  );

  return (
    <div>
      {/* Search bar */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un outil... (salaire, pret, facture, couleur...)"
          className="w-full rounded-2xl border py-4 pl-12 pr-4 text-sm transition-all placeholder:text-[var(--muted)]"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-[#0d4f3c]/10"
            style={{ color: "var(--muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
        {visibleCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all hover:scale-[1.02]"
            style={{
              borderColor: activeCategory === cat.id ? "var(--primary)" : "var(--border)",
              background: activeCategory === cat.id ? "var(--primary)" : "var(--surface)",
              color: activeCategory === cat.id ? "white" : "var(--muted)",
            }}
          >
            <span className="text-sm">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {filtered.length === tools.length ? (
            <>{tools.length} outils disponibles</>
          ) : (
            <><strong style={{ color: "var(--foreground)" }}>{filtered.length}</strong> outil{filtered.length !== 1 ? "s" : ""} trouve{filtered.length !== 1 ? "s" : ""}</>
          )}
        </p>
        {(query || activeCategory !== "all") && (
          <button
            onClick={() => { setQuery(""); setActiveCategory("all"); }}
            className="text-xs font-semibold transition-colors hover:underline"
            style={{ color: "var(--primary)" }}
          >
            Reinitialiser
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <div key={tool.href} className="animate-scale-in">
            <ToolCard {...tool} />
          </div>
        ))}
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <span className="text-5xl">{"\u{1F50D}"}</span>
          <p className="mt-4 text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Aucun outil trouve
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Essayez un autre terme de recherche ou changez de categorie.
          </p>
          <button
            onClick={() => { setQuery(""); setActiveCategory("all"); }}
            className="mt-4 rounded-full px-6 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            Voir tous les outils
          </button>
        </div>
      )}
    </div>
  );
}
