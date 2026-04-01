"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleSalaireNet2026() {
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
            <span style={{ color: "var(--foreground)" }}>Comment calculer son salaire net en 2026</span>
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
            Comment calculer son salaire{" "}
            <span style={{ color: "var(--primary)" }}>net en 2026</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>10 fevrier 2026</span>
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--border)" }} />
            <span>4 min de lecture</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12">
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="prose-outilis space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            <p>
              Que vous negociiez un nouveau contrat ou que vous souhaitiez simplement comprendre votre fiche
              de paie, connaitre la difference entre salaire brut et salaire net est essentiel. En 2026, les
              taux de cotisations salariales ont ete legerement ajustes par la loi de finances : voici tout
              ce qu&apos;il faut savoir pour faire le calcul vous-meme.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Le bareme des cotisations salariales en 2026
            </h2>
            <p>
              Le salaire brut correspond a la remuneration totale avant prelevement des charges. Pour obtenir
              le salaire net, on retire les cotisations salariales obligatoires. En 2026, les taux moyens
              sont les suivants :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Salarie non-cadre (prive)</strong> : environ 22 % de charges salariales</li>
              <li><strong>Salarie cadre (prive)</strong> : environ 25 %, en raison de cotisations supplementaires (AGIRC-ARRCO tranche 2, APEC)</li>
              <li><strong>Fonction publique</strong> : environ 17 % (pas de cotisation chomage)</li>
            </ul>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              CSG et CRDS : des prelevements a ne pas oublier
            </h2>
            <p>
              En plus des cotisations sociales classiques (retraite, chomage, maladie), le salarie verse
              la <strong>CSG (Contribution sociale generalisee)</strong> au taux de 9,2 % et la{" "}
              <strong>CRDS (Contribution au remboursement de la dette sociale)</strong> au taux de 0,5 %.
              Ces prelevements s&apos;appliquent sur 98,25 % du salaire brut (apres abattement de 1,75 % pour
              frais professionnels). La CSG se decompose en une part deductible (6,8 %) et une part non
              deductible (2,4 %). Ces contributions sont deja incluses dans les taux globaux mentionnes
              ci-dessus.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Exemple concret : 3 000 euros brut
            </h2>
            <p>
              Prenons un salarie non-cadre du secteur prive avec un salaire mensuel brut de 3 000 euros.
              Le taux global de charges salariales est d&apos;environ 22 % :
            </p>

            <div
              className="rounded-xl border p-5"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between">
                  <span>Salaire brut mensuel</span>
                  <span style={{ color: "var(--primary)" }}>3 000,00 &euro;</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>Cotisations salariales (~22 %)</span>
                  <span>- 660,00 &euro;</span>
                </div>
                <div
                  className="flex justify-between border-t pt-2 text-base font-bold"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span>Salaire net avant impot</span>
                  <span style={{ color: "var(--primary)" }}>2 340,00 &euro;</span>
                </div>
              </div>
            </div>

            <p>
              Apres prelevement a la source de l&apos;impot sur le revenu (dont le taux depend de votre
              situation personnelle et du <Link href="/outils/simulateur-impot" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>bareme IR 2026</Link>), le salaire net effectivement verse sur votre
              compte bancaire est encore inferieur. Pour un celibataire sans enfant, comptez environ
              130 euros d&apos;impot mensuel, soit un net apres impot d&apos;environ <strong>2 210 euros</strong>.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Calculez votre salaire net instantanement
            </h3>
            <p>
              Plutot que de sortir la calculatrice, utilisez notre outil gratuit pour obtenir une estimation
              precise en quelques secondes, avec prise en compte du bareme IR 2026 et du nombre de parts
              fiscales.
            </p>
            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Calculez votre salaire net en quelques secondes</p>
              <Link
                href="/outils/calculateur-salaire"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
              >
                Essayer l&apos;outil
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
