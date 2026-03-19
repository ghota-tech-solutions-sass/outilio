"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

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
            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le convertisseur de couleurs
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Ce convertisseur de couleurs gratuit vous permet de passer instantanement entre les formats HEX, RGB et HSL. Que vous soyez designer, developpeur web ou simplement curieux, l&apos;outil vous donne toutes les valeurs dont vous avez besoin en un clic.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Utilisez le color picker</strong> : cliquez sur le selecteur de couleur pour choisir visuellement la teinte souhaitee.</li>
                  <li><strong className="text-[var(--foreground)]">Saisissez un code HEX</strong> : entrez directement un code hexadecimal comme #0d4f3c pour obtenir ses equivalents RGB et HSL.</li>
                  <li><strong className="text-[var(--foreground)]">Ajustez via les curseurs</strong> : modifiez les composantes Rouge, Vert, Bleu (RGB) ou Teinte, Saturation, Luminosite (HSL) avec les curseurs interactifs.</li>
                  <li><strong className="text-[var(--foreground)]">Copiez les valeurs</strong> : chaque format dispose d&apos;un bouton de copie pour coller directement la valeur dans votre code CSS ou votre logiciel de design.</li>
                </ul>
                <p>
                  L&apos;apercu en temps reel affiche la couleur selectionnee avec le code correspondant, ce qui facilite le choix exact de la teinte pour vos projets web, graphiques ou d&apos;impression.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la difference entre HEX, RGB et HSL ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    HEX (hexadecimal) represente une couleur avec 6 caracteres precedee d&apos;un # (ex : #0d4f3c). RGB definit une couleur par ses composantes Rouge, Vert et Bleu (0-255). HSL utilise la Teinte (0-360&deg;), la Saturation (0-100 %) et la Luminosite (0-100 %). Les trois formats sont interchangeables et representent les memes couleurs.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel format de couleur utiliser en CSS ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Les trois formats sont valides en CSS. Le HEX est le plus repandu et le plus compact. Le RGB est pratique quand vous devez ajouter de la transparence (rgba). Le HSL est ideal pour creer des palettes harmonieuses car il suffit de modifier la teinte tout en gardant la meme saturation et luminosite.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment trouver la couleur complementaire ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    En utilisant le format HSL, ajoutez 180&deg; a la valeur de teinte (H) pour obtenir la couleur complementaire. Par exemple, si votre couleur a une teinte de 150&deg;, sa complementaire sera a 330&deg;. Les couleurs complementaires creent un contraste fort et sont tres utilisees en design graphique.
                  </p>
                </div>
              </div>
            </div>
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
