"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

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
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Dev</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Encodeur <span style={{ color: "var(--primary)" }}>Base64</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Encodez du texte en Base64 ou decodez du Base64 en texte. Copie en un clic.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
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

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A propos de Base64</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Qu&apos;est-ce que Base64 ?</strong> C&apos;est un encodage qui convertit des donnees binaires en texte ASCII. Chaque 3 octets deviennent 4 caracteres ASCII.</p>
                <p><strong className="text-[var(--foreground)]">Utilisations</strong> : Emails (MIME), images inline en CSS/HTML (data:URI), tokens JWT, APIs REST.</p>
                <p><strong className="text-[var(--foreground)]">Attention</strong> : Base64 n&apos;est pas un chiffrement. C&apos;est un encodage reversible, il ne protege pas les donnees.</p>
              </div>
            </div>
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
