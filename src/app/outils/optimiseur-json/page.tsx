"use client";

import { useState, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type TokenType = "key" | "string" | "number" | "boolean" | "null" | "brace" | "bracket" | "comma" | "colon";

interface Token {
  type: TokenType;
  value: string;
}

function tokenizeJson(json: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < json.length) {
    const ch = json[i];
    if (ch === " " || ch === "\n" || ch === "\t" || ch === "\r") {
      tokens.push({ type: "string", value: ch });
      i++;
    } else if (ch === "{" || ch === "}") {
      tokens.push({ type: "brace", value: ch });
      i++;
    } else if (ch === "[" || ch === "]") {
      tokens.push({ type: "bracket", value: ch });
      i++;
    } else if (ch === ",") {
      tokens.push({ type: "comma", value: ch });
      i++;
    } else if (ch === ":") {
      tokens.push({ type: "colon", value: ch });
      i++;
    } else if (ch === '"') {
      let str = '"';
      i++;
      while (i < json.length && json[i] !== '"') {
        if (json[i] === "\\") {
          str += json[i] + json[i + 1];
          i += 2;
        } else {
          str += json[i];
          i++;
        }
      }
      str += '"';
      i++;
      // Check if this is a key (next non-whitespace is ':')
      let j = i;
      while (j < json.length && (json[j] === " " || json[j] === "\n" || json[j] === "\t" || json[j] === "\r")) j++;
      const isKey = json[j] === ":";
      tokens.push({ type: isKey ? "key" : "string", value: str });
    } else if (ch === "t" || ch === "f") {
      const word = ch === "t" ? "true" : "false";
      tokens.push({ type: "boolean", value: word });
      i += word.length;
    } else if (ch === "n") {
      tokens.push({ type: "null", value: "null" });
      i += 4;
    } else if (ch === "-" || (ch >= "0" && ch <= "9")) {
      let num = "";
      while (i < json.length && /[0-9eE.+\-]/.test(json[i])) {
        num += json[i];
        i++;
      }
      tokens.push({ type: "number", value: num });
    } else {
      tokens.push({ type: "string", value: ch });
      i++;
    }
  }
  return tokens;
}

const TOKEN_COLORS: Record<TokenType, string> = {
  key: "#0d4f3c",
  string: "#e8963e",
  number: "#2563eb",
  boolean: "#9333ea",
  null: "#dc2626",
  brace: "#64748b",
  bracket: "#64748b",
  comma: "#64748b",
  colon: "#64748b",
};

function sortKeysDeep(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (obj !== null && typeof obj === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>).sort()) {
      sorted[key] = sortKeysDeep((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return obj;
}

export default function OptimiseurJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ lines: 0, size: 0, keys: 0 });

  const updateStats = useCallback((text: string) => {
    const lines = text.split("\n").length;
    const size = new Blob([text]).size;
    let keys = 0;
    try {
      const countKeys = (obj: unknown): number => {
        if (Array.isArray(obj)) return obj.reduce((acc, v) => acc + countKeys(v), 0);
        if (obj !== null && typeof obj === "object") {
          return Object.keys(obj as Record<string, unknown>).length + Object.values(obj as Record<string, unknown>).reduce((acc: number, v) => acc + countKeys(v), 0);
        }
        return 0;
      };
      keys = countKeys(JSON.parse(text));
    } catch { /* ignore */ }
    setStats({ lines, size, keys });
  }, []);

  const format = useCallback(() => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      updateStats(formatted);
    } catch (e) {
      setError(`JSON invalide : ${(e as Error).message}`);
      setOutput("");
    }
  }, [input, indent, updateStats]);

  const minify = useCallback(() => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      updateStats(minified);
    } catch (e) {
      setError(`JSON invalide : ${(e as Error).message}`);
      setOutput("");
    }
  }, [input, updateStats]);

  const sortKeys = useCallback(() => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      const sorted = sortKeysDeep(parsed);
      const formatted = JSON.stringify(sorted, null, indent);
      setOutput(formatted);
      updateStats(formatted);
    } catch (e) {
      setError(`JSON invalide : ${(e as Error).message}`);
      setOutput("");
    }
  }, [input, indent, updateStats]);

  const validate = useCallback(() => {
    try {
      JSON.parse(input);
      setError("");
      setOutput("JSON valide !");
    } catch (e) {
      setError(`JSON invalide : ${(e as Error).message}`);
      setOutput("");
    }
  }, [input]);

  const copyOutput = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderHighlighted = () => {
    if (!output || output === "JSON valide !") return null;
    const tokens = tokenizeJson(output);
    return tokens.map((token, i) => (
      <span key={i} style={{ color: TOKEN_COLORS[token.type] || "inherit" }}>{token.value}</span>
    ));
  };

  const loadExample = () => {
    setInput(JSON.stringify({
      nom: "Dupont",
      prenom: "Jean",
      age: 34,
      actif: true,
      adresse: { rue: "12 rue de Paris", ville: "Lyon", cp: "69001" },
      competences: ["JavaScript", "TypeScript", "React", "Node.js"],
      experience: null
    }, null, 2));
    setOutput("");
    setError("");
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Optimiseur <span style={{ color: "var(--primary)" }}>JSON</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Formatez, validez, minifiez et triez vos donnees JSON. Coloration syntaxique incluse.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>JSON en entree</h2>
                <button onClick={loadExample} className="text-xs font-semibold px-3 py-1 rounded-lg transition-all hover:bg-[var(--surface-alt)]" style={{ color: "var(--primary)" }}>
                  Charger un exemple
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(""); setOutput(""); }}
                rows={10}
                className="mt-4 w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: "var(--border)", fontFamily: "monospace", resize: "vertical" }}
                placeholder='{"cle": "valeur", ...}'
              />
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{input.length} caracteres &middot; {input.split("\n").length} lignes</p>
            </div>

            {/* Options */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Options</h2>
              <div className="mt-4 flex items-center gap-4">
                <label className="text-sm font-medium">Indentation :</label>
                {[2, 4, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => setIndent(n)}
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      borderColor: indent === n ? "var(--primary)" : "var(--border)",
                      background: indent === n ? "var(--primary)" : "transparent",
                      color: indent === n ? "#fff" : "inherit",
                    }}
                  >
                    {n} espaces
                  </button>
                ))}
                <button
                  onClick={() => setIndent(0)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    borderColor: indent === 0 ? "var(--primary)" : "var(--border)",
                    background: indent === 0 ? "var(--primary)" : "transparent",
                    color: indent === 0 ? "#fff" : "inherit",
                  }}
                >
                  Tab
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button onClick={format} className="rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                Formater
              </button>
              <button onClick={minify} className="rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--accent)" }}>
                Minifier
              </button>
              <button onClick={sortKeys} className="rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]" style={{ borderColor: "var(--border)" }}>
                Trier les cles
              </button>
              <button onClick={validate} className="rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]" style={{ borderColor: "var(--border)" }}>
                Valider
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border p-4" style={{ background: "#fef2f2", borderColor: "#fca5a5" }}>
                <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>{error}</p>
              </div>
            )}

            {/* Output */}
            {output && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Resultat</h2>
                  <div className="flex items-center gap-3">
                    {output !== "JSON valide !" && (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {stats.lines} lignes &middot; {stats.size} octets &middot; {stats.keys} cles
                      </span>
                    )}
                    <button onClick={copyOutput} className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90" style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                      {copied ? "Copie !" : "Copier"}
                    </button>
                  </div>
                </div>
                {output === "JSON valide !" ? (
                  <div className="p-6 text-center">
                    <p className="text-4xl">&#9989;</p>
                    <p className="mt-2 text-sm font-semibold" style={{ color: "#16a34a" }}>JSON valide !</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto p-5">
                    <pre className="text-sm leading-relaxed whitespace-pre" style={{ fontFamily: "monospace" }}>
                      {renderHighlighted()}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A propos</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Formater</strong> : Ajoute l&apos;indentation et les retours a la ligne pour rendre le JSON lisible.</p>
                <p><strong className="text-[var(--foreground)]">Minifier</strong> : Supprime tous les espaces et retours a la ligne pour reduire la taille.</p>
                <p><strong className="text-[var(--foreground)]">Trier les cles</strong> : Ordonne toutes les cles par ordre alphabetique, recurssivement.</p>
                <p><strong className="text-[var(--foreground)]">Coloration</strong> : <span style={{ color: "#0d4f3c" }}>cles</span>, <span style={{ color: "#e8963e" }}>texte</span>, <span style={{ color: "#2563eb" }}>nombres</span>, <span style={{ color: "#9333ea" }}>booleens</span>, <span style={{ color: "#dc2626" }}>null</span>.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Raccourcis JSON</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li><strong className="text-[var(--foreground)]">Objet</strong> : {`{ "cle": "valeur" }`}</li>
                <li><strong className="text-[var(--foreground)]">Tableau</strong> : {`[1, 2, 3]`}</li>
                <li><strong className="text-[var(--foreground)]">Types</strong> : string, number, boolean, null, object, array</li>
                <li><strong className="text-[var(--foreground)]">Echappement</strong> : \n, \t, \\, \"</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
