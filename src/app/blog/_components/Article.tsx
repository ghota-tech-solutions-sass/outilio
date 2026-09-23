import Link from "next/link";
import type { ReactNode } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import { BLOG_AUTHOR, formatDateFr, getArticle } from "../_data/articles";

const BASE_URL = "https://outilis.fr";

export type Source = { label: string; url: string };

type ShellProps = {
  slug: string;
  /** Libellé court du fil d'Ariane (par défaut : titre de l'article). */
  breadcrumb?: string;
  /** Chapô affiché sous le titre. */
  lead?: ReactNode;
  sources: Source[];
  cta?: { text: string; label: string; href: string };
  children: ReactNode;
};

/** Gabarit commun des articles : en-tête, byline, corps, sources, articles liés, JSON-LD. */
export function ArticleShell({ slug, breadcrumb, lead, sources, cta, children }: ShellProps) {
  const article = getArticle(slug);
  const url = `${BASE_URL}/blog/${slug}`;
  const related = article.related
    .map((s) => {
      try {
        return getArticle(s);
      } catch {
        return null;
      }
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: article.title,
        description: article.description,
        inLanguage: "fr-FR",
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        mainEntityOfPage: url,
        url,
        image: `${BASE_URL}/og-image.png`,
        author: { "@type": "Person", name: BLOG_AUTHOR.name, url: BLOG_AUTHOR.url },
        publisher: { "@id": `${BASE_URL}/#organization` },
        keywords: article.keywords.join(", "),
        articleSection: article.category,
        citation: sources.map((s) => s.url),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <nav className="mb-6 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }} aria-label="Fil d’Ariane">
            <Link href="/blog" className="transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4">
              Blog
            </Link>
            <span>&rsaquo;</span>
            <span style={{ color: "var(--foreground)" }}>{breadcrumb ?? article.title}</span>
          </nav>

          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            {article.category}
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 max-w-4xl text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {article.title}
          </h1>
          {lead && (
            <p className="animate-fade-up stagger-2 mt-4 max-w-3xl text-base leading-relaxed" style={{ color: "var(--muted)" }}>
              {lead}
            </p>
          )}
          <div
            className="animate-fade-up stagger-2 mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>
              Par <span style={{ color: "var(--foreground)" }}>{BLOG_AUTHOR.name}</span>
            </span>
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--border)" }} />
            <span>
              Publié le <time dateTime={article.datePublished}>{formatDateFr(article.datePublished)}</time>
            </span>
            {article.dateModified !== article.datePublished && (
              <>
                <span className="h-1 w-1 rounded-full" style={{ background: "var(--border)" }} />
                <span>
                  Mis à jour le <time dateTime={article.dateModified}>{formatDateFr(article.dateModified)}</time>
                </span>
              </>
            )}
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--border)" }} />
            <span>{article.readTime} de lecture</span>
          </div>
        </div>
      </section>

      <article className="py-12">
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
            <div className="min-w-0 space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
              {children}

              {cta && (
                <div
                  className="!mt-10 rounded-2xl border p-8 text-center"
                  style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
                >
                  <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                    {cta.text}
                  </p>
                  <Link
                    href={cta.href}
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
                  >
                    {cta.label}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}

              <section className="!mt-10 rounded-2xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                <h2 className="text-lg tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  Sources
                </h2>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Chiffres vérifiés le {formatDateFr(article.dateModified)} sur les sites officiels. Ils peuvent évoluer :
                  en cas de doute, la source officielle fait foi. Cet article est informatif et ne remplace pas un
                  conseil personnalisé (expert-comptable, notaire, conseiller en gestion de patrimoine).
                </p>
                <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm">
                  {sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 transition-colors hover:text-[#0d4f3c]"
                        style={{ color: "var(--primary)" }}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              {related.length > 0 && (
                <section className="!mt-10">
                  <h2 className="text-lg tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    À lire aussi
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/blog/${r.slug}`}
                        className="group rounded-xl border p-4 transition-all hover:shadow-md"
                        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--accent)" }}>
                          {r.category}
                        </span>
                        <span className="mt-1 block text-sm font-semibold leading-snug group-hover:text-[#0d4f3c]">{r.title}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

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
            <aside className="hidden lg:block">
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

/* ─── Briques de mise en forme ─── */

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="!mt-10 scroll-mt-24 text-2xl tracking-tight"
      style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="!mt-7 text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
      {children}
    </h3>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6">{children}</ul>;
}

export function OL({ children }: { children: ReactNode }) {
  return <ol className="list-decimal space-y-2 pl-6">{children}</ol>;
}

/** Lien interne vers un outil ou un article. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium underline underline-offset-4 transition-colors hover:text-[#0d4f3c]"
      style={{ color: "var(--primary)" }}
    >
      {children}
    </Link>
  );
}

/** Encadré (exemple chiffré, point d'attention…). */
export function Box({
  title,
  tone = "neutral",
  children,
}: {
  title?: string;
  tone?: "neutral" | "warning" | "tip";
  children: ReactNode;
}) {
  const border = tone === "warning" ? "var(--accent)" : tone === "tip" ? "var(--primary-light)" : "var(--border)";
  return (
    <div
      className="rounded-2xl border p-6 text-sm"
      style={{ background: "var(--surface-alt)", borderColor: border, borderLeftWidth: tone === "neutral" ? 1 : 4 }}
    >
      {title && (
        <p className="mb-3 text-base font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
          {title}
        </p>
      )}
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/** Tableau de données. `align` : colonnes numériques alignées à droite à partir de l'index donné. */
export function Table({
  head,
  rows,
  caption,
  numericFrom = 1,
  highlightLast = false,
}: {
  head: string[];
  rows: ReactNode[][];
  caption?: string;
  numericFrom?: number;
  highlightLast?: boolean;
}) {
  return (
    <figure className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr style={{ background: "var(--surface-alt)" }}>
            {head.map((h, i) => (
              <th
                key={i}
                scope="col"
                className={`px-4 py-3 font-semibold ${i >= numericFrom ? "text-right" : "text-left"}`}
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => {
            const last = highlightLast && r === rows.length - 1;
            return (
              <tr
                key={r}
                style={{
                  background: last ? "rgba(13,79,60,0.06)" : "var(--surface)",
                  borderTop: r > 0 ? "1px solid var(--border)" : undefined,
                  fontWeight: last ? 600 : undefined,
                }}
              >
                {row.map((cell, c) => (
                  <td key={c} className={`px-4 py-2.5 align-top ${c >= numericFrom ? "text-right tabular-nums" : "text-left"}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {caption && (
        <figcaption className="px-4 py-2 text-xs" style={{ color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Sommaire cliquable. */
export function Toc({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav className="rounded-2xl border p-5 text-sm" style={{ borderColor: "var(--border)", background: "var(--surface)" }} aria-label="Sommaire">
      <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
        Sommaire
      </p>
      <ol className="mt-3 list-decimal space-y-1 pl-5">
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="underline-offset-4 hover:underline" style={{ color: "var(--primary)" }}>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
