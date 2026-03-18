"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function CalculateurPretAuto() {
  const [prix, setPrix] = useState("25000");
  const [apport, setApport] = useState("5000");
  const [taux, setTaux] = useState("5.5");
  const [duree, setDuree] = useState("5");

  const result = useMemo(() => {
    const c = (parseFloat(prix) || 0) - (parseFloat(apport) || 0);
    const r = (parseFloat(taux) || 0) / 100 / 12;
    const n = (parseFloat(duree) || 1) * 12;
    if (c <= 0 || r <= 0 || n <= 0) return null;

    const mensualite = (c * r) / (1 - Math.pow(1 + r, -n));
    const coutTotal = mensualite * n;
    const interetsTotal = coutTotal - c;

    const annualSummary: { year: number; capital: number; interets: number; restant: number }[] = [];
    let restant = c;
    for (let y = 1; y <= parseFloat(duree); y++) {
      let capitalAn = 0;
      let interetsAn = 0;
      for (let m = 0; m < 12; m++) {
        const interet = restant * r;
        const capitalM = mensualite - interet;
        capitalAn += capitalM;
        interetsAn += interet;
        restant -= capitalM;
      }
      annualSummary.push({
        year: y,
        capital: capitalAn,
        interets: interetsAn,
        restant: Math.max(0, restant),
      });
    }

    return { mensualite, coutTotal, interetsTotal, emprunt: c, annualSummary };
  }, [prix, taux, duree, apport]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>pret auto</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Simulez votre credit automobile : mensualites, cout total et tableau d&apos;amortissement complet.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parametres du credit</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix du vehicule (&euro;)</label>
                  <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Apport personnel (&euro;)</label>
                  <input type="number" value={apport} onChange={(e) => setApport(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux d&apos;interet (%)</label>
                  <input type="number" step="0.1" value={taux} onChange={(e) => setTaux(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Duree (annees)</label>
                  <select value={duree} onChange={(e) => setDuree(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((y) => (
                      <option key={y} value={y}>{y} an{y > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Mensualite</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.mensualite)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Cout total des interets</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.interetsTotal)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant emprunte</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.emprunt)} &euro;</p>
                  </div>
                </div>

                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Tableau d&apos;amortissement</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>
                          <th className="pb-2 pr-4 text-left text-xs font-semibold uppercase tracking-wider">Annee</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Capital rembourse</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Interets payes</th>
                          <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider">Capital restant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.annualSummary.map((row) => (
                          <tr key={row.year} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td className="py-3 pr-4 font-semibold">{row.year}</td>
                            <td className="py-3 pr-4 text-right">{fmt(row.capital)} &euro;</td>
                            <td className="py-3 pr-4 text-right" style={{ color: "var(--muted)" }}>{fmt(row.interets)} &euro;</td>
                            <td className="py-3 text-right font-semibold">{fmt(row.restant)} &euro;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Visual bar */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Repartition du cout</h2>
                  <div className="mt-4 flex h-6 overflow-hidden rounded-full">
                    <div style={{ width: `${(result.emprunt / result.coutTotal) * 100}%`, background: "var(--primary)" }} />
                    <div style={{ width: `${(result.interetsTotal / result.coutTotal) * 100}%`, background: "var(--accent)" }} />
                  </div>
                  <div className="mt-3 flex justify-between text-xs font-semibold">
                    <span style={{ color: "var(--primary)" }}>Capital : {fmt(result.emprunt)} &euro;</span>
                    <span style={{ color: "var(--accent)" }}>Interets : {fmt(result.interetsTotal)} &euro;</span>
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment fonctionne un credit auto ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Le credit automobile permet de financer l&apos;achat d&apos;un vehicule neuf ou d&apos;occasion. La mensualite se calcule avec la formule : <strong className="text-[var(--foreground)]">M = C x r / (1 - (1+r)^-n)</strong> ou C est le capital emprunte, r le taux mensuel et n le nombre de mensualites.</p>
                <p><strong className="text-[var(--foreground)]">Duree typique</strong> : Un credit auto dure generalement entre 1 et 7 ans, contre 15 a 25 ans pour un pret immobilier.</p>
                <p><strong className="text-[var(--foreground)]">Taux</strong> : Les taux de credit auto sont souvent plus eleves que les taux immobiliers, en moyenne entre 4% et 8% selon le profil et le type de vehicule.</p>
                <p><strong className="text-[var(--foreground)]">Apport</strong> : Un apport personnel de 10 a 30% du prix du vehicule est recommande pour obtenir de meilleures conditions.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conseils credit auto</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Comparez les offres de plusieurs banques et concessionnaires</li>
                <li>Privilegiez une duree courte pour limiter le cout total</li>
                <li>Un apport de 20% ameliore votre dossier</li>
                <li>Verifiez les frais de dossier et l&apos;assurance</li>
                <li>Le taux d&apos;endettement ne doit pas depasser 35%</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
