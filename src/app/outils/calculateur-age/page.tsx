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

function getZodiacSign(month: number, day: number): { sign: string; symbol: string } {
  const signs = [
    { sign: "Capricorne", symbol: "♑", start: [1, 1], end: [1, 19] },
    { sign: "Verseau", symbol: "♒", start: [1, 20], end: [2, 18] },
    { sign: "Poissons", symbol: "♓", start: [2, 19], end: [3, 20] },
    { sign: "Belier", symbol: "♈", start: [3, 21], end: [4, 19] },
    { sign: "Taureau", symbol: "♉", start: [4, 20], end: [5, 20] },
    { sign: "Gemeaux", symbol: "♊", start: [5, 21], end: [6, 20] },
    { sign: "Cancer", symbol: "♋", start: [6, 21], end: [7, 22] },
    { sign: "Lion", symbol: "♌", start: [7, 23], end: [8, 22] },
    { sign: "Vierge", symbol: "♍", start: [8, 23], end: [9, 22] },
    { sign: "Balance", symbol: "♎", start: [9, 23], end: [10, 22] },
    { sign: "Scorpion", symbol: "♏", start: [10, 23], end: [11, 21] },
    { sign: "Sagittaire", symbol: "♐", start: [11, 22], end: [12, 21] },
    { sign: "Capricorne", symbol: "♑", start: [12, 22], end: [12, 31] },
  ];
  for (const s of signs) {
    const afterStart = month > s.start[0] || (month === s.start[0] && day >= s.start[1]);
    const beforeEnd = month < s.end[0] || (month === s.end[0] && day <= s.end[1]);
    if (afterStart && beforeEnd) return { sign: s.sign, symbol: s.symbol };
  }
  return { sign: "Capricorne", symbol: "♑" };
}

function getDayOfWeek(d: Date): string {
  return d.toLocaleDateString("fr-FR", { weekday: "long" });
}

export default function CalculateurAge() {
  const [birthDate, setBirthDate] = useState("1990-01-15");

  const results = useMemo(() => {
    const birth = parseDate(birthDate);
    if (!birth) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Exact age in years, months, days
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Total days lived
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const nextAge = nextBirthday.getFullYear() - birth.getFullYear();
    const isBirthdayToday = today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();

    // Zodiac
    const zodiac = getZodiacSign(birth.getMonth() + 1, birth.getDate());
    const bornDay = getDayOfWeek(birth);

    return {
      years, months, days,
      totalDays, totalWeeks, totalMonths, totalHours,
      daysUntilBirthday, nextAge, isBirthdayToday,
      zodiac, bornDay,
    };
  }, [birthDate]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Outils</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur d{"'"}<span style={{ color: "var(--primary)" }}>age</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre age exact et decouvrez le decompte avant votre prochain anniversaire.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Date de naissance</h2>
              <div className="mt-4">
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-lg" style={{ borderColor: "var(--border)" }} />
              </div>
            </div>

            {results && (
              <>
                {/* Main result */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Votre age</h2>
                  <div className="mt-4 flex items-baseline gap-3 text-center justify-center">
                    <div>
                      <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{results.years}</span>
                      <span className="ml-1 text-sm" style={{ color: "var(--muted)" }}>an{results.years > 1 ? "s" : ""}</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{results.months}</span>
                      <span className="ml-1 text-sm" style={{ color: "var(--muted)" }}>mois</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{results.days}</span>
                      <span className="ml-1 text-sm" style={{ color: "var(--muted)" }}>jour{results.days > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Statistiques</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatBox label="Jours vecus" value={results.totalDays.toLocaleString("fr-FR")} />
                    <StatBox label="Semaines vecues" value={results.totalWeeks.toLocaleString("fr-FR")} />
                    <StatBox label="Mois vecus" value={results.totalMonths.toLocaleString("fr-FR")} />
                    <StatBox label="Heures vecues" value={results.totalHours.toLocaleString("fr-FR")} />
                  </div>
                </div>

                {/* Next birthday */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Prochain anniversaire</h2>
                  <div className="mt-4 text-center">
                    {results.isBirthdayToday ? (
                      <div>
                        <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                          Joyeux anniversaire !
                        </p>
                        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>Vous fêtez aujourd{"'"}hui vos {results.years} ans</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                          {results.daysUntilBirthday}
                        </p>
                        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                          jour{results.daysUntilBirthday > 1 ? "s" : ""} avant vos {results.nextAge} ans
                        </p>
                        <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                          <div className="h-full rounded-full" style={{
                            width: `${((365 - results.daysUntilBirthday) / 365) * 100}%`,
                            background: "var(--accent)",
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fun facts */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations</h2>
                  <div className="mt-4 space-y-2">
                    <InfoRow label="Ne(e) un" value={`${results.bornDay} (${new Date(birthDate + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })})`} />
                    <InfoRow label="Signe astrologique" value={`${results.zodiac.symbol} ${results.zodiac.sign}`} />
                    <InfoRow label="Generation" value={getGeneration(new Date(birthDate + "T00:00:00").getFullYear())} />
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment calculer son age exact ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Age en annees</strong> : Soustrayez l{"'"}annee de naissance de l{"'"}annee actuelle, puis ajustez si l{"'"}anniversaire n{"'"}est pas encore passe cette annee.</p>
                <p><strong className="text-[var(--foreground)]">Age exact</strong> : Calculez separement les annees, mois et jours restants pour obtenir un age precis au jour pres.</p>
                <p><strong className="text-[var(--foreground)]">Cas pratiques</strong> : Verification de majorite (18 ans), eligibilite retraite, calcul de primes d{"'"}anciennete, documents administratifs.</p>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function getGeneration(year: number): string {
  if (year >= 2013) return "Generation Alpha (2013+)";
  if (year >= 1997) return "Generation Z (1997-2012)";
  if (year >= 1981) return "Millennials (1981-1996)";
  if (year >= 1965) return "Generation X (1965-1980)";
  if (year >= 1946) return "Baby Boomers (1946-1964)";
  return "Generation silencieuse (avant 1946)";
}
