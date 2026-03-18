"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

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

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment sont calculees les calories ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Le calcul repose sur le <strong className="text-[var(--foreground)]">MET (Metabolic Equivalent of Task)</strong>, une mesure de l&apos;intensite d&apos;une activite physique. 1 MET correspond a la depense energetique au repos.</p>
                <p><strong className="text-[var(--foreground)]">Formule</strong> : Calories/min = (MET x 3,5 x poids en kg) / 200</p>
                <p>Ces valeurs sont des estimations moyennes. La depense reelle depend de nombreux facteurs : age, sexe, condition physique, intensite exacte et metabolisme individuel.</p>
              </div>
            </div>
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
