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
  { key: "years", label: "Annees (365j)", factor: 31536000 },
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
            Convertissez entre secondes, minutes, heures, jours, semaines, mois et annees. Bidirectionnel et instantane.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Valeur a convertir</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Valeur</label>
                  <input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Unite</label>
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
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Decomposition</p>
                <p className="mt-2 text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{breakdown}</p>
              </div>
            )}

            {conversions && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Resultats</h2>
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
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Reperes temporels</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">1 million de secondes</strong> : environ 11,6 jours</p>
                <p><strong className="text-[var(--foreground)]">1 milliard de secondes</strong> : environ 31,7 ans</p>
                <p><strong className="text-[var(--foreground)]">Mois</strong> : La duree d&apos;un mois varie de 28 a 31 jours. Ce calculateur utilise 30 jours comme valeur moyenne.</p>
                <p><strong className="text-[var(--foreground)]">Annee</strong> : 365 jours (365,25 pour les annees bissextiles en moyenne).</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment utiliser le convertisseur de temps"
              description="Convertissez en un clic entre secondes, minutes, heures, jours, semaines, mois et annees, avec decomposition humaine pour les durees longues."
              steps={[
                {
                  name: "Saisir la valeur a convertir",
                  text:
                    "Tapez le nombre dans le champ valeur. Les decimales sont acceptees (ex : 1,5 jour = 36 heures). Le calcul est instantane, sans bouton a cliquer.",
                },
                {
                  name: "Choisir l'unite source",
                  text:
                    "Selectionnez l'unite correspondant a votre saisie : secondes, minutes, heures, jours, semaines, mois (base 30 jours) ou annees (base 365 jours). L'unite source est mise en evidence dans les resultats.",
                },
                {
                  name: "Lire les conversions et la decomposition",
                  text:
                    "Toutes les unites sont calculees simultanement. La decomposition humaine (ex : 2 jours, 3 heures, 15 minutes) est ideale pour communiquer une duree dans une presentation, un rapport projet ou une estimation client.",
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
                    Estimation projet client
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous estimez une mission a 120 heures de dev : conversion = 3 semaines a
                    temps plein, ou 5 semaines a 24h/semaine. Indispensable pour cadrer un devis
                    et negocier une deadline realiste avec un client en jours ouvres.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Developpeur backend
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Definir un TTL de cache : 86 400 secondes pour 24h, 604 800 secondes pour
                    une semaine, 2 592 000 pour 30 jours. Les API REST, JWT, cookies et
                    timestamps Unix raisonnent en secondes, le convertisseur evite les erreurs
                    de zero classiques.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Salarie qui calcule son temps de travail
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Combien d&apos;heures sur une carriere de 42 ans a 1 607h/an ? Reponse :
                    67 494 heures, soit l&apos;equivalent de 7,7 ans de travail continu. Utile
                    pour relativiser la valeur d&apos;une journee de RTT ou d&apos;un raccourci
                    procedural a 5 minutes par jour.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Etudiant ou curieux
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Combien d&apos;heures dans un siecle ? 876 600 (sur 100 annees civiles).
                    Combien de minutes vivez-vous a 30 ans ? Environ 15,8 millions. Le
                    convertisseur permet de visualiser des durees abstraites dans des unites
                    concretes pour un expose ou un texte journalistique.
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
                A savoir sur la conversion d&apos;unites de temps
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Une journee n&apos;a pas toujours 86 400 secondes.</strong> Lors des
                  changements d&apos;heure DST (passage heure d&apos;ete et heure d&apos;hiver),
                  une journee dure 23 ou 25 heures. Les secondes intercalaires (leap seconds)
                  ajoutees occasionnellement par l&apos;UTC peuvent aussi rallonger une minute
                  a 61 secondes. Pour des calculs precis sur des dates reelles, utilisez un
                  calculateur de dates plutot qu&apos;une simple conversion d&apos;unites.
                </p>
                <p>
                  <strong>L&apos;annee moyenne fait 365,2425 jours.</strong> C&apos;est la base
                  du calendrier gregorien : 365 jours, plus une annee bissextile tous les 4 ans,
                  sauf les annees seculaires non divisibles par 400. Le convertisseur utilise
                  365 jours par souci de simplicite, ce qui introduit une erreur de 0,07 % sur
                  le long terme.
                </p>
                <p>
                  <strong>Le format ISO 8601 duration normalise les durees.</strong> 2 jours,
                  3 heures, 15 minutes s&apos;ecrit P2DT3H15M. Ce format est utilise dans les
                  API REST, les feeds de podcasts (specifiees en ISO 8601), les playlists video
                  et les schemas JSON-LD. Un standard a connaitre pour qui fait du dev backend
                  ou du SEO technique.
                </p>
                <p>
                  <strong>1 milliard de secondes = environ 31,7 ans.</strong> C&apos;est un
                  repere mnemotechnique utile : si vous avez 31 ans, vous avez vecu environ un
                  milliard de secondes. 1 million de secondes equivaut a 11,57 jours. Utile
                  pour estimer rapidement la duree de processus longs en informatique
                  (entrainement de modele ML, batch de calcul, etc.).
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur les conversions d'unites de temps."
              items={[
                {
                  question: "Combien de secondes y a-t-il dans une journee ?",
                  answer:
                    "Une journee compte 86 400 secondes (24 x 60 x 60). C'est la base de nombreux calculs informatiques, notamment les timestamps Unix qui comptent les secondes ecoulees depuis le 1er janvier 1970 UTC. Attention : les jours de changement d'heure DST durent 23 ou 25 heures.",
                },
                {
                  question: "Pourquoi les mois sont-ils comptes sur 30 jours ?",
                  answer:
                    "Les mois reels varient de 28 a 31 jours. La valeur de 30 jours est une approximation standard pour les conversions generales. La moyenne exacte est de 30,44 jours (365,25/12). Pour des calculs de dates exacts, travaillez sur des dates calendaires plutot que sur des conversions d'unites.",
                },
                {
                  question: "Combien d'heures de travail dans une annee en France ?",
                  answer:
                    "Duree legale = 35h/semaine. Sur 52 semaines : 1 820 heures. En deduisant 5 semaines de conges payes et environ 8 jours feries, on obtient 1 607 heures de travail effectif par an, c'est la base utilisee par le Code du travail et l'URSSAF.",
                },
                {
                  question: "Comment convertir un timestamp Unix en duree lisible ?",
                  answer:
                    "Un timestamp Unix est un nombre de secondes ecoulees depuis le 1er janvier 1970 UTC. Pour le convertir en duree, divisez par 86 400 pour obtenir des jours, ou utilisez la decomposition humaine (annees, jours, heures, minutes, secondes). Le timestamp 1 700 000 000 correspond au 14 novembre 2023.",
                },
                {
                  question: "Quelle est la duree exacte d'une annee bissextile ?",
                  answer:
                    "Une annee bissextile compte 366 jours = 8 784 heures = 31 622 400 secondes. Elle se produit tous les 4 ans, sauf les annees seculaires non divisibles par 400 (donc 2000 etait bissextile mais 1900 ne l'etait pas). Cette regle compense le fait qu'une annee astronomique fait 365,2425 jours.",
                },
                {
                  question: "Comment representer une duree au format ISO 8601 ?",
                  answer:
                    "Le format ISO 8601 duration commence par P puis liste les composantes : P[n]Y[n]M[n]DT[n]H[n]M[n]S. Exemple : 2 jours 3 heures 15 minutes = P2DT3H15M. 1 an 6 mois = P1Y6M. Ce format est utilise par les API REST, les flux RSS de podcasts et les schemas Schema.org.",
                },
                {
                  question: "Mes calculs sont-ils confidentiels ?",
                  answer:
                    "Oui. Toutes les conversions sont effectuees localement dans votre navigateur. Aucune valeur saisie n'est envoyee a un serveur. L'outil fonctionne sans inscription, sans cookie de tracking et sans connexion internet active une fois la page chargee.",
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
