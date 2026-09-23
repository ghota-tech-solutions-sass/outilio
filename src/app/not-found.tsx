import Link from "next/link";
import type { Metadata } from "next";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Page introuvable - Erreur 404",
  description:
    `La page demandée n'existe pas ou a été déplacée. Découvrez nos ${tools.length} outils gratuits sur Outilis.fr.`,
  robots: { index: false, follow: true },
};

const SUGGESTED_SLUGS = [
  "/outils/calculateur-salaire",
  "/outils/calculateur-pret-immobilier",
  "/outils/simulateur-impot",
  "/outils/generateur-facture",
  "/outils/generateur-qr-code",
  "/outils/generateur-mot-de-passe",
];

const POPULAR_CATEGORIES = [
  { label: "Immobilier", slug: "immobilier", icon: "\u{1F3E0}" },
  { label: "Argent & impôts", slug: "finance", icon: "\u{1F4B0}" },
  { label: "Entreprise", slug: "business", icon: "\u{1F3E2}" },
  { label: "Emploi", slug: "emploi", icon: "\u{1F4BC}" },
  { label: "Développeur", slug: "dev", icon: "\u{1F4BB}" },
  { label: "Image & vidéo", slug: "image", icon: "\u{1F5BC}\uFE0F" },
];

export default function NotFound() {
  const suggested = SUGGESTED_SLUGS.map((href) => tools.find((t) => t.href === href)).filter(
    (t): t is (typeof tools)[number] => Boolean(t)
  );

  return (
    <>
      <section
        className="relative overflow-hidden py-20 md:py-28"
        style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)" }}
        />

        <div className="mx-auto max-w-3xl px-6 text-center">
          <p
            className="animate-fade-up text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: "var(--accent)" }}
          >
            Erreur 404
          </p>

          <h1
            className="animate-fade-up stagger-1 mt-4 text-[88px] font-extrabold leading-none tracking-tight md:text-[140px]"
            style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, var(--primary), var(--primary-light) 60%, var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </h1>

          <h2
            className="animate-fade-up stagger-2 mt-6 text-2xl font-bold md:text-3xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
          >
            Cette page s&apos;est évaporée.
          </h2>

          <p
            className="animate-fade-up stagger-3 mx-auto mt-4 max-w-xl text-base leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            L&apos;adresse n&apos;existe pas, a été renommée ou ne fonctionne plus. Pas de panique :
            {tools.length} outils gratuits vous attendent juste en dessous.
          </p>

          <div className="animate-fade-up stagger-4 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "var(--primary)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-7h4v7h4a1 1 0 0 0 1-1V10" />
              </svg>
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/#outils"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
                color: "var(--foreground)",
              }}
            >
              Voir les {tools.length} outils
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="mb-10 text-center">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em]"
              style={{ color: "var(--accent)" }}
            >
              Les plus utilisés
            </p>
            <h2
              className="mt-3 text-3xl font-extrabold md:text-4xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
            >
              Vous cherchiez peut-être l&apos;un de ceux-ci ?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {suggested.map((tool) => (
              <ToolCard
                key={tool.href}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                icon={tool.icon}
                badge={tool.badge}
                category={tool.category}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16" style={{ background: "var(--surface-alt)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="mb-8 text-center">
            <p
              className="text-xs font-bold uppercase tracking-[0.25em]"
              style={{ color: "var(--accent)" }}
            >
              Explorer par catégorie
            </p>
            <h2
              className="mt-3 text-2xl font-extrabold md:text-3xl"
              style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
            >
              Choisissez votre univers
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center justify-center rounded-2xl border p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {cat.icon}
                </span>
                <span
                  className="mt-2 text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
                >
                  {cat.label}
                </span>
                <span className="mt-0.5 text-[11px]" style={{ color: "var(--muted)" }}>
                  {tools.filter((t) => t.category.toLowerCase() === cat.slug).length} outils
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Vous pensez qu&apos;une page devrait exister ici ?
            <br />
            Écrivez-nous à{" "}
            <a
              href="mailto:contact@outilis.fr"
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: "var(--primary)" }}
            >
              contact@outilis.fr
            </a>
            {" "}- nous ajoutons régulièrement de nouveaux outils.
          </p>
        </div>
      </section>
    </>
  );
}
