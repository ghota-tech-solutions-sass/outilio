"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";
import {
  PRESETS_AGE,
  calculerEconomie,
  dispenseQuestionnaire,
  parseNum,
  type BaseAlternative,
  type ModeActuel,
} from "./calcul";

// Sources des règles et des chiffres : voir l'en-tête de ./calcul.ts
// (loi n° 2022-270 ; C. assur. L113-2-1 et L113-12-2 ; C. conso. L313-30 à L313-32 et L313-39 ; CCSF ; Meilleurtaux 2026).

type QuotiteId = "solo" | "couple-50" | "couple-150" | "couple-200";

const QUOTITES: { id: QuotiteId; label: string; total: number; partMax: number }[] = [
  { id: "solo", label: "1 emprunteur à 100 %", total: 1, partMax: 1 },
  { id: "couple-50", label: "Couple 50 % / 50 % (100 %)", total: 1, partMax: 0.5 },
  { id: "couple-150", label: "Couple 100 % / 50 % (150 %)", total: 1.5, partMax: 1 },
  { id: "couple-200", label: "Couple 100 % / 100 % (200 %)", total: 2, partMax: 1 },
];

const MODES: { id: ModeActuel; label: string }[] = [
  { id: "prime", label: "Je connais ma cotisation mensuelle" },
  { id: "taux-initial", label: "Taux sur capital initial" },
  { id: "taux-crd", label: "Taux sur capital restant dû" },
];

const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR");
const fmt2 = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtTaux = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AssuranceEmprunteur() {
  const [crd, setCrd] = useState("150000");
  const [ans, setAns] = useState("15");
  const [mois, setMois] = useState("0");
  const [tauxPret, setTauxPret] = useState("1,5");
  const [quotiteId, setQuotiteId] = useState<QuotiteId>("solo");
  const [modeActuel, setModeActuel] = useState<ModeActuel>("taux-initial");
  const [primeActuelle, setPrimeActuelle] = useState("60");
  const [tauxActuel, setTauxActuel] = useState("0,36");
  const [capitalInitial, setCapitalInitial] = useState("200000");
  const [tauxAlternatif, setTauxAlternatif] = useState("0,13");
  const [baseAlternative, setBaseAlternative] = useState<BaseAlternative>("crd");
  const [ageAine, setAgeAine] = useState("");

  const quotite = QUOTITES.find((q) => q.id === quotiteId) ?? QUOTITES[0];
  const moisRestants = Math.round(parseNum(ans) * 12 + parseNum(mois));

  const result = useMemo(
    () =>
      calculerEconomie({
        crd: parseNum(crd),
        moisRestants,
        tauxPret: parseNum(tauxPret),
        capitalInitial: parseNum(capitalInitial),
        modeActuel,
        primeActuelle: parseNum(primeActuelle),
        tauxActuel: parseNum(tauxActuel),
        tauxAlternatif: parseNum(tauxAlternatif),
        baseAlternative,
        quotite: quotite.total,
      }),
    [crd, moisRestants, tauxPret, capitalInitial, modeActuel, primeActuelle, tauxActuel, tauxAlternatif, baseAlternative, quotite.total],
  );

  const dispense = useMemo(
    () => dispenseQuestionnaire(parseNum(crd), quotite.partMax, parseNum(ageAine), moisRestants),
    [crd, quotite.partMax, ageAine, moisRestants],
  );

  const tauxAltNum = parseNum(tauxAlternatif);

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, rgba(13,79,60,0.04), var(--surface))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Immobilier
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-2 text-3xl font-extrabold md:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
          >
            Économie sur l’assurance emprunteur <span style={{ color: "var(--primary)" }}>(loi Lemoine)</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-2 max-w-3xl" style={{ color: "var(--muted)" }}>
            Depuis la loi Lemoine, vous pouvez changer d’assurance de prêt immobilier à tout moment, sans frais. Comparez le coût
            restant de votre contrat actuel avec celui d’une délégation d’assurance et chiffrez votre économie.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div
              className="animate-fade-up stagger-2 rounded-2xl border p-6 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              {/* Prêt */}
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Votre prêt en cours
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Capital restant dû (€)" hint="Sur votre tableau d’amortissement" value={crd} onChange={setCrd} />
                <Field
                  label="Taux nominal du prêt (%)"
                  hint="Sert à projeter le capital restant dû"
                  value={tauxPret}
                  onChange={setTauxPret}
                  decimal
                />
                <Field label="Durée restante : années" value={ans} onChange={setAns} />
                <Field label="Durée restante : mois en plus" value={mois} onChange={setMois} placeholder="0" />
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  Quotité assurée
                  <select
                    value={quotiteId}
                    onChange={(e) => setQuotiteId(e.target.value as QuotiteId)}
                    className="mt-1 w-full rounded-lg border px-4 py-3 text-base font-normal"
                    style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
                  >
                    {QUOTITES.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.label}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Les taux saisis s’entendent par assuré et à 100 % ; pour un couple, indiquez le taux moyen des deux emprunteurs.
                </p>
              </div>

              {/* Contrat actuel */}
              <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Votre assurance actuelle
              </h2>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Mode de saisie du contrat actuel">
                {MODES.map((m) => (
                  <Pill key={m.id} active={modeActuel === m.id} onClick={() => setModeActuel(m.id)}>
                    {m.label}
                  </Pill>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {modeActuel === "prime" && (
                  <Field
                    label="Cotisation mensuelle actuelle (€)"
                    hint="Total pour tous les assurés, supposée constante jusqu’au terme"
                    value={primeActuelle}
                    onChange={setPrimeActuelle}
                    decimal
                  />
                )}
                {modeActuel !== "prime" && (
                  <Field
                    label="Taux annuel actuel (% par assuré)"
                    hint="Indiqué dans votre offre de prêt ou votre certificat d’adhésion"
                    value={tauxActuel}
                    onChange={setTauxActuel}
                    decimal
                  />
                )}
                {modeActuel === "taux-initial" && (
                  <Field
                    label="Capital emprunté à l’origine (€)"
                    hint="La cotisation est fixe, calculée sur ce montant"
                    value={capitalInitial}
                    onChange={setCapitalInitial}
                  />
                )}
              </div>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <strong>Capital initial ou capital restant dû ?</strong> Les contrats groupe des banques appliquent souvent le taux au
                capital emprunté à l’origine : la cotisation reste la même jusqu’à la fin, alors que votre dette diminue. Les
                délégations calculent généralement sur le capital restant dû : la cotisation baisse chaque mois.
              </p>

              {/* Alternative */}
              <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Assurance alternative (délégation)
              </h2>
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                Taux moyens indicatifs 2026 pour un non-fumeur sans risque aggravé (non contractuels, source Meilleurtaux ; 60 ans et
                plus : fourchette relevée par les comparateurs). Un fumeur paie en moyenne 50 à 100 % de plus.
              </p>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Taux indicatifs par âge">
                {PRESETS_AGE.map((p) => (
                  <Pill
                    key={p.label}
                    active={Math.abs(tauxAltNum - p.taux) < 0.0001}
                    onClick={() => setTauxAlternatif(fmtTaux(p.taux))}
                    title={p.note}
                  >
                    {p.label} · {fmtTaux(p.taux)} %
                  </Pill>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Taux annuel de la délégation (% par assuré)"
                  hint="Remplacez par le taux d’un devis réel"
                  value={tauxAlternatif}
                  onChange={setTauxAlternatif}
                  decimal
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Base de calcul</p>
                  <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Base de calcul de la délégation">
                    <Pill active={baseAlternative === "crd"} onClick={() => setBaseAlternative("crd")}>
                      Capital restant dû
                    </Pill>
                    <Pill active={baseAlternative === "initial"} onClick={() => setBaseAlternative("initial")}>
                      Capital fixe
                    </Pill>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    « Capital fixe » : taux appliqué au capital restant dû au jour du changement, figé ensuite.
                  </p>
                </div>
                <Field
                  label="Âge actuel du plus âgé (facultatif)"
                  hint="Pour vérifier la dispense de questionnaire de santé"
                  value={ageAine}
                  onChange={setAgeAine}
                  placeholder="ex. 42"
                />
              </div>
            </div>

            {/* Résultats */}
            {!result && (
              <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p style={{ color: "var(--muted)" }}>Indiquez le capital restant dû et la durée restante pour lancer le calcul.</p>
              </div>
            )}

            {result && (
              <>
                {result.economie > 0 ? (
                  <div className="rounded-2xl border p-8 text-center shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                      Économie estimée jusqu’à la fin du prêt
                    </p>
                    <p className="mt-3 text-5xl font-bold md:text-6xl" style={{ fontFamily: "var(--font-display)", color: "#16a34a" }}>
                      {fmt(result.economie)} €
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                      soit {fmt2(result.economieMensuelle)} € par mois en moyenne sur {result.mois} mois (
                      {result.coutActuel > 0 ? Math.round((result.economie / result.coutActuel) * 100) : 0} % du coût restant)
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
                      style={{ background: "#16a34a20", color: "#16a34a" }}
                    >
                      Votre contrat est déjà compétitif
                    </div>
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      Avec ces hypothèses, la délégation coûterait {fmt(-result.economie)} € de plus que votre contrat actuel. Vérifiez le
                      taux d’un devis réel : il dépend de votre âge, de votre santé, de votre profession et du tabac.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard label="Coût restant du contrat actuel" value={`${fmt(result.coutActuel)} €`} sub={`${fmt2(result.primeActuelleMensuelle)} €/mois ce mois-ci`} />
                  <StatCard
                    label="Coût restant de la délégation"
                    value={`${fmt(result.coutAlternatif)} €`}
                    sub={
                      baseAlternative === "crd"
                        ? `${fmt2(result.primeAlternativePremierMois)} €/mois au départ, ${fmt2(result.primeAlternativeMoyenne)} € en moyenne`
                        : `${fmt2(result.primeAlternativePremierMois)} €/mois, constante`
                    }
                  />
                  <StatCard
                    label="Économie totale"
                    value={`${fmt(result.economie)} €`}
                    sub={`${fmt2(result.economieMensuelle)} €/mois en moyenne`}
                    primary
                  />
                </div>

                {/* Questionnaire de santé */}
                <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                    Questionnaire de santé : êtes-vous dispensé ?
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm">
                    <Check ok={dispense.plafondOk}>
                      Part assurée par personne : {fmt(dispense.partAssuree)} € (plafond 200 000 € sur l’encours cumulé de vos crédits
                      immobiliers)
                    </Check>
                    <Check ok={dispense.ageOk}>
                      {dispense.ageOk === null
                        ? "Fin du prêt avant votre 60e anniversaire : renseignez l’âge du plus âgé pour vérifier"
                        : `Fin du prêt vers ${Math.floor(dispense.ageFin)} ans (elle doit intervenir avant le 60e anniversaire)`}
                    </Check>
                  </ul>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {dispense.eligible
                      ? "Les deux conditions semblent remplies : le nouvel assureur ne peut vous demander ni questionnaire de santé ni examen médical (art. L113-2-1 du Code des assurances)."
                      : "Si une condition n’est pas remplie, le changement reste possible, mais le nouvel assureur pourra demander un questionnaire de santé."}{" "}
                    Vos autres crédits immobiliers assurés s’ajoutent à l’encours pris en compte.
                  </p>
                </div>

                {/* Comparer */}
                <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "rgba(13,79,60,0.05)", borderColor: "var(--primary)" }}>
                  <h2 className="text-lg font-semibold" style={{ color: "var(--primary)" }}>
                    Prochaine étape : comparer les offres d’assurance
                  </h2>
                  <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    <li>Récupérez auprès de votre banque la fiche standardisée d’information (FSI) listant les garanties exigées.</li>
                    <li>Demandez plusieurs devis de délégation et vérifiez qu’ils couvrent chacun des critères de la FSI.</li>
                    <li>Adressez le nouveau contrat à votre banque : elle a 10 jours ouvrés pour accepter ou refuser.</li>
                    <li>Une fois l’avenant signé, résiliez l’ancien contrat : il prend fin sans frais ni pénalité.</li>
                  </ol>
                </div>
              </>
            )}

            <ToolHowToSection
              title="Comment calculer l’économie sur votre assurance de prêt en 3 étapes"
              description="Le calcul projette votre capital restant dû mois par mois et compare les cotisations restantes des deux contrats. Tout est calculé dans votre navigateur."
              steps={[
                {
                  name: "Décrire votre prêt en cours",
                  text:
                    "Reportez le capital restant dû et la durée restante depuis votre tableau d’amortissement, ainsi que le taux nominal du prêt. Choisissez la quotité : 100 % pour un emprunteur seul, 200 % pour un couple assuré chacun à 100 %.",
                },
                {
                  name: "Saisir le coût de votre assurance actuelle",
                  text:
                    "Indiquez soit la cotisation mensuelle, soit le taux annuel en précisant sa base : capital initial (cotisation fixe, cas fréquent des contrats groupe bancaires) ou capital restant dû (cotisation dégressive).",
                },
                {
                  name: "Comparer avec une délégation",
                  text:
                    "Choisissez un taux indicatif selon votre âge ou, mieux, le taux d’un devis réel. Le simulateur affiche le coût restant des deux contrats, l’économie totale et mensuelle, et vérifie si vous êtes dispensé de questionnaire de santé.",
                },
              ]}
            />

            <section className="rounded-xl border p-6 md:p-8 shadow-sm" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                Loi Lemoine : ce qu’il faut savoir pour changer d’assurance
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Résiliation à tout moment.</strong> La loi n° 2022-270 du 28 février 2022 permet de résilier l’assurance
                  emprunteur à tout moment, sans attendre la date anniversaire, pour les nouvelles offres depuis le 1er juin 2022 et
                  pour tous les prêts en cours depuis le 1er septembre 2022 (art. L113-12-2 du Code des assurances). La banque ne peut
                  facturer ni l’analyse du nouveau contrat ni l’avenant (art. L313-31 et L313-32 du Code de la consommation).
                </p>
                <p>
                  <strong>Pas de questionnaire de santé, sous deux conditions.</strong> Aucune information médicale ne peut être
                  demandée si la part assurée sur l’encours cumulé de vos crédits immobiliers ne dépasse pas 200 000 € par personne et
                  si le prêt se termine avant votre 60e anniversaire (art. L113-2-1 du Code des assurances). La loi a aussi ramené le
                  droit à l’oubli à 5 ans après la fin du protocole thérapeutique d’un cancer ou d’une hépatite C.
                </p>
                <p>
                  <strong>Équivalence des garanties.</strong> La banque ne peut refuser le nouveau contrat que s’il n’offre pas un
                  niveau de garantie équivalent. Elle choisit au plus 11 critères parmi la liste de 18 établie par le Comité consultatif
                  du secteur financier (CCSF) pour le décès, la PTIA, l’incapacité et l’invalidité, plus 4 au maximum pour la perte
                  d’emploi. Ces critères figurent sur la fiche standardisée d’information remise avec l’offre de prêt.
                </p>
                <p>
                  <strong>Délai de réponse de 10 jours ouvrés.</strong> La banque doit accepter ou refuser dans les dix jours ouvrés
                  suivant la réception de la demande, émettre l’avenant dans le même délai, sans frais (art. L313-31 du Code de la
                  consommation). Tout refus doit être explicite et en donner l’intégralité des motifs (art. L313-39). L’ancien contrat
                  prend fin 10 jours après que l’assureur a reçu l’accord de la banque, ou à la date d’effet du nouveau contrat si elle
                  est plus tardive.
                </p>
                <p>
                  <strong>Le taux ne change pas.</strong> La banque ne peut pas modifier le taux du crédit, son mode d’amortissement ou
                  ses conditions d’octroi en contrepartie d’un changement d’assurance (art. L313-32 du Code de la consommation) :
                  seul le TAEG est recalculé dans l’avenant.
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus posées sur le changement d’assurance de prêt immobilier."
              items={[
                {
                  question: "Comment changer d’assurance de prêt immobilier ?",
                  answer:
                    "Faites établir un devis de délégation couvrant les garanties exigées par votre banque (fiche standardisée d’information), souscrivez le nouveau contrat puis envoyez-le à votre banque avec votre demande de substitution. Elle a 10 jours ouvrés pour répondre et émettre l’avenant. Une fois l’avenant signé, l’ancien contrat est résilié sans frais.",
                },
                {
                  question: "Qu’est-ce que la loi Lemoine ?",
                  answer:
                    "C’est la loi n° 2022-270 du 28 février 2022 sur l’assurance emprunteur. Elle permet de changer d’assurance de prêt immobilier à tout moment, supprime le questionnaire de santé pour les prêts assurés jusqu’à 200 000 € par personne et remboursés avant 60 ans, et réduit le droit à l’oubli à 5 ans pour les anciens malades du cancer et de l’hépatite C.",
                },
                {
                  question: "Combien peut-on économiser en changeant d’assurance emprunteur ?",
                  answer:
                    "Cela dépend surtout de l’âge, du capital restant et de la base de calcul. Exemple : un contrat groupe à 0,36 % sur un capital initial de 200 000 € coûte 60 € par mois. S’il reste 150 000 € à rembourser sur 15 ans (prêt à 1,5 %), la cotisation restante représente 10 800 €, contre environ 1 525 € pour une délégation à 0,13 % sur le capital restant dû : environ 9 275 € d’économie, soit 51,50 € par mois en moyenne.",
                },
                {
                  question: "Peut-on changer d’assurance de prêt sans questionnaire de santé ?",
                  answer:
                    "Oui, si deux conditions sont réunies : la part assurée sur l’encours cumulé de vos crédits immobiliers ne dépasse pas 200 000 € par personne, et le prêt se termine avant votre 60e anniversaire. Pour un couple assuré à 50 % chacun, c’est la moitié du capital restant dû qui compte pour chaque emprunteur.",
                },
                {
                  question: "La banque peut-elle refuser le changement d’assurance ?",
                  answer:
                    "Uniquement si le nouveau contrat ne présente pas un niveau de garantie équivalent, apprécié sur les critères CCSF qu’elle a retenus. Le refus doit être explicite, écrit et donner l’intégralité des motifs. Elle ne peut ni facturer l’avenant ni modifier le taux du prêt.",
                },
                {
                  question: "Quelle différence entre taux sur capital initial et sur capital restant dû ?",
                  answer:
                    "Sur capital initial, la cotisation est calculée une fois pour toutes sur le montant emprunté et reste fixe, même en fin de prêt. Sur capital restant dû, elle est recalculée sur la dette restante et diminue au fil des remboursements. À taux égal, la seconde formule coûte à peu près deux fois moins cher sur la durée totale.",
                },
                {
                  question: "Les taux par âge du simulateur sont-ils garantis ?",
                  answer:
                    "Non. Ce sont des moyennes indicatives observées en 2026 pour des non-fumeurs sans risque aggravé. Votre tarif réel dépend de votre âge exact, de votre santé, de votre profession, de la pratique de sports à risque et du tabac. Seul un devis engage l’assureur.",
                },
                {
                  question: "Changer d’assurance augmente-t-il ma capacité d’emprunt ?",
                  answer:
                    "Pour un nouveau prêt, oui : l’assurance est comprise dans le taux d’endettement de 35 %, donc une cotisation plus faible laisse davantage de mensualité pour le capital. Vous pouvez le vérifier avec le simulateur de capacité d’emprunt d’Outilis.",
                },
              ]}
            />

            <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Outils liés
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <CrossLinkCard href="/outils/capacite-emprunt" emoji="📊" title="Capacité d’emprunt 2026" desc="Combien pouvez-vous emprunter à 35 % ?" />
                <CrossLinkCard href="/outils/calculateur-rachat-credit" emoji="🔄" title="Rachat de crédit" desc="Renégocier le taux de votre prêt" />
                <CrossLinkCard href="/outils/calculateur-pret-immobilier" emoji="🏠" title="Simulateur de prêt immobilier" desc="Mensualité et tableau d’amortissement" />
                <CrossLinkCard href="/outils/simulateur-ptz-2026" emoji="🆓" title="Simulateur PTZ 2026" desc="Prêt à taux zéro pour primo-accédant" />
                <CrossLinkCard href="/outils/calculateur-frais-notaire" emoji="🏛️" title="Frais de notaire" desc="Estimer les frais d’un achat" />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Loi Lemoine en bref</h3>
              <ul className="mt-2 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Changement à tout moment, sans frais</li>
                <li>Réponse de la banque : 10 jours ouvrés</li>
                <li>Sans questionnaire de santé : ≤ 200 000 € assurés par personne et fin du prêt avant 60 ans</li>
                <li>Refus possible seulement si garanties non équivalentes (critères CCSF)</li>
                <li>Droit à l’oubli : 5 ans (cancer, hépatite C)</li>
              </ul>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Sources : loi n° 2022-270, Code des assurances (L113-2-1, L113-12-2), Code de la consommation (L313-30 à L313-32, L313-39).
              </p>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  decimal,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  decimal?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
        {label}
        <input
          type="text"
          inputMode={decimal ? "decimal" : "numeric"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border px-4 py-3 text-base font-normal focus:outline-none focus:ring-2"
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
        />
      </label>
      {hint && (
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80 sm:text-sm"
      style={{
        borderColor: active ? "var(--primary)" : "var(--border)",
        color: active ? "var(--primary)" : "var(--muted)",
        background: active ? "rgba(13,79,60,0.06)" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, primary }: { label: string; value: string; sub?: string; primary?: boolean }) {
  return (
    <div className="rounded-2xl border p-5 text-center shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-sm" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="mt-1 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: primary ? "var(--primary)" : "var(--foreground)" }}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{sub}</p>}
    </div>
  );
}

function Check({ ok, children }: { ok: boolean | null; children: React.ReactNode }) {
  const color = ok === null ? "var(--muted)" : ok ? "#16a34a" : "#dc2626";
  return (
    <li className="flex items-start gap-2" style={{ color: "var(--foreground)" }}>
      <span className="mt-0.5 font-bold" style={{ color }} aria-hidden>
        {ok === null ? "?" : ok ? "✓" : "✗"}
      </span>
      <span>{children}</span>
    </li>
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
          {title} <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
