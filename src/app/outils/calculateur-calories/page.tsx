"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

interface Activity {
  label: string;
  icon: string;
  met: number; // Metabolic Equivalent of Task
}

const ACTIVITIES: Activity[] = [
  { label: "Marche (5 km/h)", icon: "\u{1F6B6}", met: 3.5 },
  { label: "Marche rapide (6,5 km/h)", icon: "\u{1F6B6}", met: 5.0 },
  { label: "Course à pied (8 km/h)", icon: "\u{1F3C3}", met: 8.3 },
  { label: "Course à pied (10 km/h)", icon: "\u{1F3C3}", met: 9.8 },
  { label: "Course à pied (12 km/h)", icon: "\u{1F3C3}", met: 11.5 },
  { label: "Vélo (loisir, 16 km/h)", icon: "\u{1F6B4}", met: 6.8 },
  { label: "Vélo (modéré, 20 km/h)", icon: "\u{1F6B4}", met: 8.0 },
  { label: "Vélo (intense, 25+ km/h)", icon: "\u{1F6B4}", met: 10.0 },
  { label: "Natation (loisir)", icon: "\u{1F3CA}", met: 6.0 },
  { label: "Natation (intensive)", icon: "\u{1F3CA}", met: 9.8 },
  { label: "Yoga", icon: "\u{1F9D8}", met: 3.0 },
  { label: "Musculation", icon: "\u{1F4AA}", met: 6.0 },
  { label: "HIIT / CrossFit", icon: "\u{1F525}", met: 12.0 },
  { label: "Danse", icon: "\u{1F483}", met: 5.5 },
  { label: "Football", icon: "\u{26BD}", met: 7.0 },
  { label: "Tennis", icon: "\u{1F3BE}", met: 7.3 },
  { label: "Randonnée", icon: "\u{26F0}\uFE0F", met: 6.0 },
  { label: "Corde à sauter", icon: "\u{1FA62}", met: 11.0 },
];

export default function CalculateurCalories() {
  const [poids, setPoids] = useState("70");
  const [duree, setDuree] = useState("30");
  const [selectedActivity, setSelectedActivity] = useState(2);

  const results = useMemo(() => {
    const p = parseFloat(poids) || 0;
    const d = parseFloat(duree) || 0;
    if (p <= 0 || d <= 0) return null;

    const activity = ACTIVITIES[selectedActivity];
    const caloriesPerMinute = (activity.met * 3.5 * p) / 200;
    const totalCalories = caloriesPerMinute * d;

    // Calculate for all activities at current weight/duration
    const allActivities = ACTIVITIES.map((a) => {
      const cpm = (a.met * 3.5 * p) / 200;
      return {
        ...a,
        calories: cpm * d,
      };
    });

    return { totalCalories, caloriesPerMinute, allActivities, activity };
  }, [poids, duree, selectedActivity]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Santé</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>calories brûlées</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre dépense calorique selon l&apos;activité, la durée et votre poids.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Vos paramètres</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Poids (kg)</label>
                  <input type="number" value={poids} onChange={(e) => setPoids(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Durée (minutes)</label>
                  <input type="number" value={duree} onChange={(e) => setDuree(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>
            </div>

            {/* Activity selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Activité</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {ACTIVITIES.map((a, i) => (
                  <button key={i} onClick={() => setSelectedActivity(i)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all"
                    style={{
                      background: selectedActivity === i ? "var(--primary)" : "var(--surface-alt)",
                      color: selectedActivity === i ? "white" : "var(--muted)",
                    }}>
                    <span className="text-base">{a.icon}</span>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            {results && (
              <>
                <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                    {results.activity.icon} {results.activity.label} pendant {duree} min
                  </p>
                  <p className="mt-4 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(results.totalCalories)}
                  </p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: "var(--muted)" }}>
                    calories brûlées ({(results.caloriesPerMinute).toFixed(1)} kcal/min)
                  </p>
                </div>

                {/* Comparison table */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Comparaison ({duree} min, {poids} kg)</h2>
                  <div className="mt-4 space-y-2">
                    {results.allActivities
                      .sort((a, b) => b.calories - a.calories)
                      .map((a, i) => {
                        const maxCal = results.allActivities.reduce((max, act) => Math.max(max, act.calories), 0);
                        const pct = maxCal > 0 ? (a.calories / maxCal) * 100 : 0;
                        const isSelected = a.label === results.activity.label;
                        return (
                          <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2"
                            style={{ background: isSelected ? "var(--primary)" : "var(--surface-alt)", color: isSelected ? "white" : undefined }}>
                            <span className="text-sm">{a.icon}</span>
                            <span className="flex-1 text-xs font-semibold">{a.label}</span>
                            <div className="hidden w-24 sm:block">
                              <div className="h-1.5 rounded-full" style={{ background: isSelected ? "rgba(255,255,255,0.3)" : "var(--border)" }}>
                                <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: isSelected ? "white" : "var(--primary)" }} />
                              </div>
                            </div>
                            <span className="min-w-[60px] text-right text-xs font-bold">{fmt(a.calories)} kcal</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}

            <ToolHowToSection
              title="Comment estimer vos calories brûlées en 3 étapes"
              description="Le calcul utilise les valeurs MET du Compendium of Physical Activities (Ainsworth et al., référence internationale en sciences du sport)."
              steps={[
                {
                  name: "Renseigner votre poids",
                  text:
                    "La dépense calorique est proportionnelle à votre poids : à intensité égale, une personne de 80 kg brûle davantage qu'une personne de 60 kg, car déplacer une masse plus grande consomme plus d'énergie.",
                },
                {
                  name: "Indiquer la durée de la séance",
                  text:
                    "Saisissez le temps réel d'effort en minutes, hors échauffement léger et récupération. Pour un footing de 45 min avec 5 min d'échauffement, comptez plutôt 40 minutes effectives.",
                },
                {
                  name: "Choisir l'activité",
                  text:
                    "Sélectionnez le type d'activité et son intensité (vitesse de course, niveau de vélo). Le tableau comparatif affiche en parallèle toutes les activités à vos paramètres : très utile pour comparer 'natation modérée 30 min' vs 'vélo intense 30 min'.",
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
                Cas d&apos;usage du calculateur de calories
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Définir un objectif de perte de poids
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    1 kg de masse grasse correspond à environ 7 700 kcal. Pour perdre 0,5 kg par
                    semaine de manière réaliste, viser un déficit moyen de 500-550 kcal par jour
                    (alimentation + activité physique combinées).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Comparer deux activités
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous hésitez entre 1 h de marche rapide et 30 min de course ? Le tableau de
                    comparaison affiche côte à côte les dépenses, en partant de votre poids réel.
                    Souvent une séance courte intense est équivalente à une séance longue modérée.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Compenser un repas riche
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un burger frites avoisine 1 100 kcal, soit l&apos;équivalent d&apos;environ 1 h 30
                    de course à 10 km/h pour une personne de 70 kg. Aucune calorie ne se compense à
                    100 % : la nutrition reste le levier majeur du déficit calorique.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Planifier un programme sportif hebdomadaire
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    L&apos;OMS recommande au moins 150 à 300 minutes d&apos;activité modérée par
                    semaine. Le calculateur permet d&apos;estimer la dépense totale et de varier les
                    activités pour éviter la monotonie et les blessures de surentraînement.
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
                À savoir sur la dépense calorique
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Méthode MET.</strong> Le MET (Metabolic Equivalent of Task) est une unité
                  standardisée : 1 MET = 3,5 ml d&apos;O2 / kg / min, soit environ la dépense au
                  repos assis. Une activité à 8 MET consomme 8 fois plus d&apos;énergie que le repos.
                  La formule appliquée est : kcal/min = (MET x 3,5 x poids) / 200.
                </p>
                <p>
                  <strong>Estimation, pas mesure exacte.</strong> Les valeurs MET sont des moyennes
                  populationnelles. Votre dépense réelle dépend de nombreux facteurs personnels :
                  âge, sexe, masse musculaire, condition cardio-vasculaire, technique gestuelle, état
                  de fatigue. Un cardio-fréquencemètre avec algorithme calibré est plus précis.
                </p>
                <p>
                  <strong>EPOC et after-burn.</strong> Après un effort intense, le métabolisme reste
                  élevé pendant plusieurs heures (Excess Post-exercise Oxygen Consumption). Cet effet
                  ajoute 5 à 15 % de calories supplémentaires après une séance intense, non comptées
                  par le calculateur.
                </p>
                <p>
                  <strong>Source.</strong> Compendium of Physical Activities, Ainsworth et al., 2011
                  (référence internationale en physiologie de l&apos;effort). Recommandations
                  d&apos;activité physique : OMS, ANSES (France). Cet outil ne remplace pas un avis
                  médical ou un coaching personnalisé.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus fréquentes sur la dépense calorique et le sport."
              items={[
                {
                  question: "Combien de calories pour perdre 1 kg ?",
                  answer:
                    "1 kg de masse grasse équivaut à environ 7 700 kcal. Pour perdre 1 kg sur 4 semaines, il faut un déficit cumulé d'environ 7 700 kcal, soit environ 275 kcal par jour. Ce déficit peut combiner réduction calorique alimentaire ET activité physique.",
                },
                {
                  question: "Quelle est l'activité qui brûle le plus de calories ?",
                  answer:
                    "Parmi les activités accessibles au grand public, la corde à sauter intensive et le HIIT/CrossFit sont au sommet (11-12 MET). La course rapide à 12 km/h (11,5 MET) rivalise. Mais la 'meilleure' activité est celle que vous pratiquez régulièrement avec plaisir.",
                },
                {
                  question: "Le poids influe-t-il vraiment beaucoup sur la dépense ?",
                  answer:
                    "Oui, linéairement. Une personne de 90 kg brûle environ 50 % de calories en plus qu'une personne de 60 kg pour la même activité. C'est pourquoi un même jogging fait perdre plus de calories en début de programme qu'en fin (après perte de poids).",
                },
                {
                  question: "Le calcul est-il valable pour les femmes enceintes ?",
                  answer:
                    "Le calcul reste indicatif mais l'OMS recommande aux femmes enceintes de pratiquer une activité physique modérée adaptée. Demandez l'avis de votre sage-femme ou médecin avant tout programme. Certaines activités (à impact, à risque de chute) sont à éviter selon le trimestre.",
                },
                {
                  question: "Faut-il s'hydrater pendant l'effort ?",
                  answer:
                    "Oui, systématiquement. La règle générale : 150 à 250 ml d'eau toutes les 15-20 min d'effort moyen ou intense. Au-delà d'une heure ou par forte chaleur, ajouter une boisson contenant glucides et électrolytes. La sensation de soif arrive déjà en déshydratation légère.",
                },
                {
                  question: "Quelle fréquence cardiaque pour brûler les graisses ?",
                  answer:
                    "La 'zone de brûleuse de graisses' classique est 60-70 % de la fréquence cardiaque maximale (FC max approximative = 220 - âge). Mais en réalité, les séances plus intenses (75-85 % FC max) brûlent plus de calories totales et plus de graisses post-effort.",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée (poids, durée, activité) n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription et sans tracker de fitness tiers.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Équivalences alimentaires</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>1 croissant = ~230 kcal</li>
                <li>1 pomme = ~80 kcal</li>
                <li>1 pizza (part) = ~270 kcal</li>
                <li>1 bière (33cl) = ~150 kcal</li>
                <li>1 barre de chocolat = ~250 kcal</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
