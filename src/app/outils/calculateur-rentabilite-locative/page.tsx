"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

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
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Field label="Prix d'achat (€)" value={prixAchat} onChange={setPrixAchat} />
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

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur de rentabilite locative
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce simulateur vous aide a evaluer la performance d&apos;un investissement immobilier locatif en France. Il calcule la rentabilite brute, la rentabilite nette et le cashflow mensuel en tenant compte de tous les parametres reels.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Renseignez l&apos;acquisition</strong> : prix d&apos;achat, frais de notaire (environ 7-8% dans l&apos;ancien, 2-3% dans le neuf) et cout des travaux eventuels.</li>
                  <li><strong className="text-[var(--foreground)]">Indiquez les revenus et charges</strong> : loyer mensuel, vacance locative estimee, charges de copropriete, taxe fonciere et assurance proprietaire non occupant (PNO).</li>
                  <li><strong className="text-[var(--foreground)]">Parametrez le financement</strong> : montant de l&apos;apport, taux du credit immobilier, duree de l&apos;emprunt et appreciation annuelle estimee du bien.</li>
                  <li><strong className="text-[var(--foreground)]">Analysez les indicateurs</strong> : rendement brut, rendement net, cashflow mensuel, cash-on-cash return et plus-value estimee.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la difference entre rentabilite brute et rentabilite nette ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La rentabilite brute se calcule en divisant les loyers annuels par le cout total d&apos;acquisition, sans deduire les charges. La rentabilite nette prend en compte la vacance locative, les charges de copropriete, la taxe fonciere et l&apos;assurance PNO. C&apos;est un indicateur plus realiste de la performance de votre investissement.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qu&apos;est-ce qu&apos;un bon rendement locatif en France ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Une rentabilite brute superieure a 7% est consideree comme excellente, entre 5% et 7% comme correcte, et en dessous de 5% comme faible. Cependant, ces seuils varient selon les villes : a Paris, un rendement de 3-4% est courant, tandis qu&apos;en province, il est possible d&apos;atteindre 8-10% dans certaines villes moyennes.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qu&apos;est-ce que le cash-on-cash return ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le cash-on-cash return (ou rendement sur fonds propres) mesure le rapport entre le cashflow annuel net et le montant de votre apport personnel. Il permet d&apos;evaluer la performance reelle de l&apos;argent que vous avez investi, en tenant compte de l&apos;effet de levier du credit immobilier. Un cash-on-cash de 10% ou plus est generalement considere comme tres attractif.</p>
                </div>
              </div>
            </div>
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
