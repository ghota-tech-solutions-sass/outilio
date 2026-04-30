"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

type CalcMode = "forward" | "reverse";

export default function CalculateurMarge() {
  const [mode, setMode] = useState<CalcMode>("forward");
  const [prixAchat, setPrixAchat] = useState("60");
  const [prixVente, setPrixVente] = useState("100");
  const [margeTarget, setMargeTarget] = useState("40");
  const [prixAchatReverse, setPrixAchatReverse] = useState("60");

  // Convention PCG :
  //   Taux de marge  = (PV - PA) / PA  (sur le cout d'achat)
  //   Taux de marque = (PV - PA) / PV  (sur le prix de vente)
  // Le mode "reverse" prend en entree le taux de MARQUE (sur PV) car c'est l'usage
  // commercial dominant pour fixer un prix de vente cible.
  const resultForward = useMemo(() => {
    if (mode !== "forward") return null;
    const achat = parseFloat(prixAchat) || 0;
    const vente = parseFloat(prixVente) || 0;
    if (achat <= 0 || vente <= 0) return null;

    const profit = vente - achat;
    const tauxMarquePct = (profit / vente) * 100; // sur PV
    const tauxMargePct = (profit / achat) * 100; // sur PA (= markup)
    const coefficient = vente / achat;

    return { achat, vente, profit, tauxMarquePct, tauxMargePct, coefficient };
  }, [mode, prixAchat, prixVente]);

  const resultReverse = useMemo(() => {
    if (mode !== "reverse") return null;
    const achat = parseFloat(prixAchatReverse) || 0;
    const marque = parseFloat(margeTarget) || 0;
    if (achat <= 0 || marque <= 0 || marque >= 100) return null;

    // Saisie = taux de marque cible (sur PV), formule classique
    const venteCible = achat / (1 - marque / 100);
    const profit = venteCible - achat;
    const tauxMargePct = (profit / achat) * 100;
    const coefficient = venteCible / achat;

    return { achat, vente: venteCible, profit, tauxMarquePct: marque, tauxMargePct, coefficient };
  }, [mode, prixAchatReverse, margeTarget]);

  const result = mode === "forward" ? resultForward : resultReverse;

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Business</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>marge</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez votre marge commerciale, taux de marge et markup. Calcul direct ou inverse.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Mode de calcul</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={() => setMode("forward")}
                  className="rounded-xl border px-4 py-3 text-center transition-all"
                  style={{
                    borderColor: mode === "forward" ? "var(--primary)" : "var(--border)",
                    background: mode === "forward" ? "var(--primary)" : "transparent",
                    color: mode === "forward" ? "#fff" : "inherit",
                  }}>
                  <span className="block text-sm font-bold">Calcul direct</span>
                  <span className="block text-[10px] opacity-80">Prix achat + vente</span>
                </button>
                <button onClick={() => setMode("reverse")}
                  className="rounded-xl border px-4 py-3 text-center transition-all"
                  style={{
                    borderColor: mode === "reverse" ? "var(--primary)" : "var(--border)",
                    background: mode === "reverse" ? "var(--primary)" : "transparent",
                    color: mode === "reverse" ? "#fff" : "inherit",
                  }}>
                  <span className="block text-sm font-bold">Calcul inverse</span>
                  <span className="block text-[10px] opacity-80">Prix achat + taux de marque cible</span>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parametres</h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {mode === "forward" ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix d&apos;achat HT (&euro;)</label>
                      <input type="number" step="0.01" value={prixAchat} onChange={(e) => setPrixAchat(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix de vente HT (&euro;)</label>
                      <input type="number" step="0.01" value={prixVente} onChange={(e) => setPrixVente(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix d&apos;achat HT (&euro;)</label>
                      <input type="number" step="0.01" value={prixAchatReverse} onChange={(e) => setPrixAchatReverse(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux de marque cible (% sur PV)</label>
                      <input type="number" step="0.1" value={margeTarget} onChange={(e) => setMargeTarget(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                      <p className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>Convention PCG : marque = (PV-PA)/PV</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Benefice</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(result.profit)} &euro;</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux de marque</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>{result.tauxMarquePct.toFixed(1)}%</p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>(PV-PA)/PV</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux de marge</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.tauxMargePct.toFixed(1)}%</p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>(PV-PA)/PA - PCG</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Coefficient</p>
                    <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.coefficient.toFixed(2)}</p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--muted)" }}>PV / PA</p>
                  </div>
                </div>

                {mode === "reverse" && (
                  <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--primary)", borderColor: "var(--border)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.8)" }}>Prix de vente recommande</p>
                    <p className="mt-2 text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.vente)} &euro;</p>
                  </div>
                )}

                {/* Visual bar */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Repartition du prix de vente</h2>
                  <div className="mt-4 flex h-8 overflow-hidden rounded-full">
                    <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${(result.achat / result.vente) * 100}%`, background: "var(--primary)", minWidth: "20%" }}>
                      Cout {fmt(result.achat)} &euro;
                    </div>
                    <div className="flex items-center justify-center text-xs font-bold text-white" style={{ width: `${(result.profit / result.vente) * 100}%`, background: "var(--accent)", minWidth: "15%" }}>
                      Marque {fmt(result.profit)} &euro;
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Taux de marge vs taux de marque (convention PCG)</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Taux de marque</strong> = (Prix vente - Prix achat) / <strong>Prix vente</strong> x 100. C&apos;est le pourcentage du prix de vente qui est du profit. Tres utilise en commerce/distribution pour fixer un prix.</p>
                <p><strong className="text-[var(--foreground)]">Taux de marge (PCG)</strong> = (Prix vente - Prix achat) / <strong>Prix achat</strong> x 100. Synonyme du markup anglo-saxon. C&apos;est le pourcentage d&apos;augmentation par rapport au cout. Convention du Plan Comptable General francais.</p>
                <p><strong className="text-[var(--foreground)]">Coefficient multiplicateur</strong> = Prix vente / Prix achat. Permet de fixer un prix par simple multiplication.</p>
                <p><strong className="text-[var(--foreground)]">Exemple</strong> : Un produit achete 60 &euro; et vendu 100 &euro; a un taux de marque de 40% (40&euro; sur 100&euro; vendus), un taux de marge de 66,7% (40&euro; sur 60&euro; investis), et un coefficient de 1,67.</p>
                <p className="text-xs" style={{ color: "var(--accent)" }}>Cet outil utilise desormais les denominations strictes du PCG. Verifiez la convention utilisee par votre comptable ou ERP avant comparaison.</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment calculer votre marge commerciale"
              description="Trois etapes pour fixer un prix de vente coherent avec votre rentabilite cible et votre marche."
              steps={[
                {
                  name: "Renseigner le prix d&apos;achat HT",
                  text:
                    "Saisissez le prix de revient unitaire hors taxes : cout d&apos;achat fournisseur + frais d&apos;approche (transport, douane, conditionnement). En production, integrez aussi la matiere et la main-d&apos;oeuvre directe. C&apos;est la base sur laquelle se construit la marge.",
                },
                {
                  name: "Choisir entre calcul direct ou inverse",
                  text:
                    "Calcul direct : vous connaissez votre prix de vente cible (positionnement marche, prix concurrents) et voulez verifier la rentabilite. Calcul inverse : vous fixez d&apos;abord la marge cible (objectif de rentabilite, marge plancher imposee par les couts fixes) et l&apos;outil deduit le prix de vente recommande.",
                },
                {
                  name: "Comparer marque, marge et coefficient",
                  text:
                    "Convention PCG : le taux de MARQUE se calcule sur le prix de vente ((PV-PA)/PV), le taux de MARGE sur le prix d'achat ((PV-PA)/PA, equivalent au markup anglo-saxon). Un produit achete 60 EUR vendu 100 EUR a un taux de marque de 40 pourcent, un taux de marge de 66,7 pourcent, et un coefficient multiplicateur de 1,67. Confondre les deux est l'erreur classique qui fait perdre de l'argent.",
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
                Cas d&apos;usage du calculateur de marge
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    E-commerce et dropshipping
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un produit achete 18 EUR HT en Asie, vendu 49,90 EUR HT : marge de 63,9 pourcent,
                    markup de 177 pourcent, coefficient 2,77. Sur cette marge, il reste a deduire le
                    cout d&apos;acquisition client (souvent 15-25 pourcent du prix), les frais de
                    livraison et les retours.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Prestation de service B2B
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une agence facture 800 EUR HT une journee de conseil dont 250 EUR de cout
                    consultant : marge de 68,75 pourcent. Sur les services, on parle plus souvent
                    de marge brute commerciale que de marge sur cout matiere : c&apos;est le ratio
                    sain pour absorber overhead et benefice net.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Industrie et fabrication
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    En industrie, on calcule d&apos;abord le cout de revient complet (matiere +
                    main-d&apos;oeuvre + amortissement) avant d&apos;appliquer une marge. Pour un
                    produit revient 42 EUR vendu 70 EUR HT : marge brute industrielle de 40 pourcent,
                    proche des standards mecanique-metallurgie (35-45 pourcent).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Restauration et CHR
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un plat avec 8 EUR de food cost vendu 26 EUR HT : marge brute de 69,2 pourcent,
                    coefficient 3,25. La regle empirique en restauration : un coefficient compris
                    entre 3 et 4 sur la nourriture, entre 4 et 5 sur les boissons hors vins.
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
                A savoir : marge brute, marge nette, marge commerciale
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Taux de marge vs taux de marque (PCG).</strong> Selon le Plan Comptable
                  General : le <strong>taux de marge</strong> = (PV - PA) / PA (sur le cout
                  d&apos;achat, equivalent au markup anglo-saxon) ; le <strong>taux de marque</strong>
                  = (PV - PA) / PV (sur le prix de vente, usage commercial dominant). Cet outil
                  affiche desormais les deux ratios sous leurs noms PCG corrects.
                  Verifiez toujours quelle base utilise votre comptable ou votre logiciel ERP avant
                  de comparer : un &laquo; taux de marge de 40 pourcent &raquo; en discours
                  commercial designe souvent le taux de marque PCG.
                </p>
                <p>
                  <strong>Marge brute, marge commerciale, marge nette.</strong> La marge brute =
                  ventes - cout d&apos;achat des marchandises (commerce) ou cout de production
                  (industrie). La marge commerciale est le terme normalise par le PCG (Plan
                  Comptable General) pour le negoce. La marge nette deduit toutes les charges
                  d&apos;exploitation et financieres : c&apos;est elle qui reflete la rentabilite
                  reelle.
                </p>
                <p>
                  <strong>Coefficient multiplicateur.</strong> Tres utilise en commerce de detail
                  et restauration. C&apos;est le ratio Prix de vente HT / Prix d&apos;achat HT.
                  Coefficient de 2 = prix double = markup 100 pourcent = marge 50 pourcent. C&apos;est
                  la facon la plus rapide de fixer un prix en magasin sans calcul mental
                  complexe.
                </p>
                <p>
                  <strong>Marge et fiscalite.</strong> Tous les calculs sont en HT. La TVA
                  collectee a la vente (20 pourcent en taux normal, 10 pourcent en restauration,
                  5,5 pourcent sur l&apos;alimentaire de base, art. 278 sexies du CGI) est neutre
                  pour le commercant assujetti : elle se reverse a l&apos;Etat. En micro-entreprise
                  sous franchise en base TVA (art. 293 B CGI), pensez a integrer ce 20 pourcent
                  d&apos;ecart pour comparer vos prix avec un concurrent assujetti.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur le calcul de marge commerciale en France."
              items={[
                {
                  question: "Quelle est la difference entre taux de marge et taux de marque ?",
                  answer:
                    "Convention PCG (Plan Comptable General). Taux de MARQUE = (PV - PA) / PV : pourcentage du prix de vente qui est du profit. Taux de MARGE = (PV - PA) / PA : pourcentage par rapport au cout d'achat (equivalent au markup anglo-saxon). Exemple : un produit achete 60 EUR et vendu 100 EUR a un taux de marque de 40 pourcent (40 EUR sur 100 EUR de vente) et un taux de marge de 66,7 pourcent (40 EUR sur 60 EUR d'achat). Les deux indicateurs sont valides mais ne sont jamais interchangeables. Attention : dans le langage commercial courant, on dit souvent 'marge' pour designer en realite le taux de marque PCG.",
                },
                {
                  question: "Quelle marge viser pour etre rentable selon mon secteur ?",
                  answer:
                    "Grande distribution : 2-5 pourcent (volumes). Restauration : 60-70 pourcent (food cost). E-commerce : 20-40 pourcent. SaaS / logiciel : 70-90 pourcent (couts marginaux faibles). Artisanat : 30-50 pourcent. En micro-entreprise, n&apos;oubliez pas que les charges sociales (12,3 a 23,1 pourcent du CA selon l&apos;activite) et l&apos;IR s&apos;ajoutent : votre marge nette peut etre 30 a 40 pourcent inferieure a la marge brute affichee.",
                },
                {
                  question: "Comment calculer un prix de vente a partir d&apos;un taux de marque cible ?",
                  answer:
                    "Formule : Prix de vente = Prix d'achat / (1 - Taux de marque / 100). Pour un produit a 60 EUR avec taux de marque cible de 40 pourcent (= 40 pourcent de profit sur PV) : 60 / (1 - 0,40) = 100 EUR. Utilisez le mode 'Calcul inverse'. Erreur classique : faire 60 + 40 pourcent = 84 EUR, ce qui donne en realite seulement un taux de marque de 28,5 pourcent.",
                },
                {
                  question: "Qu&apos;est-ce que le coefficient multiplicateur en commerce ?",
                  answer:
                    "C&apos;est le ratio Prix de vente HT / Prix d&apos;achat HT. Coefficient 2 = doublement du prix = marge 50 pourcent = markup 100 pourcent. En textile, le coefficient classique est 2,5 a 3,5. En bijouterie / luxe : 3 a 5. En grande distribution alimentaire : 1,15 a 1,30 sur les produits frais.",
                },
                {
                  question: "Marge et TVA : comment integrer la TVA dans le prix de vente ?",
                  answer:
                    "La marge se calcule toujours en HT. Une fois le prix HT fixe, ajoutez la TVA applicable : 20 pourcent (taux normal), 10 pourcent (restauration, travaux logements +2 ans), 5,5 pourcent (alimentaire de base, livres) ou 2,1 pourcent (medicaments, presse, art. 281 ter CGI). Pour un prix HT de 100 EUR a 20 pourcent : prix TTC affiche client = 120 EUR, mais votre marge reste calculee sur le HT.",
                },
                {
                  question: "Comment differencier marge commerciale et marge industrielle ?",
                  answer:
                    "La marge commerciale (PCG) = ventes - cout d&apos;achat des marchandises vendues : pour le negoce / distribution. La marge industrielle (ou marge brute de production) = ventes - cout de production (matieres, main-d&apos;oeuvre directe, amortissements machines) : pour la fabrication. Une entreprise mixte calcule les deux separement pour piloter chaque activite.",
                },
                {
                  question: "Pourquoi ma marge brute baisse meme avec plus de ventes ?",
                  answer:
                    "Trois causes classiques. 1) Mix produit defavorable : vous vendez plus de references a faible marge. 2) Hausse du cout d&apos;achat non repercutee (inflation matiere premiere, fournisseur). 3) Promotions ou remises commerciales trop frequentes qui ecrasent le prix de vente moyen. Un suivi mensuel de la marge brute par categorie permet d&apos;identifier la cause en quelques clics.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Marges par secteur</h3>
              <div className="mt-3 space-y-2">
                {[
                  { secteur: "Grande distribution", marge: "~2-5%" },
                  { secteur: "Restauration", marge: "~60-70%" },
                  { secteur: "Mode / Vetements", marge: "~50-60%" },
                  { secteur: "SaaS / Logiciel", marge: "~70-90%" },
                  { secteur: "E-commerce", marge: "~20-40%" },
                  { secteur: "Artisanat", marge: "~30-50%" },
                ].map((s) => (
                  <div key={s.secteur} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{s.secteur}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{s.marge}</span>
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
