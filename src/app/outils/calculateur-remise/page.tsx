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
        reduction = currentPrice * (Math.min(val, 100) / 100); // pas de prix negatif au-dela de 100 %
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
            Calculez le prix final après une ou plusieurs réductions. Cumulez pourcentages et montants fixes.
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
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Réductions</h2>
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
                + Ajouter une réduction
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
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Économie</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>-{fmt(result.totalSaved)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Réduction totale</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>-{result.totalPercentSaved.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Steps */}
                {result.steps.length > 1 && (
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détail des réductions</h2>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between rounded-xl px-4 py-2" style={{ background: "var(--surface-alt)" }}>
                        <span className="text-xs font-semibold">Prix de départ</span>
                        <span className="text-sm font-bold">{fmt(parseFloat(prixOriginal) || 0)} &euro;</span>
                      </div>
                      {result.steps.map((step, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2" style={{ background: "var(--surface-alt)" }}>
                          <span className="text-xs font-semibold">
                            Réduction {i + 1} <span style={{ color: "var(--accent)" }}>({step.label})</span>
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
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Cumul de réductions</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Réductions successives</strong> : Quand vous cumulez plusieurs remises, elles s&apos;appliquent en cascade. 20% + 10% ne font pas 30%, mais 28% au total (le second s&apos;applique sur le prix déjà réduit).</p>
                <p><strong className="text-[var(--foreground)]">Exemple</strong> : Sur un article à 100 &euro;, une remise de 20% donne 80 &euro;. Puis 10% supplémentaires sur 80 &euro; = 72 &euro; final (soit 28% d&apos;économie totale).</p>
                <p><strong className="text-[var(--foreground)]">Montant fixe</strong> : Les réductions en montant fixe (bons d&apos;achat, coupons) se déduisent directement du prix courant.</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment calculer une remise en cascade"
              description="Trois étapes pour valider qu&apos;une promotion annoncée correspond bien à la réduction réelle, et éviter les pièges marketing."
              steps={[
                {
                  name: "Saisir le prix de référence",
                  text:
                    "Le prix de référence est, depuis la directive Omnibus 2022 transposée en France, le prix le plus bas pratiqué pendant les 30 jours précédant la promotion. C'est ce prix qui doit servir de base au calcul de la remise affichée, pas un « prix conseillé » gonflé artificiellement.",
                },
                {
                  name: "Ajouter chaque réduction successivement",
                  text:
                    "Cumulez pourcentages (-20 pourcent) et montants fixes (-10 €, bons d'achat). Chaque réduction s'applique sur le prix déjà réduit par la précédente. C'est l'ordre des réductions qui peut changer le résultat final si vous mêlez pourcentages et montants fixes.",
                },
                {
                  name: "Comparer la réduction réelle vs annoncée",
                  text:
                    "Vérifiez que le pourcentage total affiché est cohérent. -20 pourcent + -10 pourcent ne fait pas -30 pourcent mais -28 pourcent (cascade). Une promo « jusqu'à -70 pourcent » cache souvent une moyenne autour de -30 pourcent. L'outil donne la réduction réelle finale.",
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
                    Une veste affichée 199 € à -40 pourcent puis -10 pourcent supplémentaires en
                    caisse : prix final 107,46 € (soit -46 pourcent réels et non -50 pourcent).
                    Pratique pour comparer rapidement deux enseignes pendant les soldes ou le
                    Black Friday.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Négociation B2B et grosses commandes
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un fournisseur propose 5 pourcent de remise quantitative, 2 pourcent de remise
                    exceptionnelle de fin d&apos;exercice, plus 1,5 pourcent d&apos;escompte
                    paiement comptant : réduction réelle 8,38 pourcent (et non 8,5 pourcent
                    additionnels). Sur des achats annuels de 200 k€, l&apos;écart vaut le calcul.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Marge écrasée chez le commerçant
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un produit acheté 60 € et vendu 100 € (40 pourcent de marge) auquel
                    j&apos;applique -25 pourcent de remise : nouveau prix 75 €, marge restante
                    20 pourcent. Une remise client de 25 pourcent ampute la marge brute du
                    commerçant de moitié : à calculer avant de promettre une promo.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Bons d&apos;achat et codes promo cumulés
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un panier de 120 € avec -15 pourcent code promo, puis bon d&apos;achat de
                    -10 € fidélité : prix final 92 € (et 93,50 € si le bon est appliqué avant le code, attention à l&apos;ordre).
                    L&apos;ordre d&apos;application change le total : un commerçant honnête
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
                À savoir : remise, ristourne, rabais, prix barré
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Remise vs ristourne vs rabais.</strong> En droit commercial français, la
                  remise est une réduction commerciale accordée à la commande (volume, ancienneté
                  client). La ristourne est versée a posteriori sur un volume cumulé (typiquement
                  fin d&apos;année). Le rabais est lié à un défaut produit ou un retard de
                  livraison. Les trois figurent sur la facture sous des lignes distinctes pour
                  des raisons comptables (PCG) et fiscales.
                </p>
                <p>
                  <strong>Prix barré et loi Hamon / directive Omnibus.</strong> La directive
                  européenne Omnibus 2022 (transposée en droit français par l&apos;ordonnance du
                  22 décembre 2021) impose au commerçant d&apos;afficher le prix le plus bas
                  pratiqué au cours des 30 jours précédant la promotion comme prix de référence.
                  Les anciennes pratiques de &laquo; prix conseillé &raquo; gonflé pour faire
                  apparaître une fausse promo sont désormais sanctionnées par la DGCCRF.
                </p>
                <p>
                  <strong>Soldes en France : encadrement strict.</strong> Code de commerce art.
                  L310-3 : 2 périodes de soldes par an de 4 semaines (hiver dès le 2e mercredi de janvier, été fin
                  juin). Pendant ces périodes, le commerçant peut vendre à perte (sinon
                  l&apos;art. L442-2 l&apos;interdit). Hors soldes, des promotions sont autorisées
                  mais avec ce même prix de référence 30 jours.
                </p>
                <p>
                  <strong>Marge commerciale et remise.</strong> Une remise de 25 pourcent sur un
                  produit vendu avec 40 pourcent de marge brute ramène la marge à 20 pourcent
                  seulement. Au-delà de 30 pourcent de remise, beaucoup de produits passent en
                  vente à perte. C&apos;est pourquoi les chaînes préparent leurs opérations soldes
                  dès juin/juillet en négociant des prix d&apos;achat soldés spécifiques auprès
                  des fournisseurs.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus fréquentes sur le calcul de remises et la réglementation des soldes en France."
              items={[
                {
                  question: "Pourquoi deux remises de 20 pourcent et 10 pourcent ne font pas 30 pourcent ?",
                  answer:
                    "Les remises se cumulent en cascade : la seconde s'applique sur le prix déjà réduit. Sur 100 € : -20 pourcent donne 80 €, puis -10 pourcent sur 80 € donne 72 €. Soit une réduction réelle de 28 pourcent et non 30 pourcent. La formule générale : (1 - 0,20) x (1 - 0,10) = 0,72, soit 28 pourcent de réduction totale. C'est mathématiquement normal mais souvent contre-intuitif pour les acheteurs.",
                },
                {
                  question: "Quelle est la réglementation des soldes en France ?",
                  answer:
                    "Code de commerce art. L310-3 : deux périodes annuelles de 4 semaines (soldes d'hiver à partir du 2e mercredi de janvier, soldes d'été à partir du dernier mercredi de juin), dates fixées par l'arrêté du 27 mai 2019 (avancées d'une semaine selon le calendrier, dérogations pour certains départements). Pendant les soldes, la vente à perte est légalement autorisée (par dérogation à l'art. L442-2). Le prix de référence (loi Hamon + directive Omnibus 2022) doit être le prix le plus bas des 30 jours précédents.",
                },
                {
                  question: "Que dit la directive Omnibus sur les prix barrés ?",
                  answer:
                    "La directive européenne 2019/2161 dite Omnibus, transposée en France en décembre 2021, oblige tout commerçant qui annonce une réduction de prix à afficher comme référence le prix le plus bas pratiqué pendant les 30 jours précédant la promotion. Fini les « prix conseillé fabricant » gonflés : la DGCCRF peut sanctionner jusqu'à 4 pourcent du chiffre d'affaires en cas d'infraction.",
                },
                {
                  question: "Peut-on cumuler un code promo avec une remise en magasin ?",
                  answer:
                    "Cela dépend de la politique commerciale de l'enseigne. La plupart des CGV stipulent « non-cumulable avec d'autres promotions en cours ». Vérifiez le fichier CGU/CGV avant utilisation. Quand le cumul est autorisé, l'ordre des réductions importe : un pourcentage appliqué avant un bon d'achat fixe donne un résultat différent.",
                },
                {
                  question: "Quelle différence entre remise, ristourne et rabais ?",
                  answer:
                    "Remise : réduction commerciale accordée au moment de l'achat (volume, fidélité, client préférentiel). Ristourne : réduction calculée a posteriori sur un volume annuel cumulé, généralement versée fin décembre. Rabais : réduction exceptionnelle pour compenser un défaut produit, un retard de livraison ou un service dégradé. Comptablement (PCG art. 521-1), ces trois types apparaissent sur des comptes distincts.",
                },
                {
                  question: "Comment calculer la remise réelle d'une promotion -50 pourcent puis -20 pourcent ?",
                  answer:
                    "Formule : réduction totale = 1 - (1 - 0,50) x (1 - 0,20) = 1 - 0,40 = 0,60 = 60 pourcent. Sur 100 € : -50 pourcent donne 50 €, puis -20 pourcent donne 40 €. La réduction réelle est de 60 pourcent (et non 70 pourcent qu'on pourrait penser en additionnant naïvement).",
                },
                {
                  question: "Une remise réduit-elle ma marge en tant que commerçant ?",
                  answer:
                    "Oui, et plus que la perception immédiate ne le suggère. Sur un produit acheté 60 € vendu 100 € (40 pourcent de marge brute), une remise de 20 pourcent ramène le prix à 80 € : la marge passe de 40 € à 20 €, soit -50 pourcent de marge brute. Les remises agressives (au-delà de 25-30 pourcent) écrasent rapidement la rentabilité : à calibrer en fonction de votre marge initiale.",
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
