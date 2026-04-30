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
    if (c <= 0 || r <= 0 || n <= 0) return null;

    const mensualiteHorsAssurance = (c * r) / (1 - Math.pow(1 + r, -n));
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
            Simulateur de pret immobilier 2026
          </h1>
          <p
            className="animate-fade-up stagger-1 mt-2 max-w-3xl"
            style={{ color: "var(--muted)" }}
          >
            Calculez vos mensualites, le cout total des interets, l&apos;assurance emprunteur et visualisez le
            tableau d&apos;amortissement annuel. Donnees a jour avec les taux moyens 2026 et le seuil
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
                <Field label="Taux d'interet (%)" value={taux} onChange={setTaux} step="0.1" />
                <Field label="Duree (annees)" value={duree} onChange={setDuree} />
                <Field label="Assurance emprunteur (%)" value={tauxAssurance} onChange={setTauxAssurance} step="0.01" />
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard label="Mensualite totale" value={`${fmt(result.mensualite)} €`} primary />
                  <StatCard label="Dont assurance" value={`${fmt(result.assuranceMensuelle)} €/mois`} />
                  <StatCard label="Cout total interets" value={`${fmt(result.interetsTotal)} €`} />
                  <StatCard label="Cout total assurance" value={`${fmt(result.coutAssuranceTotal)} €`} />
                </div>

                {/* Donut + repartition + cartes contextuelles */}
                <div className="rounded-2xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                    Repartition du cout total
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
                      <Row label="Capital emprunte" value={`${fmt(result.emprunt)} €`} dotColor="#0d4f3c" />
                      <Row label="Interets totaux" value={`${fmt(result.interetsTotal)} €`} sub dotColor="#dc2626" />
                      <Row label="Assurance totale" value={`${fmt(result.coutAssuranceTotal)} €`} sub dotColor="#e8963e" />
                      <Row
                        label="Cout total du credit"
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
                            Capacite HCSF 35%
                          </p>
                          <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                            {fmt(revenuMinHCSF)} &euro;/mois
                          </p>
                          <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                            Revenu net mensuel minimum recommande pour respecter le seuil de 35% d&apos;endettement (mensualite assurance comprise).
                          </p>
                        </div>
                        <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                            Surcout du credit
                          </p>
                          <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: ratioSurcout >= 30 ? "#dc2626" : "var(--primary)" }}>
                            {ratioSurcout.toFixed(1)}% du prix
                          </p>
                          <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                            {ratioSurcout < 15 && "Cout maitrise — duree courte ou taux bas."}
                            {ratioSurcout >= 15 && ratioSurcout < 30 && `Vous payez ${fmt(surcoutCredit)} € en plus du prix d'achat.`}
                            {ratioSurcout >= 30 && `Cout eleve : ${fmt(surcoutCredit)} € d'interets+assurance. Reduisez la duree si possible.`}
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
                      title="Rachat de credit"
                      desc="Renegocier votre taux et economiser"
                    />
                    <CrossLinkCard
                      href="/outils/simulateur-ptz-2026"
                      emoji="🆓"
                      title="PTZ 2026"
                      desc="Pret a taux zero pour primo-accedant"
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
                          <th className="pb-2 pr-4">Annee</th>
                          <th className="pb-2 pr-4 text-right">Capital rembourse</th>
                          <th className="pb-2 pr-4 text-right">Interets payes</th>
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
              title="Comment simuler un pret immobilier en 5 etapes"
              description="Le simulateur applique la formule mathematique standard utilisee par toutes les banques. Aucune donnee saisie n'est envoyee : tout est calcule dans votre navigateur."
              steps={[
                {
                  name: "Renseigner le prix du bien",
                  text:
                    "Saisissez le prix d'achat hors frais de notaire. Pour un achat dans l'ancien, prevoyez environ 7,5 % de frais en plus (notaire, garantie, droits de mutation). Pour le neuf, comptez environ 2,5 a 3 %.",
                },
                {
                  name: "Indiquer votre apport personnel",
                  text:
                    "L'apport sert a couvrir les frais et a rassurer la banque. Depuis le durcissement HCSF de 2022, un apport de 10 a 20 % du prix est devenu la norme pour obtenir un dossier accepte.",
                },
                {
                  name: "Saisir le taux d'interet et la duree",
                  text:
                    "Renseignez le taux nominal annuel (hors assurance). En 2026, les taux moyens varient de 3,1 % sur 15 ans a 3,6 % sur 25 ans selon Observatoire Credit Logement / CSA. La duree maximale autorisee par le HCSF est de 25 ans (27 ans dans le neuf avec differe de 2 ans).",
                },
                {
                  name: "Ajouter l'assurance emprunteur",
                  text:
                    "L'assurance represente 0,15 a 0,55 % par an du capital emprunte selon votre age et votre etat de sante. Depuis la loi Lemoine (2022), vous pouvez en changer a tout moment, sans frais ni penalite.",
                },
                {
                  name: "Analyser le tableau d'amortissement",
                  text:
                    "Le tableau detaille annee par annee la part capital remboursee et la part interets. Sur les premieres annees, plus de la moitie de chaque mensualite va aux interets. C'est pourquoi un remboursement anticipe avant la moitie du pret reduit fortement le cout total.",
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
                Les ordres de grandeur ci-dessous reposent sur les taux moyens 2026 et la regle HCSF de 35 %
                d&apos;endettement maximum.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Primo-accedant - couple, 35 ans
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Revenu net mensuel cumule 4 500 EUR. Capacite d&apos;emprunt theorique : ~310 000 EUR sur
                    25 ans a 3,55 % avec assurance 0,30 %. Avec un apport de 30 000 EUR, viser un bien autour
                    de 320 000 EUR frais inclus. Pensez au PTZ 2026.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Investissement locatif
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour un locatif, les loyers comptent a 70 % dans le calcul d&apos;endettement (regle
                    bancaire courante). Privilegiez une duree longue (25 ans) pour maximiser le cashflow,
                    meme si le cout total est plus eleve.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Renegociation ou rachat
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une renegociation devient interessante si le nouveau taux est inferieur d&apos;au moins
                    0,7 a 1 point ET si vous etes dans le premier tiers de la duree restante. Comparez le
                    cout total simule avec et sans renegociation.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Investisseur senior
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Au-dela de 55 ans, l&apos;assurance emprunteur peut atteindre 0,80 % a 1,20 %, doublant
                    presque la mensualite assurance. Une delegation d&apos;assurance externe (loi Lemoine)
                    peut economiser plusieurs milliers d&apos;euros sur la duree totale.
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
                A savoir avant de signer un pret immobilier en 2026
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>La regle HCSF.</strong> Depuis janvier 2022, le Haut Conseil de Stabilite
                  Financiere impose deux regles aux banques : un taux d&apos;endettement maximum de 35 %
                  (assurance comprise) et une duree maximale de 25 ans (27 ans dans le neuf si differe).
                  Les banques peuvent y deroger pour 20 % de leur production, en priorite primo-accedants
                  et residence principale.
                </p>
                <p>
                  <strong>TAEG vs taux nominal.</strong> Le taux que vous saisissez ici est le taux nominal.
                  Le TAEG (Taux Annuel Effectif Global) integre en plus les frais de dossier, la garantie
                  (caution ou hypotheque) et l&apos;assurance. C&apos;est lui qui doit servir a comparer
                  deux offres bancaires - la loi impose son affichage dans toute proposition de pret.
                </p>
                <p>
                  <strong>Assurance emprunteur (loi Lemoine).</strong> Depuis le 1er septembre 2022, vous
                  pouvez resilier et changer d&apos;assurance emprunteur a tout moment, sans frais. Les
                  delegations externes sont generalement 30 a 50 % moins cheres que celles proposees par la
                  banque preteuse, surtout pour les profils jeunes et non-fumeurs.
                </p>
                <p>
                  <strong>Frais annexes a budgetiser.</strong> Au-dela de la mensualite, prevoir : frais de
                  notaire (2,5 % neuf, 7,5 % ancien), frais de dossier (0 a 1 500 EUR), garantie (1 % du
                  capital pour une caution Credit Logement, 1,5 a 2 % pour une hypotheque), frais de courtage
                  eventuels (0,8 a 1 %).
                </p>
                <p>
                  <strong>Source des taux.</strong> Les taux moyens cites proviennent de l&apos;Observatoire
                  Credit Logement / CSA, reference du marche francais. Verifiez toujours le taux negocie
                  avec votre conseiller bancaire avant decision finale.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur la simulation et le credit immobilier."
              items={[
                {
                  question: "Comment se calcule la mensualite d'un pret immobilier ?",
                  answer:
                    "La formule mathematique est M = C x r / (1 - (1+r)^-n) ou C est le capital emprunte, r le taux periodique mensuel (taux annuel / 12 / 100) et n le nombre de mensualites. Cette formule produit une mensualite constante : c'est le pret a echeances constantes, qui est la norme en France.",
                },
                {
                  question: "Quel salaire pour emprunter 200 000 EUR sur 20 ans en 2026 ?",
                  answer:
                    "A 3,4 % sur 20 ans avec une assurance 0,30 %, la mensualite est d'environ 1 200 EUR. Avec la regle HCSF de 35 % d'endettement, le revenu net mensuel necessaire est d'environ 3 430 EUR (1 200 / 0,35). En couple, comptez ~3 000 EUR net cumule grace a la mutualisation des charges.",
                },
                {
                  question: "Le simulateur prend-il en compte les frais de notaire ?",
                  answer:
                    "Non. Le simulateur calcule uniquement la mensualite du pret bancaire. Pour estimer les frais de notaire (2,5 % dans le neuf, 7,5 % dans l'ancien), augmentez le 'Prix du bien' de ce pourcentage si vous comptez les financer par le pret, ou deduisez-les de votre apport.",
                },
                {
                  question: "Faut-il rallonger ou raccourcir la duree pour reduire le cout total ?",
                  answer:
                    "Mathematiquement, plus la duree est courte, moins le cout total des interets est eleve. Passer de 25 ans a 20 ans peut economiser plusieurs dizaines de milliers d'euros sur le cout total. Mais une duree plus courte augmente la mensualite et peut faire dépasser le seuil HCSF de 35 %.",
                },
                {
                  question: "Puis-je rembourser par anticipation sans frais ?",
                  answer:
                    "Le Code de la consommation autorise des Indemnites de Remboursement Anticipe (IRA) plafonnees a 6 mois d'interets ou 3 % du capital restant. Beaucoup de banques negocient une exoneration en cas de mobilite professionnelle ou de chomage. Verifiez la clause IRA dans votre offre.",
                },
                {
                  question: "L'assurance emprunteur est-elle obligatoire ?",
                  answer:
                    "Aucun texte ne l'impose, mais aucune banque ne prete sans. Vous etes libre du choix de l'assureur depuis la loi Lagarde (2010), et vous pouvez en changer a tout moment depuis la loi Lemoine (2022). Une delegation externe permet souvent d'economiser 30 a 50 % par rapport au contrat groupe de la banque.",
                },
                {
                  question: "Qu'est-ce que le PTZ et puis-je le simuler ici ?",
                  answer:
                    "Le Pret a Taux Zero finance jusqu'a 50 % de l'achat d'une residence principale par un primo-accedant, sous conditions de ressources et de zone. Il s'ajoute a votre pret bancaire principal. Pour le simuler, utilisez l'outil dedie 'Simulateur PTZ 2026' du site.",
                },
                {
                  question: "Le simulateur fonctionne-t-il sans inscription ?",
                  answer:
                    "Oui. Aucun compte, aucun email, aucune donnee personnelle stockee. Tous les calculs se font localement dans votre navigateur. Vous pouvez utiliser le simulateur autant de fois que necessaire, sans limite.",
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
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Reperes 2026</h3>
              <ul className="mt-2 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Endettement max HCSF : 35 % (assurance comprise)</li>
                <li>Duree max : 25 ans (27 ans neuf avec differe)</li>
                <li>Apport recommande : 10 a 20 % du prix</li>
                <li>Taux moyen 20 ans : 3,4 a 3,6 %</li>
                <li>Assurance moyenne : 0,15 a 0,55 % / an</li>
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
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Repartition du cout total du credit">
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
        Interets
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
