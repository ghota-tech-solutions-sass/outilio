"use client";

import { usePathname } from "next/navigation";
import { partnersForTool } from "@/data/partners";
import { trackAffiliateClick } from "@/lib/analytics";

// Encart partenaires affiché sous l'outil. Ne rend rien tant qu'aucun
// partenaire actif (avec URL) n'est associé à la page.
export default function AffiliateSlot() {
  const pathname = usePathname();
  const partners = partnersForTool(pathname);
  if (partners.length === 0) return null;

  const needsCreditNotice = partners.some((p) => p.requiresCreditNotice);

  return (
    <section data-no-track className="no-print mx-auto max-w-7xl px-6 2xl:max-w-[1400px] pb-6">
      <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
            Passer à l&apos;action
          </h2>
          <span className="text-[11px]" style={{ color: "var(--muted)" }}>
            Liens partenaires : Outilis peut percevoir une commission, sans surcoût pour vous.
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {partners.map((p) => (
            <a
              key={p.id}
              href={p.url ?? undefined}
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => trackAffiliateClick(p.id, pathname)}
              className="flex items-center justify-between gap-4 rounded-xl px-4 py-4 transition-opacity hover:opacity-85"
              style={{ background: "var(--surface-alt)" }}
            >
              <span>
                <span className="block text-sm font-semibold">{p.name}</span>
                <span className="mt-1 block text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{p.pitch}</span>
              </span>
              <span
                className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                {p.cta}
              </span>
            </a>
          ))}
        </div>
        {needsCreditNotice && (
          <p className="mt-4 text-xs font-semibold" style={{ color: "var(--foreground)" }}>
            Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
          </p>
        )}
      </div>
    </section>
  );
}
