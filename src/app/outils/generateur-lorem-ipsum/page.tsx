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

            <ToolHowToSection
              title="Comment utiliser le generateur Lorem Ipsum"
              description="Trois reglages pour generer le faux texte adapte a votre maquette en quelques secondes."
              steps={[
                {
                  name: "Choisissez l'unite de generation",
                  text:
                    "Selectionnez Paragraphes pour remplir des blocs d'article, Phrases pour des blocs courts comme des cartes ou des descriptions, Mots pour les titres et les boutons. Le bon choix evite les debordements de mise en page et reflete le contenu reel attendu.",
                },
                {
                  name: "Ajustez la quantite avec le curseur",
                  text:
                    "Le curseur s'adapte automatiquement a l'unite choisie : jusqu'a 20 paragraphes, 50 phrases ou 500 mots. Visez la longueur du contenu final que vous prevoyez : si l'article reel fera environ 800 mots, generez 8 a 10 paragraphes pour une simulation realiste.",
                },
                {
                  name: "Copiez et collez dans votre maquette",
                  text:
                    "Le bouton Copier transfere le texte dans le presse-papier. Collez ensuite dans Figma, Sketch, votre CMS, votre editeur HTML ou directement dans une slide. Le Lorem Ipsum est compatible avec tous les outils de design et plateformes web.",
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
                    Remplir des wireframes Figma ou Adobe XD avec un texte calibre evite les
                    debats sur la copie pendant la revue design. Le client se concentre sur la
                    structure, la typographie et la hierarchie visuelle plutot que sur le wording.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Developpeur front-end
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Tester les composants React, Vue ou Angular avec du contenu variable :
                    long, court, multi-paragraphes. Detecter les bugs de troncature, de
                    debordement et de wrapping responsive avant l&apos;integration du contenu reel.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Print designer et editeur
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Maquetter une brochure, un magazine ou une affiche dans InDesign avant que
                    le texte definitif ne soit valide. Le Lorem Ipsum permet de figer la grille
                    typographique, le rythme des paragraphes et les colonnes.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Theme WordPress et template
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pre-remplir des demos de themes ou des templates email afin que les acheteurs
                    visualisent immediatement le rendu. Idem pour les modeles ThemeForest, Webflow
                    ou Notion : le faux contenu sert de placeholder esthetique.
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
                A savoir avant d&apos;utiliser du Lorem Ipsum
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Ne jamais publier en production.</strong> Le Lorem Ipsum laisse en ligne
                  est devenu un meme : on en trouve sur des sites de marques connues, parfois en
                  page d&apos;accueil. Avant le go-live, lancez un Ctrl+F sur &laquo; lorem &raquo;
                  dans votre CMS pour traquer les oublis. Google peut aussi penaliser un site qui
                  a beaucoup de contenu de placeholder.
                </p>
                <p>
                  <strong>Lorem Ipsum vs vrai contenu : les surprises.</strong> Le faux texte a une
                  densite uniforme, alors que le contenu reel alterne paragraphes courts et longs.
                  Une fois le contenu integre, certains designs &laquo; cassent &raquo; car les
                  vraies sections sont 30 % plus courtes ou plus longues que prevu. Mieux vaut
                  recevoir un draft du copywriter avant de finaliser la maquette.
                </p>
                <p>
                  <strong>Accessibilite et tests.</strong> Le Lorem Ipsum n&apos;est pas du francais
                  ni de l&apos;anglais, donc inutilisable pour tester un screen reader, un correcteur
                  orthographique ou une analyse SEO. Utilisez des outils comme cupcake-ipsum ou
                  bacon-ipsum pour des tests qui necessitent une langue reelle.
                </p>
                <p>
                  <strong>Longueur a calibrer.</strong> Pour une carte produit, 1-2 phrases. Pour
                  une description e-commerce, 1 paragraphe. Pour un article de blog, 5-10
                  paragraphes. Tester votre maquette avec une longueur tres differente (deliberement
                  trop court ou trop long) revele aussi les bugs de mise en page edge-case.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Tout savoir sur le Lorem Ipsum et son usage en design web."
              items={[
                {
                  question: "D'ou vient le Lorem Ipsum ?",
                  answer:
                    "Le Lorem Ipsum est derive d'un texte de Ciceron datant de 45 av. J.-C., De Finibus Bonorum et Malorum (Des termes extremes du Bien et du Mal). Il a ete utilise comme texte de remplissage dans l'imprimerie depuis les annees 1500 et reste le standard dans le design graphique et le web.",
                },
                {
                  question: "Pourquoi utiliser du faux texte plutot que du vrai contenu ?",
                  answer:
                    "Le Lorem Ipsum permet de se concentrer sur le design sans etre distrait par le contenu. Les lecteurs ont tendance a lire le texte reel, ce qui detourne l'attention de la mise en page, de la typographie et des couleurs. Un texte factice mais lisible (sans drole de sens) garde l'oeil sur la forme.",
                },
                {
                  question: "Combien de paragraphes utiliser pour une maquette ?",
                  answer:
                    "Pour une page de blog, 3 a 5 paragraphes suffisent. Pour une landing page, 1 a 2 paragraphes par section. L'objectif est de simuler la longueur reelle du contenu final pour valider la mise en page. Un paragraphe Lorem Ipsum standard fait environ 50 mots.",
                },
                {
                  question: "Le Lorem Ipsum est-il SEO-friendly ?",
                  answer:
                    "Non, et il ne doit jamais etre indexable. Le Lorem Ipsum est en latin abime et n'a aucun sens, Google le detecte comme contenu de faible qualite. En production, remplacez-le par du vrai contenu et bloquez les pages staging dans le robots.txt pour eviter qu'elles soient crawlees.",
                },
                {
                  question: "Y a-t-il des alternatives au Lorem Ipsum ?",
                  answer:
                    "Oui : Cupcake Ipsum (gourmandises), Bacon Ipsum (charcuterie), Hipster Ipsum (start-up), Corporate Ipsum (jargon entreprise), Samuel L. Jackson Ipsum, etc. Ces alternatives apportent une touche d'humour mais peuvent distraire les clients serieux. Le classique reste le plus neutre.",
                },
                {
                  question: "Le texte genere est-il copyright ?",
                  answer:
                    "Non. Le Lorem Ipsum est dans le domaine public depuis des siecles. Vous pouvez l'utiliser librement dans vos projets commerciaux, personnels, prints ou web, sans citer de source ni payer de licence. C'est l'une des raisons de sa popularite mondiale.",
                },
                {
                  question: "Mes donnees sont-elles envoyees sur un serveur ?",
                  answer:
                    "Non, le generateur fonctionne entierement dans votre navigateur. Aucun appel reseau n'est effectue, aucun texte ni reglage n'est stocke ou transmis. L'outil reste disponible meme hors ligne une fois la page chargee.",
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
