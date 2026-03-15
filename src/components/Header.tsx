"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/outils/calculateur-salaire", label: "Salaire" },
  { href: "/outils/calculateur-pret-immobilier", label: "Pret immo" },
  { href: "/outils/generateur-facture", label: "Factures" },
  { href: "/outils/generateur-qr-code", label: "QR Code" },
  { href: "/outils/generateur-mot-de-passe", label: "Securite" },
  { href: "/outils/compteur-mots", label: "Texte" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-[#faf9f6]/80 backdrop-blur-md" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-1 transition-opacity hover:opacity-70">
          <span
            className="text-2xl tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
          >
            Outilio
          </span>
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "var(--muted)" }}>
            .fr
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all hover:bg-[#0d4f3c]/5"
              style={{ color: "var(--foreground)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-1 p-2 md:hidden"
          aria-label="Menu"
        >
          <span
            className={`h-0.5 w-5 transition-all ${open ? "translate-y-1.5 rotate-45" : ""}`}
            style={{ background: "var(--foreground)" }}
          />
          <span
            className={`h-0.5 w-5 transition-all ${open ? "opacity-0" : ""}`}
            style={{ background: "var(--foreground)" }}
          />
          <span
            className={`h-0.5 w-5 transition-all ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            style={{ background: "var(--foreground)" }}
          />
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t px-5 py-4 md:hidden" style={{ borderColor: "var(--border)" }}>
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#0d4f3c]/5 animate-slide-in stagger-${i + 1}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
