"use client";

import { useState, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const CHARSETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(length: number, options: Record<string, boolean>): string {
  let chars = "";
  if (options.lowercase) chars += CHARSETS.lowercase;
  if (options.uppercase) chars += CHARSETS.uppercase;
  if (options.numbers) chars += CHARSETS.numbers;
  if (options.symbols) chars += CHARSETS.symbols;
  if (!chars) chars = CHARSETS.lowercase;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => chars[n % chars.length]).join("");
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 2) return { score, label: "Faible", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Moyen", color: "bg-yellow-500" };
  return { score, label: "Fort", color: "bg-green-500" };
}

export default function GenerateurMotDePasse() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState(() => generatePassword(16, { lowercase: true, uppercase: true, numbers: true, symbols: true }));
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setPassword(generatePassword(length, options));
    setCopied(false);
  }, [length, options]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(password);

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1
            className="animate-fade-up stagger-1 text-3xl font-extrabold md:text-4xl"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
          >
            Generateur de mot de passe securise
          </h1>
          <p className="animate-fade-up stagger-2 mt-2" style={{ color: "var(--muted)" }}>
            Creez des mots de passe forts et uniques en un clic. 100% local, rien n&apos;est envoye.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div
              className="rounded-xl p-6 shadow-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {/* Generated password */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={password}
                  className="flex-1 rounded-lg px-4 py-3 font-mono text-lg tracking-wider"
                  style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                />
                <button
                  onClick={copy}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-white hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  {copied ? "Copie !" : "Copier"}
                </button>
              </div>

              {/* Strength bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full" style={{ background: "var(--surface-alt)" }}>
                  <div
                    className={`h-2 rounded-full transition-all ${strength.color}`}
                    style={{ width: `${(strength.score / 6) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>{strength.label}</span>
              </div>

              {/* Length slider */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Longueur</label>
                  <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>{length}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>

              {/* Options */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(
                  [
                    ["lowercase", "Minuscules (a-z)"],
                    ["uppercase", "Majuscules (A-Z)"],
                    ["numbers", "Chiffres (0-9)"],
                    ["symbols", "Symboles (!@#$)"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                    <input
                      type="checkbox"
                      checked={options[key]}
                      onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                      className="rounded"
                      style={{ borderColor: "var(--border)" }}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <button
                onClick={generate}
                className="mt-6 w-full rounded-lg py-3 font-semibold text-white hover:opacity-90"
                style={{ background: "var(--primary)" }}
              >
                Generer un nouveau mot de passe
              </button>
            </div>

            <div
              className="prose max-w-none rounded-xl p-6 shadow-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2>Qu&apos;est-ce qu&apos;un mot de passe securise ?</h2>
              <p>
                Un mot de passe securise doit etre long (minimum 12 caracteres),
                contenir un melange de majuscules, minuscules, chiffres et symboles,
                et etre unique pour chaque compte.
              </p>
              <h2>Conseils de securite</h2>
              <ul>
                <li>Utilisez un mot de passe different pour chaque site</li>
                <li>Activez l&apos;authentification a deux facteurs (2FA)</li>
                <li>Ne partagez jamais vos mots de passe par email</li>
                <li>Utilisez un gestionnaire de mots de passe</li>
              </ul>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment generer un mot de passe securise
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Notre generateur utilise l&apos;API <code style={{ color: "var(--primary)" }}>crypto.getRandomValues()</code> de votre navigateur
                  pour creer des mots de passe cryptographiquement aleatoires. Aucun mot de passe n&apos;est stocke ni transmis.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Ajustez la longueur</strong> : de 4 a 64 caracteres (16+ recommande)</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez les types de caracteres</strong> : minuscules, majuscules, chiffres et symboles</li>
                  <li><strong className="text-[var(--foreground)]">Indicateur de force</strong> : evaluez la robustesse du mot de passe en temps reel</li>
                  <li><strong className="text-[var(--foreground)]">Copie en un clic</strong> : collez directement dans votre gestionnaire de mots de passe</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle longueur minimale pour un mot de passe ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>L&apos;ANSSI recommande un minimum de 12 caracteres pour un mot de passe standard. Pour les comptes sensibles (banque, email principal), visez 16 caracteres ou plus. Plus le mot de passe est long, plus il est resistant aux attaques par force brute.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Le mot de passe genere est-il vraiment aleatoire ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, l&apos;outil utilise l&apos;API Web Crypto du navigateur (<code style={{ color: "var(--primary)" }}>crypto.getRandomValues</code>), qui fournit des nombres cryptographiquement securises. C&apos;est le meme niveau d&apos;aleatoire utilise par les protocoles de securite professionnels.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi utiliser un gestionnaire de mots de passe ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Un gestionnaire de mots de passe (comme Bitwarden, 1Password ou KeePass) stocke tous vos mots de passe de maniere chiffree. Vous n&apos;avez besoin de retenir qu&apos;un seul mot de passe maitre. C&apos;est la methode la plus sure pour gerer des dizaines de comptes avec des mots de passe uniques.</p>
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
