"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const MILESTONES = [
  { week: 4, label: "Le coeur commence a battre" },
  { week: 8, label: "Premiers mouvements (non ressentis)" },
  { week: 12, label: "Fin du 1er trimestre - Echographie de datation" },
  { week: 16, label: "Le sexe peut etre determine" },
  { week: 20, label: "Mouvements ressentis par la maman" },
  { week: 22, label: "Echographie morphologique" },
  { week: 24, label: "Viabilite du bebe" },
  { week: 28, label: "Debut du 3e trimestre" },
  { week: 32, label: "Echographie de croissance" },
  { week: 37, label: "Bebe a terme" },
  { week: 40, label: "Date prevue d'accouchement" },
];

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDays(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function CalculateurGrossesse() {
  const today = new Date();
  const defaultDate = new Date(today);
  defaultDate.setDate(defaultDate.getDate() - 56); // ~8 weeks ago
  const [lmp, setLmp] = useState(defaultDate.toISOString().slice(0, 10));

  const lmpDate = new Date(lmp);
  const dueDate = addDays(lmpDate, 280);
  const daysPregnant = diffDays(lmpDate, today);
  const weeksPregnant = Math.floor(daysPregnant / 7);
  const daysExtra = daysPregnant % 7;
  const trimester = weeksPregnant < 13 ? 1 : weeksPregnant < 27 ? 2 : 3;
  const progress = Math.min(100, Math.max(0, (daysPregnant / 280) * 100));
  const daysRemaining = diffDays(today, dueDate);

  const conceptionDate = addDays(lmpDate, 14);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Sante</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Grossesse</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre date prevue d&apos;accouchement et suivez l&apos;avancement de votre grossesse semaine par semaine.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date des dernieres regles</label>
              <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Date prevue d&apos;accouchement</p>
              <p className="mt-3 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {formatDate(dueDate)}
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Date estimee de conception : {formatDate(conceptionDate)}
              </p>
            </div>

            {/* Progress */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {weeksPregnant}<span className="text-lg">s</span> {daysExtra}<span className="text-lg">j</span>
                  </p>
                  <p className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>Semaines de grossesse</p>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                    {trimester}<span className="text-lg">e</span>
                  </p>
                  <p className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>Trimestre</p>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: daysRemaining < 0 ? "#dc2626" : "var(--primary)" }}>
                    {Math.max(0, daysRemaining)}
                  </p>
                  <p className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>Jours restants</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-medium" style={{ color: "var(--muted)" }}>
                  <span>Debut</span>
                  <span>{progress.toFixed(0)}%</span>
                  <span>Accouchement</span>
                </div>
                <div className="mt-2 h-4 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Etapes cles</h2>
              <div className="mt-4 space-y-3">
                {MILESTONES.map((m) => {
                  const mDate = addDays(lmpDate, m.week * 7);
                  const passed = today >= mDate;
                  return (
                    <div key={m.week} className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ background: passed ? "var(--primary)" : "var(--border)" }} />
                      <span className="w-16 text-sm font-bold" style={{ color: passed ? "var(--primary)" : "var(--muted)" }}>SA {m.week}</span>
                      <span className="text-sm" style={{ color: passed ? "var(--foreground)" : "var(--muted)" }}>{m.label}</span>
                      <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>{mDate.toLocaleDateString("fr-FR")}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment est calculee la date ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>La date prevue d&apos;accouchement (DPA) est calculee en ajoutant 280 jours (40 semaines) a la date du premier jour des dernieres regles (regle de Naegele).</p>
                <p>Les semaines d&apos;amenorrhee (SA) comptent a partir du premier jour des dernieres regles. La grossesse est a terme entre 37 et 42 SA. Seuls 5% des bebes naissent exactement a la date prevue.</p>
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
