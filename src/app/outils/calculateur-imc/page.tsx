"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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

            <div
              className="rounded-2xl border p-6"
              style={{ background: "rgba(232, 150, 62, 0.08)", borderColor: "var(--accent)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                <strong>Information importante.</strong> L&apos;IMC est un indicateur de depistage,
                pas un diagnostic medical. Il ne distingue pas masse grasse et masse musculaire et
                ne s&apos;applique pas aux femmes enceintes, enfants, sportifs muscles ou personnes
                agees. Consultez votre medecin pour une evaluation complete.
              </p>
            </div>

            <ToolHowToSection
              title="Comment calculer votre IMC en 3 etapes"
              description="L'IMC (Indice de Masse Corporelle) est un indicateur standard valide par l'OMS pour estimer la corpulence d'un adulte de 18 a 65 ans en bonne sante."
              steps={[
                {
                  name: "Mesurer votre poids",
                  text:
                    "Pesez-vous le matin a jeun, sans vetements (ou en sous-vetements seulement). Utilisez la meme balance et les memes conditions a chaque mesure pour pouvoir comparer dans le temps.",
                },
                {
                  name: "Mesurer votre taille",
                  text:
                    "Mesurez-vous pieds joints, dos contre un mur, sans chaussures. Pour la majorite des adultes, la taille est stable apres 25 ans (mais peut diminuer de 1 a 2 cm apres 60 ans, sans pathologie).",
                },
                {
                  name: "Interpreter le resultat",
                  text:
                    "L'outil affiche votre IMC, votre categorie OMS et la fourchette de poids associee a un IMC normal pour votre taille. Si vous etes en zone de maigreur, surpoids ou obesite, ne vous fixez pas sur ce seul chiffre : un avis medical est essentiel pour decider d'une action.",
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
                Limites de l&apos;IMC : a quoi rester attentif
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Sportifs et muscles.</strong> Le muscle pese davantage que la graisse a
                  volume egal. Un rugbyman, un body-builder ou un haltérophile peut avoir un IMC
                  superieur a 25 tout en ayant un taux de masse grasse tres faible. Pour ces profils,
                  l&apos;impedancemetrie ou la mesure du pli cutane sont plus pertinents.
                </p>
                <p>
                  <strong>Repartition des graisses.</strong> L&apos;IMC ne dit rien de la repartition
                  abdominale ou peripherique de la masse grasse. La graisse abdominale est plus
                  associee aux risques cardio-metaboliques. La mesure complementaire est le tour de
                  taille : risque eleve si plus de 94 cm chez l&apos;homme, plus de 80 cm chez la
                  femme.
                </p>
                <p>
                  <strong>Femmes enceintes et enfants.</strong> L&apos;IMC adulte ne s&apos;applique
                  pas aux femmes enceintes, ni aux enfants/adolescents (qui suivent les courbes de
                  corpulence du carnet de sante). Pour les seniors, les seuils peuvent etre legerement
                  decales (IMC entre 21 et 27 souvent considere comme acceptable).
                </p>
                <p>
                  <strong>Sources.</strong> Organisation Mondiale de la Sante (OMS), Haute Autorite
                  de Sante (HAS), ANSES (Agence nationale de securite sanitaire). Pour un suivi
                  serieux du poids ou de la corpulence, demandez un avis a votre medecin traitant ou
                  a un dieteticien-nutritionniste.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur le calcul et l'interpretation de l'IMC."
              items={[
                {
                  question: "Quel est l'IMC ideal pour un adulte ?",
                  answer:
                    "Selon l'OMS, un IMC compris entre 18,5 et 25 correspond a un poids normal chez l'adulte. En dessous de 18,5, on parle de maigreur, et au-dessus de 25, de surpoids. L'obesite commence a partir d'un IMC de 30. Toutefois, cet indicateur ne prend pas en compte la composition corporelle : un sportif tres muscle peut avoir un IMC eleve sans etre en surpoids.",
                },
                {
                  question: "L'IMC est-il fiable pour les sportifs ?",
                  answer:
                    "L'IMC peut etre trompeur pour les sportifs, notamment les pratiquants de musculation ou les rugbymen, car le muscle pese plus lourd que la graisse. Un individu tres muscle peut avoir un IMC superieur a 25 tout en ayant un taux de masse grasse tres faible. Dans ce cas, l'impedancemetrie ou la mesure du tour de taille sont des indicateurs complementaires plus adaptes.",
                },
                {
                  question: "A partir de quel IMC faut-il consulter un medecin ?",
                  answer:
                    "Il est recommande de consulter un medecin si votre IMC est inferieur a 16,5 (denutrition) ou superieur a 30 (obesite). Un IMC superieur a 35 correspond a une obesite severe qui augmente significativement les risques cardiovasculaires, de diabete de type 2 et de certains cancers. Votre medecin pourra vous orienter vers un suivi nutritionnel adapte.",
                },
                {
                  question: "L'IMC s'applique-t-il aux enfants ?",
                  answer:
                    "Non. Les enfants et adolescents ont leurs propres courbes de corpulence (IOTF, OMS) qui tiennent compte de l'age et du sexe. Le carnet de sante francais inclut ces courbes. Le calculateur ici est destine aux adultes de 18 a 65 ans.",
                },
                {
                  question: "Comment calcule-t-on la formule de l'IMC ?",
                  answer:
                    "IMC = poids (en kg) / (taille en metres)^2. Exemple : pour 70 kg et 1,75 m : IMC = 70 / (1,75 x 1,75) = 70 / 3,0625 = 22,86, ce qui correspond a un poids normal selon l'OMS.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee (poids, taille) n'est envoyee a un serveur ni stockee. Le calculateur fonctionne sans inscription et sans tracker tiers.",
                },
                {
                  question: "Que faire si mon IMC est en surpoids ?",
                  answer:
                    "Un IMC entre 25 et 30 indique un surpoids. Avant de modifier vos habitudes, parlez-en a votre medecin pour ecarter d'autres causes (hypothyroidie, traitement medicamenteux). Privilegiez ensuite l'activite physique reguliere et une alimentation equilibree plutot que des regimes restrictifs.",
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
