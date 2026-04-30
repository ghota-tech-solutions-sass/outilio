"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";

/* ─── TJM Presets ─── */
const TJM_PRESETS = [
  { label: "Junior", value: 350 },
  { label: "Confirme", value: 600 },
  { label: "Senior", value: 900 },
  { label: "Expert", value: 1300 },
];

/* ─── IR Barème 2025 ─── */
function calcImpot(revenu: number, parts: number) {
  const q = revenu / parts;
  let impot = 0;
  // Bareme IR 2026 sur revenus 2025 (LF 2026, +0.9%)
  const tranches = [
    { min: 0, max: 11600, rate: 0 },
    { min: 11600, max: 29579, rate: 0.11 },
    { min: 29579, max: 84577, rate: 0.30 },
    { min: 84577, max: 181917, rate: 0.41 },
    { min: 181917, max: Infinity, rate: 0.45 },
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
      "Pas de TVA (< 36 800 €)",
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

  // Dividendes : flat tax 30% (PFU 2026 : 12,8% IR + 17,2% PS)
  const dividendesBruts = Math.max(0, beneficeApresIS);
  const pfuDividendes = dividendesBruts * 0.30;
  const dividendesNets = dividendesBruts - pfuDividendes;

  // Taxe PUMa : si remuneration < 20% du PASS (~9 273€), taxe 6.5% sur revenus du capital
  const PASS_2026 = 47100;
  const seuilPuma = PASS_2026 * 0.20; // ~9 420€
  const taxePuma = remunerationBrute < seuilPuma && dividendesBruts > 0
    ? dividendesBruts * 0.065
    : 0;

  // IR sur la remuneration nette
  const impotRemuneration = calcImpot(remunerationNette, p.parts);

  // Total net
  const totalNet = remunerationNette - impotRemuneration + dividendesNets - taxePuma;

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
    taxePuma,
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
  capitalSocial: number; // capital social + compte courant d'associe
  parts: number;
}
function calcEURL(p: EURLParams) {
  const ca = p.tjm * p.joursAn;
  const fraisPro = ca * p.pctFraisPro;

  // Remuneration gerant TNS
  const budgetRemuneration = ca * p.pctRemuneration;
  const remunerationBase = budgetRemuneration / (1 + p.tauxCotisationsTNS);
  const cotisationsTNS = remunerationBase * p.tauxCotisationsTNS;
  const remunerationNette = remunerationBase;
  const coutTotalRemuneration = remunerationBase + cotisationsTNS;

  // Benefice avant IS
  const beneficeAvantIS = Math.max(0, ca - coutTotalRemuneration - fraisPro);
  const is = calcIS(beneficeAvantIS);
  const beneficeApresIS = beneficeAvantIS - is;

  // Dividendes EURL IS :
  // - Part <= 10% du (capital social + CCA) : flat tax 30% (PFU 2026)
  // - Part > 10% : soumise aux cotisations TNS (~45%) au lieu de la part CSG/CRDS
  //   En pratique : ~45% de cotisations TNS + 12.8% d'IR = ~57.8% de prelevements
  // Avec un capital faible (ex: 1000€), quasi tout est soumis aux cotisations TNS
  const dividendesBruts = Math.max(0, beneficeApresIS);
  const seuil10pct = p.capitalSocial * 0.10;
  const partSousFranchise = Math.min(dividendesBruts, seuil10pct);
  const partAuDessus = Math.max(0, dividendesBruts - seuil10pct);

  // Part sous franchise : flat tax 30% (PFU 2026)
  const prelFranchise = partSousFranchise * 0.30;
  // Part au-dessus : cotisations TNS (~45%) + IR residuel (12.8%)
  const cotisationsTNSDividendes = partAuDessus * p.tauxCotisationsTNS;
  const irDividendesAuDessus = partAuDessus * 0.128;
  const prelAuDessus = cotisationsTNSDividendes + irDividendesAuDessus;

  const prelDividendes = prelFranchise + prelAuDessus;
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
    seuil10pct,
    partSousFranchise,
    partAuDessus,
    cotisationsTNSDividendes,
    prelDividendes,
    dividendesNets,
    impotRemuneration,
    totalNet,
    netMensuel: totalNet / 12,
    avantages: [
      "Cotisations TNS plus faibles qu'en SASU",
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
  const [microTauxCotisations, setMicroTauxCotisations] = useState("25.6");
  const [sasuTauxPatronales, setSasuTauxPatronales] = useState("45");
  const [sasuTauxSalariales, setSasuTauxSalariales] = useState("22");
  const [sasuPctFrais, setSasuPctFrais] = useState("5");
  const [eurlTauxTNS, setEurlTauxTNS] = useState("45");
  const [eurlPctFrais, setEurlPctFrais] = useState("5");
  const [eurlCapitalCCA, setEurlCapitalCCA] = useState("1000");

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
        tauxCotisations: (parseFloat(microTauxCotisations) || 25.6) / 100,
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
        capitalSocial: parseFloat(eurlCapitalCCA) || 1000,
        parts: partsNum,
      }),
    [tjmNum, joursNum, eurlPctRemuneration, eurlTauxTNS, eurlPctFrais, eurlCapitalCCA, partsNum]
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
          tauxCotisations: (parseFloat(microTauxCotisations) || 25.6) / 100,
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
          capitalSocial: parseFloat(eurlCapitalCCA) || 1000,
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
      eurlCapitalCCA,
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
        ["Chiffre d'affaires", `${fmt(micro.ca)} €`],
        [`Cotisations (${microTauxCotisations}%)`, `- ${fmt(micro.cotisations)} €`],
        ["Net avant impot", `${fmt(micro.netAvantImpot)} €`],
        ["Revenu imposable (CA x 0.66)", `${fmt(micro.revenuImposable)} €`],
        ["Impot sur le revenu", `- ${fmt(micro.impotAnnuel)} €`],
        ["Net annuel apres impot", `${fmt(micro.netApresImpot)} €`, true],
      ];
    }
    if (statut === "sasu") {
      return [
        ["Chiffre d'affaires", `${fmt(sasu.ca)} €`],
        ["Frais professionnels", `- ${fmt(sasu.fraisPro)} €`],
        ["── Remuneration president ──", ""],
        ["Remuneration brute", `${fmt(sasu.remunerationBrute)} €`],
        ["Charges patronales", `- ${fmt(sasu.chargesPatronales)} €`],
        ["Charges salariales", `- ${fmt(sasu.chargesSalariales)} €`],
        ["Remuneration nette", `${fmt(sasu.remunerationNette)} €`],
        ["IR sur remuneration", `- ${fmt(sasu.impotRemuneration)} €`],
        ["── Dividendes ──", ""],
        ["Benefice avant IS", `${fmt(sasu.beneficeAvantIS)} €`],
        ["Impot sur les societes", `- ${fmt(sasu.is)} €`],
        ["Dividendes bruts", `${fmt(sasu.dividendesBruts)} €`],
        ["Flat tax (30%)", `- ${fmt(sasu.pfuDividendes)} €`],
        ["Dividendes nets", `${fmt(sasu.dividendesNets)} €`],
        ...(sasu.taxePuma > 0 ? [["Taxe PUMa (6,5%)", `- ${fmt(sasu.taxePuma)} €`] as [string, string]] : []),
        ["── Total ──", ""],
        ["Net annuel total", `${fmt(sasu.totalNet)} €`, true],
      ];
    }
    // EURL
    return [
      ["Chiffre d'affaires", `${fmt(eurl.ca)} €`],
      ["Frais professionnels", `- ${fmt(eurl.fraisPro)} €`],
      ["── Remuneration gerant TNS ──", ""],
      ["Remuneration de base", `${fmt(eurl.remunerationBase)} €`],
      ["Cotisations TNS", `- ${fmt(eurl.cotisationsTNS)} €`],
      ["Remuneration nette", `${fmt(eurl.remunerationNette)} €`],
      ["IR sur remuneration", `- ${fmt(eurl.impotRemuneration)} €`],
      ["── Dividendes ──", ""],
      ["Benefice avant IS", `${fmt(eurl.beneficeAvantIS)} €`],
      ["Impot sur les societes", `- ${fmt(eurl.is)} €`],
      ["Dividendes bruts", `${fmt(eurl.dividendesBruts)} €`],
      [`Franchise PFU (≤10% capital)`, `${fmt(eurl.partSousFranchise)} €`],
      ...(eurl.partAuDessus > 0 ? [[`Soumis TNS (>${fmt(eurl.seuil10pct)}€)`, `${fmt(eurl.partAuDessus)} €`] as [string, string]] : []),
      ["Prelevements totaux", `- ${fmt(eurl.prelDividendes)} €`],
      ["Dividendes nets", `${fmt(eurl.dividendesNets)} €`],
      ["── Total ──", ""],
      ["Net annuel total", `${fmt(eurl.totalNet)} €`, true],
    ];
  };

  /* ── 4-card comparison data ── */
  const compareCards = [
    {
      key: "cdi",
      label: "CDI",
      netAnnuel: cdi.netApresImpot,
      netMensuel: cdi.netMensuel,
      color: "var(--primary)",
    },
    {
      key: "micro",
      label: "Micro-entreprise",
      netAnnuel: micro.netApresImpot,
      netMensuel: micro.netMensuel,
      color: "var(--accent)",
    },
    {
      key: "sasu",
      label: "SASU",
      netAnnuel: sasu.totalNet,
      netMensuel: sasu.netMensuel,
      color: "var(--accent)",
    },
    {
      key: "eurl",
      label: "EURL (IS)",
      netAnnuel: eurl.totalNet,
      netMensuel: eurl.netMensuel,
      color: "var(--accent)",
    },
  ];
  const bestNet = Math.max(...compareCards.map((c) => c.netAnnuel));

  /* ── Bars data ── */
  const cdiCharges = cdi.coutEmployeur - cdi.netAvantImpot;
  const sasuChargesTotal =
    sasu.chargesPatronales +
    sasu.chargesSalariales +
    sasu.is +
    sasu.pfuDividendes +
    sasu.taxePuma +
    sasu.fraisPro;
  const eurlChargesTotal =
    eurl.cotisationsTNS + eurl.is + eurl.prelDividendes + eurl.fraisPro;
  const bars = [
    {
      label: "CDI",
      total: cdi.coutEmployeur,
      charges: cdiCharges,
      impot: cdi.impotAnnuel,
      net: cdi.netApresImpot,
    },
    {
      label: "Micro",
      total: micro.ca,
      charges: micro.cotisations,
      impot: micro.impotAnnuel,
      net: micro.netApresImpot,
    },
    {
      label: "SASU",
      total: sasu.ca,
      charges: sasuChargesTotal,
      impot: sasu.impotRemuneration,
      net: sasu.totalNet,
    },
    {
      label: "EURL",
      total: eurl.ca,
      charges: eurlChargesTotal,
      impot: eurl.impotRemuneration,
      net: eurl.totalNet,
    },
  ];
  const maxBarTotal = Math.max(...bars.map((b) => b.total), 1);

  return (
    <>
      {/* ── Header ── */}
      <section
        className="relative py-14"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
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
          {diff > 0 && (
            <p
              className="animate-fade-up stagger-2 mt-3 text-sm font-semibold"
              style={{ color: "var(--accent)" }}
            >
              Avec votre TJM actuel, vous gagnez{" "}
              <strong>+{fmt(diff)} &euro;/mois</strong> en {statutLabels[statut]}.
            </p>
          )}
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
      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {/* ═══ Shared inputs ═══ */}
            <div
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              <InputCard label="TJM" value={tjm} onChange={setTjm} suffix="€/jour" />
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

            {/* ═══ TJM slider + presets ═══ */}
            <div
              className="rounded-2xl border p-5"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Curseur TJM
                </span>
                <span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--accent)",
                  }}
                >
                  {tjm} &euro;/jour
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={2000}
                step={50}
                value={Math.min(Math.max(parseFloat(tjm) || 200, 200), 2000)}
                onChange={(e) => setTjm(e.target.value)}
                className="mt-3 w-full accent-[#e8963e]"
                aria-label="Curseur TJM"
              />
              <div
                className="mt-1 flex justify-between text-[10px]"
                style={{ color: "var(--muted)" }}
              >
                <span>200 &euro;</span>
                <span>2000 &euro;</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {TJM_PRESETS.map((p) => {
                  const isActive = parseFloat(tjm) === p.value;
                  return (
                    <button
                      key={p.label}
                      onClick={() => setTjm(String(p.value))}
                      className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                      style={{
                        borderColor: isActive ? "var(--primary)" : "var(--border)",
                        color: isActive ? "var(--primary)" : "var(--muted)",
                        background: isActive
                          ? "rgba(13,79,60,0.06)"
                          : "transparent",
                      }}
                    >
                      {p.label}{" "}
                      <span
                        style={{
                          color: isActive ? "var(--primary)" : "var(--accent)",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {p.value} &euro;
                      </span>
                    </button>
                  );
                })}
              </div>
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

            {/* ═══ Statut selector (pills) - controls detail panel ═══ */}
            <div>
              <p
                className="mb-2 text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                Detail a afficher pour le statut
              </p>
              <div
                className="flex items-center gap-1 rounded-xl border p-1"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface-alt)",
                }}
              >
                {(["micro", "sasu", "eurl"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatut(s)}
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{
                      background: statut === s ? "var(--surface)" : "transparent",
                      color: statut === s ? "var(--accent)" : "var(--muted)",
                      boxShadow:
                        statut === s ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    }}
                  >
                    {s === "micro" ? "Micro" : s === "sasu" ? "SASU" : "EURL"}
                  </button>
                ))}
              </div>
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
                {sasu.taxePuma > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border p-3" style={{ borderColor: "#dc262640", background: "#dc26260a" }}>
                    <span className="mt-0.5 text-sm">{"⚠️"}</span>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: "#dc2626" }}>Taxe PUMa applicable</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                        Remuneration inf. a 20% du PASS ({fmt(47100 * 0.20)} &euro;). Taxe de 6,5% sur les dividendes : <strong>{fmt(sasu.taxePuma)} &euro;</strong>.
                        Augmentez la part remuneration pour l&apos;eviter.
                      </p>
                    </div>
                  </div>
                )}
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
                {"▶"}
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
                  <div className="grid grid-cols-3 gap-3">
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
                    <AdvancedInput
                      label="Capital + CCA (€)"
                      value={eurlCapitalCCA}
                      onChange={setEurlCapitalCCA}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ═══ Comparison cards (4 statuts) ═══ */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {compareCards.map((c) => {
                const diffVsCDI = c.netAnnuel - cdi.netApresImpot;
                const isBest = c.netAnnuel === bestNet;
                const isCDI = c.key === "cdi";
                return (
                  <div
                    key={c.key}
                    className="relative rounded-2xl border p-5 text-center transition-all"
                    style={{
                      background: "var(--surface)",
                      borderColor: isBest ? "#fbbf24" : "var(--border)",
                      boxShadow: isBest ? "0 0 0 2px #fbbf2440" : "none",
                    }}
                  >
                    {isBest && (
                      <span
                        className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-bold text-white"
                        style={{ background: "#fbbf24" }}
                      >
                        {"\u{1F3C6}"} Meilleur
                      </span>
                    )}
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: c.color }}
                    >
                      {c.label}
                    </p>
                    <p
                      className="mt-2 text-2xl font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: c.color,
                      }}
                    >
                      {fmt(c.netAnnuel)} &euro;
                    </p>
                    <p
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Net annuel apres impot
                    </p>
                    <p
                      className="mt-1 text-sm font-semibold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {fmt(c.netMensuel)} &euro;/mois
                    </p>
                    {!isCDI && (
                      <p
                        className="mt-2 text-xs font-semibold"
                        style={{
                          color:
                            diffVsCDI >= 0 ? "var(--primary)" : "#dc2626",
                        }}
                      >
                        {diffVsCDI >= 0 ? "+" : ""}
                        {fmt(diffVsCDI)} &euro;/an vs CDI
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ═══ Visualisation barres horizontales empilees ═══ */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Repartition charges / impot / net
              </h3>
              <p
                className="mt-1 text-[11px]"
                style={{ color: "var(--muted)" }}
              >
                Largeur proportionnelle au CA freelance (ou cout employeur pour le CDI).
              </p>
              <div className="mt-4 space-y-3">
                {bars.map((b) => {
                  const widthPct = (b.total / maxBarTotal) * 100;
                  const cPct = b.total > 0 ? (b.charges / b.total) * 100 : 0;
                  const iPct = b.total > 0 ? (b.impot / b.total) * 100 : 0;
                  const nPct = b.total > 0 ? (b.net / b.total) * 100 : 0;
                  return (
                    <div key={b.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className="font-semibold"
                          style={{ color: "var(--foreground)" }}
                        >
                          {b.label}
                        </span>
                        <span style={{ color: "var(--muted)" }}>
                          Total : {fmt(b.total)} &euro;
                        </span>
                      </div>
                      <div
                        className="mt-1 h-7 overflow-hidden rounded-md"
                        style={{ background: "var(--surface-alt)" }}
                      >
                        <div
                          className="flex h-full"
                          style={{ width: `${widthPct}%` }}
                        >
                          <div
                            className="flex items-center justify-center text-[10px] font-bold text-white"
                            style={{
                              width: `${cPct}%`,
                              background: "#dc2626",
                            }}
                            title={`Charges : ${fmt(b.charges)} EUR`}
                          >
                            {cPct >= 10 ? `${Math.round(cPct)}%` : ""}
                          </div>
                          <div
                            className="flex items-center justify-center text-[10px] font-bold text-white"
                            style={{
                              width: `${iPct}%`,
                              background: "#e8963e",
                            }}
                            title={`Impot : ${fmt(b.impot)} EUR`}
                          >
                            {iPct >= 8 ? `${Math.round(iPct)}%` : ""}
                          </div>
                          <div
                            className="flex items-center justify-center text-[10px] font-bold text-white"
                            style={{
                              width: `${nPct}%`,
                              background: "#0d4f3c",
                            }}
                            title={`Net : ${fmt(b.net)} EUR`}
                          >
                            {nPct >= 10 ? `${Math.round(nPct)}%` : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div
                  className="flex flex-wrap gap-4 pt-2 text-[11px]"
                  style={{ color: "var(--muted)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ background: "#dc2626" }}
                    />
                    Charges
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ background: "#e8963e" }}
                    />
                    Impot
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-sm"
                      style={{ background: "#0d4f3c" }}
                    />
                    Net
                  </span>
                </div>
              </div>
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
                  ["Salaire brut annuel", `${fmt(cdi.brutAnnuel)} €`],
                  [
                    `Charges salariales (${cdiTauxSalariales}%)`,
                    `- ${fmt(cdi.brutAnnuel - cdi.netAvantImpot)} €`,
                  ],
                  ["Net avant impot", `${fmt(cdi.netAvantImpot)} €`],
                  ["Impot sur le revenu", `- ${fmt(cdi.impotAnnuel)} €`],
                  [
                    "Net annuel apres impot",
                    `${fmt(cdi.netApresImpot)} €`,
                    true,
                  ],
                  [
                    `Cout employeur (+${cdiTauxPatronales}%)`,
                    `${fmt(cdi.coutEmployeur)} €`,
                  ],
                ]}
              />
              <DetailTable
                title={statutLabels[statut]}
                color="var(--accent)"
                rows={getFreelanceRows()}
              />
            </div>

            {/* ═══ CrossLinkCard CTAs ═══ */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--accent)" }}
              >
                Vous pourriez aussi vouloir
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CrossLinkCard
                  href="/outils/calculateur-salaire"
                  emoji={"\u{1F4BC}"}
                  title="Net en poche CDI"
                  desc="Calculez votre brut/net mensuel avec impot."
                />
                <CrossLinkCard
                  href="/outils/simulateur-auto-entrepreneur"
                  emoji={"\u{1F4CA}"}
                  title="Charges micro detail"
                  desc="Simulez vos cotisations URSSAF mensuelles."
                />
                <CrossLinkCard
                  href="/outils/generateur-facture"
                  emoji={"\u{1F4C4}"}
                  title="Premiere facture freelance"
                  desc="Generateur de facture conforme PDF."
                />
              </div>
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
                      <span style={{ color: "var(--primary)" }}>{"✓"}</span>{" "}
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
                      <span style={{ color: "var(--accent)" }}>{"✓"}</span>{" "}
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Freelance ou CDI : comment choisir ?
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Le choix entre le statut de freelance et le CDI depend de nombreux facteurs : remuneration nette,
                  protection sociale, flexibilite et securite de l&apos;emploi. Notre simulateur vous permet de comparer
                  objectivement les revenus nets apres impots et charges pour chaque situation.
                </p>
                <p>Les trois statuts freelance les plus courants en France :</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Micro-entreprise</strong> : simplicite maximale, cotisations de 25,6% du CA (BNC 2026), plafond 77 700 &euro;/an</li>
                  <li><strong className="text-[var(--foreground)]">SASU</strong> : president assimile salarie, optimisation possible via dividendes (flat tax 30%), charges patronales ~45%</li>
                  <li><strong className="text-[var(--foreground)]">EURL (IS)</strong> : gerant TNS, cotisations ~45% mais base plus avantageuse, dividendes soumis a cotisations au-dela de 10% du capital</li>
                </ul>
                <p>
                  En regle generale, un freelance doit facturer un TJM (taux journalier moyen) 1,5 a 2 fois superieur
                  a l&apos;equivalent salarie brut journalier pour obtenir un revenu net comparable, en raison des charges
                  sociales, de l&apos;absence de conges payes et de la mutuelle a sa charge.
                </p>
              </div>
            </div>

            <ToolFaqSection
              intro="Les questions les plus posees sur le passage du CDI au freelance."
              items={[
                {
                  question: "Quel TJM pour gagner autant qu'en CDI ?",
                  answer:
                    "Cela depend de votre statut juridique et de votre salaire CDI de reference. En moyenne, pour un salaire brut annuel de 45 000 EUR en CDI, il faut facturer entre 350 et 500 EUR/jour en freelance pour obtenir un revenu net equivalent. Utilisez le simulateur pour un calcul precis adapte a votre situation et au nombre de jours factures par an.",
                },
                {
                  question: "Micro-entreprise ou SASU : quel statut choisir ?",
                  answer:
                    "La micro-entreprise convient pour debuter : pas de comptabilite complexe, cotisations simples (25,6 % du CA pour BNC en 2026). La SASU est plus avantageuse au-dela de 50 000 EUR de CA grace a l'optimisation remuneration/dividendes. Elle offre aussi une meilleure protection sociale (regime general) et aucun plafond de chiffre d'affaires.",
                },
                {
                  question: "Comment sont calcules les impots en freelance ?",
                  answer:
                    "En micro-entreprise, le revenu imposable est le CA apres abattement forfaitaire (34 % pour BNC). En SASU et EURL a l'IS, la remuneration du dirigeant est imposee au bareme progressif de l'IR, et les dividendes sont soumis au prelevement forfaitaire unique (PFU) de 30 % depuis 2018 (12,8 % d'IR + 17,2 % de prelevements sociaux).",
                },
                {
                  question: "Combien de jours travailles par an en freelance ?",
                  answer:
                    "En moyenne, un freelance facture entre 180 et 220 jours par an. Le calcul : 365 jours - 104 weekends - 10 jours feries - 25 jours de conges - 10-20 jours de prospection/admin/formation = 196-216 jours nets factures. C'est cette base qu'il faut multiplier par votre TJM pour estimer votre CA annuel.",
                },
                {
                  question: "Faut-il une assurance professionnelle obligatoire ?",
                  answer:
                    "Oui pour de nombreuses professions reglementees (sante, droit, expertise comptable, BTP). Pour les freelances IT, marketing, design, l'assurance RC Pro n'est pas obligatoire mais fortement recommandee : un client peut exiger une attestation. Comptez 250 a 600 EUR par an. La protection juridique professionnelle est aussi utile (litiges contractuels, recouvrement).",
                },
                {
                  question: "Quels sont les droits au chomage en freelance ?",
                  answer:
                    "Les freelances en micro-entreprise et EURL/IR n'ont pas droit au chomage classique (TNS). En SASU, le president est assimile salarie mais ne cotise pas a l'assurance chomage Pole Emploi (sauf cas specifiques). L'ATI (Allocation Travailleurs Independants) existe depuis 2019 mais avec des conditions strictes : ~800 EUR/mois pendant 6 mois max, sous reserve de revenus minimum et de cessation involontaire d'activite.",
                },
                {
                  question: "Le simulateur garde-t-il mes donnees ?",
                  answer:
                    "Non. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee saisie (TJM, salaire, charges, statut) n'est envoyee a un serveur ni stockee. L'outil fonctionne sans inscription.",
                },
              ]}
            />
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
          if (value === "" && label.startsWith("─")) {
            return (
              <div
                key={i}
                className="pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider"
                style={{ color: "var(--muted)" }}
              >
                {label.replace(/─/g, "").trim()}
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

function CrossLinkCard({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold transition-colors group-hover:text-[#0d4f3c]"
          style={{ color: "var(--foreground)" }}
        >
          {title}{" "}
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
            {"→"}
          </span>
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
