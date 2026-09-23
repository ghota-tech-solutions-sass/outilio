"use client";

import { useState, useCallback, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";
import { secureRandomInt } from "@/lib/random";

const CONSONANTS = "bcdfghjklmnprstvwxz";
const VOWELS = "aeiouy";
const SYLLABLE_PATTERNS = ["cv", "cvc", "cv", "cvv"];
const SPECIALS = "!@#$%&*?";

function randomChar(chars: string): string {
  return chars[secureRandomInt(chars.length)];
}

function generateSyllable(): string {
  const pattern = SYLLABLE_PATTERNS[secureRandomInt(SYLLABLE_PATTERNS.length)];
  return pattern
    .split("")
    .map((p) => (p === "c" ? randomChar(CONSONANTS) : randomChar(VOWELS)))
    .join("");
}

function generatePassword(syllables: number, includeNumbers: boolean, includeSpecial: boolean, capitalize: boolean): string {
  const parts: string[] = [];
  for (let i = 0; i < syllables; i++) {
    let syl = generateSyllable();
    if (capitalize && i % 2 === 0) {
      syl = syl[0].toUpperCase() + syl.slice(1);
    }
    parts.push(syl);
  }
  let pwd = parts.join("");
  if (includeNumbers) {
    pwd += (secureRandomInt(90) + 10).toString();
  }
  if (includeSpecial) {
    pwd += randomChar(SPECIALS);
  }
  return pwd;
}

// Entropie d'une syllabe : somme sur les motifs de p(motif) × log2(nombre de combinaisons / p(motif))
const SYLLABLE_BITS = (() => {
  const counts: Record<string, number> = {};
  for (const p of SYLLABLE_PATTERNS) counts[p] = (counts[p] || 0) + 1;
  let bits = 0;
  for (const [pattern, n] of Object.entries(counts)) {
    const prob = n / SYLLABLE_PATTERNS.length;
    const combos = pattern.split("").reduce((acc, c) => acc * (c === "c" ? CONSONANTS.length : VOWELS.length), 1);
    bits += prob * Math.log2(combos / prob);
  }
  return bits;
})();

// Les majuscules sont placées de façon déterministe : elles n'ajoutent pas d'entropie.
function entropyBits(syllables: number, includeNumbers: boolean, includeSpecial: boolean): number {
  return syllables * SYLLABLE_BITS + (includeNumbers ? Math.log2(90) : 0) + (includeSpecial ? Math.log2(SPECIALS.length) : 0);
}

function getStrength(bits: number): { label: string; color: string } {
  if (bits < 64) return { label: "Faible", color: "#dc2626" };
  if (bits < 80) return { label: "Moyen", color: "#f59e0b" };
  if (bits < 100) return { label: "Fort", color: "#16a34a" };
  return { label: "Très fort", color: "#059669" };
}

interface Generated {
  pwd: string;
  bits: number;
}

function generateBatch(syllables: number, includeNumbers: boolean, includeSpecial: boolean, capitalize: boolean): Generated[] {
  const bits = entropyBits(syllables, includeNumbers, includeSpecial);
  return Array.from({ length: 6 }, () => ({
    pwd: generatePassword(syllables, includeNumbers, includeSpecial, capitalize),
    bits,
  }));
}

export default function GenerateurMdpPrononcable() {
  const [syllables, setSyllables] = useState(8);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [capitalize, setCapitalize] = useState(true);
  const [passwords, setPasswords] = useState<Generated[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    setPasswords(generateBatch(syllables, includeNumbers, includeSpecial, capitalize));
    setCopied(null);
  }, [syllables, includeNumbers, includeSpecial, capitalize]);

  // Génération au premier rendu côté client (jamais dans le HTML statique)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPasswords(generateBatch(syllables, includeNumbers, includeSpecial, capitalize));
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = async (pwd: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(pwd);
      setCopied(idx);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Presse-papiers indisponible
    }
  };

  const currentBits = entropyBits(syllables, includeNumbers, includeSpecial);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Sécurité</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Mot de passe <span style={{ color: "var(--primary)" }}>prononçable</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Générez des mots de passe faciles à prononcer et à retenir, tout en restant sécurisés.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Options */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Options</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Nombre de syllabes : {syllables}
                  </label>
                  <input type="range" min="2" max="10" value={syllables} onChange={(e) => setSyllables(Number(e.target.value))}
                    className="mt-2 w-full" />
                  <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                    <span>Court</span><span>Long</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} className="h-4 w-4" />
                    Majuscules
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="h-4 w-4" />
                    Chiffres
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={includeSpecial} onChange={(e) => setIncludeSpecial(e.target.checked)} className="h-4 w-4" />
                    Caractères spéciaux
                  </label>
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Entropie avec ces réglages : environ {Math.round(currentBits)} bits ({getStrength(currentBits).label.toLowerCase()}).
                  L&apos;ANSSI recommande au moins 80 bits pour un mot de passe qui constitue la principale protection d&apos;un compte.
                </p>
              </div>

              <button onClick={generate}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                Générer de nouveaux mots de passe
              </button>
            </div>

            {/* Generated passwords */}
            <div className="space-y-3">
              {passwords.map(({ pwd, bits }, i) => {
                const strength = getStrength(bits);
                return (
                  <div key={i} className="rounded-2xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xl font-mono font-bold tracking-wider break-all flex-1">{pwd}</p>
                      <button onClick={() => handleCopy(pwd, i)}
                        className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white"
                        style={{ background: copied === i ? "#16a34a" : "var(--primary)" }}>
                        {copied === i ? "Copié !" : "Copier"}
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (bits / 128) * 100)}%`, background: strength.color }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label} · {Math.round(bits)} bits</span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>{pwd.length} caractères</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <ToolHowToSection
              title="Comment générer un mot de passe prononçable et sûr"
              description="Le compromis : retrouver la facilité de mémorisation des mots réels, sans sacrifier l'entropie nécessaire face aux attaques modernes."
              steps={[
                {
                  name: "Choisir 8 syllabes ou plus",
                  text:
                    "Chaque syllabe aléatoire apporte environ 10 bits d'entropie. 4 syllabes (11 à 15 caractères avec chiffres et symbole) donnent environ 50 bits : suffisant pour un compte protégé par une double authentification, pas au-delà. 8 syllabes atteignent environ 90 bits, au-dessus du seuil de 80 bits recommandé par l'ANSSI ; 9 à 10 syllabes conviennent à un mot de passe maître.",
                },
                {
                  name: "Activer chiffres et caractères spéciaux",
                  text:
                    "Le nombre à deux chiffres ajoute environ 6,5 bits et le symbole final 3 bits. Les majuscules, placées une syllabe sur deux, facilitent la lecture et satisfont les sites qui les exigent, mais n'ajoutent pas d'entropie car leur position est prévisible. L'entropie réelle est affichée sous chaque suggestion.",
                },
                {
                  name: "Choisir parmi les 6 suggestions et le mémoriser",
                  text:
                    "L'outil affiche 6 suggestions simultanément : sélectionnez celle qui vous paraît la plus naturelle à prononcer. Lisez-la à haute voix 3 ou 4 fois pour l'ancrer dans la mémoire phonologique. C'est l'avantage principal sur un mot de passe purement aléatoire : votre cerveau retient la prononciation, pas la suite de symboles.",
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
                Cas d&apos;usage du générateur prononçable
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Mot de passe maître du gestionnaire
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    C&apos;est LE mot de passe que vous DEVEZ retenir : il déverrouille tous les autres dans Bitwarden, 1Password ou
                    KeePass. 8 à 10 syllabes avec chiffres et symbole (environ 90 à 110 bits) vous donnent un mot de passe maître qui
                    tient face à une attaque hors ligne sur le coffre.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Wi-Fi domestique ou bureau
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous le donnez à voix haute à un visiteur ou un nouveau collègue : un mot de passe prononçable évite les
                    &quot;c&apos;est un i majuscule ou un L minuscule ?&quot;. 6 à 7 syllabes, 2 chiffres et 1 symbole offrent une
                    sécurité WPA2/WPA3 solide tout en restant communicables sans erreur.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Compte temporaire client
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous créez un accès temporaire pour un client (extranet, espace de partage de fichiers) qu&apos;il devra changer à
                    la première connexion. Un mot de passe prononçable se dicte plus facilement par téléphone qu&apos;un
                    Xz9!kQ@2mNvP, sans sacrifier la sécurité à l&apos;envoi initial.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Code partagé en famille
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Coffre-fort numérique familial, contrôle parental, compte de streaming partagé entre adultes : un mot de
                    passe prononçable est plus simple à transmettre oralement et restera dans la mémoire de chaque
                    membre du foyer.
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
                Sécurité et compromis de mémorisation
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Le compromis sécurité / mémorisation.</strong> Un mot de passe purement aléatoire de 12 caractères
                  (xK9$mZ!qP2vL, environ 78 bits) est plus dense en entropie qu&apos;un mot de passe prononçable de même longueur
                  (environ 45 à 50 bits). Mais il est si peu mémorisable que les utilisateurs le notent quelque part. Le prononçable
                  prend l&apos;avantage quand il doit être retenu ou dicté, à condition d&apos;être plus long.
                </p>
                <p>
                  <strong>Méthode XKCD ou syllabes.</strong> La méthode XKCD (correct-horse-battery-staple) combine des mots de
                  dictionnaire tirés au hasard : 4 mots parmi les 7 776 de la liste EFF donnent environ 52 bits, 6 mots environ 78 bits.
                  Les syllabes aléatoires apportent environ 10 bits pour 2 à 3 caractères, soit une densité voisine par caractère.
                  Les deux méthodes sont valables : ce qui compte est le nombre total de bits, affiché par l&apos;outil.
                </p>
                <p>
                  <strong>Longueur recommandée.</strong> Pour un mot de passe prononçable, visez au moins 8 syllabes avec chiffres et
                  symbole (environ 23 caractères, 90 bits). En dessous, l&apos;entropie devient insuffisante face à une attaque hors
                  ligne sur GPU si le site stocke mal ses mots de passe. Avec une double authentification active, un mot de passe plus
                  court reste acceptable.
                </p>
                <p>
                  <strong>Génération locale et confidentialité.</strong> Cet outil crée les mots de passe directement dans votre
                  navigateur avec crypto.getRandomValues. Aucune syllabe, aucun mot de passe proposé ou copié n&apos;est transmis,
                  journalisé ou stocké.
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus posées sur les mots de passe prononçables."
              items={[
                {
                  question: "Un mot de passe prononçable est-il aussi sûr qu'un mot de passe aléatoire ?",
                  answer:
                    "À longueur égale, non : l'alternance consonne-voyelle réduit fortement les combinaisons (environ 4 bits par caractère contre 6,5 pour un tirage parmi 88 caractères). Il faut donc compenser par la longueur : 8 syllabes avec chiffres et symbole atteignent environ 90 bits, au-dessus des 80 bits recommandés par l'ANSSI.",
                },
                {
                  question: "Combien de syllabes choisir ?",
                  answer:
                    "4 syllabes (environ 50 bits) uniquement pour un compte protégé par une double authentification, 8 syllabes (environ 90 bits) pour un compte courant ou sensible, 9 à 10 syllabes (100 à 110 bits) pour un mot de passe maître. Chaque syllabe supplémentaire ajoute environ 10 bits d'entropie.",
                },
                {
                  question: "Que recommandent l'ANSSI et le NIST ?",
                  answer:
                    "L'ANSSI raisonne en entropie : au moins 80 bits lorsque le mot de passe est la principale protection, moins si d'autres mesures existent (double authentification, limitation des tentatives). Le NIST (SP 800-63B révision 4) exige au moins 15 caractères pour un mot de passe utilisé seul. Les mots de passe prononçables de 8 syllabes ou plus (environ 23 caractères, 90 bits) respectent ces deux repères.",
                },
                {
                  question: "Quel gestionnaire de mots de passe utiliser ?",
                  answer:
                    "Bitwarden (open source, version gratuite) ou 1Password (payant, ergonomique) sont les deux références. KeePassXC est une alternative 100 % locale sans cloud. Le mot de passe prononçable est idéal comme mot de passe maître du gestionnaire ; les mots de passe individuels des sites peuvent rester totalement aléatoires.",
                },
                {
                  question: "Comparaison avec la méthode XKCD (correct-horse-battery-staple) ?",
                  answer:
                    "La méthode XKCD tire des mots au hasard dans un dictionnaire : environ 44 bits pour 4 mots dans la liste de 2 048 mots de la bande dessinée, 52 bits avec la liste EFF de 7 776 mots. Une syllabe aléatoire vaut environ 10 bits. Les deux approches se valent à entropie égale : choisissez celle que vous mémorisez le mieux.",
                },
                {
                  question: "Puis-je l'utiliser pour un mot de passe maître ?",
                  answer:
                    "Oui, c'est même un cas d'usage idéal. Pour un mot de passe maître (gestionnaire, chiffrement de disque, clé PGP), choisissez 8 à 10 syllabes avec chiffres et symbole. Répétez-le à haute voix, écrivez-le quelques fois sur papier (que vous détruirez ensuite), puis utilisez-le quotidiennement pour ancrer la mémoire musculaire au clavier.",
                },
                {
                  question: "Mes mots de passe sont-ils transmis à un serveur ?",
                  answer:
                    "Non. La génération est entièrement locale dans votre navigateur. Aucune syllabe, aucune suggestion n'est transmise ni stockée. Vous pouvez fermer l'onglet dès que le mot de passe choisi est copié dans votre gestionnaire.",
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
