import { tools } from "@/data/tools";
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

  return {
    title: `Outils ${name} gratuits en ligne (${count} outils)`,
    description: `Decouvrez nos ${count} outils ${name.toLowerCase()} gratuits : calculateurs, simulateurs et generateurs. 100% en ligne, sans inscription.`,
    keywords: [
      `outils ${name.toLowerCase()}`,
      `${name.toLowerCase()} en ligne`,
      `calculateur ${name.toLowerCase()}`,
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
            Outils{" "}
            <span style={{ color: "var(--primary)" }}>
              {category?.name ?? slug}
            </span>
          </h1>
          <p
            className="mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            {categoryTools.length} outil{categoryTools.length > 1 ? "s" : ""}{" "}
            gratuit{categoryTools.length > 1 ? "s" : ""} dans cette categorie.
            100% en ligne, aucune inscription requise.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
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
              <h2
                className="mt-4 text-lg font-semibold tracking-tight transition-colors group-hover:text-[#0d4f3c]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {tool.title}
              </h2>
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

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Outils ${category?.name ?? slug} - Outilis.fr`,
            description: `${categoryTools.length} outils ${(category?.name ?? slug).toLowerCase()} gratuits en ligne`,
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
    </>
  );
}
