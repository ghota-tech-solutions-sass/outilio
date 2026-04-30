"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

// Montants en vigueur depuis la revalorisation du 1er avril 2025
// TODO: revalidation montants 2026 sur caf.fr (revalorisation annuelle au 1er avril)
const SMIC_NET_MENSUEL = 1426.30; // SMIC net mensuel 35h - a actualiser pour 2026
const FORFAITAIRE_BASE = 633.21; // Montant forfaitaire personne seule (1er avril 2025)
const BONIF_MAX = 173.22; // Bonification individuelle maximale - a verifier 2026
const FORFAIT_LOGEMENT_1 = 77.83; // 1 personne - a verifier 2026
const FORFAIT_LOGEMENT_2 = 155.66; // 2 personnes - a verifier 2026
const FORFAIT_LOGEMENT_3 = 192.60; // 3 personnes et + - a verifier 2026

export default function SimulateurPrimeActivite() {
  const [revenus, setRevenus] = useState("1200");
  const [situation, setSituation] = useState<"celibataire" | "couple">("celibataire");
  const [enfants, setEnfants] = useState("0");
  const [logement, setLogement] = useState<"locataire" | "proprietaire">("locataire");
  const [loyer, setLoyer] = useState("600");

  const resultats = useMemo(() => {
    const rev = parseFloat(revenus) || 0;
    const nbEnfants = parseInt(enfants) || 0;

    // Montant forfaitaire de base (personne seule)
    const forfaitaireBase = FORFAITAIRE_BASE;

    // Majoration couple : +50%
    const majorationCouple = situation === "couple" ? forfaitaireBase * 0.5 : 0;

    // Majoration enfants : +30% par enfant, +40% a partir du 3e
    let majorationEnfants = 0;
    for (let i = 1; i <= nbEnfants; i++) {
      if (i <= 2) {
        majorationEnfants += forfaitaireBase * 0.3;
      } else {
        majorationEnfants += forfaitaireBase * 0.4;
      }
    }

    const montantForfaitaire = forfaitaireBase + majorationCouple + majorationEnfants;

    // Bonification individuelle
    let bonification = 0;
    const seuilBas = SMIC_NET_MENSUEL * 0.5; // 0.5 SMIC
    if (rev >= SMIC_NET_MENSUEL) {
      bonification = BONIF_MAX;
    } else if (rev > seuilBas) {
      bonification = BONIF_MAX * ((rev - seuilBas) / (SMIC_NET_MENSUEL - seuilBas));
    }

    // Si couple, on considere que seul le declarant travaille pour la simplification
    const bonificationTotale = bonification;

    // Forfait logement
    const nbPersonnes = (situation === "couple" ? 2 : 1) + nbEnfants;
    let forfaitLogement = 0;
    if (logement === "proprietaire" || parseFloat(loyer as string) > 0) {
      if (nbPersonnes === 1) forfaitLogement = FORFAIT_LOGEMENT_1;
      else if (nbPersonnes === 2) forfaitLogement = FORFAIT_LOGEMENT_2;
      else forfaitLogement = FORFAIT_LOGEMENT_3;
    }

    // Formule officielle (art. L842-1 et suivants CASF) :
    // P = (montant_forfaitaire + 0,61 x revenus_pro + bonifications) - revenus_pris_en_compte
    // ou revenus_pris_en_compte = revenus_pro + autres_revenus + forfait_logement
    // La prime preserve 61% des revenus d'activite (element central du dispositif).
    // Equivalent simplifie : P = montant_forfaitaire + bonifications - forfait_logement - 0,39 x revenus_pro
    const revenusActivite = rev;
    const autresRevenus = 0; // Non demande dans ce simulateur simplifie
    const revenusPrisEnCompte = revenusActivite + autresRevenus + forfaitLogement;
    const primeCalculee =
      montantForfaitaire + 0.61 * revenusActivite + bonificationTotale - revenusPrisEnCompte;
    const primeMensuelle = Math.max(0, Math.round(primeCalculee * 100) / 100);
    const primeTrimestrielle = Math.round(primeMensuelle * 3 * 100) / 100;
    const eligible = primeMensuelle > 0;

    return {
      montantForfaitaire,
      majorationCouple,
      majorationEnfants,
      bonification: bonificationTotale,
      forfaitLogement,
      revenusActivite,
      primeMensuelle,
      primeTrimestrielle,
      eligible,
      nbPersonnes,
    };
  }, [revenus, situation, enfants, logement, loyer]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Emploi</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>Prime d&apos;Activite</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez le montant de votre prime d&apos;activite 2026 selon vos revenus, votre situation familiale et votre logement.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Revenus nets mensuels (&euro;)</label>
                  <input type="number" value={revenus} onChange={(e) => setRevenus(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre d&apos;enfants a charge</label>
                  <input type="number" min="0" max="10" value={enfants} onChange={(e) => setEnfants(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Situation</label>
                <div className="mt-2 flex gap-3">
                  {(["celibataire", "couple"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSituation(s)}
                      className="rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
                      style={{
                        borderColor: situation === s ? "var(--primary)" : "var(--border)",
                        background: situation === s ? "var(--primary)" : "transparent",
                        color: situation === s ? "white" : "var(--foreground)",
                      }}
                    >
                      {s === "celibataire" ? "Celibataire" : "En couple"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Logement</label>
                <div className="mt-2 flex gap-3">
                  {(["locataire", "proprietaire"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLogement(l)}
                      className="rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
                      style={{
                        borderColor: logement === l ? "var(--primary)" : "var(--border)",
                        background: logement === l ? "var(--primary)" : "transparent",
                        color: logement === l ? "white" : "var(--foreground)",
                      }}
                    >
                      {l === "locataire" ? "Locataire" : "Proprietaire"}
                    </button>
                  ))}
                </div>
              </div>

              {logement === "locataire" && (
                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant du loyer (&euro;)</label>
                  <input type="number" value={loyer} onChange={(e) => setLoyer(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              )}
            </div>

            {/* Resultat principal */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Prime d&apos;activite estimee</p>
              <p className="mt-3 text-6xl font-bold" style={{
                fontFamily: "var(--font-display)",
                color: resultats.eligible ? "var(--primary)" : "#dc2626",
              }}>
                {resultats.eligible ? `${fmt(resultats.primeMensuelle)} \u20AC` : "Non eligible"}
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {resultats.eligible ? (
                  <>par mois &middot; <strong className="text-[var(--foreground)]">{fmt(resultats.primeTrimestrielle)} &euro; / trimestre</strong></>
                ) : (
                  "Vos revenus depassent le plafond pour votre situation"
                )}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold" style={{
                background: resultats.eligible ? "#dcfce7" : "#fef2f2",
                color: resultats.eligible ? "#16a34a" : "#dc2626",
              }}>
                <span className="h-2 w-2 rounded-full" style={{ background: resultats.eligible ? "#16a34a" : "#dc2626" }} />
                {resultats.eligible ? "Eligible" : "Non eligible"}
              </div>
            </div>

            {/* Detail du calcul */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Detail du calcul</h2>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Montant forfaitaire de base", value: `+ ${fmt(FORFAITAIRE_BASE)} \u20AC`, positive: true },
                  ...(resultats.majorationCouple > 0 ? [{ label: "Majoration couple (+50%)", value: `+ ${fmt(resultats.majorationCouple)} \u20AC`, positive: true }] : []),
                  ...(resultats.majorationEnfants > 0 ? [{ label: `Majoration enfants (${enfants})`, value: `+ ${fmt(resultats.majorationEnfants)} \u20AC`, positive: true }] : []),
                  { label: "Bonification individuelle", value: `+ ${fmt(resultats.bonification)} \u20AC`, positive: true },
                  { label: "61% des revenus d'activite (preserves)", value: `+ ${fmt(0.61 * resultats.revenusActivite)} \u20AC`, positive: true },
                  { label: `Forfait logement (${resultats.nbPersonnes} pers.)`, value: `- ${fmt(resultats.forfaitLogement)} \u20AC`, positive: false },
                  { label: "Revenus d'activite", value: `- ${fmt(parseFloat(revenus) || 0)} \u20AC`, positive: false },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="text-sm" style={{ color: "var(--muted)" }}>{item.label}</span>
                    <span className="text-sm font-semibold" style={{ color: item.positive ? "#16a34a" : "#dc2626" }}>{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3">
                  <span className="text-sm font-bold">Prime mensuelle</span>
                  <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(resultats.primeMensuelle)} &euro;</span>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Qu&apos;est-ce que la prime d&apos;activite ?
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>La prime d&apos;activite est une prestation sociale versee par la CAF (ou la MSA) aux travailleurs aux revenus modestes. Elle remplace depuis 2016 le RSA activite et la prime pour l&apos;emploi. Son objectif est d&apos;encourager l&apos;activite professionnelle en completant les revenus des salaries et travailleurs independants.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Cadre legal</strong> : articles L842-1 et suivants du Code de l&apos;action sociale et des familles (CASF).</li>
                  <li><strong className="text-[var(--foreground)]">Conditions</strong> : avoir plus de 18 ans, resider en France, exercer une activite professionnelle et percevoir des revenus modestes.</li>
                  <li><strong className="text-[var(--foreground)]">Montant forfaitaire</strong> : 633,21 &euro; pour une personne seule depuis le 1er avril 2025, majore selon la composition du foyer.</li>
                  <li><strong className="text-[var(--foreground)]">Bonification</strong> : un complement progressif est accorde a partir de 0,5 SMIC, jusqu&apos;a 173,22 &euro; au niveau du SMIC.</li>
                  <li><strong className="text-[var(--foreground)]">Formule officielle</strong> : Prime = (forfaitaire + majorations + bonifications + 61% des revenus pro) - revenus pris en compte. Le coefficient de 61% sur les revenus d&apos;activite est l&apos;element central du dispositif : il garantit que travailler reste interessant.</li>
                  <li><strong className="text-[var(--foreground)]">Versement</strong> : trimestriel, base sur les revenus des 3 derniers mois. La demande se fait sur caf.fr.</li>
                </ul>
                <p>Ce simulateur fournit une estimation. Le montant reel depend de l&apos;ensemble des ressources du foyer evaluees par la CAF. Les travailleurs independants, les etudiants salaries et les apprentis peuvent aussi en beneficier sous conditions.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qui peut beneficier de la prime d&apos;activite ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Toute personne de plus de 18 ans residant en France et exercant une activite professionnelle (salariee ou independante) avec des revenus modestes. Les etudiants et apprentis y ont droit s&apos;ils percoivent au moins 1 082,87 &euro; nets par mois. Les travailleurs detaches et en conge parental ne sont pas eligibles.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment faire la demande ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La demande se fait en ligne sur le site de la CAF (caf.fr) ou de la MSA (msa.fr) pour les travailleurs agricoles. Il faut remplir un formulaire avec ses revenus des 3 derniers mois. La prime est ensuite versee chaque mois pendant 3 mois, puis il faut renouveler la declaration trimestrielle de ressources.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>La prime d&apos;activite est-elle imposable ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non, la prime d&apos;activite n&apos;est pas soumise a l&apos;impot sur le revenu. Elle n&apos;a pas a etre declaree dans votre declaration de revenus annuelle. Elle n&apos;entre pas non plus dans le calcul du revenu fiscal de reference (RFR).</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Peut-on cumuler prime d&apos;activite et APL ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, la prime d&apos;activite est cumulable avec les aides au logement (APL, ALS, ALF). Toutefois, le fait de percevoir une aide au logement entraine l&apos;application d&apos;un forfait logement qui reduit le montant de la prime. Ce forfait est de 77,83 &euro; pour une personne seule, 155,66 &euro; pour 2 personnes, et 192,60 &euro; pour 3 personnes et plus.</p>
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
