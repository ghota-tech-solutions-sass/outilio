"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const MILESTONES = [
  { week: 6, label: "Le cœur commence à battre" },
  { week: 8, label: "Premiers mouvements (non ressentis)" },
  { week: 12, label: "Échographie du 1er trimestre (datation)" },
  { week: 16, label: "Le sexe peut être déterminé" },
  { week: 20, label: "Mouvements ressentis par la maman" },
  { week: 22, label: "Échographie morphologique" },
  { week: 24, label: "Viabilité du bébé" },
  { week: 28, label: "Début du 3e trimestre" },
  { week: 32, label: "Échographie de croissance" },
  { week: 37, label: "Bébé à terme" },
  { week: 40, label: "Date prévue d'accouchement (Naegele)" },
  { week: 41, label: "Terme à 41 SA (convention souvent retenue en France)" },
];

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDays(a: Date, b: Date): number {
  // Dates a minuit local : Math.round absorbe le decalage d'une heure lors des changements d'heure
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function parseLocalDate(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return isNaN(d.getTime()) ? null : d;
}

function toInputDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function CalculateurGrossesse() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const defaultDate = addDays(today, -56); // ~8 weeks ago
  const [lmp, setLmp] = useState(toInputDate(defaultDate));

  const lmpDate = parseLocalDate(lmp) ?? defaultDate;
  const dueDate = addDays(lmpDate, 280);
  const daysPregnant = diffDays(lmpDate, today);
  const weeksPregnant = Math.floor(Math.max(0, daysPregnant) / 7); // DDR future : 0 s 0 j
  const daysExtra = Math.max(0, daysPregnant) % 7;
  // Trimestres en SA : T1 jusqu'a 14 SA + 6 j, T2 de 15 a 27 SA + 6 j, T3 a partir de 28 SA
  const trimester = weeksPregnant < 15 ? 1 : weeksPregnant < 28 ? 2 : 3;
  const progress = Math.min(100, Math.max(0, (daysPregnant / 280) * 100));
  const daysRemaining = diffDays(today, dueDate);

  const conceptionDate = addDays(lmpDate, 14);
  const terme41 = addDays(lmpDate, 287);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Santé</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Grossesse</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre date prévue d&apos;accouchement, votre nombre de semaines d&apos;aménorrhée
            (SA), votre trimestre et suivez les étapes clés de votre grossesse à partir de la règle de
            Naegele. Outil indicatif, sans inscription. Le suivi médical reste indispensable.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date des dernières règles</label>
              <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Date prévue d&apos;accouchement</p>
              <p className="mt-3 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {formatDate(dueDate)}
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Date estimée de conception : {formatDate(conceptionDate)}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Terme à 41 SA (convention souvent retenue en France) : {formatDate(terme41)}
              </p>
            </div>

            {/* Progress */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {weeksPregnant}<span className="text-lg">s</span> {daysExtra}<span className="text-lg">j</span>
                  </p>
                  <p className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>Semaines d&apos;aménorrhée (SA)</p>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                    {trimester}<span className="text-lg">e</span>
                  </p>
                  <p className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>Trimestre</p>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: daysRemaining < 0 ? "#dc2626" : "var(--primary)" }}>
                    {Math.max(0, daysRemaining)}
                  </p>
                  <p className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>Jours restants</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-medium" style={{ color: "var(--muted)" }}>
                  <span>Début</span>
                  <span>{progress.toFixed(0)}%</span>
                  <span>Accouchement</span>
                </div>
                <div className="mt-2 h-4 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Étapes clés</h2>
              <div className="mt-4 space-y-3">
                {MILESTONES.map((m) => {
                  const mDate = addDays(lmpDate, m.week * 7);
                  const passed = today >= mDate;
                  return (
                    <div key={m.week} className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ background: passed ? "var(--primary)" : "var(--border)" }} />
                      <span className="w-16 text-sm font-bold" style={{ color: passed ? "var(--primary)" : "var(--muted)" }}>SA {m.week}</span>
                      <span className="text-sm" style={{ color: passed ? "var(--foreground)" : "var(--muted)" }}>{m.label}</span>
                      <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>{mDate.toLocaleDateString("fr-FR")}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className="rounded-2xl border p-6"
              style={{ background: "rgba(232, 150, 62, 0.08)", borderColor: "var(--accent)" }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                <strong>Information importante.</strong> Cet outil fournit une estimation indicative
                basée sur la règle de Naegele. Il ne remplace en aucun cas le suivi médical de votre
                sage-femme, gynécologue ou obstétricien. La date précise est confirmée par
                l&apos;échographie de datation entre la 11e et la 13e semaine d&apos;aménorrhée.
              </p>
            </div>

            <ToolHowToSection
              title="Comment calculer votre date d'accouchement"
              description="Le calcul repose sur la règle de Naegele (DDR + 280 jours, soit 40 SA), référence internationale. En France, le terme est souvent fixé à 41 SA : les deux dates sont affichées."
              steps={[
                {
                  name: "Identifier la date du premier jour des dernières règles",
                  text:
                    "Notez précisément le premier jour de votre dernier cycle menstruel (DDR). Cette date sert de point de départ pour tout le calcul. Si vos cycles sont irréguliers, l'échographie de datation prévaudra.",
                },
                {
                  name: "Saisir la date dans le calculateur",
                  text:
                    "Cliquez sur le champ 'Date des dernières règles' et sélectionnez la date dans le calendrier. Le calcul est instantané.",
                },
                {
                  name: "Lire les indicateurs clés",
                  text:
                    "Le calculateur affiche : la date prévue d'accouchement (DPA), la date estimée de conception (J+14 en cycle de 28 jours), votre nombre de semaines de grossesse en SA, le trimestre en cours et les jours restants jusqu'à la DPA.",
                },
                {
                  name: "Suivre les étapes clés (milestones)",
                  text:
                    "Le calendrier des étapes liste les rendez-vous médicaux importants : échographie de datation (12 SA), morphologique (22 SA), de croissance (32 SA) et la naissance prévue (40 SA selon Naegele, 41 SA selon la convention française). Ces dates sont indicatives, votre suivi médical les précisera.",
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
                À savoir sur le calcul de la grossesse
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Semaines d&apos;aménorrhée (SA) vs semaines de grossesse (SG).</strong> En
                  France, le suivi médical s&apos;exprime en SA, qui comptent à partir du premier jour
                  des dernières règles. Les SG, parfois utilisées à l&apos;international, comptent depuis
                  la conception (donc SG = SA - 2). Ce calculateur utilise les SA, conformément à la
                  pratique française.
                </p>
                <p>
                  <strong>Règle de Naegele.</strong> Formule mise au point au 19e siècle :
                  DPA = DDR + 280 jours. Elle suppose un cycle régulier de 28 jours et une ovulation au
                  14e jour. Pour des cycles plus longs ou plus courts, l&apos;estimation est ajustée par
                  l&apos;échographie de datation. En France, le terme est souvent fixé à 41 SA
                  (DDR + 287 jours) ; la durée réelle de gestation varie entre 280 et 290 jours.
                </p>
                <p>
                  <strong>Les 5 % de bébés nés à la DPA.</strong> Seulement 5 % environ des naissances
                  ont lieu exactement le jour prévu. Le terme va de 37 SA (terme précoce) à 42 SA (post
                  terme), avec un pic autour de 40 SA. Après 41 SA, un suivi rapproché est mis en place.
                </p>
                <p>
                  <strong>Les 3 échographies recommandées en France.</strong> Échographie de datation
                  (11-13 SA) pour confirmer la DPA et détecter les anomalies précoces. Échographie
                  morphologique (20-22 SA) pour examen détaillé des organes. Échographie de croissance
                  (30-32 SA) pour évaluer la position du bébé et la croissance.
                </p>
                <p>
                  <strong>Sources médicales de référence.</strong> Haute Autorité de Santé (HAS), Collège
                  National des Gynécologues et Obstétriciens Français (CNGOF), Santé publique France.
                  Ce calculateur ne remplace pas le suivi prénatal et n&apos;a pas vocation à poser ou
                  exclure un diagnostic.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posées par les futurs parents sur le calcul de la grossesse."
              items={[
                {
                  question: "Que signifie SA et combien de semaines dure une grossesse ?",
                  answer:
                    "SA signifie 'Semaines d'Aménorrhée' : on compte depuis le premier jour des dernières règles. Une grossesse à terme va de 37 à 42 SA, soit environ 9 mois. Le calcul de Naegele place la DPA à 40 SA exactement ; en France, le terme est souvent fixé à 41 SA.",
                },
                {
                  question: "Mon cycle est irrégulier, le calcul reste-t-il valable ?",
                  answer:
                    "Le calcul basé sur la règle de Naegele suppose un cycle régulier de 28 jours. Si vos cycles sont plus longs ou irréguliers, la date estimée sera moins fiable. C'est l'échographie de datation, réalisée entre 11 et 13 SA, qui fixera la DPA officielle.",
                },
                {
                  question: "Qu'est-ce que la date estimée de conception ?",
                  answer:
                    "Sous l'hypothèse d'un cycle de 28 jours, l'ovulation a lieu environ au 14e jour. La conception est donc estimée à DDR + 14 jours. C'est une estimation, la fenêtre fertile s'étale en réalité sur plusieurs jours autour de l'ovulation.",
                },
                {
                  question: "Pourquoi ma DPA diffère-t-elle de celle de mon médecin ?",
                  answer:
                    "Le calculateur utilise la règle de Naegele de base. Votre professionnel de santé peut ajuster la DPA selon votre cycle réel, l'échographie de datation ou la longueur cranio-caudale du fœtus. Faites toujours confiance à la date donnée par votre suivi médical.",
                },
                {
                  question: "À quel moment l'échographie de datation est-elle réalisée ?",
                  answer:
                    "L'échographie de datation est en général réalisée entre 11 SA et 13 SA + 6 jours. Elle confirme la DPA, détecte d'éventuelles grossesses gémellaires et constitue le 1er bilan de dépistage prénatal (mesure de la clarté nucale).",
                },
                {
                  question: "Quels sont les rendez-vous médicaux remboursables en France ?",
                  answer:
                    "Le suivi prénatal comprend 7 consultations mensuelles obligatoires, 3 échographies (12, 22, 32 SA) prises en charge à 100 % par l'Assurance maladie, et la préparation à la naissance (8 séances remboursées). Le tout est suivi par sage-femme, médecin généraliste ou gynécologue.",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. Toutes les dates sont calculées localement dans votre navigateur. Aucune information n'est envoyée à un serveur, aucune donnée personnelle n'est stockée. Le calculateur fonctionne sans inscription.",
                },
                {
                  question: "Peut-on calculer la grossesse pour une FIV ou une PMA ?",
                  answer:
                    "Pour une FIV avec transfert d'embryon, le calcul standard est moins adapté. La date à retenir dépend du type de transfert (J3, J5, blastocyste). Demandez à votre centre de PMA la date théorique de DDR équivalente, ou utilisez plutôt l'échographie de datation comme référence.",
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
