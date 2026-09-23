"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const BASES = [
  { id: "dec", label: "Décimal", base: 10, prefix: "", placeholder: "42" },
  { id: "bin", label: "Binaire", base: 2, prefix: "0b", placeholder: "101010" },
  { id: "oct", label: "Octal", base: 8, prefix: "0o", placeholder: "52" },
  { id: "hex", label: "Hexadécimal", base: 16, prefix: "0x", placeholder: "2A" },
];

const DIGITS = "0123456789abcdef";
const PREFIXES: Record<number, string> = { 2: "0b", 8: "0o", 16: "0x" };

// Parses an integer of any size (BigInt: no precision loss beyond 2^53).
// Accepts a leading sign, the base prefix (0x, 0b, 0o) and spaces/underscores
// used as digit separators ("1111 0000", "1_000_000").
function parseInBase(raw: string, base: number): { value: bigint | null; error: string } {
  let s = raw.trim().replace(/[\s_]/g, "").toLowerCase();
  if (!s) return { value: null, error: "" };
  let negative = false;
  if (s[0] === "-" || s[0] === "+") {
    negative = s[0] === "-";
    s = s.slice(1);
  }
  const prefix = PREFIXES[base];
  if (prefix && s.startsWith(prefix)) s = s.slice(2);
  if (/[.,]/.test(s)) {
    return { value: null, error: "Seuls les nombres entiers sont pris en charge (pas de virgule ni de point décimal)." };
  }
  if (!s) return { value: null, error: `Aucun chiffre saisi en base ${base}.` };
  const allowed = DIGITS.slice(0, base);
  const bigBase = BigInt(base);
  let value = BigInt(0);
  for (const c of s) {
    const d = allowed.indexOf(c);
    if (d === -1) {
      return { value: null, error: `Caractère « ${c} » invalide en base ${base} (chiffres autorisés : ${allowed.toUpperCase().split("").join(", ")}).` };
    }
    value = value * bigBase + BigInt(d);
  }
  return { value: negative ? -value : value, error: "" };
}

function formatInBase(value: bigint, base: number): string {
  const negative = value < BigInt(0);
  const digits = (negative ? -value : value).toString(base).toUpperCase();
  return (negative ? "-" : "") + digits;
}

export default function ConvertisseurNumeration() {
  const [source, setSource] = useState("dec");
  const [input, setInput] = useState("42");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sourceBase = BASES.find((b) => b.id === source)!;
  const { value, error } = parseInBase(input, sourceBase.base);
  const isValid = !error;

  const results = BASES.map((b) => ({
    ...b,
    value: value === null ? "" : formatInBase(value, b.base),
  }));

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Switching the source base keeps the current number (converted to the new base)
  const changeSource = (id: string) => {
    const target = BASES.find((b) => b.id === id)!;
    setSource(id);
    setInput(value === null ? "" : formatInBase(value, target.base));
  };

  const BIT_TABLE = value !== null && value >= BigInt(0) && value <= BigInt(255);
  const bits = BIT_TABLE && value !== null ? value.toString(2).padStart(8, "0").split("") : [];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Développement</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur <span style={{ color: "var(--primary)" }}>Numération</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez instantanément entre décimal, binaire, octal et hexadécimal.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex flex-wrap gap-2 mb-4">
                {BASES.map((b) => (
                  <button key={b.id} onClick={() => changeSource(b.id)}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                    style={{ borderColor: source === b.id ? "var(--primary)" : "var(--border)", background: source === b.id ? "rgba(13,79,60,0.05)" : "transparent", color: source === b.id ? "var(--primary)" : "var(--muted)" }}>
                    {b.label}
                  </button>
                ))}
              </div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                Valeur en {sourceBase.label} {sourceBase.prefix && <span className="font-mono">({sourceBase.prefix})</span>}
              </label>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={sourceBase.placeholder}
                className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold font-mono" style={{ borderColor: isValid ? "var(--border)" : "#dc2626", fontFamily: "var(--font-display)" }} />
              {!isValid && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {results.map((r) => (
                <div key={r.id} className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: r.id === source ? "var(--primary)" : "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: r.id === source ? "var(--primary)" : "var(--accent)" }}>{r.label}</p>
                    {r.value && (
                      <button onClick={() => handleCopy(r.value, r.id)} className="text-xs font-medium px-2 py-1 rounded" style={{ color: "var(--primary)" }}>
                        {copiedId === r.id ? "Copié !" : "Copier"}
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-3xl font-bold font-mono break-all" style={{ fontFamily: "var(--font-display)", color: r.id === source ? "var(--primary)" : "var(--foreground)" }}>
                    {r.value.startsWith("-") && "-"}
                    {r.prefix && r.value && <span style={{ color: "var(--muted)" }}>{r.prefix}</span>}
                    {r.value.replace(/^-/, "") || "\u2014"}
                  </p>
                </div>
              ))}
            </div>

            {/* Bit table */}
            {BIT_TABLE && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Représentation binaire (8 bits)</h2>
                <div className="mt-4 flex gap-1 justify-center">
                  {bits.map((bit, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>2{"\u{2070}\u{00B9}\u{00B2}\u{00B3}\u{2074}\u{2075}\u{2076}\u{2077}"[7 - i]}</span>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
                        style={{ background: bit === "1" ? "var(--primary)" : "var(--surface-alt)", color: bit === "1" ? "#fff" : "var(--muted)" }}>
                        {bit}
                      </div>
                      <span className="text-[10px]" style={{ color: "var(--muted)" }}>{Math.pow(2, 7 - i)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <ToolHowToSection
              title="Comment utiliser le convertisseur de numération"
              description="Quatre actions simples pour convertir n'importe quel nombre entre les bases 2, 8, 10 et 16."
              steps={[
                {
                  name: "Sélectionner la base source",
                  text:
                    "Choisissez la base d'entrée : décimal (base 10, chiffres 0-9), binaire (base 2, chiffres 0-1), octal (base 8, chiffres 0-7) ou hexadécimal (base 16, chiffres 0-9 et lettres A-F). Le bouton actif change l'interprétation de votre saisie ; en changeant de base, le nombre en cours est conservé et réécrit dans la nouvelle base.",
                },
                {
                  name: "Saisir la valeur à convertir",
                  text:
                    "Entrez votre nombre dans le champ. L'outil vérifie en temps réel la validité : si vous tapez un 9 alors que la base est binaire, un message d'erreur apparaît. Les préfixes (0x, 0b, 0o), le signe moins et les espaces ou _ entre groupes de chiffres sont acceptés. La conversion est instantanée, aucun bouton à cliquer.",
                },
                {
                  name: "Lire les 4 résultats simultanés",
                  text:
                    "Les quatre cartes affichent l'équivalent dans chaque base. Le code préfixe (0b pour binaire, 0o pour octal, 0x pour hexa) est également indiqué, pratique pour copier-coller dans du code Python, JavaScript ou C.",
                },
                {
                  name: "Visualiser la représentation 8 bits (0-255)",
                  text:
                    "Pour toute valeur décimale entre 0 et 255, une visualisation graphique sur 8 bits apparaît avec les puissances de 2. Pratique pour comprendre les opérations bit à bit (AND, OR, XOR, shifts) et pour les exercices d'électronique numérique.",
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
                Cas d&apos;usage du convertisseur de bases
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Étudiant en informatique
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Vérifier ses exercices d&apos;architecture des ordinateurs : conversion
                    décimal-binaire, addition binaire avec retenue, complément à 2 pour les
                    nombres négatifs sur 8 bits. Outil de révision avant un partiel ou un examen
                    de DUT/BUT informatique.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Développeur back-end et système
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Décoder les permissions Unix (chmod 755 = rwxr-xr-x = 111 101 101 en binaire),
                    lire les codes d&apos;erreur Windows (0x80070005) ou les adresses mémoire d&apos;un dump en hexa, déboguer des registres système
                    qui combinent flags binaires (par exemple un mask comme 0x0F pour les 4 bits
                    bas).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Designer web et front-end
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Convertir entre couleurs CSS hexa (#FF5733) et leurs composantes RGB
                    décimales (255, 87, 51). Comprendre les codes alpha sur 8 bits pour la
                    transparence (CC = 80 % d&apos;opacité). Utile pour les dégradés et
                    l&apos;accessibilité contraste.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Électronicien et maker
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Programmer un microcontrôleur Arduino ou ESP32 : configurer un registre via un
                    masque binaire, lire l&apos;état de capteurs sur des bits spécifiques, encoder
                    des commandes I2C ou SPI en hexa. Indispensable en domotique et embarqué.
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
                À savoir sur les bases de numération
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Pourquoi 4 bases et pas une seule ?</strong> Le décimal est intuitif pour
                  les humains (10 doigts). Le binaire est natif aux circuits (deux états : 0 ou 1).
                  L&apos;octal et l&apos;hexa sont des compactages du binaire : 1 chiffre octal = 3
                  bits, 1 chiffre hexa = 4 bits. Plus court à lire et écrire pour un développeur.
                </p>
                <p>
                  <strong>Notation préfixée.</strong> Pour éviter l&apos;ambiguïté, les langages de
                  programmation utilisent des préfixes : 0b101010 (binaire), 0o52 (octal), 0x2A
                  (hexa), 42 (décimal par défaut). Sans préfixe, 10 peut signifier dix, deux, huit
                  ou seize selon la base. Toujours préciser dans les contextes mixtes.
                </p>
                <p>
                  <strong>Octal et permissions Unix.</strong> chmod 755 utilise l&apos;octal car 3
                  bits = 1 chiffre octal, et les permissions Unix sont groupées par 3 bits (read,
                  write, execute) pour 3 entités (owner, group, other). Donc 755 = 111 101 101 =
                  rwxr-xr-x. Logique d&apos;origine historique mais très efficace.
                </p>
                <p>
                  <strong>Limites du 8 bits non signé.</strong> Sur 8 bits non signé, on représente
                  0 à 255 (2^8 = 256 valeurs). Sur 8 bits signé en complément à 2, on représente
                  -128 à +127. La visualisation 8 bits de l&apos;outil correspond au mode non
                  signé. Au-delà de 255, passez en 16, 32 ou 64 bits.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Réponses aux questions fréquentes sur la conversion entre bases numériques."
              items={[
                {
                  question: "Pourquoi le binaire est-il utilisé en informatique ?",
                  answer:
                    "Les ordinateurs fonctionnent avec des circuits électriques qui ne connaissent que deux états : allumé (1) et éteint (0). Le système binaire (base 2) correspond directement à ces deux états. Chaque chiffre binaire s'appelle un bit et 8 bits forment un octet (byte).",
                },
                {
                  question: "À quoi sert l'hexadécimal en développement web ?",
                  answer:
                    "L'hexadécimal est omniprésent : les couleurs CSS (#FF5733), les adresses mémoire, les codes Unicode et les hash de commits Git utilisent cette notation. Sa compacité (2 chiffres hexa = 1 octet) le rend beaucoup plus lisible que le binaire pour les humains.",
                },
                {
                  question: "Comment convertir manuellement du décimal en binaire ?",
                  answer:
                    "Divisez le nombre par 2 de manière répétée et notez le reste à chaque étape. Lisez ensuite les restes de bas en haut. Pour 42 : 42/2=21 r0, 21/2=10 r1, 10/2=5 r0, 5/2=2 r1, 2/2=1 r0, 1/2=0 r1 soit 101010 en binaire.",
                },
                {
                  question: "L'outil gère-t-il les nombres négatifs ?",
                  answer:
                    "Oui, en valeur signée : saisissez -42 et l'outil affiche -101010, -52 et -2A. Ce n'est pas la représentation en complément à 2 utilisée par les processeurs, qui dépend de la taille du registre (8, 16, 32 ou 64 bits) : sur 8 bits, -42 s'écrit 11010110 (0xD6). Les nombres à virgule ne sont pas pris en charge, l'outil traite uniquement des entiers.",
                },
                {
                  question: "Quelle est la valeur maximale supportée ?",
                  answer:
                    "Il n'y a pas de limite pratique : l'outil calcule avec des entiers de précision arbitraire (BigInt), sans l'arrondi du type Number de JavaScript au-delà de 2^53. Vous pouvez convertir exactement des valeurs 64 bits (18446744073709551615 = 0xFFFFFFFFFFFFFFFF), des clés ou des hash de plusieurs centaines de chiffres.",
                },
                {
                  question: "Comment lire un nombre hexadécimal ?",
                  answer:
                    "Chaque chiffre hexa représente une puissance de 16. 0x2A = 2*16 + 10 = 42. Les lettres A-F valent 10-15. C'est la même logique que le décimal mais en base 16. Avec un peu de pratique, lire de l'hexa devient aussi naturel que lire du décimal.",
                },
                {
                  question: "Mes saisies sont-elles confidentielles ?",
                  answer:
                    "Oui. Toutes les conversions sont effectuées localement dans votre navigateur via JavaScript natif. Aucune valeur saisie ou convertie n'est envoyée à un serveur ou stockée. Une fois la page chargée, les conversions fonctionnent même sans connexion.",
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
