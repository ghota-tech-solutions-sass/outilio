"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const CATEGORIES = [
  { min: 0, max: 16.5, label: "Dénutrition", color: "#dc2626" },
  { min: 16.5, max: 18.5, label: "Maigreur", color: "#f59e0b" },
  { min: 18.5, max: 25, label: "Poids normal", color: "#16a34a" },
  { min: 25, max: 30, label: "Surpoids", color: "#f59e0b" },
  { min: 30, max: 35, label: "Obésité modérée", color: "#ea580c" },
  { min: 35, max: 40, label: "Obésité sévère", color: "#dc2626" },
  { min: 40, max: Infinity, label: "Obésité morbide", color: "#991b1b" },
];

export default function CalculateurIMC() {
  const [poids, setPoids] = useState("70");
  const [taille, setTaille] = useState("175");

  const p = parseFloat(poids) || 0;
  const t = (parseFloat(taille) || 0) / 100;
  const valide = p > 0 && t > 0;
  const imc = valide ? p / (t * t) : 0;
  const cat = CATEGORIES.find((c) => imc >= c.min && imc < c.max) || CATEGORIES[2];

  const poidsIdealMin = 18.5 * t * t;
  const poidsIdealMax = 25 * t * t;

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Santé</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>IMC</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre Indice de Masse Corporelle et interprétez le résultat selon les normes OMS.
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
                {valide ? fmt(imc) : "\u2014"}
              </p>
              <p className="mt-2 text-lg font-semibold" style={{ color: cat.color }}>{valide ? cat.label : "Saisissez un poids et une taille"}</p>
              <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                Poids idéal pour votre taille : <strong className="text-[var(--foreground)]">{fmt(poidsIdealMin)} - {fmt(poidsIdealMax)} kg</strong>
              </p>
            </div>

            {/* Scale */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Échelle IMC (OMS)</h2>
              <div className="mt-4 space-y-2">
                {CATEGORIES.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                    <span className="w-32 text-sm font-medium">{c.label}</span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {c.min} - {c.max === Infinity ? "+" : c.max}
                    </span>
                    {valide && imc >= c.min && imc < c.max && (
                      <span className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: c.color }}>VOUS</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ background: "rgba(232, 150, 62, 0.08)", borderColor: "var(--accent)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                <strong>Information importante.</strong> L&apos;IMC est un indicateur de dépistage,
                pas un diagnostic médical. Il ne distingue pas masse grasse et masse musculaire et
                ne s&apos;applique pas aux femmes enceintes, enfants, sportifs musclés ou personnes
                âgées. Consultez votre médecin pour une évaluation complète.
              </p>
            </div>

            <ToolHowToSection
              title="Comment calculer votre IMC en 3 étapes"
              description="L'IMC (Indice de Masse Corporelle) est un indicateur standard validé par l'OMS pour estimer la corpulence d'un adulte de 18 à 65 ans en bonne santé."
              steps={[
                {
                  name: "Mesurer votre poids",
                  text:
                    "Pesez-vous le matin à jeun, sans vêtements (ou en sous-vêtements seulement). Utilisez la même balance et les mêmes conditions à chaque mesure pour pouvoir comparer dans le temps.",
                },
                {
                  name: "Mesurer votre taille",
                  text:
                    "Mesurez-vous pieds joints, dos contre un mur, sans chaussures. Pour la majorité des adultes, la taille est stable après 25 ans (mais peut diminuer de 1 à 2 cm après 60 ans, sans pathologie).",
                },
                {
                  name: "Interpréter le résultat",
                  text:
                    "L'outil affiche votre IMC, votre catégorie OMS et la fourchette de poids associée à un IMC normal pour votre taille. Si vous êtes en zone de maigreur, surpoids ou obésité, ne vous fixez pas sur ce seul chiffre : un avis médical est essentiel pour décider d'une action.",
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
                Limites de l&apos;IMC : à quoi rester attentif
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Sportifs et muscles.</strong> Le muscle pèse davantage que la graisse à
                  volume égal. Un rugbyman, un body-builder ou un haltérophile peut avoir un IMC
                  supérieur à 25 tout en ayant un taux de masse grasse très faible. Pour ces profils,
                  l&apos;impédancemétrie ou la mesure du pli cutané sont plus pertinents.
                </p>
                <p>
                  <strong>Répartition des graisses.</strong> L&apos;IMC ne dit rien de la répartition
                  abdominale ou périphérique de la masse grasse. La graisse abdominale est plus
                  associée aux risques cardio-métaboliques. La mesure complémentaire est le tour de
                  taille : risque élevé si plus de 94 cm chez l&apos;homme, plus de 80 cm chez la
                  femme.
                </p>
                <p>
                  <strong>Femmes enceintes et enfants.</strong> L&apos;IMC adulte ne s&apos;applique
                  pas aux femmes enceintes, ni aux enfants/adolescents (qui suivent les courbes de
                  corpulence du carnet de santé). Pour les seniors, les seuils peuvent être légèrement
                  décalés (IMC entre 21 et 27 souvent considéré comme acceptable).
                </p>
                <p>
                  <strong>Sources.</strong> Organisation Mondiale de la Santé (OMS), Haute Autorité
                  de Santé (HAS), ANSES (Agence nationale de sécurité sanitaire). Pour un suivi
                  sérieux du poids ou de la corpulence, demandez un avis à votre médecin traitant ou
                  à un diététicien-nutritionniste.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus fréquentes sur le calcul et l'interprétation de l'IMC."
              items={[
                {
                  question: "Quel est l'IMC idéal pour un adulte ?",
                  answer:
                    "Selon l'OMS, un IMC compris entre 18,5 et 25 correspond à un poids normal chez l'adulte. En dessous de 18,5, on parle de maigreur, et au-dessus de 25, de surpoids. L'obésité commence à partir d'un IMC de 30. Toutefois, cet indicateur ne prend pas en compte la composition corporelle : un sportif très musclé peut avoir un IMC élevé sans être en surpoids.",
                },
                {
                  question: "L'IMC est-il fiable pour les sportifs ?",
                  answer:
                    "L'IMC peut être trompeur pour les sportifs, notamment les pratiquants de musculation ou les rugbymen, car le muscle pèse plus lourd que la graisse. Un individu très musclé peut avoir un IMC supérieur à 25 tout en ayant un taux de masse grasse très faible. Dans ce cas, l'impédancemétrie ou la mesure du tour de taille sont des indicateurs complémentaires plus adaptés.",
                },
                {
                  question: "À partir de quel IMC faut-il consulter un médecin ?",
                  answer:
                    "Il est recommandé de consulter un médecin si votre IMC est inférieur à 16,5 (dénutrition) ou supérieur à 30 (obésité). Un IMC supérieur à 35 correspond à une obésité sévère qui augmente significativement les risques cardiovasculaires, de diabète de type 2 et de certains cancers. Votre médecin pourra vous orienter vers un suivi nutritionnel adapté.",
                },
                {
                  question: "L'IMC s'applique-t-il aux enfants ?",
                  answer:
                    "Non. Les enfants et adolescents ont leurs propres courbes de corpulence (IOTF, OMS) qui tiennent compte de l'âge et du sexe. Le carnet de santé français inclut ces courbes. Le calculateur ici est destiné aux adultes de 18 à 65 ans.",
                },
                {
                  question: "Comment calcule-t-on la formule de l'IMC ?",
                  answer:
                    "IMC = poids (en kg) / (taille en mètres)^2. Exemple : pour 70 kg et 1,75 m : IMC = 70 / (1,75 x 1,75) = 70 / 3,0625 = 22,86, ce qui correspond à un poids normal selon l'OMS.",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée (poids, taille) n'est envoyée à un serveur ni stockée. Le calculateur fonctionne sans inscription et sans tracker tiers.",
                },
                {
                  question: "Que faire si mon IMC est en surpoids ?",
                  answer:
                    "Un IMC entre 25 et 30 indique un surpoids. Avant de modifier vos habitudes, parlez-en à votre médecin pour écarter d'autres causes (hypothyroïdie, traitement médicamenteux). Privilégiez ensuite l'activité physique régulière et une alimentation équilibrée plutôt que des régimes restrictifs.",
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
