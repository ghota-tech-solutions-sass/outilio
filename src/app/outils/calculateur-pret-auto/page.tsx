"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

export default function CalculateurPretAuto() {
  const [prix, setPrix] = useState("25000");
  const [apport, setApport] = useState("5000");
  const [taux, setTaux] = useState("5.5");
  const [duree, setDuree] = useState("5");

  const result = useMemo(() => {
    const c = (parseFloat(prix) || 0) - (parseFloat(apport) || 0);
    const r = (parseFloat(taux) || 0) / 100 / 12;
    const n = (parseFloat(duree) || 1) * 12;
    if (c <= 0 || r <= 0 || n <= 0) return null;

    const mensualite = (c * r) / (1 - Math.pow(1 + r, -n));
    const coutTotal = mensualite * n;
    const interetsTotal = coutTotal - c;

    const annualSummary: { year: number; capital: number; interets: number; restant: number }[] = [];
    let restant = c;
    for (let y = 1; y <= parseFloat(duree); y++) {
      let capitalAn = 0;
      let interetsAn = 0;
      for (let m = 0; m < 12; m++) {
        const interet = restant * r;
        const capitalM = mensualite - interet;
        capitalAn += capitalM;
        interetsAn += interet;
        restant -= capitalM;
      }
      annualSummary.push({
        year: y,
        capital: capitalAn,
        interets: interetsAn,
        restant: Math.max(0, restant),
      });
    }

    return { mensualite, coutTotal, interetsTotal, emprunt: c, annualSummary };
  }, [prix, taux, duree, apport]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>pret auto</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Simulez votre credit automobile : mensualites, cout total et tableau d&apos;amortissement complet.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parametres du credit</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix du vehicule (&euro;)</label>
                  <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Apport personnel (&euro;)</label>
                  <input type="number" value={apport} onChange={(e) => setApport(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux d&apos;interet (%)</label>
                  <input type="number" step="0.1" value={taux} onChange={(e) => setTaux(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Duree (annees)</label>
                  <select value={duree} onChange={(e) => setDuree(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((y) => (
                      <option key={y} value={y}>{y} an{y > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Mensualite</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.mensualite)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Cout total des interets</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.interetsTotal)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant emprunte</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.emprunt)} &euro;</p>
                  </div>
                </div>

                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Tableau d&apos;amortissement</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>
                          <th className="pb-2 pr-4 text-left text-xs font-semibold uppercase tracking-wider">Annee</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Capital rembourse</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Interets payes</th>
                          <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider">Capital restant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.annualSummary.map((row) => (
                          <tr key={row.year} style={{ borderBottom: "1px solid var(--border)" }}>
                            <td className="py-3 pr-4 font-semibold">{row.year}</td>
                            <td className="py-3 pr-4 text-right">{fmt(row.capital)} &euro;</td>
                            <td className="py-3 pr-4 text-right" style={{ color: "var(--muted)" }}>{fmt(row.interets)} &euro;</td>
                            <td className="py-3 text-right font-semibold">{fmt(row.restant)} &euro;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Visual bar */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Repartition du cout</h2>
                  <div className="mt-4 flex h-6 overflow-hidden rounded-full">
                    <div style={{ width: `${(result.emprunt / result.coutTotal) * 100}%`, background: "var(--primary)" }} />
                    <div style={{ width: `${(result.interetsTotal / result.coutTotal) * 100}%`, background: "var(--accent)" }} />
                  </div>
                  <div className="mt-3 flex justify-between text-xs font-semibold">
                    <span style={{ color: "var(--primary)" }}>Capital : {fmt(result.emprunt)} &euro;</span>
                    <span style={{ color: "var(--accent)" }}>Interets : {fmt(result.interetsTotal)} &euro;</span>
                  </div>
                </div>
              </>
            )}

            <ToolHowToSection
              title="Comment simuler votre credit auto en 4 etapes"
              description="Le simulateur applique la formule mathematique standard utilisee par les banques et organismes de credit. Aucune donnee saisie n'est envoyee."
              steps={[
                {
                  name: "Saisir le prix du vehicule",
                  text:
                    "Renseignez le prix d'achat affiche par le vendeur, hors options ajoutees apres signature. Pour un vehicule d'occasion, le prix integre la plupart du temps les frais de mise en main du concessionnaire.",
                },
                {
                  name: "Indiquer votre apport personnel",
                  text:
                    "Un apport de 10 a 30 % du prix d'achat est recommande. Il rassure le preteur, reduit le capital emprunte et donc le cout total des interets. Sans apport, certains organismes refusent ou appliquent un taux majore.",
                },
                {
                  name: "Renseigner le taux et la duree",
                  text:
                    "Le taux nominal annuel propose en 2026 oscille entre 4 % et 8 % selon votre profil, l'age du vehicule (neuf ou occasion) et la marque. La duree usuelle est de 12 a 84 mois (1 a 7 ans). Plus la duree est longue, plus la mensualite est faible mais plus le cout total grimpe.",
                },
                {
                  name: "Comparer mensualite et cout total",
                  text:
                    "L'outil affiche la mensualite, le cout total des interets et le tableau d'amortissement. Comparez plusieurs scenarios (5 ans vs 7 ans, +/- d'apport) avant de signer. La regle d'or : la mensualite + vos autres credits ne doit pas depasser 35 % de vos revenus mensuels.",
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
                Cas d&apos;usage du simulateur
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Achat neuf vs occasion
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Les taux pour un vehicule neuf sont generalement 0,5 a 1 point inferieurs a ceux pour
                    un vehicule d&apos;occasion. Simulez les deux scenarios pour evaluer si la baisse de
                    prix d&apos;achat de l&apos;occasion compense le surcout du credit.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Comparer concessionnaire vs banque
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Le credit propose en concession est rarement le moins cher : il integre souvent une
                    commission. Simulez les deux offres avec les memes parametres et comparez le TAEG, pas
                    seulement la mensualite.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Optimiser apport vs duree
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Avec 5 000 EUR de plus en apport, vous economisez plus de 1 000 EUR d&apos;interets
                    sur 5 ans (a 5,5 %). C&apos;est souvent un meilleur placement que de garder ces 5 000
                    EUR sur un Livret A.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Vehicule electrique et bonus ecologique
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour un VE eligible au bonus ecologique 2026, integrez le bonus dans votre apport
                    (deduit du prix sur facture). Les taux pour VE sont parfois bonifies par les banques
                    partenaires des constructeurs : verifiez les offres dediees.
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
                A savoir avant de signer un credit auto
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Credit affecte vs pret personnel.</strong> Le credit affecte est lie a
                  l&apos;achat du vehicule : si la vente n&apos;a pas lieu (livraison, defaut), le credit
                  est annule (Code de la consommation, art. L312-44). Le pret personnel est plus souple
                  mais sans cette protection. Lisez bien le type de credit propose.
                </p>
                <p>
                  <strong>Delai de retractation 14 jours.</strong> Comme pour tout credit a la
                  consommation, vous disposez de 14 jours calendaires pour vous retracter sans
                  justification (art. L312-19). Pendant cette periode, vous pouvez aussi changer
                  d&apos;avis sur le vehicule pour un credit affecte.
                </p>
                <p>
                  <strong>TAEG vs taux nominal.</strong> Le TAEG (Taux Annuel Effectif Global) integre
                  les frais de dossier, l&apos;assurance et les frais accessoires. C&apos;est lui qui doit
                  servir a comparer deux offres. Un taux nominal faible avec frais de dossier eleves
                  peut donner un TAEG superieur a une offre sans frais.
                </p>
                <p>
                  <strong>Assurance emprunteur (auto).</strong> Pour un credit auto, l&apos;assurance
                  emprunteur est generalement facultative. Verifiez avant de souscrire : si elle vous est
                  imposee sans choix possible, c&apos;est anormal. Les contrats decennale et tous risques
                  vehicule sont distincts et obligatoires.
                </p>
                <p>
                  <strong>Source.</strong> Les fourchettes de taux indiquees sont des moyennes 2026
                  observees dans les offres bancaires francaises. Negociez systematiquement et faites
                  jouer la concurrence avant de signer.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur le credit auto en France."
              items={[
                {
                  question: "Quel taux pour un credit auto en 2026 ?",
                  answer:
                    "En moyenne entre 4,5 % et 7,5 % selon la duree et votre profil. Les meilleurs taux sont reserves aux salaries en CDI avec apport de 20 %+ et bon historique bancaire. Les vehicules d'occasion de plus de 5 ans peuvent voir leur taux grimper a 8-10 %.",
                },
                {
                  question: "Quelle duree maximale pour un credit auto ?",
                  answer:
                    "La duree maximale courante est de 84 mois (7 ans). Au-dela, c'est rare et peu pertinent : un vehicule perd 50-60 % de sa valeur sur 7 ans, donc s'endetter au-dela peut conduire a payer un vehicule plus que sa valeur de revente. La duree typique est 4 a 5 ans.",
                },
                {
                  question: "LOA / LLD vs credit classique : que choisir ?",
                  answer:
                    "Le credit classique vous rend proprietaire (vous pouvez revendre). La LOA (Location avec Option d'Achat) propose une option de rachat en fin de contrat. La LLD (Location Longue Duree) est une location pure, sans option d'achat. Pour rester proprietaire et capitaliser, le credit est generalement preferable.",
                },
                {
                  question: "Puis-je rembourser mon credit auto par anticipation ?",
                  answer:
                    "Oui. Pour un credit a la consommation, l'indemnite de remboursement anticipe est plafonnee a 1 % du capital restant si la duree restante depasse 12 mois, 0,5 % sinon. Sous 10 000 EUR rembourses sur 12 mois glissants, aucune indemnite ne peut etre demandee.",
                },
                {
                  question: "Faut-il un apport pour obtenir un credit auto ?",
                  answer:
                    "Non, ce n'est pas obligatoire mais fortement recommande. Sans apport, certaines banques refusent ou appliquent un taux majore de 1 a 2 points. Un apport de 10 a 30 % du prix d'achat ameliore nettement les conditions et reduit le cout total des interets.",
                },
                {
                  question: "Le credit auto est-il fiscalement deductible ?",
                  answer:
                    "Pour un usage personnel : non. Pour un usage professionnel (auto-entrepreneur, profession liberale, voiture de societe), les interets et eventuellement les amortissements peuvent etre deductibles selon votre regime fiscal. Consultez un expert-comptable.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee saisie (prix, salaire, taux) n'est envoyee a un serveur ou stockee. L'outil fonctionne sans inscription.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conseils credit auto</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Comparez les offres de plusieurs banques et concessionnaires</li>
                <li>Privilegiez une duree courte pour limiter le cout total</li>
                <li>Un apport de 20% ameliore votre dossier</li>
                <li>Verifiez les frais de dossier et l&apos;assurance</li>
                <li>Le taux d&apos;endettement ne doit pas depasser 35%</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
