import Link from "next/link";
import { formatDateFr, sortedArticles } from "./_data/articles";

const ARTICLES = sortedArticles();

export default function BlogIndex() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-14"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Blog
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Guides et <span style={{ color: "var(--primary)" }}>astuces</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Des guides chiffrés et sourcés sur l’immobilier, la fiscalité, l’épargne et
            la création d’entreprise, mis à jour avec les règles 2026, pour prendre vos
            décisions avec les bons calculs.
          </p>
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article, i) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`group flex flex-col rounded-2xl border p-6 transition-all hover:shadow-lg hover:border-[#0d4f3c]/20 animate-fade-up stagger-${Math.min(i + 1, 7)}`}
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              >
                {/* Category & read time */}
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em]"
                    style={{
                      background: "var(--primary)",
                      color: "#ffffff",
                    }}
                  >
                    {article.category}
                  </span>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    {article.readTime} de lecture
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="mt-4 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-[#0d4f3c]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {article.title}
                </h2>

                {/* Description */}
                <p
                  className="mt-2 flex-1 text-sm leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {article.description}
                </p>

                {/* Footer */}
                <div
                  className="mt-5 flex items-center justify-between border-t pt-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--muted)" }}
                  >
                    {article.dateModified !== article.datePublished
                      ? `Mis à jour le ${formatDateFr(article.dateModified)}`
                      : formatDateFr(article.datePublished)}
                  </span>
                  <span
                    className="text-xs font-semibold transition-colors group-hover:text-[#0d4f3c]"
                    style={{ color: "var(--accent)" }}
                  >
                    Lire l’article &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
