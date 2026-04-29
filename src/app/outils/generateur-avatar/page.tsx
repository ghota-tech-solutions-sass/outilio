"use client";

import { useState, useRef, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const COLORS = [
  "#0d4f3c", "#16785c", "#e8963e", "#3b82f6", "#8b5cf6",
  "#ef4444", "#ec4899", "#14b8a6", "#f59e0b", "#6366f1",
  "#059669", "#dc2626",
];

const STYLES = [
  { id: "circle", label: "Cercle" },
  { id: "rounded", label: "Carre arrondi" },
  { id: "square", label: "Carre" },
];

const SIZES = [64, 128, 256, 512];

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}

export default function GenerateurAvatar() {
  const [name, setName] = useState("Jean Dupont");
  const [color, setColor] = useState(COLORS[0]);
  const [style, setStyle] = useState("circle");
  const [size, setSize] = useState(256);
  const [fontSize, setFontSize] = useState(40);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initials = getInitials(name) || "?";

  const borderRadius = style === "circle" ? "50%" : style === "rounded" ? "20%" : "0%";

  const drawAndDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = color;
    if (style === "circle") {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (style === "rounded") {
      const r = size * 0.2;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(size - r, 0);
      ctx.quadraticCurveTo(size, 0, size, r);
      ctx.lineTo(size, size - r);
      ctx.quadraticCurveTo(size, size, size - r, size);
      ctx.lineTo(r, size);
      ctx.quadraticCurveTo(0, size, 0, size - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size * (fontSize / 100)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, size / 2, size / 2 + size * 0.02);

    const link = document.createElement("a");
    link.download = `avatar-${initials.toLowerCase()}-${size}px.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [size, color, style, fontSize, initials]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Design</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur <span style={{ color: "var(--primary)" }}>Avatar</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Creez un avatar avec vos initiales. Choisissez la couleur, le style et telechargez en PNG.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nom complet</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jean Dupont"
                className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Couleur</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setColor(c)}
                      className="h-10 w-10 rounded-full transition-all" style={{ background: c, outline: color === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }} />
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Style</label>
                <div className="mt-2 flex gap-2">
                  {STYLES.map((s) => (
                    <button key={s.id} onClick={() => setStyle(s.id)}
                      className="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                      style={{ borderColor: style === s.id ? "var(--primary)" : "var(--border)", background: style === s.id ? "rgba(13,79,60,0.05)" : "transparent", color: style === s.id ? "var(--primary)" : "var(--muted)" }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taille (px)</label>
                  <select value={size} onChange={(e) => setSize(Number(e.target.value))}
                    className="mt-2 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }}>
                    {SIZES.map((s) => <option key={s} value={s}>{s} x {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taille police (%)</label>
                  <input type="range" min="20" max="60" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                    className="mt-4 w-full" />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{fontSize}%</span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Apercu</p>
              <div className="mt-6 flex justify-center">
                <div className="flex items-center justify-center text-white font-bold"
                  style={{ width: "200px", height: "200px", background: color, borderRadius, fontSize: `${200 * (fontSize / 100)}px` }}>
                  {initials}
                </div>
              </div>
              <button onClick={drawAndDownload}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                Telecharger en PNG ({size}x{size})
              </button>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <ToolHowToSection
              title="Comment creer un avatar a initiales en 3 etapes"
              description="Tout est rendu en local par Canvas2D. Aucun upload, aucun compte, aucun watermark. Vous quittez la page avec un PNG pret pour vos profils ou maquettes."
              steps={[
                {
                  name: "Saisir le nom complet",
                  text:
                    "Tapez le nom complet (Prenom + Nom) : l&apos;outil extrait automatiquement les deux premieres initiales en majuscules. Pour un nom compose, ecrivez-le tel quel : Anne-Sophie Martin donne AM. Si vous ne tapez qu&apos;un seul mot, seule la premiere lettre est utilisee.",
                },
                {
                  name: "Choisir couleur et forme",
                  text:
                    "12 couleurs predefinies couvrent les palettes pro classiques. Pour une cohesion graphique, alignez la couleur sur votre charte (hex code de votre logo). Cote forme, le cercle est le format standard des avatars web (Slack, Notion, Gmail), le carre arrondi est plus moderne (App Store), le carre pur est utilise sur certains CMS internes.",
                },
                {
                  name: "Ajuster taille et telecharger",
                  text:
                    "64 ou 128 px pour des listes denses (CRM, forum), 256 px pour un profil web standard, 512 px pour les ecrans haute densite (Retina, 4K) ou les supports imprimes. Cliquez sur Telecharger en PNG : le fichier porte automatiquement les initiales et la taille, pret a uploader sur votre service.",
                },
              ]}
            />

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Cas d&apos;usage de l&apos;avatar a initiales
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Equipe SaaS sans photos pro
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Page &quot;A propos&quot; ou trombinoscope client : tous les membres n&apos;ont pas de photo prete. Generez 5 a 10 avatars
                    coherents (meme palette, meme forme) pour eviter le mix &quot;photo HD + selfie pixelise&quot; et garder une presentation
                    pro homogene.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Maquette Figma ou Sketch
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Ne plus utiliser des stock photos genantes pour vos demos client : generez 20 avatars en 30 secondes (Anna L,
                    Bertrand M, Clara P...) et glissez-les dans vos composants Card, ListItem, Comment. Plus rapide qu&apos;Unsplash et
                    sans probleme de droit d&apos;image.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Avatar par defaut d&apos;app
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Quand un nouvel utilisateur s&apos;inscrit sans uploader de photo, generez cote backend un avatar a initiales avec
                    une couleur deterministe (hash sur l&apos;email). Le rendu reste personnalise et evite le silhouette anonyme. Code
                    open source dispo en JS / Python pour reproduire la logique en serveur.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Compte pro sans photo personnelle
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Slack, Notion, Linear, GitHub : pour les utilisateurs qui prefèrent ne pas afficher leur visage (consultants
                    externes, profils pseudonymes), l&apos;avatar a initiales est la seule alternative pro qui evite l&apos;avatar par
                    defaut generique sans creer un avatar AI fake.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                A savoir : design, performance et droit
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Monogramme vs initials.</strong> Le mot anglais &quot;monogram&quot; designe historiquement un entrelacement
                  artistique de plusieurs lettres (signature noble, broderie). Les &quot;initials avatars&quot; modernes (Slack, Gmail, Asana)
                  sont plus simples : 1 ou 2 lettres dans une forme colorisee. Notre outil produit ce format moderne, qui s&apos;integre
                  naturellement dans toutes les UI web et mobiles standards.
                </p>
                <p>
                  <strong>SVG vs PNG : performance.</strong> Cet outil exporte en PNG pour la compatibilite maximale (uploadable
                  partout : Slack, GitHub, LinkedIn, CRM). Pour vos propres apps, generer du SVG inline cote serveur est plus
                  performant : un avatar SVG pese 200 a 500 octets contre 5 a 20 ko pour un PNG, et reste vectoriel donc parfait
                  sur ecran Retina sans surcout de bande passante.
                </p>
                <p>
                  <strong>RGPD et droit a l&apos;image.</strong> Un avatar a initiales ne contient aucune donnee biometrique : il
                  n&apos;est donc pas soumis aux regles strictes du RGPD sur les images de visage. Vous pouvez l&apos;afficher
                  publiquement, le commercialiser, l&apos;inclure dans une newsletter sans recueillir de consentement specifique
                  (contrairement a une photo de visage). C&apos;est aussi une option pour les enfants ou les ados sur les apps grand
                  public.
                </p>
                <p>
                  <strong>Confidentialite locale.</strong> Le rendu est effectue par Canvas2D dans votre navigateur. Aucune
                  initiale, aucun nom saisi n&apos;est envoye sur internet, journalise ou stocke. L&apos;outil fonctionne hors ligne
                  une fois la page chargee. Aucun watermark, aucune limite, libre de droits commerciaux.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur la generation d&apos;avatars a initiales."
              items={[
                {
                  question: "Quelle taille choisir pour mon avatar ?",
                  answer:
                    "64 ou 128 px pour des listes denses (CRM, forum, table d&apos;utilisateurs). 256 px pour un profil web standard ou les reseaux sociaux. 512 px pour les ecrans haute densite Retina, 4K, ou pour de l&apos;impression. Le PNG genere reste net jusqu&apos;a doubler la taille d&apos;affichage cible.",
                },
                {
                  question: "PNG ou SVG, lequel est mieux ?",
                  answer:
                    "Le PNG est universellement compatible (Slack, LinkedIn, GitHub, CRM acceptent tous PNG ; certains refusent SVG pour raisons de securite). Le SVG est plus leger (200 a 500 octets contre 5 a 20 ko) et reste net a toute taille. Pour vos propres apps, generez SVG cote backend ; pour uploader sur un service tiers, restez en PNG.",
                },
                {
                  question: "Puis-je utiliser l&apos;avatar a des fins commerciales ?",
                  answer:
                    "Oui sans restriction. Les avatars generes sont libres de droits, sans watermark, sans tracking. Vous pouvez les utiliser dans des produits payants, des supports marketing, des packagings, des t-shirts. Les couleurs et formes sont des elements graphiques basiques non protegeables.",
                },
                {
                  question: "L&apos;avatar a-t-il un fond transparent ?",
                  answer:
                    "Le PNG genere possede un fond transparent autour de la forme (cercle ou carre arrondi). Seule la forme contient la couleur. Pour un carre simple, toute la surface est coloree. Vous pouvez integrer l&apos;avatar sur n&apos;importe quel arriere-plan sans ressautes visibles.",
                },
                {
                  question: "Avatar a initiales et RGPD ?",
                  answer:
                    "Un avatar a initiales n&apos;est pas une donnee biometrique : il n&apos;est donc pas soumis aux contraintes strictes du RGPD sur les images de visage. Vous pouvez l&apos;afficher publiquement sans consentement specifique. C&apos;est une bonne pratique pour les enfants, les comptes pseudonymes ou les apps qui veulent eviter tout traitement de visage.",
                },
                {
                  question: "Comment generer plusieurs avatars d&apos;un coup ?",
                  answer:
                    "L&apos;outil produit un avatar a la fois. Pour batcher (creer 50 avatars d&apos;equipe par exemple), reproduisez la logique en SVG dans un script Node.js : 30 lignes de code suffisent (canvas Node + parameters par utilisateur). Pour un trombinoscope ponctuel, dupliquer rapidement via la page reste la voie la plus simple.",
                },
                {
                  question: "Mes donnees (nom, email) sont-elles envoyees ?",
                  answer:
                    "Non. Tout le rendu est effectue par Canvas2D dans votre navigateur. Aucune information n&apos;est transmise au serveur. Vous pouvez ouvrir l&apos;onglet Reseau des outils developpeur pour le verifier : aucune requete reseau n&apos;est emise lorsque vous tapez un nom ou cliquez sur Telecharger.",
                },
              ]}
            />
          </div>
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
