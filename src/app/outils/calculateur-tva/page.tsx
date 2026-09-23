"use client";

import { useState } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const TVA_RATES = [
  { value: "20", label: "20% - Taux normal" },
  { value: "10", label: "10% - Taux intermédiaire" },
  { value: "5.5", label: "5,5% - Taux réduit" },
  { value: "2.1", label: "2,1% - Taux super-réduit" },
];

const PRESETS_TVA = [
  { label: "Repas pro", value: 50 },
  { label: "Facture freelance", value: 1000 },
  { label: "Achat matériel", value: 5000 },
  { label: "Gros chantier", value: 25000 },
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
            Convertissez instantanément HT en TTC et inversement. Taux normaux et réduits français (20 %,
            10 %, 5,5 %, 2,1 %), règles 2026 et franchise en base mises à jour. Pour entrepreneurs,
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
                {/* Slider */}
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={50}
                  value={Math.min(parseFloat(amount) || 0, 50000)}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-3 w-full accent-[#0d4f3c]"
                  aria-label="Curseur montant"
                />
                {/* Presets */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESETS_TVA.map((p) => {
                    const isActive = parseFloat(amount) === p.value;
                    return (
                      <button
                        key={p.label}
                        onClick={() => setAmount(String(p.value))}
                        className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-80"
                        style={{
                          borderColor: isActive ? "var(--primary)" : "var(--border)",
                          color: isActive ? "var(--primary)" : "var(--muted)",
                          background: isActive ? "rgba(13,79,60,0.06)" : "transparent",
                        }}
                      >
                        {p.label}{" "}
                        <span style={{ color: isActive ? "var(--primary)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                          {p.value.toLocaleString("fr-FR")} &euro;
                        </span>
                      </button>
                    );
                  })}
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

            {/* Visualisation donut */}
            <div className="animate-scale-in stagger-2 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Répartition du montant TTC
              </h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
                <div className="flex justify-center">
                  <DonutChartTVA ht={ht} tva={tva} ttc={ttc} rate={rate} />
                </div>
                <div className="space-y-1">
                  <Row label="Montant HT" value={`${fmt(ht)} €`} sub dotColor="#0d4f3c" />
                  <Row label={`TVA (${rate}%)`} value={`${fmt(tva)} €`} sub dotColor="#e8963e" />
                  <Row label="Montant TTC" value={`${fmt(ttc)} €`} highlight primary dotColor="var(--primary)" />
                </div>
              </div>

              {/* Cartes contextuelles */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Coefficient multiplicateur
                  </p>
                  <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    x {(1 + r).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                  </p>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                    Pour passer du HT au TTC à {rate}%, multipliez par {(1 + r).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 3 })}.
                  </p>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    TVA récupérable (B2B assujetti)
                  </p>
                  <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                    {fmt(tva)} &euro;
                  </p>
                  <p className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                    Si vous êtes assujetti à la TVA, ce montant est déductible sur votre prochaine déclaration.
                  </p>
                </div>
              </div>
            </div>

            {/* Cross-link CTAs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Vous pourriez aussi vouloir
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CrossLinkCard
                  href="/outils/generateur-facture"
                  emoji="📄"
                  title="Générer une facture"
                  desc="Modèle PDF conforme et prêt à envoyer"
                />
                <CrossLinkCard
                  href="/outils/calculateur-marge"
                  emoji="📊"
                  title="Calculer une marge"
                  desc="Marge brute, taux de marque, coefficient"
                />
                <CrossLinkCard
                  href="/outils/calculateur-tjm-freelance"
                  emoji="💼"
                  title="Estimer son TJM"
                  desc="Tarif journalier idéal selon objectif net"
                />
              </div>
            </div>

            <ToolHowToSection
              title="Comment calculer la TVA en 3 étapes"
              description="Le calculateur applique les formules officielles. Aucune donnée n'est envoyée à un serveur."
              steps={[
                {
                  name: "Choisir le sens de conversion",
                  text:
                    "HT -> TTC pour ajouter la TVA à un prix hors taxes (devis client, calcul de prix de vente). TTC -> HT pour retrouver le prix hors taxes à partir d'un montant TTC (note de frais, ticket de caisse).",
                },
                {
                  name: "Saisir le montant",
                  text:
                    "Entrez le montant en euros. Le calcul est instantané, aucun bouton 'Calculer' à presser. Les décimales sont gérées automatiquement (séparateur point ou virgule).",
                },
                {
                  name: "Sélectionner le taux",
                  text:
                    "20 % (taux normal), 10 % (restauration, travaux), 5,5 % (alimentation, livres), 2,1 % (médicaments remboursés, presse). En cas de doute, consultez la liste détaillée plus bas ou la documentation impots.gouv.fr.",
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
                Les situations les plus fréquentes où ce calculateur fait gagner du temps au quotidien.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Établir un devis ou une facture
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous fixez un prix HT pour vos prestations et la TVA s&apos;ajoute selon le taux
                    applicable. Pour la majorité des prestations B2B, le taux est 20 %. Pour la
                    restauration, l&apos;hébergement ou les travaux d&apos;amélioration de logement,
                    consultez le taux 10 % ou 5,5 %.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Note de frais et remboursements
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous avez un montant TTC (ticket de caisse, reçu) et devez retrouver la TVA pour la
                    déclaration mensuelle ou trimestrielle. Le mode TTC vers HT extrait la TVA exacte sans
                    erreur d&apos;arrondi.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Vérification d&apos;une facture fournisseur
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Avant de valider une facture pour comptabilité, contrôlez rapidement que le HT, la TVA
                    et le TTC affichés sont cohérents. Une erreur d&apos;arrondi de quelques centimes
                    n&apos;est pas un problème, mais une différence plus importante doit être signalée.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Auto-entrepreneur en franchise en base
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Tant que vous êtes sous le seuil de franchise en base, vous facturez sans TVA et la
                    mention &quot;TVA non applicable, art. 293 B du CGI&quot; doit figurer. Si vous
                    dépassez le seuil ou avez opté pour la TVA, ce calculateur facilite la transition.
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
                Les taux de TVA français en détail
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Taux normal de 20 %.</strong> S&apos;applique par défaut à la majorité des biens
                  et services : services aux entreprises, vente de biens neufs, électronique, vêtements,
                  produits de luxe, prestations B2B et B2C non spécifiquement réduites.
                </p>
                <p>
                  <strong>Taux intermédiaire de 10 %.</strong> Restauration et hébergement, transports de
                  voyageurs, travaux d&apos;amélioration et de transformation dans un logement de plus de
                  2 ans (hors rénovation énergétique), bois de chauffage, services à la personne hors zéro
                  TVA, billetterie de certains événements culturels et sportifs.
                </p>
                <p>
                  <strong>Taux réduit de 5,5 %.</strong> Produits alimentaires de base, eau, livres
                  (papier ou numérique), billets de cinéma, travaux de rénovation énergétique éligibles,
                  équipements pour personnes handicapées. Depuis le 1er août 2025, les abonnements
                  d&apos;électricité et de gaz sont passés au taux normal de 20 %.
                </p>
                <p>
                  <strong>Taux super-réduit de 2,1 %.</strong> Médicaments remboursés par la Sécurité
                  sociale, presse imprimée et numérique, 140 premières représentations de certains
                  spectacles (le périmètre exact figure aux articles 281 quater, 281 octies et 298 septies
                  du CGI).
                </p>
                <p>
                  <strong>Franchise en base TVA.</strong> Sous les seuils de l&apos;art. 293 B du CGI
                  (en 2026 : 85 000 € pour la vente et l&apos;hébergement, 37 500 € pour les prestations
                  de services, avec seuils majorés de 93 500 € et 41 250 €), micro-entrepreneurs et
                  petites entreprises sont dispensés de facturer la TVA. Au-delà des seuils, le passage à la TVA est obligatoire.
                  La mention &quot;TVA non applicable, art. 293 B du CGI&quot; doit alors figurer sur les
                  factures.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus fréquentes sur le calcul et la facturation de la TVA en France."
              items={[
                {
                  question: "Comment passer du HT au TTC ?",
                  answer:
                    "TTC = HT x (1 + taux/100). Pour 1 000 € HT à 20 %, le TTC est de 1 000 x 1,20 = 1 200 €, soit 200 € de TVA. Le mode HT -> TTC du calculateur applique directement cette formule.",
                },
                {
                  question: "Comment retrouver le HT à partir d'un TTC ?",
                  answer:
                    "HT = TTC / (1 + taux/100). Pour 1 200 € TTC à 20 %, le HT est 1 200 / 1,20 = 1 000 €, et la TVA 200 €. Attention : ne JAMAIS faire TTC x 0,80 pour retirer la TVA à 20 % - c'est une erreur classique qui sous-évalue le HT.",
                },
                {
                  question: "Quel taux de TVA pour la restauration ?",
                  answer:
                    "Le taux normal en restauration est 10 % pour la consommation sur place et à emporter. L'alcool consommé sur place reste à 20 %. La restauration scolaire et certains repas livres en lien avec une prestation de services (traiteur) peuvent être à 5,5 % ou 10 % selon le cas.",
                },
                {
                  question: "Quel taux de TVA pour des travaux dans un logement ?",
                  answer:
                    "Travaux d'amélioration, transformation et entretien dans un logement de plus de 2 ans : 10 %. Travaux de rénovation énergétique éligibles (isolation, chaudière à haute performance, pompe à chaleur, etc.) : 5,5 %. Construction neuve ou logement de moins de 2 ans : 20 %.",
                },
                {
                  question: "Suis-je obligé de facturer la TVA en tant qu'auto-entrepreneur ?",
                  answer:
                    "Non, tant que vous êtes sous les seuils de franchise en base TVA (en 2026 : 85 000 € en vente / hébergement, 37 500 € en prestations de services, seuils majorés 93 500 / 41 250 €). Au-delà, la TVA devient obligatoire et vous devez la facturer, la collecter et la reverser via vos déclarations périodiques.",
                },
                {
                  question: "Que faire en cas d'arrondi différent sur ma facture ?",
                  answer:
                    "Les écarts d'un ou deux centimes sont normaux et liés aux méthodes d'arrondi. Le Code général des impôts tolère une différence par arrondi de 0,01 € par ligne. Pour les marchés publics ou les factures B2B importantes, l'arrondi commercial (au plus près) est la règle la plus courante.",
                },
                {
                  question: "La TVA s'applique-t-elle aux ventes hors France ?",
                  answer:
                    "Pour des ventes B2B intracommunautaires (au sein de l'UE), la facture est en général HT avec mention 'autoliquidation par le preneur'. Pour le B2C intracommunautaire, le guichet OSS (One Stop Shop) regroupe les déclarations. Hors UE (export), pas de TVA française. Les règles exactes sont détaillées à impots.gouv.fr.",
                },
                {
                  question: "Le calculateur conserve-t-il mes montants ?",
                  answer:
                    "Non. Tout est calculé dans votre navigateur, en local. Aucun montant, aucun calcul n'est envoyé sur un serveur ni stocké. Vous pouvez utiliser le calculateur sans inscription et sans limite.",
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

function Row({
  label,
  value,
  highlight,
  primary,
  dotColor,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  primary?: boolean;
  sub?: boolean;
  dotColor?: string;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-3"
      style={highlight ? { background: "var(--surface-alt)" } : {}}
    >
      <span className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
        {dotColor && (
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: dotColor }} />
        )}
        {label}
      </span>
      <span
        className={`font-semibold ${primary ? "text-xl" : ""}`}
        style={{
          color: primary ? "var(--primary)" : "var(--foreground)",
          fontFamily: primary ? "var(--font-display)" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function DonutChartTVA({
  ht,
  tva,
  ttc,
  rate,
}: {
  ht: number;
  tva: number;
  ttc: number;
  rate: string;
}) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const stroke = 22;
  const total = ttc > 0 ? ttc : 1;
  const htPct = Math.max(0, ht) / total;
  const tvaPct = Math.max(0, tva) / total;
  const htLen = htPct * c;
  const tvaLen = tvaPct * c;
  return (
    <svg width="160" height="160" viewBox="-80 -80 160 160" role="img" aria-label="Répartition HT et TVA dans le montant TTC">
      <circle cx="0" cy="0" r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <g transform="rotate(-90)">
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#0d4f3c"
          strokeWidth={stroke}
          strokeDasharray={`${htLen} ${c}`}
          strokeLinecap="butt"
        />
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke="#e8963e"
          strokeWidth={stroke}
          strokeDasharray={`${tvaLen} ${c}`}
          strokeDashoffset={-htLen}
          strokeLinecap="butt"
        />
      </g>
      <text
        x="0"
        y="-4"
        textAnchor="middle"
        fontSize="10"
        fill="var(--muted)"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Taux TVA
      </text>
      <text
        x="0"
        y="14"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="var(--primary)"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {rate}%
      </text>
    </svg>
  );
}

function CrossLinkCard({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold transition-colors group-hover:text-[#0d4f3c]"
          style={{ color: "var(--foreground)" }}
        >
          {title} <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
