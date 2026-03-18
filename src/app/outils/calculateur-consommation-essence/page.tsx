"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type Mode = "consumption" | "trip";

export default function CalculateurConsommationEssence() {
  const [mode, setMode] = useState<Mode>("consumption");

  // Mode consumption
  const [distance, setDistance] = useState("500");
  const [litres, setLitres] = useState("35");
  const [prixLitre, setPrixLitre] = useState("1.75");

  // Mode trip
  const [tripDistance, setTripDistance] = useState("350");
  const [consoConnue, setConsoConnue] = useState("7");
  const [tripPrix, setTripPrix] = useState("1.75");

  const consumptionResult = useMemo(() => {
    const d = parseFloat(distance) || 0;
    const l = parseFloat(litres) || 0;
    const p = parseFloat(prixLitre) || 0;
    if (d <= 0 || l <= 0) return null;

    const conso100 = (l / d) * 100;
    const coutKm = (l * p) / d;
    const coutTotal = l * p;

    return { conso100, coutKm, coutTotal };
  }, [distance, litres, prixLitre]);

  const tripResult = useMemo(() => {
    const d = parseFloat(tripDistance) || 0;
    const c = parseFloat(consoConnue) || 0;
    const p = parseFloat(tripPrix) || 0;
    if (d <= 0 || c <= 0) return null;

    const litresNeeded = (c / 100) * d;
    const coutTrajet = litresNeeded * p;
    const coutKm = (c / 100) * p;

    return { litresNeeded, coutTrajet, coutKm };
  }, [tripDistance, consoConnue, tripPrix]);

  const fmt = (n: number, d = 2) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Auto</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>consommation essence</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre consommation en L/100km, le cout par kilometre et estimez le budget carburant de vos trajets.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Mode de calcul</h2>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setMode("consumption")}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                  style={{ background: mode === "consumption" ? "var(--primary)" : "var(--surface-alt)", color: mode === "consumption" ? "white" : "var(--muted)" }}>
                  Calculer ma consommation
                </button>
                <button onClick={() => setMode("trip")}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                  style={{ background: mode === "trip" ? "var(--primary)" : "var(--surface-alt)", color: mode === "trip" ? "white" : "var(--muted)" }}>
                  Estimer un trajet
                </button>
              </div>
            </div>

            {mode === "consumption" && (
              <>
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Donnees du plein</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Distance parcourue (km)</label>
                      <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Litres consommes</label>
                      <input type="number" step="0.1" value={litres} onChange={(e) => setLitres(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix au litre (&euro;)</label>
                      <input type="number" step="0.01" value={prixLitre} onChange={(e) => setPrixLitre(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                  </div>
                </div>

                {consumptionResult && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Consommation</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(consumptionResult.conso100, 1)}</p>
                      <p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>L / 100 km</p>
                    </div>
                    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Cout par km</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(consumptionResult.coutKm, 3)}</p>
                      <p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>&euro; / km</p>
                    </div>
                    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Cout total</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(consumptionResult.coutTotal)} &euro;</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {mode === "trip" && (
              <>
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Estimation du trajet</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Distance du trajet (km)</label>
                      <input type="number" value={tripDistance} onChange={(e) => setTripDistance(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Consommation (L/100km)</label>
                      <input type="number" step="0.1" value={consoConnue} onChange={(e) => setConsoConnue(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix au litre (&euro;)</label>
                      <input type="number" step="0.01" value={tripPrix} onChange={(e) => setTripPrix(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                  </div>
                </div>

                {tripResult && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Litres necessaires</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(tripResult.litresNeeded, 1)} L</p>
                    </div>
                    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Cout du trajet</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(tripResult.coutTrajet)} &euro;</p>
                    </div>
                    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Cout par km</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(tripResult.coutKm, 3)} &euro;</p>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comprendre la consommation de carburant</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">L/100km</strong> : La mesure standard en France. Une voiture citadine consomme environ 5-7 L/100km, un SUV entre 8-12 L/100km.</p>
                <p><strong className="text-[var(--foreground)]">Comment calculer ?</strong> Faites le plein, notez le kilometrage. Au plein suivant, notez les litres et la distance. Consommation = (litres x 100) / distance.</p>
                <p><strong className="text-[var(--foreground)]">Reduire sa consommation</strong> : Verifiez la pression des pneus, evitez les accelerations brusques, coupez la climatisation quand possible et retirez les charges inutiles du coffre.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Consommations moyennes</h3>
              <div className="mt-3 space-y-2">
                {[
                  { type: "Citadine", conso: "5-6 L" },
                  { type: "Berline", conso: "6-8 L" },
                  { type: "SUV", conso: "8-12 L" },
                  { type: "Utilitaire", conso: "9-14 L" },
                  { type: "Electrique", conso: "15-20 kWh" },
                ].map((v) => (
                  <div key={v.type} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{v.type}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{v.conso}</span>
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
