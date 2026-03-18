"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

/* ------------------------------------------------------------------ */
/*  DPE scale (2024 reform)                                            */
/* ------------------------------------------------------------------ */
const DPE_CLASSES = [
  { letter: "A", maxKwh: 70,  maxCo2: 6,   color: "#2d9a46" },
  { letter: "B", maxKwh: 110, maxCo2: 11,  color: "#52b84b" },
  { letter: "C", maxKwh: 180, maxCo2: 30,  color: "#c8d84b" },
  { letter: "D", maxKwh: 250, maxCo2: 50,  color: "#f3d03e" },
  { letter: "E", maxKwh: 330, maxCo2: 70,  color: "#f0943a" },
  { letter: "F", maxKwh: 420, maxCo2: 100, color: "#e8593e" },
  { letter: "G", maxKwh: Infinity, maxCo2: Infinity, color: "#d32a2a" },
] as const;

/* ------------------------------------------------------------------ */
/*  Energy data                                                        */
/* ------------------------------------------------------------------ */
type EnergyType = "electricite" | "gaz" | "fioul" | "bois";

const ENERGIES: Record<EnergyType, { label: string; prixKwh: number; facteurCo2: number; facteurEP: number }> = {
  // Prix TTC moyens 2026 (sources: CRE tarif reglemente, indices INSEE)
  electricite: { label: "Electricite",      prixKwh: 0.2065, facteurCo2: 0.079, facteurEP: 2.3 },
  gaz:         { label: "Gaz naturel",      prixKwh: 0.10,   facteurCo2: 0.227, facteurEP: 1.0 },
  fioul:       { label: "Fioul domestique",  prixKwh: 0.12,   facteurCo2: 0.324, facteurEP: 1.0 },
  bois:        { label: "Bois / Granules",   prixKwh: 0.07,   facteurCo2: 0.030, facteurEP: 1.0 },
};

/* ------------------------------------------------------------------ */
/*  Simplified estimation reference (kWh/m2/an final energy)           */
/* ------------------------------------------------------------------ */
type PeriodeConstruction = "avant1975" | "1975-1988" | "1989-2000" | "2001-2012" | "apres2012";
type NiveauIsolation = "aucune" | "partielle" | "complete" | "performante";

const BASE_CONSO: Record<PeriodeConstruction, number> = {
  "avant1975": 350,
  "1975-1988": 250,
  "1989-2000": 180,
  "2001-2012": 130,
  "apres2012": 70,
};

const ISOLATION_COEFF: Record<NiveauIsolation, number> = {
  aucune: 1.15,
  partielle: 1.0,
  complete: 0.80,
  performante: 0.60,
};

const CHAUFFAGE_COEFF: Record<EnergyType, number> = {
  electricite: 0.95,
  gaz: 1.0,
  fioul: 1.10,
  bois: 0.90,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function getDpeClass(kwhM2: number, co2M2: number) {
  // DPE dual-criterion: the class is determined by the worst of the two
  let classeEnergie = 6; // default to G
  let classeCo2 = 6;
  for (let i = 0; i < DPE_CLASSES.length; i++) {
    if (kwhM2 <= DPE_CLASSES[i].maxKwh && classeEnergie === 6) classeEnergie = i;
    if (co2M2 <= DPE_CLASSES[i].maxCo2 && classeCo2 === 6) classeCo2 = i;
  }
  const idx = Math.max(classeEnergie, classeCo2);
  return DPE_CLASSES[idx];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function CalculateurDPE() {
  const [mode, setMode] = useState<"manuel" | "simplifie">("manuel");

  // Manual mode
  const [surface, setSurface] = useState("80");
  const [energie, setEnergie] = useState<EnergyType>("gaz");
  const [consoType, setConsoType] = useState<"kwh" | "euros">("kwh");
  const [consoValue, setConsoValue] = useState("12000");

  // Simplified mode
  const [surfaceSimp, setSurfaceSimp] = useState("80");
  const [periode, setPeriode] = useState<PeriodeConstruction>("1989-2000");
  const [chauffage, setChauffage] = useState<EnergyType>("gaz");
  const [isolation, setIsolation] = useState<NiveauIsolation>("partielle");

  const result = useMemo(() => {
    if (mode === "manuel") {
      const s = parseFloat(surface) || 1;
      const e = ENERGIES[energie];
      let consoKwh: number;
      if (consoType === "euros") {
        consoKwh = (parseFloat(consoValue) || 0) / e.prixKwh;
      } else {
        consoKwh = parseFloat(consoValue) || 0;
      }
      const consoEP = consoKwh * e.facteurEP; // energie primaire
      const kwhM2 = consoEP / s;
      const co2Total = consoKwh * e.facteurCo2;
      const co2M2 = co2Total / s;
      const coutAnnuel = consoKwh * e.prixKwh;
      const dpe = getDpeClass(kwhM2, co2M2);
      return { kwhM2, co2M2, co2Total, coutAnnuel, consoKwh, consoEP, surface: s, dpe };
    } else {
      const s = parseFloat(surfaceSimp) || 1;
      const e = ENERGIES[chauffage];
      const baseConso = BASE_CONSO[periode];
      const consoM2Final = baseConso * ISOLATION_COEFF[isolation] * CHAUFFAGE_COEFF[chauffage];
      const consoKwh = consoM2Final * s;
      const consoEP = consoKwh * e.facteurEP;
      const kwhM2 = consoEP / s;
      const co2Total = consoKwh * e.facteurCo2;
      const co2M2 = co2Total / s;
      const coutAnnuel = consoKwh * e.prixKwh;
      const dpe = getDpeClass(kwhM2, co2M2);
      return { kwhM2, co2M2, co2Total, coutAnnuel, consoKwh, consoEP, surface: s, dpe };
    }
  }, [mode, surface, energie, consoType, consoValue, surfaceSimp, periode, chauffage, isolation]);

  const fmt = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
  const fmt1 = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

  const isPassoire = result.dpe.letter === "F" || result.dpe.letter === "G";

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Immobilier & Energie
          </p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>DPE</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez la classe energetique de votre logement (A a G), la consommation en kWh/m&sup2;/an, les emissions CO2 et le cout annuel.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* Mode toggle */}
            <div className="animate-fade-up flex gap-2">
              <ModeButton active={mode === "manuel"} onClick={() => setMode("manuel")} label="Mode manuel" />
              <ModeButton active={mode === "simplifie"} onClick={() => setMode("simplifie")} label="Mode simplifie" />
            </div>

            {/* Inputs */}
            {mode === "manuel" ? (
              <div className="animate-fade-up stagger-1 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                  Donnees du logement
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Surface (m2)" value={surface} onChange={setSurface} type="number" />
                  <SelectField label="Energie principale" value={energie} onChange={(v) => setEnergie(v as EnergyType)}
                    options={Object.entries(ENERGIES).map(([k, v]) => ({ value: k, label: v.label }))} />
                  <SelectField label="Saisie en" value={consoType} onChange={(v) => setConsoType(v as "kwh" | "euros")}
                    options={[{ value: "kwh", label: "kWh/an" }, { value: "euros", label: "Euros/an" }]} />
                  <Field label={consoType === "kwh" ? "Consommation annuelle (kWh)" : "Facture annuelle (euros)"} value={consoValue} onChange={setConsoValue} type="number" />
                </div>
              </div>
            ) : (
              <div className="animate-fade-up stagger-1 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                  Caracteristiques du logement
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Surface (m2)" value={surfaceSimp} onChange={setSurfaceSimp} type="number" />
                  <SelectField label="Annee de construction" value={periode} onChange={(v) => setPeriode(v as PeriodeConstruction)}
                    options={[
                      { value: "avant1975", label: "Avant 1975" },
                      { value: "1975-1988", label: "1975 - 1988" },
                      { value: "1989-2000", label: "1989 - 2000" },
                      { value: "2001-2012", label: "2001 - 2012" },
                      { value: "apres2012", label: "Apres 2012 (RT 2012+)" },
                    ]} />
                  <SelectField label="Type de chauffage" value={chauffage} onChange={(v) => setChauffage(v as EnergyType)}
                    options={Object.entries(ENERGIES).map(([k, v]) => ({ value: k, label: v.label }))} />
                  <SelectField label="Niveau d'isolation" value={isolation} onChange={(v) => setIsolation(v as NiveauIsolation)}
                    options={[
                      { value: "aucune", label: "Aucune / tres faible" },
                      { value: "partielle", label: "Partielle (combles ou murs)" },
                      { value: "complete", label: "Complete (murs + combles + fenetres)" },
                      { value: "performante", label: "Performante (BBC / RE2020)" },
                    ]} />
                </div>
              </div>
            )}

            {/* DPE Gauge */}
            <div className="animate-fade-up stagger-2 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Etiquette energie (DPE)
              </h2>
              <div className="mt-5 space-y-1.5">
                {DPE_CLASSES.map((c, i) => {
                  const isActive = c.letter === result.dpe.letter;
                  const widthPct = 30 + i * 10; // A=30%, G=90%
                  return (
                    <div key={c.letter} className="flex items-center gap-2">
                      <div
                        className="relative flex items-center justify-between rounded-r-lg px-3 py-1.5 text-sm font-bold text-white transition-all duration-300"
                        style={{
                          width: `${widthPct}%`,
                          background: c.color,
                          opacity: isActive ? 1 : 0.45,
                          transform: isActive ? "scale(1.04)" : "scale(1)",
                          boxShadow: isActive ? `0 2px 12px ${c.color}66` : "none",
                        }}
                      >
                        <span className="text-base">{c.letter}</span>
                        <span className="text-[11px] font-semibold opacity-90">
                          {c.maxKwh === Infinity ? "> 420" : `< ${c.maxKwh}`} kWh
                        </span>
                      </div>
                      {isActive && (
                        <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: c.color }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                          {fmt(result.kwhM2)} kWh/m&sup2;/an
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key stats */}
            <div className="animate-fade-up stagger-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Classe DPE" value={result.dpe.letter} color={result.dpe.color} large />
              <StatCard label="kWh/m2/an" value={fmt(result.kwhM2)} color={result.dpe.color} />
              <StatCard label="kg CO2/m2/an" value={fmt1(result.co2M2)} color={result.co2M2 > 70 ? "#d32a2a" : result.co2M2 > 30 ? "#f0943a" : "var(--primary)"} />
              <StatCard label="Cout annuel" value={`${fmt(result.coutAnnuel)} \u20AC`} color="var(--foreground)" />
            </div>

            {/* Detail summary */}
            <div className="animate-fade-up stagger-4 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Detail de l&apos;estimation
              </h2>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Surface" value={`${fmt(result.surface)} m\u00B2`} />
                <Row label="Consommation annuelle (energie finale)" value={`${fmt(result.consoKwh)} kWh`} />
                <Row label="Consommation annuelle (energie primaire)" value={`${fmt(result.consoEP)} kWh EP`} />
                <Row label="Consommation par m2 (energie primaire)" value={`${fmt(result.kwhM2)} kWh/m\u00B2/an`} highlight primary />
                <Row label="Emissions CO2 totales" value={`${fmt(result.co2Total)} kg CO\u2082/an`} />
                <Row label="Emissions CO2 par m2" value={`${fmt1(result.co2M2)} kg CO\u2082/m\u00B2/an`} />
                <Row label="Cout annuel estime" value={`${fmt(result.coutAnnuel)} \u20AC/an`} highlight primary />
                <Row label="Cout mensuel estime" value={`${fmt(result.coutAnnuel / 12)} \u20AC/mois`} />
              </div>
            </div>

            {/* Passoire thermique alert */}
            {isPassoire && (
              <div className="animate-fade-up rounded-2xl border-2 p-6" style={{ borderColor: "#d32a2a", background: "#fef2f2" }}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold" style={{ background: "#d32a2a" }}>!</span>
                  <div>
                    <h3 className="font-bold" style={{ color: "#d32a2a", fontFamily: "var(--font-display)" }}>
                      Passoire thermique (classe {result.dpe.letter})
                    </h3>
                    <p className="mt-1 text-sm" style={{ color: "#991b1b" }}>
                      Ce logement est classe comme passoire thermique. Depuis le 1er janvier 2025, les logements en classe G ne peuvent plus etre mis en location.
                      Les logements en classe F seront interdits a la location a partir de 2028, et les classe E a partir de 2034.
                    </p>
                    <ul className="mt-3 space-y-1 text-sm" style={{ color: "#991b1b" }}>
                      <li>Isolation des murs et combles</li>
                      <li>Remplacement des fenetres simple vitrage</li>
                      <li>Installation d&apos;une pompe a chaleur ou chaudiere performante</li>
                      <li>Ventilation mecanique controlee (VMC)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison table */}
            <div className="animate-fade-up stagger-5 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Seuils reglementaires DPE
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border)" }}>
                      <th className="px-3 py-2 text-left font-semibold" style={{ color: "var(--muted)" }}>Classe</th>
                      <th className="px-3 py-2 text-right font-semibold" style={{ color: "var(--muted)" }}>kWh/m&sup2;/an</th>
                      <th className="px-3 py-2 text-right font-semibold" style={{ color: "var(--muted)" }}>kg CO&sub2;/m&sup2;/an</th>
                      <th className="px-3 py-2 text-right font-semibold" style={{ color: "var(--muted)" }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DPE_CLASSES.map((c) => {
                      const isCurrentClass = c.letter === result.dpe.letter;
                      return (
                        <tr key={c.letter} style={{
                          borderBottom: "1px solid var(--border)",
                          background: isCurrentClass ? `${c.color}15` : "transparent",
                        }}>
                          <td className="px-3 py-2.5">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-white" style={{ background: c.color }}>
                              {c.letter}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-right font-medium">
                            {c.maxKwh === Infinity ? "> 420" : c.letter === "A" ? `\u2264 ${c.maxKwh}` : `\u2264 ${c.maxKwh}`}
                          </td>
                          <td className="px-3 py-2.5 text-right font-medium">
                            {c.maxCo2 === Infinity ? "> 100" : `\u2264 ${c.maxCo2}`}
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            {c.letter === "F" || c.letter === "G" ? (
                              <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: "#d32a2a" }}>
                                Passoire
                              </span>
                            ) : c.letter === "A" || c.letter === "B" ? (
                              <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: "var(--primary)" }}>
                                Performant
                              </span>
                            ) : (
                              <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ color: "var(--muted)", background: "var(--surface-alt)" }}>
                                Standard
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Prix par energie
              </h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                {Object.entries(ENERGIES).map(([, e]) => (
                  <li key={e.label} className="flex justify-between">
                    <span>{e.label}</span>
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>{e.prixKwh.toFixed(2)} &euro;/kWh</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Calendrier location
              </h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li><strong style={{ color: "#d32a2a" }}>2025</strong> : Classe G interdite</li>
                <li><strong style={{ color: "#e8593e" }}>2028</strong> : Classe F interdite</li>
                <li><strong style={{ color: "#f0943a" }}>2034</strong> : Classe E interdite</li>
              </ul>
            </div>
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                A propos
              </h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Ce simulateur fournit une estimation indicative.
                Seul un diagnostiqueur certifie peut etablir un DPE officiel.
                Les seuils utilises sont ceux de la reforme DPE 2024.
              </p>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                      */
/* ------------------------------------------------------------------ */

function ModeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
      style={{
        background: active ? "var(--primary)" : "var(--surface)",
        color: active ? "#fff" : "var(--muted)",
        border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
      }}
    >
      {label}
    </button>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-medium"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-medium"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ label, value, color, large }: { label: string; value: string; color: string; large?: boolean }) {
  return (
    <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
      <p className={`mt-1 font-bold ${large ? "text-3xl" : "text-xl"}`} style={{ fontFamily: "var(--font-display)", color }}>
        {value}
      </p>
    </div>
  );
}

function Row({ label, value, highlight, primary }: { label: string; value: string; highlight?: boolean; primary?: boolean }) {
  return (
    <div className="flex justify-between rounded-lg px-3 py-2" style={highlight ? { background: "var(--surface-alt)" } : {}}>
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span
        className={highlight ? "text-lg font-bold" : "font-medium"}
        style={{ fontFamily: highlight ? "var(--font-display)" : undefined, color: primary ? "var(--primary)" : "var(--foreground)" }}
      >
        {value}
      </span>
    </div>
  );
}
