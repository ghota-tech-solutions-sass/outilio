import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  category: string;
}

export default function ToolCard({ title, description, href, icon, badge, category }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0d4f3c]/5"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {badge && (
        <span
          className="absolute -top-2.5 right-5 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ background: "var(--accent)" }}
        >
          {badge}
        </span>
      )}

      <div className="flex items-start justify-between">
        <span className="text-3xl">{icon}</span>
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: "var(--surface-alt)", color: "var(--muted)" }}
        >
          {category}
        </span>
      </div>

      <h3
        className="mt-4 text-lg font-semibold tracking-tight transition-colors group-hover:text-[#0d4f3c]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>

      <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
        {description}
      </p>

      <div
        className="mt-auto flex items-center gap-1 pt-4 text-xs font-semibold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:opacity-100"
        style={{ color: "var(--primary)" }}
      >
        Utiliser
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  );
}
