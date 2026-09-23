"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

export default function SimulateurFlatTaxCrypto() {
  const [prixAcquisition, setPrixAcquisition] = useState("5000");
  const [prixCession, setPrixCession] = useState("12000");
  const [montantCession, setMontantCession] = useState("3000");
  const [totalCessionsAnnuelles, setTotalCessionsAnnuelles] = useState("3000");

  const results = useMemo(() => {
    const acq = parseFloat(prixAcquisition) || 0;
    const cess = parseFloat(prixCession) || 0;
    const montant = parseFloat(montantCession) || 0;
    const totalCessions = parseFloat(totalCessionsAnnuelles) || 0;

    if (acq <= 0 || cess <= 0 || montant <= 0) return null;

    const plusValue = montant - (acq * (montant / cess));
    // Exoneration si le total annuel des prix de cession n'excede pas 305 EUR (art. 150 VH bis II CGI).
    // Le total annuel inclut au minimum la cession simulee.
    const exonere = Math.max(totalCessions, montant) <= 305;

    // PFU : 12,8% IR + 18,6% PS (CSG portee a 10,6% par l'art. 12 LFSS 2026) = 31,4%
    const tauxIR = 0.128;
    const tauxPS = 0.186;
    const tauxTotal = tauxIR + tauxPS;

    const montantIR = exonere ? 0 : Math.max(0, plusValue * tauxIR);
    const montantPS = exonere ? 0 : Math.max(0, plusValue * tauxPS);
    const impotTotal = exonere ? 0 : Math.max(0, plusValue * tauxTotal);
    const netApresImpot = montant - Math.max(0, impotTotal);

    return {
      plusValue,
      montantIR,
      montantPS,
      impotTotal,
      netApresImpot,
      exonere,
      tauxEffectif: montant > 0 ? (impotTotal / montant) * 100 : 0,
    };
  }, [prixAcquisition, prixCession, montantCession, totalCessionsAnnuelles]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Simulateur <span style={{ color: "var(--primary)" }}>Flat Tax Crypto</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez l&apos;impôt sur vos plus-values de cession de cryptomonnaies en France. Flat tax (PFU) de 31,4 % : 12,8 % d&apos;IR + 18,6 % de prélèvements sociaux (LFSS 2026).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix d&apos;acquisition total du portefeuille</label>
                  <div className="relative mt-2">
                    <input type="number" value={prixAcquisition} onChange={(e) => setPrixAcquisition(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 pr-10 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Valeur globale du portefeuille au moment de la cession</label>
                  <div className="relative mt-2">
                    <input type="number" value={prixCession} onChange={(e) => setPrixCession(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 pr-10 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant de la cession</label>
                  <div className="relative mt-2">
                    <input type="number" value={montantCession} onChange={(e) => setMontantCession(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 pr-10 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total cessions annuelles</label>
                  <div className="relative mt-2">
                    <input type="number" value={totalCessionsAnnuelles} onChange={(e) => setTotalCessionsAnnuelles(e.target.value)}
                      className="w-full rounded-xl border px-4 py-4 pr-10 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "var(--muted)" }}>&euro;</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            {results && (
              <>
                {results.exonere && (
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "#16a34a" }}>
                    <p className="text-sm font-bold" style={{ color: "#16a34a" }}>Exonération applicable : total des cessions annuelles inférieur ou égal à 305 &euro;</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Vous n&apos;êtes pas imposable sur ces plus-values.</p>
                  </div>
                )}

                <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Plus-value imposable</p>
                  <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: results.plusValue >= 0 ? "#16a34a" : "#dc2626" }}>
                    {fmt(results.plusValue)} &euro;
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                    {results.plusValue >= 0 ? "Gain" : "Moins-value (non imposable)"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Impôt sur le revenu</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(results.montantIR)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>12,8%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prélèvements sociaux</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(results.montantPS)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>18,6%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Impôt total (PFU)</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#dc2626" }}>{fmt(results.impotTotal)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>31,4%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Net après impôt</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#16a34a" }}>{fmt(results.netApresImpot)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>sur {fmt(parseFloat(montantCession) || 0)} &euro;</p>
                  </div>
                </div>

                {/* Detail breakdown */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détail du calcul</h2>
                  <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--muted)" }}>
                    <div className="flex justify-between">
                      <span>Prix d&apos;acquisition total</span>
                      <span className="font-medium text-[var(--foreground)]">{fmt(parseFloat(prixAcquisition) || 0)} &euro;</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valeur globale portefeuille</span>
                      <span className="font-medium text-[var(--foreground)]">{fmt(parseFloat(prixCession) || 0)} &euro;</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Montant de la cession</span>
                      <span className="font-medium text-[var(--foreground)]">{fmt(parseFloat(montantCession) || 0)} &euro;</span>
                    </div>
                    <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
                      <div className="flex justify-between">
                        <span>Quote-part d&apos;acquisition</span>
                        <span className="font-medium text-[var(--foreground)]">{fmt((parseFloat(prixAcquisition) || 0) * ((parseFloat(montantCession) || 0) / (parseFloat(prixCession) || 1)))} &euro;</span>
                      </div>
                    </div>
                    <div className="flex justify-between font-semibold text-[var(--foreground)]">
                      <span>Plus-value</span>
                      <span>{fmt(results.plusValue)} &euro;</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taux effectif d&apos;imposition</span>
                      <span className="font-medium text-[var(--foreground)]">{results.tauxEffectif.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <ToolHowToSection
              title="Comment calculer l&apos;impôt sur vos cessions crypto"
              description="Trois étapes pour appliquer correctement la flat tax française sur les plus-values d&apos;actifs numériques (PFU, art. 200 A et 150 VH bis du CGI)."
              steps={[
                {
                  name: "Renseigner le coût d'acquisition global",
                  text:
                    "Indiquez le prix total que vous avez payé pour l'ensemble de votre portefeuille crypto (cumul de tous les achats historiques en EUR). C'est la base utilisée par l'administration via la formule de l'art. 150 VH bis CGI : la plus-value se calcule sur la quote-part d'acquisition proportionnelle au montant cédé.",
                },
                {
                  name: "Saisir la valeur portefeuille au moment de la cession",
                  text:
                    "Valeur globale = somme des valeurs de marche de toutes vos cryptomonnaies au moment où vous convertissez en EUR (ou en bien/service). Le rapport montant cédé / valeur globale donne la fraction d'acquisition à déduire de la cession pour calculer la plus-value imposable.",
                },
                {
                  name: "Vérifier le seuil 305 € et appliquer le PFU 31,4 pourcent",
                  text:
                    "Si vos cessions cumulées sur l'année n'excédent pas 305 € : exonération totale (art. 150 VH bis-II CGI). Au-delà, application du PFU : 12,8 pourcent IR + 18,6 pourcent prélèvements sociaux (CSG relevée par la LFSS 2026) = 31,4 pourcent total. Option barème progressif possible (depuis loi de finances 2022) si votre TMI < 12,8 pourcent.",
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
                Cas d&apos;usage du simulateur flat tax crypto
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Vente partielle BTC en plus-value
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Acheté pour 5 000 €, portefeuille valant 12 000 €, vente de 3 000 € :
                    plus-value imposable 1 750 €. Impôt : 549,50 € de PFU 31,4 pourcent (224 €
                    IR + 325,50 € PS). Net dans la poche : 2 450,50 € sur les 3 000 € cédés. À
                    déclarer sur formulaire 2086 annexe à la 2042-C.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Petits arbitrages sous le seuil 305 €
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Investisseur qui sort 280 € sur l&apos;année : exonération totale (art. 150
                    VH bis-II CGI). Attention : c&apos;est le total annuel des cessions, pas la
                    plus-value, qui est seuillé. Au-delà de 305 € de cessions cumulées,
                    l&apos;ensemble des plus-values devient imposable.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Compensation moins-value sur l&apos;année
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Cession ETH avec +5 000 € de plus-value, cession SOL avec -2 000 € sur la
                    même année fiscale : seul 3 000 € de plus-value nette est imposable, soit
                    942 € de PFU. Les moins-values ne se reportent pas sur les années
                    suivantes : intérêt à optimiser le timing des ventes en fin d&apos;année.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Achat de bien avec crypto
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Payer une voiture 25 000 € en BTC est fiscalement équivalent à une vente :
                    fait générateur de plus-value. Si vos BTC ont été acquis à 8 000 € au total
                    (portefeuille global 30 000 €), la plus-value imposable sur l&apos;achat
                    est de 18 333 € : environ 5 757 € de PFU. À budgéter avant de cliquer sur
                    &laquo; payer en crypto &raquo;.
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
                À savoir : fiscalité crypto en France 2026
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Cadre légal : art. 150 VH bis et 200 A CGI.</strong> Les plus-values
                  de cession d&apos;actifs numériques par les particuliers relevés de
                  l&apos;art. 150 VH bis du Code général des impôts (introduit par la loi de
                  finances 2019). Le PFU de 31,4 pourcent (12,8 pourcent IR + 18,6 pourcent PS depuis la LFSS 2026)
                  s&apos;applique conformément à l&apos;art. 200 A du CGI. Option pour le
                  barème progressif de l&apos;IR depuis la loi de finances 2022.
                </p>
                <p>
                  <strong>Fait générateur : conversion en monnaie fiduciaire ou bien.</strong>
                  Imposable : échange crypto contre EUR/USD/CHF, paiement d&apos;un bien ou
                  service en crypto. Non imposable : échange crypto contre crypto (BTC contre
                  ETH, swap stablecoin), transfert entre wallets vous appartenant, staking
                  rewards (mais imposables à la cession ultérieure du token reçu).
                </p>
                <p>
                  <strong>Déclaration obligatoire des comptes étrangers.</strong> Tout compte
                  ouvert sur une plateforme située hors de France (Binance, Kraken, Coinbase,
                  Bybit, etc.) doit être déclaré chaque année via le formulaire 3916-bis,
                  même si aucune cession n&apos;a eu lieu. Sanctions : 750 € par compte non
                  déclaré, 1 500 € si valeur cumulée &gt; 50 000 €. Cette obligation
                  s&apos;applique même aux cold wallets non-custodial gérés via une plateforme
                  étrangère.
                </p>
                <p>
                  <strong>Activité habituelle : passage en BIC.</strong> L&apos;administration
                  fiscale (BOFiP BOI-RPPM-PVBMC-30-30) considère qu&apos;un volume élevé, des
                  opérations fréquentes ou un usage de techniques sophistiquées (effet de
                  levier, dérivés) peuvent requalifier l&apos;activité en exercice habituel,
                  imposable au régime des Bénéfices Industriels et Commerciaux (BIC) au
                  barème progressif + cotisations sociales TNS. Critère flou : la
                  jurisprudence se construit progressivement.
                </p>
                <p>
                  <strong>NFT et DeFi : zone grise.</strong> Les NFT (Non Fungible Tokens) sont
                  imposés au PFU au même titre que les cryptos selon BOFiP. Les opérations DeFi
                  (yield farming, lending, liquidity providing) ne sont pas explicitement
                  cadrées : prudence et conservation de toutes les preuves. Conseil pratique :
                  utilisez un outil de tracking (Koinly, Waltio, Coin-Tracking) pour générer
                  vos formulaires 2086 automatiquement.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions fréquentes sur la fiscalité des plus-values crypto en France 2026."
              items={[
                {
                  question: "Les échanges crypto-crypto sont-ils imposables ?",
                  answer:
                    "Non. Selon l'art. 150 VH bis CGI, seules les conversions en monnaie fiduciaire (EUR, USD, CHF, GBP) ou les achats de biens et services avec des cryptomonnaies sont des faits générateurs d'imposition. Échanger BTC contre ETH, swapper un stablecoin, déplacer entre wallets : aucun impôt. Vous pouvez donc rebalancer un portefeuille crypto sans déclencher d'impôt tant que vous restez en crypto.",
                },
                {
                  question: "Que faire en cas de moins-value crypto ?",
                  answer:
                    "Une moins-value n'entraîne pas d'imposition. Elle se compense uniquement avec des plus-values de même nature sur la même année fiscale (art. 150 VH bis-VI CGI). Pas de report sur les années suivantes, pas de déduction du revenu global. Stratégie d'optimisation : si vous avez des plus-values latentes en fin d'année, « cristalliser » vos pertes pour réduire l'assiette imposable.",
                },
                {
                  question: "Puis-je opter pour le barème progressif au lieu du PFU ?",
                  answer:
                    "Oui, depuis la loi de finances 2022. L'option barème progressif s'exerce à la déclaration (case 3CN) et porte sur l'ensemble des plus-values d'actifs numériques du foyer ; elle est distincte de l'option globale 2OP des autres revenus du capital. Avantageuse uniquement si votre Tranche Marginale d'Imposition (TMI) est inférieure à 12,8 pourcent (donc TMI 0 ou 11 pourcent). Au-delà, le PFU 12,8 pourcent IR reste plus intéressant.",
                },
                {
                  question: "Dois-je déclarer mes comptes sur Binance, Kraken ou Coinbase ?",
                  answer:
                    "Oui, obligatoire chaque année via le formulaire 3916-bis joint à la déclaration de revenus. Cette obligation concerne TOUS les comptes ouverts sur une plateforme située hors de France, même si vous n'avez rien retiré. Sanctions : 750 € par compte non déclaré, 1 500 € si valeur cumulée dépasse 50 000 €. Le non-respect peut aussi étendre le délai de reprise fiscale à 10 ans.",
                },
                {
                  question: "Quel formulaire pour déclarer mes plus-values crypto ?",
                  answer:
                    "Formulaire 2086 (annexe à la 2042-C) pour le détail des cessions de l'année. Reportez le total des plus-values nettes en case 3AN (ou la moins-value en 3BN) de la 2042-C ; pour opter pour le barème progressif, cochez la case 3CN. Si exonéré car total des cessions n'excédant pas 305 €, vous n'avez pas de 2086 à remplir mais devez quand même cocher la case correspondante. Le formulaire 3916-bis déclare les comptes étrangers séparément.",
                },
                {
                  question: "Le seuil 305 € concerne le total des ventes ou la plus-value ?",
                  answer:
                    "Le total des prix de cession sur l'année (somme de tous vos retraits crypto-vers-EUR), pas la plus-value. Si vous vendez 250 € de BTC et 200 € d'ETH dans la même année, le total est 450 € : exonération perdue, l'ensemble des plus-values devient imposable. Le seuil 305 € (art. 150 VH bis-II CGI) est très bas et très facile à dépasser.",
                },
                {
                  question: "Le staking et le mining sont-ils imposables ?",
                  answer:
                    "Le staking : les récompenses reçues sont imposées au moment de la cession ultérieure du token, dans le cadre de l'art. 150 VH bis CGI (PFU 31,4 pourcent). Le mining : si occasionnel, idem. Si l'activité est habituelle (volumes importants, matériel dédié), requalification en BNC ou BIC professionnels au barème progressif IR + cotisations sociales TNS. La jurisprudence est en construction, prudence en cas de gros volumes.",
                },
              ]}
            />
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
