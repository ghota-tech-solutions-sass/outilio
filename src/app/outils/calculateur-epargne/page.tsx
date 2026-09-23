"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

export default function CalculateurEpargne() {
  const [capitalInitial, setCapitalInitial] = useState("5000");
  const [versementMensuel, setVersementMensuel] = useState("200");
  const [tauxAnnuel, setTauxAnnuel] = useState("4");
  const [dureeAns, setDureeAns] = useState("10");

  const result = useMemo(() => {
    const ci = parseFloat(capitalInitial) || 0;
    const vm = parseFloat(versementMensuel) || 0;
    const t = (parseFloat(tauxAnnuel) || 0) / 100;
    const n = parseInt(dureeAns) || 0;
    if (n <= 0) return null;

    const tauxMensuel = t / 12;
    const totalMois = n * 12;

    const data: { year: number; capital: number; versements: number; interets: number }[] = [];
    let solde = ci;
    let totalVersements = ci;
    let totalInterets = 0;

    for (let mois = 1; mois <= totalMois; mois++) {
      const interet = solde * tauxMensuel;
      solde += interet + vm;
      totalVersements += vm;
      totalInterets += interet;

      if (mois % 12 === 0) {
        data.push({
          year: mois / 12,
          capital: solde,
          versements: totalVersements,
          interets: totalInterets,
        });
      }
    }

    return {
      montantFinal: solde,
      totalVersements,
      totalInterets,
      data,
    };
  }, [capitalInitial, versementMensuel, tauxAnnuel, dureeAns]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const maxCapital = result ? Math.max(...result.data.map((d) => d.capital)) : 1;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur d&apos;<span style={{ color: "var(--primary)" }}>épargne</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Simulez la croissance de votre épargne avec les intérêts composés. Capital initial, versements mensuels, taux et durée.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Paramètres</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Capital initial (&euro;)</label>
                  <input type="number" value={capitalInitial} onChange={(e) => setCapitalInitial(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Versement mensuel (&euro;)</label>
                  <input type="number" value={versementMensuel} onChange={(e) => setVersementMensuel(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux annuel (%)</label>
                  <input type="number" step="0.1" value={tauxAnnuel} onChange={(e) => setTauxAnnuel(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Durée (années)</label>
                  <input type="number" min="1" max="50" value={dureeAns} onChange={(e) => setDureeAns(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant final</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.montantFinal)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total versé</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.totalVersements)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Intérêts gagnés</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>+{fmt(result.totalInterets)} &euro;</p>
                  </div>
                </div>

                {/* Growth chart */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Croissance de l&apos;épargne</h2>
                  <div className="mt-4 space-y-2">
                    {result.data.map((d) => (
                      <div key={d.year} className="flex items-center gap-3">
                        <span className="w-12 text-right text-xs font-semibold" style={{ color: "var(--muted)" }}>An {d.year}</span>
                        <div className="flex-1 flex h-6 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                          <div style={{ width: `${(d.versements / maxCapital) * 100}%`, background: "var(--primary)", transition: "width 0.3s" }} />
                          <div style={{ width: `${(d.interets / maxCapital) * 100}%`, background: "var(--accent)", transition: "width 0.3s" }} />
                        </div>
                        <span className="w-28 text-right text-xs font-bold">{fmt(d.capital)} &euro;</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-6 text-xs font-semibold">
                    <span style={{ color: "var(--primary)" }}>&#9632; Versements</span>
                    <span style={{ color: "var(--accent)" }}>&#9632; Intérêts</span>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détail par année</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>
                          <th className="pb-2 pr-4 text-left text-xs font-semibold uppercase tracking-wider">Année</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Versements cumulés</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Intérêts cumulés</th>
                          <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider">Capital total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.data.map((d) => (
                          <tr key={d.year} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td className="py-3 pr-4 font-semibold">{d.year}</td>
                            <td className="py-3 pr-4 text-right">{fmt(d.versements)} &euro;</td>
                            <td className="py-3 pr-4 text-right" style={{ color: "var(--accent)" }}>{fmt(d.interets)} &euro;</td>
                            <td className="py-3 text-right font-semibold">{fmt(d.capital)} &euro;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Les intérêts composés</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Effet boule de neige</strong> : Les intérêts composés génèrent des intérêts sur les intérêts. Plus la durée est longue, plus l&apos;effet est puissant.</p>
                <p><strong className="text-[var(--foreground)]">Régularité</strong> : Des versements mensuels réguliers, même modestes, ont un impact considérable sur le long terme grâce à la capitalisation.</p>
                <p><strong className="text-[var(--foreground)]">Formule</strong> : Capital final = CI x (1+r)^n + VM x ((1+r)^n - 1) / r, où CI est le capital initial, r le taux mensuel et n le nombre de mois.</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment simuler la croissance de votre épargne"
              description="Trois étapes pour projeter le capital obtenu via versements réguliers et intérêts composés sur le long terme."
              steps={[
                {
                  name: "Capital initial et versement mensuel",
                  text:
                    "Capital initial : le montant déjà disponible au départ (épargne de précaution, prime, héritage). Versement mensuel : ce que vous arrivez vraiment à mettre de côté chaque mois après impôts et charges fixes. Conseil pratique : automatisez via virement permanent en début de mois (paie + 1 jour) pour éviter de « consommer » l'épargne avant qu'elle ne parte.",
                },
                {
                  name: "Taux annuel réaliste selon le support",
                  text:
                    "Livret A et LDDS : 1,7 pourcent depuis le 1er août 2026 (défiscalisé, plafond 22 950 / 12 000 €). LEP (revenus modestes) : 2,5 pourcent. Assurance-vie fonds euros : 2,5 à 3,5 pourcent. Assurance-vie unités de compte : 4 à 7 pourcent (mais volatilité). PEA actions : 7 à 8 pourcent en moyenne historique long terme. Plus la durée est longue, plus on peut accepter de volatilité pour viser un rendement supérieur.",
                },
                {
                  name: "Visualiser l'effet boule de neige",
                  text:
                    "Le graphique et le tableau décomposent année par année la part des versements et la part des intérêts composés. Sur 30 ans à 5 pourcent avec 200 €/mois, environ 57 pourcent du capital final provient des intérêts. C'est l'effet de la capitalisation : plus l'horizon est long, plus le temps fait le travail à votre place.",
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
                Cas d&apos;usage du simulateur d&apos;épargne
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Constituer une épargne de précaution
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Objectif : 6 mois de dépenses (10 000-20 000 € pour un cadre). 200 €/mois
                    sur Livret A à 1,7 pourcent : objectif atteint en 4-5 ans. Ce coussin est
                    indispensable avant de prendre du risque sur PEA ou immobilier locatif. Il
                    couvre une perte d&apos;emploi, un imprévu médical, une grosse réparation.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Apport pour achat immobilier
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour un achat à 250 000 €, viser 10 à 20 pourcent d&apos;apport (25 000-
                    50 000 €). Avec 400 €/mois sur 5 ans à 1,7 pourcent : environ 25 000 €. Avec
                    600 €/mois sur 7 ans à 1,7 pourcent : environ 53 500 €. Le PEL (2 pourcent brut
                    pour un plan ouvert en 2026) reste une alternative au Livret A à 1,7 pourcent.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Préparer la retraite via PEA / PER
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    300 €/mois sur 30 ans à 7 pourcent (PEA actions monde via ETF) : capital
                    final environ 366 000 € pour 108 000 € versés. Plus de 250 000 €
                    d&apos;intérêts composés. PER si vous êtes en TMI élevée (30 pourcent +) :
                    déduction des versements du revenu imposable, sortie en capital ou rente.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Épargne enfants pour études
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Livret A enfant dès la naissance + 100 €/mois pendant 18 ans à 1,7 pourcent =
                    environ 25 200 € pour les études supérieures. Sur PEA jeunes (création 2024,
                    plafond 20 000 €) ou assurance-vie enfant à 6 pourcent moyen : près de
                    40 000 € sur la même période.
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
                À savoir : enveloppes fiscales et fiscalité de l&apos;épargne
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Livret A vs assurance-vie vs PEA.</strong> Livret A : 1,7 pourcent
                  défiscalisé total (taux en vigueur depuis le 1er août 2026), liquidité
                  immédiate, plafond 22 950 €. Assurance-vie :
                  fiscalité très favorable après 8 ans (abattement annuel 4 600 € / 9 200 €
                  pour un couple, art. 125-0 A CGI), succession privilégiée. PEA : 7-8 pourcent
                  moyen long terme, exonération totale d&apos;IR après 5 ans (sauf prélèvements
                  sociaux 18,6 pourcent depuis 2026), plafond 150 000 €, art. L221-30 CMF.
                </p>
                <p>
                  <strong>Intérêts composés : la formule.</strong> Capital final = CI x (1+r)^n
                  + VM x ((1+r)^n - 1) / r, où CI est le capital initial, r le taux périodique
                  (mensuel = annuel / 12), n le nombre de périodes. Exemple intuitif : 1 €
                  placé à 7 pourcent double tous les 10 ans environ (règle des 72 : 72 / 7 =
                  10,3 ans). Sur 40 ans, 1 € devient 15 € ; sur 50 ans, 30 €.
                </p>
                <p>
                  <strong>Capacité d&apos;épargne réaliste.</strong> Règle d&apos;or des
                  budgétistes : 50 pourcent dépenses essentielles, 30 pourcent loisirs, 20
                  pourcent épargne (règle 50/30/20). Sur un net de 2 500 € = 500 €
                  d&apos;épargne mensuelle théorique. En réalité, beaucoup de Français épargnent
                  10-15 pourcent. Au-delà de 25 pourcent durable, vous êtes dans le top décile.
                </p>
                <p>
                  <strong>Inflation : ennemi silencieux.</strong> Un taux nominal de 1,7 pourcent
                  avec 2 pourcent d&apos;inflation = -0,3 pourcent réel : votre Livret A perd du
                  pouvoir d&apos;achat. Sur 30 ans, c&apos;est
                  presque rien. Le PEA et l&apos;assurance-vie en unités de compte permettent
                  historiquement de battre l&apos;inflation grâce aux actions (rendement réel
                  long terme actions monde : 5-6 pourcent par an). C&apos;est pourquoi
                  l&apos;épargne longue ne peut pas rester 100 pourcent en livrets.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions fréquentes sur les placements d&apos;épargne et les intérêts composés en France."
              items={[
                {
                  question: "Quel est le taux du Livret A en 2026 ?",
                  answer:
                    "Le Livret A est à 1,7 pourcent depuis le 1er août 2026. Historique récent : 3 pourcent (février 2023 à janvier 2025), 2,4 pourcent (février 2025), 1,7 pourcent (août 2025), 1,5 pourcent (février 2026), puis remontée à 1,7 pourcent en août 2026. Révision semestrielle par la Banque de France selon une formule basée sur l'inflation hors tabac et taux interbancaire. Plafond 22 950 €. Intérêts exonérés d'IR et de prélèvements sociaux : c'est le placement le plus simple et populaire en France.",
                },
                {
                  question: "Comment fonctionnent les intérêts composés ?",
                  answer:
                    "Les intérêts gagnés une période rapportent eux-mêmes des intérêts la période suivante. 10 000 € à 5 pourcent : année 1 = 500 € d'intérêts ; année 2 = 525 € (calculés sur 10 500 €). Effet boule de neige : sur 20 ans, ce capital atteint 26 533 € sans aucun versement supplémentaire, soit +165 pourcent. La durée est plus puissante que le taux pour les petits patrimoines.",
                },
                {
                  question: "Différence entre Livret A, LDDS, LEP et PEA ?",
                  answer:
                    "Livret A et LDDS : taux 1,7 pourcent depuis le 1er août 2026, exonérés d'impôt, plafonds 22 950 / 12 000 €. LEP (Livret Épargne Populaire) : 2,5 pourcent, plafond 10 000 €, réservé aux revenus modestes (sous le plafond fiscal de l'art. L221-15 CMF). PEA (Plan Épargne en Actions) : actions européennes uniquement, plafond 150 000 €, exonération IR après 5 ans (PS 18,6 pourcent dus depuis 2026), rendement historique 7-8 pourcent.",
                },
                {
                  question: "Quel taux annuel réaliste pour mes simulations ?",
                  answer:
                    "Livret A / LDDS : 1,7 pourcent (depuis le 1er août 2026). LEP : 2,5 pourcent. PEL : 2 pourcent brut pour un plan ouvert en 2026. Assurance-vie fonds euros : 2,5-3,5 pourcent. Assurance-vie en UC mixte (60/40) : 4-5 pourcent. PEA / CTO 100 pourcent actions monde : 7-8 pourcent en moyenne très long terme (avec volatilité annuelle de +/- 30 pourcent). Pour une simulation prudente, prenez 3-4 pourcent.",
                },
                {
                  question: "Quel placement choisir selon mon horizon ?",
                  answer:
                    "Court terme (0-2 ans, épargne de précaution) : Livret A et LDDS exclusivement, pour la liquidité et la sécurité. Moyen terme (2-8 ans, projets) : assurance-vie fonds euros + UC modérées. Long terme (8 ans +, retraite, patrimoine) : assurance-vie en UC dynamiques, PEA, immobilier locatif. La clé est l'adéquation horizon / risque : plus c'est long, plus le risque actions devient acceptable et rentable.",
                },
                {
                  question: "Faut-il privilégier les versements mensuels ou un capital initial ?",
                  answer:
                    "Mathématiquement, plus le capital est en place tôt, plus les intérêts composés ont le temps de jouer. 10 000 € placés aujourd'hui à 5 pourcent rapporteront plus que 200 €/mois pendant 50 mois (même cumul total). Mais en pratique, l'essentiel est de commencer : un versement automatisé mensuel évite de procrastiner et lisse les points d'entrée (DCA) sur les supports volatils.",
                },
                {
                  question: "Comment intégrer l'inflation dans mes calculs d'épargne ?",
                  answer:
                    "Calculez en taux réel = taux nominal - taux d'inflation. À 1,7 pourcent nominal et 2 pourcent inflation : -0,3 pourcent réel, autrement dit votre Livret A perd du pouvoir d'achat. Sur 30 ans, 100 € aujourd'hui valent environ 55 € en pouvoir d'achat avec 2 pourcent inflation annuelle. C'est pourquoi l'épargne longue (retraite) doit chercher des supports qui battent l'inflation : actions monde, immobilier locatif, ou or sur très long terme.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Placements courants</h3>
              <div className="mt-3 space-y-2">
                {[
                  { nom: "Livret A", taux: "1,7%" },
                  { nom: "LDDS", taux: "1,7%" },
                  { nom: "LEP", taux: "2,5%" },
                  { nom: "Assurance-vie fonds €", taux: "2,5%" },
                  { nom: "PEA (actions)", taux: "7-8%" },
                  { nom: "SCPI", taux: "4-5%" },
                ].map((p) => (
                  <div key={p.nom} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{p.nom}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{p.taux}</span>
                  </div>
                ))}
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
