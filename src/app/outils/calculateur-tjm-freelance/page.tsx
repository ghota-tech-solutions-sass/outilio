"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

// Bareme micro-entreprise 2026 (charges sociales + CFP par activite)
// Source : URSSAF / service-public.gouv.fr (BNC liberal hors CIPAV : 24,6% en 2025, 25,6% depuis le 01/01/2026)
// CFP : 0,1% commercants, 0,2% liberaux, 0,3% artisans
type ActiviteMicro =
  | "bic-vente"
  | "bic-services"
  | "bnc-liberal"
  | "bnc-cipav"
  | "autre";

const BAREME_MICRO: Record<ActiviteMicro, { charges: number; cfp: number; label: string }> = {
  "bic-vente":     { charges: 12.3, cfp: 0.1, label: "Micro BIC - Vente de marchandises" },
  "bic-services":  { charges: 21.2, cfp: 0.3, label: "Micro BIC - Prestations de services / artisanal" },
  "bnc-liberal":   { charges: 25.6, cfp: 0.2, label: "Micro BNC - Libéral hors CIPAV (2026)" },
  "bnc-cipav":     { charges: 23.2, cfp: 0.2, label: "Micro BNC - Libéral CIPAV" },
  "autre":         { charges: 45.0, cfp: 0.0, label: "Autre (EURL/SASU - taux personnalisé)" },
};

export default function CalculateurTJMFreelance() {
  const [activite, setActivite] = useState<ActiviteMicro>("bnc-liberal");
  const [salaireNet, setSalaireNet] = useState("3000");
  const [tauxCharges, setTauxCharges] = useState("25.8");
  const [joursTravaillesMois, setJoursTravaillesMois] = useState("20");
  const [joursConge, setJoursConge] = useState("25");
  const [fraisMensuels, setFraisMensuels] = useState("300");

  const handleActiviteChange = (nextActivite: ActiviteMicro) => {
    setActivite(nextActivite);
    if (nextActivite !== "autre") {
      const total = BAREME_MICRO[nextActivite].charges + BAREME_MICRO[nextActivite].cfp;
      setTauxCharges(total.toFixed(1));
    }
  };

  const resultats = useMemo(() => {
    const salaire = parseFloat(salaireNet) || 0;
    const charges = parseFloat(tauxCharges) || 0;
    const joursMois = parseFloat(joursTravaillesMois) || 0;
    const conges = parseFloat(joursConge) || 0;
    const frais = parseFloat(fraisMensuels) || 0;

    // Garde-fou : un taux de charges >= 100 % rendrait le calcul infini ou negatif
    const revenuBrutMensuel = charges < 100 ? (salaire + frais) / (1 - charges / 100) : 0;
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
            Déterminez votre Taux Journalier Moyen idéal en fonction de votre salaire net souhaité, vos charges et vos frais professionnels.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Vos paramètres</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Activité / statut</label>
                  <select value={activite} onChange={(e) => handleActiviteChange(e.target.value as ActiviteMicro)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    {(Object.entries(BAREME_MICRO) as [ActiviteMicro, typeof BAREME_MICRO[ActiviteMicro]][]).map(([key, v]) => (
                      <option key={key} value={key}>{v.label}{key !== "autre" ? ` (${(v.charges + v.cfp).toFixed(1)}%)` : ""}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    Barème URSSAF 2026 incluant CFP. BNC libéral hors CIPAV : 24,6% (2025) puis 25,6% (2026). CFP services BIC : 0,3% pour un artisan (0,1% si activité commerciale).
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Salaire net mensuel souhaité</label>
                  <div className="relative mt-2">
                    <input type="number" value={salaireNet} onChange={(e) => setSalaireNet(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Charges sociales totales</label>
                  <div className="relative mt-2">
                    <input type="number" value={tauxCharges} onChange={(e) => { setTauxCharges(e.target.value); setActivite("autre"); }}
                      className="w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "var(--muted)" }}>%</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Jours travaillés / mois</label>
                  <input type="number" value={joursTravaillesMois} onChange={(e) => setJoursTravaillesMois(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Jours de congé / an</label>
                  <input type="number" value={joursConge} onChange={(e) => setJoursConge(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Frais mensuels (mutuelle, coworking, matériel...)</label>
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>TJM recommandé</p>
              <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {fmt(resultats.tjm)} &euro;
              </p>
              <p className="mt-2 text-lg font-semibold" style={{ color: "var(--accent)" }}>
                soit {fmtDec(resultats.thm)} &euro; / heure
              </p>
              <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                Basé sur <strong className="text-[var(--foreground)]">{resultats.joursFacturablesAn} jours facturables</strong> par an
              </p>
            </div>

            {/* Details */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détail annuel</h2>
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
              description="Trois étapes pour fixer un Taux Journalier Moyen qui couvre vos charges, vos frais et votre niveau de vie cible."
              steps={[
                {
                  name: "Estimer votre salaire net cible",
                  text:
                    "Définissez le revenu net mensuel que vous souhaitez vous verser. Pour un repère, un cadre confirmé du privé en CDI gagne 3 000 à 4 500 € net en région, 4 500 à 7 000 € en Île-de-France. Pensez à viser au moins 20 à 30 pourcent de plus en freelance pour compenser le risque (inter-contrats, maladie, perte de client).",
                },
                {
                  name: "Renseigner vos charges sociales et frais",
                  text:
                    "Barème micro 2026 : BIC vente 12,3 pourcent, BIC services / artisanal 21,2 pourcent, BNC libéral hors CIPAV 25,6 pourcent (depuis le 1er janvier 2026), BNC libéral CIPAV 23,2 pourcent. Ajoutez la CFP (0,1 pourcent vente et services commerciaux / 0,2 pourcent libéraux / 0,3 pourcent artisans) et la CFE (annuelle, variable selon commune). En EURL ou SASU IS : entre 30 et 45 pourcent selon le statut TNS ou assimilé salarié. Ajoutez vos frais réels mensuels : mutuelle (50-150 €), assurance RC Pro (15-50 €), comptable (100-300 €), logiciels, coworking, matériel.",
                },
                {
                  name: "Calculer vos jours facturables réels",
                  text:
                    "Sur 252 jours ouvrés par an, retirez 25 jours de congés, 5 jours fériés (en moyenne tombent en semaine), 5 jours de maladie, et 15 à 25 jours d'administratif/prospection/formation. Résultat réaliste : 180 à 200 jours facturables. C'est sur cette base que se calcule un TJM viable.",
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
                    Développeur fullstack senior
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Objectif 4 500 € net/mois en SASU, 45 pourcent de charges, 400 € de frais
                    mensuels, 200 jours facturables : TJM cible autour de 700 €. Marché français
                    senior fullstack 2026 : entre 600 et 800 €. Au-delà de 800, mieux vaut viser
                    des missions ESN ou freelance plateforme grand compte.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Designer UX/UI freelance
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Objectif 3 200 € net en micro-BNC libéral hors CIPAV (25,6 pourcent en 2026),
                    250 € de frais, 180 jours facturables (clients PME plus chronophages) : TJM cible 350-450 €.
                    Marché réel 2026 : 350-550 € selon séniorité et niche (UX research, design
                    system, branding).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Consultant data / IA
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Profils data scientist, MLops, IA générative : 750 à 1 200 € / jour pour les
                    seniors avec 5+ années d&apos;expérience. Sur des missions stratégiques court
                    terme (audit, POC), un TJM &gt; 1 000 € est commun. Chaque jour d&apos;inter-contrat
                    coûte 500 à 800 € de manque à gagner : la prospection est cruciale.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Équivalence salaire-TJM
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Règle empirique du portage salarial : un TJM divisé par 2 donne approximativement
                    le salaire brut mensuel CDI équivalent. TJM 500 € = environ 250 € brut/jour
                    en CDI = 5 250 € brut/mois (sur 21 jours). C&apos;est utile pour savoir si une
                    mission longue (12 mois +) mérite mieux qu&apos;un retour au salariat.
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
                Pièges classiques du calcul de TJM
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>TJM n&apos;égale pas salaire.</strong> Un TJM de 500 € n&apos;est pas
                  équivalent à 500 € de salaire journalier. Sur ces 500 € de chiffre
                  d&apos;affaires, il faut déduire 21 à 45 pourcent de charges sociales, les frais
                  professionnels (200-500 €/mois), la TVA si vous êtes assujetti (art. 256 CGI),
                  et les jours non facturés (congés, fériés, prospection). Le net dans la poche
                  est rarement plus de 50 à 60 pourcent du TJM brut.
                </p>
                <p>
                  <strong>Sous-estimer les jours non facturés.</strong> Sur 252 jours ouvrés,
                  comptez 25 jours de congés, 5-7 fériés en semaine, 5-10 jours de maladie ou
                  imprévus, et 15 à 30 jours d&apos;administratif/prospection/formation. Résultat
                  réaliste : 180 à 200 jours facturés, jamais 220+. Diviser le revenu cible par
                  220 sous-estime systématiquement le TJM nécessaire de 10 à 15 pourcent.
                </p>
                <p>
                  <strong>Charges sociales : statut compte énormément.</strong> Barème micro 2026 :
                  BIC vente 12,3 pourcent (CFP 0,1 pourcent), BIC services / artisanal 21,2 pourcent
                  (CFP 0,1 pourcent commerçant / 0,3 pourcent artisan), BNC libéral hors CIPAV 25,6
                  pourcent en 2026 (CFP 0,2 pourcent), BNC libéral CIPAV 23,2
                  pourcent. La CFE est annuelle et varie selon la commune. EURL avec gérant
                  majoritaire TNS : environ 30-35 pourcent sur la rémunération. SASU avec président
                  assimilé salarié : 75-80 pourcent en charges patronales + salariales additionnées,
                  soit l&apos;équivalent de 45 pourcent du brut total. La SASU est confortable
                  socialement mais lourde fiscalement sous 80-100 k€ de CA.
                </p>
                <p>
                  <strong>TVA et franchise en base.</strong> En 2026, la franchise en base TVA
                  s&apos;applique en dessous des seuils fixés par l&apos;art. 293 B du CGI (à
                  vérifier sur impots.gouv.fr car ils évoluent). Un TJM HT de 500 € = 600 €
                  TTC pour le client si vous êtes assujetti. Pour des clients particuliers ou
                  associations non récupératrices de TVA, restez sous le seuil le plus longtemps
                  possible : c&apos;est 20 pourcent de compétitivité tarifaire en plus.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus fréquentes sur le calcul du Taux Journalier Moyen freelance en France."
              items={[
                {
                  question: "Quel TJM pour un développeur freelance en France en 2026 ?",
                  answer:
                    "TJM moyen marché 2026 : 400-550 € pour un junior (1-3 ans), 550-750 € pour un senior (5+ ans), 750-1 000 € pour un expert / lead / architecte. Les technos rares (Rust, Elixir, IA gen, data engineering Snowflake) tirent les TJM vers le haut. Paris et grandes plateformes ESN type Malt premium permettent +10 à 20 pourcent par rapport aux régions.",
                },
                {
                  question: "Quelle différence entre TJM et THM ?",
                  answer:
                    "TJM = Taux Journalier Moyen, basé sur une journée de 8 heures. THM = Taux Horaire Moyen, soit TJM / 8. Le THM est utile pour facturer des prestations courtes ou ponctuelles (consulting 2h, formation 4h). Pour des missions longues, restez sur le TJM : c'est plus lisible commercialement et évite les débats sur le décompte horaire.",
                },
                {
                  question: "Combien de jours un freelance facture-t-il par an ?",
                  answer:
                    "Réaliste : 180 à 200 jours facturables / an. Sur 365 jours, retirez 104 week-ends, 25 congés, 5-7 fériés en semaine, 5-10 jours de maladie/imprévus, et 15-30 jours d'administratif (prospection, devis, formation, comptabilité, factures impayées à relancer). Tabler sur plus de 220 jours est irréaliste sauf en régie longue durée (mission ESN +12 mois).",
                },
                {
                  question: "Comment négocier son TJM avec un client ?",
                  answer:
                    "Basez la négociation sur la valeur apportée (gain client mesurable, expertise rare), pas sur vos coûts internes. Connaissez votre TJM plancher (la limite sous laquelle vous perdez de l'argent compte tenu de vos charges et de votre objectif net). Annoncez 10 à 15 pourcent au-dessus de votre cible pour laisser de la marge. Refusez les missions sous votre plancher même en période creuse : un mauvais client coûte toujours plus cher qu'un mois sans CA.",
                },
                {
                  question: "Quel statut juridique choisir pour optimiser son TJM ?",
                  answer:
                    "Micro-entreprise jusqu'à 50-70 k€ de CA : simplicité, charges légères mais protection sociale faible. EURL au-delà de 70 k€ : meilleur compromis charges/protection pour beaucoup de freelances. SASU si vous voulez le statut salarié (chômage non couvert mais retraite et indemnités journalières meilleures) ou pour préparer une levée de fonds. Au-delà de 100 k€ de bénéfice, l'optimisation IS + dividendes via SASU/SAS est généralement préférable.",
                },
                {
                  question: "Comment intégrer la TVA dans son TJM ?",
                  answer:
                    "Le TJM est toujours exprimé en HT entre professionnels. Si vous êtes assujetti TVA, ajoutez 20 pourcent au moment de facturer (ex : TJM 500 € HT = 600 € TTC). Sous franchise en base TVA (art. 293 B du CGI), vous facturez sans TVA mais ne pouvez pas la récupérer sur vos achats. Pour un client B2B qui récupère la TVA, c'est neutre. Pour un particulier, être en franchise = 20 pourcent moins cher en visuel.",
                },
                {
                  question: "Mon TJM est-il compétitif sur le marché ?",
                  answer:
                    "Comparez via les baromètres Malt, Free-Work (ex Freelance-Info), Comet, Hopwork, ou les CCI régionales. Pour un même profil, écart courant : +10 à 20 pourcent en Île-de-France vs province. +15 à 25 pourcent en mission grand compte vs PME. Si votre TJM est très en dessous de la fourchette : sous-évaluation, vous perdez de l'argent. Si très au-dessus : positionnement haut de gamme avec moins de missions mais plus rentables.",
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
