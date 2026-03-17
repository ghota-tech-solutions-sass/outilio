"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { tools, Tool } from "@/data/tools";

const FAVORITES_KEY = "outilis-favorites";
const RECENT_KEY = "outilis-recent";
const MAX_RECENT = 6;

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useFavorite(href: string) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(href));
  }, [href]);

  const toggle = useCallback(() => {
    const favs = getFavorites();
    const next = favs.includes(href)
      ? favs.filter((f) => f !== href)
      : [...favs, href];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    setIsFav(!isFav);
    window.dispatchEvent(new Event("outilis-favorites-changed"));
  }, [href, isFav]);

  return { isFav, toggle };
}

export function trackRecentTool(href: string) {
  const recent = getRecent().filter((r) => r !== href);
  recent.unshift(href);
  localStorage.setItem(
    RECENT_KEY,
    JSON.stringify(recent.slice(0, MAX_RECENT))
  );
}

function removeFavorite(href: string) {
  const favs = getFavorites().filter((f) => f !== href);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  window.dispatchEvent(new Event("outilis-favorites-changed"));
}

export default function RecentAndFavorites() {
  const [favorites, setFavorites] = useState<Tool[]>([]);
  const [recent, setRecent] = useState<Tool[]>([]);

  const refresh = useCallback(() => {
    const favHrefs = getFavorites();
    const recentHrefs = getRecent();
    setFavorites(
      favHrefs
        .map((href) => tools.find((t) => t.href === href))
        .filter(Boolean) as Tool[]
    );
    setRecent(
      recentHrefs
        .map((href) => tools.find((t) => t.href === href))
        .filter(Boolean) as Tool[]
    );
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("outilis-favorites-changed", refresh);
    return () =>
      window.removeEventListener("outilis-favorites-changed", refresh);
  }, [refresh]);

  if (favorites.length === 0 && recent.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-8">
      {favorites.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="var(--accent)"
              stroke="var(--accent)"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2
              className="text-lg tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Mes favoris
            </h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {favorites.map((tool) => (
              <div
                key={tool.href}
                className="group flex items-center gap-1 rounded-lg border text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <Link
                  href={tool.href}
                  className="flex items-center gap-2 py-2 pl-3 pr-1"
                >
                  <span>{tool.icon}</span>
                  <span className="font-medium">{tool.title}</span>
                </Link>
                <button
                  onClick={() => removeFavorite(tool.href)}
                  className="flex items-center justify-center rounded-md p-1.5 mr-1 transition-colors hover:bg-red-50"
                  style={{ color: "var(--muted)" }}
                  aria-label={`Retirer ${tool.title} des favoris`}
                  title="Retirer des favoris"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-colors hover:stroke-red-500"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {recent.length > 0 && (
        <div>
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h2
              className="text-lg tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Utilises recemment
            </h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {recent.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <span>{tool.icon}</span>
                <span className="font-medium">{tool.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
