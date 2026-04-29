"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const BASES = [
  { id: "dec", label: "Decimal", base: 10, prefix: "", placeholder: "42" },
  { id: "bin", label: "Binaire", base: 2, prefix: "0b", placeholder: "101010" },
  { id: "oct", label: "Octal", base: 8, prefix: "0o", placeholder: "52" },
  { id: "hex", label: "Hexadecimal", base: 16, prefix: "0x", placeholder: "2A" },
];

function isValidForBase(value: string, base: number): boolean {
  if (!value) return true;
  const chars = "0123456789abcdef".slice(0, base);
  return value.toLowerCase().split("").every((c) => chars.includes(c));
}

export default function ConvertisseurNumeration() {
  const [source, setSource] = useState("dec");
  const [input, setInput] = useState("42");

  const sourceBase = BASES.find((b) => b.id === source)!;
  const isValid = isValidForBase(input, sourceBase.base);
  const decimalValue = isValid && input ? parseInt(input, sourceBase.base) : NaN;

  const results = BASES.map((b) => ({
    ...b,
    value: isNaN(decimalValue) ? "" : decimalValue.toString(b.base).toUpperCase(),
  }));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const BIT_TABLE = !isNaN(decimalValue) && decimalValue >= 0 && decimalValue <= 255;
  const bits = BIT_TABLE ? decimalValue.toString(2).padStart(8, "0").split("") : [];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Developpement</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur <span style={{ color: "var(--primary)" }}>Numeration</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez instantanement entre decimal, binaire, octal et hexadecimal.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex gap-2 mb-4">
                {BASES.map((b) => (
                  <button key={b.id} onClick={() => { setSource(b.id); setInput(""); }}
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
              {!isValid && <p className="mt-1 text-xs text-red-500">Caractere invalide pour la base {sourceBase.base}</p>}
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {results.map((r) => (
                <div key={r.id} className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: r.id === source ? "var(--primary)" : "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: r.id === source ? "var(--primary)" : "var(--accent)" }}>{r.label}</p>
                    {r.value && (
                      <button onClick={() => handleCopy(r.value)} className="text-xs font-medium px-2 py-1 rounded" style={{ color: "var(--primary)" }}>
                        Copier
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-3xl font-bold font-mono break-all" style={{ fontFamily: "var(--font-display)", color: r.id === source ? "var(--primary)" : "var(--foreground)" }}>
                    {r.prefix && r.value && <span style={{ color: "var(--muted)" }}>{r.prefix}</span>}
                    {r.value || "\u2014"}
                  </p>
                </div>
              ))}
            </div>

            {/* Bit table */}
            {BIT_TABLE && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Representation binaire (8 bits)</h2>
                <div className="mt-4 flex gap-1 justify-center">
                  {bits.map((bit, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>2{"\u{207B}" + "\u{2070}\u{00B9}\u{00B2}\u{00B3}\u{2074}\u{2075}\u{2076}\u{2077}"[7 - i]}</span>
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
              title="Comment utiliser le convertisseur de numeration"
              description="Quatre actions simples pour convertir n'importe quel nombre entre les bases 2, 8, 10 et 16."
              steps={[
                {
                  name: "Selectionner la base source",
                  text:
                    "Choisissez la base d'entree : decimal (base 10, chiffres 0-9), binaire (base 2, chiffres 0-1), octal (base 8, chiffres 0-7) ou hexadecimal (base 16, chiffres 0-9 et lettres A-F). Le bouton actif change l'interpretation de votre saisie.",
                },
                {
                  name: "Saisir la valeur a convertir",
                  text:
                    "Entrez votre nombre dans le champ. L'outil verifie en temps reel la validite : si vous tapez un 9 alors que la base est binaire, un message d'erreur apparait. La conversion est instantanee, aucun bouton a cliquer.",
                },
                {
                  name: "Lire les 4 resultats simultanes",
                  text:
                    "Les quatre cartes affichent l'equivalent dans chaque base. Le code prefixe (0b pour binaire, 0o pour octal, 0x pour hexa) est egalement indique, pratique pour copier-coller dans du code Python, JavaScript ou C.",
                },
                {
                  name: "Visualiser la representation 8 bits (0-255)",
                  text:
                    "Pour toute valeur decimale entre 0 et 255, une visualisation graphique sur 8 bits apparait avec les puissances de 2. Pratique pour comprendre les operations bit a bit (AND, OR, XOR, shifts) et pour les exercices d'electronique numerique.",
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
                    Etudiant en informatique
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Verifier ses exercices d&apos;architecture des ordinateurs : conversion
                    decimal-binaire, addition binaire avec retenue, complement a 2 pour les
                    nombres negatifs sur 8 bits. Outil de revision avant un partiel ou un examen
                    de DUT/BUT informatique.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Developpeur back-end et systeme
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Decoder les permissions Unix (chmod 755 = rwxr-xr-x = 111 101 101 en binaire),
                    interpreter les codes de retour HTTP en hexa, debugger des messages systeme
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
                    decimales (255, 87, 51). Comprendre les codes alpha sur 8 bits pour la
                    transparence (CC = 80 % d&apos;opacite). Utile pour les degrades et
                    l&apos;accessibilite contraste.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Electronicien et maker
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Programmer un microcontroleur Arduino ou ESP32 : configurer un registre via un
                    masque binaire, lire l&apos;etat de capteurs sur des bits specifiques, encoder
                    des commandes I2C ou SPI en hexa. Indispensable en domotique et embarque.
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
                A savoir sur les bases de numeration
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Pourquoi 4 bases et pas une seule ?</strong> Le decimal est intuitif pour
                  les humains (10 doigts). Le binaire est natif aux circuits (deux etats : 0 ou 1).
                  L&apos;octal et l&apos;hexa sont des compactages du binaire : 1 chiffre octal = 3
                  bits, 1 chiffre hexa = 4 bits. Plus court a lire et ecrire pour un developpeur.
                </p>
                <p>
                  <strong>Notation prefixee.</strong> Pour eviter l&apos;ambiguite, les langages de
                  programmation utilisent des prefixes : 0b101010 (binaire), 0o52 (octal), 0x2A
                  (hexa), 42 (decimal par defaut). Sans prefixe, 10 peut signifier dix, deux, huit
                  ou seize selon la base. Toujours preciser dans les contextes mixtes.
                </p>
                <p>
                  <strong>Octal et permissions Unix.</strong> chmod 755 utilise l&apos;octal car 3
                  bits = 1 chiffre octal, et les permissions Unix sont groupees par 3 bits (read,
                  write, execute) pour 3 entites (owner, group, other). Donc 755 = 111 101 101 =
                  rwxr-xr-x. Logique d&apos;origine historique mais tres efficace.
                </p>
                <p>
                  <strong>Limites du 8 bits non signe.</strong> Sur 8 bits non signe, on represente
                  0 a 255 (2^8 = 256 valeurs). Sur 8 bits signe en complement a 2, on represente
                  -128 a +127. La visualisation 8 bits de l&apos;outil correspond au mode non
                  signe. Au-dela de 255, passez en 16, 32 ou 64 bits.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Reponses aux questions frequentes sur la conversion entre bases numeriques."
              items={[
                {
                  question: "Pourquoi le binaire est-il utilise en informatique ?",
                  answer:
                    "Les ordinateurs fonctionnent avec des circuits electriques qui ne connaissent que deux etats : allume (1) et eteint (0). Le systeme binaire (base 2) correspond directement a ces deux etats. Chaque chiffre binaire s'appelle un bit et 8 bits forment un octet (byte).",
                },
                {
                  question: "A quoi sert l'hexadecimal en developpement web ?",
                  answer:
                    "L'hexadecimal est omnipresent : les couleurs CSS (#FF5733), les adresses memoire, les codes Unicode et les hash de commits Git utilisent cette notation. Sa compacite (2 chiffres hexa = 1 octet) le rend beaucoup plus lisible que le binaire pour les humains.",
                },
                {
                  question: "Comment convertir manuellement du decimal en binaire ?",
                  answer:
                    "Divisez le nombre par 2 de maniere repetee et notez le reste a chaque etape. Lisez ensuite les restes de bas en haut. Pour 42 : 42/2=21 r0, 21/2=10 r1, 10/2=5 r0, 5/2=2 r1, 2/2=1 r0, 1/2=0 r1 soit 101010 en binaire.",
                },
                {
                  question: "L'outil gere-t-il les nombres negatifs ?",
                  answer:
                    "Non, uniquement les entiers positifs. Pour representer les nombres negatifs en binaire, il faut le complement a 2 (sur 8, 16, 32 ou 64 bits). Les decimales sont egalement non supportees, l'outil traite uniquement des entiers naturels.",
                },
                {
                  question: "Quelle est la valeur maximale supportee ?",
                  answer:
                    "La limite est celle du type Number en JavaScript : 2^53 - 1 (environ 9 quadrillions). Au-dela, la precision se degrade. En pratique, l'outil gere sans probleme tous les nombres jusqu'a 32 bits (4 milliards) couramment manipules en developpement.",
                },
                {
                  question: "Comment lire un nombre hexadecimal ?",
                  answer:
                    "Chaque chiffre hexa represente une puissance de 16. 0x2A = 2*16 + 10 = 42. Les lettres A-F valent 10-15. C'est la meme logique que le decimal mais en base 16. Avec un peu de pratique, lire de l'hexa devient aussi naturel que lire du decimal.",
                },
                {
                  question: "Mes saisies sont-elles confidentielles ?",
                  answer:
                    "Oui. Toutes les conversions sont effectuees localement dans votre navigateur via JavaScript natif. Aucune valeur saisie ou convertie n'est envoyee a un serveur ou stockee. L'outil fonctionne meme hors ligne une fois la page chargee.",
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
