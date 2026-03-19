"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

// French CPI data (base 100 = 2015) - approximate annual average indices
const CPI_DATA: Record<number, number> = {
  1970: 12.6, 1971: 13.3, 1972: 14.1, 1973: 15.1, 1974: 17.2, 1975: 19.2,
  1976: 21.0, 1977: 23.0, 1978: 25.1, 1979: 27.8, 1980: 31.6, 1981: 35.8,
  1982: 40.1, 1983: 43.9, 1984: 47.2, 1985: 49.9, 1986: 51.2, 1987: 52.9,
  1988: 54.3, 1989: 56.2, 1990: 58.1, 1991: 59.9, 1992: 61.4, 1993: 62.6,
  1994: 63.7, 1995: 64.8, 1996: 66.1, 1997: 66.9, 1998: 67.4, 1999: 67.7,
  2000: 68.9, 2001: 70.0, 2002: 71.4, 2003: 72.8, 2004: 74.4, 2005: 75.7,
  2006: 77.0, 2007: 78.2, 2008: 80.4, 2009: 80.5, 2010: 81.7, 2011: 83.5,
  2012: 85.2, 2013: 85.9, 2014: 86.4, 2015: 86.4, 2016: 86.6, 2017: 87.5,
  2018: 89.1, 2019: 90.1, 2020: 90.6, 2021: 92.0, 2022: 97.2, 2023: 101.7,
  2024: 104.0, 2025: 106.1,
};

const YEARS = Object.keys(CPI_DATA).map(Number).sort();
const MIN_YEAR = YEARS[0];
const MAX_YEAR = YEARS[YEARS.length - 1];

export default function CalculateurInflation() {
  const [montant, setMontant] = useState("1000");
  const [anneeOrigine, setAnneeOrigine] = useState("2000");
  const [anneeComparaison, setAnneeComparaison] = useState("2025");

  const result = useMemo(() => {
    const m = parseFloat(montant) || 0;
    const y1 = parseInt(anneeOrigine) || 0;
    const y2 = parseInt(anneeComparaison) || 0;
    if (m <= 0 || !CPI_DATA[y1] || !CPI_DATA[y2]) return null;

    const ratio = CPI_DATA[y2] / CPI_DATA[y1];
    const equivalent = m * ratio;
    const variation = ((ratio - 1) * 100);
    const nbYears = Math.abs(y2 - y1);
    const tauxAnnuelMoyen = nbYears > 0 ? (Math.pow(ratio, 1 / nbYears) - 1) * 100 : 0;

    // Build chart data per decade
    const chartData: { year: number; value: number }[] = [];
    const startY = Math.min(y1, y2);
    const endY = Math.max(y1, y2);
    for (let y = startY; y <= endY; y++) {
      if (CPI_DATA[y]) {
        chartData.push({
          year: y,
          value: m * (CPI_DATA[y] / CPI_DATA[y1]),
        });
      }
    }

    return { equivalent, variation, tauxAnnuelMoyen, nbYears, ratio, chartData };
  }, [montant, anneeOrigine, anneeComparaison]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const maxChartVal = result ? Math.max(...result.chartData.map((d) => d.value)) : 1;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur d&apos;<span style={{ color: "var(--primary)" }}>inflation</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez l&apos;equivalent d&apos;un montant dans le temps avec l&apos;inflation francaise (IPC). Donnees de {MIN_YEAR} a {MAX_YEAR}.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parametres</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant (&euro;)</label>
                  <input type="number" step="0.01" value={montant} onChange={(e) => setMontant(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Annee de depart</label>
                  <select value={anneeOrigine} onChange={(e) => setAnneeOrigine(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Annee de comparaison</label>
                  <select value={anneeComparaison} onChange={(e) => setAnneeComparaison(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Equivalent en {anneeComparaison}</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.equivalent)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Inflation cumulee</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>+{result.variation.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux annuel moyen</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.tauxAnnuelMoyen.toFixed(2)}%</p>
                  </div>
                </div>

                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                    Evolution du pouvoir d&apos;achat de {fmt(parseFloat(montant) || 0)} &euro; ({anneeOrigine})
                  </h2>
                  <div className="mt-4 space-y-1">
                    {result.chartData.filter((_, i) => i % Math.max(1, Math.floor(result.chartData.length / 15)) === 0 || i === result.chartData.length - 1).map((d) => (
                      <div key={d.year} className="flex items-center gap-3">
                        <span className="w-10 text-right text-xs font-semibold" style={{ color: "var(--muted)" }}>{d.year}</span>
                        <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                          <div className="h-full rounded-full" style={{ width: `${(d.value / maxChartVal) * 100}%`, background: "var(--primary)", transition: "width 0.3s" }} />
                        </div>
                        <span className="w-24 text-right text-xs font-bold">{fmt(d.value)} &euro;</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comprendre l&apos;inflation</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">IPC</strong> : L&apos;Indice des Prix a la Consommation mesure l&apos;evolution du cout d&apos;un panier de biens et services representatif.</p>
                <p><strong className="text-[var(--foreground)]">Pouvoir d&apos;achat</strong> : L&apos;inflation reduit le pouvoir d&apos;achat de la monnaie. 100 &euro; en 2000 n&apos;achetent plus autant qu&apos;aujourd&apos;hui.</p>
                <p><strong className="text-[var(--foreground)]">Source</strong> : Donnees basees sur l&apos;IPC INSEE (Institut National de la Statistique et des Etudes Economiques).</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur d&apos;inflation
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce calculateur d&apos;inflation vous permet de comparer la valeur d&apos;un montant en euros entre deux annees, en tenant compte de l&apos;evolution des prix en France. Les donnees utilisees sont basees sur l&apos;Indice des Prix a la Consommation (IPC) publie par l&apos;INSEE, de 1970 a 2025.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Saisissez un montant</strong> : par exemple 1 000 &euro; pour connaitre son equivalent dans une autre annee.</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez l&apos;annee de depart</strong> : l&apos;annee a laquelle ce montant etait valable (par exemple 2000).</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez l&apos;annee de comparaison</strong> : l&apos;annee pour laquelle vous voulez connaitre l&apos;equivalent en pouvoir d&apos;achat.</li>
                </ul>
                <p>L&apos;outil affiche l&apos;equivalent ajuste a l&apos;inflation, le taux d&apos;inflation cumule et le taux annuel moyen sur la periode. Le graphique retrace l&apos;evolution du pouvoir d&apos;achat de votre montant annee par annee.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien valent 1 000 &euro; de l&apos;an 2000 aujourd&apos;hui ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>1 000 &euro; de l&apos;an 2000 correspondent a environ 1 540 &euro; en 2025, soit une inflation cumulee d&apos;environ 54% sur 25 ans. Autrement dit, il faut aujourd&apos;hui 1 540 &euro; pour acheter ce que 1 000 &euro; permettaient d&apos;acheter en 2000. Le taux d&apos;inflation annuel moyen sur cette periode est d&apos;environ 1,7%.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qu&apos;est-ce que l&apos;IPC et comment est-il calcule ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>L&apos;IPC (Indice des Prix a la Consommation) est un indicateur publie chaque mois par l&apos;INSEE. Il mesure l&apos;evolution du niveau general des prix des biens et services consommes par les menages en France. L&apos;indice est base sur un panier representatif d&apos;environ 1 100 familles de produits, pondere selon les habitudes de consommation des Francais.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi l&apos;inflation a-t-elle ete si forte en 2022-2023 ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La poussee inflationniste de 2022-2023 (environ 5 a 6% par an en France) est principalement due a la hausse des prix de l&apos;energie liee a la guerre en Ukraine, aux perturbations des chaines d&apos;approvisionnement post-Covid et a la forte reprise economique mondiale. Le bouclier tarifaire mis en place par l&apos;Etat a limite l&apos;impact en France par rapport a d&apos;autres pays europeens.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Inflation par decennie</h3>
              <div className="mt-3 space-y-2">
                {[
                  { periode: "1970-1980", taux: "~11%/an" },
                  { periode: "1980-1990", taux: "~6%/an" },
                  { periode: "1990-2000", taux: "~1.7%/an" },
                  { periode: "2000-2010", taux: "~1.7%/an" },
                  { periode: "2010-2020", taux: "~1.0%/an" },
                  { periode: "2020-2025", taux: "~3.2%/an" },
                ].map((d) => (
                  <div key={d.periode} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{d.periode}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{d.taux}</span>
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
