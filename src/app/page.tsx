import ToolSearchFilter from "@/components/ToolSearch";
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
  {
    title: "Empreinte carbone CO2",
    description:
      "Estimez vos emissions CO2 : voiture, avion, train, energie. Equivalences et conseils.",
    href: "/outils/calculateur-co2",
    icon: "\u{1F331}",
    badge: "Nouveau",
    category: "Environnement",
  },
  {
    title: "Generateur d'avatar",
    description:
      "Creez un avatar avec vos initiales. Cercle colore, styles varies. Telechargez en PNG.",
    href: "/outils/generateur-avatar",
    icon: "\u{1F464}",
    badge: "Nouveau",
    category: "Design",
  },
  {
    title: "Calculateur grossesse",
    description:
      "Date prevue d'accouchement, semaine, trimestre et etapes cles de la grossesse.",
    href: "/outils/calculateur-grossesse",
    icon: "\u{1F930}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Convertisseur numeration",
    description:
      "Decimal, binaire, octal, hexadecimal. Conversion bidirectionnelle instantanee.",
    href: "/outils/convertisseur-numeration",
    icon: "\u{1F522}",
    badge: "Nouveau",
    category: "Dev",
  },
  {
    title: "Calculateur beton",
    description:
      "Volume en m3, nombre de sacs 25kg/35kg. Dalle, fondation, poteau. Pour vos travaux.",
    href: "/outils/calculateur-beton",
    icon: "\u{1F3D7}\uFE0F",
    badge: "Nouveau",
    category: "Construction",
  },
  {
    title: "Signature email HTML",
    description:
      "Creez une signature email pro : nom, poste, reseaux sociaux. Copiez le HTML en un clic.",
    href: "/outils/generateur-signature-email",
    icon: "\u{270D}\uFE0F",
    badge: "Nouveau",
    category: "Business",
  },
  {
    title: "Calculateur alcoolemie",
    description:
      "Taux d'alcoolemie estime, temps de retour a zero. Outil educatif base sur Widmark.",
    href: "/outils/calculateur-alcoolemie",
    icon: "\u{1F37B}",
    badge: "Nouveau",
    category: "Sante",
  },
  {
    title: "Convertisseur temperature",
    description:
      "Celsius, Fahrenheit, Kelvin. Thermometre visuel et formules de conversion.",
    href: "/outils/convertisseur-temperature",
    icon: "\u{1F321}\uFE0F",
    badge: "Nouveau",
    category: "Conversion",
  },
  {
    title: "Calculateur pourboire",
    description:
      "Pourboire ideal, partage de l'addition. Comparaison des taux et arrondi.",
    href: "/outils/calculateur-pourboire",
    icon: "\u{1F4B5}",
    badge: "Nouveau",
    category: "Restaurant",
  },
  {
    title: "Mot de passe prononcable",
    description:
      "Mots de passe faciles a prononcer et retenir. Syllabes, force et options.",
    href: "/outils/generateur-mdp-prononcable",
    icon: "\u{1F5E3}\uFE0F",
    badge: "Nouveau",
    category: "Securite",
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
      {/* Trust Strip */}
      <div className="trust-strip py-2.5 text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-medium text-white/90">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          50 outils gratuits &middot; Aucune donnee collectee &middot; 100% dans votre navigateur
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
                50 outils disponibles &mdash; 10 nouveaux outils !
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
                Voir les 50 outils
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
              { value: "50", label: "Outils gratuits", icon: "\u{2699}\uFE0F" },
              { value: "0\u20AC", label: "Pour toujours", icon: "\u{1F4B8}" },
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
