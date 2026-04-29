"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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

            <ToolHowToSection
              title="Comment calculer l&apos;equivalent d&apos;un montant avec l&apos;inflation"
              description="Trois etapes pour comparer le pouvoir d&apos;achat d&apos;une somme entre deux annees, base sur les indices INSEE."
              steps={[
                {
                  name: "Saisir le montant historique",
                  text:
                    "Renseignez la somme en euros (ou anciennement francs convertis) telle qu&apos;elle existait a son annee d&apos;origine. Exemple : 1 000 EUR en 2000, ou un salaire de 1 500 EUR en 1995. Pour des francs convertis, utilisez le taux fixe 1 EUR = 6,55957 FRF (loi du 16 mai 1997).",
                },
                {
                  name: "Choisir les deux annees a comparer",
                  text:
                    "Annee de depart = annee a laquelle le montant etait valide. Annee de comparaison = annee dans laquelle vous voulez exprimer l&apos;equivalent. La base de donnees couvre 1970 a 2025, fondee sur l&apos;Indice des Prix a la Consommation (IPC) INSEE base 100 en 2015 (norme Eurostat).",
                },
                {
                  name: "Lire l&apos;inflation cumulee et le taux annuel moyen",
                  text:
                    "Le resultat affiche l&apos;equivalent ajuste, l&apos;inflation cumulee totale et le taux annuel moyen geometrique. Le graphique trace l&apos;evolution annee par annee. Utile pour estimer la perte reelle de pouvoir d&apos;achat d&apos;une epargne non revalorisee, ou indexer un loyer ou un salaire.",
                },
              ]}
            />

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Cas d&apos;usage du calculateur d&apos;inflation
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Comparer un salaire historique
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Mon pere gagnait 8 000 francs par mois en 1990 (soit environ 1 220 EUR
                    converti) : equivalent 2025 environ 2 105 EUR. Comparaison avec le salaire
                    median actuel : utile pour relativiser un debat sur le pouvoir d&apos;achat
                    intergenerationnel et eviter les anachronismes monetaires.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Estimer la perte d&apos;epargne non revalorisee
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    10 000 EUR places en 2010 sur un compte courant non remunere valent en 2025
                    environ 7 850 EUR de pouvoir d&apos;achat (perte 21,5 pourcent). Sur Livret
                    A a 1,5 pourcent moyen sur la periode : 12 600 EUR nominaux mais 9 900 EUR
                    en pouvoir d&apos;achat reel. L&apos;inflation grignote silencieusement.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Indexation de loyer ou pension alimentaire
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un loyer revisable a la date anniversaire selon l&apos;IRL (Indice de
                    Reference des Loyers, art. 17-1 loi du 6 juillet 1989) : si IRL T2 2024 a
                    augmente de 3,5 pourcent vs T2 2023, un loyer de 850 EUR passe a 879,75 EUR.
                    Pareil pour pensions alimentaires indexees par jugement.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Negociation salariale annuelle
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Avec 4,9 pourcent d&apos;inflation 2022 et 5,7 pourcent 2023, un salaire
                    inchange a perdu environ 10 pourcent de pouvoir d&apos;achat sur deux ans.
                    Lors de l&apos;entretien annuel, c&apos;est l&apos;argument froid : sans
                    augmentation au moins egale a l&apos;inflation, votre revenu reel baisse.
                    Le SMIC, lui, est revalorise automatiquement par mecanisme legal.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                A savoir : IPC INSEE, IRL, et indexation
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>IPC (Indice des Prix a la Consommation).</strong> Publie chaque mois
                  par l&apos;INSEE depuis 1949 (sous diverses formes). Indice base 100 en 2015
                  selon la norme Eurostat actuelle. Mesure l&apos;evolution du cout d&apos;un
                  panier de biens et services representatif des consommations menages : environ
                  1 100 familles de produits ponderees selon les comptes nationaux. C&apos;est
                  la reference officielle pour mesurer l&apos;inflation en France.
                </p>
                <p>
                  <strong>IPC harmonise (IPCH).</strong> Variante europeenne (Eurostat) avec
                  perimetre legerement different (ex : exclut certains produits) pour permettre
                  les comparaisons entre pays UE. La BCE pilote sa politique monetaire sur
                  l&apos;IPCH zone euro, avec une cible de 2 pourcent par an a moyen terme.
                </p>
                <p>
                  <strong>IRL (Indice de Reference des Loyers).</strong> Calcule par
                  l&apos;INSEE chaque trimestre depuis 2008 (art. 17-1 loi du 6 juillet 1989).
                  C&apos;est la moyenne sur 12 mois de l&apos;IPC hors tabac et hors loyers.
                  Sert exclusivement a la revision annuelle des loyers d&apos;habitation.
                  Plafonne a +3,5 pourcent depuis l&apos;ete 2022 (bouclier loyer) jusqu&apos;a
                  fin 2024, mais ce plafonnement n&apos;est pas reconduit automatiquement.
                </p>
                <p>
                  <strong>Pinel et indexation des loyers.</strong> En dispositif Pinel ou Pinel
                  Plus (art. 199 novovicies CGI), les plafonds de loyer annuels sont revalorises
                  au 1er janvier selon l&apos;evolution de l&apos;IRL du 3e trimestre N-1.
                  Idem pour les baux commerciaux (ILC ou ILAT selon activite).
                </p>
                <p>
                  <strong>Inflation 2022-2025 : retour brutal.</strong> Apres 20 ans entre 0,5
                  et 2 pourcent, l&apos;inflation francaise a atteint 4,9 pourcent en 2022 et
                  5,7 pourcent en 2023 (energie + alimentation). Retour vers 2-3 pourcent en
                  2024-2025. Pour memoire, la poussee 1973-1985 atteignait 10-15 pourcent par
                  an, lien avec les chocs petroliers. La France a connu une desinflation
                  reussie 1985-2000 grace a l&apos;ancrage allemand et la convergence euro.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions frequentes sur l&apos;inflation francaise et le calcul du pouvoir d&apos;achat."
              items={[
                {
                  question: "Combien valent 1 000 EUR de l&apos;an 2000 aujourd&apos;hui ?",
                  answer:
                    "Environ 1 540 EUR en 2025, soit une inflation cumulee d&apos;environ 54 pourcent sur 25 ans (taux annuel moyen 1,7 pourcent). Il faut donc 1 540 EUR aujourd&apos;hui pour acheter ce que 1 000 EUR permettaient en 2000. C&apos;est aussi pourquoi un salaire stagnant a 2 000 EUR depuis 2010 represente une perte de pouvoir d&apos;achat reelle de 18 pourcent en 2025.",
                },
                {
                  question: "Qu&apos;est-ce que l&apos;IPC et comment est-il calcule ?",
                  answer:
                    "L&apos;IPC (Indice des Prix a la Consommation) est un indicateur mensuel publie par l&apos;INSEE depuis 1949. Mesure l&apos;evolution moyenne des prix d&apos;un panier de biens et services consommes par les menages en France. Base 100 en 2015 (norme Eurostat). Construction : environ 200 000 releves de prix par mois sur 1 100 familles de produits, ponderees selon les comptes nationaux et l&apos;enquete de consommation des menages.",
                },
                {
                  question: "Pourquoi l&apos;inflation a-t-elle ete si forte en 2022-2023 ?",
                  answer:
                    "Conjoncture multifactorielle. 1) Hausse des prix de l&apos;energie post-Covid puis flambee gaz/electricite suite a la guerre en Ukraine (2022). 2) Goulots d&apos;etranglement chaines d&apos;approvisionnement (semi-conducteurs, transport maritime). 3) Effet rattrapage de la demande (epargne forcee Covid). 4) Tensions salariales en fin de cycle. La France a partiellement amorti via le bouclier tarifaire energie (cout budgetaire 110 MdEUR sur 2022-2023).",
                },
                {
                  question: "Comment l&apos;IRL revalorise-t-il les loyers ?",
                  answer:
                    "L&apos;IRL (Indice de Reference des Loyers, art. 17-1 loi du 6 juillet 1989) est publie chaque trimestre par l&apos;INSEE. C&apos;est la moyenne sur 12 mois de l&apos;IPC hors tabac et hors loyers. La revalorisation annuelle d&apos;un loyer s&apos;effectue a la date d&apos;anniversaire du bail, en multipliant le loyer par (IRL nouveau / IRL ancien). Plafonne a +3,5 pourcent par le bouclier loyer 2022-2024 (non reconduit automatiquement ensuite).",
                },
                {
                  question: "Comment differencier inflation, deflation et desinflation ?",
                  answer:
                    "Inflation : hausse generale des prix sur la duree (cas francais courant). Deflation : baisse generale des prix (Japon annees 1990-2000, periodes 1929-1932 USA). Desinflation : ralentissement du rythme d&apos;inflation (ex : passage de 5,7 pourcent 2023 a 2,5 pourcent 2024 = desinflation). La deflation est consideree dangereuse car elle decourage la consommation immediate et alourdit la dette reelle.",
                },
                {
                  question: "Quelle est la difference entre IPC et IPC harmonise (IPCH) ?",
                  answer:
                    "L&apos;IPC est l&apos;indice national francais. L&apos;IPCH (IPC harmonise) est calcule selon une methodologie commune Eurostat permettant les comparaisons entre pays UE. Differences principales : l&apos;IPCH exclut le tabac et certains produits, traitement different de la sante et de l&apos;immobilier occupant. La BCE pilote sa politique monetaire (taux directeurs) sur l&apos;IPCH zone euro avec une cible 2 pourcent par an a moyen terme.",
                },
                {
                  question: "Comment proteger mon epargne contre l&apos;inflation ?",
                  answer:
                    "Livret A et LDDS sont indexes sur la moyenne IPC + Euribor 3 mois (formule complexe revisee semestriellement) : protection partielle. LEP : taux historiquement le plus reactif. Obligations indexees inflation (OAT-i) : protection nominale exacte mais rendement reel faible. Actions monde via PEA / ETF : sur tres long terme (15-20 ans +), battent l&apos;inflation de 4-5 pourcent par an reels. Or et immobilier : protections traditionnelles, plus volatiles.",
                },
              ]}
            />
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
