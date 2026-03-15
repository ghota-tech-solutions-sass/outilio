import Link from "next/link";

const STEPS = [
  {
    num: "01",
    title: "Vous ouvrez un outil",
    description: "Choisissez parmi nos 50+ outils gratuits. La page se charge instantanement depuis le CDN mondial de GitHub.",
    icon: "\u{1F310}",
    detail: "Les pages sont pre-generees en HTML statique. Aucun serveur n'est sollicite pour generer le contenu.",
  },
  {
    num: "02",
    title: "Vous entrez vos donnees",
    description: "Tapez vos chiffres, collez votre texte, ajustez les parametres. Tout se passe dans votre navigateur.",
    icon: "\u{1F4BB}",
    detail: "JavaScript s'execute localement sur votre appareil. Vos donnees ne quittent jamais votre navigateur.",
  },
  {
    num: "03",
    title: "Le calcul se fait instantanement",
    description: "Les resultats apparaissent en temps reel pendant que vous tapez. Pas d'attente, pas de chargement.",
    icon: "\u{26A1}",
    detail: "Tout est calcule par le processeur de votre appareil. Meme sans connexion internet, les outils continueraient a fonctionner.",
  },
  {
    num: "04",
    title: "Vous repartez. Rien n'est stocke",
    description: "Fermez l'onglet et tout disparait. Aucune donnee n'est sauvegardee, nulle part, par personne.",
    icon: "\u{1F512}",
    detail: "Pas de cookies de tracking, pas de compte utilisateur, pas de base de donnees. Zero trace de votre passage.",
  },
];

const COMPARISONS = [
  { feature: "Traitement des donnees", us: "Dans votre navigateur", others: "Sur leurs serveurs" },
  { feature: "Inscription requise", us: "Non", others: "Souvent oui" },
  { feature: "Donnees stockees", us: "Jamais", others: "Oui (cloud)" },
  { feature: "Cookies de tracking", us: "Aucun", others: "Multiples" },
  { feature: "Code source", us: "Open source (MIT)", others: "Ferme" },
  { feature: "Prix", us: "Gratuit pour toujours", others: "Freemium / Ads" },
  { feature: "Vitesse", us: "Instantanee (local)", others: "Depend du serveur" },
];

export default function CommentCaMarche() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-3xl px-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
            style={{ color: "var(--primary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Retour
          </Link>
          <h1
            className="mt-6 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Comment ca <span style={{ color: "var(--primary)" }}>marche</span> ?
          </h1>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            Outilis.fr est different. Vos donnees ne quittent <strong style={{ color: "var(--foreground)" }}>jamais</strong> votre appareil.
            Voici pourquoi et comment.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5">
          <div className="space-y-8">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="relative rounded-2xl border p-8"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
                    style={{ background: "var(--primary)" }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{step.icon}</span>
                      <h2 className="text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                        {step.title}
                      </h2>
                    </div>
                    <p className="mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                      {step.description}
                    </p>
                    <p className="mt-3 rounded-xl px-4 py-3 text-sm" style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>
                      <strong style={{ color: "var(--primary)" }}>Techniquement :</strong> {step.detail}
                    </p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="absolute -bottom-5 left-11 h-5 w-0.5" style={{ background: "var(--border)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t py-16" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
        <div className="mx-auto max-w-3xl px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Comparaison
          </p>
          <h2 className="mt-2 text-3xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Outilis vs. les autres
          </h2>

          <div className="mt-8 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--primary)" }}>
                  <th className="px-5 py-3 text-left font-medium text-white/70">Critere</th>
                  <th className="px-5 py-3 text-center font-semibold text-white">Outilis.fr</th>
                  <th className="px-5 py-3 text-center font-medium text-white/70">Autres sites</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISONS.map((row, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                    <td className="px-5 py-3 font-medium">{row.feature}</td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold" style={{ color: "var(--primary)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        {row.us}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center" style={{ color: "var(--muted)" }}>{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="border-t py-16" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-3xl px-5">
          <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: "var(--surface-alt)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--foreground)">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  100% Open Source
                </h2>
                <p className="mt-2 leading-relaxed" style={{ color: "var(--muted)" }}>
                  Le code source complet d&apos;Outilis.fr est disponible sur GitHub sous licence MIT.
                  Vous pouvez inspecter chaque ligne de code, verifier qu&apos;aucune donnee n&apos;est transmise,
                  et meme contribuer au projet.
                </p>
                <a
                  href="https://github.com/ghota-tech-solutions-sass/outilio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  Voir le code sur GitHub
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="text-3xl tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            Convaincu ?
          </h2>
          <p className="mt-3 text-sm text-white/70">
            Essayez nos outils maintenant. Gratuit, sans inscription, sans cookies.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ color: "var(--primary)" }}
          >
            Decouvrir les 50+ outils
          </a>
        </div>
      </section>
    </>
  );
}
