"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

function slugify(text: string): string {
  // Normalize and remove accents
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")  // Remove special chars
    .replace(/\s+/g, "-")           // Spaces to hyphens
    .replace(/-+/g, "-")            // Multiple hyphens to single
    .replace(/^-|-$/g, "");         // Trim hyphens
}

export default function GenerateurSlug() {
  const [input, setInput] = useState("Mon article de blog en francais ! Les 10 meilleurs outils (edition 2024)");
  const [separator, setSeparator] = useState("-");
  const [maxLength, setMaxLength] = useState("0");
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => {
    let result = slugify(input);
    if (separator !== "-") {
      result = result.replace(/-/g, separator);
    }
    const max = parseInt(maxLength) || 0;
    if (max > 0 && result.length > max) {
      result = result.substring(0, max);
      // Don't end on a separator
      if (result.endsWith(separator)) {
        result = result.slice(0, -1);
      }
    }
    return result;
  }, [input, separator, maxLength]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { text: "Les 10 meilleurs frameworks JavaScript en 2024", slug: slugify("Les 10 meilleurs frameworks JavaScript en 2024") },
    { text: "Comment creer un site web gratuitement ?", slug: slugify("Comment creer un site web gratuitement ?") },
    { text: "Recette : gateau au chocolat de grand-mere", slug: slugify("Recette : gateau au chocolat de grand-mere") },
    { text: "L'ete en Provence : nos coups de coeur", slug: slugify("L'ete en Provence : nos coups de coeur") },
  ];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur de <span style={{ color: "var(--primary)" }}>slug</span> URL
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Transformez n&apos;importe quel texte en slug URL optimise pour le SEO. Suppression des accents et caracteres speciaux.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Texte source</h2>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
                className="mt-4 w-full rounded-xl border px-4 py-3 text-sm leading-relaxed"
                style={{ borderColor: "var(--border)", resize: "vertical" }}
                placeholder="Collez votre titre ou texte ici..."
              />
              <div className="mt-4 flex flex-wrap gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Separateur</label>
                  <select value={separator} onChange={(e) => setSeparator(e.target.value)}
                    className="mt-1 block rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                    <option value="-">Tiret (-)</option>
                    <option value="_">Underscore (_)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Longueur max (0 = illimitee)</label>
                  <input type="number" min="0" value={maxLength} onChange={(e) => setMaxLength(e.target.value)}
                    className="mt-1 block w-24 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Slug genere</h2>
              <div className="mt-4 flex items-center gap-3 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                <code className="flex-1 text-lg font-bold break-all" style={{ fontFamily: "monospace", color: "var(--primary)" }}>
                  {slug || "(vide)"}
                </code>
                <button onClick={copyToClipboard}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                  {copied ? "Copie !" : "Copier"}
                </button>
              </div>
              <div className="mt-3 flex gap-4 text-xs" style={{ color: "var(--muted)" }}>
                <span><strong>{slug.length}</strong> caracteres</span>
                <span><strong>{slug.split(separator).filter(Boolean).length}</strong> mots</span>
              </div>
            </div>

            {/* URL Preview */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Apercu URL</h2>
              <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                <p className="text-sm break-all" style={{ fontFamily: "monospace" }}>
                  <span style={{ color: "var(--muted)" }}>https://monsite.fr/blog/</span>
                  <span style={{ color: "var(--primary)" }}>{slug}</span>
                </p>
              </div>
            </div>

            {/* Examples */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Exemples</h2>
              <div className="mt-4 space-y-3">
                {examples.map((ex, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "var(--surface-alt)" }}>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{ex.text}</p>
                    <p className="mt-1 text-sm font-bold" style={{ fontFamily: "monospace", color: "var(--primary)" }}>{ex.slug}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Bonnes pratiques SEO pour les URLs</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Lisibilite</strong> : Un bon slug est court, descriptif et lisible par un humain. Evitez les mots vides (le, la, de, du...).</p>
                <p><strong className="text-[var(--foreground)]">Longueur</strong> : Google affiche environ 60-70 caracteres d&apos;URL. Gardez vos slugs sous 50 caracteres idealement.</p>
                <p><strong className="text-[var(--foreground)]">Pas d&apos;accents</strong> : Les URLs avec accents fonctionnent mais sont encodees en %xx, ce qui les rend moins lisibles.</p>
                <p><strong className="text-[var(--foreground)]">Tirets vs underscores</strong> : Google recommande les tirets (-) comme separateurs de mots dans les URLs.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Transformations</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Accents supprimes (e, a, u...)</li>
                <li>Majuscules en minuscules</li>
                <li>Espaces en tirets</li>
                <li>Caracteres speciaux supprimes</li>
                <li>Tirets multiples fusionnes</li>
                <li>Tirets en debut/fin supprimes</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
