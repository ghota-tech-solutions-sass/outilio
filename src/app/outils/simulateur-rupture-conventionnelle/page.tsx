"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function SimulateurRuptureConventionnelle() {
  const [salaireBrut, setSalaireBrut] = useState("3000");
  const [annees, setAnnees] = useState("5");
  const [mois, setMois] = useState("0");

  const result = useMemo(() => {
    const salaire = parseFloat(salaireBrut) || 0;
    const a = parseInt(annees) || 0;
    const m = parseInt(mois) || 0;
    const ancienneteAnnees = a + m / 12;

    if (salaire <= 0 || ancienneteAnnees <= 0) return null;

    // Salaire de reference = salaire brut mensuel moyen (entre par l'utilisateur)
    const salaireRef = salaire;
    const salaireAnnuel = salaire * 12;

    // Indemnite legale
    let indemnite = 0;
    if (ancienneteAnnees <= 10) {
      indemnite = (salaireRef / 4) * ancienneteAnnees;
    } else {
      indemnite = (salaireRef / 4) * 10 + (salaireRef / 3) * (ancienneteAnnees - 10);
    }

    // Fiscalite
    // Exoneree d'IR dans la limite du plus eleve de :
    // 1. indemnite legale
    // 2. 2x remuneration brute annuelle
    // 3. 50% de l'indemnite
    const plafondIR = Math.max(indemnite, 2 * salaireAnnuel, indemnite * 0.5);
    const partImposableIR = Math.max(0, indemnite - plafondIR);

    // Exoneree de CSG/CRDS dans la limite de l'indemnite legale.
    // Calcul simplifie : on suppose que l'indemnite versee = indemnite legale,
    // donc la part soumise a CSG/CRDS est nulle. Pour une indemnite supra-legale,
    // il faudrait demander a l'utilisateur l'indemnite negociee et calculer
    // partSoumiseCSG = max(0, indemniteNegociee - indemniteLegale).
    const partSoumiseCSG = 0;
    const csgCrds = partSoumiseCSG * 0.097; // 9.7% (CSG 9.2% + CRDS 0.5%)

    // IR estime (simplifie)
    const irEstime = partImposableIR * 0.3; // taux moyen approximatif

    // Contribution patronale unique : 30% sur les indemnites de rupture conventionnelle
    // depassant le seuil d'exoneration. Depuis le 1er septembre 2023, ce dispositif
    // remplace l'ancien forfait social de 20% (LFSS 2023, art. L137-12 CSS).
    const contributionPatronale = indemnite * 0.30;

    const indemniteNette = indemnite - csgCrds - irEstime;

    return {
      indemnite,
      indemniteNette,
      irEstime,
      csgCrds,
      contributionPatronale,
      ancienneteAnnees,
      salaireRef,
      plafondIR,
      partImposableIR,
    };
  }, [salaireBrut, annees, mois]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Emploi</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>Rupture Conventionnelle</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre indemnite de rupture conventionnelle, la fiscalite applicable et le montant net estime.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Votre situation</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Salaire brut mensuel moyen (euros)</label>
                  <input type="number" value={salaireBrut} onChange={(e) => setSalaireBrut(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Anciennete (annees)</label>
                  <input type="number" min="0" value={annees} onChange={(e) => setAnnees(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Anciennete (mois)</label>
                  <input type="number" min="0" max="11" value={mois} onChange={(e) => setMois(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>
            </div>

            {/* Results */}
            {result && (
              <>
                <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Indemnite brute minimale</p>
                  <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(result.indemnite)} euros
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Pour {result.ancienneteAnnees.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} annees d&apos;anciennete
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Indemnite nette estimee</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#16a34a" }}>
                      {fmt(result.indemniteNette)} euros
                    </p>
                  </div>
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>IR estime</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                      {fmt(result.irEstime)} euros
                    </p>
                  </div>
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>CSG / CRDS estimee</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                      {fmt(result.csgCrds)} euros
                    </p>
                  </div>
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Contribution patronale unique (30%)</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                      {fmt(result.contributionPatronale)} euros
                    </p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>
                      Depuis le 1er sept. 2023 (LFSS 2023, art. L137-12 CSS)
                    </p>
                  </div>
                </div>

                {/* Detail calcul */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Detail du calcul</h2>
                  <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                    <div className="flex justify-between">
                      <span>Salaire de reference</span>
                      <span className="font-semibold" style={{ color: "var(--foreground)" }}>{fmt(result.salaireRef)} euros/mois</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Anciennete</span>
                      <span className="font-semibold" style={{ color: "var(--foreground)" }}>{parseInt(annees)} an(s) et {parseInt(mois) || 0} mois</span>
                    </div>
                    <hr style={{ borderColor: "var(--border)" }} />
                    <div className="flex justify-between">
                      <span>Jusqu&apos;a 10 ans : 1/4 mois par annee</span>
                      <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                        {fmt((result.salaireRef / 4) * Math.min(result.ancienneteAnnees, 10))} euros
                      </span>
                    </div>
                    {result.ancienneteAnnees > 10 && (
                      <div className="flex justify-between">
                        <span>Au-dela de 10 ans : 1/3 mois par annee</span>
                        <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                          {fmt((result.salaireRef / 3) * (result.ancienneteAnnees - 10))} euros
                        </span>
                      </div>
                    )}
                    <hr style={{ borderColor: "var(--border)" }} />
                    <div className="flex justify-between font-semibold" style={{ color: "var(--foreground)" }}>
                      <span>Indemnite legale totale</span>
                      <span>{fmt(result.indemnite)} euros</span>
                    </div>
                  </div>
                </div>

                {/* Fiscalite */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Fiscalite</h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    <p>L&apos;indemnite de rupture conventionnelle est <strong className="text-[var(--foreground)]">exoneree d&apos;impot sur le revenu</strong> dans la limite du montant le plus eleve entre :</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>L&apos;indemnite legale de licenciement : <strong className="text-[var(--foreground)]">{fmt(result.indemnite)} euros</strong></li>
                      <li>2x la remuneration brute annuelle : <strong className="text-[var(--foreground)]">{fmt(result.salaireRef * 24)} euros</strong></li>
                      <li>50% de l&apos;indemnite : <strong className="text-[var(--foreground)]">{fmt(result.indemnite * 0.5)} euros</strong></li>
                    </ul>
                    <p>Plafond d&apos;exoneration retenu : <strong className="text-[var(--foreground)]">{fmt(result.plafondIR)} euros</strong></p>
                    {result.partImposableIR > 0 ? (
                      <p>Part imposable a l&apos;IR : <strong className="text-[var(--foreground)]">{fmt(result.partImposableIR)} euros</strong></p>
                    ) : (
                      <p className="font-semibold" style={{ color: "#16a34a" }}>Votre indemnite est integralement exoneree d&apos;IR.</p>
                    )}
                    <p>L&apos;indemnite est <strong className="text-[var(--foreground)]">exoneree de CSG/CRDS</strong> dans la limite de l&apos;indemnite legale.</p>
                  </div>
                </div>
              </>
            )}

            {/* Content SEO */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment negocier sa rupture conventionnelle</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>La rupture conventionnelle est un mode de rupture du contrat de travail a duree indeterminee (CDI) d&apos;un commun accord entre l&apos;employeur et le salarie. Elle ouvre droit aux allocations chomage, contrairement a la demission.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Preparez vos arguments</strong> : anciennete, performances, projets menes, difficulte a vous remplacer. Plus votre profil est strategique, plus vous avez de levier.</li>
                  <li><strong className="text-[var(--foreground)]">Connaissez vos droits</strong> : l&apos;indemnite ne peut pas etre inferieure a l&apos;indemnite legale de licenciement. Utilisez ce simulateur pour connaitre le plancher.</li>
                  <li><strong className="text-[var(--foreground)]">Negociez au-dela du minimum</strong> : l&apos;indemnite legale est un plancher, pas un plafond. Des indemnites supra-legales sont courantes, surtout dans les grandes entreprises.</li>
                  <li><strong className="text-[var(--foreground)]">Pensez au timing</strong> : la procedure prend environ 1 mois minimum (entretiens + delai de retractation + homologation DREETS).</li>
                  <li><strong className="text-[var(--foreground)]">Demandez la portabilite</strong> : mutuelle et prevoyance maintenues apres la rupture pendant 12 mois maximum.</li>
                </ul>
                <p>La demande de rupture conventionnelle peut venir du salarie ou de l&apos;employeur. Dans les deux cas, les deux parties doivent y consentir librement.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est l&apos;indemnite minimale de rupture conventionnelle ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>L&apos;indemnite de rupture conventionnelle ne peut pas etre inferieure a l&apos;indemnite legale de licenciement : 1/4 de mois de salaire par annee d&apos;anciennete pour les 10 premieres annees, puis 1/3 de mois par annee au-dela. Le salaire de reference est le plus avantageux entre la moyenne des 12 ou des 3 derniers mois.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>La rupture conventionnelle donne-t-elle droit au chomage ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, la rupture conventionnelle homologuee ouvre droit a l&apos;allocation d&apos;aide au retour a l&apos;emploi (ARE) de France Travail, sous reserve de remplir les conditions d&apos;affiliation (avoir travaille au moins 6 mois sur les 24 derniers mois). C&apos;est l&apos;un de ses principaux avantages par rapport a la demission.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien de temps dure la procedure de rupture conventionnelle ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Comptez environ 1 mois minimum : un ou plusieurs entretiens prealables, puis un delai de retractation de 15 jours calendaires, et enfin l&apos;homologation par la DREETS qui dispose de 15 jours ouvrables. L&apos;absence de reponse de la DREETS vaut homologation.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>L&apos;indemnite de rupture conventionnelle est-elle imposable ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>L&apos;indemnite est exoneree d&apos;impot sur le revenu dans la limite du montant le plus eleve entre : l&apos;indemnite legale, 2 fois la remuneration brute annuelle, ou 50% de l&apos;indemnite percue. Au-dela de ce plafond, la part excedentaire est soumise a l&apos;IR. Elle est aussi exoneree de CSG/CRDS dans la limite de l&apos;indemnite legale.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la cotisation employeur sur la rupture conventionnelle ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Depuis le <strong className="text-[var(--foreground)]">1er septembre 2023</strong>, l&apos;ancien forfait social de 20% a ete remplace par une <strong className="text-[var(--foreground)]">contribution patronale unique de 30%</strong> sur les indemnites de rupture conventionnelle (LFSS 2023, art. L137-12 du Code de la securite sociale). Cette contribution s&apos;applique a la part de l&apos;indemnite exoneree de cotisations sociales et est due par l&apos;employeur, pas par le salarie. Son augmentation a alourdi le cout de la rupture conventionnelle pour les entreprises.</p>
                </div>
              </div>
            </div>
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
