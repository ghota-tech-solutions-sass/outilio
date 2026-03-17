"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { tools } from "@/data/tools";

export default function RelatedTools() {
  const pathname = usePathname();

  const related = useMemo(() => {
    const current = tools.find((t) => t.href === pathname);
    if (!current) return [];

    // Same category first, then other tools
    const sameCategory = tools.filter(
      (t) => t.category === current.category && t.href !== pathname
    );
    const otherTools = tools.filter(
      (t) => t.category !== current.category && t.href !== pathname
    );

    // Take up to 3 from same category, fill rest from others
    const picked = sameCategory.slice(0, 3);
    const remaining = 4 - picked.length;
    if (remaining > 0) {
      // Shuffle others deterministically based on current tool name
      const seed = current.title.length;
      const shuffled = [...otherTools].sort(
        (a, b) => ((a.title.charCodeAt(0) + seed) % 17) - ((b.title.charCodeAt(0) + seed) % 17)
      );
      picked.push(...shuffled.slice(0, remaining));
    }

    return picked.slice(0, 4);
  }, [pathname]);

  if (related.length === 0) return null;

  return (
    <section className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-5xl px-5 py-12">
        <h2
          className="text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Outils <span style={{ color: "var(--primary)" }}>similaires</span>
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Ces outils pourraient aussi vous interesser
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col rounded-xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0d4f3c]/5"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tool.icon}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                  style={{ background: "var(--surface-alt)", color: "var(--muted)" }}
                >
                  {tool.category}
                </span>
              </div>
              <h3
                className="mt-3 text-sm font-semibold tracking-tight transition-colors group-hover:text-[#0d4f3c]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tool.title}
              </h3>
              <p
                className="mt-1 line-clamp-2 text-xs leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {tool.description}
              </p>
              <span
                className="mt-3 text-[10px] font-semibold uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: "var(--primary)" }}
              >
                Utiliser →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
