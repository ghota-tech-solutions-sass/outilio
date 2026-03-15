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
              Outilio
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
              <li>Open source</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row"
          style={{ borderColor: "var(--border)", color: "var(--muted)" }}
        >
          <span>&copy; {new Date().getFullYear()} Outilio.fr</span>
          <span>Fait avec soin en France</span>
        </div>
      </div>
    </footer>
  );
}
