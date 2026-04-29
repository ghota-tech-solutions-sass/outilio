"use client";

import { useState, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import AdPlaceholder from "@/components/AdPlaceholder";

const CONSONANTS = "bcdfghjklmnprstvwxz";
const VOWELS = "aeiou";

// Cryptographically secure random in [0, 1)
function secureRandom(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / (0xffffffff + 1);
}

// Cryptographically secure integer in [0, max)
function secureRandomInt(max: number): number {
  return Math.floor(secureRandom() * max);
}

function generatePronounceable(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    const pool = i % 2 === 0 ? CONSONANTS : VOWELS;
    result += pool[secureRandomInt(pool.length)];
  }
  // Capitalize some letters and add a digit
  const pos = secureRandomInt(result.length - 2) + 1;
  result = result.slice(0, pos) + result[pos].toUpperCase() + result.slice(pos + 1);
  result += secureRandomInt(90) + 10;
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
    result += chars[secureRandomInt(chars.length)];
  }
  return result;
}

// Escape special characters in WiFi QR string per the WIFI: format spec.
// See https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config
function escapeWifiField(value: string): string {
  return value.replace(/([\\;,":])/g, "\\$1");
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
  const [qrDataUrl, setQrDataUrl] = useState("");

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

  // Generate a real, scannable WiFi QR code via the qrcode library.
  useEffect(() => {
    if (!password) {
      setQrDataUrl("");
      return;
    }
    const wifiString = `WIFI:T:WPA;S:${escapeWifiField(ssid)};P:${escapeWifiField(password)};;`;
    let cancelled = false;
    QRCode.toDataURL(wifiString, { width: 256, margin: 2, errorCorrectionLevel: "M" })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error("QR code generation failed", err);
        if (!cancelled) setQrDataUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [ssid, password]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Securite</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur mot de passe <span style={{ color: "var(--primary)" }}>WiFi</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Generez des mots de passe WiFi securises avec option prononcable et QR code pour le partage facile.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
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
                    {qrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={qrDataUrl} alt={`QR code WiFi pour ${ssid}`} width={256} height={256} />
                    ) : (
                      <div className="text-xs" style={{ color: "var(--muted)" }}>Generation du QR code...</div>
                    )}
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

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment generer un mot de passe WiFi securise
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Protegez votre reseau WiFi domestique ou professionnel avec un mot de passe robuste.
                  Notre outil genere des cles WiFi securisees avec option prononcable et QR code de partage.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Nommez votre reseau</strong> : entrez votre SSID (nom du reseau WiFi)</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez le mode</strong> : aleatoire (securite maximale) ou prononcable (facile a communiquer)</li>
                  <li><strong className="text-[var(--foreground)]">Ajustez la longueur</strong> : de 8 a 32 caracteres (16+ recommande)</li>
                  <li><strong className="text-[var(--foreground)]">Partagez via QR code</strong> : les invites scannent le QR code pour se connecter instantanement</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel protocole de securite WiFi utiliser ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Utilisez WPA3 si votre routeur et vos appareils le supportent. Sinon, WPA2-PSK (AES) reste securise avec un mot de passe de 16 caracteres ou plus. Evitez WEP et WPA qui sont obsoletes et vulnerables.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Le QR code fonctionne-t-il sur tous les telephones ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, le format WIFI: utilise dans le QR code est reconnu nativement par iOS (depuis iOS 11) et Android. Il suffit de scanner le QR code avec l&apos;appareil photo pour se connecter automatiquement au reseau.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>A quelle frequence changer son mot de passe WiFi ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Il est recommande de changer votre mot de passe WiFi tous les 6 a 12 mois, ou immediatement si vous suspectez un acces non autorise. Creez egalement un reseau invite separe pour vos visiteurs afin de proteger votre reseau principal.</p>
                </div>
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
