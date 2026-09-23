"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

// Reforme 2023 - age legal selon annee de naissance, avec la suspension prevue par la
// LFSS 2026 (loi n2025-1403 du 30 decembre 2025) pour les pensions prenant effet a compter
// du 1er septembre 2026 (generations 1964 a 1968).
const AGES_LEGAUX: { minYear: number; maxYear: number; ageLegal: number; ageAns: number; ageMois: number; trimestres: number; note?: string }[] = [
  { minYear: 1955, maxYear: 1957, ageLegal: 62, ageAns: 62, ageMois: 0, trimestres: 166 },
  { minYear: 1958, maxYear: 1960, ageLegal: 62, ageAns: 62, ageMois: 0, trimestres: 167 },
  { minYear: 1961, maxYear: 1961, ageLegal: 62.25, ageAns: 62, ageMois: 3, trimestres: 169 },
  { minYear: 1962, maxYear: 1962, ageLegal: 62.5, ageAns: 62, ageMois: 6, trimestres: 169 },
  { minYear: 1963, maxYear: 1963, ageLegal: 62.75, ageAns: 62, ageMois: 9, trimestres: 170 },
  { minYear: 1964, maxYear: 1964, ageLegal: 62.75, ageAns: 62, ageMois: 9, trimestres: 170 },
  { minYear: 1965, maxYear: 1965, ageLegal: 63, ageAns: 63, ageMois: 0, trimestres: 171, note: "Nés du 1er janvier au 31 mars 1965 : 62 ans et 9 mois, 170 trimestres." },
  { minYear: 1966, maxYear: 1966, ageLegal: 63.25, ageAns: 63, ageMois: 3, trimestres: 172 },
  { minYear: 1967, maxYear: 1967, ageLegal: 63.5, ageAns: 63, ageMois: 6, trimestres: 172 },
  { minYear: 1968, maxYear: 1968, ageLegal: 63.75, ageAns: 63, ageMois: 9, trimestres: 172 },
  { minYear: 1969, maxYear: 2010, ageLegal: 64, ageAns: 64, ageMois: 0, trimestres: 172 },
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
      note: info.note,
      ageRetraiteAuto: 67, // Retraite automatique a taux plein
    };
  }, [anneeNaissance, ageDebut, trimestresCotises]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Retraite</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Âge de départ à la <span style={{ color: "var(--primary)" }}>retraite</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre âge de départ selon la réforme 2023, suspendue par la LFSS 2026. Trimestres requis et restants.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Année de naissance</label>
                  <input type="number" value={anneeNaissance} onChange={(e) => setAnneeNaissance(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Âge début de carrière</label>
                  <input type="number" value={ageDebut} onChange={(e) => setAgeDebut(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Trimestres cotisés (optionnel)</label>
                  <input type="number" value={trimestresCotises} onChange={(e) => setTrimestresCotises(e.target.value)}
                    placeholder="Auto" className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {result && (
              <>
                {/* Big result */}
                <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Votre âge légal de départ</p>
                  <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {result.ageLegal} ans{result.ageMois > 0 && <span className="text-3xl"> et {result.ageMois} mois</span>}
                  </p>
                  <p className="mt-2 text-lg" style={{ color: "var(--muted)" }}>
                    Départ en <strong style={{ color: "var(--foreground)" }}>{result.anneeDepart}</strong>
                    {result.anneesRestantes > 0 && <> (dans {result.anneesRestantes} ans)</>}
                  </p>
                  {result.note && (
                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{result.note}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <SmallStat label="Âge actuel" value={`${result.ageActuel} ans`} />
                  <SmallStat label="Trimestres requis" value={`${result.trimestresRequis}`} />
                  <SmallStat label="Trimestres estimés" value={`${result.trimEstimes}`} color={result.tauxPlein ? "var(--primary)" : "var(--accent)"} />
                  <SmallStat label="Trimestres manquants" value={`${result.trimManquants}`} color={result.trimManquants === 0 ? "var(--primary)" : "#dc2626"} />
                </div>

                {/* Progress bar */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Progression trimestres</h2>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm" style={{ color: "var(--muted)" }}>
                      <span>{result.trimEstimes} cotisés</span>
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
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Taux plein vs décote</h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    <p>
                      <strong style={{ color: "var(--foreground)" }}>Taux plein (50%)</strong> : vous percevez votre pension de base sans pénalité.
                      Pour l&apos;obtenir, vous devez avoir cotisé le nombre de trimestres requis selon votre année de naissance,
                      ou atteindre l&apos;âge de <strong style={{ color: "var(--foreground)" }}>67 ans</strong> (taux plein automatique, quelle que soit la durée de cotisation).
                    </p>
                    <p>
                      <strong style={{ color: "#dc2626" }}>Décote (pénalité)</strong> : si vous partez à la retraite sans avoir tous vos trimestres
                      et avant 67 ans, votre pension est réduite de <strong style={{ color: "#dc2626" }}>1,25% par trimestre manquant</strong> (soit 5% par an).
                      La décote maximale est de 20 trimestres, soit une réduction pouvant atteindre 25% de votre pension.
                    </p>
                    <p>
                      <strong style={{ color: "var(--primary)" }}>Surcote</strong> : si vous continuez à travailler après le taux plein,
                      votre pension est majorée de <strong style={{ color: "var(--primary)" }}>1,25% par trimestre supplémentaire</strong>.
                    </p>
                  </div>
                </div>

                {/* Agirc-Arrco */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Retraite complémentaire Agirc-Arrco</h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    <p>
                      En plus de la retraite de base (régime général), les salariés du secteur privé cotisent obligatoirement
                      à l&apos;<strong style={{ color: "var(--foreground)" }}>Agirc-Arrco</strong>, la caisse de retraite complémentaire.
                      Cette pension peut représenter <strong style={{ color: "var(--foreground)" }}>40 à 60%</strong> de votre retraite totale.
                    </p>
                    <p>
                      Le <strong style={{ color: "var(--foreground)" }}>coefficient de solidarité (malus)</strong> de 10% instauré en 2019
                      a été supprimé pour les retraites prenant effet depuis le 1er décembre 2023 (et depuis le 1er avril 2024
                      pour les retraites déjà en cours).
                    </p>
                    <p>
                      Le montant de votre complémentaire dépend du <strong style={{ color: "var(--foreground)" }}>nombre de points accumulés</strong> tout au long de votre carrière,
                      multiplié par la valeur du point (1,4386 &euro; en 2026). Consultez votre relevé de carrière sur{" "}
                      <span style={{ color: "var(--primary)", fontWeight: 600 }}>info-retraite.fr</span> pour une estimation personnalisée.
                    </p>
                  </div>
                </div>

                {/* Table reforme */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Réforme retraite 2023 (suspendue en 2026)</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ color: "var(--muted)" }}>
                          <th className="pb-2 text-left font-medium">Naissance</th>
                          <th className="pb-2 text-right font-medium">Âge légal</th>
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
                <p>Ce simulateur vous permet d&apos;estimer votre âge de départ à la retraite selon la réforme 2023 (et sa suspension par la LFSS 2026), en tenant compte de votre année de naissance et de votre parcours professionnel. Retrouvez vos trimestres requis et vérifiez si vous pouvez bénéficier du taux plein.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Indiquez votre année de naissance</strong> : l&apos;âge légal de départ et le nombre de trimestres requis dépendent directement de votre génération, suite à la réforme des retraites 2023.</li>
                  <li><strong className="text-[var(--foreground)]">Précisez votre âge de début de carrière</strong> : cela permet d&apos;estimer automatiquement le nombre de trimestres déjà cotisés si vous ne le connaissez pas.</li>
                  <li><strong className="text-[var(--foreground)]">Renseignez vos trimestres (optionnel)</strong> : si vous connaissez votre nombre exact de trimestres cotisés (via votre relevé de carrière sur info-retraite.fr), saisissez-le pour un résultat plus précis.</li>
                  <li><strong className="text-[var(--foreground)]">Consultez le résultat</strong> : âge légal, année de départ, trimestres manquants et progression vers le taux plein.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel est l&apos;âge légal de départ à la retraite après la réforme 2023 ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Depuis la réforme de 2023, l&apos;âge légal de départ à la retraite passe progressivement de 62 à 64 ans. La LFSS 2026 a suspendu ce relèvement jusqu&apos;en 2028 : pour les pensions prenant effet à compter du 1er septembre 2026, l&apos;âge légal est de 62 ans et 9 mois pour les personnes nées en 1964 (et de janvier à mars 1965), 63 ans pour celles nées d&apos;avril à décembre 1965, puis 63 ans et 3 mois (1966), 63 ans et 6 mois (1967) et 63 ans et 9 mois (1968). Les personnes nées à partir de 1969 devront attendre 64 ans.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien de trimestres faut-il pour le taux plein ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le nombre de trimestres requis pour le taux plein varie de 166 à 172 selon votre année de naissance. Depuis la suspension de la réforme (pensions à compter du 1er septembre 2026), il faut 170 trimestres pour les personnes nées en 1964, 171 pour celles nées d&apos;avril à décembre 1965, et 172 trimestres (soit 43 années de cotisation) à partir de la génération 1966. Alternativement, vous obtenez automatiquement le taux plein à 67 ans, quel que soit votre nombre de trimestres.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Que se passe-t-il si je pars à la retraite sans tous mes trimestres ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Si vous partez avant d&apos;avoir tous vos trimestres et avant 67 ans, une décote de 1,25% par trimestre manquant est appliquée sur votre pension de base. La décote maximale est de 20 trimestres, soit une réduction pouvant atteindre 25% de votre pension. Il peut être plus avantageux de travailler quelques trimestres de plus pour éviter cette pénalité.</p>
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
