"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

// Letters that NFD does not decompose into "base letter + accent"
const SPECIAL_LETTERS: Record<string, string> = {
  œ: "oe", Œ: "oe", æ: "ae", Æ: "ae", ß: "ss", ẞ: "ss", ø: "o", Ø: "o",
  đ: "d", Đ: "d", ð: "d", Ð: "d", ł: "l", Ł: "l", þ: "th", Þ: "th", ı: "i",
};

function slugify(text: string): string {
  return text
    .replace(/[œŒæÆßẞøØđĐðÐłŁþÞı]/g, (ch) => SPECIAL_LETTERS[ch])
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-") // Any other character (space, apostrophe, /, :, emoji…) becomes a separator
    .replace(/^-+|-+$/g, ""); // Trim separators
}

// Cuts at a word boundary so that the slug never ends with half a word.
function truncateSlug(slug: string, max: number, separator: string): string {
  if (max <= 0 || slug.length <= max) return slug;
  const cut = slug.slice(0, max + 1);
  const lastSep = cut.lastIndexOf(separator);
  const result = lastSep > 0 ? cut.slice(0, lastSep) : slug.slice(0, max);
  return result.replace(new RegExp(`\\${separator}+$`), "");
}

export default function GenerateurSlug() {
  const [input, setInput] = useState("Mon article de blog en français ! Les 10 meilleurs outils (édition 2026)");
  const [separator, setSeparator] = useState("-");
  const [maxLength, setMaxLength] = useState("0");
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => {
    let result = slugify(input);
    if (separator !== "-") {
      result = result.replace(/-/g, separator);
    }
    return truncateSlug(result, parseInt(maxLength) || 0, separator);
  }, [input, separator, maxLength]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { text: "Les 10 meilleurs frameworks JavaScript en 2026", slug: slugify("Les 10 meilleurs frameworks JavaScript en 2026") },
    { text: "Comment créer un site web gratuitement ?", slug: slugify("Comment créer un site web gratuitement ?") },
    { text: "Recette : gâteau au chocolat de grand-mère", slug: slugify("Recette : gâteau au chocolat de grand-mère") },
    { text: "L'été en Provence : nos coups de cœur", slug: slugify("L'été en Provence : nos coups de cœur") },
  ];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Générateur de <span style={{ color: "var(--primary)" }}>slug</span> URL
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Transformez n&apos;importe quel texte en slug URL optimisé pour le SEO. Suppression des accents, des ligatures (œ, æ) et des caractères spéciaux.
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
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Séparateur</label>
                  <select value={separator} onChange={(e) => setSeparator(e.target.value)}
                    className="mt-1 block rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                    <option value="-">Tiret (-)</option>
                    <option value="_">Underscore (_)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Longueur max (0 = illimitée)</label>
                  <input type="number" min="0" value={maxLength} onChange={(e) => setMaxLength(e.target.value)}
                    className="mt-1 block w-24 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Slug généré</h2>
              <div className="mt-4 flex items-center gap-3 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                <code className="flex-1 text-lg font-bold break-all" style={{ fontFamily: "monospace", color: "var(--primary)" }}>
                  {slug || "(vide)"}
                </code>
                <button onClick={copyToClipboard}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
              <div className="mt-3 flex gap-4 text-xs" style={{ color: "var(--muted)" }}>
                <span><strong>{slug.length}</strong> caractères</span>
                <span><strong>{slug.split(separator).filter(Boolean).length}</strong> mots</span>
              </div>
            </div>

            {/* URL Preview */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Aperçu URL</h2>
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

            <ToolHowToSection
              title="Comment générer un slug URL parfait"
              description="Trois étapes pour transformer un titre en URL propre, indexable et lisible."
              steps={[
                {
                  name: "Saisir le texte source",
                  text:
                    "Collez votre titre d'article, nom de produit, intitulé de page ou tag. L'outil accepte n'importe quelle longueur, avec accents français, ponctuation, majuscules et caractères spéciaux. La transformation est instantanée.",
                },
                {
                  name: "Choisir le séparateur",
                  text:
                    "Le tiret (-) est recommandé par Google pour les URLs : il est interprété comme un séparateur de mots. L'underscore (_) est traité comme une lettre dans un mot, donc moins lisible pour les moteurs. Sauf cas particulier (ID techniques), prenez toujours le tiret.",
                },
                {
                  name: "Définir une longueur maximale",
                  text:
                    "Mettre 0 pour ne pas tronquer. Sinon, fixez 50 à 70 caractères : Google affiche environ 60 caractères d'URL dans les résultats de recherche, au-delà c'est tronqué par des points de suspension. L'outil coupe entre deux mots, sans laisser de mot tronqué ni de tiret en fin de slug.",
                },
              ]}
            />

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Cas d&apos;usage du générateur de slug
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Blogueur et éditeur SEO
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Convertir le titre d&apos;un article en URL : &laquo; Les 10 meilleurs hôtels
                    à Lyon en 2026 &raquo; devient meilleurs-hotels-lyon-2026. Court, descriptif,
                    contient le mot-clé principal. Mieux indexé par Google que le slug brut généré
                    par WordPress.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Développeur back-end
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Générer des identifiants uniques pour des entités (produits, articles, users)
                    dans une API REST. Le slug fait office de clé alternative à l&apos;ID numérique
                    pour des URLs propres : /produits/casque-bluetooth-noir au lieu de /produits/4521.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Manager e-commerce
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Importer un catalogue produit et générer en lot les slugs de chaque fiche.
                    Un slug propre booste le SEO produit (long-tail) et réduit les caractères
                    encodés %xx qui cassent les sharing URLs sur Facebook ou WhatsApp.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Créateur de fichiers et nommage
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Renommer des fichiers, dossiers, branches Git ou tickets Jira dans un format
                    homogène. Éviter les espaces qui nécessitent des guillemets dans le terminal
                    et les caractères accentués qui posent problème entre macOS, Linux et Windows.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Bonnes pratiques SEO pour les slugs
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Lisibilité : court, descriptif, sans mots vides.</strong> Un bon slug
                  contient 3 à 6 mots significatifs : évitez le, la, du, des, et, ou, qui ne
                  servent à rien pour le référencement. Préférez meilleurs-hotels-lyon plutôt que
                  les-meilleurs-des-hotels-de-la-ville-de-lyon.
                </p>
                <p>
                  <strong>Longueur sous 60 caractères.</strong> Google affiche environ 60
                  caractères d&apos;URL dans les SERP avant troncature par des points de
                  suspension. Au-delà, vous perdez en CTR. Visez 30 à 50 caractères pour le slug
                  seul (hors domaine et chemin).
                </p>
                <p>
                  <strong>Pas d&apos;accents en URL.</strong> Les URLs avec accents fonctionnent
                  techniquement mais sont encodées en %xx (café devient caf%C3%A9). Résultat :
                  illisible quand on partage le lien sur Twitter, dans un email ou un PDF. Le
                  générateur supprime tous les accents par normalisation NFD et convertit les ligatures (œ → oe, æ → ae, ß → ss).
                </p>
                <p>
                  <strong>Tirets vs underscores.</strong> Google recommande les tirets (-) car ils
                  sont traités comme des séparateurs de mots. L&apos;underscore (_) est interprété
                  comme une lettre dans le mot. Donc rachat-credit est lu « rachat » + « credit », alors
                  que rachat_credit est lu comme un seul terme.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Réponses aux questions fréquentes sur la génération de slugs URL."
              items={[
                {
                  question: "Qu'est-ce qu'un slug exactement ?",
                  answer:
                    "Un slug est la portion finale d'une URL, après le domaine et les segments de chemin. Exemple : dans https://outilis.fr/blog/generateur-slug-url, le slug est generateur-slug-url. Il identifie de manière unique et lisible la page sur le site.",
                },
                {
                  question: "Faut-il inclure des chiffres dans un slug ?",
                  answer:
                    "Oui, si pertinents. Les années (2025, 2026), les versions (v2, v3), les classements (top-10) améliorent le CTR car les utilisateurs cherchent ces signaux. Éviter en revanche les ID numériques bruts genre /article-4521 qui n'apportent rien au SEO.",
                },
                {
                  question: "Mes accents français sont-ils préservés ?",
                  answer:
                    "Non, ils sont supprimés après normalisation Unicode NFD. C'est intentionnel : les URLs avec accents fonctionnent mais s'affichent en %xx (encodage URL), ce qui les rend illisibles. Le slug généré reste lisible et compatible 100% des plateformes.",
                },
                {
                  question: "Puis-je utiliser des emojis ou caractères spéciaux ?",
                  answer:
                    "Non : les emojis et la ponctuation (espaces, apostrophes, deux-points, slash…) sont remplacés par un séparateur, et « & » devient « et ». Seules les lettres a-z, les chiffres 0-9 et le séparateur (tiret ou underscore) sont conservés : ce sont des caractères sûrs dans toutes les URL (RFC 3986), sans encodage %xx.",
                },
                {
                  question: "Faut-il changer un slug existant pour le SEO ?",
                  answer:
                    "Non, sauf cas extrême. Modifier un slug déjà indexé casse les liens entrants et perd le PageRank accumulé. Si vous devez changer, mettez en place une redirection 301 permanente de l'ancien slug vers le nouveau, sinon vous perdrez du trafic SEO.",
                },
                {
                  question: "Quelle longueur maximale recommandée ?",
                  answer:
                    "Visez 30 à 50 caractères pour le slug seul. Google affiche environ 60 caractères d'URL dans les résultats avant troncature. Sous WordPress, le maximum technique est 200 caractères mais aucun benefice SEO au-delà de 60.",
                },
                {
                  question: "Les slugs sont-ils générés sans envoyer mes données ?",
                  answer:
                    "Oui. La génération se fait entièrement dans votre navigateur via JavaScript. Aucun titre, slug ou paramètre n'est envoyé à un serveur ou stocké. Vous pouvez générer des slugs pour des contenus confidentiels en toute sécurité.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Transformations</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Accents supprimés (é, à, ù…)</li>
                <li>Majuscules en minuscules</li>
                <li>Espaces et ponctuation en tirets</li>
                <li>Ligatures converties (œ → oe, æ → ae, ß → ss)</li>
                <li>Caractères spéciaux supprimés</li>
                <li>Tirets multiples fusionnés</li>
                <li>Tirets en début/fin supprimés</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
