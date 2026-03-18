"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const UNITS = [
  { key: "seconds", label: "Secondes", factor: 1 },
  { key: "minutes", label: "Minutes", factor: 60 },
  { key: "hours", label: "Heures", factor: 3600 },
  { key: "days", label: "Jours", factor: 86400 },
  { key: "weeks", label: "Semaines", factor: 604800 },
  { key: "months", label: "Mois (30j)", factor: 2592000 },
  { key: "years", label: "Annees (365j)", factor: 31536000 },
];

export default function ConvertisseurTemps() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("hours");

  const conversions = useMemo(() => {
    const num = parseFloat(value) || 0;
    const from = UNITS.find((u) => u.key === fromUnit);
    if (!from || num === 0) return null;

    const inSeconds = num * from.factor;

    return UNITS.map((u) => ({
      key: u.key,
      label: u.label,
      value: inSeconds / u.factor,
    }));
  }, [value, fromUnit]);

  const fmtVal = (n: number) => {
    if (Number.isInteger(n) && Math.abs(n) < 1e12) return n.toLocaleString("fr-FR");
    if (Math.abs(n) >= 0.01)
      return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    return n.toExponential(4);
  };

  // Human-readable breakdown
  const breakdown = useMemo(() => {
    const num = parseFloat(value) || 0;
    const from = UNITS.find((u) => u.key === fromUnit);
    if (!from || num <= 0) return null;

    let totalSec = Math.floor(num * from.factor);
    const years = Math.floor(totalSec / 31536000);
    totalSec %= 31536000;
    const days = Math.floor(totalSec / 86400);
    totalSec %= 86400;
    const hours = Math.floor(totalSec / 3600);
    totalSec %= 3600;
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} an${years > 1 ? "s" : ""}`);
    if (days > 0) parts.push(`${days} jour${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} heure${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} seconde${seconds > 1 ? "s" : ""}`);

    return parts.join(", ");
  }, [value, fromUnit]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Conversion</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur de <span style={{ color: "var(--primary)" }}>temps</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez entre secondes, minutes, heures, jours, semaines, mois et annees. Bidirectionnel et instantane.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Valeur a convertir</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Valeur</label>
                  <input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Unite</label>
                  <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}>
                    {UNITS.map((u) => (
                      <option key={u.key} value={u.key}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {breakdown && (
              <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Decomposition</p>
                <p className="mt-2 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{breakdown}</p>
              </div>
            )}

            {conversions && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Resultats</h2>
                <div className="mt-4 space-y-2">
                  {conversions.map((c) => (
                    <div key={c.key}
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{
                        background: c.key === fromUnit ? "var(--primary)" : "var(--surface-alt)",
                        color: c.key === fromUnit ? "#fff" : "inherit",
                      }}>
                      <span className="text-sm font-semibold">{c.label}</span>
                      <span className="text-sm font-bold" style={{ fontFamily: "monospace" }}>{fmtVal(c.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Reperes temporels</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">1 million de secondes</strong> : environ 11,6 jours</p>
                <p><strong className="text-[var(--foreground)]">1 milliard de secondes</strong> : environ 31,7 ans</p>
                <p><strong className="text-[var(--foreground)]">Mois</strong> : La duree d&apos;un mois varie de 28 a 31 jours. Ce calculateur utilise 30 jours comme valeur moyenne.</p>
                <p><strong className="text-[var(--foreground)]">Annee</strong> : 365 jours (365,25 pour les annees bissextiles en moyenne).</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conversions rapides</h3>
              <div className="mt-3 space-y-2">
                {[
                  { de: "1 heure", a: "3 600 sec" },
                  { de: "1 jour", a: "86 400 sec" },
                  { de: "1 semaine", a: "168 heures" },
                  { de: "1 mois", a: "720 heures" },
                  { de: "1 an", a: "8 760 heures" },
                  { de: "1 an", a: "525 600 min" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{r.de}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{r.a}</span>
                  </div>
                ))}
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
