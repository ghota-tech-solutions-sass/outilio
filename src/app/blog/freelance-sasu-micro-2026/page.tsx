"use client";

import Link from "next/link";

export default function ArticleSasuMicro2026() {
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
            <span style={{ color: "var(--foreground)" }}>SASU vs Micro-entreprise en 2026</span>
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
            SASU vs Micro-entreprise en 2026 :{" "}
            <span style={{ color: "var(--primary)" }}>quel statut choisir ?</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>18 mars 2026</span>
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--border)" }} />
            <span>5 min de lecture</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12">
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="prose-outilis mx-auto max-w-3xl space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            <p>
              Choisir entre la SASU et la micro-entreprise est l&apos;une des premieres decisions que doit prendre
              un freelance. Chaque statut presente des avantages et des limites. Avec les evolutions
              fiscales de 2026, il est d&apos;autant plus important de comparer serieusement avant de se lancer.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Cotisations sociales : un ecart significatif
            </h2>
            <p>
              En <strong>micro-entreprise</strong>, les cotisations sociales sont proportionnelles au chiffre
              d&apos;affaires. Pour les prestations de services (BNC), le taux est de <strong>21,1 %</strong> en
              2026 (URSSAF). Ce systeme est simple et previsible : pas de CA, pas de cotisations.
            </p>
            <p>
              En <strong>SASU</strong>, le president se verse un salaire soumis a des cotisations d&apos;environ{" "}
              <strong>75 a 80 %</strong> du net (charges patronales et salariales cumulees). En contrepartie,
              il beneficie d&apos;une couverture sociale equivalente a celle d&apos;un salarie (regime general,
              retraite complementaire, prevoyance).
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Dividendes et flat tax
            </h2>
            <p>
              L&apos;un des grands atouts de la SASU est la possibilite de se remunerer en dividendes. Depuis
              2018, les dividendes sont soumis au <strong>prelevement forfaitaire unique (PFU)</strong>, aussi
              appele flat tax, au taux global de <strong>30 %</strong> (12,8 % d&apos;impot sur le revenu + 17,2 %
              de prelevements sociaux). Ce taux reste inchange en 2026.
            </p>
            <p>
              La strategie classique consiste a se verser un salaire minimum pour valider quatre trimestres
              de retraite (environ 7 200 euros brut annuels en 2026) et a distribuer le reste en dividendes.
              Cela permet de reduire considerablement le poids des cotisations sociales.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Attention a la taxe PUMa
            </h2>
            <p>
              Les presidents de SASU qui se versent peu ou pas de salaire doivent surveiller la{" "}
              <strong>contribution subsidiaire maladie</strong>, communement appelee <strong>taxe PUMa</strong>.
              Si vos revenus d&apos;activite sont inferieurs a 20 % du plafond annuel de la Securite sociale
              (soit environ 9 400 euros en 2026), une cotisation supplementaire de <strong>6,5 %</strong>{" "}
              s&apos;applique sur vos revenus du capital (dividendes, revenus fonciers, etc.). Pour l&apos;eviter, il
              suffit de se verser un salaire annuel depassant ce seuil.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Micro-entreprise : les plafonds 2026
            </h2>
            <p>
              La micro-entreprise reste ideale pour demarrer grace a sa simplicite de gestion. En 2026,
              les plafonds de chiffre d&apos;affaires sont de <strong>77 700 euros</strong> pour les prestations
              de services et <strong>188 700 euros</strong> pour les activites de vente. Au-dela, vous basculez
              automatiquement vers le regime reel, ce qui peut justifier de creer directement une SASU si
              vous prevoyez un CA eleve.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Comparez les deux statuts en quelques clics
            </h3>
            <p>
              Notre simulateur auto-entrepreneur vous permet d&apos;estimer vos revenus nets selon votre statut,
              votre chiffre d&apos;affaires et vos charges. Testez differents scenarios pour prendre la meilleure
              decision.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-10">
            <Link
              href="/outils/simulateur-auto-entrepreneur"
              className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: "var(--primary)" }}
            >
              Essayer l&apos;outil &rarr;
              <span className="text-xs font-normal opacity-75">Simulateur auto-entrepreneur</span>
            </Link>
          </div>

          {/* Back link */}
          <div className="mt-12 border-t pt-8" style={{ borderColor: "var(--border)" }}>
            <Link
              href="/blog"
              className="text-sm font-medium transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4"
              style={{ color: "var(--muted)" }}
            >
              &larr; Retour au blog
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
