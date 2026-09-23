"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type Zone = "Abis" | "A" | "B1" | "B2" | "C";
type TypeBien = "neuf-collectif" | "neuf-individuel" | "ancien";

// Bareme PTZ en vigueur en 2026 (offres emises depuis le 1er avril 2025, decret 2025-299 ;
// dispositif proroge jusqu'au 31/12/2027, plafonds inchanges par la LF 2026).
// Sources : service-public.gouv.fr (F10871), ANIL (offres de pret PTZ a compter du 1er avril 2025).

// Coefficient familial (1 a 8 personnes et plus)
const COEF_FAMILIAL = [1, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0, 3.3];

// Plafonds des tranches de revenus (ressources / coefficient familial), tranches 1 a 4.
// Le plafond de la tranche 4 correspond au plafond de ressources pour 1 personne.
const TRANCHES: Record<Zone, number[]> = {
  Abis: [25000, 31000, 37000, 49000],
  A:    [25000, 31000, 37000, 49000],
  B1:   [21500, 26000, 30000, 34500],
  B2:   [18000, 22500, 27000, 31500],
  C:    [15000, 19500, 24000, 28500],
};

// Plafond du cout de l'operation pour 1 personne (multiplie par le coefficient familial, plafonne a 2,4)
const PLAFONDS_OPERATION: Record<Zone, number> = {
  Abis: 150000,
  A:    150000,
  B1:   135000,
  B2:   110000,
  C:    100000,
};

// Quotite par type de bien et tranche de revenus (tranches 1 a 4)
const QUOTITE: Record<TypeBien, number[]> = {
  "neuf-collectif":  [0.5, 0.4, 0.4, 0.2],
  "neuf-individuel": [0.3, 0.2, 0.2, 0.1],
  ancien:            [0.5, 0.4, 0.4, 0.2],
};

// Duree totale et differe par tranche de revenus (art. D31-10-11 CCH)
const DUREES: { dureeTotale: number; differe: number }[] = [
  { dureeTotale: 25, differe: 10 },
  { dureeTotale: 20, differe: 8 },
  { dureeTotale: 15, differe: 2 },
  { dureeTotale: 10, differe: 0 },
];

// L'ancien avec travaux n'est eligible qu'en zones B2 et C
const ZONES_ANCIEN: Zone[] = ["B2", "C"];

const ZONE_LABELS: Record<Zone, string> = {
  Abis: "A bis (Paris et communes limitrophes)",
  A: "A (grandes agglomérations)",
  B1: "B1 (agglomérations moyennes)",
  B2: "B2 (villes moyennes)",
  C: "C (reste du territoire)",
};

export default function SimulateurPTZ2026() {
  const [zone, setZone] = useState<Zone>("A");
  const [revenus, setRevenus] = useState("35000");
  const [nbPersonnes, setNbPersonnes] = useState("2");
  const [prixBien, setPrixBien] = useState("250000");
  const [typeBien, setTypeBien] = useState<TypeBien>("neuf-collectif");

  const result = useMemo(() => {
    const rev = parseFloat(revenus) || 0;
    const nb = Math.min(Math.max(parseInt(nbPersonnes) || 1, 1), 8);
    const prix = parseFloat(prixBien) || 0;

    if (rev <= 0 || prix <= 0) return null;

    const coef = COEF_FAMILIAL[nb - 1];
    // Ressources retenues : le plus eleve entre le RFR N-2 et le cout total de l'operation / 9
    const ressources = Math.max(rev, prix / 9);
    const tranches = TRANCHES[zone];
    const plafondRevenu = tranches[3] * coef;
    const zoneEligible = typeBien !== "ancien" || ZONES_ANCIEN.includes(zone);
    const trancheIndex = tranches.findIndex((t) => ressources / coef <= t);
    const eligible = zoneEligible && trancheIndex !== -1;

    const plafondOperation = PLAFONDS_OPERATION[zone] * Math.min(coef, 2.4);
    const montantRetenu = Math.min(prix, plafondOperation);
    const quotite = eligible ? QUOTITE[typeBien][trancheIndex] : 0;
    const montantPTZ = montantRetenu * quotite;

    const { dureeTotale, differe } = DUREES[eligible ? trancheIndex : 3];
    const dureeRemboursement = dureeTotale - differe;
    const mensualite = montantPTZ / (dureeRemboursement * 12);

    return {
      eligible,
      zoneEligible,
      tranche: trancheIndex + 1,
      plafondRevenu,
      revenus: rev,
      ressources,
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
            Vérifiez votre éligibilité au Prêt à Taux Zéro et estimez le montant, la durée et les mensualités.
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
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Zone géographique</label>
                  <select value={zone} onChange={(e) => setZone(e.target.value as Zone)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-lg font-semibold" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    {(Object.entries(ZONE_LABELS) as [Zone, string][]).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Revenus fiscaux de référence (euros)</label>
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
                    <option value="neuf-collectif">Neuf - collectif (appartement)</option>
                    <option value="neuf-individuel">Neuf - individuel (maison)</option>
                    <option value="ancien">Ancien avec travaux (zones B2 et C)</option>
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
                        Éligible au PTZ
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
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Durée totale</p>
                        <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.dureeTotale} ans</p>
                      </div>
                      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Différé</p>
                        <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.differe} ans</p>
                      </div>
                      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Remboursement</p>
                        <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.dureeRemboursement} ans</p>
                      </div>
                      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>Mensualité après différé</p>
                        <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#16a34a" }}>{fmt2(result.mensualite)} euros</p>
                      </div>
                    </div>

                    {/* Detail */}
                    <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                      <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détail du calcul</h2>
                      <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                        <div className="flex justify-between">
                          <span>Plafond de revenus (zone {zone}, {nbPersonnes} pers.)</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{fmt(result.plafondRevenu)} euros</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vos revenus</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{fmt(result.revenus)} euros</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ressources retenues (max. RFR / coût de l&apos;opération divisé par 9)</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>{fmt(result.ressources)} euros</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tranche de revenus</span>
                          <span className="font-semibold" style={{ color: "var(--foreground)" }}>Tranche {result.tranche}</span>
                        </div>
                        <hr style={{ borderColor: "var(--border)" }} />
                        <div className="flex justify-between">
                          <span>Plafond de l&apos;opération (zone {zone})</span>
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
                          <span>Quotité ({typeBien === "neuf-collectif" ? "neuf collectif" : typeBien === "neuf-individuel" ? "neuf individuel" : "ancien avec travaux"})</span>
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
                      Non éligible au PTZ
                    </div>
                    {!result.zoneEligible ? (
                      <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                        Le PTZ dans l&apos;ancien avec travaux n&apos;est accordé qu&apos;en <strong className="text-[var(--foreground)]">zones B2 et C</strong>. En zone {zone}, seuls le neuf et certaines opérations spécifiques (logement social, BRS, transformation de locaux) sont éligibles.
                      </p>
                    ) : (
                      <>
                        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
                          Vos ressources retenues ({fmt(result.ressources)} euros) dépassent le plafond pour la zone {zone} avec {nbPersonnes} personne(s) : <strong className="text-[var(--foreground)]">{fmt(result.plafondRevenu)} euros</strong>.
                        </p>
                        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                          Les ressources retenues sont le plus élevé entre votre revenu fiscal de référence (N-2) et le coût total de l&apos;opération divisé par 9.
                        </p>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Content SEO */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Qu&apos;est-ce que le PTZ en 2026 ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Le Prêt à Taux Zéro (PTZ) est un dispositif d&apos;aide à l&apos;accession à la propriété réservé aux primo-accédants. Il permet de financer une partie de l&apos;achat de sa résidence principale <strong className="text-[var(--foreground)]">sans payer d&apos;intérêts</strong>. Le coût des intérêts est pris en charge par l&apos;État.</p>
                <p><strong className="text-[var(--foreground)]">Conditions principales :</strong></p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Être primo-accédant (ne pas avoir été propriétaire de sa résidence principale au cours des 2 dernières années)</li>
                  <li>Respecter les plafonds de revenus selon la zone géographique et la composition du foyer</li>
                  <li>Acheter un logement neuf ou ancien avec travaux représentant au moins 25% du coût total</li>
                  <li>Le logement doit devenir la résidence principale dans l&apos;année suivant l&apos;achat</li>
                </ul>
                <p>Depuis la <strong className="text-[var(--foreground)]">LFI 2025 et le décret n° 2025-299 du 29 mars 2025</strong> (offres émises à compter du 1er avril 2025), le PTZ neuf (collectif et individuel) est <strong className="text-[var(--foreground)]">ouvert sur l&apos;ensemble du territoire</strong> ; l&apos;ancien avec travaux reste limité aux zones B2 et C. Le dispositif est prorogé jusqu&apos;au 31 décembre 2027 et la LF 2026 l&apos;a ouvert aux acquéreurs successifs en bail réel solidaire (BRS). La quotité dépend du type de bien et de la tranche de revenus (1 à 4) : neuf collectif et ancien 50% / 40% / 40% / 20% ; neuf individuel 30% / 20% / 20% / 10%. Cadre légal : articles <strong className="text-[var(--foreground)]">L31-10-2 et L31-10-3 du Code de la construction et de l&apos;habitation (CCH)</strong>.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment connaître ma zone PTZ ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La zone dépend de la commune où se situe le logement. La zone A bis concerne Paris et 76 communes limitrophes. La zone A couvre les grandes agglomérations (Lyon, Marseille, Lille...). La zone B1 concerne les agglomérations de plus de 250 000 habitants. Les zones B2 et C couvrent le reste du territoire. Vous pouvez vérifier la zone de votre commune sur le site du service public.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quels sont les revenus pris en compte pour le PTZ ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le revenu pris en compte est le revenu fiscal de référence (RFR) de l&apos;année N-2. Il figure sur votre avis d&apos;imposition. Pour un couple, les deux revenus sont additionnés. Le nombre de personnes du foyer inclut le demandeur, le co-emprunteur et les personnes à charge.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Peut-on cumuler le PTZ avec un autre prêt ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, le PTZ est un prêt complémentaire. Il doit être associé à un ou plusieurs prêts principaux (prêt bancaire classique, prêt d&apos;accession sociale, prêt Action Logement...). Le PTZ ne peut pas financer la totalité de l&apos;achat. Il couvre entre 10% et 50% du montant retenu selon le type de bien et la tranche de revenus.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Que signifie le différé de remboursement ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le différé est une période pendant laquelle vous ne remboursez pas le PTZ. Vous ne payez que les mensualités de vos autres prêts. Selon la tranche de revenus, le différé est de 10 ans (tranche 1), 8 ans (tranche 2), 2 ans (tranche 3) ou nul (tranche 4), pour une durée totale de 25, 20, 15 ou 10 ans. Plus vos revenus sont faibles, plus le différé est long. Après le différé, les mensualités du PTZ commencent sans intérêts.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle différence entre neuf collectif et neuf individuel pour le PTZ ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Depuis le 1er avril 2025 (décret n° 2025-299), les deux sont éligibles sur tout le territoire mais les quotités différent selon la tranche de revenus : <strong className="text-[var(--foreground)]">neuf collectif</strong> (appartement en logement collectif) = 50% en tranche 1, 40% en tranches 2 et 3, 20% en tranche 4. <strong className="text-[var(--foreground)]">Neuf individuel</strong> (maison) = 30% en tranche 1, 20% en tranches 2 et 3, 10% en tranche 4. Référence : articles L31-10-2 et L31-10-3 du Code de la construction et de l&apos;habitation (CCH).</p>
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
