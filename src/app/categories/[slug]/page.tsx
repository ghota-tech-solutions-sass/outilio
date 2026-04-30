import { tools } from "@/data/tools";
import { categoryContent } from "@/data/category-content";
import type { Metadata } from "next";
import Link from "next/link";

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function getCategories() {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const t of tools) {
    const slug = slugify(t.category);
    const existing = map.get(slug);
    if (existing) {
      existing.count++;
    } else {
      map.set(slug, { name: t.category, slug, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);
  const name = category?.name ?? slug;
  const count = category?.count ?? 0;
  const content = categoryContent[slug];

  return {
    title: `Outils ${name} gratuits en ligne (${count} outils) — Guide et conseils`,
    description: content
      ? content.intro
      : `Decouvrez nos ${count} outils ${name.toLowerCase()} gratuits : calculateurs, simulateurs et generateurs. 100% en ligne, sans inscription.`,
    keywords: [
      `outils ${name.toLowerCase()}`,
      `${name.toLowerCase()} en ligne`,
      `calculateur ${name.toLowerCase()}`,
      `guide ${name.toLowerCase()}`,
      "outils gratuits",
    ],
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);
  const categoryTools = tools.filter(
    (t) => slugify(t.category) === slug
  );
  const otherCategories = categories.filter((c) => c.slug !== slug);
  const content = categoryContent[slug];

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] pt-6">
        <ol className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
          <li>
            <Link href="/" className="transition-colors hover:text-[var(--primary)]">Accueil</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/#outils" className="transition-colors hover:text-[var(--primary)]">Categories</Link>
          </li>
          <li>/</li>
          <li style={{ color: "var(--foreground)" }} className="font-medium">
            {category?.name ?? slug}
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="py-12" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Categorie
          </p>
          <h1
            className="mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {content?.icon && <span className="mr-3">{content.icon}</span>}
            Outils{" "}
            <span style={{ color: "var(--primary)" }}>
              {category?.name ?? slug}
            </span>
          </h1>
          <p
            className="mt-4 max-w-2xl text-[15px] leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {content
              ? content.intro
              : `${categoryTools.length} outil${categoryTools.length > 1 ? "s" : ""} gratuit${categoryTools.length > 1 ? "s" : ""} dans cette categorie. 100% en ligne, aucune inscription requise.`}
          </p>
          <p className="mt-2 text-sm font-medium" style={{ color: "var(--primary)" }}>
            {categoryTools.length} outil{categoryTools.length > 1 ? "s" : ""} disponible{categoryTools.length > 1 ? "s" : ""} &middot; Mis a jour en avril 2026
          </p>
        </div>
      </section>

      {/* Use cases */}
      {content?.useCases && (
        <section className="py-10" style={{ background: "var(--surface-alt)", borderBottom: "1px solid var(--border)" }}>
          <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
            <h2 className="text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              A quoi servent ces outils ?
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {content.useCases.map((uc, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border p-4"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span className="text-sm leading-relaxed">{uc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools grid */}
      <section className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <h2 className="mb-6 text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Tous les outils {(category?.name ?? slug).toLowerCase()}
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0d4f3c]/5"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {tool.badge && (
                <span
                  className="absolute -top-2.5 right-5 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {tool.badge}
                </span>
              )}
              <div className="flex items-start justify-between">
                <span className="text-3xl">{tool.icon}</span>
              </div>
              <h3
                className="mt-4 text-lg font-semibold tracking-tight transition-colors group-hover:text-[#0d4f3c]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tool.title}
              </h3>
              <p
                className="mt-2 text-[13px] leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                {tool.description}
              </p>
              <div
                className="mt-auto flex items-center gap-1 pt-4 text-xs font-semibold uppercase tracking-wider opacity-0 transition-all duration-300 group-hover:opacity-100"
                style={{ color: "var(--primary)" }}
              >
                Utiliser
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial guide */}
      {content?.guide && (
        <section className="py-12" style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)" }}>
          <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Guide : tout savoir sur les outils{" "}
                <span style={{ color: "var(--primary)" }}>{(category?.name ?? slug).toLowerCase()}</span>
              </h2>
              <div
                className="mt-6 space-y-4 text-[15px] leading-[1.8]"
                style={{ color: "var(--foreground)" }}
              >
                {content.guide.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {content?.faqItems && content.faqItems.length > 0 && (
        <section className="py-12" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Questions frequentes
              </h2>
              <div className="mt-6 space-y-6">
                {content.faqItems.map((faq, i) => (
                  <div key={i} className="rounded-xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                      {faq.question}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other categories */}
      <section
        className="border-t py-12"
        style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
      >
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h2
            className="text-2xl tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Autres categories
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="rounded-full border px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                {c.name}
                <span
                  className="ml-1.5 text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  {c.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* JSON-LD with FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Outils ${category?.name ?? slug} - Outilis.fr`,
            description: content?.intro ?? `${categoryTools.length} outils ${(category?.name ?? slug).toLowerCase()} gratuits en ligne`,
            url: `https://outilis.fr/categories/${slug}`,
            isPartOf: {
              "@type": "WebSite",
              name: "Outilis.fr",
              url: "https://outilis.fr",
            },
            numberOfItems: categoryTools.length,
          }),
        }}
      />
      {content?.faqItems && content.faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: content.faqItems.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}
    </>
  );
}
