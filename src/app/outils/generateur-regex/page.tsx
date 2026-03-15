"use client";

import { useState, useMemo, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface MatchResult {
  fullMatch: string;
  groups: string[];
  index: number;
  length: number;
}

const COMMON_PATTERNS = [
  { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", description: "Adresse email" },
  { name: "URL", pattern: "https?://[\\w.-]+(?:\\.[\\w.-]+)+[\\w.,@?^=%&:/~+#-]*", description: "Lien HTTP/HTTPS" },
  { name: "Telephone FR", pattern: "(?:0|\\+33)[1-9](?:[\\s.-]?\\d{2}){4}", description: "Numero francais" },
  { name: "Code postal", pattern: "\\b\\d{5}\\b", description: "Code postal francais" },
  { name: "Date JJ/MM/AAAA", pattern: "\\d{2}/\\d{2}/\\d{4}", description: "Date au format francais" },
  { name: "Adresse IP", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", description: "IPv4" },
  { name: "Hex color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", description: "Couleur hexadecimale" },
  { name: "Nombre entier", pattern: "-?\\d+", description: "Entiers positifs/negatifs" },
  { name: "Nombre decimal", pattern: "-?\\d+[.,]\\d+", description: "Nombres a virgule" },
  { name: "Balise HTML", pattern: "<[^>]+>", description: "Tags HTML" },
  { name: "Mot unique", pattern: "\\b\\w+\\b", description: "Un mot" },
  { name: "Espaces multiples", pattern: "\\s{2,}", description: "2+ espaces consecutifs" },
];

export default function GenerateurRegex() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const flagString = useMemo(() => {
    return (flags.g ? "g" : "") + (flags.i ? "i" : "") + (flags.m ? "m" : "") + (flags.s ? "s" : "");
  }, [flags]);

  const matches = useMemo((): MatchResult[] => {
    if (!pattern || !testString) {
      setError("");
      return [];
    }
    try {
      const regex = new RegExp(pattern, flagString);
      setError("");
      const results: MatchResult[] = [];
      if (flags.g) {
        let match: RegExpExecArray | null;
        let safety = 0;
        while ((match = regex.exec(testString)) !== null && safety < 1000) {
          results.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
            length: match[0].length,
          });
          if (match[0].length === 0) regex.lastIndex++;
          safety++;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          results.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
            length: match[0].length,
          });
        }
      }
      return results;
    } catch (e) {
      setError((e as Error).message);
      return [];
    }
  }, [pattern, testString, flagString, flags.g]);

  const highlightedText = useMemo(() => {
    if (!pattern || !testString || matches.length === 0) return null;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match, i) => {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`t-${i}`}>{testString.slice(lastIndex, match.index)}</span>
        );
      }
      parts.push(
        <mark
          key={`m-${i}`}
          style={{
            background: i % 2 === 0 ? "rgba(13,79,60,0.2)" : "rgba(232,150,62,0.2)",
            border: `1px solid ${i % 2 === 0 ? "rgba(13,79,60,0.4)" : "rgba(232,150,62,0.4)"}`,
            borderRadius: "3px",
            padding: "1px 2px",
            color: "inherit",
          }}
          title={`Match #${i + 1}: "${match.fullMatch}"`}
        >
          {match.fullMatch}
        </mark>
      );
      lastIndex = match.index + match.length;
    });

    if (lastIndex < testString.length) {
      parts.push(<span key="end">{testString.slice(lastIndex)}</span>);
    }

    return parts;
  }, [pattern, testString, matches]);

  const toggleFlag = useCallback((flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }, []);

  const applyPattern = (p: string) => {
    setPattern(p);
  };

  const copyRegex = async (format: string) => {
    let text = "";
    if (format === "js") text = `/${pattern}/${flagString}`;
    else if (format === "python") text = `r"${pattern}"`;
    else text = pattern;
    await navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const loadExample = () => {
    setPattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    setTestString("Contactez-nous a support@outilis.fr ou info@example.com pour plus d'infos. Email invalide: test@");
    setFlags({ g: true, i: false, m: false, s: false });
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Testeur de <span style={{ color: "var(--primary)" }}>Regex</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Testez vos expressions regulieres en temps reel. Surlignage des correspondances, groupes de capture et bibliotheque de patterns.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Pattern input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Expression reguliere</h2>
                <button onClick={loadExample} className="text-xs font-semibold px-3 py-1 rounded-lg transition-all hover:bg-[var(--surface-alt)]" style={{ color: "var(--primary)" }}>
                  Charger un exemple
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-lg font-mono" style={{ color: "var(--muted)" }}>/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="flex-1 rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: error ? "#dc2626" : "var(--border)", fontFamily: "monospace" }}
                  placeholder="Entrez votre regex..."
                />
                <span className="text-lg font-mono" style={{ color: "var(--muted)" }}>/{flagString}</span>
              </div>

              {error && (
                <p className="mt-2 text-xs font-semibold" style={{ color: "#dc2626" }}>{error}</p>
              )}

              {/* Flags */}
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="text-xs font-medium self-center" style={{ color: "var(--muted)" }}>Drapeaux :</span>
                {(["g", "i", "m", "s"] as const).map((flag) => {
                  const labels: Record<string, string> = { g: "global", i: "insensible", m: "multiline", s: "dotAll" };
                  return (
                    <button
                      key={flag}
                      onClick={() => toggleFlag(flag)}
                      className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
                      style={{
                        borderColor: flags[flag] ? "var(--primary)" : "var(--border)",
                        background: flags[flag] ? "var(--primary)" : "transparent",
                        color: flags[flag] ? "#fff" : "inherit",
                      }}
                    >
                      {flag} <span className="opacity-70">({labels[flag]})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test string */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Texte de test</h2>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                rows={6}
                className="mt-4 w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: "var(--border)", fontFamily: "monospace", resize: "vertical" }}
                placeholder="Collez votre texte de test ici..."
              />
            </div>

            {/* Highlighted result */}
            {highlightedText && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                    Resultat : {matches.length} correspondance{matches.length > 1 ? "s" : ""}
                  </h2>
                </div>
                <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "monospace" }}>
                    {highlightedText}
                  </div>
                </div>
              </div>
            )}

            {/* Match details */}
            {matches.length > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                    Details des correspondances
                  </h2>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: "var(--surface-alt)" }}>
                        <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: "var(--muted)" }}>#</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: "var(--muted)" }}>Match</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: "var(--muted)" }}>Index</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold" style={{ color: "var(--muted)" }}>Groupes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((match, i) => (
                        <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                          <td className="px-4 py-2 text-xs" style={{ color: "var(--muted)" }}>{i + 1}</td>
                          <td className="px-4 py-2 text-sm font-semibold" style={{ fontFamily: "monospace", color: "var(--primary)" }}>
                            {match.fullMatch}
                          </td>
                          <td className="px-4 py-2 text-xs" style={{ color: "var(--muted)" }}>{match.index}</td>
                          <td className="px-4 py-2 text-xs" style={{ fontFamily: "monospace" }}>
                            {match.groups.length > 0
                              ? match.groups.map((g, j) => (
                                  <span key={j} className="inline-block mr-2 rounded px-2 py-0.5 mb-1" style={{ background: "rgba(232,150,62,0.1)", color: "var(--accent)" }}>
                                    ${j + 1}: {g || "(vide)"}
                                  </span>
                                ))
                              : <span style={{ color: "var(--muted)" }}>Aucun groupe</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Copy buttons */}
            {pattern && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Exporter</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => copyRegex("js")}
                    className="rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                    style={{ borderColor: "var(--border)", color: copied === "js" ? "var(--accent)" : "inherit" }}
                  >
                    {copied === "js" ? "Copie !" : `JavaScript: /${pattern}/${flagString}`}
                  </button>
                  <button
                    onClick={() => copyRegex("python")}
                    className="rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                    style={{ borderColor: "var(--border)", color: copied === "python" ? "var(--accent)" : "inherit" }}
                  >
                    {copied === "python" ? "Copie !" : `Python: r"${pattern}"`}
                  </button>
                  <button
                    onClick={() => copyRegex("raw")}
                    className="rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                    style={{ borderColor: "var(--border)", color: copied === "raw" ? "var(--accent)" : "inherit" }}
                  >
                    {copied === "raw" ? "Copie !" : "Pattern brut"}
                  </button>
                </div>
              </div>
            )}

            {/* Common patterns library */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Bibliotheque de patterns</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {COMMON_PATTERNS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => applyPattern(p.pattern)}
                    className="rounded-xl border p-3 text-left transition-all hover:bg-[var(--surface-alt)] hover:border-[var(--primary)]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{p.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>{p.description}</span>
                    </div>
                    <code className="mt-1 block text-xs truncate" style={{ fontFamily: "monospace", color: "var(--primary)" }}>{p.pattern}</code>
                  </button>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Aide-memoire Regex</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs" style={{ fontFamily: "monospace" }}>
                {[
                  { token: ".", desc: "Tout caractere" },
                  { token: "\\d", desc: "Chiffre [0-9]" },
                  { token: "\\w", desc: "Mot [a-zA-Z0-9_]" },
                  { token: "\\s", desc: "Espace blanc" },
                  { token: "^", desc: "Debut de ligne" },
                  { token: "$", desc: "Fin de ligne" },
                  { token: "*", desc: "0 ou plus" },
                  { token: "+", desc: "1 ou plus" },
                  { token: "?", desc: "0 ou 1" },
                  { token: "{n}", desc: "Exactement n" },
                  { token: "{n,m}", desc: "Entre n et m" },
                  { token: "(abc)", desc: "Groupe capture" },
                  { token: "[abc]", desc: "Ensemble" },
                  { token: "[^abc]", desc: "Negation" },
                  { token: "a|b", desc: "Alternance" },
                ].map((item) => (
                  <div key={item.token} className="rounded-lg p-2" style={{ background: "var(--surface-alt)" }}>
                    <span style={{ color: "var(--primary)" }}>{item.token}</span>
                    <span className="ml-2" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Drapeaux</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li><strong className="text-[var(--foreground)]">g</strong> : Toutes les correspondances</li>
                <li><strong className="text-[var(--foreground)]">i</strong> : Insensible a la casse</li>
                <li><strong className="text-[var(--foreground)]">m</strong> : ^ et $ par ligne</li>
                <li><strong className="text-[var(--foreground)]">s</strong> : . inclut \n</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
