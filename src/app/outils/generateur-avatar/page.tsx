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
  { id: "rounded", label: "Carré arrondi" },
  { id: "square", label: "Carré" },
];

const SIZES = [64, 128, 256, 512];

/** Police identique pour l'aperçu et l'export PNG (Canvas2D ne charge pas les polices du site). */
const AVATAR_FONT = "Arial, Helvetica, sans-serif";

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    // Array.from découpe par caractère Unicode (évite de couper un emoji ou une lettre hors BMP)
    .map((w) => (Array.from(w)[0] || "").toLocaleUpperCase("fr-FR"))
    .slice(0, 2)
    .join("");
}

/** Nom de fichier sûr : lettres sans accents, chiffres et tirets uniquement. */
function fileSlug(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "initiales";
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
    ctx.font = `bold ${size * (fontSize / 100)}px ${AVATAR_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initials, size / 2, size / 2 + size * 0.02);

    const link = document.createElement("a");
    link.download = `avatar-${fileSlug(initials)}-${size}px.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [size, color, style, fontSize, initials]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Design</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Générateur d&apos;<span style={{ color: "var(--primary)" }}>avatar</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Créez un avatar avec vos initiales. Choisissez la couleur, le style et téléchargez-le en PNG.
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
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taille de police (%)</label>
                  <input type="range" min="20" max="60" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
                    className="mt-4 w-full" />
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{fontSize}%</span>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Aperçu</p>
              <div className="mt-6 flex justify-center">
                <div className="flex items-center justify-center text-white font-bold"
                  style={{ width: "200px", height: "200px", background: color, borderRadius, fontSize: `${200 * (fontSize / 100)}px`, fontFamily: AVATAR_FONT }}>
                  {initials}
                </div>
              </div>
              <button onClick={drawAndDownload}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                Télécharger en PNG ({size}x{size})
              </button>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <ToolHowToSection
              title="Comment créer un avatar à initiales en 3 étapes"
              description="L’image est dessinée localement par Canvas2D : aucun envoi du nom saisi, aucun compte, aucun filigrane. Vous repartez avec un PNG prêt pour vos profils ou maquettes."
              steps={[
                {
                  name: "Saisir le nom complet",
                  text:
                    "Tapez le nom complet (Prénom Nom) : l'outil extrait automatiquement les deux premières initiales en majuscules. Pour un prénom composé, écrivez-le tel quel : Anne-Sophie Martin donne AM. Si vous ne tapez qu'un seul mot, seule sa première lettre est utilisée.",
                },
                {
                  name: "Choisir couleur et forme",
                  text:
                    "12 couleurs prédéfinies couvrent les palettes pro classiques. Pour une cohérence graphique, choisissez la plus proche de votre charte. Côté forme, le cercle est le format le plus courant des avatars web, le carré arrondi rappelle les icônes d'applications, le carré simple convient aux interfaces qui appliquent leur propre masque.",
                },
                {
                  name: "Ajuster la taille et télécharger",
                  text:
                    "64 ou 128 px pour des listes denses (CRM, forum), 256 px pour un profil web standard, 512 px pour les écrans haute densité (Retina, 4K) ou les supports imprimés. Cliquez sur Télécharger en PNG : le nom du fichier reprend les initiales et la taille, prêt à être importé sur votre service.",
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
                Cas d&apos;usage de l&apos;avatar à initiales
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Équipe SaaS sans photos pro
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Page &quot;À propos&quot; ou trombinoscope client : tous les membres n&apos;ont pas de photo prête. Générez 5 à 10 avatars
                    cohérents (même palette, même forme) pour éviter le mélange &quot;photo HD + selfie pixelisé&quot; et garder une présentation
                    pro homogène.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Maquette Figma ou Sketch
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Fini les photos de banque d&apos;images gênantes dans vos démos client : générez quelques avatars (Anna L,
                    Bertrand M, Clara P...) et glissez-les dans vos composants Card, ListItem, Comment. Plus rapide qu&apos;une recherche
                    de photos et sans question de droit à l&apos;image.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Avatar par défaut d&apos;app
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Quand un nouvel utilisateur s&apos;inscrit sans photo, générez côté serveur un avatar à initiales avec
                    une couleur déterministe (hachage de l&apos;identifiant). Le rendu reste personnalisé et évite la silhouette anonyme.
                    La logique (initiales + forme + couleur) se reproduit en quelques lignes en JS ou en Python.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Compte pro sans photo personnelle
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Slack, Notion, Linear, GitHub : pour les utilisateurs qui préfèrent ne pas afficher leur visage (consultants
                    externes, profils pseudonymes), l&apos;avatar à initiales est une alternative pro sobre à l&apos;avatar par
                    défaut générique, sans recourir à un faux visage généré par IA.
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
                À savoir : design, performance et droit
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Monogramme ou initiales ?</strong> Un monogramme désigne historiquement un entrelacement
                  artistique de plusieurs lettres (sceau, broderie). Les avatars à initiales modernes (Slack, Gmail, Asana)
                  sont plus simples : 1 ou 2 lettres dans une forme colorée. Notre outil produit ce format, qui s&apos;intègre
                  naturellement dans les interfaces web et mobiles.
                </p>
                <p>
                  <strong>SVG ou PNG : performance.</strong> Cet outil exporte en PNG pour une compatibilité maximale (accepté
                  presque partout : Slack, GitHub, LinkedIn, CRM). Pour vos propres applications, générer du SVG côté serveur est plus
                  léger : un avatar SVG pèse quelques centaines d&apos;octets contre quelques kilo-octets pour un PNG, et reste net
                  sur écran Retina.
                </p>
                <p>
                  <strong>RGPD et droit à l&apos;image.</strong> Un avatar à initiales ne reproduit pas le visage : il ne soulève
                  donc pas les questions de droit à l&apos;image propres à une photo. En revanche, dès qu&apos;il est associé à une
                  personne identifiable (nom, compte utilisateur), il reste une donnée personnelle au sens du RGPD : son affichage
                  doit reposer sur une base légale et respecter les droits de la personne. C&apos;est une option plus discrète
                  qu&apos;une photo, notamment pour les mineurs sur les applications grand public.
                </p>
                <p>
                  <strong>Confidentialité locale.</strong> Le rendu est effectué par Canvas2D dans votre navigateur : le nom saisi
                  et les initiales ne sont ni envoyés à un serveur, ni stockés. Comme le reste du site, la page utilise Google
                  Analytics (mesure d&apos;audience) et Google AdSense, qui ne reçoivent pas le nom saisi. Aucun filigrane,
                  aucune limite.
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus posées sur la génération d’avatars à initiales."
              items={[
                {
                  question: "Quelle taille choisir pour mon avatar ?",
                  answer:
                    "64 ou 128 px pour des listes denses (CRM, forum, table d'utilisateurs). 256 px pour un profil web standard ou les réseaux sociaux. 512 px pour les écrans haute densité (Retina, 4K) ou pour l'impression. Pour un rendu net, choisissez une taille au moins égale à deux fois la taille d'affichage.",
                },
                {
                  question: "PNG ou SVG, lequel est mieux ?",
                  answer:
                    "Le PNG est presque universellement accepté (Slack, LinkedIn, GitHub, CRM) ; certains services refusent le SVG pour des raisons de sécurité. Le SVG est plus léger et reste net à toute taille. Pour vos propres applications, générez du SVG côté serveur ; pour importer sur un service tiers, restez en PNG.",
                },
                {
                  question: "Puis-je utiliser l'avatar à des fins commerciales ?",
                  answer:
                    "Oui. Outilis.fr ne revendique aucun droit sur les images générées et n'y ajoute aucun filigrane. Vous pouvez les utiliser dans des produits payants ou des supports marketing. Si l'avatar représente une personne réelle (ses initiales associées à son nom), respectez ses droits sur ses données personnelles.",
                },
                {
                  question: "L'avatar a-t-il un fond transparent ?",
                  answer:
                    "Oui : le PNG généré a un fond transparent autour de la forme (cercle ou carré arrondi) ; seule la forme est colorée. Pour un carré simple, toute la surface est colorée. Vous pouvez placer l'avatar sur n'importe quel arrière-plan sans coins blancs visibles.",
                },
                {
                  question: "Avatar à initiales et RGPD ?",
                  answer:
                    "Un avatar à initiales n'est pas une donnée biométrique et ne reproduit pas le visage. Mais s'il est rattaché à une personne identifiable (nom, compte), il reste une donnée personnelle : les règles habituelles du RGPD s'appliquent (base légale, information, droits). C'est une solution plus discrète qu'une photo pour les mineurs, les comptes pseudonymes ou les applications qui veulent éviter de traiter des visages.",
                },
                {
                  question: "Comment générer plusieurs avatars d'un coup ?",
                  answer:
                    "L'outil produit un avatar à la fois. Pour en créer beaucoup (50 avatars d'équipe par exemple), reproduisez la logique en SVG dans un script : quelques dizaines de lignes suffisent (initiales, forme et couleur par utilisateur). Pour un trombinoscope ponctuel, enchaîner les téléchargements depuis cette page reste le plus simple.",
                },
                {
                  question: "Le nom que je saisis est-il envoyé ?",
                  answer:
                    "Non. Tout le rendu est effectué par Canvas2D dans votre navigateur : le nom saisi n'est transmis à aucun serveur. Comme sur le reste du site, Google Analytics enregistre un simple événement d'utilisation de l'outil (sans le contenu saisi) et Google AdSense peut charger des publicités ; vous verrez donc ces requêtes dans l'onglet Réseau des outils de développement, mais aucune ne contient votre nom.",
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
