import Link from "next/link";

const TOOL_LINKS = [
  { href: "/outils/calculateur-salaire", label: "Calculateur salaire" },
  { href: "/outils/calculateur-pret-immobilier", label: "Simulateur pret" },
  { href: "/outils/generateur-facture", label: "Generateur factures" },
  { href: "/outils/generateur-qr-code", label: "QR Code" },
  { href: "/outils/generateur-mot-de-passe", label: "Mots de passe" },
  { href: "/outils/compteur-mots", label: "Compteur de mots" },
  { href: "/outils/convertisseur-json-csv", label: "JSON / CSV" },
];

const CATEGORY_LINKS = [
  { href: "/categories/finance", label: "Finance" },
  { href: "/categories/immobilier", label: "Immobilier" },
  { href: "/categories/business", label: "Business" },
  { href: "/categories/dev", label: "Dev" },
  { href: "/categories/image", label: "Image" },
  { href: "/categories/outils", label: "Outils" },
  { href: "/categories/sante", label: "Sante" },
  { href: "/categories/securite", label: "Securite" },
  { href: "/categories/conversion", label: "Conversion" },
];

export default function Footer() {
  return (
    <footer className="relative" style={{ background: "var(--surface-alt)" }}>
      {/* Decorative top border */}
      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, var(--border), var(--accent)30, var(--border), transparent)" }} />

      <div className="mx-auto max-w-7xl px-6 py-16 2xl:max-w-[1400px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-baseline gap-0.5">
              <span
                className="text-3xl tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
              >
                Outilis
              </span>
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--accent)" }}>
                .fr
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Des outils en ligne penses pour simplifier votre quotidien.
              Rapides, gratuits, sans inscription. Vos donnees restent sur votre navigateur.
            </p>
            {/* Mini trust badges */}
            <div className="mt-5 flex gap-3">
              {[
                { icon: "\u{1F512}", label: "100% local" },
                { icon: "\u{26A1}", label: "Instantane" },
              ].map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium"
                  style={{ borderColor: "var(--border)", color: "var(--muted)", background: "var(--surface)" }}
                >
                  <span className="text-xs">{badge.icon}</span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="md:col-span-2">
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--muted)" }}
            >
              Nos outils
            </h4>
            <ul className="mt-4 space-y-2.5">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4"
                    style={{ color: "var(--foreground)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--muted)" }}
            >
              Categories
            </h4>
            <ul className="mt-4 space-y-2.5">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4"
                    style={{ color: "var(--foreground)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="md:col-span-3">
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--muted)" }}
            >
              A propos
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm" style={{ color: "var(--muted)" }}>
              <li><Link href="/comment-ca-marche" className="transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4" style={{ color: "var(--foreground)" }}>Comment ca marche</Link></li>
              <li><Link href="/contribuer" className="transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4" style={{ color: "var(--foreground)" }}>Contribuer</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4" style={{ color: "var(--foreground)" }}>Blog</Link></li>
              <li>100% gratuit</li>
              <li>Aucune donnee collectee</li>
              <li>
                <a
                  href="https://github.com/ghota-tech-solutions-sass/outilio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4"
                  style={{ color: "var(--foreground)" }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Code source sur GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 flex flex-col items-center justify-between gap-4 pt-8 text-xs sm:flex-row"
          style={{ borderTop: "1px solid var(--border)", color: "var(--muted)" }}
        >
          <span>&copy; {new Date().getFullYear()} Outilis.fr &mdash; <Link href="/mentions-legales" className="underline underline-offset-2 hover:text-[var(--foreground)]">Mentions legales</Link></span>
          <span>Fait avec soin en France par <a href="https://ghotatechsolutions.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--foreground)]">Ghota Tech Solutions</a></span>
        </div>
      </div>
    </footer>
  );
}
