"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

export default function CalculateurPourcentage() {
  const [pct, setPct] = useState("20");
  const [of, setOf] = useState("150");
  const [valA, setValA] = useState("80");
  const [valB, setValB] = useState("100");
  const [part, setPart] = useState("25");
  const [total, setTotal] = useState("200");

  const fmt = (n: number) => isFinite(n) ? n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";

  const result1 = (parseFloat(pct) || 0) / 100 * (parseFloat(of) || 0);
  const result2 = ((parseFloat(valB) || 0) - (parseFloat(valA) || 0)) / (parseFloat(valA) || 1) * 100;
  const result3 = (parseFloat(part) || 0) / (parseFloat(total) || 1) * 100;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Mathematiques</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>pourcentage</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Trois modes de calcul instantanes : combien fait X % de Y, variation entre 2 valeurs et
            part en pourcentage. Pour les remises, evolutions de prix, repartitions de budget, taux
            de conversion. Outil gratuit, sans inscription, calculs locaux.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode 1: X% of Y */}
            <CalcBlock title="Combien fait X% de Y ?">
              <div className="flex items-center gap-3">
                <input type="number" value={pct} onChange={(e) => setPct(e.target.value)}
                  className="w-24 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span style={{ color: "var(--muted)" }}>% de</span>
                <input type="number" value={of} onChange={(e) => setOf(e.target.value)}
                  className="w-32 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span style={{ color: "var(--muted)" }}>=</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result1)}</span>
              </div>
            </CalcBlock>

            {/* Mode 2: Variation */}
            <CalcBlock title="Variation en pourcentage">
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: "var(--muted)" }}>De</span>
                <input type="number" value={valA} onChange={(e) => setValA(e.target.value)}
                  className="w-28 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span className="text-sm" style={{ color: "var(--muted)" }}>a</span>
                <input type="number" value={valB} onChange={(e) => setValB(e.target.value)}
                  className="w-28 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span style={{ color: "var(--muted)" }}>=</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: result2 >= 0 ? "var(--primary)" : "#dc2626" }}>
                  {result2 >= 0 ? "+" : ""}{fmt(result2)}%
                </span>
              </div>
            </CalcBlock>

            {/* Mode 3: Part of total */}
            <CalcBlock title="Quel pourcentage represente X sur Y ?">
              <div className="flex items-center gap-3">
                <input type="number" value={part} onChange={(e) => setPart(e.target.value)}
                  className="w-28 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span className="text-sm" style={{ color: "var(--muted)" }}>sur</span>
                <input type="number" value={total} onChange={(e) => setTotal(e.target.value)}
                  className="w-28 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span style={{ color: "var(--muted)" }}>=</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result3)}%</span>
              </div>
            </CalcBlock>

            <ToolHowToSection
              title="Comment utiliser le calculateur de pourcentage"
              description="Trois modes complementaires pour repondre aux trois questions les plus frequentes en pourcentages, instantanement."
              steps={[
                {
                  name: "Mode 1 : Combien fait X % de Y",
                  text:
                    "Idéal pour calculer une remise (20 % de 150 EUR = 30 EUR), un pourboire (15 % d'addition), une commission ou une part. Saisissez le pourcentage dans le premier champ et la valeur de reference dans le second. Le resultat est instantane.",
                },
                {
                  name: "Mode 2 : Variation en pourcentage",
                  text:
                    "Pour comparer deux valeurs : evolution de prix, croissance d'un chiffre d'affaires, perte ou gain en bourse. Saisissez la valeur de depart puis la valeur d'arrivee. Le resultat positif (+15 %) indique une hausse, negatif (-8 %) une baisse.",
                },
                {
                  name: "Mode 3 : Quel pourcentage represente X sur Y",
                  text:
                    "Pour exprimer une part en pourcentage : sur les 200 commandes, 25 sont en retard, soit 12,5 %. Saisissez la partie puis le total. C'est aussi le mode utilise pour calculer un taux de conversion, un taux d'erreur ou une part de marche.",
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
                Cas d&apos;usage du calculateur de pourcentage
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Soldes et remises
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une veste affichée a -30 % a 89 EUR : utilisez le Mode 1 (30 % de 89 = 26,70 EUR
                    de remise) puis le Mode 2 pour verifier que le prix de depart etait coherent.
                    Pratique pour reperer les fausses promotions.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Suivi de croissance business
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous etiez a 12 000 EUR de CA en mars, 14 800 en avril : Mode 2 = +23,3 % de
                    croissance mensuelle. Indispensable pour les reportings, les pitches investisseurs
                    et les KPI commerciaux.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Calcul d&apos;une note ou d&apos;un score
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour un examen avec 18 / 25 : Mode 3 donne 72 %, soit equivalent a 14,4/20 (en
                    multipliant 72 % par 20). Tres utile pour convertir entre baremes (sur 20, sur
                    100, sur 25).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Repartition d&apos;un budget
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Sur 2 500 EUR de revenus, vous depensez 850 EUR en loyer : Mode 3 = 34 % du
                    revenu. La regle des 30 % de loyer est un repere classique pour evaluer un budget
                    logement.
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
                Pieges classiques avec les pourcentages
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>+10 % puis -10 % ne ramene PAS au prix initial.</strong> Un produit a 100
                  EUR + 10 % = 110 EUR. Puis -10 % de 110 = 99 EUR (et non 100). C&apos;est mathematiquement
                  normal mais souvent contre-intuitif. Pour annuler une hausse de 10 %, il faut
                  appliquer -9,09 %.
                </p>
                <p>
                  <strong>Points de pourcentage vs pourcent.</strong> Si un taux passe de 5 % a 7 %,
                  on parle de +2 points de pourcentage (et non +2 %). En pourcentage relatif, la
                  hausse est de 40 % (5 a 7 = +40 %). Cette nuance est cruciale en politique,
                  finance, statistiques.
                </p>
                <p>
                  <strong>TVA et marges.</strong> Une marge de 50 % n&apos;est pas l&apos;inverse
                  d&apos;une remise de 50 %. Pour vendre 150 EUR un produit qui coute 100 EUR, la
                  marge est de 50 % (50 sur 100). Mais le coefficient multiplicateur est 1,5. Tres
                  utilise dans le commerce.
                </p>
                <p>
                  <strong>Cumuls de pourcentages.</strong> Une augmentation de 5 % par an pendant
                  3 ans n&apos;equivaut PAS a +15 % cumule. La formule est (1,05)^3 - 1 = 15,76 %
                  sur 3 ans, par effet d&apos;interets composes. Difference qui devient enorme sur
                  10 ou 20 ans.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur les calculs de pourcentage."
              items={[
                {
                  question: "Comment calculer 20 % de 150 ?",
                  answer:
                    "Multipliez 150 par 0,20 (ou divisez par 5, qui est l'inverse de 20 %). 150 x 0,20 = 30. Ou 150 / 5 = 30. Le calculateur Mode 1 le fait directement.",
                },
                {
                  question: "Comment calculer une variation en pourcentage ?",
                  answer:
                    "((Nouvelle valeur - Ancienne valeur) / Ancienne valeur) x 100. Exemple de 80 a 100 : ((100 - 80) / 80) x 100 = +25 %. Le calculateur Mode 2 affiche aussi le signe (+ ou -) pour distinguer hausse et baisse.",
                },
                {
                  question: "Quelle est la difference entre +20 % et 1,2 fois ?",
                  answer:
                    "Aucune : 1,2 est le coefficient multiplicateur correspondant a +20 %. Pour calculer 100 EUR augmentes de 20 %, vous pouvez faire 100 + (20 % de 100) = 120, ou directement 100 x 1,2 = 120. C'est la meme chose.",
                },
                {
                  question: "Comment soustraire un pourcentage d'un total ?",
                  answer:
                    "Multipliez par (1 - taux/100). Pour soustraire 30 % de 200 EUR : 200 x (1 - 0,30) = 200 x 0,70 = 140 EUR. C'est plus rapide que 'calculer 30 % puis soustraire'.",
                },
                {
                  question: "Comment retrouver le prix avant TVA ?",
                  answer:
                    "Pour TVA a 20 %, divisez le prix TTC par 1,20. Pour 120 EUR TTC : 120 / 1,20 = 100 EUR HT. Erreur classique a eviter : faire 120 - (20 % de 120) = 96 EUR donne un faux HT (sous-evalue de 4 %).",
                },
                {
                  question: "Pourquoi -50 % puis +50 % ne ramene pas a 100 % ?",
                  answer:
                    "100 EUR -50 % = 50 EUR. Puis 50 EUR +50 % = 75 EUR (et non 100). Pour revenir a 100 apres -50 %, il faut une hausse de 100 % (doubler). Cette asymetrie des pourcentages est la principale source d'erreur en finance.",
                },
                {
                  question: "Mes calculs sont-ils confidentiels ?",
                  answer:
                    "Oui. Tous les calculs sont effectues localement dans votre navigateur. Aucun chiffre saisi n'est envoye a un serveur ou stocke. L'outil fonctionne sans inscription et sans tracker.",
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

function CalcBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
