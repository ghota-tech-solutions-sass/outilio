"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

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

// Script (mathematical): U+1D49C (upper), U+1D4B6 (lower)
for (let i = 0; i < 26; i++) {
  scriptMap[upper[i]] = String.fromCodePoint(0x1d49c + i);
  scriptMap[lower[i]] = String.fromCodePoint(0x1d4b6 + i);
}

function applyMap(text: string, map: Record<string, string>): string {
  return text.split("").map((ch) => map[ch] || ch).join("");
}

function strikethrough(text: string): string {
  return text.split("").map((ch) => ch + "\u0336").join("");
}

function underline(text: string): string {
  return text.split("").map((ch) => ch + "\u0332").join("");
}

function upsideDown(text: string): string {
  const map: Record<string, string> = {
    a: "\u0250", b: "q", c: "\u0254", d: "p", e: "\u01DD", f: "\u025F",
    g: "\u0253", h: "\u0265", i: "\u0131", j: "\u027E", k: "\u029E", l: "l",
    m: "\u026F", n: "u", o: "o", p: "d", q: "b", r: "\u0279",
    s: "s", t: "\u0287", u: "n", v: "\u028C", w: "\u028D", x: "x",
    y: "\u028E", z: "z",
    A: "\u2200", B: "\u10412", C: "\u0186", D: "\u15E1", E: "\u018E", F: "\u2132",
    G: "\u2141", H: "H", I: "I", J: "\u017F", K: "\u22CA", L: "\u2142",
    M: "W", N: "N", O: "O", P: "\u0500", Q: "\u038C", R: "\u1D1A",
    S: "S", T: "\u22A5", U: "\u2229", V: "\u039B", W: "M", X: "X",
    Y: "\u2144", Z: "Z",
    "1": "\u0196", "2": "\u1105", "3": "\u0190", "4": "\u3123", "5": "\u03DB",
    "6": "9", "7": "\u3125", "8": "8", "9": "6", "0": "0",
    ".": "\u02D9", ",": "\u02BB", "?": "\u00BF", "!": "\u00A1",
    "'": ",", '"': "\u201E",
  };
  return text.split("").reverse().map((ch) => map[ch] || ch).join("");
}

function smallCaps(text: string): string {
  const map: Record<string, string> = {
    a: "\u1D00", b: "\u0299", c: "\u1D04", d: "\u1D05", e: "\u1D07", f: "\uA730",
    g: "\u0262", h: "\u029C", i: "\u026A", j: "\u1D0A", k: "\u1D0B", l: "\u029F",
    m: "\u1D0D", n: "\u0274", o: "\u1D0F", p: "\u1D18", q: "\u0071", r: "\u0280",
    s: "\u0455", t: "\u1D1B", u: "\u1D1C", v: "\u1D20", w: "\u1D21", x: "\u0078",
    y: "\u028F", z: "\u1D22",
  };
  return text.split("").map((ch) => map[ch] || ch).join("");
}

const STYLES: Style[] = [
  { label: "Gras (Bold)", icon: "\u{1D5D5}", transform: (t) => applyMap(t, boldMap) },
  { label: "Italique", icon: "\u{1D448}", transform: (t) => applyMap(t, italicMap) },
  { label: "Gras italique", icon: "\u{1D46E}", transform: (t) => applyMap(t, boldItalicMap) },
  { label: "Monospace", icon: "\u{1D688}", transform: (t) => applyMap(t, monoMap) },
  { label: "Barre", icon: "a\u0336b\u0336", transform: strikethrough },
  { label: "Souligne", icon: "a\u0332b\u0332", transform: underline },
  { label: "Bulle", icon: "\u24B6", transform: (t) => applyMap(t, bubbleMap) },
  { label: "Bulle pleine", icon: "\u{1F150}", transform: (t) => applyMap(t, bubbleFilledMap) },
  { label: "Carre", icon: "\u{1F130}", transform: (t) => applyMap(t, squareMap) },
  { label: "Script", icon: "\u{1D49C}", transform: (t) => applyMap(t, scriptMap) },
  { label: "A l'envers", icon: "\u0250", transform: upsideDown },
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
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Texte</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur de <span style={{ color: "var(--primary)" }}>texte stylise</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez votre texte en caracteres Unicode stylises. Copiez et collez sur les reseaux sociaux, bios, messages.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
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
                    {copiedIndex === i ? "Copie !" : "Copier"}
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment ca fonctionne ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce generateur utilise les <strong className="text-[var(--foreground)]">caracteres speciaux Unicode</strong> qui ressemblent aux lettres latines mais dans des styles differents (gras, italique, monospace, etc.).</p>
                <p><strong className="text-[var(--foreground)]">Ou les utiliser ?</strong> Ces caracteres fonctionnent partout ou Unicode est supporte : reseaux sociaux (Instagram, Twitter, Facebook), applications de messagerie, bios de profil, emails.</p>
                <p><strong className="text-[var(--foreground)]">Limitation</strong> : Certains caracteres speciaux peuvent ne pas s&apos;afficher correctement sur tous les appareils ou navigateurs. Les lettres accentuees ne sont pas transformees.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Astuces</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Ideal pour les bios Instagram et Twitter</li>
                <li>Fonctionne aussi dans WhatsApp et Telegram</li>
                <li>Les accents et emojis restent inchanges</li>
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
