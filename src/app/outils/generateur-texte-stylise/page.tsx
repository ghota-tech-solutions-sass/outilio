"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

interface Style {
  label: string;
  icon: string;
  transform: (text: string) => string;
}

const boldMap: Record<string, string> = {};
const italicMap: Record<string, string> = {};
const boldItalicMap: Record<string, string> = {};
const monoMap: Record<string, string> = {};
const bubbleMap: Record<string, string> = {};
const bubbleFilledMap: Record<string, string> = {};
const squareMap: Record<string, string> = {};
const scriptMap: Record<string, string> = {};

// Build character maps
const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const digits = "0123456789";

// Bold Serif: U+1D400 (upper), U+1D41A (lower), U+1D7CE (digits)
for (let i = 0; i < 26; i++) {
  boldMap[upper[i]] = String.fromCodePoint(0x1d400 + i);
  boldMap[lower[i]] = String.fromCodePoint(0x1d41a + i);
}
for (let i = 0; i < 10; i++) boldMap[digits[i]] = String.fromCodePoint(0x1d7ce + i);

// Italic Serif: U+1D434 (upper), U+1D44E (lower)
for (let i = 0; i < 26; i++) {
  italicMap[upper[i]] = String.fromCodePoint(0x1d434 + i);
  italicMap[lower[i]] = String.fromCodePoint(0x1d44e + i);
}
// italic h exception
italicMap["h"] = "\u210E";

// Bold Italic: U+1D468 (upper), U+1D482 (lower)
for (let i = 0; i < 26; i++) {
  boldItalicMap[upper[i]] = String.fromCodePoint(0x1d468 + i);
  boldItalicMap[lower[i]] = String.fromCodePoint(0x1d482 + i);
}

// Monospace: U+1D670 (upper), U+1D68A (lower), U+1D7F6 (digits)
for (let i = 0; i < 26; i++) {
  monoMap[upper[i]] = String.fromCodePoint(0x1d670 + i);
  monoMap[lower[i]] = String.fromCodePoint(0x1d68a + i);
}
for (let i = 0; i < 10; i++) monoMap[digits[i]] = String.fromCodePoint(0x1d7f6 + i);

// Bubble (circled): U+24B6 (upper), U+24D0 (lower), special for digits
for (let i = 0; i < 26; i++) {
  bubbleMap[upper[i]] = String.fromCodePoint(0x24b6 + i);
  bubbleMap[lower[i]] = String.fromCodePoint(0x24d0 + i);
}
bubbleMap["0"] = "\u24EA";
for (let i = 1; i < 10; i++) bubbleMap[digits[i]] = String.fromCodePoint(0x2460 + i - 1);

// Bubble filled (negative circled): U+1F150 (upper)
for (let i = 0; i < 26; i++) {
  bubbleFilledMap[upper[i]] = String.fromCodePoint(0x1f150 + i);
  bubbleFilledMap[lower[i]] = String.fromCodePoint(0x1f150 + i);
}

// Square: U+1F130 (upper)
for (let i = 0; i < 26; i++) {
  squareMap[upper[i]] = String.fromCodePoint(0x1f130 + i);
  squareMap[lower[i]] = String.fromCodePoint(0x1f130 + i);
}

// Script (mathematical): U+1D49C (upper), U+1D4B6 (lower).
// Some letters are "holes" in this block (reserved code points): they were
// encoded earlier in Letterlike Symbols and must be taken from there.
for (let i = 0; i < 26; i++) {
  scriptMap[upper[i]] = String.fromCodePoint(0x1d49c + i);
  scriptMap[lower[i]] = String.fromCodePoint(0x1d4b6 + i);
}
Object.assign(scriptMap, {
  B: "\u212C", E: "\u2130", F: "\u2131", H: "\u210B", I: "\u2110", L: "\u2112", M: "\u2133", R: "\u211B",
  e: "\u212F", g: "\u210A", o: "\u2134",
});

// Accented letters have no styled version in Unicode. After NFD normalization,
// "é" becomes "e" + combining acute accent: the base letter is styled and the
// accent is kept as a combining mark (rendering depends on the font/app).
function applyMap(text: string, map: Record<string, string>): string {
  return Array.from(text.normalize("NFD")).map((ch) => map[ch] || ch).join("");
}

// Splits into user-perceived characters (base + combining marks, emoji sequences)
function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return Array.from(new Intl.Segmenter("fr", { granularity: "grapheme" }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

function strikethrough(text: string): string {
  return graphemes(text).map((ch) => ch + "\u0336").join("");
}

function underline(text: string): string {
  return graphemes(text).map((ch) => ch + "\u0332").join("");
}

function upsideDown(text: string): string {
  const map: Record<string, string> = {
    a: "\u0250", b: "q", c: "\u0254", d: "p", e: "\u01DD", f: "\u025F",
    g: "\u0253", h: "\u0265", i: "\u0131", j: "\u027E", k: "\u029E", l: "l",
    m: "\u026F", n: "u", o: "o", p: "d", q: "b", r: "\u0279",
    s: "s", t: "\u0287", u: "n", v: "\u028C", w: "\u028D", x: "x",
    y: "\u028E", z: "z",
    A: "\u2200", B: "\u{10412}", C: "\u0186", D: "\u15E1", E: "\u018E", F: "\u2132",
    G: "\u2141", H: "H", I: "I", J: "\u017F", K: "\u22CA", L: "\u2142",
    M: "W", N: "N", O: "O", P: "\u0500", Q: "\u038C", R: "\u1D1A",
    S: "S", T: "\u22A5", U: "\u2229", V: "\u039B", W: "M", X: "X",
    Y: "\u2144", Z: "Z",
    "1": "\u0196", "2": "\u1105", "3": "\u0190", "4": "\u3123", "5": "\u03DB",
    "6": "9", "7": "\u3125", "8": "8", "9": "6", "0": "0",
    ".": "\u02D9", ",": "\u02BB", "?": "\u00BF", "!": "\u00A1",
    "'": ",", '"': "\u201E",
  };
  // Accents are dropped (no upside-down accented letters); graphemes are reversed
  // as a whole so that emojis and combining marks are not broken apart.
  return graphemes(text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    .reverse()
    .map((ch) => map[ch] || ch)
    .join("");
}

function smallCaps(text: string): string {
  const map: Record<string, string> = {
    a: "\u1D00", b: "\u0299", c: "\u1D04", d: "\u1D05", e: "\u1D07", f: "\uA730",
    g: "\u0262", h: "\u029C", i: "\u026A", j: "\u1D0A", k: "\u1D0B", l: "\u029F",
    m: "\u1D0D", n: "\u0274", o: "\u1D0F", p: "\u1D18", q: "\u0071", r: "\u0280",
    s: "\uA731", t: "\u1D1B", u: "\u1D1C", v: "\u1D20", w: "\u1D21", x: "\u0078",
    y: "\u028F", z: "\u1D22",
  };
  return Array.from(text.normalize("NFD")).map((ch) => map[ch] || ch).join("");
}

const STYLES: Style[] = [
  { label: "Gras (Bold)", icon: "\u{1D5D5}", transform: (t) => applyMap(t, boldMap) },
  { label: "Italique", icon: "\u{1D448}", transform: (t) => applyMap(t, italicMap) },
  { label: "Gras italique", icon: "\u{1D46E}", transform: (t) => applyMap(t, boldItalicMap) },
  { label: "Monospace", icon: "\u{1D688}", transform: (t) => applyMap(t, monoMap) },
  { label: "Barré", icon: "a\u0336b\u0336", transform: strikethrough },
  { label: "Souligné", icon: "a\u0332b\u0332", transform: underline },
  { label: "Bulle", icon: "\u24B6", transform: (t) => applyMap(t, bubbleMap) },
  { label: "Bulle pleine", icon: "\u{1F150}", transform: (t) => applyMap(t, bubbleFilledMap) },
  { label: "Carré", icon: "\u{1F130}", transform: (t) => applyMap(t, squareMap) },
  { label: "Script", icon: "\u{1D49C}", transform: (t) => applyMap(t, scriptMap) },
  { label: "À l'envers", icon: "\u0250", transform: upsideDown },
  { label: "Petites capitales", icon: "\u1D00", transform: smallCaps },
];

export default function GenerateurTexteStylise() {
  const [text, setText] = useState("Bonjour le monde !");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const results = useMemo(() => {
    return STYLES.map((style) => ({
      ...style,
      result: style.transform(text),
    }));
  }, [text]);

  const copyToClipboard = (str: string, index: number) => {
    navigator.clipboard.writeText(str);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Texte</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Générateur de <span style={{ color: "var(--primary)" }}>texte stylisé</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez votre texte en caractères Unicode stylisés. Copiez et collez sur les réseaux sociaux, bios, messages.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Votre texte</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="mt-4 w-full resize-none rounded-xl border px-4 py-3 text-lg font-bold"
                style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                placeholder="Tapez votre texte ici..."
              />
            </div>

            {/* Results */}
            <div className="space-y-3">
              {results.map((style, i) => (
                <div key={i} className="group flex items-center gap-4 rounded-2xl border p-4 transition-all hover:shadow-md"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{style.label}</p>
                    <p className="mt-1 truncate text-lg">{style.result}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(style.result, i)}
                    className="shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all"
                    style={{
                      background: copiedIndex === i ? "var(--primary)" : "var(--surface-alt)",
                      color: copiedIndex === i ? "white" : "var(--muted)",
                    }}>
                    {copiedIndex === i ? "Copié !" : "Copier"}
                  </button>
                </div>
              ))}
            </div>

            <ToolHowToSection
              title="Comment utiliser le générateur de texte stylisé"
              description="Trois étapes pour obtenir un texte avec des polices Unicode et le coller partout."
              steps={[
                {
                  name: "Tapez ou collez votre texte",
                  text:
                    "Saisissez le texte à transformer dans la zone de saisie : votre nom, une bio Instagram, un titre de tweet, un slogan. La transformation s'effectue en temps réel, vous voyez immédiatement les 12 styles disponibles dans la liste juste en dessous.",
                },
                {
                  name: "Comparez les 12 styles disponibles",
                  text:
                    "L'outil propose : gras, italique, gras italique, monospace, barré, souligné, bulle, bulle pleine, carré, script, à l'envers et petites capitales. Chaque style utilise un bloc Unicode différent (Mathematical Alphanumeric Symbols, Enclosed Alphanumerics, etc.) qui s'affiche sur la plupart des plateformes modernes.",
                },
                {
                  name: "Copiez et collez sur la plateforme cible",
                  text:
                    "Cliquez sur Copier à côté du style choisi. Le texte stylisé est dans le presse-papier, prêt à coller dans une bio Instagram, Twitter, TikTok, Discord, WhatsApp ou un email. Pas besoin d'application, l'effet visuel est porté par les caractères Unicode eux-mêmes.",
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
                Cas d&apos;usage du texte stylisé Unicode
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Créateur de contenu Instagram
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Personnaliser sa bio Instagram avec des polices stylisées attire l&apos;œil et
                    distingue le profil. Particulièrement utile pour les comptes lifestyle, mode,
                    creators et coachs : un nom ou un titre en gras italique ou en script se
                    remarque davantage dans une liste de profils.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Marketeur Twitter/X
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un post X classique n&apos;accepte ni markdown ni mise en forme : impossible d&apos;y mettre du gras. Les
                    caractères Unicode contournent cette limite : un mot en gras ou en italique au
                    milieu d&apos;un thread booste la lisibilité et le taux d&apos;engagement,
                    surtout sur mobile.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Discord et serveurs gaming
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Personnaliser un pseudo, décorer un nom de rôle ou ajouter un titre stylisé
                    dans un message texte. Les bulles, carrés et small caps sont très populaires
                    sur les communautés Roblox, Minecraft, Fortnite et Among Us pour identifier
                    les rangs.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Email marketing et signature
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Ajouter un nom en gras Unicode dans une signature email Gmail ou Outlook quand
                    le HTML rich-text est filtré. Mettre un titre attractif dans l&apos;objet
                    d&apos;une newsletter. Attention au taux de spam : les caractères exotiques
                    peuvent déclencher des filtres anti-phishing.
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
                style={{ fontFamily: "var(--font-display)" }}
              >
                À savoir avant d&apos;utiliser du texte Unicode
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Ce ne sont pas des polices, mais des caractères différents.</strong> Le
                  &laquo; A &raquo; gras Unicode (U+1D400) est techniquement un caractère distinct
                  du &laquo; A &raquo; classique (U+0041). Résultat : un screen reader lira parfois
                  &laquo; lettre A en latin gras mathématique &raquo; au lieu de juste
                  &laquo; A &raquo;. Mauvais pour l&apos;accessibilité.
                </p>
                <p>
                  <strong>SEO et recherche : zéro match.</strong> Si votre nom de boutique est
                  écrit en script Unicode, Google ne le matche pas avec une recherche en lettres
                  classiques. Très mauvais pour la découverte. Réservez les caractères stylisés
                  aux contextes où les utilisateurs ne tapent pas votre nom au clavier.
                </p>
                <p>
                  <strong>Compatibilité mobile imparfaite.</strong> Les iPhone, Android Pixel et
                  Samsung modernes affichent bien la plupart des blocs Unicode. Mais sur de vieux
                  Android, certains feature phones ou certaines applications professionnelles
                  (Slack, Microsoft Teams), les glyphes peuvent apparaître comme des carrés vides.
                </p>
                <p>
                  <strong>Lettres accentuées : un compromis.</strong> Les blocs Unicode stylisés
                  ne couvrent que les 26 lettres latines de base (A-Z) et, selon le style, les
                  chiffres. Pour les lettres accentuées (é, à, ô, ç…), l&apos;outil stylise la lettre de
                  base et lui ajoute l&apos;accent sous forme de caractère combinant. Selon la police
                  et l&apos;application, l&apos;accent peut être légèrement décalé. Le style « À l&apos;envers »
                  retire les accents, et les lettres comme œ ou æ restent inchangées.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Tout savoir sur la génération de texte Unicode stylisé."
              items={[
                {
                  question: "Comment fonctionne le texte stylisé Unicode ?",
                  answer:
                    "Les caractères stylisés ne sont pas des polices, mais des caractères Unicode distincts qui ressemblent aux lettres latines (blocs Mathematical Alphanumeric Symbols, Enclosed Alphanumerics, etc.). Ils s'affichent dans n'importe quel contexte qui supporte Unicode, sans CSS ni police installée.",
                },
                {
                  question: "Où puis-je utiliser ces textes stylisés ?",
                  answer:
                    "Partout où Unicode est pris en charge : Instagram (bio et captions), Twitter/X, Facebook, TikTok, Discord, Telegram, WhatsApp, LinkedIn, emails Gmail ou Outlook, Notion, Slack. Quelques applications anciennes ou très spécialisées peuvent afficher des carrés vides à la place.",
                },
                {
                  question: "Le texte stylisé est-il accessible aux personnes handicapées ?",
                  answer:
                    "Non, c'est sa principale limite. Les lecteurs d'écran (NVDA, JAWS, VoiceOver) lisent souvent les caractères stylisés comme des entités mathématiques (lettre A en gras mathématique latin) au lieu de simplement A. Pour un contenu accessible, utilisez le HTML strong et em.",
                },
                {
                  question: "Comment sont traités les accents ?",
                  answer:
                    "Les blocs Unicode de styles ne couvrent que les 26 lettres latines de base et les chiffres : les lettres accentuées françaises (é, à, ç, etc.) n'existent pas en version stylisée. L'outil décompose donc chaque lettre accentuée en lettre de base stylisée + accent combinant (é devient 𝐞 + ◌́). Le résultat s'affiche correctement dans la plupart des applications, mais l'accent peut être mal placé avec certaines polices. Le style « À l'envers » supprime les accents.",
                },
                {
                  question: "Le texte stylisé est-il bon pour le SEO ?",
                  answer:
                    "Non, c'est mauvais pour le SEO. Google indexe les caractères exactement, donc une boutique Etsy écrite en script Unicode ne sera pas trouvée si l'utilisateur tape le nom en lettres normales. Réservez aux bios de profil, signatures, titres décoratifs et jamais au contenu principal.",
                },
                {
                  question: "Y a-t-il un risque de spam ou de blocage ?",
                  answer:
                    "Sur certaines plateformes (LinkedIn, Microsoft Teams), un usage excessif de caractères Unicode exotiques peut déclencher des filtres anti-spam ou anti-phishing. Utilisez avec parcimonie : 1 à 2 mots stylisés par paragraphe, jamais des phrases entières.",
                },
                {
                  question: "L'outil envoie-t-il mon texte sur un serveur ?",
                  answer:
                    "Non, la conversion est entièrement effectuée dans votre navigateur via JavaScript. Le texte saisi n'est ni envoyé, ni stocké, ni journalisé. Vous pouvez styliser des contenus personnels ou professionnels en toute confidentialité.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Astuces</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Idéal pour les bios Instagram et Twitter</li>
                <li>Fonctionne aussi dans WhatsApp et Telegram</li>
                <li>Accents conservés (lettre stylisée + accent combinant)</li>
                <li>Les emojis restent inchangés</li>
                <li>Compatible avec tous les navigateurs modernes</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
