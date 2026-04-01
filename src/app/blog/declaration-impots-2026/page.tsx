"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleDeclarationImpots2026() {
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
            <span style={{ color: "var(--foreground)" }}>Declaration impots 2026</span>
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
            Declaration impots 2026 :{" "}
            <span style={{ color: "var(--primary)" }}>dates, bareme et nouveautes</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>3 fevrier 2026</span>
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
              La campagne de declaration des revenus 2025 ouvre ses portes en avril 2026. Nouveau bareme,
              dates limites, quotient familial : voici l&apos;essentiel pour preparer sereinement votre
              declaration et eviter les erreurs les plus courantes.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Dates cles de la declaration 2026
            </h2>
            <p>
              Le service de declaration en ligne sur <strong>impots.gouv.fr</strong> ouvre le{" "}
              <strong>9 avril 2026</strong>. Les dates limites de depot dependent de votre departement de
              residence :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Departements 01 a 19 et non-residents</strong> : jeudi 21 mai 2026</li>
              <li><strong>Departements 20 a 54</strong> : mercredi 28 mai 2026</li>
              <li><strong>Departements 55 a 976</strong> : mercredi 4 juin 2026</li>
            </ul>
            <p>
              Pour la declaration papier (reservee aux foyers dans l&apos;incapacite de declarer en ligne), la
              date limite est fixee au <strong>20 mai 2026</strong>, cachet de la Poste faisant foi.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Le nouveau bareme de l&apos;impot sur le revenu 2026
            </h2>
            <p>
              La loi de finances 2026 a revalorise les tranches du bareme de l&apos;IR de <strong>+0,9 %</strong>,
              indexees sur l&apos;inflation estimee. Voici le bareme applicable aux revenus 2025, declares en
              2026 :
            </p>

            <div
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: "var(--border)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--surface-alt)" }}>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--primary)" }}>Tranche de revenu</th>
                    <th className="px-4 py-3 text-right font-semibold" style={{ color: "var(--primary)" }}>Taux</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { range: "Jusqu'a 11 600 euros", rate: "0 %" },
                    { range: "De 11 601 a 29 579 euros", rate: "11 %" },
                    { range: "De 29 580 a 84 577 euros", rate: "30 %" },
                    { range: "De 84 578 a 181 917 euros", rate: "41 %" },
                    { range: "Au-dela de 181 917 euros", rate: "45 %" },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="border-t"
                      style={{ borderColor: "var(--border)", background: i % 2 === 0 ? "var(--surface)" : "var(--surface-alt)" }}
                    >
                      <td className="px-4 py-3">{row.range}</td>
                      <td className="px-4 py-3 text-right font-semibold">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Pour connaitre votre revenu net imposable, calculez d&apos;abord votre{" "}
              <Link href="/outils/calculateur-salaire" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>salaire net a partir du brut</Link>.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Quotient familial : plafonds 2026
            </h2>
            <p>
              Le quotient familial permet de diviser le revenu imposable par le nombre de parts du foyer
              fiscal afin de reduire l&apos;impot. En 2026, l&apos;avantage maximal procure par chaque demi-part
              supplementaire est plafonne a <strong>1 791 euros</strong> (contre 1 759 euros en 2025). Pour un
              couple marie avec deux enfants (3 parts), le bareme s&apos;applique sur le revenu divise par 3,
              puis le resultat est multiplie par 3.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Nouveautes de la loi de finances 2026
            </h2>
            <p>
              Parmi les mesures notables de cette annee : la <strong>contribution differenciee sur les hauts
              revenus (CDHR)</strong>, un mecanisme anti-optimisation visant les contribuables dont l&apos;impot
              effectif est inferieur a 20 % de leur revenu fiscal de reference au-dela de 250 000 euros
              (500 000 euros pour un couple). Le plafond de deduction des frais de teletravail a domicile
              passe a <strong>620 euros</strong> par an. Enfin, le credit d&apos;impot pour emploi a domicile
              reste plafonne a 12 000 euros (+ 1 500 euros par personne a charge).
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estimez votre impot avant de declarer
            </h3>
            <p>
              Utilisez notre simulateur d&apos;impot gratuit pour estimer le montant de votre imposition 2026
              en quelques clics. Renseignez vos revenus, votre situation familiale et obtenez une estimation
              detaillee, tranche par tranche.
            </p>
            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Estimez votre impot 2026 en quelques clics</p>
              <Link
                href="/outils/simulateur-impot"
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
