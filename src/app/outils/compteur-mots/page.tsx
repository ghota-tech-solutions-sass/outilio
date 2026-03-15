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
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            Compteur de mots et caracteres
          </h1>
          <p className="mt-2 text-gray-600">
            Comptez instantanement les mots, caracteres, phrases et paragraphes de vos textes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Mots" value={stats.words} primary />
              <Stat label="Caracteres" value={stats.chars} />
              <Stat label="Sans espaces" value={stats.charsNoSpaces} />
              <Stat label="Phrases" value={stats.sentences} />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Collez ou tapez votre texte ici..."
                className="h-64 w-full resize-y rounded-lg border border-gray-300 p-4 text-base focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>Temps de lecture : ~{stats.readingTime} min</span>
                <span>Temps de parole : ~{stats.speakingTime} min</span>
              </div>
            </div>

            <div className="prose max-w-none rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900">Limites courantes</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-500">
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
    <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
      <p className={`text-2xl font-bold ${primary ? "text-[#2563eb]" : "text-gray-900"}`}>{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
