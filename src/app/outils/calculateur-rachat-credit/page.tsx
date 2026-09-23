"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const PRESETS_TAUX = [
  { label: "Très bon", value: 2.5 },
  { label: "Bon", value: 3.2 },
  { label: "Moyen", value: 4.0 },
  { label: "Élevé", value: 5.0 },
];

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
    { id: nextId++, label: "Crédit immobilier", montantRestant: "120000", taux: "3.2", dureeRestante: "180", mensualite: "845" },
    { id: nextId++, label: "Crédit auto", montantRestant: "8000", taux: "5.5", dureeRestante: "36", mensualite: "241" },
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

    if (r < 0 || n <= 0) return null;

    // Taux a 0 % : remboursement lineaire du capital
    const nouvelleMensualite = r === 0 ? capitalNouveau / n : (capitalNouveau * r) / (1 - Math.pow(1 + r, -n));
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
            <span style={{ color: "var(--primary)" }}>crédit</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Regroupez vos crédits en un seul et comparez : mensualités, coût
            total, économie réelle. Incluez les frais de rachat (IRA, dossier).
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
                  Crédits existants
                </h2>
                <button
                  onClick={addCredit}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  + Ajouter un crédit
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
                        placeholder={`Crédit ${index + 1}`}
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
                        label="Durée restante (mois)"
                        value={credit.dureeRestante}
                        onChange={(v) =>
                          updateCredit(credit.id, "dureeRestante", v)
                        }
                      />
                      <CreditField
                        label="Mensualité (€)"
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
                Nouveau crédit unique
              </h2>
              <div className="mt-4">
                <label
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Nouveau taux d&apos;intérêt (%)
                </label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    step="0.05"
                    value={nouveauTaux}
                    onChange={(e) => setNouveauTaux(e.target.value)}
                    className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>%</span>
                </div>
                {/* Slider taux */}
                <input
                  type="range"
                  min={1.5}
                  max={7}
                  step={0.05}
                  value={Math.min(Math.max(parseFloat(nouveauTaux) || 0, 1.5), 7)}
                  onChange={(e) => setNouveauTaux(e.target.value)}
                  className="mt-3 w-full accent-[#0d4f3c]"
                  aria-label="Curseur nouveau taux"
                />
                {/* Presets pills */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS_TAUX.map((p) => {
                    const isActive = parseFloat(nouveauTaux) === p.value;
                    return (
                      <button
                        key={p.label}
                        onClick={() => setNouveauTaux(String(p.value))}
                        className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                        style={{
                          borderColor: isActive ? "var(--primary)" : "var(--border)",
                          color: isActive ? "var(--primary)" : "var(--muted)",
                          background: isActive ? "rgba(13,79,60,0.06)" : "transparent",
                        }}
                      >
                        {p.label}{" "}
                        <span style={{ color: isActive ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                          {p.value.toFixed(2).replace(".", ",")}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-4">
                <label
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  Durée souhaitée (mois)
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
                    IRA - Indemnités remb. anticipé (%)
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
                      ? `Vous économisez ${fmt(result.economieTotale)} € sur la durée totale du crédit.`
                      : `Le rachat vous coûterait ${fmt(Math.abs(result.economieTotale))} € de plus au total.`}
                  </p>
                </div>

                {/* DonutChart + cartes contextuelles */}
                <div
                  className="rounded-2xl border p-6"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <h2
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Visualisation
                  </h2>
                  <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                    <div className="flex justify-center">
                      <DonutChart
                        economie={result.economieTotale}
                        frais={result.totalFrais}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                          Gain mensuel
                        </p>
                        <p
                          className="mt-1 text-3xl font-bold"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: result.economieMensuelle >= 0 ? "var(--primary)" : "#dc2626",
                          }}
                        >
                          {result.economieMensuelle >= 0 ? "+" : ""}
                          {fmt(result.economieMensuelle)} &euro;
                        </p>
                        <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                          {result.economieMensuelle > 0
                            ? "Rachat rentable — votre mensualité baisse."
                            : "Rachat peu pertinent — la mensualité augmente."}
                        </p>
                      </div>
                      <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                          Délai amortissement frais
                        </p>
                        {result.economieMensuelle > 0 ? (
                          <>
                            <p
                              className="mt-1 text-3xl font-bold"
                              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
                            >
                              {Math.ceil(result.totalFrais / result.economieMensuelle)} mois
                            </p>
                            <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                              Temps nécessaire pour rembourser les {fmt(result.totalFrais)} &euro; de frais via votre gain mensuel.
                            </p>
                          </>
                        ) : (
                          <>
                            <p
                              className="mt-1 text-3xl font-bold"
                              style={{ fontFamily: "var(--font-display)", color: "#dc2626" }}
                            >
                              N/A
                            </p>
                            <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                              Sans gain mensuel, les frais ne s&apos;amortissent jamais.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cards comparatif */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <StatCard
                    label="Mensualité actuelle"
                    value={`${fmt(result.totalMensualiteActuelle)} €`}
                    color="var(--foreground)"
                  />
                  <StatCard
                    label="Nouvelle mensualité"
                    value={`${fmt(result.nouvelleMensualite)} €`}
                    color="var(--primary)"
                  />
                  <StatCard
                    label="Économie / mois"
                    value={`${result.economieMensuelle >= 0 ? "+" : ""}${fmt(result.economieMensuelle)} €`}
                    color={
                      result.economieMensuelle >= 0
                        ? "var(--primary)"
                        : "#dc2626"
                    }
                  />
                  <StatCard
                    label="Économie totale"
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
                    Comparaison détaillée
                  </h2>
                  <div className="mt-4 space-y-2 text-sm">
                    <CompareRow
                      label="Mensualités totales"
                      avant={`${fmt(result.totalMensualiteActuelle)} € / mois`}
                      apres={`${fmt(result.nouvelleMensualite)} € / mois`}
                      better={result.economieMensuelle > 0}
                    />
                    <CompareRow
                      label="Coût total"
                      avant={`${fmt0(result.coutTotalActuel)} €`}
                      apres={`${fmt0(result.coutTotalNouveau)} €`}
                      better={result.economieTotale > 0}
                    />
                    <CompareRow
                      label="Durée"
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
                          Indemnités de remb. anticipé (IRA)
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
                          Nouveau capital emprunté (capital + frais)
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
                          Intérêts du nouveau crédit
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
                    Comparaison visuelle du coût total
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
                                Après rachat
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

            {/* Cross-link CTAs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Vous pourriez aussi vouloir
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CrossLinkCard
                  href="/outils/calculateur-pret-immobilier"
                  emoji="🏠"
                  title="Simuler nouveau prêt"
                  desc="Mensualité, TAEG, tableau d'amortissement"
                />
                <CrossLinkCard
                  href="/outils/calculateur-frais-notaire"
                  emoji="🏛️"
                  title="Frais notaire"
                  desc="Estimation par département et type de bien"
                />
                <CrossLinkCard
                  href="/outils/calculateur-salaire"
                  emoji="💼"
                  title="Capacité d'emprunt"
                  desc="Mensualité max selon votre net"
                />
              </div>
            </div>

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
                Qu&apos;est-ce que le rachat de crédit ?
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  <strong className="text-[var(--foreground)]">
                    Principe
                  </strong>{" "}
                  : Le rachat de crédit (ou regroupement de crédits) consiste à
                  remplacer un ou plusieurs prêts existants par un crédit unique,
                  généralement à un taux plus avantageux ou sur une durée
                  différente.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">
                    Indemnités de remboursement anticipé (IRA)
                  </strong>{" "}
                  : Lors du remboursement anticipé d&apos;un prêt, la banque peut
                  appliquer des pénalités plafonnées, pour un crédit immobilier, au plus faible
                  de 3% du capital restant dû ou 6 mois d&apos;intérêts (crédit à la consommation :
                  1% ou 0,5% du capital remboursé). Intégrez-les dans votre simulation
                  pour un résultat réaliste.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">
                    Quand est-ce intéressant ?
                  </strong>{" "}
                  : Un rachat est généralement avantageux si la différence de
                  taux est supérieure à 0.7 point, si la durée restante est
                  suffisamment longue, et si l&apos;économie totale couvre
                  largement les frais de rachat.
                </p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment simuler un rachat de crédit en 4 étapes"
              description="Le simulateur compare la somme de vos mensualités actuelles à la mensualité unique du nouveau crédit, intègre les frais (IRA + dossier), et indique le gain réel sur la durée."
              steps={[
                {
                  name: "Lister vos crédits actuels",
                  text:
                    "Pour chaque crédit en cours, ouvrez votre dernière échéance bancaire et notez : capital restant dû, taux nominal, mensualité et nombre de mensualités restantes. Vous pouvez ajouter autant de crédits que nécessaire (immobilier, auto, conso, revolving).",
                },
                {
                  name: "Définir le nouveau crédit",
                  text:
                    "Renseignez le taux proposé par la banque ou le courtier pour le regroupement et la durée souhaitée. La durée du nouveau crédit est généralement plus longue que celle de vos crédits actuels : c'est ce qui réduit la mensualité, mais augmente le coût total.",
                },
                {
                  name: "Intégrer tous les frais",
                  text:
                    "Saisissez le pourcentage d'IRA (Indemnités de Remboursement Anticipé, plafonnées en crédit immobilier au plus faible de 3 % du capital restant ou 6 mois d'intérêts) et les frais de dossier de la nouvelle banque (300 à 1 500 € en moyenne). Sans ces frais, le simulateur sous-estimerait largement le coût réel.",
                },
                {
                  name: "Lire le verdict",
                  text:
                    "L'outil affiche en parallèle : votre situation actuelle (coût total, mensualité cumulée) et la situation après rachat (mensualité, coût total, frais inclus). Le rachat est intéressant si l'économie totale couvre largement les frais ET si la baisse de mensualité est significative.",
                },
              ]}
            />

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                À savoir avant de regrouper ses crédits en 2026
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Rachat immobilier vs rachat conso.</strong> La réglementation diffère :
                  un rachat où la part immobilière dépasse 60 % suit le régime du crédit immobilier
                  (TAEG, IRA plafonnées, garantie hypothécaire ou caution). En dessous, c&apos;est
                  un crédit à la consommation, plus rapide à obtenir mais avec un taux plus élevé.
                </p>
                <p>
                  <strong>Allonger la durée, c&apos;est payer plus au total.</strong> Réduire la
                  mensualité passe par allonger la durée. Résultat : la mensualité baisse, mais le
                  coût total des intérêts explose. Le simulateur le rend visible : vérifiez toujours
                  l&apos;écart entre coût total avant / coût total après.
                </p>
                <p>
                  <strong>L&apos;assurance emprunteur.</strong> Pour un rachat avec part
                  immobilière, une nouvelle assurance est exigée. Depuis la loi Lemoine (2022), vous
                  pouvez choisir librement (délégation), souvent 30 à 50 % moins chère que le contrat
                  groupe de la banque. Pensez à chiffrer ce poste, non intégré dans ce simulateur.
                </p>
                <p>
                  <strong>Garantie de la nouvelle banque.</strong> Pour un rachat avec hypothèque,
                  des frais de mainlevée et de nouvelle hypothèque s&apos;appliquent (1 à 2 % du
                  capital). Avec une caution Crédit Logement, les frais sont plus faibles (~1 %).
                  Ces coûts ne sont pas intégrés dans le simulateur, prévoyez-les séparément.
                </p>
                <p>
                  <strong>Source.</strong> Articles L313-39 à L313-46 du Code de la consommation
                  pour les IRA, articles L313-25 et suivants pour le crédit immobilier. Vérifiez
                  systématiquement les conditions exactes dans vos contrats actuels avant simulation.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posées sur le rachat et le regroupement de crédits."
              items={[
                {
                  question: "Quels types de crédits peut-on regrouper ?",
                  answer:
                    "Vous pouvez regrouper la plupart des crédits : crédit immobilier, crédit auto, crédit consommation, prêt personnel, crédit travaux et même les crédits revolving. La seule condition est que les crédits soient en cours de remboursement.",
                },
                {
                  question: "Quels sont les frais liés au rachat de crédit en France ?",
                  answer:
                    "Les principaux frais sont les indemnités de remboursement anticipé (IRA), plafonnées en crédit immobilier au plus faible de 3 % du capital restant dû ou 6 mois d'intérêts (1 % ou 0,5 % pour un crédit à la consommation). S'ajoutent les frais de dossier de la nouvelle banque (300 € à 1 000 € en moyenne), les frais de garantie et éventuellement les frais de courtage.",
                },
                {
                  question: "À partir de quel écart de taux le rachat est-il rentable ?",
                  answer:
                    "En règle générale, un écart d'au moins 0,7 à 1 point de pourcentage entre votre taux actuel et le nouveau taux rend le rachat intéressant. Cependant, cela dépend aussi de la durée restante du crédit et du montant du capital : plus ils sont elevés, plus l'économie potentielle est importante.",
                },
                {
                  question: "À quel moment du prêt le rachat est-il le plus intéressant ?",
                  answer:
                    "Le rachat est plus rentable dans le premier tiers du crédit, lorsque la part d'intérêts dans la mensualité est encore élevée. Après la moitié du prêt, l'essentiel des intérêts a déjà été payé et le gain potentiel diminue fortement.",
                },
                {
                  question: "Le rachat impacte-t-il mon assurance emprunteur ?",
                  answer:
                    "Oui. Le rachat génère un nouveau prêt, donc une nouvelle assurance emprunteur est exigée. Depuis la loi Lemoine (1er septembre 2022), vous pouvez la résilier à tout moment et choisir librement votre assureur (délégation), souvent 30 à 50 % moins chère que le contrat groupe de la banque.",
                },
                {
                  question: "Combien de temps pour obtenir un rachat de crédit ?",
                  answer:
                    "Pour un rachat 100 % crédit consommation, comptez 2 à 4 semaines entre la demande et la mise en place. Pour un rachat avec part immobilière, comptez 1,5 à 3 mois (étude, accord de principe, conditions suspensives, déblocage). Le délai légal de rétractation de 14 jours s'applique après signature de l'offre.",
                },
                {
                  question: "Y a-t-il un montant minimum ou maximum pour un rachat ?",
                  answer:
                    "Pas de plancher légal mais en pratique, en dessous de 5 000-10 000 € de capital regroupé, les frais absorberaient l'économie. Pas de plafond légal mais les organismes appliquent leurs propres limites (souvent 200 000 à 500 000 € pour un rachat conso, plus pour un rachat avec immobilier).",
                },
                {
                  question: "Le simulateur garde-t-il mes données ?",
                  answer:
                    "Non. Tous les calculs sont effectués localement dans votre navigateur. Aucune information sur vos crédits (capital, taux, mensualité) n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription.",
                },
              ]}
            />
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
                  Écart de taux &gt;{" "}
                  <strong className="text-[var(--primary)]">0.7%</strong> =
                  souvent rentable
                </li>
                <li>
                  Vérifiez les IRA dans vos contrats actuels
                </li>
                <li>
                  Comparez les offres de plusieurs banques
                </li>
                <li>
                  Incluez tous les frais (dossier, garantie, assurance)
                </li>
                <li>
                  Un courtier peut négocier de meilleurs taux
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
                Types de crédits rachetables
              </h3>
              <div className="mt-3 space-y-2">
                {[
                  "Crédit immobilier",
                  "Crédit auto",
                  "Crédit consommation",
                  "Crédit travaux",
                  "Prêt personnel",
                  "Crédit revolving",
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

function DonutChart({
  economie,
  frais,
}: {
  economie: number;
  frais: number;
}) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const stroke = 22;
  const absEcon = Math.abs(economie);
  const absFrais = Math.abs(frais);
  const total = absEcon + absFrais > 0 ? absEcon + absFrais : 1;
  const econPct = absEcon / total;
  const fraisPct = absFrais / total;
  const econLen = econPct * c;
  const fraisLen = fraisPct * c;
  const positive = economie >= 0;
  // Si economie negative, swap les couleurs (rouge pour economie, vert pour frais)
  const econColor = positive ? "#0d4f3c" : "#dc2626";
  const fraisColor = positive ? "#dc2626" : "#0d4f3c";
  return (
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Économie totale vs frais de rachat">
      <circle cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <g transform="rotate(-90)">
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke={econColor}
          strokeWidth={stroke}
          strokeDasharray={`${econLen} ${c}`}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke={fraisColor}
          strokeWidth={stroke}
          strokeDasharray={`${fraisLen} ${c}`}
          strokeDashoffset={-econLen}
          strokeLinecap="butt"
        />
      </g>
      <text
        x="0"
        y="-4"
        textAnchor="middle"
        fontSize="10"
        fill="var(--muted)"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {positive ? "Économie" : "Surcoût"}
      </text>
      <text
        x="0"
        y="14"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill={positive ? "#0d4f3c" : "#dc2626"}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {Math.round(econPct * 100)}%
      </text>
    </svg>
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
          {title} <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
