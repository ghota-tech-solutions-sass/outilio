"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const MILESTONES = [
  { week: 4, label: "Le coeur commence a battre" },
  { week: 8, label: "Premiers mouvements (non ressentis)" },
  { week: 12, label: "Fin du 1er trimestre - Echographie de datation" },
  { week: 16, label: "Le sexe peut etre determine" },
  { week: 20, label: "Mouvements ressentis par la maman" },
  { week: 22, label: "Echographie morphologique" },
  { week: 24, label: "Viabilite du bebe" },
  { week: 28, label: "Debut du 3e trimestre" },
  { week: 32, label: "Echographie de croissance" },
  { week: 37, label: "Bebe a terme" },
  { week: 40, label: "Date prevue d'accouchement" },
];

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDays(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function CalculateurGrossesse() {
  const today = new Date();
  const defaultDate = new Date(today);
  defaultDate.setDate(defaultDate.getDate() - 56); // ~8 weeks ago
  const [lmp, setLmp] = useState(defaultDate.toISOString().slice(0, 10));

  const lmpDate = new Date(lmp);
  const dueDate = addDays(lmpDate, 280);
  const daysPregnant = diffDays(lmpDate, today);
  const weeksPregnant = Math.floor(daysPregnant / 7);
  const daysExtra = daysPregnant % 7;
  const trimester = weeksPregnant < 13 ? 1 : weeksPregnant < 27 ? 2 : 3;
  const progress = Math.min(100, Math.max(0, (daysPregnant / 280) * 100));
  const daysRemaining = diffDays(today, dueDate);

  const conceptionDate = addDays(lmpDate, 14);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Sante</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Grossesse</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre date prevue d&apos;accouchement, votre nombre de semaines d&apos;amenorrhee
            (SA), votre trimestre et suivez les etapes cles de votre grossesse a partir de la regle de
            Naegele. Outil indicatif, sans inscription. Le suivi medical reste indispensable.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date des dernieres regles</label>
              <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Date prevue d&apos;accouchement</p>
              <p className="mt-3 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {formatDate(dueDate)}
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Date estimee de conception : {formatDate(conceptionDate)}
              </p>
            </div>

            {/* Progress */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {weeksPregnant}<span className="text-lg">s</span> {daysExtra}<span className="text-lg">j</span>
                  </p>
                  <p className="mt-1 text-xs font-medium" style={{ color: "var(--muted)" }}>Semaines de grossesse</p>
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
                  <span>Debut</span>
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
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Etapes cles</h2>
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
                basee sur la regle de Naegele. Il ne remplace en aucun cas le suivi medical de votre
                sage-femme, gynecologue ou obstetricien. La date precise est confirmee par
                l&apos;echographie de datation entre la 11e et la 13e semaine d&apos;amenorrhee.
              </p>
            </div>

            <ToolHowToSection
              title="Comment calculer votre date d'accouchement"
              description="Le calcul repose sur la regle de Naegele, methode standard utilisee par les professionnels de sante en France et a l'international."
              steps={[
                {
                  name: "Identifier la date du premier jour des dernieres regles",
                  text:
                    "Notez precisement le premier jour de votre dernier cycle menstruel (DDR). Cette date sert de point de depart pour tout le calcul. Si vos cycles sont irreguliers, l'echographie de datation prevaudra.",
                },
                {
                  name: "Saisir la date dans le calculateur",
                  text:
                    "Cliquez sur le champ 'Date des dernieres regles' et selectionnez la date dans le calendrier. Le calcul est instantane.",
                },
                {
                  name: "Lire les indicateurs cles",
                  text:
                    "Le calculateur affiche : la date prevue d'accouchement (DPA), la date estimee de conception (J+14 en cycle de 28 jours), votre nombre de semaines de grossesse en SA, le trimestre en cours et les jours restants jusqu'a la DPA.",
                },
                {
                  name: "Suivre les etapes cles (milestones)",
                  text:
                    "Le calendrier des etapes liste les rendez-vous medicaux importants : echographie de datation (12 SA), morphologique (22 SA), de croissance (32 SA) et la naissance prevue (40 SA). Ces dates sont indicatives, votre suivi medical les precisera.",
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
                A savoir sur le calcul de la grossesse
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Semaines d&apos;amenorrhee (SA) vs semaines de grossesse (SG).</strong> En
                  France, le suivi medical s&apos;exprime en SA, qui comptent a partir du premier jour
                  des dernieres regles. Les SG, parfois utilisees a l&apos;international, comptent depuis
                  la conception (donc SG = SA - 2). Ce calculateur utilise les SA, conformement a la
                  pratique francaise.
                </p>
                <p>
                  <strong>Regle de Naegele.</strong> Formule mise au point au 19e siecle :
                  DPA = DDR + 280 jours. Elle suppose un cycle regulier de 28 jours et une ovulation au
                  14e jour. Pour des cycles plus longs ou plus courts, l&apos;estimation est ajustee par
                  l&apos;echographie de datation.
                </p>
                <p>
                  <strong>Les 5 % de bebes nes a la DPA.</strong> Seulement 5 % environ des naissances
                  ont lieu exactement le jour prevu. Le terme va de 37 SA (terme precoce) a 42 SA (post
                  terme), avec un pic autour de 40 SA. Apres 41 SA, un suivi rapproche est mis en place.
                </p>
                <p>
                  <strong>Les 3 echographies obligatoires en France.</strong> Echographie de datation
                  (11-13 SA) pour confirmer la DPA et detecter les anomalies precoces. Echographie
                  morphologique (20-22 SA) pour examen detaille des organes. Echographie de croissance
                  (30-32 SA) pour evaluer la position du bebe et la croissance.
                </p>
                <p>
                  <strong>Sources medicales de reference.</strong> Haute Autorite de Sante (HAS), College
                  National des Gynecologues et Obstetriciens Francais (CNGOF), Sante publique France.
                  Ce calculateur ne remplace pas le suivi prenatal et n&apos;a pas vocation a poser ou
                  exclure un diagnostic.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees par les futurs parents sur le calcul de la grossesse."
              items={[
                {
                  question: "Que signifie SA et combien de semaines dure une grossesse ?",
                  answer:
                    "SA signifie 'Semaines d'Amenorrhee' : on compte depuis le premier jour des dernieres regles. Une grossesse a terme va de 37 a 42 SA, soit environ 9 mois. Le calcul de Naegele place la DPA a 40 SA exactement.",
                },
                {
                  question: "Mon cycle est irregulier, le calcul reste-t-il valable ?",
                  answer:
                    "Le calcul base sur la regle de Naegele suppose un cycle regulier de 28 jours. Si vos cycles sont plus longs ou irreguliers, la date estimee sera moins fiable. C'est l'echographie de datation, realisee entre 11 et 13 SA, qui fixera la DPA officielle.",
                },
                {
                  question: "Qu'est-ce que la date estimee de conception ?",
                  answer:
                    "Sous l'hypothese d'un cycle de 28 jours, l'ovulation a lieu environ au 14e jour. La conception est donc estimee a DDR + 14 jours. C'est une estimation, la fenetre fertile s'etale en realite sur plusieurs jours autour de l'ovulation.",
                },
                {
                  question: "Pourquoi ma DPA differe-t-elle de celle de mon medecin ?",
                  answer:
                    "Le calculateur utilise la regle de Naegele de base. Votre professionnel de sante peut ajuster la DPA selon votre cycle reel, l'echographie de datation ou la longueur cranio-caudale du foetus. Faites toujours confiance a la date donnee par votre suivi medical.",
                },
                {
                  question: "A quel moment l'echographie de datation est-elle realisee ?",
                  answer:
                    "L'echographie de datation est en general realisee entre 11 SA et 13 SA + 6 jours. Elle confirme la DPA, detecte d'eventuelles grossesses gemellaires et constitue le 1er bilan de depistage prenatal (mesure de la clarte nucale).",
                },
                {
                  question: "Quels sont les rendez-vous medicaux remboursables en France ?",
                  answer:
                    "Le suivi prenatal comprend 7 consultations mensuelles obligatoires, 3 echographies (12, 22, 32 SA) prises en charge a 100 % par l'Assurance maladie, et la preparation a la naissance (8 seances remboursees). Le tout est suivi par sage-femme, medecin generaliste ou gynecologue.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui. Toutes les dates sont calculees localement dans votre navigateur. Aucune information n'est envoyee a un serveur, aucune donnee personnelle n'est stockee. Le calculateur fonctionne sans inscription.",
                },
                {
                  question: "Peut-on calculer la grossesse pour une FIV ou une PMA ?",
                  answer:
                    "Pour une FIV avec transfert d'embryon, le calcul standard est moins adapte. La date a retenir depend du type de transfert (J3, J5, blastocyste). Demandez a votre centre de PMA la date theorique de DDR equivalente, ou utilisez plutot l'echographie de datation comme reference.",
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
