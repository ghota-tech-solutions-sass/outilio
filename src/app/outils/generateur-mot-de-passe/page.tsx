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
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            Generateur de mot de passe securise
          </h1>
          <p className="mt-2 text-gray-600">
            Creez des mots de passe forts et uniques en un clic. 100% local, rien n&apos;est envoye.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              {/* Generated password */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={password}
                  className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 font-mono text-lg tracking-wider"
                />
                <button
                  onClick={copy}
                  className="rounded-lg bg-[#2563eb] px-4 py-3 text-sm font-medium text-white hover:bg-[#1d4ed8]"
                >
                  {copied ? "Copie !" : "Copier"}
                </button>
              </div>

              {/* Strength bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full transition-all ${strength.color}`}
                    style={{ width: `${(strength.score / 6) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">{strength.label}</span>
              </div>

              {/* Length slider */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Longueur</label>
                  <span className="text-sm font-bold text-[#2563eb]">{length}</span>
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
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={options[key]}
                      onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <button
                onClick={generate}
                className="mt-6 w-full rounded-lg bg-[#2563eb] py-3 font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Generer un nouveau mot de passe
              </button>
            </div>

            <div className="prose max-w-none rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
