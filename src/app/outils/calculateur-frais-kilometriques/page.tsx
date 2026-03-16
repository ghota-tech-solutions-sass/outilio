"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

/* ─────────────────── Types ─────────────────── */

type VehiculeType = "voiture" | "moto" | "cyclomoteur";

type BaremeEntry = {
  /** coefficient multiplicateur de d */
  coef: number;
  /** constante ajoutee (0 pour les tranches simples) */
  constante: number;
};

type BaremePuissance = {
  label: string;
  /** [tranche1, tranche2, tranche3] */
  tranches: [BaremeEntry, BaremeEntry, BaremeEntry];
};

type BaremeVehicule = {
  type: VehiculeType;
  label: string;
  /** seuils des tranches : [limite1, limite2] */
  seuils: [number, number];
  puissances: BaremePuissance[];
};

type BaremeAnnee = {
  annee: number;
  label: string;
  estime: boolean;
  vehicules: BaremeVehicule[];
};

/* ─────────── Baremes officiels par annee ─────────── */
// Source : service-public.gouv.fr, legisocial.fr
// Le bareme 2025 est identique a 2024 (pas de revalorisation).
// La derniere revalorisation date de 2023 (+5.4%).
// Pour les annees futures sans bareme officiel, on extrapole avec ~2% annuel.

const BAREMES_OFFICIELS: Record<number, { voitures: BaremeVehicule; motos: BaremeVehicule; cyclomoteurs: BaremeVehicule }> = {
  2024: {
    voitures: {
      type: "voiture",
      label: "Voiture",
      seuils: [5000, 20000],
      puissances: [
        { label: "3 CV et moins", tranches: [{ coef: 0.529, constante: 0 }, { coef: 0.316, constante: 1065 }, { coef: 0.370, constante: 0 }] },
        { label: "4 CV", tranches: [{ coef: 0.606, constante: 0 }, { coef: 0.340, constante: 1330 }, { coef: 0.407, constante: 0 }] },
        { label: "5 CV", tranches: [{ coef: 0.636, constante: 0 }, { coef: 0.357, constante: 1395 }, { coef: 0.427, constante: 0 }] },
        { label: "6 CV", tranches: [{ coef: 0.665, constante: 0 }, { coef: 0.374, constante: 1457 }, { coef: 0.447, constante: 0 }] },
        { label: "7 CV et plus", tranches: [{ coef: 0.697, constante: 0 }, { coef: 0.394, constante: 1515 }, { coef: 0.470, constante: 0 }] },
      ],
    },
    motos: {
      type: "moto",
      label: "Moto (> 50 cm\u00B3)",
      seuils: [3000, 6000],
      puissances: [
        { label: "1-2 CV", tranches: [{ coef: 0.395, constante: 0 }, { coef: 0.099, constante: 891 }, { coef: 0.248, constante: 0 }] },
        { label: "3-5 CV", tranches: [{ coef: 0.468, constante: 0 }, { coef: 0.082, constante: 1158 }, { coef: 0.275, constante: 0 }] },
        { label: "Plus de 5 CV", tranches: [{ coef: 0.606, constante: 0 }, { coef: 0.079, constante: 1583 }, { coef: 0.343, constante: 0 }] },
      ],
    },
    cyclomoteurs: {
      type: "cyclomoteur",
      label: "Scooter / Cyclomoteur (\u2264 50 cm\u00B3)",
      seuils: [3000, 6000],
      puissances: [
        { label: "Tous", tranches: [{ coef: 0.315, constante: 0 }, { coef: 0.079, constante: 711 }, { coef: 0.198, constante: 0 }] },
      ],
    },
  },
  2025: {
    voitures: {
      type: "voiture",
      label: "Voiture",
      seuils: [5000, 20000],
      puissances: [
        { label: "3 CV et moins", tranches: [{ coef: 0.529, constante: 0 }, { coef: 0.316, constante: 1065 }, { coef: 0.370, constante: 0 }] },
        { label: "4 CV", tranches: [{ coef: 0.606, constante: 0 }, { coef: 0.340, constante: 1330 }, { coef: 0.407, constante: 0 }] },
        { label: "5 CV", tranches: [{ coef: 0.636, constante: 0 }, { coef: 0.357, constante: 1395 }, { coef: 0.427, constante: 0 }] },
        { label: "6 CV", tranches: [{ coef: 0.665, constante: 0 }, { coef: 0.374, constante: 1457 }, { coef: 0.447, constante: 0 }] },
        { label: "7 CV et plus", tranches: [{ coef: 0.697, constante: 0 }, { coef: 0.394, constante: 1515 }, { coef: 0.470, constante: 0 }] },
      ],
    },
    motos: {
      type: "moto",
      label: "Moto (> 50 cm\u00B3)",
      seuils: [3000, 6000],
      puissances: [
        { label: "1-2 CV", tranches: [{ coef: 0.395, constante: 0 }, { coef: 0.099, constante: 891 }, { coef: 0.248, constante: 0 }] },
        { label: "3-5 CV", tranches: [{ coef: 0.468, constante: 0 }, { coef: 0.082, constante: 1158 }, { coef: 0.275, constante: 0 }] },
        { label: "Plus de 5 CV", tranches: [{ coef: 0.606, constante: 0 }, { coef: 0.079, constante: 1583 }, { coef: 0.343, constante: 0 }] },
      ],
    },
    cyclomoteurs: {
      type: "cyclomoteur",
      label: "Scooter / Cyclomoteur (\u2264 50 cm\u00B3)",
      seuils: [3000, 6000],
      puissances: [
        { label: "Tous", tranches: [{ coef: 0.315, constante: 0 }, { coef: 0.079, constante: 711 }, { coef: 0.198, constante: 0 }] },
      ],
    },
  },
};

/* ─────────── Extrapolation pour annees futures ─────────── */

const REVALORISATION = 0.02;

function getLastOfficielAnnee(): number {
  return Math.max(...Object.keys(BAREMES_OFFICIELS).map(Number));
}

function extrapolerBareme(source: BaremeVehicule, factor: number): BaremeVehicule {
  return {
    ...source,
    puissances: source.puissances.map((p) => ({
      ...p,
      tranches: p.tranches.map((t) => ({
        coef: Math.round(t.coef * factor * 1000) / 1000,
        constante: Math.round(t.constante * factor),
      })) as [BaremeEntry, BaremeEntry, BaremeEntry],
    })),
  };
}

function getBaremePourAnnee(annee: number): { voitures: BaremeVehicule; motos: BaremeVehicule; cyclomoteurs: BaremeVehicule } {
  if (BAREMES_OFFICIELS[annee]) return BAREMES_OFFICIELS[annee];
  const lastYear = getLastOfficielAnnee();
  const last = BAREMES_OFFICIELS[lastYear];
  const delta = annee - lastYear;
  if (delta <= 0) return last;
  const factor = Math.pow(1 + REVALORISATION, delta);
  return {
    voitures: extrapolerBareme(last.voitures, factor),
    motos: extrapolerBareme(last.motos, factor),
    cyclomoteurs: extrapolerBareme(last.cyclomoteurs, factor),
  };
}

function buildBaremes(): BaremeAnnee[] {
  const currentYear = new Date().getFullYear();
  const startYear = Math.min(...Object.keys(BAREMES_OFFICIELS).map(Number));
  const endYear = currentYear;
  const result: BaremeAnnee[] = [];
  for (let y = endYear; y >= startYear; y--) {
    const b = getBaremePourAnnee(y);
    result.push({
      annee: y,
      label: `Revenus ${y} (declaration ${y + 1})`,
      estime: !BAREMES_OFFICIELS[y],
      vehicules: [b.voitures, b.motos, b.cyclomoteurs],
    });
  }
  return result;
}

const BAREMES = buildBaremes();

/* ─────────── Calcul ─────────── */

function calculerFrais(
  distance: number,
  vehicule: BaremeVehicule,
  puissanceIndex: number,
  electrique: boolean,
): { montant: number; formule: string; trancheLabel: string; coef: number; constante: number; majorationElec: number } | null {
  if (distance <= 0) return null;
  const puissance = vehicule.puissances[puissanceIndex];
  if (!puissance) return null;

  const [seuil1, seuil2] = vehicule.seuils;
  let trancheIndex: number;
  let trancheLabel: string;

  if (distance <= seuil1) {
    trancheIndex = 0;
    trancheLabel = `Jusqu'a ${seuil1.toLocaleString("fr-FR")} km`;
  } else if (distance <= seuil2) {
    trancheIndex = 1;
    trancheLabel = `De ${(seuil1 + 1).toLocaleString("fr-FR")} a ${seuil2.toLocaleString("fr-FR")} km`;
  } else {
    trancheIndex = 2;
    trancheLabel = `Plus de ${seuil2.toLocaleString("fr-FR")} km`;
  }

  const { coef, constante } = puissance.tranches[trancheIndex];
  let montantBase: number;
  let formule: string;

  if (constante > 0) {
    montantBase = distance * coef + constante;
    formule = `(${distance.toLocaleString("fr-FR")} x ${coef}) + ${constante.toLocaleString("fr-FR")}`;
  } else {
    montantBase = distance * coef;
    formule = `${distance.toLocaleString("fr-FR")} x ${coef}`;
  }

  const majorationElec = electrique ? montantBase * 0.2 : 0;
  const montant = montantBase + majorationElec;

  return { montant, formule, trancheLabel, coef, constante, majorationElec };
}

/* ─────────── Composant ─────────── */

function getDefaultAnnee(): number {
  const now = new Date();
  const year = now.getFullYear();
  const target = now.getMonth() < 9 ? year - 1 : year;
  return BAREMES.find((b) => b.annee <= target)?.annee ?? BAREMES[0].annee;
}

export default function CalculateurFraisKilometriques() {
  const [annee, setAnnee] = useState(() => getDefaultAnnee());
  const [vehiculeType, setVehiculeType] = useState<VehiculeType>("voiture");
  const [puissanceIndex, setPuissanceIndex] = useState(2); // 5CV par defaut
  const [distance, setDistance] = useState("12000");
  const [electrique, setElectrique] = useState(false);

  const bareme = BAREMES.find((b) => b.annee === annee) ?? BAREMES[0];
  const vehicule = bareme.vehicules.find((v) => v.type === vehiculeType) ?? bareme.vehicules[0];

  // Reset puissance index si on change de type vehicule et que l'index depasse
  const safePuissanceIndex = Math.min(puissanceIndex, vehicule.puissances.length - 1);

  const distanceNum = parseFloat(distance) || 0;
  const result = useMemo(
    () => calculerFrais(distanceNum, vehicule, safePuissanceIndex, electrique),
    [distanceNum, vehicule, safePuissanceIndex, electrique],
  );

  const fmt = (n: number, d = 2) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

  const handleVehiculeChange = (type: VehiculeType) => {
    setVehiculeType(type);
    // Reset a l'index 0 quand on change de type pour eviter un index invalide
    if (type === "cyclomoteur") {
      setPuissanceIndex(0);
    } else if (type === "moto") {
      setPuissanceIndex(Math.min(puissanceIndex, 2));
    } else {
      setPuissanceIndex(Math.min(puissanceIndex, 4));
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Fiscalite
          </p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>frais kilometriques</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le montant deductible de vos frais kilometriques avec le bareme fiscal officiel {annee}.
            Voiture, moto, scooter et majoration vehicule electrique (+20%).
          </p>
        </div>
      </section>

      {/* Main */}
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* Annee + Type vehicule */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Annee fiscale
                  </label>
                  <select
                    value={annee}
                    onChange={(e) => setAnnee(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {BAREMES.map((b) => (
                      <option key={b.annee} value={b.annee}>
                        {b.label}{b.estime ? " (estime)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Type de vehicule
                  </label>
                  <div className="mt-2 flex gap-2">
                    {(["voiture", "moto", "cyclomoteur"] as VehiculeType[]).map((type) => {
                      const labels: Record<VehiculeType, string> = { voiture: "Voiture", moto: "Moto", cyclomoteur: "Scooter" };
                      const icons: Record<VehiculeType, string> = { voiture: "\uD83D\uDE97", moto: "\uD83C\uDFCD\uFE0F", cyclomoteur: "\uD83D\uDEF5" };
                      return (
                        <button
                          key={type}
                          onClick={() => handleVehiculeChange(type)}
                          className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                          style={{
                            background: vehiculeType === type ? "var(--primary)" : "var(--surface-alt)",
                            color: vehiculeType === type ? "white" : "var(--muted)",
                          }}
                        >
                          <span className="mr-1">{icons[type]}</span> {labels[type]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Parametres */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Parametres
              </h2>
              <div className="mt-4 space-y-4">
                {/* Puissance fiscale */}
                {vehiculeType !== "cyclomoteur" && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Puissance fiscale (CV)
                    </label>
                    <select
                      value={safePuissanceIndex}
                      onChange={(e) => setPuissanceIndex(Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {vehicule.puissances.map((p, i) => (
                        <option key={i} value={i}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Distance */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Distance annuelle parcourue
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="number"
                      min="0"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>km</span>
                  </div>
                </div>

                {/* Toggle electrique */}
                <div
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{ background: electrique ? "rgba(13,79,60,0.08)" : "var(--surface-alt)" }}
                >
                  <div>
                    <p className="text-sm font-semibold">Vehicule 100% electrique</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>Majoration de 20% sur le montant</p>
                  </div>
                  <button
                    onClick={() => setElectrique(!electrique)}
                    className="relative h-7 w-12 rounded-full transition-all"
                    style={{ background: electrique ? "var(--primary)" : "var(--border)" }}
                    aria-label="Activer la majoration vehicule electrique"
                    role="switch"
                    aria-checked={electrique}
                  >
                    <span
                      className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform shadow-sm"
                      style={{ transform: electrique ? "translateX(20px)" : "translateX(0)" }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Resultats */}
            {result && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <StatBox label="Montant deductible" value={`${fmt(result.montant)} \u20AC`} primary />
                  <StatBox label="Par mois" value={`${fmt(result.montant / 12)} \u20AC`} />
                  <StatBox label="Par km" value={`${fmt(result.montant / distanceNum, 3)} \u20AC`} accent />
                </div>

                {/* Detail du calcul */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                    Detail du calcul
                  </h2>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
                      <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Vehicule</span>
                      <span className="text-sm font-bold">{vehicule.label} &mdash; {vehicule.puissances[safePuissanceIndex].label}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
                      <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Tranche appliquee</span>
                      <span className="text-sm font-bold">{result.trancheLabel}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
                      <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Formule</span>
                      <span className="text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.formule}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
                      <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Montant de base</span>
                      <span className="text-sm font-bold">{fmt(result.montant - result.majorationElec)} &euro;</span>
                    </div>
                    {electrique && (
                      <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "rgba(13,79,60,0.08)" }}>
                        <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>Majoration electrique (+20%)</span>
                        <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>+ {fmt(result.majorationElec)} &euro;</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between rounded-xl border-2 px-4 py-3" style={{ borderColor: "var(--primary)", background: "rgba(13,79,60,0.04)" }}>
                      <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>Total deductible</span>
                      <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                        {fmt(result.montant)} &euro;
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Tableau du bareme complet */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Bareme {vehicule.label.toLowerCase()} {annee}
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--muted)" }}>
                      <th className="pb-3 text-left font-medium">Puissance</th>
                      <th className="pb-3 text-right font-medium">&le; {vehicule.seuils[0].toLocaleString("fr-FR")} km</th>
                      <th className="pb-3 text-right font-medium">{(vehicule.seuils[0] + 1).toLocaleString("fr-FR")}-{vehicule.seuils[1].toLocaleString("fr-FR")} km</th>
                      <th className="pb-3 text-right font-medium">&gt; {vehicule.seuils[1].toLocaleString("fr-FR")} km</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicule.puissances.map((p, i) => {
                      const isSelected = i === safePuissanceIndex;
                      return (
                        <tr
                          key={i}
                          className="border-t"
                          style={{
                            borderColor: "var(--surface-alt)",
                            background: isSelected ? "rgba(13,79,60,0.06)" : undefined,
                          }}
                        >
                          <td className="py-3 font-semibold" style={{ color: isSelected ? "var(--primary)" : undefined }}>
                            {p.label}
                          </td>
                          {p.tranches.map((t, j) => (
                            <td key={j} className="py-3 text-right text-xs">
                              {t.constante > 0
                                ? <span>d &times; {t.coef} + {t.constante.toLocaleString("fr-FR")}</span>
                                : <span>d &times; {t.coef}</span>
                              }
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {bareme.estime && (
                <p className="mt-3 text-xs" style={{ color: "var(--accent)" }}>
                  * Bareme estime (+2%/an). Les valeurs officielles seront mises a jour des publication au Journal Officiel.
                </p>
              )}
            </div>

            {/* Explications */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment fonctionnent les frais kilometriques ?
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  <strong className="text-[var(--foreground)]">Principe.</strong> Les frais kilometriques permettent de deduire de votre revenu imposable les frais engages pour vos deplacements professionnels. Le bareme est publie chaque annee par l&apos;administration fiscale.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Frais reels vs abattement de 10%.</strong> Vous pouvez opter pour la deduction des frais reels si vos depenses (trajet domicile-travail, repas, etc.) depassent l&apos;abattement forfaitaire de 10% applique automatiquement.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Ce que couvre le bareme.</strong> Le bareme prend en compte la depreciation du vehicule, l&apos;assurance, les frais de reparation et d&apos;entretien, les pneumatiques et le carburant. Les frais de peage et de stationnement peuvent etre ajoutes en plus.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Vehicules electriques.</strong> Depuis 2021, les montants calcules avec le bareme sont majores de 20% pour les vehicules 100% electriques (voitures, motos et scooters).
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Puissance fiscale.</strong> La puissance fiscale (en CV) figure sur votre carte grise a la rubrique P.6. Ne la confondez pas avec la puissance moteur en kW ou ch.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Rappels utiles
              </h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Puissance fiscale : rubrique <strong className="text-[var(--foreground)]">P.6</strong> de la carte grise</li>
                <li>Deduction limitee a <strong className="text-[var(--foreground)]">80 km/jour</strong> aller-retour (sauf justification)</li>
                <li>Peages et parking : <strong className="text-[var(--foreground)]">en plus</strong> du bareme</li>
                <li>Electrique : majoration de <strong className="text-[var(--foreground)]">+20%</strong></li>
              </ul>
            </div>
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Exemple rapide
              </h3>
              <div className="mt-3 space-y-1 text-sm" style={{ color: "var(--muted)" }}>
                <p>Voiture 5 CV, 12 000 km/an :</p>
                <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {fmt((12000 * 0.357) + 1395)} &euro;
                </p>
                <p className="text-xs">(12 000 &times; 0,357) + 1 395</p>
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function StatBox({ label, value, primary, accent }: { label: string; value: string; primary?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="mt-1 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: primary ? "var(--primary)" : accent ? "var(--accent)" : "var(--foreground)" }}>
        {value}
      </p>
    </div>
  );
}
