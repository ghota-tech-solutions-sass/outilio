"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleGuideFreelance2026() {
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
            <span style={{ color: "var(--foreground)" }}>Devenir freelance en 2026 : TJM, charges et statut</span>
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
            Devenir freelance en 2026 :{" "}
            <span style={{ color: "var(--primary)" }}>TJM, charges et statut</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>24 mars 2026</span>
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
              Le nombre de travailleurs independants en France a depasse les 4,5 millions en 2026. Que
              vous soyez developpeur, designer, consultant ou redacteur, se lancer en freelance n&apos;a
              jamais ete aussi accessible. Mais entre le choix du statut juridique, le calcul du bon TJM
              et la gestion des charges, les erreurs peuvent couter cher. Voici un guide pratique pour
              demarrer sur de bonnes bases.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Calculer son TJM : la base de tout
            </h2>
            <p>
              Le Taux Journalier Moyen est le prix que vous facturez par jour de travail. C&apos;est la
              variable cle qui determine votre revenu net. Le piege classique du debutant : prendre
              son ancien salaire brut, le diviser par 20 jours, et utiliser ca comme TJM. Resultat :
              un revenu net inferieur de 30 a 40 % a ce que vous gagniez en CDI.
            </p>
            <p>
              Pour calculer un TJM viable, il faut integrer :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Vos charges sociales</strong> : entre 22 % (micro-entreprise) et 45 % (SASU a l&apos;IS) selon le statut</li>
              <li><strong>Les jours non factures</strong> : conges, maladie, prospection, administratif — comptez 15 a 20 jours par an minimum</li>
              <li><strong>Les frais professionnels</strong> : materiel, logiciels, coworking, comptable, assurance RC Pro</li>
              <li><strong>L&apos;impot sur le revenu</strong> : qui viendra en plus des charges sociales</li>
              <li><strong>Votre epargne retraite</strong> : en freelance, c&apos;est a vous de la constituer</li>
            </ul>
            <p>
              Notre{" "}
              <Link href="/outils/calculateur-tjm-freelance" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                calculateur de TJM freelance
              </Link>{" "}
              fait ce calcul pour vous en integrant tous ces parametres. En moyenne, pour un objectif
              de 3 000 euros net mensuel, le TJM necessaire tourne autour de 450 a 550 euros selon
              le statut choisi.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Micro-entreprise vs SASU : quel statut choisir ?
            </h2>
            <p>
              C&apos;est LA question que se pose tout freelance. En 2026, les deux options principales
              restent la micro-entreprise et la SASU. Voici un comparatif objectif :
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              La micro-entreprise
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Charges sociales</strong> : 21,1 % du CA pour les prestations de services (BNC), avec la reforme URSSAF 2026</li>
              <li><strong>Plafond de CA</strong> : 77 700 euros par an (prestations de services)</li>
              <li><strong>Comptabilite</strong> : ultra-simplifiee, pas d&apos;expert-comptable obligatoire</li>
              <li><strong>TVA</strong> : franchise en base jusqu&apos;a 36 800 euros de CA</li>
              <li><strong>Inconvenient majeur</strong> : pas de deduction de charges, pas d&apos;optimisation fiscale possible</li>
            </ul>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              La SASU
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Charges sociales</strong> : environ 45 % sur la remuneration du president, mais 17,2 % de prelevements sociaux sur les dividendes (ou 30 % flat tax)</li>
              <li><strong>Pas de plafond de CA</strong></li>
              <li><strong>Deduction des charges</strong> : materiel, deplacement, repas, formation — tout est deductible</li>
              <li><strong>Inconvenient</strong> : comptabilite obligatoire, cout de gestion plus eleve (expert-comptable, greffe, CFE)</li>
            </ul>
            <p>
              La regle empirique : en dessous de 50 000 euros de CA annuel, la micro-entreprise est
              generalement plus avantageuse. Au-dela, la SASU peut devenir interessante grace a
              l&apos;optimisation remuneration/dividendes. Comparez les deux en detail avec notre outil{" "}
              <Link href="/outils/freelance-vs-cdi" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                freelance vs CDI
              </Link>{" "}
              et simulez vos revenus en micro avec le{" "}
              <Link href="/outils/simulateur-auto-entrepreneur" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                simulateur auto-entrepreneur
              </Link>.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Facturation : les regles a respecter en 2026
            </h2>
            <p>
              Une facture non conforme peut entrainer une amende de 75 000 euros pour une personne
              physique. Les mentions obligatoires incluent :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Numero de facture unique et chronologique</li>
              <li>Date d&apos;emission et date de la prestation</li>
              <li>Identite complete du vendeur et de l&apos;acheteur (SIRET, adresse)</li>
              <li>Description detaillee de la prestation</li>
              <li>Montant HT, taux de TVA, montant TTC (ou mention &quot;TVA non applicable, article 293 B du CGI&quot;)</li>
              <li>Conditions et delai de paiement</li>
              <li>Penalites de retard et indemnite forfaitaire de 40 euros</li>
            </ul>
            <p>
              A partir de 2026, la facturation electronique (e-invoicing) devient progressivement
              obligatoire pour les TPE. Pour generer des factures conformes sans prise de tete, utilisez
              notre{" "}
              <Link href="/outils/generateur-facture" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                generateur de facture
              </Link>{" "}
              gratuit.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les obligations legales souvent oubliees
            </h2>
            <p>
              Au-dela de la facturation, tout freelance avec un site web professionnel doit afficher
              des mentions legales conformes au RGPD et a la LCEN. Les informations requises :
              identite de l&apos;editeur, hebergeur, politique de confidentialite, conditions generales
              de vente le cas echeant.
            </p>
            <p>
              Ne prenez pas de risque : notre{" "}
              <Link href="/outils/generateur-mentions-legales" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                generateur de mentions legales
              </Link>{" "}
              cree un texte conforme en quelques clics a partir de vos informations.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Les 5 erreurs du freelance debutant
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>TJM trop bas</strong> : ne pas integrer les charges, conges et frais dans le calcul</li>
              <li><strong>Pas de tresorerie</strong> : prevoir 3 a 6 mois de charges fixes avant de se lancer</li>
              <li><strong>Oublier la CFE</strong> : la Cotisation Fonciere des Entreprises est due des la 2e annee</li>
              <li><strong>Ne pas provisionner l&apos;URSSAF</strong> : mettre de cote 25 a 30 % de chaque facture encaissee</li>
              <li><strong>Sous-estimer l&apos;administratif</strong> : compta, relances, contrats — ca prend du temps non facture</li>
            </ul>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Calculez votre TJM ideal et comparez les statuts juridiques</p>
              <Link
                href="/outils/calculateur-tjm-freelance"
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
