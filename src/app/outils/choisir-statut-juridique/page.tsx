"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";
import {
  FRAIS_ANNUELS,
  MICRO_ABATTEMENT,
  MICRO_PLAFOND,
  MICRO_TAUX,
  PASS_2026,
  SEUIL_TRIMESTRE_2026,
  SEUIL_TVA,
  STATUTS,
  STATUT_LABELS,
  TAUX_PATRONAL_SASU,
  TAUX_SALARIAL_SASU,
  TAUX_TNS,
  comparer,
  coutsCreation,
  meilleureRepartition,
  type Activite,
  type Inputs,
  type StatutKey,
} from "./calcul";

/* ─── Libellés ─── */
const ACTIVITES: { key: Activite; label: string; desc: string }[] = [
  { key: "vente", label: "Vente de marchandises", desc: "Achat-revente, restauration, hébergement (BIC)" },
  { key: "services_bic", label: "Prestations de services", desc: "Artisanat, services commerciaux (BIC)" },
  { key: "liberal_bnc", label: "Activité libérale", desc: "Conseil, développement, formation, design (BNC)" },
];

const PARTS_OPTIONS = ["1", "1.5", "2", "2.5", "3", "3.5", "4"];

/* ─── Caractéristiques qualitatives (sources dans calcul.ts) ─── */
const QUALITATIF: Record<
  StatutKey,
  { maladie: string; chomage: string; complexite: number; complexiteTexte: string; patrimoine: string; associes: string }
> = {
  micro: {
    maladie: "Indemnités journalières si revenu suffisant (≥ 10 % du PASS en moyenne), carence 3 jours",
    chomage: "Non (ATI sous conditions strictes)",
    complexite: 1,
    complexiteTexte: "Déclaration du CA mensuelle ou trimestrielle, livre des recettes",
    patrimoine: "Séparé par défaut depuis 2022 (sauf fraude, manquements fiscaux ou sociaux graves, caution)",
    associes: "Impossible",
  },
  ei: {
    maladie: "Régime des indépendants : indemnités journalières selon revenus, carence 3 jours",
    chomage: "Non (ATI sous conditions strictes)",
    complexite: 2,
    complexiteTexte: "Comptabilité complète, déclaration 2031 ou 2035, TVA souvent",
    patrimoine: "Séparé par défaut depuis 2022 (mêmes exceptions)",
    associes: "Impossible",
  },
  eurl: {
    maladie: "Gérant TNS : indemnités journalières selon rémunération, carence 3 jours",
    chomage: "Non (gérant majoritaire non couvert)",
    complexite: 3,
    complexiteTexte: "Bilan, liasse IS, approbation et dépôt des comptes au greffe",
    patrimoine: "Responsabilité limitée aux apports (sauf caution personnelle, faute de gestion)",
    associes: "Possible en devenant SARL (règles plus rigides)",
  },
  sasu: {
    maladie: "Régime général : indemnités journalières si salaire suffisant, aucune sans salaire",
    chomage: "Non (le président ne cotise pas à l'assurance chômage)",
    complexite: 4,
    complexiteTexte: "Idem EURL + bulletins de paie et DSN dès qu'un salaire est versé",
    patrimoine: "Responsabilité limitée aux apports (sauf caution personnelle, faute de gestion)",
    associes: "Idéal : entrée d'associés, actions, BSPCE, levée de fonds",
  },
};

const ETAPES: Record<StatutKey, string[]> = {
  micro: [
    "Déclarez votre activité en ligne sur le guichet unique des formalités d'entreprises (gratuit).",
    "Ouvrez un compte bancaire dédié à l'activité (obligatoire si le CA dépasse 10 000 € deux années de suite, recommandé dès le départ).",
    "Choisissez entre impôt au barème et versement libératoire, puis demandez l'ACRE dans les 60 jours si vous y avez droit.",
    "Émettez vos premières factures avec la mention de franchise de TVA si vous restez sous le seuil.",
  ],
  ei: [
    "Déclarez votre entreprise individuelle sur le guichet unique en optant pour le régime réel (formalité gratuite).",
    "Ouvrez un compte bancaire professionnel pour séparer clairement vos flux.",
    "Choisissez un logiciel de comptabilité ou un expert-comptable : la comptabilité d'engagement est obligatoire.",
    "Préparez vos factures (TVA, mentions obligatoires) et un tableau de suivi de trésorerie.",
  ],
  eurl: [
    "Rédigez les statuts de l'EURL (capital libre, 1 € minimum) et nommez le gérant.",
    "Ouvrez un compte bancaire professionnel au nom de la société et déposez-y le capital.",
    "Publiez l'annonce légale de constitution (forfait 2026 : 124 € HT en métropole).",
    "Immatriculez la société sur le guichet unique de l'INPI (33,83 € + 19,33 € de déclaration des bénéficiaires effectifs).",
  ],
  sasu: [
    "Rédigez les statuts de la SASU (capital libre, 1 € minimum) : pouvoirs du président, règles de distribution.",
    "Ouvrez un compte bancaire professionnel au nom de la société et déposez-y le capital.",
    "Publiez l'annonce légale de constitution (forfait 2026 : 142 € HT en métropole).",
    "Immatriculez la société sur le guichet unique de l'INPI (33,83 € + 19,33 € de déclaration des bénéficiaires effectifs).",
  ],
};

/* ─── Formatage ─── */
const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR");
const eur = (n: number) => `${fmt(n)} €`;
const pct = (n: number) => `${(n * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
const num = (v: string, d = 0) => {
  const n = parseFloat(v.replace(",", "."));
  return Number.isFinite(n) ? n : d;
};

export default function ChoisirStatutJuridique() {
  const [activite, setActivite] = useState<Activite>("liberal_bnc");
  const [ca, setCa] = useState("60000");
  const [charges, setCharges] = useState("5000");
  const [pctRemu, setPctRemu] = useState(50);
  const [optimiser, setOptimiser] = useState(false);
  const [parts, setParts] = useState("1");
  const [couple, setCouple] = useState(false);
  const [parentIsole, setParentIsole] = useState(false);
  const [capitalEurl, setCapitalEurl] = useState("1000");
  const [inclureFrais, setInclureFrais] = useState(true);
  const [protegerPatrimoine, setProtegerPatrimoine] = useState(false);
  const [associes, setAssocies] = useState(false);
  const [are, setAre] = useState(false);
  const [areMensuel, setAreMensuel] = useState("1500");
  const [areMois, setAreMois] = useState("12");

  const inputs: Inputs = useMemo(
    () => ({
      activite,
      ca: Math.max(0, num(ca)),
      charges: Math.max(0, num(charges)),
      pctRemuneration: pctRemu / 100,
      parts: Math.max(1, num(parts, 1)),
      couple,
      parentIsole: parentIsole && !couple && num(parts, 1) >= 1.5,
      capitalEurl: Math.max(0, num(capitalEurl)),
      inclureFrais,
      protegerPatrimoine,
      associes,
      are,
      areMensuel: Math.max(0, num(areMensuel)),
      areMois: Math.max(0, num(areMois)),
      optimiser,
    }),
    [activite, ca, charges, pctRemu, parts, couple, parentIsole, capitalEurl, inclureFrais, protegerPatrimoine, associes, are, areMensuel, areMois, optimiser],
  );

  const { resultats, reco } = useMemo(() => comparer(inputs), [inputs]);
  const optimumSasu = useMemo(() => meilleureRepartition(inputs, "sasu"), [inputs]);
  const optimumEurl = useMemo(() => meilleureRepartition(inputs, "eurl"), [inputs]);

  const COUTS_CREATION = useMemo(() => coutsCreation(activite), [activite]);
  const recoKey = reco.statut;
  const recoRes = resultats[recoKey];
  const estSociete = recoKey === "eurl" || recoKey === "sasu";
  const maxTotal = Math.max(1, ...STATUTS.map((k) => Math.max(0, resultats[k].netAnnuel + resultats[k].areRecue)));

  /* Lignes du tableau comparatif */
  type Row = { label: string; cell: (k: StatutKey) => string; strong?: boolean; hint?: string };
  const rows: Row[] = [
    {
      label: "Éligibilité",
      cell: (k) => (resultats[k].eligible ? "Oui" : `Non : ${resultats[k].motifIneligibilite ?? ""}`),
    },
    { label: "Chiffre d'affaires HT", cell: (k) => eur(resultats[k].ca) },
    {
      label: "Charges + frais de fonctionnement",
      cell: (k) => `− ${eur(resultats[k].charges + resultats[k].fraisFonctionnement)}`,
    },
    {
      label: "Cotisations sociales",
      cell: (k) => `− ${eur(resultats[k].cotisationsSociales)}`,
      hint: "Micro : % du CA. EI / EURL : cotisations TNS. SASU : charges patronales + salariales.",
    },
    { label: "Impôt sur les sociétés", cell: (k) => (k === "eurl" || k === "sasu" ? `− ${eur(resultats[k].is)}` : "—") },
    {
      label: "Prélèvements sur dividendes",
      cell: (k) => (k === "eurl" || k === "sasu" ? `− ${eur(resultats[k].prelevementsDividendes)}` : "—"),
      hint: "PFU 31,4 % ; en EURL, cotisations TNS au-delà de 10 % du capital ; taxe PUMa éventuelle en SASU.",
    },
    { label: "Impôt sur le revenu (barème)", cell: (k) => `− ${eur(resultats[k].impotRevenu)}` },
    { label: "Revenu net disponible / an", cell: (k) => eur(resultats[k].netAnnuel), strong: true },
    { label: "Soit par mois", cell: (k) => `${eur(resultats[k].netMensuel)} / mois`, strong: true },
    ...(are
      ? [
          {
            label: "ARE conservée (12 mois max)",
            cell: (k: StatutKey) => eur(resultats[k].areRecue),
            hint: "Estimation avant impôt : ARE réduite de 70 % du revenu d'activité retenu.",
          },
        ]
      : []),
    {
      label: "Répartition salaire / dividendes",
      cell: (k) =>
        k === "eurl" || k === "sasu"
          ? `${Math.round(resultats[k].pctRemuneration * 100)} % / ${Math.round(100 - resultats[k].pctRemuneration * 100)} %`
          : "Sans objet",
    },
    {
      label: "Trimestres de retraite validés",
      cell: (k) => `${resultats[k].trimestresRetraite} / 4`,
      hint: `Base 2026 : ${eur(SEUIL_TRIMESTRE_2026)} de revenu soumis à cotisations par trimestre. Les dividendes SASU ne valident rien.`,
    },
    { label: "Maladie", cell: (k) => QUALITATIF[k].maladie },
    { label: "Chômage", cell: (k) => QUALITATIF[k].chomage },
    { label: "Coût de création", cell: (k) => (COUTS_CREATION[k].total > 0 ? `≈ ${eur(COUTS_CREATION[k].total)} TTC` : "Gratuit") },
    {
      label: "Frais annuels estimés",
      cell: (k) => (FRAIS_ANNUELS[k].total > 0 ? `≈ ${eur(FRAIS_ANNUELS[k].total)} / an` : "≈ 0 € (option logiciel)"),
      hint: "Expert-comptable ou logiciel, banque pro, secrétariat juridique : moyennes indicatives.",
    },
    { label: "Complexité administrative", cell: (k) => `${"●".repeat(QUALITATIF[k].complexite)}${"○".repeat(4 - QUALITATIF[k].complexite)} ${QUALITATIF[k].complexiteTexte}` },
    { label: "Patrimoine personnel", cell: (k) => QUALITATIF[k].patrimoine },
    { label: "Associés / levée de fonds", cell: (k) => QUALITATIF[k].associes },
  ];

  const cardStyle = { background: "var(--surface)", borderColor: "var(--border)" };
  const kickerStyle = { color: "var(--accent)" };

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={kickerStyle}>
            Création d&apos;entreprise
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Quel <span style={{ color: "var(--primary)" }}>statut juridique</span> choisir ?
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Micro-entreprise, EI au réel, EURL ou SASU : comparez cotisations, impôts, revenu net, protection sociale
            et coûts de création avec les règles 2026, puis obtenez une recommandation argumentée. Calcul 100 % dans
            votre navigateur, sans inscription.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0 space-y-6">
            {/* ═══ Formulaire ═══ */}
            <div className="rounded-2xl border p-5 md:p-6 space-y-6" style={cardStyle}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={kickerStyle}>
                Votre projet
              </h2>

              <fieldset>
                <legend className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Type d&apos;activité
                </legend>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {ACTIVITES.map((a) => {
                    const actif = activite === a.key;
                    return (
                      <button
                        key={a.key}
                        type="button"
                        onClick={() => setActivite(a.key)}
                        aria-pressed={actif}
                        className="rounded-xl border p-3 text-left transition-all"
                        style={{
                          borderColor: actif ? "var(--primary)" : "var(--border)",
                          background: actif ? "rgba(13,79,60,0.06)" : "transparent",
                        }}
                      >
                        <span className="block text-sm font-semibold" style={{ color: actif ? "var(--primary)" : "var(--foreground)" }}>
                          {a.label}
                        </span>
                        <span className="mt-0.5 block text-[11px]" style={{ color: "var(--muted)" }}>
                          {a.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <NumberField label="Chiffre d'affaires annuel HT" value={ca} onChange={setCa} suffix="€/an" />
                <NumberField label="Charges annuelles" value={charges} onChange={setCharges} suffix="€/an" hint="Achats, matériel, déplacements, loyer…" />
                <div>
                  <label htmlFor="situation" className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Situation du foyer
                  </label>
                  <select
                    id="situation"
                    value={couple ? "couple" : "seul"}
                    onChange={(e) => {
                      const estCouple = e.target.value === "couple";
                      setCouple(estCouple);
                      if (estCouple && num(parts, 1) < 2) setParts("2");
                      if (!estCouple && parts === "2") setParts("1");
                    }}
                    className="mt-1 w-full rounded-xl border px-4 py-2.5 text-lg font-bold"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)", background: "var(--surface)" }}
                  >
                    <option value="seul">Personne seule</option>
                    <option value="couple">Couple marié ou pacsé</option>
                  </select>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                    Imposition commune si marié ou pacsé.
                  </p>
                </div>
                <div>
                  <label htmlFor="parts" className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Parts fiscales du foyer
                  </label>
                  <select
                    id="parts"
                    value={parts}
                    onChange={(e) => setParts(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-2.5 text-lg font-bold"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)", background: "var(--surface)" }}
                  >
                    {PARTS_OPTIONS.filter((p) => !couple || parseFloat(p) >= 2).map((p) => (
                      <option key={p} value={p}>
                        {p.replace(".", ",")} {p === "1" ? "part" : "parts"}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                    Hypothèse : aucun autre revenu dans le foyer.
                  </p>
                </div>
              </div>
              {!couple && num(parts, 1) >= 1.5 && (
                <label className="-mt-2 flex items-start gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                  <input
                    type="checkbox"
                    checked={parentIsole}
                    onChange={(e) => setParentIsole(e.target.checked)}
                    className="mt-0.5 h-4 w-4"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span>
                    Parent isolé (case T)
                    <span className="block text-xs" style={{ color: "var(--muted)" }}>
                      Vous vivez seul avec vos enfants à charge (2 parts avec 1 enfant en garde exclusive).
                    </span>
                  </span>
                </label>
              )}
              {!couple && num(parts, 1) >= 2 && !parentIsole && (
                <p className="mt-3 rounded-lg border-l-4 px-3 py-2 text-xs" style={{ borderColor: "var(--accent)", background: "var(--surface-alt)", color: "var(--foreground)" }}>
                  Marié ou pacsé ? Choisissez « Couple » : une personne seule avec 2 parts ou plus est soumise au
                  plafonnement du quotient familial. Si vous élevez seul vos enfants, cochez « Parent isolé ».
                </p>
              )}

              {/* Répartition */}
              <div className="rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="split" className="text-xs font-semibold uppercase tracking-[0.12em]" style={kickerStyle}>
                    EURL / SASU : rémunération / dividendes
                  </label>
                  <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                    {optimiser ? "Optimisée" : `${pctRemu} % / ${100 - pctRemu} %`}
                  </span>
                </div>
                <input
                  id="split"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={pctRemu}
                  disabled={optimiser}
                  onChange={(e) => setPctRemu(parseInt(e.target.value, 10))}
                  className="mt-3 w-full accent-[#e8963e] disabled:opacity-40"
                />
                <div className="mt-1 flex justify-between text-[10px]" style={{ color: "var(--muted)" }}>
                  <span>100 % dividendes</span>
                  <span>100 % rémunération</span>
                </div>
                <label className="mt-3 flex items-start gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                  <input type="checkbox" checked={optimiser} onChange={(e) => setOptimiser(e.target.checked)} className="mt-1" />
                  <span>
                    Utiliser la répartition qui maximise le net pour chaque statut
                    <span className="block text-[11px]" style={{ color: "var(--muted)" }}>
                      Optimum indicatif : SASU {optimumSasu.pct} % de salaire, EURL {optimumEurl.pct} % de rémunération.
                    </span>
                  </span>
                </label>
                <p className="mt-2 text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                  Pourcentage du résultat disponible (CA − charges − frais) consacré à la rémunération, charges sociales
                  comprises. Le reste, après IS, est distribué en dividendes.
                </p>
              </div>

              {/* Critères */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ToggleCard
                  checked={protegerPatrimoine}
                  onChange={setProtegerPatrimoine}
                  title="Protéger au maximum mon patrimoine personnel"
                  desc="Activité à risque, emprunts, stock important."
                />
                <ToggleCard
                  checked={associes}
                  onChange={setAssocies}
                  title="Associés ou levée de fonds envisagés"
                  desc="Faire entrer un associé ou des investisseurs."
                />
                <ToggleCard
                  checked={are}
                  onChange={setAre}
                  title="Je perçois l'allocation chômage (ARE)"
                  desc="Droits ouverts auprès de France Travail."
                />
                <ToggleCard
                  checked={inclureFrais}
                  onChange={setInclureFrais}
                  title="Inclure les frais annuels estimés"
                  desc="Expert-comptable, banque pro, juridique."
                />
              </div>

              {are && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberField label="ARE mensuelle brute" value={areMensuel} onChange={setAreMensuel} suffix="€/mois" />
                  <NumberField label="Mois de droits restants" value={areMois} onChange={setAreMois} suffix="mois" hint="Simulation limitée à 12 mois." />
                </div>
              )}

              <details>
                <summary className="cursor-pointer text-sm font-semibold" style={{ color: "var(--muted)" }}>
                  Paramètre avancé
                </summary>
                <div className="mt-3 max-w-xs">
                  <NumberField
                    label="Capital + comptes courants (EURL)"
                    value={capitalEurl}
                    onChange={setCapitalEurl}
                    suffix="€"
                    hint="Au-delà de 10 % de ce montant, les dividendes d'EURL supportent les cotisations TNS."
                  />
                </div>
              </details>
            </div>

            {/* ═══ Recommandation ═══ */}
            <div
              className="animate-fade-up rounded-2xl border-2 p-6 md:p-7"
              style={{ background: "var(--surface)", borderColor: "var(--primary)" }}
              aria-live="polite"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={kickerStyle}>
                Notre recommandation
              </p>
              <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-3xl tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {STATUT_LABELS[recoKey]}
                </h2>
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                    {eur(recoRes.netMensuel)} <span className="text-sm font-normal" style={{ color: "var(--muted)" }}>net / mois</span>
                  </p>
                  {recoRes.areRecue > 0 && (
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      + {eur(recoRes.areRecue)} d&apos;ARE estimée sur 12 mois
                    </p>
                  )}
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {reco.raisons.map((r) => (
                  <li key={r} className="flex gap-2 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    <span style={{ color: "var(--primary)" }} aria-hidden>
                      ✓
                    </span>
                    {r}
                  </li>
                ))}
              </ul>

              {reco.vigilance.length > 0 && (
                <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "#e8963e66", background: "#e8963e0f" }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                    Points de vigilance
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {reco.vigilance.map((v) => (
                      <li key={v} className="flex gap-2 text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
                        <span aria-hidden>⚠️</span>
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prochaines étapes */}
              <div className="mt-5 rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {estSociete
                    ? `Créer votre ${recoKey === "sasu" ? "SASU" : "EURL"} : les 4 étapes`
                    : `Démarrer en ${STATUT_LABELS[recoKey].toLowerCase()} : les 4 étapes`}
                </p>
                <ol className="mt-3 space-y-2">
                  {ETAPES[recoKey].map((e, idx) => (
                    <li key={e} className="flex gap-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: "var(--primary)" }}
                        aria-hidden
                      >
                        {idx + 1}
                      </span>
                      {e}
                    </li>
                  ))}
                </ol>
                <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  {estSociete
                    ? `Budget de création : environ ${eur(COUTS_CREATION[recoKey].total)} TTC de frais obligatoires, hors accompagnement (service en ligne de création, avocat ou expert-comptable). Prévoyez aussi un compte professionnel pour déposer le capital.`
                    : recoKey === "micro"
                      ? "Formalité de création gratuite en micro-entreprise (23,21 € pour un agent commercial). Un compte bancaire séparé simplifie le suivi et les contrôles."
                      : "Formalité de 0 € (libéral) à 21,74 € (commercial) ou 45 € (artisanal) en EI au réel. Un compte professionnel séparé simplifie la comptabilité."}
                </p>
              </div>
            </div>

            {/* ═══ Barres de comparaison ═══ */}
            <div className="rounded-2xl border p-6" style={cardStyle}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={kickerStyle}>
                Revenu net disponible par statut
              </h3>
              <div className="mt-4 space-y-3">
                {STATUTS.map((k) => {
                  const r = resultats[k];
                  const w = (Math.max(0, r.netAnnuel) / maxTotal) * 100;
                  const wAre = (r.areRecue / maxTotal) * 100;
                  return (
                    <div key={k} style={{ opacity: r.eligible ? 1 : 0.45 }}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold" style={{ color: k === recoKey ? "var(--primary)" : "var(--foreground)" }}>
                          {STATUT_LABELS[k]} {k === recoKey ? "★" : ""} {!r.eligible ? "(non éligible)" : ""}
                        </span>
                        <span style={{ color: "var(--muted)" }}>
                          {eur(r.netAnnuel)} / an{r.areRecue > 0 ? ` + ${eur(r.areRecue)} ARE` : ""}
                        </span>
                      </div>
                      <div className="mt-1 flex h-6 overflow-hidden rounded-md" style={{ background: "var(--surface-alt)" }}>
                        <div style={{ width: `${w}%`, background: k === recoKey ? "var(--primary)" : "var(--primary-light)" }} />
                        {wAre > 0 && <div style={{ width: `${wAre}%`, background: "var(--accent-light)" }} title="ARE conservée" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ═══ Tableau comparatif ═══ */}
            <div className="rounded-2xl border" style={cardStyle}>
              <div className="p-6 pb-3">
                <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  Comparatif détaillé des 4 statuts
                </h2>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Montants annuels pour la première année pleine. Faites défiler horizontalement sur mobile.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="sticky left-0 p-3 text-left text-[10px] font-semibold uppercase tracking-wider" style={{ background: "var(--surface)", color: "var(--muted)" }}>
                        Critère
                      </th>
                      {STATUTS.map((k) => (
                        <th
                          key={k}
                          className="p-3 text-left text-xs font-bold uppercase tracking-wider"
                          style={{
                            color: k === recoKey ? "var(--primary)" : "var(--foreground)",
                            background: k === recoKey ? "rgba(13,79,60,0.07)" : "transparent",
                          }}
                        >
                          {STATUT_LABELS[k]}
                          {k === recoKey && <span className="ml-1 normal-case">★ recommandé</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.label} style={{ borderTop: "1px solid var(--border)" }}>
                        <th
                          scope="row"
                          className="sticky left-0 p-3 text-left align-top text-xs font-semibold"
                          style={{ background: "var(--surface)", color: "var(--foreground)" }}
                        >
                          {row.label}
                          {row.hint && (
                            <span className="mt-0.5 block text-[10px] font-normal leading-snug" style={{ color: "var(--muted)" }}>
                              {row.hint}
                            </span>
                          )}
                        </th>
                        {STATUTS.map((k) => (
                          <td
                            key={k}
                            className={`p-3 align-top ${row.strong ? "font-bold" : ""}`}
                            style={{
                              background: k === recoKey ? "rgba(13,79,60,0.05)" : "transparent",
                              color: row.strong ? (k === recoKey ? "var(--primary)" : "var(--foreground)") : "var(--muted)",
                              fontFamily: row.strong ? "var(--font-display)" : undefined,
                              opacity: resultats[k].eligible || row.label === "Éligibilité" ? 1 : 0.55,
                            }}
                          >
                            {row.cell(k)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ═══ Coûts de création ═══ */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(["eurl", "sasu"] as const).map((k) => (
                <div key={k} className="rounded-2xl border p-5" style={cardStyle}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={kickerStyle}>
                    Créer une {k === "sasu" ? "SASU" : "EURL"} en 2026
                  </h3>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <CostLine label="Immatriculation (greffe)" value={COUTS_CREATION[k].greffe} />
                    <CostLine label="Déclaration des bénéficiaires effectifs" value={COUTS_CREATION[k].beneficiaires} />
                    <CostLine label={`Annonce légale (${k === "sasu" ? "142" : "124"} € HT, métropole)`} value={COUTS_CREATION[k].annonce} />
                    <div className="flex justify-between border-t pt-1.5 font-bold" style={{ borderColor: "var(--border)" }}>
                      <dt>Total obligatoire</dt>
                      <dd style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                        {COUTS_CREATION[k].total.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-2 text-[11px] leading-relaxed" style={{ color: "var(--muted)" }}>
                    Hors rédaction des statuts (gratuite si vous la faites vous-même) et dépôt du capital. Micro-entreprise :
                    formalité gratuite ; EI au réel : 0 à 45 € selon l&apos;activité.
                  </p>
                </div>
              ))}
            </div>

            {/* ═══ Hypothèses ═══ */}
            <div className="rounded-2xl border p-6" style={cardStyle}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={kickerStyle}>
                Hypothèses et simplifications
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>
                  Micro : cotisations de {pct(MICRO_TAUX[activite])} du CA, abattement fiscal de {pct(MICRO_ABATTEMENT[activite])}{" "}
                  (305 € minimum), impôt au barème (pas de versement libératoire), sans ACRE ni CFP. Plafond {eur(MICRO_PLAFOND[activite])}.
                </li>
                <li>
                  EI au réel et gérant d&apos;EURL : cotisations TNS forfaitisées à {pct(TAUX_TNS)} du revenu net (le barème réel
                  est progressif, avec des cotisations minimales à faible revenu).
                </li>
                <li>
                  SASU : charges patronales {pct(TAUX_PATRONAL_SASU)} et salariales {pct(TAUX_SALARIAL_SASU)} du brut ; taxe PUMa si
                  la rémunération est inférieure à 20 % du PASS ({eur(PASS_2026 * 0.2)}).
                </li>
                <li>
                  IS à 15 % jusqu&apos;à 42 500 € puis 25 % ; bénéfice entièrement distribué ; dividendes au PFU de 31,4 % (12,8 % d&apos;impôt
                  + 18,6 % de prélèvements sociaux).
                </li>
                <li>
                  Impôt sur le revenu : barème 2026 avec quotient familial, plafonnement (case T des parents isolés comprise) et décote, abattement de 10 % sur les
                  rémunérations de dirigeant, aucun autre revenu dans le foyer. EI au réel et EURL / SASU à l&apos;IR (options) non modélisées.
                </li>
                <li>
                  Franchise de TVA jusqu&apos;à {eur(SEUIL_TVA[activite])} de CA pour votre activité ; la TVA ne change pas le revenu
                  net mais vos prix TTC. CFE (due par tous les statuts dès la 2ᵉ année) non incluse.
                </li>
                <li>
                  Frais annuels : moyennes indicatives (EI {eur(FRAIS_ANNUELS.ei.total)}, EURL {eur(FRAIS_ANNUELS.eurl.total)}, SASU{" "}
                  {eur(FRAIS_ANNUELS.sasu.total)}). Ils sont déductibles au réel, pas en micro.
                </li>
                <li>
                  Recommandation : 100 points pour le meilleur total (net + ARE), −1 point par % d&apos;écart, puis bonus simplicité
                  (micro +8, EI +3), protection du patrimoine (société +5) et associés (SASU +25, EURL +5).
                </li>
              </ul>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Résultat indicatif, qui ne remplace pas l&apos;avis d&apos;un expert-comptable ou d&apos;un avocat. Sources : urssaf.fr,
                entreprendre.service-public.gouv.fr, impots.gouv.fr, legifrance.gouv.fr, inpi.fr, bpifrance-creation.fr.
              </p>
            </div>

            {/* ═══ Liens internes ═══ */}
            <div className="rounded-2xl border p-6" style={cardStyle}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={kickerStyle}>
                Pour aller plus loin
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <CrossLinkCard href="/outils/simulateur-auto-entrepreneur" emoji="📊" title="Simulateur auto-entrepreneur" desc="Cotisations, ACRE, versement libératoire et CFE en détail." />
                <CrossLinkCard href="/outils/freelance-vs-cdi" emoji="💼" title="Freelance vs CDI" desc="Comparez votre futur net avec un salaire en CDI." />
                <CrossLinkCard href="/outils/calculateur-tjm-freelance" emoji="🧮" title="Calculateur de TJM" desc="Le tarif journalier pour atteindre votre objectif de revenu." />
                <CrossLinkCard href="/outils/generateur-facture" emoji="📄" title="Générateur de factures" desc="Vos premières factures conformes, en PDF." />
              </div>
            </div>

            {/* ═══ Contenu SEO ═══ */}
            <div className="rounded-2xl border p-8" style={cardStyle}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Micro, EI, EURL ou SASU : les grandes règles pour choisir
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Le bon statut dépend moins d&apos;un « meilleur statut » universel que de trois paramètres : votre niveau de
                  chiffre d&apos;affaires, le poids de vos charges réelles et vos projets (associés, protection sociale, chômage).
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>
                    <strong style={{ color: "var(--foreground)" }}>Micro-entreprise</strong> : idéale pour tester une activité ou
                    démarrer avec peu de charges. Cotisations proportionnelles au CA, comptabilité minimale, plafonds de 83 600 €
                    (services) et 203 100 € (vente).
                  </li>
                  <li>
                    <strong style={{ color: "var(--foreground)" }}>EI au réel</strong> : pour déduire des charges importantes sans
                    créer de société. Patrimoine personnel protégé par défaut depuis 2022.
                  </li>
                  <li>
                    <strong style={{ color: "var(--foreground)" }}>EURL à l&apos;IS</strong> : cotisations sociales plus légères,
                    bien adaptée à une rémunération régulière ; dividendes pénalisés au-delà de 10 % du capital.
                  </li>
                  <li>
                    <strong style={{ color: "var(--foreground)" }}>SASU</strong> : statut d&apos;assimilé salarié, souplesse des
                    dividendes, image rassurante pour les clients et les investisseurs, mais charges sur salaire plus lourdes.
                  </li>
                </ul>
              </div>
            </div>

            <ToolHowToSection
              title="Comment choisir son statut juridique en 3 étapes"
              description="Le comparateur applique les règles 2026 à votre projet et explique sa recommandation."
              steps={[
                {
                  name: "Décrivez votre activité et vos chiffres",
                  text: "Choisissez votre type d'activité (vente, services BIC ou libéral BNC), puis saisissez le chiffre d'affaires et les charges attendus sur une année pleine, ainsi que les parts fiscales de votre foyer.",
                },
                {
                  name: "Indiquez vos priorités",
                  text: "Précisez si vous voulez protéger votre patrimoine, accueillir des associés ou lever des fonds, et si vous percevez l'ARE. Réglez la répartition salaire / dividendes ou laissez l'outil l'optimiser.",
                },
                {
                  name: "Comparez et passez à l'action",
                  text: "Lisez le tableau (cotisations, impôts, net, retraite, coûts) et la recommandation argumentée, vérifiez les points de vigilance puis suivez les 4 étapes de création proposées pour le statut retenu.",
                },
              ]}
            />

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus posées avant de créer son entreprise."
              items={[
                {
                  question: "Quel statut juridique choisir pour créer son entreprise en 2026 ?",
                  answer:
                    "Pour démarrer seul avec peu de charges, la micro-entreprise reste la plus simple : formalité gratuite, cotisations en pourcentage du CA (25,6 % en libéral BNC, 21,2 % en services BIC, 12,3 % en vente). Si vos charges dépassent l'abattement forfaitaire, l'EI au réel ou une société devient plus intéressante. Dès que vous visez des associés, des investisseurs ou un CA au-delà des plafonds micro, la SASU ou l'EURL s'imposent. Le comparateur ci-dessus chiffre ces options pour votre cas.",
                },
                {
                  question: "Micro-entreprise ou SASU : que choisir ?",
                  answer:
                    "La micro-entreprise est plus rentable tant que le CA est modeste et les charges faibles, car les cotisations s'appliquent au CA sans frais de comptabilité. La SASU devient pertinente avec un CA élevé ou proche du plafond de 83 600 € (services), des charges importantes, un besoin de crédibilité ou des droits au chômage à préserver : un président sans salaire conserve en principe son ARE. En contrepartie, la SASU coûte environ 220 € à créer et 2 000 € par an en comptabilité.",
                },
                {
                  question: "EURL ou SASU : quelle différence ?",
                  answer:
                    "Le gérant majoritaire d'EURL est travailleur non salarié : ses cotisations (environ 45 % du net) sont nettement plus faibles que celles d'un président de SASU (plus de 80 % du net en cumulant charges patronales et salariales), mais ses dividendes au-delà de 10 % du capital supportent les cotisations sociales. La SASU offre le régime général, des dividendes au PFU de 31,4 % sans cotisations et une plus grande souplesse pour accueillir des associés. En résumé : EURL pour se verser surtout un salaire, SASU pour mixer salaire et dividendes ou préparer une levée de fonds.",
                },
                {
                  question: "Combien coûte la création d'une entreprise en 2026 ?",
                  answer:
                    "La création d'une micro-entreprise est gratuite (23,21 € pour un agent commercial) ; une EI au réel coûte 0 € en libéral, 21,74 € en commercial et 45 € en artisanal. Pour une société commerciale, comptez 33,83 € de formalité, 19,33 € de déclaration des bénéficiaires effectifs et l'annonce légale au forfait 2026 : 142 € HT pour une SASU, 124 € HT pour une EURL, 199 € HT pour une SAS et 148 € HT pour une SARL en métropole. Soit environ 224 € TTC pour une SASU et 202 € TTC pour une EURL, hors accompagnement juridique optionnel.",
                },
                {
                  question: "Quand faut-il quitter la micro-entreprise ?",
                  answer:
                    "Obligatoirement si votre CA dépasse le plafond (83 600 € en services et BNC, 203 100 € en vente pour 2026 à 2028) deux années civiles consécutives. En pratique, il est souvent intéressant de passer au réel ou en société avant : quand vos charges réelles dépassent l'abattement forfaitaire, quand vous devenez redevable de la TVA (au-delà de 37 500 € en services ou 85 000 € en vente) ou quand vous voulez optimiser salaire et dividendes.",
                },
                {
                  question: "Peut-on garder le chômage (ARE) en créant son entreprise ?",
                  answer:
                    "Oui. Vous pouvez cumuler l'ARE avec vos revenus d'activité : l'allocation mensuelle est réduite de 70 % des revenus déclarés. En micro-entreprise, le revenu retenu est le CA après abattement. En SASU ou EURL, un dirigeant qui ne se verse pas de rémunération conserve en principe l'intégralité de son ARE. Autre option : l'ARCE, qui verse 60 % des droits restants en capital en deux fois. Faites toujours valider votre situation par France Travail.",
                },
                {
                  question: "Mon patrimoine personnel est-il protégé en entreprise individuelle ?",
                  answer:
                    "Depuis le 15 mai 2022, oui par défaut : les créanciers professionnels ne peuvent saisir que le patrimoine professionnel de l'entrepreneur individuel, micro-entrepreneurs compris. Des exceptions existent : fraude, manquements graves aux obligations fiscales ou sociales, ou renonciation au profit d'un créancier (souvent une banque). En EURL et SASU, la responsabilité est limitée aux apports, mais une caution personnelle donnée à la banque engage aussi vos biens.",
                },
                {
                  question: "Peut-on changer de statut juridique plus tard ?",
                  answer:
                    "Oui. Beaucoup d'entrepreneurs démarrent en micro-entreprise puis créent une société quand l'activité se développe, en apportant ou en cédant leur fonds. Une EURL peut aussi être transformée en SASU (et inversement). Chaque changement a un coût (formalités, annonce légale, éventuellement commissaire à la transformation) : autant choisir un statut adapté à vos 2 ou 3 prochaines années.",
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
/*  SOUS-COMPOSANTS                                                        */
/* ═══════════════════════════════════════════════════════════════════════ */

function NumberField({
  label,
  value,
  onChange,
  suffix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  hint?: string;
}) {
  const id = `f-${label.replace(/[^a-z]/gi, "").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border px-4 py-2.5 pr-16 text-lg font-bold"
          style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)", background: "var(--surface)" }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--muted)" }}>
          {suffix}
        </span>
      </div>
      {hint && (
        <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function ToggleCard({
  checked,
  onChange,
  title,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  desc: string;
}) {
  return (
    <label
      className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all"
      style={{
        borderColor: checked ? "var(--primary)" : "var(--border)",
        background: checked ? "rgba(13,79,60,0.06)" : "transparent",
      }}
    >
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1" />
      <span>
        <span className="block text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {title}
        </span>
        <span className="block text-[11px]" style={{ color: "var(--muted)" }}>
          {desc}
        </span>
      </span>
    </label>
  );
}

function CostLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between gap-3">
      <dt style={{ color: "var(--muted)" }}>{label}</dt>
      <dd className="font-medium">{value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</dd>
    </div>
  );
}

function CrossLinkCard({ href, emoji, title, desc }: { href: string; emoji: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {title}{" "}
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
