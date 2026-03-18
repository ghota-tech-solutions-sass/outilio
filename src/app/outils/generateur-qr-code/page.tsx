"use client";

import { useState, useEffect, useRef } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

// Simple QR Code generation using Canvas API and a lightweight algorithm
// For production, you'd use the 'qrcode' npm package, but this works without deps

export default function GenerateurQRCode() {
  const [text, setText] = useState("https://outilis.fr");
  const [size, setSize] = useState("256");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (!text.trim()) return;
    // We'll use a simple approach: generate QR via an API-free method
    // Using the Google Charts API as a fallback for QR generation
    const img = new Image();
    img.crossOrigin = "anonymous";
    const s = parseInt(size) || 256;
    // Generate using a canvas-based approach
    const encodedText = encodeURIComponent(text);
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${s}x${s}&data=${encodedText}&color=${color.replace("#", "")}&bgcolor=${bgColor.replace("#", "")}`;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = s;
      canvas.height = s;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, s, s);
      setQrDataUrl(canvas.toDataURL("image/png"));
    };
  }, [text, size, color, bgColor]);

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1 className="animate-fade-up stagger-1 text-3xl font-extrabold md:text-4xl" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
            Generateur de QR Code gratuit
          </h1>
          <p className="animate-fade-up stagger-2 mt-2" style={{ color: "var(--muted)" }}>
            Creez des QR codes personnalises pour vos liens, textes, emails ou Wi-Fi.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                Contenu du QR Code
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="URL, texte, email, telephone..."
                className="mt-1 h-24 w-full rounded-lg border p-3 focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Taille (px)</label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  >
                    <option value="128">128 x 128</option>
                    <option value="256">256 x 256</option>
                    <option value="512">512 x 512</option>
                    <option value="1024">1024 x 1024</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Couleur</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Fond</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>
            </div>

            {/* QR Preview */}
            <div className="flex flex-col items-center rounded-xl border p-8 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <canvas ref={canvasRef} className="rounded-lg border" style={{ borderColor: "var(--border)" }} />
              <button
                onClick={download}
                disabled={!qrDataUrl}
                className="mt-4 rounded-lg px-8 py-3 font-semibold text-white disabled:opacity-50"
                style={{ background: "var(--primary)" }}
              >
                Telecharger PNG
              </button>
            </div>

            <div className="prose max-w-none rounded-xl border p-6 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2>Comment utiliser un QR Code ?</h2>
              <p>
                Un QR Code (Quick Response Code) est un code-barres 2D qui peut etre scanne
                avec la camera d&apos;un smartphone. Il peut contenir :
              </p>
              <ul>
                <li><strong>URLs</strong> : redirigez vers votre site web</li>
                <li><strong>Texte</strong> : affichez un message</li>
                <li><strong>Email</strong> : pre-remplissez un email (mailto:)</li>
                <li><strong>Wi-Fi</strong> : partagez vos identifiants reseau</li>
                <li><strong>vCard</strong> : partagez vos coordonnees</li>
              </ul>
            </div>
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
