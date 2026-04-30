"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleRachatCreditImmo2026() {
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
            <span style={{ color: "var(--foreground)" }}>Rachat de credit immo 2026</span>
          </nav>

          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Finance
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Rachat de credit immobilier 2026 :{" "}
            <span style={{ color: "var(--primary)" }}>quand ca vaut vraiment le coup ?</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>28 avril 2026</span>
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
                Apres le pic des taux de fin 2023 (jusqu&apos;a 4,5 % sur 20 ans), les conditions
                d&apos;emprunt se sont detendues. En 2026, les banques proposent des taux entre
                3,1 % et 3,4 % selon les profils. Si vous avez signe en 2023 ou debut 2024, la
                question du rachat se pose serieusement. Mais entre les frais, l&apos;assurance,
                l&apos;indemnite de remboursement anticipe et la duree restante, l&apos;arbitrage
                n&apos;est pas evident. Voici comment trancher en 5 minutes.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                La regle de l&apos;ecart de 0,7 a 1 point
              </h2>
              <p>
                C&apos;est la regle empirique citee par tous les courtiers : pour qu&apos;un rachat
                soit interessant, il faut un <strong>ecart de taux d&apos;au moins 0,7 a 1 point</strong>{" "}
                entre votre taux actuel et le nouveau taux propose. En dessous, les frais (penalites,
                garanties, dossier) consomment trop de l&apos;economie attendue.
              </p>
              <p>
                Mais cette regle ne vaut que si vous etes <strong>dans le premier tiers de votre
                pret</strong>. Pourquoi ? Parce que les interets sont concentres en debut de pret
                (l&apos;amortissement est progressif). Plus vous etes avance dans votre echeancier,
                moins le rachat est interessant, meme avec un gros ecart de taux.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Les frais a anticiper
              </h2>
              <p>
                Le cout total d&apos;un rachat de credit comprend plusieurs postes :
              </p>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li>
                  <strong>Indemnite de remboursement anticipe (IRA)</strong> : plafonnee par la loi
                  a 6 mois d&apos;interets ou 3 % du capital restant du, le plus faible des deux.
                  Pour un capital restant de 200 000 EUR a 4 % : 6 mois d&apos;interets = 4 000 EUR,
                  3 % = 6 000 EUR : l&apos;IRA sera donc plafonnee a 4 000 EUR.
                </li>
                <li>
                  <strong>Frais de dossier</strong> de la nouvelle banque : 500 a 1 500 EUR
                  generalement, parfois negociable.
                </li>
                <li>
                  <strong>Frais de garantie</strong> : nouvelle hypotheque ou caution. Pour la
                  caution Credit Logement, environ 1,5 % du capital. Pour une hypotheque, plus
                  cher (frais notaire, taxes).
                </li>
                <li>
                  <strong>Eventuels frais de courtier</strong> : 1 % du capital en moyenne, mais
                  uniquement si vous passez par un courtier.
                </li>
              </ul>
              <p>
                Pour un rachat de 200 000 EUR, comptez en moyenne <strong>4 500 a 8 000 EUR de
                frais totaux</strong>. C&apos;est cette somme qu&apos;il faut amortir avec
                l&apos;economie d&apos;interets generee par le nouveau taux.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Exemple chiffre : rachat ou pas ?
              </h2>
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Cas A : pret signe debut 2024 a 4,2 %
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm" style={{ color: "var(--foreground)" }}>
                  <li>Capital restant du : 220 000 EUR sur 22 ans</li>
                  <li>Mensualite actuelle : 1 287 EUR (hors assurance)</li>
                  <li>Nouveau taux : 3,2 %</li>
                  <li>Nouvelle mensualite : 1 175 EUR</li>
                  <li>Economie mensuelle : <strong>112 EUR</strong></li>
                  <li>Frais totaux du rachat : 6 800 EUR</li>
                  <li>Delai d&apos;amortissement des frais : 6 800 / 112 = <strong>60 mois (5 ans)</strong></li>
                  <li>Si vous restez encore plus de 5 ans dans le bien : <strong>rachat rentable</strong></li>
                </ul>
                <p className="mt-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  Cas B : pret signe en 2018 a 1,5 %
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm" style={{ color: "var(--foreground)" }}>
                  <li>Capital restant du : 150 000 EUR sur 12 ans</li>
                  <li>Nouveau taux propose : 3,2 %</li>
                  <li>L&apos;ecart est <strong>negatif</strong> : -1,7 point</li>
                  <li><strong>Aucun interet</strong> a racheter, vous degraderiez votre situation</li>
                </ul>
              </div>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Ne pas oublier l&apos;assurance emprunteur
              </h2>
              <p>
                La loi Lemoine de 2022 a instaure le droit de changer d&apos;assurance emprunteur
                <strong> a tout moment, sans frais ni penalites</strong>. C&apos;est souvent le
                premier levier d&apos;economies, et le plus simple a actionner. Une assurance
                deleguee peut diviser par 2 ou 3 le cout par rapport a une assurance groupe bancaire.
              </p>
              <p>
                <strong>Conseil pratique</strong> : avant meme de penser au rachat, faites jouer la
                loi Lemoine. Si vous changez votre assurance et passez de 0,34 % a 0,12 % sur un
                capital de 200 000 EUR, vous economisez environ 5 000 EUR sur la duree restante du
                pret. C&apos;est gratuit, sans rachat de credit.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Renegocier avec sa banque ou changer de banque ?
              </h2>
              <p>
                Deux options existent :
              </p>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li>
                  <strong>Renegocier avec votre banque actuelle</strong> : pas d&apos;IRA, pas de
                  nouvelle garantie, frais reduits. Mais la banque sait qu&apos;elle peut vous
                  laisser partir et vous proposera un taux moins agressif que la concurrence.
                </li>
                <li>
                  <strong>Faire racheter par une autre banque</strong> : taux plus agressif, mais
                  IRA + frais de garantie + dossier. Plus rentable a partir d&apos;un ecart de
                  1 point ou plus.
                </li>
              </ul>
              <p>
                <strong>Strategie</strong> : commencez par obtenir des offres concurrentes (au moins
                3 banques ou un courtier), puis presentez-les a votre banque actuelle pour negocier.
                Si elle s&apos;aligne, vous gagnez sans avoir a changer.
              </p>

              <h2 className="!mt-10 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                Les outils pour decider en 5 minutes
              </h2>
              <p>
                Notre{" "}
                <Link href="/outils/calculateur-rachat-credit" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                  calculateur de rachat de credit
                </Link>{" "}
                integre tous les frais et calcule en temps reel l&apos;economie nette et le delai
                d&apos;amortissement. Saisissez votre taux actuel, le nouveau taux, le capital
                restant et la duree restante.
              </p>
              <p>
                Pour simuler une nouvelle situation complete (changement de bien ou allongement de
                duree), utilisez notre{" "}
                <Link href="/outils/calculateur-pret-immobilier" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>
                  calculateur de pret immobilier
                </Link>{" "}
                pour comparer plusieurs scenarios et trouver l&apos;optimum.
              </p>

              <h3 className="!mt-8 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Checklist avant de signer un rachat
              </h3>
              <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
                <li>Ecart de taux d&apos;au moins 0,7 point (mieux : 1 point)</li>
                <li>Vous etes dans le premier tiers du pret (interets concentres a rentabiliser)</li>
                <li>Capital restant superieur a 70 000 EUR (pour amortir les frais)</li>
                <li>Horizon de detention superieur au delai d&apos;amortissement des frais</li>
                <li>Vous avez fait jouer la loi Lemoine sur l&apos;assurance avant</li>
                <li>Vous avez compare au moins 3 offres de banques differentes</li>
                <li>Le TAEG (et pas seulement le taux nominal) est bien plus bas</li>
              </ul>

              {/* CTA */}
              <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                  Estimez votre gain en 30 secondes
                </p>
                <Link
                  href="/outils/calculateur-rachat-credit"
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
                >
                  Lancer le calculateur
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
