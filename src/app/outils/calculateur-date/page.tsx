"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

function toInputDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function parseDate(s: string): Date | null {
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function CalculateurDate() {
  const today = useMemo(() => toInputDate(new Date()), []);

  // Mode 1: difference between two dates
  const [dateA, setDateA] = useState(today);
  const [dateB, setDateB] = useState(today);

  // Mode 2: add/subtract days
  const [baseDate, setBaseDate] = useState(today);
  const [daysToAdd, setDaysToAdd] = useState("30");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const diff = useMemo(() => {
    const a = parseDate(dateA);
    const b = parseDate(dateB);
    if (!a || !b) return null;
    const ms = Math.abs(b.getTime() - a.getTime());
    const totalDays = Math.round(ms / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const months = Math.abs((b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()));
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return { totalDays, weeks, remainingDays, years, remainingMonths, months };
  }, [dateA, dateB]);

  const resultDate = useMemo(() => {
    const d = parseDate(baseDate);
    const days = parseInt(daysToAdd) || 0;
    if (!d) return null;
    const result = new Date(d);
    result.setDate(result.getDate() + (operation === "add" ? days : -days));
    return result;
  }, [baseDate, daysToAdd, operation]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Outils</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>dates</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le nombre de jours entre deux dates ou ajoutez/soustrayez des jours a une date.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode 1: Difference */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Jours entre deux dates</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date de debut</label>
                  <input type="date" value={dateA} onChange={(e) => setDateA(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date de fin</label>
                  <input type="date" value={dateB} onChange={(e) => setDateB(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {diff && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Resultat</h2>
                <div className="mt-4 text-center">
                  <p className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {diff.totalDays}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>jours</p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <StatBox label="Semaines + jours" value={`${diff.weeks} sem. ${diff.remainingDays} j`} />
                  <StatBox label="Mois" value={`${diff.months}`} />
                  <StatBox label="Annees + mois" value={diff.years > 0 ? `${diff.years} an(s) ${diff.remainingMonths} mois` : `${diff.remainingMonths} mois`} />
                </div>
              </div>
            )}

            {/* Mode 2: Add/Subtract */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Ajouter / Soustraire des jours</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date de depart</label>
                  <input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
                <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                  <button onClick={() => setOperation("add")}
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{ background: operation === "add" ? "var(--primary)" : "transparent", color: operation === "add" ? "white" : "var(--muted)" }}>
                    + Ajouter
                  </button>
                  <button onClick={() => setOperation("subtract")}
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{ background: operation === "subtract" ? "var(--primary)" : "transparent", color: operation === "subtract" ? "white" : "var(--muted)" }}>
                    - Soustraire
                  </button>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre de jours</label>
                  <input type="number" value={daysToAdd} onChange={(e) => setDaysToAdd(e.target.value)} min="0"
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {resultDate && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Date calculee</h2>
                <p className="mt-4 text-2xl font-bold capitalize" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {formatDate(resultDate)}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {toInputDate(resultDate)}
                </p>
              </div>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment calculer une difference de dates ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Difference en jours</strong> : Soustrayez la date de debut de la date de fin, puis convertissez les millisecondes en jours (1 jour = 86 400 000 ms).</p>
                <p><strong className="text-[var(--foreground)]">Ajouter des jours</strong> : Ajoutez le nombre de jours souhaite a la date de depart. Utile pour calculer des echeances, delais de livraison, ou dates de fin de preavis.</p>
                <p><strong className="text-[var(--foreground)]">Cas pratiques</strong> : Calcul de duree de grossesse, delai de retractation (14 jours), preavis de location (3 mois), duree de garantie.</p>
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
      <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{value}</p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
    </div>
  );
}
