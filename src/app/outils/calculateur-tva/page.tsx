"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const TVA_RATES = [
  { value: "20", label: "20% - Taux normal" },
  { value: "10", label: "10% - Taux intermediaire" },
  { value: "5.5", label: "5,5% - Taux reduit" },
  { value: "2.1", label: "2,1% - Taux super-reduit" },
];

export default function CalculateurTVA() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("20");
  const [mode, setMode] = useState<"ht-to-ttc" | "ttc-to-ht">("ht-to-ttc");

  const val = parseFloat(amount) || 0;
  const r = (parseFloat(rate) || 20) / 100;

  let ht: number, ttc: number, tva: number;
  if (mode === "ht-to-ttc") {
    ht = val;
    tva = val * r;
    ttc = val + tva;
  } else {
    ttc = val;
    ht = val / (1 + r);
    tva = ttc - ht;
  }

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>TVA</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez HT en TTC et inversement. Tous les taux de TVA francais disponibles.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                <button
                  onClick={() => setMode("ht-to-ttc")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{ background: mode === "ht-to-ttc" ? "var(--primary)" : "transparent", color: mode === "ht-to-ttc" ? "white" : "var(--muted)" }}
                >
                  HT &rarr; TTC
                </button>
                <button
                  onClick={() => setMode("ttc-to-ht")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{ background: mode === "ttc-to-ht" ? "var(--primary)" : "transparent", color: mode === "ttc-to-ht" ? "white" : "var(--muted)" }}
                >
                  TTC &rarr; HT
                </button>
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Montant {mode === "ht-to-ttc" ? "HT" : "TTC"}
                </label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>&euro;</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux de TVA</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {TVA_RATES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setRate(t.value)}
                      className="rounded-xl border px-3 py-2.5 text-sm font-medium transition-all"
                      style={{
                        borderColor: rate === t.value ? "var(--primary)" : "var(--border)",
                        background: rate === t.value ? "var(--primary)" : "var(--surface)",
                        color: rate === t.value ? "white" : "var(--foreground)",
                      }}
                    >
                      {t.value}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-4">
              <ResultCard label="Montant HT" value={`${fmt(ht)} €`} />
              <ResultCard label="TVA ({rate}%)" value={`${fmt(tva)} €`} accent />
              <ResultCard label="Montant TTC" value={`${fmt(ttc)} €`} primary />
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment calculer la TVA ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">HT vers TTC</strong> : Montant TTC = Montant HT x (1 + taux TVA)</p>
                <p><strong className="text-[var(--foreground)]">TTC vers HT</strong> : Montant HT = Montant TTC / (1 + taux TVA)</p>
                <p>Les taux de TVA en France :</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">20%</strong> : taux normal (la plupart des biens et services)</li>
                  <li><strong className="text-[var(--foreground)]">10%</strong> : restauration, transports, travaux de renovation</li>
                  <li><strong className="text-[var(--foreground)]">5,5%</strong> : alimentation, livres, spectacles</li>
                  <li><strong className="text-[var(--foreground)]">2,1%</strong> : medicaments rembourses, presse</li>
                </ul>
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

function ResultCard({ label, value, primary, accent }: { label: string; value: string; primary?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
      <p
        className="mt-2 text-xl font-bold"
        style={{ fontFamily: "var(--font-display)", color: primary ? "var(--primary)" : accent ? "var(--accent)" : "var(--foreground)" }}
      >
        {value}
      </p>
    </div>
  );
}
