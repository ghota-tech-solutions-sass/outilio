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
