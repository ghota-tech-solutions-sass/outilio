"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const PRESETS_PRIX = [
  { label: "Studio Lyon", value: 130000 },
  { label: "T2 Marseille", value: 180000 },
  { label: "T3 Toulouse", value: 250000 },
  { label: "Maison Bordeaux", value: 450000 },
];

export default function CalculateurRentabilite() {
  const [prixAchat, setPrixAchat] = useState("200000");
  const [fraisNotaire, setFraisNotaire] = useState("8");
  const [travaux, setTravaux] = useState("10000");
  const [loyerMensuel, setLoyerMensuel] = useState("900");
  const [chargesAn, setChargesAn] = useState("1200");
  const [taxeFonciere, setTaxeFonciere] = useState("1000");
  const [assurancePNO, setAssurancePNO] = useState("200");
  const [vacanceLocative, setVacanceLocative] = useState("5");
  const [tauxCredit, setTauxCredit] = useState("3.5");
  const [dureeCredit, setDureeCredit] = useState("20");
  const [apport, setApport] = useState("20000");
  const [appreciationAn, setAppreciationAn] = useState("2");

  const result = useMemo(() => {
    const prix = parseFloat(prixAchat) || 0;
    const frais = prix * ((parseFloat(fraisNotaire) || 8) / 100);
    const travauxVal = parseFloat(travaux) || 0;
    const coutTotal = prix + frais + travauxVal;
    const loyer = parseFloat(loyerMensuel) || 0;
    const loyerAn = loyer * 12;
    const vacance = (parseFloat(vacanceLocative) || 0) / 100;
    const loyerEffectif = loyerAn * (1 - vacance);
    const charges = parseFloat(chargesAn) || 0;
    const taxe = parseFloat(taxeFonciere) || 0;
    const assurance = parseFloat(assurancePNO) || 0;
    const depensesAn = charges + taxe + assurance;

    const rentaBrute = coutTotal > 0 ? (loyerAn / coutTotal) * 100 : 0;
    const rentaNette = coutTotal > 0 ? ((loyerEffectif - depensesAn) / coutTotal) * 100 : 0;

    // Credit
    const emprunt = coutTotal - (parseFloat(apport) || 0);
    const r = (parseFloat(tauxCredit) || 3.5) / 100 / 12;
    const n = (parseFloat(dureeCredit) || 20) * 12;
    const mensualiteCredit = emprunt > 0 && r > 0 ? (emprunt * r) / (1 - Math.pow(1 + r, -n)) : 0;
    const cashflowMensuel = loyer * (1 - vacance) - depensesAn / 12 - mensualiteCredit;
    const effortEpargne = cashflowMensuel < 0 ? Math.abs(cashflowMensuel) : 0;

    // Cash-on-cash return
    const apportVal = parseFloat(apport) || 0;
    const cashflowAnnuel = cashflowMensuel * 12;
    const cashOnCash = apportVal > 0 ? (cashflowAnnuel / apportVal) * 100 : 0;

    // Appreciation annuelle
    const appreciation = (parseFloat(appreciationAn) || 0) / 100;
    const plusValueAn1 = prix * appreciation;

    return { coutTotal, frais, loyerAn, loyerEffectif, depensesAn, rentaBrute, rentaNette, mensualiteCredit, cashflowMensuel, effortEpargne, emprunt, cashOnCash, plusValueAn1, apportVal };
  }, [prixAchat, fraisNotaire, travaux, loyerMensuel, chargesAn, taxeFonciere, assurancePNO, vacanceLocative, tauxCredit, dureeCredit, apport, appreciationAn]);

  const fmt = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
  const fmtPct = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Immobilier</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Rentabilite <span style={{ color: "var(--primary)" }}>locative</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le rendement brut, net et le cashflow de votre investissement immobilier.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Acquisition */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Acquisition</h2>

              {/* Prix d'achat avec slider + presets */}
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Prix d&apos;achat
                </label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={prixAchat}
                    onChange={(e) => setPrixAchat(e.target.value)}
                    className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    placeholder="200000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>&euro;</span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={1000000}
                  step={5000}
                  value={Math.min(parseFloat(prixAchat) || 0, 1000000)}
                  onChange={(e) => setPrixAchat(e.target.value)}
                  className="mt-3 w-full accent-[#0d4f3c]"
                  aria-label="Curseur prix d'achat"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS_PRIX.map((p) => {
                    const isActive = parseFloat(prixAchat) === p.value;
                    return (
                      <button
                        key={p.label}
                        onClick={() => setPrixAchat(String(p.value))}
                        className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                        style={{
                          borderColor: isActive ? "var(--primary)" : "var(--border)",
                          color: isActive ? "var(--primary)" : "var(--muted)",
                          background: isActive ? "rgba(13,79,60,0.06)" : "transparent",
                        }}
                      >
                        {p.label}{" "}
                        <span style={{ color: isActive ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                          {p.value.toLocaleString("fr-FR")} &euro;
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Field label="Frais notaire (%)" value={fraisNotaire} onChange={setFraisNotaire} />
                <Field label="Travaux (€)" value={travaux} onChange={setTravaux} />
              </div>
            </div>

            {/* Revenus & charges */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Revenus & charges</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Field label="Loyer mensuel (€)" value={loyerMensuel} onChange={setLoyerMensuel} />
                <Field label="Vacance locative (%)" value={vacanceLocative} onChange={setVacanceLocative} />
                <Field label="Charges annuelles (€)" value={chargesAn} onChange={setChargesAn} />
                <Field label="Taxe fonciere (€)" value={taxeFonciere} onChange={setTaxeFonciere} />
                <Field label="Assurance PNO (€/an)" value={assurancePNO} onChange={setAssurancePNO} />
              </div>
            </div>

            {/* Credit */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Financement</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Field label="Apport (€)" value={apport} onChange={setApport} />
                <Field label="Taux credit (%)" value={tauxCredit} onChange={setTauxCredit} />
                <Field label="Duree (annees)" value={dureeCredit} onChange={setDureeCredit} />
                <Field label="Appreciation/an (%)" value={appreciationAn} onChange={setAppreciationAn} />
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatCard label="Renta. brute" value={`${fmtPct(result.rentaBrute)}%`}
                color={result.rentaBrute >= 7 ? "var(--primary)" : result.rentaBrute >= 5 ? "var(--accent)" : "#dc2626"} />
              <StatCard label="Renta. nette" value={`${fmtPct(result.rentaNette)}%`}
                color={result.rentaNette >= 5 ? "var(--primary)" : result.rentaNette >= 3 ? "var(--accent)" : "#dc2626"} />
              <StatCard label="Cashflow/mois" value={`${fmt(result.cashflowMensuel)} €`}
                color={result.cashflowMensuel >= 0 ? "var(--primary)" : "#dc2626"} />
              <StatCard label="Mensualite credit" value={`${fmt(result.mensualiteCredit)} €`} color="var(--foreground)" />
              <StatCard label="Cash-on-cash" value={`${fmtPct(result.cashOnCash)}%`}
                color={result.cashOnCash >= 10 ? "var(--primary)" : result.cashOnCash >= 5 ? "var(--accent)" : "#dc2626"} />
              <StatCard label="Plus-value/an" value={`${fmt(result.plusValueAn1)} €`} color="var(--accent)" />
            </div>

            {/* Visualisation Donut + cartes contextuelles */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Visualisation</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                <div className="flex justify-center">
                  <DonutChart
                    cashflow={result.cashflowMensuel}
                    charges={result.depensesAn / 12}
                    mensualite={result.mensualiteCredit}
                    rentaBrute={result.rentaBrute}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Rentabilite brute
                    </p>
                    <p
                      className="mt-1 text-3xl font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: result.rentaBrute < 4 ? "#dc2626" : result.rentaBrute < 6 ? "#e8963e" : "var(--primary)",
                      }}
                    >
                      {fmtPct(result.rentaBrute)}%
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                      {result.rentaBrute < 4 && "Faible : zone tendue ou prix surevalue."}
                      {result.rentaBrute >= 4 && result.rentaBrute < 6 && "Correct : marges classiques en grande ville."}
                      {result.rentaBrute >= 6 && "Excellent : bien au-dessus de la moyenne francaise."}
                    </p>
                  </div>
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Cash-flow mensuel
                    </p>
                    <p
                      className="mt-1 text-3xl font-bold"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: result.cashflowMensuel >= 0 ? "var(--primary)" : "#dc2626",
                      }}
                    >
                      {result.cashflowMensuel >= 0 ? "+" : ""}{fmt(result.cashflowMensuel)} &euro;
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                      {result.cashflowMensuel >= 0
                        ? "Positif : auto-finance !"
                        : `Negatif : effort d'epargne ${fmt(Math.abs(result.cashflowMensuel))} €/mois.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Bilan annuel</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Cout total acquisition" value={`${fmt(result.coutTotal)} €`} />
                <Row label="Loyers annuels bruts" value={`${fmt(result.loyerAn)} €`} />
                <Row label="Loyers effectifs (apres vacance)" value={`${fmt(result.loyerEffectif)} €`} />
                <Row label="Charges & taxes annuelles" value={`- ${fmt(result.depensesAn)} €`} />
                <Row label="Credit annuel" value={`- ${fmt(result.mensualiteCredit * 12)} €`} />
                <Row label="Cashflow annuel" value={`${fmt(result.cashflowMensuel * 12)} €`} highlight primary={result.cashflowMensuel >= 0} />
                <Row label="Plus-value estimee (an 1)" value={`+ ${fmt(result.plusValueAn1)} €`} />
                <Row label="Cash-on-cash return" value={`${fmtPct(result.cashOnCash)}%`} highlight primary={result.cashOnCash >= 0} />
                {result.effortEpargne > 0 && (
                  <Row label="Effort d'epargne mensuel" value={`${fmt(result.effortEpargne)} €`} warning />
                )}
              </div>
            </div>

            {/* Cross-link CTAs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Vous pourriez aussi vouloir
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CrossLinkCard
                  href="/outils/calculateur-pret-immobilier"
                  emoji="🏠"
                  title="Simuler le pret"
                  desc="Mensualite, taux, capacite emprunt"
                />
                <CrossLinkCard
                  href="/outils/simulateur-plus-value-immobiliere"
                  emoji="📈"
                  title="Plus-value future"
                  desc="Imposition selon duree de detention"
                />
                <CrossLinkCard
                  href="/outils/calculateur-frais-notaire"
                  emoji="🏛️"
                  title="Frais notaire"
                  desc="Ancien 7-8%, neuf VEFA 2-3%"
                />
              </div>
            </div>

            <ToolHowToSection
              title="Comment evaluer un investissement locatif"
              description="Trois etapes pour decider en quelques minutes si un bien merite une visite et une offre, ou s&apos;il faut passer."
              steps={[
                {
                  name: "Cout total d&apos;acquisition reel",
                  text:
                    "Prix d&apos;achat + frais de notaire (7-8 pourcent dans l&apos;ancien, 2-3 pourcent dans le neuf VEFA) + travaux estimes (faites passer un artisan avant l&apos;offre, pas apres). N&apos;oubliez pas les frais d&apos;agence (a la charge du vendeur ou de l&apos;acquereur selon mandat) et les eventuels frais de garantie/courtage credit.",
                },
                {
                  name: "Revenus et charges realistes",
                  text:
                    "Loyer net : verifiez la moyenne quartier sur SeLoger, LeBonCoin, ou les statistiques INSEE par commune. Vacance locative : 5 a 8 pourcent en zone tendue, 10 a 15 pourcent en zone detendue. Charges : taxe fonciere (1 a 2 mois de loyer), copropriete non recuperables (10-15 pourcent du loyer), assurance PNO obligatoire si en copropriete (loi ELAN 2018).",
                },
                {
                  name: "Comparer rentabilite nette et cash-flow",
                  text:
                    "Une rentabilite brute &gt; 7 pourcent est excellente, 5-7 pourcent correcte, &lt; 5 pourcent faible (et frequente en zone tendue). Mais c&apos;est le cash-flow qui paie vos factures : un bien peut afficher 4 pourcent de renta nette mais un cash-flow positif (ou neutre) grace au credit qui rembourse une partie du capital. C&apos;est le couple renta + cash-flow + plus-value qui compte.",
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
                Cas d&apos;usage du simulateur de rentabilite
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Studio Paris vs T3 province
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Studio 22 m2 Paris 11e a 280 000 EUR loue 1 050 EUR : renta brute 4,5 pourcent.
                    T3 70 m2 Saint-Etienne a 95 000 EUR loue 700 EUR : renta brute 8,8 pourcent.
                    L&apos;ecart se reduit en net (vacance Saint-Etienne, taxe fonciere plus
                    elevee), mais la province reste plus rentable hors plus-value.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    LMNP meuble vs location nue
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Meme bien loue 700 EUR nu ou 850 EUR meuble (LMNP). En LMNP regime reel,
                    l&apos;amortissement immobilier (sur 25-30 ans) gomme presque tous les loyers
                    fiscalement pendant 15-20 ans. La rentabilite nette d&apos;impot peut etre
                    50 a 80 pourcent superieure a la location nue au regime micro-foncier.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Investisseur Pinel
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pinel Plus 2026 (dispositif art. 199 novovicies CGI dans sa derniere version)
                    : reduction d&apos;impot de 9 a 14 pourcent du prix d&apos;achat sur 6, 9 ou 12
                    ans, plafonnee a 300 000 EUR et 5 500 EUR/m2. Souvent la rentabilite brute
                    affichee (3,5-4 pourcent) ne devient interessante qu&apos;une fois la reduction
                    d&apos;impot integree au calcul global.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Cash-flow positif et autofinancement
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Bien acquis 130 000 EUR (frais inclus), loyer 850 EUR, mensualite credit 600
                    EUR, charges + taxe + PNO 150 EUR : cash-flow 100 EUR/mois positif. Le bien se
                    finance seul. Avec 20 KEUR d&apos;apport, cash-on-cash 6 pourcent + plus-value
                    eventuelle + amortissement capital de l&apos;emprunt = effet de levier puissant.
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
                A savoir : fiscalite, dispositifs et pieges
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Rendement brut vs net vs net-net.</strong> Brut = loyers annuels / cout
                  total d&apos;acquisition. Net = (loyers - charges - taxe fonciere - assurance
                  PNO) / cout total. Net-net (le seul qui compte vraiment) = net apres
                  imposition (TMI + prelevements sociaux 17,2 pourcent en location nue, ou regime
                  LMNP plus avantageux). En tranche IR a 30 pourcent + PS, un rendement net de
                  5 pourcent peut tomber a 2,5 pourcent net-net en location nue.
                </p>
                <p>
                  <strong>Location meublee LMNP / LMP.</strong> Statut Loueur Meuble Non
                  Professionnel (art. 155 IV-2 CGI) accessible si recettes &lt; 23 000 EUR/an OU
                  &lt; revenus du foyer. Regime micro-BIC : abattement forfaitaire de 50 pourcent
                  sur les loyers. Regime reel BIC : amortissement immobilier (hors terrain) sur
                  20-30 ans, deduction des interets, frais et travaux. Le reel est presque
                  toujours plus avantageux des que les charges dépassent 30 pourcent du loyer.
                </p>
                <p>
                  <strong>Deficit foncier en location nue.</strong> Si vos charges (interets,
                  travaux deductibles, taxe fonciere, assurance) depassent vos loyers, le
                  deficit foncier impute sur le revenu global jusqu&apos;a 10 700 EUR par an
                  (art. 156 CGI), 21 400 EUR pour les travaux de renovation energetique
                  jusqu&apos;a fin 2025. Le surplus s&apos;impute sur les revenus fonciers des
                  10 annees suivantes. Levier puissant pour les TMI elevees.
                </p>
                <p>
                  <strong>Pinel et Pinel Plus.</strong> Le dispositif Pinel classique disparait
                  en 2025. Le Pinel Plus 2026 (art. 199 novovicies CGI dans sa derniere
                  version) impose des criteres environnementaux (RE2020 ou label E+C-) et de
                  surface minimale. Reduction de 9 a 14 pourcent du prix sur 6, 9 ou 12 ans.
                  Plafond 300 000 EUR / 5 500 EUR le m2. La rentabilite brute Pinel est souvent
                  faible (3,5-4 pourcent) : c&apos;est la reduction d&apos;impot qui fait le
                  rendement total.
                </p>
                <p>
                  <strong>Plus-value immobiliere.</strong> Sur la residence principale :
                  exoneration totale (art. 150 U-II-1 CGI). Sur l&apos;investissement locatif :
                  imposition au PFU 19 pourcent + 17,2 pourcent PS (soit 36,2 pourcent), avec
                  abattement progressif pour duree de detention : exoneration IR a 22 ans,
                  exoneration PS a 30 ans. La duree de detention reduit fortement le poids
                  fiscal a la revente.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions cles avant un investissement immobilier locatif en France."
              items={[
                {
                  question: "Quelle difference entre rentabilite brute et rentabilite nette ?",
                  answer:
                    "Brute = loyers annuels / cout total d&apos;acquisition x 100. Nette = (loyers - vacance - charges copro non recuperables - taxe fonciere - PNO) / cout total x 100. Sur un bien a 200 000 EUR loue 900 EUR/mois (10 800 EUR/an), avec 1 200 EUR de charges + 1 000 EUR de taxe + 200 EUR PNO + 5 pourcent de vacance : rentabilite brute 5,4 pourcent, rentabilite nette 3,9 pourcent. Visez toujours la nette, pas la brute des annonces.",
                },
                {
                  question: "Qu&apos;est-ce qu&apos;un bon rendement locatif en France ?",
                  answer:
                    "Brut superieur a 7 pourcent : excellent (souvent province, petites villes). Brut entre 5 et 7 pourcent : correct (villes moyennes, grandes agglomerations hors Paris). Brut inferieur a 5 pourcent : faible (Paris, Lyon, Bordeaux, cote d&apos;Azur). Mais une renta brute basse compensee par une plus-value attendue forte (zones tendues) reste un investissement valable a long terme.",
                },
                {
                  question: "Qu&apos;est-ce que le cash-on-cash return ?",
                  answer:
                    "Rendement sur fonds propres = cash-flow annuel apres credit / apport personnel x 100. Mesure ce que rapporte chaque euro d&apos;apport, en integrant l&apos;effet de levier du credit. Cash-on-cash &gt; 10 pourcent : tres attractif. 5-10 pourcent : correct. Negatif : effort d&apos;epargne mensuel necessaire mais peut rester rentable a la revente.",
                },
                {
                  question: "Faut-il privilegier la location nue ou la location meublee LMNP ?",
                  answer:
                    "LMNP au regime reel BIC est presque toujours plus avantageux que la location nue : l&apos;amortissement immobilier (hors terrain, sur 20-30 ans) plus l&apos;amortissement du mobilier (5-10 ans) gomment l&apos;essentiel des loyers fiscalement pendant 15-20 ans. Loyers superieurs en moyenne (+15 a 25 pourcent vs nu) mais turnover plus eleve. Idéal pour studios et T2 en zone universitaire ou affaires.",
                },
                {
                  question: "Comment fonctionne le deficit foncier ?",
                  answer:
                    "En location nue, si vos charges (interets d&apos;emprunt, travaux deductibles, taxe fonciere, assurance, frais de gestion) depassent les loyers, vous creez un deficit foncier imputable sur le revenu global jusqu&apos;a 10 700 EUR/an (art. 156 CGI). Doublement du plafond a 21 400 EUR/an pour les travaux de renovation energetique jusqu&apos;a fin 2025. Levier majeur pour les TMI a 30, 41 ou 45 pourcent.",
                },
                {
                  question: "Quels sont les frais de notaire dans l&apos;ancien et le neuf ?",
                  answer:
                    "Ancien : environ 7,5 a 8 pourcent du prix d&apos;achat (droits de mutation 5,80 pourcent + emoluments du notaire + debours). Neuf VEFA : 2 a 3 pourcent (TVA 20 pourcent deja incluse dans le prix, droits reduits a 0,71 pourcent). Sur un bien a 200 000 EUR : ~15 000 EUR ancien vs ~5 000 EUR neuf. A integrer imperativement dans le cout total avant calcul de rentabilite.",
                },
                {
                  question: "Que prevoir comme vacance locative dans son calcul ?",
                  answer:
                    "Zone tres tendue (Paris, Lyon, Bordeaux, Annecy) : 3-5 pourcent. Zone tendue (grandes villes francaises) : 5-8 pourcent. Zone detendue (villes moyennes, periurbain) : 8-15 pourcent. Le mobilier LMNP reduit generalement la vacance grace a une cible plus large (etudiants, professionnels en mobilite, expat). Sous-estimer la vacance est l&apos;erreur classique des projections de rentabilite.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Reperes</h3>
              <ul className="mt-3 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Renta. brute &gt; <strong className="text-[var(--primary)]">7%</strong> = excellent</li>
                <li>Renta. brute <strong>5-7%</strong> = correct</li>
                <li>Renta. brute &lt; <strong style={{ color: "#dc2626" }}>5%</strong> = faible</li>
                <li>Cashflow positif = autofinancement</li>
                <li><strong>Cash-on-cash</strong> = cashflow annuel / apport</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm font-medium" style={{ borderColor: "var(--border)" }} />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
      <p className="mt-1 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color }}>{value}</p>
    </div>
  );
}

function Row({ label, value, highlight, primary, warning }: { label: string; value: string; highlight?: boolean; primary?: boolean; warning?: boolean }) {
  return (
    <div className={`flex justify-between rounded-lg px-3 py-2 ${highlight ? "" : ""}`} style={highlight ? { background: "var(--surface-alt)" } : {}}>
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span className={highlight ? "text-lg font-bold" : "font-medium"}
        style={{ fontFamily: highlight ? "var(--font-display)" : undefined, color: warning ? "#dc2626" : primary ? "var(--primary)" : highlight && !primary ? "#dc2626" : "var(--foreground)" }}>
        {value}
      </span>
    </div>
  );
}

function DonutChart({
  cashflow,
  charges,
  mensualite,
  rentaBrute,
}: {
  cashflow: number;
  charges: number;
  mensualite: number;
  rentaBrute: number;
}) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const stroke = 22;

  // 3 segments : cash-flow (vert si positif, rouge si negatif) + charges (orange) + mensualite (rouge)
  const cashflowAbs = Math.abs(cashflow);
  const total = cashflowAbs + charges + mensualite;
  const safeTotal = total > 0 ? total : 1;

  const cashflowPct = cashflowAbs / safeTotal;
  const chargesPct = charges / safeTotal;
  const mensPct = mensualite / safeTotal;

  const cashflowLen = cashflowPct * c;
  const chargesLen = chargesPct * c;
  const mensLen = mensPct * c;

  const cashflowColor = cashflow >= 0 ? "#0d4f3c" : "#dc2626";
  const dominantColor = rentaBrute > 6 ? "var(--primary)" : rentaBrute < 4 ? "#dc2626" : "var(--accent)";

  return (
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Repartition cash-flow mensuel">
      <circle cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <g transform="rotate(-90)">
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke={cashflowColor}
          strokeWidth={stroke}
          strokeDasharray={`${cashflowLen} ${c}`}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#e8963e"
          strokeWidth={stroke}
          strokeDasharray={`${chargesLen} ${c}`}
          strokeDashoffset={-cashflowLen}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#dc2626"
          strokeWidth={stroke}
          strokeDasharray={`${mensLen} ${c}`}
          strokeDashoffset={-(cashflowLen + chargesLen)}
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
        Renta brute
      </text>
      <text
        x="0"
        y="14"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill={dominantColor}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {rentaBrute.toFixed(1)}%
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
