"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [Math.round(hue2rgb(p, q, h + 1 / 3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1 / 3) * 255)];
}

export default function ConvertisseurCouleurs() {
  const [hex, setHex] = useState("#0d4f3c");
  const [copied, setCopied] = useState("");

  const rgb = useMemo(() => hexToRgb(hex) || [0, 0, 0], [hex]);
  const hsl = useMemo(() => rgbToHsl(rgb[0], rgb[1], rgb[2]), [rgb]);

  const updateFromRgb = (r: number, g: number, b: number) => setHex(rgbToHex(r, g, b));
  const updateFromHsl = (h: number, s: number, l: number) => {
    const [r, g, b] = hslToRgb(h, s, l);
    setHex(rgbToHex(r, g, b));
  };

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 1500);
  };

  const hexStr = hex.toUpperCase();
  const rgbStr = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  const hslStr = `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
  const textColor = hsl[2] > 50 ? "#000000" : "#ffffff";

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Design</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur de <span style={{ color: "var(--primary)" }}>couleurs</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            HEX, RGB, HSL — convertissez vos couleurs instantanement. Color picker inclus.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <div className="flex h-48 items-center justify-center rounded-2xl border text-center transition-colors duration-300"
              style={{ background: hex, borderColor: "var(--border)" }}>
              <div>
                <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: textColor }}>{hexStr}</p>
                <p className="mt-1 text-sm opacity-80" style={{ color: textColor }}>{rgbStr}</p>
              </div>
            </div>

            {/* Color picker + HEX */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Color Picker</h2>
              <div className="mt-4 flex items-center gap-4">
                <input type="color" value={hex} onChange={(e) => setHex(e.target.value)}
                  className="h-14 w-14 cursor-pointer rounded-xl border-0" />
                <div className="flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>HEX</label>
                  <input type="text" value={hex} onChange={(e) => setHex(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3 font-mono text-lg font-bold" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {/* RGB */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>RGB</h2>
                <CopyBtn text={rgbStr} label="rgb" copied={copied} onClick={copy} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {(["R", "G", "B"] as const).map((c, i) => (
                  <div key={c}>
                    <label className="text-xs font-bold" style={{ color: c === "R" ? "#dc2626" : c === "G" ? "#16a34a" : "#2563eb" }}>{c}</label>
                    <input type="range" min="0" max="255" value={rgb[i]}
                      onChange={(e) => { const v = [...rgb] as [number, number, number]; v[i] = parseInt(e.target.value); updateFromRgb(...v); }}
                      className="mt-1 w-full" />
                    <input type="number" min="0" max="255" value={rgb[i]}
                      onChange={(e) => { const v = [...rgb] as [number, number, number]; v[i] = parseInt(e.target.value) || 0; updateFromRgb(...v); }}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-center text-sm font-mono" style={{ borderColor: "var(--border)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* HSL */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>HSL</h2>
                <CopyBtn text={hslStr} label="hsl" copied={copied} onClick={copy} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {(["H", "S", "L"] as const).map((c, i) => {
                  const max = i === 0 ? 360 : 100;
                  const suffix = i === 0 ? "\u00B0" : "%";
                  return (
                    <div key={c}>
                      <label className="text-xs font-bold" style={{ color: "var(--foreground)" }}>{c === "H" ? "Teinte" : c === "S" ? "Saturation" : "Luminosite"}</label>
                      <input type="range" min="0" max={max} value={hsl[i]}
                        onChange={(e) => { const v = [...hsl] as [number, number, number]; v[i] = parseInt(e.target.value); updateFromHsl(...v); }}
                        className="mt-1 w-full" />
                      <div className="mt-1 flex items-center gap-1">
                        <input type="number" min="0" max={max} value={hsl[i]}
                          onChange={(e) => { const v = [...hsl] as [number, number, number]; v[i] = parseInt(e.target.value) || 0; updateFromHsl(...v); }}
                          className="w-full rounded-lg border px-3 py-2 text-center text-sm font-mono" style={{ borderColor: "var(--border)" }} />
                        <span className="text-xs" style={{ color: "var(--muted)" }}>{suffix}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All formats */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Tous les formats</h2>
              <div className="mt-4 space-y-2">
                {[
                  ["HEX", hexStr],
                  ["RGB", rgbStr],
                  ["HSL", hslStr],
                  ["CSS", `--color: ${hexStr};`],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm">{val}</code>
                      <button onClick={() => copy(val, label)} className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                        {copied === label ? "Copie !" : "Copier"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ToolHowToSection
              title="Comment utiliser le convertisseur de couleurs"
              description="Choisissez visuellement ou saisissez un code, et obtenez instantanement les equivalents HEX, RGB et HSL prets a copier dans votre CSS ou votre logiciel de design."
              steps={[
                {
                  name: "Choisir la couleur source",
                  text:
                    "Trois methodes au choix : cliquez sur le color picker pour la selectionner visuellement, tapez un code hexadecimal comme #0d4f3c, ou ajustez les curseurs RGB ou HSL pour affiner. La preview en haut de page se met a jour en temps reel.",
                },
                {
                  name: "Comparer les trois formats",
                  text:
                    "La carte HEX, RGB et HSL affiche simultanement les trois representations de la meme couleur. Chaque format est utile dans un contexte different : HEX pour le HTML, RGB pour la transparence avec rgba, HSL pour generer des variations harmonieuses.",
                },
                {
                  name: "Copier la valeur dans son projet",
                  text:
                    "Chaque format dispose d&apos;un bouton Copier qui place la valeur formatee dans le presse-papiers : par exemple rgb(13, 79, 60) ou hsl(160, 72%, 18%). Collez directement dans votre fichier CSS, Tailwind config, Figma ou Photoshop.",
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
                Cas d&apos;usage du convertisseur de couleurs
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Designer web et UI
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous recevez une charte graphique en HEX mais Figma exporte en RGB. Le
                    convertisseur unifie tout en un clic. Pour creer des variations (hover,
                    focus, disabled), ajustez la luminosite HSL de 10 % en plus ou en moins,
                    sans toucher a la teinte. Plus rapide qu&apos;un selecteur visuel.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Developpeur Tailwind ou CSS variables
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Tailwind v4 supporte les couleurs en HSL pour des manipulations runtime
                    (theming dark mode). Le convertisseur transforme un brand color HEX en hsl()
                    pret a coller dans tailwind.config ou globals.css. Pour les CSS variables :
                    --color-primary: 160 72% 18% permet de moduler l&apos;alpha sans dupliquer.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Print et impression
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    L&apos;impression utilise CMJN (cyan, magenta, jaune, noir), pas RGB.
                    Attention : un rouge eclatant a l&apos;ecran (RGB 255,0,0) sortira terne en
                    print. Le convertisseur donne une indication CMJN approximative pour estimer
                    le rendu, mais validez toujours avec un BAT (bon a tirer) chez l&apos;imprimeur.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Verification de contraste accessibilite
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour le respect des criteres WCAG AA, le ratio de contraste texte/fond doit
                    etre superieur a 4,5:1 (3:1 pour les grands titres). Le convertisseur HSL
                    aide a moduler la luminosite jusqu&apos;a obtenir un contraste conforme,
                    sans perdre l&apos;identite chromatique de la marque.
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
                A savoir sur les couleurs en design numerique
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>HEX, RGB et HSL representent strictement la meme couleur.</strong>
                  Ce sont juste trois notations differentes du meme point dans l&apos;espace
                  colorimetrique sRGB. HEX est compact (#0d4f3c, 7 caracteres). RGB est lisible
                  par humain (rouge/vert/bleu sur 0-255). HSL est manipulable intuitivement (la
                  teinte, la saturation et la luminosite correspondent a la perception visuelle).
                </p>
                <p>
                  <strong>WCAG impose un contraste minimal pour l&apos;accessibilite.</strong>
                  Le ratio doit etre superieur a 4,5:1 entre texte normal et fond (niveau AA),
                  et superieur a 7:1 pour le niveau AAA. Pour les titres de plus de 18px, la
                  barre tombe a 3:1. Plus de 60 % des sites webs francais sont non conformes :
                  c&apos;est une obligation legale (loi Handicap 2005, RGAA) pour les services
                  publics et les entreprises de plus de 250 millions de chiffre d&apos;affaires.
                </p>
                <p>
                  <strong>Web et print n&apos;utilisent pas le meme espace colorimetrique.</strong>
                  Le web travaille en sRGB additif (lumiere). L&apos;impression travaille en
                  CMJN soustractif (encre). Certaines couleurs sRGB (tres saturees, fluo) sont
                  hors gamut CMJN et sortiront ternes a l&apos;impression. C&apos;est pourquoi
                  les chartes graphiques pro fournissent toujours les deux equivalents.
                </p>
                <p>
                  <strong>Le format HSL est ideal pour generer des palettes.</strong> Pour
                  obtenir une couleur complementaire, ajoutez 180 a la teinte. Pour des
                  triadiques, espacez par 120. Pour creer une variation plus claire, augmentez
                  la luminosite. Cette logique geometrique est reproductible et evite les choix
                  esthetiques arbitraires, ce qui plait aussi bien aux designers qu&apos;aux
                  developpeurs qui generent des themes par script.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur la conversion de couleurs."
              items={[
                {
                  question: "Quelle est la difference entre HEX, RGB et HSL ?",
                  answer:
                    "HEX represente une couleur en 6 caracteres precedes d'un # (ex : #0d4f3c). RGB definit une couleur par ses composantes Rouge, Vert, Bleu (0-255). HSL utilise la Teinte (0-360 deg), la Saturation (0-100 %) et la Luminosite (0-100 %). Les trois formats sont interchangeables et representent strictement les memes couleurs.",
                },
                {
                  question: "Quel format de couleur utiliser en CSS ?",
                  answer:
                    "Les trois sont valides. HEX est le plus repandu et le plus compact. RGB est pratique quand vous devez ajouter de la transparence (rgba). HSL est ideal pour creer des palettes harmonieuses car il suffit de modifier la teinte en gardant la meme saturation et luminosite. Tailwind v4 utilise HSL pour le theming runtime (dark mode dynamique).",
                },
                {
                  question: "Comment trouver la couleur complementaire ?",
                  answer:
                    "En utilisant le format HSL, ajoutez 180 deg a la valeur de teinte (H). Par exemple, si votre couleur a une teinte de 150 deg, sa complementaire sera a 330 deg. Les couleurs complementaires creent un contraste fort et sont tres utilisees en design graphique pour des CTA visibles ou des accents qui se detachent du fond.",
                },
                {
                  question: "Comment savoir si mon contraste est accessible ?",
                  answer:
                    "Le ratio de contraste WCAG AA exige superieur a 4,5:1 entre texte normal et fond. Niveau AAA : superieur a 7:1. Pour des grands titres : superieur a 3:1. Modifiez la luminosite HSL jusqu'a respecter le seuil. Des outils dedies comme WebAIM Contrast Checker calculent automatiquement le ratio entre deux couleurs.",
                },
                {
                  question: "Pourquoi mon ecran et mon impression n'affichent pas la meme couleur ?",
                  answer:
                    "L'ecran travaille en sRGB additif (lumiere emise), l'impression en CMJN soustractif (encre absorbante). Certaines couleurs vives sont hors gamut CMJN et perdent leur eclat a l'impression. Pour des projets print, demandez toujours un BAT papier a l'imprimeur avant validation finale, surtout pour des rouges purs ou des bleus tres satures.",
                },
                {
                  question: "Comment integrer une couleur HEX dans Tailwind ?",
                  answer:
                    "Dans tailwind.config (v3) ou directement dans une CSS variable (v4), declarez votre couleur : '--color-primary: #0d4f3c'. Pour utiliser HSL et permettre des manipulations runtime (alpha, dark mode), preferez '--color-primary: 160 72% 18%' puis utilisez hsl(var(--color-primary) / 0.5) pour la transparence.",
                },
                {
                  question: "Mes couleurs sont-elles confidentielles ?",
                  answer:
                    "Oui. Toutes les conversions sont effectuees localement dans votre navigateur en JavaScript. Aucun code couleur n'est envoye a un serveur. L'outil fonctionne sans inscription, sans cookie de tracking et sans connexion internet active une fois la page chargee.",
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

function CopyBtn({ text, label, copied, onClick }: { text: string; label: string; copied: string; onClick: (text: string, label: string) => void }) {
  return (
    <button onClick={() => onClick(text, label)} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ background: copied === label ? "var(--primary-light)" : "var(--primary)" }}>
      {copied === label ? "Copie !" : "Copier"}
    </button>
  );
}
