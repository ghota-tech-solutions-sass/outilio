"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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
            Calculez votre consommation en L/100km, le coût par kilomètre et estimez le budget carburant de vos trajets.
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
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Données du plein</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Distance parcourue (km)</label>
                      <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Litres consommés</label>
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
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Coût par km</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(consumptionResult.coutKm, 3)}</p>
                      <p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>&euro; / km</p>
                    </div>
                    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Coût total</p>
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
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Litres nécessaires</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(tripResult.litresNeeded, 1)} L</p>
                    </div>
                    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Coût du trajet</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(tripResult.coutTrajet)} &euro;</p>
                    </div>
                    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Coût par km</p>
                      <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(tripResult.coutKm, 3)} &euro;</p>
                    </div>
                  </div>
                )}
              </>
            )}

            <ToolHowToSection
              title="Comment mesurer votre consommation réelle"
              description="La méthode la plus fiable consiste à faire deux pleins complets et noter le kilométrage. Le calculateur s'occupe ensuite de la conversion en L/100 km et du coût au km."
              steps={[
                {
                  name: "Faire un premier plein complet",
                  text:
                    "Au premier plein, attendez le déclic du pistolet. Notez le kilométrage exact affiché au tableau de bord. Ne complexifiez pas avec un demi-plein : la mesure serait imprécise.",
                },
                {
                  name: "Rouler normalement jusqu'au prochain plein",
                  text:
                    "Conduisez normalement (mix ville / route / autoroute selon votre usage habituel). Plus la distance entre les deux pleins est grande, plus la mesure est précise. Idéal : 400 à 800 km entre deux pleins.",
                },
                {
                  name: "Faire le second plein complet",
                  text:
                    "Refaites un plein complet (déclic). Notez le nouveau kilométrage et le volume de carburant indiqué sur le ticket de pompe. La distance parcourue = kilométrage final - kilométrage initial.",
                },
                {
                  name: "Saisir les données dans le calculateur",
                  text:
                    "Mode 'Calculer ma consommation' : entrez la distance, les litres consommés et le prix au litre payé. Le calculateur affiche votre consommation en L/100 km, le coût par km et le coût total du plein.",
                },
              ]}
            />

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Cas d&apos;usage du calculateur
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Comparer deux véhicules avant achat
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Sur 15 000 km/an avec essence à 1,80 €/L, la différence entre une voiture à 6
                    L/100 km et une à 9 L/100 km représente plus de 800 € par an. Ce calcul peut
                    inverser le verdict d&apos;un comparatif d&apos;achat sur 5 ans.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Estimer le coût d&apos;un long trajet
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Mode &quot;Estimer un trajet&quot; : indiquez la distance Lyon-Marseille (315 km),
                    votre consommation réelle et le prix au litre. Vous savez instantanément combien
                    de litres et combien d&apos;euros prévoir.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Notes de frais professionnelles
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour vos remboursements employeur ou indemnités kilométriques, le coût par km
                    sert à comparer avec le barème officiel (publié chaque année par la DGFiP). Pour
                    rappel, le barème intègre carburant + entretien + assurance + amortissement.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Optimiser un covoiturage
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour fixer un prix juste à vos passagers : calculez le coût réel du trajet, divisez
                    par le nombre de passagers (vous compris) puis ajoutez 10-15 % d&apos;usure. Le
                    résultat est généralement bien inférieur aux platformes de covoiturage.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Réduire concrètement sa consommation
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Éco-conduite : -10 à -25 %.</strong> Anticipez les ralentissements, utilisez
                  le frein moteur, passez les rapports tôt (avant 2 500 tours/min en essence). Une
                  conduite souple peut faire économiser 1 à 2 litres aux 100 km, soit plus de 200 €
                  par an pour 15 000 km parcourus.
                </p>
                <p>
                  <strong>Pression des pneus : -3 à -5 %.</strong> Une sous-pression de 0,5 bar
                  augmente la consommation d&apos;environ 5 %, en plus d&apos;une usure prématurée.
                  Vérifiez la pression à froid au moins 1 fois par mois et avant tout long trajet (la
                  bonne valeur est sur la portière conducteur).
                </p>
                <p>
                  <strong>Charge et aérodynamique : -5 à -15 %.</strong> Galerie de toit montée même
                  vide : +10 à 15 % de consommation. 50 kg en trop dans le coffre : +2 %. Coffre de
                  toit à vitesse autoroute : +25 % facilement. Ne montez ces accessoires que pour
                  l&apos;usage prévu.
                </p>
                <p>
                  <strong>Climatisation : -5 à -15 %.</strong> À vitesse modérée (en ville), préférez
                  vitres ouvertes pour ventiler. Sur autoroute, vitres ouvertes à 130 km/h consomment
                  PLUS que la clim à cause de la traînée aérodynamique. Coupez la clim 5 minutes
                  avant l&apos;arrivée pour éviter la condensation.
                </p>
                <p>
                  <strong>Sources.</strong> ADEME (Agence de la transition écologique), barème fiscal
                  des indemnités kilométriques publié chaque année par la DGFiP, CNAM (règles de
                  remboursement frais kilométriques santé).
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus fréquentes sur la consommation de carburant et le coût au km."
              items={[
                {
                  question: "Pourquoi ma consommation réelle est plus élevée que celle annoncée par le constructeur ?",
                  answer:
                    "Les chiffres constructeur sont mesurés en cycle WLTP (depuis 2017) en conditions standardisées, sur banc d'essai. La consommation réelle est en moyenne supérieure de 15 à 30 %, selon votre style de conduite, le climat, la charge transportée et l'état de la voiture.",
                },
                {
                  question: "Combien coûte un trajet de 500 km en 2026 ?",
                  answer:
                    "Pour une berline diesel à 6 L/100 km avec gazole à 1,75 €/L : 500 x 6/100 = 30 L, soit 52,50 €. Pour une essence à 7,5 L/100 km à 1,85 €/L : 37,5 L x 1,85 = 69,38 €. La calculette le fait instantanément avec vos chiffres exacts.",
                },
                {
                  question: "Le calcul est-il valable pour un véhicule électrique ?",
                  answer:
                    "Cet outil est conçu pour les motorisations thermiques (essence, diesel, GPL). Pour un VE, la consommation s'exprime en kWh/100 km (15-20 typique) et le 'prix au litre' est remplacé par le prix du kWh (variable selon recharge à domicile, borne lente ou rapide).",
                },
                {
                  question: "Comment obtenir une mesure plus fiable ?",
                  answer:
                    "Faites la moyenne sur 3 à 5 pleins consécutifs. La consommation varie significativement selon la saison (hiver +10-15 %), le type de trajet (autoroute vs ville), et les conditions (pluie, vent, charge passagers). Évitez de calculer sur un seul plein avec un trajet atypique.",
                },
                {
                  question: "Le calculateur prend-il en compte le barème kilométrique fiscal ?",
                  answer:
                    "Non, l'outil calcule uniquement le coût réel du carburant. Le barème fiscal officiel pour les indemnités kilométriques (publié chaque année par la DGFiP) intègre en plus l'amortissement, l'entretien, l'assurance et les pneumatiques. Il est fixé par arrêté ministériel (inchangé depuis l'arrêté du 27 mars 2023).",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée (kilométrage, plein, prix) n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription.",
                },
              ]}
            />
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
                  { type: "Électrique", conso: "15-20 kWh" },
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
