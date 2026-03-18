"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const BASES = [
  { id: "dec", label: "Decimal", base: 10, prefix: "", placeholder: "42" },
  { id: "bin", label: "Binaire", base: 2, prefix: "0b", placeholder: "101010" },
  { id: "oct", label: "Octal", base: 8, prefix: "0o", placeholder: "52" },
  { id: "hex", label: "Hexadecimal", base: 16, prefix: "0x", placeholder: "2A" },
];

function isValidForBase(value: string, base: number): boolean {
  if (!value) return true;
  const chars = "0123456789abcdef".slice(0, base);
  return value.toLowerCase().split("").every((c) => chars.includes(c));
}

export default function ConvertisseurNumeration() {
  const [source, setSource] = useState("dec");
  const [input, setInput] = useState("42");

  const sourceBase = BASES.find((b) => b.id === source)!;
  const isValid = isValidForBase(input, sourceBase.base);
  const decimalValue = isValid && input ? parseInt(input, sourceBase.base) : NaN;

  const results = BASES.map((b) => ({
    ...b,
    value: isNaN(decimalValue) ? "" : decimalValue.toString(b.base).toUpperCase(),
  }));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const BIT_TABLE = !isNaN(decimalValue) && decimalValue >= 0 && decimalValue <= 255;
  const bits = BIT_TABLE ? decimalValue.toString(2).padStart(8, "0").split("") : [];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Developpement</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur <span style={{ color: "var(--primary)" }}>Numeration</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez instantanement entre decimal, binaire, octal et hexadecimal.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex gap-2 mb-4">
                {BASES.map((b) => (
                  <button key={b.id} onClick={() => { setSource(b.id); setInput(""); }}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                    style={{ borderColor: source === b.id ? "var(--primary)" : "var(--border)", background: source === b.id ? "rgba(13,79,60,0.05)" : "transparent", color: source === b.id ? "var(--primary)" : "var(--muted)" }}>
                    {b.label}
                  </button>
                ))}
              </div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Valeur en {sourceBase.label} {sourceBase.prefix && <span className="font-mono">({sourceBase.prefix})</span>}
              </label>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={sourceBase.placeholder}
                className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold font-mono" style={{ borderColor: isValid ? "var(--border)" : "#dc2626", fontFamily: "var(--font-display)" }} />
              {!isValid && <p className="mt-1 text-xs text-red-500">Caractere invalide pour la base {sourceBase.base}</p>}
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {results.map((r) => (
                <div key={r.id} className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: r.id === source ? "var(--primary)" : "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: r.id === source ? "var(--primary)" : "var(--accent)" }}>{r.label}</p>
                    {r.value && (
                      <button onClick={() => handleCopy(r.value)} className="text-xs font-medium px-2 py-1 rounded" style={{ color: "var(--primary)" }}>
                        Copier
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-3xl font-bold font-mono break-all" style={{ fontFamily: "var(--font-display)", color: r.id === source ? "var(--primary)" : "var(--foreground)" }}>
                    {r.prefix && r.value && <span style={{ color: "var(--muted)" }}>{r.prefix}</span>}
                    {r.value || "\u2014"}
                  </p>
                </div>
              ))}
            </div>

            {/* Bit table */}
            {BIT_TABLE && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Representation binaire (8 bits)</h2>
                <div className="mt-4 flex gap-1 justify-center">
                  {bits.map((bit, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>2{"\u{207B}" + "\u{2070}\u{00B9}\u{00B2}\u{00B3}\u{2074}\u{2075}\u{2076}\u{2077}"[7 - i]}</span>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                        style={{ background: bit === "1" ? "var(--primary)" : "var(--surface-alt)", color: bit === "1" ? "#fff" : "var(--muted)" }}>
                        {bit}
                      </div>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>{Math.pow(2, 7 - i)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Les bases de numeration</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Decimal (base 10)</strong> : le systeme que nous utilisons au quotidien avec les chiffres 0-9.</p>
                <p><strong className="text-[var(--foreground)]">Binaire (base 2)</strong> : utilise en informatique, uniquement les chiffres 0 et 1.</p>
                <p><strong className="text-[var(--foreground)]">Octal (base 8)</strong> : utilise les chiffres 0-7, courant dans les permissions Unix.</p>
                <p><strong className="text-[var(--foreground)]">Hexadecimal (base 16)</strong> : chiffres 0-9 et lettres A-F, utilise pour les couleurs CSS et les adresses memoire.</p>
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
