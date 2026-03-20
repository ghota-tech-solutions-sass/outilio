"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type Zone = "Abis" | "A" | "B1" | "B2C";
type TypeBien = "neuf" | "ancien";

// Plafonds de revenus par zone et nombre de personnes (grille simplifiee)
const PLAFONDS_REVENUS: Record<Zone, number[]> = {
  Abis: [49000, 73000, 87500, 104500, 121500, 138500, 155500, 172500],
  A:    [49000, 73000, 87500, 104500, 121500, 138500, 155500, 172500],
  B1:   [34500, 48000, 57500, 69000, 80000, 91500, 103000, 114500],
  B2C:  [31500, 43500, 52000, 62500, 73000, 83500, 94000, 104500],
};

// Plafonds de l'operation par zone
const PLAFONDS_OPERATION: Record<Zone, number> = {
  Abis: 150000,
  A:    135000,
  B1:   110000,
  B2C:  100000,
};

// Quotite par zone et type de bien
const QUOTITE: Record<TypeBien, Record<Zone, number>> = {
  neuf: {
    Abis: 0.5,
    A:    0.5,
    B1:   0.4,
    B2C:  0.2,
  },
  ancien: {
    Abis: 0.4,
    A:    0.4,
    B1:   0.4,
    B2C:  0.4,
  },
};

// Duree et differe selon tranche de revenus (simplifie)
function getDureeRemboursement(revenus: number, plafond: number): { dureeTotale: number; differe: number } {
  const ratio = revenus / plafond;
  if (ratio <= 0.5) return { dureeTotale: 25, differe: 15 };
  if (ratio <= 0.75) return { dureeTotale: 22, differe: 10 };
  return { dureeTotale: 20, differe: 5 };
}

const ZONE_LABELS: Record<Zone, string> = {
  Abis: "A bis (Paris et communes limitrophes)",
  A: "A (grandes agglomerations)",
  B1: "B1 (agglomerations moyennes)",
  B2C: "B2 / C (reste du territoire)",
};

export default function SimulateurPTZ2026() {
  const [zone, setZone] = useState<Zone>("A");
  const [revenus, setRevenus] = useState("35000");
  const [nbPersonnes, setNbPersonnes] = useState("2");
  const [prixBien, setPrixBien] = useState("250000");
  const [typeBien, setTypeBien] = useState<TypeBien>("neuf");

  const result = useMemo(() => {
    const rev = parseFloat(revenus) || 0;
    const nb = Math.min(Math.max(parseInt(nbPersonnes) || 1, 1), 8);
    const prix = parseFloat(prixBien) || 0;

    if (rev <= 0 || prix <= 0) return null;

    const plafondRevenu = PLAFONDS_REVENUS[zone][nb - 1];
    const eligible = rev <= plafondRevenu;

    const plafondOperation = PLAFONDS_OPERATION[zone];
    const montantRetenu = Math.min(prix, plafondOperation);
    const quotite = QUOTITE[typeBien][zone];
    const montantPTZ = montantRetenu * quotite;

    const { dureeTotale, differe } = getDureeRemboursement(rev, plafondRevenu);
    const dureeRemboursement = dureeTotale - differe;
    const mensualite = montantPTZ / (dureeRemboursement * 12);

    return {
      eligible,
      plafondRevenu,
      revenus: rev,
      plafondOperation,
      montantRetenu,
      quotite,
      montantPTZ,
      dureeTotale,
      differe,
      dureeRemboursement,
      mensualite,
    };
  }, [zone, revenus, nbPersonnes, prixBien, typeBien]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmt2 = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Immobilier</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>PTZ 2026</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Verifiez votre eligibilite au Pret a Taux Zero et estimez le montant, la duree et les mensualites.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Votre projet</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Zone geographique</label>
                  <select value={zone} onChange={(e) => setZone(e.target.value as Zone)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-lg font-semibold" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    {(Object.entries(ZONE_LABELS) as [Zone, string][]).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Revenus fiscaux de reference (euros)</label>
                  <input type="number" value={revenus} onChange={(e) => setRevenus(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre de personnes dans le foyer</label>
                  <select value={nbPersonnes} onChange={(e) => setNbPersonnes(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", background: "var(--surface)", fontFamily: "var(--font-display)" }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n}{n === 8 ? "+" : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix du bien (euros)</label>
                  <input type="number" value={prixBien} onChange={(e) => setPrixBien(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Type de bien</label>
                  <select value={typeBien} onChange={(e) => setTypeBien(e.target.value as TypeBien)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-lg font-semibold" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    <option value="neuf">Neuf</option>
                    <option value="ancien">Ancien avec travaux</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results */}
            {result && (
              <>
                {result.eligible ? (
                  <>
                    <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold" style={{ background: "#16a34a20", color: "#16a34a" }}>
                        Eligible au PTZ
                      </div>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Montant du PTZ</p>
                      <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                        {fmt(result.montantPTZ)} euros
                      </p>
                      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                        soit {(result.quotite * 100).toFixed(0)}% de {fmt(result.montantRetenu)} euros
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Duree totale</p>
                        <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.dureeTotale} ans</p>
                      </div>
                      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Differe</p>
                        <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.differe} ans</p>
                      </div>
                      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Remboursement</p>
                        <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.dureeRemboursement} ans</p>
                      </div>
                      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Mensualite apres differe</p>
                        <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#16a34a" }}>{fmt2(result.mensualite)} euros</p>
                      </div>
                    </div>

                    {/* Detail */}
                    <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Detail du calcul</h2>
                      <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                        <div className="flex justify-between">
                          <span>Plafond de revenus (zone {zone}, {nbPersonnes} pers.)</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{fmt(result.plafondRevenu)} euros</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vos revenus</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{fmt(result.revenus)} euros</span>
                        </div>
                        <hr style={{ borderColor: "var(--border)" }} />
                        <div className="flex justify-between">
                          <span>Plafond de l&apos;operation (zone {zone})</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{fmt(result.plafondOperation)} euros</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prix du bien</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{fmt(parseFloat(prixBien) || 0)} euros</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Montant retenu</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{fmt(result.montantRetenu)} euros</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quotite ({typeBien === "neuf" ? "neuf" : "ancien avec travaux"})</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{(result.quotite * 100).toFixed(0)}%</span>
                        </div>
                        <hr style={{ borderColor: "var(--border)" }} />
                        <div className="flex justify-between font-semibold" style={{ color: "var(--foreground)" }}>
                          <span>Montant PTZ</span>
                          <span>{fmt(result.montantPTZ)} euros</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold" style={{ background: "#dc262620", color: "#dc2626" }}>
                      Non eligible au PTZ
                    </div>
                    <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                      Vos revenus ({fmt(result.revenus)} euros) depassent le plafond pour la zone {zone} avec {nbPersonnes} personne(s) : <strong className="text-[var(--foreground)]">{fmt(result.plafondRevenu)} euros</strong>.
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                      Essayez avec une zone differente ou verifiez vos revenus fiscaux de reference.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Content SEO */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Qu&apos;est-ce que le PTZ en 2026 ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Le Pret a Taux Zero (PTZ) est un dispositif d&apos;aide a l&apos;accession a la propriete reserve aux primo-accedants. Il permet de financer une partie de l&apos;achat de sa residence principale <strong className="text-[var(--foreground)]">sans payer d&apos;interets</strong>. Le cout des interets est pris en charge par l&apos;Etat.</p>
                <p><strong className="text-[var(--foreground)]">Conditions principales :</strong></p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Etre primo-accedant (ne pas avoir ete proprietaire de sa residence principale au cours des 2 dernieres annees)</li>
                  <li>Respecter les plafonds de revenus selon la zone geographique et la composition du foyer</li>
                  <li>Acheter un logement neuf ou ancien avec travaux representant au moins 25% du cout total</li>
                  <li>Le logement doit devenir la residence principale dans l&apos;annee suivant l&apos;achat</li>
                </ul>
                <p>En 2026, le PTZ a ete etendu a l&apos;ensemble du territoire pour le neuf et maintenu pour l&apos;ancien avec travaux. Les quotites et plafonds ont ete revus a la hausse pour faciliter l&apos;acces a la propriete.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment connaitre ma zone PTZ ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La zone depend de la commune ou se situe le logement. La zone A bis concerne Paris et 76 communes limitrophes. La zone A couvre les grandes agglomerations (Lyon, Marseille, Lille...). La zone B1 concerne les agglomerations de plus de 250 000 habitants. Les zones B2 et C couvrent le reste du territoire. Vous pouvez verifier la zone de votre commune sur le site du service public.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quels sont les revenus pris en compte pour le PTZ ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le revenu pris en compte est le revenu fiscal de reference (RFR) de l&apos;annee N-2. Il figure sur votre avis d&apos;imposition. Pour un couple, les deux revenus sont additionnes. Le nombre de personnes du foyer inclut le demandeur, le co-emprunteur et les personnes a charge.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Peut-on cumuler le PTZ avec un autre pret ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, le PTZ est un pret complementaire. Il doit etre associe a un ou plusieurs prets principaux (pret bancaire classique, pret d&apos;accession sociale, pret Action Logement...). Le PTZ ne peut pas financer la totalite de l&apos;achat. Il couvre entre 20% et 50% du montant retenu selon la zone.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Que signifie le differe de remboursement ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le differe est une periode pendant laquelle vous ne remboursez pas le PTZ. Vous ne payez que les mensualites de vos autres prets. Le differe peut aller de 5 a 15 ans selon vos revenus. Plus vos revenus sont faibles, plus le differe est long. Apres le differe, les mensualites du PTZ commencent sans interets.</p>
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
