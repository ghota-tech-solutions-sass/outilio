"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const TRANCHES = [
  { min: 0, max: 11294, rate: 0, label: "0%" },
  { min: 11294, max: 28797, rate: 0.11, label: "11%" },
  { min: 28797, max: 82341, rate: 0.30, label: "30%" },
  { min: 82341, max: 177106, rate: 0.41, label: "41%" },
  { min: 177106, max: Infinity, rate: 0.45, label: "45%" },
];

function simulerImpot(revenuNet: number, parts: number) {
  const quotient = revenuNet / parts;
  let impotParPart = 0;
  const details: { tranche: string; base: number; taux: number; impot: number }[] = [];

  for (const t of TRANCHES) {
    if (quotient <= t.min) break;
    const base = Math.min(quotient, t.max) - t.min;
    const imp = base * t.rate;
    impotParPart += imp;
    if (base > 0) {
      details.push({ tranche: `${t.min.toLocaleString("fr-FR")} - ${t.max === Infinity ? "+" : t.max.toLocaleString("fr-FR")} \u20AC`, taux: t.rate, base, impot: imp });
    }
  }

  const impotTotal = impotParPart * parts;
  const tauxMoyen = revenuNet > 0 ? (impotTotal / revenuNet) * 100 : 0;
  const tauxMarginal = TRANCHES.findLast((t) => quotient > t.min)?.rate ?? 0;
  const revenuApresImpot = revenuNet - impotTotal;

  return { impotTotal, tauxMoyen, tauxMarginal, revenuApresImpot, details, impotParPart };
}

export default function SimulateurImpot() {
  const [revenu, setRevenu] = useState("35000");
  const [parts, setParts] = useState("1");
  const [situation, setSituation] = useState("celibataire");

  const partsNum = parseFloat(parts) || 1;
  const revenuNum = parseFloat(revenu) || 0;

  const result = useMemo(() => simulerImpot(revenuNum, partsNum), [revenuNum, partsNum]);

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtPct = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>impot sur le revenu</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre impot 2024 avec le bareme officiel. Quotient familial et taux marginal inclus.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Revenu net imposable annuel
                  </label>
                  <div className="relative mt-2">
                    <input type="number" value={revenu} onChange={(e) => setRevenu(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>&euro;/an</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Situation</label>
                    <select value={situation} onChange={(e) => setSituation(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }}>
                      <option value="celibataire">Celibataire</option>
                      <option value="couple">Couple (marie/pacse)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre de parts</label>
                    <input type="number" step="0.5" min="1" value={parts} onChange={(e) => setParts(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Big results */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox label="Impot total" value={`${fmt(result.impotTotal)} \u20AC`} primary />
              <StatBox label="Par mois" value={`${fmt(result.impotTotal / 12)} \u20AC`} />
              <StatBox label="Taux moyen" value={`${fmtPct(result.tauxMoyen)}%`} />
              <StatBox label="Taux marginal" value={`${(result.tauxMarginal * 100).toFixed(0)}%`} accent />
            </div>

            {/* Remaining income */}
            <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Revenu apres impot</p>
              <p className="mt-2 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {fmt(result.revenuApresImpot)} &euro;/an
              </p>
              <p className="mt-1 text-lg" style={{ color: "var(--muted)" }}>
                soit {fmt(result.revenuApresImpot / 12)} &euro;/mois
              </p>
            </div>

            {/* Breakdown by bracket */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Detail par tranche
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="pb-3 text-left font-medium">Tranche</th>
                      <th className="pb-3 text-right font-medium">Taux</th>
                      <th className="pb-3 text-right font-medium">Base imposable</th>
                      <th className="pb-3 text-right font-medium">Impot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.details.map((d, i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                        <td className="py-3">{d.tranche}</td>
                        <td className="py-3 text-right font-semibold" style={{ color: "var(--accent)" }}>{(d.taux * 100).toFixed(0)}%</td>
                        <td className="py-3 text-right">{fmt(d.base)} &euro;</td>
                        <td className="py-3 text-right font-semibold">{fmt(d.impot)} &euro;</td>
                      </tr>
                    ))}
                    <tr className="border-t-2" style={{ borderColor: "var(--primary)" }}>
                      <td className="py-3 font-semibold" colSpan={3}>Total (x {partsNum} part{partsNum > 1 ? "s" : ""})</td>
                      <td className="py-3 text-right text-lg font-bold" style={{ color: "var(--primary)", fontFamily: "var(--font-display)" }}>
                        {fmt(result.impotTotal)} &euro;
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual bar chart */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Bareme 2024</h2>
              <div className="mt-4 space-y-2">
                {TRANCHES.map((t, i) => {
                  const quotient = revenuNum / partsNum;
                  const isActive = quotient > t.min;
                  const fill = isActive ? Math.min(100, ((Math.min(quotient, t.max) - t.min) / (t.max === Infinity ? 200000 : t.max - t.min)) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-8 text-right text-xs font-bold" style={{ color: isActive ? "var(--primary)" : "var(--muted)" }}>{t.label}</span>
                      <div className="h-6 flex-1 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${fill}%`, background: isActive ? "var(--primary)" : "var(--border)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment fonctionne l&apos;impot sur le revenu ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>L&apos;impot sur le revenu en France est <strong className="text-[var(--foreground)]">progressif</strong> : il augmente par tranches. Votre revenu est divise par le nombre de parts fiscales (quotient familial), puis chaque tranche est imposee a son taux.</p>
                <p><strong className="text-[var(--foreground)]">Taux marginal</strong> : c&apos;est le taux de la derniere tranche atteinte. Il s&apos;applique uniquement a la partie du revenu dans cette tranche.</p>
                <p><strong className="text-[var(--foreground)]">Taux moyen</strong> : c&apos;est le rapport entre l&apos;impot total et le revenu. Il est toujours inferieur au taux marginal.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parts fiscales</h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Celibataire : <strong className="text-[var(--foreground)]">1 part</strong></li>
                <li>Couple : <strong className="text-[var(--foreground)]">2 parts</strong></li>
                <li>1er et 2e enfant : <strong className="text-[var(--foreground)]">+0,5 part</strong></li>
                <li>3e enfant et suivants : <strong className="text-[var(--foreground)]">+1 part</strong></li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function StatBox({ label, value, primary, accent }: { label: string; value: string; primary?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="mt-1 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: primary ? "var(--primary)" : accent ? "var(--accent)" : "var(--foreground)" }}>
        {value}
      </p>
    </div>
  );
}
