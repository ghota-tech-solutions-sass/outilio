"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

interface Discount {
  id: number;
  type: "percent" | "fixed";
  value: string;
}

let nextId = 1;

export default function CalculateurRemise() {
  const [prixOriginal, setPrixOriginal] = useState("100");
  const [discounts, setDiscounts] = useState<Discount[]>([
    { id: nextId++, type: "percent", value: "20" },
  ]);

  const addDiscount = () => {
    setDiscounts((prev) => [...prev, { id: nextId++, type: "percent", value: "10" }]);
  };

  const removeDiscount = (id: number) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDiscount = (id: number, field: "type" | "value", val: string) => {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: val } : d))
    );
  };

  const result = useMemo(() => {
    const original = parseFloat(prixOriginal) || 0;
    if (original <= 0) return null;

    let currentPrice = original;
    const steps: { label: string; reduction: number; priceAfter: number }[] = [];

    for (const d of discounts) {
      const val = parseFloat(d.value) || 0;
      if (val <= 0) continue;

      let reduction: number;
      let label: string;

      if (d.type === "percent") {
        reduction = currentPrice * (val / 100);
        label = `-${val}%`;
      } else {
        reduction = Math.min(val, currentPrice);
        label = `-${val.toFixed(2)} €`;
      }

      currentPrice -= reduction;
      steps.push({ label, reduction, priceAfter: currentPrice });
    }

    const totalSaved = original - currentPrice;
    const totalPercentSaved = original > 0 ? (totalSaved / original) * 100 : 0;

    return { finalPrice: currentPrice, totalSaved, totalPercentSaved, steps };
  }, [prixOriginal, discounts]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Shopping</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>remise</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le prix final apres une ou plusieurs reductions. Cumulez pourcentages et montants fixes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Original price */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Prix original</h2>
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant (&euro;)</label>
                <input type="number" step="0.01" value={prixOriginal} onChange={(e) => setPrixOriginal(e.target.value)}
                  className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
              </div>
            </div>

            {/* Discounts */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Reductions</h2>
              <div className="mt-4 space-y-3">
                {discounts.map((d, i) => (
                  <div key={d.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>#{i + 1}</span>
                    <select value={d.type} onChange={(e) => updateDiscount(d.id, "type", e.target.value)}
                      className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                      <option value="percent">Pourcentage (%)</option>
                      <option value="fixed">Montant fixe (&euro;)</option>
                    </select>
                    <input type="number" step="0.01" value={d.value} onChange={(e) => updateDiscount(d.id, "value", e.target.value)}
                      className="w-24 rounded-lg border px-3 py-2 text-sm font-bold" style={{ borderColor: "var(--border)" }} />
                    {discounts.length > 1 && (
                      <button onClick={() => removeDiscount(d.id)} className="ml-auto text-xs font-semibold transition-all hover:opacity-70" style={{ color: "var(--muted)" }}>
                        Supprimer
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addDiscount}
                className="mt-4 w-full rounded-xl border-2 border-dashed py-3 text-xs font-semibold transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                + Ajouter une reduction
              </button>
            </div>

            {/* Result */}
            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix final</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.finalPrice)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Economie</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>-{fmt(result.totalSaved)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Reduction totale</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>-{result.totalPercentSaved.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Steps */}
                {result.steps.length > 1 && (
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Detail des reductions</h2>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-xl px-4 py-2" style={{ background: "var(--surface-alt)" }}>
                        <span className="text-xs font-semibold">Prix de depart</span>
                        <span className="text-sm font-bold">{fmt(parseFloat(prixOriginal) || 0)} &euro;</span>
                      </div>
                      {result.steps.map((step, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2" style={{ background: "var(--surface-alt)" }}>
                          <span className="text-xs font-semibold">
                            Reduction {i + 1} <span style={{ color: "var(--accent)" }}>({step.label})</span>
                          </span>
                          <span className="text-sm font-bold">{fmt(step.priceAfter)} &euro;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual bar */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="flex h-8 overflow-hidden rounded-full">
                    <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${((result.finalPrice) / (parseFloat(prixOriginal) || 1)) * 100}%`, background: "var(--primary)", minWidth: "20%" }}>
                      {fmt(result.finalPrice)} &euro;
                    </div>
                    <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${result.totalPercentSaved}%`, background: "var(--accent)", minWidth: result.totalSaved > 0 ? "15%" : "0%" }}>
                      -{fmt(result.totalSaved)} &euro;
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Cumul de reductions</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Reductions successives</strong> : Quand vous cumulez plusieurs remises, elles s&apos;appliquent en cascade. 20% + 10% ne font pas 30%, mais 28% au total (le second s&apos;applique sur le prix deja reduit).</p>
                <p><strong className="text-[var(--foreground)]">Exemple</strong> : Sur un article a 100 &euro;, une remise de 20% donne 80 &euro;. Puis 10% supplementaires sur 80 &euro; = 72 &euro; final (soit 28% d&apos;economie totale).</p>
                <p><strong className="text-[var(--foreground)]">Montant fixe</strong> : Les reductions en montant fixe (bons d&apos;achat, coupons) se deduisent directement du prix courant.</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment calculer une remise en cascade"
              description="Trois etapes pour valider qu&apos;une promotion annoncee correspond bien a la reduction reelle, et eviter les pieges marketing."
              steps={[
                {
                  name: "Saisir le prix de reference",
                  text:
                    "Le prix de reference est, depuis la directive Omnibus 2022 transposee en France, le prix le plus bas pratique pendant les 30 jours precedant la promotion. C&apos;est ce prix qui doit servir de base au calcul de la remise affichee, pas un &laquo; prix conseille &raquo; gonfle artificiellement.",
                },
                {
                  name: "Ajouter chaque reduction successivement",
                  text:
                    "Cumulez pourcentages (-20 pourcent) et montants fixes (-10 EUR, bons d&apos;achat). Chaque reduction s&apos;applique sur le prix deja reduit par la precedente. C&apos;est l&apos;ordre des reductions qui peut changer le resultat final si vous melez pourcentages et montants fixes.",
                },
                {
                  name: "Comparer la reduction reelle vs annoncee",
                  text:
                    "Verifiez que le pourcentage total affiche est coherent. -20 pourcent + -10 pourcent ne fait pas -30 pourcent mais -28 pourcent (cascade). Une promo &laquo; jusqu&apos;a -70 pourcent &raquo; cache souvent une moyenne autour de -30 pourcent. L&apos;outil donne la reduction reelle finale.",
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
                Cas d&apos;usage du calculateur de remise
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Soldes et Black Friday
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une veste affichee 199 EUR a -40 pourcent puis -10 pourcent supplementaires en
                    caisse : prix final 107,46 EUR (soit -46 pourcent reels et non -50 pourcent).
                    Pratique pour comparer rapidement deux enseignes pendant les soldes ou le
                    Black Friday.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Negociation B2B et grosses commandes
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un fournisseur propose 5 pourcent de remise quantitative, 2 pourcent de remise
                    exceptionnelle de fin d&apos;exercice, plus 1,5 pourcent d&apos;escompte
                    paiement comptant : reduction reelle 8,38 pourcent (et non 8,5 pourcent
                    additionnels). Sur des achats annuels de 200 KEUR, l&apos;ecart vaut le calcul.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Marge ecrasee chez le commercant
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un produit achete 60 EUR et vendu 100 EUR (40 pourcent de marge) auquel
                    j&apos;applique -25 pourcent de remise : nouveau prix 75 EUR, marge restante
                    20 pourcent. Une remise client de 25 pourcent ampute la marge brute du
                    commercant de moitie : a calculer avant de promettre une promo.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Bons d&apos;achat et codes promo cumules
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un panier de 120 EUR avec -15 pourcent code promo, puis bon d&apos;achat de
                    -10 EUR fidelite : prix final 92 EUR (et non 92 EUR, attention a l&apos;ordre).
                    L&apos;ordre d&apos;application change le total : un commercant honnete
                    applique le pourcentage avant les montants fixes.
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
                A savoir : remise, ristourne, rabais, prix barre
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Remise vs ristourne vs rabais.</strong> En droit commercial francais, la
                  remise est une reduction commerciale accordee a la commande (volume, anciennete
                  client). La ristourne est versee a posteriori sur un volume cumule (typiquement
                  fin d&apos;annee). Le rabais est lie a un defaut produit ou un retard de
                  livraison. Les trois figurent sur la facture sous des lignes distinctes pour
                  des raisons comptables (PCG) et fiscales.
                </p>
                <p>
                  <strong>Prix barre et loi Hamon / directive Omnibus.</strong> La directive
                  europeenne Omnibus 2022 (transposee en droit francais par l&apos;ordonnance du
                  22 decembre 2021) impose au commercant d&apos;afficher le prix le plus bas
                  pratique au cours des 30 jours precedant la promotion comme prix de reference.
                  Les anciennes pratiques de &laquo; prix conseille &raquo; gonfle pour faire
                  apparaitre une fausse promo sont desormais sanctionnees par la DGCCRF.
                </p>
                <p>
                  <strong>Soldes en France : encadrement strict.</strong> Code de commerce art.
                  L310-3 : 2 periodes de soldes par an de 4 semaines (hiver fin janvier, ete fin
                  juin). Pendant ces periodes, le commercant peut vendre a perte (sinon
                  l&apos;art. L442-2 l&apos;interdit). Hors soldes, des promotions sont autorisees
                  mais avec ce meme prix de reference 30 jours.
                </p>
                <p>
                  <strong>Marge commerciale et remise.</strong> Une remise de 25 pourcent sur un
                  produit vendu avec 40 pourcent de marge brute ramene la marge a 20 pourcent
                  seulement. Au-dela de 30 pourcent de remise, beaucoup de produits passent en
                  vente a perte. C&apos;est pourquoi les chaines preparent leurs operations soldes
                  des juin/juillet en negociant des prix d&apos;achat soldes specifiques aupres
                  des fournisseurs.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur le calcul de remises et la reglementation des soldes en France."
              items={[
                {
                  question: "Pourquoi deux remises de 20 pourcent et 10 pourcent ne font pas 30 pourcent ?",
                  answer:
                    "Les remises se cumulent en cascade : la seconde s&apos;applique sur le prix deja reduit. Sur 100 EUR : -20 pourcent donne 80 EUR, puis -10 pourcent sur 80 EUR donne 72 EUR. Soit une reduction reelle de 28 pourcent et non 30 pourcent. La formule generale : (1 - 0,20) x (1 - 0,10) = 0,72, soit 28 pourcent de reduction totale. C&apos;est mathematiquement normal mais souvent contre-intuitif pour les acheteurs.",
                },
                {
                  question: "Quelle est la reglementation des soldes en France ?",
                  answer:
                    "Code de commerce art. L310-3 : deux periodes annuelles de 4 semaines (soldes d&apos;hiver fin janvier, soldes d&apos;ete fin juin), dates fixees par arrete prefectoral. Pendant les soldes, la vente a perte est legalement autorisee (par derogation a l&apos;art. L442-2). Le prix de reference (loi Hamon + directive Omnibus 2022) doit etre le prix le plus bas des 30 jours precedents.",
                },
                {
                  question: "Que dit la directive Omnibus sur les prix barres ?",
                  answer:
                    "La directive europeenne 2019/2161 dite Omnibus, transposee en France en decembre 2021, oblige tout commercant qui annonce une reduction de prix a afficher comme reference le prix le plus bas pratique pendant les 30 jours precedant la promotion. Fini les &laquo; prix conseille fabricant &raquo; gonfles : la DGCCRF peut sanctionner jusqu&apos;a 4 pourcent du chiffre d&apos;affaires en cas d&apos;infraction.",
                },
                {
                  question: "Peut-on cumuler un code promo avec une remise en magasin ?",
                  answer:
                    "Cela depend de la politique commerciale de l&apos;enseigne. La plupart des CGV stipulent &laquo; non-cumulable avec d&apos;autres promotions en cours &raquo;. Verifiez le fichier CGU/CGV avant utilisation. Quand le cumul est autorise, l&apos;ordre des reductions importe : un pourcentage applique avant un bon d&apos;achat fixe donne un resultat different.",
                },
                {
                  question: "Quelle difference entre remise, ristourne et rabais ?",
                  answer:
                    "Remise : reduction commerciale accordee au moment de l&apos;achat (volume, fidelite, client preferentiel). Ristourne : reduction calculee a posteriori sur un volume annuel cumule, generalement versee fin decembre. Rabais : reduction exceptionnelle pour compenser un defaut produit, un retard de livraison ou un service degrade. Comptablement (PCG art. 521-1), ces trois types apparaissent sur des comptes distincts.",
                },
                {
                  question: "Comment calculer la remise reelle d&apos;une promotion -50 pourcent puis -20 pourcent ?",
                  answer:
                    "Formule : reduction totale = 1 - (1 - 0,50) x (1 - 0,20) = 1 - 0,40 = 0,60 = 60 pourcent. Sur 100 EUR : -50 pourcent donne 50 EUR, puis -20 pourcent donne 40 EUR. La reduction reelle est de 60 pourcent (et non 70 pourcent qu&apos;on pourrait penser en additionnant naivement).",
                },
                {
                  question: "Une remise reduit-elle ma marge en tant que commercant ?",
                  answer:
                    "Oui, et plus que la perception immediate ne le suggere. Sur un produit achete 60 EUR vendu 100 EUR (40 pourcent de marge brute), une remise de 20 pourcent ramene le prix a 80 EUR : la marge passe de 40 EUR a 20 EUR, soit -50 pourcent de marge brute. Les remises agressives (au-dela de 25-30 pourcent) ecrasent rapidement la rentabilite : a calibrer en fonction de votre marge initiale.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Raccourcis remises</h3>
              <div className="mt-3 space-y-2">
                {[
                  { pct: "10%", sur100: "90 €" },
                  { pct: "20%", sur100: "80 €" },
                  { pct: "25%", sur100: "75 €" },
                  { pct: "30%", sur100: "70 €" },
                  { pct: "50%", sur100: "50 €" },
                  { pct: "70%", sur100: "30 €" },
                ].map((r) => (
                  <div key={r.pct} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{r.pct}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{r.sur100} / 100</span>
                  </div>
                ))}
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
