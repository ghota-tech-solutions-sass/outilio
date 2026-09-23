"use client";

import { useState, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface DiffLine {
  type: "equal" | "added" | "removed";
  text: string;
  leftNum?: number;
  rightNum?: number;
}

// Above this many LCS cells (lines A x lines B after trimming the common
// prefix/suffix) the O(n*m) table would freeze the browser.
const MAX_LINE_CELLS = 25_000_000;
// Above this many cells, the character-level highlight is skipped for a line pair.
const MAX_CHAR_CELLS = 1_000_000;

function lcsTable(a: string[], b: string[]): Uint32Array[] {
  const m = a.length;
  const n = b.length;
  const dp: Uint32Array[] = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

function splitLines(text: string): string[] {
  return text.replace(/\r\n?/g, "\n").split("\n");
}

function computeDiff(textA: string, textB: string): DiffLine[] {
  const a = splitLines(textA);
  const b = splitLines(textB);

  // Common prefix / suffix are equal lines: no need to run LCS on them.
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }

  const midA = a.slice(start, endA);
  const midB = b.slice(start, endB);
  if ((midA.length + 1) * (midB.length + 1) > MAX_LINE_CELLS) {
    throw new Error("TOO_LARGE");
  }
  const dp = lcsTable(midA, midB);

  const stack: DiffLine[] = [];
  let i = midA.length;
  let j = midB.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && midA[i - 1] === midB[j - 1]) {
      stack.push({ type: "equal", text: midA[i - 1], leftNum: start + i, rightNum: start + j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "added", text: midB[j - 1], rightNum: start + j });
      j--;
    } else {
      stack.push({ type: "removed", text: midA[i - 1], leftNum: start + i });
      i--;
    }
  }

  const result: DiffLine[] = [];
  for (let k = 0; k < start; k++) {
    result.push({ type: "equal", text: a[k], leftNum: k + 1, rightNum: k + 1 });
  }
  while (stack.length) result.push(stack.pop()!);
  for (let k = 0; k < a.length - endA; k++) {
    result.push({ type: "equal", text: a[endA + k], leftNum: endA + k + 1, rightNum: endB + k + 1 });
  }
  return result;
}

function highlightInlineChanges(removed: string, added: string): { removedSpans: React.ReactNode; addedSpans: React.ReactNode } {
  // Array.from keeps emoji / astral characters intact (split("") would cut surrogate pairs)
  const rChars = Array.from(removed);
  const aChars = Array.from(added);
  const m = rChars.length;
  const n = aChars.length;

  if ((m + 1) * (n + 1) > MAX_CHAR_CELLS) {
    return { removedSpans: removed, addedSpans: added };
  }

  const dp: Uint32Array[] = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (rChars[i - 1] === aChars[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const rMarked = new Array(m).fill(false);
  const aMarked = new Array(n).fill(false);
  let ii = m, jj = n;
  while (ii > 0 && jj > 0) {
    if (rChars[ii - 1] === aChars[jj - 1]) {
      ii--;
      jj--;
    } else if (dp[ii][jj - 1] >= dp[ii - 1][jj]) {
      aMarked[jj - 1] = true;
      jj--;
    } else {
      rMarked[ii - 1] = true;
      ii--;
    }
  }
  while (ii > 0) { rMarked[ii - 1] = true; ii--; }
  while (jj > 0) { aMarked[jj - 1] = true; jj--; }

  const removedSpans = rChars.map((ch, idx) => (
    <span key={idx} style={rMarked[idx] ? { background: "rgba(220,38,38,0.3)", borderRadius: "2px" } : undefined}>{ch}</span>
  ));
  const addedSpans = aChars.map((ch, idx) => (
    <span key={idx} style={aMarked[idx] ? { background: "rgba(22,163,74,0.3)", borderRadius: "2px" } : undefined}>{ch}</span>
  ));

  return { removedSpans: <>{removedSpans}</>, addedSpans: <>{addedSpans}</> };
}

export default function ComparateurTexte() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState({ added: 0, removed: 0, unchanged: 0 });
  const [showInline, setShowInline] = useState(true);

  const [error, setError] = useState("");

  const compare = useCallback(() => {
    try {
      const result = computeDiff(textA, textB);
      setError("");
      setDiff(result);
      setStats({
        added: result.filter((d) => d.type === "added").length,
        removed: result.filter((d) => d.type === "removed").length,
        unchanged: result.filter((d) => d.type === "equal").length,
      });
    } catch {
      setDiff([]);
      setStats({ added: 0, removed: 0, unchanged: 0 });
      setError("Les textes sont trop volumineux et trop différents pour être comparés dans le navigateur (plusieurs milliers de lignes modifiées de part et d'autre). Comparez-les par morceaux.");
    }
  }, [textA, textB]);

  const clear = () => {
    setTextA("");
    setTextB("");
    setDiff([]);
    setError("");
    setStats({ added: 0, removed: 0, unchanged: 0 });
  };

  const loadExample = () => {
    setTextA("Bonjour le monde\nCeci est un test\nLigne trois\nLigne quatre\nFin du texte");
    setTextB("Bonjour le monde !\nCeci est un essai\nLigne trois\nNouvelle ligne\nFin du texte");
    setDiff([]);
    setError("");
  };

  const renderLine = (line: DiffLine, key: string, content?: React.ReactNode) => {
    if (line.type === "equal") {
      return (
        <div key={key} className="flex" style={{ background: "transparent" }}>
          <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "var(--muted)", borderRight: "1px solid var(--border)" }}>{line.leftNum}</span>
          <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "var(--muted)", borderRight: "1px solid var(--border)" }}>{line.rightNum}</span>
          <span className="px-3 leading-6 text-sm whitespace-pre" style={{ fontFamily: "monospace" }}>{line.text}</span>
        </div>
      );
    }
    const removed = line.type === "removed";
    const color = removed ? "#dc2626" : "#16a34a";
    return (
      <div key={key} className="flex" style={{ background: removed ? "rgba(220,38,38,0.08)" : "rgba(22,163,74,0.08)" }}>
        <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: removed ? color : "var(--muted)", borderRight: "1px solid var(--border)" }}>{removed ? line.leftNum : ""}</span>
        <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: removed ? "var(--muted)" : color, borderRight: "1px solid var(--border)" }}>{removed ? "" : line.rightNum}</span>
        <span className="px-1 leading-6 text-sm font-bold select-none" style={{ color }}>{removed ? "\u2212" : "+"}</span>
        <span className="px-2 leading-6 text-sm whitespace-pre" style={{ fontFamily: "monospace", color }}>{content ?? line.text}</span>
      </div>
    );
  };

  // A block of removed lines followed by a block of added lines is shown as
  // "all removals, then all additions"; lines are paired in order for the
  // character-level highlight.
  const renderDiffLines = () => {
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < diff.length) {
      if (diff[i].type === "equal") {
        elements.push(renderLine(diff[i], `e-${i}`));
        i++;
        continue;
      }
      const removed: DiffLine[] = [];
      const added: DiffLine[] = [];
      while (i < diff.length && diff[i].type === "removed") removed.push(diff[i++]);
      while (i < diff.length && diff[i].type === "added") added.push(diff[i++]);
      const pairs = showInline ? Math.min(removed.length, added.length) : 0;
      const inline = Array.from({ length: pairs }, (_, k) => highlightInlineChanges(removed[k].text, added[k].text));
      removed.forEach((line, k) => elements.push(renderLine(line, `r-${line.leftNum}`, k < pairs ? inline[k].removedSpans : undefined)));
      added.forEach((line, k) => elements.push(renderLine(line, `a-${line.rightNum}`, k < pairs ? inline[k].addedSpans : undefined)));
    }
    return elements;
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Comparateur de <span style={{ color: "var(--primary)" }}>texte</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Collez deux textes et visualisez les différences ligne par ligne. Ajouts en vert, suppressions en rouge. Algorithme LCS.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Texte original</h2>
                <textarea
                  value={textA}
                  onChange={(e) => setTextA(e.target.value)}
                  rows={10}
                  className="mt-3 w-full rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: "var(--border)", fontFamily: "monospace", resize: "vertical" }}
                  placeholder="Collez le texte original ici..."
                />
                <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{textA ? textA.split("\n").length : 0} lignes &middot; {textA.length} car.</p>
              </div>
              <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Texte modifié</h2>
                <textarea
                  value={textB}
                  onChange={(e) => setTextB(e.target.value)}
                  rows={10}
                  className="mt-3 w-full rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: "var(--border)", fontFamily: "monospace", resize: "vertical" }}
                  placeholder="Collez le texte modifié ici..."
                />
                <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{textB ? textB.split("\n").length : 0} lignes &middot; {textB.length} car.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={compare}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "var(--primary)" }}
              >
                Comparer
              </button>
              <button
                onClick={loadExample}
                className="rounded-xl border px-5 py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                style={{ borderColor: "var(--border)" }}
              >
                Exemple
              </button>
              <button
                onClick={clear}
                className="rounded-xl border px-5 py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                style={{ borderColor: "var(--border)" }}
              >
                Effacer
              </button>
            </div>

            {error && (
              <div className="rounded-2xl border p-4" style={{ background: "#fef2f2", borderColor: "#fca5a5" }}>
                <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>{error}</p>
              </div>
            )}

            {/* Options */}
            <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInline}
                  onChange={(e) => setShowInline(e.target.checked)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span>Surligner les différences au niveau des caractères</span>
              </label>
            </div>

            {/* Stats */}
            {diff.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border p-4 text-center" style={{ background: "rgba(22,163,74,0.06)", borderColor: "rgba(22,163,74,0.2)" }}>
                  <p className="text-2xl font-bold" style={{ color: "#16a34a", fontFamily: "var(--font-display)" }}>+{stats.added}</p>
                  <p className="text-xs mt-1" style={{ color: "#16a34a" }}>Ligne{stats.added > 1 ? "s" : ""} ajoutée{stats.added > 1 ? "s" : ""}</p>
                </div>
                <div className="rounded-xl border p-4 text-center" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)" }}>
                  <p className="text-2xl font-bold" style={{ color: "#dc2626", fontFamily: "var(--font-display)" }}>-{stats.removed}</p>
                  <p className="text-xs mt-1" style={{ color: "#dc2626" }}>Ligne{stats.removed > 1 ? "s" : ""} supprimée{stats.removed > 1 ? "s" : ""}</p>
                </div>
                <div className="rounded-xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-2xl font-bold" style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}>{stats.unchanged}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Ligne{stats.unchanged > 1 ? "s" : ""} identique{stats.unchanged > 1 ? "s" : ""}</p>
                </div>
              </div>
            )}

            {/* Diff output */}
            {diff.length > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Résultat du diff</h2>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>{diff.length} lignes</span>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  {renderDiffLines()}
                </div>
              </div>
            )}

            {diff.length === 0 && textA === "" && textB === "" && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-4xl">&#128269;</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Collez deux textes pour commencer</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Les différences seront affichées ici avec la coloration rouge/vert.</p>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>À propos du comparateur</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Algorithme LCS</strong> : Utilise la plus longue sous-séquence commune (Longest Common Subsequence) pour un diff précis. Les lignes identiques en début et en fin de texte sont écartées avant le calcul, ce qui permet de comparer rapidement de longs documents peu modifiés. Les fins de ligne Windows (CRLF) et Unix (LF) sont considérées comme équivalentes.</p>
                <p><strong className="text-[var(--foreground)]">Inline diff</strong> : Les changements au niveau des caractères sont surlignés pour identifier rapidement les modifications.</p>
                <p><strong className="text-[var(--foreground)]">100% local</strong> : Tout le traitement se fait dans votre navigateur. Les textes que vous collez ne sont envoyés à aucun serveur.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le comparateur de texte en ligne
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Notre comparateur de texte vous permet de détecter rapidement les différences entre deux versions d&apos;un document.
                  Que vous compariez du code source, des articles ou des contrats, l&apos;outil met en évidence chaque modification ligne par ligne.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Collez vos deux textes</strong> : dans les champs &laquo; Texte original &raquo; et &laquo; Texte modifié &raquo;</li>
                  <li><strong className="text-[var(--foreground)]">Cliquez sur Comparer</strong> : les ajouts apparaissent en vert, les suppressions en rouge</li>
                  <li><strong className="text-[var(--foreground)]">Activez le diff inline</strong> : pour voir les changements au niveau des caractères à l&apos;intérieur de chaque ligne</li>
                  <li><strong className="text-[var(--foreground)]">Statistiques</strong> : nombre de lignes ajoutées, supprimées et identiques</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Le comparateur fonctionne-t-il avec du code source ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, l&apos;outil compare n&apos;importe quel type de texte, y compris du code HTML, JavaScript, Python ou CSS. L&apos;algorithme LCS détecte les différences avec précision. Pour de très gros fichiers très différents (plusieurs milliers de lignes modifiées), le navigateur atteint ses limites et l&apos;outil vous invite à comparer par morceaux.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Mes données sont-elles envoyées à un serveur ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non. Le traitement est effectué entièrement dans votre navigateur grâce à JavaScript. Les textes comparés ne quittent pas votre ordinateur, ce qui garantit la confidentialité de vos documents.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la différence entre le diff par ligne et le diff inline ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le diff par ligne montre les lignes ajoutées ou supprimées. Le diff inline va plus loin en surlignant les caractères précis qui ont changé à l&apos;intérieur d&apos;une ligne modifiée, ce qui est utile pour repérer de petites corrections.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Légende</h3>
              <ul className="mt-3 space-y-3 text-xs">
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded" style={{ background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)" }}></span>
                  <span>Ligne ajoutée</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)" }}></span>
                  <span>Ligne supprimée</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}></span>
                  <span>Ligne identique</span>
                </li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
