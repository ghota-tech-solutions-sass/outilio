"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleAutoEntrepreneur2026() {
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
            <span style={{ color: "var(--foreground)" }}>Auto-entrepreneur 2026 : charges, plafonds et revenu net</span>
          </nav>

          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Business
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Auto-entrepreneur 2026 :{" "}
            <span style={{ color: "var(--primary)" }}>charges, plafonds et revenu net</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>20 mars 2026</span>
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
              Le statut de micro-entrepreneur (auto-entrepreneur) reste le plus populaire pour lancer une
              activite en France. Simple, rapide et avec des charges proportionnelles au chiffre d&apos;affaires,
              il permet de tester une idee sans risque. Voici tout ce qu&apos;il faut savoir en 2026 pour
              calculer votre revenu net reel.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les plafonds de chiffre d&apos;affaires 2026
            </h2>
            <p>
              Les seuils de CA pour rester en micro-entreprise sont inchanges en 2026 :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>188 700 &euro;</strong> pour les activites de vente de marchandises, restauration et hebergement</li>
              <li><strong>77 700 &euro;</strong> pour les prestations de services (BIC et BNC) et les professions liberales</li>
            </ul>
            <p>
              Au-dela de ces seuils pendant deux annees consecutives, vous basculez automatiquement vers le
              regime reel d&apos;imposition.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les taux de cotisations sociales 2026
            </h2>
            <p>
              Les cotisations se calculent en pourcentage du CA encaisse. Les taux 2026 sont les suivants :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Vente de marchandises</strong> : 12,3 %</li>
              <li><strong>Prestations de services (BIC)</strong> : 21,2 %</li>
              <li><strong>Professions liberales (BNC)</strong> : 21,1 % (CIPAV) ou 23,2 % (SSI)</li>
              <li><strong>Activites liberales reglementees</strong> : 23,2 %</li>
            </ul>
            <p>
              A ces cotisations s&apos;ajoute la <strong>CFP (Contribution a la Formation Professionnelle)</strong> :
              0,1 % pour le commerce, 0,2 % pour les services et professions liberales, et 0,3 % pour
              l&apos;artisanat.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Exemple concret : prestataire de services a 4 000 &euro;/mois
            </h2>
            <p>
              Prenons un developpeur freelance en prestations de services BNC, avec un CA mensuel de 4 000 &euro; :
            </p>

            <div
              className="rounded-xl border p-5"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between">
                  <span>Chiffre d&apos;affaires mensuel</span>
                  <span style={{ color: "var(--primary)" }}>4 000,00 &euro;</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>Cotisations sociales (21,1 %)</span>
                  <span>- 844,00 &euro;</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>CFP (0,2 %)</span>
                  <span>- 8,00 &euro;</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>Impot (versement liberatoire 2,2 %)</span>
                  <span>- 88,00 &euro;</span>
                </div>
                <div
                  className="flex justify-between border-t pt-2 text-base font-bold"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span>Revenu net</span>
                  <span style={{ color: "var(--primary)" }}>3 060,00 &euro;</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: "var(--muted)" }}>
                  <span>Taux de charges effectif</span>
                  <span>23,5 %</span>
                </div>
              </div>
            </div>

            <p>
              Avec le versement liberatoire de l&apos;impot sur le revenu (2,2 % pour les BNC), le taux de
              charges total est d&apos;environ 23,5 %. Sur 48 000 &euro; annuels de CA, le revenu net est
              d&apos;environ <strong>36 720 &euro;</strong>, soit 3 060 &euro; par mois.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Le versement liberatoire : pour qui ?
            </h2>
            <p>
              Le versement liberatoire de l&apos;impot sur le revenu permet de payer un pourcentage fixe du CA
              plutot que d&apos;etre soumis au bareme progressif de l&apos;IR. Les taux sont :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>1 %</strong> pour la vente de marchandises</li>
              <li><strong>1,7 %</strong> pour les prestations de services BIC</li>
              <li><strong>2,2 %</strong> pour les professions liberales BNC</li>
            </ul>
            <p>
              Pour en beneficier, votre revenu fiscal de reference de l&apos;annee N-2 ne doit pas depasser
              27 478 &euro; par part de quotient familial. C&apos;est generalement avantageux si vous avez
              d&apos;autres revenus (conjoint salarie, revenus fonciers).
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              ACRE : 50 % de reduction la premiere annee
            </h2>
            <p>
              L&apos;ACRE (Aide aux Createurs et Repreneurs d&apos;Entreprise) offre une exoneration de 50 %
              des cotisations sociales pendant la premiere annee d&apos;activite. Pour un prestataire de services,
              les cotisations passent de 21,1 % a environ 10,6 %, ce qui augmente significativement le revenu
              net la premiere annee. L&apos;ACRE est accordee automatiquement a la creation de la
              micro-entreprise.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Simulez vos revenus en auto-entrepreneur
            </h3>
            <p>
              Notre simulateur gratuit calcule instantanement vos cotisations, votre impot et votre revenu
              net selon votre activite, votre CA et votre situation fiscale. Avec ou sans ACRE, avec ou sans
              versement liberatoire.
            </p>
            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Calculez vos revenus d&apos;auto-entrepreneur en quelques clics</p>
              <Link
                href="/outils/simulateur-auto-entrepreneur"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
              >
                Essayer le simulateur
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
