import Link from "next/link";

export default function MentionsLegales() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
          style={{ color: "var(--primary)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Retour a l&apos;accueil
        </Link>

        <h1
          className="mt-6 text-4xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mentions legales
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          <Section title="1. Editeur du site">
            <p>Le site <strong className="text-[var(--foreground)]">outilis.fr</strong> est edite par :</p>
            <ul className="mt-3 space-y-1">
              <li><strong className="text-[var(--foreground)]">Ghota Tech Solutions (GTS)</strong></li>
              <li>Forme juridique : Entreprise Unipersonnelle a Responsabilite Limitee (EURL)</li>
              <li>Gerant : Mickael Villers</li>
              <li>SIREN : 988 597 209</li>
              <li>SIRET : 988 597 209 00010</li>
              <li>Adresse : 268 rue Paul Bert, 69003 Lyon, France</li>
              <li>Telephone : +33 6 37 83 58 81</li>
              <li>Email : contact@ghotatechsolutions.com</li>
            </ul>
          </Section>

          <Section title="2. Hebergement">
            <p>Le site est heberge par :</p>
            <ul className="mt-3 space-y-1">
              <li><strong className="text-[var(--foreground)]">GitHub, Inc.</strong></li>
              <li>88 Colin P Kelly Jr St, San Francisco, CA 94107, USA</li>
              <li>Service : GitHub Pages</li>
            </ul>
            <p className="mt-3">
              Le code source du site est disponible en open source sur{" "}
              <a href="https://github.com/ghota-tech-solutions-sass/outilio" className="font-medium underline underline-offset-2" style={{ color: "var(--primary)" }}>
                GitHub
              </a>.
            </p>
          </Section>

          <Section title="3. Propriete intellectuelle">
            <p>
              Le code source d&apos;Outilis.fr est distribue sous licence MIT.
              Le contenu editorial (textes, descriptions, contenu SEO) est la propriete
              de Ghota Tech Solutions. Toute reproduction sans autorisation est interdite.
            </p>
          </Section>

          <Section title="4. Protection des donnees personnelles">
            <div className="mt-3 rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
              <p className="font-semibold text-[var(--foreground)]">
                Outilis.fr ne collecte aucune donnee personnelle.
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d4f3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Tous les calculs et traitements sont effectues <strong className="text-[var(--foreground)]">100% dans votre navigateur</strong>. Aucune donnee n&apos;est envoyee a un serveur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d4f3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Aucun cookie de tracking n&apos;est utilise pour identifier les visiteurs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d4f3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Aucune inscription n&apos;est requise pour utiliser les outils.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d4f3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Aucune donnee n&apos;est vendue, partagee ou transmise a des tiers.</span>
                </li>
              </ul>
            </div>
            <p className="mt-3">
              Le site utilise Google Analytics (GA4) a des fins statistiques uniquement,
              pour mesurer l&apos;audience globale (nombre de pages vues, pays d&apos;origine).
              Ces donnees sont anonymisees et ne permettent pas d&apos;identifier les visiteurs.
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>
              Outilis.fr n&apos;utilise pas de cookies propres. Google Analytics peut deposer
              un cookie de mesure d&apos;audience. Vous pouvez desactiver les cookies dans
              les parametres de votre navigateur a tout moment.
            </p>
          </Section>

          <Section title="6. Limitation de responsabilite">
            <p>
              Les outils et calculateurs proposes sur Outilis.fr sont fournis a titre
              indicatif uniquement. Les resultats ne constituent pas des conseils financiers,
              juridiques, medicaux ou professionnels. L&apos;editeur ne saurait etre tenu
              responsable de l&apos;utilisation des resultats fournis par les outils.
            </p>
          </Section>

          <Section title="7. Contact">
            <p>
              Pour toute question relative au site, contactez-nous a :{" "}
              <a href="mailto:contact@ghotatechsolutions.com" className="font-medium underline underline-offset-2" style={{ color: "var(--primary)" }}>
                contact@ghotatechsolutions.com
              </a>
            </p>
          </Section>

          <p className="pt-4 text-xs" style={{ color: "var(--border)" }}>
            Derniere mise a jour : 15 mars 2026
          </p>
        </div>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <h2 className="text-lg font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
