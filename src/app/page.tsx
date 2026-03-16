import ToolSearchFilter from "@/components/ToolSearch";
import PrivacyBanner from "@/components/PrivacyBanner";
import { tools } from "@/data/tools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outilis.fr - Outils en ligne gratuits pour le quotidien",
  description:
    "Calculateur salaire net/brut, simulateur pret immobilier, generateur de factures, QR codes, mots de passe securises. 100% gratuit, sans inscription.",
};

const FEATURES = [
  {
    icon: "\u{26A1}",
    title: "Instantane",
    description: "Calculs en temps reel dans votre navigateur. Zero temps de chargement.",
  },
  {
    icon: "\u{1F6E1}\uFE0F",
    title: "Prive",
    description: "Aucune donnee envoyee. Tout reste sur votre appareil.",
  },
  {
    icon: "\u{2728}",
    title: "Sans friction",
    description: "Pas de compte. Pas de pub intrusive. Pas de limite.",
  },
];

export default function Home() {
  return (
    <>
      {/* Trust Strip */}
      <div className="trust-strip py-2.5 text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-medium text-white/90">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          {tools.length}+ outils gratuits &middot; Aucune donnee collectee &middot; 100% dans votre navigateur
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </p>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Decorative elements */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 30%, #0d4f3c 0%, transparent 40%), radial-gradient(circle at 80% 70%, #e8963e 0%, transparent 35%), radial-gradient(circle at 60% 10%, #0d4f3c 0%, transparent 25%)",
          }}
        />
        {/* Decorative floating shapes */}
        <div className="absolute right-[10%] top-[15%] h-20 w-20 animate-float rounded-2xl opacity-[0.06]" style={{ background: "var(--primary)", animationDelay: "0s" }} />
        <div className="absolute right-[25%] bottom-[20%] h-14 w-14 animate-float rounded-full opacity-[0.04]" style={{ background: "var(--accent)", animationDelay: "2s" }} />
        <div className="absolute left-[5%] bottom-[30%] h-10 w-10 animate-float rounded-lg opacity-[0.05] rotate-12" style={{ background: "var(--primary)", animationDelay: "4s" }} />

        <div className="relative mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border px-4 py-1.5" style={{ borderColor: "var(--primary)", background: "rgba(13,79,60,0.05)" }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--primary)" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--primary)" }} />
              </span>
              <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                {tools.length} outils disponibles
              </span>
            </div>

            <h1
              className="animate-fade-up stagger-1 mt-6 text-5xl leading-[1.08] tracking-tight md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Simplifiez votre{" "}
              <span className="relative" style={{ color: "var(--primary)" }}>
                quotidien
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C40 2 80 1 100 3C120 5 160 6 199 2.5" stroke="#e8963e" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span style={{ color: "var(--accent)" }}>.</span>
            </h1>

            <p
              className="animate-fade-up stagger-2 mt-6 max-w-lg text-lg leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Calculateurs, generateurs et convertisseurs &mdash; concus pour etre
              rapides, gratuits et respectueux de votre vie privee.
            </p>

            <div className="animate-fade-up stagger-3 mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/outils/calculateur-salaire"
                className="animate-pulse-glow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
              >
                Calculer mon salaire net
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a
                href="#outils"
                className="inline-flex items-center rounded-full border px-6 py-3.5 text-sm font-semibold transition-all hover:bg-[#0d4f3c]/5 hover:border-[#0d4f3c]/20"
                style={{ borderColor: "var(--border)" }}
              >
                Voir les {tools.length} outils
              </a>
            </div>

            {/* Social proof */}
            <div className="animate-fade-up stagger-4 mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#0d4f3c", "#e8963e", "#16785c", "#8a8578"].map((c, i) => (
                  <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white" style={{ background: c }}>
                    {["M", "A", "S", "L"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Utilise par des <strong style={{ color: "var(--foreground)" }}>milliers</strong> de Francais chaque mois
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up stagger-5 mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--border)" }}
          >
            {[
              { value: `${tools.length}`, label: "Outils gratuits", icon: "\u{2699}\uFE0F" },
              { value: "0€", label: "Pour toujours", icon: "\u{1F4B8}" },
              { value: "0", label: "Donnees collectees", icon: "\u{1F512}" },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-6 py-6 text-center"
                style={{ background: "var(--surface)" }}
              >
                <span className="text-lg">{stat.icon}</span>
                <p className="mt-1 text-2xl font-bold md:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid with Search */}
      <section id="outils" className="border-t py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
              Collection
            </p>
            <h2
              className="mt-2 text-3xl tracking-tight md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Trouvez l&apos;outil qu&apos;il vous faut
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "var(--muted)" }}>
              Recherchez par nom ou filtrez par categorie pour trouver instantanement l&apos;outil adapte.
            </p>
          </div>

          <div className="mt-8">
            <ToolSearchFilter tools={tools} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t py-20" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
              Philosophie
            </p>
            <h2
              className="mt-2 text-3xl tracking-tight md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Concu pour vous, pas contre vous
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border p-8 transition-all hover:shadow-lg hover:shadow-[#0d4f3c]/5"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <span className="text-4xl">{f.icon}</span>
                <h3
                  className="mt-4 text-xl tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Contribuer */}
      <section className="border-t py-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 text-center sm:flex-row sm:text-left">
          <div className="flex-1">
            <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Un outil vous manque ?
            </h2>
            <p className="mt-1.5 text-sm" style={{ color: "var(--muted)" }}>
              Suggerez-le en quelques clics ou contribuez directement au code open source.
            </p>
          </div>
          <a
            href="/contribuer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, var(--accent) 0%, #d4822e 100%)" }}
          >
            Contribuer
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Privacy Banner */}
      <PrivacyBanner />

      {/* CTA */}
      <section className="relative overflow-hidden py-20" style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 50%, #0d4f3c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(232,150,62,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 40%)" }} />
        <div className="relative mx-auto max-w-2xl px-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Pret ?
          </p>
          <h2
            className="mt-3 text-3xl tracking-tight text-white md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Commencez a simplifier votre quotidien
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Rejoignez des milliers de Francais qui utilisent nos outils chaque jour.
            Gratuit, sans inscription, sans cookies.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/outils/calculateur-salaire"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
              style={{ color: "var(--primary)" }}
            >
              Calculer mon salaire net
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              href="/outils/simulateur-impot"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Simuler mes impots
            </a>
          </div>
          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-6 text-white/50">
            <div className="flex items-center gap-1.5 text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Gratuit
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Sans inscription
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              Vie privee respectee
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
