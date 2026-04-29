"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

function toInputDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date | null {
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function CalculateurDate() {
  const today = useMemo(() => toInputDate(new Date()), []);

  // Mode 1: difference between two dates
  const [dateA, setDateA] = useState(today);
  const [dateB, setDateB] = useState(today);

  // Mode 2: add/subtract days
  const [baseDate, setBaseDate] = useState(today);
  const [daysToAdd, setDaysToAdd] = useState("30");
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const diff = useMemo(() => {
    const a = parseDate(dateA);
    const b = parseDate(dateB);
    if (!a || !b) return null;
    const ms = Math.abs(b.getTime() - a.getTime());
    const totalDays = Math.round(ms / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const months = Math.abs((b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()));
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return { totalDays, weeks, remainingDays, years, remainingMonths, months };
  }, [dateA, dateB]);

  const resultDate = useMemo(() => {
    const d = parseDate(baseDate);
    const days = parseInt(daysToAdd) || 0;
    if (!d) return null;
    const result = new Date(d);
    result.setDate(result.getDate() + (operation === "add" ? days : -days));
    return result;
  }, [baseDate, daysToAdd, operation]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Outils</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>dates</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le nombre de jours entre deux dates ou ajoutez/soustrayez des jours a une date.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode 1: Difference */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Jours entre deux dates</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date de debut</label>
                  <input type="date" value={dateA} onChange={(e) => setDateA(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date de fin</label>
                  <input type="date" value={dateB} onChange={(e) => setDateB(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {diff && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Resultat</h2>
                <div className="mt-4 text-center">
                  <p className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {diff.totalDays}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>jours</p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <StatBox label="Semaines + jours" value={`${diff.weeks} sem. ${diff.remainingDays} j`} />
                  <StatBox label="Mois" value={`${diff.months}`} />
                  <StatBox label="Annees + mois" value={diff.years > 0 ? `${diff.years} an(s) ${diff.remainingMonths} mois` : `${diff.remainingMonths} mois`} />
                </div>
              </div>
            )}

            {/* Mode 2: Add/Subtract */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Ajouter / Soustraire des jours</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date de depart</label>
                  <input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
                <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                  <button onClick={() => setOperation("add")}
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{ background: operation === "add" ? "var(--primary)" : "transparent", color: operation === "add" ? "white" : "var(--muted)" }}>
                    + Ajouter
                  </button>
                  <button onClick={() => setOperation("subtract")}
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{ background: operation === "subtract" ? "var(--primary)" : "transparent", color: operation === "subtract" ? "white" : "var(--muted)" }}>
                    - Soustraire
                  </button>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre de jours</label>
                  <input type="number" value={daysToAdd} onChange={(e) => setDaysToAdd(e.target.value)} min="0"
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {resultDate && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Date calculee</h2>
                <p className="mt-4 text-2xl font-bold capitalize" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {formatDate(resultDate)}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {toInputDate(resultDate)}
                </p>
              </div>
            )}

            <ToolHowToSection
              title="Comment utiliser le calculateur de dates"
              description="Deux modes complementaires pour repondre aux deux questions les plus frequentes : combien de jours entre A et B, et que donne A + ou - N jours."
              steps={[
                {
                  name: "Calculer la difference entre deux dates",
                  text:
                    "Selectionnez la date de debut et la date de fin dans les deux champs date. L'outil affiche immediatement le nombre total de jours, la conversion en semaines + jours, en mois et en annees + mois. Pratique pour calculer une duree d'emploi, un anniversaire, un delai legal.",
                },
                {
                  name: "Ajouter ou soustraire des jours",
                  text:
                    "Choisissez la date de depart, l'operation (+ ou -) et le nombre de jours. Le resultat indique la date precise (avec le nom du jour) et son format ISO (AAAA-MM-JJ). Ideal pour les echeances et delais reglementaires.",
                },
                {
                  name: "Verifier le resultat",
                  text:
                    "Si vous depassez un changement d'annee bissextile (29 fevrier) ou de mois, l'outil le gere automatiquement. Le calcul inclut les week-ends. Pour exclure les week-ends ou jours feries, utilisez plutot un outil specialise jours ouvres.",
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
                Cas d&apos;usage du calculateur de dates
              </h2>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Les delais et echeances administratives, juridiques ou personnelles sont les principaux
                besoins.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Delai de retractation 14 jours
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour une vente a distance ou un contrat hors etablissement, le Code de la consommation
                    accorde 14 jours calendaires pour se retracter. Le mode &quot;Ajouter&quot; sur la
                    date de signature donne la date butoir.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Preavis de location ou demission
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Calculez precisement la date de fin du preavis (1 mois en zone tendue / location
                    meublee, 3 mois en non meuble). Utilisez la date de reception du courrier comme point
                    de depart, pas la date d&apos;envoi.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Anciennete et duree d&apos;emploi
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour calculer votre anciennete totale dans une entreprise, indiquez la date
                    d&apos;embauche et la date de fin (ou aujourd&apos;hui). Le resultat en annees +
                    mois sert pour les indemnites legales et conventionnelles.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Garantie produit et SAV
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Garantie legale de conformite (2 ans en France pour les biens neufs depuis 2022),
                    garantie commerciale eventuelle. Le calculateur donne la date butoir pour faire jouer
                    vos droits.
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
                A savoir sur le calcul de dates
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Jours calendaires vs jours ouvres.</strong> Ce calculateur compte les jours
                  calendaires (tous les jours, week-ends inclus). Pour un calcul en jours ouvres
                  (lundi-vendredi hors feries), utilisez plutot un outil specialise. La plupart des
                  delais legaux francais utilisent les jours calendaires - sauf mentions contraires
                  comme &quot;jours ouvrables&quot; ou &quot;jours ouvres&quot;.
                </p>
                <p>
                  <strong>Annees bissextiles.</strong> Une annee est bissextile si elle est divisible par
                  4, sauf les annees seculaires (divisibles par 100) qui doivent aussi etre divisibles par
                  400. 2024 et 2028 sont bissextiles, 2100 ne le sera pas. Le calculateur applique cette
                  regle automatiquement.
                </p>
                <p>
                  <strong>Fuseau horaire.</strong> Toutes les dates sont traitees en heure locale du
                  navigateur. Pour deux dates en zones differentes, le calcul peut varier de 1 jour selon
                  l&apos;heure UTC. Pour des calculs critiques (vols internationaux, delais juridiques
                  internationaux), verifiez avec un outil specialise.
                </p>
                <p>
                  <strong>Format ISO 8601.</strong> Le format AAAA-MM-JJ (exemple 2026-04-29) est le
                  standard international ISO 8601 utilise dans les bases de donnees, les API REST et la
                  programmation. C&apos;est le format affiche en complement du format francais.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur le calcul de dates et les delais."
              items={[
                {
                  question: "Comment compter le nombre de jours entre deux dates ?",
                  answer:
                    "Le calcul est : (date_fin - date_debut) en millisecondes / 86 400 000 (millisecondes par jour), arrondi au plus pres. C'est exactement ce que fait le calculateur. Pour une date du 1er janvier au 31 decembre, vous obtenez 364 (et non 365) car les bornes sont 'date a date'.",
                },
                {
                  question: "Le calcul inclut-il les week-ends et jours feries ?",
                  answer:
                    "Oui. Tous les jours sont comptes (lundi au dimanche, et tous les feries). Pour exclure week-ends ou feries, il faut un outil specialise 'jours ouvres' ou 'jours ouvrables'. La plupart des delais legaux francais utilisent les jours calendaires, sauf mention explicite.",
                },
                {
                  question: "Que signifie le format AAAA-MM-JJ ?",
                  answer:
                    "C'est le format ISO 8601, standard international avec annee sur 4 chiffres, mois sur 2 chiffres, jour sur 2 chiffres. Pour le 29 avril 2026 : 2026-04-29. Ce format est universellement reconnu et permet le tri alphabetique correct des dates.",
                },
                {
                  question: "Le calculateur gere-t-il les annees bissextiles ?",
                  answer:
                    "Oui. Le moteur de date du navigateur applique automatiquement la regle des annees bissextiles : un 29 fevrier supplementaire tous les 4 ans (sauf annees seculaires non divisibles par 400). Les calculs traversant un 29 fevrier sont donc exacts.",
                },
                {
                  question: "Comment calculer un delai en jours ouvres ?",
                  answer:
                    "Ce calculateur compte uniquement les jours calendaires. Pour des jours ouvres (lundi-vendredi hors jours feries), utilisez un calculateur specialise. Reperes utiles : il y a en moyenne 21 jours ouvres par mois en France, et environ 252 jours ouvres par an.",
                },
                {
                  question: "Le delai de 14 jours de retractation se compte comment ?",
                  answer:
                    "Le delai legal de retractation est de 14 jours calendaires (Code de la consommation, art. L221-18). Le decompte commence le lendemain de la conclusion du contrat ou de la reception du bien. Si le 14e jour tombe un samedi, dimanche ou jour ferie, il est prolonge au prochain jour ouvrable.",
                },
                {
                  question: "Mes dates sont-elles confidentielles ?",
                  answer:
                    "Oui, totalement. Tous les calculs sont effectues localement dans votre navigateur. Aucune date saisie n'est envoyee sur internet. L'outil fonctionne sans inscription et sans cookie de tracking.",
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

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl p-4 text-center" style={{ background: "var(--surface-alt)" }}>
      <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{value}</p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
    </div>
  );
}
