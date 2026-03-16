"use client";

import { useState, useCallback, useRef } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import { PDFDocument } from "pdf-lib";

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  bytes: Uint8Array;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " o";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
  return (bytes / (1024 * 1024)).toFixed(2) + " Mo";
}

export default function FusionneurPdf() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    setError("");
    const newFiles: PDFFile[] = [];
    for (const file of Array.from(fileList)) {
      if (file.type !== "application/pdf") {
        setError("Seuls les fichiers PDF sont acceptes.");
        continue;
      }
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        newFiles.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          pageCount: doc.getPageCount(),
          bytes,
        });
      } catch {
        setError(`Impossible de lire "${file.name}". Fichier PDF invalide ou corrompu.`);
      }
    }
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (from: number, to: number) => {
    setFiles((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleRowDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleRowDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleRowDrop = (index: number) => {
    if (dragIndex !== null && dragIndex !== index) {
      moveFile(dragIndex, index);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleRowDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Ajoutez au moins 2 fichiers PDF pour fusionner.");
      return;
    }
    setMerging(true);
    setError("");
    try {
      const merged = await PDFDocument.create();
      for (const pdfFile of files) {
        const doc = await PDFDocument.load(pdfFile.bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((page) => merged.addPage(page));
      }
      const mergedBytes = await merged.save();
      const blob = new Blob([mergedBytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fusion.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Erreur lors de la fusion. Verifiez que vos fichiers PDF sont valides.");
    }
    setMerging(false);
  };

  const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0);
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            PDF
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fusionneur de <span style={{ color: "var(--primary)" }}>PDF</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Glissez-deposez vos fichiers PDF, reordonnez-les par glisser-deposer, puis fusionnez-les en un seul document.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
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
                multiple
                className="hidden"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
              <p className="text-4xl">&#128196;</p>
              <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Glissez vos fichiers PDF ici
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

            {/* File list */}
            {files.length > 0 && (
              <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                    {files.length} fichier{files.length > 1 ? "s" : ""} &middot; {totalPages} page{totalPages > 1 ? "s" : ""} &middot; {formatSize(totalSize)}
                  </h2>
                  <button
                    onClick={() => setFiles([])}
                    className="text-xs font-semibold transition-colors hover:opacity-70"
                    style={{ color: "#dc2626" }}
                  >
                    Tout supprimer
                  </button>
                </div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {files.map((f, i) => (
                    <div
                      key={f.id}
                      draggable
                      onDragStart={() => handleRowDragStart(i)}
                      onDragOver={(e) => handleRowDragOver(e, i)}
                      onDrop={() => handleRowDrop(i)}
                      onDragEnd={handleRowDragEnd}
                      className="flex items-center gap-3 px-5 py-3 transition-all"
                      style={{
                        background: dragOverIndex === i ? "rgba(13,79,60,0.06)" : "transparent",
                        opacity: dragIndex === i ? 0.5 : 1,
                        borderTop: dragOverIndex === i ? "2px solid var(--primary)" : undefined,
                        cursor: "grab",
                      }}
                    >
                      <span className="text-xs font-bold flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{f.name}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>
                          {f.pageCount} page{f.pageCount > 1 ? "s" : ""} &middot; {formatSize(f.size)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => i > 0 && moveFile(i, i - 1)}
                          disabled={i === 0}
                          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--surface-alt)] disabled:opacity-30"
                          title="Monter"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
                        </button>
                        <button
                          onClick={() => i < files.length - 1 && moveFile(i, i + 1)}
                          disabled={i === files.length - 1}
                          className="p-1.5 rounded-lg transition-colors hover:bg-[var(--surface-alt)] disabled:opacity-30"
                          title="Descendre"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                        </button>
                        <button
                          onClick={() => removeFile(f.id)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(220,38,38,0.08)]"
                          style={{ color: "#dc2626" }}
                          title="Supprimer"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Merge button */}
            {files.length >= 2 && (
              <button
                onClick={mergePdfs}
                disabled={merging}
                className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--primary)" }}
              >
                {merging ? "Fusion en cours..." : `Fusionner ${files.length} PDF (${totalPages} pages)`}
              </button>
            )}

            {files.length === 0 && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-4xl">&#128195;</p>
                <p className="mt-3 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                  Aucun fichier selectionne
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Deposez au moins 2 fichiers PDF pour les fusionner en un seul document.
                </p>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A propos du fusionneur</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Glisser-deposer</strong> : Ajoutez vos PDF par drag &amp; drop ou en cliquant sur la zone de depot.</p>
                <p><strong className="text-[var(--foreground)]">Reordonnez</strong> : Glissez les fichiers pour changer l&apos;ordre, ou utilisez les fleches haut/bas.</p>
                <p><strong className="text-[var(--foreground)]">100% local</strong> : Tout le traitement se fait dans votre navigateur. Aucun fichier n&apos;est envoye sur un serveur.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Comment faire ?</h3>
              <ol className="mt-3 space-y-3 text-xs" style={{ color: "var(--muted)" }}>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "var(--surface-alt)" }}>1</span>
                  <span>Deposez vos fichiers PDF</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "var(--surface-alt)" }}>2</span>
                  <span>Reordonnez-les si besoin</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "var(--surface-alt)" }}>3</span>
                  <span>Cliquez sur Fusionner</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "var(--surface-alt)" }}>4</span>
                  <span>Telechargez le PDF fusionne</span>
                </li>
              </ol>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
