import ToolSearchFilter from "@/components/ToolSearch";
import PrivacyBanner from "@/components/PrivacyBanner";
import RecentAndFavorites from "@/components/RecentAndFavorites";
import { tools } from "@/data/tools";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outilis.fr - Outils en ligne gratuits pour le quotidien",
  description:
    "Calculateur salaire net/brut, simulateur pret immobilier, generateur de factures, QR codes, mots de passe securises. 100% gratuit, sans inscription. Plus de 88 outils dans votre navigateur.",
  other: {
    "article:modified_time": "2026-03-30",
  },
};

const FEATURES = [
  {
    icon: "\u{26A1}",
    title: "Instantane",
    description: "Calculs en temps reel dans votre navigateur. Zero temps de chargement.",
    gradient: "linear-gradient(135deg, #e8963e 0%, #f4c27f 100%)",
  },
  {
    icon: "\u{1F6E1}\uFE0F",
    title: "Prive",
    description: "Aucune donnee envoyee. Tout reste sur votre appareil.",
    gradient: "linear-gradient(135deg, #0d4f3c 0%, #16785c 100%)",
  },
  {
    icon: "\u{2728}",
    title: "Sans friction",
    description: "Pas de compte. Pas de pub intrusive. Pas de limite.",
    gradient: "linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)",
  },
];

const BENTO_TOOLS = [
  { icon: "\u{1F4B0}", label: "Salaire net", value: "2 186 \u20AC", sub: "Brut \u2192 Net", color: "#0d4f3c", href: "/outils/calculateur-salaire" },
  { icon: "\u{1F4F1}", label: "QR Code", value: "", sub: "Generateur", color: "#e8963e", href: "/outils/generateur-qr-code" },
  { icon: "\u{1F3E0}", label: "Pret immo", value: "1 247 \u20AC", sub: "Mensualite", color: "#8b6914", href: "/outils/calculateur-pret-immobilier" },
  { icon: "\u{1F512}", label: "Securite", value: "kX#9m!", sub: "Mot de passe", color: "#922b21", href: "/outils/generateur-mot-de-passe" },
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
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-28">
        {/* Gradient mesh background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(ellipse 80% 60% at 10% 40%, rgba(13,79,60,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 80% at 90% 20%, rgba(232,150,62,0.05) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 50% 90%, rgba(13,79,60,0.03) 0%, transparent 60%)",
          }}
        />
        {/* Animated orb */}
        <div
          className="absolute left-[15%] top-[10%] h-[300px] w-[300px] animate-orb-float rounded-full opacity-[0.04] blur-3xl md:h-[500px] md:w-[500px]"
          style={{ background: "radial-gradient(circle, #0d4f3c 0%, #e8963e 60%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_380px] lg:gap-16 xl:grid-cols-[1fr_440px] xl:gap-20">
            {/* Left: Text */}
            <div>
              <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border px-4 py-1.5" style={{ borderColor: "rgba(13,79,60,0.2)", background: "rgba(13,79,60,0.04)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--primary)" }} />
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--primary)" }} />
                </span>
                <span className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                  {tools.length} outils disponibles
                </span>
              </div>

              <h1
                className="animate-fade-up stagger-1 mt-6 text-[2.75rem] leading-[1.08] tracking-tight sm:text-5xl md:text-[3.75rem] lg:text-[4.25rem] xl:text-[4.75rem]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Simplifiez votre{" "}
                <span className="relative whitespace-nowrap" style={{ color: "var(--primary)" }}>
                  quotidien
                  <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5.5C40 2 80 1 100 3C120 5 160 6 199 2.5" stroke="#e8963e" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
                  </svg>
                </span>
                <span style={{ color: "var(--accent)" }}>.</span>
              </h1>

              <p
                className="animate-fade-up stagger-2 mt-5 max-w-xl text-[17px] leading-relaxed md:text-lg"
                style={{ color: "var(--muted)" }}
              >
                Calculateurs, generateurs et convertisseurs &mdash; concus pour etre
                rapides, gratuits et respectueux de votre vie privee.
              </p>

              <div className="animate-fade-up stagger-3 mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="/outils/calculateur-salaire"
                  className="animate-pulse-glow arrow-bounce group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
                >
                  Calculer mon salaire net
                  <svg className="arrow-icon transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <a
                  href="#outils"
                  className="inline-flex items-center rounded-full border px-6 py-3.5 text-sm font-semibold transition-all hover:border-[#0d4f3c]/20 hover:shadow-sm"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  Voir les {tools.length} outils
                </a>
              </div>

              {/* Social proof */}
              <div className="animate-fade-up stagger-4 mt-10 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["#0d4f3c", "#e8963e", "#16785c", "#8a8578"].map((c, i) => (
                    <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 text-[10px] font-bold text-white" style={{ background: c, borderColor: "var(--background)" }}>
                      {["M", "A", "S", "L"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Utilise par des <strong style={{ color: "var(--foreground)" }}>milliers</strong> de Francais chaque mois
                </p>
              </div>
            </div>

            {/* Right: Bento Grid Preview - clickable links */}
            <div className="animate-fade-up stagger-3 hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                {BENTO_TOOLS.map((tool, i) => (
                  <a
                    key={i}
                    href={tool.href}
                    className={`bento-item rounded-2xl border p-4 transition-all hover:border-[${tool.color}]/20 ${i === 0 ? "col-span-2" : ""}`}
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(12px)",
                      borderColor: "var(--border)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg"
                        style={{ background: `${tool.color}0C`, border: `1px solid ${tool.color}15` }}
                      >
                        {tool.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium" style={{ color: "var(--muted)" }}>{tool.sub}</p>
                        <p className="truncate text-[13px] font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                          {tool.label}
                        </p>
                      </div>
                      {tool.value && (
                        <p className="shrink-0 text-right text-[13px] font-bold tabular-nums" style={{ color: tool.color }}>
                          {tool.value}
                        </p>
                      )}
                      {!tool.value && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${tool.color}10` }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tool.color} strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h4v4H7zM7 13h4v4H7zM13 7h4v4h-4z"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </a>
                ))}
                {/* Decorative bottom row */}
                <a
                  href="#outils"
                  className="bento-item col-span-2 flex items-center justify-between rounded-2xl border px-4 py-3"
                  style={{
                    background: "linear-gradient(135deg, rgba(13,79,60,0.03) 0%, rgba(232,150,62,0.03) 100%)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {["\u{1F4CA}", "\u{1F4DD}", "\u{1F3A8}"].map((e, i) => (
                        <span key={i} className="flex h-7 w-7 items-center justify-center rounded-full border text-xs" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                          {e}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                      +{tools.length - 4} autres outils
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--primary)" }}>
                    Explorer
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up stagger-5 mt-16 grid grid-cols-3 overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            {[
              { value: `${tools.length}`, label: "Outils gratuits", icon: "\u{2699}\uFE0F" },
              { value: "0\u20AC", label: "Pour toujours", icon: "\u{1F4B8}" },
              { value: "0", label: "Donnees collectees", icon: "\u{1F512}" },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative px-6 py-7 text-center transition-colors hover:bg-[#0d4f3c]/[0.01]"
                style={{
                  background: "var(--surface)",
                  borderLeft: i > 0 ? "1px solid var(--border)" : undefined,
                }}
              >
                <span className="text-lg">{stat.icon}</span>
                <p className="mt-1.5 text-2xl font-bold md:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--muted)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent & Favorites */}
      <RecentAndFavorites />

      {/* Tools Grid with Search */}
      <section id="outils" className="py-20" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
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
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Recherchez par nom ou filtrez par categorie pour trouver instantanement l&apos;outil adapte.
            </p>
          </div>

          <div className="mt-10">
            <ToolSearchFilter tools={tools} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24" style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
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

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="feature-card group relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0d4f3c]/5"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute left-4 right-4 top-0 h-[2.5px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: f.gradient }}
                />

                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: f.gradient, boxShadow: `0 4px 12px ${i === 0 ? 'rgba(232,150,62,0.25)' : i === 1 ? 'rgba(13,79,60,0.2)' : 'rgba(26,82,118,0.2)'}` }}
                >
                  <span className="brightness-0 invert">{f.icon}</span>
                </div>
                <h3
                  className="mt-5 text-xl tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {f.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Contribuer */}
      <section className="py-14" style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="mx-auto flex max-w-7xl flex-col items-center gap-6 rounded-2xl border px-8 py-8 text-center sm:flex-row sm:text-left 2xl:max-w-[1400px]"
          style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-sm)" }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl"
            style={{ background: "rgba(232,150,62,0.1)", border: "1px solid rgba(232,150,62,0.15)" }}
          >
            {"\u{1F4A1}"}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Un outil vous manque ?
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Suggerez-le en quelques clics ou contribuez directement au code open source.
            </p>
          </div>
          <a
            href="/contribuer"
            className="arrow-bounce group inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--accent) 0%, #d4822e 100%)" }}
          >
            Contribuer
            <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Why Outilis — Editorial SEO section */}
      <section className="py-16" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
              Pourquoi Outilis.fr
            </p>
            <h2 className="mt-2 text-3xl tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Des outils en ligne <span style={{ color: "var(--primary)" }}>vraiment gratuits</span>, sans compromis
            </h2>
            <div className="mt-6 space-y-4 text-[15px] leading-[1.8]" style={{ color: "var(--foreground)" }}>
              <p>
                Outilis.fr rassemble plus de {tools.length} outils en ligne gratuits pour le quotidien des particuliers et des professionnels en France.
                Calculateurs financiers, simulateurs fiscaux, generateurs de documents, outils pour developpeurs, convertisseurs et bien plus :
                chaque outil est concu pour repondre a un besoin precis, avec des donnees a jour et une interface simple.
              </p>
              <p>
                Contrairement a la plupart des sites d&apos;outils en ligne, Outilis.fr fonctionne a 100% dans votre navigateur.
                Aucune donnee n&apos;est envoyee a un serveur, aucun compte n&apos;est necessaire, aucun cookie de tracking n&apos;est depose.
                Vos calculs de salaire, vos simulations d&apos;impot, vos mots de passe generes : tout reste sur votre appareil.
                C&apos;est un choix technique delibere pour garantir votre vie privee.
              </p>
              <p>
                Nos outils financiers integrent les baremes officiels 2026 : impot sur le revenu, cotisations sociales,
                taux de CSG/CRDS, plafonds de la Securite sociale, aides au logement (APL) et dispositifs comme le PTZ.
                Pour les professionnels, nos simulateurs couvrent l&apos;auto-entrepreneur, la comparaison freelance vs CDI, le calcul du TJM
                et la generation de factures conformes. Pour les developpeurs, une suite d&apos;outils couvre le JSON, les regex, le Base64,
                les conversions PX/REM et la generation de gradients CSS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16" style={{ background: "var(--surface-alt)", borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
              Cas d&apos;usage
            </p>
            <h2 className="mt-2 text-3xl tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Qui utilise Outilis.fr ?
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Salaries et demandeurs d\u0027emploi",
                desc: "Calculez votre salaire net, simulez votre impot sur le revenu, estimez vos droits au chomage (ARE) ou a la prime d\u0027activite. Verifiez que votre bulletin de paie est correct.",
                icon: "\u{1F4BC}",
              },
              {
                title: "Freelances et entrepreneurs",
                desc: "Comparez micro-entreprise vs SASU, calculez votre TJM ideal, generez des factures conformes et estimez vos cotisations sociales. Tout pour piloter votre activite.",
                icon: "\u{1F680}",
              },
              {
                title: "Investisseurs immobiliers",
                desc: "Simulez votre pret, calculez les frais de notaire, evaluez la rentabilite locative et estimez la plus-value a la revente. Tout un parcours d\u0027investissement en un clic.",
                icon: "\u{1F3E0}",
              },
              {
                title: "Developpeurs web",
                desc: "Formatez du JSON, testez vos regex, convertissez PX en REM, generez des gradients CSS et des slugs SEO-friendly. Des outils qui font gagner du temps au quotidien.",
                icon: "\u{1F4BB}",
              },
              {
                title: "Etudiants et particuliers",
                desc: "Calculez votre IMC, estimez vos APL, convertissez des unites, partagez une addition entre amis ou generez un QR code. Des outils simples pour la vie de tous les jours.",
                icon: "\u{1F393}",
              },
              {
                title: "Createurs de contenu",
                desc: "Compressez vos images, editez vos photos, fusionnez des PDF, generez des avatars et des signatures email. Des outils creatifs sans logiciel a installer.",
                icon: "\u{1F3A8}",
              },
            ].map((uc, i) => (
              <div
                key={i}
                className="rounded-2xl border p-6"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <span className="text-2xl">{uc.icon}</span>
                <h3 className="mt-3 text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {uc.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {uc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — Homepage */}
      <section className="py-16" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                FAQ
              </p>
              <h2 className="mt-2 text-3xl tracking-tight md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                Questions frequentes
              </h2>
            </div>
            <div className="mt-8 space-y-5">
              {[
                {
                  q: "Outilis.fr est-il vraiment 100% gratuit ?",
                  a: "Oui, tous les outils sont gratuits, sans limite d\u0027utilisation et sans inscription. Le site est finance par la publicite non intrusive. Aucune fonctionnalite n\u0027est cachee derriere un paywall.",
                },
                {
                  q: "Mes donnees sont-elles en securite ?",
                  a: "Absolument. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee personnelle, financiere ou autre n\u0027est envoyee a un serveur. Vous pouvez meme utiliser la plupart des outils hors ligne une fois la page chargee.",
                },
                {
                  q: "Les baremes et taux sont-ils a jour ?",
                  a: "Oui. Nos outils financiers et fiscaux integrent les baremes officiels 2026 (impot sur le revenu, cotisations sociales, PASS, CSG/CRDS, taux de TVA). Chaque outil est mis a jour des que les nouveaux taux sont publies par l\u0027administration.",
                },
                {
                  q: "Puis-je utiliser ces outils sur mobile ?",
                  a: "Tous les outils sont responsive et fonctionnent sur smartphone, tablette et ordinateur. L\u0027interface s\u0027adapte automatiquement a la taille de votre ecran pour une experience optimale.",
                },
                {
                  q: "Comment suggerer un nouvel outil ?",
                  a: "Rendez-vous sur la page Contribuer ou ouvrez une issue sur notre depot GitHub. Nous ajoutons regulierement de nouveaux outils en fonction des demandes les plus populaires.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-6"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <h3 className="text-base font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Banner */}
      <PrivacyBanner />

      {/* CTA */}
      <section className="relative overflow-hidden py-24" style={{ background: "linear-gradient(135deg, #0a3f30 0%, var(--primary) 30%, #1a6b4f 70%, #0d4f3c 100%)" }}>
        <div className="absolute left-[10%] top-[20%] h-[250px] w-[250px] animate-orb-float rounded-full opacity-[0.08] blur-3xl" style={{ background: "#e8963e" }} />
        <div className="absolute right-[15%] bottom-[10%] h-[200px] w-[200px] animate-orb-float rounded-full opacity-[0.05] blur-3xl" style={{ background: "#ffffff", animationDelay: "4s" }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
            Pret ?
          </p>
          <h2
            className="mt-4 text-3xl tracking-tight text-white md:text-[2.5rem] md:leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Commencez a simplifier votre quotidien
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
            Rejoignez des milliers de Francais qui utilisent nos outils chaque jour.
            Gratuit, sans inscription, sans cookies.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/outils/calculateur-salaire"
              className="arrow-bounce group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold transition-all hover:scale-[1.02] hover:shadow-xl"
              style={{ color: "var(--primary)" }}
            >
              Calculer mon salaire net
              <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              href="/outils/simulateur-impot"
              className="inline-flex items-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/30 hover:bg-white/10"
            >
              Simuler mes impots
            </a>
          </div>
          <div className="mx-auto mt-9 flex max-w-sm items-center justify-center gap-6 text-white/40">
            {["Gratuit", "Sans inscription", "Vie privee respectee"].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Outilis.fr est-il vraiment 100% gratuit ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Oui, tous les outils sont gratuits, sans limite d'utilisation et sans inscription. Le site est finance par la publicite non intrusive. Aucune fonctionnalite n'est cachee derriere un paywall.",
                },
              },
              {
                "@type": "Question",
                name: "Mes donnees sont-elles en securite ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Absolument. Tous les calculs sont effectues localement dans votre navigateur. Aucune donnee personnelle, financiere ou autre n'est envoyee a un serveur.",
                },
              },
              {
                "@type": "Question",
                name: "Les baremes et taux sont-ils a jour ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Oui. Nos outils financiers et fiscaux integrent les baremes officiels 2026 (impot sur le revenu, cotisations sociales, PASS, CSG/CRDS, taux de TVA).",
                },
              },
              {
                "@type": "Question",
                name: "Puis-je utiliser ces outils sur mobile ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Tous les outils sont responsive et fonctionnent sur smartphone, tablette et ordinateur.",
                },
              },
              {
                "@type": "Question",
                name: "Comment suggerer un nouvel outil ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Rendez-vous sur la page Contribuer ou ouvrez une issue sur notre depot GitHub.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
