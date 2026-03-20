"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

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

            {/* Contenu SEO */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment calculer son TJM freelance ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Le Taux Journalier Moyen (TJM) est le tarif qu&apos;un freelance facture par jour de travail. C&apos;est l&apos;indicateur central pour fixer ses prix et assurer la viabilite de son activite independante.</p>
                <p><strong className="text-[var(--foreground)]">La formule de base</strong> :</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Calculez votre revenu brut necessaire : (salaire net + frais) / (1 - taux de charges)</li>
                  <li>Estimez vos jours facturables : (jours travailles/mois &times; 12) - jours de conge</li>
                  <li>TJM = Revenu brut annuel / Jours facturables</li>
                </ul>
                <p>N&apos;oubliez pas d&apos;inclure la mutuelle, l&apos;assurance RC Pro, le materiel, les logiciels, le coworking et une marge de securite pour les periodes creuses (inter-contrats).</p>
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Erreurs courantes a eviter</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <ul className="ml-4 list-disc space-y-2">
                  <li><strong className="text-[var(--foreground)]">Oublier les charges sociales</strong> : en micro-entreprise, elles representent 21,1% a 23,1% du CA selon l&apos;activite. En SASU ou EURL, elles peuvent atteindre 45%.</li>
                  <li><strong className="text-[var(--foreground)]">Ne pas compter les jours non factures</strong> : prospection, administratif, formation, maladie. Un freelance facture rarement plus de 200 jours par an.</li>
                  <li><strong className="text-[var(--foreground)]">Ignorer les frais professionnels</strong> : mutuelle, materiel, logiciels, comptable, deplacement. Ils representent souvent 200 a 500 &euro;/mois.</li>
                  <li><strong className="text-[var(--foreground)]">Comparer son TJM a un salaire brut</strong> : le TJM doit couvrir conges, charges, frais et risque. Un TJM de 500 &euro; ne correspond pas a un salaire de 500 &euro;/jour.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel TJM pour un developpeur freelance en France ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>En 2025, le TJM moyen d&apos;un developpeur freelance en France se situe entre 400 et 700 &euro; selon la technologie, l&apos;experience et la localisation. Un developpeur junior demarre autour de 350-450 &euro;, un senior entre 550 et 750 &euro;, et un expert ou architecte peut depasser 800 &euro;/jour.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle difference entre TJM et THM ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le TJM (Taux Journalier Moyen) est le tarif par jour de travail, generalement base sur une journee de 8 heures. Le THM (Taux Horaire Moyen) est le tarif par heure, soit TJM / 8. Le THM est souvent utilise pour les missions courtes ou les prestations facturees a l&apos;heure.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien de jours un freelance facture-t-il par an ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>En pratique, un freelance facture entre 180 et 220 jours par an. Il faut retrancher les week-ends (104 jours), les conges (25 jours), les jours feries (11 jours), et les jours non factures (prospection, administratif, formation, maladie). Prevoyez 15 a 20% de jours non facturables.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment negocier son TJM avec un client ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Basez votre negociation sur la valeur apportee, pas sur vos couts. Renseignez-vous sur les tarifs du marche pour votre profil. Proposez un tarif legerement superieur a votre objectif pour laisser une marge de negociation. N&apos;acceptez jamais en dessous de votre TJM plancher calcule avec cet outil.</p>
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
