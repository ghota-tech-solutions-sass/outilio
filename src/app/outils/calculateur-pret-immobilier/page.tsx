"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function CalculateurPret() {
  const [capital, setCapital] = useState("200000");
  const [taux, setTaux] = useState("3.5");
  const [duree, setDuree] = useState("20");
  const [apport, setApport] = useState("20000");
  const [tauxAssurance, setTauxAssurance] = useState("0.34");

  const result = useMemo(() => {
    const c = (parseFloat(capital) || 0) - (parseFloat(apport) || 0);
    const r = (parseFloat(taux) || 0) / 100 / 12;
    const n = (parseFloat(duree) || 1) * 12;
    if (c <= 0 || r <= 0 || n <= 0) return null;

    const mensualiteHorsAssurance = (c * r) / (1 - Math.pow(1 + r, -n));
    const assuranceMensuelle = (c * (parseFloat(tauxAssurance) || 0) / 100) / 12;
    const mensualite = mensualiteHorsAssurance + assuranceMensuelle;
    const coutTotal = mensualiteHorsAssurance * n;
    const interetsTotal = coutTotal - c;
    const coutAssuranceTotal = assuranceMensuelle * n;

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

    return { mensualite, mensualiteHorsAssurance, assuranceMensuelle, coutTotal, interetsTotal, coutAssuranceTotal, emprunt: c, annualSummary };
  }, [capital, taux, duree, apport, tauxAssurance]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, rgba(13,79,60,0.04), var(--surface))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1
            className="animate-fade-up text-3xl font-extrabold md:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
          >
            Simulateur de pret immobilier
          </h1>
          <p
            className="animate-fade-up stagger-1 mt-2"
            style={{ color: "var(--muted)" }}
          >
            Calculez vos mensualites, le cout total et visualisez le tableau d&apos;amortissement.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div
              className="animate-fade-up stagger-2 rounded-2xl border p-6 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Prix du bien (&euro;)" value={capital} onChange={setCapital} />
                <Field label="Apport personnel (&euro;)" value={apport} onChange={setApport} />
                <Field label="Taux d'interet (%)" value={taux} onChange={setTaux} step="0.1" />
                <Field label="Duree (annees)" value={duree} onChange={setDuree} />
                <Field label="Assurance emprunteur (%)" value={tauxAssurance} onChange={setTauxAssurance} step="0.01" />
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard label="Mensualite totale" value={`${fmt(result.mensualite)} \u20AC`} primary />
                  <StatCard label="Dont assurance" value={`${fmt(result.assuranceMensuelle)} \u20AC/mois`} />
                  <StatCard label="Cout total interets" value={`${fmt(result.interetsTotal)} \u20AC`} />
                  <StatCard label="Cout total assurance" value={`${fmt(result.coutAssuranceTotal)} \u20AC`} />
                </div>

                <div
                  className="rounded-2xl border p-6 shadow-sm"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Tableau d&apos;amortissement
                  </h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                          <th className="pb-2 pr-4">Annee</th>
                          <th className="pb-2 pr-4 text-right">Capital rembourse</th>
                          <th className="pb-2 pr-4 text-right">Interets payes</th>
                          <th className="pb-2 text-right">Capital restant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.annualSummary.map((row) => (
                          <tr key={row.year} className="border-b" style={{ borderColor: "var(--border)" }}>
                            <td className="py-2 pr-4 font-medium" style={{ color: "var(--foreground)" }}>{row.year}</td>
                            <td className="py-2 pr-4 text-right" style={{ color: "var(--foreground)" }}>{fmt(row.capital)} &euro;</td>
                            <td className="py-2 pr-4 text-right" style={{ color: "var(--muted)" }}>{fmt(row.interets)} &euro;</td>
                            <td className="py-2 text-right" style={{ color: "var(--foreground)" }}>{fmt(row.restant)} &euro;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <div
              className="prose max-w-none rounded-2xl border p-6 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>Comment calculer ses mensualites de pret immobilier ?</h2>
              <p style={{ color: "var(--foreground)" }}>
                La mensualite d&apos;un pret immobilier se calcule avec la formule suivante :
                <strong> M = C x r / (1 - (1+r)^-n)</strong> ou C est le capital emprunte,
                r le taux mensuel et n le nombre de mensualites.
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>Quel taux pour un pret immobilier en 2026 ?</h2>
              <p style={{ color: "var(--foreground)" }}>
                Les taux immobiliers varient selon la duree du pret et votre profil emprunteur.
                En 2026, les taux moyens oscillent entre 3% et 3,5% sur 20 ans.
                Utilisez notre simulateur pour estimer vos mensualites selon differents scenarios.
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div
              className="rounded-2xl border p-6 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Conseils</h3>
              <ul className="mt-2 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
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
      <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
}

function StatCard({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div
      className="rounded-2xl border p-5 text-center shadow-sm"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p className="text-sm" style={{ color: "var(--muted)" }}>{label}</p>
      <p
        className="mt-1 text-xl font-bold"
        style={{ color: primary ? "var(--primary)" : "var(--foreground)" }}
      >
        {value}
      </p>
    </div>
  );
}
