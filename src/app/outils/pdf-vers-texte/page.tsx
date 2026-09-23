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
  encrypted: boolean;
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  // Revoking immediately can cancel the download in some browsers
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function baseName(name: string): string {
  return name.replace(/\.pdf$/i, "");
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
  const [extractedText, setExtractedText] = useState("");
  const [extractingText, setExtractingText] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const extractText = async () => {
    if (!info) return;
    setExtractingText(true);
    setExtractedText("");
    setError("");
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      // pdf.js transfers (detaches) the buffer it receives: give it a copy so page extraction keeps working
      const loadingTask = pdfjs.getDocument({ data: info.bytes.slice() });
      const pdf = await loadingTask.promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        // Keep the line breaks of the document (hasEOL) instead of one long line per page
        const pageText = content.items
          .map((it) => ("str" in it ? it.str + (it.hasEOL ? "\n" : "") : ""))
          .join("")
          .replace(/[ \t]+\n/g, "\n")
          .trim();
        fullText += `\n\n--- Page ${i} ---\n\n${pageText}`;
      }
      await loadingTask.destroy();
      const trimmed = fullText.trim();
      setExtractedText(trimmed || "(Aucun texte extractible. Le PDF contient probablement uniquement des images scannées — un OCR serait nécessaire.)");
    } catch (e) {
      const isPassword = e instanceof Error && e.name === "PasswordException";
      setError(
        isPassword
          ? "Ce PDF est protégé par un mot de passe d'ouverture : le texte ne peut pas être extrait."
          : "Erreur lors de l'extraction du texte : " + (e instanceof Error ? e.message : "inconnue")
      );
    } finally {
      setExtractingText(false);
    }
  };

  const copyExtractedText = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText).then(
      () => {
        setTextCopied(true);
        setTimeout(() => setTextCopied(false), 2000);
      },
      () => setError("Copie impossible : sélectionnez le texte et copiez-le manuellement.")
    );
  };

  const downloadExtractedText = () => {
    if (!extractedText || !info) return;
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    downloadBlob(blob, `${baseName(info.name)}.txt`);
  };

  const loadPdf = useCallback(async (file: File) => {
    setError("");
    setInfo(null);
    setExtractedText("");
    // Some systems give an empty MIME type: also accept the .pdf extension
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setError("Seuls les fichiers PDF sont acceptés.");
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
        encrypted: doc.isEncrypted,
      });
    } catch {
      setError("Impossible de lire ce fichier PDF. Il est peut-être corrompu ou protégé.");
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
      downloadBlob(blob, `${baseName(info.name)}_page_${pageIndex + 1}.pdf`);
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
      downloadBlob(blob, `${baseName(info.name)}_pages_${start + 1}-${end + 1}.pdf`);
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
      `Créateur : ${info.creator || "Non disponible"}`,
      `Producteur : ${info.producer || "Non disponible"}`,
      `Date de création : ${formatDate(info.creationDate)}`,
      `Date de modification : ${formatDate(info.modificationDate)}`,
      "",
      "Pages :",
      ...info.pagesSizes.map((p, i) => `  Page ${i + 1} : ${p.width} x ${p.height} pts`),
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => setError("Copie impossible dans le presse-papiers.")
    );
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
            Extrayez le texte de vos fichiers PDF, consultez leurs métadonnées (pages, auteur, dates) et téléchargez des pages individuelles. Vos fichiers restent sur votre appareil.
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
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Choisir un fichier PDF"
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
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f) loadPdf(f);
                }}
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
                      Métadonnées du PDF
                    </h2>
                    <button
                      onClick={copyMetadata}
                      className="text-xs font-semibold transition-colors hover:opacity-70"
                      style={{ color: "var(--primary)" }}
                    >
                      {copied ? "Copié !" : "Copier tout"}
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
                      { label: "Créateur", value: info.creator || "Non disponible" },
                      { label: "Producteur", value: info.producer || "Non disponible" },
                      { label: "Date de création", value: formatDate(info.creationDate) },
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

                {/* Text extraction */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="px-5 py-3 border-b flex items-center justify-between gap-3 flex-wrap" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Texte extrait
                    </h2>
                    <div className="flex items-center gap-3">
                      {!extractedText && (
                        <button
                          onClick={extractText}
                          disabled={extractingText}
                          className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-50"
                          style={{ background: "var(--primary)" }}
                        >
                          {extractingText ? "Extraction en cours..." : "Extraire le texte"}
                        </button>
                      )}
                      {extractedText && (
                        <>
                          <button
                            onClick={copyExtractedText}
                            className="text-xs font-semibold transition-colors hover:opacity-70"
                            style={{ color: "var(--primary)" }}
                          >
                            {textCopied ? "Copié !" : "Copier"}
                          </button>
                          <button
                            onClick={downloadExtractedText}
                            className="text-xs font-semibold transition-colors hover:opacity-70"
                            style={{ color: "var(--primary)" }}
                          >
                            Télécharger .txt
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    {!extractedText && !extractingText && (
                      <p className="text-sm" style={{ color: "var(--muted)" }}>
                        Cliquez sur &laquo;&nbsp;Extraire le texte&nbsp;&raquo; pour récupérer le contenu textuel de toutes les pages du PDF (compatible texte numérique uniquement, pas les scans/images).
                      </p>
                    )}
                    {extractingText && (
                      <p className="text-sm" style={{ color: "var(--muted)" }}>
                        Lecture du PDF en cours, page par page...
                      </p>
                    )}
                    {extractedText && (
                      <textarea
                        readOnly
                        aria-label="Texte extrait du PDF"
                        value={extractedText}
                        className="w-full h-80 rounded-lg border p-3 text-xs font-mono resize-y"
                        style={{ borderColor: "var(--border)", background: "var(--background)" }}
                      />
                    )}
                  </div>
                </div>

                {/* Pages list */}
                <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                      Pages ({info.pageCount})
                    </h2>
                    {info.pageCount > 1 && !info.encrypted && (
                      <button
                        onClick={() => downloadPageRange(0, info.pageCount - 1)}
                        disabled={extracting}
                        className="text-xs font-semibold transition-colors hover:opacity-70 disabled:opacity-50"
                        style={{ color: "var(--primary)" }}
                      >
                        Tout télécharger
                      </button>
                    )}
                  </div>
                  {info.encrypted && (
                    <p className="px-5 pt-3 text-xs" style={{ color: "var(--accent)" }}>
                      Ce PDF est chiffré : l&apos;extraction de pages n&apos;est pas possible (elle produirait des pages vides).
                    </p>
                  )}
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
                          disabled={extracting || info.encrypted}
                          aria-label={`Extraire la page ${i + 1} en PDF`}
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
                  Déposez un PDF pour l&apos;analyser
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Texte, métadonnées, nombre de pages et extraction de pages individuelles.
                </p>
              </div>
            )}

            {/* About */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>À propos de l&apos;extracteur</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Extraction de texte</strong> : récupérez le texte de toutes les pages (PDF numériques ; les scans nécessitent un OCR).</p>
                <p><strong className="text-[var(--foreground)]">Métadonnées</strong> : Titre, auteur, dates, producteur et dimensions de chaque page.</p>
                <p><strong className="text-[var(--foreground)]">Extraction de pages</strong> : Téléchargez n&apos;importe quelle page comme un PDF individuel.</p>
                <p><strong className="text-[var(--foreground)]">100% local</strong> : Tout le traitement se fait dans votre navigateur. Aucun fichier n&apos;est envoyé.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment analyser et extraire des pages d&apos;un PDF
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Notre outil PDF vous permet d&apos;extraire le texte d&apos;un fichier PDF, de consulter ses métadonnées et d&apos;extraire des pages individuelles.
                  Tout le traitement se fait localement dans votre navigateur grâce aux bibliotheques pdf.js et pdf-lib.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Importez votre PDF</strong> : glissez-déposez ou cliquez pour parcourir vos fichiers</li>
                  <li><strong className="text-[var(--foreground)]">Extrayez le texte</strong> : cliquez sur « Extraire le texte », puis copiez-le ou téléchargez-le en .txt</li>
                  <li><strong className="text-[var(--foreground)]">Consultez les métadonnées</strong> : titre, auteur, dates de creation/modification, producteur</li>
                  <li><strong className="text-[var(--foreground)]">Visualisez les pages</strong> : nombre de pages et dimensions (A4, Letter, etc.)</li>
                  <li><strong className="text-[var(--foreground)]">Extrayez des pages</strong> : téléchargez une page individuelle au format PDF</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>L&apos;outil fonctionne-t-il avec les PDF protégés ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Les PDF avec de simples restrictions (impression, copie) peuvent être analysés et leur texte extrait, mais l&apos;extraction de pages n&apos;est pas possible sur un PDF chiffré. Les PDF qui demandent un mot de passe d&apos;ouverture ne peuvent pas être lus.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Mon fichier PDF est-il envoyé sur un serveur ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non, absolument pas. L&apos;analyse et l&apos;extraction se font entièrement dans votre navigateur via JavaScript. Votre fichier PDF ne quitte jamais votre ordinateur, ce qui garantit la confidentialité de vos documents.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Puis-je extraire le texte d&apos;un PDF ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui : cliquez sur « Extraire le texte » pour récupérer le contenu de toutes les pages, puis copiez-le ou téléchargez-le en fichier .txt. Cela fonctionne pour les PDF créés depuis un traitement de texte ou un logiciel ; les PDF scannés (images) nécessitent un outil OCR. La mise en page (colonnes, tableaux) n&apos;est pas conservée.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Fonctionnalités</h3>
              <ul className="mt-3 space-y-2 text-xs" style={{ color: "var(--muted)" }}>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Extraction du texte (.txt)</span>
                </li>
                <li className="flex gap-2">
                  <span style={{ color: "var(--primary)" }}>&#10003;</span>
                  <span>Métadonnées complètes</span>
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
                  <span>Copier les métadonnées</span>
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
