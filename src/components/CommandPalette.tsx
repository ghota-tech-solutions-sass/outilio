"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { tools } from "@/data/tools";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!query.trim()) return tools;
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return tools.filter((t) => {
      const text = `${t.title} ${t.description} ${t.category}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return text.includes(q);
    });
  }, [query]);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const navigateToTool = useCallback(
    (href: string) => {
      closePalette();
      router.push(href);
    },
    [closePalette, router]
  );

  // Listen for Ctrl+K / Cmd+K and custom event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        if (!open) {
          setQuery("");
          setSelectedIndex(0);
        }
      }
    };

    const handleCustomOpen = () => {
      setOpen(true);
      setQuery("");
      setSelectedIndex(0);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [open]);

  // Auto-focus the input when opened
  useEffect(() => {
    if (open) {
      // Small delay to let the animation start
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-palette-item]");
    const item = items[selectedIndex] as HTMLElement | undefined;
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Keyboard navigation inside the palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closePalette();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      return;
    }
    if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      navigateToTool(filtered[selectedIndex].href);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      style={{ animation: "cmdPaletteFadeIn 0.15s ease-out" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closePalette();
      }}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          animation: "cmdPaletteScaleIn 0.2s ease-out",
        }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 border-b px-5 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--muted)", flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un outil..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-[var(--muted)]"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-body)" }}
          />
          <kbd
            className="hidden items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium sm:inline-flex"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted)",
              background: "var(--surface-alt)",
            }}
          >
            Echap
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[50vh] overflow-y-auto overscroll-contain p-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <span className="text-4xl">&#128269;</span>
              <p
                className="mt-3 text-sm font-semibold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--foreground)",
                }}
              >
                Aucun outil trouve
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                Essayez un autre terme de recherche.
              </p>
            </div>
          ) : (
            filtered.map((tool, i) => (
              <button
                key={tool.href}
                data-palette-item
                onClick={() => navigateToTool(tool.href)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors"
                style={{
                  background:
                    i === selectedIndex
                      ? "var(--primary)"
                      : "transparent",
                  color:
                    i === selectedIndex ? "white" : "var(--foreground)",
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                {/* Icon */}
                <span className="text-2xl flex-shrink-0">{tool.icon}</span>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="truncate text-sm font-semibold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {tool.title}
                    </span>
                    <span
                      className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        background:
                          i === selectedIndex
                            ? "rgba(255,255,255,0.2)"
                            : "var(--surface-alt)",
                        color:
                          i === selectedIndex
                            ? "rgba(255,255,255,0.9)"
                            : "var(--muted)",
                      }}
                    >
                      {tool.category}
                    </span>
                  </div>
                  <p
                    className="mt-0.5 truncate text-xs"
                    style={{
                      color:
                        i === selectedIndex
                          ? "rgba(255,255,255,0.75)"
                          : "var(--muted)",
                    }}
                  >
                    {tool.description}
                  </p>
                </div>

                {/* Arrow indicator for selected */}
                {i === selectedIndex && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 opacity-60"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t px-5 py-2.5"
          style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
        >
          <span className="text-[11px]" style={{ color: "var(--muted)" }}>
            {filtered.length} outil{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--muted)" }}>
              <kbd
                className="inline-flex items-center rounded border px-1 py-0.5 text-[10px]"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                &#8593;&#8595;
              </kbd>
              naviguer
            </span>
            <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--muted)" }}>
              <kbd
                className="inline-flex items-center rounded border px-1 py-0.5 text-[10px]"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                &#9166;
              </kbd>
              ouvrir
            </span>
          </div>
        </div>
      </div>

      {/* Inline styles for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cmdPaletteFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cmdPaletteScaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </div>
  );
}
