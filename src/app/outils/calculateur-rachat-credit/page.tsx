"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface Credit {
  id: number;
  label: string;
  montantRestant: string;
  taux: string;
  dureeRestante: string;
  mensualite: string;
}

let nextId = 1;

function createCredit(): Credit {
  return {
    id: nextId++,
    label: "",
    montantRestant: "",
    taux: "",
    dureeRestante: "",
    mensualite: "",
  };
}

export default function CalculateurRachatCredit() {
  const [credits, setCredits] = useState<Credit[]>([
    { id: nextId++, label: "Credit immobilier", montantRestant: "120000", taux: "3.2", dureeRestante: "180", mensualite: "845" },
    { id: nextId++, label: "Credit auto", montantRestant: "8000", taux: "5.5", dureeRestante: "36", mensualite: "241" },
  ]);
  const [nouveauTaux, setNouveauTaux] = useState("2.8");
  const [nouvelleDuree, setNouvelleDuree] = useState("240");
  const [fraisIRA, setFraisIRA] = useState("1");
  const [fraisDossier, setFraisDossier] = useState("500");

  const updateCredit = (id: number, field: keyof Credit, value: string) => {
    setCredits((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addCredit = () => {
    setCredits((prev) => [...prev, createCredit()]);
  };

  const removeCredit = (id: number) => {
    setCredits((prev) => prev.filter((c) => c.id !== id));
  };

  const result = useMemo(() => {
    const creditsValides = credits.filter(
      (c) =>
        (parseFloat(c.montantRestant) || 0) > 0 &&
        (parseFloat(c.mensualite) || 0) > 0
    );
    if (creditsValides.length === 0) return null;

    // Situation actuelle
    const totalMensualiteActuelle = creditsValides.reduce(
      (sum, c) => sum + (parseFloat(c.mensualite) || 0),
      0
    );
    const totalCapitalRestant = creditsValides.reduce(
      (sum, c) => sum + (parseFloat(c.montantRestant) || 0),
      0
    );
    const dureeMaxActuelle = Math.max(
      ...creditsValides.map((c) => parseFloat(c.dureeRestante) || 0)
    );

    // Cout total actuel (somme de mensualite * duree restante pour chaque credit)
    const coutTotalActuel = creditsValides.reduce((sum, c) => {
      const mens = parseFloat(c.mensualite) || 0;
      const dur = parseFloat(c.dureeRestante) || 0;
      return sum + mens * dur;
    }, 0);

    // Frais de rachat
    const tauxIRA = (parseFloat(fraisIRA) || 0) / 100;
    const montantIRA = totalCapitalRestant * tauxIRA;
    const dossier = parseFloat(fraisDossier) || 0;
    const totalFrais = montantIRA + dossier;

    // Nouveau credit
    const capitalNouveau = totalCapitalRestant + totalFrais;
    const r = (parseFloat(nouveauTaux) || 0) / 100 / 12;
    const n = parseFloat(nouvelleDuree) || 0;

    if (r <= 0 || n <= 0) return null;

    const nouvelleMensualite = (capitalNouveau * r) / (1 - Math.pow(1 + r, -n));
    const coutTotalNouveau = nouvelleMensualite * n;
    const interetsTotauxNouveau = coutTotalNouveau - capitalNouveau;

    const economieMensuelle = totalMensualiteActuelle - nouvelleMensualite;
    const economieTotale = coutTotalActuel - coutTotalNouveau;

    return {
      totalMensualiteActuelle,
      totalCapitalRestant,
      dureeMaxActuelle,
      coutTotalActuel,
      montantIRA,
      totalFrais,
      capitalNouveau,
      nouvelleMensualite,
      coutTotalNouveau,
      interetsTotauxNouveau,
      economieMensuelle,
      economieTotale,
      nouvelleDureeMois: n,
      avantageux: economieTotale > 0,
    };
  }, [credits, nouveauTaux, nouvelleDuree, fraisIRA, fraisDossier]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const fmt0 = (n: number) =>
    n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });

  return (
    <>
      <section
        className="relative py-14"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
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
            Rachat de{" "}
            <span style={{ color: "var(--primary)" }}>credit</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Regroupez vos credits en un seul et comparez : mensualites, cout
            total, economie reelle. Incluez les frais de rachat (IRA, dossier).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Credits existants */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex items-center justify-between">
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--accent)" }}
                >
                  Credits existants
                </h2>
                <button
                  onClick={addCredit}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  + Ajouter un credit
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {credits.map((credit, index) => (
                  <div
                    key={credit.id}
                    className="animate-fade-up rounded-xl border p-4"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface-alt)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        placeholder={`Credit ${index + 1}`}
                        value={credit.label}
                        onChange={(e) =>
                          updateCredit(credit.id, "label", e.target.value)
                        }
                        className="bg-transparent text-sm font-semibold outline-none"
                        style={{ fontFamily: "var(--font-display)" }}
                      />
                      {credits.length > 1 && (
                        <button
                          onClick={() => removeCredit(credit.id)}
                          className="rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-red-50"
                          style={{ color: "#dc2626" }}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <CreditField
                        label="Capital restant (€)"
                        value={credit.montantRestant}
                        onChange={(v) =>
                          updateCredit(credit.id, "montantRestant", v)
                        }
                      />
                      <CreditField
                        label="Taux (%)"
                        value={credit.taux}
                        onChange={(v) => updateCredit(credit.id, "taux", v)}
                        step="0.1"
                      />
                      <CreditField
                        label="Duree restante (mois)"
                        value={credit.dureeRestante}
                        onChange={(v) =>
                          updateCredit(credit.id, "dureeRestante", v)
                        }
                      />
                      <CreditField
                        label="Mensualite (€)"
                        value={credit.mensualite}
                        onChange={(v) =>
                          updateCredit(credit.id, "mensualite", v)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nouveau credit */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Nouveau credit unique
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Nouveau taux (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={nouveauTaux}
                    onChange={(e) => setNouveauTaux(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-medium"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Duree souhaitee (mois)
                  </label>
                  <input
                    type="number"
                    value={nouvelleDuree}
                    onChange={(e) => setNouvelleDuree(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-medium"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>
            </div>

            {/* Frais de rachat */}
            <div
              className="rounded-2xl border p-6"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Frais de rachat (optionnel)
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    IRA - Indemnites remb. anticipe (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={fraisIRA}
                    onChange={(e) => setFraisIRA(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-medium"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--muted)" }}
                  >
                    Frais de dossier (€)
                  </label>
                  <input
                    type="number"
                    value={fraisDossier}
                    onChange={(e) => setFraisDossier(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-medium"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>
            </div>

            {/* Resultats */}
            {result && (
              <>
                {/* Verdict */}
                <div
                  className="animate-fade-up rounded-2xl border-2 p-6 text-center"
                  style={{
                    borderColor: result.avantageux
                      ? "var(--primary)"
                      : "#dc2626",
                    background: result.avantageux
                      ? "rgba(13, 79, 60, 0.05)"
                      : "rgba(220, 38, 38, 0.05)",
                  }}
                >
                  <p
                    className="text-2xl font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: result.avantageux
                        ? "var(--primary)"
                        : "#dc2626",
                    }}
                  >
                    {result.avantageux
                      ? "Le rachat est avantageux"
                      : "Le rachat n'est pas avantageux"}
                  </p>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    {result.avantageux
                      ? `Vous economisez ${fmt(result.economieTotale)} € sur la duree totale du credit.`
                      : `Le rachat vous couterait ${fmt(Math.abs(result.economieTotale))} € de plus au total.`}
                  </p>
                </div>

                {/* Cards comparatif */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <StatCard
                    label="Mensualite actuelle"
                    value={`${fmt(result.totalMensualiteActuelle)} €`}
                    color="var(--foreground)"
                  />
                  <StatCard
                    label="Nouvelle mensualite"
                    value={`${fmt(result.nouvelleMensualite)} €`}
                    color="var(--primary)"
                  />
                  <StatCard
                    label="Economie / mois"
                    value={`${result.economieMensuelle >= 0 ? "+" : ""}${fmt(result.economieMensuelle)} €`}
                    color={
                      result.economieMensuelle >= 0
                        ? "var(--primary)"
                        : "#dc2626"
                    }
                  />
                  <StatCard
                    label="Economie totale"
                    value={`${result.economieTotale >= 0 ? "+" : ""}${fmt0(result.economieTotale)} €`}
                    color={
                      result.economieTotale >= 0
                        ? "var(--primary)"
                        : "#dc2626"
                    }
                  />
                </div>

                {/* Tableau comparatif detaille */}
                <div
                  className="rounded-2xl border p-6"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <h2
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Comparaison detaillee
                  </h2>
                  <div className="mt-4 space-y-2 text-sm">
                    <CompareRow
                      label="Mensualites totales"
                      avant={`${fmt(result.totalMensualiteActuelle)} € / mois`}
                      apres={`${fmt(result.nouvelleMensualite)} € / mois`}
                      better={result.economieMensuelle > 0}
                    />
                    <CompareRow
                      label="Cout total"
                      avant={`${fmt0(result.coutTotalActuel)} €`}
                      apres={`${fmt0(result.coutTotalNouveau)} €`}
                      better={result.economieTotale > 0}
                    />
                    <CompareRow
                      label="Duree"
                      avant={`${fmt0(result.dureeMaxActuelle)} mois (${(result.dureeMaxActuelle / 12).toFixed(1)} ans)`}
                      apres={`${fmt0(result.nouvelleDureeMois)} mois (${(result.nouvelleDureeMois / 12).toFixed(1)} ans)`}
                      better={result.nouvelleDureeMois <= result.dureeMaxActuelle}
                    />
                    <div
                      className="mt-4 rounded-lg px-3 py-2"
                      style={{ background: "var(--surface-alt)" }}
                    >
                      <div className="flex justify-between">
                        <span style={{ color: "var(--muted)" }}>
                          Capital restant total
                        </span>
                        <span className="font-medium">
                          {fmt0(result.totalCapitalRestant)} €
                        </span>
                      </div>
                    </div>
                    <div
                      className="rounded-lg px-3 py-2"
                      style={{ background: "var(--surface-alt)" }}
                    >
                      <div className="flex justify-between">
                        <span style={{ color: "var(--muted)" }}>
                          Indemnites de remb. anticipe (IRA)
                        </span>
                        <span className="font-medium">
                          {fmt(result.montantIRA)} €
                        </span>
                      </div>
                    </div>
                    <div
                      className="rounded-lg px-3 py-2"
                      style={{ background: "var(--surface-alt)" }}
                    >
                      <div className="flex justify-between">
                        <span style={{ color: "var(--muted)" }}>
                          Frais totaux de rachat
                        </span>
                        <span className="font-medium">
                          {fmt(result.totalFrais)} €
                        </span>
                      </div>
                    </div>
                    <div
                      className="rounded-lg px-3 py-2"
                      style={{ background: "var(--surface-alt)" }}
                    >
                      <div className="flex justify-between">
                        <span style={{ color: "var(--muted)" }}>
                          Nouveau capital emprunte (capital + frais)
                        </span>
                        <span className="font-medium">
                          {fmt0(result.capitalNouveau)} €
                        </span>
                      </div>
                    </div>
                    <div
                      className="rounded-lg px-3 py-2"
                      style={{ background: "var(--surface-alt)" }}
                    >
                      <div className="flex justify-between">
                        <span style={{ color: "var(--muted)" }}>
                          Interets du nouveau credit
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: "var(--accent)" }}
                        >
                          {fmt0(result.interetsTotauxNouveau)} €
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barre visuelle */}
                <div
                  className="rounded-2xl border p-6"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <h2
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Comparaison visuelle du cout total
                  </h2>
                  <div className="mt-4 space-y-3">
                    {(() => {
                      const max = Math.max(
                        result.coutTotalActuel,
                        result.coutTotalNouveau
                      );
                      return (
                        <>
                          <div>
                            <div className="flex items-center justify-between text-xs font-semibold mb-1">
                              <span style={{ color: "var(--muted)" }}>
                                Situation actuelle
                              </span>
                              <span>{fmt0(result.coutTotalActuel)} €</span>
                            </div>
                            <div
                              className="h-6 rounded-full"
                              style={{ background: "var(--surface-alt)" }}
                            >
                              <div
                                className="h-6 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(result.coutTotalActuel / max) * 100}%`,
                                  background: "var(--muted)",
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-xs font-semibold mb-1">
                              <span style={{ color: "var(--muted)" }}>
                                Apres rachat
                              </span>
                              <span
                                style={{
                                  color: result.avantageux
                                    ? "var(--primary)"
                                    : "#dc2626",
                                }}
                              >
                                {fmt0(result.coutTotalNouveau)} €
                              </span>
                            </div>
                            <div
                              className="h-6 rounded-full"
                              style={{ background: "var(--surface-alt)" }}
                            >
                              <div
                                className="h-6 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(result.coutTotalNouveau / max) * 100}%`,
                                  background: result.avantageux
                                    ? "var(--primary)"
                                    : "#dc2626",
                                }}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}

            {/* Contenu SEO */}
            <div
              className="rounded-2xl border p-8"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Qu&apos;est-ce que le rachat de credit ?
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  <strong className="text-[var(--foreground)]">
                    Principe
                  </strong>{" "}
                  : Le rachat de credit (ou regroupement de credits) consiste a
                  remplacer un ou plusieurs prets existants par un credit unique,
                  generalement a un taux plus avantageux ou sur une duree
                  differente.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">
                    Indemnites de remboursement anticipe (IRA)
                  </strong>{" "}
                  : Lors du remboursement anticipe d&apos;un pret, la banque peut
                  appliquer des penalites plafonnees a 3% du capital restant du
                  (ou 6 mois d&apos;interets). Integrez-les dans votre simulation
                  pour un resultat realiste.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">
                    Quand est-ce interessant ?
                  </strong>{" "}
                  : Un rachat est generalement avantageux si la difference de
                  taux est superieure a 0.7 point, si la duree restante est
                  suffisamment longue, et si l&apos;economie totale couvre
                  largement les frais de rachat.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
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
                Conseils rachat
              </h3>
              <ul
                className="mt-3 space-y-2 text-sm"
                style={{ color: "var(--muted)" }}
              >
                <li>
                  Ecart de taux &gt;{" "}
                  <strong className="text-[var(--primary)]">0.7%</strong> =
                  souvent rentable
                </li>
                <li>
                  Verifiez les IRA dans vos contrats actuels
                </li>
                <li>
                  Comparez les offres de plusieurs banques
                </li>
                <li>
                  Incluez tous les frais (dossier, garantie, assurance)
                </li>
                <li>
                  Un courtier peut negocier de meilleurs taux
                </li>
              </ul>
            </div>
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
                Types de credits rachetables
              </h3>
              <div className="mt-3 space-y-2">
                {[
                  "Credit immobilier",
                  "Credit auto",
                  "Credit consommation",
                  "Credit travaux",
                  "Pret personnel",
                  "Credit revolving",
                ].map((type) => (
                  <div
                    key={type}
                    className="rounded-xl px-3 py-2 text-xs font-semibold"
                    style={{ background: "var(--surface-alt)" }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function CreditField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
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
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-medium"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
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
        className="mt-1 text-xl font-bold"
        style={{ fontFamily: "var(--font-display)", color }}
      >
        {value}
      </p>
    </div>
  );
}

function CompareRow({
  label,
  avant,
  apres,
  better,
}: {
  label: string;
  avant: string;
  apres: string;
  better: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-1 rounded-lg px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
      style={{ background: "var(--surface-alt)" }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-3 text-sm">
        <span className="font-medium" style={{ color: "var(--muted)" }}>
          {avant}
        </span>
        <span style={{ color: "var(--accent)" }}>&rarr;</span>
        <span
          className="font-bold"
          style={{ color: better ? "var(--primary)" : "#dc2626" }}
        >
          {apres}
        </span>
      </div>
    </div>
  );
}
