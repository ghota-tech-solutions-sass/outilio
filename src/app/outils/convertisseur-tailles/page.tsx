"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

/* ------------------------------------------------------------------ */
/*  DATA — Size conversion tables                                     */
/* ------------------------------------------------------------------ */

type Category = "clothing" | "shoes";
type Gender = "men" | "women";

interface SizeRow {
  EU: string;
  US: string;
  UK: string;
  INT: string;
}

// --- MEN'S CLOTHING (costumes, vestes : US/UK = tour de poitrine en pouces, EU = US + 10) ---
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

// --- WOMEN'S CLOTHING (tailles françaises : FR = US + 32, UK = US + 4) ---
const WOMEN_CLOTHING: SizeRow[] = [
  { EU: "32", US: "0",  UK: "4",  INT: "XXS" },
  { EU: "34", US: "2",  UK: "6",  INT: "XS" },
  { EU: "36", US: "4",  UK: "8",  INT: "S" },
  { EU: "38", US: "6",  UK: "10", INT: "M" },
  { EU: "40", US: "8",  UK: "12", INT: "L" },
  { EU: "42", US: "10", UK: "14", INT: "XL" },
  { EU: "44", US: "12", UK: "16", INT: "XXL" },
  { EU: "46", US: "14", UK: "18", INT: "3XL" },
  { EU: "48", US: "16", UK: "20", INT: "4XL" },
  { EU: "50", US: "18", UK: "22", INT: "5XL" },
];

interface ShoeRow {
  EU: string;
  US: string;
  UK: string;
  CM: string;
}

// --- MEN'S SHOES (grille Nike, CM = longueur du pied) ---
const MEN_SHOES: ShoeRow[] = [
  { EU: "39",   US: "6.5",  UK: "6",    CM: "24.5" },
  { EU: "40",   US: "7",    UK: "6",    CM: "25" },
  { EU: "40.5", US: "7.5",  UK: "6.5",  CM: "25.5" },
  { EU: "41",   US: "8",    UK: "7",    CM: "26" },
  { EU: "42",   US: "8.5",  UK: "7.5",  CM: "26.5" },
  { EU: "42.5", US: "9",    UK: "8",    CM: "27" },
  { EU: "43",   US: "9.5",  UK: "8.5",  CM: "27.5" },
  { EU: "44",   US: "10",   UK: "9",    CM: "28" },
  { EU: "44.5", US: "10.5", UK: "9.5",  CM: "28.5" },
  { EU: "45",   US: "11",   UK: "10",   CM: "29" },
  { EU: "45.5", US: "11.5", UK: "10.5", CM: "29.5" },
  { EU: "46",   US: "12",   UK: "11",   CM: "30" },
  { EU: "47",   US: "12.5", UK: "11.5", CM: "30.5" },
  { EU: "47.5", US: "13",   UK: "12",   CM: "31" },
  { EU: "48.5", US: "14",   UK: "13",   CM: "32" },
];

// --- WOMEN'S SHOES (grille Nike, CM = longueur du pied) ---
const WOMEN_SHOES: ShoeRow[] = [
  { EU: "35",   US: "4.5",  UK: "2",    CM: "21.5" },
  { EU: "35.5", US: "5",    UK: "2.5",  CM: "22" },
  { EU: "36",   US: "5.5",  UK: "3",    CM: "22.5" },
  { EU: "36.5", US: "6",    UK: "3.5",  CM: "23" },
  { EU: "37.5", US: "6.5",  UK: "4",    CM: "23.5" },
  { EU: "38",   US: "7",    UK: "4.5",  CM: "24" },
  { EU: "38.5", US: "7.5",  UK: "5",    CM: "24.5" },
  { EU: "39",   US: "8",    UK: "5.5",  CM: "25" },
  { EU: "40",   US: "8.5",  UK: "6",    CM: "25.5" },
  { EU: "40.5", US: "9",    UK: "6.5",  CM: "26" },
  { EU: "41",   US: "9.5",  UK: "7",    CM: "26.5" },
  { EU: "42",   US: "10",   UK: "7.5",  CM: "27" },
  { EU: "42.5", US: "10.5", UK: "8",    CM: "27.5" },
  { EU: "43",   US: "11",   UK: "8.5",  CM: "28" },
  { EU: "44",   US: "11.5", UK: "9",    CM: "28.5" },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */

type AnyRow = SizeRow | ShoeRow;

function cell(row: AnyRow, key: string): string {
  const val = (row as unknown as Record<string, string>)[key] ?? "";
  // Affichage à la française : virgule décimale
  return val.replace(".", ",");
}

function getColumns(category: Category, gender: Gender): { key: string; label: string }[] {
  if (category === "shoes") {
    return [
      { key: "EU", label: "EU / FR" },
      { key: "US", label: "US" },
      { key: "UK", label: "UK" },
      { key: "CM", label: "Pied (cm)" },
    ];
  }
  return [
    { key: "EU", label: gender === "women" ? "FR" : "FR / EU" },
    { key: "US", label: "US" },
    { key: "UK", label: "UK" },
    { key: "INT", label: "INT (S/M/L)" },
  ];
}

function getData(category: Category, gender: Gender): AnyRow[] {
  if (category === "clothing") return gender === "men" ? MEN_CLOTHING : WOMEN_CLOTHING;
  return gender === "men" ? MEN_SHOES : WOMEN_SHOES;
}

function getRegions(category: Category, gender: Gender): { key: string; label: string }[] {
  if (category === "shoes") {
    return [
      { key: "EU", label: "Europe / France (EU)" },
      { key: "US", label: "États-Unis (US)" },
      { key: "UK", label: "Royaume-Uni (UK)" },
      { key: "CM", label: "Longueur du pied (cm)" },
    ];
  }
  return [
    { key: "EU", label: gender === "women" ? "France (FR)" : "France / Europe (FR / EU)" },
    { key: "US", label: "États-Unis (US)" },
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
  // Sélection par index de ligne : certaines valeurs apparaissent deux fois (ex. UK 6 homme)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const data = useMemo(() => getData(category, gender), [category, gender]);
  const columns = useMemo(() => getColumns(category, gender), [category, gender]);
  const regions = useMemo(() => getRegions(category, gender), [category, gender]);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSourceRegion("EU");
    setSelectedIndex(-1);
  };

  const handleGenderChange = (g: Gender) => {
    setGender(g);
    setSelectedIndex(-1);
  };

  // Options du menu : valeur du système source, précisée par l'équivalent EU si elle est ambiguë
  const options = useMemo(() => {
    const values = data.map((row) => cell(row, sourceRegion));
    return values.map((v, i) => {
      const duplicated = values.indexOf(v) !== values.lastIndexOf(v);
      return { index: i, label: duplicated && sourceRegion !== "EU" ? `${v} (EU ${cell(data[i], "EU")})` : v };
    });
  }, [data, sourceRegion]);

  const matchedRow = selectedIndex >= 0 && selectedIndex < data.length ? data[selectedIndex] : null;
  const genderLabel = gender === "men" ? "Homme" : "Femme";

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Conversion
          </p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur de <span style={{ color: "var(--primary)" }}>tailles</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Trouvez votre taille de vêtements et de chaussures dans les principaux systèmes : France/Europe, US, UK et tailles internationales.
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
                Catégorie
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {([
                  { key: "clothing" as Category, label: "Vêtements", icon: "👕" },
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
                    Système source
                  </label>
                  <select
                    value={sourceRegion}
                    onChange={(e) => { setSourceRegion(e.target.value); setSelectedIndex(-1); }}
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
                    value={selectedIndex}
                    onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-medium"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <option value={-1}>-- Choisir --</option>
                    {options.map((o) => (
                      <option key={o.index} value={o.index}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result cards */}
              {matchedRow && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {columns.map((col) => {
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
                          {cell(matchedRow, col.key)}
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
                Tableau complet — {category === "clothing" ? (gender === "men" ? "Costumes et vestes" : "Vêtements") : "Chaussures"} {genderLabel}
              </h2>
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                {category === "shoes"
                  ? "Grille de référence Nike. La colonne cm indique la longueur du pied, et non celle de la chaussure. Les équivalences varient d'une marque à l'autre d'une demi-pointure environ."
                  : gender === "men"
                    ? "Pour les costumes et vestes, la taille US/UK correspond au tour de poitrine en pouces. Les correspondances S/M/L sont indicatives et varient selon les marques."
                    : "Tailles françaises (utilisées aussi en Espagne et en Belgique). Attention : en Allemagne, aux Pays-Bas et en Scandinavie, la taille affichée est inférieure de 2 (FR 38 = DE 36), et en Italie supérieure de 4 (FR 38 = IT 42). Les correspondances S/M/L sont indicatives."}
              </p>

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
                      const isHighlighted = idx === selectedIndex;
                      return (
                        <tr
                          key={idx}
                          className="transition-all cursor-pointer"
                          style={{
                            background: isHighlighted ? "var(--primary)" : idx % 2 === 0 ? "transparent" : "var(--surface-alt)",
                            color: isHighlighted ? "white" : undefined,
                          }}
                          onClick={() => setSelectedIndex(idx)}
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
                              {cell(row, col.key)}
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
                  <strong className="text-[var(--foreground)]">Prenez vos mesures</strong> : utilisez un mètre ruban souple. Pour les vêtements, mesurez tour de poitrine, tour de taille et tour de hanches. Pour les chaussures, mesurez la longueur du pied en cm.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Variations entre marques</strong> : ces tableaux sont des repères généraux. Chaque marque peut avoir ses propres grilles de tailles. Consultez toujours le guide des tailles du fabricant.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Tailles « EU » selon les pays</strong> : pour les vêtements femme, la mention EU recouvre des grilles différentes. Les tailles françaises (FR 38) valent aussi en Espagne, mais une taille allemande ou néerlandaise est inférieure de 2 (DE 36 = FR 38) et une taille italienne supérieure de 4 (IT 42 = FR 38). Vérifiez quel système utilise la marque.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Astuce chaussures</strong> : mesurez vos pieds en fin de journée (ils gonflent légèrement) et retenez le plus long des deux. Comparez directement cette mesure à la colonne cm, qui correspond déjà à la longueur du pied : inutile d&apos;ajouter une marge.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Conversions rapides</strong> : pour les vêtements femme, taille US + 32 = taille FR (ex. US 6 = FR 38). Pour les chaussures homme, taille US − 1 = taille UK.
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
                  { title: "Vêtements femme US → FR", formula: "Taille FR = Taille US + 32" },
                  { title: "Vêtements femme US → UK", formula: "Taille UK = Taille US + 4" },
                  { title: "Costumes homme FR → US / UK", formula: "Taille US = Taille UK = Taille FR − 10" },
                  { title: "Chaussures homme US → UK", formula: "Taille UK ≈ Taille US − 1" },
                  { title: "Chaussures homme US → EU", formula: "Taille EU ≈ Taille US + 33 à 34" },
                  { title: "Chaussures femme US → UK", formula: "Taille UK ≈ Taille US − 2 à 2,5" },
                  { title: "Chaussures femme US → EU", formula: "Taille EU ≈ Taille US + 31 à 32" },
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

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le convertisseur de tailles
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Ce convertisseur de tailles gratuit vous aide à trouver votre taille de vêtements et de chaussures dans les différents systèmes : France/Europe (FR/EU), États-Unis (US), Royaume-Uni (UK) et tailles internationales (S, M, L, XL).
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Choisissez la catégorie</strong> : vêtements ou chaussures, selon ce que vous recherchez.</li>
                  <li><strong className="text-[var(--foreground)]">Sélectionnez le genre</strong> : homme ou femme, car les grilles de tailles diffèrent.</li>
                  <li><strong className="text-[var(--foreground)]">Indiquez votre système source</strong> : choisissez le système de taille que vous connaissez (FR/EU, US, UK, international ou longueur du pied).</li>
                  <li><strong className="text-[var(--foreground)]">Sélectionnez votre taille</strong> : l&apos;outil affiche instantanément les équivalences dans tous les autres systèmes.</li>
                </ul>
                <p>
                  Le tableau complet présente toutes les correspondances. Cliquez sur une ligne pour la sélectionner et voir les équivalences en détail. Cet outil est particulièrement pratique pour les achats en ligne sur des sites étrangers.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Les tailles EU et FR sont-elles identiques ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pas toujours. Pour les chaussures, oui : la pointure européenne (EU 42) est la pointure française. Pour les vêtements femme, il n&apos;existe pas de grille européenne unique : la France, l&apos;Espagne et la Belgique utilisent la même numérotation, l&apos;Allemagne et les Pays-Bas affichent 2 tailles de moins (DE 36 = FR 38) et l&apos;Italie 4 tailles de plus (IT 42 = FR 38). Pour les costumes homme, les numérotations française, italienne et allemande coïncident.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment mesurer ma pointure exacte ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Posez votre pied à plat sur une feuille de papier, contre un mur, tracez le contour avec un stylo tenu verticalement, puis mesurez la distance entre le talon et le bout de l&apos;orteil le plus long. Mesurez vos deux pieds (ils peuvent différer) et retenez la plus grande mesure. Faites-le en fin de journée, car les pieds gonflent légèrement. Reportez ensuite cette longueur dans la colonne cm du tableau chaussures.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Les tailles varient-elles selon les marques ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Oui, les tableaux de correspondance sont des repères généraux, et chaque marque peut avoir sa propre grille. Pour les chaussures, l&apos;écart entre marques atteint souvent une demi-pointure (par exemple, UK = US − 1 chez Nike mais US − 0,5 chez d&apos;autres fabricants). Consultez toujours le guide des tailles du fabricant, surtout pour les achats en ligne.
                  </p>
                </div>
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
