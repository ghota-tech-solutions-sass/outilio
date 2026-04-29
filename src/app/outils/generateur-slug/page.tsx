"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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

            <ToolHowToSection
              title="Comment generer un slug URL parfait"
              description="Trois etapes pour transformer un titre en URL propre, indexable et lisible."
              steps={[
                {
                  name: "Saisir le texte source",
                  text:
                    "Collez votre titre d'article, nom de produit, intitule de page ou tag. L'outil accepte n'importe quelle longueur, avec accents francais, ponctuation, majuscules et caracteres speciaux. La transformation est instantanee.",
                },
                {
                  name: "Choisir le separateur",
                  text:
                    "Le tiret (-) est recommande par Google pour les URLs : il est interprete comme un separateur de mots. L'underscore (_) est traite comme une lettre dans un mot, donc moins lisible pour les moteurs. Sauf cas particulier (ID techniques), prenez toujours le tiret.",
                },
                {
                  name: "Definir une longueur maximale",
                  text:
                    "Mettre 0 pour ne pas tronquer. Sinon, fixez 50 a 70 caracteres : Google affiche environ 60 caracteres d'URL dans les resultats de recherche, au-dela c'est tronque par des points de suspension. L'outil coupe proprement sans laisser un tiret en fin de slug.",
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
                Cas d&apos;usage du generateur de slug
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Blogueur et editeur SEO
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Convertir le titre d&apos;un article en URL : &laquo; Les 10 meilleurs hotels
                    a Lyon en 2024 &raquo; devient meilleurs-hotels-lyon-2024. Court, descriptif,
                    contient le mot-cle principal. Mieux indexe par Google que le slug brut genere
                    par WordPress.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Developpeur back-end
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Generer des identifiants uniques pour des entites (produits, articles, users)
                    dans une API REST. Le slug fait office de cle alternative a l&apos;ID numerique
                    pour des URLs propres : /produits/casque-bluetooth-noir au lieu de /produits/4521.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Manager e-commerce
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Importer un catalogue produit et generer en lot les slugs de chaque fiche.
                    Un slug propre booste le SEO produit (long-tail) et reduit les caracteres
                    encodes %xx qui cassent les sharing URLs sur Facebook ou WhatsApp.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Createur de fichiers et nommage
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Renommer des fichiers, dossiers, branches Git ou tickets Jira dans un format
                    homogene. Eviter les espaces qui necessitent des guillemets dans le terminal
                    et les caracteres accentues qui posent probleme entre macOS, Linux et Windows.
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
                  <strong>Lisibilite : court, descriptif, sans mots vides.</strong> Un bon slug
                  contient 3 a 6 mots significatifs : evitez le, la, du, des, et, ou, qui ne
                  servent a rien pour le referencement. Preferez meilleurs-hotels-lyon plutot que
                  les-meilleurs-des-hotels-de-la-ville-de-lyon.
                </p>
                <p>
                  <strong>Longueur sous 60 caracteres.</strong> Google affiche environ 60
                  caracteres d&apos;URL dans les SERP avant troncature par des points de
                  suspension. Au-dela, vous perdez en CTR. Vise 30 a 50 caracteres pour le slug
                  seul (hors domaine et chemin).
                </p>
                <p>
                  <strong>Pas d&apos;accents en URL.</strong> Les URLs avec accents fonctionnent
                  techniquement mais sont encodees en %xx (cafe devient caf%C3%A9). Resultat :
                  illisible quand on partage le lien sur Twitter, dans un email ou un PDF. Le
                  generateur supprime tous les accents par normalisation NFD.
                </p>
                <p>
                  <strong>Tirets vs underscores.</strong> Google recommande les tirets (-) car ils
                  sont traites comme des separateurs de mots. L&apos;underscore (_) est interprete
                  comme une lettre dans le mot. Donc rachat-credit est lu rachat + credit, alors
                  que rachat_credit est lu rachat_credit (un seul terme).
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Reponses aux questions frequentes sur la generation de slugs URL."
              items={[
                {
                  question: "Qu'est-ce qu'un slug exactement ?",
                  answer:
                    "Un slug est la portion finale d'une URL, apres le domaine et les segments de chemin. Exemple : dans https://outilis.fr/blog/generateur-slug-url, le slug est generateur-slug-url. Il identifie de maniere unique et lisible la page sur le site.",
                },
                {
                  question: "Faut-il inclure des chiffres dans un slug ?",
                  answer:
                    "Oui, si pertinents. Les annees (2024, 2025), les versions (v2, v3), les classements (top-10) ameliorent le CTR car les utilisateurs cherchent ces signaux. Eviter en revanche les ID numeriques bruts genre /article-4521 qui n'apportent rien au SEO.",
                },
                {
                  question: "Mes accents francais sont-ils preserves ?",
                  answer:
                    "Non, ils sont supprimes apres normalisation Unicode NFD. C'est intentionnel : les URLs avec accents fonctionnent mais s'affichent en %xx (encodage URL), ce qui les rend illisibles. Le slug genere reste lisible et compatible 100% des plateformes.",
                },
                {
                  question: "Puis-je utiliser des emojis ou caracteres speciaux ?",
                  answer:
                    "Non, l'outil les supprime systematiquement. Seuls les lettres a-z, chiffres 0-9 et le separateur (tiret ou underscore) sont conserves. C'est la convention RFC 3986 pour les URLs lisibles, recommandee par Google et tous les CMS modernes.",
                },
                {
                  question: "Faut-il changer un slug existant pour le SEO ?",
                  answer:
                    "Non, sauf cas extreme. Modifier un slug deja indexe casse les liens entrants et perd le PageRank accumule. Si vous devez changer, mettez en place une redirection 301 permanente de l'ancien slug vers le nouveau, sinon vous perdrez du trafic SEO.",
                },
                {
                  question: "Quelle longueur maximale recommandee ?",
                  answer:
                    "Visez 30 a 50 caracteres pour le slug seul. Google affiche environ 60 caracteres d'URL dans les resultats avant troncature. Sous WordPress, le maximum technique est 200 caracteres mais aucun benefice SEO au-dela de 60.",
                },
                {
                  question: "Les slugs sont-ils generes sans envoyer mes donnees ?",
                  answer:
                    "Oui. La generation se fait entierement dans votre navigateur via JavaScript. Aucun titre, slug ou parametre n'est envoye a un serveur ou stocke. Vous pouvez generer des slugs pour des contenus confidentiels en toute securite.",
                },
              ]}
            />
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
