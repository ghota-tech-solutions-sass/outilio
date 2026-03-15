"use client";

import { useState, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface DiffLine {
  type: "equal" | "added" | "removed";
  text: string;
  leftNum?: number;
  rightNum?: number;
}

function lcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
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

function computeDiff(textA: string, textB: string): DiffLine[] {
  const a = textA.split("\n");
  const b = textB.split("\n");
  const dp = lcs(a, b);
  const result: DiffLine[] = [];

  let i = a.length;
  let j = b.length;
  const stack: DiffLine[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      stack.push({ type: "equal", text: a[i - 1], leftNum: i, rightNum: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "added", text: b[j - 1], rightNum: j });
      j--;
    } else if (i > 0) {
      stack.push({ type: "removed", text: a[i - 1], leftNum: i });
      i--;
    }
  }

  while (stack.length) {
    result.push(stack.pop()!);
  }

  return result;
}

function highlightInlineChanges(removed: string, added: string): { removedSpans: React.ReactNode; addedSpans: React.ReactNode } {
  const rChars = removed.split("");
  const aChars = added.split("");
  const m = rChars.length;
  const n = aChars.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (rChars[i - 1] === aChars[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack for removed line
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

  const compare = useCallback(() => {
    const result = computeDiff(textA, textB);
    setDiff(result);
    setStats({
      added: result.filter((d) => d.type === "added").length,
      removed: result.filter((d) => d.type === "removed").length,
      unchanged: result.filter((d) => d.type === "equal").length,
    });
  }, [textA, textB]);

  const clear = () => {
    setTextA("");
    setTextB("");
    setDiff([]);
    setStats({ added: 0, removed: 0, unchanged: 0 });
  };

  const loadExample = () => {
    setTextA("Bonjour le monde\nCeci est un test\nLigne trois\nLigne quatre\nFin du texte");
    setTextB("Bonjour le monde !\nCeci est un essai\nLigne trois\nNouvelle ligne\nFin du texte");
    setDiff([]);
  };

  // Group consecutive removed/added lines for inline highlighting
  const renderDiffLines = () => {
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < diff.length) {
      const line = diff[i];
      if (line.type === "equal") {
        elements.push(
          <div key={i} className="flex" style={{ background: "transparent" }}>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "var(--muted)", borderRight: "1px solid var(--border)" }}>{line.leftNum}</span>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "var(--muted)", borderRight: "1px solid var(--border)" }}>{line.rightNum}</span>
            <span className="px-3 leading-6 text-sm whitespace-pre" style={{ fontFamily: "monospace" }}>{line.text}</span>
          </div>
        );
        i++;
      } else if (showInline && line.type === "removed" && i + 1 < diff.length && diff[i + 1].type === "added") {
        const { removedSpans, addedSpans } = highlightInlineChanges(line.text, diff[i + 1].text);
        elements.push(
          <div key={`r-${i}`} className="flex" style={{ background: "rgba(220,38,38,0.08)" }}>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "#dc2626", borderRight: "1px solid var(--border)" }}>{line.leftNum}</span>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "var(--muted)", borderRight: "1px solid var(--border)" }}></span>
            <span className="px-1 leading-6 text-sm font-bold select-none" style={{ color: "#dc2626" }}>&minus;</span>
            <span className="px-2 leading-6 text-sm whitespace-pre" style={{ fontFamily: "monospace", color: "#dc2626" }}>{removedSpans}</span>
          </div>
        );
        elements.push(
          <div key={`a-${i}`} className="flex" style={{ background: "rgba(22,163,74,0.08)" }}>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "var(--muted)", borderRight: "1px solid var(--border)" }}></span>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "#16a34a", borderRight: "1px solid var(--border)" }}>{diff[i + 1].rightNum}</span>
            <span className="px-1 leading-6 text-sm font-bold select-none" style={{ color: "#16a34a" }}>+</span>
            <span className="px-2 leading-6 text-sm whitespace-pre" style={{ fontFamily: "monospace", color: "#16a34a" }}>{addedSpans}</span>
          </div>
        );
        i += 2;
      } else if (line.type === "removed") {
        elements.push(
          <div key={i} className="flex" style={{ background: "rgba(220,38,38,0.08)" }}>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "#dc2626", borderRight: "1px solid var(--border)" }}>{line.leftNum}</span>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "var(--muted)", borderRight: "1px solid var(--border)" }}></span>
            <span className="px-1 leading-6 text-sm font-bold select-none" style={{ color: "#dc2626" }}>&minus;</span>
            <span className="px-2 leading-6 text-sm whitespace-pre" style={{ fontFamily: "monospace", color: "#dc2626" }}>{line.text}</span>
          </div>
        );
        i++;
      } else {
        elements.push(
          <div key={i} className="flex" style={{ background: "rgba(22,163,74,0.08)" }}>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "var(--muted)", borderRight: "1px solid var(--border)" }}></span>
            <span className="flex-shrink-0 w-10 text-right pr-2 select-none text-xs leading-6" style={{ color: "#16a34a", borderRight: "1px solid var(--border)" }}>{line.rightNum}</span>
            <span className="px-1 leading-6 text-sm font-bold select-none" style={{ color: "#16a34a" }}>+</span>
            <span className="px-2 leading-6 text-sm whitespace-pre" style={{ fontFamily: "monospace", color: "#16a34a" }}>{line.text}</span>
          </div>
        );
        i++;
      }
    }
    return elements;
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Comparateur de <span style={{ color: "var(--primary)" }}>texte</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Collez deux textes et visualisez les differences ligne par ligne. Ajouts en vert, suppressions en rouge. Algorithme LCS.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
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
                <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{textA.split("\n").length} lignes &middot; {textA.length} car.</p>
              </div>
              <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Texte modifie</h2>
                <textarea
                  value={textB}
                  onChange={(e) => setTextB(e.target.value)}
                  rows={10}
                  className="mt-3 w-full rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: "var(--border)", fontFamily: "monospace", resize: "vertical" }}
                  placeholder="Collez le texte modifie ici..."
                />
                <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>{textB.split("\n").length} lignes &middot; {textB.length} car.</p>
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
                <span>Surligner les differences au niveau des caracteres</span>
              </label>
            </div>

            {/* Stats */}
            {diff.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border p-4 text-center" style={{ background: "rgba(22,163,74,0.06)", borderColor: "rgba(22,163,74,0.2)" }}>
                  <p className="text-2xl font-bold" style={{ color: "#16a34a", fontFamily: "var(--font-display)" }}>+{stats.added}</p>
                  <p className="text-xs mt-1" style={{ color: "#16a34a" }}>Ajoutee{stats.added > 1 ? "s" : ""}</p>
                </div>
                <div className="rounded-xl border p-4 text-center" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)" }}>
                  <p className="text-2xl font-bold" style={{ color: "#dc2626", fontFamily: "var(--font-display)" }}>-{stats.removed}</p>
                  <p className="text-xs mt-1" style={{ color: "#dc2626" }}>Supprimee{stats.removed > 1 ? "s" : ""}</p>
                </div>
                <div className="rounded-xl border p-4 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-2xl font-bold" style={{ color: "var(--muted)", fontFamily: "var(--font-display)" }}>{stats.unchanged}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Identique{stats.unchanged > 1 ? "s" : ""}</p>
                </div>
              </div>
            )}

            {/* Diff output */}
            {diff.length > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Resultat du diff</h2>
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
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>Les differences seront affichees ici avec la coloration rouge/vert.</p>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A propos du comparateur</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Algorithme LCS</strong> : Utilise la plus longue sous-sequence commune (Longest Common Subsequence) pour un diff precis.</p>
                <p><strong className="text-[var(--foreground)]">Inline diff</strong> : Les changements au niveau des caracteres sont surlignees pour identifier rapidement les modifications.</p>
                <p><strong className="text-[var(--foreground)]">100% local</strong> : Tout le traitement se fait dans votre navigateur. Aucune donnee n&apos;est envoyee.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Legende</h3>
              <ul className="mt-3 space-y-3 text-xs">
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded" style={{ background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)" }}></span>
                  <span>Ligne ajoutee</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded" style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)" }}></span>
                  <span>Ligne supprimee</span>
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
