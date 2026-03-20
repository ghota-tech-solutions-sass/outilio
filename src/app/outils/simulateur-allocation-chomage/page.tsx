"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type MotifFin = "licenciement" | "rupture_conventionnelle" | "fin_cdd";

const MOTIFS: { value: MotifFin; label: string }[] = [
  { value: "licenciement", label: "Licenciement" },
  { value: "rupture_conventionnelle", label: "Rupture conventionnelle" },
  { value: "fin_cdd", label: "Fin de CDD" },
];

const PLANCHER_JOURNALIER = 31.59; // 2026
const PART_FIXE = 12.95; // euros/jour
const TAUX_1 = 0.404; // 40.4%
const TAUX_2 = 0.57; // 57%
const PLAFOND_SJR_RATIO = 0.75; // 75% du SJR

function calculerDureeIndemnisation(moisTravailles: number, age: number): number {
  // Duree en mois selon mois travailles et age
  // Minimum 6 mois travailles sur 24 derniers mois
  if (moisTravailles < 6) return 0;

  // Duree = mois travailles (plafonnee)
  if (age < 53) {
    return Math.min(moisTravailles, 18);
  } else if (age < 55) {
    return Math.min(moisTravailles, 22.5);
  } else {
    return Math.min(moisTravailles, 27);
  }
}

function calculerARE(salaireBrutMensuel: number, moisTravailles: number, age: number) {
  const salaireBrutTotal = salaireBrutMensuel * moisTravailles;
  const joursTravailes = moisTravailles * 30.42; // jours calendaires moyens par mois
  const sjr = joursTravailes > 0 ? salaireBrutTotal / joursTravailes : 0;

  // Calcul ARE journaliere : max des 2 formules
  const formule1 = TAUX_1 * sjr + PART_FIXE;
  const formule2 = TAUX_2 * sjr;
  let areJournaliere = Math.max(formule1, formule2);

  // Plancher
  areJournaliere = Math.max(areJournaliere, PLANCHER_JOURNALIER);

  // Plafond : 75% du SJR
  const plafond = PLAFOND_SJR_RATIO * sjr;
  if (plafond > 0) {
    areJournaliere = Math.min(areJournaliere, plafond);
  }

  const areMensuelle = areJournaliere * 30;
  const dureeIndemnisation = calculerDureeIndemnisation(moisTravailles, age);
  const montantTotal = areJournaliere * dureeIndemnisation * 30.42;
  const tauxRemplacement = salaireBrutMensuel > 0 ? (areMensuelle / salaireBrutMensuel) * 100 : 0;

  return {
    sjr,
    areJournaliere,
    areMensuelle,
    dureeIndemnisation,
    montantTotal,
    formule1,
    formule2,
    plafond,
    tauxRemplacement,
  };
}

export default function SimulateurAllocationChomage() {
  const [salaire, setSalaire] = useState("2500");
  const [moisTravailles, setMoisTravailles] = useState("24");
  const [age, setAge] = useState("35");
  const [motif, setMotif] = useState<MotifFin>("licenciement");

  const salaireNum = parseFloat(salaire) || 0;
  const moisNum = parseInt(moisTravailles) || 0;
  const ageNum = parseInt(age) || 0;

  const result = useMemo(
    () => calculerARE(salaireNum, moisNum, ageNum),
    [salaireNum, moisNum, ageNum]
  );

  const eligible = moisNum >= 6 && salaireNum > 0;

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtPct = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Emploi
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simulateur{" "}
            <span style={{ color: "var(--primary)" }}>allocation chomage (ARE)</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Estimez votre allocation de retour a l&apos;emploi (ARE), la duree
            d&apos;indemnisation et le montant total de vos droits.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Salaire brut mensuel moyen (12 derniers mois)
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      value={salaire}
                      onChange={(e) => setSalaire(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                      style={{
                        borderColor: "var(--border)",
                        fontFamily: "var(--font-display)",
                      }}
                    />
                    <span
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg"
                      style={{ color: "var(--muted)" }}
                    >
                      &euro;/mois
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Mois travailles (24 derniers mois)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={moisTravailles}
                      onChange={(e) => setMoisTravailles(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--muted)" }}
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      min="16"
                      max="67"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Motif de fin de contrat
                  </label>
                  <select
                    value={motif}
                    onChange={(e) => setMotif(e.target.value as MotifFin)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {MOTIFS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Eligibility warning */}
            {!eligible && (
              <div
                className="rounded-2xl border p-6 text-center"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                }}
              >
                <p className="text-sm font-semibold">
                  {moisNum < 6
                    ? "Il faut avoir travaille au moins 6 mois sur les 24 derniers mois pour etre eligible a l'ARE."
                    : "Renseignez un salaire brut pour lancer le calcul."}
                </p>
              </div>
            )}

            {/* Big results */}
            {eligible && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <StatBox
                    label="ARE journaliere"
                    value={`${fmt(result.areJournaliere)} \u20AC`}
                    primary
                  />
                  <StatBox
                    label="ARE mensuelle"
                    value={`${fmt(result.areMensuelle)} \u20AC`}
                  />
                  <StatBox
                    label="Duree"
                    value={`${fmtPct(result.dureeIndemnisation)} mois`}
                  />
                  <StatBox
                    label="Taux remplacement"
                    value={`${fmtPct(result.tauxRemplacement)}%`}
                    accent
                  />
                </div>

                {/* Total */}
                <div
                  className="rounded-2xl border p-6 text-center"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: "var(--muted)" }}
                  >
                    Montant total estime
                  </p>
                  <p
                    className="mt-2 text-4xl font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--primary)",
                    }}
                  >
                    {fmt(result.montantTotal)} &euro;
                  </p>
                  <p className="mt-1 text-lg" style={{ color: "var(--muted)" }}>
                    sur {fmtPct(result.dureeIndemnisation)} mois d&apos;indemnisation
                  </p>
                </div>

                {/* Detail du calcul */}
                <div
                  className="rounded-2xl border p-6"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <h2
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Detail du calcul
                  </h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                          <td className="py-3" style={{ color: "var(--muted)" }}>
                            Salaire brut total
                          </td>
                          <td className="py-3 text-right font-semibold">
                            {fmt(salaireNum * moisNum)} &euro;
                          </td>
                        </tr>
                        <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                          <td className="py-3" style={{ color: "var(--muted)" }}>
                            Jours calendaires travailles
                          </td>
                          <td className="py-3 text-right font-semibold">
                            {fmt(moisNum * 30.42)} jours
                          </td>
                        </tr>
                        <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                          <td className="py-3" style={{ color: "var(--muted)" }}>
                            SJR (Salaire Journalier de Reference)
                          </td>
                          <td
                            className="py-3 text-right font-semibold"
                            style={{ color: "var(--accent)" }}
                          >
                            {fmt(result.sjr)} &euro;
                          </td>
                        </tr>
                        <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                          <td className="py-3" style={{ color: "var(--muted)" }}>
                            Formule 1 : 40,4% SJR + 12,95 &euro;
                          </td>
                          <td className="py-3 text-right font-semibold">
                            {fmt(result.formule1)} &euro;/jour
                          </td>
                        </tr>
                        <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                          <td className="py-3" style={{ color: "var(--muted)" }}>
                            Formule 2 : 57% SJR
                          </td>
                          <td className="py-3 text-right font-semibold">
                            {fmt(result.formule2)} &euro;/jour
                          </td>
                        </tr>
                        <tr className="border-t" style={{ borderColor: "var(--surface-alt)" }}>
                          <td className="py-3" style={{ color: "var(--muted)" }}>
                            Plafond (75% SJR)
                          </td>
                          <td className="py-3 text-right font-semibold">
                            {fmt(result.plafond)} &euro;/jour
                          </td>
                        </tr>
                        <tr
                          className="border-t-2"
                          style={{ borderColor: "var(--primary)" }}
                        >
                          <td className="py-3 font-semibold">ARE journaliere retenue</td>
                          <td
                            className="py-3 text-right text-lg font-bold"
                            style={{
                              color: "var(--primary)",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            {fmt(result.areJournaliere)} &euro;
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Visual : barre duree */}
                <div
                  className="rounded-2xl border p-6"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <h2
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Duree d&apos;indemnisation
                  </h2>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Moins de 53 ans", max: 18 },
                      { label: "53-54 ans", max: 22.5 },
                      { label: "55 ans et plus", max: 27 },
                    ].map((tranche) => {
                      const isActive =
                        (tranche.max === 18 && ageNum < 53) ||
                        (tranche.max === 22.5 && ageNum >= 53 && ageNum < 55) ||
                        (tranche.max === 27 && ageNum >= 55);
                      const fill = isActive
                        ? (result.dureeIndemnisation / tranche.max) * 100
                        : 0;
                      return (
                        <div key={tranche.label} className="flex items-center gap-3">
                          <span
                            className="w-32 text-right text-xs font-bold"
                            style={{
                              color: isActive ? "var(--primary)" : "var(--muted)",
                            }}
                          >
                            {tranche.label}
                          </span>
                          <div
                            className="h-6 flex-1 overflow-hidden rounded-full"
                            style={{ background: "var(--surface-alt)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(fill, 100)}%`,
                                background: isActive
                                  ? "var(--primary)"
                                  : "var(--border)",
                              }}
                            />
                          </div>
                          <span
                            className="w-16 text-right text-xs"
                            style={{
                              color: isActive ? "var(--primary)" : "var(--muted)",
                            }}
                          >
                            max {tranche.max} mois
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Contenu SEO */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Comment est calculee l&apos;allocation chomage ?
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  L&apos;allocation de retour a l&apos;emploi (ARE) est calculee a partir du{" "}
                  <strong className="text-[var(--foreground)]">
                    Salaire Journalier de Reference (SJR)
                  </strong>
                  , obtenu en divisant le total des salaires bruts des 12 derniers mois par
                  le nombre de jours calendaires de la periode d&apos;emploi.
                </p>
                <p>
                  Deux formules sont appliquees, et France Travail retient{" "}
                  <strong className="text-[var(--foreground)]">la plus avantageuse</strong>{" "}
                  : soit 40,4% du SJR + 12,95 &euro;/jour, soit 57% du SJR. Le montant ne
                  peut pas depasser 75% du SJR ni etre inferieur a 31,59 &euro;/jour.
                </p>
                <p>
                  La{" "}
                  <strong className="text-[var(--foreground)]">
                    duree d&apos;indemnisation
                  </strong>{" "}
                  depend du nombre de mois travailles et de l&apos;age : jusqu&apos;a 18
                  mois avant 53 ans, 22,5 mois entre 53 et 54 ans, et 27 mois a partir de
                  55 ans.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Questions frequentes
              </h2>
              <div className="mt-6 space-y-5">
                <div
                  className="rounded-xl p-5"
                  style={{ background: "var(--surface-alt)" }}
                >
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Quelles sont les conditions pour toucher le chomage ?
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    Pour beneficier de l&apos;ARE, il faut avoir travaille au moins 6 mois
                    (130 jours ou 910 heures) au cours des 24 derniers mois (36 mois pour
                    les plus de 53 ans). Il faut egalement etre inscrit a France Travail,
                    etre en recherche active d&apos;emploi et ne pas avoir quitte
                    volontairement son emploi (sauf cas particuliers comme la demission
                    legitime).
                  </p>
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{ background: "var(--surface-alt)" }}
                >
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Quelle est la difference entre SJR et ARE ?
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    Le SJR (Salaire Journalier de Reference) est la base de calcul : il
                    represente le salaire brut moyen par jour calendaire. L&apos;ARE
                    (Allocation de Retour a l&apos;Emploi) est le montant effectivement
                    verse chaque jour, calcule a partir du SJR avec les formules de France
                    Travail. L&apos;ARE represente generalement entre 57% et 75% du SJR.
                  </p>
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{ background: "var(--surface-alt)" }}
                >
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    La rupture conventionnelle donne-t-elle droit au chomage ?
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    Oui, la rupture conventionnelle ouvre les memes droits au chomage
                    qu&apos;un licenciement. Attention toutefois : un delai de carence
                    (minimum 7 jours) s&apos;applique, augmente d&apos;un differ
                    d&apos;indemnisation si l&apos;indemnite de rupture depasse le minimum
                    legal. Le versement de l&apos;ARE peut ainsi etre retarde de plusieurs
                    semaines.
                  </p>
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{ background: "var(--surface-alt)" }}
                >
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    L&apos;ARE est-elle imposable ?
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    Oui, l&apos;allocation chomage est soumise a l&apos;impot sur le
                    revenu. Elle est egalement soumise a la CSG (6,2%) et a la CRDS
                    (0,5%), sauf si le prelevement ferait passer l&apos;allocation en
                    dessous du plancher journalier. Le prelevement a la source
                    s&apos;applique directement sur le versement mensuel.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Duree maximale ARE
              </h3>
              <ul
                className="mt-3 space-y-2 text-sm"
                style={{ color: "var(--muted)" }}
              >
                <li>
                  Moins de 53 ans :{" "}
                  <strong className="text-[var(--foreground)]">18 mois max</strong>
                </li>
                <li>
                  53-54 ans :{" "}
                  <strong className="text-[var(--foreground)]">22,5 mois max</strong>
                </li>
                <li>
                  55 ans et plus :{" "}
                  <strong className="text-[var(--foreground)]">27 mois max</strong>
                </li>
              </ul>
            </div>
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Reperes 2026
              </h3>
              <ul
                className="mt-3 space-y-2 text-sm"
                style={{ color: "var(--muted)" }}
              >
                <li>
                  Plancher ARE :{" "}
                  <strong className="text-[var(--foreground)]">31,59 &euro;/jour</strong>
                </li>
                <li>
                  Part fixe :{" "}
                  <strong className="text-[var(--foreground)]">12,95 &euro;/jour</strong>
                </li>
                <li>
                  Plafond :{" "}
                  <strong className="text-[var(--foreground)]">75% du SJR</strong>
                </li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function StatBox({
  label,
  value,
  primary,
  accent,
}: {
  label: string;
  value: string;
  primary?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-4 text-center"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-lg font-bold"
        style={{
          fontFamily: "var(--font-display)",
          color: primary
            ? "var(--primary)"
            : accent
              ? "var(--accent)"
              : "var(--foreground)",
        }}
      >
        {value}
      </p>
    </div>
  );
}
