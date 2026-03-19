"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

// Reforme 2023 - age legal selon annee de naissance
const AGES_LEGAUX: { minYear: number; maxYear: number; ageLegal: number; ageAns: number; ageMois: number; trimestres: number }[] = [
  { minYear: 1955, maxYear: 1957, ageLegal: 62, ageAns: 62, ageMois: 0, trimestres: 166 },
  { minYear: 1958, maxYear: 1960, ageLegal: 62, ageAns: 62, ageMois: 0, trimestres: 167 },
  { minYear: 1961, maxYear: 1961, ageLegal: 62.25, ageAns: 62, ageMois: 3, trimestres: 169 },
  { minYear: 1962, maxYear: 1962, ageLegal: 62.5, ageAns: 62, ageMois: 6, trimestres: 169 },
  { minYear: 1963, maxYear: 1963, ageLegal: 62.75, ageAns: 62, ageMois: 9, trimestres: 170 },
  { minYear: 1964, maxYear: 1964, ageLegal: 63, ageAns: 63, ageMois: 0, trimestres: 171 },
  { minYear: 1965, maxYear: 1965, ageLegal: 63.25, ageAns: 63, ageMois: 3, trimestres: 172 },
  { minYear: 1966, maxYear: 1966, ageLegal: 63.5, ageAns: 63, ageMois: 6, trimestres: 172 },
  { minYear: 1967, maxYear: 1967, ageLegal: 63.75, ageAns: 63, ageMois: 9, trimestres: 172 },
  { minYear: 1968, maxYear: 2010, ageLegal: 64, ageAns: 64, ageMois: 0, trimestres: 172 },
];

export default function CalculateurRetraite() {
  const [anneeNaissance, setAnneeNaissance] = useState("1985");
  const [ageDebut, setAgeDebut] = useState("22");
  const [trimestresCotises, setTrimestresCotises] = useState("");

  const result = useMemo(() => {
    const annee = parseInt(anneeNaissance) || 1985;
    const debut = parseInt(ageDebut) || 22;
    const info = AGES_LEGAUX.find((a) => annee >= a.minYear && annee <= a.maxYear);
    if (!info) return null;

    const ageActuel = new Date().getFullYear() - annee;
    const anneesCarriere = Math.max(0, ageActuel - debut);
    const trimEstimes = parseInt(trimestresCotises) || anneesCarriere * 4;
    const trimManquants = Math.max(0, info.trimestres - trimEstimes);
    const anneeDepart = annee + info.ageAns;
    const anneesRestantes = Math.max(0, info.ageAns - ageActuel);

    return {
      ageLegal: info.ageAns,
      ageMois: info.ageMois,
      trimestresRequis: info.trimestres,
      trimEstimes,
      trimManquants,
      ageActuel,
      anneeDepart,
      anneesRestantes,
      tauxPlein: trimEstimes >= info.trimestres,
      ageRetraiteAuto: 67, // Retraite automatique a taux plein
    };
  }, [anneeNaissance, ageDebut, trimestresCotises]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Retraite</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Age de depart a la <span style={{ color: "var(--primary)" }}>retraite</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre age de depart selon la reforme 2023. Trimestres requis et restants.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Annee de naissance</label>
                  <input type="number" value={anneeNaissance} onChange={(e) => setAnneeNaissance(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Age debut de carriere</label>
                  <input type="number" value={ageDebut} onChange={(e) => setAgeDebut(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Trimestres cotises (optionnel)</label>
                  <input type="number" value={trimestresCotises} onChange={(e) => setTrimestresCotises(e.target.value)}
                    placeholder="Auto" className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {result && (
              <>
                {/* Big result */}
                <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Votre age legal de depart</p>
                  <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {result.ageLegal} ans{result.ageMois > 0 && <span className="text-3xl"> et {result.ageMois} mois</span>}
                  </p>
                  <p className="mt-2 text-lg" style={{ color: "var(--muted)" }}>
                    Depart en <strong style={{ color: "var(--foreground)" }}>{result.anneeDepart}</strong>
                    {result.anneesRestantes > 0 && <> (dans {result.anneesRestantes} ans)</>}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <SmallStat label="Age actuel" value={`${result.ageActuel} ans`} />
                  <SmallStat label="Trimestres requis" value={`${result.trimestresRequis}`} />
                  <SmallStat label="Trimestres estimes" value={`${result.trimEstimes}`} color={result.tauxPlein ? "var(--primary)" : "var(--accent)"} />
                  <SmallStat label="Trimestres manquants" value={`${result.trimManquants}`} color={result.trimManquants === 0 ? "var(--primary)" : "#dc2626"} />
                </div>

                {/* Progress bar */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Progression trimestres</h2>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm" style={{ color: "var(--muted)" }}>
                      <span>{result.trimEstimes} cotises</span>
                      <span>{result.trimestresRequis} requis</span>
                    </div>
                    <div className="mt-2 h-4 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(100, (result.trimEstimes / result.trimestresRequis) * 100)}%`,
                          background: result.tauxPlein ? "var(--primary)" : "var(--accent)",
                        }}
                      />
                    </div>
                    <p className="mt-2 text-sm" style={{ color: result.tauxPlein ? "var(--primary)" : "var(--accent)" }}>
                      {result.tauxPlein ? "Vous avez vos trimestres pour le taux plein !" : `Il vous manque ${result.trimManquants} trimestres pour le taux plein.`}
                    </p>
                  </div>
                </div>

                {/* Taux plein vs decote */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Taux plein vs decote</h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    <p>
                      <strong style={{ color: "var(--foreground)" }}>Taux plein (50%)</strong> : vous percevez votre pension de base sans penalite.
                      Pour l&apos;obtenir, vous devez avoir cotise le nombre de trimestres requis selon votre annee de naissance,
                      ou atteindre l&apos;age de <strong style={{ color: "var(--foreground)" }}>67 ans</strong> (taux plein automatique, quelle que soit la duree de cotisation).
                    </p>
                    <p>
                      <strong style={{ color: "#dc2626" }}>Decote (penalite)</strong> : si vous partez a la retraite sans avoir tous vos trimestres
                      et avant 67 ans, votre pension est reduite de <strong style={{ color: "#dc2626" }}>1,25% par trimestre manquant</strong> (soit 5% par an).
                      La decote maximale est de 20 trimestres, soit une reduction pouvant atteindre 25% de votre pension.
                    </p>
                    <p>
                      <strong style={{ color: "var(--primary)" }}>Surcote</strong> : si vous continuez a travailler apres le taux plein,
                      votre pension est majoree de <strong style={{ color: "var(--primary)" }}>1,25% par trimestre supplementaire</strong>.
                    </p>
                  </div>
                </div>

                {/* Agirc-Arrco */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Retraite complementaire Agirc-Arrco</h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    <p>
                      En plus de la retraite de base (regime general), les salaries du secteur prive cotisent obligatoirement
                      a l&apos;<strong style={{ color: "var(--foreground)" }}>Agirc-Arrco</strong>, la caisse de retraite complementaire.
                      Cette pension peut representer <strong style={{ color: "var(--foreground)" }}>40 a 60%</strong> de votre retraite totale.
                    </p>
                    <p>
                      Depuis 2019, un <strong style={{ color: "var(--foreground)" }}>coefficient de solidarite (malus)</strong> de 10%
                      s&apos;applique pendant 3 ans si vous partez des l&apos;obtention du taux plein.
                      Pour l&apos;eviter, il faut decaler son depart d&apos;un an apres la date du taux plein.
                    </p>
                    <p>
                      Le montant de votre complementaire depend du <strong style={{ color: "var(--foreground)" }}>nombre de points accumules</strong> tout au long de votre carriere,
                      multiplie par la valeur du point (1,4159 &euro; en 2024). Consultez votre releve de carriere sur{" "}
                      <span style={{ color: "var(--primary)", fontWeight: 600 }}>info-retraite.fr</span> pour une estimation personnalisee.
                    </p>
                  </div>
                </div>

                {/* Table reforme */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Reforme retraite 2023</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ color: "var(--muted)" }}>
                          <th className="pb-2 text-left font-medium">Naissance</th>
                          <th className="pb-2 text-right font-medium">Age legal</th>
                          <th className="pb-2 text-right font-medium">Trimestres</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AGES_LEGAUX.map((a, i) => {
                          const annee = parseInt(anneeNaissance) || 1985;
                          const isActive = annee >= a.minYear && annee <= a.maxYear;
                          return (
                            <tr key={i} className="border-t" style={{
                              borderColor: "var(--surface-alt)",
                              background: isActive ? "var(--surface-alt)" : "transparent",
                            }}>
                              <td className="py-2" style={isActive ? { fontWeight: 700, color: "var(--primary)" } : {}}>
                                {a.minYear === a.maxYear ? a.minYear : `${a.minYear}-${a.maxYear}`}
                              </td>
                              <td className="py-2 text-right">{a.ageAns} ans{a.ageMois > 0 && ` ${a.ageMois} mois`}</td>
                              <td className="py-2 text-right">{a.trimestres}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur de retraite
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce simulateur vous permet d&apos;estimer votre age de depart a la retraite selon la reforme 2023, en tenant compte de votre annee de naissance et de votre parcours professionnel. Retrouvez vos trimestres requis et verifiez si vous pouvez beneficier du taux plein.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Indiquez votre annee de naissance</strong> : l&apos;age legal de depart et le nombre de trimestres requis dependent directement de votre generation, suite a la reforme des retraites 2023.</li>
                  <li><strong className="text-[var(--foreground)]">Precisez votre age de debut de carriere</strong> : cela permet d&apos;estimer automatiquement le nombre de trimestres deja cotises si vous ne le connaissez pas.</li>
                  <li><strong className="text-[var(--foreground)]">Renseignez vos trimestres (optionnel)</strong> : si vous connaissez votre nombre exact de trimestres cotises (via votre releve de carriere sur info-retraite.fr), saisissez-le pour un resultat plus precis.</li>
                  <li><strong className="text-[var(--foreground)]">Consultez le resultat</strong> : age legal, annee de depart, trimestres manquants et progression vers le taux plein.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel est l&apos;age legal de depart a la retraite apres la reforme 2023 ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Depuis la reforme de 2023, l&apos;age legal de depart a la retraite passe progressivement de 62 a 64 ans. Les personnes nees a partir de 1968 devront attendre 64 ans. Pour les generations intermediaires (1961-1967), l&apos;age augmente de 3 mois par annee de naissance.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien de trimestres faut-il pour le taux plein ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le nombre de trimestres requis pour le taux plein varie de 166 a 172 selon votre annee de naissance. Pour les personnes nees a partir de 1965, il faut 172 trimestres (soit 43 annees de cotisation). Alternativement, vous obtenez automatiquement le taux plein a 67 ans, quel que soit votre nombre de trimestres.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Que se passe-t-il si je pars a la retraite sans tous mes trimestres ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Si vous partez avant d&apos;avoir tous vos trimestres et avant 67 ans, une decote de 1,25% par trimestre manquant est appliquee sur votre pension de base. La decote maximale est de 20 trimestres, soit une reduction pouvant atteindre 25% de votre pension. Il peut etre plus avantageux de travailler quelques trimestres de plus pour eviter cette penalite.</p>
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

function SmallStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="mt-1 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: color || "var(--foreground)" }}>{value}</p>
    </div>
  );
}
