"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const CATEGORIES = [
  { min: 0, max: 16.5, label: "Denutrition", color: "#dc2626" },
  { min: 16.5, max: 18.5, label: "Maigreur", color: "#f59e0b" },
  { min: 18.5, max: 25, label: "Poids normal", color: "#16a34a" },
  { min: 25, max: 30, label: "Surpoids", color: "#f59e0b" },
  { min: 30, max: 35, label: "Obesite moderee", color: "#ea580c" },
  { min: 35, max: 40, label: "Obesite severe", color: "#dc2626" },
  { min: 40, max: Infinity, label: "Obesite morbide", color: "#991b1b" },
];

export default function CalculateurIMC() {
  const [poids, setPoids] = useState("70");
  const [taille, setTaille] = useState("175");

  const p = parseFloat(poids) || 0;
  const t = (parseFloat(taille) || 1) / 100;
  const imc = p / (t * t);
  const cat = CATEGORIES.find((c) => imc >= c.min && imc < c.max) || CATEGORIES[2];

  const poidsIdealMin = 18.5 * t * t;
  const poidsIdealMax = 25 * t * t;

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Sante</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>IMC</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre Indice de Masse Corporelle et interpretez le resultat selon les normes OMS.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Result */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Votre IMC</p>
              <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: cat.color }}>
                {fmt(imc)}
              </p>
              <p className="mt-2 text-lg font-semibold" style={{ color: cat.color }}>{cat.label}</p>
              <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                Poids ideal pour votre taille : <strong className="text-[var(--foreground)]">{fmt(poidsIdealMin)} - {fmt(poidsIdealMax)} kg</strong>
              </p>
            </div>

            {/* Scale */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Echelle IMC (OMS)</h2>
              <div className="mt-4 space-y-2">
                {CATEGORIES.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                    <span className="w-32 text-sm font-medium">{c.label}</span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {c.min} - {c.max === Infinity ? "+" : c.max}
                    </span>
                    {imc >= c.min && imc < c.max && (
                      <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: c.color }}>VOUS</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Qu&apos;est-ce que l&apos;IMC ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>L&apos;Indice de Masse Corporelle (IMC) est un indicateur qui permet d&apos;evaluer la corpulence d&apos;une personne. Il se calcule en divisant le poids (en kg) par le carre de la taille (en m).</p>
                <p><strong className="text-[var(--foreground)]">Formule</strong> : IMC = Poids (kg) / Taille (m)&sup2;</p>
                <p>L&apos;OMS considere qu&apos;un IMC entre 18,5 et 25 correspond a un poids normal. Cet indicateur ne prend pas en compte la masse musculaire ni la repartition des graisses.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur d&apos;IMC
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce calculateur d&apos;Indice de Masse Corporelle (IMC) vous permet d&apos;evaluer rapidement votre corpulence selon la classification de l&apos;Organisation Mondiale de la Sante (OMS). Il calcule aussi la fourchette de poids ideal correspondant a votre taille.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Entrez votre poids en kilogrammes</strong> : pesez-vous de preference le matin a jeun pour obtenir une valeur fiable.</li>
                  <li><strong className="text-[var(--foreground)]">Entrez votre taille en centimetres</strong> : par exemple 175 pour 1,75 m.</li>
                  <li><strong className="text-[var(--foreground)]">Interpretez le resultat</strong> : l&apos;IMC s&apos;affiche avec sa categorie OMS (denutrition, maigreur, poids normal, surpoids, obesite) et la fourchette de poids ideal pour votre taille.</li>
                </ul>
                <p>L&apos;IMC est un indicateur de depistage, pas un diagnostic. Il ne distingue pas la masse grasse de la masse musculaire et ne tient pas compte de l&apos;age, du sexe ou de la morphologie. Consultez un professionnel de sante pour une evaluation complete.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel est l&apos;IMC ideal pour un adulte ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Selon l&apos;OMS, un IMC compris entre 18,5 et 25 correspond a un poids normal chez l&apos;adulte. En dessous de 18,5, on parle de maigreur, et au-dessus de 25, de surpoids. L&apos;obesite commence a partir d&apos;un IMC de 30. Toutefois, cet indicateur ne prend pas en compte la composition corporelle : un sportif tres muscle peut avoir un IMC eleve sans etre en surpoids.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>L&apos;IMC est-il fiable pour les sportifs ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>L&apos;IMC peut etre trompeur pour les sportifs, notamment les pratiquants de musculation ou les rugbymen, car le muscle pese plus lourd que la graisse. Un individu tres muscle peut avoir un IMC superieur a 25 tout en ayant un taux de masse grasse tres faible. Dans ce cas, l&apos;impedancemetrie ou la mesure du tour de taille sont des indicateurs complementaires plus adaptes.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>A partir de quel IMC faut-il consulter un medecin ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Il est recommande de consulter un medecin si votre IMC est inferieur a 16,5 (denutrition) ou superieur a 30 (obesite). Un IMC superieur a 35 correspond a une obesite severe qui augmente significativement les risques cardiovasculaires, de diabete de type 2 et de certains cancers. Votre medecin pourra vous orienter vers un suivi nutritionnel adapte.</p>
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
