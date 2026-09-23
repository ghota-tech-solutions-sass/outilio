"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

// Counts user-perceived characters (grapheme clusters): an emoji such as 👨‍👩‍👧
// or an accented letter typed as e + combining accent counts as 1 character.
function countGraphemes(str: string): number {
  if (!str) return 0;
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return Array.from(new Intl.Segmenter("fr", { granularity: "grapheme" }).segment(str)).length;
  }
  return Array.from(str).length;
}

export default function CompteurMots() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    // A word must contain at least one letter or digit: French spaced punctuation
    // ("Bonjour !", "« citation »", " : ") is not counted as a word.
    const words = trimmed ? trimmed.split(/\s+/).filter((t) => /[\p{L}\p{N}]/u.test(t)).length : 0;
    const chars = countGraphemes(text);
    const charsNoSpaces = countGraphemes(text.replace(/\s/g, ""));
    // A sentence ends with . ! ? or … followed by a space or the end of the text
    // (so "3.5" or "outilis.fr" do not split a sentence).
    const sentences = trimmed
      ? trimmed.split(/[.!?…]+(?=\s|$)/).filter((s) => /[\p{L}\p{N}]/u.test(s)).length
      : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    const readingTime = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));
    const speakingTime = words === 0 ? 0 : Math.max(1, Math.ceil(words / 130));

    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime, speakingTime };
  }, [text]);

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1 className="animate-fade-up stagger-1 text-3xl font-extrabold md:text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
            Compteur de mots et caractères
          </h1>
          <p className="animate-fade-up stagger-2 mt-2" style={{ color: "var(--muted)" }}>
            Comptez instantanément les mots, caractères, phrases et paragraphes de vos textes.
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

            <ToolHowToSection
              title="Comment utiliser le compteur de mots"
              description="Trois étapes simples pour analyser n'importe quel texte et obtenir des statistiques complètes."
              steps={[
                {
                  name: "Collez ou tapez votre texte",
                  text:
                    "Copiez votre article, votre post LinkedIn, votre discours ou votre essai dans la zone de saisie. Le comptage démarre dès le premier caractère, sans bouton à cliquer. Vous pouvez aussi taper directement, les statistiques s'actualisent en temps réel.",
                },
                {
                  name: "Lisez les statistiques clés",
                  text:
                    "Les quatre cartes en haut affichent : nombre de mots, caractères totaux, caractères sans espaces et nombre de phrases. Sous la zone de texte, deux estimations supplémentaires : temps de lecture (basé sur 200 mots par minute, vitesse moyenne d'un lecteur français) et temps de parole (130 mots par minute pour un débit naturel).",
                },
                {
                  name: "Adaptez votre texte aux contraintes",
                  text:
                    "Si vous dépassez la limite d'un réseau social (280 caractères pour Twitter, 3000 pour LinkedIn, 155 pour une meta description), réduisez le contenu jusqu'à respecter le seuil. Pour un article SEO, visez entre 1500 et 2500 mots selon la concurrence du mot-clé visé.",
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
                Cas d&apos;usage du compteur de mots
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Rédacteur web et content manager
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vérifier qu&apos;un article respecte le brief client (1800 mots minimum), calibrer
                    les meta descriptions à 155 caractères, valider la longueur d&apos;un title tag
                    sous 60 caractères pour éviter la troncature dans les SERP Google.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Étudiant et chercheur
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Respecter les consignes d&apos;un mémoire (entre 30 et 50 pages, soit 9000 à
                    15000 mots), valider la longueur d&apos;un résumé d&apos;article scientifique
                    (souvent 250 mots max), préparer une dissertation au format imposé.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Conférencier et formateur
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Caler un keynote de 20 minutes : 130 mots par minute donne 2600 mots de script.
                    Le temps de parole estimé évite de finir trop court ou de devoir accélérer en
                    fin d&apos;intervention. Indispensable pour les pitchs concours type 3MT.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Community manager
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Adapter un message à chaque plateforme : Twitter/X 280 caractères, threads
                    LinkedIn 3000, bio Instagram 150, Facebook ad headline 40. Le compteur sans
                    espaces est utile pour les anciennes contraintes SMS et les newsletters mobiles.
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
                À savoir sur le comptage de texte
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Mot vs caractère : deux notions différentes.</strong> Un mot est une
                  séquence séparée par des espaces (la ponctuation isolée, comme le « ! » précédé d&apos;une espace en français, n&apos;est pas comptée comme un mot). Un caractère est chaque lettre, chiffre, signe
                  de ponctuation ou espace. Le mot &laquo; aujourd&apos;hui &raquo; compte 1 mot et
                  11 caractères. Twitter limite en caractères, un éditeur en signes ou en mots.
                </p>
                <p>
                  <strong>Caractères avec ou sans espaces.</strong> Les contrats de rédaction et
                  les barèmes universitaires raisonnent souvent en caractères avec espaces (par
                  défaut Word). Mais certaines plateformes SMS ou anciennes contraintes typographiques
                  comptent sans espaces. Bien lire le brief évite les mauvaises surprises.
                </p>
                <p>
                  <strong>200 mots / minute, c&apos;est une moyenne.</strong> Un lecteur rapide
                  monte à 300-400 mpm, un lecteur lent reste autour de 150 mpm. Le score Hemingway
                  ou Flesch ajuste mieux la lisibilité. Pour un article de blog, viser 200 mpm
                  reste une bonne base, c&apos;est la cadence d&apos;un public adulte standard.
                </p>
                <p>
                  <strong>Phrases : détection imparfaite.</strong> L&apos;outil compte les
                  terminateurs de phrase (point, exclamation, interrogation, points de suspension)
                  suivis d&apos;une espace ou de la fin du texte. Mais
                  &laquo; M. Dupont &raquo; ou &laquo; etc. &raquo; contiennent un point sans
                  terminer la phrase. Pour un comptage millimétrique, comptez manuellement ou
                  utilisez un parseur NLP comme spaCy.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Tout ce qu'il faut savoir sur le comptage de mots et de caractères."
              items={[
                {
                  question: "Comment sont comptés les mots ?",
                  answer:
                    "Les mots sont séparés par les espaces, tabulations et retours à la ligne. La ponctuation isolée (« ! », « ? », « : » précédés d'une espace, guillemets « ») n'est pas comptée. Les nombres, abréviations et mots composés avec un trait d'union comptent chacun comme un seul mot. Aujourd'hui, c'est-à-dire ou rendez-vous = 1 mot chacun.",
                },
                {
                  question: "Combien de mots faut-il pour un article SEO ?",
                  answer:
                    "Pour le référencement naturel en France, un article de blog performant contient généralement entre 1500 et 2500 mots. Les contenus de plus de 3000 mots obtiennent souvent de meilleurs classements sur Google pour les requêtes compétitives, mais la qualité reste plus importante que la quantité.",
                },
                {
                  question: "L'outil fonctionne-t-il avec les caractères accentués ?",
                  answer:
                    "Oui, le compteur gère parfaitement les caractères accentués français (é, à, ù, ç, etc.), les caractères spéciaux et les emojis. Le compteur compte les caractères tels qu'ils s'affichent : un emoji composé (famille, drapeau, couleur de peau) ou une lettre accentuée saisie avec un accent combinant compte pour 1 caractère. Attention : certaines plateformes (X notamment) comptent les emojis pour 2.",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. Le comptage est effectué 100 % localement dans votre navigateur. Le texte que vous saisissez n'est ni envoyé à un serveur ni stocké. Vous pouvez compter des contenus sensibles ou confidentiels en toute sécurité.",
                },
                {
                  question: "Quelle est la limite de longueur du texte ?",
                  answer:
                    "L'outil n'impose pas de limite stricte. Il peut analyser plusieurs milliers de mots sans ralentissement. Pour des textes très volumineux (au-delà de 100000 caractères), votre navigateur peut commencer à montrer une légère latence selon votre machine.",
                },
                {
                  question: "Pourquoi le temps de lecture est-il différent du temps de parole ?",
                  answer:
                    "Un lecteur silencieux traite environ 200 mots par minute en lecture courante, alors qu'un orateur naturel parle à 130 mots par minute. La parole inclut la respiration, la prosodie et les pauses. Pour un podcast ou une vidéo, le temps de parole est plus réaliste.",
                },
                {
                  question: "L'outil compte-t-il les paragraphes et les sauts de ligne ?",
                  answer:
                    "Oui. Un paragraphe est défini par un saut de ligne double (ligne vide entre deux blocs de texte). Les retours à la ligne simples à l'intérieur d'un paragraphe ne créent pas de nouveau paragraphe. Cette règle suit la convention markdown classique.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-xl border p-6 shadow-sm" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>Limites courantes</h3>
              <ul className="mt-2 space-y-2 text-sm" style={{ color: "var(--muted)" }}>
                <li>Twitter/X : 280 caractères</li>
                <li>Meta description : 155 caractères</li>
                <li>Title tag : 60 caractères</li>
                <li>LinkedIn post : 3 000 caractères</li>
                <li>Instagram bio : 150 caractères</li>
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
