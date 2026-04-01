"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleOutilsImageVideo() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative py-14"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <nav className="mb-6 flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
            <Link href="/blog" className="transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4">
              Blog
            </Link>
            <span>&rsaquo;</span>
            <span style={{ color: "var(--foreground)" }}>Retouche photo, compression et montage video gratuits</span>
          </nav>

          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Multimedia
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Retouche photo, compression et{" "}
            <span style={{ color: "var(--primary)" }}>montage video gratuits</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>27 fevrier 2026</span>
            <span className="h-1 w-1 rounded-full" style={{ background: "var(--border)" }} />
            <span>5 min de lecture</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12">
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div className="prose-outilis space-y-6 text-[15px] leading-relaxed" style={{ color: "var(--foreground)" }}>
            <p>
              Que vous soyez e-commercant, community manager, blogueur ou simplement quelqu&apos;un qui
              veut envoyer des photos plus legeres par email, les outils de traitement d&apos;image et de
              video sont devenus indispensables. Le probleme : la plupart des solutions en ligne imposent
              un compte, une limite de fichiers ou un watermark. Sur Outilis.fr, tout est gratuit, sans
              inscription, et vos fichiers restent sur votre appareil &mdash; rien n&apos;est envoye sur
              un serveur.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Compression d&apos;images : reduire le poids sans sacrifier la qualite
            </h2>
            <p>
              Une photo de smartphone pese facilement 3 a 8 Mo. Sur un site web, chaque image non optimisee
              ralentit le chargement, degrade l&apos;experience utilisateur et penalise votre referencement
              Google (les Core Web Vitals mesurent directement la vitesse). Notre{" "}
              <Link href="/outils/compresseur-image" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                compresseur d&apos;images
              </Link>{" "}
              reduit le poids de vos fichiers jusqu&apos;a 80 % en conservant une qualite visuelle
              quasi identique.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              JPEG, PNG ou WebP : quel format choisir ?
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>JPEG</strong> : ideal pour les photographies. Compression avec perte, excellent ratio qualite/poids. Privilegiez une qualite entre 75 et 85 % pour le web.</li>
              <li><strong>PNG</strong> : parfait pour les images avec transparence (logos, icones). Compression sans perte, fichiers plus lourds.</li>
              <li><strong>WebP</strong> : le format developpe par Google. Il combine les avantages du JPEG et du PNG avec un poids 25 a 35 % inferieur. Supporte par tous les navigateurs modernes depuis 2023.</li>
            </ul>
            <p>
              Notre{" "}
              <Link href="/outils/convertisseur-image" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                convertisseur d&apos;images
              </Link>{" "}
              vous permet de passer d&apos;un format a l&apos;autre en un clic. Convertissez vos PNG en
              WebP pour gagner en performance, ou vos HEIC (iPhone) en JPEG pour la compatibilite.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Redimensionnement : adapter ses images a chaque usage
            </h2>
            <p>
              Publier une image de 4 000 x 3 000 pixels sur un site qui l&apos;affiche en 800 x 600 est
              un gaspillage de bande passante. Le{" "}
              <Link href="/outils/redimensionneur-image" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                redimensionneur d&apos;images
              </Link>{" "}
              vous permet d&apos;ajuster les dimensions en pixels ou en pourcentage, tout en preservant
              le ratio d&apos;aspect.
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Tailles recommandees par plateforme
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Instagram post</strong> : 1 080 x 1 080 px (carre) ou 1 080 x 1 350 px (portrait)</li>
              <li><strong>Story / Reels</strong> : 1 080 x 1 920 px</li>
              <li><strong>Facebook couverture</strong> : 820 x 312 px</li>
              <li><strong>LinkedIn banniere</strong> : 1 584 x 396 px</li>
              <li><strong>Site web (hero)</strong> : 1 920 x 1 080 px maximum, compresse en WebP</li>
            </ul>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Retouche photo : corrections rapides sans Photoshop
            </h2>
            <p>
              Vous n&apos;avez pas besoin d&apos;un logiciel a 25 euros/mois pour recadrer une photo, ajuster
              la luminosite ou appliquer un filtre. Notre{" "}
              <Link href="/outils/editeur-photo" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                editeur photo en ligne
              </Link>{" "}
              propose les fonctions essentielles directement dans votre navigateur :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Recadrage libre ou avec des presets (1:1, 16:9, 4:3)</li>
              <li>Ajustement de la luminosite, du contraste, de la saturation</li>
              <li>Rotation et inversion horizontale/verticale</li>
              <li>Filtres artistiques et retouches de couleur</li>
              <li>Ajout de texte et d&apos;annotations</li>
            </ul>
            <p>
              Tout le traitement se fait localement dans votre navigateur grace aux API Canvas et WebAssembly.
              Vos photos ne quittent jamais votre appareil.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Compression video : des fichiers legers sans perte visible
            </h2>
            <p>
              Les videos representent le contenu le plus lourd du web. Une minute de video 4K peut peser
              plus de 300 Mo. Le{" "}
              <Link href="/outils/compresseur-video" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                compresseur video
              </Link>{" "}
              reduit la taille de vos fichiers en ajustant le debit binaire (bitrate), la resolution et
              le codec. Pour la plupart des usages (envoi par email, publication sur les reseaux sociaux),
              une resolution de 1 080p avec un bitrate de 5 Mbps offre un excellent compromis.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Montage video et extraction audio
            </h2>
            <p>
              Besoin de couper une sequence, assembler plusieurs clips ou ajouter une transition ? Notre{" "}
              <Link href="/outils/editeur-video" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                editeur video en ligne
              </Link>{" "}
              gere les operations de montage basiques sans aucune installation. Pour les createurs de
              contenu, c&apos;est un gain de temps considerable pour les retouches rapides avant publication.
            </p>
            <p>
              Vous souhaitez extraire la piste audio d&apos;une video (pour un podcast, une transcription
              ou un remix) ? L&apos;{" "}
              <Link href="/outils/extracteur-audio" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                extracteur audio
              </Link>{" "}
              isole le son au format MP3, WAV ou AAC en quelques secondes. La encore, tout se passe dans
              votre navigateur : pas de telechargement vers un serveur tiers.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Bonnes pratiques pour optimiser vos medias
            </h2>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Compressez avant de publier</strong> : meme les reseaux sociaux recompressent vos fichiers. Autant maitriser le resultat vous-meme.</li>
              <li><strong>Privilegiez le WebP pour le web</strong> : il est plus leger que le JPEG a qualite egale et gere la transparence.</li>
              <li><strong>Redimensionnez a la taille d&apos;affichage</strong> : inutile d&apos;envoyer une image 4K si elle s&apos;affiche en 400 px de large.</li>
              <li><strong>Nommez vos fichiers intelligemment</strong> : pour le SEO, &quot;robe-rouge-ete-2026.webp&quot; vaut mieux que &quot;IMG_4532.jpg&quot;.</li>
              <li><strong>Utilisez le lazy loading</strong> : sur un site web, chargez les images hors ecran uniquement quand l&apos;utilisateur scrolle.</li>
            </ul>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                Compressez vos images en un clic, gratuitement
              </p>
              <Link
                href="/outils/compresseur-image"
                className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}
              >
                Essayer l&apos;outil
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            <div className="mt-10 border-t pt-6" style={{ borderColor: "var(--border)" }}>
              <Link href="/blog" className="text-sm font-medium transition-colors hover:text-[#0d4f3c] hover:underline underline-offset-4" style={{ color: "var(--muted)" }}>
                &larr; Retour au blog
              </Link>
            </div>
          </div>
          <aside className="hidden space-y-6 lg:block">
            <div className="sticky top-24 space-y-6">
              <AdPlaceholder className="min-h-[250px]" />
              <AdPlaceholder className="min-h-[250px]" />
            </div>
          </aside>
          </div>
        </div>
      </article>
    </>
  );
}
