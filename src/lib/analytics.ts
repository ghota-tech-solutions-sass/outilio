type GtagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent({ action, category, label, value }: GtagEvent) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
}

export function trackToolUse(toolSlug: string) {
  trackEvent({
    action: "tool_use",
    category: "engagement",
    label: toolSlug,
  });
}

export function trackToolView(toolSlug: string) {
  trackEvent({
    action: "tool_view",
    category: "engagement",
    label: toolSlug,
  });
}

export function trackFavorite(toolSlug: string, isFav: boolean) {
  trackEvent({
    action: isFav ? "favorite_add" : "favorite_remove",
    category: "engagement",
    label: toolSlug,
  });
}

export function trackSearch(query: string) {
  trackEvent({
    action: "search",
    category: "engagement",
    label: query,
  });
}
