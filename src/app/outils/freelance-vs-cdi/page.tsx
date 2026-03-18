"use client";

import { useState, useMemo, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

/* ─── IR Barème 2025 ─── */
function calcImpot(revenu: number, parts: number) {
  const q = revenu / parts;
  let impot = 0;
  const tranches = [
    { min: 0, max: 11294, rate: 0 },
    { min: 11294, max: 28797, rate: 0.11 },
    { min: 28797, max: 82341, rate: 0.30 },
    { min: 82341, max: 177106, rate: 0.41 },
    { min: 177106, max: Infinity, rate: 0.45 },
  ];
  for (const t of tranches) {
    if (q <= t.min) break;
    impot += (Math.min(q, t.max) - t.min) * t.rate;
  }
  return Math.max(0, impot * parts);
}

/* ─── IS Barème ─── */
function calcIS(benefice: number) {
  if (benefice <= 0) return 0;
  if (benefice <= 42500) return benefice * 0.15;
  return 42500 * 0.15 + (benefice - 42500) * 0.25;
}

/* ─── CDI Model ─── */
interface CDIParams {
  brutAnnuel: number;
  tauxChargesSalariales: number;
  tauxChargesPatronales: number;
  parts: number;
}
function calcCDI(p: CDIParams) {
  const netAvantImpot = p.brutAnnuel * (1 - p.tauxChargesSalariales);
  const impot = calcImpot(netAvantImpot, p.parts);
  return {
    brutAnnuel: p.brutAnnuel,
    coutEmployeur: p.brutAnnuel * (1 + p.tauxChargesPatronales),
    netAvantImpot,
    impotAnnuel: impot,
    netApresImpot: netAvantImpot - impot,
    netMensuel: (netAvantImpot - impot) / 12,
    avantages: [
      "Conges payes (25 jours)",
      "Mutuelle entreprise",
      "Assurance chomage",
      "Retraite complete",
      "Formation professionnelle",
      "Stabilite de l'emploi",
    ],
  };
}

/* ─── Micro-entreprise Model ─── */
interface MicroParams {
  tjm: number;
  joursAn: number;
  tauxCotisations: number;
  parts: number;
}
function calcMicro(p: MicroParams) {
  const ca = p.tjm * p.joursAn;
  const cotisations = ca * p.tauxCotisations;
  const netAvantImpot = ca - cotisations;
  // BNC: abattement 34%, imposable = CA * 0.66
  const revenuImposable = ca * 0.66;
  const impot = calcImpot(revenuImposable, p.parts);
  // Net reel = CA - cotisations - impot
  const netApresImpot = ca - cotisations - impot;
  return {
    ca,
    cotisations,
    netAvantImpot,
    revenuImposable,
    impotAnnuel: impot,
    netApresImpot,
    netMensuel: netApresImpot / 12,
    avantages: [
      "Simplicite administrative",
      "Pas de TVA (< 36 800 \u20ac)",
      "Abattement forfaitaire 34%",
      "Comptabilite minimale",
      "Liberte totale",
    ],
  };
}

/* ─── SASU Model ─── */
interface SASUParams {
  tjm: number;
  joursAn: number;
  pctRemuneration: number; // 0 to 1 : % du CA alloue a la remuneration brute president
  tauxChargesPatronales: number;
  tauxChargesSalariales: number;
  pctFraisPro: number;
  parts: number;
}
function calcSASU(p: SASUParams) {
  const ca = p.tjm * p.joursAn;
  const fraisPro = ca * p.pctFraisPro;

  // Remuneration brute du president
  const budgetRemuneration = ca * p.pctRemuneration;
  // Le budget remuneration inclut les charges patronales : brut = budget / (1 + taux_patronales)
  const remunerationBrute = budgetRemuneration / (1 + p.tauxChargesPatronales);
  const chargesPatronales = remunerationBrute * p.tauxChargesPatronales;
  const chargesSalariales = remunerationBrute * p.tauxChargesSalariales;
  const remunerationNette = remunerationBrute - chargesSalariales;
  const coutTotalRemuneration = remunerationBrute + chargesPatronales; // = budgetRemuneration

  // Benefice avant IS
  const beneficeAvantIS = Math.max(0, ca - coutTotalRemuneration - fraisPro);
  const is = calcIS(beneficeAvantIS);
  const beneficeApresIS = beneficeAvantIS - is;

  // Dividendes : flat tax 30% (PFU)
  const dividendesBruts = Math.max(0, beneficeApresIS);
  const pfuDividendes = dividendesBruts * 0.30;
  const dividendesNets = dividendesBruts - pfuDividendes;

  // IR sur la remuneration nette
  const impotRemuneration = calcImpot(remunerationNette, p.parts);

  // Total net
  const totalNet = remunerationNette - impotRemuneration + dividendesNets;

  return {
    ca,
    fraisPro,
    remunerationBrute,
    chargesPatronales,
    chargesSalariales,
    remunerationNette,
    coutTotalRemuneration,
    beneficeAvantIS,
    is,
    beneficeApresIS,
    dividendesBruts,
    pfuDividendes,
    dividendesNets,
    impotRemuneration,
    totalNet,
    netMensuel: totalNet / 12,
    avantages: [
      "Optimisation remuneration/dividendes",
      "Dividendes a flat tax 30%",
      "Protection sociale president",
      "Credibilite aupres des clients",
      "Deduction des frais reels",
      "Liberte totale",
    ],
  };
}

/* ─── EURL (IS) Model ─── */
interface EURLParams {
  tjm: number;
  joursAn: number;
  pctRemuneration: number;
  tauxCotisationsTNS: number;
  pctFraisPro: number;
  parts: number;
}
function calcEURL(p: EURLParams) {
  const ca = p.tjm * p.joursAn;
  const fraisPro = ca * p.pctFraisPro;

  // Remuneration gerant TNS
  // Budget remuneration = remuneration nette + cotisations TNS
  // Cotisations TNS sont calculees sur la remuneration : cout = remuneration * (1 + taux)
  const budgetRemuneration = ca * p.pctRemuneration;
  const remunerationBase = budgetRemuneration / (1 + p.tauxCotisationsTNS);
  const cotisationsTNS = remunerationBase * p.tauxCotisationsTNS;
  const remunerationNette = remunerationBase;
  const coutTotalRemuneration = remunerationBase + cotisationsTNS;

  // Benefice avant IS
  const beneficeAvantIS = Math.max(0, ca - coutTotalRemuneration - fraisPro);
  const is = calcIS(beneficeAvantIS);
  const beneficeApresIS = beneficeAvantIS - is;

  // Dividendes EURL : au-dela de 10% du capital, soumis a cotisations TNS
  // Simplification : flat tax 30% + surcout TNS estime a 15% supplementaires
  // (en pratique la plupart des dividendes > 10% capital sont soumis aux cotisations)
  const dividendesBruts = Math.max(0, beneficeApresIS);
  const prelDividendes = dividendesBruts * 0.45; // ~30% PFU + ~15% cotisations TNS sur la part > 10% capital
  const dividendesNets = dividendesBruts - prelDividendes;

  // IR sur la remuneration
  const impotRemuneration = calcImpot(remunerationNette, p.parts);

  const totalNet = remunerationNette - impotRemuneration + dividendesNets;

  return {
    ca,
    fraisPro,
    remunerationBase,
    cotisationsTNS,
    remunerationNette,
    coutTotalRemuneration,
    beneficeAvantIS,
    is,
    beneficeApresIS,
    dividendesBruts,
    prelDividendes,
    dividendesNets,
    impotRemuneration,
    totalNet,
    netMensuel: totalNet / 12,
    avantages: [
      "Cotisations TNS plus faibles",
      "Impot sur les societes (IS)",
      "Deduction des frais reels",
      "Patrimoine professionnel separe",
      "Liberte totale",
    ],
  };
}

/* ─── Formatter ─── */
const fmt = (n: number) =>
  n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });

/* ═══════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                        */
/* ═══════════════════════════════════════════════════════════════════════ */
export default function FreelanceVsCDI() {
  /* ── Shared inputs ── */
  const [tjm, setTjm] = useState("500");
  const [joursAn, setJoursAn] = useState("200");
  const [parts, setParts] = useState("1");
  const [salaireBrut, setSalaireBrut] = useState("45000");

  /* ── Statut selection ── */
  const [statut, setStatut] = useState<"micro" | "sasu" | "eurl">("sasu");

  /* ── SASU specific ── */
  const [sasuPctRemuneration, setSasuPctRemuneration] = useState(50);

  /* ── EURL specific ── */
  const [eurlPctRemuneration, setEurlPctRemuneration] = useState(60);

  /* ── Advanced params ── */
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [cdiTauxSalariales, setCdiTauxSalariales] = useState("22");
  const [cdiTauxPatronales, setCdiTauxPatronales] = useState("45");
  const [microTauxCotisations, setMicroTauxCotisations] = useState("21.1");
  const [sasuTauxPatronales, setSasuTauxPatronales] = useState("45");
  const [sasuTauxSalariales, setSasuTauxSalariales] = useState("22");
  const [sasuPctFrais, setSasuPctFrais] = useState("5");
  const [eurlTauxTNS, setEurlTauxTNS] = useState("45");
  const [eurlPctFrais, setEurlPctFrais] = useState("5");

  /* ── Parsed values ── */
  const partsNum = parseFloat(parts) || 1;
  const tjmNum = parseFloat(tjm) || 0;
  const joursNum = parseInt(joursAn) || 200;

  /* ── CDI ── */
  const cdi = useMemo(
    () =>
      calcCDI({
        brutAnnuel: parseFloat(salaireBrut) || 0,
        tauxChargesSalariales: (parseFloat(cdiTauxSalariales) || 22) / 100,
        tauxChargesPatronales: (parseFloat(cdiTauxPatronales) || 45) / 100,
        parts: partsNum,
      }),
    [salaireBrut, cdiTauxSalariales, cdiTauxPatronales, partsNum]
  );

  /* ── Freelance by statut ── */
  const micro = useMemo(
    () =>
      calcMicro({
        tjm: tjmNum,
        joursAn: joursNum,
        tauxCotisations: (parseFloat(microTauxCotisations) || 21.1) / 100,
        parts: partsNum,
      }),
    [tjmNum, joursNum, microTauxCotisations, partsNum]
  );

  const sasu = useMemo(
    () =>
      calcSASU({
        tjm: tjmNum,
        joursAn: joursNum,
        pctRemuneration: sasuPctRemuneration / 100,
        tauxChargesPatronales: (parseFloat(sasuTauxPatronales) || 45) / 100,
        tauxChargesSalariales: (parseFloat(sasuTauxSalariales) || 22) / 100,
        pctFraisPro: (parseFloat(sasuPctFrais) || 5) / 100,
        parts: partsNum,
      }),
    [
      tjmNum,
      joursNum,
      sasuPctRemuneration,
      sasuTauxPatronales,
      sasuTauxSalariales,
      sasuPctFrais,
      partsNum,
    ]
  );

  const eurl = useMemo(
    () =>
      calcEURL({
        tjm: tjmNum,
        joursAn: joursNum,
        pctRemuneration: eurlPctRemuneration / 100,
        tauxCotisationsTNS: (parseFloat(eurlTauxTNS) || 45) / 100,
        pctFraisPro: (parseFloat(eurlPctFrais) || 5) / 100,
        parts: partsNum,
      }),
    [tjmNum, joursNum, eurlPctRemuneration, eurlTauxTNS, eurlPctFrais, partsNum]
  );

  const freelance = statut === "micro" ? micro : statut === "sasu" ? sasu : eurl;
  const freelanceNet = freelance.netMensuel;
  const diff = freelanceNet - cdi.netMensuel;

  /* ── TJM equivalent (binary search) ── */
  const calcFreelanceNet = useCallback(
    (t: number) => {
      if (statut === "micro") {
        return calcMicro({
          tjm: t,
          joursAn: joursNum,
          tauxCotisations: (parseFloat(microTauxCotisations) || 21.1) / 100,
          parts: partsNum,
        }).netMensuel;
      } else if (statut === "sasu") {
        return calcSASU({
          tjm: t,
          joursAn: joursNum,
          pctRemuneration: sasuPctRemuneration / 100,
          tauxChargesPatronales: (parseFloat(sasuTauxPatronales) || 45) / 100,
          tauxChargesSalariales: (parseFloat(sasuTauxSalariales) || 22) / 100,
          pctFraisPro: (parseFloat(sasuPctFrais) || 5) / 100,
          parts: partsNum,
        }).netMensuel;
      } else {
        return calcEURL({
          tjm: t,
          joursAn: joursNum,
          pctRemuneration: eurlPctRemuneration / 100,
          tauxCotisationsTNS: (parseFloat(eurlTauxTNS) || 45) / 100,
          pctFraisPro: (parseFloat(eurlPctFrais) || 5) / 100,
          parts: partsNum,
        }).netMensuel;
      }
    },
    [
      statut,
      joursNum,
      partsNum,
      microTauxCotisations,
      sasuPctRemuneration,
      sasuTauxPatronales,
      sasuTauxSalariales,
      sasuPctFrais,
      eurlPctRemuneration,
      eurlTauxTNS,
      eurlPctFrais,
    ]
  );

  const tjmEquivalent = useMemo(() => {
    let low = 0,
      high = 5000;
    for (let i = 0; i < 50; i++) {
      const mid = (low + high) / 2;
      if (calcFreelanceNet(mid) * 12 < cdi.netApresImpot) low = mid;
      else high = mid;
    }
    return Math.round((low + high) / 2);
  }, [calcFreelanceNet, cdi.netApresImpot]);

  /* ── Statut labels ── */
  const statutLabels: Record<string, string> = {
    micro: "Micro-entreprise",
    sasu: "SASU",
    eurl: "EURL (IS)",
  };

  /* ── Detail rows per statut ── */
  const getFreelanceRows = (): [string, string, boolean?][] => {
    if (statut === "micro") {
      return [
        ["Chiffre d'affaires", `${fmt(micro.ca)} \u20ac`],
        [`Cotisations (${microTauxCotisations}%)`, `- ${fmt(micro.cotisations)} \u20ac`],
        ["Net avant impot", `${fmt(micro.netAvantImpot)} \u20ac`],
        ["Revenu imposable (CA x 0.66)", `${fmt(micro.revenuImposable)} \u20ac`],
        ["Impot sur le revenu", `- ${fmt(micro.impotAnnuel)} \u20ac`],
        ["Net annuel apres impot", `${fmt(micro.netApresImpot)} \u20ac`, true],
      ];
    }
    if (statut === "sasu") {
      return [
        ["Chiffre d'affaires", `${fmt(sasu.ca)} \u20ac`],
        ["Frais professionnels", `- ${fmt(sasu.fraisPro)} \u20ac`],
        ["\u2500\u2500 Remuneration president \u2500\u2500", ""],
        ["Remuneration brute", `${fmt(sasu.remunerationBrute)} \u20ac`],
        ["Charges patronales", `- ${fmt(sasu.chargesPatronales)} \u20ac`],
        ["Charges salariales", `- ${fmt(sasu.chargesSalariales)} \u20ac`],
        ["Remuneration nette", `${fmt(sasu.remunerationNette)} \u20ac`],
        ["IR sur remuneration", `- ${fmt(sasu.impotRemuneration)} \u20ac`],
        ["\u2500\u2500 Dividendes \u2500\u2500", ""],
        ["Benefice avant IS", `${fmt(sasu.beneficeAvantIS)} \u20ac`],
        ["Impot sur les societes", `- ${fmt(sasu.is)} \u20ac`],
        ["Dividendes bruts", `${fmt(sasu.dividendesBruts)} \u20ac`],
        ["Flat tax (30%)", `- ${fmt(sasu.pfuDividendes)} \u20ac`],
        ["Dividendes nets", `${fmt(sasu.dividendesNets)} \u20ac`],
        ["\u2500\u2500 Total \u2500\u2500", ""],
        ["Net annuel total", `${fmt(sasu.totalNet)} \u20ac`, true],
      ];
    }
    // EURL
    return [
      ["Chiffre d'affaires", `${fmt(eurl.ca)} \u20ac`],
      ["Frais professionnels", `- ${fmt(eurl.fraisPro)} \u20ac`],
      ["\u2500\u2500 Remuneration gerant TNS \u2500\u2500", ""],
      ["Remuneration de base", `${fmt(eurl.remunerationBase)} \u20ac`],
      ["Cotisations TNS", `- ${fmt(eurl.cotisationsTNS)} \u20ac`],
      ["Remuneration nette", `${fmt(eurl.remunerationNette)} \u20ac`],
      ["IR sur remuneration", `- ${fmt(eurl.impotRemuneration)} \u20ac`],
      ["\u2500\u2500 Dividendes \u2500\u2500", ""],
      ["Benefice avant IS", `${fmt(eurl.beneficeAvantIS)} \u20ac`],
      ["Impot sur les societes", `- ${fmt(eurl.is)} \u20ac`],
      ["Dividendes bruts", `${fmt(eurl.dividendesBruts)} \u20ac`],
      ["Prelevements (~45%)", `- ${fmt(eurl.prelDividendes)} \u20ac`],
      ["Dividendes nets", `${fmt(eurl.dividendesNets)} \u20ac`],
      ["\u2500\u2500 Total \u2500\u2500", ""],
      ["Net annuel total", `${fmt(eurl.totalNet)} \u20ac`, true],
    ];
  };

  return (
    <>
      {/* ── Header ── */}
      <section
        className="relative py-14"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-5xl px-5">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Carriere
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span style={{ color: "var(--primary)" }}>Freelance</span> vs CDI
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Comparez vos revenus nets reels entre CDI, Micro-entreprise, SASU et
            EURL. Optimisation dividendes, charges configurables, bareme IR
            2025.
          </p>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {/* ═══ Shared inputs ═══ */}
            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              <InputCard label="TJM" value={tjm} onChange={setTjm} suffix="\u20ac/jour" />
              <InputCard
                label="Jours travailles / an"
                value={joursAn}
                onChange={setJoursAn}
                suffix="jours"
              />
              <InputCard
                label="Parts fiscales"
                value={parts}
                onChange={setParts}
                suffix="parts"
                step="0.5"
                min="1"
              />
            </div>

            {/* ═══ CDI input ═══ */}
            <div
              className="rounded-2xl border p-5"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--primary)" }}
                  >
                    CDI
                  </span>
                </div>
                <div className="flex-1">
                  <label
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Salaire brut annuel
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      value={salaireBrut}
                      onChange={(e) => setSalaireBrut(e.target.value)}
                      className="w-full rounded-xl border px-4 py-2.5 text-lg font-bold"
                      style={{
                        borderColor: "var(--border)",
                        fontFamily: "var(--font-display)",
                      }}
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      &euro;/an
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ Statut selector (pills) ═══ */}
            <div className="flex items-center gap-1 rounded-xl border p-1" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
              {(["micro", "sasu", "eurl"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatut(s)}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: statut === s ? "var(--surface)" : "transparent",
                    color: statut === s ? "var(--accent)" : "var(--muted)",
                    boxShadow: statut === s ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {s === "micro" ? "Micro" : s === "sasu" ? "SASU" : "EURL"}
                </button>
              ))}
            </div>

            {/* ═══ SASU remuneration slider ═══ */}
            {statut === "sasu" && (
              <div
                className="rounded-2xl border p-5"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Repartition remuneration / dividendes
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--accent)",
                    }}
                  >
                    {sasuPctRemuneration}% / {100 - sasuPctRemuneration}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={sasuPctRemuneration}
                  onChange={(e) =>
                    setSasuPctRemuneration(parseInt(e.target.value))
                  }
                  className="mt-3 w-full accent-[#e8963e]"
                />
                <div className="mt-1 flex justify-between text-[10px]" style={{ color: "var(--muted)" }}>
                  <span>100% dividendes</span>
                  <span>100% remuneration</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg p-3" style={{ background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Remuneration nette
                    </p>
                    <p className="mt-1 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                      {fmt(sasu.remunerationNette)} &euro;
                    </p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Dividendes nets
                    </p>
                    <p className="mt-1 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                      {fmt(sasu.dividendesNets)} &euro;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ EURL remuneration slider ═══ */}
            {statut === "eurl" && (
              <div
                className="rounded-2xl border p-5"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Repartition remuneration / dividendes
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--accent)",
                    }}
                  >
                    {eurlPctRemuneration}% / {100 - eurlPctRemuneration}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={eurlPctRemuneration}
                  onChange={(e) =>
                    setEurlPctRemuneration(parseInt(e.target.value))
                  }
                  className="mt-3 w-full accent-[#e8963e]"
                />
                <div className="mt-1 flex justify-between text-[10px]" style={{ color: "var(--muted)" }}>
                  <span>100% dividendes</span>
                  <span>100% remuneration</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg p-3" style={{ background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Remuneration nette
                    </p>
                    <p className="mt-1 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                      {fmt(eurl.remunerationNette)} &euro;
                    </p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Dividendes nets
                    </p>
                    <p className="mt-1 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                      {fmt(eurl.dividendesNets)} &euro;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Advanced params ═══ */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all"
              style={{
                borderColor: "var(--border)",
                color: "var(--muted)",
                background: "var(--surface)",
              }}
            >
              <span
                className="transition-transform"
                style={{
                  display: "inline-block",
                  transform: showAdvanced ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                {"\u25B6"}
              </span>
              Parametres avances
            </button>

            {showAdvanced && (
              <div
                className="rounded-2xl border p-5 space-y-5"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* CDI params */}
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                    style={{ color: "var(--primary)" }}
                  >
                    CDI
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <AdvancedInput
                      label="Charges salariales (%)"
                      value={cdiTauxSalariales}
                      onChange={setCdiTauxSalariales}
                    />
                    <AdvancedInput
                      label="Charges patronales (%)"
                      value={cdiTauxPatronales}
                      onChange={setCdiTauxPatronales}
                    />
                  </div>
                </div>

                {/* Micro params */}
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                    style={{ color: "var(--accent)" }}
                  >
                    Micro-entreprise
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <AdvancedInput
                      label="Taux cotisations (%)"
                      value={microTauxCotisations}
                      onChange={setMicroTauxCotisations}
                    />
                  </div>
                </div>

                {/* SASU params */}
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                    style={{ color: "var(--accent)" }}
                  >
                    SASU
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <AdvancedInput
                      label="Charges patronales (%)"
                      value={sasuTauxPatronales}
                      onChange={setSasuTauxPatronales}
                    />
                    <AdvancedInput
                      label="Charges salariales (%)"
                      value={sasuTauxSalariales}
                      onChange={setSasuTauxSalariales}
                    />
                    <AdvancedInput
                      label="Frais pro (% CA)"
                      value={sasuPctFrais}
                      onChange={setSasuPctFrais}
                    />
                  </div>
                </div>

                {/* EURL params */}
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                    style={{ color: "var(--accent)" }}
                  >
                    EURL
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <AdvancedInput
                      label="Cotisations TNS (%)"
                      value={eurlTauxTNS}
                      onChange={setEurlTauxTNS}
                    />
                    <AdvancedInput
                      label="Frais pro (% CA)"
                      value={eurlPctFrais}
                      onChange={setEurlPctFrais}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Comparison cards ═══ */}
            <div className="grid grid-cols-2 gap-4">
              <CompareCard
                label="CDI"
                subtitle="Net/mois apres impot"
                value={`${fmt(cdi.netMensuel)} \u20ac`}
                winner={cdi.netMensuel >= freelanceNet}
                color="var(--primary)"
              />
              <CompareCard
                label={statutLabels[statut]}
                subtitle="Net/mois apres impot"
                value={`${fmt(freelanceNet)} \u20ac`}
                winner={freelanceNet > cdi.netMensuel}
                color="var(--accent)"
              />
            </div>

            {/* ═══ Verdict ═══ */}
            <div
              className="rounded-2xl border p-6 text-center"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                Difference mensuelle
              </p>
              <p
                className="mt-2 text-3xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: diff >= 0 ? "var(--primary)" : "#dc2626",
                }}
              >
                {diff >= 0 ? "+" : ""}
                {fmt(diff)} &euro;/mois
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                en faveur {diff >= 0 ? `du freelance (${statutLabels[statut]})` : "du CDI"}
              </p>
              <div
                className="mt-4 rounded-xl p-4"
                style={{ background: "var(--surface-alt)" }}
              >
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  TJM minimum pour egaliser le CDI en{" "}
                  <strong>{statutLabels[statut]}</strong> :{" "}
                  <strong
                    className="text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {tjmEquivalent} &euro;/jour
                  </strong>
                </p>
              </div>
            </div>

            {/* ═══ Detail breakdown ═══ */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailTable
                title="CDI"
                color="var(--primary)"
                rows={[
                  ["Salaire brut annuel", `${fmt(cdi.brutAnnuel)} \u20ac`],
                  [
                    `Charges salariales (${cdiTauxSalariales}%)`,
                    `- ${fmt(cdi.brutAnnuel - cdi.netAvantImpot)} \u20ac`,
                  ],
                  ["Net avant impot", `${fmt(cdi.netAvantImpot)} \u20ac`],
                  ["Impot sur le revenu", `- ${fmt(cdi.impotAnnuel)} \u20ac`],
                  [
                    "Net annuel apres impot",
                    `${fmt(cdi.netApresImpot)} \u20ac`,
                    true,
                  ],
                  [
                    `Cout employeur (+${cdiTauxPatronales}%)`,
                    `${fmt(cdi.coutEmployeur)} \u20ac`,
                  ],
                ]}
              />
              <DetailTable
                title={statutLabels[statut]}
                color="var(--accent)"
                rows={getFreelanceRows()}
              />
            </div>

            {/* ═══ Advantages ═══ */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                className="rounded-2xl border p-5"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--primary)" }}
                >
                  Avantages CDI
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {cdi.avantages.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      <span style={{ color: "var(--primary)" }}>{"\u2713"}</span>{" "}
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-2xl border p-5"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--accent)" }}
                >
                  Avantages {statutLabels[statut]}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {freelance.avantages.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      <span style={{ color: "var(--accent)" }}>{"\u2713"}</span>{" "}
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block space-y-6">
            <AdPlaceholder className="min-h-[250px]" />
            <AdPlaceholder className="min-h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SUB-COMPONENTS                                                        */
/* ═══════════════════════════════════════════════════════════════════════ */

function InputCard({
  label,
  value,
  onChange,
  suffix,
  step,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  step?: string;
  min?: string;
}) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <label
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </label>
      <div className="relative mt-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={step}
          min={min}
          className="w-full rounded-xl border px-4 py-2.5 text-xl font-bold pr-16"
          style={{
            borderColor: "var(--border)",
            fontFamily: "var(--font-display)",
          }}
        />
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
          style={{ color: "var(--muted)" }}
        >
          {suffix}
        </span>
      </div>
    </div>
  );
}

function AdvancedInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </label>
      <input
        type="number"
        step="0.1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}

function CompareCard({
  label,
  subtitle,
  value,
  winner,
  color,
}: {
  label: string;
  subtitle: string;
  value: string;
  winner: boolean;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl border p-5 text-center transition-all"
      style={{
        background: "var(--surface)",
        borderColor: winner ? color : "var(--border)",
        boxShadow: winner ? `0 0 0 2px ${color}20` : "none",
      }}
    >
      <p
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color }}
      >
        {label}
      </p>
      <p
        className="text-[10px] uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {subtitle}
      </p>
      <p
        className="mt-2 text-2xl font-bold"
        style={{ fontFamily: "var(--font-display)", color }}
      >
        {value}
      </p>
      {winner && (
        <span
          className="mt-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold text-white"
          style={{ background: color }}
        >
          GAGNANT
        </span>
      )}
    </div>
  );
}

function DetailTable({
  title,
  color,
  rows,
}: {
  title: string;
  color: string;
  rows: [string, string, boolean?][];
}) {
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <h3
        className="text-xs font-semibold uppercase tracking-[0.15em]"
        style={{ color }}
      >
        {title}
      </h3>
      <div className="mt-3 space-y-1.5">
        {rows.map(([label, value, isTotal], i) => {
          // Separator rows
          if (value === "" && label.startsWith("\u2500")) {
            return (
              <div
                key={i}
                className="pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                {label.replace(/\u2500/g, "").trim()}
              </div>
            );
          }
          return (
            <div key={i} className="flex justify-between text-sm">
              <span style={{ color: "var(--muted)" }}>{label}</span>
              <span
                className={isTotal ? "font-bold" : "font-medium"}
                style={
                  isTotal
                    ? { color, fontFamily: "var(--font-display)" }
                    : {}
                }
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
