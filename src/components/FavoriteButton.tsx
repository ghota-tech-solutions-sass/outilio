"use client";

import { usePathname } from "next/navigation";
import { useFavorite, trackRecentTool } from "./RecentAndFavorites";
import { useEffect } from "react";
import { trackToolView, trackFavorite } from "@/lib/analytics";

export default function FavoriteButton() {
  const pathname = usePathname();
  const { isFav, toggle } = useFavorite(pathname);

  useEffect(() => {
    trackRecentTool(pathname);
    trackToolView(pathname);
  }, [pathname]);

  return (
    <button
      onClick={() => {
        toggle();
        trackFavorite(pathname, !isFav);
      }}
      className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm"
      style={{
        borderColor: isFav ? "var(--accent)" : "var(--border)",
        color: isFav ? "var(--accent)" : "var(--muted)",
        background: isFav ? "rgba(232,150,62,0.08)" : "transparent",
      }}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={isFav ? "var(--accent)" : "none"}
        stroke={isFav ? "var(--accent)" : "currentColor"}
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {isFav ? "Favori" : "Ajouter aux favoris"}
    </button>
  );
}
