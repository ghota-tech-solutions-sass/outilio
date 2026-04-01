"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleBudgetQuotidien() {
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
            <span style={{ color: "var(--foreground)" }}>Gerer son budget au quotidien : les outils essentiels</span>
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
            Gerer son budget au quotidien :{" "}
            <span style={{ color: "var(--primary)" }}>les outils essentiels</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>10 mars 2026</span>
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
              Selon une enquete INSEE de 2025, 45 % des Francais declarent ne pas connaitre precisement
              le montant de leurs depenses mensuelles. Pourtant, maitriser son budget est la premiere etape
              vers une epargne reguliere et une tranquillite financiere. Ce guide passe en revue les
              calculateurs gratuits d&apos;Outilis.fr qui vous aident a y voir clair, du salaire net
              jusqu&apos;au partage de l&apos;addition entre amis.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Salaire net : le point de depart de tout budget
            </h2>
            <p>
              Votre salaire brut n&apos;est pas votre revenu disponible. Entre les cotisations salariales
              (securite sociale, retraite, chomage, CSG/CRDS) et le prelevement a la source de l&apos;impot
              sur le revenu, le montant qui arrive sur votre compte bancaire peut etre 25 a 30 % inferieur
              au brut annonce.
            </p>
            <p>
              Notre{" "}
              <Link href="/outils/calculateur-salaire" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de salaire net
              </Link>{" "}
              prend en compte votre statut (cadre, non-cadre, fonction publique), votre taux de prelevement
              a la source et les cotisations specifiques a votre situation. Le resultat vous donne le
              montant reel dont vous disposez chaque mois pour vos depenses et votre epargne.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              La regle du 50/30/20
            </h3>
            <p>
              Une methode simple pour structurer son budget :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>50 % pour les besoins essentiels</strong> : loyer, alimentation, transport, assurances, mutuelles.</li>
              <li><strong>30 % pour les envies</strong> : loisirs, restaurants, shopping, abonnements streaming.</li>
              <li><strong>20 % pour l&apos;epargne et le remboursement de dettes</strong> : livret A, assurance-vie, credit conso.</li>
            </ul>
            <p>
              En partant de votre salaire net reel, vous pouvez immediatement calculer ces trois enveloppes
              et identifier si vos depenses actuelles respectent cet equilibre.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              TVA et prix reel : ce que vous payez vraiment
            </h2>
            <p>
              La TVA est incluse dans pratiquement tout ce que vous achetez en France. Mais connaissez-vous
              la part de taxes dans vos depenses ? Les taux en vigueur en 2026 :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>20 %</strong> : taux normal (la majorite des biens et services)</li>
              <li><strong>10 %</strong> : taux intermediaire (restauration, transports, travaux de renovation)</li>
              <li><strong>5,5 %</strong> : taux reduit (produits alimentaires de premiere necessite, livres, abonnements energetiques)</li>
              <li><strong>2,1 %</strong> : taux super-reduit (medicaments rembourses, presse)</li>
            </ul>
            <p>
              Notre{" "}
              <Link href="/outils/calculateur-tva" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de TVA
              </Link>{" "}
              convertit instantanement un prix HT en TTC et inversement, pour n&apos;importe quel taux.
              Utile pour les professionnels qui facturent, mais aussi pour les particuliers qui veulent
              comprendre la decomposition de leurs achats.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Remises et soldes : calculer la vraie economie
            </h2>
            <p>
              Les periodes de soldes (janvier et juin) et les promotions permanentes en e-commerce
              s&apos;accompagnent souvent de pourcentages affoles : -30 %, -50 %, -70 %. Mais combien
              economisez-vous reellement en euros ? Et surtout, le prix initial etait-il gonfle ?
            </p>
            <p>
              Le{" "}
              <Link href="/outils/calculateur-remise" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de remise
              </Link>{" "}
              vous donne le prix final apres reduction, le montant economise et peut meme calculer le
              pourcentage de remise a partir de deux prix. Un reflexe simple avant chaque achat impulsif :
              entrez le prix et la remise pour voir si l&apos;economie justifie la depense.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Pourboire : les usages en France
            </h2>
            <p>
              Contrairement aux Etats-Unis ou le pourboire est quasi-obligatoire (15 a 20 % de l&apos;addition),
              en France le service est inclus dans les prix affiches. Laisser un pourboire reste un geste
              apprecie mais facultatif. Les usages courants :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Restaurant</strong> : 5 a 10 % de l&apos;addition si le service etait bon, ou arrondir a l&apos;euro superieur.</li>
              <li><strong>Cafe</strong> : les pieces rendues sur la monnaie, 20 a 50 centimes.</li>
              <li><strong>Livraison</strong> : 1 a 2 euros, davantage par mauvais temps ou pour une commande lourde.</li>
              <li><strong>Coiffeur</strong> : 2 a 5 euros selon la prestation.</li>
            </ul>
            <p>
              Notre{" "}
              <Link href="/outils/calculateur-pourboire" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de pourboire
              </Link>{" "}
              calcule le montant du pourboire et le total a payer selon le pourcentage choisi, avec option
              de partage entre convives.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Partage de frais entre amis
            </h2>
            <p>
              Week-end entre amis, colocation, voyage en groupe : le partage des depenses peut vite
              devenir un casse-tete. Qui a avance l&apos;essence, qui a paye le restaurant, qui doit
              combien a qui ? Le{" "}
              <Link href="/outils/calculateur-partage-frais" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de partage de frais
              </Link>{" "}
              simplifie tout : entrez les depenses de chacun, et l&apos;outil calcule les remboursements
              optimaux pour equilibrer les comptes avec un minimum de transactions.
            </p>
            <p>
              Plus besoin de tableur Excel ou de messages WhatsApp interminables. Le resultat vous dit
              exactement qui rembourse qui, et combien.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Budget carburant et frais kilometriques
            </h2>
            <p>
              En 2026, le prix moyen du SP95-E10 oscille autour de 1,75 euro le litre. Pour un trajet
              domicile-travail de 30 km aller, cela represente un budget carburant significatif chaque
              mois. Notre{" "}
              <Link href="/outils/calculateur-consommation-essence" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de consommation d&apos;essence
              </Link>{" "}
              estime votre cout au kilometre en fonction de la consommation de votre vehicule et du
              prix du carburant.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Frais kilometriques : deduire ses trajets des impots
            </h3>
            <p>
              Si vous utilisez votre vehicule personnel pour le travail, vous pouvez opter pour la
              deduction des frais reels a la place de l&apos;abattement forfaitaire de 10 % sur votre
              declaration d&apos;impot. Le bareme kilometrique officiel (publie chaque annee par
              l&apos;administration fiscale) prend en compte :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>La puissance fiscale du vehicule (en CV)</li>
              <li>Le nombre de kilometres parcourus dans l&apos;annee</li>
              <li>L&apos;amortissement, l&apos;assurance, l&apos;entretien et le carburant (tout est inclus dans le bareme)</li>
            </ul>
            <p>
              Notre{" "}
              <Link href="/outils/calculateur-frais-kilometriques" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                calculateur de frais kilometriques
              </Link>{" "}
              applique le bareme officiel 2026 pour estimer votre deduction fiscale. Comparez-la avec
              l&apos;abattement de 10 % pour choisir l&apos;option la plus avantageuse.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              En resume : les bons reflexes budgetaires
            </h2>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Partez toujours de votre salaire net reel, pas du brut.</li>
              <li>Appliquez la regle du 50/30/20 pour structurer vos depenses.</li>
              <li>Verifiez le vrai prix avant chaque achat en promotion.</li>
              <li>Utilisez un calculateur de partage de frais pour eviter les tensions entre amis.</li>
              <li>Evaluez votre budget transport reel et comparez frais reels vs abattement pour vos impots.</li>
              <li>Automatisez votre epargne : un virement permanent le jour du salaire, c&apos;est la methode la plus efficace.</li>
            </ul>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                Calculez votre salaire net et planifiez votre budget
              </p>
              <Link
                href="/outils/calculateur-salaire"
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
