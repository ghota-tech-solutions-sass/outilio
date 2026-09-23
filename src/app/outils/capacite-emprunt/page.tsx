"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";
import {
  PONDERATION_LOYERS,
  RAV_ADULTE,
  RAV_ENFANT,
  TAUX_MOYENS_2026,
  calculerCapacite,
  parseNum,
  tableauSensibilite,
} from "./calcul";

// Sources des règles et des chiffres : voir l'en-tête de ./calcul.ts
// (décision HCSF D-HCSF-2021-7, Légifrance JORFTEXT000044178669 ; Observatoire Crédit Logement/CSA août 2026).

const DUREES = [15, 20, 25] as const;

const fmt = (n: number) => Math.round(n).toLocaleString("fr-FR");
const fmtTaux = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CapaciteEmprunt() {
  const [nbEmprunteurs, setNbEmprunteurs] = useState<1 | 2>(1);
  const [revenu1, setRevenu1] = useState("3000");
  const [revenu2, setRevenu2] = useState("2200");
  const [loyers, setLoyers] = useState("");
  const [autresCredits, setAutresCredits] = useState("");
  const [apport, setApport] = useState("20000");
  const [duree, setDuree] = useState<number>(25);
  const [taux, setTaux] = useState("3,35");
  const [tauxAssurance, setTauxAssurance] = useState("0,30");
  const [enfants, setEnfants] = useState("0");
  const [neuf, setNeuf] = useState(false);

  const choisirDuree = (d: number) => {
    setDuree(d);
    // Aligne le taux sur la moyenne du marché de la durée choisie (modifiable ensuite)
    setTaux(fmtTaux(TAUX_MOYENS_2026[d]));
  };

  const tauxNum = parseNum(taux);
  const tauxAssNum = parseNum(tauxAssurance);

  const result = useMemo(
    () =>
      calculerCapacite({
        revenus: parseNum(revenu1) + (nbEmprunteurs === 2 ? parseNum(revenu2) : 0),
        loyers: parseNum(loyers),
        autresCredits: parseNum(autresCredits),
        apport: parseNum(apport),
        dureeAns: duree,
        taux: tauxNum,
        tauxAssurance: tauxAssNum,
        adultes: nbEmprunteurs,
        enfants: Math.floor(parseNum(enfants)),
        neuf,
      }),
    [revenu1, revenu2, nbEmprunteurs, loyers, autresCredits, apport, duree, tauxNum, tauxAssNum, enfants, neuf],
  );

  const sensibilite = useMemo(
    () => (result && !result.capaciteNulle ? tableauSensibilite(result.mensualiteMax, tauxNum, tauxAssNum) : []),
    [result, tauxNum, tauxAssNum],
  );

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, rgba(13,79,60,0.04), var(--surface))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Immobilier
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-2 text-3xl font-extrabold md:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
          >
            Capacité d’emprunt 2026 : <span style={{ color: "var(--primary)" }}>combien pouvez-vous emprunter ?</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-2 max-w-3xl" style={{ color: "var(--muted)" }}>
            Estimez votre mensualité maximale selon la règle HCSF des 35 % d’endettement (assurance comprise), le capital
            que les banques peuvent vous prêter et votre budget d’achat total. Calcul instantané, dans votre navigateur.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Saisie */}
            <div
              className="animate-fade-up stagger-2 rounded-2xl border p-6 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Vos revenus et charges
              </h2>

              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Nombre d’emprunteurs">
                {([1, 2] as const).map((n) => (
                  <Pill key={n} active={nbEmprunteurs === n} onClick={() => setNbEmprunteurs(n)}>
                    {n === 1 ? "1 emprunteur" : "2 emprunteurs"}
                  </Pill>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label={nbEmprunteurs === 2 ? "Revenu net mensuel emprunteur 1 (€)" : "Revenu net mensuel (€)"}
                  hint="Net avant impôt sur le revenu"
                  value={revenu1}
                  onChange={setRevenu1}
                />
                {nbEmprunteurs === 2 && (
                  <Field label="Revenu net mensuel emprunteur 2 (€)" hint="Net avant impôt" value={revenu2} onChange={setRevenu2} />
                )}
                <Field
                  label="Loyers perçus (€/mois)"
                  hint={`Comptés à ${PONDERATION_LOYERS * 100} % (pratique bancaire)`}
                  value={loyers}
                  onChange={setLoyers}
                  placeholder="0"
                />
                <Field
                  label="Autres crédits en cours (€/mois)"
                  hint="Auto, conso, autre prêt immobilier conservé"
                  value={autresCredits}
                  onChange={setAutresCredits}
                  placeholder="0"
                />
                <Field label="Enfants à charge" hint="Pour le repère de reste à vivre" value={enfants} onChange={setEnfants} />
              </div>

              <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Votre futur prêt
              </h2>
              <div className="mt-4">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Durée du prêt</p>
                <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Durée du prêt">
                  {DUREES.map((d) => (
                    <Pill key={d} active={duree === d} onClick={() => choisirDuree(d)}>
                      {d} ans
                    </Pill>
                  ))}
                </div>
                <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                  Durée maximale HCSF : 25 ans (27 ans seulement dans le neuf avec différé d’amortissement, non simulé ici).
                </p>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Taux nominal annuel (%)"
                  hint={`Moyenne août 2026 sur ${duree} ans : ${fmtTaux(TAUX_MOYENS_2026[duree])} % (Crédit Logement/CSA)`}
                  value={taux}
                  onChange={setTaux}
                  decimal
                />
                <Field
                  label="Assurance emprunteur (% par an)"
                  hint={nbEmprunteurs === 2 ? "Taux total du prêt, toutes quotités confondues" : "Sur le capital emprunté"}
                  value={tauxAssurance}
                  onChange={setTauxAssurance}
                  decimal
                />
                <Field label="Apport personnel (€)" value={apport} onChange={setApport} placeholder="0" />
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Type de logement</p>
                  <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Type de logement">
                    <Pill active={!neuf} onClick={() => setNeuf(false)}>Ancien</Pill>
                    <Pill active={neuf} onClick={() => setNeuf(true)}>Neuf</Pill>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Sert à estimer les frais de notaire</p>
                </div>
              </div>
            </div>

            {/* Résultats */}
            {!result && (
              <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p style={{ color: "var(--muted)" }}>Saisissez au moins un revenu pour afficher votre capacité d’emprunt.</p>
              </div>
            )}

            {result && result.capaciteNulle && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{ background: "#dc262620", color: "#dc2626" }}
                >
                  Capacité d’emprunt nulle
                </div>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  Vos crédits en cours ({fmt(parseNum(autresCredits))} €/mois) atteignent déjà le plafond de 35 % de vos revenus
                  retenus ({fmt(result.chargesMax)} €/mois). Solder ou regrouper un crédit peut libérer de la capacité : voir le{" "}
                  <Link href="/outils/calculateur-rachat-credit" className="underline" style={{ color: "var(--primary)" }}>
                    simulateur de rachat de crédit
                  </Link>
                  .
                </p>
              </div>
            )}

            {result && !result.capaciteNulle && (
              <>
                <div className="rounded-2xl border p-8 text-center shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                    Capital empruntable sur {duree} ans
                  </p>
                  <p className="mt-3 text-5xl font-bold md:text-6xl" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(result.capital)} €
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    pour une mensualité de {fmt(result.mensualiteMax)} €/mois assurance comprise, au taux de {fmtTaux(tauxNum)} %
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard label="Mensualité maximale" value={`${fmt(result.mensualiteMax)} €/mois`} sub="35 % des revenus retenus, moins vos crédits" />
                  <StatCard label="Budget total" value={`${fmt(result.budgetTotal)} €`} sub="Capital empruntable + apport" primary />
                  <StatCard
                    label="Prix du bien visé"
                    value={`≈ ${fmt(result.prixMaxBien)} €`}
                    sub={`Hors frais de notaire (≈ ${(result.tauxFraisNotaire * 100).toLocaleString("fr-FR")} %)`}
                  />
                </div>

                {/* Détail */}
                <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                    Détail du calcul
                  </h2>
                  <div className="mt-4 space-y-1">
                    <Row label="Revenus retenus (salaires + 70 % des loyers)" value={`${fmt(result.revenusRetenus)} €/mois`} />
                    <Row label="Plafond de charges à 35 %" value={`${fmt(result.chargesMax)} €/mois`} />
                    <Row label="Crédits en cours déduits" value={`− ${fmt(parseNum(autresCredits))} €/mois`} />
                    <Row label="Mensualité disponible (assurance comprise)" value={`${fmt(result.mensualiteMax)} €/mois`} highlight />
                    <Row label="Dont assurance emprunteur" value={`${fmt(result.assuranceMensuelle)} €/mois`} />
                    <Row label="Coût total des intérêts" value={`${fmt(result.coutInterets)} €`} />
                    <Row label="Coût total de l’assurance" value={`${fmt(result.coutAssurance)} €`} />
                    <Row label="Apport" value={`${fmt(parseNum(apport))} €`} />
                    <Row
                      label={`Frais de notaire estimés (${neuf ? "neuf" : "ancien"})`}
                      value={`≈ ${fmt(result.fraisNotaireEstimes)} €`}
                    />
                    <Row label="Prix maximal du bien (budget ÷ (1 + frais))" value={`≈ ${fmt(result.prixMaxBien)} €`} highlight primary />
                  </div>
                  <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                    Frais de notaire : ordre de grandeur (≈ 7,5 % dans l’ancien, ≈ 2,5 % dans le neuf). Pour un montant précis selon le
                    département et le prix, utilisez le{" "}
                    <Link href="/outils/calculateur-frais-notaire" className="underline" style={{ color: "var(--primary)" }}>
                      calculateur de frais de notaire
                    </Link>
                    . Frais de garantie et de dossier non inclus.
                  </p>
                </div>

                {/* Reste à vivre */}
                {(() => {
                  const ok = result.resteAVivre >= result.resteAVivreRepere;
                  return (
                    <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                        Reste à vivre
                      </h2>
                      <div className="mt-3 flex flex-wrap items-baseline gap-3">
                        <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: ok ? "#16a34a" : "#dc2626" }}>
                          {fmt(result.resteAVivre)} €/mois
                        </p>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ background: ok ? "#16a34a20" : "#dc262620", color: ok ? "#16a34a" : "#dc2626" }}
                        >
                          {ok ? "Au-dessus du repère" : "Sous le repère"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                        Revenus retenus moins toutes les mensualités de crédit. Repère indicatif pour votre foyer :{" "}
                        <strong style={{ color: "var(--foreground)" }}>{fmt(result.resteAVivreRepere)} €</strong> ({RAV_ADULTE} € par adulte,{" "}
                        {RAV_ENFANT} € par enfant). Ce n’est pas une règle officielle : chaque banque applique sa propre grille, souvent plus
                        exigeante pour les hauts revenus. Un reste à vivre confortable peut justifier une dérogation au seuil de 35 %.
                      </p>
                    </div>
                  );
                })()}

                {/* Sensibilité */}
                <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                    Sensibilité : capital selon la durée et le taux
                  </h2>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Même mensualité de {fmt(result.mensualiteMax)} €/mois et même taux d’assurance ({fmtTaux(tauxAssNum)} %).
                  </p>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                          <th className="pb-2 pr-4">Durée</th>
                          {sensibilite[0]?.valeurs.map((v, i) => (
                            <th key={i} className="pb-2 pr-4 text-right">
                              {i === 0 ? "Taux − 0,5 pt" : i === 1 ? "Votre taux" : "Taux + 0,5 pt"}
                              <span className="block text-xs font-normal">{fmtTaux(v.taux)} %</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sensibilite.map((ligne) => (
                          <tr
                            key={ligne.duree}
                            className="border-b"
                            style={{ borderColor: "var(--border)", background: ligne.duree === duree ? "var(--surface-alt)" : undefined }}
                          >
                            <td className="py-2 pr-4 font-medium" style={{ color: "var(--foreground)" }}>{ligne.duree} ans</td>
                            {ligne.valeurs.map((v, i) => (
                              <td
                                key={i}
                                className={`py-2 pr-4 text-right ${i === 1 ? "font-semibold" : ""}`}
                                style={{ color: i === 1 ? "var(--primary)" : "var(--foreground)" }}
                              >
                                {fmt(v.capital)} €
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                    Un demi-point de taux déplace votre capacité de plusieurs milliers d’euros : c’est l’enjeu de la mise en concurrence
                    des banques.
                  </p>
                </div>

                {/* Étape suivante : comparer */}
                <div
                  className="rounded-2xl border p-6 shadow-sm"
                  style={{ background: "rgba(13,79,60,0.05)", borderColor: "var(--primary)" }}
                >
                  <h2 className="text-lg font-semibold" style={{ color: "var(--primary)" }}>
                    Prochaine étape : comparer les offres de prêt
                  </h2>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed" style={{ color: "var(--foreground)" }}>
                    <li>Sollicitez au moins 3 banques ou un courtier : comparez le TAEG, pas seulement le taux nominal.</li>
                    <li>
                      L’assurance pèse jusqu’à un tiers du coût du crédit : une délégation d’assurance moins chère augmente aussi votre
                      capacité d’emprunt.
                    </li>
                    <li>Négociez les frais de dossier, la garantie (caution ou hypothèque) et les indemnités de remboursement anticipé.</li>
                  </ul>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <CrossLinkCard
                      href="/outils/assurance-emprunteur"
                      emoji="🛡️"
                      title="Économie assurance emprunteur"
                      desc="Mesurer le gain d’une délégation (loi Lemoine)"
                    />
                    <CrossLinkCard
                      href="/outils/calculateur-pret-immobilier"
                      emoji="🏠"
                      title="Simulateur de prêt immobilier"
                      desc="Mensualité et tableau d’amortissement"
                    />
                    <CrossLinkCard
                      href="/outils/simulateur-ptz-2026"
                      emoji="🆓"
                      title="Simulateur PTZ 2026"
                      desc="Prêt à taux zéro pour primo-accédant"
                    />
                    <CrossLinkCard
                      href="/outils/calculateur-frais-notaire"
                      emoji="🏛️"
                      title="Frais de notaire"
                      desc="Affiner le budget total de l’achat"
                    />
                  </div>
                </div>
              </>
            )}

            <ToolHowToSection
              title="Comment calculer sa capacité d’emprunt en 3 étapes"
              description="Le simulateur applique la règle du Haut Conseil de stabilité financière (HCSF) utilisée par toutes les banques françaises. Aucune donnée n’est envoyée : tout est calculé dans votre navigateur."
              steps={[
                {
                  name: "Renseigner vos revenus et vos crédits en cours",
                  text:
                    "Indiquez le revenu net mensuel avant impôt de chaque emprunteur, vos loyers perçus (retenus à 70 % par la plupart des banques) et les mensualités des crédits que vous conserverez. Le taux d’endettement maximal est de 35 % de ces revenus, assurance comprise.",
                },
                {
                  name: "Choisir la durée, le taux et l’assurance",
                  text:
                    "Sélectionnez 15, 20 ou 25 ans : le taux se cale sur la moyenne constatée en août 2026 (Observatoire Crédit Logement/CSA), que vous pouvez remplacer par le taux proposé par votre banque. Ajoutez le taux annuel de l’assurance emprunteur.",
                },
                {
                  name: "Lire le résultat et comparer",
                  text:
                    "Le simulateur affiche la mensualité maximale, le capital empruntable, le budget total avec votre apport, le prix de bien visé après frais de notaire et votre reste à vivre. Le tableau de sensibilité montre l’effet d’un demi-point de taux : un argument pour mettre les banques en concurrence.",
                },
              ]}
            />

            <section className="rounded-xl border p-6 md:p-8 shadow-sm" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                Comment les banques calculent votre capacité d’emprunt
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>La règle des 35 %.</strong> Depuis le 1er janvier 2022, la décision HCSF n° D-HCSF-2021-7 est juridiquement
                  contraignante : vos charges d’emprunt, assurance emprunteur comprise, ne doivent pas dépasser 35 % de vos revenus nets
                  avant impôt, et la durée du prêt ne doit pas dépasser 25 ans (27 ans en cas de différé lié à une livraison différée,
                  dans le neuf). Les banques peuvent déroger pour 20 % de leur production trimestrielle, en priorité pour la résidence
                  principale et les primo-accédants.
                </p>
                <p>
                  <strong>La formule.</strong> Mensualité maximale = 35 % × (salaires nets + 70 % des loyers) − crédits en cours. Le
                  capital se déduit ensuite de la mensualité : Capital = Mensualité ÷ (facteur d’annuité + taux d’assurance ÷ 12). À taux
                  zéro, le facteur d’annuité vaut simplement 1 ÷ nombre de mensualités.
                </p>
                <p>
                  <strong>Les loyers.</strong> La décision HCSF prévoit de retenir les loyers bruts diminués d’une décote fixée par le
                  prêteur. La pondération à 70 % est la pratique la plus répandue, mais certaines banques raisonnent en différentiel
                  (loyer × 70 % − mensualité du bien loué).
                </p>
                <p>
                  <strong>Au-delà du calcul.</strong> L’apport (10 % du prix au minimum en pratique, pour couvrir les frais), la
                  stabilité de l’emploi, la tenue des comptes et le reste à vivre pèsent autant que le ratio. Ce simulateur donne une
                  estimation ; seule une offre de prêt engage la banque.
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus posées sur la capacité d’emprunt immobilier."
              items={[
                {
                  question: "Comment calculer sa capacité d’emprunt ?",
                  answer:
                    "Multipliez vos revenus nets mensuels avant impôt (plus 70 % de vos loyers perçus) par 35 %, puis retirez vos mensualités de crédits en cours : vous obtenez la mensualité maximale, assurance comprise. Le capital empruntable dépend ensuite du taux, de la durée et de l’assurance. Exemple : 1 050 € par mois sur 25 ans à 3,35 % avec une assurance à 0,30 % permettent d’emprunter environ 202 900 €.",
                },
                {
                  question: "Combien puis-je emprunter avec 3 000 euros par mois ?",
                  answer:
                    "Avec 3 000 € nets par mois et aucun autre crédit, la mensualité maximale est de 1 050 € (35 %). Avec une assurance à 0,30 % et les taux moyens d’août 2026, cela représente environ 145 400 € sur 15 ans (3,14 %), 177 000 € sur 20 ans (3,27 %) et 202 900 € sur 25 ans (3,35 %), hors apport.",
                },
                {
                  question: "Et avec 2 000 ou 4 000 euros par mois ?",
                  answer:
                    "Sur 25 ans à 3,35 % avec une assurance à 0,30 % : environ 135 200 € avec 2 000 € nets par mois (mensualité de 700 €) et environ 270 500 € avec 4 000 € (mensualité de 1 400 €). Ajoutez votre apport pour obtenir le budget total, frais de notaire inclus.",
                },
                {
                  question: "L’assurance emprunteur est-elle comptée dans les 35 % ?",
                  answer:
                    "Oui. Depuis la décision du HCSF de 2021, les charges d’emprunt prises en compte incluent l’assurance emprunteur. Une assurance moins chère, par exemple via une délégation, libère donc de la mensualité pour le capital et augmente votre capacité d’emprunt.",
                },
                {
                  question: "Les revenus locatifs sont-ils pris en compte ?",
                  answer:
                    "Oui, mais pas en totalité. La réglementation laisse chaque banque appliquer une décote sur les loyers bruts ; la pratique courante est de retenir 70 % des loyers, pour tenir compte de la vacance et des charges. Certaines banques utilisent plutôt la méthode du différentiel.",
                },
                {
                  question: "Peut-on emprunter sur 27 ou 30 ans en 2026 ?",
                  answer:
                    "La durée maximale est de 25 ans. Elle peut atteindre 27 ans uniquement lorsqu’un différé d’amortissement est lié à une livraison différée du logement (achat dans le neuf, construction), l’amortissement restant limité à 25 ans. Les prêts sur 30 ans ne sont possibles que dans le cadre de la marge de dérogation de 20 % des banques.",
                },
                {
                  question: "Qu’est-ce que le reste à vivre ?",
                  answer:
                    "C’est la somme qui reste chaque mois une fois toutes les mensualités de crédit payées. Aucun texte ne fixe de minimum : chaque banque a sa grille. On retient souvent des repères de l’ordre de 800 € par adulte et 300 € par enfant, davantage en région parisienne.",
                },
                {
                  question: "Le simulateur inclut-il les frais de notaire ?",
                  answer:
                    "Il en donne une estimation pour convertir votre budget total en prix de bien : environ 7,5 % dans l’ancien et 2,5 % dans le neuf. Pour un calcul précis, utilisez le calculateur de frais de notaire d’Outilis.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Repères 2026</h3>
              <ul className="mt-2 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Endettement max HCSF : 35 % (assurance comprise)</li>
                <li>Durée max : 25 ans (27 ans avec différé dans le neuf)</li>
                <li>Dérogations : 20 % de la production des banques</li>
                <li>Taux moyens août 2026 : 3,14 % (15 ans), 3,27 % (20 ans), 3,35 % (25 ans)</li>
                <li>Loyers : retenus à 70 % en pratique</li>
              </ul>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>Sources : décision HCSF D-HCSF-2021-7, Observatoire Crédit Logement/CSA.</p>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  decimal,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  decimal?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
        {label}
        <input
          type="text"
          inputMode={decimal ? "decimal" : "numeric"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border px-4 py-3 text-base font-normal focus:outline-none focus:ring-2"
          style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
        />
      </label>
      {hint && (
        <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-full border px-4 py-2 text-sm font-semibold transition-all hover:opacity-80"
      style={{
        borderColor: active ? "var(--primary)" : "var(--border)",
        color: active ? "var(--primary)" : "var(--muted)",
        background: active ? "rgba(13,79,60,0.06)" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, sub, primary }: { label: string; value: string; sub?: string; primary?: boolean }) {
  return (
    <div className="rounded-2xl border p-5 text-center shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-sm" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="mt-1 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: primary ? "var(--primary)" : "var(--foreground)" }}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>{sub}</p>}
    </div>
  );
}

function Row({ label, value, highlight, primary }: { label: string; value: string; highlight?: boolean; primary?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg px-4 py-2.5" style={highlight ? { background: "var(--surface-alt)" } : {}}>
      <span className="text-sm" style={{ color: "var(--muted)" }}>{label}</span>
      <span
        className={`text-right font-semibold ${primary ? "text-lg" : ""}`}
        style={{ color: primary ? "var(--primary)" : "var(--foreground)", fontFamily: primary ? "var(--font-display)" : undefined }}
      >
        {value}
      </span>
    </div>
  );
}

function CrossLinkCard({ href, emoji, title, desc }: { href: string; emoji: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {title} <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
