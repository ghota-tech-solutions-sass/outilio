"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackToolUse } from "@/lib/analytics";

// Fires a single `tool_use` event per page view, on the first real interaction
// with the tool (typing, changing a select, dropping a file, pressing a button).
export default function ToolUseTracker() {
  const pathname = usePathname();

  useEffect(() => {
    let sent = false;
    const onInteract = (e: Event) => {
      if (sent || !e.isTrusted) return;
      const target = e.target as HTMLElement | null;
      if (!target || target.closest("header, footer, [data-no-track]")) return;
      if (e.type === "click" && !target.closest("button, [role=button]")) return;
      sent = true;
      trackToolUse(pathname);
      cleanup();
    };
    const events = ["input", "change", "drop", "click"] as const;
    const cleanup = () => events.forEach((ev) => document.removeEventListener(ev, onInteract, true));
    events.forEach((ev) => document.addEventListener(ev, onInteract, true));
    return cleanup;
  }, [pathname]);

  return null;
}
