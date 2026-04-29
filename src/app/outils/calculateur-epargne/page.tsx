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
            Calculateur d&apos;<span style={{ color: "var(--primary)" }}>epargne</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Simulez la croissance de votre epargne avec les interets composes. Capital initial, versements mensuels, taux et duree.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parametres</h2>
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
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Duree (annees)</label>
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
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total verse</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.totalVersements)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Interets gagnes</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>+{fmt(result.totalInterets)} &euro;</p>
                  </div>
                </div>

                {/* Growth chart */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Croissance de l&apos;epargne</h2>
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
                    <span style={{ color: "var(--accent)" }}>&#9632; Interets</span>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Detail par annee</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>
                          <th className="pb-2 pr-4 text-left text-xs font-semibold uppercase tracking-wider">Annee</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Versements cumules</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Interets cumules</th>
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
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Les interets composes</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Effet boule de neige</strong> : Les interets composes generent des interets sur les interets. Plus la duree est longue, plus l&apos;effet est puissant.</p>
                <p><strong className="text-[var(--foreground)]">Regularite</strong> : Des versements mensuels reguliers, meme modestes, ont un impact considerable sur le long terme grace a la capitalisation.</p>
                <p><strong className="text-[var(--foreground)]">Formule</strong> : Capital final = CI x (1+r)^n + VM x ((1+r)^n - 1) / r, ou CI est le capital initial, r le taux mensuel et n le nombre de mois.</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment simuler la croissance de votre epargne"
              description="Trois etapes pour projeter le capital obtenu via versements reguliers et interets composes sur le long terme."
              steps={[
                {
                  name: "Capital initial et versement mensuel",
                  text:
                    "Capital initial : le montant deja disponible au depart (epargne de precaution, prime, heritage). Versement mensuel : ce que vous arrivez vraiment a mettre de cote chaque mois apres impots et charges fixes. Conseil pratique : automatisez via virement permanent en debut de mois (paie + 1 jour) pour eviter de &laquo; consommer &raquo; l&apos;epargne avant qu&apos;elle ne parte.",
                },
                {
                  name: "Taux annuel realiste selon le support",
                  text:
                    "Livret A et LDDS : 1,7 pourcent depuis fevrier 2025 (defiscalise, plafond 22 950 / 12 000 EUR). LEP (revenus modestes) : 2,7 pourcent. Assurance-vie fonds euros : 2,5 a 3,5 pourcent. Assurance-vie unites de compte : 4 a 7 pourcent (mais volatilite). PEA actions : 7 a 8 pourcent en moyenne historique long terme. Plus la duree est longue, plus on peut accepter de volatilite pour viser un rendement superieur.",
                },
                {
                  name: "Visualiser l&apos;effet boule de neige",
                  text:
                    "Le graphique et le tableau decomposent annee par annee la part des versements et la part des interets composes. Sur 30 ans a 5 pourcent avec 200 EUR/mois, plus de 60 pourcent du capital final provient des interets. C&apos;est l&apos;effet de la capitalisation : plus l&apos;horizon est long, plus le temps fait le travail a votre place.",
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
                Cas d&apos;usage du simulateur d&apos;epargne
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Constituer une epargne de precaution
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Objectif : 6 mois de depenses (10 000-20 000 EUR pour un cadre). 200 EUR/mois
                    sur Livret A a 1,7 pourcent : objectif atteint en 4-5 ans. Ce coussin est
                    indispensable avant de prendre du risque sur PEA ou immobilier locatif. Il
                    couvre une perte d&apos;emploi, un imprevu medical, une grosse reparation.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Apport pour achat immobilier
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour un achat a 250 000 EUR, viser 10 a 20 pourcent d&apos;apport (25 000-
                    50 000 EUR). Avec 400 EUR/mois sur 5 ans a 1,7 pourcent : 25 100 EUR. Avec
                    600 EUR/mois sur 7 ans a 1,7 pourcent : 53 700 EUR. Le PEL (1,75-2,25 pourcent)
                    et le CEL sont desormais competitifs face au Livret A redescendu a 1,7 pourcent.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Preparer la retraite via PEA / PER
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    300 EUR/mois sur 30 ans a 7 pourcent (PEA actions monde via ETF) : capital
                    final environ 366 000 EUR pour 108 000 EUR verses. Plus de 250 000 EUR
                    d&apos;interets composes. PER si vous etes en TMI elevee (30 pourcent +) :
                    deduction des versements du revenu imposable, sortie en capital ou rente.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Epargne enfants pour etudes
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Livret A enfant des la naissance + 100 EUR/mois pendant 18 ans a 1,7 pourcent =
                    25 100 EUR pour les etudes superieures. Sur PEA jeunes (creation 2024,
                    plafond 20 000 EUR) ou assurance-vie enfant a 6 pourcent moyen : pres de
                    40 000 EUR sur la meme periode.
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
                A savoir : enveloppes fiscales et fiscalite de l&apos;epargne
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Livret A vs assurance-vie vs PEA.</strong> Livret A : 1,7 pourcent
                  defiscalise total (taux Banque de France depuis fevrier 2025), liquidite
                  immediate, plafond 22 950 EUR. Assurance-vie :
                  fiscalite tres favorable apres 8 ans (abattement annuel 4 600 EUR / 9 200 EUR
                  pour un couple, art. 125-0 A CGI), succession privilegiee. PEA : 7-8 pourcent
                  moyen long terme, exoneration totale d&apos;IR apres 5 ans (sauf prelevements
                  sociaux 17,2 pourcent), plafond 150 000 EUR, art. L221-30 CMF.
                </p>
                <p>
                  <strong>Interets composes : la formule.</strong> Capital final = CI x (1+r)^n
                  + VM x ((1+r)^n - 1) / r, ou CI est le capital initial, r le taux periodique
                  (mensuel = annuel / 12), n le nombre de periodes. Exemple intuitif : 1 EUR
                  place a 7 pourcent double tous les 10 ans environ (regle des 72 : 72 / 7 =
                  10,3 ans). Sur 40 ans, 1 EUR devient 15 EUR ; sur 50 ans, 30 EUR.
                </p>
                <p>
                  <strong>Capacite d&apos;epargne realiste.</strong> Regle d&apos;or des
                  budgetistes : 50 pourcent depenses essentielles, 30 pourcent loisirs, 20
                  pourcent epargne (regle 50/30/20). Sur un net de 2 500 EUR = 500 EUR
                  d&apos;epargne mensuelle theorique. En realite, beaucoup de Francais epargnent
                  10-15 pourcent. Au-dela de 25 pourcent durable, vous etes dans le top decile.
                </p>
                <p>
                  <strong>Inflation : ennemi silencieux.</strong> Un taux nominal de 1,7 pourcent
                  avec 2 pourcent d&apos;inflation = -0,3 pourcent reel : votre Livret A perd du
                  pouvoir d&apos;achat. Sur 30 ans, c&apos;est
                  presque rien. Le PEA et l&apos;assurance-vie en unites de compte permettent
                  historiquement de battre l&apos;inflation grace aux actions (rendement reel
                  long terme actions monde : 5-6 pourcent par an). C&apos;est pourquoi
                  l&apos;epargne longue ne peut pas rester 100 pourcent en livrets.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions frequentes sur les placements d&apos;epargne et les interets composes en France."
              items={[
                {
                  question: "Quel est le taux du Livret A en 2026 ?",
                  answer:
                    "Le Livret A est a 1,7 pourcent depuis fevrier 2025, en baisse apres avoir ete a 3 pourcent (gele 2023-2024) puis a 2,4 pourcent au second semestre 2025. Revision semestrielle par la Banque de France selon une formule basee sur l&apos;inflation hors tabac et taux interbancaire. Plafond 22 950 EUR. Interets exoneres d&apos;IR et de prelevements sociaux : c&apos;est le placement le plus simple et populaire en France.",
                },
                {
                  question: "Comment fonctionnent les interets composes ?",
                  answer:
                    "Les interets gagnes une periode rapportent eux-memes des interets la periode suivante. 10 000 EUR a 5 pourcent : annee 1 = 500 EUR d&apos;interets ; annee 2 = 525 EUR (calcules sur 10 500 EUR). Effet boule de neige : sur 20 ans, ce capital atteint 26 533 EUR sans aucun versement supplementaire, soit +165 pourcent. La duree est plus puissante que le taux pour les petits patrimoines.",
                },
                {
                  question: "Difference entre Livret A, LDDS, LEP et PEA ?",
                  answer:
                    "Livret A et LDDS : taux 1,7 pourcent depuis fevrier 2025, exoneres d&apos;impot, plafonds 22 950 / 12 000 EUR. LEP (Livret Epargne Populaire) : 2,7 pourcent, plafond 10 000 EUR, reserve aux revenus modestes (sous le plafond fiscal de l&apos;art. L221-15 CMF). PEA (Plan Epargne en Actions) : actions europeennes uniquement, plafond 150 000 EUR, exoneration IR apres 5 ans (PS 17,2 pourcent du), rendement historique 7-8 pourcent.",
                },
                {
                  question: "Quel taux annuel realiste pour mes simulations ?",
                  answer:
                    "Livret A / LDDS : 1,7 pourcent (depuis fevrier 2025). LEP : 2,7 pourcent. PEL : 1,75-2,25 pourcent (a nouveau competitif). Assurance-vie fonds euros : 2,5-3,5 pourcent. Assurance-vie en UC mixte (60/40) : 4-5 pourcent. PEA / CTO 100 pourcent actions monde : 7-8 pourcent en moyenne tres long terme (avec volatilite annuelle de +/- 30 pourcent). Pour une simulation prudente, prenez 3-4 pourcent.",
                },
                {
                  question: "Quel placement choisir selon mon horizon ?",
                  answer:
                    "Court terme (0-2 ans, epargne de precaution) : Livret A et LDDS exclusivement, pour la liquidite et la securite. Moyen terme (2-8 ans, projets) : assurance-vie fonds euros + UC moderees. Long terme (8 ans +, retraite, patrimoine) : assurance-vie en UC dynamiques, PEA, immobilier locatif. La cle est l&apos;adequation horizon / risque : plus c&apos;est long, plus le risque actions devient acceptable et rentable.",
                },
                {
                  question: "Faut-il privilegier les versements mensuels ou un capital initial ?",
                  answer:
                    "Mathematiquement, plus le capital est en place tot, plus les interets composes ont le temps de jouer. 10 000 EUR places aujourd&apos;hui a 5 pourcent rapporteront plus que 200 EUR/mois pendant 50 mois (meme cumul total). Mais en pratique, l&apos;essentiel est de commencer : un versement automatise mensuel evite de procrastiner et lisse les points d&apos;entree (DCA) sur les supports volatils.",
                },
                {
                  question: "Comment integrer l&apos;inflation dans mes calculs d&apos;epargne ?",
                  answer:
                    "Calculez en taux reel = taux nominal - taux d&apos;inflation. A 1,7 pourcent nominal et 2 pourcent inflation : -0,3 pourcent reel, autrement dit votre Livret A perd du pouvoir d&apos;achat. Sur 30 ans, 100 EUR aujourd&apos;hui valent environ 55 EUR en pouvoir d&apos;achat avec 2 pourcent inflation annuelle. C&apos;est pourquoi l&apos;epargne longue (retraite) doit chercher des supports qui battent l&apos;inflation : actions monde, immobilier locatif, ou or sur tres long terme.",
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
                  { nom: "LEP", taux: "2,7%" },
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
