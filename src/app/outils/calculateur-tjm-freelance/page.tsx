"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

export default function CalculateurTJMFreelance() {
  const [salaireNet, setSalaireNet] = useState("3000");
  const [tauxCharges, setTauxCharges] = useState("22");
  const [joursTravaillesMois, setJoursTravaillesMois] = useState("20");
  const [joursConge, setJoursConge] = useState("25");
  const [fraisMensuels, setFraisMensuels] = useState("300");

  const resultats = useMemo(() => {
    const salaire = parseFloat(salaireNet) || 0;
    const charges = parseFloat(tauxCharges) || 0;
    const joursMois = parseFloat(joursTravaillesMois) || 0;
    const conges = parseFloat(joursConge) || 0;
    const frais = parseFloat(fraisMensuels) || 0;

    const revenuBrutMensuel = (salaire + frais) / (1 - charges / 100);
    const revenuBrutAnnuel = revenuBrutMensuel * 12;
    const joursFacturablesAn = joursMois * 12 - conges;
    const tjm = joursFacturablesAn > 0 ? revenuBrutAnnuel / joursFacturablesAn : 0;
    const thm = tjm / 8;
    const chargesAnnuelles = revenuBrutAnnuel * (charges / 100);
    const netAnnuel = revenuBrutAnnuel - chargesAnnuelles;

    return {
      tjm,
      thm,
      revenuBrutAnnuel,
      chargesAnnuelles,
      netAnnuel,
      joursFacturablesAn,
    };
  }, [salaireNet, tauxCharges, joursTravaillesMois, joursConge, fraisMensuels]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtDec = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Business</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>TJM Freelance</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Determinez votre Taux Journalier Moyen ideal en fonction de votre salaire net souhaite, vos charges et vos frais professionnels.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Vos parametres</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Salaire net mensuel souhaite</label>
                  <div className="relative mt-2">
                    <input type="number" value={salaireNet} onChange={(e) => setSalaireNet(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Charges sociales</label>
                  <div className="relative mt-2">
                    <input type="number" value={tauxCharges} onChange={(e) => setTauxCharges(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--muted)" }}>%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Jours travailles / mois</label>
                  <input type="number" value={joursTravaillesMois} onChange={(e) => setJoursTravaillesMois(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Jours de conge / an</label>
                  <input type="number" value={joursConge} onChange={(e) => setJoursConge(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Frais mensuels (mutuelle, coworking, materiel...)</label>
                  <div className="relative mt-2">
                    <input type="number" value={fraisMensuels} onChange={(e) => setFraisMensuels(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--muted)" }}>&euro;/mois</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Result principal */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>TJM recommande</p>
              <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {fmt(resultats.tjm)} &euro;
              </p>
              <p className="mt-2 text-lg font-semibold" style={{ color: "var(--accent)" }}>
                soit {fmtDec(resultats.thm)} &euro; / heure
              </p>
              <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                Base sur <strong className="text-[var(--foreground)]">{resultats.joursFacturablesAn} jours facturables</strong> par an
              </p>
            </div>

            {/* Details */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Detail annuel</h2>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Revenu brut annuel", value: `${fmt(resultats.revenuBrutAnnuel)} \u20AC`, color: "var(--foreground)" },
                  { label: "Charges annuelles", value: `- ${fmt(resultats.chargesAnnuelles)} \u20AC`, color: "#dc2626" },
                  { label: "Revenu net annuel", value: `${fmt(resultats.netAnnuel)} \u20AC`, color: "#16a34a" },
                  { label: "Revenu net mensuel", value: `${fmt(resultats.netAnnuel / 12)} \u20AC`, color: "#16a34a" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>{row.label}</span>
                    <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <ToolHowToSection
              title="Comment calculer votre TJM freelance"
              description="Trois etapes pour fixer un Taux Journalier Moyen qui couvre vos charges, vos frais et votre niveau de vie cible."
              steps={[
                {
                  name: "Estimer votre salaire net cible",
                  text:
                    "Definissez le revenu net mensuel que vous souhaitez vous verser. Pour un repere, un cadre confirme du prive en CDI gagne 3 000 a 4 500 EUR net en region, 4 500 a 7 000 EUR en Ile-de-France. Pensez a viser au moins 20 a 30 pourcent de plus en freelance pour compenser le risque (inter-contrats, maladie, perte de client).",
                },
                {
                  name: "Renseigner vos charges sociales et frais",
                  text:
                    "En micro-entreprise BNC : 21,2 pourcent (taux 2026) du CA en charges sociales + CFP + CFE. En EURL ou SASU IS : entre 30 et 45 pourcent selon le statut TNS ou assimile salarie. Ajoutez vos frais reels mensuels : mutuelle (50-150 EUR), assurance RC Pro (15-50 EUR), comptable (100-300 EUR), logiciels, coworking, materiel.",
                },
                {
                  name: "Calculer vos jours facturables reels",
                  text:
                    "Sur 252 jours ouvres par an, retirez 25 jours de conges, 5 jours feries (en moyenne tombent en semaine), 5 jours de maladie, et 15 a 25 jours d&apos;administratif/prospection/formation. Resultat realiste : 180 a 200 jours facturables. C&apos;est sur cette base que se calcule un TJM viable.",
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
                Cas d&apos;usage du calculateur de TJM
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Developpeur fullstack senior
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Objectif 4 500 EUR net/mois en SASU, 45 pourcent de charges, 400 EUR de frais
                    mensuels, 200 jours facturables : TJM cible autour de 700 EUR. Marche francais
                    senior fullstack 2026 : entre 600 et 800 EUR. Au-dela de 800, mieux vaut viser
                    des missions ESN ou freelance plateforme grand compte.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Designer UX/UI freelance
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Objectif 3 200 EUR net en micro-BNC, 23 pourcent de charges, 250 EUR de frais,
                    180 jours facturables (clients PME plus chronophages) : TJM cible 350-450 EUR.
                    Marche reel 2026 : 350-550 EUR selon seniorite et niche (UX research, design
                    system, branding).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Consultant data / IA
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Profils data scientist, MLops, IA generative : 750 a 1 200 EUR / jour pour les
                    seniors avec 5+ annees d&apos;experience. Sur des missions strategiques court
                    terme (audit, POC), un TJM &gt; 1 000 EUR est commun. Chaque jour d&apos;inter-contrat
                    coute 500 a 800 EUR de manque a gagner : la prospection est cruciale.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Equivalence salaire-TJM
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Regle empirique du portage salarial : un TJM divise par 2 donne approximativement
                    le salaire brut mensuel CDI equivalent. TJM 500 EUR = environ 250 EUR brut/jour
                    en CDI = 5 250 EUR brut/mois (sur 21 jours). C&apos;est utile pour savoir si une
                    mission longue (12 mois +) merite mieux qu&apos;un retour au salariat.
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
                Pieges classiques du calcul de TJM
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>TJM n&apos;egale pas salaire.</strong> Un TJM de 500 EUR n&apos;est pas
                  equivalent a 500 EUR de salaire journalier. Sur ces 500 EUR de chiffre
                  d&apos;affaires, il faut deduire 21 a 45 pourcent de charges sociales, les frais
                  professionnels (200-500 EUR/mois), la TVA si vous etes assujetti (art. 256 CGI),
                  et les jours non factures (conges, feries, prospection). Le net dans la poche
                  est rarement plus de 50 a 60 pourcent du TJM brut.
                </p>
                <p>
                  <strong>Sous-estimer les jours non factures.</strong> Sur 252 jours ouvres,
                  comptez 25 jours de conges, 5-7 feries en semaine, 5-10 jours de maladie ou
                  imprevus, et 15 a 30 jours d&apos;administratif/prospection/formation. Resultat
                  realiste : 180 a 200 jours factures, jamais 220+. Diviser le revenu cible par
                  220 sous-estime systematiquement le TJM necessaire de 10 a 15 pourcent.
                </p>
                <p>
                  <strong>Charges sociales : statut compte enormement.</strong> Micro-BNC 2026 :
                  21,2 pourcent de charges + 1,7 pourcent CFP + CFE. EURL avec gerant majoritaire
                  TNS : environ 30-35 pourcent sur la remuneration. SASU avec president assimile
                  salarie : 75-80 pourcent en charges patronales + salariales additionnees, soit
                  l&apos;equivalent de 45 pourcent du brut total. La SASU est confortable
                  socialement mais lourde fiscalement sous 80-100 KEUR de CA.
                </p>
                <p>
                  <strong>TVA et franchise en base.</strong> En 2026, la franchise en base TVA
                  s&apos;applique en dessous des seuils fixes par l&apos;art. 293 B du CGI (a
                  verifier sur impots.gouv.fr car ils evoluent). Un TJM HT de 500 EUR = 600 EUR
                  TTC pour le client si vous etes assujetti. Pour des clients particuliers ou
                  associations non recuperatrices de TVA, restez sous le seuil le plus longtemps
                  possible : c&apos;est 20 pourcent de competitivite tarifaire en plus.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur le calcul du Taux Journalier Moyen freelance en France."
              items={[
                {
                  question: "Quel TJM pour un developpeur freelance en France en 2026 ?",
                  answer:
                    "TJM moyen marche 2026 : 400-550 EUR pour un junior (1-3 ans), 550-750 EUR pour un senior (5+ ans), 750-1 000 EUR pour un expert / lead / architecte. Les technos rares (Rust, Elixir, IA gen, data engineering Snowflake) tirent les TJM vers le haut. Paris et grandes plateformes ESN type Malt premium permettent +10 a 20 pourcent par rapport aux regions.",
                },
                {
                  question: "Quelle difference entre TJM et THM ?",
                  answer:
                    "TJM = Taux Journalier Moyen, base sur une journee de 8 heures. THM = Taux Horaire Moyen, soit TJM / 8. Le THM est utile pour facturer des prestations courtes ou ponctuelles (consulting 2h, formation 4h). Pour des missions longues, restez sur le TJM : c&apos;est plus lisible commercialement et evite les debats sur le decompte horaire.",
                },
                {
                  question: "Combien de jours un freelance facture-t-il par an ?",
                  answer:
                    "Realiste : 180 a 200 jours facturables / an. Sur 365 jours, retirez 104 week-ends, 25 conges, 5-7 feries en semaine, 5-10 jours de maladie/imprevus, et 15-30 jours d&apos;administratif (prospection, devis, formation, comptabilite, factures impayees a relancer). Tabler sur plus de 220 jours est irrealiste sauf en regie longue duree (mission ESN +12 mois).",
                },
                {
                  question: "Comment negocier son TJM avec un client ?",
                  answer:
                    "Basez la negociation sur la valeur apportee (gain client mesurable, expertise rare), pas sur vos couts internes. Connaissez votre TJM plancher (la limite sous laquelle vous perdez de l&apos;argent compte tenu de vos charges et de votre objectif net). Annoncez 10 a 15 pourcent au-dessus de votre cible pour laisser de la marge. Refusez les missions sous votre plancher meme en periode creuse : un mauvais client coute toujours plus cher qu&apos;un mois sans CA.",
                },
                {
                  question: "Quel statut juridique choisir pour optimiser son TJM ?",
                  answer:
                    "Micro-entreprise jusqu&apos;a 50-70 KEUR de CA : simplicite, charges legeres mais protection sociale faible. EURL au-dela de 70 KEUR : meilleur compromis charges/protection pour beaucoup de freelances. SASU si vous voulez le statut salarie (chomage non couvert mais retraite et indemnites journalieres meilleures) ou pour preparer une levee de fonds. Au-dela de 100 KEUR de benefice, l&apos;optimisation IS + dividendes via SASU/SAS est generalement preferable.",
                },
                {
                  question: "Comment integrer la TVA dans son TJM ?",
                  answer:
                    "Le TJM est toujours exprime en HT entre professionnels. Si vous etes assujetti TVA, ajoutez 20 pourcent au moment de facturer (ex : TJM 500 EUR HT = 600 EUR TTC). Sous franchise en base TVA (art. 293 B du CGI), vous facturez sans TVA mais ne pouvez pas la recuperer sur vos achats. Pour un client B2B qui recupere la TVA, c&apos;est neutre. Pour un particulier, etre en franchise = 20 pourcent moins cher en visuel.",
                },
                {
                  question: "Mon TJM est-il competitif sur le marche ?",
                  answer:
                    "Comparez via les baromètres Malt, Free-Work (ex Freelance-Info), Comet, Hopwork, ou les CCI regionales. Pour un meme profil, ecart courant : +10 a 20 pourcent en Ile-de-France vs province. +15 a 25 pourcent en mission grand compte vs PME. Si votre TJM est tres en dessous de la fourchette : sous-evaluation, vous perdez de l&apos;argent. Si tres au-dessus : positionnement haut de gamme avec moins de missions mais plus rentables.",
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
