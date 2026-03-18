"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function CalculateurPourcentage() {
  const [pct, setPct] = useState("20");
  const [of, setOf] = useState("150");
  const [valA, setValA] = useState("80");
  const [valB, setValB] = useState("100");
  const [part, setPart] = useState("25");
  const [total, setTotal] = useState("200");

  const fmt = (n: number) => isFinite(n) ? n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—";

  const result1 = (parseFloat(pct) || 0) / 100 * (parseFloat(of) || 0);
  const result2 = ((parseFloat(valB) || 0) - (parseFloat(valA) || 0)) / (parseFloat(valA) || 1) * 100;
  const result3 = (parseFloat(part) || 0) / (parseFloat(total) || 1) * 100;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Mathematiques</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>pourcentage</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Trois modes de calcul pour tous vos besoins en pourcentages.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode 1: X% of Y */}
            <CalcBlock title="Combien fait X% de Y ?">
              <div className="flex items-center gap-3">
                <input type="number" value={pct} onChange={(e) => setPct(e.target.value)}
                  className="w-24 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span style={{ color: "var(--muted)" }}>% de</span>
                <input type="number" value={of} onChange={(e) => setOf(e.target.value)}
                  className="w-32 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span style={{ color: "var(--muted)" }}>=</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result1)}</span>
              </div>
            </CalcBlock>

            {/* Mode 2: Variation */}
            <CalcBlock title="Variation en pourcentage">
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: "var(--muted)" }}>De</span>
                <input type="number" value={valA} onChange={(e) => setValA(e.target.value)}
                  className="w-28 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span className="text-sm" style={{ color: "var(--muted)" }}>a</span>
                <input type="number" value={valB} onChange={(e) => setValB(e.target.value)}
                  className="w-28 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span style={{ color: "var(--muted)" }}>=</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: result2 >= 0 ? "var(--primary)" : "#dc2626" }}>
                  {result2 >= 0 ? "+" : ""}{fmt(result2)}%
                </span>
              </div>
            </CalcBlock>

            {/* Mode 3: Part of total */}
            <CalcBlock title="Quel pourcentage represente X sur Y ?">
              <div className="flex items-center gap-3">
                <input type="number" value={part} onChange={(e) => setPart(e.target.value)}
                  className="w-28 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span className="text-sm" style={{ color: "var(--muted)" }}>sur</span>
                <input type="number" value={total} onChange={(e) => setTotal(e.target.value)}
                  className="w-28 rounded-xl border px-3 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                <span style={{ color: "var(--muted)" }}>=</span>
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result3)}%</span>
              </div>
            </CalcBlock>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment calculer un pourcentage ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">X% de Y</strong> : Multipliez Y par X/100. Exemple : 20% de 150 = 150 x 0.20 = 30</p>
                <p><strong className="text-[var(--foreground)]">Variation</strong> : ((Nouvelle valeur - Ancienne) / Ancienne) x 100</p>
                <p><strong className="text-[var(--foreground)]">Part</strong> : (Partie / Total) x 100</p>
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

function CalcBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
