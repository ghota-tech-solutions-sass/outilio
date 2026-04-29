"use client";

import { useState, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const CHARSETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(length: number, options: Record<string, boolean>): string {
  let chars = "";
  if (options.lowercase) chars += CHARSETS.lowercase;
  if (options.uppercase) chars += CHARSETS.uppercase;
  if (options.numbers) chars += CHARSETS.numbers;
  if (options.symbols) chars += CHARSETS.symbols;
  if (!chars) chars = CHARSETS.lowercase;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => chars[n % chars.length]).join("");
}

function getStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  if (score <= 2) return { score, label: "Faible", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Moyen", color: "bg-yellow-500" };
  return { score, label: "Fort", color: "bg-green-500" };
}

export default function GenerateurMotDePasse() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState(() => generatePassword(16, { lowercase: true, uppercase: true, numbers: true, symbols: true }));
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    setPassword(generatePassword(length, options));
    setCopied(false);
  }, [length, options]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(password);

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1
            className="animate-fade-up stagger-1 text-3xl font-extrabold md:text-4xl"
            style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}
          >
            Generateur de mot de passe securise
          </h1>
          <p className="animate-fade-up stagger-2 mt-2" style={{ color: "var(--muted)" }}>
            Creez des mots de passe forts et uniques en un clic. 100% local, rien n&apos;est envoye.
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
                  className="flex-1 rounded-lg px-4 py-3 font-mono text-lg tracking-wider"
                  style={{ background: "var(--surface-alt)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                />
                <button
                  onClick={copy}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-white hover:opacity-90"
                  style={{ background: "var(--primary)" }}
                >
                  {copied ? "Copie !" : "Copier"}
                </button>
              </div>

              {/* Strength bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 rounded-full" style={{ background: "var(--surface-alt)" }}>
                  <div
                    className={`h-2 rounded-full transition-all ${strength.color}`}
                    style={{ width: `${(strength.score / 6) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>{strength.label}</span>
              </div>

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
                Generer un nouveau mot de passe
              </button>
            </div>

            <ToolHowToSection
              title="Comment generer un mot de passe robuste"
              description="Trois reglages suffisent : longueur, types de caracteres et generation cryptographiquement securisee. Tout reste dans votre navigateur."
              steps={[
                {
                  name: "Choisir une longueur d&apos;au moins 16 caracteres",
                  text:
                    "Le NIST (publication 800-63B) et l&apos;ANSSI recommandent au minimum 12 caracteres pour un compte standard, 16 pour un compte sensible (banque, email principal, gestionnaire de mots de passe). Chaque caractere supplementaire multiplie l&apos;effort d&apos;une attaque par force brute. Le curseur va jusqu&apos;a 64 caracteres.",
                },
                {
                  name: "Activer les 4 types de caracteres",
                  text:
                    "Cochez minuscules, majuscules, chiffres et symboles. Avec les 4 jeux actifs, l&apos;alphabet de generation atteint environ 90 caracteres : un mot de passe de 16 caracteres a alors une entropie superieure a 100 bits, ce qui le rend resistant aux attaques modernes meme sur GPU.",
                },
                {
                  name: "Generer puis stocker dans un gestionnaire",
                  text:
                    "Cliquez sur Generer puis Copier. Collez immediatement dans Bitwarden, 1Password, KeePassXC ou le trousseau de votre OS. Ne stockez jamais un mot de passe en clair dans un email, une note ou un fichier texte. Activez egalement la 2FA quand le service le permet.",
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
                Cas d&apos;usage du generateur
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Equipe dev et secrets d&apos;application
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Cles API, secrets JWT, mots de passe de bases de donnees, comptes de service : utilisez 32 a 64 caracteres avec
                    symboles. Ces secrets ne sont jamais saisis a la main, donc la longueur ne pose aucun probleme et l&apos;entropie
                    elevee bloque toute attaque hors-ligne sur un dump.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Freelance multi-clients
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Un mot de passe unique par client (CMS WordPress, FTP, registrar de domaine). En cas de fuite chez un client, les
                    autres restent proteges. Le generateur produit instantanement 20 a 30 mots de passe par mois pour un freelance
                    actif, sans effort.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Onboarding RH et comptes employes
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    A la creation d&apos;un compte employe (Microsoft 365, Google Workspace, VPN), generez un mot de passe temporaire
                    de 20 caracteres et imposez son changement a la premiere connexion. Plus rapide et plus sur que de bricoler
                    Bienvenue2024 + initiales.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Rotation post-incident
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Apres une fuite annoncee (Have I Been Pwned vous notifie), regenerez immediatement les mots de passe affectes en
                    16+ caracteres tous types. Couplez avec la rotation des sessions actives. Votre gestionnaire facilite la
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
                Securite et bonnes pratiques
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Entropie en bits, la mesure qui compte.</strong> L&apos;entropie d&apos;un mot de passe se calcule par
                  log2(alphabet) x longueur. Avec 4 jeux actifs (environ 90 caracteres possibles), 12 caracteres donnent environ
                  78 bits, 16 caracteres environ 104 bits, 20 caracteres environ 130 bits. Au-dessus de 80 bits, une attaque par
                  force brute hors-ligne sur GPU devient irrealiste meme pour un attaquant etatique.
                </p>
                <p>
                  <strong>NIST 800-63B et ANSSI : la longueur prime sur la complexite.</strong> Les recommandations modernes
                  (NIST Special Publication 800-63B, guide ANSSI) ont abandonne les regles type &quot;changez tous les 90 jours&quot; ou
                  &quot;1 majuscule + 1 chiffre&quot;. Aujourd&apos;hui, la priorite est la longueur, l&apos;unicite par compte, la verification
                  contre les bases de fuites, et l&apos;ajout d&apos;un second facteur (TOTP, cle FIDO2).
                </p>
                <p>
                  <strong>Brute force vs dictionnaire.</strong> Une attaque par force brute teste toutes les combinaisons : a 100 bits
                  d&apos;entropie, c&apos;est mathematiquement impossible. Une attaque par dictionnaire teste les mots de passe deja
                  fuites (rockyou.txt, listes Have I Been Pwned : plus de 12 milliards d&apos;entrees). C&apos;est pourquoi MotDePasse2024
                  est casse en quelques secondes alors que P!9xK2vMnQ4tLwR8 resiste pendant des siecles.
                </p>
                <p>
                  <strong>Confidentialite locale.</strong> Cet outil utilise crypto.getRandomValues, l&apos;API Web Crypto du
                  navigateur, qui s&apos;appuie sur un generateur cryptographiquement securise (CSPRNG) du systeme d&apos;exploitation.
                  Aucun mot de passe n&apos;est jamais envoye sur le reseau, journalise ou stocke. Vous pouvez fermer l&apos;onglet
                  immediatement apres avoir colle le mot de passe dans votre gestionnaire.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur la generation de mots de passe."
              items={[
                {
                  question: "Quelle longueur minimale pour un mot de passe en 2026 ?",
                  answer:
                    "12 caracteres minimum pour un compte standard, 16 pour un compte sensible (banque, email principal, password manager), 20+ pour un mot de passe maitre. Le NIST 800-63B et l&apos;ANSSI alignent leurs recommandations sur ces seuils. Plus la longueur augmente, plus l&apos;entropie augmente lineairement.",
                },
                {
                  question: "Le mot de passe genere est-il vraiment aleatoire ?",
                  answer:
                    "Oui. L&apos;outil utilise crypto.getRandomValues, l&apos;API Web Crypto du navigateur, qui produit des nombres cryptographiquement securises (CSPRNG) issus du systeme d&apos;exploitation. C&apos;est le meme niveau d&apos;aleatoire que celui utilise par TLS, SSH ou les portefeuilles de cryptomonnaies.",
                },
                {
                  question: "Quel gestionnaire de mots de passe choisir ?",
                  answer:
                    "Bitwarden (open source, gratuit, multi-plateforme, plan famille a 40 USD par an), 1Password (plus poli mais payant des le premier compte), KeePassXC (100 % local, gratuit, sans cloud), ou le trousseau iCloud / Google Password Manager si vous etes deja dans l&apos;ecosysteme. Tous chiffrent localement avec votre mot de passe maitre.",
                },
                {
                  question: "Quelle est la difference entre brute force et attaque par dictionnaire ?",
                  answer:
                    "La brute force teste toutes les combinaisons possibles : sur un mot de passe vraiment aleatoire de 16 caracteres, elle est impraticable. L&apos;attaque par dictionnaire teste les mots de passe deja fuites ou les patterns courants (Bonjour123, Prenom2024). 99 % des comptes pirates le sont par dictionnaire ou par credential stuffing, pas par brute force.",
                },
                {
                  question: "Faut-il changer son mot de passe regulierement ?",
                  answer:
                    "Non, pas par calendrier. Le NIST a explicitement abandonne cette recommandation en 2017. Changez votre mot de passe seulement en cas de fuite confirmee (alerte Have I Been Pwned, breach de service), de partage involontaire ou de soupcon de compromission. Un changement force a date fixe pousse les utilisateurs a choisir des variantes faibles.",
                },
                {
                  question: "Le mot de passe est-il envoye sur internet ?",
                  answer:
                    "Non. Toute la generation est effectuee localement par votre navigateur via crypto.getRandomValues. Aucune requete reseau n&apos;est emise pendant la creation. Vous pouvez verifier en ouvrant l&apos;onglet Reseau des outils de developpement avant de cliquer sur Generer.",
                },
                {
                  question: "Faut-il activer la 2FA en plus d&apos;un bon mot de passe ?",
                  answer:
                    "Oui, systematiquement quand le service le propose. Une cle FIDO2 (YubiKey, Titan, ou la cle de securite integree de votre smartphone) ou un code TOTP (Aegis, Google Authenticator) bloque environ 99 % des attaques residuelles. La 2FA est la couche qui transforme un mot de passe fort en compte quasi-inviolable.",
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
