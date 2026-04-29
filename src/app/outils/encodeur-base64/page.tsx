"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

export default function EncodeurBase64() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError("");
    try {
      if (mode === "encode") {
        // Handle Unicode properly
        const utf8Bytes = new TextEncoder().encode(input);
        let binary = "";
        utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
        setOutput(btoa(binary));
      } else {
        const binary = atob(input.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch {
      setError(mode === "decode" ? "Texte Base64 invalide. Verifiez le format." : "Erreur lors de l'encodage.");
      setOutput("");
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const swapInputOutput = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    setOutput("");
    setError("");
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Encodeur <span style={{ color: "var(--primary)" }}>Base64</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Encodez du texte en Base64 ou decodez du Base64 en texte. Copie en un clic.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Mode</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
                  className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    borderColor: mode === "encode" ? "var(--primary)" : "var(--border)",
                    background: mode === "encode" ? "var(--primary)" : "transparent",
                    color: mode === "encode" ? "#fff" : "inherit",
                  }}>
                  Encoder (Texte &rarr; Base64)
                </button>
                <button onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
                  className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    borderColor: mode === "decode" ? "var(--primary)" : "var(--border)",
                    background: mode === "decode" ? "var(--primary)" : "transparent",
                    color: mode === "decode" ? "#fff" : "inherit",
                  }}>
                  Decoder (Base64 &rarr; Texte)
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                {mode === "encode" ? "Texte a encoder" : "Base64 a decoder"}
              </h2>
              <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setOutput(""); setError(""); }}
                rows={6}
                className="mt-4 w-full rounded-xl border px-4 py-3 text-sm"
                style={{ borderColor: "var(--border)", fontFamily: "monospace", resize: "vertical" }}
                placeholder={mode === "encode" ? "Collez votre texte ici..." : "Collez votre texte Base64 ici..."}
              />
              <div className="mt-3 flex gap-3">
                <button onClick={handleConvert}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "var(--primary)" }}>
                  {mode === "encode" ? "Encoder" : "Decoder"}
                </button>
                <button onClick={swapInputOutput}
                  className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                  style={{ borderColor: "var(--border)" }}>
                  &#8693; Inverser
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border p-4" style={{ background: "#fef2f2", borderColor: "#fca5a5" }}>
                <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>{error}</p>
              </div>
            )}

            {/* Output */}
            {output && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                    {mode === "encode" ? "Base64" : "Texte decode"}
                  </h2>
                  <button onClick={copyToClipboard}
                    className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                    {copied ? "Copie !" : "Copier"}
                  </button>
                </div>
                <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <pre className="whitespace-pre-wrap break-all text-sm" style={{ fontFamily: "monospace", color: "var(--primary)" }}>
                    {output}
                  </pre>
                </div>
                <div className="mt-3 flex gap-4 text-xs" style={{ color: "var(--muted)" }}>
                  <span>Entree : <strong>{input.length}</strong> car.</span>
                  <span>Sortie : <strong>{output.length}</strong> car.</span>
                  {mode === "encode" && <span>Ratio : <strong>x{(output.length / (input.length || 1)).toFixed(2)}</strong></span>}
                </div>
              </div>
            )}

            <ToolHowToSection
              title="Comment utiliser l'encodeur Base64"
              description="Quatre etapes pour encoder ou decoder n'importe quel texte en Base64 standard."
              steps={[
                {
                  name: "Choisir le mode (encoder ou decoder)",
                  text:
                    "Encoder transforme un texte lisible (avec ou sans Unicode) en chaine Base64 prete pour un email MIME, un data URI, un token JWT ou une API. Decoder fait l'inverse : recupere le texte original a partir d'une chaine Base64. Le bouton Inverser bascule rapidement entre les deux modes.",
                },
                {
                  name: "Coller votre contenu source",
                  text:
                    "Collez votre texte ou votre Base64 dans la zone de saisie. L'outil accepte tous les caracteres Unicode (accents francais, emojis, ideogrammes asiatiques) en mode encodage et les chaines Base64 standard en mode decodage. Le caractere = en fin de chaine Base64 sert au padding et est gere automatiquement.",
                },
                {
                  name: "Cliquer sur Encoder ou Decoder",
                  text:
                    "Le bouton lance la conversion. Le resultat s'affiche dans une zone monospace avec le ratio de taille : un encodage Base64 occupe environ 1.33 fois la taille du texte source (les 3 octets deviennent 4 caracteres). Si la chaine Base64 fournie en decodage est invalide, un message d'erreur s'affiche.",
                },
                {
                  name: "Copier le resultat",
                  text:
                    "Le bouton Copier transfere instantanement la chaine dans le presse-papier. Vous pouvez ensuite la coller dans votre code, dans un email, dans un fichier de configuration .env ou dans un payload JSON d'API. Le resultat est compatible avec tous les decodeurs Base64 standards (RFC 4648).",
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
                Cas d&apos;usage de l&apos;encodage Base64
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Developpeur API et back-end
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Encoder un identifiant + mot de passe pour une auth Basic HTTP
                    (Authorization: Basic [base64]), inserer un payload binaire dans un JSON,
                    serialiser un fichier en data URI dans une reponse REST. Decoder un JWT pour
                    inspecter les claims.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Developpeur front-end
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Inliner une petite image en CSS via data URI : background-image: url(data:image/png;base64,...).
                    Evite une requete HTTP supplementaire pour les icones de moins de 4 ko. Utile
                    pour les emails HTML ou les PWAs offline-first.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    DevOps et SRE
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Encoder des secrets pour Kubernetes (les Secret manifests stockent les valeurs
                    en Base64), inserer un certificat dans un YAML, debugger une variable
                    d&apos;environnement encodee dans un container. Pratique pour Docker, Helm et
                    Terraform.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Inspecteur de tokens et debug
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Decoder rapidement la partie payload d&apos;un JWT (les 3 segments separes par
                    des points sont en Base64URL), lire le contenu d&apos;une cle SSH publique,
                    inspecter une signature numerique. Indispensable pour debugger une integration
                    OAuth ou OpenID.
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
                Pieges classiques avec Base64
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Base64 n&apos;est PAS du chiffrement.</strong> C&apos;est juste un
                  encodage reversible : n&apos;importe qui peut decoder une chaine Base64 en 1
                  seconde. Les Secrets Kubernetes sont stockes en Base64 mais ce n&apos;est pas
                  une protection, juste un format compatible YAML. Pour proteger un mot de passe,
                  utilisez bcrypt, argon2 ou chiffrement AES.
                </p>
                <p>
                  <strong>UTF-8 vs ASCII : attention aux accents.</strong> Le btoa() natif de
                  JavaScript ne gere que l&apos;ASCII (0-127). Pour encoder du francais ou des
                  emojis, il faut d&apos;abord convertir le texte en UTF-8 (TextEncoder), comme le
                  fait cet outil. Sinon, vous obtiendrez InvalidCharacterError ou un Base64
                  corrompu.
                </p>
                <p>
                  <strong>Base64 vs Base64URL : 2 alphabets differents.</strong> Le Base64
                  classique utilise + et / qui ont une signification dans une URL. Pour les JWT et
                  les liens, on utilise Base64URL : - remplace +, _ remplace /, et le padding = est
                  souvent omis. Convertir l&apos;un en l&apos;autre necessite une etape de
                  transformation.
                </p>
                <p>
                  <strong>Augmentation de taille de 33 %.</strong> Base64 transforme 3 octets en 4
                  caracteres ASCII, donc augmente la taille d&apos;environ 33 %. Pour de petits
                  payloads (icones, signatures), c&apos;est negligeable. Pour des fichiers
                  volumineux (gros assets), preferez un envoi binaire direct ou un upload
                  multipart, plus economique.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Reponses aux questions frequentes sur l'encodage Base64."
              items={[
                {
                  question: "Base64 est-il un moyen de securiser des donnees ?",
                  answer:
                    "Non, Base64 est un encodage, pas un chiffrement. N'importe qui peut decoder du Base64 sans cle. Pour securiser des donnees, utilisez un vrai algorithme de chiffrement comme AES-256, ou un hash sale type bcrypt pour les mots de passe.",
                },
                {
                  question: "Pourquoi la taille augmente-t-elle en Base64 ?",
                  answer:
                    "Base64 convertit 3 octets en 4 caracteres ASCII, ce qui augmente la taille d'environ 33 %. C'est le prix a payer pour representer des donnees binaires en texte pur, compatible avec les emails (RFC 822), les URLs (data URI) et les protocoles texte.",
                },
                {
                  question: "L'outil gere-t-il les caracteres speciaux et les accents ?",
                  answer:
                    "Oui, l'encodeur utilise l'API TextEncoder du navigateur pour convertir correctement les caracteres Unicode (accents francais, emojis, ideogrammes asiatiques) en UTF-8 avant l'encodage Base64. Le decodage applique l'operation inverse via TextDecoder.",
                },
                {
                  question: "Quelle est la difference entre Base64 et Base64URL ?",
                  answer:
                    "Base64 standard utilise les caracteres + et / qui ont une signification dans les URLs. Base64URL remplace + par - et / par _, et omet souvent le padding =. Cet outil utilise Base64 standard (RFC 4648), compatible avec la plupart des cas d'usage.",
                },
                {
                  question: "Puis-je encoder une image en Base64 ?",
                  answer:
                    "Pas directement avec cet outil texte, mais le concept est le meme : convertir les octets binaires de l'image en chaine Base64. Pour une image, utilisez un outil dedie ou la console DevTools : btoa(reader.result) apres lecture FileReader. Utile pour les data URIs CSS ou HTML.",
                },
                {
                  question: "Comment fonctionne le padding (caracteres =) ?",
                  answer:
                    "Si le nombre d'octets en entree n'est pas multiple de 3, on ajoute des = en fin de Base64 pour completer un bloc de 4 caracteres. 0 a 2 caracteres = sont possibles. Certaines implementations (Base64URL) omettent le padding, mais cet outil l'inclut conformement a la RFC 4648.",
                },
                {
                  question: "Mes donnees encodees sont-elles confidentielles ?",
                  answer:
                    "Oui. L'encodage et le decodage sont effectues 100 % localement dans votre navigateur via les APIs btoa, atob, TextEncoder et TextDecoder. Aucune chaine n'est envoyee a un serveur ou stockee. Vous pouvez encoder des credentials de developpement sans risque.",
                },
              ]}
            />
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Alphabet Base64</h3>
              <div className="mt-3 rounded-xl p-3" style={{ background: "var(--surface-alt)" }}>
                <code className="text-[10px] leading-relaxed break-all" style={{ fontFamily: "monospace", color: "var(--primary)" }}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
                </code>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>64 caracteres + &quot;=&quot; pour le padding</li>
                <li>3 octets &rarr; 4 caracteres</li>
                <li>Augmente la taille de ~33%</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
