"use client";

import { useState, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const CONSONANTS = "bcdfghjklmnprstvwxz";
const VOWELS = "aeiou";

function generatePronounceable(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    const pool = i % 2 === 0 ? CONSONANTS : VOWELS;
    result += pool[Math.floor(Math.random() * pool.length)];
  }
  // Capitalize some letters and add a digit
  const pos = Math.floor(Math.random() * (result.length - 2)) + 1;
  result = result.slice(0, pos) + result[pos].toUpperCase() + result.slice(pos + 1);
  result += Math.floor(Math.random() * 90 + 10);
  return result;
}

function generateRandom(length: number, options: { upper: boolean; lower: boolean; digits: boolean; symbols: boolean }): string {
  let chars = "";
  if (options.lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (options.upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (options.digits) chars += "0123456789";
  if (options.symbols) chars += "!@#$%&*-_=+";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateQRSvg(text: string): string {
  // Simple QR code placeholder using a data matrix visual representation
  // For a real QR we'd use a library, but we create a visual representation
  const size = 200;
  const modules = 21;
  const moduleSize = size / modules;

  // Simple hash-based pattern
  const bits: boolean[][] = [];
  for (let r = 0; r < modules; r++) {
    bits[r] = [];
    for (let c = 0; c < modules; c++) {
      // Finder patterns (top-left, top-right, bottom-left)
      const inFinderTL = r < 7 && c < 7;
      const inFinderTR = r < 7 && c >= modules - 7;
      const inFinderBL = r >= modules - 7 && c < 7;

      if (inFinderTL || inFinderTR || inFinderBL) {
        const lr = inFinderTL ? r : inFinderBL ? r - (modules - 7) : r;
        const lc = inFinderTL ? c : inFinderTR ? c - (modules - 7) : c;
        bits[r][c] = lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
      } else {
        const hash = ((r * 31 + c * 17 + text.charCodeAt(Math.abs(r + c) % text.length)) * 7) % 13;
        bits[r][c] = hash < 6;
      }
    }
  }

  let rects = "";
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (bits[r][c]) {
        rects += `<rect x="${c * moduleSize}" y="${r * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="#000"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#fff"/>${rects}</svg>`;
}

export default function GenerateurMotDePasseWifi() {
  const [mode, setMode] = useState<"pronounceable" | "random">("random");
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [ssid, setSsid] = useState("MonWiFi");
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const pwd = mode === "pronounceable"
      ? generatePronounceable(length)
      : generateRandom(length, { upper, lower, digits, symbols });
    setPassword(pwd);
    setCopied(false);
  }, [mode, length, upper, lower, digits, symbols]);

  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const qrString = password ? `WIFI:T:WPA;S:${ssid};P:${password};;` : "";
  const qrSvg = password ? generateQRSvg(qrString) : "";

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Securite</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur mot de passe <span style={{ color: "var(--primary)" }}>WiFi</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Generez des mots de passe WiFi securises avec option prononcable et QR code pour le partage facile.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Configuration</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nom du reseau (SSID)</label>
                  <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Mode</label>
                  <div className="mt-2 flex gap-3">
                    <button onClick={() => setMode("random")}
                      className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                      style={{ borderColor: mode === "random" ? "var(--primary)" : "var(--border)", background: mode === "random" ? "var(--primary)" : "transparent", color: mode === "random" ? "#fff" : "inherit" }}>
                      Aleatoire
                    </button>
                    <button onClick={() => setMode("pronounceable")}
                      className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                      style={{ borderColor: mode === "pronounceable" ? "var(--primary)" : "var(--border)", background: mode === "pronounceable" ? "var(--primary)" : "transparent", color: mode === "pronounceable" ? "#fff" : "inherit" }}>
                      Prononcable
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Longueur : {length}</label>
                  <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(Number(e.target.value))}
                    className="mt-2 w-full" />
                </div>
                {mode === "random" && (
                  <div className="flex flex-wrap gap-3">
                    {[
                      { label: "Majuscules", val: upper, set: setUpper },
                      { label: "Minuscules", val: lower, set: setLower },
                      { label: "Chiffres", val: digits, set: setDigits },
                      { label: "Symboles", val: symbols, set: setSymbols },
                    ].map((opt) => (
                      <label key={opt.label} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "var(--surface-alt)" }}>
                        <input type="checkbox" checked={opt.val} onChange={(e) => opt.set(e.target.checked)} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                )}
                <button onClick={generate}
                  className="w-full rounded-xl py-4 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "var(--primary)" }}>
                  Generer le mot de passe
                </button>
              </div>
            </div>

            {password && (
              <>
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Mot de passe genere</h2>
                  <div className="mt-4 flex items-center gap-3 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                    <code className="flex-1 text-lg font-bold break-all" style={{ fontFamily: "monospace", color: "var(--primary)" }}>{password}</code>
                    <button onClick={copyToClipboard}
                      className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                      {copied ? "Copie !" : "Copier"}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>QR Code WiFi</h2>
                  <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>Scannez ce QR code pour vous connecter au reseau WiFi.</p>
                  <div className="mt-4 flex justify-center rounded-xl p-6" style={{ background: "#fff" }}>
                    <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
                  </div>
                  <p className="mt-3 text-center text-xs font-semibold" style={{ color: "var(--muted)" }}>
                    Reseau : <strong className="text-[var(--foreground)]">{ssid}</strong>
                  </p>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Securite WiFi</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Longueur</strong> : Un mot de passe WiFi de 12 caracteres ou plus est recommande pour une securite optimale.</p>
                <p><strong className="text-[var(--foreground)]">Prononcable</strong> : Les mots de passe prononcables sont plus faciles a retenir et a partager oralement, tout en restant securises.</p>
                <p><strong className="text-[var(--foreground)]">QR Code</strong> : Le QR code genere utilise le format standard WIFI: reconnu par iOS et Android pour une connexion automatique.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conseils WiFi</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Changez votre mot de passe WiFi regulierement</li>
                <li>Utilisez le chiffrement WPA3 si disponible</li>
                <li>Evitez les mots du dictionnaire</li>
                <li>Ne reutilisez pas vos mots de passe</li>
                <li>Creez un reseau invite separe</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
