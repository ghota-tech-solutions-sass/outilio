"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const ACTIVITY_LEVELS = [
  { label: "Sédentaire (bureau, peu d\u2019exercice)", factor: 1.2 },
  { label: "Léger (exercice 1-3 jours/sem.)", factor: 1.375 },
  { label: "Modéré (exercice 3-5 jours/sem.)", factor: 1.55 },
  { label: "Actif (exercice 6-7 jours/sem.)", factor: 1.725 },
  { label: "Très actif (sport intense quotidien)", factor: 1.9 },
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
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Santé</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>TDEE / Calories</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre dépense énergétique totale et vos besoins caloriques journaliers avec la formule Mifflin-St Jeor.
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
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Âge (ans)</label>
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
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Niveau d&apos;activité</label>
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
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Métabolisme de base</p>
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
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Répartition macros suggérée (maintien)</h2>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
                      <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Protéines (30%)</p>
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
                <p>Le TDEE (Total Daily Energy Expenditure) représente la dépense énergétique totale quotidienne, c&apos;est-à-dire le nombre de calories que votre corps brûle en 24 heures. Il comprend le métabolisme de base (BMR), la thermogenèse alimentaire et l&apos;activité physique.</p>
                <p><strong className="text-[var(--foreground)]">Formule Mifflin-St Jeor</strong> : considérée comme la plus précise pour estimer le métabolisme de base.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Homme</strong> : BMR = 10 x poids (kg) + 6,25 x taille (cm) - 5 x âge + 5</li>
                  <li><strong className="text-[var(--foreground)]">Femme</strong> : BMR = 10 x poids (kg) + 6,25 x taille (cm) - 5 x âge - 161</li>
                </ul>
                <p>Le BMR est ensuite multiplié par un facteur d&apos;activité (de 1,2 pour sédentaire à 1,9 pour très actif) pour obtenir le TDEE. Pour perdre du poids, on vise un déficit de 500 kcal/jour (environ 0,5 kg/semaine). Pour prendre de la masse, un surplus de 500 kcal/jour.</p>
              </div>
            </div>

            <div className="rounded-2xl border-l-4 p-5" style={{ background: "var(--surface-alt)", borderColor: "var(--accent)" }}>
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                <strong>Avertissement médical.</strong> Cet outil fournit une estimation à titre
                informatif. Pour un suivi nutritionnel personnalisé, consultez un professionnel de
                santé (médecin, diététicien-nutritionniste). Les besoins réels peuvent varier selon
                le métabolisme individuel, la composition corporelle, l&apos;état de santé ou
                d&apos;éventuelles pathologies.
              </p>
            </div>

            <ToolHowToSection
              title="Comment utiliser ce calculateur TDEE"
              description="Estimez vos besoins caloriques journaliers en trois étapes, avec la formule Mifflin-St Jeor (la plus précise selon l'American Dietetic Association)."
              steps={[
                {
                  name: "Renseignez vos données morphologiques",
                  text:
                    "Saisissez votre âge, sexe, poids (kg) et taille (cm). Ces paramètres permettent de calculer votre métabolisme de base (BMR) avec la formule Mifflin-St Jeor : 10 x poids + 6,25 x taille - 5 x âge, +5 pour les hommes et -161 pour les femmes. Le BMR représente l'énergie dépensée au repos complet.",
                },
                {
                  name: "Sélectionnez votre niveau d'activité",
                  text:
                    "Choisissez parmi 5 niveaux : sédentaire (1,2), léger (1,375), modéré (1,55), actif (1,725), très actif (1,9). Soyez honnête : surestimer son activité est l'erreur la plus fréquente et fausse tout le calcul. Le TDEE = BMR x facteur d'activité.",
                },
                {
                  name: "Lisez vos objectifs (maintien, perte, prise)",
                  text:
                    "L'outil affiche le TDEE de maintien, le TDEE - 500 kcal pour une perte de poids saine d'environ 0,5 kg/semaine, et le TDEE + 500 kcal pour une prise de masse. La répartition macros suggérée (30% protéines / 40% glucides / 30% lipides) est un équilibre standard, à adapter avec un diététicien selon vos objectifs.",
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
                Cas d&apos;usage du calculateur TDEE
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Perte de poids progressive (sèche)
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Femme 35 ans, 70 kg, 165 cm, activité modérée : TDEE environ 2 150 kcal. Avec un
                    déficit de 500 kcal/jour (objectif 1 650 kcal), perte attendue d&apos;environ 0,5
                    kg/semaine, soit 2 kg/mois. Tenir 2-3 mois maximum sur ce déficit, puis
                    repasser au maintien pour éviter le ralentissement métabolique.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Prise de masse en musculation
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Homme 25 ans, 75 kg, 180 cm, actif (4 entraînements/sem) : TDEE environ 3 000
                    kcal. Pour prendre de la masse musculaire, surplus de 300-500 kcal/jour avec un
                    apport protéique de 1,6 à 2 g/kg de poids (soit 120-150 g/jour ici). Une prise
                    saine vise 0,2 à 0,4 kg/semaine.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Suivi diététique au quotidien
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Connaître son TDEE de maintien permet de calibrer ses applications de suivi
                    (Yazio, MyFitnessPal, Lifesum). Cela donne un plafond calorique à ne pas
                    dépasser, et permet d&apos;ajuster en cas de plateau (recalculer si poids change
                    de plus de 3-5 kg).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Reprise sportive ou changement d&apos;activité
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Si vous passez d&apos;un mode de vie sédentaire (1,2) à actif (1,725), votre
                    TDEE peut augmenter de 500 à 800 kcal/jour. Un recalcul est utile pour ajuster
                    son alimentation et éviter une fonte musculaire involontaire ou une fatigue
                    chronique liées à un apport insuffisant.
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
                À savoir sur le TDEE et les calories
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>La formule Mifflin-St Jeor (1990) est la plus précise selon l&apos;ADA</strong>
                  (American Dietetic Association). Elle remplace l&apos;ancienne Harris-Benedict
                  (1919, surestime de 5%) et la formule Katch-McArdle (nécessite la masse maigre,
                  rarement disponible). Marge d&apos;erreur d&apos;environ 10% sur des sujets sains
                  non-obèses, ce qui reste une estimation.
                </p>
                <p>
                  <strong>TDEE = BMR x Facteur d&apos;activité (FA).</strong> FA = 1,2 (sédentaire,
                  bureau, peu d&apos;exercice), 1,375 (léger, 1-3 entraînements/sem), 1,55 (modéré,
                  3-5 entraînements/sem), 1,725 (actif, 6-7 entraînements/sem), 1,9 (très actif,
                  sport intense quotidien ou métier physique). Surestimer son FA est l&apos;erreur
                  numéro 1 qui empêche la perte de poids.
                </p>
                <p>
                  <strong>Un déficit calorique sain est de 500 kcal/jour</strong>, soit environ
                  0,5 kg/semaine de perte (1 kg de graisse = 7 700 kcal). Au-delà de 1 000
                  kcal/jour de déficit, le corps active des mécanismes de protection : perte de
                  masse musculaire, ralentissement du métabolisme (effet yoyo), troubles
                  hormonaux. Pour une perte durable, viser 0,5 à 1% du poids corporel par semaine.
                </p>
                <p>
                  <strong>Le TDEE n&apos;inclut pas tous les facteurs individuels.</strong>
                  Génétique, microbiote, qualité du sommeil, stress, conditions médicales (thyroïde,
                  diabète, syndrome ovarien polykystique), grossesse ou allaitement modifient
                  significativement les besoins réels. Cet outil donne un point de départ, pas une
                  prescription. Un diététicien-nutritionniste est indispensable en cas de
                  pathologie ou d&apos;objectif précis.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions fréquentes sur le TDEE, le BMR et les besoins caloriques journaliers."
              items={[
                {
                  question: "Quelle est la différence entre BMR et TDEE ?",
                  answer:
                    "Le BMR (Basal Metabolic Rate) est l'énergie dépensée au repos complet pour maintenir les fonctions vitales (respiration, circulation, régulation thermique). Le TDEE inclut le BMR plus l'énergie dépensée par l'activité physique et la digestion (thermogenèse). Le TDEE est toujours supérieur au BMR.",
                },
                {
                  question: "Combien de calories pour perdre 1 kg par semaine ?",
                  answer:
                    "Un déficit de 7 700 kcal est nécessaire pour perdre environ 1 kg de graisse. Cela correspond à un déficit quotidien d'environ 1 100 kcal, ce qui est très agressif et peu soutenable. Un déficit de 500 kcal/jour (environ 0,5 kg/semaine) est plus sain, mieux soutenable, et préserve la masse musculaire.",
                },
                {
                  question: "Pourquoi la répartition 30/40/30 pour les macros ?",
                  answer:
                    "La répartition 30% protéines, 40% glucides, 30% lipides est un équilibre couramment recommandé pour la population générale active. Les protéines soutiennent la masse musculaire, les glucides fournissent l'énergie pour l'effort, et les lipides sont essentiels aux hormones et à l'absorption des vitamines liposolubles. Cette répartition peut être ajustée avec un diététicien selon les objectifs (perte, prise, sport).",
                },
                {
                  question: "La formule Mifflin-St Jeor est-elle précise ?",
                  answer:
                    "La formule Mifflin-St Jeor (1990) est considérée comme la plus précise des équations prédictives du BMR par l'American Dietetic Association, avec une marge d'erreur d'environ 10%. Elle est plus fiable que l'ancienne formule de Harris-Benedict (qui surestime souvent). Elle reste une estimation : génétique, composition corporelle et conditions médicales peuvent influencer le métabolisme réel.",
                },
                {
                  question: "Comment choisir son niveau d'activité physique ?",
                  answer:
                    "Sédentaire (1,2) : travail de bureau, peu ou pas d'exercice. Léger (1,375) : 1 à 3 sessions/semaine de sport modéré. Modéré (1,55) : 3 à 5 sessions/semaine. Actif (1,725) : 6 à 7 sessions/semaine ou métier physique. Très actif (1,9) : sport intense quotidien ou athlète. La majorité des gens surestiment ce facteur — en cas de doute, prenez un cran en dessous.",
                },
                {
                  question: "Faut-il manger ses macros exactes chaque jour ?",
                  answer:
                    "Non. Vise une moyenne hebdomadaire plutôt qu'une exactitude quotidienne. Les variations de plus ou moins 10-15% sur une journée sont normales et n'ont aucun impact. L'important est la cohérence sur 1-2 semaines. Pour la perte de poids, l'apport calorique total compte plus que la répartition exacte des macros.",
                },
                {
                  question: "Mes données saisies sont-elles privées ?",
                  answer:
                    "Oui. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée saisie (âge, poids, taille, sexe) n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription et sans tracker de profilage.",
                },
              ]}
            />
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
