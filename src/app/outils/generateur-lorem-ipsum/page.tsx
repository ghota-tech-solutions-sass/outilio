"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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

const ALL_SENTENCES = LOREM.flatMap((p) => p.split(". ").map((s) => (s.endsWith(".") ? s : s + ".")));
const SENTENCES_PER_PARAGRAPH = 5;
const MAX_COUNT = { paragraphs: 20, sentences: 50, words: 500 } as const;

export default function GenerateurLoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "words" | "sentences">("paragraphs");
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    if (unit === "paragraphs") {
      // Each paragraph = 5 consecutive sentences (≈ 50 words), cycling through the text
      return Array.from({ length: count }, (_, i) =>
        Array.from({ length: SENTENCES_PER_PARAGRAPH }, (_, k) => ALL_SENTENCES[(i * SENTENCES_PER_PARAGRAPH + k) % ALL_SENTENCES.length]).join(" ")
      ).join("\n\n");
    }
    if (unit === "sentences") {
      return Array.from({ length: count }, (_, i) => ALL_SENTENCES[i % ALL_SENTENCES.length]).join(" ");
    }
    // words
    const allWords = LOREM.join(" ").split(/\s+/);
    return Array.from({ length: count }, (_, i) => allWords[i % allWords.length]).join(" ");
  }, [count, unit]);

  const changeUnit = (u: "paragraphs" | "words" | "sentences") => {
    setUnit(u);
    // Keep the quantity within the slider range of the new unit
    setCount((c) => Math.min(c, MAX_COUNT[u]));
  };

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
            Générateur <span style={{ color: "var(--primary)" }}>Lorem Ipsum</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Générez du texte factice pour vos maquettes, designs et projets web.
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
                    onClick={() => changeUnit(u)}
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{ background: unit === u ? "var(--primary)" : "transparent", color: unit === u ? "white" : "var(--muted)" }}
                  >
                    {u === "paragraphs" ? "Paragraphes" : u === "sentences" ? "Phrases" : "Mots"}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Quantité</label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max={MAX_COUNT[unit]}
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
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Résultat</h2>
                <button
                  onClick={copy}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "var(--primary-light)" : "var(--primary)" }}
                >
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
              <div className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl p-4 text-sm leading-relaxed" style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>
                {text}
              </div>
            </div>

            <ToolHowToSection
              title="Comment utiliser le générateur Lorem Ipsum"
              description="Trois réglages pour générer le faux texte adapté à votre maquette en quelques secondes."
              steps={[
                {
                  name: "Choisissez l'unité de génération",
                  text:
                    "Sélectionnez Paragraphes pour remplir des blocs d'article, Phrases pour des blocs courts comme des cartes ou des descriptions, Mots pour les titres et les boutons. Le bon choix évite les débordements de mise en page et reflète le contenu réel attendu.",
                },
                {
                  name: "Ajustez la quantité avec le curseur",
                  text:
                    "Le curseur s'adapte automatiquement à l'unité choisie : jusqu'à 20 paragraphes, 50 phrases ou 500 mots. Visez la longueur du contenu final que vous prévoyez : un paragraphe généré compte environ 40 mots, donc pour un article réel d'environ 400 mots, générez une dizaine de paragraphes.",
                },
                {
                  name: "Copiez et collez dans votre maquette",
                  text:
                    "Le bouton Copier transfère le texte dans le presse-papier. Collez ensuite dans Figma, Sketch, votre CMS, votre éditeur HTML ou directement dans une slide. Le Lorem Ipsum est compatible avec tous les outils de design et plateformes web.",
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
                Cas d&apos;usage du Lorem Ipsum
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    UI/UX designer en phase mockup
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Remplir des wireframes Figma ou Adobe XD avec un texte calibré évite les
                    débats sur la copie pendant la revue design. Le client se concentre sur la
                    structure, la typographie et la hiérarchie visuelle plutôt que sur le wording.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Développeur front-end
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Tester les composants React, Vue ou Angular avec du contenu variable :
                    long, court, multi-paragraphes. Détecter les bugs de troncature, de
                    débordement et de wrapping responsive avant l&apos;intégration du contenu réel.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Print designer et éditeur
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Maquetter une brochure, un magazine ou une affiche dans InDesign avant que
                    le texte définitif ne soit validé. Le Lorem Ipsum permet de figer la grille
                    typographique, le rythme des paragraphes et les colonnes.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Thème WordPress et template
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pré-remplir des démos de thèmes ou des templates email afin que les acheteurs
                    visualisent immédiatement le rendu. Idem pour les modèles ThemeForest, Webflow
                    ou Notion : le faux contenu sert de placeholder esthétique.
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
                À savoir avant d&apos;utiliser du Lorem Ipsum
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Ne jamais publier en production.</strong> Le Lorem Ipsum laissé en ligne
                  est devenu un mème : on en trouve sur des sites de marques connues, parfois en
                  page d&apos;accueil. Avant le go-live, lancez un Ctrl+F sur &laquo; lorem &raquo;
                  dans votre CMS pour traquer les oublis. Google peut aussi pénaliser un site qui
                  a beaucoup de contenu de placeholder.
                </p>
                <p>
                  <strong>Lorem Ipsum vs vrai contenu : les surprises.</strong> Le faux texte a une
                  densité uniforme, alors que le contenu réel alterne paragraphes courts et longs.
                  Une fois le contenu intégré, certains designs &laquo; cassent &raquo; car les
                  vraies sections sont 30 % plus courtes ou plus longues que prévu. Mieux vaut
                  recevoir un draft du copywriter avant de finaliser la maquette.
                </p>
                <p>
                  <strong>Accessibilité et tests.</strong> Le Lorem Ipsum n&apos;est pas du français
                  ni de l&apos;anglais, donc inutilisable pour tester un screen reader, un correcteur
                  orthographique ou une analyse SEO. Pour ces tests, utilisez un vrai texte
                  dans la langue cible (un article existant, un extrait libre de droits).
                </p>
                <p>
                  <strong>Longueur à calibrer.</strong> Pour une carte produit, 1-2 phrases. Pour
                  une description e-commerce, 1 paragraphe. Pour un article de blog, 5-10
                  paragraphes. Tester votre maquette avec une longueur très différente (délibérément
                  trop court ou trop long) révèle aussi les bugs de mise en page edge-case.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Tout savoir sur le Lorem Ipsum et son usage en design web."
              items={[
                {
                  question: "D'où vient le Lorem Ipsum ?",
                  answer:
                    "Le Lorem Ipsum est dérivé d'un texte de Cicéron datant de 45 av. J.-C., De Finibus Bonorum et Malorum (Des termes extrêmes du Bien et du Mal), dont les mots ont été tronqués et mélangés. On lui prête souvent un usage dans l'imprimerie dès le XVIe siècle, mais sa diffusion est surtout attestée à partir des années 1960 (feuilles de transfert Letraset), puis avec la PAO. Il reste le standard du design graphique et du web.",
                },
                {
                  question: "Pourquoi utiliser du faux texte plutôt que du vrai contenu ?",
                  answer:
                    "Le Lorem Ipsum permet de se concentrer sur le design sans être distrait par le contenu. Les lecteurs ont tendance à lire le texte réel, ce qui détourne l'attention de la mise en page, de la typographie et des couleurs. Un texte factice, qui a l'allure d'un vrai texte sans avoir de sens, garde l'œil sur la forme.",
                },
                {
                  question: "Combien de paragraphes utiliser pour une maquette ?",
                  answer:
                    "Pour une page de blog, 3 à 5 paragraphes suffisent. Pour une landing page, 1 à 2 paragraphes par section. L'objectif est de simuler la longueur réelle du contenu final pour valider la mise en page. Un paragraphe généré par cet outil fait environ 40 mots (5 phrases).",
                },
                {
                  question: "Le Lorem Ipsum est-il SEO-friendly ?",
                  answer:
                    "Non, et il ne doit jamais être indexable. Le Lorem Ipsum est en latin abîmé et n'a aucun sens, Google le détecte comme contenu de faible qualité. En production, remplacez-le par du vrai contenu et bloquez les pages staging dans le robots.txt pour éviter qu'elles soient crawlées.",
                },
                {
                  question: "Y a-t-il des alternatives au Lorem Ipsum ?",
                  answer:
                    "Oui : Cupcake Ipsum (gourmandises), Bacon Ipsum (charcuterie), Hipster Ipsum (start-up), Corporate Ipsum (jargon entreprise), Samuel L. Jackson Ipsum, etc. Ces alternatives apportent une touche d'humour mais peuvent distraire les clients sérieux. Le classique reste le plus neutre.",
                },
                {
                  question: "Le texte généré est-il soumis au droit d'auteur ?",
                  answer:
                    "Non. Le Lorem Ipsum est dans le domaine public depuis des siècles. Vous pouvez l'utiliser librement dans vos projets commerciaux, personnels, prints ou web, sans citer de source ni payer de licence. C'est l'une des raisons de sa popularité mondiale.",
                },
                {
                  question: "Mes données sont-elles envoyées sur un serveur ?",
                  answer:
                    "Non, le générateur fonctionne entièrement dans votre navigateur. Le texte est généré localement, sans appel à un serveur, et vos réglages ne sont ni stockés ni transmis. Une fois la page chargée, la génération fonctionne même sans connexion.",
                },
              ]}
            />
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
