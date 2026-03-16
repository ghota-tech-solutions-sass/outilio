"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function CalculateurPret() {
  const [capital, setCapital] = useState("200000");
  const [taux, setTaux] = useState("3.5");
  const [duree, setDuree] = useState("20");
  const [apport, setApport] = useState("20000");

  const result = useMemo(() => {
    const c = (parseFloat(capital) || 0) - (parseFloat(apport) || 0);
    const r = (parseFloat(taux) || 0) / 100 / 12;
    const n = (parseFloat(duree) || 1) * 12;
    if (c <= 0 || r <= 0 || n <= 0) return null;

    const mensualite = (c * r) / (1 - Math.pow(1 + r, -n));
    const coutTotal = mensualite * n;
    const interetsTotal = coutTotal - c;

    // Tableau d'amortissement (premiers 12 mois + recapitulatif annuel)
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
  }, [capital, taux, duree, apport]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            Simulateur de pret immobilier
          </h1>
          <p className="mt-2 text-gray-600">
            Calculez vos mensualites, le cout total et visualisez le tableau d&apos;amortissement.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Prix du bien (€)" value={capital} onChange={setCapital} />
                <Field label="Apport personnel (€)" value={apport} onChange={setApport} />
                <Field label="Taux d'interet (%)" value={taux} onChange={setTaux} step="0.1" />
                <Field label="Duree (annees)" value={duree} onChange={setDuree} />
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard label="Mensualite" value={`${fmt(result.mensualite)} €`} primary />
                  <StatCard label="Cout total du credit" value={`${fmt(result.interetsTotal)} €`} />
                  <StatCard label="Montant emprunte" value={`${fmt(result.emprunt)} €`} />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900">Tableau d&apos;amortissement</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-gray-500">
                          <th className="pb-2 pr-4">Annee</th>
                          <th className="pb-2 pr-4 text-right">Capital rembourse</th>
                          <th className="pb-2 pr-4 text-right">Interets payes</th>
                          <th className="pb-2 text-right">Capital restant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.annualSummary.map((row) => (
                          <tr key={row.year} className="border-b border-gray-100">
                            <td className="py-2 pr-4 font-medium">{row.year}</td>
                            <td className="py-2 pr-4 text-right">{fmt(row.capital)} &euro;</td>
                            <td className="py-2 pr-4 text-right text-gray-500">{fmt(row.interets)} &euro;</td>
                            <td className="py-2 text-right">{fmt(row.restant)} &euro;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <div className="prose max-w-none rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2>Comment calculer ses mensualites de pret immobilier ?</h2>
              <p>
                La mensualite d&apos;un pret immobilier se calcule avec la formule suivante :
                <strong> M = C x r / (1 - (1+r)^-n)</strong> ou C est le capital emprunte,
                r le taux mensuel et n le nombre de mensualites.
              </p>
              <h2>Quel taux pour un pret immobilier en 2024 ?</h2>
              <p>
                Les taux immobiliers varient selon la duree du pret et votre profil emprunteur.
                En 2024, les taux moyens oscillent entre 3% et 4% sur 20 ans.
                Utilisez notre simulateur pour estimer vos mensualites selon differents scenarios.
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">Conseils</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-500">
                <li>Le taux d&apos;endettement ne doit pas depasser 35%</li>
                <li>Un apport de 10-20% ameliore votre dossier</li>
                <li>Comparez plusieurs banques avant de signer</li>
                <li>N&apos;oubliez pas l&apos;assurance emprunteur</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function StatCard({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${primary ? "text-[#2563eb]" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}
