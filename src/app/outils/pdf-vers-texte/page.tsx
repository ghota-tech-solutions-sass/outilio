"use client";

import { useState, useCallback, useRef } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import { PDFDocument } from "pdf-lib";

interface PDFInfo {
  name: string;
  size: number;
  pageCount: number;
  title: string | undefined;
  author: string | undefined;
  subject: string | undefined;
  creator: string | undefined;
  producer: string | undefined;
  creationDate: Date | undefined;
  modificationDate: Date | undefined;
  pagesSizes: { width: number; height: number }[];
  bytes: Uint8Array;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
}

function formatDate(d: Date | undefined): string {
  if (!d) return "Non disponible";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PdfVersTexte() {
  const [info, setInfo] = useState<PDFInfo | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadPdf = useCallback(async (file: File) => {
    setError("");
    setInfo(null);
    if (file.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptes.");
      return;
    }
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = doc.getPages();
      setInfo({
        name: file.name,
        size: file.size,
        pageCount: doc.getPageCount(),
        title: doc.getTitle(),
        author: doc.getAuthor(),
        subject: doc.getSubject(),
        creator: doc.getCreator(),
        producer: doc.getProducer(),
        creationDate: doc.getCreationDate(),
        modificationDate: doc.getModificationDate(),
        pagesSizes: pages.map((p) => ({ width: Math.round(p.getWidth()), height: Math.round(p.getHeight()) })),
        bytes,
      });
    } catch {
      setError("Impossible de lire ce fichier PDF. Il est peut-etre corrompu ou protege.");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) loadPdf(file);
    },
    [loadPdf]
  );

  const downloadPage = async (pageIndex: number) => {
    if (!info) return;
    setExtracting(true);
    try {
      const srcDoc = await PDFDocument.load(info.bytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(srcDoc, [pageIndex]);
      newDoc.addPage(copiedPage);
      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${info.name.replace(".pdf", "")}_page_${pageIndex + 1}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Erreur lors de l'extraction de la page.");
    }
    setExtracting(false);
  };

  const downloadPageRange = async (start: number, end: number) => {
    if (!info) return;
    setExtracting(true);
    try {
      const srcDoc = await PDFDocument.load(info.bytes, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();
      const indices = [];
      for (let i = start; i <= end; i++) indices.push(i);
      const copiedPages = await newDoc.copyPages(srcDoc, indices);
      copiedPages.forEach((p) => newDoc.addPage(p));
      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${info.name.replace(".pdf", "")}_pages_${start + 1}-${end + 1}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Erreur lors de l'extraction des pages.");
    }
    setExtracting(false);
  };

  const copyMetadata = () => {
    if (!info) return;
    const lines = [
      `Fichier : ${info.name}`,
      `Taille : ${formatSize(info.size)}`,
      `Pages : ${info.pageCount}`,
      `Titre : ${info.title || "Non disponible"}`,
      `Auteur : ${info.author || "Non disponible"}`,
      `Sujet : ${info.subject || "Non disponible"}`,
      `Createur : ${info.creator || "Non disponible"}`,
      `Producteur : ${info.producer || "Non disponible"}`,
      `Date de creation : ${formatDate(info.creationDate)}`,
      `Date de modification : ${formatDate(info.modificationDate)}`,
      "",
      "Pages :",
      ...info.pagesSizes.map((p, i) => `  Page ${i + 1} : ${p.width} x ${p.height} pts`),
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            PDF
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PDF vers <span style={{ color: "var(--primary)" }}>Texte</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Analysez vos fichiers PDF : metadonnees, nombre de pages, dimensions. Extrayez et telechargez des pages individuelles.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all"
              style={{
                borderColor: dragOver ? "var(--primary)" : "var(--border)",
                background: dragOver ? "rgba(13,79,60,0.04)" : "var(--surface)",
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && loadPdf(e.target.files[0])}
              />
              <p className="text-4xl">&#128196;</p>
              <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Glissez un fichier PDF ici
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                ou cliquez pour parcourir vos fichiers
              </p>
            </div>

            {error && (
              <div className="rounded-xl border p-4 text-sm" style={{ background: "rgba(220,38,38,0.06)", borderColor: "rgba(220,38,38,0.2)", color: "#dc2626" }}>
                {error}
              </div>
            )}

            {/* Metadata */}
            {info && (
              <>
                <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Metadonnees du PDF
                    </h2>
                    <button
                      onClick={copyMetadata}
                      className="text-xs font-semibold transition-colors hover:opacity-70"
                      style={{ color: "var(--primary)" }}
                    >
                      {copied ? "Copie !" : "Copier tout"}
                    </button>
                  </div>
                  <div className="p-5 space-y-3">
                    {[
                      { label: "Fichier", value: info.name },
                      { label: "Taille", value: formatSize(info.size) },
                      { label: "Pages", value: String(info.pageCount) },
                      { label: "Titre", value: info.title || "Non disponible" },
                      { label: "Auteur", value: info.author || "Non disponible" },
                      { label: "Sujet", value: info.subject || "Non disponible" },
                      { label: "Createur", value: info.creator || "Non disponible" },
                      { label: "Producteur", value: info.producer || "Non disponible" },
                      { label: "Date de creation", value: formatDate(info.creationDate) },
                      { label: "Date de modification", value: formatDate(info.modificationDate) },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-4">
                        <span className="text-xs font-semibold w-36 flex-shrink-0 pt-0.5" style={{ color: "var(--muted)" }}>
                          {row.label}
                        </span>
                        <span className="text-sm break-all">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pages list */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Pages ({info.pageCount})
                    </h2>
                    {info.pageCount > 1 && (
                      <button
                        onClick={() => downloadPageRange(0, info.pageCount - 1)}
                        disabled={extracting}
                        className="text-xs font-semibold transition-colors hover:opacity-70 disabled:opacity-50"
                        style={{ color: "var(--primary)" }}
                      >
                        Tout telecharger
                      </button>
                    )}
                  </div>
                  <div className="divide-y max-h-[500px] overflow-y-auto" style={{ borderColor: "var(--border)" }}>
                    {info.pagesSizes.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 px-5 py-3">
                        <span
                          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: "var(--surface-alt)", color: "var(--muted)" }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Page {i + 1}</p>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>
                            {p.width} x {p.height} pts
                            {p.width === 595 && p.height === 842 && " (A4)"}
                            {p.width === 612 && p.height === 792 && " (Letter)"}
                          </p>
                        </div>
                        <button
                          onClick={() => downloadPage(i)}
                          disabled={extracting}
                          className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:bg-[var(--surface-alt)] disabled:opacity-50"
                          style={{ borderColor: "var(--border)" }}
                        >
                          Extraire
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!info && !error && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-4xl">&#128269;</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Deposez un PDF pour l&apos;analyser
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Metadonnees, nombre de pages et extraction de pages individuelles.
                </p>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A propos de l&apos;extracteur</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Metadonnees</strong> : Titre, auteur, dates, producteur et dimensions de chaque page.</p>
                <p><strong className="text-[var(--foreground)]">Extraction de pages</strong> : Telechargez n&apos;importe quelle page comme un PDF individuel.</p>
                <p><strong className="text-[var(--foreground)]">100% local</strong> : Tout le traitement se fait dans votre navigateur. Aucun fichier n&apos;est envoye.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Fonctionnalites</h3>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Metadonnees completes</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Dimensions par page</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Extraction de pages</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Copier les metadonnees</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Traitement 100% local</span>
                </li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
