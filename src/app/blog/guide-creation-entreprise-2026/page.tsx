"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleCreationEntreprise2026() {
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
            <span style={{ color: "var(--foreground)" }}>Creer son entreprise en 2026 : micro, EURL, SASU</span>
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
            Creer son entreprise en 2026 :{" "}
            <span style={{ color: "var(--primary)" }}>micro, EURL, SASU</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>20 mars 2026</span>
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--border)" }} />
            <span>7 min de lecture</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12">
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="prose-outilis space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            <p>
              Lancer son activite en France n&apos;a jamais ete aussi accessible. En 2026, les demarches
              sont largement dematerialisees via le guichet unique de l&apos;INPI, et le choix du statut
              juridique reste la decision la plus structurante pour votre portefeuille. Ce guide compare
              les trois formes les plus populaires &mdash; micro-entreprise, EURL et SASU &mdash; et vous
              oriente vers les outils gratuits pour simuler vos revenus nets reels.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Micro-entreprise : la simplicite avant tout
            </h2>
            <p>
              Le regime de la micro-entreprise (ex auto-entreprise) est le point d&apos;entree ideal pour
              tester une activite. Les charges sociales sont calculees en pourcentage du chiffre d&apos;affaires
              encaisse, sans surprise :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Prestations de services (BNC)</strong> : 21,1 % de cotisations sociales en 2026</li>
              <li><strong>Vente de marchandises (BIC)</strong> : 12,3 % de cotisations sociales</li>
              <li><strong>Activites liberales reglementees (CIPAV)</strong> : 21,2 %</li>
            </ul>
            <p>
              Les plafonds de CA restent a 188 700 euros pour la vente et 77 700 euros pour les services.
              Au-dela, vous basculez automatiquement vers un regime reel. Notre{" "}
              <Link href="/outils/simulateur-auto-entrepreneur" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                simulateur auto-entrepreneur
              </Link>{" "}
              calcule vos cotisations, votre impot (avec ou sans versement liberatoire) et votre revenu net
              en quelques secondes.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Avantages et limites de la micro
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Comptabilite ultra-simplifiee : un simple livre de recettes suffit.</li>
              <li>Pas de TVA sous le seuil de franchise (36 800 euros en services, 91 900 euros en vente).</li>
              <li>Impossible de deduire ses charges reelles (loyer, materiel, sous-traitance).</li>
              <li>Protection sociale limitee : pas d&apos;assurance chomage, indemnites journalieres faibles.</li>
            </ul>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              EURL : l&apos;entreprise individuelle structuree
            </h2>
            <p>
              L&apos;EURL (Entreprise Unipersonnelle a Responsabilite Limitee) est une SARL a associe unique.
              Le gerant associe unique releve du regime des travailleurs non-salaries (TNS). Les charges
              sociales representent environ 45 % de la remuneration nette, mais l&apos;avantage majeur est
              la possibilite de deduire toutes les charges professionnelles du benefice imposable.
            </p>
            <p>
              En EURL, vous pouvez opter pour l&apos;impot sur le revenu (IR) ou l&apos;impot sur les
              societes (IS). A l&apos;IS, le taux est de 15 % jusqu&apos;a 42 500 euros de benefice, puis
              25 % au-dela. Cette option permet d&apos;optimiser votre remuneration en arbitrant entre
              salaire et dividendes.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              SASU : la flexibilite du president assimile salarie
            </h2>
            <p>
              La SASU (Societe par Actions Simplifiee Unipersonnelle) est le statut prefere des freelances
              qui veulent une couverture sociale equivalente a celle d&apos;un salarie. Le president de SASU
              est assimile salarie : il cotise au regime general de la Securite sociale.
            </p>
            <p>
              Contrepartie : les charges patronales et salariales cumulees representent environ 75 a 80 %
              de la remuneration nette. Pour 1 000 euros nets verses, l&apos;entreprise debourse environ
              1 750 a 1 800 euros au total. En revanche, les dividendes ne sont pas soumis aux cotisations
              sociales (seulement la flat tax a 30 %).
            </p>
            <p>
              Comparez votre revenu net reel entre freelance et CDI avec notre outil{" "}
              <Link href="/outils/freelance-vs-cdi" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                Freelance vs CDI
              </Link>{" "}
              et determinez votre tarif journalier optimal grace au{" "}
              <Link href="/outils/calculateur-tjm-freelance" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de TJM
              </Link>.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les obligations legales incontournables
            </h2>
            <p>
              Quel que soit votre statut, certaines obligations s&apos;imposent des la creation :
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Mentions legales et CGV
            </h3>
            <p>
              Tout site web professionnel doit afficher des mentions legales conformes a la loi pour la
              confiance dans l&apos;economie numerique (LCEN). Si vous vendez en ligne, des Conditions
              Generales de Vente (CGV) sont obligatoires. Generez les votres en quelques clics avec notre{" "}
              <Link href="/outils/generateur-mentions-legales" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                generateur de mentions legales
              </Link>.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              RGPD et politique de confidentialite
            </h3>
            <p>
              Depuis 2018, le Reglement General sur la Protection des Donnees (RGPD) s&apos;applique a toute
              entreprise traitant des donnees personnelles. En pratique, cela signifie : un registre de
              traitement, un consentement explicite pour les cookies, et une politique de confidentialite
              claire. Notre{" "}
              <Link href="/outils/generateur-politique-confidentialite" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                generateur de politique de confidentialite
              </Link>{" "}
              vous produit un document conforme en quelques minutes.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Facturation et calcul de marge
            </h2>
            <p>
              Toute prestation ou vente doit donner lieu a une facture conforme. Depuis 2024, la facturation
              electronique est progressivement obligatoire pour les echanges entre entreprises (B2B). Meme
              si vous etes en micro-entreprise, une facture doit comporter : vos coordonnees, le numero
              SIRET, le detail de la prestation, le montant HT et TTC, et les conditions de paiement.
            </p>
            <p>
              Notre{" "}
              <Link href="/outils/generateur-facture" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                generateur de factures
              </Link>{" "}
              produit des factures PDF conformes, gratuitement et sans inscription. Pour verifier la
              rentabilite de vos prestations, utilisez le{" "}
              <Link href="/outils/calculateur-marge" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de marge
              </Link>{" "}
              qui vous donne instantanement le taux de marge, le coefficient multiplicateur et le prix
              de vente conseille.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Comment choisir le bon statut ?
            </h2>
            <p>
              Il n&apos;existe pas de reponse universelle. Le choix depend de votre situation personnelle,
              de vos charges previsionnelles et de vos objectifs de remuneration. Voici un arbre de decision
              simplifie :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>CA previsionnel inferieur a 77 700 euros et peu de charges</strong> : la micro-entreprise est probablement le meilleur choix.</li>
              <li><strong>Charges elevees (local, materiel, sous-traitance)</strong> : passez en EURL pour pouvoir les deduire.</li>
              <li><strong>Besoin d&apos;une couverture sociale complete</strong> : la SASU offre le regime general, mais coute plus cher en charges.</li>
              <li><strong>Optimisation fiscale avancee</strong> : l&apos;EURL ou la SASU a l&apos;IS permettent d&apos;arbitrer entre salaire et dividendes.</li>
            </ul>
            <p>
              Dans tous les cas, simulez vos revenus nets avec nos outils avant de prendre votre decision.
              Un comptable reste recommande pour les cas complexes, mais un premier chiffrage vous permet
              d&apos;arriver au rendez-vous avec les bonnes questions.
            </p>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                Simulez vos revenus en micro-entreprise en quelques clics
              </p>
              <Link
                href="/outils/simulateur-auto-entrepreneur"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
              >
                Essayer l&apos;outil
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            <div className="mt-10 border-t pt-6" style={{ borderColor: "var(--border)" }}>
              <Link href="/blog" className="text-sm font-medium transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4" style={{ color: "var(--muted)" }}>
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
