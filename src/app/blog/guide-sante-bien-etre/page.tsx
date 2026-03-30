"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleSanteBienEtre() {
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
            <span style={{ color: "var(--foreground)" }}>Sante et bien-etre : calculateurs pour suivre vos objectifs</span>
          </nav>

          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Sante
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Sante et bien-etre : calculateurs pour{" "}
            <span style={{ color: "var(--primary)" }}>suivre vos objectifs</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>30 mars 2026</span>
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
              Suivre sa sante au quotidien ne necessite pas forcement un rendez-vous medical. De nombreux
              indicateurs &mdash; poids, apport calorique, metabolisme &mdash; peuvent etre evalues soi-meme
              a l&apos;aide de formules reconnues par l&apos;Organisation mondiale de la sante (OMS) et les
              autorites sanitaires francaises. Ce guide passe en revue les principaux calculateurs de sante
              disponibles gratuitement sur Outilis.fr et explique comment les utiliser intelligemment.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              L&apos;IMC : un premier repere, pas un verdict
            </h2>
            <p>
              L&apos;Indice de Masse Corporelle (IMC) est le rapport entre votre poids en kilogrammes et le
              carre de votre taille en metres. Il reste l&apos;indicateur le plus utilise au monde pour
              evaluer la corpulence d&apos;un adulte. L&apos;OMS definit les seuils suivants :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Moins de 18,5</strong> : insuffisance ponderale</li>
              <li><strong>18,5 a 24,9</strong> : corpulence normale</li>
              <li><strong>25 a 29,9</strong> : surpoids</li>
              <li><strong>30 et plus</strong> : obesite (trois degres selon la gravite)</li>
            </ul>
            <p>
              Attention cependant : l&apos;IMC ne distingue pas la masse musculaire de la masse grasse. Un
              sportif peut afficher un IMC eleve tout en etant en excellente sante. Utilisez notre{" "}
              <Link href="/outils/calculateur-imc" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur d&apos;IMC
              </Link>{" "}
              comme point de depart, puis croisez le resultat avec votre tour de taille et votre ressenti
              general.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Calories et activite physique : trouver l&apos;equilibre
            </h2>
            <p>
              Que vous cherchiez a perdre du poids, a en prendre ou simplement a maintenir votre forme,
              le bilan calorique est la cle. Le principe est simple : si vous consommez plus de calories
              que vous n&apos;en depensez, vous prenez du poids, et inversement.
            </p>
            <p>
              Notre{" "}
              <Link href="/outils/calculateur-calories" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de calories
              </Link>{" "}
              estime vos besoins quotidiens en fonction de votre age, sexe, poids, taille et niveau
              d&apos;activite physique. Il s&apos;appuie sur l&apos;equation de Mifflin-St Jeor, consideree
              comme la plus fiable par les nutritionnistes. Le resultat vous donne une base pour ajuster
              vos repas sans tomber dans un regime draconien.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Quelques reperes caloriques utiles
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Femme sedentaire</strong> : environ 1 800 kcal/jour</li>
              <li><strong>Homme sedentaire</strong> : environ 2 200 kcal/jour</li>
              <li><strong>Personne tres active</strong> : jusqu&apos;a 3 000 kcal/jour ou plus</li>
            </ul>
            <p>
              Un deficit de 500 kcal par jour permet generalement de perdre environ 0,5 kg par semaine,
              un rythme considere comme sain et durable par la Haute Autorite de Sante (HAS).
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              TDEE et metabolisme de base : comprendre sa depense energetique
            </h2>
            <p>
              Le TDEE (Total Daily Energy Expenditure) represente la totalite des calories que votre corps
              brule en une journee. Il se decompose en trois composantes :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Le metabolisme de base (BMR)</strong> : les calories brulees au repos pour maintenir les fonctions vitales (respiration, circulation, temperature corporelle). Cela represente 60 a 70 % de la depense totale.</li>
              <li><strong>L&apos;effet thermique des aliments</strong> : l&apos;energie utilisee pour digerer, absorber et metaboliser la nourriture, soit environ 10 % du total.</li>
              <li><strong>L&apos;activite physique</strong> : tout mouvement volontaire, du sport a la marche quotidienne.</li>
            </ul>
            <p>
              Notre{" "}
              <Link href="/outils/calculateur-tdee-calories" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur TDEE
              </Link>{" "}
              combine votre metabolisme de base avec un coefficient d&apos;activite pour estimer votre
              depense reelle. C&apos;est l&apos;outil ideal pour calibrer un programme alimentaire adapte
              a vos objectifs, que ce soit la prise de masse, la seche ou le maintien.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Suivi de grossesse : les grandes etapes
            </h2>
            <p>
              Une grossesse dure en moyenne 41 semaines d&apos;amenorrhee (SA), soit environ 39 semaines
              apres la conception. Le{" "}
              <Link href="/outils/calculateur-grossesse" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de grossesse
              </Link>{" "}
              vous permet d&apos;estimer votre date de terme, de savoir a combien de semaines vous en etes
              et de suivre les grandes etapes trimestre par trimestre.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Les 3 trimestres en bref
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>1er trimestre (SA 1-14)</strong> : formation des organes, premieres echographies, declaration a la CPAM avant la fin de la 14e semaine.</li>
              <li><strong>2e trimestre (SA 15-28)</strong> : les mouvements du bebe se font sentir, echographie morphologique vers 22 SA, preparation a la naissance.</li>
              <li><strong>3e trimestre (SA 29-41)</strong> : prise de poids du bebe, consultations plus frequentes, conge maternite (generalement 6 semaines avant le terme).</li>
            </ul>
            <p>
              En France, le suivi de grossesse est rembourse a 100 % par l&apos;Assurance Maladie a partir
              du 6e mois. Les sept consultations obligatoires et les trois echographies de depistage sont
              integralement prises en charge.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Alcoolemie et securite routiere
            </h2>
            <p>
              En France, le taux legal d&apos;alcoolemie au volant est de 0,5 g/l de sang (soit 0,25 mg/l
              d&apos;air expire) pour les conducteurs experimentes, et de 0,2 g/l pour les jeunes conducteurs
              en permis probatoire. Depasser ces seuils expose a des sanctions allant de l&apos;amende
              forfaitaire (135 euros) au retrait de permis.
            </p>
            <p>
              Notre{" "}
              <Link href="/outils/calculateur-alcoolemie" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur d&apos;alcoolemie
              </Link>{" "}
              estime votre taux en fonction du nombre de verres consommes, de votre poids, de votre sexe
              et du temps ecoule depuis la derniere consommation. Il utilise la formule de Widmark, la
              reference en medecine legale.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Quelques regles a retenir
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Un verre standard (10 g d&apos;alcool pur) eleve le taux d&apos;environ 0,20 a 0,25 g/l chez un homme de 70 kg.</li>
              <li>Le corps elimine l&apos;alcool a raison de 0,10 a 0,15 g/l par heure. Il n&apos;existe aucun moyen d&apos;accelerer ce processus.</li>
              <li>Le pic d&apos;alcoolemie est atteint environ 30 minutes apres consommation a jeun, et 1 heure au cours d&apos;un repas.</li>
              <li>En cas de doute, ne prenez pas le volant. Designez un conducteur sobre ou utilisez un VTC.</li>
            </ul>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              En resume
            </h2>
            <p>
              Les calculateurs de sante ne remplacent jamais un avis medical, mais ils offrent des reperes
              precieux pour piloter son bien-etre au quotidien. Que vous surveilliez votre poids, planifiiez
              une grossesse ou prepariez une soiree en toute securite, les outils gratuits d&apos;Outilis.fr
              vous donnent les chiffres dont vous avez besoin en quelques secondes.
            </p>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                Evaluez votre indice de masse corporelle en quelques clics
              </p>
              <Link
                href="/outils/calculateur-imc"
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
