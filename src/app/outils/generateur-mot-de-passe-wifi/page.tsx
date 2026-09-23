"use client";

import { useState, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import AdPlaceholder from "@/components/AdPlaceholder";
import { secureRandomInt } from "@/lib/random";

const CONSONANTS = "bcdfghjklmnprstvwxz";
const VOWELS = "aeiou";
const ALNUM = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

type SecurityType = "WPA" | "WEP" | "nopass";

const SECURITY_OPTIONS: { key: SecurityType; label: string }[] = [
  { key: "WPA", label: "WPA2 / WPA3" },
  { key: "WEP", label: "WEP (obsolète)" },
  { key: "nopass", label: "Aucun (ouvert)" },
];

// Lettres alternées consonne/voyelle, une majuscule, puis 2 chiffres : longueur totale = length
function generatePronounceable(length: number): string {
  const letters = Math.max(2, length - 2);
  let result = "";
  for (let i = 0; i < letters; i++) {
    const pool = i % 2 === 0 ? CONSONANTS : VOWELS;
    result += pool[secureRandomInt(pool.length)];
  }
  const pos = secureRandomInt(letters - 1) + 1;
  result = result.slice(0, pos) + result[pos].toUpperCase() + result.slice(pos + 1);
  result += secureRandomInt(90) + 10;
  return result;
}

function pronounceableBits(length: number): number {
  const letters = Math.max(2, length - 2);
  const consonants = Math.ceil(letters / 2);
  const vowels = Math.floor(letters / 2);
  return consonants * Math.log2(CONSONANTS.length) + vowels * Math.log2(VOWELS.length) + Math.log2(letters - 1) + Math.log2(90);
}

type RandomOptions = { upper: boolean; lower: boolean; digits: boolean; symbols: boolean };

function charsets(options: RandomOptions): string[] {
  const sets: string[] = [];
  if (options.lower) sets.push("abcdefghijklmnopqrstuvwxyz");
  if (options.upper) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  if (options.digits) sets.push("0123456789");
  if (options.symbols) sets.push("!@#$%&*-_=+");
  return sets.length > 0 ? sets : ["abcdefghijklmnopqrstuvwxyz"];
}

function generateRandom(length: number, options: RandomOptions): string {
  const sets = charsets(options);
  const chars = sets.join("");
  // Rejet des tirages auxquels il manque un type coché (distribution uniforme parmi les résultats valides)
  for (;;) {
    let result = "";
    for (let i = 0; i < length; i++) result += chars[secureRandomInt(chars.length)];
    if (length < sets.length || sets.every((set) => [...result].some((c) => set.includes(c)))) return result;
  }
}

// Clé WEP ASCII : 13 caractères exactement (WEP 128 bits)
function generateWep(): string {
  let result = "";
  for (let i = 0; i < 13; i++) result += ALNUM[secureRandomInt(ALNUM.length)];
  return result;
}

// Échappement des caractères spéciaux du format WIFI: (\ ; , : ")
// Voir https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config
function escapeWifiField(value: string): string {
  return value.replace(/([\\;,":])/g, "\\$1");
}

function buildWifiString(ssid: string, type: SecurityType, password: string, hidden: boolean): string {
  const pass = type === "nopass" ? "" : `P:${escapeWifiField(password)};`;
  return `WIFI:T:${type};S:${escapeWifiField(ssid)};${pass}${hidden ? "H:true;" : ""};`;
}

export default function GenerateurMotDePasseWifi() {
  const [mode, setMode] = useState<"pronounceable" | "random">("random");
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [ssid, setSsid] = useState("MonWiFi");
  const [security, setSecurity] = useState<SecurityType>("WPA");
  const [hidden, setHidden] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordBits, setPasswordBits] = useState(0);
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<{ source: string; url: string }>({ source: "", url: "" });

  const generate = useCallback(() => {
    let pwd: string;
    let bits: number;
    if (security === "WEP") {
      pwd = generateWep();
      bits = 13 * Math.log2(ALNUM.length);
    } else if (mode === "pronounceable") {
      pwd = generatePronounceable(length);
      bits = pronounceableBits(length);
    } else {
      const opts = { upper, lower, digits, symbols };
      pwd = generateRandom(length, opts);
      bits = length * Math.log2(charsets(opts).join("").length);
    }
    setPassword(pwd);
    setPasswordBits(bits);
    setCopied(false);
  }, [security, mode, length, upper, lower, digits, symbols]);

  // Premier mot de passe généré côté client uniquement (jamais figé dans le HTML statique)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPassword(generateRandom(16, { upper: true, lower: true, digits: true, symbols: true }));
      setPasswordBits(16 * Math.log2(73));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible
    }
  };

  const needsPassword = security !== "nopass";
  const wepMismatch = security === "WEP" && password.length !== 13;
  const qrReady = ssid.trim() !== "" && (!needsPassword || (password !== "" && !wepMismatch));
  const wifiString = qrReady ? buildWifiString(ssid, security, password, hidden) : "";

  // QR code WiFi réel et scannable, généré localement par la bibliothèque qrcode
  useEffect(() => {
    if (!wifiString) return;
    let cancelled = false;
    QRCode.toDataURL(wifiString, { width: 256, margin: 2, errorCorrectionLevel: "M" })
      .then((url) => {
        if (!cancelled) setQr({ source: wifiString, url });
      })
      .catch((err) => {
        console.error("QR code generation failed", err);
      });
    return () => {
      cancelled = true;
    };
  }, [wifiString]);

  const qrDataUrl = qr.source === wifiString ? qr.url : "";

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Sécurité</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Générateur de mot de passe <span style={{ color: "var(--primary)" }}>Wi-Fi</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Générez des mots de passe Wi-Fi sécurisés, aléatoires ou prononçables, avec un QR code pour les partager facilement.
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
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nom du réseau (SSID)</label>
                  <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)} maxLength={32}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  <label className="mt-2 flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                    <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
                    Réseau masqué (SSID non diffusé)
                  </label>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Sécurité du réseau</label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {SECURITY_OPTIONS.map((opt) => (
                      <button key={opt.key} onClick={() => setSecurity(opt.key)}
                        className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                        style={{ borderColor: security === opt.key ? "var(--primary)" : "var(--border)", background: security === opt.key ? "var(--primary)" : "transparent", color: security === opt.key ? "#fff" : "inherit" }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {security === "WEP" && (
                    <p className="mt-2 text-xs" style={{ color: "#dc2626" }}>
                      Le WEP se casse en quelques minutes : ne l&apos;utilisez que pour un ancien appareil incompatible WPA2. La clé générée
                      fait 13 caractères (WEP 128 bits).
                    </p>
                  )}
                  {security === "nopass" && (
                    <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                      Réseau ouvert : le QR code ne contient pas de mot de passe. À réserver à un réseau invité isolé.
                    </p>
                  )}
                </div>
                {security === "WPA" && (
                  <>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Mode</label>
                      <div className="mt-2 flex gap-3">
                        <button onClick={() => setMode("random")}
                          className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                          style={{ borderColor: mode === "random" ? "var(--primary)" : "var(--border)", background: mode === "random" ? "var(--primary)" : "transparent", color: mode === "random" ? "#fff" : "inherit" }}>
                          Aléatoire
                        </button>
                        <button onClick={() => setMode("pronounceable")}
                          className="flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                          style={{ borderColor: mode === "pronounceable" ? "var(--primary)" : "var(--border)", background: mode === "pronounceable" ? "var(--primary)" : "transparent", color: mode === "pronounceable" ? "#fff" : "inherit" }}>
                          Prononçable
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
                  </>
                )}
                {needsPassword && (
                  <button onClick={generate}
                    className="w-full rounded-xl py-4 text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "var(--primary)" }}>
                    Générer le mot de passe
                  </button>
                )}
              </div>
            </div>

            {needsPassword && password && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Mot de passe généré</h2>
                <div className="mt-4 flex items-center gap-3 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <code className="flex-1 text-lg font-bold break-all" style={{ fontFamily: "monospace", color: "var(--primary)" }}>{password}</code>
                  <button onClick={copyToClipboard}
                    className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                    {copied ? "Copié !" : "Copier"}
                  </button>
                </div>
                <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                  {password.length} caractères · entropie d&apos;environ {Math.round(passwordBits)} bits
                  {wepMismatch && " · une clé WEP doit faire 13 caractères : cliquez sur Générer"}
                </p>
              </div>
            )}

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>QR code Wi-Fi</h2>
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>Scannez ce QR code avec l&apos;appareil photo du téléphone pour vous connecter au réseau.</p>
              <div className="mt-4 flex justify-center rounded-xl p-6" style={{ background: "#fff" }}>
                {!qrReady ? (
                  <div className="text-xs" style={{ color: "var(--muted)" }}>
                    {ssid.trim() === "" ? "Saisissez le nom du réseau (SSID)." : "Générez d'abord un mot de passe."}
                  </div>
                ) : qrDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrDataUrl} alt={`QR code Wi-Fi pour ${ssid}`} width={256} height={256} />
                ) : (
                  <div className="text-xs" style={{ color: "var(--muted)" }}>Génération du QR code…</div>
                )}
              </div>
              {qrReady && (
                <p className="mt-3 text-center text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  Réseau : <strong className="text-[var(--foreground)]">{ssid}</strong>
                  {" · "}
                  {SECURITY_OPTIONS.find((o) => o.key === security)?.label}
                </p>
              )}
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Sécurité Wi-Fi</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Longueur</strong> : une clé WPA2/WPA3 accepte de 8 à 63 caractères. Visez 16 caractères aléatoires ou plus : la clé ne se saisit qu&apos;une fois par appareil.</p>
                <p><strong className="text-[var(--foreground)]">Prononçable</strong> : plus facile à dicter, mais moins dense en entropie à longueur égale. Allongez-le (20 caractères ou plus) pour compenser.</p>
                <p><strong className="text-[var(--foreground)]">QR code</strong> : le QR code généré utilise le format standard WIFI: reconnu par l&apos;appareil photo d&apos;iOS et d&apos;Android pour une connexion automatique. Il est créé localement dans votre navigateur.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment générer un mot de passe Wi-Fi sécurisé
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Protégez votre réseau Wi-Fi domestique ou professionnel avec un mot de passe robuste.
                  Notre outil génère des clés Wi-Fi sécurisées, aléatoires ou prononçables, et le QR code de partage correspondant.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Nommez votre réseau</strong> : saisissez votre SSID (nom du réseau Wi-Fi) exactement comme sur la box.</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez la sécurité</strong> : WPA2/WPA3 dans la quasi-totalité des cas.</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez le mode</strong> : aléatoire (sécurité maximale) ou prononçable (facile à communiquer).</li>
                  <li><strong className="text-[var(--foreground)]">Ajustez la longueur</strong> : de 8 à 32 caractères (16 ou plus recommandé).</li>
                  <li><strong className="text-[var(--foreground)]">Partagez via QR code</strong> : vos invités scannent le QR code pour se connecter instantanément.</li>
                </ul>
                <p>
                  Pensez à reporter le nouveau mot de passe dans l&apos;interface de votre box ou de votre routeur : l&apos;outil ne
                  modifie pas la configuration de votre réseau.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel protocole de sécurité Wi-Fi utiliser ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Utilisez WPA3 si votre routeur et vos appareils le prennent en charge. Sinon, WPA2-PSK (AES) reste sûr avec un mot de passe de 16 caractères ou plus. Évitez le WEP et le WPA d&apos;origine (TKIP), obsolètes et vulnérables. Dans le QR code, WPA2 et WPA3 partagent le même type « WPA ».</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Le QR code fonctionne-t-il sur tous les téléphones ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, le format WIFI: utilisé dans le QR code est reconnu nativement par iOS (depuis iOS 11) et par Android (depuis Android 10 dans l&apos;appareil photo ou les réglages Wi-Fi, via Google Lens sur les versions plus anciennes). Il suffit de scanner le QR code pour se connecter automatiquement au réseau.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Faut-il changer régulièrement son mot de passe Wi-Fi ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Pas selon un calendrier fixe si la clé est longue et aléatoire. Changez-la si vous soupçonnez un accès non autorisé, après le départ d&apos;un colocataire ou d&apos;un salarié, ou si elle a été largement partagée. Pour vos visiteurs, créez plutôt un réseau invité séparé, que vous pouvez renouveler sans reconnecter tous vos appareils.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conseils Wi-Fi</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Remplacez le mot de passe par défaut de la box</li>
                <li>Utilisez le chiffrement WPA3 si disponible</li>
                <li>Évitez les mots du dictionnaire</li>
                <li>Ne réutilisez pas vos mots de passe</li>
                <li>Créez un réseau invité séparé</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
