"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type LienParente =
  | "enfant"
  | "petit_enfant"
  | "frere_soeur"
  | "neveu_niece"
  | "autre_parent"
  | "non_parent";

const LIENS: { value: LienParente; label: string }[] = [
  { value: "enfant", label: "Enfant" },
  { value: "petit_enfant", label: "Petit-enfant" },
  { value: "frere_soeur", label: "Frere / Soeur" },
  { value: "neveu_niece", label: "Neveu / Niece" },
  { value: "autre_parent", label: "Autre parent" },
  { value: "non_parent", label: "Non-parent" },
];

const ABATTEMENTS: Record<LienParente, number> = {
  enfant: 100_000,
  petit_enfant: 1_594,
  frere_soeur: 15_932,
  neveu_niece: 7_967,
  autre_parent: 1_594,
  non_parent: 1_594,
};

// Bareme progressif ligne directe (enfant, petit-enfant)
const TRANCHES_LIGNE_DIRECTE = [
  { min: 0, max: 8_072, taux: 0.05 },
  { min: 8_072, max: 12_109, taux: 0.10 },
  { min: 12_109, max: 15_932, taux: 0.15 },
  { min: 15_932, max: 552_324, taux: 0.20 },
  { min: 552_324, max: 902_838, taux: 0.30 },
  { min: 902_838, max: 1_805_677, taux: 0.40 },
  { min: 1_805_677, max: Infinity, taux: 0.45 },
];

// Bareme frere/soeur
const TRANCHES_FRERE_SOEUR = [
  { min: 0, max: 24_430, taux: 0.35 },
  { min: 24_430, max: Infinity, taux: 0.45 },
];

function calculerDroitsProgressifs(
  baseTaxable: number,
  tranches: { min: number; max: number; taux: number }[]
): { droits: number; details: { tranche: string; base: number; taux: number; impot: number }[] } {
  let droits = 0;
  const details: { tranche: string; base: number; taux: number; impot: number }[] = [];

  for (const t of tranches) {
    if (baseTaxable <= t.min) break;
    const base = Math.min(baseTaxable, t.max) - t.min;
    const impot = base * t.taux;
    droits += impot;
    if (base > 0) {
      details.push({
        tranche: `${t.min.toLocaleString("fr-FR")} - ${t.max === Infinity ? "+" : t.max.toLocaleString("fr-FR")} \u20AC`,
        base,
        taux: t.taux,
        impot,
      });
    }
  }

  return { droits, details };
}

function calculerSuccession(montant: number, lien: LienParente) {
  const abattement = ABATTEMENTS[lien];
  const baseTaxable = Math.max(0, montant - abattement);

  let droits = 0;
  let details: { tranche: string; base: number; taux: number; impot: number }[] = [];

  if (lien === "enfant" || lien === "petit_enfant") {
    const result = calculerDroitsProgressifs(baseTaxable, TRANCHES_LIGNE_DIRECTE);
    droits = result.droits;
    details = result.details;
  } else if (lien === "frere_soeur") {
    const result = calculerDroitsProgressifs(baseTaxable, TRANCHES_FRERE_SOEUR);
    droits = result.droits;
    details = result.details;
  } else if (lien === "neveu_niece") {
    droits = baseTaxable * 0.55;
    if (baseTaxable > 0) {
      details.push({
        tranche: "Totalite",
        base: baseTaxable,
        taux: 0.55,
        impot: droits,
      });
    }
  } else {
    // autre_parent ou non_parent : 60%
    droits = baseTaxable * 0.60;
    if (baseTaxable > 0) {
      details.push({
        tranche: "Totalite",
        base: baseTaxable,
        taux: 0.60,
        impot: droits,
      });
    }
  }

  const tauxEffectif = montant > 0 ? (droits / montant) * 100 : 0;
  const netHerite = montant - droits;

  return { abattement, baseTaxable, droits, tauxEffectif, netHerite, details };
}

export default function SimulateurDroitsSuccession() {
  const [montant, setMontant] = useState("200000");
  const [lien, setLien] = useState<LienParente>("enfant");

  const montantNum = parseFloat(montant) || 0;

  const result = useMemo(
    () => calculerSuccession(montantNum, lien),
    [montantNum, lien]
  );

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
            Finance
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simulateur{" "}
            <span style={{ color: "var(--primary)" }}>droits de succession</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Estimez les droits de succession a payer selon le montant de l&apos;heritage
            et votre lien de parente avec le defunt.
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
                    Montant de l&apos;heritage
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      value={montant}
                      onChange={(e) => setMontant(e.target.value)}
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
                      &euro;
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Lien de parente
                  </label>
                  <select
                    value={lien}
                    onChange={(e) => setLien(e.target.value as LienParente)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {LIENS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Big results */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox
                label="Abattement"
                value={`${fmt(result.abattement)} \u20AC`}
              />
              <StatBox
                label="Base taxable"
                value={`${fmt(result.baseTaxable)} \u20AC`}
              />
              <StatBox
                label="Droits a payer"
                value={`${fmt(result.droits)} \u20AC`}
                primary
              />
              <StatBox
                label="Taux effectif"
                value={`${fmtPct(result.tauxEffectif)}%`}
                accent
              />
            </div>

            {/* Net herite */}
            <div
              className="rounded-2xl border p-6 text-center"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                Net herite
              </p>
              <p
                className="mt-2 text-4xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--primary)",
                }}
              >
                {fmt(result.netHerite)} &euro;
              </p>
              <p className="mt-1 text-lg" style={{ color: "var(--muted)" }}>
                sur {fmt(montantNum)} &euro; d&apos;heritage
              </p>
            </div>

            {/* Detail par tranche */}
            {result.details.length > 0 && (
              <div
                className="rounded-2xl border p-6"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--accent)" }}
                >
                  Detail par tranche
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ color: "var(--muted)" }}>
                        <th className="pb-3 text-left font-medium">Tranche</th>
                        <th className="pb-3 text-right font-medium">Taux</th>
                        <th className="pb-3 text-right font-medium">Base taxable</th>
                        <th className="pb-3 text-right font-medium">Droits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.details.map((d, i) => (
                        <tr
                          key={i}
                          className="border-t"
                          style={{ borderColor: "var(--surface-alt)" }}
                        >
                          <td className="py-3">{d.tranche}</td>
                          <td
                            className="py-3 text-right font-semibold"
                            style={{ color: "var(--accent)" }}
                          >
                            {(d.taux * 100).toFixed(0)}%
                          </td>
                          <td className="py-3 text-right">{fmt(d.base)} &euro;</td>
                          <td className="py-3 text-right font-semibold">
                            {fmt(d.impot)} &euro;
                          </td>
                        </tr>
                      ))}
                      <tr
                        className="border-t-2"
                        style={{ borderColor: "var(--primary)" }}
                      >
                        <td className="py-3 font-semibold" colSpan={3}>
                          Total des droits
                        </td>
                        <td
                          className="py-3 text-right text-lg font-bold"
                          style={{
                            color: "var(--primary)",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {fmt(result.droits)} &euro;
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Visual bar chart */}
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Repartition de l&apos;heritage
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  {
                    label: "Abattement",
                    value: Math.min(result.abattement, montantNum),
                    color: "var(--accent)",
                  },
                  {
                    label: "Net herite",
                    value: Math.max(result.netHerite - Math.min(result.abattement, montantNum), 0),
                    color: "var(--primary)",
                  },
                  {
                    label: "Droits de succession",
                    value: result.droits,
                    color: "var(--muted)",
                  },
                ].map((item) => {
                  const fill = montantNum > 0 ? (item.value / montantNum) * 100 : 0;
                  return (
                    <div key={item.label} className="flex items-center gap-3">
                      <span
                        className="w-36 text-right text-xs font-bold"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </span>
                      <div
                        className="h-6 flex-1 overflow-hidden rounded-full"
                        style={{ background: "var(--surface-alt)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(fill, 100)}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                      <span
                        className="w-14 text-right text-xs font-semibold"
                        style={{ color: item.color }}
                      >
                        {fmtPct(fill)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contenu SEO */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Comprendre les droits de succession
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  Les droits de succession sont un{" "}
                  <strong className="text-[var(--foreground)]">
                    impot preleve sur la part d&apos;heritage
                  </strong>{" "}
                  recue par chaque beneficiaire. Le montant depend de deux facteurs : la
                  valeur des biens transmis et le lien de parente avec le defunt.
                </p>
                <p>
                  Un{" "}
                  <strong className="text-[var(--foreground)]">abattement</strong> est
                  d&apos;abord applique : 100 000 &euro; pour un enfant, 15 932 &euro;
                  pour un frere ou une soeur, 7 967 &euro; pour un neveu ou une niece, et
                  1 594 &euro; pour les autres. La part qui depasse l&apos;abattement est
                  ensuite soumise a un{" "}
                  <strong className="text-[var(--foreground)]">bareme progressif</strong>{" "}
                  allant de 5% a 45% en ligne directe.
                </p>
                <p>
                  Les heritiers plus eloignes paient des taux plus eleves : 35% a 45%
                  entre freres et soeurs, 55% pour les neveux et nieces, et{" "}
                  <strong className="text-[var(--foreground)]">60%</strong> pour les
                  non-parents.
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
                    Quel est l&apos;abattement pour une succession parent-enfant ?
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    Chaque enfant beneficie d&apos;un abattement de 100 000 &euro; sur la
                    part d&apos;heritage recue de chaque parent. Cela signifie qu&apos;un
                    enfant peut heriter de 100 000 &euro; de son pere et 100 000 &euro; de
                    sa mere sans payer de droits. Cet abattement se reconstitue tous les 15
                    ans : les donations anterieures de plus de 15 ans ne sont plus prises
                    en compte.
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
                    Comment reduire les droits de succession ?
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    Plusieurs strategies permettent de reduire les droits : la donation de
                    son vivant (l&apos;abattement de 100 000 &euro; se renouvelle tous les
                    15 ans), l&apos;assurance-vie (abattement specifique de 152 500 &euro;
                    par beneficiaire pour les versements avant 70 ans), le demembrement de
                    propriete, ou encore le pacte Dutreil pour les entreprises familiales
                    (exoneration de 75% de la valeur).
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
                    Les freres et soeurs sont-ils exoneres ?
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    Les freres et soeurs beneficient d&apos;un abattement de 15 932
                    &euro;. Au-dela, le taux est de 35% jusqu&apos;a 24 430 &euro; puis 45%.
                    Toutefois, une exoneration totale existe si le frere ou la soeur remplit
                    trois conditions cumulatives : avoir plus de 50 ans ou etre invalide,
                    avoir vecu avec le defunt pendant les 5 dernieres annees, et etre
                    celibataire, veuf, divorce ou separe.
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
                    Quel est le delai pour payer les droits de succession ?
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--muted)" }}
                  >
                    Les droits de succession doivent etre payes au moment du depot de la
                    declaration de succession, soit dans les 6 mois suivant le deces (12
                    mois si le deces a eu lieu a l&apos;etranger). Un paiement fractionne
                    (jusqu&apos;a 3 ans) ou differe (en cas de nue-propriete) peut etre
                    demande aupres de l&apos;administration fiscale, sous reserve de
                    fournir des garanties.
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
                Abattements
              </h3>
              <ul
                className="mt-3 space-y-2 text-sm"
                style={{ color: "var(--muted)" }}
              >
                <li>
                  Enfant :{" "}
                  <strong className="text-[var(--foreground)]">100 000 &euro;</strong>
                </li>
                <li>
                  Frere/soeur :{" "}
                  <strong className="text-[var(--foreground)]">15 932 &euro;</strong>
                </li>
                <li>
                  Neveu/niece :{" "}
                  <strong className="text-[var(--foreground)]">7 967 &euro;</strong>
                </li>
                <li>
                  Petit-enfant :{" "}
                  <strong className="text-[var(--foreground)]">1 594 &euro;</strong>
                </li>
                <li>
                  Non-parent :{" "}
                  <strong className="text-[var(--foreground)]">1 594 &euro;</strong>
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
                Taux par lien
              </h3>
              <ul
                className="mt-3 space-y-2 text-sm"
                style={{ color: "var(--muted)" }}
              >
                <li>
                  Ligne directe :{" "}
                  <strong className="text-[var(--foreground)]">5% a 45%</strong>
                </li>
                <li>
                  Frere/soeur :{" "}
                  <strong className="text-[var(--foreground)]">35% a 45%</strong>
                </li>
                <li>
                  Neveu/niece :{" "}
                  <strong className="text-[var(--foreground)]">55%</strong>
                </li>
                <li>
                  Non-parent :{" "}
                  <strong className="text-[var(--foreground)]">60%</strong>
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
