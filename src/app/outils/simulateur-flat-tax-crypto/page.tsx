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
    const exonere = totalCessions < 305;

    const tauxIR = 0.128;
    const tauxPS = 0.186;
    const tauxTotal = 0.314;

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
            Calculez l&apos;impot sur vos plus-values de cession de cryptomonnaies en France. Flat tax 31,4% (PFU) depuis 2026.
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
                    <p className="text-sm font-bold" style={{ color: "#16a34a" }}>Exoneration applicable : total des cessions annuelles inferieur a 305 &euro;</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Vous n&apos;etes pas imposable sur ces plus-values.</p>
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
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Impot sur le revenu</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(results.montantIR)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>12,8%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prelevements sociaux</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(results.montantPS)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>18,6%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Impot total (PFU)</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#dc2626" }}>{fmt(results.impotTotal)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>31,4%</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Net apres impot</p>
                    <p className="mt-2 text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#16a34a" }}>{fmt(results.netApresImpot)} &euro;</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>sur {fmt(parseFloat(montantCession) || 0)} &euro;</p>
                  </div>
                </div>

                {/* Detail breakdown */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Detail du calcul</h2>
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
              title="Comment calculer l&apos;impot sur vos cessions crypto"
              description="Trois etapes pour appliquer correctement la flat tax francaise sur les plus-values d&apos;actifs numeriques (PFU, art. 200 A et 150 VH bis du CGI)."
              steps={[
                {
                  name: "Renseigner le cout d&apos;acquisition global",
                  text:
                    "Indiquez le prix total que vous avez paye pour l&apos;ensemble de votre portefeuille crypto (cumul de tous les achats historiques en EUR). C&apos;est la base utilisee par l&apos;administration via la formule de l&apos;art. 150 VH bis CGI : la plus-value se calcule sur la quote-part d&apos;acquisition proportionnelle au montant cede.",
                },
                {
                  name: "Saisir la valeur portefeuille au moment de la cession",
                  text:
                    "Valeur globale = somme des valeurs de marche de toutes vos cryptomonnaies au moment ou vous convertissez en EUR (ou en bien/service). Le rapport montant cede / valeur globale donne la fraction d&apos;acquisition a deduire de la cession pour calculer la plus-value imposable.",
                },
                {
                  name: "Verifier le seuil 305 EUR et appliquer le PFU 30 pourcent",
                  text:
                    "Si vos cessions cumulees sur l&apos;annee sont inferieures a 305 EUR : exoneration totale (art. 150 VH bis-II CGI). Au-dela, application du PFU : 12,8 pourcent IR + 17,2 pourcent prelevements sociaux = 30 pourcent total. Option bareme progressif possible (depuis loi de finances 2022) si votre TMI &lt; 12,8 pourcent.",
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
                    Achete pour 5 000 EUR, portefeuille valant 12 000 EUR, vente de 3 000 EUR :
                    plus-value imposable 1 750 EUR. Impot : 525 EUR de PFU 30 pourcent (224 EUR
                    IR + 301 EUR PS). Net dans la poche : 2 475 EUR sur les 3 000 EUR cedes. A
                    declarer sur formulaire 2086 annexe a la 2042-C.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Petits arbitrages sous le seuil 305 EUR
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Investisseur qui sort 280 EUR sur l&apos;annee : exoneration totale (art. 150
                    VH bis-II CGI). Attention : c&apos;est le total annuel des cessions, pas la
                    plus-value, qui est seuille. Au-dela de 305 EUR de cessions cumulees,
                    l&apos;ensemble des plus-values devient imposable.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Compensation moins-value sur l&apos;annee
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Cession ETH avec +5 000 EUR de plus-value, cession SOL avec -2 000 EUR sur la
                    meme annee fiscale : seul 3 000 EUR de plus-value nette est imposable, soit
                    900 EUR de PFU. Les moins-values ne se reportent pas sur les annees
                    suivantes : interet a optimiser le timing des ventes en fin d&apos;annee.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Achat de bien avec crypto
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Payer une voiture 25 000 EUR en BTC est fiscalement equivalent a une vente :
                    fait generateur de plus-value. Si vos BTC ont ete acquis a 8 000 EUR au total
                    (portefeuille global 30 000 EUR), la plus-value imposable sur l&apos;achat
                    est de 18 333 EUR : 5 500 EUR de PFU. A budgeter avant de cliquer sur
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
                A savoir : fiscalite crypto en France 2026
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Cadre legal : art. 150 VH bis et 200 A CGI.</strong> Les plus-values
                  de cession d&apos;actifs numeriques par les particuliers releves de
                  l&apos;art. 150 VH bis du Code general des impots (introduit par la loi de
                  finances 2019). Le PFU de 30 pourcent (12,8 pourcent IR + 17,2 pourcent PS)
                  s&apos;applique conformement a l&apos;art. 200 A du CGI. Option pour le
                  bareme progressif de l&apos;IR depuis la loi de finances 2022.
                </p>
                <p>
                  <strong>Fait generateur : conversion en monnaie fiduciaire ou bien.</strong>
                  Imposable : echange crypto contre EUR/USD/CHF, paiement d&apos;un bien ou
                  service en crypto. Non imposable : echange crypto contre crypto (BTC contre
                  ETH, swap stablecoin), transfert entre wallets vous appartenant, staking
                  rewards (mais imposables a la cession ulterieure du token recu).
                </p>
                <p>
                  <strong>Declaration obligatoire des comptes etrangers.</strong> Tout compte
                  ouvert sur une plateforme situee hors de France (Binance, Kraken, Coinbase,
                  Bybit, etc.) doit etre declare chaque annee via le formulaire 3916-bis,
                  meme si aucune cession n&apos;a eu lieu. Sanctions : 750 EUR par compte non
                  declare, 1 500 EUR si valeur cumulee &gt; 50 000 EUR. Cette obligation
                  s&apos;applique meme aux cold wallets non-custodial geres via une plateforme
                  etrangere.
                </p>
                <p>
                  <strong>Activite habituelle : passage en BIC.</strong> L&apos;administration
                  fiscale (BOFiP BOI-RPPM-PVBMC-30-30) considere qu&apos;un volume eleve, des
                  operations frequentes ou un usage de techniques sophistiquees (effet de
                  levier, derives) peuvent requalifier l&apos;activite en exercice habituel,
                  imposable au regime des Benefices Industriels et Commerciaux (BIC) au
                  bareme progressif + cotisations sociales TNS. Critere flou : la
                  jurisprudence se construit progressivement.
                </p>
                <p>
                  <strong>NFT et DeFi : zone grise.</strong> Les NFT (Non Fungible Tokens) sont
                  imposes au PFU au meme titre que les cryptos selon BOFiP. Les operations DeFi
                  (yield farming, lending, liquidity providing) ne sont pas explicitement
                  cadrees : prudence et conservation de toutes les preuves. Conseil pratique :
                  utilisez un outil de tracking (Koinly, Waltio, Coin-Tracking) pour generer
                  vos formulaires 2086 automatiquement.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions frequentes sur la fiscalite des plus-values crypto en France 2026."
              items={[
                {
                  question: "Les echanges crypto-crypto sont-ils imposables ?",
                  answer:
                    "Non. Selon l&apos;art. 150 VH bis CGI, seules les conversions en monnaie fiduciaire (EUR, USD, CHF, GBP) ou les achats de biens et services avec des cryptomonnaies sont des faits generateurs d&apos;imposition. Echanger BTC contre ETH, swapper un stablecoin, deplacer entre wallets : aucun impot. Vous pouvez donc rebalancer un portefeuille crypto sans declencher d&apos;impot tant que vous restez en crypto.",
                },
                {
                  question: "Que faire en cas de moins-value crypto ?",
                  answer:
                    "Une moins-value n&apos;entraine pas d&apos;imposition. Elle se compense uniquement avec des plus-values de meme nature sur la meme annee fiscale (art. 150 VH bis-VI CGI). Pas de report sur les annees suivantes, pas de deduction du revenu global. Strategie d&apos;optimisation : si vous avez des plus-values latentes en fin d&apos;annee, &laquo; cristalliser &raquo; vos pertes pour reduire l&apos;assiette imposable.",
                },
                {
                  question: "Puis-je opter pour le bareme progressif au lieu du PFU ?",
                  answer:
                    "Oui, depuis la loi de finances 2022. L&apos;option bareme progressif s&apos;exerce a la declaration et concerne l&apos;ensemble des revenus du capital (interets, dividendes, plus-values mobilieres et crypto). Avantageuse uniquement si votre Tranche Marginale d&apos;Imposition (TMI) est inferieure a 12,8 pourcent (donc TMI 0 ou 11 pourcent). Au-dela, le PFU 12,8 pourcent IR reste plus interessant.",
                },
                {
                  question: "Dois-je declarer mes comptes sur Binance, Kraken ou Coinbase ?",
                  answer:
                    "Oui, obligatoire chaque annee via le formulaire 3916-bis joint a la declaration de revenus. Cette obligation concerne TOUS les comptes ouverts sur une plateforme situee hors de France, meme si vous n&apos;avez rien retire. Sanctions : 750 EUR par compte non declare, 1 500 EUR si valeur cumulee depasse 50 000 EUR. Le non-respect peut aussi etendre le delai de reprise fiscale a 10 ans.",
                },
                {
                  question: "Quel formulaire pour declarer mes plus-values crypto ?",
                  answer:
                    "Formulaire 2086 (annexe a la 2042-C) pour le detail des cessions de l&apos;annee. Reportez le total des plus-values nettes en case 3AN (PFU) ou 2OP (option bareme progressif) de la 2042. Si exonere car total cessions &lt; 305 EUR, vous n&apos;avez pas de 2086 a remplir mais devez quand meme cocher la case correspondante. Le formulaire 3916-bis declare les comptes etrangers separement.",
                },
                {
                  question: "Le seuil 305 EUR concerne le total des ventes ou la plus-value ?",
                  answer:
                    "Le total des prix de cession sur l&apos;annee (somme de tous vos retraits crypto-vers-EUR), pas la plus-value. Si vous vendez 250 EUR de BTC et 200 EUR d&apos;ETH dans la meme annee, le total est 450 EUR : exoneration perdue, l&apos;ensemble des plus-values devient imposable. Le seuil 305 EUR (art. 150 VH bis-II CGI) est tres bas et tres facile a depasser.",
                },
                {
                  question: "Le staking et le mining sont-ils imposables ?",
                  answer:
                    "Le staking : les recompenses recues sont imposees au moment de la cession ulterieure du token, dans le cadre de l&apos;art. 150 VH bis CGI (PFU 30 pourcent). Le mining : si occasionnel, idem. Si l&apos;activite est habituelle (volumes importants, materiel dedie), requalification en BNC ou BIC professionnels au bareme progressif IR + cotisations sociales TNS. La jurisprudence est en construction, prudence en cas de gros volumes.",
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
