"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type Tranche = { min: number; max: number; rate: number; label: string };

// Baremes officiels connus (source: loi de finances)
// Les seuils sont revalorises chaque annee en fonction de l'inflation.
// Pour les annees futures sans bareme officiel, on extrapole a partir du dernier
// bareme connu avec le taux de revalorisation moyen (~2%).
const BAREMES_OFFICIELS: Record<number, number[]> = {
  // [seuil_0%, seuil_11%, seuil_30%, seuil_41%]
  // Source: lois de finances successives
  2023: [11294, 28797, 82341, 177106],
  2024: [11497, 29315, 83823, 180294],  // LF 2024 (+4.8%)
  2025: [11600, 29579, 84577, 181917],  // LF 2026 applicable revenus 2025 (+0.9%)
};

const TAUX = [0, 0.11, 0.30, 0.41, 0.45];
const TAUX_LABELS = ["0%", "11%", "30%", "41%", "45%"];
const REVALORISATION = 0.02; // ~2% annuel moyen

function getLastOfficiel(): { annee: number; seuils: number[] } {
  const annees = Object.keys(BAREMES_OFFICIELS).map(Number).sort((a, b) => b - a);
  const annee = annees[0];
  return { annee, seuils: BAREMES_OFFICIELS[annee] };
}

function getSeuilsPourAnnee(annee: number): number[] {
  if (BAREMES_OFFICIELS[annee]) return BAREMES_OFFICIELS[annee];
  const last = getLastOfficiel();
  const delta = annee - last.annee;
  if (delta <= 0) return last.seuils; // annee avant le plus ancien connu
  const factor = Math.pow(1 + REVALORISATION, delta);
  return last.seuils.map((s) => Math.round(s * factor));
}

function buildTranches(seuils: number[]): Tranche[] {
  const limits = [0, ...seuils, Infinity];
  return TAUX.map((rate, i) => ({
    min: limits[i],
    max: limits[i + 1],
    rate,
    label: TAUX_LABELS[i],
  }));
}

function buildBaremes() {
  const now = new Date();
  const currentYear = now.getFullYear();
  // Couvrir de 2023 jusqu'a l'annee en cours
  const startYear = Math.min(...Object.keys(BAREMES_OFFICIELS).map(Number));
  const endYear = currentYear;
  const result: { annee: number; label: string; tranches: Tranche[]; estime: boolean }[] = [];
  for (let y = endYear; y >= startYear; y--) {
    result.push({
      annee: y,
      label: `Revenus ${y} (declaration ${y + 1})`,
      tranches: buildTranches(getSeuilsPourAnnee(y)),
      estime: !BAREMES_OFFICIELS[y],
    });
  }
  return result;
}

const BAREMES = buildBaremes();

function getDefaultAnnee(): number {
  const now = new Date();
  const year = now.getFullYear();
  // Avant septembre : on declare les revenus de l'annee precedente
  const target = now.getMonth() < 9 ? year - 1 : year;
  return BAREMES.find((b) => b.annee <= target)?.annee ?? BAREMES[0].annee;
}

function simulerImpot(revenuNet: number, parts: number, tranches: Tranche[]) {
  const quotient = revenuNet / parts;
  let impotParPart = 0;
  const details: { tranche: string; base: number; taux: number; impot: number }[] = [];

  for (const t of tranches) {
    if (quotient <= t.min) break;
    const base = Math.min(quotient, t.max) - t.min;
    const imp = base * t.rate;
    impotParPart += imp;
    if (base > 0) {
      details.push({ tranche: `${t.min.toLocaleString("fr-FR")} - ${t.max === Infinity ? "+" : t.max.toLocaleString("fr-FR")} €`, taux: t.rate, base, impot: imp });
    }
  }

  const impotTotal = impotParPart * parts;
  const tauxMoyen = revenuNet > 0 ? (impotTotal / revenuNet) * 100 : 0;
  const tauxMarginal = tranches.findLast((t) => quotient > t.min)?.rate ?? 0;
  const revenuApresImpot = revenuNet - impotTotal;

  return { impotTotal, tauxMoyen, tauxMarginal, revenuApresImpot, details, impotParPart };
}

export default function SimulateurImpot() {
  const [revenu, setRevenu] = useState("35000");
  const [parts, setParts] = useState("1");
  const [situation, setSituation] = useState("celibataire");
  const [annee, setAnnee] = useState(() => getDefaultAnnee());

  const partsNum = parseFloat(parts) || 1;
  const revenuNum = parseFloat(revenu) || 0;
  const bareme = BAREMES.find((b) => b.annee === annee) ?? BAREMES[0];

  const result = useMemo(() => simulerImpot(revenuNum, partsNum, bareme.tranches), [revenuNum, partsNum, bareme.tranches]);

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtPct = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>impot sur le revenu</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre impot sur les revenus {annee} avec le bareme officiel. Quotient familial et taux marginal inclus.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="space-y-4">
                {/* Annee de revenus */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Annee de revenus
                  </label>
                  <select
                    value={annee}
                    onChange={(e) => setAnnee(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {BAREMES.map((b) => (
                      <option key={b.annee} value={b.annee}>
                        {b.label}{b.estime ? " (estime)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

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
              <StatBox label="Impot total" value={`${fmt(result.impotTotal)} €`} primary />
              <StatBox label="Par mois" value={`${fmt(result.impotTotal / 12)} €`} />
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
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Bareme {annee + 1} (revenus {annee})</h2>
              <div className="mt-4 space-y-2">
                {bareme.tranches.map((t, i) => {
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

            {/* FAQ Section */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Questions frequentes
              </h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Quel est le bareme de l&apos;impot sur le revenu 2026 ?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Le bareme 2026 (applicable aux revenus 2025) a ete revalorise de 0,9&nbsp;% par la loi
                    de finances 2026 pour tenir compte de l&apos;inflation. Les tranches sont les suivantes :
                    0&nbsp;% jusqu&apos;a 11&nbsp;600&nbsp;&euro;, 11&nbsp;% de 11&nbsp;601 a 29&nbsp;579&nbsp;&euro;,
                    30&nbsp;% de 29&nbsp;580 a 84&nbsp;577&nbsp;&euro;, 41&nbsp;% de 84&nbsp;578 a
                    181&nbsp;917&nbsp;&euro;, et 45&nbsp;% au-dela. Ces seuils s&apos;appliquent par part
                    de quotient familial.
                  </p>
                </div>

                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Comment fonctionne le quotient familial ?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Le quotient familial divise votre revenu net imposable par le nombre de parts fiscales
                    de votre foyer. Un celibataire a 1 part, un couple marie ou pacse a 2 parts. Chacun des
                    deux premiers enfants a charge ajoute 0,5 part, et chaque enfant a partir du troisieme
                    ajoute 1 part. L&apos;impot est calcule sur ce quotient, puis multiplie par le nombre
                    de parts. Ce mecanisme avantage les familles nombreuses, mais un plafonnement limite
                    l&apos;avantage a environ 1&nbsp;759&nbsp;&euro; par demi-part supplementaire en 2026.
                  </p>
                </div>

                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                    Quand declarer ses impots en 2026 ?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    La declaration des revenus 2025 s&apos;effectue au printemps 2026. Le service en ligne
                    sur impots.gouv.fr ouvre generalement mi-avril. Les dates limites varient selon votre
                    departement de residence : fin mai pour les departements 01 a 19, debut juin pour les
                    departements 20 a 54, et mi-juin pour les departements 55 et au-dela. La declaration
                    papier, reservee aux contribuables ne pouvant declarer en ligne, doit etre deposee
                    fin mai. Le prelevement a la source est ajuste en septembre apres traitement de votre
                    declaration.
                  </p>
                </div>
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
