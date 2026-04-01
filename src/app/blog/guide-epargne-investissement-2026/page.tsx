"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleGuideEpargneInvestissement2026() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-14"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <nav className="mb-6 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <Link href="/blog" className="transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4">
              Blog
            </Link>
            <span>&rsaquo;</span>
            <span style={{ color: "var(--foreground)" }}>Epargne et investissement en 2026 : simuler et optimiser</span>
          </nav>

          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Finance
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Epargne et investissement en 2026 :{" "}
            <span style={{ color: "var(--primary)" }}>simuler et optimiser</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>13 mars 2026</span>
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--border)" }} />
            <span>6 min de lecture</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12">
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="prose-outilis space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            <p>
              Entre l&apos;inflation qui reste au-dessus de l&apos;objectif de la BCE, des livrets reglementes
              dont les taux ont commence a baisser, et des marches financiers volatils, 2026 oblige les
              epargnants a repenser leur strategie. Voici comment simuler et optimiser vos placements
              pour faire travailler votre argent efficacement.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              La puissance des interets composes
            </h2>
            <p>
              Einstein aurait qualifie les interets composes de &quot;huitieme merveille du monde&quot;. Le
              principe est simple : vos gains generent eux-memes des gains, creant un effet boule de
              neige. Mais peu de gens realisent a quel point l&apos;impact est spectaculaire sur le long terme.
            </p>
            <p>
              Prenons un exemple concret : vous placez 200 euros par mois a 7 % de rendement annuel moyen
              (ce que le MSCI World a historiquement delivre). Au bout de 20 ans, vous aurez investi
              48 000 euros, mais votre capital atteindra environ <strong>104 000 euros</strong>. Les interets
              composes ont plus que double votre mise. Au bout de 30 ans, le capital grimpe a
              environ <strong>243 000 euros</strong> pour 72 000 euros investis.
            </p>
            <p>
              La cle, c&apos;est le temps. Commencer 5 ans plus tot vaut bien plus qu&apos;augmenter ses versements
              de 50 %. Simulez vos propres scenarios avec notre{" "}
              <Link href="/outils/calculateur-epargne" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                calculateur d&apos;epargne
              </Link>{" "}
              pour visualiser la trajectoire de votre capital.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              L&apos;inflation : l&apos;ennemi invisible de votre epargne
            </h2>
            <p>
              En 2026, l&apos;inflation en France tourne autour de 2,2 %. Ca parait peu, mais sur 10 ans
              a ce rythme, 10 000 euros d&apos;aujourd&apos;hui n&apos;auront plus que l&apos;equivalent
              de <strong>8 000 euros</strong> de pouvoir d&apos;achat. Autrement dit, laisser son argent
              dormir sur un compte courant, c&apos;est perdre 2 % de sa valeur chaque annee.
            </p>
            <p>
              Le Livret A, a 2,4 % debut 2026, ne compense quasiment plus l&apos;inflation. Il reste utile
              comme epargne de precaution (liquidite immediate, capital garanti), mais ne doit pas
              representer l&apos;essentiel de votre patrimoine. Pour mesurer l&apos;erosion de votre
              pouvoir d&apos;achat, utilisez notre{" "}
              <Link href="/outils/calculateur-inflation" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                calculateur d&apos;inflation
              </Link>.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Crypto et flat tax : la fiscalite en 2026
            </h2>
            <p>
              Les plus-values sur actifs numeriques restent soumises au Prelevement Forfaitaire Unique
              (PFU) de <strong>30 %</strong> en 2026, decompose en 12,8 % d&apos;impot sur le revenu et
              17,2 % de prelevements sociaux. Attention : vous pouvez egalement opter pour le bareme
              progressif de l&apos;IR si c&apos;est plus avantageux (par exemple si votre TMI est de 11 %).
            </p>
            <p>
              Quelques regles a connaitre :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>L&apos;imposition se declenche uniquement lors de la <strong>conversion en monnaie fiat</strong> (euro, dollar) ou lors d&apos;un achat en crypto</li>
              <li>Les echanges crypto-crypto ne sont pas imposables depuis 2023</li>
              <li>Un abattement s&apos;applique si le total des cessions annuelles est inferieur a 305 euros</li>
              <li>Les NFT sont fiscalises de la meme maniere que les cryptomonnaies depuis 2024</li>
            </ul>
            <p>
              Pour calculer precisement l&apos;impot sur vos gains crypto, utilisez notre{" "}
              <Link href="/outils/simulateur-flat-tax-crypto" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                simulateur flat tax crypto
              </Link>.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Investissement locatif : rendement reel vs affiche
            </h2>
            <p>
              L&apos;immobilier locatif reste un placement privilegie des Francais. Mais le rendement
              affiche par les agences (souvent 5 a 7 % &quot;brut&quot;) cache une realite bien differente.
              Entre la taxe fonciere, les charges de copropriete, l&apos;assurance, les travaux, la
              vacance locative et la fiscalite, le rendement net tombe souvent a <strong>2 a 4 %</strong>.
            </p>
            <p>
              Ce n&apos;est pas forcement mauvais (l&apos;effet de levier du credit et la plus-value potentielle
              compensent), mais il faut entrer dans le calcul les yeux ouverts. Notre{" "}
              <Link href="/outils/calculateur-rentabilite-locative" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                calculateur de rentabilite locative
              </Link>{" "}
              vous montre le rendement net-net en integrant toutes les charges reelles.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Anticiper la succession : un sujet a ne pas negliger
            </h2>
            <p>
              La fiscalite successorale francaise est l&apos;une des plus lourdes d&apos;Europe. Chaque
              enfant beneficie d&apos;un abattement de 100 000 euros par parent (renouvelable tous les
              15 ans). Au-dela, les taux grimpent vite :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>5 %</strong> jusqu&apos;a 8 072 euros (apres abattement)</li>
              <li><strong>20 %</strong> de 15 933 a 552 324 euros</li>
              <li><strong>30 %</strong> de 552 324 a 902 838 euros</li>
              <li><strong>45 %</strong> au-dela de 1 805 677 euros</li>
            </ul>
            <p>
              Pour un heritage entre freres et soeurs, l&apos;abattement n&apos;est que de 15 932 euros avec
              un taux de 35 a 45 %. Et entre non-parents, c&apos;est 60 % apres seulement 1 594 euros
              d&apos;abattement. Anticipez en simulant avec notre{" "}
              <Link href="/outils/simulateur-droits-succession" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                simulateur de droits de succession
              </Link>.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Strategie d&apos;allocation recommandee en 2026
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Epargne de precaution</strong> : 3 a 6 mois de depenses sur Livret A / LDDS</li>
              <li><strong>Moyen terme (3-8 ans)</strong> : fonds euros en assurance-vie + obligations</li>
              <li><strong>Long terme (8+ ans)</strong> : ETF actions monde via PEA, puis assurance-vie</li>
              <li><strong>Diversification</strong> : immobilier (SCPI ou locatif direct), crypto (5 a 10 % max du patrimoine)</li>
            </ul>
            <p>
              L&apos;important est de definir vos objectifs, votre horizon de placement et votre tolerance
              au risque avant d&apos;investir. Les outils de simulation permettent de tester differents
              scenarios sans risque.
            </p>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Simulez la croissance de votre epargne avec les interets composes</p>
              <Link
                href="/outils/calculateur-epargne"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
              >
                Essayer l&apos;outil
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            <div className="mt-10 border-t pt-6" style={{ borderColor: "var(--border)" }}>
              <Link
                href="/blog"
                className="text-sm font-medium transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4"
                style={{ color: "var(--muted)" }}
              >
                &larr; Retour au blog
              </Link>
            </div>
          </div>
          <aside className="hidden space-y-6 lg:block">
            <div className="sticky top-24 space-y-6">
              <AdPlaceholder className="min-h-[250px]" />
              <AdPlaceholder className="min-h-[250px]" />
            </div>
          </aside>
          </div>
        </div>
      </article>
    </>
  );
}
