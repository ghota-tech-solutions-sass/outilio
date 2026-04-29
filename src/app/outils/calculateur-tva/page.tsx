"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const TVA_RATES = [
  { value: "20", label: "20% - Taux normal" },
  { value: "10", label: "10% - Taux intermediaire" },
  { value: "5.5", label: "5,5% - Taux reduit" },
  { value: "2.1", label: "2,1% - Taux super-reduit" },
];

export default function CalculateurTVA() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("20");
  const [mode, setMode] = useState<"ht-to-ttc" | "ttc-to-ht">("ht-to-ttc");

  const val = parseFloat(amount) || 0;
  const r = (parseFloat(rate) || 20) / 100;

  let ht: number, ttc: number, tva: number;
  if (mode === "ht-to-ttc") {
    ht = val;
    tva = val * r;
    ttc = val + tva;
  } else {
    ttc = val;
    ht = val / (1 + r);
    tva = ttc - ht;
  }

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur de <span style={{ color: "var(--primary)" }}>TVA</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez instantanement HT en TTC et inversement. Taux normaux et reduits francais (20 %,
            10 %, 5,5 %, 2,1 %), regles 2026 et franchise en base mises a jour. Pour entrepreneurs,
            comptables et freelances.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                <button
                  onClick={() => setMode("ht-to-ttc")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{ background: mode === "ht-to-ttc" ? "var(--primary)" : "transparent", color: mode === "ht-to-ttc" ? "white" : "var(--muted)" }}
                >
                  HT &rarr; TTC
                </button>
                <button
                  onClick={() => setMode("ttc-to-ht")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{ background: mode === "ttc-to-ht" ? "var(--primary)" : "transparent", color: mode === "ttc-to-ht" ? "white" : "var(--muted)" }}
                >
                  TTC &rarr; HT
                </button>
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  Montant {mode === "ht-to-ttc" ? "HT" : "TTC"}
                </label>
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border px-4 py-4 text-2xl font-bold tracking-tight"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--muted)" }}>&euro;</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux de TVA</label>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {TVA_RATES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setRate(t.value)}
                      className="rounded-xl border px-3 py-2.5 text-sm font-medium transition-all"
                      style={{
                        borderColor: rate === t.value ? "var(--primary)" : "var(--border)",
                        background: rate === t.value ? "var(--primary)" : "var(--surface)",
                        color: rate === t.value ? "white" : "var(--foreground)",
                      }}
                    >
                      {t.value}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <ResultCard label="Montant HT" value={`${fmt(ht)} €`} />
              <ResultCard label={`TVA (${rate}%)`} value={`${fmt(tva)} €`} accent />
              <ResultCard label="Montant TTC" value={`${fmt(ttc)} €`} primary />
            </div>

            <ToolHowToSection
              title="Comment calculer la TVA en 3 etapes"
              description="Le calculateur applique les formules officielles. Aucune donnee n'est envoyee a un serveur."
              steps={[
                {
                  name: "Choisir le sens de conversion",
                  text:
                    "HT -> TTC pour ajouter la TVA a un prix hors taxes (devis client, calcul de prix de vente). TTC -> HT pour retrouver le prix hors taxes a partir d'un montant TTC (note de frais, ticket de caisse).",
                },
                {
                  name: "Saisir le montant",
                  text:
                    "Entrez le montant en euros. Le calcul est instantane, aucun bouton 'Calculer' a presser. Les decimales sont gerees automatiquement (separateur point ou virgule).",
                },
                {
                  name: "Selectionner le taux",
                  text:
                    "20 % (taux normal), 10 % (restauration, travaux), 5,5 % (alimentation, livres), 2,1 % (medicaments rembourses, presse). En cas de doute, consultez la liste detaillee plus bas ou la documentation impots.gouv.fr.",
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
                Cas d&apos;usage du calculateur de TVA
              </h2>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Les situations les plus frequentes ou ce calculateur fait gagner du temps au quotidien.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Etablir un devis ou une facture
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous fixez un prix HT pour vos prestations et la TVA s&apos;ajoute selon le taux
                    applicable. Pour la majorite des prestations B2B, le taux est 20 %. Pour la
                    restauration, l&apos;hebergement ou les travaux d&apos;amelioration de logement,
                    consultez le taux 10 % ou 5,5 %.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Note de frais et remboursements
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous avez un montant TTC (ticket de caisse, recu) et devez retrouver la TVA pour la
                    declaration mensuelle ou trimestrielle. Le mode TTC vers HT extrait la TVA exacte sans
                    erreur d&apos;arrondi.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Verification d&apos;une facture fournisseur
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Avant de valider une facture pour comptabilite, controlez rapidement que le HT, la TVA
                    et le TTC affiches sont coherents. Une erreur d&apos;arrondi de quelques centimes
                    n&apos;est pas un probleme, mais une difference plus importante doit etre signalee.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Auto-entrepreneur en franchise en base
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Tant que vous etes sous le seuil de franchise en base, vous facturez sans TVA et la
                    mention &quot;TVA non applicable, art. 293 B du CGI&quot; doit figurer. Si vous
                    depassez le seuil ou avez opte pour la TVA, ce calculateur facilite la transition.
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
                Les taux de TVA francais en detail
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Taux normal de 20 %.</strong> S&apos;applique par defaut a la majorite des biens
                  et services : services aux entreprises, vente de biens neufs, electronique, vetements,
                  produits de luxe, prestations B2B et B2C non specifiquement reduites.
                </p>
                <p>
                  <strong>Taux intermediaire de 10 %.</strong> Restauration et hebergement, transports de
                  voyageurs, travaux d&apos;amelioration et de transformation dans un logement de plus de
                  2 ans (hors renovation energetique), bois de chauffage, services a la personne hors zero
                  TVA, billetterie de certains evenements culturels et sportifs.
                </p>
                <p>
                  <strong>Taux reduit de 5,5 %.</strong> Produits alimentaires de base, eau, livres
                  (papier ou numerique), abonnements gaz et electricite, billets de cinema, travaux de
                  renovation energetique eligibles, equipements pour personnes handicapees, abonnements
                  TV non lineaire.
                </p>
                <p>
                  <strong>Taux super-reduit de 2,1 %.</strong> Medicaments rembourses par la Securite
                  sociale, presse imprimee et numerique, certaines representations theatrales et de
                  cirque, redevance audiovisuelle (le perimetre exact figure a l&apos;article 281 ter du
                  CGI).
                </p>
                <p>
                  <strong>Franchise en base TVA.</strong> Sous certains seuils (a verifier sur
                  impots.gouv.fr car ils evoluent), micro-entrepreneurs et petites entreprises peuvent etre
                  dispenses de facturer la TVA. Au-dela des seuils, le passage a la TVA est obligatoire.
                  La mention &quot;TVA non applicable, art. 293 B du CGI&quot; doit alors figurer sur les
                  factures.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur le calcul et la facturation de la TVA en France."
              items={[
                {
                  question: "Comment passer du HT au TTC ?",
                  answer:
                    "TTC = HT x (1 + taux/100). Pour 1 000 EUR HT a 20 %, le TTC est de 1 000 x 1,20 = 1 200 EUR, soit 200 EUR de TVA. Le mode HT -> TTC du calculateur applique directement cette formule.",
                },
                {
                  question: "Comment retrouver le HT a partir d'un TTC ?",
                  answer:
                    "HT = TTC / (1 + taux/100). Pour 1 200 EUR TTC a 20 %, le HT est 1 200 / 1,20 = 1 000 EUR, et la TVA 200 EUR. Attention : ne JAMAIS faire TTC x 0,80 pour retirer la TVA a 20 % - c'est une erreur classique qui sous-evalue le HT.",
                },
                {
                  question: "Quel taux de TVA pour la restauration ?",
                  answer:
                    "Le taux normal en restauration est 10 % pour la consommation sur place et a emporter. L'alcool consomme sur place reste a 20 %. La restauration scolaire et certains repas livres en lien avec une prestation de services (traiteur) peuvent etre a 5,5 % ou 10 % selon le cas.",
                },
                {
                  question: "Quel taux de TVA pour des travaux dans un logement ?",
                  answer:
                    "Travaux d'amelioration, transformation et entretien dans un logement de plus de 2 ans : 10 %. Travaux de renovation energetique eligibles (isolation, chaudiere a haute performance, pompe a chaleur, etc.) : 5,5 %. Construction neuve ou logement de moins de 2 ans : 20 %.",
                },
                {
                  question: "Suis-je oblige de facturer la TVA en tant qu'auto-entrepreneur ?",
                  answer:
                    "Non, tant que vous etes sous les seuils de franchise en base TVA (verifier les seuils en vigueur sur impots.gouv.fr). Au-dela, la TVA devient obligatoire et vous devez la facturer, la collecter et la reverser via vos declarations periodiques.",
                },
                {
                  question: "Que faire en cas d'arrondi different sur ma facture ?",
                  answer:
                    "Les ecarts d'un ou deux centimes sont normaux et lies aux methodes d'arrondi. Le Code general des impots tolere une difference par arrondi de 0,01 EUR par ligne. Pour les marches publics ou les factures B2B importantes, l'arrondi commercial (au plus pres) est la regle la plus courante.",
                },
                {
                  question: "La TVA s'applique-t-elle aux ventes hors France ?",
                  answer:
                    "Pour des ventes B2B intracommunautaires (au sein de l'UE), la facture est en general HT avec mention 'autoliquidation par le preneur'. Pour le B2C intracommunautaire, le guichet OSS (One Stop Shop) regroupe les declarations. Hors UE (export), pas de TVA francaise. Les regles exactes sont detaillees a impots.gouv.fr.",
                },
                {
                  question: "Le calculateur conserve-t-il mes montants ?",
                  answer:
                    "Non. Tout est calcule dans votre navigateur, en local. Aucun montant, aucun calcul n'est envoye sur un serveur ni stocke. Vous pouvez utiliser le calculateur sans inscription et sans limite.",
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

function ResultCard({ label, value, primary, accent }: { label: string; value: string; primary?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-2xl border p-5 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</p>
      <p
        className="mt-2 text-xl font-bold"
        style={{ fontFamily: "var(--font-display)", color: primary ? "var(--primary)" : accent ? "var(--accent)" : "var(--foreground)" }}
      >
        {value}
      </p>
    </div>
  );
}
