"use client";

import { useState, useMemo, useCallback, useRef } from "react";

/* ─── Markdown Parser (regex-based, zero dependencies) ─── */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseInline(text: string): string {
  let result = text;

  // Images ![alt](url)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:8px 0" />');

  // Links [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--primary);text-decoration:underline">$1</a>');

  // Bold + Italic ***text*** or ___text___
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  result = result.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");

  // Bold **text** or __text__
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic *text* or _text_
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");
  result = result.replace(/_(.+?)_/g, "<em>$1</em>");

  // Strikethrough ~~text~~
  result = result.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Inline code `code`
  result = result.replace(/`([^`]+)`/g,
    '<code style="background:var(--surface-alt);padding:2px 6px;border-radius:4px;font-size:0.875em;font-family:monospace">$1</code>'
  );

  return result;
}

function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeLang = "";
  let codeContent: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code blocks ```
    if (line.trimStart().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.trimStart().slice(3).trim();
        codeContent = [];
        i++;
        continue;
      } else {
        inCodeBlock = false;
        const langLabel = codeLang
          ? `<div style="font-size:0.7em;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);padding:6px 12px;border-bottom:1px solid var(--border);background:var(--surface-alt)">${escapeHtml(codeLang)}</div>`
          : "";
        html.push(
          `<div style="border-radius:8px;overflow:hidden;border:1px solid var(--border);margin:12px 0">${langLabel}<pre style="margin:0;padding:12px;overflow-x:auto;background:var(--surface-alt);font-size:0.85em;line-height:1.6"><code>${escapeHtml(codeContent.join("\n"))}</code></pre></div>`
        );
        i++;
        continue;
      }
    }

    if (inCodeBlock) {
      codeContent.push(line);
      i++;
      continue;
    }

    // Horizontal rule --- or *** or ___
    if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
      html.push('<hr style="border:none;border-top:2px solid var(--border);margin:24px 0" />');
      i++;
      continue;
    }

    // Headings # to ######
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const sizes: Record<number, string> = {
        1: "2em", 2: "1.5em", 3: "1.25em", 4: "1.1em", 5: "1em", 6: "0.9em",
      };
      const margins: Record<number, string> = {
        1: "24px 0 12px", 2: "20px 0 10px", 3: "16px 0 8px", 4: "14px 0 6px", 5: "12px 0 4px", 6: "10px 0 4px",
      };
      html.push(
        `<h${level} style="font-size:${sizes[level]};font-weight:700;margin:${margins[level]};font-family:var(--font-display);line-height:1.3">${parseInline(escapeHtml(headingMatch[2]))}</h${level}>`
      );
      i++;
      continue;
    }

    // Blockquote > text
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push(
        `<blockquote style="border-left:4px solid var(--accent);padding:8px 16px;margin:12px 0;color:var(--muted);background:var(--surface-alt);border-radius:0 8px 8px 0;font-style:italic">${quoteLines.map((l) => parseInline(escapeHtml(l))).join("<br/>")}</blockquote>`
      );
      continue;
    }

    // Unordered list - or * or +
    if (/^[\s]*[-*+]\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[\s]*[-*+]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^[\s]*[-*+]\s+/, ""));
        i++;
      }
      html.push(
        `<ul style="margin:12px 0;padding-left:24px;list-style:disc">${listItems.map((item) => `<li style="margin:4px 0;line-height:1.6">${parseInline(escapeHtml(item))}</li>`).join("")}</ul>`
      );
      continue;
    }

    // Ordered list 1. or 1)
    if (/^[\s]*\d+[.)]\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[\s]*\d+[.)]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^[\s]*\d+[.)]\s+/, ""));
        i++;
      }
      html.push(
        `<ol style="margin:12px 0;padding-left:24px;list-style:decimal">${listItems.map((item) => `<li style="margin:4px 0;line-height:1.6">${parseInline(escapeHtml(item))}</li>`).join("")}</ol>`
      );
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph (collect consecutive non-empty lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("```") &&
      !/^[\s]*[-*+]\s+/.test(lines[i]) &&
      !/^[\s]*\d+[.)]\s+/.test(lines[i]) &&
      !/^(\s*[-*_]\s*){3,}$/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      html.push(
        `<p style="margin:10px 0;line-height:1.7">${paraLines.map((l) => parseInline(escapeHtml(l))).join("<br/>")}</p>`
      );
    }
  }

  // Close unclosed code block
  if (inCodeBlock && codeContent.length > 0) {
    html.push(
      `<div style="border-radius:8px;overflow:hidden;border:1px solid var(--border);margin:12px 0"><pre style="margin:0;padding:12px;overflow-x:auto;background:var(--surface-alt);font-size:0.85em;line-height:1.6"><code>${escapeHtml(codeContent.join("\n"))}</code></pre></div>`
    );
  }

  return html.join("\n");
}

/* ─── Stats helper ─── */

function computeStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const lines = text ? text.split("\n").length : 0;
  return { words, chars, charsNoSpaces, lines };
}

/* ─── Example markdown ─── */

const EXAMPLE_MD = `# Bienvenue dans l'Editeur Markdown

Cet outil vous permet d'ecrire du **Markdown** et de voir le rendu **HTML en temps reel**.

## Fonctionnalites

- **Gras** et *italique* et ~~barre~~
- [Liens](https://outilis.fr) cliquables
- Listes a puces et numerotees
- Blocs de code avec coloration

### Exemple de code

\`\`\`javascript
function bonjour(nom) {
  console.log(\`Bonjour, \${nom} !\`);
}
bonjour("Outilis");
\`\`\`

> Les citations sont aussi supportees.
> Elles peuvent tenir sur plusieurs lignes.

### Liste numerotee

1. Premier element
2. Deuxieme element
3. Troisieme element

---

Du texte avec du \`code inline\` et une image :

![Logo](https://via.placeholder.com/200x60?text=Outilis.fr)

*100% gratuit, 100% local.*`;

/* ─── Component ─── */

export default function EditeurMarkdown() {
  const [markdown, setMarkdown] = useState(EXAMPLE_MD);
  const [copied, setCopied] = useState<"html" | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const htmlOutput = useMemo(() => parseMarkdown(markdown), [markdown]);
  const stats = useMemo(() => computeStats(markdown), [markdown]);

  /* ─── Toolbar actions ─── */

  const insertAtCursor = useCallback(
    (before: string, after: string, placeholder: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = markdown.substring(start, end);
      const insert = selected ? `${before}${selected}${after}` : `${before}${placeholder}${after}`;
      const newText = markdown.substring(0, start) + insert + markdown.substring(end);
      setMarkdown(newText);
      setTimeout(() => {
        ta.focus();
        const cursorPos = selected
          ? start + insert.length
          : start + before.length;
        const cursorEnd = selected
          ? start + insert.length
          : start + before.length + placeholder.length;
        ta.setSelectionRange(cursorPos, cursorEnd);
      }, 0);
    },
    [markdown]
  );

  const toolbarActions = useMemo(
    () => [
      { label: "G", title: "Gras (Ctrl+B)", action: () => insertAtCursor("**", "**", "texte gras") },
      { label: "I", title: "Italique (Ctrl+I)", action: () => insertAtCursor("*", "*", "texte italique"), italic: true },
      { label: "H1", title: "Titre 1", action: () => insertAtCursor("# ", "", "Titre") },
      { label: "H2", title: "Titre 2", action: () => insertAtCursor("## ", "", "Sous-titre") },
      { label: "H3", title: "Titre 3", action: () => insertAtCursor("### ", "", "Sous-sous-titre") },
      { label: "</>", title: "Code inline", action: () => insertAtCursor("`", "`", "code") },
      { label: "{ }", title: "Bloc de code", action: () => insertAtCursor("```\n", "\n```", "code ici") },
      { label: "—", title: "Ligne horizontale", action: () => insertAtCursor("\n---\n", "", "") },
      { label: "\"", title: "Citation", action: () => insertAtCursor("> ", "", "Citation") },
      { label: "Lien", title: "Lien", action: () => insertAtCursor("[", "](https://)", "texte du lien") },
      { label: "Img", title: "Image", action: () => insertAtCursor("![", "](https://)", "alt text") },
      { label: "\u2022", title: "Liste a puces", action: () => insertAtCursor("- ", "", "element") },
      { label: "1.", title: "Liste numerotee", action: () => insertAtCursor("1. ", "", "element") },
    ],
    [insertAtCursor]
  );

  /* ─── Keyboard shortcuts ─── */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "b") {
          e.preventDefault();
          insertAtCursor("**", "**", "texte gras");
        } else if (e.key === "i") {
          e.preventDefault();
          insertAtCursor("*", "*", "texte italique");
        } else if (e.key === "k") {
          e.preventDefault();
          insertAtCursor("[", "](https://)", "texte du lien");
        }
      }
      // Tab key inserts spaces
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newText = markdown.substring(0, start) + "  " + markdown.substring(end);
        setMarkdown(newText);
        setTimeout(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        }, 0);
      }
    },
    [insertAtCursor, markdown]
  );

  /* ─── Copy HTML ─── */

  const copyHtml = useCallback(() => {
    navigator.clipboard.writeText(htmlOutput).then(() => {
      setCopied("html");
      setTimeout(() => setCopied(null), 2000);
    });
  }, [htmlOutput]);

  /* ─── Download .md ─── */

  const downloadMd = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown]);

  /* ─── Clear ─── */

  const clearAll = useCallback(() => {
    setMarkdown("");
    textareaRef.current?.focus();
  }, []);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-5">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Dev
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Editeur <span style={{ color: "var(--primary)" }}>Markdown</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Ecrivez en Markdown, visualisez le rendu HTML en temps reel. Toolbar de formatage, export HTML et .md. 100% local.
          </p>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <div
        className="animate-fade-up stagger-3"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-alt)" }}
      >
        <div className="mx-auto max-w-7xl px-5 py-3 flex flex-wrap items-center gap-6 text-xs" style={{ color: "var(--muted)" }}>
          <span>
            <strong style={{ color: "var(--foreground)" }}>{stats.words}</strong> mot{stats.words !== 1 ? "s" : ""}
          </span>
          <span>
            <strong style={{ color: "var(--foreground)" }}>{stats.chars}</strong> caractere{stats.chars !== 1 ? "s" : ""}
          </span>
          <span>
            <strong style={{ color: "var(--foreground)" }}>{stats.charsNoSpaces}</strong> sans espaces
          </span>
          <span>
            <strong style={{ color: "var(--foreground)" }}>{stats.lines}</strong> ligne{stats.lines !== 1 ? "s" : ""}
          </span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={copyHtml}
              className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:bg-[var(--surface)]"
              style={{ borderColor: "var(--border)", color: copied === "html" ? "var(--primary)" : undefined }}
            >
              {copied === "html" ? "Copie !" : "Copier HTML"}
            </button>
            <button
              onClick={downloadMd}
              className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:bg-[var(--surface)]"
              style={{ borderColor: "var(--border)" }}
            >
              Telecharger .md
            </button>
            <button
              onClick={clearAll}
              className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:bg-[var(--surface)]"
              style={{ borderColor: "var(--border)" }}
            >
              Effacer
            </button>
          </div>
        </div>
      </div>

      {/* ─── Toolbar ─── */}
      <div
        className="animate-fade-up stagger-4 sticky top-0 z-20"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
      >
        <div className="mx-auto max-w-7xl px-5 py-2 flex flex-wrap gap-1">
          {toolbarActions.map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              title={btn.title}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:bg-[var(--surface-alt)]"
              style={{
                fontFamily: btn.label === "</>" || btn.label === "{ }" ? "monospace" : undefined,
                fontStyle: btn.italic ? "italic" : undefined,
                fontWeight: btn.label === "G" ? 800 : undefined,
                color: "var(--foreground)",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Split view ─── */}
      <div className="animate-fade-up stagger-5 mx-auto max-w-7xl px-5 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)", minHeight: "70vh" }}>
          {/* ─── Editor pane ─── */}
          <div className="flex flex-col" style={{ borderRight: "1px solid var(--border)" }}>
            <div
              className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2"
              style={{ color: "var(--accent)", background: "var(--surface-alt)", borderBottom: "1px solid var(--border)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editeur Markdown
            </div>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 w-full resize-none p-5 text-sm outline-none"
              style={{
                fontFamily: "monospace",
                lineHeight: "1.7",
                background: "var(--surface)",
                color: "var(--foreground)",
                minHeight: "400px",
              }}
              placeholder="Ecrivez votre Markdown ici..."
              spellCheck={false}
            />
          </div>

          {/* ─── Preview pane ─── */}
          <div className="flex flex-col">
            <div
              className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2"
              style={{ color: "var(--accent)", background: "var(--surface-alt)", borderBottom: "1px solid var(--border)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preview HTML
            </div>
            <div
              className="flex-1 p-5 overflow-auto text-sm"
              style={{
                background: "var(--surface)",
                color: "var(--foreground)",
                lineHeight: "1.7",
                minHeight: "400px",
              }}
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          </div>
        </div>
      </div>

      {/* ─── About section ─── */}
      <div className="mx-auto max-w-7xl px-5 pb-12">
        <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            A propos de l&apos;editeur
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <p>
              <strong className="text-[var(--foreground)]">Preview en temps reel</strong> : Le rendu HTML se met a jour instantanement a chaque frappe, sans delai.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Syntaxe complete</strong> : Titres, gras, italique, liens, images, listes, blocs de code, citations, lignes horizontales et code inline.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Raccourcis clavier</strong> : Ctrl+B pour le gras, Ctrl+I pour l&apos;italique, Ctrl+K pour un lien. Tab pour indenter.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">Export</strong> : Copiez le HTML genere ou telechargez votre document au format .md en un clic.
            </p>
            <p>
              <strong className="text-[var(--foreground)]">100% local</strong> : Tout le traitement se fait dans votre navigateur. Aucune donnee n&apos;est envoyee a un serveur.
            </p>
          </div>

          <h3 className="mt-8 text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Syntaxe Markdown supportee
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  <th className="text-left py-2 pr-4 font-semibold">Syntaxe</th>
                  <th className="text-left py-2 font-semibold">Resultat</th>
                </tr>
              </thead>
              <tbody style={{ color: "var(--muted)" }}>
                {[
                  ["# Titre", "Titre niveau 1"],
                  ["## Sous-titre", "Titre niveau 2"],
                  ["**gras**", "Texte en gras"],
                  ["*italique*", "Texte en italique"],
                  ["~~barre~~", "Texte barre"],
                  ["`code`", "Code inline"],
                  ["```bloc```", "Bloc de code"],
                  ["[texte](url)", "Lien cliquable"],
                  ["![alt](url)", "Image"],
                  ["- element", "Liste a puces"],
                  ["1. element", "Liste numerotee"],
                  ["> citation", "Bloc de citation"],
                  ["---", "Ligne horizontale"],
                ].map(([syntax, result]) => (
                  <tr key={syntax} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td className="py-2 pr-4">
                      <code
                        style={{
                          background: "var(--surface-alt)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontFamily: "monospace",
                          fontSize: "0.85em",
                        }}
                      >
                        {syntax}
                      </code>
                    </td>
                    <td className="py-2">{result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
