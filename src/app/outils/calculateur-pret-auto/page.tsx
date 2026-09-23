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
    if (c <= 0 || r < 0 || n <= 0) return null;

    // Taux a 0 % (offres promotionnelles) : remboursement lineaire du capital
    const mensualite = r === 0 ? c / n : (c * r) / (1 - Math.pow(1 + r, -n));
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
            Calculateur <span style={{ color: "var(--primary)" }}>prêt auto</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Simulez votre crédit automobile : mensualités, coût total et tableau d&apos;amortissement complet.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Paramètres du crédit</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix du véhicule (&euro;)</label>
                  <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Apport personnel (&euro;)</label>
                  <input type="number" value={apport} onChange={(e) => setApport(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux d&apos;intérêt (%)</label>
                  <input type="number" step="0.1" value={taux} onChange={(e) => setTaux(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Durée (années)</label>
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
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Mensualité</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.mensualite)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Coût total des intérêts</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.interetsTotal)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant emprunté</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.emprunt)} &euro;</p>
                  </div>
                </div>

                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Tableau d&apos;amortissement</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>
                          <th className="pb-2 pr-4 text-left text-xs font-semibold uppercase tracking-wider">Année</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Capital remboursé</th>
                          <th className="pb-2 pr-4 text-right text-xs font-semibold uppercase tracking-wider">Intérêts payés</th>
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
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Répartition du coût</h2>
                  <div className="mt-4 flex h-6 overflow-hidden rounded-full">
                    <div style={{ width: `${(result.emprunt / result.coutTotal) * 100}%`, background: "var(--primary)" }} />
                    <div style={{ width: `${(result.interetsTotal / result.coutTotal) * 100}%`, background: "var(--accent)" }} />
                  </div>
                  <div className="mt-3 flex justify-between text-xs font-semibold">
                    <span style={{ color: "var(--primary)" }}>Capital : {fmt(result.emprunt)} &euro;</span>
                    <span style={{ color: "var(--accent)" }}>Intérêts : {fmt(result.interetsTotal)} &euro;</span>
                  </div>
                </div>
              </>
            )}

            <ToolHowToSection
              title="Comment simuler votre crédit auto en 4 étapes"
              description="Le simulateur applique la formule mathématique standard utilisée par les banques et organismes de crédit. Aucune donnée saisie n'est envoyée."
              steps={[
                {
                  name: "Saisir le prix du véhicule",
                  text:
                    "Renseignez le prix d'achat affiché par le vendeur, hors options ajoutées après signature. Pour un véhicule d'occasion, le prix intègre la plupart du temps les frais de mise en main du concessionnaire.",
                },
                {
                  name: "Indiquer votre apport personnel",
                  text:
                    "Un apport de 10 à 30 % du prix d'achat est recommandé. Il rassure le prêteur, réduit le capital emprunté et donc le coût total des intérêts. Sans apport, certains organismes refusent ou appliquent un taux majoré.",
                },
                {
                  name: "Renseigner le taux et la durée",
                  text:
                    "Le taux nominal annuel proposé en 2026 oscille entre 4 % et 8 % selon votre profil, l'âge du véhicule (neuf ou occasion) et la marque. La durée usuelle est de 12 à 84 mois (1 à 7 ans). Plus la durée est longue, plus la mensualité est faible mais plus le coût total grimpe.",
                },
                {
                  name: "Comparer mensualité et coût total",
                  text:
                    "L'outil affiche la mensualité, le coût total des intérêts et le tableau d'amortissement. Comparez plusieurs scénarios (5 ans vs 7 ans, +/- d'apport) avant de signer. La règle d'or : la mensualité + vos autres crédits ne doit pas dépasser 35 % de vos revenus mensuels.",
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
                    Les taux pour un véhicule neuf sont généralement 0,5 à 1 point inférieurs à ceux pour
                    un véhicule d&apos;occasion. Simulez les deux scénarios pour évaluer si la baisse de
                    prix d&apos;achat de l&apos;occasion compense le surcoût du crédit.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Comparer concessionnaire vs banque
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Le crédit proposé en concession est rarement le moins cher : il intègre souvent une
                    commission. Simulez les deux offres avec les mêmes paramètres et comparez le TAEG, pas
                    seulement la mensualité.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Optimiser apport vs durée
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Avec 5 000 € de plus en apport, vous économisez environ 730 € d&apos;intérêts
                    sur 5 ans (à 5,5 %). C&apos;est souvent un meilleur placement que de garder ces 5 000
                    € sur un Livret A.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Véhicule électrique et prime coup de pouce
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Le bonus écologique a été remplacé depuis le 1er juillet 2025 par la prime
                    &laquo; coup de pouce véhicules particuliers électriques &raquo; (financée par les CEE) :
                    si votre VE y est éligible, intégrez-la dans votre apport. Les taux pour VE sont parfois bonifiés par les banques
                    partenaires des constructeurs : vérifiez les offres dédiées.
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
                À savoir avant de signer un crédit auto
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Crédit affecté vs prêt personnel.</strong> Le crédit affecté est lié à
                  l&apos;achat du véhicule : si la vente n&apos;a pas lieu (livraison, défaut), le crédit
                  est annulé (Code de la consommation, art. L312-44). Le prêt personnel est plus souple
                  mais sans cette protection. Lisez bien le type de crédit proposé.
                </p>
                <p>
                  <strong>Délai de rétractation 14 jours.</strong> Comme pour tout crédit à la
                  consommation, vous disposez de 14 jours calendaires pour vous rétracter sans
                  justification (art. L312-19). Pendant cette période, vous pouvez aussi changer
                  d&apos;avis sur le véhicule pour un crédit affecté.
                </p>
                <p>
                  <strong>TAEG vs taux nominal.</strong> Le TAEG (Taux Annuel Effectif Global) intègre
                  les frais de dossier, l&apos;assurance et les frais accessoires. C&apos;est lui qui doit
                  servir à comparer deux offres. Un taux nominal faible avec frais de dossier elevés
                  peut donner un TAEG supérieur à une offre sans frais.
                </p>
                <p>
                  <strong>Assurance emprunteur (auto).</strong> Pour un crédit auto, l&apos;assurance
                  emprunteur est généralement facultative. Vérifiez avant de souscrire : si elle vous est
                  imposée sans choix possible, c&apos;est anormal. L&apos;assurance auto du véhicule est un contrat
                  distinct : seule la responsabilité civile est obligatoire, la formule tous risques est
                  facultative.
                </p>
                <p>
                  <strong>Source.</strong> Les fourchettes de taux indiquées sont des moyennes 2026
                  observées dans les offres bancaires françaises. Négociez systématiquement et faites
                  jouer la concurrence avant de signer.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus fréquentes sur le crédit auto en France."
              items={[
                {
                  question: "Quel taux pour un crédit auto en 2026 ?",
                  answer:
                    "En moyenne entre 4,5 % et 7,5 % selon la durée et votre profil. Les meilleurs taux sont réservés aux salariés en CDI avec apport de 20 %+ et bon historique bancaire. Les véhicules d'occasion de plus de 5 ans peuvent voir leur taux grimper à 8-10 %.",
                },
                {
                  question: "Quelle durée maximale pour un crédit auto ?",
                  answer:
                    "La durée maximale courante est de 84 mois (7 ans). Au-delà, c'est rare et peu pertinent : un véhicule perd 50-60 % de sa valeur sur 7 ans, donc s'endetter au-delà peut conduire à payer un véhicule plus que sa valeur de revente. La durée typique est 4 à 5 ans.",
                },
                {
                  question: "LOA / LLD vs crédit classique : que choisir ?",
                  answer:
                    "Le crédit classique vous rend propriétaire (vous pouvez revendre). La LOA (Location avec Option d'Achat) propose une option de rachat en fin de contrat. La LLD (Location Longue Durée) est une location pure, sans option d'achat. Pour rester propriétaire et capitaliser, le crédit est généralement préférable.",
                },
                {
                  question: "Puis-je rembourser mon crédit auto par anticipation ?",
                  answer:
                    "Oui. Pour un crédit à la consommation, l'indemnité de remboursement anticipé est plafonnée à 1 % du capital restant si la durée restante dépasse 12 mois, 0,5 % sinon. Sous 10 000 € remboursés sur 12 mois glissants, aucune indemnité ne peut être demandée.",
                },
                {
                  question: "Faut-il un apport pour obtenir un crédit auto ?",
                  answer:
                    "Non, ce n'est pas obligatoire mais fortement recommandé. Sans apport, certaines banques refusent ou appliquent un taux majoré de 1 à 2 points. Un apport de 10 à 30 % du prix d'achat améliore nettement les conditions et réduit le coût total des intérêts.",
                },
                {
                  question: "Le crédit auto est-il fiscalement déductible ?",
                  answer:
                    "Pour un usage personnel : non. Pour un usage professionnel (auto-entrepreneur, profession libérale, voiture de société), les intérêts et éventuellement les amortissements peuvent être déductibles selon votre régime fiscal. Consultez un expert-comptable.",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont effectués localement dans votre navigateur. Aucune donnée saisie (prix, salaire, taux) n'est envoyée à un serveur ou stockée. L'outil fonctionne sans inscription.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conseils crédit auto</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Comparez les offres de plusieurs banques et concessionnaires</li>
                <li>Privilégiez une durée courte pour limiter le coût total</li>
                <li>Un apport de 20% améliore votre dossier</li>
                <li>Vérifiez les frais de dossier et l&apos;assurance</li>
                <li>Le taux d&apos;endettement ne doit pas dépasser 35%</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
