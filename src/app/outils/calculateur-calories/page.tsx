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
  { label: "Course a pied (8 km/h)", icon: "\u{1F3C3}", met: 8.3 },
  { label: "Course a pied (10 km/h)", icon: "\u{1F3C3}", met: 9.8 },
  { label: "Course a pied (12 km/h)", icon: "\u{1F3C3}", met: 11.5 },
  { label: "Velo (loisir, 16 km/h)", icon: "\u{1F6B4}", met: 6.8 },
  { label: "Velo (modere, 20 km/h)", icon: "\u{1F6B4}", met: 8.0 },
  { label: "Velo (intense, 25+ km/h)", icon: "\u{1F6B4}", met: 10.0 },
  { label: "Natation (loisir)", icon: "\u{1F3CA}", met: 6.0 },
  { label: "Natation (intensive)", icon: "\u{1F3CA}", met: 9.8 },
  { label: "Yoga", icon: "\u{1F9D8}", met: 3.0 },
  { label: "Musculation", icon: "\u{1F4AA}", met: 6.0 },
  { label: "HIIT / CrossFit", icon: "\u{1F525}", met: 12.0 },
  { label: "Danse", icon: "\u{1F483}", met: 5.5 },
  { label: "Football", icon: "\u{26BD}", met: 7.0 },
  { label: "Tennis", icon: "\u{1F3BE}", met: 7.3 },
  { label: "Randonnee", icon: "\u{26F0}\uFE0F", met: 6.0 },
  { label: "Corde a sauter", icon: "\u{1FA62}", met: 11.0 },
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
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Sante</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>calories brulees</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre depense calorique selon l&apos;activite, la duree et votre poids.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Vos parametres</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Poids (kg)</label>
                  <input type="number" value={poids} onChange={(e) => setPoids(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Duree (minutes)</label>
                  <input type="number" value={duree} onChange={(e) => setDuree(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>
            </div>

            {/* Activity selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Activite</h2>
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
                    calories brulees ({(results.caloriesPerMinute).toFixed(1)} kcal/min)
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
              title="Comment estimer vos calories brulees en 3 etapes"
              description="Le calcul utilise les valeurs MET du Compendium of Physical Activities (Ainsworth et al., reference internationale en sciences du sport)."
              steps={[
                {
                  name: "Renseigner votre poids",
                  text:
                    "La depense calorique est proportionnelle a votre poids : a intensite egale, une personne de 80 kg brule davantage qu'une personne de 60 kg, car deplacer une masse plus grande consomme plus d'energie.",
                },
                {
                  name: "Indiquer la duree de la seance",
                  text:
                    "Saisissez le temps reel d'effort en minutes, hors echauffement leger et recuperation. Pour un footing de 45 min avec 5 min d'echauffement, comptez plutot 40 minutes effectives.",
                },
                {
                  name: "Choisir l'activite",
                  text:
                    "Selectionnez le type d'activite et son intensite (vitesse de course, niveau de velo). Le tableau comparatif affiche en parallele toutes les activites a vos parametres : tres utile pour comparer 'natation moderee 30 min' vs 'velo intense 30 min'.",
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
                    Definir un objectif de perte de poids
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    1 kg de masse grasse correspond a environ 7 700 kcal. Pour perdre 0,5 kg par
                    semaine de maniere realiste, viser un deficit moyen de 500-550 kcal par jour
                    (alimentation + activite physique combinees).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Comparer deux activites
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous hesitez entre 1 h de marche rapide et 30 min de course ? Le tableau de
                    comparaison affiche cote a cote les depenses, en partant de votre poids reel.
                    Souvent une seance courte intense est equivalente a une seance longue moderee.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Compenser un repas riche
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un burger frites avoisine 1 100 kcal, soit l&apos;equivalent d&apos;environ 1 h 40
                    de course a 10 km/h pour une personne de 70 kg. Aucune calorie ne se compense a
                    100 % : la nutrition reste le levier majeur du deficit calorique.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Planifier un programme sportif hebdomadaire
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    L&apos;OMS recommande au moins 150 a 300 minutes d&apos;activite moderee par
                    semaine. Le calculateur permet d&apos;estimer la depense totale et de varier les
                    activites pour eviter la monotonie et les blessures de surentrainement.
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
                A savoir sur la depense calorique
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Methode MET.</strong> Le MET (Metabolic Equivalent of Task) est une unite
                  standardisee : 1 MET = 3,5 ml d&apos;O2 / kg / min, soit environ la depense au
                  repos assis. Une activite a 8 MET consomme 8 fois plus d&apos;energie que le repos.
                  La formule appliquee est : kcal/min = (MET x 3,5 x poids) / 200.
                </p>
                <p>
                  <strong>Estimation, pas mesure exacte.</strong> Les valeurs MET sont des moyennes
                  populationnelles. Votre depense reelle depend de nombreux facteurs personnels :
                  age, sexe, masse musculaire, condition cardio-vasculaire, technique gestuelle, etat
                  de fatigue. Un cardio-frequencemetre avec algorithme calibre est plus precis.
                </p>
                <p>
                  <strong>EPOC et after-burn.</strong> Apres un effort intense, le metabolisme reste
                  eleve pendant plusieurs heures (Excess Post-exercise Oxygen Consumption). Cet effet
                  ajoute 5 a 15 % de calories supplementaires apres une seance intense, non comptees
                  par le calculateur.
                </p>
                <p>
                  <strong>Source.</strong> Compendium of Physical Activities, Ainsworth et al., 2011
                  (reference internationale en physiologie de l&apos;effort). Recommandations
                  d&apos;activite physique : OMS, ANSES (France). Cet outil ne remplace pas un avis
                  medical ou un coaching personnalise.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur la depense calorique et le sport."
              items={[
                {
                  question: "Combien de calories pour perdre 1 kg ?",
                  answer:
                    "1 kg de masse grasse equivaut a environ 7 700 kcal. Pour perdre 1 kg sur 4 semaines, il faut un deficit cumule d'environ 7 700 kcal, soit environ 275 kcal par jour. Ce deficit peut combiner reduction calorique alimentaire ET activite physique.",
                },
                {
                  question: "Quelle est l'activite qui brule le plus de calories ?",
                  answer:
                    "Parmi les activites accessibles au grand public, la corde a sauter intensive et le HIIT/CrossFit sont au sommet (11-12 MET). La course rapide a 12 km/h (11,5 MET) rivalise. Mais la 'meilleure' activite est celle que vous pratiquez regulierement avec plaisir.",
                },
                {
                  question: "Le poids influe-t-il vraiment beaucoup sur la depense ?",
                  answer:
                    "Oui, lineairement. Une personne de 90 kg brule environ 50 % de calories en plus qu'une personne de 60 kg pour la meme activite. C'est pourquoi un meme jogging fait perdre plus de calories en debut de programme qu'en fin (apres perte de poids).",
                },
                {
                  question: "Le calcul est-il valable pour les femmes enceintes ?",
                  answer:
                    "Le calcul reste indicatif mais l'OMS recommande aux femmes enceintes de pratiquer une activite physique moderee adaptee. Demandez l'avis de votre sage-femme ou medecin avant tout programme. Certaines activites (a impact, a risque de chute) sont a eviter selon le trimestre.",
                },
                {
                  question: "Faut-il s'hydrater pendant l'effort ?",
                  answer:
                    "Oui, systematiquement. La regle generale : 150 a 250 ml d'eau toutes les 15-20 min d'effort moyen ou intense. Au-dela d'une heure ou par forte chaleur, ajouter une boisson contenant glucides et electrolytes. La sensation de soif arrive deja en deshydratation legere.",
                },
                {
                  question: "Quelle frequence cardiaque pour bruler les graisses ?",
                  answer:
                    "La 'zone de bruleuse de graisses' classique est 60-70 % de la frequence cardiaque maximale (FC max approximative = 220 - age). Mais en realite, les seances plus intenses (75-85 % FC max) brulent plus de calories totales et plus de graisses post-effort.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee (poids, duree, activite) n'est envoyee a un serveur ni stockee. L'outil fonctionne sans inscription et sans tracker de fitness tiers.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Equivalences alimentaires</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>1 croissant = ~230 kcal</li>
                <li>1 pomme = ~80 kcal</li>
                <li>1 pizza (part) = ~270 kcal</li>
                <li>1 biere (33cl) = ~150 kcal</li>
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
