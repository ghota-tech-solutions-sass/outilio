"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticlePTZ2026() {
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
            <span style={{ color: "var(--foreground)" }}>PTZ 2026 : tout ce qui a change</span>
          </nav>

          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Immobilier
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PTZ 2026 : ce qui a change{" "}
            <span style={{ color: "var(--primary)" }}>avec le nouveau dispositif</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>15 avril 2026</span>
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
                Le Pret a Taux Zero a ete profondement remanie pour 2026. Apres une version 2024
                jugee trop restrictive (recentree sur les zones tendues et les appartements), la loi
                de finances 2025 et le decret du 4 mars 2025 ont elargi le dispositif a toute la
                France et augmente les quotites finançables. Resultat : un PTZ accessible a beaucoup
                plus de menages, notamment dans les villes moyennes et en zone rurale.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Le PTZ, c&apos;est quoi exactement
              </h2>
              <p>
                Le PTZ est un pret immobilier sans interets, accorde par les banques pour completer
                un pret principal. Il est integralement finance par l&apos;Etat. Reserve aux
                primo-accedants (pas de propriete de la residence principale dans les 2 dernieres
                annees), il permet de boucler un plan de financement sans alourdir le cout total du
                credit. Reference legale : articles L31-10-2 et L31-10-3 du Code de la construction
                et de l&apos;habitation (CCH).
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Les 4 nouveautes majeures de 2026
              </h2>

              <h3 className="!mt-6 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                1. Extension geographique a toute la France
              </h3>
              <p>
                <strong>C&apos;est le changement le plus structurant.</strong> Depuis le 1er avril
                2025, le PTZ pour le neuf collectif (immeubles d&apos;appartements) est disponible
                dans <strong>toutes les zones</strong> du territoire (A, A bis, B1, B2 et C). Avant,
                il etait reserve aux zones tendues. Cette extension repond a une demande forte des
                villes moyennes et zones rurales, ou la production de logements neufs s&apos;etait
                effondree.
              </p>

              <h3 className="!mt-6 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                2. Reintegration des maisons individuelles neuves
              </h3>
              <p>
                Les <strong>maisons individuelles neuves</strong> sont a nouveau eligibles, mais
                avec une quotite plus faible que le collectif (30 % en zone Abis/A/B1, 20 % en B2/C).
                C&apos;est un retour partiel apres l&apos;exclusion de 2024 qui avait suscite une
                levee de boucliers chez les constructeurs et les acheteurs en zone diffuse.
              </p>

              <h3 className="!mt-6 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                3. Quotites finançables relevees
              </h3>
              <p>
                La quotite (part du cout d&apos;operation finançable en PTZ) atteint desormais :
              </p>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li><strong>Neuf collectif</strong> : 50 % du cout en zones Abis/A/B1, 30 % en B2/C</li>
                <li><strong>Neuf individuel</strong> : 30 % en Abis/A/B1, 20 % en B2/C</li>
                <li><strong>Ancien avec travaux</strong> : 50 % en zones B2/C uniquement (achat + travaux representant au moins 25 % du cout total)</li>
              </ul>

              <h3 className="!mt-6 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                4. Plafonds de revenus revalorises
              </h3>
              <p>
                Les plafonds de Revenu Fiscal de Reference (RFR) ont ete augmentes en moyenne de
                10 %. Pour une famille de 4 personnes en zone A, le plafond depasse desormais
                81 000 EUR. Quatre tranches de revenus determinent la part finançable et la duree de
                differe (la periode pendant laquelle vous ne remboursez que le capital ou rien).
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Exemple chiffre : famille a Lyon
              </h2>
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Couple avec 2 enfants, RFR 50 000 EUR, achat d&apos;un T3 neuf en zone A (Lyon)
                  pour 320 000 EUR cout d&apos;operation total. Tranche 2 du PTZ.
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-sm" style={{ color: "var(--foreground)" }}>
                  <li>Quotite tranche 2 : 40 % du cout (zone A, neuf collectif)</li>
                  <li>Montant PTZ : 320 000 x 40 % = <strong>128 000 EUR sans interets</strong></li>
                  <li>Duree de remboursement : 22 ans avec 7 ans de differe total</li>
                  <li>Pret principal a contracter : 192 000 EUR (au lieu de 320 000 EUR sans PTZ)</li>
                </ul>
                <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
                  Sur 22 ans a un taux de pret principal de 3,3 %, l&apos;economie d&apos;interets
                  realisee grace au PTZ depasse 50 000 EUR.
                </p>
              </div>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Comment estimer son PTZ 2026
              </h2>
              <p>
                Pour verifier votre eligibilite et le montant auquel vous avez droit, utilisez notre{" "}
                <Link href="/outils/simulateur-ptz-2026" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                  simulateur PTZ 2026
                </Link>. Saisissez vos revenus, le nombre de personnes du foyer, la zone et le type
                de bien. Le resultat est instantane et integre les barèmes officiels du decret du
                4 mars 2025.
              </p>
              <p>
                Pour boucler votre plan de financement, completez avec notre{" "}
                <Link href="/outils/calculateur-pret-immobilier" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                  calculateur de pret immobilier
                </Link>{" "}
                pour la part de pret principal et notre{" "}
                <Link href="/outils/calculateur-frais-notaire" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                  calculateur de frais de notaire
                </Link>{" "}
                pour anticiper les frais d&apos;acte (3 % seulement dans le neuf, contre 7-8 % dans
                l&apos;ancien).
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Pieges a eviter
              </h2>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li>
                  <strong>Le PTZ ne couvre pas l&apos;integralite de l&apos;achat</strong>. Il vient
                  toujours en complement d&apos;un pret principal et exige un apport personnel
                  (frais de notaire au minimum).
                </li>
                <li>
                  <strong>Les plafonds RFR sont stricts</strong>. Si vos revenus depassent meme
                  legerement le plafond de votre zone, vous etes exclu du dispositif. Pensez a
                  optimiser votre RFR via le PER ou les dispositifs de defiscalisation
                  l&apos;annee precedant la demande.
                </li>
                <li>
                  <strong>Le differe peut creer un effet ciseau</strong>. Pendant la periode de
                  differe, vous remboursez uniquement le pret principal. Quand le PTZ entre en
                  remboursement, vos mensualites totales augmentent. Anticipez cette marche dans
                  votre budget.
                </li>
                <li>
                  <strong>L&apos;eligibilite doit etre demandee a la banque</strong>. Le PTZ ne
                  s&apos;obtient pas en guichet : vous devez en faire la demande dans le cadre de
                  votre dossier de pret immobilier.
                </li>
              </ul>

              <h3 className="!mt-8 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Pour qui le PTZ 2026 vaut vraiment le coup
              </h3>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li>Primo-accedants en CDI ou TNS stable, avec apport limite (10 a 15 %)</li>
                <li>Familles en zones moyennes (B2, C) qui etaient exclues du PTZ 2024</li>
                <li>Acheteurs dans le neuf collectif (immeubles), quel que soit leur emplacement</li>
                <li>Menages dont le RFR par personne est inferieur aux plafonds (zone-dependant)</li>
              </ul>

              {/* CTA */}
              <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                  Estimez votre PTZ 2026 en 30 secondes
                </p>
                <Link
                  href="/outils/simulateur-ptz-2026"
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
                >
                  Lancer le simulateur PTZ
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
