import ToolCard from "@/components/ToolCard";
import PrivacyBanner from "@/components/PrivacyBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outilis.fr - Outils en ligne gratuits pour le quotidien",
  description:
    "Calculateur salaire net/brut, simulateur pret immobilier, generateur de factures, QR codes, mots de passe securises. 100% gratuit, sans inscription.",
};

const tools = [
  {
    title: "Calculateur salaire net / brut",
    description:
      "Convertissez votre salaire brut en net et inversement. Cadre, non-cadre, fonction publique. Estimation impot incluse.",
    href: "/outils/calculateur-salaire",
    icon: "\u{1F4B0}",
    badge: "Populaire",
    category: "Finance",
  },
  {
    title: "Simulateur pret immobilier",
    description:
      "Calculez vos mensualites, le cout total du credit et visualisez le tableau d'amortissement complet.",
    href: "/outils/calculateur-pret-immobilier",
    icon: "\u{1F3E0}",
    badge: "Populaire",
    category: "Immobilier",
  },
  {
    title: "Generateur de factures",
    description:
      "Creez des factures conformes en PDF gratuitement. TVA, multi-lignes, impression directe.",
    href: "/outils/generateur-facture",
    icon: "\u{1F4C4}",
    badge: "Pro",
    category: "Business",
  },
  {
    title: "Generateur de QR Code",
    description:
      "QR codes personnalises : couleurs, taille. Pour vos liens, textes, emails ou Wi-Fi.",
    href: "/outils/generateur-qr-code",
    icon: "\u{1F4F1}",
    category: "Outils",
  },
  {
    title: "Generateur de mot de passe",
    description:
      "Mots de passe securises et personnalisables. Indicateur de force. 100% local.",
    href: "/outils/generateur-mot-de-passe",
    icon: "\u{1F512}",
    category: "Securite",
  },
  {
    title: "Compteur de mots",
    description:
      "Mots, caracteres, phrases, paragraphes. Temps de lecture et de parole estimes.",
    href: "/outils/compteur-mots",
    icon: "\u{1F4DD}",
    category: "Texte",
  },
  {
    title: "Convertisseur JSON / CSV",
    description:
      "Convertissez vos donnees entre JSON et CSV instantanement. Telechargement inclus.",
    href: "/outils/convertisseur-json-csv",
    icon: "\u{1F504}",
    category: "Dev",
  },
  {
    title: "Calculateur de TVA",
    description:
      "HT vers TTC et inversement. Tous les taux francais : 20%, 10%, 5,5%, 2,1%.",
    href: "/outils/calculateur-tva",
    icon: "\u{1F4B1}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Calculateur de pourcentage",
    description:
      "X% de Y, variation en %, part d'un total. Trois modes de calcul.",
    href: "/outils/calculateur-pourcentage",
    icon: "\u{1F4CA}",
    category: "Maths",
  },
  {
    title: "Calculateur IMC",
    description:
      "Indice de Masse Corporelle selon les normes OMS. Poids ideal inclus.",
    href: "/outils/calculateur-imc",
    icon: "\u{2696}\uFE0F",
    category: "Sante",
  },
  {
    title: "Generateur Lorem Ipsum",
    description:
      "Texte factice pour vos maquettes. Paragraphes, phrases ou mots.",
    href: "/outils/generateur-lorem-ipsum",
    icon: "\u{1F4D6}",
    category: "Texte",
  },
  {
    title: "Mentions legales",
    description:
      "Generez des mentions legales conformes RGPD pour votre site web.",
    href: "/outils/generateur-mentions-legales",
    icon: "\u{2696}\uFE0F",
    badge: "Pro",
    category: "Legal",
  },
  {
    title: "Simulateur impot sur le revenu",
    description:
      "Bareme 2024, quotient familial, taux marginal. Detail par tranche d'imposition.",
    href: "/outils/simulateur-impot",
    icon: "\u{1F4CB}",
    badge: "Populaire",
    category: "Finance",
  },
  {
    title: "Freelance vs CDI",
    description:
      "Comparez revenus nets : TJM, charges, impots. Micro, EURL, SASU vs salarie.",
    href: "/outils/freelance-vs-cdi",
    icon: "\u{1F4BC}",
    badge: "Nouveau",
    category: "Carriere",
  },
  {
    title: "Rentabilite locative",
    description:
      "Rendement brut/net, cashflow, effort d'epargne. Simulateur investissement immobilier.",
    href: "/outils/calculateur-rentabilite-locative",
    icon: "\u{1F3D8}\uFE0F",
    category: "Immobilier",
  },
  {
    title: "Age depart retraite",
    description:
      "Reforme 2023 : age legal, trimestres requis selon votre annee de naissance.",
    href: "/outils/calculateur-retraite",
    icon: "\u{1F9D3}",
    category: "Retraite",
  },
  {
    title: "Convertisseur couleurs",
    description:
      "HEX, RGB, HSL. Color picker, sliders, copie en un clic. Pour designers et devs.",
    href: "/outils/convertisseur-couleurs",
    icon: "\u{1F3A8}",
    category: "Design",
  },
  {
    title: "Calculateur de dates",
    description:
      "Jours entre deux dates, ajout/soustraction de jours. Echeances et delais.",
    href: "/outils/calculateur-date",
    icon: "\u{1F4C5}",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Politique de confidentialite",
    description:
      "Generez une politique de confidentialite conforme RGPD pour votre site web.",
    href: "/outils/generateur-politique-confidentialite",
    icon: "\u{1F6E1}\uFE0F",
    badge: "Pro",
    category: "Legal",
  },
  {
    title: "Calculateur heures de travail",
    description:
      "Heures travaillees, pauses, heures sup. et totaux hebdomadaires.",
    href: "/outils/calculateur-heures-travail",
    icon: "\u{23F0}",
    category: "Travail",
  },
  {
    title: "Convertisseur d'unites",
    description:
      "Longueur, poids, temperature, surface, volume. Conversion instantanee.",
    href: "/outils/convertisseur-unites",
    icon: "\u{1F4CF}",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Calculateur d'age",
    description:
      "Age exact en annees/mois/jours. Decompte prochain anniversaire.",
    href: "/outils/calculateur-age",
    icon: "\u{1F382}",
    category: "Outils",
  },
  {
    title: "Calculateur pret auto",
    description:
      "Mensualites, cout total et tableau d'amortissement pour votre credit automobile.",
    href: "/outils/calculateur-pret-auto",
    icon: "\u{1F697}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Consommation essence",
    description:
      "L/100km, cout par kilometre et estimation du budget carburant de vos trajets.",
    href: "/outils/calculateur-consommation-essence",
    icon: "\u{26FD}",
    badge: "Nouveau",
    category: "Auto",
  },
  {
    title: "Calories brulees",
    description:
      "Estimez les calories depensees par activite : course, velo, natation, marche et plus.",
    href: "/outils/calculateur-calories",
    icon: "\u{1F525}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Texte stylise Unicode",
    description:
      "Convertissez en gras, italique, barre, monospace, bulle. Copiez-collez partout.",
    href: "/outils/generateur-texte-stylise",
    icon: "\u{2728}",
    badge: "Nouveau",
    category: "Texte",
  },
  {
    title: "Minuteur et chronometre",
    description:
      "Compte a rebours avec alarme sonore et chronometre avec tours. 100% en ligne.",
    href: "/outils/minuteur",
    icon: "\u{23F1}\uFE0F",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Calculateur de remise",
    description:
      "Prix apres reduction, montant economise. Cumulez plusieurs remises en cascade.",
    href: "/outils/calculateur-remise",
    icon: "\u{1F3F7}\uFE0F",
    badge: "Nouveau",
    category: "Shopping",
  },
  {
    title: "Email professionnel",
    description:
      "Generez des emails pro : relance, remerciement, prise de contact, reunion, demission.",
    href: "/outils/generateur-email-professionnel",
    icon: "\u{1F4E7}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Convertisseur de devises",
    description:
      "EUR, USD, GBP, CHF, CAD, JPY, MAD, XOF. Conversion instantanee entre devises.",
    href: "/outils/calculateur-taux-change",
    icon: "\u{1F4B1}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Calculateur d'epargne",
    description:
      "Simulez la croissance de votre epargne avec les interets composes. Graphique de projection.",
    href: "/outils/calculateur-epargne",
    icon: "\u{1F4B0}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Mot de passe WiFi",
    description:
      "Generez des mots de passe WiFi securises et lisibles. QR code pour partager facilement.",
    href: "/outils/generateur-mot-de-passe-wifi",
    icon: "\u{1F4F6}",
    badge: "Nouveau",
    category: "Securite",
  },
  {
    title: "Calculateur de surface",
    description:
      "Rectangle, cercle, triangle, trapeze. Aire en m2 et conversion en autres unites.",
    href: "/outils/calculateur-surface",
    icon: "\u{1F4D0}",
    badge: "Nouveau",
    category: "Maths",
  },
  {
    title: "Convertisseur de temps",
    description:
      "Secondes, minutes, heures, jours, semaines, mois, annees. Conversion bidirectionnelle.",
    href: "/outils/convertisseur-temps",
    icon: "\u{231A}",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Calculateur vitesse",
    description:
      "Vitesse, distance, temps : entrez 2 valeurs, obtenez la 3e. Conversions km/h, m/s, mph.",
    href: "/outils/calculateur-vitesse",
    icon: "\u{1F3CE}\uFE0F",
    badge: "Nouveau",
    category: "Outils",
  },
  {
    title: "Generateur de slug URL",
    description:
      "Transformez n'importe quel texte en slug SEO-friendly. Accents, espaces, caracteres speciaux.",
    href: "/outils/generateur-slug",
    icon: "\u{1F517}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Calculateur de marge",
    description:
      "Marge commerciale, taux de marge, markup et benefice. Calcul direct et inverse.",
    href: "/outils/calculateur-marge",
    icon: "\u{1F4C8}",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Encodeur Base64",
    description:
      "Encodez du texte en Base64 et decodez du Base64 en texte. Copie en un clic.",
    href: "/outils/encodeur-base64",
    icon: "\u{1F510}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Calculateur d'inflation",
    description:
      "Pouvoir d'achat dans le temps. Donnees IPC francaises de 1970 a 2025.",
    href: "/outils/calculateur-inflation",
    icon: "\u{1F4C9}",
    badge: "Nouveau",
    category: "Finance",
  },
  {
    title: "Generateur robots.txt",
    description:
      "Creez un fichier robots.txt valide. Presets, chemins bloques, sitemap. Pour le SEO.",
    href: "/outils/generateur-robots-txt",
    icon: "\u{1F916}",
    badge: "Nouveau",
    category: "SEO",
  },
];

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
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Decorative gradient */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 20%, #0d4f3c 0%, transparent 50%), radial-gradient(circle at 80% 80%, #e8963e 0%, transparent 40%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p
              className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              Outils en ligne gratuits
            </p>

            <h1
              className="animate-fade-up stagger-1 mt-5 text-5xl leading-[1.1] tracking-tight md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Simplifiez votre{" "}
              <span style={{ color: "var(--primary)" }}>quotidien</span>
              <span style={{ color: "var(--accent)" }}>.</span>
            </h1>

            <p
              className="animate-fade-up stagger-2 mt-6 max-w-lg text-lg leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Calculateurs, generateurs et convertisseurs — concus pour etre
              rapides, gratuits et respectueux de votre vie privee.
            </p>

            <div className="animate-fade-up stagger-3 mt-8 flex flex-wrap gap-3">
              <a
                href="/outils/calculateur-salaire"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "var(--primary)" }}
              >
                Calculer mon salaire net
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a
                href="#outils"
                className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-semibold transition-all hover:bg-[#0d4f3c]/5"
                style={{ borderColor: "var(--border)" }}
              >
                Voir tous les outils
              </a>
            </div>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up stagger-4 mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--border)" }}
          >
            {[
              { value: "40", label: "Outils disponibles" },
              { value: "0\u20AC", label: "Pour toujours" },
              { value: "0", label: "Donnees collectees" },
            ].map((stat, i) => (
              <div
                key={i}
                className="px-6 py-5 text-center"
                style={{ background: "var(--surface)" }}
              >
                <p className="text-2xl font-bold md:text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
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

      {/* Tools Grid */}
      <section id="outils" className="border-t py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Collection
              </p>
              <h2
                className="mt-2 text-3xl tracking-tight md:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tous nos outils
              </h2>
            </div>
            <p className="hidden text-sm md:block" style={{ color: "var(--muted)" }}>
              {tools.length} outils disponibles
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <div key={tool.href} className={`animate-fade-up stagger-${i + 1}`}>
                <ToolCard {...tool} />
              </div>
            ))}
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

      {/* Privacy Banner */}
      <PrivacyBanner />

      {/* CTA */}
      <section className="border-t py-20" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2
            className="text-3xl tracking-tight md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pret a simplifier votre quotidien ?
          </h2>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Commencez avec notre outil le plus populaire — le calculateur de salaire net/brut.
            Rejoignez des milliers d&apos;utilisateurs qui nous font confiance.
          </p>
          <a
            href="/outils/calculateur-salaire"
            className="mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "var(--primary)" }}
          >
            Commencer gratuitement
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
