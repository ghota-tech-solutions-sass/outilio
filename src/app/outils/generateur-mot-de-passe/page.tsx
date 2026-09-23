"use client";

import { useState, useCallback, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";
import { secureRandomInt } from "@/lib/random";

const CHARSETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

type CharsetKey = keyof typeof CHARSETS;
type Options = Record<CharsetKey, boolean>;

const DEFAULT_OPTIONS: Options = { lowercase: true, uppercase: true, numbers: true, symbols: true };

function activeSets(options: Options): string[] {
  const sets = (Object.keys(CHARSETS) as CharsetKey[]).filter((k) => options[k]).map((k) => CHARSETS[k]);
  return sets.length > 0 ? sets : [CHARSETS.lowercase];
}

function generatePassword(length: number, options: Options): string {
  const sets = activeSets(options);
  const chars = sets.join("");
  // On tire uniformément puis on rejette les mots de passe auxquels il manque un type coché
  // (la distribution reste uniforme parmi les mots de passe valides).
  for (;;) {
    let pw = "";
    for (let i = 0; i < length; i++) pw += chars[secureRandomInt(chars.length)];
    if (length < sets.length || sets.every((set) => [...pw].some((c) => set.includes(c)))) return pw;
  }
}

// Entropie théorique (bits) d'un mot de passe tiré uniformément : longueur × log2(taille de l'alphabet)
function entropyBits(length: number, options: Options): number {
  return length * Math.log2(activeSets(options).join("").length);
}

function getStrength(bits: number): { label: string; color: string } {
  if (bits < 64) return { label: "Faible", color: "bg-red-500" };
  if (bits < 80) return { label: "Moyen", color: "bg-yellow-500" };
  if (bits < 100) return { label: "Fort", color: "bg-green-500" };
  return { label: "Très fort", color: "bg-green-600" };
}

export default function GenerateurMotDePasse() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
  // Généré côté client uniquement : sinon le mot de passe serait figé dans le HTML statique
  const [password, setPassword] = useState("");
  const [passwordBits, setPasswordBits] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPassword(generatePassword(16, DEFAULT_OPTIONS));
      setPasswordBits(entropyBits(16, DEFAULT_OPTIONS));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const generate = useCallback(() => {
    setPassword(generatePassword(length, options));
    setPasswordBits(entropyBits(length, options));
    setCopied(false);
  }, [length, options]);

  const copy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé ou permission refusée)
    }
  };

  const strength = getStrength(passwordBits);

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1
            className="animate-fade-up stagger-1 text-3xl font-extrabold md:text-4xl"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
          >
            Générateur de mot de passe sécurisé
          </h1>
          <p className="animate-fade-up stagger-2 mt-2" style={{ color: "var(--muted)" }}>
            Créez des mots de passe forts et uniques en un clic. Génération 100 % locale : le mot de passe n&apos;est jamais transmis.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div
              className="rounded-xl p-6 shadow-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {/* Generated password */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={password}
                  aria-label="Mot de passe généré"
                  className="flex-1 rounded-lg px-4 py-3 font-mono text-lg tracking-wider"
                  style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                />
                <button
                  onClick={copy}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-white hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>

              {/* Strength bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full" style={{ background: "var(--surface-alt)" }}>
                  <div
                    className={`h-2 rounded-full transition-all ${strength.color}`}
                    style={{ width: `${Math.min(100, (passwordBits / 128) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                  {password ? `${strength.label} · ${Math.round(passwordBits)} bits` : ""}
                </span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                Entropie théorique d&apos;un tirage aléatoire uniforme (longueur × log2 du nombre de caractères possibles). Repères :
                moins de 64 bits faible, 80 bits minimum recommandé par l&apos;ANSSI, 100 bits et plus très fort.
              </p>

              {/* Length slider */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Longueur</label>
                  <span className="text-sm font-bold" style={{ color: "var(--primary)" }}>{length}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="mt-2 w-full"
                />
              </div>

              {/* Options */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {(
                  [
                    ["lowercase", "Minuscules (a-z)"],
                    ["uppercase", "Majuscules (A-Z)"],
                    ["numbers", "Chiffres (0-9)"],
                    ["symbols", "Symboles (!@#$)"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm" style={{ color: "var(--foreground)" }}>
                    <input
                      type="checkbox"
                      checked={options[key]}
                      onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                      className="rounded"
                      style={{ borderColor: "var(--border)" }}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <button
                onClick={generate}
                className="mt-6 w-full rounded-lg py-3 font-semibold text-white hover:opacity-90"
                style={{ background: "var(--primary)" }}
              >
                Générer un nouveau mot de passe
              </button>
            </div>

            <ToolHowToSection
              title="Comment générer un mot de passe robuste"
              description="Trois réglages suffisent : longueur, types de caractères et génération cryptographiquement sécurisée. Tout reste dans votre navigateur."
              steps={[
                {
                  name: "Choisir une longueur d'au moins 16 caractères",
                  text:
                    "Le NIST (SP 800-63B, révision 4 de 2025) impose au moins 15 caractères pour un mot de passe utilisé seul (8 s'il est combiné à un second facteur). L'ANSSI raisonne en entropie et recommande au moins 80 bits quand le mot de passe est la principale protection. Chaque caractère supplémentaire multiplie l'effort d'une attaque par force brute. Le curseur va jusqu'à 64 caractères.",
                },
                {
                  name: "Activer les 4 types de caractères",
                  text:
                    "Cochez minuscules, majuscules, chiffres et symboles. Avec les 4 jeux actifs, l'alphabet de génération compte 88 caractères : un mot de passe de 16 caractères atteint alors environ 103 bits d'entropie, ce qui le rend résistant aux attaques modernes, même sur GPU.",
                },
                {
                  name: "Générer puis stocker dans un gestionnaire",
                  text:
                    "Cliquez sur Générer puis Copier. Collez immédiatement dans Bitwarden, 1Password, KeePassXC ou le trousseau de votre système. Ne stockez jamais un mot de passe en clair dans un e-mail, une note ou un fichier texte. Activez également la double authentification quand le service le permet.",
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
                Cas d&apos;usage du générateur
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Équipe dev et secrets d&apos;application
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Clés API, secrets JWT, mots de passe de bases de données, comptes de service : utilisez 32 à 64 caractères avec
                    symboles. Ces secrets ne sont jamais saisis à la main, donc la longueur ne pose aucun problème et l&apos;entropie
                    élevée bloque toute attaque hors ligne sur un dump.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Freelance multi-clients
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un mot de passe unique par client (CMS WordPress, FTP, registrar de domaine). En cas de fuite chez un client, les
                    autres restent protégés. Le générateur produit instantanément les 20 à 30 mots de passe mensuels d&apos;un freelance
                    actif, sans effort.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Onboarding RH et comptes employés
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    À la création d&apos;un compte employé (Microsoft 365, Google Workspace, VPN), générez un mot de passe temporaire
                    de 20 caractères et imposez son changement à la première connexion. Plus rapide et plus sûr que de bricoler
                    Bienvenue2026 + initiales.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Rotation après incident
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Après une fuite annoncée (Have I Been Pwned vous notifie), régénérez immédiatement les mots de passe affectés en
                    16 caractères ou plus, tous types. Couplez avec la déconnexion des sessions actives. Votre gestionnaire facilite la
                    propagation sur tous vos appareils.
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
                Sécurité et bonnes pratiques
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Entropie en bits, la mesure qui compte.</strong> L&apos;entropie d&apos;un mot de passe tiré au hasard se
                  calcule par longueur × log2(taille de l&apos;alphabet). Avec les 4 jeux actifs (88 caractères possibles),
                  12 caractères donnent environ 78 bits, 16 caractères environ 103 bits, 20 caractères environ 129 bits. Au-delà
                  de 80 bits, une attaque par force brute hors ligne devient irréaliste, même avec des moyens importants.
                </p>
                <p>
                  <strong>NIST 800-63B et ANSSI : la longueur prime sur la complexité.</strong> Les recommandations modernes
                  (NIST SP 800-63B, guide ANSSI de 2021) ont abandonné les règles du type &quot;changez tous les 90 jours&quot; ou
                  &quot;1 majuscule + 1 chiffre&quot;. Aujourd&apos;hui, la priorité est la longueur, l&apos;unicité par compte, la
                  vérification contre les bases de fuites et l&apos;ajout d&apos;un second facteur (TOTP, clé FIDO2, passkey).
                </p>
                <p>
                  <strong>Force brute ou dictionnaire.</strong> Une attaque par force brute teste toutes les combinaisons : à 100 bits
                  d&apos;entropie, c&apos;est mathématiquement hors de portée. Une attaque par dictionnaire teste les mots de passe déjà
                  fuités (rockyou.txt, bases Have I Been Pwned : plusieurs milliards d&apos;entrées). C&apos;est pourquoi MotDePasse2024
                  est cassé en quelques secondes alors que P!9xK2vMnQ4tLwR8 résiste pendant des siècles.
                </p>
                <p>
                  <strong>Confidentialité locale.</strong> Cet outil utilise crypto.getRandomValues, l&apos;API Web Crypto du
                  navigateur, qui s&apos;appuie sur le générateur cryptographiquement sûr (CSPRNG) du système d&apos;exploitation, avec
                  un tirage par rejet qui évite tout biais statistique. Le mot de passe généré n&apos;est jamais envoyé sur le réseau,
                  journalisé ni stocké. Vous pouvez fermer l&apos;onglet dès qu&apos;il est collé dans votre gestionnaire.
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus posées sur la génération de mots de passe."
              items={[
                {
                  question: "Quelle longueur minimale pour un mot de passe en 2026 ?",
                  answer:
                    "15 caractères minimum pour un mot de passe utilisé seul (NIST SP 800-63B révision 4), 16 ou plus pour un compte sensible (banque, e-mail principal, gestionnaire de mots de passe), 20 ou plus pour un mot de passe maître. L'ANSSI recommande une entropie d'au moins 80 bits, soit environ 13 caractères aléatoires parmi les 4 types. L'entropie augmente linéairement avec la longueur.",
                },
                {
                  question: "Le mot de passe généré est-il vraiment aléatoire ?",
                  answer:
                    "Oui. L'outil utilise crypto.getRandomValues, l'API Web Crypto du navigateur, qui produit des nombres cryptographiquement sûrs (CSPRNG) issus du système d'exploitation. Le tirage par rejet garantit que chaque caractère a exactement la même probabilité d'apparaître. C'est le même niveau d'aléa que celui utilisé par TLS ou SSH.",
                },
                {
                  question: "Quel gestionnaire de mots de passe choisir ?",
                  answer:
                    "Bitwarden (open source, version gratuite multi-plateforme), 1Password (payant, très ergonomique), KeePassXC (100 % local, gratuit, sans cloud), ou le trousseau iCloud / Google Password Manager si vous êtes déjà dans l'écosystème. Tous chiffrent vos données avec votre mot de passe maître.",
                },
                {
                  question: "Quelle est la différence entre force brute et attaque par dictionnaire ?",
                  answer:
                    "La force brute teste toutes les combinaisons possibles : sur un mot de passe vraiment aléatoire de 16 caractères, elle est impraticable. L'attaque par dictionnaire teste les mots de passe déjà fuités ou les schémas courants (Bonjour123, Prenom2024). L'immense majorité des comptes piratés le sont par dictionnaire, hameçonnage ou réutilisation de mots de passe fuités (credential stuffing), pas par force brute.",
                },
                {
                  question: "Faut-il changer son mot de passe régulièrement ?",
                  answer:
                    "Non, pas selon un calendrier. Le NIST a explicitement abandonné cette recommandation en 2017. Changez votre mot de passe seulement en cas de fuite confirmée (alerte Have I Been Pwned, piratage du service), de partage involontaire ou de soupçon de compromission. Un changement forcé à date fixe pousse les utilisateurs à choisir des variantes faibles.",
                },
                {
                  question: "Le mot de passe est-il envoyé sur internet ?",
                  answer:
                    "Non. Toute la génération est effectuée localement par votre navigateur via crypto.getRandomValues. Le mot de passe n'est transmis à aucun serveur, ni stocké. Le site utilise des outils de mesure d'audience et de publicité, mais ceux-ci n'ont pas accès au mot de passe généré.",
                },
                {
                  question: "Faut-il activer la double authentification en plus d'un bon mot de passe ?",
                  answer:
                    "Oui, systématiquement quand le service le propose. Une clé FIDO2 ou une passkey (YubiKey, Titan, ou la clé de sécurité intégrée à votre smartphone) ou un code TOTP (Aegis, Google Authenticator) bloque l'essentiel des attaques résiduelles. La double authentification transforme un mot de passe fort en compte quasi inviolable.",
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
