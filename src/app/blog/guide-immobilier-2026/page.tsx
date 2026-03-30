"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleGuideImmobilier2026() {
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
            <span style={{ color: "var(--foreground)" }}>Guide complet achat immobilier 2026</span>
          </nav>

          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Immobilier
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Guide complet de l&apos;achat{" "}
            <span style={{ color: "var(--primary)" }}>immobilier en 2026</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>30 mars 2026</span>
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
              Acheter un bien immobilier en 2026, c&apos;est naviguer dans un contexte de taux d&apos;interet
              qui se sont stabilises apres la hausse brutale de 2023-2024, un marche ou les prix ont
              corrige dans certaines villes, et des dispositifs d&apos;aide qui ont ete remanies. Que vous
              soyez primo-accedant ou investisseur, ce guide fait le point sur tout ce que vous devez
              savoir avant de signer.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les taux d&apos;interet immobiliers en 2026
            </h2>
            <p>
              Apres avoir frole les 4,5 % fin 2023, les taux moyens sur 20 ans se situent debut 2026
              autour de <strong>3,1 % a 3,4 %</strong> selon les profils. La BCE a amorce un cycle de
              baisse prudente, ce qui a permis aux banques de proposer des conditions plus favorables
              qu&apos;en 2024, sans pour autant retrouver les niveaux historiquement bas de 2021.
            </p>
            <p>
              Pour un emprunt de 250 000 euros sur 20 ans a 3,2 %, la mensualite s&apos;etablit a environ
              1 420 euros, contre 1 530 euros au pic de fin 2023. Cela represente un gain de pouvoir
              d&apos;achat d&apos;environ 8 %. Utilisez notre{" "}
              <Link href="/outils/calculateur-pret-immobilier" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                calculateur de pret immobilier
              </Link>{" "}
              pour simuler votre propre scenario avec les taux actuels.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les frais de notaire : ce qu&apos;il faut budgeter
            </h2>
            <p>
              Les frais de notaire restent un poste souvent sous-estime par les acheteurs. En 2026, ils
              representent toujours environ <strong>7 a 8 % du prix d&apos;achat dans l&apos;ancien</strong> et{" "}
              <strong>2 a 3 % dans le neuf</strong>. Ces frais comprennent les droits de mutation
              (taxe departementale + taxe communale), les emoluments du notaire, et les frais
              administratifs divers.
            </p>
            <p>
              Pour un appartement ancien a 300 000 euros, comptez entre 21 000 et 24 000 euros de frais.
              C&apos;est une somme qui doit imperativement etre integree a votre plan de financement. Notre{" "}
              <Link href="/outils/calculateur-frais-notaire" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                calculateur de frais de notaire
              </Link>{" "}
              vous donne une estimation precise en fonction du departement et du type de bien.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Le PTZ 2026 : des conditions elargies
            </h2>
            <p>
              Le Pret a Taux Zero a ete substantiellement reforme pour 2026. Les principaux changements :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Extension aux maisons individuelles neuves</strong> en zone tendue (A, A bis, B1), alors que le PTZ avait ete restreint aux appartements neufs en 2024</li>
              <li><strong>Relevement des plafonds de revenus</strong> : le revenu fiscal de reference maximal a ete augmente de 10 % en moyenne, ouvrant le dispositif a davantage de menages</li>
              <li><strong>Quotite financable jusqu&apos;a 50 %</strong> du cout de l&apos;operation pour les tranches de revenus les plus basses (contre 40 % auparavant)</li>
              <li><strong>Duree de remboursement</strong> pouvant aller jusqu&apos;a 25 ans avec un differe de 15 ans pour les profils les plus modestes</li>
            </ul>
            <p>
              Le PTZ reste reserve aux primo-accedants (pas de propriete de la residence principale dans
              les 2 dernieres annees). Pour verifier votre eligibilite et estimer le montant auquel vous
              avez droit, utilisez notre{" "}
              <Link href="/outils/simulateur-ptz-2026" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                simulateur PTZ 2026
              </Link>.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Investissement locatif : calculer la rentabilite
            </h2>
            <p>
              Si vous achetez pour louer, la rentabilite est le nerf de la guerre. En 2026, les rendements
              locatifs bruts moyens varient enormement selon les villes :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Paris</strong> : 3 a 4 % brut (prix eleves, loyers plafonnes)</li>
              <li><strong>Lyon, Bordeaux, Nantes</strong> : 4 a 5,5 % brut</li>
              <li><strong>Villes moyennes (Saint-Etienne, Limoges, Mulhouse)</strong> : 7 a 10 % brut, mais avec un risque de vacance plus eleve</li>
            </ul>
            <p>
              Attention : la rentabilite brute ne suffit pas. Il faut integrer les charges de copropriete,
              la taxe fonciere, l&apos;assurance PNO, les eventuels travaux, et la fiscalite (micro-foncier
              ou reel). Notre{" "}
              <Link href="/outils/calculateur-rentabilite-locative" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                calculateur de rentabilite locative
              </Link>{" "}
              integre tous ces parametres pour vous donner la rentabilite nette reelle.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Le DPE : un critere desormais incontournable
            </h2>
            <p>
              Depuis janvier 2025, les logements classes G sont interdits a la location. En 2028, ce
              sera le tour des logements classes F. Cette reglementation a un impact direct sur le
              marche : les passoires thermiques se vendent avec une decote pouvant atteindre 15 a 20 %
              par rapport a un bien equivalent bien classe.
            </p>
            <p>
              Pour un acheteur, cela represente a la fois un risque (cout des travaux de renovation
              energetique) et une opportunite (acheter moins cher, renover, et beneficier de MaPrimeRenov&apos;).
              Avant de vous engager, estimez la performance energetique du bien avec notre{" "}
              <Link href="/outils/calculateur-dpe" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                calculateur DPE
              </Link>{" "}
              pour anticiper les eventuels travaux necessaires.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              La plus-value immobiliere : anticiper la fiscalite a la revente
            </h2>
            <p>
              Si vous revendez un bien qui n&apos;est pas votre residence principale, la plus-value est
              imposee a <strong>19 % d&apos;impot + 17,2 % de prelevements sociaux</strong>, soit 36,2 % au
              total. Des abattements pour duree de detention s&apos;appliquent :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Exoneration totale d&apos;impot apres <strong>22 ans</strong> de detention</li>
              <li>Exoneration totale de prelevements sociaux apres <strong>30 ans</strong></li>
              <li>Abattement de 6 % par an entre la 6e et la 21e annee pour l&apos;impot</li>
            </ul>
            <p>
              Avant d&apos;acheter un bien en vue de le revendre, simulez la fiscalite avec notre{" "}
              <Link href="/outils/simulateur-plus-value-immobiliere" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                simulateur de plus-value immobiliere
              </Link>{" "}
              pour eviter les mauvaises surprises.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Checklist avant d&apos;acheter en 2026
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Verifier votre capacite d&apos;emprunt (taux d&apos;endettement max 35 % assurance incluse)</li>
              <li>Budgeter les frais de notaire en plus du prix d&apos;achat</li>
              <li>Tester votre eligibilite au PTZ 2026</li>
              <li>Examiner le DPE et estimer le cout des travaux eventuels</li>
              <li>Comparer au moins 3 offres de pret (courtier recommande)</li>
              <li>Prevoir une epargne de precaution de 3 a 6 mois de mensualites</li>
            </ul>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Simulez votre pret immobilier, frais de notaire et PTZ en quelques clics</p>
              <Link
                href="/outils/calculateur-pret-immobilier"
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
