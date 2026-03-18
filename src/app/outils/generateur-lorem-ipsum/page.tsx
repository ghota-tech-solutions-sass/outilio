"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.",
  "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.",
  "Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.",
  "Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus.",
  "Fusce commodo aliquam arcu. Nam commodo suscipit quam. Quisque id odio.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  "Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.",
  "Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.",
  "Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi.",
  "Duis sapien sem, aliquet sed, volutpat a, consequat quis, lacus. Morbi a est quis orci consequat rutrum.",
  "Nullam tristique diam non turpis. Cras placerat accumsan nulla. Nullam rutrum.",
];

export default function GenerateurLoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "words" | "sentences">("paragraphs");
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    if (unit === "paragraphs") {
      return Array.from({ length: count }, (_, i) => LOREM[i % LOREM.length]).join("\n\n");
    }
    if (unit === "sentences") {
      const allSentences = LOREM.flatMap((p) => p.split(". ").map((s) => s.endsWith(".") ? s : s + "."));
      return Array.from({ length: count }, (_, i) => allSentences[i % allSentences.length]).join(" ");
    }
    // words
    const allWords = LOREM.join(" ").split(/\s+/);
    return Array.from({ length: count }, (_, i) => allWords[i % allWords.length]).join(" ");
  }, [count, unit]);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Texte</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur <span style={{ color: "var(--primary)" }}>Lorem Ipsum</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Generez du texte factice pour vos maquettes, designs et projets web.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                {(["paragraphs", "sentences", "words"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{ background: unit === u ? "var(--primary)" : "transparent", color: unit === u ? "white" : "var(--muted)" }}
                  >
                    {u === "paragraphs" ? "Paragraphes" : u === "sentences" ? "Phrases" : "Mots"}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Quantite</label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max={unit === "words" ? 500 : unit === "sentences" ? 50 : 20}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{count}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Resultat</h2>
                <button
                  onClick={copy}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "var(--primary-light)" : "var(--primary)" }}
                >
                  {copied ? "Copie !" : "Copier"}
                </button>
              </div>
              <div className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl p-4 text-sm leading-relaxed" style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>
                {text}
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
