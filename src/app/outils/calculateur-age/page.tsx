"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

function parseDate(s: string): Date | null {
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function getZodiacSign(month: number, day: number): { sign: string; symbol: string } {
  const signs = [
    { sign: "Capricorne", symbol: "♑", start: [1, 1], end: [1, 19] },
    { sign: "Verseau", symbol: "♒", start: [1, 20], end: [2, 18] },
    { sign: "Poissons", symbol: "♓", start: [2, 19], end: [3, 20] },
    { sign: "Bélier", symbol: "♈", start: [3, 21], end: [4, 19] },
    { sign: "Taureau", symbol: "♉", start: [4, 20], end: [5, 20] },
    { sign: "Gémeaux", symbol: "♊", start: [5, 21], end: [6, 20] },
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
    if (birth > today) return null;

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
    // Math.round : absorbe le décalage d'une heure du changement d'heure
    const totalDays = Math.round((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) {
      nextBirthday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.round((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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
            Calculateur d{"'"}<span style={{ color: "var(--primary)" }}>âge</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre âge exact et découvrez le décompte avant votre prochain anniversaire.
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
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Votre âge</h2>
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
                    <StatBox label="Jours vécus" value={results.totalDays.toLocaleString("fr-FR")} />
                    <StatBox label="Semaines vécues" value={results.totalWeeks.toLocaleString("fr-FR")} />
                    <StatBox label="Mois vécus" value={results.totalMonths.toLocaleString("fr-FR")} />
                    <StatBox label="Heures vécues" value={results.totalHours.toLocaleString("fr-FR")} />
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
                    <InfoRow label="Né(e) un" value={`${results.bornDay} (${new Date(birthDate + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })})`} />
                    <InfoRow label="Signe astrologique" value={`${results.zodiac.symbol} ${results.zodiac.sign}`} />
                    <InfoRow label="Génération" value={getGeneration(new Date(birthDate + "T00:00:00").getFullYear())} />
                  </div>
                </div>
              </>
            )}

            <ToolHowToSection
              title="Comment utiliser le calculateur d&apos;âge"
              description="Calculez votre âge exact au jour près, le décompte avant votre prochain anniversaire, votre signe astrologique et votre génération, en saisissant simplement une date de naissance."
              steps={[
                {
                  name: "Saisir la date de naissance",
                  text:
                    "Cliquez dans le champ date et sélectionnez le jour, mois et année de naissance. Le calendrier supporte les dates des années 1900 à aujourd'hui. Le calcul est instantané, sans bouton de validation à presser.",
                },
                {
                  name: "Lire l'âge exact en années, mois, jours",
                  text:
                    "Le bloc principal affiche l'âge décomposé : par exemple 33 ans, 8 mois et 14 jours. C'est la représentation la plus précise, utilisable pour des dossiers administratifs ou médicaux qui exigent l'âge au jour près (RH, sécurité sociale, dossiers MDPH).",
                },
                {
                  name: "Consulter les statistiques et le décompte d'anniversaire",
                  text:
                    "Sous le bloc principal, retrouvez le total de jours, semaines, mois et heures vécus, le nombre de jours avant votre prochain anniversaire avec barre de progression, votre signe astrologique calculé sur la base solaire occidentale et votre génération (Z, Millennials, X, Boomers).",
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
                Cas d&apos;usage du calculateur d&apos;âge
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Vérifier une majorité ou un âge légal
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Majorité civile : 18 ans. Permis de conduire : 17 ans pour la conduite
                    accompagnée, 18 ans pour la catégorie B. Vente d&apos;alcool : 18 ans en
                    France. Vote : 18 ans. Le calculateur affiche l&apos;âge exact au jour près,
                    indispensable pour éviter les erreurs administratives sur les dossiers
                    soumis à une condition d&apos;âge.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Service RH et ancienneté
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Calcul de l&apos;ancienneté d&apos;un salarié depuis sa date d&apos;entrée
                    pour les primes, le 13e mois ou le calcul des indemnités. Pour la retraite,
                    l&apos;âge légal va de 62 ans et 9 mois à 64 ans selon la génération. Pour le compte
                    AGIRC-ARRCO : repère des âges clés pour estimer la pension.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Famille et garde d&apos;enfants
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Inscription scolaire : âge de 3 ans au 31 décembre pour la maternelle.
                    Permis piéton : 8 ans. Premier vélo sur la route : 12 ans (avec parents
                    avant). Pour les vaccinations obligatoires (11 à 24 mois selon le type),
                    l&apos;âge en mois est crucial : le calculateur le donne au jour près.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Généalogie et histoire familiale
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour reconstituer un arbre généalogique, l&apos;âge de l&apos;ancêtre au
                    moment d&apos;un événement (naissance d&apos;enfant, mariage, décès) éclaire
                    les contextes : un ancêtre marié à 16 ans pré-1939 était courant. Le
                    calculateur facilite la datation des actes d&apos;état civil et la cohérence
                    chronologique des données.
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
                À savoir sur le calcul d&apos;âge
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Le 29 février pose un cas particulier.</strong> Une personne née le
                  29 février (année bissextile) ne fête légalement son anniversaire que tous les
                  4 ans. En droit français, son âge augmente néanmoins chaque année, mais
                  l&apos;anniversaire calendaire est généralement reporté au 28 février (parfois
                  au 1er mars selon les traditions familiales). Le calculateur applique la règle
                  légale : âge incrémenté le 1er mars des années non bissextiles.
                </p>
                <p>
                  <strong>Les années bissextiles ne sont pas tous les 4 ans.</strong> La règle
                  est : divisible par 4 sauf les années séculaires non divisibles par 400. Donc
                  2000 et 2400 sont bissextiles, mais pas 1900, 2100, 2200, 2300. Sur une vie
                  humaine, cela impacte le total exact de jours vécus de quelques unités. Le
                  calculateur applique automatiquement cette règle.
                </p>
                <p>
                  <strong>Âge légal de la retraite en France.</strong> La réforme de 2023 relève
                  l&apos;âge légal de 62 à 64 ans ; la LFSS 2026 a suspendu ce relèvement jusqu&apos;en
                  2028 (62 ans et 9 mois pour les personnes nées en 1964, puis 3 mois de plus par
                  génération). Pour les personnes nées à partir de 1969 : 64 ans. Le taux plein
                  automatique sans décote reste à 67 ans. Le
                  calculateur permet de visualiser combien de mois ou jours vous séparent de la
                  date de départ en retraite à taux plein, en saisissant la date de naissance
                  ou d&apos;entrée dans la vie active.
                </p>
                <p>
                  <strong>Générations sociologiques.</strong> Boomers : 1946-1964. Génération
                  X : 1965-1980. Millennials (Y) : 1981-1996. Génération Z : 1997-2012.
                  Génération Alpha : à partir de 2013. Ces découpages américains sont des
                  repères marketing et culturels, pas des règles légales. Ils sont utilisés en
                  RH, en pub et en analyse sociétale pour caractériser des comportements.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posées sur le calcul d'âge."
              items={[
                {
                  question: "Comment calcule-t-on l'âge en années, mois et jours ?",
                  answer:
                    "On soustrait l'année de naissance de l'année actuelle. Si la date du jour est avant l'anniversaire de l'année en cours, on retranche 1. Pour les mois et jours : on calcule la différence depuis le dernier anniversaire jusqu'à aujourd'hui. Le calculateur applique automatiquement cette logique en tenant compte des mois de 28 à 31 jours.",
                },
                {
                  question: "Comment fonctionne le calcul pour quelqu'un né le 29 février ?",
                  answer:
                    "En droit français, l'âge incrémente chaque année même sans 29 février. L'anniversaire est conventionnellement reporté au 28 février ou au 1er mars selon les usages. Le calculateur retient le 1er mars : l'âge augmente le 1er mars des années non bissextiles. Exemple : né le 29/02/2000, vous avez 25 ans le 1er mars 2025 (2025 n'étant pas bissextile).",
                },
                {
                  question: "Quel est l'âge de la majorité en France ?",
                  answer:
                    "18 ans pour la majorité civile (vote, contrats, mariage sans autorisation, achat d'alcool). Majorité pénale : 18 ans (avec atténuations possibles entre 16 et 18). Majorité sexuelle : 15 ans (consentement). Le calculateur donne l'âge au jour près, indispensable pour les dossiers où le statut bascule à une date précise.",
                },
                {
                  question: "Comment calculer l'âge de la retraite en France ?",
                  answer:
                    "Réforme 2023 : passage progressif de 62 à 64 ans (Loi du 14 avril 2023), suspendu par la LFSS 2026 : pour les pensions prenant effet depuis le 1er septembre 2026, l'âge légal est de 62 ans et 9 mois pour les personnes nées en 1964 (et de janvier à mars 1965), 63 ans pour celles nées d'avril à décembre 1965, 63 ans et 3 mois pour 1966, 63 ans et 6 mois pour 1967, 63 ans et 9 mois pour 1968, puis 64 ans à partir de la génération 1969. Pour le taux plein automatique : 67 ans. Pour les carrières longues : départ anticipé possible selon l'âge de début d'activité et les trimestres cotisés. Le compte info-retraite.fr donne une estimation personnalisée.",
                },
                {
                  question: "Pourquoi mon âge en jours est-il différent de 365 x mon âge en années ?",
                  answer:
                    "Parce que les années bissextiles ajoutent un jour tous les 4 ans (avec exceptions séculaires). Sur 30 ans, environ 7 à 8 années sont bissextiles, soit 7-8 jours en plus. Le total exact se calcule en jours calendaires entre la date de naissance et aujourd'hui, ce que fait le calculateur.",
                },
                {
                  question: "À quoi sert le signe astrologique calculé ?",
                  answer:
                    "Le calculateur affiche le signe astrologique solaire occidental, basé sur la position du Soleil dans le zodiaque à la naissance. Bélier (21/3 - 19/4), Taureau (20/4 - 20/5), etc. C'est une information culturelle et ludique, sans valeur scientifique. L'astrologie chinoise (signe annuel) ou védique utilise des règles différentes.",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. La date de naissance saisie reste dans votre navigateur et n'est envoyée à aucun serveur. Le calcul est effectué 100 % localement en JavaScript. Aucun cookie de tracking n'est utilisé. La page peut fonctionner hors connexion une fois chargée.",
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
  if (year >= 2013) return "Génération Alpha (2013+)";
  if (year >= 1997) return "Génération Z (1997-2012)";
  if (year >= 1981) return "Millennials (1981-1996)";
  if (year >= 1965) return "Génération X (1965-1980)";
  if (year >= 1946) return "Baby Boomers (1946-1964)";
  return "Génération silencieuse (avant 1946)";
}
