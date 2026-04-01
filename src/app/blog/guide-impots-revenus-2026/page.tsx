"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleGuideImpotsRevenus2026() {
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
            <span style={{ color: "var(--foreground)" }}>Tout comprendre sur l&apos;impot sur le revenu 2026</span>
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
            Tout comprendre sur l&apos;impot{" "}
            <span style={{ color: "var(--primary)" }}>sur le revenu 2026</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>17 mars 2026</span>
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
              La declaration de revenus 2026 (portant sur les revenus 2025) approche. Que vous soyez
              salarie, freelance ou investisseur, comprendre le mecanisme de l&apos;impot sur le revenu
              est essentiel pour optimiser votre situation fiscale legalement. Voici le guide complet
              du bareme progressif aux cas particuliers.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Le bareme progressif de l&apos;IR 2026
            </h2>
            <p>
              Le bareme de l&apos;impot sur le revenu 2026 (applicable aux revenus 2025) a ete revalorise
              de 2 % pour tenir compte de l&apos;inflation. Les tranches sont les suivantes :
            </p>

            <div
              className="rounded-xl border p-5"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between">
                  <span>Jusqu&apos;a 11 497 &euro;</span>
                  <span style={{ color: "var(--primary)" }}>0 %</span>
                </div>
                <div className="flex justify-between">
                  <span>De 11 497 a 29 315 &euro;</span>
                  <span style={{ color: "var(--primary)" }}>11 %</span>
                </div>
                <div className="flex justify-between">
                  <span>De 29 315 a 83 823 &euro;</span>
                  <span style={{ color: "var(--primary)" }}>30 %</span>
                </div>
                <div className="flex justify-between">
                  <span>De 83 823 a 180 294 &euro;</span>
                  <span style={{ color: "var(--primary)" }}>41 %</span>
                </div>
                <div className="flex justify-between">
                  <span>Au-dela de 180 294 &euro;</span>
                  <span style={{ color: "var(--primary)" }}>45 %</span>
                </div>
              </div>
            </div>

            <p>
              Attention : ces taux s&apos;appliquent par <strong>tranche</strong>, pas sur la totalite du
              revenu. Quelqu&apos;un qui gagne 35 000 euros imposables ne paie pas 30 % sur la totalite :
              il paie 0 % sur les premiers 11 497 euros, 11 % sur la tranche suivante, et 30 %
              uniquement sur la portion depassant 29 315 euros. Simulez votre impot exact avec notre{" "}
              <Link href="/outils/simulateur-impot" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                simulateur d&apos;impot sur le revenu
              </Link>.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Le quotient familial : comment ca marche
            </h2>
            <p>
              Le quotient familial est un mecanisme typiquement francais qui reduit l&apos;impot des
              foyers avec enfants. Le principe : le revenu imposable est divise par le nombre de parts
              fiscales avant d&apos;appliquer le bareme, puis l&apos;impot obtenu est multiplie par ce
              meme nombre de parts.
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Celibataire sans enfant</strong> : 1 part</li>
              <li><strong>Couple marie/pacse sans enfant</strong> : 2 parts</li>
              <li><strong>1er et 2e enfant</strong> : +0,5 part chacun</li>
              <li><strong>3e enfant et suivants</strong> : +1 part chacun</li>
              <li><strong>Parent isole</strong> : +0,5 part supplementaire</li>
            </ul>
            <p>
              L&apos;avantage fiscal lie au quotient familial est plafonne a <strong>1 759 euros par
              demi-part supplementaire</strong> en 2026. Pour un couple avec 2 enfants (3 parts), cela
              signifie un avantage maximum de 3 518 euros par rapport a un couple sans enfant.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Le prelevement a la source en 2026
            </h2>
            <p>
              Depuis 2019, l&apos;impot est preleve directement sur les revenus. En 2026, le systeme
              est rode mais quelques points meritent attention :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Taux personnalise</strong> : calcule sur la base de votre derniere declaration. Il est actualise en septembre chaque annee</li>
              <li><strong>Taux individualise</strong> : pour les couples, chaque conjoint peut avoir son propre taux base sur ses revenus personnels</li>
              <li><strong>Taux neutre</strong> : si vous ne souhaitez pas que votre employeur connaisse votre situation fiscale, vous pouvez opter pour le taux par defaut (souvent plus eleve)</li>
              <li><strong>Modulation</strong> : vous pouvez demander une baisse de taux si vos revenus ont diminue (sur impots.gouv.fr)</li>
            </ul>
            <p>
              Pour connaitre votre salaire net apres impot, utilisez notre{" "}
              <Link href="/outils/calculateur-salaire" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                calculateur de salaire
              </Link>{" "}
              qui integre le prelevement a la source selon votre situation.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              La flat tax sur les revenus du capital
            </h2>
            <p>
              Les revenus du capital (dividendes, interets, plus-values mobilieres, gains crypto) sont
              soumis par defaut au Prelevement Forfaitaire Unique (PFU) de <strong>30 %</strong>, aussi
              appele flat tax. Ce taux se decompose en :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>12,8 %</strong> d&apos;impot sur le revenu</li>
              <li><strong>17,2 %</strong> de prelevements sociaux (CSG + CRDS)</li>
            </ul>
            <p>
              Cependant, vous avez toujours la possibilite d&apos;opter pour l&apos;imposition au bareme
              progressif si c&apos;est plus avantageux. C&apos;est generalement le cas si votre tranche
              marginale d&apos;imposition (TMI) est de 0 % ou 11 %. Attention : l&apos;option est globale,
              elle s&apos;applique a tous vos revenus du capital. Simulez les deux options avec notre{" "}
              <Link href="/outils/simulateur-flat-tax-crypto" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                simulateur flat tax
              </Link>.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              La prime d&apos;activite : un complement souvent oublie
            </h2>
            <p>
              La prime d&apos;activite est un complement de revenu verse par la CAF aux travailleurs aux
              revenus modestes. En 2026, elle concerne les salaries, independants et fonctionnaires
              dont les revenus nets mensuels sont inferieurs a environ <strong>1 900 euros</strong> pour
              une personne seule sans enfant (le plafond varie selon la composition du foyer).
            </p>
            <p>
              Quelques chiffres cles :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Montant forfaitaire de base : environ <strong>622 euros</strong> pour une personne seule</li>
              <li>Bonification individuelle maximale : environ <strong>173 euros</strong> (pour les revenus superieurs a 0,5 SMIC)</li>
              <li>Versement mensuel, recalcule tous les 3 mois</li>
              <li>Declaration trimestrielle de revenus obligatoire sur caf.fr</li>
            </ul>
            <p>
              Beaucoup de beneficiaires potentiels ne font pas la demande par meconnaissance. Verifiez
              votre eligibilite avec notre{" "}
              <Link href="/outils/simulateur-prime-activite" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                simulateur de prime d&apos;activite
              </Link>.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              5 astuces legales pour reduire son impot
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Maximiser le PER</strong> : les versements sont deductibles du revenu imposable (dans la limite du plafond)</li>
              <li><strong>Dons aux associations</strong> : reduction d&apos;impot de 66 % (75 % pour les organismes d&apos;aide aux personnes en difficulte, plafonne a 1 000 euros)</li>
              <li><strong>Emploi a domicile</strong> : credit d&apos;impot de 50 % des depenses (menage, garde d&apos;enfants, soutien scolaire)</li>
              <li><strong>Frais reels</strong> : si vos frais professionnels depassent l&apos;abattement forfaitaire de 10 %, optez pour la deduction des frais reels</li>
              <li><strong>Investissement PME</strong> : reduction d&apos;impot de 25 % du montant investi (plafond de 50 000 euros pour un celibataire)</li>
            </ul>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Estimez votre impot sur le revenu 2026 en quelques clics</p>
              <Link
                href="/outils/simulateur-impot"
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
