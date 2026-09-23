"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

// Montants en vigueur depuis le 1er avril 2026 (décret n° 2026-222 du 30 mars 2026)
const SMIC_HORAIRE_BRUT = 12.31; // SMIC horaire brut au 1er juin 2026
const FORFAITAIRE_BASE = 638.28; // Montant forfaitaire personne seule (art. L842-3 CSS, 1er avril 2026)
const TAUX_REVENUS_PRO = 0.5985; // Fraction des revenus professionnels (art. D843-3 CSS, 59,85 % depuis le 1er avril 2025)
const BONIF_TAUX_MAX = 0.377; // Bonification max = 37,7 % du montant forfaitaire (art. D843-2 CSS)
const BONIF_SEUIL_BAS = 59 * SMIC_HORAIRE_BRUT; // Bonification nulle jusqu'à ce montant (726,29 €)
const BONIF_SEUIL_HAUT = 138 * SMIC_HORAIRE_BRUT; // Bonification maximale à partir de ce montant (1 698,78 €)
const BONIF_MAX = Math.round(FORFAITAIRE_BASE * BONIF_TAUX_MAX * 100) / 100; // 240,63 €
const TAUX_ISOLEMENT = 1.28412; // Montant majoré pour isolement (art. D843-1 CSS) : 128,412 % du forfaitaire
const TAUX_ISOLEMENT_ENFANT = 0.42804; // + 42,804 % du forfaitaire par enfant à charge (art. D843-1 CSS)
const FORFAIT_LOGEMENT_1 = 76.59; // 12 % du forfaitaire 1 personne (art. R844-3 CSS)
const FORFAIT_LOGEMENT_2 = 153.19; // 16 % du forfaitaire 2 personnes
const FORFAIT_LOGEMENT_3 = 189.57; // 16,5 % du forfaitaire 3 personnes (3 personnes et plus)
const SEUIL_VERSEMENT = 15; // Prime non versée en dessous de 15 € par mois

type Situation = "celibataire" | "couple";
type Logement = "locataire" | "accedant" | "proprietaire" | "heberge";

interface EntreesPrime {
  revenus: number; // revenus d'activité nets mensuels du déclarant
  revenusConjoint: number; // revenus d'activité nets mensuels du conjoint (couple uniquement)
  situation: Situation;
  nbEnfants: number;
  enceinte: boolean; // grossesse en cours (personne seule)
  parentIsole: boolean; // demande la majoration pour isolement
  logement: Logement;
  aideLogement: boolean; // perçoit une aide au logement (APL, ALS, ALF)
  montantAideLogement: number; // 0 = non renseigné
}

// --- calcul-prime-debut ---
function bonificationIndividuelle(revenu: number): number {
  // Art. D843-2 CSS : nulle jusqu'à 59 × SMIC horaire, croissance linéaire jusqu'à 138 × SMIC horaire
  if (revenu >= BONIF_SEUIL_HAUT) return BONIF_MAX;
  if (revenu > BONIF_SEUIL_BAS) {
    return BONIF_MAX * ((revenu - BONIF_SEUIL_BAS) / (BONIF_SEUIL_HAUT - BONIF_SEUIL_BAS));
  }
  return 0;
}

function calculerPrimeActivite(e: EntreesPrime) {
  const rev1 = Math.max(0, e.revenus || 0);
  const couple = e.situation === "couple";
  const rev2 = couple ? Math.max(0, e.revenusConjoint || 0) : 0;
  const nbEnfants = Math.max(0, Math.floor(e.nbEnfants || 0));

  // Majoration pour isolement (art. L842-7 et D843-1 CSS) : personne seule enceinte
  // ou assumant seule la charge d'au moins un enfant, pendant la période ouverte au droit.
  const isolementPossible = !couple && (nbEnfants >= 1 || e.enceinte);
  const isolement = isolementPossible && e.parentIsole;

  let majorationCouple = 0;
  let majorationEnfants = 0;
  let majorationIsolement = 0;
  let montantForfaitaire: number;

  if (isolement) {
    // 128,412 % du forfaitaire + 42,804 % par enfant à charge (pas de barème 50/30/40 %)
    majorationIsolement = FORFAITAIRE_BASE * (TAUX_ISOLEMENT - 1);
    majorationEnfants = FORFAITAIRE_BASE * TAUX_ISOLEMENT_ENFANT * nbEnfants;
    montantForfaitaire = FORFAITAIRE_BASE * (TAUX_ISOLEMENT + TAUX_ISOLEMENT_ENFANT * nbEnfants);
  } else {
    // Art. D843-1 CSS : +50 % pour la 2e personne du foyer, +30 % par personne supplémentaire,
    // +40 % à partir de la 3e personne à charge
    majorationCouple = couple ? FORFAITAIRE_BASE * 0.5 : 0;
    for (let i = 1; i <= nbEnfants; i++) {
      if (i === 1 && !couple) majorationEnfants += FORFAITAIRE_BASE * 0.5;
      else if (i <= 2) majorationEnfants += FORFAITAIRE_BASE * 0.3;
      else majorationEnfants += FORFAITAIRE_BASE * 0.4;
    }
    montantForfaitaire = FORFAITAIRE_BASE + majorationCouple + majorationEnfants;
  }
  montantForfaitaire = Math.round(montantForfaitaire * 100) / 100;

  // Bonification individuelle : une par membre du foyer ayant des revenus d'activité (art. L842-3 CSS)
  const bonification1 = bonificationIndividuelle(rev1);
  const bonification2 = couple ? bonificationIndividuelle(rev2) : 0;
  const bonificationTotale = bonification1 + bonification2;

  // Forfait logement (art. R844-3 et R844-4 CSS) : appliqué si le foyer perçoit une aide au logement,
  // est propriétaire sans aide au logement (la CAF ne l'applique pas en cas de prêt en cours)
  // ou est hébergé à titre gratuit. Aucun forfait pour un locataire sans aide au logement.
  const nbPersonnes = (couple ? 2 : 1) + nbEnfants;
  const forfaitBareme =
    nbPersonnes === 1 ? FORFAIT_LOGEMENT_1 : nbPersonnes === 2 ? FORFAIT_LOGEMENT_2 : FORFAIT_LOGEMENT_3;
  const aideLogement = e.aideLogement && (e.logement === "locataire" || e.logement === "accedant");
  let forfaitLogement = 0;
  if (aideLogement) {
    // L'aide au logement est retenue dans la limite du forfait (art. R844-4 CSS)
    const montantAL = Math.max(0, e.montantAideLogement || 0);
    forfaitLogement = montantAL > 0 ? Math.min(montantAL, forfaitBareme) : forfaitBareme;
  } else if (e.logement === "proprietaire" || e.logement === "heberge") {
    forfaitLogement = forfaitBareme;
  }

  // Formule (art. L842-3 CSS) :
  // P = forfaitaire + 59,85 % × revenus pro + bonifications - max(forfaitaire, ressources)
  // où ressources = revenus pro + autres revenus + forfait logement
  const revenusActivite = rev1 + rev2;
  const ressourcesFoyer = revenusActivite + forfaitLogement;
  const revenusPrisEnCompte = Math.max(montantForfaitaire, ressourcesFoyer);
  const primeCalculee =
    montantForfaitaire + TAUX_REVENUS_PRO * revenusActivite + bonificationTotale - revenusPrisEnCompte;
  const primeArrondie = revenusActivite > 0 ? Math.max(0, Math.round(primeCalculee * 100) / 100) : 0;
  const primeMensuelle = primeArrondie >= SEUIL_VERSEMENT ? primeArrondie : 0;
  const primeTrimestrielle = Math.round(primeMensuelle * 3 * 100) / 100;

  return {
    montantForfaitaire,
    majorationCouple,
    majorationEnfants,
    majorationIsolement,
    isolement,
    isolementPossible,
    bonification1,
    bonification2,
    bonificationTotale,
    forfaitLogement,
    forfaitBareme,
    revenusActivite,
    revenusPrisEnCompte,
    primeCalculee: primeArrondie,
    primeMensuelle,
    primeTrimestrielle,
    eligible: primeMensuelle > 0,
    nbPersonnes,
  };
}
// --- calcul-prime-fin ---

export default function SimulateurPrimeActivite() {
  const [revenus, setRevenus] = useState("1200");
  const [revenusConjoint, setRevenusConjoint] = useState("0");
  const [situation, setSituation] = useState<Situation>("celibataire");
  const [enfants, setEnfants] = useState("0");
  const [enceinte, setEnceinte] = useState(false);
  const [parentIsole, setParentIsole] = useState(false);
  const [logement, setLogement] = useState<Logement>("locataire");
  const [aideLogement, setAideLogement] = useState(false);
  const [montantAL, setMontantAL] = useState("");

  const resultats = useMemo(
    () =>
      calculerPrimeActivite({
        revenus: parseFloat(revenus) || 0,
        revenusConjoint: parseFloat(revenusConjoint) || 0,
        situation,
        nbEnfants: parseInt(enfants) || 0,
        enceinte,
        parentIsole,
        logement,
        aideLogement,
        montantAideLogement: parseFloat(montantAL) || 0,
      }),
    [revenus, revenusConjoint, situation, enfants, enceinte, parentIsole, logement, aideLogement, montantAL]
  );

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Emploi</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>Prime d&apos;Activité</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez le montant de votre prime d&apos;activité 2026 selon vos revenus, votre situation familiale et votre logement.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Situation</label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {(["celibataire", "couple"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSituation(s)}
                      className="rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
                      style={{
                        borderColor: situation === s ? "var(--primary)" : "var(--border)",
                        background: situation === s ? "var(--primary)" : "transparent",
                        color: situation === s ? "white" : "var(--foreground)",
                      }}
                    >
                      {s === "celibataire" ? "Seul(e)" : "En couple"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pa-revenus" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    {situation === "couple" ? "Vos revenus d'activité nets mensuels (€)" : "Revenus d'activité nets mensuels (€)"}
                  </label>
                  <input id="pa-revenus" type="number" min="0" value={revenus} onChange={(e) => setRevenus(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                {situation === "couple" && (
                  <div>
                    <label htmlFor="pa-revenus-conjoint" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Revenus d&apos;activité nets du conjoint (€)</label>
                    <input id="pa-revenus-conjoint" type="number" min="0" value={revenusConjoint} onChange={(e) => setRevenusConjoint(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                )}
                <div>
                  <label htmlFor="pa-enfants" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre d&apos;enfants à charge</label>
                  <input id="pa-enfants" type="number" min="0" max="10" value={enfants} onChange={(e) => setEnfants(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>

              {situation === "celibataire" && (
                <div className="mt-4 space-y-3 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <label className="flex items-start gap-3 text-sm" style={{ color: "var(--foreground)" }}>
                    <input type="checkbox" className="mt-1" checked={enceinte} onChange={(e) => setEnceinte(e.target.checked)} />
                    <span>Grossesse en cours (déclarée)</span>
                  </label>
                  {resultats.isolementPossible && (
                    <label className="flex items-start gap-3 text-sm" style={{ color: "var(--foreground)" }}>
                      <input type="checkbox" className="mt-1" checked={parentIsole} onChange={(e) => setParentIsole(e.target.checked)} />
                      <span>
                        <strong>Parent isolé</strong> : majoration pour isolement
                        <span className="mt-1 block text-xs" style={{ color: "var(--muted)" }}>
                          Accordée pendant 12 mois (continus ou non) sur les 18 mois suivant l&apos;événement (grossesse, naissance, séparation, veuvage, prise en charge d&apos;un enfant), ou jusqu&apos;aux 3 ans du plus jeune enfant. Décochez si cette période est dépassée.
                        </span>
                      </span>
                    </label>
                  )}
                </div>
              )}

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Logement</label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {([
                    ["locataire", "Locataire"],
                    ["accedant", "Propriétaire avec prêt en cours"],
                    ["proprietaire", "Propriétaire sans prêt"],
                    ["heberge", "Hébergé gratuitement"],
                  ] as const).map(([l, libelle]) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLogement(l)}
                      className="rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
                      style={{
                        borderColor: logement === l ? "var(--primary)" : "var(--border)",
                        background: logement === l ? "var(--primary)" : "transparent",
                        color: logement === l ? "white" : "var(--foreground)",
                      }}
                    >
                      {libelle}
                    </button>
                  ))}
                </div>
              </div>

              {(logement === "locataire" || logement === "accedant") && (
                <div className="mt-4 space-y-3 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <label className="flex items-start gap-3 text-sm" style={{ color: "var(--foreground)" }}>
                    <input type="checkbox" className="mt-1" checked={aideLogement} onChange={(e) => setAideLogement(e.target.checked)} />
                    <span>Vous percevez une aide au logement (APL, ALS ou ALF)</span>
                  </label>
                  {aideLogement && (
                    <div>
                      <label htmlFor="pa-montant-al" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant mensuel de l&apos;aide (€, facultatif)</label>
                      <input id="pa-montant-al" type="number" min="0" value={montantAL} placeholder="Laisser vide si inconnu" onChange={(e) => setMontantAL(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>L&apos;aide est retenue dans la limite du forfait logement ({fmt(resultats.forfaitBareme)} € pour votre foyer).</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Résultat principal */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Prime d&apos;activité estimée</p>
              <p className="mt-3 text-6xl font-bold" style={{
                fontFamily: "var(--font-display)",
                color: resultats.eligible ? "var(--primary)" : "#dc2626",
              }}>
                {resultats.eligible ? `${fmt(resultats.primeMensuelle)} €` : "Non éligible"}
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {resultats.eligible ? (
                  <>par mois &middot; <strong className="text-[var(--foreground)]">{fmt(resultats.primeTrimestrielle)} &euro; / trimestre</strong></>
                ) : resultats.revenusActivite <= 0 ? (
                  "La prime d'activité nécessite des revenus professionnels"
                ) : resultats.primeCalculee > 0 ? (
                  `Montant calculé (${fmt(resultats.primeCalculee)} €) inférieur au seuil de versement de ${SEUIL_VERSEMENT} €`
                ) : (
                  "Vos revenus dépassent le plafond pour votre situation"
                )}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold" style={{
                background: resultats.eligible ? "#dcfce7" : "#fef2f2",
                color: resultats.eligible ? "#16a34a" : "#dc2626",
              }}>
                <span className="h-2 w-2 rounded-full" style={{ background: resultats.eligible ? "#16a34a" : "#dc2626" }} />
                {resultats.eligible ? "Éligible" : "Non éligible"}
              </div>
            </div>

            {/* Détail du calcul */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détail du calcul</h2>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Montant forfaitaire de base", value: `+ ${fmt(FORFAITAIRE_BASE)} €`, positive: true },
                  ...(resultats.majorationIsolement > 0 ? [{ label: "Majoration pour isolement (+28,412 %)", value: `+ ${fmt(resultats.majorationIsolement)} €`, positive: true }] : []),
                  ...(resultats.majorationCouple > 0 ? [{ label: "Majoration couple (+50 %)", value: `+ ${fmt(resultats.majorationCouple)} €`, positive: true }] : []),
                  ...(resultats.majorationEnfants > 0 ? [{ label: resultats.isolement ? `Majoration enfants (${enfants} × 42,804 %)` : `Majoration enfants (${enfants})`, value: `+ ${fmt(resultats.majorationEnfants)} €`, positive: true }] : []),
                  { label: situation === "couple" ? "Bonification individuelle (vous)" : "Bonification individuelle", value: `+ ${fmt(resultats.bonification1)} €`, positive: true },
                  ...(situation === "couple" ? [{ label: "Bonification individuelle (conjoint)", value: `+ ${fmt(resultats.bonification2)} €`, positive: true }] : []),
                  { label: "59,85 % des revenus d'activité du foyer", value: `+ ${fmt(TAUX_REVENUS_PRO * resultats.revenusActivite)} €`, positive: true },
                  { label: `Ressources retenues : max(forfaitaire ${fmt(resultats.montantForfaitaire)} €, revenus + forfait logement ${fmt(resultats.forfaitLogement)} €)`, value: `- ${fmt(resultats.revenusPrisEnCompte)} €`, positive: false },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>{item.label}</span>
                    <span className="text-sm font-semibold" style={{ color: item.positive ? "#16a34a" : "#dc2626" }}>{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-bold">Prime mensuelle</span>
                  <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(resultats.primeMensuelle)} &euro;</span>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Qu&apos;est-ce que la prime d&apos;activité ?
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>La prime d&apos;activité est une prestation sociale versée par la CAF (ou la MSA) aux travailleurs aux revenus modestes. Elle remplace depuis 2016 le RSA activité et la prime pour l&apos;emploi. Son objectif est d&apos;encourager l&apos;activité professionnelle en complétant les revenus des salariés et travailleurs indépendants.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Cadre légal</strong> : articles L841-1 et suivants et D843-1 et suivants du Code de la sécurité sociale (CSS).</li>
                  <li><strong className="text-[var(--foreground)]">Conditions</strong> : avoir plus de 18 ans, résider en France, exercer une activité professionnelle et percevoir des revenus modestes.</li>
                  <li><strong className="text-[var(--foreground)]">Montant forfaitaire</strong> : 638,28 &euro; pour une personne seule depuis le 1er avril 2026, majoré de 50 % pour la 2e personne du foyer, de 30 % par personne supplémentaire et de 40 % à partir de la 3e personne à charge.</li>
                  <li><strong className="text-[var(--foreground)]">Parent isolé</strong> : une personne seule enceinte ou assumant seule la charge d&apos;enfants bénéficie d&apos;un montant forfaitaire majoré de 128,412 % (819,63 &euro;), plus 42,804 % par enfant (273,21 &euro;), soit 1 092,84 &euro; avec un enfant et 1 366,05 &euro; avec deux. Cette majoration dure 12 mois sur une période de 18 mois, ou jusqu&apos;aux 3 ans du plus jeune enfant.</li>
                  <li><strong className="text-[var(--foreground)]">Bonification</strong> : un complément progressif est accordé à partir de 726,29 &euro; nets par mois (59 fois le SMIC horaire brut), jusqu&apos;à 240,63 &euro; à partir de 1 698,78 &euro; (138 fois le SMIC horaire brut, environ 1,15 SMIC) depuis la réforme du 1er avril 2026. En couple, chaque membre qui travaille a sa propre bonification, calculée sur ses propres revenus.</li>
                  <li><strong className="text-[var(--foreground)]">Forfait logement</strong> : si vous percevez une aide au logement, êtes propriétaire sans aide au logement ou êtes hébergé gratuitement, un forfait de 76,59 &euro; (1 personne), 153,19 &euro; (2 personnes) ou 189,57 &euro; (3 personnes et plus) est ajouté à vos ressources. Un locataire sans aide au logement n&apos;est pas concerné.</li>
                  <li><strong className="text-[var(--foreground)]">Formule officielle</strong> : Prime = (forfaitaire + majorations + bonifications + 59,85 % des revenus pro) - ressources prises en compte (au moins égales au montant forfaitaire). La prime n&apos;est pas versée si elle est inférieure à 15 &euro;. Le coefficient de 59,85 % sur les revenus d&apos;activité (61 % jusqu&apos;en mars 2025) est l&apos;élément central du dispositif : il garantit que travailler reste intéressant.</li>
                  <li><strong className="text-[var(--foreground)]">Versement</strong> : trimestriel, basé sur les revenus des 3 derniers mois. La demande se fait sur caf.fr.</li>
                </ul>
                <p>Ce simulateur fournit une estimation à partir de vos seuls revenus d&apos;activité. Le montant réel dépend de l&apos;ensemble des ressources du foyer (allocations, pensions, revenus des enfants...) évaluées par la CAF sur le trimestre précédent. Les travailleurs indépendants, les étudiants salariés et les apprentis peuvent aussi en bénéficier sous conditions.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qui peut bénéficier de la prime d&apos;activité ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Toute personne de plus de 18 ans résidant en France et exerçant une activité professionnelle (salariée ou indépendante) avec des revenus modestes. Les étudiants et apprentis y ont droit s&apos;ils perçoivent au moins 78 % du SMIC net par mois. Les travailleurs détachés et en congé parental ne sont pas éligibles.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment faire la demande ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La demande se fait en ligne sur le site de la CAF (caf.fr) ou de la MSA (msa.fr) pour les travailleurs agricoles. Il faut remplir un formulaire avec ses revenus des 3 derniers mois. La prime est ensuite versée chaque mois pendant 3 mois, puis il faut renouveler la déclaration trimestrielle de ressources.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>La prime d&apos;activité est-elle imposable ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non, la prime d&apos;activité n&apos;est pas soumise à l&apos;impôt sur le revenu. Elle n&apos;a pas à être déclarée dans votre déclaration de revenus annuelle. Elle n&apos;entre pas non plus dans le calcul du revenu fiscal de référence (RFR).</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment est calculée la prime d&apos;activité d&apos;un couple où les deux travaillent ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Les revenus d&apos;activité des deux membres s&apos;additionnent dans la formule (59,85 % du total est pris en compte), mais la bonification est individuelle : chaque membre dont les revenus dépassent 726,29 &euro; nets par mois reçoit sa propre bonification, jusqu&apos;à 240,63 &euro; chacun. Saisissez donc séparément vos revenus et ceux de votre conjoint.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qu&apos;est-ce que la majoration pour parent isolé ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Si vous vivez seul(e) et êtes enceinte ou assumez seul(e) la charge d&apos;au moins un enfant, le montant forfaitaire passe à 128,412 % du montant de base (819,63 &euro;), plus 42,804 % par enfant (273,21 &euro;). Elle est accordée pendant 12 mois, continus ou non, dans les 18 mois qui suivent la séparation, le veuvage, la naissance ou la déclaration de grossesse, ou jusqu&apos;aux 3 ans du plus jeune enfant.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Peut-on cumuler prime d&apos;activité et APL ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, la prime d&apos;activité est cumulable avec les aides au logement (APL, ALS, ALF). Toutefois, le fait de percevoir une aide au logement entraîne l&apos;application d&apos;un forfait logement qui réduit le montant de la prime. Depuis le 1er avril 2026, ce forfait est de 76,59 &euro; pour une personne seule, 153,19 &euro; pour 2 personnes, et 189,57 &euro; pour 3 personnes et plus (ou le montant de l&apos;aide s&apos;il est inférieur). Le même forfait s&apos;applique aux propriétaires sans prêt en cours et aux personnes hébergées gratuitement ; un locataire sans aide au logement n&apos;en subit pas.</p>
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
