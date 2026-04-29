"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

function toInputDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function parseDate(s: string): Date | null {
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function getZodiacSign(month: number, day: number): { sign: string; symbol: string } {
  const signs = [
    { sign: "Capricorne", symbol: "♑", start: [1, 1], end: [1, 19] },
    { sign: "Verseau", symbol: "♒", start: [1, 20], end: [2, 18] },
    { sign: "Poissons", symbol: "♓", start: [2, 19], end: [3, 20] },
    { sign: "Belier", symbol: "♈", start: [3, 21], end: [4, 19] },
    { sign: "Taureau", symbol: "♉", start: [4, 20], end: [5, 20] },
    { sign: "Gemeaux", symbol: "♊", start: [5, 21], end: [6, 20] },
    { sign: "Cancer", symbol: "♋", start: [6, 21], end: [7, 22] },
    { sign: "Lion", symbol: "♌", start: [7, 23], end: [8, 22] },
    { sign: "Vierge", symbol: "♍", start: [8, 23], end: [9, 22] },
    { sign: "Balance", symbol: "♎", start: [9, 23], end: [10, 22] },
    { sign: "Scorpion", symbol: "♏", start: [10, 23], end: [11, 21] },
    { sign: "Sagittaire", symbol: "♐", start: [11, 22], end: [12, 21] },
    { sign: "Capricorne", symbol: "♑", start: [12, 22], end: [12, 31] },
  ];
  for (const s of signs) {
    const afterStart = month > s.start[0] || (month === s.start[0] && day >= s.start[1]);
    const beforeEnd = month < s.end[0] || (month === s.end[0] && day <= s.end[1]);
    if (afterStart && beforeEnd) return { sign: s.sign, symbol: s.symbol };
  }
  return { sign: "Capricorne", symbol: "♑" };
}

function getDayOfWeek(d: Date): string {
  return d.toLocaleDateString("fr-FR", { weekday: "long" });
}

export default function CalculateurAge() {
  const [birthDate, setBirthDate] = useState("1990-01-15");

  const results = useMemo(() => {
    const birth = parseDate(birthDate);
    if (!birth) return null;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Exact age in years, months, days
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Total days lived
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const nextAge = nextBirthday.getFullYear() - birth.getFullYear();
    const isBirthdayToday = today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();

    // Zodiac
    const zodiac = getZodiacSign(birth.getMonth() + 1, birth.getDate());
    const bornDay = getDayOfWeek(birth);

    return {
      years, months, days,
      totalDays, totalWeeks, totalMonths, totalHours,
      daysUntilBirthday, nextAge, isBirthdayToday,
      zodiac, bornDay,
    };
  }, [birthDate]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Outils</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur d{"'"}<span style={{ color: "var(--primary)" }}>age</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre age exact et decouvrez le decompte avant votre prochain anniversaire.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Date de naissance</h2>
              <div className="mt-4">
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-xl border px-4 py-3 text-lg" style={{ borderColor: "var(--border)" }} />
              </div>
            </div>

            {results && (
              <>
                {/* Main result */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Votre age</h2>
                  <div className="mt-4 flex items-baseline gap-3 text-center justify-center">
                    <div>
                      <span className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{results.years}</span>
                      <span className="ml-1 text-sm" style={{ color: "var(--muted)" }}>an{results.years > 1 ? "s" : ""}</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{results.months}</span>
                      <span className="ml-1 text-sm" style={{ color: "var(--muted)" }}>mois</span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{results.days}</span>
                      <span className="ml-1 text-sm" style={{ color: "var(--muted)" }}>jour{results.days > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Statistiques</h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatBox label="Jours vecus" value={results.totalDays.toLocaleString("fr-FR")} />
                    <StatBox label="Semaines vecues" value={results.totalWeeks.toLocaleString("fr-FR")} />
                    <StatBox label="Mois vecus" value={results.totalMonths.toLocaleString("fr-FR")} />
                    <StatBox label="Heures vecues" value={results.totalHours.toLocaleString("fr-FR")} />
                  </div>
                </div>

                {/* Next birthday */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Prochain anniversaire</h2>
                  <div className="mt-4 text-center">
                    {results.isBirthdayToday ? (
                      <div>
                        <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                          Joyeux anniversaire !
                        </p>
                        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>Vous fêtez aujourd{"'"}hui vos {results.years} ans</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                          {results.daysUntilBirthday}
                        </p>
                        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                          jour{results.daysUntilBirthday > 1 ? "s" : ""} avant vos {results.nextAge} ans
                        </p>
                        <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                          <div className="h-full rounded-full" style={{
                            width: `${((365 - results.daysUntilBirthday) / 365) * 100}%`,
                            background: "var(--accent)",
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fun facts */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations</h2>
                  <div className="mt-4 space-y-2">
                    <InfoRow label="Ne(e) un" value={`${results.bornDay} (${new Date(birthDate + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })})`} />
                    <InfoRow label="Signe astrologique" value={`${results.zodiac.symbol} ${results.zodiac.sign}`} />
                    <InfoRow label="Generation" value={getGeneration(new Date(birthDate + "T00:00:00").getFullYear())} />
                  </div>
                </div>
              </>
            )}

            <ToolHowToSection
              title="Comment utiliser le calculateur d&apos;age"
              description="Calculez votre age exact au jour pres, le decompte avant votre prochain anniversaire, votre signe astrologique et votre generation, en saisissant simplement une date de naissance."
              steps={[
                {
                  name: "Saisir la date de naissance",
                  text:
                    "Cliquez dans le champ date et selectionnez le jour, mois et annee de naissance. Le calendrier supporte les dates des annees 1900 a aujourd&apos;hui. Le calcul est instantane, sans bouton de validation a presser.",
                },
                {
                  name: "Lire l'age exact en annees, mois, jours",
                  text:
                    "Le bloc principal affiche l&apos;age decompose : par exemple 33 ans, 8 mois et 14 jours. C&apos;est la representation la plus precise, utilisable pour des dossiers administratifs ou medicaux qui exigent l&apos;age au jour pres (RH, securite sociale, dossiers MDPH).",
                },
                {
                  name: "Consulter les statistiques et le decompte d'anniversaire",
                  text:
                    "Sous le bloc principal, retrouvez le total de jours, semaines, mois et heures vecus, le nombre de jours avant votre prochain anniversaire avec barre de progression, votre signe astrologique calcule sur la base solaire occidentale et votre generation (Z, Millennials, X, Boomers).",
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
                Cas d&apos;usage du calculateur d&apos;age
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Verifier une majorite ou un age legal
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Majorite civile : 18 ans. Permis de conduire : 17 ans pour la conduite
                    accompagnee, 18 ans pour la categorie B. Vente d&apos;alcool : 18 ans en
                    France. Vote : 18 ans. Le calculateur affiche l&apos;age exact au jour pres,
                    indispensable pour eviter les erreurs administratives sur les dossiers
                    soumis a une condition d&apos;age.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Service RH et anciennete
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Calcul de l&apos;anciennete d&apos;un salarie depuis sa date d&apos;entree
                    pour les primes, le 13e mois ou le calcul des indemnites. Pour la retraite,
                    62 ans actuellement (64 ans progressivement). Pour le compte AGIRC-ARRCO :
                    repere des age cle pour estimer la pension.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Famille et garde d&apos;enfants
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Inscription scolaire : age de 3 ans au 31 decembre pour la maternelle.
                    Permis pieton : 8 ans. Premier velo sur la route : 12 ans (avec parents
                    avant). Pour les vaccinations obligatoires (11 a 24 mois selon le type),
                    l&apos;age en mois est crucial : le calculateur le donne au jour pres.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Genealogie et histoire familiale
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour reconstituer un arbre genealogique, l&apos;age de l&apos;ancetre au
                    moment d&apos;un evenement (naissance d&apos;enfant, mariage, deces) eclaire
                    les contextes : un anetre marie a 16 ans pre-1939 etait courant. Le
                    calculateur facilite la datation des actes d&apos;etat civil et la coherence
                    chronologique des donnees.
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
                A savoir sur le calcul d&apos;age
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Le 29 fevrier pose un cas particulier.</strong> Une personne nee le
                  29 fevrier (annee bissextile) ne fete legalement son anniversaire que tous les
                  4 ans. En droit francais, son age augmente neanmoins chaque annee, mais
                  l&apos;anniversaire calendaire est generalement reporte au 28 fevrier (parfois
                  au 1er mars selon les traditions familiales). Le calculateur applique la regle
                  legale : age incremente le 1er mars des annees non bissextiles.
                </p>
                <p>
                  <strong>Les annees bissextiles ne sont pas tous les 4 ans.</strong> La regle
                  est : divisible par 4 sauf les annees seculaires non divisibles par 400. Donc
                  2000 et 2400 sont bissextiles, mais pas 1900, 2100, 2200, 2300. Sur une vie
                  humaine, cela impacte le total exact de jours vecus de quelques unites. Le
                  calculateur applique automatiquement cette regle.
                </p>
                <p>
                  <strong>Age legal de la retraite en France.</strong> Reforme 2023 : passage
                  progressif de 62 a 64 ans pour les nouveaux retraites (66 ans pour le taux
                  plein automatique sans decote). Pour les nes apres 1968 : 64 ans. Le
                  calculateur permet de visualiser combien de mois ou jours vous separent de la
                  date de depart en retraite a taux plein, en saisissant la date de naissance
                  ou d&apos;entree dans la vie active.
                </p>
                <p>
                  <strong>Generations sociologiques.</strong> Boomers : 1946-1964. Generation
                  X : 1965-1980. Millennials (Y) : 1981-1996. Generation Z : 1997-2012.
                  Generation Alpha : a partir de 2013. Ces decoupages americains sont des
                  reperes marketing et culturels, pas des regles legales. Ils sont utilises en
                  RH, en pub et en analyse societale pour caracteriser des comportements.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur le calcul d'age."
              items={[
                {
                  question: "Comment calcule-t-on l'age en annees, mois et jours ?",
                  answer:
                    "On soustrait l'annee de naissance de l'annee actuelle. Si la date du jour est avant l'anniversaire de l'annee en cours, on retranche 1. Pour les mois et jours : on calcule la difference depuis le dernier anniversaire jusqu'a aujourd'hui. Le calculateur applique automatiquement cette logique en tenant compte des mois de 28 a 31 jours.",
                },
                {
                  question: "Comment fonctionne le calcul pour quelqu'un ne le 29 fevrier ?",
                  answer:
                    "En droit francais, l'age incremente chaque annee meme sans 29 fevrier. L'anniversaire est conventionnellement reporte au 28 fevrier (parfois au 1er mars selon les familles). Le calculateur applique la regle legale : age augmente le 1er mars des annees non bissextiles. Exemple : ne le 29/02/2000, vous avez officiellement 24 ans le 1er mars 2024.",
                },
                {
                  question: "Quel est l'age de la majorite en France ?",
                  answer:
                    "18 ans pour la majorite civile (vote, contrats, mariage sans autorisation, achat d'alcool). Majorite penale : 18 ans (avec attenuations possibles entre 16 et 18). Majorite sexuelle : 15 ans (consentement). Le calculateur donne l'age au jour pres, indispensable pour les dossiers ou le statut bascule a une date precise.",
                },
                {
                  question: "Comment calculer l'age de la retraite en France ?",
                  answer:
                    "Reforme 2023 : passage progressif de 62 a 64 ans (Loi du 14 avril 2023). Pour les nes apres 1968 : 64 ans. Pour le taux plein automatique : 67 ans. Pour les carrieres longues (debut avant 21 ans) : 60-63 ans selon les trimestres cotises. Le compte info-retraite.fr donne une estimation personnalisee.",
                },
                {
                  question: "Pourquoi mon age en jours est-il different de 365 x mon age en annees ?",
                  answer:
                    "Parce que les annees bissextiles ajoutent un jour tous les 4 ans (avec exceptions seculaires). Sur 30 ans, environ 7 a 8 annees sont bissextiles, soit 7-8 jours en plus. Le total exact se calcule en jours calendaires entre la date de naissance et aujourd'hui, ce que fait le calculateur.",
                },
                {
                  question: "A quoi sert le signe astrologique calcule ?",
                  answer:
                    "Le calculateur affiche le signe astrologique solaire occidental, base sur la position du Soleil dans le zodiaque a la naissance. Belier (21/3 - 19/4), Taureau (20/4 - 20/5), etc. C'est une information culturelle et ludique, sans valeur scientifique. L'astrologie chinoise (signe annuel) ou vedique utilise des regles differentes.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui. La date de naissance saisie reste dans votre navigateur et n'est envoyee a aucun serveur. Le calcul est effectue 100 % localement en JavaScript. Aucun cookie de tracking n'est utilise. La page peut fonctionner hors connexion une fois chargee.",
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function getGeneration(year: number): string {
  if (year >= 2013) return "Generation Alpha (2013+)";
  if (year >= 1997) return "Generation Z (1997-2012)";
  if (year >= 1981) return "Millennials (1981-1996)";
  if (year >= 1965) return "Generation X (1965-1980)";
  if (year >= 1946) return "Baby Boomers (1946-1964)";
  return "Generation silencieuse (avant 1946)";
}
