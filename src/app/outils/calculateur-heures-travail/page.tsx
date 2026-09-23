"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

interface DayEntry {
  start: string;
  end: string;
  breakMin: string;
}

function timeToMinutes(t: string): number {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatHours(minutes: number): string {
  minutes = Math.round(minutes);
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  const sign = minutes < 0 ? "-" : "";
  return `${sign}${h}h${m.toString().padStart(2, "0")}`;
}

export default function CalculateurHeuresTravail() {
  const [weeklyContract, setWeeklyContract] = useState("35");
  const [entries, setEntries] = useState<DayEntry[]>(
    DAYS.map((_, i) => ({
      start: i < 5 ? "09:00" : "",
      end: i < 5 ? "17:30" : "",
      breakMin: i < 5 ? "60" : "0",
    }))
  );

  const updateEntry = (index: number, key: keyof DayEntry, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [key]: value };
    setEntries(newEntries);
  };

  const results = useMemo(() => {
    const daily = entries.map((e) => {
      if (!e.start || !e.end) return 0;
      let span = timeToMinutes(e.end) - timeToMinutes(e.start);
      if (span < 0) span += 24 * 60; // poste de nuit : fin le lendemain
      const worked = span - Math.max(0, parseInt(e.breakMin) || 0);
      return Math.max(0, worked);
    });
    const totalMinutes = daily.reduce((a, b) => a + b, 0);
    const contractMinutes = (parseFloat(weeklyContract) || 35) * 60;
    const overtime = Math.max(0, totalMinutes - contractMinutes);
    const daysWorked = daily.filter((d) => d > 0).length;
    const avgPerDay = daysWorked > 0 ? totalMinutes / daysWorked : 0;

    return { daily, totalMinutes, contractMinutes, overtime, daysWorked, avgPerDay };
  }, [entries, weeklyContract]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Travail</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur d{"'"}
            <span style={{ color: "var(--primary)" }}>heures de travail</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez vos heures de travail, pauses, heures supplémentaires et totaux hebdomadaires.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Contract hours */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Contrat</h2>
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Heures hebdomadaires contractuelles</label>
                <input type="number" value={weeklyContract} onChange={(e) => setWeeklyContract(e.target.value)} min="0" step="0.5"
                  className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
              </div>
            </div>

            {/* Weekly entries */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Horaires de la semaine</h2>
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-[120px_1fr_1fr_80px_80px] gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  <span>Jour</span>
                  <span>Début</span>
                  <span>Fin</span>
                  <span>Pause (min)</span>
                  <span className="text-right">Total</span>
                </div>
                {DAYS.map((day, i) => (
                  <div key={day} className="grid grid-cols-[120px_1fr_1fr_80px_80px] items-center gap-2">
                    <span className="text-sm font-semibold">{day}</span>
                    <input type="time" value={entries[i].start} onChange={(e) => updateEntry(i, "start", e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: "var(--border)" }} />
                    <input type="time" value={entries[i].end} onChange={(e) => updateEntry(i, "end", e.target.value)}
                      className="rounded-lg border px-2 py-2 text-sm" style={{ borderColor: "var(--border)" }} />
                    <input type="number" value={entries[i].breakMin} onChange={(e) => updateEntry(i, "breakMin", e.target.value)} min="0"
                      className="rounded-lg border px-2 py-2 text-center text-sm" style={{ borderColor: "var(--border)" }} />
                    <span className="text-right text-sm font-bold" style={{ color: results.daily[i] > 0 ? "var(--primary)" : "var(--muted)" }}>
                      {results.daily[i] > 0 ? formatHours(results.daily[i]) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Récapitulatif</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <ResultBox label="Total travaillé" value={formatHours(results.totalMinutes)} primary />
                <ResultBox label="Heures sup." value={results.overtime > 0 ? formatHours(results.overtime) : "0h00"} accent={results.overtime > 0} />
                <ResultBox label="Jours travaillés" value={`${results.daysWorked}`} />
                <ResultBox label="Moyenne / jour" value={formatHours(Math.round(results.avgPerDay))} />
              </div>
              <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--muted)" }}>Contrat : {weeklyContract}h / semaine</span>
                  <span className="font-bold" style={{ color: results.overtime > 0 ? "var(--accent)" : "var(--primary)" }}>
                    {results.overtime > 0
                      ? `+${formatHours(results.overtime)} supplémentaires`
                      : results.totalMinutes < results.contractMinutes
                      ? `${formatHours(results.contractMinutes - results.totalMinutes)} restantes`
                      : "Contrat respecté"}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (results.totalMinutes / results.contractMinutes) * 100)}%`,
                      background: results.overtime > 0 ? "var(--accent)" : "var(--primary)",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Durée légale du travail en France</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">35 heures</strong> : La durée légale hebdomadaire est de 35 heures pour les salariés à temps plein. Au-delà, les heures sont considérées comme supplémentaires.</p>
                <p><strong className="text-[var(--foreground)]">Heures supplémentaires</strong> : Majorées de 25% pour les 8 premières heures (de la 36e à la 43e) et de 50% au-delà. Le contingent annuel est de 220 heures.</p>
                <p><strong className="text-[var(--foreground)]">Repos obligatoire</strong> : 11 heures consécutives de repos quotidien et 35 heures consécutives de repos hebdomadaire (24h + 11h).</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment utiliser le calculateur d&apos;heures de travail"
              description="Saisissez vos horaires journaliers et le calculateur compare automatiquement votre temps effectif à votre contrat, pour détecter les heures supplémentaires et leurs majorations."
              steps={[
                {
                  name: "Définir le volume horaire contractuel",
                  text:
                    "Indiquez le nombre d'heures hebdomadaires prévues par votre contrat (35h par défaut en France pour un temps plein, 24h pour un temps partiel courant, 28h pour un mi-temps majoré). Cette base sert de référence pour calculer les heures supplémentaires.",
                },
                {
                  name: "Remplir les horaires de la semaine",
                  text:
                    "Pour chaque jour, saisissez l'heure de début, l'heure de fin et la durée de pause déjeuner en minutes. Pour les jours non travaillés (ex : samedi, dimanche), laissez les champs vides. Le total quotidien s'affiche en temps réel à droite de chaque ligne.",
                },
                {
                  name: "Consulter le récapitulatif et les heures supplémentaires",
                  text:
                    "Le bloc récapitulatif donne le total hebdomadaire, le nombre d'heures sup, les jours travaillés et la moyenne par jour. La barre de progression indique si vous êtes en dessous, conforme ou au-dessus de votre contrat. Si dépassement, la valeur est affichée en orange.",
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
                Cas d&apos;usage du calculateur d&apos;heures de travail
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Salarié qui contrôle son bulletin de paie
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Votre fiche de paie affiche 7 heures sup payées ce mois mais vous estimez en
                    avoir fait 12 : reconstituez vos horaires réels semaine par semaine pour
                    détecter un écart. En cas de litige, demandez le décompte officiel à votre
                    employeur (obligation légale art L3171-1 du Code du travail).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Manager qui prépare un planning
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Avant de valider les horaires de l&apos;équipe, simulez les volumes
                    hebdomadaires de chacun pour vérifier qu&apos;aucun salarié ne dépasse les
                    48h légales (ou 44h en moyenne sur 12 semaines). Anticipez les majorations
                    pour mieux prévoir le budget paie de la période.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Freelance ou indépendant en TJM
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour évaluer si votre TJM est rentable, comparez votre temps de travail
                    réel (incluant le commercial, l&apos;admin, la veille) au temps facturé.
                    Si vous travaillez 50h/semaine pour 35h facturées, votre TJM affiché est
                    surévalué de 43 % par rapport au temps réel. Indispensable avant
                    d&apos;ajuster ses tarifs.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Service paie et RH PME
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour des employés au forfait jours ou en modulation horaire, le
                    calculateur sert de pré-calcul avant intégration dans le SIRH (Sage,
                    PayFit, Lucca). Particulièrement utile pour les entreprises sans logiciel
                    de gestion de temps qui pointent encore en Excel ou sur papier.
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
                À savoir sur le temps de travail en France
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Article L3121-27 : 35 heures, c&apos;est la durée légale, pas la durée maximale.</strong>
                  La durée légale de 35h/semaine est la base au-delà de laquelle les heures
                  sont qualifiées de supplémentaires. La durée maximale est de 48h/semaine et
                  44h en moyenne sur 12 semaines consécutives. Au quotidien : 10h max par jour
                  (12h sur dérogation), avec 11h de repos consécutif obligatoire entre deux
                  journées.
                </p>
                <p>
                  <strong>Majorations des heures supplémentaires.</strong> Sauf accord
                  d&apos;entreprise différent, les 8 premières heures sup (36e à 43e heure) sont
                  majorées de 25 %. Au-delà de la 43e heure, majoration de 50 %. Le contingent
                  annuel par défaut est de 220 heures, au-delà il faut une contrepartie
                  obligatoire en repos. Une convention de branche peut prévoir des taux plus
                  favorables (10 % minimum légal en négociation collective).
                </p>
                <p>
                  <strong>Repos compensateur équivalent.</strong> Une entreprise peut
                  remplacer le paiement majoré des heures sup par un repos compensateur (1h
                  travaillée = 1h15 de repos pour 25 % de majoration). Ce dispositif doit être
                  prévu par un accord collectif. Avantage employé : préserve la trésorerie de
                  la PME, donne plus de temps libre. Inconvénient : perte de rémunération
                  immédiate.
                </p>
                <p>
                  <strong>Pause déjeuner : non comptée comme temps de travail.</strong> Le Code
                  du travail impose au minimum 20 minutes de pause dès 6 heures de travail
                  consécutives (art L3121-16). Elle ne compte pas comme temps de travail
                  effectif sauf si le salarié reste à disposition de l&apos;employeur. La
                  plupart des conventions accordent entre 45 minutes et 1 heure non payée, qui
                  doit être déduite du temps de présence pour calculer le temps effectif.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posées sur le calcul des heures de travail."
              items={[
                {
                  question: "La pause déjeuner est-elle comptée dans le temps de travail ?",
                  answer:
                    "Non, en France la pause déjeuner n'est pas comptée comme temps de travail effectif. Le Code du travail (art L3121-16) impose une pause minimale de 20 minutes pour toute période de 6 heures consécutives. La plupart des entreprises accordent entre 45 minutes et 1 heure non payée, qui est déduite du temps de présence. Exception : si le salarié reste à disposition de l'employeur, la pause est requalifiée en temps de travail.",
                },
                {
                  question: "Comment sont majorées les heures supplémentaires ?",
                  answer:
                    "En France, les 8 premières heures sup (36e à 43e heure de la semaine) sont majorées de 25 %. Au-delà de 43 heures, majoration de 50 %. Le contingent annuel par défaut est de 220 heures par salarié, modulable par accord de branche. Un accord d'entreprise peut remplacer la majoration en argent par un repos compensateur équivalent (par exemple 1h15 de repos pour 1h sup à 25 %).",
                },
                {
                  question: "Quelle est la durée maximale de travail par jour en France ?",
                  answer:
                    "10 heures par jour maximum, avec une dérogation possible jusqu'à 12 heures (accord de branche). Maximum hebdomadaire : 48h sur une semaine isolée et 44h en moyenne sur 12 semaines consécutives. Repos quotidien obligatoire : 11 heures consécutives. Repos hebdomadaire : 35 heures consécutives (24h + 11h). Ces seuils sont fixés par le Code du travail et l'art L3121-18 à L3121-22.",
                },
                {
                  question: "Comment calculer mon salaire horaire net ?",
                  answer:
                    "Salaire mensuel net divisé par le nombre d'heures travaillées dans le mois. Pour un 35h hebdomadaire : 35 x 52 / 12 = 151,67h/mois. Si net mensuel = 2 000 €, alors taux horaire net = 13,19 €/h. Pour le brut, comptez environ 23 % de charges salariales (variable selon convention) en plus pour reconstituer le salaire brut à partir du net.",
                },
                {
                  question: "Comment sont décomptés les jours fériés dans la semaine ?",
                  answer:
                    "Si le 1er mai tombe sur un jour normalement travaillé, il est payé comme un jour normal (pas de perte de salaire). S'il est travaillé (cas exceptionnel), majoration de 100 %. Pour les autres fériés (8 mai, 14 juillet, etc.), majoration dépend de la convention collective : variable de 0 à 100 %. La règle par défaut Code du travail : seul le 1er mai est obligatoirement majoré.",
                },
                {
                  question: "Quelle est la différence entre temps de présence et temps de travail effectif ?",
                  answer:
                    "Le temps de présence inclut tout le temps passé sur le lieu de travail (heure d'arrivée à heure de départ). Le temps de travail effectif est le temps où le salarié est à la disposition de l'employeur, en déduisant les pauses non rémunérées. C'est le temps effectif qui compte pour calculer les heures supplémentaires et le salaire de base, comme le précise l'art L3121-1 du Code du travail.",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. Les horaires saisis restent dans votre navigateur et ne sont envoyés à aucun serveur. Le calcul est effectué 100 % localement en JavaScript. Aucun cookie de tracking, aucune connexion serveur, aucune inscription requise. La page peut fonctionner hors connexion une fois chargée.",
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

function ResultBox({ label, value, primary, accent }: { label: string; value: string; primary?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
      <p className="text-xl font-bold" style={{
        fontFamily: "var(--font-display)",
        color: primary ? "var(--primary)" : accent ? "var(--accent)" : "var(--foreground)",
      }}>{value}</p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
    </div>
  );
}
