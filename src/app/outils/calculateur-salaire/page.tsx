"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const RATES: Record<string, { label: string; rate: number }> = {
  "non-cadre": { label: "Non-cadre (prive)", rate: 0.22 },
  cadre: { label: "Cadre (prive)", rate: 0.25 },
  public: { label: "Fonction publique", rate: 0.17 },
};

const TAX_BRACKETS = [
  { min: 0, max: 11294, rate: 0 },
  { min: 11295, max: 28797, rate: 0.11 },
  { min: 28798, max: 82341, rate: 0.3 },
  { min: 82342, max: 177106, rate: 0.41 },
  { min: 177107, max: Infinity, rate: 0.45 },
];

function calcTax(annualNet: number) {
  let tax = 0;
  for (const b of TAX_BRACKETS) {
    if (annualNet <= b.min) break;
    const taxable = Math.min(annualNet, b.max) - b.min;
    tax += taxable * b.rate;
  }
  return tax;
}

export default function CalculateurSalaire() {
  const [amount, setAmount] = useState<string>("3000");
  const [mode, setMode] = useState<"brut-to-net" | "net-to-brut">("brut-to-net");
  const [status, setStatus] = useState<string>("non-cadre");
  const [parts, setParts] = useState<string>("1");

  const val = parseFloat(amount) || 0;
  const rate = RATES[status]?.rate ?? 0.22;

  let brut: number, net: number;
  if (mode === "brut-to-net") {
    brut = val;
    net = val * (1 - rate);
  } else {
    net = val;
    brut = val / (1 - rate);
  }

  const annualNet = net * 12;
  const nbParts = parseFloat(parts) || 1;
  const annualTax = calcTax(annualNet / nbParts) * nbParts;
  const monthlyTax = annualTax / 12;
  const netApresImpot = net - monthlyTax;
  const charges = brut - net;

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Finance
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Calculateur salaire <span style={{ color: "var(--primary)" }}>net / brut</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez instantanement votre salaire brut en net et inversement.
            Estimation de l&apos;impot sur le revenu incluse.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <div className="animate-scale-in rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                <button
                  onClick={() => setMode("brut-to-net")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: mode === "brut-to-net" ? "var(--primary)" : "transparent",
                    color: mode === "brut-to-net" ? "white" : "var(--muted)",
                  }}
                >
                  Brut &rarr; Net
                </button>
                <button
                  onClick={() => setMode("net-to-brut")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: mode === "net-to-brut" ? "var(--primary)" : "transparent",
                    color: mode === "net-to-brut" ? "white" : "var(--muted)",
                  }}
                >
                  Net &rarr; Brut
                </button>
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Salaire {mode === "brut-to-net" ? "brut" : "net"} mensuel
                </label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    placeholder="3000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>&euro;</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Statut</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {Object.entries(RATES).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Parts fiscales</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={parts}
                    onChange={(e) => setParts(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="animate-scale-in stagger-2 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Resultats
              </h2>
              <div className="mt-5 space-y-1">
                <Row label="Salaire brut mensuel" value={`${fmt(brut)} €`} />
                <Row label="Cotisations salariales" value={`- ${fmt(charges)} €`} sub />
                <Row label="Salaire net avant impot" value={`${fmt(net)} €`} highlight />
                <Row label="Impot sur le revenu (estimation)" value={`- ${fmt(monthlyTax)} €`} sub />
                <Row label="Salaire net apres impot" value={`${fmt(netApresImpot)} €`} highlight primary />
              </div>

              <div className="mt-6 rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Recapitulatif annuel
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                  <span style={{ color: "var(--muted)" }}>Brut annuel</span>
                  <span className="text-right font-semibold">{fmt(brut * 12)} &euro;</span>
                  <span style={{ color: "var(--muted)" }}>Net annuel avant impot</span>
                  <span className="text-right font-semibold">{fmt(net * 12)} &euro;</span>
                  <span style={{ color: "var(--muted)" }}>Impot annuel (estimation)</span>
                  <span className="text-right font-semibold">{fmt(annualTax)} &euro;</span>
                  <span style={{ color: "var(--muted)" }}>Net annuel apres impot</span>
                  <span className="text-right text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(netApresImpot * 12)} &euro;
                  </span>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment calculer son salaire net ?
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Pour convertir un salaire brut en net, il faut deduire les cotisations salariales.
                  Le taux varie selon votre statut :
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Non-cadre</strong> : ~22% de charges (coefficient 0.78)</li>
                  <li><strong className="text-[var(--foreground)]">Cadre</strong> : ~25% de charges (coefficient 0.75)</li>
                  <li><strong className="text-[var(--foreground)]">Fonction publique</strong> : ~17% de charges (coefficient 0.83)</li>
                </ul>
                <p>
                  <strong className="text-[var(--foreground)]">Formule</strong> : Salaire net = Salaire brut x (1 - taux de cotisations).
                  Exemple : 3 000 &euro; brut non-cadre = 2 340 &euro; net avant impot.
                </p>
                <p>
                  Depuis 2019, l&apos;impot sur le revenu est preleve directement sur le salaire
                  via le prelevement a la source. Notre calculateur estime ce montant en fonction
                  des tranches d&apos;imposition et de vos parts fiscales.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>A propos</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Ce calculateur utilise les taux moyens de cotisations salariales en France.
                Les resultats sont des estimations. Consultez votre bulletin de paie pour un calcul precis.
              </p>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function Row({
  label,
  value,
  highlight,
  primary,
  sub,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  primary?: boolean;
  sub?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-4 py-3 ${highlight ? "" : ""}`}
      style={highlight ? { background: "var(--surface-alt)" } : {}}
    >
      <span className="text-sm" style={{ color: sub ? "var(--border)" : "var(--muted)" }}>
        {label}
      </span>
      <span
        className={`font-semibold ${primary ? "text-xl" : sub ? "text-sm" : ""}`}
        style={{
          color: primary ? "var(--primary)" : sub ? "var(--muted)" : "var(--foreground)",
          fontFamily: primary ? "var(--font-display)" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}
