"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const ACTIVITY_LEVELS = [
  { label: "Sedentaire (bureau, peu d\u2019exercice)", factor: 1.2 },
  { label: "Leger (exercice 1-3 jours/sem.)", factor: 1.375 },
  { label: "Modere (exercice 3-5 jours/sem.)", factor: 1.55 },
  { label: "Actif (exercice 6-7 jours/sem.)", factor: 1.725 },
  { label: "Tres actif (sport intense quotidien)", factor: 1.9 },
];

export default function CalculateurTDEE() {
  const [age, setAge] = useState("30");
  const [sexe, setSexe] = useState<"homme" | "femme">("homme");
  const [poids, setPoids] = useState("75");
  const [taille, setTaille] = useState("175");
  const [activite, setActivite] = useState(2);

  const results = useMemo(() => {
    const a = parseFloat(age) || 0;
    const p = parseFloat(poids) || 0;
    const t = parseFloat(taille) || 0;

    if (a <= 0 || p <= 0 || t <= 0) return null;

    const bmr =
      sexe === "homme"
        ? 10 * p + 6.25 * t - 5 * a + 5
        : 10 * p + 6.25 * t - 5 * a - 161;

    const tdee = bmr * ACTIVITY_LEVELS[activite].factor;
    const perte = tdee - 500;
    const prise = tdee + 500;

    const proteines = (tdee * 0.3) / 4;
    const glucides = (tdee * 0.4) / 4;
    const lipides = (tdee * 0.3) / 9;

    return { bmr, tdee, perte, prise, proteines, glucides, lipides };
  }, [age, sexe, poids, taille, activite]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Sante</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>TDEE / Calories</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre depense energetique totale et vos besoins caloriques journaliers avec la formule Mifflin-St Jeor.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Age (ans)</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Sexe</label>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setSexe("homme")}
                      className="flex-1 rounded-xl border px-4 py-4 text-sm font-bold transition-colors"
                      style={{
                        borderColor: sexe === "homme" ? "var(--primary)" : "var(--border)",
                        background: sexe === "homme" ? "var(--primary)" : "transparent",
                        color: sexe === "homme" ? "#fff" : "var(--foreground)",
                      }}>
                      Homme
                    </button>
                    <button onClick={() => setSexe("femme")}
                      className="flex-1 rounded-xl border px-4 py-4 text-sm font-bold transition-colors"
                      style={{
                        borderColor: sexe === "femme" ? "var(--primary)" : "var(--border)",
                        background: sexe === "femme" ? "var(--primary)" : "transparent",
                        color: sexe === "femme" ? "#fff" : "var(--foreground)",
                      }}>
                      Femme
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Poids (kg)</label>
                  <input type="number" value={poids} onChange={(e) => setPoids(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taille (cm)</label>
                  <input type="number" value={taille} onChange={(e) => setTaille(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Niveau d&apos;activite</label>
                <select value={activite} onChange={(e) => setActivite(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border px-4 py-4 text-sm font-medium" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                  {ACTIVITY_LEVELS.map((level, i) => (
                    <option key={i} value={i}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results */}
            {results && (
              <>
                <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Votre TDEE</p>
                  <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(results.tdee)}
                  </p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--muted)" }}>calories / jour</p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Metabolisme de base</p>
                    <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(results.bmr)}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>kcal</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Maintien</p>
                    <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#16a34a" }}>{fmt(results.tdee)}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>kcal</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Perte de poids</p>
                    <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#f59e0b" }}>{fmt(results.perte)}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>kcal (-500)</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prise de masse</p>
                    <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#3b82f6" }}>{fmt(results.prise)}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>kcal (+500)</p>
                  </div>
                </div>

                {/* Macros */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Repartition macros suggeree (maintien)</h2>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
                      <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Proteines (30%)</p>
                      <p className="mt-1 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#ef4444" }}>{fmt(results.proteines)}g</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{fmt(results.tdee * 0.3)} kcal</p>
                    </div>
                    <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
                      <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Glucides (40%)</p>
                      <p className="mt-1 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#f59e0b" }}>{fmt(results.glucides)}g</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{fmt(results.tdee * 0.4)} kcal</p>
                    </div>
                    <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
                      <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Lipides (30%)</p>
                      <p className="mt-1 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#16a34a" }}>{fmt(results.lipides)}g</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{fmt(results.tdee * 0.3)} kcal</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Qu&apos;est-ce que le TDEE ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Le TDEE (Total Daily Energy Expenditure) represente la depense energetique totale quotidienne, c&apos;est-a-dire le nombre de calories que votre corps brule en 24 heures. Il comprend le metabolisme de base (BMR), la thermogenese alimentaire et l&apos;activite physique.</p>
                <p><strong className="text-[var(--foreground)]">Formule Mifflin-St Jeor</strong> : consideree comme la plus precise pour estimer le metabolisme de base.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Homme</strong> : BMR = 10 x poids (kg) + 6,25 x taille (cm) - 5 x age + 5</li>
                  <li><strong className="text-[var(--foreground)]">Femme</strong> : BMR = 10 x poids (kg) + 6,25 x taille (cm) - 5 x age - 161</li>
                </ul>
                <p>Le BMR est ensuite multiplie par un facteur d&apos;activite (de 1,2 pour sedentaire a 1,9 pour tres actif) pour obtenir le TDEE. Pour perdre du poids, on vise un deficit de 500 kcal/jour (~0,5 kg/semaine). Pour prendre de la masse, un surplus de 500 kcal/jour.</p>
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser ce calculateur TDEE
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce calculateur estime vos besoins caloriques quotidiens en fonction de votre profil et de votre niveau d&apos;activite physique.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Renseignez votre age, sexe, poids et taille</strong> pour calculer votre metabolisme de base (BMR).</li>
                  <li><strong className="text-[var(--foreground)]">Selectionnez votre niveau d&apos;activite</strong> : soyez honnete pour obtenir un resultat fiable.</li>
                  <li><strong className="text-[var(--foreground)]">Consultez vos resultats</strong> : TDEE de maintien, objectif de perte ou de prise de poids, et repartition des macronutriments.</li>
                </ul>
                <p>Ces valeurs sont des estimations. Les besoins reels varient selon le metabolisme individuel, la composition corporelle et d&apos;autres facteurs. Consultez un nutritionniste pour un plan personnalise.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la difference entre BMR et TDEE ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le BMR (Basal Metabolic Rate) est l&apos;energie depensee au repos complet pour maintenir les fonctions vitales (respiration, circulation, regulation thermique). Le TDEE inclut le BMR plus l&apos;energie depensee par l&apos;activite physique et la digestion. Le TDEE est toujours superieur au BMR.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien de calories pour perdre 1 kg par semaine ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Un deficit de 7 700 kcal est necessaire pour perdre environ 1 kg de graisse corporelle. Cela correspond a un deficit quotidien d&apos;environ 1 100 kcal, ce qui est agressif. Un deficit de 500 kcal/jour (environ 0,5 kg/semaine) est plus soutenable et preserve mieux la masse musculaire.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi la repartition 30/40/30 pour les macros ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La repartition 30% proteines, 40% glucides, 30% lipides est un equilibre couramment recommande pour la population generale active. Les proteines soutiennent la masse musculaire, les glucides fournissent l&apos;energie pour l&apos;effort, et les lipides sont essentiels aux hormones et a l&apos;absorption des vitamines. Cette repartition peut etre ajustee selon vos objectifs.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>La formule Mifflin-St Jeor est-elle precise ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La formule Mifflin-St Jeor est consideree comme la plus precise des equations predictives du BMR, avec une marge d&apos;erreur d&apos;environ 10%. Elle est plus fiable que l&apos;ancienne formule de Harris-Benedict. Cependant, elle reste une estimation : des facteurs comme la genetique, la composition corporelle et les conditions medicales peuvent influencer le metabolisme reel.</p>
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
