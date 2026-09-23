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
  { key: "temperature", label: "Température", icon: "🌡️" },
  { key: "surface", label: "Surface", icon: "📐" },
  { key: "volume", label: "Volume", icon: "🧪" },
];

const UNITS: Record<Category, UnitDef[]> = {
  length: [
    { label: "Millimètre", symbol: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Centimètre", symbol: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "Mètre", symbol: "m", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilomètre", symbol: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Pouce", symbol: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { label: "Pied", symbol: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: "Yard", symbol: "yd", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { label: "Mile", symbol: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { label: "Mille marin", symbol: "NM", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  ],
  weight: [
    { label: "Milligramme", symbol: "mg", toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
    { label: "Gramme", symbol: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Kilogramme", symbol: "kg", toBase: (v) => v, fromBase: (v) => v },
    { label: "Tonne", symbol: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    // Facteurs exacts (accord international de 1959) : 1 lb = 0,45359237 kg, 1 oz = 1/16 lb
    { label: "Once", symbol: "oz", toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
    { label: "Livre", symbol: "lb", toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
    { label: "Stone", symbol: "st", toBase: (v) => v * 6.35029318, fromBase: (v) => v / 6.35029318 },
  ],
  temperature: [
    { label: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
    { label: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { label: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  surface: [
    { label: "Centimètre carré", symbol: "cm²", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { label: "Mètre carré", symbol: "m²", toBase: (v) => v, fromBase: (v) => v },
    { label: "Are", symbol: "a", toBase: (v) => v * 100, fromBase: (v) => v / 100 },
    { label: "Hectare", symbol: "ha", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { label: "Kilomètre carré", symbol: "km²", toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
    { label: "Pied carré", symbol: "ft²", toBase: (v) => v * 0.09290304, fromBase: (v) => v / 0.09290304 },
    { label: "Acre", symbol: "ac", toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
  ],
  volume: [
    { label: "Millilitre", symbol: "mL", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Centilitre", symbol: "cL", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "Litre", symbol: "L", toBase: (v) => v, fromBase: (v) => v },
    { label: "Mètre cube", symbol: "m³", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    // Gallon US = 231 pouces cubes = 3,785411784 L ; gallon impérial (UK) = 4,54609 L exactement
    { label: "Gallon US", symbol: "gal US", toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 },
    { label: "Gallon impérial (UK)", symbol: "gal UK", toBase: (v) => v * 4.54609, fromBase: (v) => v / 4.54609 },
    { label: "Pinte US", symbol: "pt US", toBase: (v) => v * 0.473176473, fromBase: (v) => v / 0.473176473 },
    { label: "Pinte impériale (UK)", symbol: "pt UK", toBase: (v) => v * 0.56826125, fromBase: (v) => v / 0.56826125 },
    { label: "Tasse US", symbol: "cup", toBase: (v) => v * 0.2365882365, fromBase: (v) => v / 0.2365882365 },
    { label: "Once liquide US", symbol: "fl oz US", toBase: (v) => v * 0.0295735295625, fromBase: (v) => v / 0.0295735295625 },
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
    // Valeur brute (point décimal) : un nombre formaté « 1 000,5 » serait refusé par le champ numérique
    setValue(Number.isFinite(result) ? String(parseFloat(result.toPrecision(12))) : "0");
  };

  const kelvinBelowZero =
    category === "temperature" && Number.isFinite(parseFloat(value)) && units[fromUnit].toBase(parseFloat(value)) < -273.15 - 1e-9;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Conversion</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur d{"'"}<span style={{ color: "var(--primary)" }}>unités</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Longueur, poids, température, surface et volume : conversion instantanée entre les unités courantes, métriques, impériales et américaines.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
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
                {kelvinBelowZero && (
                  <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>
                    Valeur impossible : aucune température ne peut être inférieure au zéro absolu (0 K = −273,15 °C).
                  </p>
                )}
              </div>
            </div>

            {/* All conversions */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Toutes les conversions</h2>
              <div className="mt-4 space-y-2">
                {allConversions.map((conv) => (
                  <div key={conv.label}
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
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Système métrique et systèmes impérial et américain</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Système métrique</strong> : utilisé dans la quasi-totalité des pays, fondé sur les multiples de 10. Unités usuelles : mètre (longueur), kilogramme (masse), litre (volume).</p>
                <p><strong className="text-[var(--foreground)]">Systèmes impérial et américain</strong> : pouce, pied, mile (longueur), once, livre (masse), gallon, pinte (volume). Longueurs et masses sont identiques des deux côtés de l&apos;Atlantique depuis 1959 (1 pouce = 2,54 cm, 1 livre = 0,45359237 kg), mais pas les volumes : le gallon américain vaut 3,785 L, le gallon impérial britannique 4,546 L.</p>
                <p><strong className="text-[var(--foreground)]">Température</strong> : Celsius (congélation de l&apos;eau à 0 °C, ébullition à 100 °C), Fahrenheit (32 °F et 212 °F), Kelvin (échelle absolue, 0 K = −273,15 °C).</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le convertisseur d&apos;unités
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Ce convertisseur d&apos;unités gratuit couvre 5 catégories de mesure : longueur, poids, température, surface et volume. Il convertit instantanément entre le système métrique et les unités impériales ou américaines, avec les facteurs de conversion exacts.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Sélectionnez la catégorie</strong> : choisissez parmi longueur, poids, température, surface ou volume.</li>
                  <li><strong className="text-[var(--foreground)]">Définissez les unités</strong> : sélectionnez l&apos;unité source et l&apos;unité cible dans les menus déroulants. Le bouton d&apos;inversion permet de changer le sens en un clic.</li>
                  <li><strong className="text-[var(--foreground)]">Saisissez la valeur</strong> : entrez le nombre à convertir. Le résultat s&apos;affiche en temps réel.</li>
                  <li><strong className="text-[var(--foreground)]">Consultez toutes les conversions</strong> : la section &laquo; Toutes les conversions &raquo; affiche simultanément l&apos;équivalent dans chaque unité de la catégorie sélectionnée.</li>
                </ul>
                <p>
                  L&apos;outil est particulièrement utile pour les achats internationaux, les recettes de cuisine anglo-saxonnes, les projets de bricolage ou les calculs scientifiques nécessitant des conversions entre système métrique et unités anglo-saxonnes. Attention aux volumes : vérifiez si une recette ou une fiche technique parle de gallons ou de pintes américains ou britanniques.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quels pays utilisent encore le système impérial ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Trois pays sont traditionnellement cités comme n&apos;ayant pas pleinement adopté le système métrique : les États-Unis, le Liberia et la Birmanie (Myanmar), cette dernière ayant engagé une transition. Le Royaume-Uni utilise un mélange des deux systèmes : les distances routières sont en miles, les poids corporels souvent en stones, mais la plupart des mesures scientifiques et commerciales sont en métrique. En France, le système métrique est obligatoire depuis le 1er janvier 1840.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment convertir facilement des livres en kilogrammes ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour une conversion rapide de tête, divisez le poids en livres (lb) par 2,2. Par exemple, 150 lb / 2,2 = environ 68 kg. Pour une valeur exacte, utilisez le facteur légal : 1 livre = 0,45359237 kg. Inversement, pour passer des kg aux lb, multipliez par 2,2 (plus précisément 2,20462). Cet outil effectue le calcul exact pour vous.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la différence entre un hectare et un acre ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un hectare (ha) vaut 10 000 m&sup2;, soit un carré de 100 m de côté. Un acre vaut environ 4 047 m&sup2;, soit environ 0,4 hectare. L&apos;hectare est l&apos;unité standard en France pour les surfaces agricoles et foncières. L&apos;acre est encore utilisé dans les pays anglo-saxons, notamment pour l&apos;immobilier aux États-Unis et au Royaume-Uni.
                  </p>
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

function formatNumber(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) < 0.0001 && n !== 0) return n.toExponential(4);
  if (Math.abs(n) >= 1_000_000) return n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 6 });
}
