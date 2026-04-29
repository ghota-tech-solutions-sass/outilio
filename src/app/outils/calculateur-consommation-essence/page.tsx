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

            <ToolHowToSection
              title="Comment mesurer votre consommation reelle"
              description="La methode la plus fiable consiste a faire deux pleins complets et noter le kilometrage. Le calculateur s'occupe ensuite de la conversion en L/100 km et du cout au km."
              steps={[
                {
                  name: "Faire un premier plein complet",
                  text:
                    "Au premier plein, attendez le declic du pistolet. Notez le kilometrage exact affiche au tableau de bord. Ne complexifiez pas avec un demi-plein : la mesure serait imprecise.",
                },
                {
                  name: "Rouler normalement jusqu'au prochain plein",
                  text:
                    "Conduisez normalement (mix ville / route / autoroute selon votre usage habituel). Plus la distance entre les deux pleins est grande, plus la mesure est precise. Ideal : 400 a 800 km entre deux pleins.",
                },
                {
                  name: "Faire le second plein complet",
                  text:
                    "Refaites un plein complet (declic). Notez le nouveau kilometrage et le volume de carburant indique sur le ticket de pompe. La distance parcourue = kilometrage final - kilometrage initial.",
                },
                {
                  name: "Saisir les donnees dans le calculateur",
                  text:
                    "Mode 'Calculer ma consommation' : entrez la distance, les litres consommes et le prix au litre paye. Le calculateur affiche votre consommation en L/100 km, le cout par km et le cout total du plein.",
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
                    Comparer deux vehicules avant achat
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Sur 15 000 km/an avec essence a 1,80 EUR/L, la difference entre une voiture a 6
                    L/100 km et une a 9 L/100 km represente plus de 800 EUR par an. Ce calcul peut
                    inverser le verdict d&apos;un comparatif d&apos;achat sur 5 ans.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Estimer le cout d&apos;un long trajet
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Mode &quot;Estimer un trajet&quot; : indiquez la distance Lyon-Marseille (315 km),
                    votre consommation reelle et le prix au litre. Vous savez instantanement combien
                    de litres et combien d&apos;euros prevoir.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Notes de frais professionnelles
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour vos remboursements employeur ou indemnites kilometriques, le cout par km
                    sert a comparer avec le bareme officiel (publie chaque annee par la DGFiP). Pour
                    rappel, le bareme integre carburant + entretien + assurance + amortissement.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Optimiser un covoiturage
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour fixer un prix juste a vos passagers : calculez le cout reel du trajet, divisez
                    par le nombre de passagers (vous compris) puis ajoutez 10-15 % d&apos;usure. Le
                    resultat est generalement bien inferieur aux platformes de covoiturage.
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
                Reduire concretement sa consommation
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Eco-conduite : -10 a -25 %.</strong> Anticipez les ralentissements, utilisez
                  le frein moteur, passez les rapports tot (avant 2 500 tours/min en essence). Une
                  conduite souple peut faire economiser 1 a 2 litres aux 100 km, soit plus de 200 EUR
                  par an pour 15 000 km parcourus.
                </p>
                <p>
                  <strong>Pression des pneus : -3 a -5 %.</strong> Une sous-pression de 0,5 bar
                  augmente la consommation d&apos;environ 5 %, en plus d&apos;une usure prematuree.
                  Verifiez la pression a froid au moins 1 fois par mois et avant tout long trajet (la
                  bonne valeur est sur la portiere conducteur).
                </p>
                <p>
                  <strong>Charge et aerodynamique : -5 a -15 %.</strong> Galerie de toit montee meme
                  vide : +10 a 15 % de consommation. 50 kg en trop dans le coffre : +2 %. Coffre de
                  toit a vitesse autoroute : +25 % facilement. Ne montez ces accessoires que pour
                  l&apos;usage prevu.
                </p>
                <p>
                  <strong>Climatisation : -5 a -15 %.</strong> A vitesse moderee (en ville), preferez
                  vitres ouvertes pour ventiler. Sur autoroute, vitres ouvertes a 130 km/h consomment
                  PLUS que la clim a cause de la trainee aerodynamique. Coupez la clim 5 minutes
                  avant l&apos;arrivee pour eviter la condensation.
                </p>
                <p>
                  <strong>Sources.</strong> ADEME (Agence de la transition ecologique), bareme fiscal
                  des indemnites kilometriques publie chaque annee par la DGFiP, CNAM (regles de
                  remboursement frais kilometriques sante).
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur la consommation de carburant et le cout au km."
              items={[
                {
                  question: "Pourquoi ma consommation reelle est plus elevee que celle annoncee par le constructeur ?",
                  answer:
                    "Les chiffres constructeur sont mesures en cycle WLTP (depuis 2017) en conditions standardisees, sur banc d'essai. La consommation reelle est en moyenne superieure de 15 a 30 %, selon votre style de conduite, le climat, la charge transportee et l'etat de la voiture.",
                },
                {
                  question: "Combien coute un trajet de 500 km en 2026 ?",
                  answer:
                    "Pour une berline diesel a 6 L/100 km avec gazole a 1,75 EUR/L : 500 x 6/100 = 30 L, soit 52,50 EUR. Pour une essence a 7,5 L/100 km a 1,85 EUR/L : 37,5 L x 1,85 = 69,40 EUR. La calculette le fait instantanement avec vos chiffres exacts.",
                },
                {
                  question: "Le calcul est-il valable pour un vehicule electrique ?",
                  answer:
                    "Cet outil est concu pour les motorisations thermiques (essence, diesel, GPL). Pour un VE, la consommation s'exprime en kWh/100 km (15-20 typique) et le 'prix au litre' est remplace par le prix du kWh (variable selon recharge a domicile, borne lente ou rapide).",
                },
                {
                  question: "Comment obtenir une mesure plus fiable ?",
                  answer:
                    "Faites la moyenne sur 3 a 5 pleins consecutifs. La consommation varie significativement selon la saison (hiver +10-15 %), le type de trajet (autoroute vs ville), et les conditions (pluie, vent, charge passagers). Evitez de calculer sur un seul plein avec un trajet atypique.",
                },
                {
                  question: "Le calculateur prend-il en compte le bareme kilometrique fiscal ?",
                  answer:
                    "Non, l'outil calcule uniquement le cout reel du carburant. Le bareme fiscal officiel pour les indemnites kilometriques (publie chaque annee par la DGFiP) integre en plus l'amortissement, l'entretien, l'assurance et les pneumatiques. Il est revalue chaque annee dans la loi de finances.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee (kilometrage, plein, prix) n'est envoyee a un serveur ni stockee. L'outil fonctionne sans inscription.",
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
