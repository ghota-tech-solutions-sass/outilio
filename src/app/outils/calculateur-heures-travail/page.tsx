"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

interface DayEntry {
  start: string;
  end: string;
  breakMin: string;
}

function timeToMinutes(t: string): number {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatHours(minutes: number): string {
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  const sign = minutes < 0 ? "-" : "";
  return `${sign}${h}h${m.toString().padStart(2, "0")}`;
}

export default function CalculateurHeuresTravail() {
  const [weeklyContract, setWeeklyContract] = useState("35");
  const [entries, setEntries] = useState<DayEntry[]>(
    DAYS.map((_, i) => ({
      start: i < 5 ? "09:00" : "",
      end: i < 5 ? "17:30" : "",
      breakMin: i < 5 ? "60" : "0",
    }))
  );

  const updateEntry = (index: number, key: keyof DayEntry, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [key]: value };
    setEntries(newEntries);
  };

  const results = useMemo(() => {
    const daily = entries.map((e) => {
      if (!e.start || !e.end) return 0;
      const worked = timeToMinutes(e.end) - timeToMinutes(e.start) - (parseInt(e.breakMin) || 0);
      return Math.max(0, worked);
    });
    const totalMinutes = daily.reduce((a, b) => a + b, 0);
    const contractMinutes = (parseFloat(weeklyContract) || 35) * 60;
    const overtime = Math.max(0, totalMinutes - contractMinutes);
    const daysWorked = daily.filter((d) => d > 0).length;
    const avgPerDay = daysWorked > 0 ? totalMinutes / daysWorked : 0;

    return { daily, totalMinutes, contractMinutes, overtime, daysWorked, avgPerDay };
  }, [entries, weeklyContract]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Travail</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur d{"'"}
            <span style={{ color: "var(--primary)" }}>heures de travail</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez vos heures de travail, pauses, heures supplementaires et totaux hebdomadaires.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Contract hours */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Contrat</h2>
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Heures hebdomadaires contractuelles</label>
                <input type="number" value={weeklyContract} onChange={(e) => setWeeklyContract(e.target.value)} min="0" step="0.5"
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
              </div>
            </div>

            {/* Weekly entries */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Horaires de la semaine</h2>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-[120px_1fr_1fr_80px_80px] gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  <span>Jour</span>
                  <span>Debut</span>
                  <span>Fin</span>
                  <span>Pause (min)</span>
                  <span className="text-right">Total</span>
                </div>
                {DAYS.map((day, i) => (
                  <div key={day} className="grid grid-cols-[120px_1fr_1fr_80px_80px] items-center gap-2">
                    <span className="text-sm font-semibold">{day}</span>
                    <input type="time" value={entries[i].start} onChange={(e) => updateEntry(i, "start", e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: "var(--border)" }} />
                    <input type="time" value={entries[i].end} onChange={(e) => updateEntry(i, "end", e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: "var(--border)" }} />
                    <input type="number" value={entries[i].breakMin} onChange={(e) => updateEntry(i, "breakMin", e.target.value)} min="0"
                      className="rounded-lg border px-2 py-2 text-center text-sm" style={{ borderColor: "var(--border)" }} />
                    <span className="text-right text-sm font-bold" style={{ color: results.daily[i] > 0 ? "var(--primary)" : "var(--muted)" }}>
                      {results.daily[i] > 0 ? formatHours(results.daily[i]) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Recapitulatif</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <ResultBox label="Total travaille" value={formatHours(results.totalMinutes)} primary />
                <ResultBox label="Heures sup." value={results.overtime > 0 ? formatHours(results.overtime) : "0h00"} accent={results.overtime > 0} />
                <ResultBox label="Jours travailles" value={`${results.daysWorked}`} />
                <ResultBox label="Moyenne / jour" value={formatHours(Math.round(results.avgPerDay))} />
              </div>
              <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--muted)" }}>Contrat : {weeklyContract}h / semaine</span>
                  <span className="font-bold" style={{ color: results.overtime > 0 ? "var(--accent)" : "var(--primary)" }}>
                    {results.overtime > 0
                      ? `+${formatHours(results.overtime)} supplementaires`
                      : results.totalMinutes < results.contractMinutes
                      ? `${formatHours(results.contractMinutes - results.totalMinutes)} restantes`
                      : "Contrat respecte"}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (results.totalMinutes / results.contractMinutes) * 100)}%`,
                      background: results.overtime > 0 ? "var(--accent)" : "var(--primary)",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Duree legale du travail en France</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">35 heures</strong> : La duree legale hebdomadaire est de 35 heures pour les salaries a temps plein. Au-dela, les heures sont considerees comme supplementaires.</p>
                <p><strong className="text-[var(--foreground)]">Heures supplementaires</strong> : Majorees de 25% pour les 8 premieres heures (de la 36e a la 43e) et de 50% au-dela. Le contingent annuel est de 220 heures.</p>
                <p><strong className="text-[var(--foreground)]">Repos obligatoire</strong> : 11 heures consecutives de repos quotidien et 35 heures consecutives de repos hebdomadaire (24h + 11h).</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur d&apos;heures de travail
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Cet outil vous permet de calculer precisement vos heures de travail hebdomadaires, en tenant compte des pauses et du temps de repos. Il compare automatiquement le total a votre contrat pour detecter les heures supplementaires.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Definissez votre contrat</strong> : indiquez le nombre d&apos;heures hebdomadaires prevues par votre contrat de travail (35h par defaut en France).</li>
                  <li><strong className="text-[var(--foreground)]">Remplissez vos horaires</strong> : pour chaque jour, saisissez l&apos;heure de debut, l&apos;heure de fin et la duree de votre pause dejeuner en minutes.</li>
                  <li><strong className="text-[var(--foreground)]">Consultez le recapitulatif</strong> : total des heures travaillees, heures supplementaires, nombre de jours travailles et moyenne journaliere.</li>
                </ul>
                <p>Le calculateur gere automatiquement les semaines de 7 jours, y compris le samedi et le dimanche, pour les salaries qui travaillent le week-end.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>La pause dejeuner est-elle comptee dans le temps de travail ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non, en France la pause dejeuner n&apos;est generalement pas comptee comme du temps de travail effectif. Le Code du travail impose une pause minimale de 20 minutes pour toute periode de 6 heures consecutives de travail. La plupart des entreprises accordent entre 45 minutes et 1 heure de pause repas, qui est deduite du temps de presence.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment sont majorees les heures supplementaires ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>En France, les 8 premieres heures supplementaires (de la 36e a la 43e heure) sont majorees de 25%. Au-dela de 43 heures, la majoration passe a 50%. Le contingent annuel d&apos;heures supplementaires est de 220 heures par salarie, sauf accord de branche different. Un accord d&apos;entreprise peut aussi prevoir le remplacement de la majoration par un repos compensateur equivalent.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la duree maximale de travail par jour en France ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La duree maximale quotidienne de travail est de 10 heures (12 heures sur derogation). La duree maximale hebdomadaire est de 48 heures sur une semaine isolee et de 44 heures en moyenne sur 12 semaines consecutives. Tout salarie doit beneficier d&apos;au moins 11 heures de repos consecutives entre deux journees de travail.</p>
                </div>
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

function ResultBox({ label, value, primary, accent }: { label: string; value: string; primary?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
      <p className="text-xl font-bold" style={{
        fontFamily: "var(--font-display)",
        color: primary ? "var(--primary)" : accent ? "var(--accent)" : "var(--foreground)",
      }}>{value}</p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
    </div>
  );
}
