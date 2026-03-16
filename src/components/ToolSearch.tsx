"use client";

import { useState, useMemo } from "react";
import ToolCard from "./ToolCard";
import type { Tool } from "@/data/tools";

const CATEGORY_ICONS: Record<string, string> = {
  Finance: "\u{1F4B0}",
  Immobilier: "\u{1F3E0}",
  Business: "\u{1F4BC}",
  Carriere: "\u{1F4BC}",
  Sante: "\u{2764}\uFE0F",
  Texte: "\u{1F4DD}",
  Dev: "\u{1F4BB}",
  Outils: "\u{1F527}",
  Legal: "\u{2696}\uFE0F",
  Securite: "\u{1F512}",
  Conversion: "\u{1F504}",
  Design: "\u{1F3A8}",
  Maths: "\u{1F4CA}",
  Retraite: "\u{1F9D3}",
  Auto: "\u{1F697}",
  Travail: "\u{23F0}",
  Shopping: "\u{1F3F7}\uFE0F",
  Restaurant: "\u{1F4B5}",
  Environnement: "\u{1F331}",
  Construction: "\u{1F3D7}\uFE0F",
  SEO: "\u{1F916}",
  Image: "\u{1F5BC}\uFE0F",
  PDF: "\u{1F4C4}",
  Video: "\u{1F3AC}",
  Audio: "\u{1F3B5}",
};

export default function ToolSearchFilter({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Auto-generate categories from tools with count
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tools) {
      map.set(t.category, (map.get(t.category) || 0) + 1);
    }
    // Sort by count descending
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({
        id,
        label: id,
        icon: CATEGORY_ICONS[id] || "\u{1F4E6}",
        count,
      }));
  }, [tools]);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 8);

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
          placeholder="Rechercher un outil... (salaire, pret, image, pdf...)"
          className="w-full rounded-2xl border py-4 pl-12 pr-12 text-sm transition-all placeholder:text-[var(--muted)]"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        />
        {query ? (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-colors hover:bg-[#0d4f3c]/10"
            style={{ color: "var(--muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ) : (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 hidden rounded-lg border px-2 py-0.5 text-[10px] font-medium sm:inline-block" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
            Ctrl+K
          </span>
        )}
      </div>

      {/* Category grid */}
      <div className="mt-5">
        <div className="flex flex-wrap gap-2">
          {/* "Tous" pill */}
          <button
            onClick={() => setActiveCategory("all")}
            className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all"
            style={{
              borderColor: activeCategory === "all" ? "var(--primary)" : "var(--border)",
              background: activeCategory === "all" ? "var(--primary)" : "var(--surface)",
              color: activeCategory === "all" ? "white" : "var(--muted)",
            }}
          >
            {"\u{2728}"} Tous
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px]"
              style={{
                background: activeCategory === "all" ? "rgba(255,255,255,0.2)" : "var(--surface-alt)",
                color: activeCategory === "all" ? "white" : "var(--muted)",
              }}
            >
              {tools.length}
            </span>
          </button>

          {/* Category pills */}
          {visibleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
              className="flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-all hover:border-[#0d4f3c]/30"
              style={{
                borderColor: activeCategory === cat.id ? "var(--primary)" : "var(--border)",
                background: activeCategory === cat.id ? "var(--primary)" : "var(--surface)",
                color: activeCategory === cat.id ? "white" : "var(--muted)",
              }}
            >
              <span className="text-sm">{cat.icon}</span>
              {cat.label}
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px]"
                style={{
                  background: activeCategory === cat.id ? "rgba(255,255,255,0.2)" : "var(--surface-alt)",
                  color: activeCategory === cat.id ? "white" : "var(--muted)",
                }}
              >
                {cat.count}
              </span>
            </button>
          ))}

          {/* Show more/less toggle */}
          {categories.length > 8 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="flex items-center gap-1 rounded-full border border-dashed px-3 py-2 text-xs font-semibold transition-all hover:border-[#0d4f3c]/30"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              {showAllCategories ? (
                <>
                  Moins
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                </>
              ) : (
                <>
                  +{categories.length - 8} autres
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mt-5 flex items-center justify-between">
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
            className="flex items-center gap-1 text-xs font-semibold transition-colors hover:underline"
            style={{ color: "var(--primary)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            Reinitialiser
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
