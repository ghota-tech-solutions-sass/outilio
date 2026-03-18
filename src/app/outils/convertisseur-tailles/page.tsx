"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

/* ------------------------------------------------------------------ */
/*  DATA — Size conversion tables (standard industry charts)          */
/* ------------------------------------------------------------------ */

type Category = "clothing" | "shoes";
type Gender = "men" | "women";
type Region = "EU" | "US" | "UK" | "INT";

interface SizeRow {
  EU: string;
  US: string;
  UK: string;
  INT: string;
}

// --- MEN'S CLOTHING ---
const MEN_CLOTHING: SizeRow[] = [
  { EU: "44", US: "34", UK: "34", INT: "XS" },
  { EU: "46", US: "36", UK: "36", INT: "S" },
  { EU: "48", US: "38", UK: "38", INT: "M" },
  { EU: "50", US: "40", UK: "40", INT: "L" },
  { EU: "52", US: "42", UK: "42", INT: "XL" },
  { EU: "54", US: "44", UK: "44", INT: "XXL" },
  { EU: "56", US: "46", UK: "46", INT: "3XL" },
  { EU: "58", US: "48", UK: "48", INT: "4XL" },
];

// --- WOMEN'S CLOTHING ---
const WOMEN_CLOTHING: SizeRow[] = [
  { EU: "32", US: "0",  UK: "4",  INT: "XXS" },
  { EU: "34", US: "2",  UK: "6",  INT: "XS" },
  { EU: "36", US: "4",  UK: "8",  INT: "S" },
  { EU: "38", US: "6",  UK: "10", INT: "M" },
  { EU: "40", US: "8",  UK: "12", INT: "M/L" },
  { EU: "42", US: "10", UK: "14", INT: "L" },
  { EU: "44", US: "12", UK: "16", INT: "XL" },
  { EU: "46", US: "14", UK: "18", INT: "XXL" },
  { EU: "48", US: "16", UK: "20", INT: "3XL" },
  { EU: "50", US: "18", UK: "22", INT: "4XL" },
];

interface ShoeRow {
  EU: string;
  US: string;
  UK: string;
  CM: string;
}

// --- MEN'S SHOES ---
const MEN_SHOES: ShoeRow[] = [
  { EU: "39",   US: "6.5",  UK: "5.5",  CM: "24.5" },
  { EU: "40",   US: "7",    UK: "6",    CM: "25" },
  { EU: "41",   US: "8",    UK: "7",    CM: "25.5" },
  { EU: "42",   US: "8.5",  UK: "7.5",  CM: "26.5" },
  { EU: "43",   US: "9.5",  UK: "8.5",  CM: "27" },
  { EU: "44",   US: "10",   UK: "9",    CM: "27.5" },
  { EU: "44.5", US: "10.5", UK: "9.5",  CM: "28" },
  { EU: "45",   US: "11",   UK: "10",   CM: "28.5" },
  { EU: "46",   US: "12",   UK: "11",   CM: "29.5" },
  { EU: "47",   US: "13",   UK: "12",   CM: "30" },
  { EU: "48",   US: "14",   UK: "13",   CM: "31" },
];

// --- WOMEN'S SHOES ---
const WOMEN_SHOES: ShoeRow[] = [
  { EU: "35",   US: "5",    UK: "2.5",  CM: "22" },
  { EU: "35.5", US: "5.5",  UK: "3",    CM: "22.5" },
  { EU: "36",   US: "6",    UK: "3.5",  CM: "23" },
  { EU: "37",   US: "6.5",  UK: "4",    CM: "23.5" },
  { EU: "38",   US: "7.5",  UK: "5",    CM: "24" },
  { EU: "39",   US: "8",    UK: "5.5",  CM: "24.5" },
  { EU: "40",   US: "9",    UK: "6.5",  CM: "25.5" },
  { EU: "41",   US: "9.5",  UK: "7",    CM: "26" },
  { EU: "42",   US: "10.5", UK: "8",    CM: "27" },
  { EU: "43",   US: "11.5", UK: "9",    CM: "27.5" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */

type AnyRow = SizeRow | ShoeRow;

function getColumns(category: Category): { key: string; label: string }[] {
  if (category === "shoes") {
    return [
      { key: "EU", label: "EU" },
      { key: "US", label: "US" },
      { key: "UK", label: "UK" },
      { key: "CM", label: "cm" },
    ];
  }
  return [
    { key: "EU", label: "EU" },
    { key: "US", label: "US" },
    { key: "UK", label: "UK" },
    { key: "INT", label: "INT (S/M/L)" },
  ];
}

function getData(category: Category, gender: Gender): AnyRow[] {
  if (category === "clothing") return gender === "men" ? MEN_CLOTHING : WOMEN_CLOTHING;
  return gender === "men" ? MEN_SHOES : WOMEN_SHOES;
}

function getRegions(category: Category): { key: string; label: string }[] {
  if (category === "shoes") {
    return [
      { key: "EU", label: "Europe (EU)" },
      { key: "US", label: "Etats-Unis (US)" },
      { key: "UK", label: "Royaume-Uni (UK)" },
      { key: "CM", label: "Centimetres (cm)" },
    ];
  }
  return [
    { key: "EU", label: "Europe (EU)" },
    { key: "US", label: "Etats-Unis (US)" },
    { key: "UK", label: "Royaume-Uni (UK)" },
    { key: "INT", label: "International (S/M/L)" },
  ];
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                         */
/* ------------------------------------------------------------------ */

export default function ConvertisseurTailles() {
  const [category, setCategory] = useState<Category>("clothing");
  const [gender, setGender] = useState<Gender>("women");
  const [sourceRegion, setSourceRegion] = useState<string>("EU");
  const [sourceValue, setSourceValue] = useState<string>("");

  const data = useMemo(() => getData(category, gender), [category, gender]);
  const columns = useMemo(() => getColumns(category), [category]);
  const regions = useMemo(() => getRegions(category), [category]);

  // Reset source value when category/gender changes
  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSourceRegion("EU");
    setSourceValue("");
  };

  const handleGenderChange = (g: Gender) => {
    setGender(g);
    setSourceValue("");
  };

  // Find matching row index
  const matchedIndex = useMemo(() => {
    if (!sourceValue.trim()) return -1;
    const search = sourceValue.trim().toUpperCase();
    return data.findIndex((row) => {
      const val = (row as unknown as Record<string, string>)[sourceRegion];
      return val !== undefined && val.toUpperCase() === search;
    });
  }, [data, sourceRegion, sourceValue]);

  // Available values for dropdown
  const availableValues = useMemo(() => {
    return data.map((row) => (row as unknown as Record<string, string>)[sourceRegion]);
  }, [data, sourceRegion]);

  // Matched row data
  const matchedRow = matchedIndex >= 0 ? data[matchedIndex] : null;

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Conversion
          </p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur de <span style={{ color: "var(--primary)" }}>Tailles</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Trouvez votre taille de vetements et chaussures dans tous les systemes : EU, US, UK et tailles internationales.
          </p>
        </div>
      </section>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* Category selector */}
            <div className="animate-fade-up stagger-2 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Categorie
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {([
                  { key: "clothing" as Category, label: "Vetements", icon: "👕" },
                  { key: "shoes" as Category, label: "Chaussures", icon: "👟" },
                ]).map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => handleCategoryChange(cat.key)}
                    className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all"
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

              <h2 className="mt-6 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Genre
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {([
                  { key: "men" as Gender, label: "Homme" },
                  { key: "women" as Gender, label: "Femme" },
                ]).map((g) => (
                  <button
                    key={g.key}
                    onClick={() => handleGenderChange(g.key)}
                    className="rounded-xl px-5 py-3 text-sm font-semibold transition-all"
                    style={{
                      background: gender === g.key ? "var(--primary)" : "var(--surface-alt)",
                      color: gender === g.key ? "white" : "var(--muted)",
                    }}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size input */}
            <div className="animate-fade-up stagger-3 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Trouver votre taille
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Systeme source
                  </label>
                  <select
                    value={sourceRegion}
                    onChange={(e) => { setSourceRegion(e.target.value); setSourceValue(""); }}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-medium"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {regions.map((r) => (
                      <option key={r.key} value={r.key}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Votre taille
                  </label>
                  <select
                    value={sourceValue}
                    onChange={(e) => setSourceValue(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-medium"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value="">-- Choisir --</option>
                    {availableValues.map((v, i) => (
                      <option key={i} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result cards */}
              {matchedRow && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {columns.map((col) => {
                    const val = (matchedRow as unknown as Record<string, string>)[col.key];
                    const isSource = col.key === sourceRegion;
                    return (
                      <div
                        key={col.key}
                        className="rounded-xl border p-4 text-center transition-all"
                        style={{
                          background: isSource ? "var(--primary)" : "var(--surface-alt)",
                          borderColor: isSource ? "var(--primary)" : "var(--border)",
                          color: isSource ? "white" : undefined,
                        }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: isSource ? "rgba(255,255,255,0.7)" : "var(--accent)" }}>
                          {col.label}
                        </p>
                        <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                          {val}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Full conversion table */}
            <div className="animate-fade-up stagger-4 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Tableau complet — {category === "clothing" ? "Vetements" : "Chaussures"} {gender === "men" ? "Homme" : "Femme"}
              </h2>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                          style={{ color: "var(--muted)", borderBottom: "2px solid var(--border)" }}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => {
                      const isHighlighted = idx === matchedIndex;
                      return (
                        <tr
                          key={idx}
                          className="transition-all cursor-pointer"
                          style={{
                            background: isHighlighted ? "var(--primary)" : idx % 2 === 0 ? "transparent" : "var(--surface-alt)",
                            color: isHighlighted ? "white" : undefined,
                          }}
                          onClick={() => {
                            const val = (row as unknown as Record<string, string>)[sourceRegion];
                            setSourceValue(val);
                          }}
                        >
                          {columns.map((col) => (
                            <td
                              key={col.key}
                              className="px-4 py-3 font-medium"
                              style={{
                                borderBottom: `1px solid ${isHighlighted ? "rgba(255,255,255,0.2)" : "var(--border)"}`,
                                fontFamily: col.key === "INT" ? undefined : "var(--font-display)",
                              }}
                            >
                              {(row as unknown as Record<string, string>)[col.key]}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tips section */}
            <div className="animate-fade-up stagger-5 rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Conseils pour bien choisir sa taille
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  <strong className="text-[var(--foreground)]">Prenez vos mesures</strong> : Utilisez un metre ruban souple. Pour les vetements, mesurez tour de poitrine, tour de taille et tour de hanches. Pour les chaussures, mesurez la longueur du pied en cm.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Variations entre marques</strong> : Ces tableaux sont des standards generaux. Chaque marque peut avoir ses propres grilles de tailles. Consultez toujours le guide des tailles du fabricant.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Tailles EU vs FR</strong> : Pour les vetements, les tailles EU (europeennes) correspondent generalement aux tailles francaises. Par exemple, un EU 38 femme = taille 38 en France.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Astuce chaussures</strong> : Mesurez vos pieds en fin de journee (ils gonflent legerement). Prevoyez une marge de 0,5 a 1 cm par rapport a la longueur de votre pied pour le confort.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Conversions rapides</strong> : Pour les vetements femme, taille US + 30 = taille EU (ex: US 8 = EU 38). Pour les chaussures homme, taille US - 1 = taille UK.
                </p>
              </div>
            </div>

            {/* Quick reference */}
            <div className="animate-fade-up stagger-5 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Formules de conversion rapide
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { title: "Vetements femme US → EU", formula: "Taille EU = Taille US + 30" },
                  { title: "Vetements femme US → UK", formula: "Taille UK = Taille US + 4" },
                  { title: "Chaussures homme US → UK", formula: "Taille UK = Taille US - 1" },
                  { title: "Chaussures homme US → EU", formula: "Taille EU ≈ Taille US + 33" },
                  { title: "Chaussures femme US → UK", formula: "Taille UK = Taille US - 2" },
                  { title: "Chaussures femme US → EU", formula: "Taille EU ≈ Taille US + 31" },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
                    <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>{item.title}</p>
                    <p className="mt-1 text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                      {item.formula}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
