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
    <header className="sticky top-0 z-50 bg-[#faf9f6]/85 backdrop-blur-xl" style={{ borderBottom: "1px solid transparent", backgroundImage: "linear-gradient(var(--background), var(--background)), linear-gradient(90deg, transparent, var(--border), transparent)", backgroundOrigin: "padding-box, border-box", backgroundClip: "padding-box, border-box" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 2xl:max-w-[1400px]">
        <Link href="/" className="group flex items-baseline gap-0.5 transition-all">
          <span
            className="text-[1.65rem] tracking-tight transition-colors group-hover:text-[#16785c]"
            style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
          >
            Outilis
          </span>
          <span
            className="relative -top-px text-[10px] font-semibold tracking-[0.15em] uppercase transition-colors group-hover:text-[#e8963e]"
            style={{ color: "var(--accent)" }}
          >
            .fr
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all hover:bg-[#0d4f3c]/[0.04] hover:text-[#0d4f3c]"
              style={{ color: "var(--muted)" }}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="ml-3 flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12px] font-medium transition-all hover:border-[#0d4f3c]/20 hover:shadow-sm"
            style={{ borderColor: "var(--border)", color: "var(--muted)", background: "var(--surface)" }}
            aria-label="Rechercher (Ctrl+K)"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span className="hidden lg:inline">Rechercher</span>
            <kbd
              className="rounded-md border px-1.5 py-0.5 text-[10px] font-semibold"
              style={{ borderColor: "var(--border)", background: "var(--surface-alt)", color: "var(--muted)" }}
            >
              Ctrl+K
            </kbd>
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-[5px] p-2 md:hidden"
          aria-label="Menu"
        >
          <span
            className={`h-[1.5px] w-5 rounded-full transition-all duration-300 ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
            style={{ background: "var(--foreground)" }}
          />
          <span
            className={`h-[1.5px] w-5 rounded-full transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`}
            style={{ background: "var(--foreground)" }}
          />
          <span
            className={`h-[1.5px] w-5 rounded-full transition-all duration-300 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
            style={{ background: "var(--foreground)" }}
          />
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav
          className="border-t px-5 pb-5 pt-3 md:hidden"
          style={{ borderColor: "var(--border)", background: "linear-gradient(180deg, var(--background) 0%, var(--surface-alt) 100%)" }}
        >
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-[#0d4f3c]/5 animate-slide-in stagger-${i + 1}`}
            >
              <span className="h-1 w-1 rounded-full" style={{ background: "var(--primary)" }} />
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
