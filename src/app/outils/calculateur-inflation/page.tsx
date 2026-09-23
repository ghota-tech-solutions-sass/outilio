"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

// French CPI data (INSEE, IPC ensemble des menages, moyennes annuelles) - indices
// reechelonnes (2015 = 86,4) : seuls les rapports entre annees comptent.
// 1990-2025 : serie INSEE 001759970 (base 2015, moyenne des 12 mois).
const CPI_DATA: Record<number, number> = {
  1970: 12.6, 1971: 13.3, 1972: 14.1, 1973: 15.1, 1974: 17.2, 1975: 19.2,
  1976: 21.0, 1977: 23.0, 1978: 25.1, 1979: 27.8, 1980: 31.6, 1981: 35.8,
  1982: 40.1, 1983: 43.9, 1984: 47.2, 1985: 49.9, 1986: 51.2, 1987: 52.9,
  1988: 54.3, 1989: 56.2, 1990: 58.1, 1991: 59.9, 1992: 61.4, 1993: 62.6,
  1994: 63.7, 1995: 64.8, 1996: 66.1, 1997: 66.9, 1998: 67.4, 1999: 67.7,
  2000: 68.9, 2001: 70.0, 2002: 71.4, 2003: 72.8, 2004: 74.4, 2005: 75.7,
  2006: 77.0, 2007: 78.2, 2008: 80.4, 2009: 80.5, 2010: 81.7, 2011: 83.5,
  2012: 85.2, 2013: 85.9, 2014: 86.4, 2015: 86.4, 2016: 86.6, 2017: 87.5,
  2018: 89.1, 2019: 90.1, 2020: 90.5, 2021: 92.0, 2022: 96.8, 2023: 101.5,
  2024: 103.5, 2025: 104.5,
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
            Calculez l&apos;équivalent d&apos;un montant dans le temps avec l&apos;inflation française (IPC). Données de {MIN_YEAR} à {MAX_YEAR}.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Paramètres</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant (&euro;)</label>
                  <input type="number" step="0.01" value={montant} onChange={(e) => setMontant(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Année de départ</label>
                  <select value={anneeOrigine} onChange={(e) => setAnneeOrigine(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Année de comparaison</label>
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
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Équivalent en {anneeComparaison}</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.equivalent)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Inflation cumulée</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>{result.variation >= 0 ? "+" : ""}{result.variation.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux annuel moyen</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.tauxAnnuelMoyen.toFixed(2)}%</p>
                  </div>
                </div>

                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                    Évolution du pouvoir d&apos;achat de {fmt(parseFloat(montant) || 0)} &euro; ({anneeOrigine})
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
                <p><strong className="text-[var(--foreground)]">IPC</strong> : L&apos;Indice des Prix à la Consommation mesure l&apos;évolution du coût d&apos;un panier de biens et services représentatif.</p>
                <p><strong className="text-[var(--foreground)]">Pouvoir d&apos;achat</strong> : L&apos;inflation réduit le pouvoir d&apos;achat de la monnaie. 100 &euro; en 2000 n&apos;achètent plus autant qu&apos;aujourd&apos;hui.</p>
                <p><strong className="text-[var(--foreground)]">Source</strong> : Données basées sur l&apos;IPC INSEE (Institut National de la Statistique et des Études Économiques).</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment calculer l&apos;équivalent d&apos;un montant avec l&apos;inflation"
              description="Trois étapes pour comparer le pouvoir d&apos;achat d&apos;une somme entre deux années, basé sur les indices INSEE."
              steps={[
                {
                  name: "Saisir le montant historique",
                  text:
                    "Renseignez la somme en euros (ou anciennement francs convertis) telle qu'elle existait à son année d'origine. Exemple : 1 000 € en 2000, ou un salaire de 1 500 € en 1995. Pour des francs convertis, utilisez le taux fixe 1 € = 6,55957 FRF (loi du 16 mai 1997).",
                },
                {
                  name: "Choisir les deux années à comparer",
                  text:
                    "Année de départ = année à laquelle le montant était valide. Année de comparaison = année dans laquelle vous voulez exprimer l'équivalent. La base de données couvre 1970 à 2025, fondée sur les moyennes annuelles de l'Indice des Prix à la Consommation (IPC) INSEE, ensemble des ménages.",
                },
                {
                  name: "Lire l'inflation cumulée et le taux annuel moyen",
                  text:
                    "Le résultat affiche l'équivalent ajusté, l'inflation cumulée totale et le taux annuel moyen géométrique. Le graphique trace l'évolution année par année. Utile pour estimer la perte réelle de pouvoir d'achat d'une épargne non revalorisée, ou indexer un loyer ou un salaire.",
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
                    Mon père gagnait 8 000 francs par mois en 1990 (soit environ 1 220 €
                    converti) : équivalent 2025 environ 2 190 €. Comparaison avec le salaire
                    médian actuel : utile pour relativiser un débat sur le pouvoir d&apos;achat
                    intergénérationnel et éviter les anachronismes monétaires.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Estimer la perte d&apos;épargne non revalorisée
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    10 000 € placés en 2010 sur un compte courant non rémunéré valent en 2025
                    environ 7 820 € de pouvoir d&apos;achat (perte 21,8 pourcent). Sur Livret
                    A à 1,5 pourcent moyen sur la période : 12 500 € nominaux mais 9 800 €
                    en pouvoir d&apos;achat réel. L&apos;inflation grignote silencieusement.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Indexation de loyer ou pension alimentaire
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un loyer révisable à la date anniversaire selon l&apos;IRL (Indice de
                    Référence des Loyers, art. 17-1 loi du 6 juillet 1989) : si IRL T2 2024 a
                    augmenté de 3,5 pourcent vs T2 2023, un loyer de 850 € passe à 879,75 €.
                    Pareil pour pensions alimentaires indexées par jugement.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Négociation salariale annuelle
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Avec 5,2 pourcent d&apos;inflation en 2022 et 4,9 pourcent en 2023, un salaire
                    inchangé a perdu environ 9 pourcent de pouvoir d&apos;achat sur deux ans.
                    Lors de l&apos;entretien annuel, c&apos;est l&apos;argument froid : sans
                    augmentation au moins égale à l&apos;inflation, votre revenu réel baisse.
                    Le SMIC, lui, est revalorisé automatiquement par mécanisme légal.
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
                À savoir : IPC INSEE, IRL, et indexation
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>IPC (Indice des Prix à la Consommation).</strong> Publié chaque mois
                  par l&apos;INSEE depuis 1949 (sous diverses formes). Indice base 100 en 2025
                  depuis janvier 2026 (base 2015 auparavant), selon la norme Eurostat. Mesure l&apos;évolution du coût d&apos;un
                  panier de biens et services représentatif des consommations ménages : environ
                  1 100 familles de produits pondérées selon les comptes nationaux. C&apos;est
                  la référence officielle pour mesurer l&apos;inflation en France.
                </p>
                <p>
                  <strong>IPC harmonisé (IPCH).</strong> Variante européenne (Eurostat) avec
                  périmètre légèrement différent (ex : exclut certains produits) pour permettre
                  les comparaisons entre pays UE. La BCE pilote sa politique monétaire sur
                  l&apos;IPCH zone euro, avec une cible de 2 pourcent par an à moyen terme.
                </p>
                <p>
                  <strong>IRL (Indice de Référence des Loyers).</strong> Calculé par
                  l&apos;INSEE chaque trimestre depuis 2008 (art. 17-1 loi du 6 juillet 1989).
                  C&apos;est la moyenne sur 12 mois de l&apos;IPC hors tabac et hors loyers.
                  Sert exclusivement à la révision annuelle des loyers d&apos;habitation.
                  Plafonné à +3,5 pourcent de l&apos;été 2022 (bouclier loyer) jusqu&apos;au
                  1er trimestre 2024, mais ce plafonnement n&apos;est pas reconduit automatiquement.
                </p>
                <p>
                  <strong>Pinel et indexation des loyers.</strong> En dispositif Pinel ou Pinel
                  Plus (art. 199 novovicies CGI), les plafonds de loyer annuels sont revalorisés
                  au 1er janvier selon l&apos;évolution de l&apos;IRL du 3e trimestre N-1.
                  Idem pour les baux commerciaux (ILC ou ILAT selon activité).
                </p>
                <p>
                  <strong>Inflation 2022-2025 : retour brutal.</strong> Après 20 ans entre 0,5
                  et 2 pourcent, l&apos;inflation française (IPC INSEE, moyenne annuelle) a atteint
                  5,2 pourcent en 2022 et 4,9 pourcent en 2023 (énergie + alimentation). Retour à
                  2,0 pourcent en 2024 puis 0,9 pourcent en 2025. Pour mémoire, la poussée 1973-1985 atteignait 10-15 pourcent par
                  an, lien avec les chocs pétroliers. La France a connu une désinflation
                  réussie 1985-2000 grâce à l&apos;ancrage allemand et la convergence euro.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions fréquentes sur l&apos;inflation française et le calcul du pouvoir d&apos;achat."
              items={[
                {
                  question: "Combien valent 1 000 € de l'an 2000 aujourd'hui ?",
                  answer:
                    "Environ 1 520 € en 2025, soit une inflation cumulée d'environ 52 pourcent sur 25 ans (taux annuel moyen 1,7 pourcent). Il faut donc 1 520 € aujourd'hui pour acheter ce que 1 000 € permettaient en 2000. C'est aussi pourquoi un salaire stagnant à 2 000 € depuis 2010 représente une perte de pouvoir d'achat réelle d'environ 22 pourcent en 2025.",
                },
                {
                  question: "Qu'est-ce que l'IPC et comment est-il calculé ?",
                  answer:
                    "L'IPC (Indice des Prix à la Consommation) est un indicateur mensuel publié par l'INSEE depuis 1949. Mesure l'évolution moyenne des prix d'un panier de biens et services consommés par les ménages en France. Base 100 en 2025 depuis janvier 2026 (base 2015 auparavant). Construction : environ 200 000 relevés de prix par mois sur 1 100 familles de produits, pondérées selon les comptes nationaux et l'enquête de consommation des ménages.",
                },
                {
                  question: "Pourquoi l'inflation a-t-elle été si forte en 2022-2023 ?",
                  answer:
                    "Conjoncture multifactorielle. 1) Hausse des prix de l'énergie post-Covid puis flambée gaz/électricité suite à la guerre en Ukraine (2022). 2) Goulots d'étranglement chaînes d'approvisionnement (semi-conducteurs, transport maritime). 3) Effet rattrapage de la demande (épargne forcée Covid). 4) Tensions salariales en fin de cycle. La France a partiellement amorti via le bouclier tarifaire énergie (coût budgétaire 110 Md€ sur 2022-2023).",
                },
                {
                  question: "Comment l'IRL revalorise-t-il les loyers ?",
                  answer:
                    "L'IRL (Indice de Référence des Loyers, art. 17-1 loi du 6 juillet 1989) est publié chaque trimestre par l'INSEE. C'est la moyenne sur 12 mois de l'IPC hors tabac et hors loyers. La revalorisation annuelle d'un loyer s'effectue à la date d'anniversaire du bail, en multipliant le loyer par (IRL nouveau / IRL ancien). Plafonné à +3,5 pourcent par le bouclier loyer 2022-2024 (non reconduit automatiquement ensuite).",
                },
                {
                  question: "Comment différencier inflation, déflation et désinflation ?",
                  answer:
                    "Inflation : hausse générale des prix sur la durée (cas français courant). Déflation : baisse générale des prix (Japon années 1990-2000, périodes 1929-1932 USA). Désinflation : ralentissement du rythme d'inflation (ex : passage de 4,9 pourcent en 2023 à 2,0 pourcent en 2024 = désinflation). La déflation est considérée dangereuse car elle décourage la consommation immédiate et alourdit la dette réelle.",
                },
                {
                  question: "Quelle est la différence entre IPC et IPC harmonisé (IPCH) ?",
                  answer:
                    "L'IPC est l'indice national français. L'IPCH (IPC harmonisé) est calculé selon une méthodologie commune Eurostat permettant les comparaisons entre pays UE. Différences principales : pondérations différentes, dépenses de santé mesurées nettes des remboursements, traitement différent de certains services. La BCE pilote sa politique monétaire (taux directeurs) sur l'IPCH zone euro avec une cible 2 pourcent par an à moyen terme.",
                },
                {
                  question: "Comment protéger mon épargne contre l'inflation ?",
                  answer:
                    "Livret A et LDDS sont indexés sur la moyenne de l'inflation hors tabac et du taux monétaire €STR (formule révisée semestriellement) : protection partielle. LEP : taux historiquement le plus réactif. Obligations indexées inflation (OAT-i) : protection nominale exacte mais rendement réel faible. Actions monde via PEA / ETF : sur très long terme (15-20 ans +), battent l'inflation de 4-5 pourcent par an réels. Or et immobilier : protections traditionnelles, plus volatiles.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Inflation par décennie</h3>
              <div className="mt-3 space-y-2">
                {[
                  { periode: "1970-1980", taux: "~9.6%/an" },
                  { periode: "1980-1990", taux: "~6%/an" },
                  { periode: "1990-2000", taux: "~1.7%/an" },
                  { periode: "2000-2010", taux: "~1.7%/an" },
                  { periode: "2010-2020", taux: "~1.0%/an" },
                  { periode: "2020-2025", taux: "~2.9%/an" },
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
