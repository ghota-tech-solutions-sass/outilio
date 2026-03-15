"use client";

import { useState, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const CONSONANTS = "bcdfghjklmnprstvwxz";
const VOWELS = "aeiouy";

function randomChar(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

function generateSyllable(): string {
  const patterns = ["cv", "cvc", "cv", "cvv"];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  return pattern
    .split("")
    .map((p) => (p === "c" ? randomChar(CONSONANTS) : randomChar(VOWELS)))
    .join("");
}

function generatePassword(syllables: number, includeNumbers: boolean, includeSpecial: boolean, capitalize: boolean): string {
  const parts: string[] = [];
  for (let i = 0; i < syllables; i++) {
    let syl = generateSyllable();
    if (capitalize && i % 2 === 0) {
      syl = syl[0].toUpperCase() + syl.slice(1);
    }
    parts.push(syl);
  }
  let pwd = parts.join("");
  if (includeNumbers) {
    pwd += Math.floor(Math.random() * 90 + 10).toString();
  }
  if (includeSpecial) {
    const specials = "!@#$%&*?";
    pwd += specials[Math.floor(Math.random() * specials.length)];
  }
  return pwd;
}

function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;

  if (score <= 2) return { score, label: "Faible", color: "#dc2626" };
  if (score <= 3) return { score, label: "Moyen", color: "#f59e0b" };
  if (score <= 4) return { score, label: "Fort", color: "#16a34a" };
  return { score, label: "Tres fort", color: "#059669" };
}

export default function GenerateurMdpPrononcable() {
  const [syllables, setSyllables] = useState(4);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [capitalize, setCapitalize] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const newPasswords: string[] = [];
    for (let i = 0; i < 6; i++) {
      newPasswords.push(generatePassword(syllables, includeNumbers, includeSpecial, capitalize));
    }
    setPasswords(newPasswords);
    setCopied(null);
  }, [syllables, includeNumbers, includeSpecial, capitalize]);

  // Generate on first render
  if (passwords.length === 0) {
    const initial: string[] = [];
    for (let i = 0; i < 6; i++) {
      initial.push(generatePassword(syllables, includeNumbers, includeSpecial, capitalize));
    }
    setPasswords(initial);
  }

  const handleCopy = (pwd: string, idx: number) => {
    navigator.clipboard.writeText(pwd);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Securite</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Mot de passe <span style={{ color: "var(--primary)" }}>prononcable</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Generez des mots de passe faciles a prononcer et a retenir, tout en restant securises.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Options */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Options</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Nombre de syllabes : {syllables}
                  </label>
                  <input type="range" min="2" max="8" value={syllables} onChange={(e) => setSyllables(Number(e.target.value))}
                    className="mt-2 w-full" />
                  <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                    <span>Court</span><span>Long</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} className="h-4 w-4" />
                    Majuscules
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="h-4 w-4" />
                    Chiffres
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={includeSpecial} onChange={(e) => setIncludeSpecial(e.target.checked)} className="h-4 w-4" />
                    Caracteres speciaux
                  </label>
                </div>
              </div>

              <button onClick={generate}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                Generer de nouveaux mots de passe
              </button>
            </div>

            {/* Generated passwords */}
            <div className="space-y-3">
              {passwords.map((pwd, i) => {
                const strength = getStrength(pwd);
                return (
                  <div key={i} className="rounded-2xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xl font-mono font-bold tracking-wider break-all flex-1">{pwd}</p>
                      <button onClick={() => handleCopy(pwd, i)}
                        className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white"
                        style={{ background: copied === i ? "#16a34a" : "var(--primary)" }}>
                        {copied === i ? "Copie !" : "Copier"}
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${(strength.score / 6) * 100}%`, background: strength.color }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>{pwd.length} caracteres</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Pourquoi des mots de passe prononcables ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Les mots de passe totalement aleatoires (comme &quot;xK9$mZ!q&quot;) sont difficiles a retenir. Les mots de passe prononcables utilisent des <strong className="text-[var(--foreground)]">patterns de syllabes</strong> qui les rendent plus faciles a memoriser tout en gardant un bon niveau de securite.</p>
                <p>Un mot de passe prononcable de 16 caracteres avec chiffres et symboles offre une excellente resistance aux attaques par force brute, tout en etant facile a communiquer oralement si necessaire.</p>
                <p>Pour une securite optimale, utilisez un <strong className="text-[var(--foreground)]">gestionnaire de mots de passe</strong> et activez l&apos;authentification a deux facteurs (2FA) quand c&apos;est possible.</p>
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
