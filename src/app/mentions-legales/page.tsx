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
          Retour à l&apos;accueil
        </Link>

        <h1
          className="mt-6 text-4xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mentions légales
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          <Section title="1. Éditeur du site">
            <p>Le site <strong className="text-[var(--foreground)]">outilis.fr</strong> est édité par :</p>
            <ul className="mt-3 space-y-1">
              <li><strong className="text-[var(--foreground)]">Ghota Tech Solutions (GTS)</strong></li>
              <li>Forme juridique : Entreprise unipersonnelle à responsabilité limitée (EURL)</li>
              <li>Gérant : Mickael Villers</li>
              <li>SIREN : 988 597 209</li>
              <li>SIRET : 988 597 209 00010</li>
              <li>Adresse : 268 rue Paul Bert, 69003 Lyon, France</li>
              <li>Téléphone : +33 6 37 83 58 81</li>
              <li>Email : contact@ghotatechsolutions.com</li>
            </ul>
          </Section>

          <Section title="2. Hébergement">
            <p>Le site est hébergé par :</p>
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

          <Section title="3. Propriété intellectuelle">
            <p>
              Le code source d&apos;Outilis.fr est distribué sous licence MIT.
              Le contenu éditorial (textes, descriptions, contenu SEO) est la propriété
              de Ghota Tech Solutions. Toute reproduction sans autorisation est interdite.
            </p>
          </Section>

          <Section title="4. Protection des données personnelles">
            <div className="mt-3 rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
              <p className="font-semibold text-[var(--foreground)]">
                Les outils d&apos;Outilis.fr ne collectent pas les données que vous y saisissez.
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d4f3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Tous les calculs et traitements sont effectués <strong className="text-[var(--foreground)]">100% dans votre navigateur</strong>. Aucune valeur saisie n&apos;est envoyée à un serveur.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d4f3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Les valeurs saisies dans les outils (salaires, textes, fichiers...) ne quittent jamais votre appareil.</span>
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
                  <span>Les données saisies dans les outils ne sont ni vendues, ni partagées, ni transmises à des tiers.</span>
                </li>
              </ul>
            </div>
            <p className="mt-3">
              Le site utilise Google Analytics (GA4) pour mesurer l&apos;audience globale (nombre de pages vues,
              pays d&apos;origine) ainsi que des événements d&apos;usage anonymes (outil consulté, recherche,
              ajout aux favoris), et Google AdSense pour afficher des annonces. Ces services de Google
              peuvent déposer des cookies sur votre navigateur. Ils ne reçoivent jamais les valeurs
              saisies dans les outils.
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>
              Outilis.fr n&apos;utilise pas de cookies propres. Google Analytics (mesure
              d&apos;audience) et Google AdSense (publicité) peuvent déposer des cookies. Vous
              pouvez désactiver les cookies dans les paramètres de votre navigateur à tout moment.
            </p>
          </Section>

          <Section title="6. Liens partenaires">
            <p>
              Certaines pages peuvent proposer des liens vers des services partenaires
              (courtiers, banques, assurances, services aux entreprises, artisans). Ces liens
              sont signalés comme « liens partenaires » : si vous souscrivez via l&apos;un
              d&apos;eux, Outilis.fr peut percevoir une commission, sans surcoût pour vous. Les
              résultats des outils ne dépendent jamais de ces partenariats.
            </p>
          </Section>

          <Section title="7. Limitation de responsabilité">
            <p>
              Les outils et calculateurs proposés sur Outilis.fr sont fournis à titre
              indicatif uniquement. Les résultats ne constituent pas des conseils financiers,
              juridiques, médicaux ou professionnels. L&apos;éditeur ne saurait être tenu
              responsable de l&apos;utilisation des résultats fournis par les outils.
            </p>
          </Section>

          <Section title="8. Contact">
            <p>
              Pour toute question relative au site, contactez-nous à :{" "}
              <a href="mailto:contact@ghotatechsolutions.com" className="font-medium underline underline-offset-2" style={{ color: "var(--primary)" }}>
                contact@ghotatechsolutions.com
              </a>
            </p>
          </Section>

          <p className="pt-4 text-xs" style={{ color: "var(--border)" }}>
            Dernière mise à jour : 23 septembre 2026
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
