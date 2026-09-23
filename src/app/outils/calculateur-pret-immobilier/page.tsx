"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const PRESETS_PRIX = [
  { label: "Studio", value: 150000 },
  { label: "T2 province", value: 220000 },
  { label: "T3 grande ville", value: 400000 },
  { label: "Maison", value: 650000 },
];

const PRIX_MIN = 80000;
const PRIX_MAX = 1500000;
const PRIX_STEP = 5000;

export default function CalculateurPret() {
  const [capital, setCapital] = useState("200000");
  const [taux, setTaux] = useState("3.5");
  const [duree, setDuree] = useState("20");
  const [apport, setApport] = useState("20000");
  const [tauxAssurance, setTauxAssurance] = useState("0.34");

  const result = useMemo(() => {
    const c = (parseFloat(capital) || 0) - (parseFloat(apport) || 0);
    const r = (parseFloat(taux) || 0) / 100 / 12;
    const n = (parseFloat(duree) || 1) * 12;
    if (c <= 0 || r < 0 || n <= 0) return null;

    // Taux a 0 % : remboursement lineaire du capital
    const mensualiteHorsAssurance = r === 0 ? c / n : (c * r) / (1 - Math.pow(1 + r, -n));
    const assuranceMensuelle = (c * (parseFloat(tauxAssurance) || 0) / 100) / 12;
    const mensualite = mensualiteHorsAssurance + assuranceMensuelle;
    const coutTotal = mensualiteHorsAssurance * n;
    const interetsTotal = coutTotal - c;
    const coutAssuranceTotal = assuranceMensuelle * n;

    const annualSummary: { year: number; capital: number; interets: number; restant: number }[] = [];
    let restant = c;
    for (let y = 1; y <= parseFloat(duree); y++) {
      let capitalAn = 0;
      let interetsAn = 0;
      for (let m = 0; m < 12; m++) {
        const interet = restant * r;
        // L'assurance ne rembourse pas de capital : on amortit avec la mensualite hors assurance
        const capitalM = mensualiteHorsAssurance - interet;
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

    return { mensualite, mensualiteHorsAssurance, assuranceMensuelle, coutTotal, interetsTotal, coutAssuranceTotal, emprunt: c, annualSummary };
  }, [capital, taux, duree, apport, tauxAssurance]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, rgba(13,79,60,0.04), var(--surface))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1
            className="animate-fade-up text-3xl font-extrabold md:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
          >
            Simulateur de prêt immobilier 2026
          </h1>
          <p
            className="animate-fade-up stagger-1 mt-2 max-w-3xl"
            style={{ color: "var(--muted)" }}
          >
            Calculez vos mensualités, le coût total des intérêts, l&apos;assurance emprunteur et visualisez le
            tableau d&apos;amortissement annuel. Données à jour avec les taux moyens 2026 et le seuil
            d&apos;endettement HCSF de 35 %.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div
              className="animate-fade-up stagger-2 rounded-2xl border p-6 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              {/* Prix du bien : input principal avec slider + presets */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Prix du bien
                </label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>&euro;</span>
                </div>
                {/* Slider */}
                <input
                  type="range"
                  min={PRIX_MIN}
                  max={PRIX_MAX}
                  step={PRIX_STEP}
                  value={Math.min(Math.max(parseFloat(capital) || 0, PRIX_MIN), PRIX_MAX)}
                  onChange={(e) => setCapital(e.target.value)}
                  className="mt-3 w-full accent-[#0d4f3c]"
                  aria-label="Curseur prix du bien"
                />
                {/* Presets */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS_PRIX.map((p) => {
                    const isActive = parseFloat(capital) === p.value;
                    return (
                      <button
                        key={p.label}
                        onClick={() => setCapital(String(p.value))}
                        className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                        style={{
                          borderColor: isActive ? "var(--primary)" : "var(--border)",
                          color: isActive ? "var(--primary)" : "var(--muted)",
                          background: isActive ? "rgba(13,79,60,0.06)" : "transparent",
                        }}
                      >
                        {p.label}{" "}
                        <span style={{ color: isActive ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                          {p.value.toLocaleString("fr-FR")} €
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Autres champs */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Apport personnel (&euro;)" value={apport} onChange={setApport} />
                <Field label="Taux d'intérêt (%)" value={taux} onChange={setTaux} step="0.1" />
                <Field label="Durée (années)" value={duree} onChange={setDuree} />
                <Field label="Assurance emprunteur (%)" value={tauxAssurance} onChange={setTauxAssurance} step="0.01" />
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard label="Mensualité totale" value={`${fmt(result.mensualite)} €`} primary />
                  <StatCard label="Dont assurance" value={`${fmt(result.assuranceMensuelle)} €/mois`} />
                  <StatCard label="Coût total intérêts" value={`${fmt(result.interetsTotal)} €`} />
                  <StatCard label="Coût total assurance" value={`${fmt(result.coutAssuranceTotal)} €`} />
                </div>

                {/* Donut + repartition + cartes contextuelles */}
                <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                    Répartition du coût total
                  </h2>
                  <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                    <div className="flex justify-center">
                      <DonutChart
                        capital={result.emprunt}
                        interets={result.interetsTotal}
                        assurance={result.coutAssuranceTotal}
                      />
                    </div>
                    <div className="space-y-1">
                      <Row label="Capital emprunté" value={`${fmt(result.emprunt)} €`} dotColor="#0d4f3c" />
                      <Row label="Intérêts totaux" value={`${fmt(result.interetsTotal)} €`} sub dotColor="#dc2626" />
                      <Row label="Assurance totale" value={`${fmt(result.coutAssuranceTotal)} €`} sub dotColor="#e8963e" />
                      <Row
                        label="Coût total du crédit"
                        value={`${fmt(result.emprunt + result.interetsTotal + result.coutAssuranceTotal)} €`}
                        highlight
                        primary
                      />
                    </div>
                  </div>

                  {/* Cartes contextuelles HCSF + cout */}
                  {(() => {
                    const prixBien = parseFloat(capital) || 0;
                    const revenuMinHCSF = result.mensualite / 0.35;
                    const surcoutCredit = result.interetsTotal + result.coutAssuranceTotal;
                    const ratioSurcout = prixBien > 0 ? (surcoutCredit / prixBien) * 100 : 0;
                    return (
                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                            Capacité HCSF 35%
                          </p>
                          <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                            {fmt(revenuMinHCSF)} &euro;/mois
                          </p>
                          <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                            Revenu net mensuel minimum recommandé pour respecter le seuil de 35% d&apos;endettement (mensualité assurance comprise).
                          </p>
                        </div>
                        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                            Surcoût du crédit
                          </p>
                          <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: ratioSurcout >= 30 ? "#dc2626" : "var(--primary)" }}>
                            {ratioSurcout.toFixed(1)}% du prix
                          </p>
                          <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                            {ratioSurcout < 15 && "Coût maîtrisé — durée courte ou taux bas."}
                            {ratioSurcout >= 15 && ratioSurcout < 30 && `Vous payez ${fmt(surcoutCredit)} € en plus du prix d'achat.`}
                            {ratioSurcout >= 30 && `Coût élevé : ${fmt(surcoutCredit)} € d'intérêts+assurance. Réduisez la durée si possible.`}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Cross-link CTAs */}
                <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                    Vous pourriez aussi vouloir
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <CrossLinkCard
                      href="/outils/calculateur-frais-notaire"
                      emoji="🏛️"
                      title="Frais de notaire"
                      desc="Estimer le budget total de l'achat"
                    />
                    <CrossLinkCard
                      href="/outils/calculateur-rachat-credit"
                      emoji="🔄"
                      title="Rachat de crédit"
                      desc="Renégocier votre taux et économiser"
                    />
                    <CrossLinkCard
                      href="/outils/simulateur-ptz-2026"
                      emoji="🆓"
                      title="PTZ 2026"
                      desc="Prêt à taux zéro pour primo-accédant"
                    />
                  </div>
                </div>

                <div
                  className="rounded-2xl border p-6 shadow-sm"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <h2
                    className="text-lg font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Tableau d&apos;amortissement
                  </h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                          <th className="pb-2 pr-4">Année</th>
                          <th className="pb-2 pr-4 text-right">Capital remboursé</th>
                          <th className="pb-2 pr-4 text-right">Intérêts payés</th>
                          <th className="pb-2 text-right">Capital restant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.annualSummary.map((row) => (
                          <tr key={row.year} className="border-b" style={{ borderColor: "var(--border)" }}>
                            <td className="py-2 pr-4 font-medium" style={{ color: "var(--foreground)" }}>{row.year}</td>
                            <td className="py-2 pr-4 text-right" style={{ color: "var(--foreground)" }}>{fmt(row.capital)} &euro;</td>
                            <td className="py-2 pr-4 text-right" style={{ color: "var(--muted)" }}>{fmt(row.interets)} &euro;</td>
                            <td className="py-2 text-right" style={{ color: "var(--foreground)" }}>{fmt(row.restant)} &euro;</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            <ToolHowToSection
              title="Comment simuler un prêt immobilier en 5 étapes"
              description="Le simulateur applique la formule mathématique standard utilisée par toutes les banques. Aucune donnée saisie n'est envoyée : tout est calculé dans votre navigateur."
              steps={[
                {
                  name: "Renseigner le prix du bien",
                  text:
                    "Saisissez le prix d'achat hors frais de notaire. Pour un achat dans l'ancien, prévoyez environ 7,5 % de frais en plus (notaire, garantie, droits de mutation). Pour le neuf, comptez environ 2,5 à 3 %.",
                },
                {
                  name: "Indiquer votre apport personnel",
                  text:
                    "L'apport sert à couvrir les frais et à rassurer la banque. Depuis le durcissement HCSF de 2022, un apport de 10 à 20 % du prix est devenu la norme pour obtenir un dossier accepté.",
                },
                {
                  name: "Saisir le taux d'intérêt et la durée",
                  text:
                    "Renseignez le taux nominal annuel (hors assurance). En 2026, les taux moyens varient de 3,1 % sur 15 ans à 3,6 % sur 25 ans selon Observatoire Crédit Logement / CSA. La durée maximale autorisée par le HCSF est de 25 ans (27 ans dans le neuf avec différé de 2 ans).",
                },
                {
                  name: "Ajouter l'assurance emprunteur",
                  text:
                    "L'assurance représente 0,15 à 0,55 % par an du capital emprunté selon votre âge et votre état de santé. Depuis la loi Lemoine (2022), vous pouvez en changer à tout moment, sans frais ni pénalité.",
                },
                {
                  name: "Analyser le tableau d'amortissement",
                  text:
                    "Le tableau détaille année par année la part capital remboursée et la part intérêts. Sur les premières années, plus de la moitié de chaque mensualité va aux intérêts. C'est pourquoi un remboursement anticipé avant la moitié du prêt réduit fortement le coût total.",
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
                Profils types et cas d&apos;usage
              </h2>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Les ordres de grandeur ci-dessous reposent sur les taux moyens 2026 et la règle HCSF de 35 %
                d&apos;endettement maximum.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Primo-accédant - couple, 35 ans
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Revenu net mensuel cumulé 4 500 €. Capacité d&apos;emprunt théorique : ~300 000 € sur
                    25 ans à 3,55 % avec assurance 0,30 %. Avec un apport de 30 000 €, viser un bien autour
                    de 330 000 € frais inclus. Pensez au PTZ 2026.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Investissement locatif
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour un locatif, les loyers comptent à 70 % dans le calcul d&apos;endettement (règle
                    bancaire courante). Privilégiez une durée longue (25 ans) pour maximiser le cashflow,
                    même si le coût total est plus élevé.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Renégociation ou rachat
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une renégociation devient intéressante si le nouveau taux est inférieur d&apos;au moins
                    0,7 à 1 point ET si vous êtes dans le premier tiers de la durée restante. Comparez le
                    coût total simulé avec et sans renégociation.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Investisseur senior
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Au-delà de 55 ans, l&apos;assurance emprunteur peut atteindre 0,80 % à 1,20 %, doublant
                    presque la mensualité assurance. Une délégation d&apos;assurance externe (loi Lemoine)
                    peut économiser plusieurs milliers d&apos;euros sur la durée totale.
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
                À savoir avant de signer un prêt immobilier en 2026
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>La règle HCSF.</strong> Depuis janvier 2022, le Haut Conseil de Stabilité
                  Financière impose deux règles aux banques : un taux d&apos;endettement maximum de 35 %
                  (assurance comprise) et une durée maximale de 25 ans (27 ans dans le neuf si différé).
                  Les banques peuvent y déroger pour 20 % de leur production, en priorité primo-accédants
                  et résidence principale.
                </p>
                <p>
                  <strong>TAEG vs taux nominal.</strong> Le taux que vous saisissez ici est le taux nominal.
                  Le TAEG (Taux Annuel Effectif Global) intègre en plus les frais de dossier, la garantie
                  (caution ou hypothèque) et l&apos;assurance. C&apos;est lui qui doit servir à comparer
                  deux offres bancaires - la loi impose son affichage dans toute proposition de prêt.
                </p>
                <p>
                  <strong>Assurance emprunteur (loi Lemoine).</strong> Depuis le 1er septembre 2022, vous
                  pouvez résilier et changer d&apos;assurance emprunteur à tout moment, sans frais. Les
                  délégations externes sont généralement 30 à 50 % moins chères que celles proposées par la
                  banque prêteuse, surtout pour les profils jeunes et non-fumeurs.
                </p>
                <p>
                  <strong>Frais annexes à budgétiser.</strong> Au-delà de la mensualité, prévoir : frais de
                  notaire (2,5 % neuf, 7,5 % ancien), frais de dossier (0 à 1 500 €), garantie (1 % du
                  capital pour une caution Crédit Logement, 1,5 à 2 % pour une hypothèque), frais de courtage
                  éventuels (0,8 à 1 %).
                </p>
                <p>
                  <strong>Source des taux.</strong> Les taux moyens cités proviennent de l&apos;Observatoire
                  Crédit Logement / CSA, référence du marché français. Vérifiez toujours le taux négocié
                  avec votre conseiller bancaire avant décision finale.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posées sur la simulation et le crédit immobilier."
              items={[
                {
                  question: "Comment se calcule la mensualité d'un prêt immobilier ?",
                  answer:
                    "La formule mathématique est M = C x r / (1 - (1+r)^-n) où C est le capital emprunté, r le taux périodique mensuel (taux annuel / 12 / 100) et n le nombre de mensualités. Cette formule produit une mensualité constante : c'est le prêt à échéances constantes, qui est la norme en France.",
                },
                {
                  question: "Quel salaire pour emprunter 200 000 € sur 20 ans en 2026 ?",
                  answer:
                    "À 3,4 % sur 20 ans avec une assurance 0,30 %, la mensualité est d'environ 1 200 €. Avec la règle HCSF de 35 % d'endettement, le revenu net mensuel nécessaire est d'environ 3 430 € (1 200 / 0,35).",
                },
                {
                  question: "Le simulateur prend-il en compte les frais de notaire ?",
                  answer:
                    "Non. Le simulateur calcule uniquement la mensualité du prêt bancaire. Pour estimer les frais de notaire (2,5 % dans le neuf, 7,5 % dans l'ancien), augmentez le 'Prix du bien' de ce pourcentage si vous comptez les financer par le prêt, ou déduisez-les de votre apport.",
                },
                {
                  question: "Faut-il rallonger ou raccourcir la durée pour réduire le coût total ?",
                  answer:
                    "Mathématiquement, plus la durée est courte, moins le coût total des intérêts est élevé. Passer de 25 ans à 20 ans peut économiser plusieurs dizaines de milliers d'euros sur le coût total. Mais une durée plus courte augmente la mensualité et peut faire dépasser le seuil HCSF de 35 %.",
                },
                {
                  question: "Puis-je rembourser par anticipation sans frais ?",
                  answer:
                    "Le Code de la consommation autorise des Indemnités de Remboursement Anticipé (IRA) plafonnées à 6 mois d'intérêts ou 3 % du capital restant. Beaucoup de banques négocient une exonération en cas de mobilité professionnelle ou de chômage. Vérifiez la clause IRA dans votre offre.",
                },
                {
                  question: "L'assurance emprunteur est-elle obligatoire ?",
                  answer:
                    "Aucun texte ne l'impose, mais aucune banque ne prête sans. Vous êtes libre du choix de l'assureur depuis la loi Lagarde (2010), et vous pouvez en changer à tout moment depuis la loi Lemoine (2022). Une délégation externe permet souvent d'économiser 30 à 50 % par rapport au contrat groupe de la banque.",
                },
                {
                  question: "Qu'est-ce que le PTZ et puis-je le simuler ici ?",
                  answer:
                    "Le Prêt à Taux Zéro finance jusqu'à 50 % de l'achat d'une résidence principale par un primo-accédant, sous conditions de ressources et de zone. Il s'ajoute à votre prêt bancaire principal. Pour le simuler, utilisez l'outil dédié 'Simulateur PTZ 2026' du site.",
                },
                {
                  question: "Le simulateur fonctionne-t-il sans inscription ?",
                  answer:
                    "Oui. Aucun compte, aucun email, aucune donnée personnelle stockée. Tous les calculs se font localement dans votre navigateur. Vous pouvez utiliser le simulateur autant de fois que nécessaire, sans limite.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div
              className="rounded-2xl border p-6 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Repères 2026</h3>
              <ul className="mt-2 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Endettement max HCSF : 35 % (assurance comprise)</li>
                <li>Durée max : 25 ans (27 ans neuf avec différé)</li>
                <li>Apport recommandé : 10 à 20 % du prix</li>
                <li>Taux moyen 20 ans : 3,4 à 3,6 %</li>
                <li>Assurance moyenne : 0,15 à 0,55 % / an</li>
              </ul>
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
  value,
  onChange,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
}

function StatCard({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div
      className="rounded-2xl border p-5 text-center shadow-sm"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <p className="text-sm" style={{ color: "var(--muted)" }}>{label}</p>
      <p
        className="mt-1 text-xl font-bold"
        style={{ color: primary ? "var(--primary)" : "var(--foreground)" }}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  primary,
  sub,
  dotColor,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  primary?: boolean;
  sub?: boolean;
  dotColor?: string;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-3"
      style={highlight ? { background: "var(--surface-alt)" } : {}}
    >
      <span className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
        {dotColor && (
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: dotColor }} />
        )}
        {label}
      </span>
      <span
        className={`font-semibold ${primary ? "text-xl" : ""} ${sub ? "" : ""}`}
        style={{
          color: primary ? "var(--primary)" : "var(--foreground)",
          fontFamily: primary ? "var(--font-display)" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function DonutChart({
  capital,
  interets,
  assurance,
}: {
  capital: number;
  interets: number;
  assurance: number;
}) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const stroke = 22;
  const total = capital + interets + assurance;
  const safeTotal = total > 0 ? total : 1;
  const capPct = Math.max(0, capital) / safeTotal;
  const intPct = Math.max(0, interets) / safeTotal;
  const assPct = Math.max(0, assurance) / safeTotal;
  const capLen = capPct * c;
  const intLen = intPct * c;
  const assLen = assPct * c;
  const interetsPctTotal = total > 0 ? (interets / total) * 100 : 0;
  return (
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Répartition du coût total du crédit">
      <circle cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <g transform="rotate(-90)">
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#0d4f3c"
          strokeWidth={stroke}
          strokeDasharray={`${capLen} ${c}`}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#dc2626"
          strokeWidth={stroke}
          strokeDasharray={`${intLen} ${c}`}
          strokeDashoffset={-capLen}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#e8963e"
          strokeWidth={stroke}
          strokeDasharray={`${assLen} ${c}`}
          strokeDashoffset={-(capLen + intLen)}
          strokeLinecap="butt"
        />
      </g>
      <text
        x="0"
        y="-4"
        textAnchor="middle"
        fontSize="10"
        fill="var(--muted)"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Intérêts
      </text>
      <text
        x="0"
        y="14"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="#dc2626"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {interetsPctTotal.toFixed(0)}%
      </text>
    </svg>
  );
}

function CrossLinkCard({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold transition-colors group-hover:text-[#0d4f3c]"
          style={{ color: "var(--foreground)" }}
        >
          {title} <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
