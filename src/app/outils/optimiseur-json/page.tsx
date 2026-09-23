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

/* ─── Lossless JSON model ───
 * JSON.parse + JSON.stringify silently alters data: integers above 2^53
 * (IDs such as 12345678901234567890) lose precision, 1.0 becomes 1 and
 * duplicate keys are dropped. The input is first validated with JSON.parse,
 * then re-read into this small tree that keeps every number / string exactly
 * as written. */
type JNode =
  | { t: "obj"; entries: [string, JNode][] }
  | { t: "arr"; items: JNode[] }
  | { t: "lit"; raw: string };

function parseLossless(src: string): JNode {
  let i = 0;
  const ws = () => {
    while (i < src.length && (src[i] === " " || src[i] === "\n" || src[i] === "\t" || src[i] === "\r")) i++;
  };
  const str = (): string => {
    const start = i;
    i++; // opening quote
    while (src[i] !== '"') i += src[i] === "\\" ? 2 : 1;
    i++; // closing quote
    return src.slice(start, i);
  };
  const value = (): JNode => {
    ws();
    const ch = src[i];
    if (ch === "{") {
      i++;
      const entries: [string, JNode][] = [];
      ws();
      if (src[i] === "}") { i++; return { t: "obj", entries }; }
      for (;;) {
        ws();
        const key = str();
        ws();
        i++; // colon
        entries.push([key, value()]);
        ws();
        if (src[i++] === "}") return { t: "obj", entries };
      }
    }
    if (ch === "[") {
      i++;
      const items: JNode[] = [];
      ws();
      if (src[i] === "]") { i++; return { t: "arr", items }; }
      for (;;) {
        items.push(value());
        ws();
        if (src[i++] === "]") return { t: "arr", items };
      }
    }
    if (ch === '"') return { t: "lit", raw: str() };
    const start = i;
    while (i < src.length && !/[\s,\]}]/.test(src[i])) i++;
    return { t: "lit", raw: src.slice(start, i) };
  };
  return value();
}

function printLossless(node: JNode, indent: string, level = 0): string {
  const nl = indent ? "\n" : "";
  const pad = indent.repeat(level + 1);
  const end = indent.repeat(level);
  const sep = indent ? ": " : ":";
  if (node.t === "lit") return node.raw;
  if (node.t === "arr") {
    if (node.items.length === 0) return "[]";
    return `[${nl}${node.items.map((v) => pad + printLossless(v, indent, level + 1)).join("," + nl)}${nl}${end}]`;
  }
  if (node.entries.length === 0) return "{}";
  return `{${nl}${node.entries.map(([k, v]) => pad + k + sep + printLossless(v, indent, level + 1)).join("," + nl)}${nl}${end}}`;
}

function sortLossless(node: JNode): JNode {
  if (node.t === "arr") return { t: "arr", items: node.items.map(sortLossless) };
  if (node.t === "obj") {
    const entries = node.entries.map(([k, v]) => [k, sortLossless(v)] as [string, JNode]);
    entries.sort(([a], [b]) => {
      const ka = JSON.parse(a) as string;
      const kb = JSON.parse(b) as string;
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });
    return { t: "obj", entries };
  }
  return node;
}

function countKeys(node: JNode): number {
  if (node.t === "arr") return node.items.reduce((acc, v) => acc + countKeys(v), 0);
  if (node.t === "obj") return node.entries.reduce((acc, [, v]) => acc + 1 + countKeys(v), 0);
  return 0;
}

// Adds "ligne X, colonne Y" when the engine only gives a character offset.
function describeJsonError(e: unknown, source: string): string {
  const msg = e instanceof Error ? e.message : String(e);
  const m = msg.match(/position (\d+)/);
  if (m && !/line \d+/i.test(msg)) {
    const before = source.slice(0, Number(m[1]));
    const line = before.split("\n").length;
    const col = before.length - before.lastIndexOf("\n");
    return `JSON invalide (ligne ${line}, colonne ${col}) : ${msg}`;
  }
  return `JSON invalide : ${msg}`;
}

// Validates with the native parser (precise error messages), then builds the lossless tree.
function readJson(input: string): JNode {
  try {
    JSON.parse(input);
  } catch (e) {
    throw new Error(describeJsonError(e, input));
  }
  return parseLossless(input);
}

export default function OptimiseurJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ lines: 0, size: 0, keys: 0 });

  const showResult = useCallback((text: string, tree: JNode) => {
    setOutput(text);
    setStats({ lines: text.split("\n").length, size: new Blob([text]).size, keys: countKeys(tree) });
  }, []);

  const run = useCallback((transform: (tree: JNode) => string | null) => {
    setError("");
    try {
      const tree = readJson(input);
      const text = transform(tree);
      if (text === null) {
        setOutput("JSON valide !");
      } else {
        showResult(text, tree);
      }
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  }, [input, showResult]);

  const indentString = indent === 0 ? "\t" : " ".repeat(indent);
  const format = () => run((tree) => printLossless(tree, indentString));
  const minify = () => run((tree) => printLossless(tree, ""));
  const sortKeys = () => run((tree) => printLossless(sortLossless(tree), indentString));
  const validate = () => run(() => null);

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
            Formatez, validez, minifiez et triez vos données JSON. Coloration syntaxique incluse.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>JSON en entrée</h2>
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
                placeholder='{"clé": "valeur", ...}'
              />
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{input.length} caractères &middot; {input.split("\n").length} lignes</p>
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
                Trier les clés
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
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Résultat</h2>
                  <div className="flex items-center gap-3">
                    {output !== "JSON valide !" && (
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {stats.lines} lignes &middot; {stats.size} octets &middot; {stats.keys} clés
                      </span>
                    )}
                    <button onClick={copyOutput} className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90" style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                      {copied ? "Copié !" : "Copier"}
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
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>À propos</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Formater</strong> : Ajoute l&apos;indentation et les retours à la ligne pour rendre le JSON lisible.</p>
                <p><strong className="text-[var(--foreground)]">Minifier</strong> : Supprime tous les espaces et retours à la ligne pour réduire la taille.</p>
                <p><strong className="text-[var(--foreground)]">Trier les clés</strong> : Ordonne toutes les clés par ordre alphabétique, récursivement.</p>
                <p><strong className="text-[var(--foreground)]">Sans perte</strong> : les nombres et les chaînes sont recopiés exactement tels qu&apos;ils sont écrits. Les grands identifiants (au-delà de 2<sup>53</sup>, par exemple 12345678901234567890) ne sont pas arrondis et 1.0 reste 1.0, contrairement à un simple JSON.parse / JSON.stringify.</p>
                <p><strong className="text-[var(--foreground)]">Coloration</strong> : <span style={{ color: "#0d4f3c" }}>clés</span>, <span style={{ color: "#e8963e" }}>texte</span>, <span style={{ color: "#2563eb" }}>nombres</span>, <span style={{ color: "#9333ea" }}>booléens</span>, <span style={{ color: "#dc2626" }}>null</span>.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser l&apos;optimiseur JSON en ligne
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Notre optimiseur JSON est un outil complet pour les développeurs : formatage, minification, validation et tri des clés.
                  Collez votre JSON brut et transformez-le en un clic.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Collez votre JSON</strong> : dans la zone de saisie ou chargez l&apos;exemple</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez l&apos;indentation</strong> : 2, 4 ou 8 espaces selon vos préférences</li>
                  <li><strong className="text-[var(--foreground)]">Formatez ou minifiez</strong> : rendez le JSON lisible ou compactez-le pour réduire sa taille</li>
                  <li><strong className="text-[var(--foreground)]">Validez et triez</strong> : vérifiez la syntaxe et ordonnez les clés alphabétiquement</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qu&apos;est-ce que le format JSON ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>JSON (JavaScript Object Notation) est un format de données textuel léger utilisé pour l&apos;échange de données entre un serveur et un client. Il est lisible par les humains et facile à parser par les machines. C&apos;est le format standard des APIs REST modernes.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi minifier du JSON ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La minification supprime les espaces, tabulations et retours à la ligne superflus. Cela réduit la taille du fichier de 30 à 50%, ce qui accélère les transferts réseau et réduit la bande passante utilisée par vos APIs.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>À quoi sert le tri des clés ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Trier les clés alphabétiquement facilite la lecture et la comparaison de fichiers JSON. C&apos;est utile pour les fichiers de configuration, les schémas d&apos;API et le versionnage avec Git (les diffs sont plus lisibles).</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Raccourcis JSON</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li><strong className="text-[var(--foreground)]">Objet</strong> : {`{ "clé": "valeur" }`}</li>
                <li><strong className="text-[var(--foreground)]">Tableau</strong> : {`[1, 2, 3]`}</li>
                <li><strong className="text-[var(--foreground)]">Types</strong> : string, number, boolean, null, object, array</li>
                <li><strong className="text-[var(--foreground)]">Échappement</strong> : {"\\n, \\t, \\\\, \\\""}</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
