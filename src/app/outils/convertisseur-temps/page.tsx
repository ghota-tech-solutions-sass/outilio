"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const UNITS = [
  { key: "seconds", label: "Secondes", factor: 1 },
  { key: "minutes", label: "Minutes", factor: 60 },
  { key: "hours", label: "Heures", factor: 3600 },
  { key: "days", label: "Jours", factor: 86400 },
  { key: "weeks", label: "Semaines", factor: 604800 },
  { key: "months", label: "Mois (30j)", factor: 2592000 },
  { key: "years", label: "Années (365j)", factor: 31536000 },
];

const QUICK_ANSWERS = [
  { question: "Combien de secondes dans une journée ?", answer: "86 400 secondes (24 h × 60 min × 60 s)", value: "1", unit: "days" },
  { question: "Combien de minutes dans 24 heures ?", answer: "1 440 minutes", value: "24", unit: "hours" },
  { question: "1 million de secondes en jours ?", answer: "11,57 jours (11 j 13 h 46 min 40 s)", value: "1000000", unit: "seconds" },
  { question: "1 milliard de secondes en jours ?", answer: "11 574 jours, soit environ 31,7 ans", value: "1000000000", unit: "seconds" },
];

export default function ConvertisseurTemps() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("hours");

  const conversions = useMemo(() => {
    const num = parseFloat(value) || 0;
    const from = UNITS.find((u) => u.key === fromUnit);
    if (!from || num === 0) return null;

    const inSeconds = num * from.factor;

    return UNITS.map((u) => ({
      key: u.key,
      label: u.label,
      value: inSeconds / u.factor,
    }));
  }, [value, fromUnit]);

  const fmtVal = (n: number) => {
    if (Number.isInteger(n) && Math.abs(n) < 1e12) return n.toLocaleString("fr-FR");
    if (Math.abs(n) >= 0.01)
      return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    return n.toExponential(4);
  };

  // Human-readable breakdown
  const breakdown = useMemo(() => {
    const num = parseFloat(value) || 0;
    const from = UNITS.find((u) => u.key === fromUnit);
    if (!from || num <= 0) return null;

    let totalSec = Math.floor(num * from.factor);
    const years = Math.floor(totalSec / 31536000);
    totalSec %= 31536000;
    const days = Math.floor(totalSec / 86400);
    totalSec %= 86400;
    const hours = Math.floor(totalSec / 3600);
    totalSec %= 3600;
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} an${years > 1 ? "s" : ""}`);
    if (days > 0) parts.push(`${days} jour${days > 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} heure${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} seconde${seconds > 1 ? "s" : ""}`);

    return parts.join(", ");
  }, [value, fromUnit]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Conversion</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur de <span style={{ color: "var(--primary)" }}>temps</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez entre secondes, minutes, heures, jours, semaines, mois et années. Instantané, avec décomposition lisible.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Réponses rapides</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {QUICK_ANSWERS.map((q) => (
                  <button key={q.question} type="button"
                    onClick={() => { setValue(q.value); setFromUnit(q.unit); }}
                    className="rounded-xl px-4 py-3 text-left transition-opacity hover:opacity-80"
                    style={{ background: "var(--surface-alt)" }}>
                    <span className="block text-sm font-semibold">{q.question}</span>
                    <span className="mt-1 block text-sm font-bold" style={{ color: "var(--primary)" }}>{q.answer}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Valeur à convertir</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Valeur</label>
                  <input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Unité</label>
                  <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}>
                    {UNITS.map((u) => (
                      <option key={u.key} value={u.key}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {breakdown && (
              <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Décomposition</p>
                <p className="mt-2 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{breakdown}</p>
              </div>
            )}

            {conversions && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Résultats</h2>
                <div className="mt-4 space-y-2">
                  {conversions.map((c) => (
                    <div key={c.key}
                      className="flex items-center justify-between rounded-xl px-4 py-3"
                      style={{
                        background: c.key === fromUnit ? "var(--primary)" : "var(--surface-alt)",
                        color: c.key === fromUnit ? "#fff" : "inherit",
                      }}>
                      <span className="text-sm font-semibold">{c.label}</span>
                      <span className="text-sm font-bold" style={{ fontFamily: "monospace" }}>{fmtVal(c.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Repères temporels</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">1 million de secondes</strong> : 11,57 jours (11 jours, 13 heures, 46 minutes et 40 secondes)</p>
                <p><strong className="text-[var(--foreground)]">1 milliard de secondes</strong> : 11 574 jours, soit environ 31,7 ans</p>
                <p><strong className="text-[var(--foreground)]">Mois</strong> : La durée d&apos;un mois varie de 28 à 31 jours. Ce calculateur utilise 30 jours comme valeur moyenne.</p>
                <p><strong className="text-[var(--foreground)]">Année</strong> : 365 jours (365,25 en moyenne en comptant les années bissextiles).</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment utiliser le convertisseur de temps"
              description="Convertissez en un clic entre secondes, minutes, heures, jours, semaines, mois et années, avec décomposition humaine pour les durées longues."
              steps={[
                {
                  name: "Saisir la valeur à convertir",
                  text:
                    "Tapez le nombre dans le champ valeur. Les décimales sont acceptées (ex : 1,5 jour = 36 heures). Le calcul est instantané, sans bouton à cliquer.",
                },
                {
                  name: "Choisir l'unité source",
                  text:
                    "Sélectionnez l'unité correspondant à votre saisie : secondes, minutes, heures, jours, semaines, mois (base 30 jours) ou années (base 365 jours). L'unité source est mise en évidence dans les résultats.",
                },
                {
                  name: "Lire les conversions et la décomposition",
                  text:
                    "Toutes les unités sont calculées simultanément. La décomposition humaine (ex : 2 jours, 3 heures, 15 minutes) est idéale pour communiquer une durée dans une présentation, un rapport projet ou une estimation client.",
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
                Cas d&apos;usage du convertisseur de temps
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Estimation de projet client
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous estimez une mission à 120 heures de dev : conversion = 3 semaines à
                    temps plein, ou 5 semaines à 24 h/semaine. Indispensable pour cadrer un devis
                    et négocier une deadline réaliste avec un client en jours ouvrés.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Développeur backend
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Définir un TTL de cache : 86 400 secondes pour 24h, 604 800 secondes pour
                    une semaine, 2 592 000 pour 30 jours. Les API REST, JWT, cookies et
                    timestamps Unix raisonnent en secondes, le convertisseur évite les erreurs
                    de zéro classiques.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Salarié qui calcule son temps de travail
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Combien d&apos;heures sur une carrière de 42 ans à 1 607 h/an ? Réponse :
                    67 494 heures, soit l&apos;équivalent de 7,7 ans de travail continu. Utile
                    pour relativiser la valeur d&apos;une journée de RTT ou d&apos;un raccourci
                    procédural à 5 minutes par jour.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Étudiant ou curieux
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Combien d&apos;heures dans un siècle ? 876 600 (sur 100 années civiles).
                    Combien de minutes vivez-vous à 30 ans ? Environ 15,8 millions. Le
                    convertisseur permet de visualiser des durées abstraites dans des unités
                    concrètes pour un exposé ou un texte journalistique.
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
                À savoir sur la conversion d&apos;unités de temps
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Une journée n&apos;a pas toujours 86 400 secondes.</strong> Lors des
                  changements d&apos;heure DST (passage heure d&apos;été et heure d&apos;hiver),
                  une journée dure 23 ou 25 heures. Les secondes intercalaires (leap seconds)
                  ajoutées occasionnellement par l&apos;UTC peuvent aussi rallonger une minute
                  à 61 secondes. Pour des calculs précis sur des dates réelles, utilisez un
                  calculateur de dates plutôt qu&apos;une simple conversion d&apos;unités.
                </p>
                <p>
                  <strong>L&apos;année moyenne fait 365,2425 jours.</strong> C&apos;est la base
                  du calendrier grégorien : 365 jours, plus une année bissextile tous les 4 ans,
                  sauf les années séculaires non divisibles par 400. Le convertisseur utilise
                  365 jours par souci de simplicité, ce qui introduit une erreur de 0,07 % sur
                  le long terme.
                </p>
                <p>
                  <strong>Le format ISO 8601 duration normalise les durées.</strong> 2 jours,
                  3 heures, 15 minutes s&apos;écrit P2DT3H15M. Ce format est utilisé dans les
                  API REST, les feeds de podcasts (spécifiées en ISO 8601), les playlists vidéo
                  et les schémas JSON-LD. Un standard à connaître pour qui fait du dev backend
                  ou du SEO technique.
                </p>
                <p>
                  <strong>1 milliard de secondes = environ 31,7 ans.</strong> C&apos;est un
                  repère mnémotechnique utile : si vous avez 31 ans, vous avez vécu environ un
                  milliard de secondes. 1 million de secondes équivaut à 11,57 jours. Utile
                  pour estimer rapidement la durée de processus longs en informatique
                  (entraînement de modèle ML, batch de calcul, etc.).
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posées sur les conversions d'unités de temps."
              items={[
                {
                  question: "Combien de secondes y a-t-il dans une journée ?",
                  answer:
                    "Une journée compte 86 400 secondes (24 x 60 x 60). C'est la base de nombreux calculs informatiques, notamment les timestamps Unix qui comptent les secondes écoulées depuis le 1er janvier 1970 UTC. Attention : les jours de changement d'heure DST durent 23 ou 25 heures.",
                },
                {
                  question: "Combien de secondes y a-t-il dans 24 heures ?",
                  answer:
                    "24 heures = 86 400 secondes = 1 440 minutes. Une semaine compte 604 800 secondes et une année de 365 jours 31 536 000 secondes (31 622 400 pour une année bissextile).",
                },
                {
                  question: "1 million de secondes, ça fait combien de jours ?",
                  answer:
                    "1 000 000 secondes = 11,57 jours, soit exactement 11 jours, 13 heures, 46 minutes et 40 secondes (1 000 000 / 86 400). C'est environ 1 semaine et demie.",
                },
                {
                  question: "1 milliard de secondes, ça fait combien de jours ?",
                  answer:
                    "1 000 000 000 secondes = 11 574 jours, 1 heure, 46 minutes et 40 secondes (1 000 000 000 / 86 400), soit environ 31,7 ans. Quelqu'un qui fête ses 31 ans et 8 mois a donc vécu à peu près un milliard de secondes.",
                },
                {
                  question: "Pourquoi les mois sont-ils comptés sur 30 jours ?",
                  answer:
                    "Les mois réels varient de 28 à 31 jours. La valeur de 30 jours est une approximation standard pour les conversions générales. La moyenne exacte est de 30,44 jours (365,25/12). Pour des calculs de dates exacts, travaillez sur des dates calendaires plutôt que sur des conversions d'unités.",
                },
                {
                  question: "Combien d'heures de travail dans une année en France ?",
                  answer:
                    "Durée légale = 35h/semaine. Sur 52 semaines : 1 820 heures. En déduisant 5 semaines de congés payés et environ 8 jours fériés, on obtient 1 607 heures de travail effectif par an, c'est la base utilisée par le Code du travail et l'URSSAF.",
                },
                {
                  question: "Comment convertir un timestamp Unix en durée lisible ?",
                  answer:
                    "Un timestamp Unix est un nombre de secondes écoulées depuis le 1er janvier 1970 UTC. Pour le convertir en durée, divisez par 86 400 pour obtenir des jours, ou utilisez la décomposition humaine (années, jours, heures, minutes, secondes). Le timestamp 1 700 000 000 correspond au 14 novembre 2023.",
                },
                {
                  question: "Quelle est la durée exacte d'une année bissextile ?",
                  answer:
                    "Une année bissextile compte 366 jours = 8 784 heures = 31 622 400 secondes. Elle se produit tous les 4 ans, sauf les années séculaires non divisibles par 400 (donc 2000 était bissextile mais 1900 ne l'était pas). Cette règle compense le fait qu'une année astronomique fait 365,2425 jours.",
                },
                {
                  question: "Comment représenter une durée au format ISO 8601 ?",
                  answer:
                    "Le format ISO 8601 duration commence par P puis liste les composantes : P[n]Y[n]M[n]DT[n]H[n]M[n]S. Exemple : 2 jours 3 heures 15 minutes = P2DT3H15M. 1 an 6 mois = P1Y6M. Ce format est utilisé par les API REST, les flux RSS de podcasts et les schémas Schema.org.",
                },
                {
                  question: "Mes calculs sont-ils confidentiels ?",
                  answer:
                    "Oui. Toutes les conversions sont effectuées localement dans votre navigateur : aucune valeur saisie n'est envoyée à un serveur. L'outil fonctionne sans inscription, et même hors ligne une fois la page chargée. Le site utilise seulement une mesure d'audience anonyme (Google Analytics).",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conversions rapides</h3>
              <div className="mt-3 space-y-2">
                {[
                  { de: "1 heure", a: "3 600 sec" },
                  { de: "1 jour", a: "86 400 sec" },
                  { de: "1 semaine", a: "168 heures" },
                  { de: "1 mois", a: "720 heures" },
                  { de: "1 an", a: "8 760 heures" },
                  { de: "1 an", a: "525 600 min" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{r.de}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{r.a}</span>
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
