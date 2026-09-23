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
    if (mode === "encode") {
      // UTF-8 first: btoa() alone only accepts Latin-1 characters
      const utf8Bytes = new TextEncoder().encode(input);
      let binary = "";
      utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
      setOutput(btoa(binary));
      return;
    }
    // Accepts standard Base64 and Base64URL (JWT: - and _ instead of + and /),
    // with or without padding, spaces and line breaks.
    let b64 = input.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
    if (b64.length % 4 === 1 || /[^A-Za-z0-9+/=]/.test(b64)) {
      setError("Texte Base64 invalide. Vérifiez le format (caractères autorisés : A-Z, a-z, 0-9, +, /, -, _ et = en fin de chaîne).");
      setOutput("");
      return;
    }
    b64 = b64.replace(/=+$/, "");
    b64 += "=".repeat((4 - (b64.length % 4)) % 4);
    let binary: string;
    try {
      binary = atob(b64);
    } catch {
      setError("Texte Base64 invalide. Vérifiez le format.");
      setOutput("");
      return;
    }
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    try {
      setOutput(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    } catch {
      setError(`Base64 valide (${bytes.length} octets), mais le contenu n'est pas du texte UTF-8 : il s'agit probablement d'un fichier binaire (image, PDF, clé…) qui ne peut pas être affiché comme texte.`);
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
            Encodez du texte en Base64 ou décodez du Base64 en texte. Copie en un clic. Base64URL (JWT) accepté au décodage.
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
                  Décoder (Base64 &rarr; Texte)
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                {mode === "encode" ? "Texte à encoder" : "Base64 à décoder"}
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
                  {mode === "encode" ? "Encoder" : "Décoder"}
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
                    {mode === "encode" ? "Base64" : "Texte décodé"}
                  </h2>
                  <button onClick={copyToClipboard}
                    className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                    {copied ? "Copié !" : "Copier"}
                  </button>
                </div>
                <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                  <pre className="whitespace-pre-wrap break-all text-sm" style={{ fontFamily: "monospace", color: "var(--primary)" }}>
                    {output}
                  </pre>
                </div>
                <div className="mt-3 flex gap-4 text-xs" style={{ color: "var(--muted)" }}>
                  <span>Entrée : <strong>{input.length}</strong> car.</span>
                  <span>Sortie : <strong>{output.length}</strong> car.</span>
                  {mode === "encode" && <span>Ratio : <strong>x{(output.length / (input.length || 1)).toFixed(2)}</strong></span>}
                </div>
              </div>
            )}

            <ToolHowToSection
              title="Comment utiliser l'encodeur Base64"
              description="Quatre étapes pour encoder ou décoder n'importe quel texte en Base64 standard."
              steps={[
                {
                  name: "Choisir le mode (encoder ou décoder)",
                  text:
                    "Encoder transforme un texte lisible (avec ou sans Unicode) en chaîne Base64 prête pour un email MIME, un data URI, un token JWT ou une API. Décoder fait l'inverse : récupère le texte original à partir d'une chaîne Base64. Le bouton Inverser bascule rapidement entre les deux modes.",
                },
                {
                  name: "Coller votre contenu source",
                  text:
                    "Collez votre texte ou votre Base64 dans la zone de saisie. L'outil accepte tous les caractères Unicode (accents français, emojis, idéogrammes asiatiques) en mode encodage, et les chaînes Base64 standard ou Base64URL en mode décodage (espaces et retours à la ligne ignorés). Le caractère = en fin de chaîne Base64 sert au padding et est géré automatiquement.",
                },
                {
                  name: "Cliquer sur Encoder ou Décoder",
                  text:
                    "Le bouton lance la conversion. Le résultat s'affiche dans une zone monospace avec le ratio de taille : un encodage Base64 occupe environ 1.33 fois la taille du texte source (les 3 octets deviennent 4 caractères). Si la chaîne Base64 fournie en décodage est invalide, un message d'erreur s'affiche.",
                },
                {
                  name: "Copier le résultat",
                  text:
                    "Le bouton Copier transfère instantanément la chaîne dans le presse-papier. Vous pouvez ensuite la coller dans votre code, dans un email, dans un fichier de configuration .env ou dans un payload JSON d'API. Le résultat est compatible avec tous les décodeurs Base64 standards (RFC 4648).",
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
                    Développeur API et back-end
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Encoder un identifiant + mot de passe pour une auth Basic HTTP
                    (Authorization: Basic [base64]), insérer un payload binaire dans un JSON,
                    sérialiser un fichier en data URI dans une réponse REST. Décoder un JWT pour
                    inspecter les claims.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Développeur front-end
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Inliner une petite image en CSS via data URI : background-image: url(data:image/png;base64,...).
                    Évite une requête HTTP supplémentaire pour les icônes de moins de 4 ko. Utile
                    pour les emails HTML ou les PWAs offline-first.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    DevOps et SRE
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Encoder des secrets pour Kubernetes (les Secret manifests stockent les valeurs
                    en Base64), insérer un certificat dans un YAML, debugger une variable
                    d&apos;environnement encodée dans un container. Pratique pour Docker, Helm et
                    Terraform.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Inspecteur de tokens et debug
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Décoder rapidement la partie payload d&apos;un JWT (l&apos;en-tête et le payload, avant
                    le deuxième point, sont en Base64URL), lire le contenu d&apos;une clé SSH publique,
                    inspecter une signature numérique. Indispensable pour debugger une intégration
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
                Pièges classiques avec Base64
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Base64 n&apos;est PAS du chiffrement.</strong> C&apos;est juste un
                  encodage réversible : n&apos;importe qui peut décoder une chaîne Base64 en 1
                  seconde. Les Secrets Kubernetes sont stockés en Base64 mais ce n&apos;est pas
                  une protection, juste un format compatible YAML. Pour stocker un mot de passe,
                  utilisez un hachage (bcrypt, argon2) ; pour protéger une donnée, un chiffrement (AES).
                </p>
                <p>
                  <strong>UTF-8 vs Latin-1 : attention aux accents.</strong> Le btoa() natif de
                  JavaScript n&apos;accepte que les caractères Latin-1 (codes 0 à 255). Pour encoder du
                  français ou des emojis, il faut d&apos;abord convertir le texte en UTF-8 (TextEncoder),
                  comme le fait cet outil. Sinon, vous obtiendrez une InvalidCharacterError (emojis,
                  « œ », « € ») ou un Base64 en Latin-1 que les autres outils décoderont mal (« é »).
                </p>
                <p>
                  <strong>Base64 vs Base64URL : 2 alphabets différents.</strong> Le Base64
                  classique utilise + et / qui ont une signification dans une URL. Pour les JWT et
                  les liens, on utilise Base64URL : - remplace +, _ remplace /, et le padding = est
                  souvent omis. Au décodage, cet outil accepte les deux
                  alphabets, avec ou sans padding : vous pouvez coller directement un segment de JWT.
                </p>
                <p>
                  <strong>Augmentation de taille de 33 %.</strong> Base64 transforme 3 octets en 4
                  caractères ASCII, donc augmente la taille d&apos;environ 33 %. Pour de petits
                  payloads (icônes, signatures), c&apos;est négligeable. Pour des fichiers
                  volumineux (gros assets), préférez un envoi binaire direct ou un upload
                  multipart, plus économique.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Réponses aux questions fréquentes sur l'encodage Base64."
              items={[
                {
                  question: "Base64 est-il un moyen de sécuriser des données ?",
                  answer:
                    "Non, Base64 est un encodage, pas un chiffrement. N'importe qui peut décoder du Base64 sans clé. Pour sécuriser des données, utilisez un vrai algorithme de chiffrement comme AES-256, ou un hachage salé type bcrypt pour les mots de passe.",
                },
                {
                  question: "Pourquoi la taille augmente-t-elle en Base64 ?",
                  answer:
                    "Base64 convertit 3 octets en 4 caractères ASCII, ce qui augmente la taille d'environ 33 %. C'est le prix à payer pour représenter des données binaires en texte pur, compatible avec les emails (RFC 822), les URLs (data URI) et les protocoles texte.",
                },
                {
                  question: "L'outil gère-t-il les caractères spéciaux et les accents ?",
                  answer:
                    "Oui, l'encodeur utilise l'API TextEncoder du navigateur pour convertir correctement les caractères Unicode (accents français, emojis, idéogrammes asiatiques) en UTF-8 avant l'encodage Base64. Le décodage applique l'opération inverse via TextDecoder.",
                },
                {
                  question: "Quelle est la différence entre Base64 et Base64URL ?",
                  answer:
                    "Base64 standard utilise les caractères + et / qui ont une signification dans les URLs. Base64URL remplace + par - et / par _, et omet souvent le padding =. Cet outil encode en Base64 standard (RFC 4648), compatible avec la plupart des cas d'usage, et décode indifféremment les deux variantes.",
                },
                {
                  question: "Puis-je encoder une image en Base64 ?",
                  answer:
                    "Pas directement avec cet outil texte, mais le concept est le même : convertir les octets binaires de l'image en chaîne Base64. Pour une image, utilisez un outil dédié ou, en JavaScript, FileReader.readAsDataURL() qui renvoie directement un data URI en Base64. Utile pour les data URIs CSS ou HTML.",
                },
                {
                  question: "Comment fonctionne le padding (caractères =) ?",
                  answer:
                    "Si le nombre d'octets en entrée n'est pas multiple de 3, on ajoute des = en fin de Base64 pour compléter un bloc de 4 caractères. 0 à 2 caractères = sont possibles. Certaines implémentations (Base64URL) omettent le padding : cet outil l'inclut à l'encodage, conformément à la RFC 4648, et le reconstitue au décodage s'il manque.",
                },
                {
                  question: "Mes données encodées sont-elles confidentielles ?",
                  answer:
                    "Oui. L'encodage et le décodage sont effectués 100 % localement dans votre navigateur via les APIs btoa, atob, TextEncoder et TextDecoder. Aucune chaîne n'est envoyée à un serveur ou stockée. Vous pouvez encoder des credentials de développement sans risque.",
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
                <li>64 caractères + &quot;=&quot; pour le padding</li>
                <li>3 octets &rarr; 4 caractères</li>
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
