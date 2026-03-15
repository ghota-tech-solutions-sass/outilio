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

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <span
              className="text-3xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Outilis
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Des outils en ligne penses pour simplifier votre quotidien.
              Rapides, gratuits, sans inscription. Vos donnees restent sur votre navigateur.
            </p>
          </div>

          {/* Tools */}
          <div className="md:col-span-4">
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--muted)" }}
            >
              Nos outils
            </h4>
            <ul className="mt-4 space-y-2.5">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:underline underline-offset-4"
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
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--muted)" }}
            >
              A propos
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm" style={{ color: "var(--muted)" }}>
              <li>100% gratuit</li>
              <li>Aucune donnee collectee</li>
              <li>
                <a
                  href="https://github.com/ghota-tech-solutions-sass/outilio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 transition-colors hover:underline underline-offset-4"
                  style={{ color: "var(--foreground)" }}
                >
                  <svg
                    width="16"
                    height="16"
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
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <span>&copy; {new Date().getFullYear()} Outilis.fr</span>
          <span>Fait avec soin en France</span>
        </div>
      </div>
    </footer>
  );
}
