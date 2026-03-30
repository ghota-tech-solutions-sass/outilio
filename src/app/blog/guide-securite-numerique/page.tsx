"use client";

import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function ArticleSecuriteNumerique() {
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
            <span style={{ color: "var(--foreground)" }}>Securite numerique : proteger ses comptes en ligne</span>
          </nav>

          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Securite
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-3xl tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Securite numerique : proteger{" "}
            <span style={{ color: "var(--primary)" }}>ses comptes en ligne</span>
          </h1>
          <div
            className="animate-fade-up stagger-2 mt-4 flex items-center gap-4 text-xs font-medium"
            style={{ color: "var(--muted)" }}
          >
            <span>30 mars 2026</span>
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
              En 2025, l&apos;ANSSI (Agence nationale de la securite des systemes d&apos;information) a
              recense plus de 330 000 cyberattaques visant des particuliers et des entreprises en France.
              Le phishing, le credential stuffing (reutilisation de mots de passe voles) et les ransomwares
              restent les menaces principales. La bonne nouvelle : quelques bonnes pratiques simples
              suffisent a bloquer la grande majorite de ces attaques.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Pourquoi les mots de passe faibles sont un danger reel
            </h2>
            <p>
              Selon une etude NordPass 2025, les mots de passe les plus utilises en France restent
              &quot;123456&quot;, &quot;azerty&quot; et &quot;password&quot;. Un mot de passe de 6
              caracteres en minuscules peut etre casse en moins de 10 secondes par une attaque brute
              force moderne. A 8 caracteres avec majuscules, chiffres et symboles, le temps passe a
              plusieurs heures. A 16 caracteres melanges, on parle de millions d&apos;annees.
            </p>
            <p>
              Notre{" "}
              <Link href="/outils/generateur-mot-de-passe" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                generateur de mots de passe
              </Link>{" "}
              cree des mots de passe aleatoires de la longueur et de la complexite souhaitees. Tout est
              genere localement dans votre navigateur &mdash; aucun mot de passe n&apos;est transmis ni
              stocke.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              L&apos;entropie : mesurer la force reelle d&apos;un mot de passe
            </h2>
            <p>
              L&apos;entropie d&apos;un mot de passe se mesure en bits. Elle represente le nombre de
              combinaisons possibles qu&apos;un attaquant devrait essayer. La formule est simple :
            </p>
            <p>
              <strong>Entropie = longueur x log2(taille de l&apos;alphabet)</strong>
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Moins de 40 bits</strong> : tres faible, cassable en quelques minutes</li>
              <li><strong>40-59 bits</strong> : faible, vulnerable aux attaques ciblees</li>
              <li><strong>60-79 bits</strong> : correct pour un usage courant</li>
              <li><strong>80-99 bits</strong> : fort, recommande par l&apos;ANSSI</li>
              <li><strong>100 bits et plus</strong> : excellent, adapte aux comptes sensibles (banque, email principal)</li>
            </ul>
            <p>
              Concretement, un mot de passe de 12 caracteres utilisant majuscules, minuscules, chiffres
              et symboles (95 caracteres possibles) atteint environ 79 bits d&apos;entropie. En passant
              a 16 caracteres, vous montez a 105 bits. Notre generateur affiche l&apos;entropie en temps
              reel pour que vous puissiez juger de la robustesse de votre mot de passe.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Mots de passe prononcables : securite et memorisation
            </h2>
            <p>
              Le probleme des mots de passe totalement aleatoires, c&apos;est qu&apos;ils sont impossibles
              a retenir. C&apos;est la que les mots de passe prononcables entrent en jeu. Le principe :
              generer des sequences de syllabes aleatoires qui ressemblent a de vrais mots, sans en etre.
              Par exemple, &quot;Buvako-Nifret-Dolam3!&quot; est beaucoup plus facile a retenir que
              &quot;x7$Kp2mQ!rL9&quot;, pour une entropie comparable.
            </p>
            <p>
              Notre{" "}
              <Link href="/outils/generateur-mdp-prononcable" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                generateur de mots de passe prononcables
              </Link>{" "}
              produit ce type de mots de passe. Ideal pour le mot de passe maitre de votre gestionnaire
              de mots de passe &mdash; le seul que vous devez vraiment memoriser.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Gestionnaires de mots de passe : le coffre-fort indispensable
            </h2>
            <p>
              Avec des dizaines de comptes en ligne, reutiliser le meme mot de passe partout est tentant
              mais extremement dangereux. Si un seul site est compromis, tous vos comptes le sont. La
              solution : un gestionnaire de mots de passe.
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Bitwarden</strong> : open source, gratuit pour un usage personnel, synchronisation multi-appareils.</li>
              <li><strong>KeePass</strong> : recommande par l&apos;ANSSI, stockage local uniquement, ideal pour les profils techniques.</li>
              <li><strong>1Password</strong> : interface soignee, partage familial, payant (environ 3 euros/mois).</li>
              <li><strong>Le gestionnaire integre du navigateur</strong> : correct en depannage, mais moins securise qu&apos;un outil dedie.</li>
            </ul>
            <p>
              Le principe est toujours le meme : vous retenez un seul mot de passe maitre (fort, prononcable,
              unique), et le gestionnaire genere et stocke tous les autres de facon chiffree.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Securiser son reseau WiFi
            </h2>
            <p>
              Votre box Internet est livree avec un mot de passe WiFi par defaut, souvent imprime sur une
              etiquette. Ce mot de passe peut etre connu de bases de donnees publiques. Il est fortement
              recommande de le changer. Notre{" "}
              <Link href="/outils/generateur-mot-de-passe-wifi" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                generateur de mots de passe WiFi
              </Link>{" "}
              cree des cles WPA2/WPA3 robustes, adaptees aux contraintes des equipements reseau
              (longueur maximale, caracteres autorises).
            </p>

            <h3
              className="!mt-8 text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bonnes pratiques pour votre reseau domestique
            </h3>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Utilisez le protocole WPA3 si votre box le supporte, sinon WPA2-AES au minimum.</li>
              <li>Desactivez le WPS (WiFi Protected Setup), vulnerable aux attaques par brute force.</li>
              <li>Changez le nom du reseau (SSID) par defaut pour ne pas reveler le modele de votre box.</li>
              <li>Creez un reseau invite separe pour vos visiteurs.</li>
            </ul>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Les recommandations de l&apos;ANSSI en 2026
            </h2>
            <p>
              L&apos;ANSSI publie regulierement des guides de bonnes pratiques pour les particuliers et les
              entreprises. Voici les recommandations cles actualisees :
            </p>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li><strong>Mots de passe</strong> : 12 caracteres minimum, idealement 16, avec un melange de types de caracteres.</li>
              <li><strong>Authentification a deux facteurs (2FA)</strong> : activez-la partout ou c&apos;est possible. Privilegiez les applications TOTP (Google Authenticator, Authy) aux SMS, plus vulnerables.</li>
              <li><strong>Mises a jour</strong> : appliquez les correctifs de securite des que possible. La majorite des attaques exploitent des failles deja corrigees.</li>
              <li><strong>Sauvegardes</strong> : appliquez la regle du 3-2-1 (3 copies, 2 supports differents, 1 hors site).</li>
              <li><strong>Phishing</strong> : ne cliquez jamais sur un lien dans un email inattendu. Verifiez l&apos;URL en survolant le lien avant de cliquer.</li>
            </ul>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              Encodage Base64 : comprendre, pas securiser
            </h2>
            <p>
              L&apos;encodage Base64 est souvent confondu avec du chiffrement, mais ce n&apos;est pas le
              cas. Il s&apos;agit d&apos;un simple encodage qui transforme des donnees binaires en texte
              ASCII. Il est utilise dans les emails (pieces jointes), les URLs et les tokens
              d&apos;authentification. Notre{" "}
              <Link href="/outils/encodeur-base64" className="font-medium underline underline-offset-4" style={{ color: "var(--primary)" }}>
                encodeur/decodeur Base64
              </Link>{" "}
              est pratique pour les developpeurs qui ont besoin d&apos;encoder ou de decoder rapidement
              une chaine de caracteres. Mais attention : le Base64 n&apos;offre aucune protection. Toute
              personne peut decoder une chaine Base64 en quelques secondes.
            </p>

            <h2
              className="!mt-10 text-2xl tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
            >
              En resume : les reflexes essentiels
            </h2>
            <ul className="list-disc space-y-2 pl-6" style={{ color: "var(--foreground)" }}>
              <li>Un mot de passe unique par service, genere aleatoirement.</li>
              <li>Un gestionnaire de mots de passe pour tout stocker.</li>
              <li>La 2FA activee sur tous les comptes critiques (email, banque, reseaux sociaux).</li>
              <li>Un mot de passe WiFi robuste, en WPA3 si possible.</li>
              <li>Des mises a jour automatiques sur tous vos appareils.</li>
            </ul>

            {/* CTA */}
            <div className="mt-10 rounded-2xl border p-8 text-center" style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                Generez un mot de passe inviolable en un clic
              </p>
              <Link
                href="/outils/generateur-mot-de-passe"
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
