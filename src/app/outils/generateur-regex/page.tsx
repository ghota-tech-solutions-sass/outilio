"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface MatchResult {
  fullMatch: string;
  groups: (string | null)[];
  index: number;
  length: number;
}

interface WorkerResult {
  key: string;
  matches: MatchResult[];
  error: string;
  truncated: boolean;
}

const MAX_MATCHES = 1000;
const NO_MATCHES: MatchResult[] = [];
const TIMEOUT_MS = 1500;

// Matching runs in a Web Worker: a pattern with catastrophic backtracking such as
// (a+)+$ on "aaaa…b" would otherwise freeze the page. The worker is killed after
// TIMEOUT_MS.
const WORKER_SOURCE = `
self.onmessage = function (e) {
  var d = e.data;
  try {
    var re = new RegExp(d.pattern, d.flags);
    var out = [];
    var toResult = function (m) {
      return {
        fullMatch: m[0],
        groups: Array.prototype.slice.call(m, 1).map(function (g) { return g === undefined ? null : g; }),
        index: m.index,
        length: m[0].length
      };
    };
    if (d.flags.indexOf("g") !== -1) {
      var m;
      while ((m = re.exec(d.text)) !== null && out.length < ${MAX_MATCHES}) {
        out.push(toResult(m));
        if (m[0].length === 0) re.lastIndex++;
      }
    } else {
      var one = re.exec(d.text);
      if (one) out.push(toResult(one));
    }
    self.postMessage({ key: d.key, matches: out, error: "", truncated: out.length >= ${MAX_MATCHES} });
  } catch (err) {
    self.postMessage({ key: d.key, matches: [], error: String((err && err.message) || err), truncated: false });
  }
};
`;

const COMMON_PATTERNS = [
  { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}", description: "Adresse email" },
  { name: "URL", pattern: "https?://[\\w.-]+(?:\\.[\\w.-]+)+[\\w.,@?^=%&:/~+#-]*", description: "Lien HTTP/HTTPS" },
  { name: "Téléphone FR", pattern: "(?:0|\\+33)[1-9](?:[\\s.-]?\\d{2}){4}", description: "Numéro français" },
  { name: "Code postal", pattern: "\\b\\d{5}\\b", description: "Code postal français" },
  { name: "Date JJ/MM/AAAA", pattern: "\\d{2}/\\d{2}/\\d{4}", description: "Date au format français" },
  { name: "Adresse IP", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", description: "IPv4" },
  { name: "Hex color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", description: "Couleur hexadécimale" },
  { name: "Nombre entier", pattern: "-?\\d+", description: "Entiers positifs/négatifs" },
  { name: "Nombre décimal", pattern: "-?\\d+[.,]\\d+", description: "Nombres à virgule" },
  { name: "Balise HTML", pattern: "<[^>]+>", description: "Tags HTML" },
  { name: "Mot (accents inclus)", pattern: "[A-Za-zÀ-ÖØ-öø-ÿœŒæÆ0-9_]+", description: "Un mot français" },
  { name: "Espaces multiples", pattern: "\\s{2,}", description: "2+ espaces consécutifs" },
];

export default function GenerateurRegex() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [copied, setCopied] = useState<string | null>(null);

  const flagString = useMemo(() => {
    return (flags.g ? "g" : "") + (flags.i ? "i" : "") + (flags.m ? "m" : "") + (flags.s ? "s" : "");
  }, [flags]);

  // Syntax errors are detected synchronously (compiling a regex never backtracks).
  const syntaxError = useMemo(() => {
    if (!pattern) return "";
    try {
      new RegExp(pattern, flagString);
      return "";
    } catch (e) {
      return `Regex invalide : ${(e as Error).message}`;
    }
  }, [pattern, flagString]);

  const jobKey = `${flagString}\u0000${pattern}\u0000${testString}`;
  const shouldRun = Boolean(pattern && testString && !syntaxError);
  const [result, setResult] = useState<WorkerResult | null>(null);

  useEffect(() => {
    if (!shouldRun) return;
    let worker: Worker | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
    try {
      worker = new Worker(url);
    } catch {
      URL.revokeObjectURL(url);
      timer = setTimeout(() => setResult({ key: jobKey, matches: [], error: "Votre navigateur ne permet pas d'exécuter le test en arrière-plan.", truncated: false }), 0);
      return () => clearTimeout(timer);
    }
    worker.onmessage = (e: MessageEvent<WorkerResult>) => {
      clearTimeout(timer);
      setResult(e.data);
      worker?.terminate();
    };
    timer = setTimeout(() => {
      worker?.terminate();
      setResult({
        key: jobKey,
        matches: [],
        error: `Temps d'exécution dépassé (${TIMEOUT_MS / 1000} s) : l'expression provoque probablement un « retour arrière catastrophique » (quantificateurs imbriqués comme (a+)+). Simplifiez-la ou rendez-la plus spécifique.`,
        truncated: false,
      });
    }, TIMEOUT_MS);
    worker.postMessage({ key: jobKey, pattern, flags: flagString, text: testString });
    return () => {
      clearTimeout(timer);
      worker?.terminate();
      URL.revokeObjectURL(url);
    };
  }, [shouldRun, jobKey, pattern, flagString, testString]);

  const current = shouldRun && result?.key === jobKey ? result : null;
  const pending = shouldRun && !current;
  const matches: MatchResult[] = current?.matches ?? NO_MATCHES;
  const error = syntaxError || current?.error || "";
  const truncated = current?.truncated ?? false;

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

  const jsLiteral = useMemo(() => {
    if (!pattern || syntaxError) return `/${pattern}/${flagString}`;
    return new RegExp(pattern, flagString).toString();
  }, [pattern, flagString, syntaxError]);

  const pythonCode = useMemo(() => {
    const pyFlags = [flags.i && "re.IGNORECASE", flags.m && "re.MULTILINE", flags.s && "re.DOTALL"].filter(Boolean).join(" | ");
    const quote = pattern.includes('"') && !pattern.includes("'") ? "'" : '"';
    return `re.compile(r${quote}${pattern}${quote}${pyFlags ? `, ${pyFlags}` : ""})`;
  }, [pattern, flags]);

  const copyRegex = async (format: string) => {
    let text = "";
    if (format === "js") text = jsLiteral;
    else if (format === "python") text = pythonCode;
    else text = pattern;
    await navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  const loadExample = () => {
    setPattern("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
    setTestString("Contactez-nous à support@outilis.fr ou info@example.com pour plus d'infos. Email invalide : test@");
    setFlags({ g: true, i: false, m: false, s: false });
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Testeur de <span style={{ color: "var(--primary)" }}>Regex</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Testez vos expressions régulières en temps réel. Surlignage des correspondances, groupes de capture et bibliothèque de patterns.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Pattern input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Expression régulière</h2>
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

            {pending && (
              <p className="text-xs" style={{ color: "var(--muted)" }}>Analyse en cours…</p>
            )}
            {current && !error && matches.length === 0 && (
              <div className="rounded-2xl border p-4 text-sm" style={{ background: "var(--surface)", borderColor: "var(--border)", color: "var(--muted)" }}>
                Aucune correspondance dans le texte de test.
              </div>
            )}

            {/* Highlighted result */}
            {highlightedText && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                    Résultat : {matches.length}{truncated ? "+" : ""} correspondance{matches.length > 1 ? "s" : ""}
                  </h2>
                </div>
                {truncated && (
                  <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>Affichage limité aux {MAX_MATCHES} premières correspondances.</p>
                )}
                <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "monospace" }}>
                    {highlightedText}
                  </div>
                </div>
              </div>
            )}

            {/* Match détails */}
            {matches.length > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                    Détails des correspondances
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
                                    ${j + 1}: {g === null ? "(non capturé)" : g || "(vide)"}
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
                    {copied === "js" ? "Copié !" : `JavaScript : ${jsLiteral}`}
                  </button>
                  <button
                    onClick={() => copyRegex("python")}
                    className="rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                    style={{ borderColor: "var(--border)", color: copied === "python" ? "var(--accent)" : "inherit" }}
                  >
                    {copied === "python" ? "Copié !" : `Python : ${pythonCode}`}
                  </button>
                  <button
                    onClick={() => copyRegex("raw")}
                    className="rounded-xl border py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                    style={{ borderColor: "var(--border)", color: copied === "raw" ? "var(--accent)" : "inherit" }}
                  >
                    {copied === "raw" ? "Copié !" : "Pattern brut"}
                  </button>
                </div>
              </div>
            )}

            {/* Common patterns library */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Bibliothèque de patterns</h2>
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
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Aide-mémoire Regex</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs" style={{ fontFamily: "monospace" }}>
                {[
                  { token: ".", desc: "Tout caractère" },
                  { token: "\\d", desc: "Chiffre [0-9]" },
                  { token: "\\w", desc: "Lettre, chiffre ou _ (sans accents)" },
                  { token: "\\s", desc: "Espace blanc" },
                  { token: "^", desc: "Début de ligne" },
                  { token: "$", desc: "Fin de ligne" },
                  { token: "*", desc: "0 ou plus" },
                  { token: "+", desc: "1 ou plus" },
                  { token: "?", desc: "0 ou 1" },
                  { token: "{n}", desc: "Exactement n" },
                  { token: "{n,m}", desc: "Entre n et m" },
                  { token: "(abc)", desc: "Groupe capture" },
                  { token: "[abc]", desc: "Ensemble" },
                  { token: "[^abc]", desc: "Négation" },
                  { token: "a|b", desc: "Alternance" },
                ].map((item) => (
                  <div key={item.token} className="rounded-lg p-2" style={{ background: "var(--surface-alt)" }}>
                    <span style={{ color: "var(--primary)" }}>{item.token}</span>
                    <span className="ml-2" style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment tester vos expressions régulières en ligne
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Notre testeur de regex vous permet de construire et valider vos expressions régulières en temps réel.
                  Visualisez instantanément les correspondances, les groupes de capture et exportez pour JavaScript ou Python.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Écrivez votre regex</strong> : dans le champ de saisie avec les drapeaux (g, i, m, s)</li>
                  <li><strong className="text-[var(--foreground)]">Collez un texte de test</strong> : les correspondances sont surlignées en temps réel</li>
                  <li><strong className="text-[var(--foreground)]">Consultez la bibliothèque</strong> : 12 patterns courants (email, URL, téléphone FR, IP...)</li>
                  <li><strong className="text-[var(--foreground)]">Exportez en un clic</strong> : format JavaScript, Python ou pattern brut</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qu&apos;est-ce qu&apos;une expression régulière (regex) ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Une expression régulière est un motif de recherche qui décrit un ensemble de chaînes de caractères. Les regex sont utilisées en programmation pour valider des formats (email, téléphone), rechercher des patterns dans du texte ou effectuer des remplacements avances.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle regex pour valider un email ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le pattern <code style={{ fontFamily: "monospace", color: "var(--primary)" }}>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]&#123;2,&#125;</code> couvre la plupart des adresses email valides. Cliquez sur &laquo; Email &raquo; dans la bibliothèque de patterns pour le charger directement.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>À quoi servent les drapeaux g, i, m et s ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le drapeau <strong>g</strong> (global) trouve toutes les correspondances, <strong>i</strong> ignore la casse, <strong>m</strong> (multiline) fait que ^ et $ s&apos;appliquent à chaque ligne, et <strong>s</strong> (dotAll) permet au point de correspondre aux retours à la ligne.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Drapeaux</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li><strong className="text-[var(--foreground)]">g</strong> : Toutes les correspondances</li>
                <li><strong className="text-[var(--foreground)]">i</strong> : Insensible à la casse</li>
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
