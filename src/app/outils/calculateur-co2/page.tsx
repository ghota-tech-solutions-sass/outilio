"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const TRANSPORT = [
  { id: "voiture", label: "Voiture", icon: "\u{1F697}", unit: "km", factor: 0.193 },
  { id: "avion", label: "Avion", icon: "\u{2708}\uFE0F", unit: "km", factor: 0.255 },
  { id: "train", label: "Train", icon: "\u{1F686}", unit: "km", factor: 0.006 },
  { id: "bus", label: "Bus", icon: "\u{1F68C}", unit: "km", factor: 0.089 },
];

const ENERGY = [
  { id: "electricite", label: "Electricite", icon: "\u{26A1}", unit: "kWh/an", factor: 0.052 },
  { id: "gaz", label: "Gaz naturel", icon: "\u{1F525}", unit: "kWh/an", factor: 0.227 },
  { id: "fioul", label: "Fioul", icon: "\u{1F6E2}\uFE0F", unit: "litres/an", factor: 3.25 },
];

const EQUIVALENCES = [
  { label: "arbres necessaires pour absorber (par an)", divisor: 25 },
  { label: "allers-retours Paris-Marseille en TGV", divisor: 4.7 },
  { label: "km en voiture electrique", divisor: 0.02 },
];

export default function CalculateurCO2() {
  const [values, setValues] = useState<Record<string, string>>({});

  const set = (id: string, v: string) => setValues((prev) => ({ ...prev, [id]: v }));

  const transportTotal = TRANSPORT.reduce((s, t) => s + (parseFloat(values[t.id] || "0") || 0) * t.factor, 0);
  const energyTotal = ENERGY.reduce((s, e) => s + (parseFloat(values[e.id] || "0") || 0) * e.factor, 0);
  const total = transportTotal + energyTotal;

  const fmt = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

  const pct = (v: number) => (total > 0 ? (v / total) * 100 : 0);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Environnement</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Empreinte CO2</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez vos emissions de CO2 liees aux transports et a l&apos;energie domestique. Valeurs moyennes en France.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Transport */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Transports (par an)</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {TRANSPORT.map((t) => (
                  <div key={t.id}>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <span>{t.icon}</span> {t.label} <span className="text-xs" style={{ color: "var(--muted)" }}>({t.unit})</span>
                    </label>
                    <input type="number" min="0" placeholder="0" value={values[t.id] || ""} onChange={(e) => set(t.id, e.target.value)}
                      className="mt-1 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Energie domestique (par an)</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {ENERGY.map((e) => (
                  <div key={e.id}>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <span>{e.icon}</span> {e.label}
                    </label>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>({e.unit})</span>
                    <input type="number" min="0" placeholder="0" value={values[e.id] || ""} onChange={(ev) => set(e.id, ev.target.value)}
                      className="mt-1 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Emissions totales estimees</p>
              <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: total > 5000 ? "#dc2626" : total > 2000 ? "#f59e0b" : "var(--primary)" }}>
                {fmt(total / 1000)}
              </p>
              <p className="mt-1 text-lg font-semibold" style={{ color: "var(--muted)" }}>tonnes CO2 / an</p>

              {total > 0 && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-right text-xs font-medium">Transports</span>
                    <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct(transportTotal)}%`, background: "var(--primary)" }} />
                    </div>
                    <span className="w-20 text-xs font-bold">{fmt(transportTotal)} kg</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-right text-xs font-medium">Energie</span>
                    <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct(energyTotal)}%`, background: "var(--accent)" }} />
                    </div>
                    <span className="w-20 text-xs font-bold">{fmt(energyTotal)} kg</span>
                  </div>
                </div>
              )}
            </div>

            {/* Equivalences */}
            {total > 0 && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Equivalences</h2>
                <div className="mt-4 space-y-3">
                  {EQUIVALENCES.map((eq) => (
                    <div key={eq.label} className="flex items-center gap-3">
                      <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                        {fmt(total / eq.divisor)}
                      </span>
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{eq.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A propos de l&apos;empreinte carbone</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>L&apos;empreinte carbone mesure la quantite de gaz a effet de serre emise par une activite. En France, la moyenne est d&apos;environ 9 tonnes de CO2 par personne et par an.</p>
                <p>Les facteurs d&apos;emission utilises sont des moyennes issues de la Base Carbone de l&apos;ADEME. Les resultats sont indicatifs et ne remplacent pas un bilan carbone complet.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur d&apos;empreinte CO2
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce calculateur vous permet d&apos;estimer vos emissions annuelles de dioxyde de carbone liees a vos deplacements et a votre consommation d&apos;energie domestique. Les facteurs d&apos;emission utilises proviennent de la Base Carbone de l&apos;ADEME, reference officielle en France.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Renseignez vos transports</strong> : indiquez les kilometres parcourus par an en voiture, avion, train et bus.</li>
                  <li><strong className="text-[var(--foreground)]">Ajoutez votre energie domestique</strong> : consommation annuelle d&apos;electricite (kWh), de gaz naturel (kWh) et de fioul (litres).</li>
                  <li><strong className="text-[var(--foreground)]">Consultez vos resultats</strong> : total en tonnes de CO2 par an, repartition transports/energie et equivalences parlantes (arbres, trajets TGV).</li>
                </ul>
                <p>L&apos;objectif de l&apos;Accord de Paris est de limiter l&apos;empreinte carbone individuelle a environ 2 tonnes de CO2 par an d&apos;ici 2050. La moyenne francaise actuelle est d&apos;environ 9 tonnes, dont pres de la moitie provient des transports et du logement.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est l&apos;empreinte carbone moyenne d&apos;un Francais ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>En France, l&apos;empreinte carbone moyenne est d&apos;environ 9 tonnes de CO2 equivalent par personne et par an. Ce chiffre inclut les emissions directes (transports, chauffage) et indirectes (alimentation, biens de consommation, services publics). L&apos;objectif pour respecter l&apos;Accord de Paris est de descendre a 2 tonnes par personne d&apos;ici 2050.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi l&apos;electricite francaise emet-elle peu de CO2 ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>L&apos;electricite en France est principalement produite par le nucleaire (environ 70%) et les energies renouvelables (hydraulique, eolien, solaire). Son facteur d&apos;emission est d&apos;environ 52 g CO2/kWh, soit 4 a 10 fois moins que dans les pays qui dependent du charbon ou du gaz pour leur production electrique.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment reduire efficacement son empreinte carbone ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Les leviers les plus efficaces sont : reduire les trajets en avion (un aller-retour Paris-New York = ~1,8 tonne de CO2), privilegier le train a la voiture, isoler son logement pour diminuer le chauffage, et passer a une pompe a chaleur ou un chauffage bois. Au quotidien, le covoiturage, le velo et la reduction de la consommation de viande rouge ont aussi un impact significatif.</p>
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
