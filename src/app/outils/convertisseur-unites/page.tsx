"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type Category = "length" | "weight" | "temperature" | "surface" | "volume";

interface UnitDef {
  label: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: "length", label: "Longueur", icon: "📏" },
  { key: "weight", label: "Poids", icon: "⚖️" },
  { key: "temperature", label: "Temperature", icon: "🌡️" },
  { key: "surface", label: "Surface", icon: "📐" },
  { key: "volume", label: "Volume", icon: "🧪" },
];

const UNITS: Record<Category, UnitDef[]> = {
  length: [
    { label: "Millimetre", symbol: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Centimetre", symbol: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "Metre", symbol: "m", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilometre", symbol: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Pouce", symbol: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { label: "Pied", symbol: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: "Yard", symbol: "yd", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { label: "Mile", symbol: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  ],
  weight: [
    { label: "Milligramme", symbol: "mg", toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
    { label: "Gramme", symbol: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Kilogramme", symbol: "kg", toBase: (v) => v, fromBase: (v) => v },
    { label: "Tonne", symbol: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Once", symbol: "oz", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { label: "Livre", symbol: "lb", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
  ],
  temperature: [
    { label: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
    { label: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { label: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  surface: [
    { label: "Centimetre carre", symbol: "cm²", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { label: "Metre carre", symbol: "m²", toBase: (v) => v, fromBase: (v) => v },
    { label: "Are", symbol: "a", toBase: (v) => v * 100, fromBase: (v) => v / 100 },
    { label: "Hectare", symbol: "ha", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { label: "Kilometre carre", symbol: "km²", toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
    { label: "Pied carre", symbol: "ft²", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { label: "Acre", symbol: "ac", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
  ],
  volume: [
    { label: "Millilitre", symbol: "mL", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Centilitre", symbol: "cL", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "Litre", symbol: "L", toBase: (v) => v, fromBase: (v) => v },
    { label: "Metre cube", symbol: "m³", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Gallon US", symbol: "gal", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { label: "Pinte US", symbol: "pt", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    { label: "Tasse", symbol: "cup", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
  ],
};

export default function ConvertisseurUnites() {
  const [category, setCategory] = useState<Category>("length");
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(2); // default to "metre" or 3rd unit
  const [value, setValue] = useState("1");

  const units = UNITS[category];

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setFromUnit(0);
    setToUnit(cat === "temperature" ? 1 : 2);
    setValue("1");
  };

  const result = useMemo(() => {
    const v = parseFloat(value) || 0;
    const from = units[fromUnit];
    const to = units[toUnit];
    if (!from || !to) return 0;
    const baseValue = from.toBase(v);
    return to.fromBase(baseValue);
  }, [value, fromUnit, toUnit, units]);

  const allConversions = useMemo(() => {
    const v = parseFloat(value) || 0;
    const from = units[fromUnit];
    if (!from) return [];
    const baseValue = from.toBase(v);
    return units.map((u, i) => ({
      ...u,
      value: u.fromBase(baseValue),
      isSource: i === fromUnit,
    }));
  }, [value, fromUnit, units]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setValue(formatNumber(result));
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Conversion</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur d{"'"}<span style={{ color: "var(--primary)" }}>unites</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Longueur, poids, temperature, surface et volume — conversion instantanee entre toutes les unites courantes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Category selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Type de mesure</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => handleCategoryChange(cat.key)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{
                      background: category === cat.key ? "var(--primary)" : "var(--surface-alt)",
                      color: category === cat.key ? "white" : "var(--muted)",
                    }}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Converter */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Conversion</h2>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>De</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(parseInt(e.target.value))}
                      className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }}>
                      {units.map((u, i) => (
                        <option key={i} value={i}>{u.label} ({u.symbol})</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={swap} className="mb-0.5 rounded-xl p-2.5 transition-all hover:bg-[var(--surface-alt)]" title="Inverser">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 16l-4-4 4-4" /><path d="M17 8l4 4-4 4" /><path d="M3 12h18" />
                    </svg>
                  </button>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Vers</label>
                    <select value={toUnit} onChange={(e) => setToUnit(parseInt(e.target.value))}
                      className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }}>
                      {units.map((u, i) => (
                        <option key={i} value={i}>{u.label} ({u.symbol})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
                    className="rounded-xl border px-4 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  <span className="text-lg font-bold" style={{ color: "var(--muted)" }}>=</span>
                  <div className="rounded-xl px-4 py-3 text-center text-lg font-bold" style={{ background: "var(--surface-alt)", fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {formatNumber(result)} {units[toUnit]?.symbol}
                  </div>
                </div>
              </div>
            </div>

            {/* All conversions */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Toutes les conversions</h2>
              <div className="mt-4 space-y-2">
                {allConversions.map((conv) => (
                  <div key={conv.symbol}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: conv.isSource ? "var(--primary)" : "var(--surface-alt)", color: conv.isSource ? "white" : undefined }}>
                    <span className="text-sm font-semibold">{conv.label}</span>
                    <span className="font-mono text-sm font-bold">
                      {formatNumber(conv.value)} {conv.symbol}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Systeme metrique et systeme imperial</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Systeme metrique</strong> : Utilise dans la majorite des pays, base sur les multiples de 10. Unites de base : metre (longueur), kilogramme (masse), litre (volume).</p>
                <p><strong className="text-[var(--foreground)]">Systeme imperial</strong> : Utilise principalement aux Etats-Unis et au Royaume-Uni. Unites : pouce, pied, mile (longueur), once, livre (masse), gallon (volume).</p>
                <p><strong className="text-[var(--foreground)]">Temperature</strong> : Celsius (point de congelation 0°, ebullition 100°), Fahrenheit (32° et 212°), Kelvin (echelle absolue, 0 K = -273,15°C).</p>
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

function formatNumber(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(4);
  if (Math.abs(n) >= 1_000_000) return n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 6 });
}
