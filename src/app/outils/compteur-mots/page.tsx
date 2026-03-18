"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function CompteurMots() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    const speakingTime = Math.max(1, Math.ceil(words / 130));

    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime };
  }, [text]);

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1 className="animate-fade-up stagger-1 text-3xl font-extrabold md:text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
            Compteur de mots et caracteres
          </h1>
          <p className="animate-fade-up stagger-2 mt-2" style={{ color: "var(--muted)" }}>
            Comptez instantanement les mots, caracteres, phrases et paragraphes de vos textes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Mots" value={stats.words} primary />
              <Stat label="Caracteres" value={stats.chars} />
              <Stat label="Sans espaces" value={stats.charsNoSpaces} />
              <Stat label="Phrases" value={stats.sentences} />
            </div>

            <div className="rounded-xl border p-6 shadow-sm" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Collez ou tapez votre texte ici..."
                className="h-64 w-full resize-y rounded-lg border p-4 text-base focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              />
              <div className="mt-3 flex items-center justify-between text-sm" style={{ color: "var(--muted)" }}>
                <span>Temps de lecture : ~{stats.readingTime} min</span>
                <span>Temps de parole : ~{stats.speakingTime} min</span>
              </div>
            </div>

            <div className="prose max-w-none rounded-xl border p-6 shadow-sm" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <h2>Compteur de mots en ligne gratuit</h2>
              <p>
                Notre compteur de mots analyse instantanement votre texte pour vous donner
                le nombre exact de mots, caracteres (avec et sans espaces), phrases et paragraphes.
              </p>
              <h2>A quoi sert un compteur de mots ?</h2>
              <ul>
                <li>Respecter les limites de caracteres (Twitter, LinkedIn, meta descriptions)</li>
                <li>Verifier la longueur de vos articles de blog pour le SEO</li>
                <li>Estimer le temps de lecture de vos contenus</li>
                <li>Preparer des discours avec le temps de parole estime</li>
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-xl border p-6 shadow-sm" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Limites courantes</h3>
              <ul className="mt-2 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Twitter/X : 280 caracteres</li>
                <li>Meta description : 155 caracteres</li>
                <li>Title tag : 60 caracteres</li>
                <li>LinkedIn post : 3 000 caracteres</li>
                <li>Instagram bio : 150 caracteres</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, primary }: { label: string; value: number; primary?: boolean }) {
  return (
    <div className="rounded-xl border p-4 text-center shadow-sm" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <p className="text-2xl font-bold" style={{ color: primary ? "var(--primary)" : "var(--foreground)" }}>{value}</p>
      <p className="text-xs" style={{ color: "var(--muted)" }}>{label}</p>
    </div>
  );
}
