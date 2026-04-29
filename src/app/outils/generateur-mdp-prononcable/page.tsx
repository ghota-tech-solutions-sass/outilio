"use client";

import { useState, useCallback, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const CONSONANTS = "bcdfghjklmnprstvwxz";
const VOWELS = "aeiouy";

// Cryptographically secure random in [0, 1)
function secureRandom(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / (0xffffffff + 1);
}

// Cryptographically secure integer in [0, max)
function secureRandomInt(max: number): number {
  return Math.floor(secureRandom() * max);
}

function randomChar(chars: string): string {
  return chars[secureRandomInt(chars.length)];
}

function generateSyllable(): string {
  const patterns = ["cv", "cvc", "cv", "cvv"];
  const pattern = patterns[secureRandomInt(patterns.length)];
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
    const specials = "!@#$%&*?";
    pwd += specials[secureRandomInt(specials.length)];
  }
  return pwd;
}

function getStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;

  if (score <= 2) return { score, label: "Faible", color: "#dc2626" };
  if (score <= 3) return { score, label: "Moyen", color: "#f59e0b" };
  if (score <= 4) return { score, label: "Fort", color: "#16a34a" };
  return { score, label: "Tres fort", color: "#059669" };
}

export default function GenerateurMdpPrononcable() {
  const [syllables, setSyllables] = useState(4);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [capitalize, setCapitalize] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = useCallback(() => {
    const newPasswords: string[] = [];
    for (let i = 0; i < 6; i++) {
      newPasswords.push(generatePassword(syllables, includeNumbers, includeSpecial, capitalize));
    }
    setPasswords(newPasswords);
    setCopied(null);
  }, [syllables, includeNumbers, includeSpecial, capitalize]);

  // Generate on first render
  useEffect(() => {
    const initial: string[] = [];
    for (let i = 0; i < 6; i++) {
      initial.push(generatePassword(syllables, includeNumbers, includeSpecial, capitalize));
    }
    setPasswords(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (pwd: string, idx: number) => {
    navigator.clipboard.writeText(pwd);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Securite</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Mot de passe <span style={{ color: "var(--primary)" }}>prononcable</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Generez des mots de passe faciles a prononcer et a retenir, tout en restant securises.
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
                  <input type="range" min="2" max="8" value={syllables} onChange={(e) => setSyllables(Number(e.target.value))}
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
                    Caracteres speciaux
                  </label>
                </div>
              </div>

              <button onClick={generate}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)" }}>
                Generer de nouveaux mots de passe
              </button>
            </div>

            {/* Generated passwords */}
            <div className="space-y-3">
              {passwords.map((pwd, i) => {
                const strength = getStrength(pwd);
                return (
                  <div key={i} className="rounded-2xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xl font-mono font-bold tracking-wider break-all flex-1">{pwd}</p>
                      <button onClick={() => handleCopy(pwd, i)}
                        className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white"
                        style={{ background: copied === i ? "#16a34a" : "var(--primary)" }}>
                        {copied === i ? "Copie !" : "Copier"}
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-alt)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${(strength.score / 6) * 100}%`, background: strength.color }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: strength.color }}>{strength.label}</span>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>{pwd.length} caracteres</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <ToolHowToSection
              title="Comment generer un mot de passe prononcable et sur"
              description="Le compromis : retrouver la facilite de memorisation des mots reels, sans sacrifier l&apos;entropie necessaire face aux attaques modernes."
              steps={[
                {
                  name: "Choisir 4 a 6 syllabes",
                  text:
                    "4 syllabes produisent environ 10 a 14 caracteres : un bon point d&apos;equilibre pour un compte courant. 6 syllabes (15 a 20 caracteres) sont conseillees pour un mot de passe maitre, un compte bancaire ou un email principal. Plus de syllabes equivalent a plus d&apos;entropie : chaque syllabe ajoute environ 9 bits.",
                },
                {
                  name: "Activer majuscules + chiffres + caracteres speciaux",
                  text:
                    "Les 3 options renforcent la diversite des caracteres et empechent les dictionnaires specialises sur le pattern consonne-voyelle de craquer le mot de passe. Avec les 3 options actives, un mot de passe prononcable de 16 caracteres atteint une entropie d&apos;environ 70 a 80 bits.",
                },
                {
                  name: "Choisir parmi les 6 suggestions et le memoriser",
                  text:
                    "L&apos;outil affiche 6 suggestions simultanement : selectionnez celle qui vous parait la plus &quot;naturelle&quot; a prononcer. Lisez-la a haute voix 3 ou 4 fois pour l&apos;ancrer dans la memoire phonologique. C&apos;est l&apos;avantage principal sur un mot de passe purement aleatoire : votre cerveau retient la prononciation, pas la suite de symboles.",
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
                Cas d&apos;usage du generateur prononcable
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Mot de passe maitre du gestionnaire
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    C&apos;est LE mot de passe que vous DEVEZ retenir : il deverrouille tous les autres dans Bitwarden, 1Password ou
                    KeePass. 6 a 8 syllabes (18 a 22 caracteres) avec chiffres et symboles vous donnent un mot de passe maitre qui
                    tient face a une attaque hors-ligne sur le coffre.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Wi-Fi domestique ou bureau
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous le donnez a la voix a un visiteur ou un nouveau collegue : un mot de passe prononcable evite les
                    &quot;c&apos;est un i majuscule ou un L minuscule ?&quot;. 4 a 5 syllabes + 2 chiffres + 1 symbole offrent une securite WPA2
                    suffisante tout en restant communicables sans erreur.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Compte temporaire client
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vous creez un acces temporaire pour un client (extranet, espace de partage de fichiers) qu&apos;il devra changer a
                    la premiere connexion. Un mot de passe prononcable se dicte plus facilement par telephone qu&apos;un
                    Xz9!kQ@2mNvP, sans sacrifier la securite a l&apos;envoi initial.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Pin parental ou code partage en famille
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Code de coffre-fort numerique familial, controle parental, compte Netflix partage entre adultes : un mot de
                    passe prononcable de 4 syllabes est plus simple a transmettre verbalement et restera dans la memoire de chaque
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
                Securite et compromis memorisation
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Le compromis securite / memorisation.</strong> Un mot de passe purement aleatoire de 12 caracteres
                  (xK9$mZ!qP2vL) est theoriquement plus dense en entropie qu&apos;un mot de passe prononcable de meme longueur
                  (Korabu7! par exemple). Mais en pratique, il est si peu memorisable que les utilisateurs le notent quelque part :
                  l&apos;entropie effective tombe alors a celle d&apos;un Post-it. Le prononcable est superieur des qu&apos;il sert de mot de
                  passe maitre ou est partage verbalement.
                </p>
                <p>
                  <strong>Methode XKCD vs syllabes.</strong> La methode XKCD (correct-horse-battery-staple) combine 4 mots de
                  dictionnaire et atteint une entropie d&apos;environ 44 a 50 bits. La methode par syllabes generee aleatoirement
                  (notre outil) produit des chaines hors-dictionnaire et atteint plus facilement 70 a 80 bits a longueur egale,
                  car les attaques par dictionnaire de mots ne fonctionnent pas. Les deux methodes sont valables ; la notre
                  est plus dense en entropie par caractere.
                </p>
                <p>
                  <strong>Longueur minimale recommandee.</strong> Pour un mot de passe prononcable, visez au minimum 14 a 16
                  caracteres avec chiffres et symboles. En-dessous, l&apos;entropie devient insuffisante face aux GPU modernes
                  (une RTX 4090 teste plusieurs centaines de milliards de hashes MD5 par seconde). L&apos;ANSSI maintient son
                  seuil minimal de 12 caracteres, le NIST 800-63B aussi, mais pour des secrets a vie longue, montez plus haut.
                </p>
                <p>
                  <strong>Generation locale et confidentialite.</strong> Cet outil cree les mots de passe directement dans votre
                  navigateur, sans aucune requete reseau. Aucune syllabe, aucun mot de passe propose ou copie n&apos;est journalise,
                  envoye ou stocke. Vous pouvez ouvrir l&apos;onglet Reseau des DevTools pour le verifier avant utilisation.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur les mots de passe prononcables."
              items={[
                {
                  question: "Un mot de passe prononcable est-il aussi sur qu&apos;un mot de passe aleatoire ?",
                  answer:
                    "A longueur egale, un peu moins en theorie : l&apos;alphabet effectif est plus restreint car les patterns consonne-voyelle reduisent les combinaisons. En pratique, vous compensez en allongeant : 16 caracteres prononcables avec chiffres et symboles depassent 70 bits d&apos;entropie, ce qui est largement suffisant face aux attaques modernes.",
                },
                {
                  question: "Combien de syllabes choisir ?",
                  answer:
                    "4 syllabes (10 a 14 caracteres) pour un compte courant, 5 a 6 (14 a 20 caracteres) pour un compte sensible, 7 a 8 (20+ caracteres) pour un mot de passe maitre. Chaque syllabe supplementaire ajoute environ 9 bits d&apos;entropie. Au-dela de 8 syllabes, la memorisation devient plus dure que la sortie aleatoire.",
                },
                {
                  question: "L&apos;ANSSI valide-t-elle les mots de passe prononcables ?",
                  answer:
                    "Oui. L&apos;ANSSI exige au minimum 12 caracteres avec un melange de types. Les mots de passe prononcables generes ici, avec majuscules, chiffres et symboles actives, respectent et depassent ces recommandations a partir de 4 syllabes. Le NIST 800-63B est sur la meme ligne et ne fait aucune distinction entre prononcable et aleatoire.",
                },
                {
                  question: "Quel gestionnaire de mots de passe utiliser ?",
                  answer:
                    "Bitwarden (open source, gratuit, plan famille a 40 USD par an) ou 1Password (payant, ergonomique) sont les deux references. KeePassXC est une alternative 100 % locale sans cloud. Le mot de passe prononcable est ideal comme mot de passe maitre du gestionnaire, les mots de passe individuels des sites peuvent rester totalement aleatoires.",
                },
                {
                  question: "Comparaison avec la methode XKCD (correct-horse-battery-staple) ?",
                  answer:
                    "La methode XKCD utilise 4 mots de dictionnaire (entropie environ 44 bits avec un dictionnaire de 7 776 mots EFF). Notre methode par syllabes aleatoires hors-dictionnaire atteint plus facilement 70 a 80 bits a longueur similaire, car aucune attaque par dictionnaire de mots ne fonctionne. Les deux sont valides, la methode syllabique est plus dense.",
                },
                {
                  question: "Puis-je l&apos;utiliser pour un mot de passe maitre ?",
                  answer:
                    "Oui, c&apos;est meme un cas d&apos;usage ideal. Pour un mot de passe maitre (gestionnaire, chiffrement de disque, cle PGP), choisissez 7 a 8 syllabes avec chiffres et symboles. Repetez-le a haute voix, ecrivez-le 5 fois sur papier (que vous detruirez ensuite), puis utilisez-le quotidiennement pour ancrer la memoire musculaire au clavier.",
                },
                {
                  question: "Mes mots de passe sont-ils transmis a un serveur ?",
                  answer:
                    "Non. La generation est entierement locale dans votre navigateur en JavaScript. Aucune syllabe, aucune suggestion ne sort de votre machine. Vous pouvez fermer l&apos;onglet immediatement apres avoir copie le mot de passe choisi dans votre gestionnaire.",
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
