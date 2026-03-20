import Link from "next/link";

const ARTICLES = [
  {
    slug: "simulateur-auto-entrepreneur-2026",
    title: "Auto-entrepreneur 2026 : charges, plafonds et revenu net",
    description:
      "Plafonds CA, taux de cotisations, versement liberatoire, ACRE : tout savoir pour calculer votre revenu net en micro-entreprise en 2026.",
    date: "20 mars 2026",
    category: "Business",
    readTime: "6 min",
  },
  {
    slug: "simulateur-impot-societes-2026",
    title: "Simulateur IS 2026 : calculer l'impot sur les societes",
    description:
      "Bareme IS 2026, taux reduit PME a 15 %, taux normal a 25 %, acomptes trimestriels et comparaison IS vs IR. Exemple concret avec 80 000 euros de benefice.",
    date: "20 mars 2026",
    category: "Fiscalite",
    readTime: "5 min",
  },
  {
    slug: "calculer-salaire-net-2026",
    title: "Comment calculer son salaire net en 2026",
    description:
      "Bareme 2026, charges salariales, CSG/CRDS : tout comprendre pour convertir votre salaire brut en net avec un exemple concret a 3 000 euros brut.",
    date: "18 mars 2026",
    category: "Finance",
    readTime: "4 min",
  },
  {
    slug: "freelance-sasu-micro-2026",
    title: "SASU vs Micro-entreprise en 2026 : quel statut choisir ?",
    description:
      "Cotisations, dividendes, flat tax, taxe PUMa : comparatif complet des deux statuts les plus populaires pour se lancer en freelance en 2026.",
    date: "18 mars 2026",
    category: "Business",
    readTime: "5 min",
  },
  {
    slug: "declaration-impots-2026",
    title: "Declaration impots 2026 : dates, bareme et nouveautes",
    description:
      "Calendrier fiscal, nouveau bareme IR, quotient familial et nouveautes de la loi de finances 2026. Tout ce qu'il faut savoir avant de declarer.",
    date: "18 mars 2026",
    category: "Finance",
    readTime: "5 min",
  },
];

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
            Des articles pratiques sur la finance, la fiscalite et les outils du
            quotidien pour vous aider a prendre les bonnes decisions.
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
                className={`group flex flex-col rounded-2xl border p-6 transition-all hover:shadow-lg hover:border-[#0d4f3c]/20 animate-fade-up stagger-${i + 1}`}
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
                    {article.date}
                  </span>
                  <span
                    className="text-xs font-semibold transition-colors group-hover:text-[#0d4f3c]"
                    style={{ color: "var(--accent)" }}
                  >
                    Lire l&apos;article &rarr;
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
