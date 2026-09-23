"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const TRANSPORT = [
  { id: "voiture", label: "Voiture", icon: "\u{1F697}", unit: "km", factor: 0.218 },
  { id: "avion", label: "Avion", icon: "\u{2708}\uFE0F", unit: "km", factor: 0.255 },
  { id: "train", label: "Train", icon: "\u{1F686}", unit: "km", factor: 0.006 },
  { id: "bus", label: "Bus", icon: "\u{1F68C}", unit: "km", factor: 0.089 },
];

const ENERGY = [
  { id: "electricite", label: "Électricité", icon: "\u{26A1}", unit: "kWh/an", factor: 0.052 },
  { id: "gaz", label: "Gaz naturel", icon: "\u{1F525}", unit: "kWh/an", factor: 0.227 },
  { id: "fioul", label: "Fioul", icon: "\u{1F6E2}\uFE0F", unit: "litres/an", factor: 3.25 },
];

const EQUIVALENCES = [
  { label: "arbres nécessaires pour absorber (par an)", divisor: 25 },
  { label: "allers-retours Paris-Marseille en TGV", divisor: 4.7 }, // 2 x 775 km x ~0,003 kgCO2e/km (TGV, Impact CO2 ADEME)
  { label: "km en voiture électrique", divisor: 0.02 },
];

export default function CalculateurCO2() {
  const [values, setValues] = useState<Record<string, string>>({});

  const set = (id: string, v: string) => setValues((prev) => ({ ...prev, [id]: v }));

  const transportTotal = TRANSPORT.reduce((s, t) => s + Math.max(0, parseFloat(values[t.id] || "0") || 0) * t.factor, 0);
  const energyTotal = ENERGY.reduce((s, e) => s + Math.max(0, parseFloat(values[e.id] || "0") || 0) * e.factor, 0);
  const total = transportTotal + energyTotal;

  const fmt = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });

  const pct = (v: number) => (total > 0 ? (v / total) * 100 : 0);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Environnement</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Empreinte CO2</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez vos émissions de CO2 liées aux transports et à l&apos;énergie domestique. Valeurs moyennes en France.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Transport */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Transports (par an)</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {TRANSPORT.map((t) => (
                  <div key={t.id}>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <span>{t.icon}</span> {t.label} <span className="text-xs" style={{ color: "var(--muted)" }}>({t.unit})</span>
                    </label>
                    <input type="number" min="0" placeholder="0" value={values[t.id] || ""} onChange={(e) => set(t.id, e.target.value)}
                      className="mt-1 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Energy */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Énergie domestique (par an)</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {ENERGY.map((e) => (
                  <div key={e.id}>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <span>{e.icon}</span> {e.label}
                    </label>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>({e.unit})</span>
                    <input type="number" min="0" placeholder="0" value={values[e.id] || ""} onChange={(ev) => set(e.id, ev.target.value)}
                      className="mt-1 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Émissions totales estimées</p>
              <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: total > 5000 ? "#dc2626" : total > 2000 ? "#f59e0b" : "var(--primary)" }}>
                {fmt(total / 1000)}
              </p>
              <p className="mt-1 text-lg font-semibold" style={{ color: "var(--muted)" }}>tonnes CO2 / an</p>

              {total > 0 && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-right text-xs font-medium">Transports</span>
                    <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct(transportTotal)}%`, background: "var(--primary)" }} />
                    </div>
                    <span className="w-20 text-xs font-bold">{fmt(transportTotal)} kg</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-24 text-right text-xs font-medium">Énergie</span>
                    <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct(energyTotal)}%`, background: "var(--accent)" }} />
                    </div>
                    <span className="w-20 text-xs font-bold">{fmt(energyTotal)} kg</span>
                  </div>
                </div>
              )}
            </div>

            {/* Equivalences */}
            {total > 0 && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Équivalences</h2>
                <div className="mt-4 space-y-3">
                  {EQUIVALENCES.map((eq) => (
                    <div key={eq.label} className="flex items-center gap-3">
                      <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                        {fmt(total / eq.divisor)}
                      </span>
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{eq.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ToolHowToSection
              title="Comment utiliser le calculateur d'empreinte CO2"
              description="Estimez vos émissions annuelles de CO2 en trois étapes, à partir des facteurs ADEME (Base Carbone)."
              steps={[
                {
                  name: "Renseignez vos transports annuels",
                  text:
                    "Indiquez le nombre de kilomètres parcourus chaque année en voiture (facteur 0,218 kgCO2/km, ADEME Base Carbone v23.1), avion (0,255 kgCO2/km), train (0,006 kgCO2/km) et bus (0,089 kgCO2/km). Cumulez les trajets domicile-travail, vacances et déplacements pro pour un total réaliste.",
                },
                {
                  name: "Ajoutez votre énergie domestique",
                  text:
                    "Saisissez votre consommation annuelle d'électricité (kWh), de gaz naturel (kWh) et de fioul (litres). Ces valeurs figurent sur vos factures EDF, Engie ou relevé fioul. L'électricité française est très décarbonée (52 gCO2/kWh) grâce au nucléaire et aux renouvelables.",
                },
                {
                  name: "Analysez votre bilan et les équivalences",
                  text:
                    "Le total apparaît en tonnes de CO2 par an, avec la répartition transports vs énergie. Les équivalences (arbres à planter, trajets TGV, km en électrique) rendent le chiffre concret. La moyenne française est d'environ 9-10 tCO2/an, l'objectif Accord de Paris vise 2 tCO2/an d'ici 2050.",
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
                Cas d&apos;usage du calculateur CO2
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Trajet vacances : voiture ou train ?
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Paris-Marseille (775 km) en voiture thermique = 169 kg CO2 (1 personne). En TGV =
                    environ 2,3 kg (facteur ADEME d&apos;environ 3 g/km), soit plus de 70 fois moins. Sur un aller-retour annuel, le train évite
                    plus de 330 kg de CO2 — l&apos;équivalent de 13 arbres absorbés en un an.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Bilan logement avant rénovation
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Maison chauffée au fioul (2 500 L/an) = 8,1 tCO2 — soit à elle seule 4 fois
                    l&apos;objectif annuel total Accord de Paris (2 tCO2). Passer à une pompe à chaleur (électricité française)
                    fait tomber le poste chauffage vers 0,5 tCO2/an. Le calcul ici aide à prioriser les
                    travaux de rénovation énergétique (MaPrimeRénov, CEE).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Voyage en avion : prise de conscience
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un aller-retour Paris-New York (11 500 km) émet environ 2,9 tCO2 par passager —
                    soit l&apos;objectif annuel complet d&apos;un Français selon l&apos;Accord de Paris.
                    Visualiser ce poste pousse souvent à limiter les vols longs courriers ou à
                    compenser via des programmes vérifiés (Gold Standard, VCS).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Reporting RSE pour TPE/PME
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour une auto-entreprise ou TPE qui débute son bilan carbone (BEGES, scope 1 et 2),
                    cet outil donne un ordre de grandeur rapide : flotte véhicule, consommation
                    bureau, déplacements pro. Pour un bilan officiel, utilisez ensuite le module
                    Bilan Carbone ADEME ou un cabinet certifié.
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
                À savoir sur l&apos;empreinte carbone
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Les facteurs d&apos;émission viennent de la Base Carbone ADEME.</strong> Voiture
                  thermique 0,218 kgCO2/km en moyenne (ADEME Base Carbone v23.1, 2024), avion
                  long-courrier 0,255 kgCO2/km, train SNCF 0,006 kgCO2/km, bus interurbain 0,089
                  kgCO2/km. Ces facteurs évoluent : vérifiez la version la plus récente sur le
                  site officiel ADEME pour un bilan réglementaire.
                </p>
                <p>
                  <strong>L&apos;empreinte moyenne française est d&apos;environ 9 à 10 tCO2/an</strong>,
                  selon le Haut Conseil pour le Climat. Cela inclut le scope direct (transports,
                  logement) et indirect (alimentation, biens importés, services publics). L&apos;Accord
                  de Paris (objectif +1,5 degré) implique de descendre à 2 tCO2/an par personne
                  d&apos;ici 2050 — une division par 5.
                </p>
                <p>
                  <strong>L&apos;électricité française est exceptionnellement bas-carbone</strong> à
                  environ 52 gCO2/kWh, grâce au mix nucléaire (~70%) et renouvelable. C&apos;est 4 à 10
                  fois moins que l&apos;Allemagne (charbon) ou la Pologne. C&apos;est pourquoi
                  électrification (pompe à chaleur, véhicule électrique) reste un levier majeur en
                  France, contrairement à d&apos;autres pays.
                </p>
                <p>
                  <strong>Cet outil est une estimation indicative</strong> et ne remplace pas un Bilan
                  Carbone réglementaire (BEGES) requis pour les entreprises de plus de 500 salariés.
                  Pour un suivi rigoureux, utilisez la méthode complète de l&apos;ADEME ou faites appel
                  à un cabinet certifié ABC (Association Bilan Carbone).
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions fréquentes sur le calcul de l'empreinte carbone individuelle."
              items={[
                {
                  question: "Quelle est l'empreinte carbone moyenne d'un Français ?",
                  answer:
                    "Environ 9 à 10 tonnes de CO2 équivalent par personne et par an, selon le Haut Conseil pour le Climat. Ce chiffre inclut les émissions directes (transports, chauffage) et indirectes (alimentation, biens importés, services publics). L'objectif Accord de Paris est de descendre à 2 tonnes par personne d'ici 2050.",
                },
                {
                  question: "Pourquoi l'électricité française émet-elle peu de CO2 ?",
                  answer:
                    "L'électricité en France provient majoritairement du nucléaire (environ 70%) et des énergies renouvelables (hydraulique, éolien, solaire). Son facteur d'émission est d'environ 52 gCO2/kWh, soit 4 à 10 fois moins que les pays dépendant du charbon ou du gaz comme l'Allemagne, la Pologne ou la Chine.",
                },
                {
                  question: "Comment réduire efficacement son empreinte carbone ?",
                  answer:
                    "Les leviers les plus efficaces sont : réduire les trajets en avion (un AR Paris-New York émet environ 2,9 tCO2), privilégier le train à la voiture, isoler son logement, passer à une pompe à chaleur ou un chauffage bois. Au quotidien, covoiturage, vélo et réduction de la viande rouge ont aussi un impact significatif.",
                },
                {
                  question: "Quels facteurs d'émission sont utilisés dans cet outil ?",
                  answer:
                    "Les facteurs proviennent de la Base Carbone ADEME (v23.1, 2024) : voiture 0,218 kgCO2/km, avion 0,255 kgCO2/km, train 0,006 kgCO2/km, bus 0,089 kgCO2/km, électricité 0,052 kgCO2/kWh, gaz naturel 0,227 kgCO2/kWh, fioul 3,25 kgCO2/litre. Ces valeurs sont des moyennes nationales.",
                },
                {
                  question: "Combien d'arbres faut-il planter pour compenser 1 tCO2 ?",
                  answer:
                    "Un arbre adulte absorbe environ 25 kg de CO2 par an. Compenser 1 tonne par an nécessite donc 40 arbres en croissance pendant plusieurs décennies. Mais la compensation par plantation est limitée dans le temps et imparfaite : la priorité reste de réduire ses émissions à la source.",
                },
                {
                  question: "Mon empreinte calculée ici est-elle un bilan carbone officiel ?",
                  answer:
                    "Non. Cet outil est une estimation indicative basée sur les facteurs ADEME. Pour un Bilan Carbone réglementaire (BEGES, obligatoire pour entreprises de plus de 500 salariés), utilisez la méthode officielle ADEME ou un cabinet certifié ABC (Association Bilan Carbone).",
                },
                {
                  question: "Mes données saisies sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée saisie n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription et sans tracker de profilage.",
                },
              ]}
            />
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
