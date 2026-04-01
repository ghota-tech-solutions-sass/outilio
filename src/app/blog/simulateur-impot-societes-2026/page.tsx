"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleSimulateurIS2026() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-14"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <Link href="/blog" className="transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4">
              Blog
            </Link>
            <span>&rsaquo;</span>
            <span style={{ color: "var(--foreground)" }}>Simulateur IS 2026 : calculer l&apos;impot sur les societes</span>
          </nav>

          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Fiscalite
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Simulateur IS 2026 : calculer l&apos;impot{" "}
            <span style={{ color: "var(--primary)" }}>sur les societes</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>13 fevrier 2026</span>
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--border)" }} />
            <span>5 min de lecture</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12">
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="prose-outilis space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            <p>
              Que vous soyez dirigeant de SASU, SARL ou SAS, connaitre le montant de l&apos;impot sur les
              societes (IS) est indispensable pour piloter votre tresorerie. En 2026, le bareme de l&apos;IS reste
              stable avec un taux reduit pour les PME : voici comment calculer votre IS et optimiser votre
              fiscalite.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Le bareme de l&apos;IS en 2026
            </h2>
            <p>
              L&apos;impot sur les societes s&apos;applique sur le <strong>benefice fiscal</strong> de votre
              entreprise, c&apos;est-a-dire le resultat comptable corrige des reintegrations et deductions fiscales.
              Le bareme 2026 comporte deux tranches :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Taux reduit de 15 %</strong> : sur les 42 500 premiers euros de benefice, sous conditions (CA &lt; 10 M&euro;, capital entierement libere)</li>
              <li><strong>Taux normal de 25 %</strong> : sur la fraction du benefice au-dela de 42 500 &euro;</li>
            </ul>
            <p>
              Ce taux reduit de 15 % est reserve aux PME dont le chiffre d&apos;affaires ne depasse pas 10 millions
              d&apos;euros et dont le capital est entierement libere et detenu a 75 % minimum par des personnes
              physiques.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Exemple concret : 80 000 &euro; de benefice
            </h2>
            <p>
              Prenons une SASU eligible au taux reduit avec un benefice fiscal de 80 000 &euro; :
            </p>

            <div
              className="rounded-xl border p-5"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between">
                  <span>Benefice fiscal</span>
                  <span style={{ color: "var(--primary)" }}>80 000,00 &euro;</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>IS taux reduit (15 % x 42 500 &euro;)</span>
                  <span>6 375,00 &euro;</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>IS taux normal (25 % x 37 500 &euro;)</span>
                  <span>9 375,00 &euro;</span>
                </div>
                <div
                  className="flex justify-between border-t pt-2 text-base font-bold"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span>IS total</span>
                  <span style={{ color: "var(--primary)" }}>15 750,00 &euro;</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: "var(--muted)" }}>
                  <span>Taux effectif</span>
                  <span>19,7 %</span>
                </div>
              </div>
            </div>

            <p>
              Le taux effectif d&apos;imposition est donc de 19,7 %, un avantage non negligeable par rapport au
              taux plein de 25 %. Plus votre benefice est proche de 42 500 &euro;, plus le taux effectif se
              rapproche de 15 %.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              IS vs impot sur le revenu : quel regime choisir ?
            </h2>
            <p>
              Le choix entre l&apos;IS et l&apos;IR depend de votre situation personnelle et du montant de vos
              benefices. Quelques reperes :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Benefice &lt; 30 000 &euro;</strong> : l&apos;IR est souvent plus avantageux, surtout si vous avez des parts fiscales (conjoint, enfants)</li>
              <li><strong>Benefice 30 000 - 80 000 &euro;</strong> : l&apos;IS avec taux reduit est generalement plus interessant</li>
              <li><strong>Benefice &gt; 80 000 &euro;</strong> : l&apos;IS est quasi systematiquement preferable (25 % vs 41 % ou 45 % a l&apos;IR)</li>
            </ul>
            <p>
              Si vous hesitez entre le salariat et l&apos;independance, notre{" "}
              <Link href="/outils/freelance-vs-cdi" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>comparateur freelance vs CDI</Link>{" "}
              vous aide a trancher.
            </p>
            <p>
              N&apos;oubliez pas qu&apos;avec l&apos;IS, les benefices reinvestis dans l&apos;entreprise ne sont
              pas soumis a l&apos;IR. Vous ne payez l&apos;IR que sur les dividendes que vous vous versez, apres
              application de la <Link href="/outils/simulateur-flat-tax-crypto" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>flat tax de 30 %</Link> (PFU) ou du bareme progressif si c&apos;est plus avantageux.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les acomptes d&apos;IS : quand payer ?
            </h2>
            <p>
              L&apos;IS se paie en 4 acomptes trimestriels, calcules sur la base du dernier exercice clos :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>15 mars</strong> : 1er acompte (25 % de l&apos;IS estime)</li>
              <li><strong>15 juin</strong> : 2e acompte</li>
              <li><strong>15 septembre</strong> : 3e acompte</li>
              <li><strong>15 decembre</strong> : 4e acompte</li>
            </ul>
            <p>
              Le solde est verse au plus tard le 15 du 4e mois suivant la cloture de l&apos;exercice. Les
              entreprises dont l&apos;IS de l&apos;exercice precedent est inferieur a 3 000 &euro; sont dispensees
              d&apos;acomptes.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Simulez votre IS en quelques secondes
            </h3>
            <p>
              Notre simulateur gratuit calcule instantanement votre IS selon le bareme 2026, avec le detail
              par tranche et le taux effectif. Ideal pour anticiper votre tresorerie et comparer les regimes
              fiscaux.
            </p>
            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Calculez votre impot sur les societes en quelques clics</p>
              <Link
                href="/outils/simulateur-is"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
              >
                Essayer le simulateur IS
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Back link */}
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
