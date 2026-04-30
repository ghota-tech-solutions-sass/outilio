"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleDPEFG() {
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
            <span style={{ color: "var(--foreground)" }}>DPE F ou G : que faire en 2026</span>
          </nav>

          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Immobilier
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            DPE F ou G : que faire avec un{" "}
            <span style={{ color: "var(--primary)" }}>logement energivore en 2026</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>22 avril 2026</span>
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
                Vous avez recu votre DPE et vous etes classe F ou G. Mauvaise nouvelle : votre
                logement est officiellement une <strong>passoire thermique</strong>. La loi Climat
                et Resilience d&apos;aout 2021 a fixe un calendrier strict d&apos;interdiction de
                location, et 2026 marque une etape : les G sont deja interdits a la location depuis
                janvier 2025. Que vous soyez bailleur ou proprietaire occupant, les choix qui
                s&apos;offrent a vous determinent largement la valeur future du bien.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Le calendrier des interdictions
              </h2>
              <p>
                La loi Climat et Resilience (loi 2021-1104 du 22 aout 2021) interdit progressivement
                la location des logements classes selon leur DPE :
              </p>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li><strong>1er janvier 2023</strong> : logements consommant plus de 450 kWh/m²/an interdits a la location (les pires des G)</li>
                <li><strong>1er janvier 2025</strong> : tous les logements classes <strong>G</strong> interdits a la location (deja en vigueur)</li>
                <li><strong>1er janvier 2028</strong> : les classes <strong>F</strong> rejoignent l&apos;interdiction</li>
                <li><strong>1er janvier 2034</strong> : les classes <strong>E</strong> a leur tour</li>
              </ul>
              <p>
                Concretement, si vous louez actuellement un logement F en 2026, vous avez moins de
                deux ans pour le renover ou cesser la location. Au-dela, le bail ne pourra ni etre
                signe ni renouvele.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                La decote a la revente : 15 a 20 % en moyenne
              </h2>
              <p>
                Les notaires de France et les chambres de notaires regionales ont publie en 2024 et
                2025 plusieurs etudes mesurant l&apos;impact du DPE sur les prix. La <strong>decote
                moyenne pour un bien classe F ou G</strong> par rapport a un bien equivalent classe
                D ou mieux atteint :
              </p>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li>Maisons individuelles : <strong>-13 a -22 %</strong> selon les regions</li>
                <li>Appartements en grandes villes : <strong>-10 a -15 %</strong></li>
                <li>Appartements en zones detendues : <strong>-15 a -25 %</strong> (effet stock plus eleve)</li>
              </ul>
              <p>
                Avant de revendre, simulez la fiscalite avec notre{" "}
                <Link href="/outils/simulateur-plus-value-immobiliere" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                  simulateur de plus-value immobiliere
                </Link>{" "}
                pour comparer le scenario &laquo;&nbsp;vente avec decote DPE&nbsp;&raquo; et
                &laquo;&nbsp;renovation puis vente&nbsp;&raquo;.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Les 3 options qui s&apos;offrent a vous
              </h2>

              <h3 className="!mt-6 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Option 1 : Renover pour gagner 1 ou 2 classes
              </h3>
              <p>
                C&apos;est l&apos;option la plus rentable a moyen terme dans la plupart des cas.
                Les travaux prioritaires pour passer un G en E ou un F en D :
              </p>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li><strong>Isolation des combles</strong> : 25 a 30 % des deperditions, cout 30 a 60 EUR/m², ROI 4-7 ans</li>
                <li><strong>Isolation des murs par l&apos;exterieur (ITE)</strong> : 20 a 25 % des deperditions, cout 130 a 250 EUR/m², le plus efficace mais le plus cher</li>
                <li><strong>Remplacement de la chaudiere</strong> par une pompe a chaleur (PAC air-eau ou geothermique) : economie 50 a 70 % sur le chauffage</li>
                <li><strong>Remplacement des fenetres</strong> en simple vitrage par du double vitrage : 10 a 15 % des deperditions</li>
                <li><strong>Ventilation</strong> : VMC double flux pour eviter les pertes de chaleur a l&apos;aeration</li>
              </ul>
              <p>
                <strong>Cout total moyen pour passer de G a D</strong> : 35 000 a 70 000 EUR pour
                une maison de 100 m². Mais les aides peuvent couvrir jusqu&apos;a 90 % du cout pour
                les menages tres modestes.
              </p>

              <h3 className="!mt-6 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Option 2 : Vendre maintenant avec la decote
              </h3>
              <p>
                Si vous n&apos;avez ni le budget ni l&apos;envie d&apos;engager des travaux lourds,
                vendre rapidement evite l&apos;aggravation de la decote (qui s&apos;accentue chaque
                annee qui rapproche les echeances 2028 et 2034). Acceptez une decote de 15-20 % et
                tournez la page. Les acheteurs investisseurs cherchent ce type de bien pour benficier
                de MaPrimeRenov, dans une logique de creation de valeur par la renovation.
              </p>

              <h3 className="!mt-6 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Option 3 : Conserver pour usage personnel uniquement
              </h3>
              <p>
                Si vous occupez le bien en residence principale ou secondaire, l&apos;interdiction
                de location ne vous concerne pas directement. Les classes F et G restent
                <strong> autorisees a la vente et a l&apos;occupation personnelle</strong>. Vous
                pouvez attendre, mais sachez que la decote au moment de la revente future sera de
                plus en plus importante.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Les aides MaPrimeRenov en 2026
              </h2>
              <p>
                MaPrimeRenov a ete recentre en 2024 sur les renovations d&apos;ampleur (au moins
                deux gestes coordonnes ou un saut de 2 classes DPE). En 2026, les aides s&apos;elevent a :
              </p>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li><strong>Menages tres modestes</strong> : jusqu&apos;a 63 000 EUR (saut de 4 classes)</li>
                <li><strong>Menages modestes</strong> : jusqu&apos;a 51 000 EUR</li>
                <li><strong>Menages intermediaires</strong> : jusqu&apos;a 34 200 EUR</li>
                <li><strong>Menages aises</strong> : jusqu&apos;a 23 400 EUR</li>
              </ul>
              <p>
                A cela s&apos;ajoutent l&apos;eco-PTZ jusqu&apos;a 50 000 EUR (sans interets,
                15 ans), les Certificats d&apos;Economies d&apos;Energie (CEE) verses par les
                fournisseurs, et la TVA reduite a 5,5 % sur les travaux. Au total, un menage tres
                modeste peut financer une renovation a 90 % de subventions.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Estimer le DPE et le cout des travaux
              </h2>
              <p>
                Avant de decider, faites le diagnostic precis. Notre{" "}
                <Link href="/outils/calculateur-dpe" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                  calculateur DPE
                </Link>{" "}
                vous donne une estimation rapide a partir de la surface, du chauffage et de
                l&apos;isolation. Pour un audit officiel, faites realiser un DPE par un
                diagnostiqueur certifie.
              </p>
              <p>
                Pour modeliser l&apos;impact financier d&apos;une renovation, utilisez aussi notre{" "}
                <Link href="/outils/calculateur-rentabilite-locative" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                  calculateur de rentabilite locative
                </Link>{" "}
                pour comparer le scenario &laquo;&nbsp;loyer apres travaux&nbsp;&raquo; vs
                &laquo;&nbsp;cession a perte&nbsp;&raquo;.
              </p>

              <h3 className="!mt-8 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Synthese : que faire selon votre profil
              </h3>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li><strong>Bailleur classe G</strong> : interdit de relouer depuis janvier 2025. Travaux ou vente urgente.</li>
                <li><strong>Bailleur classe F</strong> : interdiction le 1er janvier 2028. 21 mois pour agir.</li>
                <li><strong>Proprietaire occupant F ou G</strong> : aucune contrainte legale. Decision economique selon horizon de revente.</li>
                <li><strong>Investisseur en quete d&apos;opportunites</strong> : un bien F ou G acquis avec decote + MaPrimeRenov peut creer 30-50 % de valeur post-travaux.</li>
              </ul>

              {/* CTA */}
              <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                  Estimez le DPE de votre logement et anticipez les travaux
                </p>
                <Link
                  href="/outils/calculateur-dpe"
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
                >
                  Lancer le calculateur DPE
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
