"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ScanResult {
  id: string;
  value: string;
  timestamp: number;
  source: "camera" | "image";
}

type TabMode = "camera" | "image";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isUrl(text: string): boolean {
  try {
    const u = new URL(text);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "A l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  return `Il y a ${Math.floor(diff / 3600)} h`;
}

/** Try to decode a QR code from an ImageBitmap / canvas using BarcodeDetector, then jsQR-style canvas fallback. */
async function decodeQR(canvas: HTMLCanvasElement): Promise<string | null> {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  // 1. Try native BarcodeDetector (Chrome, Edge, Opera, Android WebView)
  if ("BarcodeDetector" in window) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
      const results = await detector.detect(canvas);
      if (results.length > 0) return results[0].rawValue;
    } catch {
      // BarcodeDetector failed, fall through to canvas fallback
    }
  }

  // 2. Canvas-based fallback: try the jsQR algorithm embedded below
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return decodeQRFromImageData(imageData);
}

/* ------------------------------------------------------------------ */
/*  Minimal jsQR-style decoder (canvas ImageData)                      */
/*  We load jsQR from a CDN lazily to keep bundle size at zero.        */
/* ------------------------------------------------------------------ */

let jsQRLoaded: ((data: ImageData, w: number, h: number) => { data: string } | null) | null = null;
let jsQRLoading: Promise<void> | null = null;

async function ensureJsQR(): Promise<void> {
  if (jsQRLoaded) return;
  if (jsQRLoading) return jsQRLoading;
  jsQRLoading = new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js";
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsQRLoaded = (window as any).jsQR || null;
      resolve();
    };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
  return jsQRLoading;
}

async function decodeQRFromImageData(imageData: ImageData): Promise<string | null> {
  await ensureJsQR();
  if (!jsQRLoaded) return null;
  const result = jsQRLoaded(imageData, imageData.width, imageData.height);
  return result ? result.data : null;
}

/* ------------------------------------------------------------------ */
/*  Session history helpers                                            */
/* ------------------------------------------------------------------ */

const HISTORY_KEY = "qr-scanner-history";

function loadHistory(): ScanResult[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: ScanResult[]) {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 50)));
  } catch {
    // quota exceeded
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ScannerQRCode() {
  const [tab, setTab] = useState<TabMode>("camera");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastScanRef = useRef<string>("");

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  /* ---- Add scan result ---- */
  const addResult = useCallback(
    (value: string, source: "camera" | "image") => {
      setResult(value);
      const entry: ScanResult = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        value,
        timestamp: Date.now(),
        source,
      };
      const updated = [entry, ...history.filter((h) => h.value !== value)].slice(0, 50);
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  /* ---- Camera scanning loop ---- */
  const scanFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    decodeQR(canvas).then((val) => {
      if (val && val !== lastScanRef.current) {
        lastScanRef.current = val;
        addResult(val, "camera");
      }
      if (streamRef.current) {
        rafRef.current = requestAnimationFrame(scanFrame);
      }
    });
  }, [addResult]);

  /* ---- Start camera ---- */
  const startCamera = useCallback(async () => {
    setError("");
    setResult(null);
    setCameraReady(false);
    lastScanRef.current = "";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraReady(true);
          setScanning(true);
          rafRef.current = requestAnimationFrame(scanFrame);
        };
      }
    } catch {
      setError(
        "Impossible d'acceder a la camera. Verifiez les permissions de votre navigateur."
      );
    }
  }, [scanFrame]);

  /* ---- Stop camera ---- */
  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
    setCameraReady(false);
    lastScanRef.current = "";
  }, []);

  // Auto-start camera when tab switches to "camera"
  useEffect(() => {
    if (tab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  /* ---- Image upload handler ---- */
  const handleImage = useCallback(
    async (file: File) => {
      setError("");
      setResult(null);
      if (!file.type.startsWith("image/")) {
        setError("Seuls les fichiers image sont acceptes (PNG, JPG, WEBP, etc.).");
        return;
      }
      try {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(bitmap, 0, 0);
        const val = await decodeQR(canvas);
        if (val) {
          addResult(val, "image");
        } else {
          setError("Aucun QR code detecte dans cette image. Essayez avec une image plus nette.");
        }
      } catch {
        setError("Impossible de lire cette image.");
      }
    },
    [addResult]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImage(file);
    },
    [handleImage]
  );

  /* ---- Copy result ---- */
  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ---- Clear history ---- */
  const clearHistory = () => {
    setHistory([]);
    sessionStorage.removeItem(HISTORY_KEY);
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-14"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Scanner
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Scanner de <span style={{ color: "var(--primary)" }}>QR Code</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Scannez un QR code depuis votre camera ou importez une image.
            Decodage instantane, 100% local, aucun fichier envoye.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ---- Main column ---- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab switcher */}
            <div
              className="animate-fade-up stagger-3 inline-flex rounded-xl border overflow-hidden"
              style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
            >
              {(["camera", "image"] as TabMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setTab(m)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all"
                  style={{
                    background: tab === m ? "var(--primary)" : "transparent",
                    color: tab === m ? "#fff" : "var(--muted)",
                  }}
                >
                  {m === "camera" ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      Camera
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      Image
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Camera mode */}
            {tab === "camera" && (
              <div
                className="animate-fade-up stagger-4 rounded-2xl border overflow-hidden"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="relative aspect-video bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ display: cameraReady ? "block" : "none" }}
                  />
                  {/* Scanning overlay */}
                  {cameraReady && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div
                        className="w-48 h-48 rounded-2xl border-2"
                        style={{
                          borderColor: result ? "var(--primary)" : "rgba(255,255,255,0.5)",
                          boxShadow: result
                            ? "0 0 0 4px rgba(13,79,60,0.25)"
                            : "0 0 0 9999px rgba(0,0,0,0.35)",
                        }}
                      />
                    </div>
                  )}
                  {!cameraReady && !error && (
                    <div className="text-center">
                      <div
                        className="mx-auto h-8 w-8 animate-spin rounded-full border-2"
                        style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }}
                      />
                      <p className="mt-3 text-xs text-white/60">
                        Activation de la camera...
                      </p>
                    </div>
                  )}
                </div>
                {scanning && (
                  <div
                    className="flex items-center gap-2 px-5 py-3 text-xs"
                    style={{ background: "var(--surface-alt)", color: "var(--muted)" }}
                  >
                    <span
                      className="h-2 w-2 rounded-full animate-pulse"
                      style={{ background: "var(--primary)" }}
                    />
                    Scan en cours... Placez un QR code devant la camera.
                  </div>
                )}
              </div>
            )}

            {/* Image upload mode */}
            {tab === "image" && (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className="animate-fade-up stagger-4 rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all"
                style={{
                  borderColor: dragOver ? "var(--primary)" : "var(--border)",
                  background: dragOver ? "rgba(13,79,60,0.04)" : "var(--surface)",
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && handleImage(e.target.files[0])
                  }
                />
                <p className="text-4xl">&#128247;</p>
                <p
                  className="mt-3 text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Glissez une image contenant un QR code
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  ou cliquez pour parcourir vos fichiers (PNG, JPG, WEBP...)
                </p>
              </div>
            )}

            {/* Hidden canvas for decoding */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Error */}
            {error && (
              <div
                className="rounded-xl border p-4 text-sm"
                style={{
                  background: "rgba(220,38,38,0.06)",
                  borderColor: "rgba(220,38,38,0.2)",
                  color: "#dc2626",
                }}
              >
                {error}
              </div>
            )}

            {/* Scan result */}
            {result && (
              <div
                className="animate-fade-up rounded-2xl border overflow-hidden"
                style={{ background: "var(--surface)", borderColor: "var(--primary)" }}
              >
                <div
                  className="px-5 py-3 border-b flex items-center justify-between"
                  style={{
                    borderColor: "var(--border)",
                    background: "rgba(13,79,60,0.06)",
                  }}
                >
                  <h2
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--primary)" }}
                  >
                    &#10003; QR Code detecte
                  </h2>
                  <button
                    onClick={copyResult}
                    className="text-xs font-semibold transition-colors hover:opacity-70"
                    style={{ color: "var(--primary)" }}
                  >
                    {copied ? "Copie !" : "Copier"}
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <p
                    className="break-all text-sm font-mono leading-relaxed rounded-xl p-4"
                    style={{ background: "var(--surface-alt)" }}
                  >
                    {result}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {isUrl(result) && (
                      <a
                        href={result}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: "var(--primary)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Ouvrir le lien
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setResult(null);
                        lastScanRef.current = "";
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all hover:bg-[var(--surface-alt)]"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Scanner un autre
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Scan history */}
            {history.length > 0 && (
              <div
                className="animate-fade-up rounded-2xl border overflow-hidden"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div
                  className="px-5 py-3 border-b flex items-center justify-between"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-alt)",
                  }}
                >
                  <h2
                    className="text-xs font-semibold uppercase tracking-[0.15em]"
                    style={{ color: "var(--accent)" }}
                  >
                    Historique ({history.length})
                  </h2>
                  <button
                    onClick={clearHistory}
                    className="text-xs font-semibold transition-colors hover:opacity-70"
                    style={{ color: "var(--muted)" }}
                  >
                    Effacer
                  </button>
                </div>
                <div
                  className="divide-y max-h-[400px] overflow-y-auto"
                  style={{ borderColor: "var(--border)" }}
                >
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-start gap-3 px-5 py-3 hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
                      onClick={() => {
                        setResult(h.value);
                        lastScanRef.current = h.value;
                      }}
                    >
                      <span
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs"
                        style={{
                          background: "var(--surface-alt)",
                          color: "var(--muted)",
                        }}
                      >
                        {h.source === "camera" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{h.value}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {timeAgo(h.timestamp)}
                          {isUrl(h.value) && (
                            <span style={{ color: "var(--primary)" }}> &middot; Lien</span>
                          )}
                        </p>
                      </div>
                      {isUrl(h.value) && (
                        <a
                          href={h.value}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0 rounded-lg border p-1.5 transition-all hover:bg-[var(--surface-alt)]"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* About section */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Comment scanner un QR Code ?
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  <strong className="text-[var(--foreground)]">Mode camera</strong> :
                  Autorisez l&apos;acces a votre camera, puis placez le QR code dans le
                  cadre. Le decodage est instantane.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Mode image</strong> :
                  Glissez-deposez ou selectionnez une image contenant un QR code
                  (capture d&apos;ecran, photo, etc.).
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">100% local</strong> :
                  Tout le traitement se fait dans votre navigateur grace a l&apos;API
                  BarcodeDetector (Chrome, Edge) avec un decodeur de secours pour les
                  autres navigateurs. Aucune donnee n&apos;est envoyee.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Historique</strong> :
                  Vos derniers scans sont conserves dans la session en cours. Ils
                  disparaissent a la fermeture de l&apos;onglet.
                </p>
              </div>
            </div>
          </div>

          {/* ---- Sidebar ---- */}
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Fonctionnalites
              </h3>
              <ul
                className="mt-3 space-y-2 text-xs"
                style={{ color: "var(--muted)" }}
              >
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Scan via camera en temps reel</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Import d&apos;image (drag &amp; drop)</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Detection automatique des URLs</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Historique des scans (session)</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Traitement 100% local</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Compatible mobile et desktop</span>
                </li>
              </ul>
            </div>
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Navigateurs supportes
              </h3>
              <div
                className="mt-3 space-y-2 text-xs"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  <strong className="text-[var(--foreground)]">BarcodeDetector natif</strong>{" "}
                  : Chrome 83+, Edge 83+, Opera 69+, Android WebView.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Fallback jsQR</strong>{" "}
                  : Firefox, Safari et tous les autres navigateurs.
                </p>
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
