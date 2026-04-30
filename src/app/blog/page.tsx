import Link from "next/link";

const ARTICLES = [
  {
    slug: "rachat-credit-immo-2026",
    title: "Rachat de credit immo 2026 : quand ca vaut vraiment le coup ?",
    description:
      "Ecart de taux minimum, frais a anticiper, delai d&apos;amortissement, exemple chiffre. Tous les criteres pour decider de racheter ou non.",
    date: "28 avril 2026",
    category: "Finance",
    readTime: "6 min",
  },
  {
    slug: "dpe-f-g-logement-energivore",
    title: "DPE F ou G : que faire avec un logement energivore en 2026",
    description:
      "Calendrier des interdictions, decote 15-20 % a la revente, MaPrimeRenov, travaux prioritaires. Le guide pour decider en 2026.",
    date: "22 avril 2026",
    category: "Immobilier",
    readTime: "7 min",
  },
  {
    slug: "ptz-2026-nouveautes",
    title: "PTZ 2026 : ce qui a change avec le nouveau dispositif elargi",
    description:
      "Le Pret a Taux Zero 2026 etendu a toute la France. Quotites 50 % en collectif neuf, plafonds revalorises, exemple chiffre Lyon : tout savoir.",
    date: "15 avril 2026",
    category: "Immobilier",
    readTime: "6 min",
  },
  {
    slug: "guide-immobilier-2026",
    title: "Guide complet achat immobilier 2026 : pret, frais de notaire, PTZ et rentabilite",
    description:
      "Taux 2026, frais de notaire par departement, PTZ reforme, rentabilite locative, DPE et plus-value. Le guide complet pour votre projet immobilier.",
    date: "27 mars 2026",
    category: "Immobilier",
    readTime: "7 min",
  },
  {
    slug: "guide-freelance-2026",
    title: "Devenir freelance en 2026 : TJM, charges, statut et outils",
    description:
      "Calcul du TJM ideal, comparaison micro vs SASU, charges sociales, facturation conforme et mentions legales. Tout pour lancer votre activite.",
    date: "24 mars 2026",
    category: "Business",
    readTime: "7 min",
  },
  {
    slug: "guide-creation-entreprise-2026",
    title: "Creer son entreprise en 2026 : micro, EURL, SASU — le comparatif",
    description:
      "Cotisations, IS vs IR, obligations LCEN/RGPD, facturation electronique, calcul de marge. Comparatif complet des statuts pour entrepreneurs.",
    date: "20 mars 2026",
    category: "Business",
    readTime: "7 min",
  },
  {
    slug: "guide-impots-revenus-2026",
    title: "Tout comprendre sur l'impot sur le revenu 2026",
    description:
      "Bareme progressif, quotient familial, prelevement a la source, flat tax, prime d'activite. 5 astuces legales pour optimiser votre impot.",
    date: "17 mars 2026",
    category: "Finance",
    readTime: "6 min",
  },
  {
    slug: "guide-epargne-investissement-2026",
    title: "Epargne et investissement en 2026 : simuler, comparer, optimiser",
    description:
      "Interets composes, inflation, flat tax crypto, rentabilite locative, succession. Strategies d'epargne pour tous les profils.",
    date: "13 mars 2026",
    category: "Finance",
    readTime: "6 min",
  },
  {
    slug: "guide-budget-quotidien",
    title: "Gerer son budget au quotidien : les outils essentiels",
    description:
      "Salaire net, TVA, remises, pourboire, partage de frais, budget carburant, frais kilometriques. Tous les calculs du quotidien au meme endroit.",
    date: "10 mars 2026",
    category: "Finance",
    readTime: "6 min",
  },
  {
    slug: "guide-outils-developpeur",
    title: "10 outils indispensables pour les developpeurs web",
    description:
      "JSON, regex, base64, PX/REM, couleurs, slug, gradients CSS, markdown, comparateur de texte. Des outils dev gratuits directement dans le navigateur.",
    date: "6 mars 2026",
    category: "Dev",
    readTime: "5 min",
  },
  {
    slug: "guide-sante-bien-etre",
    title: "Sante et bien-etre : calculateurs pour suivre vos objectifs",
    description:
      "IMC, calories, TDEE, grossesse, alcoolemie. Des outils de sante bases sur les formules et seuils officiels (OMS, Mifflin-St Jeor, Widmark).",
    date: "3 mars 2026",
    category: "Sante",
    readTime: "5 min",
  },
  {
    slug: "guide-outils-image-video",
    title: "Retouche photo, compression et montage video gratuits",
    description:
      "Compresser, redimensionner, convertir vos images. Couper, compresser vos videos. Extraire l'audio. Tout sans logiciel, 100% dans le navigateur.",
    date: "27 fevrier 2026",
    category: "Multimedia",
    readTime: "5 min",
  },
  {
    slug: "guide-securite-numerique",
    title: "Securite numerique : proteger ses comptes et donnees en ligne",
    description:
      "Mots de passe forts, entropie, gestionnaires, WiFi securise, recommandations ANSSI 2026 et bonnes pratiques pour le quotidien.",
    date: "24 fevrier 2026",
    category: "Securite",
    readTime: "5 min",
  },
  {
    slug: "simulateur-apl-2026",
    title: "APL 2026 : comment estimer vos aides au logement",
    description:
      "Baremes 2026, plafonds par zone, calcul en temps reel et exemple concret pour un etudiant a Lyon. Tout comprendre pour estimer vos APL.",
    date: "20 fevrier 2026",
    category: "Logement",
    readTime: "5 min",
  },
  {
    slug: "simulateur-auto-entrepreneur-2026",
    title: "Auto-entrepreneur 2026 : charges, plafonds et revenu net",
    description:
      "Plafonds CA, taux de cotisations, versement liberatoire, ACRE : tout savoir pour calculer votre revenu net en micro-entreprise en 2026.",
    date: "17 fevrier 2026",
    category: "Business",
    readTime: "6 min",
  },
  {
    slug: "simulateur-impot-societes-2026",
    title: "Simulateur IS 2026 : calculer l'impot sur les societes",
    description:
      "Bareme IS 2026, taux reduit PME a 15 %, taux normal a 25 %, acomptes trimestriels et comparaison IS vs IR. Exemple concret avec 80 000 euros de benefice.",
    date: "13 fevrier 2026",
    category: "Fiscalite",
    readTime: "5 min",
  },
  {
    slug: "calculer-salaire-net-2026",
    title: "Comment calculer son salaire net en 2026",
    description:
      "Bareme 2026, charges salariales, CSG/CRDS : tout comprendre pour convertir votre salaire brut en net avec un exemple concret a 3 000 euros brut.",
    date: "10 fevrier 2026",
    category: "Finance",
    readTime: "4 min",
  },
  {
    slug: "freelance-sasu-micro-2026",
    title: "SASU vs Micro-entreprise en 2026 : quel statut choisir ?",
    description:
      "Cotisations, dividendes, flat tax, taxe PUMa : comparatif complet des deux statuts les plus populaires pour se lancer en freelance en 2026.",
    date: "6 fevrier 2026",
    category: "Business",
    readTime: "5 min",
  },
  {
    slug: "declaration-impots-2026",
    title: "Declaration impots 2026 : dates, bareme et nouveautes",
    description:
      "Calendrier fiscal, nouveau bareme IR, quotient familial et nouveautes de la loi de finances 2026. Tout ce qu'il faut savoir avant de declarer.",
    date: "3 fevrier 2026",
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
