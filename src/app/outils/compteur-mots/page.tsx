"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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

            <ToolHowToSection
              title="Comment utiliser le compteur de mots"
              description="Trois etapes simples pour analyser n'importe quel texte et obtenir des statistiques completes."
              steps={[
                {
                  name: "Collez ou tapez votre texte",
                  text:
                    "Copiez votre article, votre post LinkedIn, votre discours ou votre essai dans la zone de saisie. Le comptage demarre des le premier caractere, sans bouton a cliquer. Vous pouvez aussi taper directement, les statistiques s'actualisent en temps reel.",
                },
                {
                  name: "Lisez les statistiques cle",
                  text:
                    "Les quatre cartes en haut affichent : nombre de mots, caracteres totaux, caracteres sans espaces et nombre de phrases. Sous la zone de texte, deux estimations supplementaires : temps de lecture (base sur 200 mots par minute, vitesse moyenne d'un lecteur francais) et temps de parole (130 mots par minute pour un debit naturel).",
                },
                {
                  name: "Adaptez votre texte aux contraintes",
                  text:
                    "Si vous depassez la limite d'un reseau social (280 caracteres pour Twitter, 3000 pour LinkedIn, 155 pour une meta description), reduisez le contenu jusqu'a respecter le seuil. Pour un article SEO, visez entre 1500 et 2500 mots selon la concurrence du mot-cle vise.",
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
                    Redacteur web et content manager
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Verifier qu&apos;un article respecte le brief client (1800 mots minimum), calibrer
                    les meta descriptions a 155 caracteres, valider la longueur d&apos;un title tag
                    sous 60 caracteres pour eviter la troncature dans les SERP Google.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Etudiant et chercheur
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Respecter les consignes d&apos;un memoire (entre 30 et 50 pages, soit 9000 a
                    15000 mots), valider la longueur d&apos;un resume d&apos;article scientifique
                    (souvent 250 mots max), preparer une dissertation au format impose.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Conferencier et formateur
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Caler un keynote de 20 minutes : 130 mots par minute donne 2600 mots de script.
                    Le temps de parole estime evite de finir trop court ou de devoir accelerer en
                    fin d&apos;intervention. Indispensable pour les pitchs concours type 3MT.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Community manager
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Adapter un message a chaque plateforme : Twitter/X 280 caracteres, threads
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
                A savoir sur le comptage de texte
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Mot vs caractere : deux notions differentes.</strong> Un mot est une
                  sequence separee par des espaces. Un caractere est chaque lettre, chiffre, signe
                  de ponctuation ou espace. Le mot &laquo; aujourd&apos;hui &raquo; compte 1 mot et
                  10 caracteres. Twitter limite en caracteres, un editeur en signes ou en mots.
                </p>
                <p>
                  <strong>Caracteres avec ou sans espaces.</strong> Les contrats de redaction et
                  les bareme universitaires raisonnent souvent en caracteres avec espaces (par
                  defaut Word). Mais certaines plateformes SMS ou anciennes contraintes typographes
                  comptent sans espaces. Bien lire le brief evite les mauvaises surprises.
                </p>
                <p>
                  <strong>200 mots / minute, c&apos;est une moyenne.</strong> Un lecteur rapide
                  monte a 300-400 mpm, un lecteur lent reste autour de 150 mpm. Le score Hemingway
                  ou Flesch ajuste mieux la lisibilite. Pour un article de blog, viser 200 mpm
                  reste une bonne base, c&apos;est la cadence d&apos;un public adulte standard.
                </p>
                <p>
                  <strong>Phrases : detection imparfaite.</strong> L&apos;outil compte les
                  terminateurs de phrase (point, exclamation, interrogation). Mais
                  &laquo; M. Dupont &raquo; ou &laquo; etc. &raquo; contiennent un point sans
                  terminer la phrase. Pour un comptage millimetrique, comptez manuellement ou
                  utilisez un parseur NLP comme spaCy.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Tout ce qu'il faut savoir sur le comptage de mots et caracteres."
              items={[
                {
                  question: "Comment sont comptes les mots ?",
                  answer:
                    "Les mots sont separes par les espaces, tabulations et retours a la ligne. Les nombres, abreviations et mots composes avec un trait d'union comptent chacun comme un seul mot. Aujourd'hui, c'est-a-dire ou rendez-vous = 1 mot.",
                },
                {
                  question: "Combien de mots faut-il pour un article SEO ?",
                  answer:
                    "Pour le referencement naturel en France, un article de blog performant contient generalement entre 1500 et 2500 mots. Les contenus de plus de 3000 mots obtiennent souvent de meilleurs classements sur Google pour les requetes competitives, mais la qualite reste plus importante que la quantite.",
                },
                {
                  question: "L'outil fonctionne-t-il avec les caracteres accentues ?",
                  answer:
                    "Oui, le compteur gere parfaitement les caracteres accentues francais (e, a, u, etc.), les caracteres speciaux et les emojis. Chaque caractere Unicode est compte individuellement, meme les emojis composes sur plusieurs points de code.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui. Le comptage est effectue 100 % localement dans votre navigateur. Aucun texte saisi n'est envoye a un serveur, ne transite par le reseau ou n'est stocke. Vous pouvez compter des contenus sensibles ou confidentiels en toute securite.",
                },
                {
                  question: "Quelle est la limite de longueur du texte ?",
                  answer:
                    "L'outil n'impose pas de limite stricte. Il peut analyser plusieurs milliers de mots sans ralentissement. Pour des textes tres volumineux (au-dela de 100000 caracteres), votre navigateur peut commencer a montrer une legere latence selon votre machine.",
                },
                {
                  question: "Pourquoi le temps de lecture est-il different du temps de parole ?",
                  answer:
                    "Un lecteur silencieux traite environ 200 mots par minute en lecture courante, alors qu'un orateur naturel parle a 130 mots par minute. La parole inclut la respiration, la prosodie et les pauses. Pour un podcast ou une video, le temps de parole est plus realiste.",
                },
                {
                  question: "L'outil compte-t-il les paragraphes et les sauts de ligne ?",
                  answer:
                    "Oui. Un paragraphe est defini par un saut de ligne double (ligne vide entre deux blocs de texte). Les retours a la ligne simples a l'interieur d'un paragraphe ne creent pas de nouveau paragraphe. Cette regle suit la convention markdown classique.",
                },
              ]}
            />
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
