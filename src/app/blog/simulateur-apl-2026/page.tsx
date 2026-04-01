"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleSimulateurAPL2026() {
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
            <span style={{ color: "var(--foreground)" }}>APL 2026 : comment estimer vos aides au logement</span>
          </nav>

          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Logement
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            APL 2026 : comment estimer vos{" "}
            <span style={{ color: "var(--primary)" }}>aides au logement</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>20 fevrier 2026</span>
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
              Les APL (Aides Personnalisees au Logement) representent un soutien financier essentiel pour des
              millions de locataires en France. En 2026, les baremes ont ete revalorises pour tenir compte de
              l&apos;inflation. Voici comment fonctionne le calcul et combien vous pouvez esperer percevoir.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Qui peut beneficier des APL ?
            </h2>
            <p>
              Les APL sont versees par la CAF (Caisse d&apos;Allocations Familiales) aux locataires qui
              remplissent les conditions suivantes :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Etre locataire d&apos;un logement conventionnne (la majorite des logements le sont)</li>
              <li>Le logement doit etre votre residence principale</li>
              <li>Vos ressources ne doivent pas depasser un certain plafond</li>
              <li>Etre de nationalite francaise ou en situation reguliere</li>
            </ul>
            <p>
              Les etudiants, les salaries, les chomeurs et les retraites peuvent tous pretendre aux APL, a
              condition de respecter les plafonds de ressources.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Comment est calcule le montant des APL ?
            </h2>
            <p>
              Le calcul des APL prend en compte plusieurs parametres :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Vos revenus</strong> : les ressources des 12 derniers mois (calcul en temps reel depuis 2021)</li>
              <li><strong>Le montant du loyer</strong> : plafonne selon la zone geographique (zone 1, 2 ou 3)</li>
              <li><strong>La composition du foyer</strong> : personne seule, couple, nombre d&apos;enfants</li>
              <li><strong>La zone geographique</strong> : Paris et region parisienne (zone 1), grandes villes (zone 2), reste de la France (zone 3)</li>
            </ul>
            <p>
              Si vous etes salarie, estimez d&apos;abord votre{" "}
              <Link href="/outils/calculateur-salaire" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>salaire net mensuel</Link>{" "}
              pour renseigner vos revenus avec precision.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les plafonds de loyer par zone en 2026
            </h2>
            <p>
              Le loyer pris en compte pour le calcul est plafonne. Au-dela de ce plafond, le surplus de loyer
              n&apos;est pas couvert par les APL :
            </p>

            <div
              className="rounded-xl border p-5"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between font-bold" style={{ color: "var(--primary)" }}>
                  <span>Zone</span>
                  <span>Personne seule</span>
                </div>
                <div className="flex justify-between">
                  <span>Zone 1 (Paris, IDF)</span>
                  <span>319,87 &euro;</span>
                </div>
                <div className="flex justify-between">
                  <span>Zone 2 (grandes villes)</span>
                  <span>278,28 &euro;</span>
                </div>
                <div className="flex justify-between">
                  <span>Zone 3 (reste de la France)</span>
                  <span>260,82 &euro;</span>
                </div>
              </div>
            </div>

            <p>
              Ces plafonds augmentent avec la taille du foyer. Pour un couple sans enfant, comptez environ
              30 % de plus ; pour chaque personne supplementaire, environ 55 &euro; de plus.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Exemple : etudiant a Lyon, loyer de 550 &euro;
            </h2>
            <p>
              Prenons un etudiant vivant seul a Lyon (zone 2), avec un loyer de 550 &euro; et des revenus
              annuels de 6 000 &euro; (job etudiant) :
            </p>

            <div
              className="rounded-xl border p-5"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <div className="space-y-2 text-sm font-medium">
                <div className="flex justify-between">
                  <span>Loyer mensuel</span>
                  <span>550,00 &euro;</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>Loyer plafonne (zone 2)</span>
                  <span>278,28 &euro;</span>
                </div>
                <div className="flex justify-between" style={{ color: "var(--muted)" }}>
                  <span>Participation personnelle</span>
                  <span>- 38,96 &euro;</span>
                </div>
                <div
                  className="flex justify-between border-t pt-2 text-base font-bold"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span>APL estimee</span>
                  <span style={{ color: "var(--primary)" }}>~239 &euro;/mois</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: "var(--muted)" }}>
                  <span>Reste a charge</span>
                  <span>~311 &euro;/mois</span>
                </div>
              </div>
            </div>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les changements 2026
            </h2>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Revalorisation des baremes</strong> : les plafonds de loyer et les montants forfaitaires ont ete revus a la hausse de 3,26 % pour suivre l&apos;inflation</li>
              <li><strong>Calcul en temps reel</strong> : vos APL sont recalculees tous les 3 mois sur la base de vos revenus des 12 derniers mois</li>
              <li><strong>Seuil minimal</strong> : si le montant calcule est inferieur a 10 &euro;/mois, l&apos;aide n&apos;est pas versee</li>
            </ul>
            <p>
              Si vous envisagez d&apos;acheter plutot que de louer, notre{" "}
              <Link href="/outils/calculateur-pret-immobilier" className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]" style={{ color: "var(--primary)" }}>simulateur de pret immobilier</Link>{" "}
              estime vos mensualites et votre capacite d&apos;emprunt.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estimez vos APL en quelques clics
            </h3>
            <p>
              Notre simulateur gratuit vous donne une estimation de vos APL en fonction de votre situation :
              zone geographique, loyer, revenus et composition du foyer. Rapide et sans inscription.
            </p>
            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>Estimez vos APL en quelques secondes</p>
              <Link
                href="/outils/simulateur-apl"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
              >
                Essayer le simulateur APL
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
