"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";
import {
  CATEGORIE_INFO,
  CLASSES,
  ECRETEMENT_AMPLEUR,
  ECRETEMENT_GESTE,
  GESTES,
  GESTES_EXCLUS,
  MAR_PLAFOND,
  MAR_TAUX,
  TAUX_AMPLEUR,
  calculerAmpleur,
  calculerGeste,
  determinerCategorie,
  plafondsRessources,
} from "./calcul";
import type { ClasseDpe, GesteId, Zone } from "./calcul";

// Règles et sources : voir ./calcul.ts (guide Anah « Les aides financières en 2026 » édition septembre 2026,
// fiche service-public F35083 vérifiée le 01/09/2026, actualité service-public A18332 du 27/08/2026).

type Parcours = "geste" | "ampleur";

const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR") + " €";
const pct = (n: number) => Math.round(n * 100) + " %";

const cardStyle = { background: "var(--surface)", borderColor: "var(--border)" };
const labelCls = "text-xs font-semibold uppercase tracking-wider";
const inputCls = "mt-2 w-full rounded-xl border px-4 py-3 text-lg font-semibold";

type LigneEtat = { actif: boolean; cout: string; cee: string };

const ETAT_INITIAL_GESTES: Record<GesteId, LigneEtat> = GESTES.reduce(
  (acc, g) => {
    acc[g.id] = { actif: g.id === "pac-air-eau", cout: String(g.coutIndicatif), cee: "0" };
    return acc;
  },
  {} as Record<GesteId, LigneEtat>
);

const FAQ = [
  {
    question: "Comment fonctionne ce simulateur MaPrimeRénov’ 2026 ?",
    answer:
      "Le simulateur détermine d’abord votre catégorie de revenus (bleu, jaune, violet ou rose) à partir du revenu fiscal de référence, du nombre de personnes du foyer et de la localisation (Île-de-France ou autres régions). Il applique ensuite le barème Anah en vigueur : forfaits pour une rénovation par geste, ou pourcentage des travaux HT plafonnés pour une rénovation d’ampleur, avec les règles d’écrêtement. Le résultat est une estimation : seule l’Anah fixe le montant définitif après instruction du dossier.",
  },
  {
    question: "Quels sont les plafonds de ressources MaPrimeRénov’ en 2026 ?",
    answer:
      "Au 1er janvier 2026, pour une personne seule hors Île-de-France, les plafonds sont de 17 363 € (très modestes, bleu), 22 259 € (modestes, jaune) et 31 185 € (intermédiaires, violet) ; au-delà, le ménage est en catégorie supérieure (rose). En Île-de-France, ils sont de 24 031 €, 29 253 € et 40 851 €. Pour un couple hors Île-de-France : 25 393 €, 32 553 € et 45 842 €. Le revenu retenu est le revenu fiscal de référence N-1, soit celui de 2025 pour une demande déposée en 2026.",
  },
  {
    question: "Quel est le montant de MaPrimeRénov’ pour une pompe à chaleur en 2026 ?",
    answer:
      "Pour une pompe à chaleur air/eau, le forfait est de 5 000 € (très modestes), 4 000 € (modestes) ou 3 000 € (intermédiaires), avec un plafond de dépense éligible de 12 000 €. Pour une pompe à chaleur géothermique ou solarothermique : 11 000 €, 9 000 € ou 6 000 €, dans la limite de 18 000 € de dépense. Les ménages aux revenus supérieurs ne sont pas éligibles au parcours par geste. La pompe à chaleur air/air n’est pas financée par MaPrimeRénov’.",
  },
  {
    question: "Quels travaux ne sont plus financés par MaPrimeRénov’ par geste depuis le 1er septembre 2026 ?",
    answer:
      "Depuis le 1er septembre 2026 (décret n° 2026-822 du 25 août 2026), le parcours par geste est recentré sur le chauffage décarboné : pompes à chaleur air/eau et géothermiques, raccordement à un réseau de chaleur, dépose de cuve à fioul et audit énergétique. L’isolation (murs, combles, rampants, toitures-terrasses), la ventilation, les chaudières et poêles à bois ou granulés, les chauffe-eau thermodynamiques et les équipements solaires thermiques ne sont plus financés par geste. Certains restent aidés par les certificats d’économies d’énergie (CEE).",
  },
  {
    question: "Combien peut-on toucher avec MaPrimeRénov’ rénovation d’ampleur ?",
    answer:
      "L’aide représente 80 % (très modestes), 60 % (modestes), 45 % (intermédiaires) ou 10 % (supérieurs) du montant HT des travaux, dans la limite de 30 000 € HT de dépenses pour un gain de 2 classes DPE et de 40 000 € HT pour un gain de 3 classes ou plus. Le logement doit être classé E, F ou G, avoir au moins 15 ans, et les travaux doivent inclure au moins deux gestes d’isolation. Le total des aides est écrêté à 100 %, 90 %, 80 % ou 50 % du montant TTC selon la catégorie.",
  },
  {
    question: "Mon Accompagnateur Rénov’ est-il obligatoire ?",
    answer:
      "Oui pour la rénovation d’ampleur : Mon Accompagnateur Rénov’ réalise l’audit, aide à bâtir le plan de financement, fournit une liste d’artisans RGE et suit le chantier. Sa prestation est prise en charge dans la limite de 2 000 € TTC à 100 % (très modestes), 80 % (modestes), 40 % (intermédiaires) ou 20 % (supérieurs). Un rendez-vous avec un conseiller France Rénov’ est également obligatoire avant le dépôt de la demande. Pour un geste, l’accompagnement est facultatif.",
  },
  {
    question: "Peut-on cumuler MaPrimeRénov’ avec les CEE et l’éco-PTZ ?",
    answer:
      "Pour une rénovation par geste, MaPrimeRénov’ se cumule avec les primes CEE, mais le total MaPrimeRénov’ + CEE est plafonné à 90 %, 75 % ou 60 % de la dépense éligible TTC selon la catégorie, et 100 % toutes aides confondues. Pour une rénovation d’ampleur, MaPrimeRénov’ n’est pas cumulable avec les CEE, mais l’est avec les aides locales. Dans les deux cas, le reste à charge peut être financé par un éco-prêt à taux zéro MaPrimeRénov’ jusqu’à 50 000 € sur 20 ans.",
  },
  {
    question: "Les propriétaires bailleurs ont-ils droit à MaPrimeRénov’ ?",
    answer:
      "Oui. Les propriétaires bailleurs sont éligibles aux deux parcours, selon leurs propres revenus. Ils doivent s’engager à louer le logement en résidence principale pendant au moins 6 ans, dans un délai d’un an après la demande de solde, et à déduire l’aide d’une éventuelle hausse de loyer. En cas d’arrêt de la location avant 6 ans, l’aide est remboursée à raison d’un sixième par année non louée.",
  },
];

const HOWTO = [
  {
    name: "Renseignez votre foyer",
    text: "Indiquez le nombre de personnes, votre revenu fiscal de référence 2025 et si vous habitez en Île-de-France : le simulateur affiche votre catégorie MaPrimeRénov’ (bleu, jaune, violet ou rose).",
  },
  {
    name: "Choisissez votre projet",
    text: "Rénovation par geste (pompe à chaleur, réseau de chaleur, dépose de cuve à fioul, audit) avec le coût de chaque devis, ou rénovation d’ampleur avec la classe DPE actuelle, le gain visé et le montant HT des travaux.",
  },
  {
    name: "Lisez le montant et le reste à charge",
    text: "Le simulateur calcule l’aide après écrêtement, l’aide à l’accompagnement, le reste à charge et rappelle les cumuls possibles (CEE, éco-PTZ). Faites ensuite chiffrer vos travaux par des professionnels RGE pour fiabiliser le plan de financement.",
  },
];

function Toggle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className="rounded-xl border px-3 py-3 text-sm font-semibold transition-colors"
            style={{
              borderColor: active ? "var(--primary)" : "var(--border)",
              background: active ? "var(--primary)" : "var(--surface)",
              color: active ? "#fff" : "var(--foreground)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Ligne({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={"flex justify-between gap-4" + (strong ? " font-semibold" : "")} style={strong ? { color: "var(--foreground)" } : undefined}>
      <span>{label}</span>
      <span className="whitespace-nowrap font-semibold" style={{ color: "var(--foreground)" }}>{value}</span>
    </div>
  );
}

function AVerifier() {
  return (
    <span className="ml-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: "#e8963e22", color: "#b45309" }}>
      à vérifier
    </span>
  );
}

export default function SimulateurMaPrimeRenov() {
  const [nbPersonnes, setNbPersonnes] = useState("2");
  const [rfr, setRfr] = useState("32000");
  const [zone, setZone] = useState<Zone>("hors-idf");
  const [statut, setStatut] = useState<"occupant" | "bailleur">("occupant");
  const [plus15Ans, setPlus15Ans] = useState(true);
  const [parcours, setParcours] = useState<Parcours>("geste");

  // Geste
  const [gestes, setGestes] = useState<Record<GesteId, LigneEtat>>(ETAT_INITIAL_GESTES);
  const [remplacementFioul, setRemplacementFioul] = useState(false);

  // Ampleur
  const [classeAvant, setClasseAvant] = useState<ClasseDpe>("F");
  const [gain, setGain] = useState("2");
  const [montantHT, setMontantHT] = useState("35000");
  const [tva, setTva] = useState("0.055");
  const [aidesLocales, setAidesLocales] = useState("0");
  const [coutMar, setCoutMar] = useState("2000");
  const [maison, setMaison] = useState(true);
  const [conserveGazFioul, setConserveGazFioul] = useState(false);
  const [deuxIsolations, setDeuxIsolations] = useState(true);

  const nb = Math.min(Math.max(parseInt(nbPersonnes) || 1, 1), 12);
  const revenu = Math.max(0, parseFloat(rfr) || 0);
  const categorie = determinerCategorie(zone, nb, revenu);
  const plafonds = plafondsRessources(zone, nb);
  const info = CATEGORIE_INFO[categorie];

  const resGeste = useMemo(
    () =>
      calculerGeste({
        categorie,
        logementPlus15Ans: plus15Ans,
        remplacementFioul,
        lignes: GESTES.filter((g) => gestes[g.id].actif).map((g) => ({
          id: g.id,
          coutTTC: parseFloat(gestes[g.id].cout) || 0,
          cee: parseFloat(gestes[g.id].cee) || 0,
        })),
      }),
    [categorie, plus15Ans, remplacementFioul, gestes]
  );

  const resAmpleur = useMemo(
    () =>
      calculerAmpleur({
        categorie,
        logementPlus15Ans: plus15Ans,
        proprietaireOccupant: statut === "occupant",
        maisonIndividuelle: maison,
        conserveGazFioul,
        deuxGestesIsolation: deuxIsolations,
        classeAvant,
        gain: parseInt(gain) || 2,
        montantHT: parseFloat(montantHT) || 0,
        tauxTva: parseFloat(tva) || 0,
        aidesLocales: parseFloat(aidesLocales) || 0,
        coutMar: parseFloat(coutMar) || 0,
      }),
    [categorie, plus15Ans, statut, maison, conserveGazFioul, deuxIsolations, classeAvant, gain, montantHT, tva, aidesLocales, coutMar]
  );

  const updateGeste = (id: GesteId, patch: Partial<LigneEtat>) =>
    setGestes((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const totalAide = parcours === "geste" ? resGeste.totalPrime : resAmpleur.prime + resAmpleur.aideMar;
  const eligible = parcours === "geste" ? resGeste.eligible : resAmpleur.eligible;
  const motifs = parcours === "geste" ? resGeste.motifs : resAmpleur.motifs;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Immobilier · Rénovation énergétique</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>MaPrimeRénov’ 2026</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Catégorie de revenus, montant de la prime par geste ou en rénovation d’ampleur, écrêtement et reste à charge, selon les règles en vigueur après la réforme du 1er septembre 2026.
          </p>
          <p className="animate-fade-up stagger-3 mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--primary)" }}>
            Dernière vérification : septembre 2026 · barème Anah du 1er janvier 2026 et décret n° 2026-822
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 2xl:max-w-[1400px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Foyer */}
            <div className="rounded-2xl border p-6" style={cardStyle}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>1. Votre foyer</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="mpr-nb" className={labelCls} style={{ color: "var(--muted)" }}>Personnes dans le foyer</label>
                  <select id="mpr-nb" value={nbPersonnes} onChange={(e) => setNbPersonnes(e.target.value)} className={inputCls} style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} {n > 1 ? "personnes" : "personne"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="mpr-rfr" className={labelCls} style={{ color: "var(--muted)" }}>Revenu fiscal de référence 2025 (€)</label>
                  <input id="mpr-rfr" type="number" min={0} inputMode="numeric" value={rfr} onChange={(e) => setRfr(e.target.value)} className={inputCls} style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Somme des RFR de tous les membres du foyer (avis d’impôt 2026 sur les revenus 2025).</p>
                </div>
                <div>
                  <span className={labelCls} style={{ color: "var(--muted)" }}>Localisation du logement</span>
                  <Toggle value={zone} onChange={(v) => setZone(v as Zone)} options={[{ value: "idf", label: "Île-de-France" }, { value: "hors-idf", label: "Autres régions" }]} />
                </div>
                <div>
                  <span className={labelCls} style={{ color: "var(--muted)" }}>Vous êtes</span>
                  <Toggle value={statut} onChange={(v) => setStatut(v as "occupant" | "bailleur")} options={[{ value: "occupant", label: "Propriétaire occupant" }, { value: "bailleur", label: "Propriétaire bailleur" }]} />
                </div>
                <div className="sm:col-span-2">
                  <span className={labelCls} style={{ color: "var(--muted)" }}>Logement construit depuis au moins 15 ans ?</span>
                  <Toggle value={plus15Ans ? "oui" : "non"} onChange={(v) => setPlus15Ans(v === "oui")} options={[{ value: "oui", label: "Oui, 15 ans ou plus" }, { value: "non", label: "Non, moins de 15 ans" }]} />
                </div>
              </div>

              {/* Catégorie */}
              <div className="mt-6 rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold" style={{ background: info.hex + "1f", color: info.hex }}>
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: info.hex }} />
                    MaPrimeRénov’ {info.couleur}
                  </span>
                  <span className="text-sm font-semibold">{info.libelle}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  {(["tres-modeste", "modeste", "intermediaire", "superieur"] as const).map((c, i) => {
                    const ci = CATEGORIE_INFO[c];
                    const active = c === categorie;
                    return (
                      <div key={c} className="rounded-lg border p-2" style={{ borderColor: active ? ci.hex : "var(--border)", background: "var(--surface)" }}>
                        <p className="font-bold" style={{ color: ci.hex }}>{ci.couleur}</p>
                        <p style={{ color: "var(--muted)" }}>{i < 3 ? "jusqu’à " + fmt(plafonds[i]) : "au-delà de " + fmt(plafonds[2])}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                  Plafonds de ressources au 1er janvier 2026 ({zone === "idf" ? "Île-de-France" : "hors Île-de-France"}, {nb} {nb > 1 ? "personnes" : "personne"}). Source : guide Anah « Les aides financières en 2026 », édition septembre 2026.
                </p>
              </div>
            </div>

            {/* Projet */}
            <div className="rounded-2xl border p-6" style={cardStyle}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>2. Votre projet</h2>
              <Toggle value={parcours} onChange={(v) => setParcours(v as Parcours)} options={[{ value: "geste", label: "Rénovation par geste" }, { value: "ampleur", label: "Rénovation d’ampleur" }]} />

              {parcours === "geste" ? (
                <div className="mt-5 space-y-3">
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    Depuis le 1er septembre 2026, seul le chauffage décarboné est financé par geste. Cochez vos travaux et indiquez le montant TTC du devis et, si vous l’avez, la prime CEE proposée.
                  </p>
                  {GESTES.map((g) => {
                    const etat = gestes[g.id];
                    const forfaitsTxt = categorie === "superieur" ? "non éligible" : fmt(g.forfaits[["tres-modeste", "modeste", "intermediaire"].indexOf(categorie)]);
                    return (
                      <div key={g.id} className="rounded-xl border p-4" style={{ borderColor: etat.actif ? "var(--primary)" : "var(--border)" }}>
                        <label className="flex cursor-pointer items-start gap-3">
                          <input type="checkbox" checked={etat.actif} onChange={(e) => updateGeste(g.id, { actif: e.target.checked })} className="mt-1 h-4 w-4" style={{ accentColor: "var(--primary)" }} />
                          <span className="flex-1">
                            <span className="block text-sm font-semibold">{g.libelle}</span>
                            <span className="block text-xs" style={{ color: "var(--muted)" }}>
                              Forfait {info.couleur.toLowerCase()} : {forfaitsTxt} · plafond de dépense {fmt(g.plafondDepense)}
                            </span>
                          </span>
                        </label>
                        {etat.actif && (
                          <div className="mt-3 grid grid-cols-2 gap-3 pl-7">
                            <div>
                              <label htmlFor={"cout-" + g.id} className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Devis TTC (€)</label>
                              <input id={"cout-" + g.id} type="number" min={0} value={etat.cout} onChange={(e) => updateGeste(g.id, { cout: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 font-semibold" style={{ borderColor: "var(--border)" }} />
                            </div>
                            <div>
                              <label htmlFor={"cee-" + g.id} className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prime CEE (€)</label>
                              <input id={"cee-" + g.id} type="number" min={0} value={etat.cee} onChange={(e) => updateGeste(g.id, { cee: e.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 font-semibold" style={{ borderColor: "var(--border)" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!plus15Ans && (
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl p-4 text-sm" style={{ background: "var(--surface-alt)" }}>
                      <input type="checkbox" checked={remplacementFioul} onChange={(e) => setRemplacementFioul(e.target.checked)} className="mt-1 h-4 w-4" style={{ accentColor: "var(--primary)" }} />
                      <span>Les travaux remplacent une chaudière au fioul (seule exception admise pour un logement de moins de 15 ans, avec dépose de la cuve).</span>
                    </label>
                  )}
                  <details className="rounded-xl p-4 text-sm" style={{ background: "var(--surface-alt)" }}>
                    <summary className="cursor-pointer font-semibold">Travaux non financés par geste (règles au 1er septembre 2026)</summary>
                    <ul className="mt-3 ml-4 list-disc space-y-1" style={{ color: "var(--muted)" }}>
                      {GESTES_EXCLUS.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                      Décret n° 2026-822 et arrêtés du 25 août 2026. Ces travaux peuvent encore être aidés par les CEE (des bonifications « coup de pouce » soutiennent notamment les chauffe-eau thermodynamiques et solaires) ou intégrés à une rénovation d’ampleur.
                    </p>
                  </details>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="mpr-dpe" className={labelCls} style={{ color: "var(--muted)" }}>Classe DPE actuelle</label>
                    <select id="mpr-dpe" value={classeAvant} onChange={(e) => setClasseAvant(e.target.value as ClasseDpe)} className={inputCls} style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                      {CLASSES.map((c) => (
                        <option key={c} value={c}>Classe {c}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      Vous ne la connaissez pas ? <Link href="/outils/calculateur-dpe" className="font-semibold underline" style={{ color: "var(--primary)" }}>Estimez votre DPE</Link>.
                    </p>
                  </div>
                  <div>
                    <span className={labelCls} style={{ color: "var(--muted)" }}>Gain de classes visé</span>
                    <Toggle value={gain} onChange={setGain} options={[{ value: "2", label: "2 classes" }, { value: "3", label: "3 classes" }, { value: "4", label: "4 et +" }]} />
                  </div>
                  <div>
                    <label htmlFor="mpr-ht" className={labelCls} style={{ color: "var(--muted)" }}>Montant des travaux HT (€)</label>
                    <input id="mpr-ht" type="number" min={0} value={montantHT} onChange={(e) => setMontantHT(e.target.value)} className={inputCls} style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                  <div>
                    <label htmlFor="mpr-tva" className={labelCls} style={{ color: "var(--muted)" }}>TVA applicable</label>
                    <select id="mpr-tva" value={tva} onChange={(e) => setTva(e.target.value)} className={inputCls} style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                      <option value="0.055">5,5 % (rénovation énergétique)</option>
                      <option value="0.1">10 % (travaux induits)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="mpr-locales" className={labelCls} style={{ color: "var(--muted)" }}>Aides locales (€, hors CEE)</label>
                    <input id="mpr-locales" type="number" min={0} value={aidesLocales} onChange={(e) => setAidesLocales(e.target.value)} className={inputCls} style={{ borderColor: "var(--border)" }} />
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Les CEE ne sont pas cumulables avec la rénovation d’ampleur.</p>
                  </div>
                  <div>
                    <label htmlFor="mpr-mar" className={labelCls} style={{ color: "var(--muted)" }}>Coût de Mon Accompagnateur Rénov’ TTC (€)</label>
                    <input id="mpr-mar" type="number" min={0} value={coutMar} onChange={(e) => setCoutMar(e.target.value)} className={inputCls} style={{ borderColor: "var(--border)" }} />
                  </div>
                  <div className="sm:col-span-2">
                    <span className={labelCls} style={{ color: "var(--muted)" }}>Type de logement</span>
                    <Toggle value={maison ? "maison" : "appartement"} onChange={(v) => setMaison(v === "maison")} options={[{ value: "maison", label: "Maison individuelle" }, { value: "appartement", label: "Appartement" }]} />
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm sm:col-span-2">
                    <input type="checkbox" checked={deuxIsolations} onChange={(e) => setDeuxIsolations(e.target.checked)} className="mt-1 h-4 w-4" style={{ accentColor: "var(--primary)" }} />
                    <span>Le programme comprend au moins deux gestes d’isolation (toiture, menuiseries, sols ou murs).</span>
                  </label>
                  {maison && (
                    <label className="flex cursor-pointer items-start gap-3 text-sm sm:col-span-2">
                      <input type="checkbox" checked={conserveGazFioul} onChange={(e) => setConserveGazFioul(e.target.checked)} className="mt-1 h-4 w-4" style={{ accentColor: "var(--primary)" }} />
                      <span>Un chauffage ou une production d’eau chaude au gaz ou au fioul sera conservé ou installé.</span>
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Résultat */}
            <div className="rounded-2xl border p-8" style={cardStyle} aria-live="polite">
              {eligible ? (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold" style={{ background: "#16a34a20", color: "#16a34a" }}>
                    Éligible · catégorie {info.couleur.toLowerCase()}
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                    {parcours === "geste" ? "MaPrimeRénov’ estimée" : "MaPrimeRénov’ + aide à l’accompagnement"}
                  </p>
                  <p className="mt-3 text-5xl font-bold md:text-6xl" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(totalAide)}</p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Reste à charge estimé : <strong style={{ color: "var(--foreground)" }}>{fmt(parcours === "geste" ? resGeste.resteACharge : resAmpleur.resteACharge)}</strong>
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold" style={{ background: "#dc262620", color: "#dc2626" }}>
                    Non éligible en l’état
                  </div>
                  <ul className="mx-auto mt-4 max-w-xl space-y-2 text-left text-sm" style={{ color: "var(--muted)" }}>
                    {motifs.map((m) => (
                      <li key={m}>• {m}</li>
                    ))}
                  </ul>
                  {parcours === "geste" && categorie === "superieur" && (
                    <p className="mx-auto mt-4 max-w-xl text-sm" style={{ color: "var(--muted)" }}>
                      Pistes : primes CEE (sans condition de ressources, bonifiées « coup de pouce » pour le remplacement d’une chaudière fossile), éco-PTZ jusqu’à 50 000 €, ou rénovation d’ampleur (10 % des travaux HT) si le logement est classé E, F ou G.
                    </p>
                  )}
                </div>
              )}

              {parcours === "geste" && resGeste.avertissements.length > 0 && (
                <ul className="mt-5 space-y-1 rounded-xl p-4 text-sm" style={{ background: "#e8963e14", color: "#9a5b13" }}>
                  {resGeste.avertissements.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
              )}

              {/* Détail */}
              {parcours === "geste" && resGeste.lignes.length > 0 && resGeste.eligible && (
                <div className="mt-6 space-y-4 text-sm" style={{ color: "var(--muted)" }}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détail par geste</h3>
                  {resGeste.lignes.map((l) => (
                    <div key={l.id} className="space-y-1.5 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                      <p className="font-semibold" style={{ color: "var(--foreground)" }}>{l.libelle}</p>
                      <Ligne label="Devis TTC" value={fmt(l.coutTTC)} />
                      <Ligne label="Dépense éligible (plafonnée)" value={fmt(l.depenseEligible)} />
                      <Ligne label="Forfait MaPrimeRénov’" value={fmt(l.forfait)} />
                      <Ligne label={`Plafond MaPrimeRénov’ + CEE (${pct(ECRETEMENT_GESTE[categorie])})`} value={fmt(l.plafondCumul)} />
                      {l.cee > 0 && <Ligne label="Prime CEE déclarée" value={fmt(l.cee)} />}
                      <Ligne label={l.ecretee ? "MaPrimeRénov’ après écrêtement" : "MaPrimeRénov’"} value={fmt(l.prime)} strong />
                      <Ligne label="Reste à charge" value={fmt(l.resteACharge)} />
                    </div>
                  ))}
                </div>
              )}

              {parcours === "ampleur" && resAmpleur.eligible && (
                <div className="mt-6 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détail du calcul</h3>
                  <Ligne label="Classe DPE" value={`${classeAvant} → ${resAmpleur.classeApres ?? "?"}`} />
                  <Ligne label="Plafond de dépenses éligibles HT" value={fmt(resAmpleur.plafondDepense)} />
                  <Ligne label="Dépense retenue HT" value={fmt(resAmpleur.depenseEligibleHT)} />
                  <Ligne label="Taux de prise en charge" value={pct(TAUX_AMPLEUR[categorie])} />
                  <Ligne label="Aide avant écrêtement" value={fmt(resAmpleur.primeAvantEcretement)} />
                  <hr style={{ borderColor: "var(--border)" }} />
                  <Ligne label="Montant des travaux TTC" value={fmt(resAmpleur.montantTTC)} />
                  <div className="flex justify-between gap-4">
                    <span>
                      Plafond total des aides ({pct(ECRETEMENT_AMPLEUR[categorie])} du TTC)
                      <AVerifier />
                    </span>
                    <span className="whitespace-nowrap font-semibold" style={{ color: "var(--foreground)" }}>{fmt(resAmpleur.plafondEcretement)}</span>
                  </div>
                  {parseFloat(aidesLocales) > 0 && <Ligne label="Aides locales déclarées" value={fmt(parseFloat(aidesLocales))} />}
                  <Ligne label={resAmpleur.ecretee ? "MaPrimeRénov’ après écrêtement" : "MaPrimeRénov’"} value={fmt(resAmpleur.prime)} strong />
                  <Ligne label={`Aide Mon Accompagnateur Rénov’ (${pct(MAR_TAUX[categorie])} de ${fmt(MAR_PLAFOND)} max.)`} value={fmt(resAmpleur.aideMar)} />
                  {resAmpleur.avanceMax > 0 && <Ligne label="Avance possible (30 % de l’aide max.)" value={fmt(resAmpleur.avanceMax)} />}
                  <hr style={{ borderColor: "var(--border)" }} />
                  <Ligne label="Coût total (travaux TTC + accompagnement)" value={fmt(resAmpleur.coutTotal)} />
                  <Ligne label="Reste à charge" value={fmt(resAmpleur.resteACharge)} strong />
                  <p className="pt-2 text-xs">
                    Bonus « sortie de passoire » : non prévu par le barème Anah de septembre 2026 pour les maisons et appartements (il subsiste uniquement pour MaPrimeRénov’ Copropriété).
                  </p>
                </div>
              )}
            </div>

            {/* Étapes suivantes : devis RGE */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--primary)", borderColor: "var(--primary)", color: "#fff" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Prochaine étape : faire chiffrer vos travaux par des professionnels RGE</h2>
              <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ opacity: 0.92 }}>
                <p>
                  MaPrimeRénov’ n’est versée que si les travaux sont réalisés par une entreprise <strong>RGE</strong> (Reconnu garant de l’environnement), après une visite préalable du chantier dont la date figure sur le devis. Le montant réel de votre aide dépend donc de devis précis.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Demandez 2 à 3 devis détaillés (matériel, pose, performances) à des artisans RGE de la bonne qualification.</li>
                  <li>Ne signez rien avant d’avoir déposé votre demande d’aide sur france-renov.gouv.fr : les travaux commencés avant le dépôt ne sont pas financés (sauf panne de chauffage en hiver).</li>
                  <li>Faites valoir les CEE avant la signature du devis (au plus tard 14 jours après) en mode geste.</li>
                  {parcours === "ampleur" && <li>En rénovation d’ampleur, votre Accompagnateur Rénov’ vous remet une liste d’entreprises RGE et vous aide à comparer les devis.</li>}
                </ul>
              </div>
            </div>

            {/* Cumuls */}
            <div className="rounded-2xl border p-6" style={cardStyle}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Cumuls et financement du reste à charge</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                <div className="rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <p className="font-semibold">Primes CEE</p>
                  <p className="mt-1" style={{ color: "var(--muted)" }}>
                    {parcours === "geste"
                      ? "Cumulables avec le geste, dans la limite de 90 % / 75 % / 60 % de la dépense éligible TTC selon la catégorie."
                      : "Non cumulables avec MaPrimeRénov’ rénovation d’ampleur. Les aides locales et caisses de retraite restent cumulables."}
                  </p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <p className="font-semibold">Éco-PTZ MaPrimeRénov’</p>
                  <p className="mt-1" style={{ color: "var(--muted)" }}>
                    Jusqu’à 50 000 € sur 20 ans maximum, sans condition de ressources, sur simple notification d’octroi (à débloquer dans les 6 mois).
                  </p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <p className="font-semibold">{parcours === "ampleur" ? "Mon Accompagnateur Rénov’" : "TVA réduite"}</p>
                  <p className="mt-1" style={{ color: "var(--muted)" }}>
                    {parcours === "ampleur"
                      ? "Obligatoire : audit, scénario de travaux, plan de financement, suivi de chantier. Un rendez-vous France Rénov’ est aussi obligatoire avant le dépôt."
                      : "TVA à 5,5 % sur les travaux de rénovation énergétique (logement de plus de 2 ans), y compris la PAC air/air depuis septembre 2026."}
                  </p>
                </div>
              </div>
            </div>

            {/* Points à vérifier */}
            <div className="rounded-2xl border p-6" style={{ ...cardStyle, borderColor: "#e8963e" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "#b45309" }}>Points à vérifier auprès de France Rénov’</h2>
              <ul className="mt-3 ml-4 list-disc space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>
                  <strong style={{ color: "var(--foreground)" }}>Base de l’écrêtement en rénovation d’ampleur</strong> <AVerifier /> : la fiche service-public retient le « montant total de travaux TTC », le guide Anah précise « dans le respect du plafond des dépenses éligibles ». Le simulateur applique la première formulation.
                </li>
                <li>
                  <strong style={{ color: "var(--foreground)" }}>Aide à l’accompagnement et écrêtement</strong> <AVerifier /> : l’aide Mon Accompagnateur Rénov’ est affichée à part, sans être intégrée au calcul d’écrêtement.
                </li>
                <li>
                  <strong style={{ color: "var(--foreground)" }}>Rendez-vous France Rénov’ pour un geste</strong> <AVerifier /> : il est explicitement obligatoire en rénovation d’ampleur ; pour le parcours par geste, confirmez-le auprès de votre espace conseil.
                </li>
                <li>
                  <strong style={{ color: "var(--foreground)" }}>Dossiers en cours</strong> <AVerifier /> : aucune règle transitoire n’est détaillée pour les gestes désormais exclus dont la demande a été déposée avant le 1er septembre 2026.
                </li>
              </ul>
              <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
                Dernière vérification : septembre 2026. Sources : Anah, « Les aides financières en 2026 » (édition septembre 2026) ; service-public.gouv.fr, fiche F35083 (vérifiée le 1er septembre 2026) et actualité du 27 août 2026 ; décret n° 2026-822 du 25 août 2026. Simulation indicative, France métropolitaine uniquement : seule l’Anah fixe le montant définitif.
              </p>
            </div>

            <ToolHowToSection
              title="Comment simuler votre MaPrimeRénov’ en 3 étapes"
              description="Estimez votre catégorie, votre prime et votre reste à charge en moins de 2 minutes."
              totalTime="PT2M"
              steps={HOWTO}
            />

            {/* Contenu SEO */}
            <div className="rounded-2xl border p-8" style={cardStyle}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>MaPrimeRénov’ en 2026 : ce qui a changé</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {/* Sources : ecologie.gouv.fr « Réouverture du guichet MaPrimeRénov’ le 30 septembre » (2025) ;
                    Anah, communiqué du 06/02/2026 « MaPrimeRénov’ : réouverture du guichet à la promulgation de la loi de finances »
                    https://www.anah.gouv.fr/presse/maprimerenov-reouverture-du-guichet-la-promulgation-de-la-loi-de-finances */}
                <p>
                  Après la suspension du guichet de la rénovation d’ampleur à l’été 2025 (réouverture le 30 septembre 2025), puis des dossiers restés en attente depuis la fin de l’année 2025 dans l’attente de la loi de finances, MaPrimeRénov’ a rouvert pour tous les parcours et tous les ménages à la promulgation de la loi de finances 2026, avec un budget de 3,6 milliards d’euros.
                </p>
                <p>
                  Au <strong style={{ color: "var(--foreground)" }}>1er septembre 2026</strong>, le parcours par geste a été recentré sur les <strong style={{ color: "var(--foreground)" }}>pompes à chaleur air/eau et géothermiques</strong> et le raccordement à un réseau de chaleur. L’isolation, la ventilation, le chauffage au bois et les chauffe-eau thermodynamiques ou solaires n’y sont plus financés. En rénovation d’ampleur en maison individuelle, il n’est plus possible de conserver ou d’installer un chauffage au gaz ou au fioul.
                </p>
                <p>
                  La rénovation d’ampleur reste ouverte aux quatre catégories de revenus pour les logements classés E, F ou G, avec un gain d’au moins deux classes. Pour connaître la classe de votre logement avant de lancer un audit, utilisez notre{" "}
                  <Link href="/outils/calculateur-dpe" className="font-semibold underline" style={{ color: "var(--primary)" }}>simulateur DPE gratuit</Link>.
                </p>
              </div>
            </div>

            <ToolFaqSection title="Questions fréquentes" items={FAQ} />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-5" style={cardStyle}>
              <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Outil lié</p>
              <p className="mt-2 text-sm font-semibold">Quelle est la classe énergétique de votre logement ?</p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>La rénovation d’ampleur exige un DPE E, F ou G avant travaux.</p>
              <Link href="/outils/calculateur-dpe" className="mt-3 inline-block rounded-lg px-4 py-2 text-sm font-semibold" style={{ background: "var(--primary)", color: "#fff" }}>
                Estimer mon DPE
              </Link>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
