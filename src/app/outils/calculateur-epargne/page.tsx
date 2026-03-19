"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

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

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur d&apos;epargne
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce simulateur d&apos;epargne vous permet de projeter la croissance de votre capital sur la duree grace aux interets composes. Ideal pour comparer differents placements ou planifier votre epargne a long terme.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Capital initial</strong> : le montant que vous investissez au depart (par exemple, 5 000 &euro; sur un livret ou un PEA).</li>
                  <li><strong className="text-[var(--foreground)]">Versement mensuel</strong> : la somme que vous epargnez chaque mois. Meme 50 &euro; par mois font une vraie difference sur 10 ou 20 ans.</li>
                  <li><strong className="text-[var(--foreground)]">Taux annuel et duree</strong> : choisissez un taux realiste (3% pour un Livret A, 7-8% pour un PEA long terme) et la duree de votre placement.</li>
                </ul>
                <p>Le graphique et le tableau detaille vous montrent annee par annee la part des versements et celle des interets dans votre capital final. C&apos;est la meilleure facon de visualiser l&apos;effet &laquo; boule de neige &raquo; des interets composes.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel est le taux du Livret A en 2025 ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le taux du Livret A est de 3,0% depuis fevrier 2023. Ce taux est fixe par la Banque de France et revise tous les semestres. Le plafond du Livret A est de 22 950 &euro; pour les particuliers. Les interets sont exoneres d&apos;impot sur le revenu et de prelevements sociaux, ce qui en fait le placement le plus populaire en France.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment fonctionnent les interets composes ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Les interets composes signifient que les interets gagnes sont reinvestis et produisent eux-memes des interets. Par exemple, 10 000 &euro; places a 5% rapportent 500 &euro; la premiere annee. La deuxieme annee, les interets sont calcules sur 10 500 &euro;, soit 525 &euro;. Cet effet s&apos;accelere avec le temps : c&apos;est pourquoi on parle d&apos;effet &laquo; boule de neige &raquo;.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la difference entre Livret A, LDDS, LEP et PEA ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le Livret A et le LDDS sont des livrets reglementes a 3%, sans impot, avec un plafond de 22 950 &euro; et 12 000 &euro; respectivement. Le LEP (Livret d&apos;Epargne Populaire) offre un taux de 4% mais est reserve aux revenus modestes. Le PEA (Plan d&apos;Epargne en Actions) permet d&apos;investir en bourse avec une fiscalite avantageuse apres 5 ans, avec un rendement historique moyen de 7 a 8% par an.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Placements courants</h3>
              <div className="mt-3 space-y-2">
                {[
                  { nom: "Livret A", taux: "3,0%" },
                  { nom: "LDDS", taux: "3,0%" },
                  { nom: "LEP", taux: "4,0%" },
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
