"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";

/* ═══════════════════════════ TYPES ═══════════════════════════ */

interface Adjustments {
  brightness: number;
  contrast: number;
  saturate: number;
  temperature: number;
  tint: number;
  sharpness: number;
  vignette: number;
  grain: number;
}

interface CurvePoint { x: number; y: number }

interface Layer {
  id: string;
  name: string;
  type: "image" | "adjustment";
  opacity: number;
  blendMode: string;
  visible: boolean;
  adjustments?: Partial<Adjustments>;
  filterName?: string;
}

interface HistoryState {
  adjustments: Adjustments;
  activeFilter: string;
  curvePoints: Record<string, CurvePoint[]>;
  layers: Layer[];
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

type TabId = "adjust" | "filters" | "curves" | "layers" | "ai";
type CurveChannel = "rgb" | "r" | "g" | "b";

/* ═══════════════════════════ CONSTANTS ═══════════════════════════ */

const DARK = {
  bg: "#141416",
  bg2: "#1c1c1f",
  bg3: "#232327",
  border: "#2a2a2f",
  text: "#a0a0a8",
  textBright: "#e4e4e7",
  accent: "#4ade80",
};

const DEFAULT_ADJ: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturate: 0,
  temperature: 0,
  tint: 0,
  sharpness: 0,
  vignette: 0,
  grain: 0,
};

const SLIDER_DEFS: { key: keyof Adjustments; label: string; min: number; max: number; step: number }[] = [
  { key: "brightness",  label: "Luminosite",  min: -100, max: 100, step: 1 },
  { key: "contrast",    label: "Contraste",    min: -100, max: 100, step: 1 },
  { key: "saturate",    label: "Saturation",   min: -100, max: 100, step: 1 },
  { key: "temperature", label: "Temperature",  min: -100, max: 100, step: 1 },
  { key: "tint",        label: "Teinte",       min: -100, max: 100, step: 1 },
  { key: "sharpness",   label: "Nettete",      min: 0,    max: 100, step: 1 },
  { key: "vignette",    label: "Vignette",     min: 0,    max: 100, step: 1 },
  { key: "grain",       label: "Grain",        min: 0,    max: 100, step: 1 },
];

interface FilterPreset {
  name: string;
  css: {
    brightness?: number;
    contrast?: number;
    saturate?: number;
    sepia?: number;
    hueRotate?: number;
    grayscale?: number;
  };
}

const FILTER_PRESETS: FilterPreset[] = [
  { name: "Original",     css: {} },
  { name: "Clarendon",    css: { brightness: 1.1, contrast: 1.3, saturate: 1.2 } },
  { name: "Juno",         css: { brightness: 1.05, contrast: 1.15, saturate: 1.4 } },
  { name: "Lark",         css: { brightness: 1.15, contrast: 0.9, saturate: 0.85 } },
  { name: "Gingham",      css: { brightness: 1.05, contrast: 0.95, sepia: 0.04, hueRotate: -10 } },
  { name: "Valencia",     css: { brightness: 1.08, contrast: 1.08, sepia: 0.15, saturate: 1.2 } },
  { name: "Nashville",    css: { brightness: 1.05, contrast: 1.2, saturate: 1.3, sepia: 0.2 } },
  { name: "Lo-Fi",        css: { contrast: 1.5, saturate: 1.3, brightness: 1.1 } },
  { name: "Vintage",      css: { brightness: 1.1, contrast: 0.85, saturate: 0.7, sepia: 0.4 } },
  { name: "Film Portra",  css: { brightness: 1.05, contrast: 0.95, saturate: 0.85, sepia: 0.08 } },
  { name: "Fuji",         css: { brightness: 1.02, contrast: 1.1, saturate: 1.15, hueRotate: 5 } },
  { name: "Arctic",       css: { brightness: 1.15, contrast: 1.05, saturate: 0.5, hueRotate: 190 } },
  { name: "Sunset",       css: { brightness: 1.05, contrast: 1.1, saturate: 1.3, sepia: 0.15, hueRotate: -15 } },
  { name: "Moody",        css: { brightness: 0.9, contrast: 1.3, saturate: 0.8, sepia: 0.1 } },
  { name: "Noir Intense", css: { grayscale: 1.0, contrast: 1.5, brightness: 1.1 } },
];

const BLEND_MODES = ["normal", "multiply", "screen", "overlay", "soft-light"];

/* ═══════════════════════════ UTILS ═══════════════════════════ */

function uid() { return Math.random().toString(36).slice(2, 9); }

function clamp(v: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, v)); }

function adjToCSS(a: Adjustments): string {
  const b = 1 + a.brightness / 100;
  const c = 1 + a.contrast / 100;
  const s = 1 + a.saturate / 100;
  const hr = a.tint * 1.8; // -180..180
  return `brightness(${b}) contrast(${c}) saturate(${s}) hue-rotate(${hr}deg)`;
}

function filterPresetToCSS(f: FilterPreset["css"]): string {
  const parts: string[] = [];
  if (f.brightness !== undefined) parts.push(`brightness(${f.brightness})`);
  if (f.contrast !== undefined)   parts.push(`contrast(${f.contrast})`);
  if (f.saturate !== undefined)   parts.push(`saturate(${f.saturate})`);
  if (f.sepia !== undefined)      parts.push(`sepia(${f.sepia})`);
  if (f.hueRotate !== undefined)  parts.push(`hue-rotate(${f.hueRotate}deg)`);
  if (f.grayscale !== undefined)  parts.push(`grayscale(${f.grayscale})`);
  return parts.length ? parts.join(" ") : "none";
}

/** Catmull-Rom spline interpolation to generate a 256-entry LUT */
function buildLUT(points: CurvePoint[]): Uint8Array {
  const lut = new Uint8Array(256);
  if (points.length < 2) {
    for (let i = 0; i < 256; i++) lut[i] = i;
    return lut;
  }
  const sorted = [...points].sort((a, b) => a.x - b.x);

  function catmullRom(p0: CurvePoint, p1: CurvePoint, p2: CurvePoint, p3: CurvePoint, t: number): number {
    const t2 = t * t, t3 = t2 * t;
    return 0.5 * (
      (2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    );
  }

  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    // find segment
    let segIdx = 0;
    for (let j = 0; j < sorted.length - 1; j++) {
      if (x >= sorted[j].x) segIdx = j;
    }
    const p1 = sorted[segIdx];
    const p2 = sorted[Math.min(segIdx + 1, sorted.length - 1)];
    const p0 = sorted[Math.max(segIdx - 1, 0)];
    const p3 = sorted[Math.min(segIdx + 2, sorted.length - 1)];

    if (p1.x === p2.x) {
      lut[i] = clamp(Math.round(p1.y * 255), 0, 255);
    } else {
      const t = (x - p1.x) / (p2.x - p1.x);
      const val = catmullRom(p0, p1, p2, p3, t);
      lut[i] = clamp(Math.round(val * 255), 0, 255);
    }
  }
  return lut;
}

function computeHistogram(imageData: ImageData): { r: number[]; g: number[]; b: number[]; lum: number[] } {
  const r = new Array(256).fill(0);
  const g = new Array(256).fill(0);
  const b = new Array(256).fill(0);
  const lum = new Array(256).fill(0);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    r[d[i]]++;
    g[d[i + 1]]++;
    b[d[i + 2]]++;
    const l = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    lum[l]++;
  }
  return { r, g, b, lum };
}

/* ═══════════════════════════ COMPONENT ═══════════════════════════ */

export default function EditeurPhoto() {
  /* ---------- core state ---------- */
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);

  const [adjustments, setAdjustments] = useState<Adjustments>({ ...DEFAULT_ADJ });
  const [activeFilter, setActiveFilter] = useState("Original");
  const [curveChannel, setCurveChannel] = useState<CurveChannel>("rgb");
  const [curvePoints, setCurvePoints] = useState<Record<CurveChannel, CurvePoint[]>>({
    rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
    r:   [{ x: 0, y: 0 }, { x: 1, y: 1 }],
    g:   [{ x: 0, y: 0 }, { x: 1, y: 1 }],
    b:   [{ x: 0, y: 0 }, { x: 1, y: 1 }],
  });
  const [layers, setLayers] = useState<Layer[]>([]);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  /* ---------- tabs ---------- */
  const [activeTab, setActiveTab] = useState<TabId>("adjust");

  /* ---------- AI state ---------- */
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState("");
  const [aiError, setAiError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aiCacheRef = useRef<Map<string, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pushHistoryRef = useRef<any>(null);

  /* ---------- history ---------- */
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const isUndoRedoRef = useRef(false);

  /* ---------- before/after ---------- */
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [splitPos, setSplitPos] = useState(0.5);
  const splitDragging = useRef(false);

  /* ---------- refs ---------- */
  const imgRef = useRef<HTMLImageElement | null>(null);
  const originalDataRef = useRef<ImageData | null>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterThumbCanvasRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const histogramRef = useRef<{ r: number[]; g: number[]; b: number[]; lum: number[] } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  /* ═══════════════ SAVE HISTORY ═══════════════ */

  const pushHistory = useCallback(() => {
    if (isUndoRedoRef.current) { isUndoRedoRef.current = false; return; }
    const snap: HistoryState = {
      adjustments: { ...adjustments },
      activeFilter,
      curvePoints: {
        rgb: [...curvePoints.rgb],
        r: [...curvePoints.r],
        g: [...curvePoints.g],
        b: [...curvePoints.b],
      },
      layers: layers.map(l => ({ ...l })),
      rotation,
      flipH,
      flipV,
    };
    setHistory(prev => {
      const base = prev.slice(0, historyIdx + 1);
      const next = [...base, snap].slice(-20);
      return next;
    });
    setHistoryIdx(prev => {
      const base = Math.min(prev + 1, 19);
      return base;
    });
  }, [adjustments, activeFilter, curvePoints, layers, rotation, flipH, flipV, historyIdx]);

  /* ═══════════════ UNDO / REDO ═══════════════ */

  const canUndo = historyIdx > 0;
  const canRedo = historyIdx < history.length - 1;

  const undo = useCallback(() => {
    if (!canUndo) return;
    isUndoRedoRef.current = true;
    const newIdx = historyIdx - 1;
    const snap = history[newIdx];
    setAdjustments({ ...snap.adjustments });
    setActiveFilter(snap.activeFilter);
    setCurvePoints({
      rgb: [...snap.curvePoints.rgb],
      r: [...snap.curvePoints.r],
      g: [...snap.curvePoints.g],
      b: [...snap.curvePoints.b],
    });
    setLayers(snap.layers.map(l => ({ ...l })));
    setRotation(snap.rotation);
    setFlipH(snap.flipH);
    setFlipV(snap.flipV);
    setHistoryIdx(newIdx);
  }, [canUndo, history, historyIdx]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    isUndoRedoRef.current = true;
    const newIdx = historyIdx + 1;
    const snap = history[newIdx];
    setAdjustments({ ...snap.adjustments });
    setActiveFilter(snap.activeFilter);
    setCurvePoints({
      rgb: [...snap.curvePoints.rgb],
      r: [...snap.curvePoints.r],
      g: [...snap.curvePoints.g],
      b: [...snap.curvePoints.b],
    });
    setLayers(snap.layers.map(l => ({ ...l })));
    setRotation(snap.rotation);
    setFlipH(snap.flipH);
    setFlipV(snap.flipV);
    setHistoryIdx(newIdx);
  }, [canRedo, history, historyIdx]);

  /* ═══════════════ BUILD CSS FILTER STRING ═══════════════ */

  const combinedCSS = useMemo(() => {
    const adjCSS = adjToCSS(adjustments);
    const preset = FILTER_PRESETS.find(f => f.name === activeFilter);
    const presetCSS = preset && preset.name !== "Original" ? filterPresetToCSS(preset.css) : "";

    // Layer adjustments
    let layerCSS = "";
    for (const l of layers) {
      if (!l.visible || l.type !== "adjustment" || !l.adjustments) continue;
      const la: Adjustments = { ...DEFAULT_ADJ, ...l.adjustments };
      // Scale by opacity
      const o = l.opacity / 100;
      const scaled: Adjustments = {
        brightness: la.brightness * o,
        contrast: la.contrast * o,
        saturate: la.saturate * o,
        temperature: la.temperature * o,
        tint: la.tint * o,
        sharpness: la.sharpness * o,
        vignette: la.vignette * o,
        grain: la.grain * o,
      };
      layerCSS += " " + adjToCSS(scaled);
    }

    return [adjCSS, presetCSS, layerCSS].filter(Boolean).join(" ");
  }, [adjustments, activeFilter, layers]);

  /* ═══════════════ CURVE LUTs ═══════════════ */

  const curveLUTs = useMemo(() => ({
    rgb: buildLUT(curvePoints.rgb),
    r:   buildLUT(curvePoints.r),
    g:   buildLUT(curvePoints.g),
    b:   buildLUT(curvePoints.b),
  }), [curvePoints]);

  const curvesAreIdentity = useMemo(() => {
    for (const ch of ["rgb", "r", "g", "b"] as CurveChannel[]) {
      const pts = curvePoints[ch];
      if (pts.length !== 2) return false;
      const s = [...pts].sort((a, b) => a.x - b.x);
      if (Math.abs(s[0].x) > 0.01 || Math.abs(s[0].y) > 0.01) return false;
      if (Math.abs(s[1].x - 1) > 0.01 || Math.abs(s[1].y - 1) > 0.01) return false;
    }
    return true;
  }, [curvePoints]);

  /* ═══════════════ RENDER PIPELINE ═══════════════ */

  const render = useCallback(() => {
    const canvas = mainCanvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // Compute display size
    const container = containerRef.current;
    const maxW = container ? container.clientWidth - 32 : 800;
    const maxH = Math.min(600, window.innerHeight - 250);

    // Account for rotation
    const isRotated = rotation === 90 || rotation === 270;
    const srcW = isRotated ? img.naturalHeight : img.naturalWidth;
    const srcH = isRotated ? img.naturalWidth : img.naturalHeight;

    const scale = Math.min(maxW / srcW, maxH / srcH, 1);
    const dw = Math.round(srcW * scale);
    const dh = Math.round(srcH * scale);

    canvas.width = dw;
    canvas.height = dh;
    setCanvasSize({ w: dw, h: dh });

    ctx.save();
    ctx.clearRect(0, 0, dw, dh);

    // Transform for rotation/flip
    ctx.translate(dw / 2, dh / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);
    if (flipV) ctx.scale(1, -1);

    const drawW = isRotated ? dh : dw;
    const drawH = isRotated ? dw : dh;
    ctx.translate(-drawW / 2, -drawH / 2);

    // Apply CSS filters
    ctx.filter = combinedCSS;
    ctx.drawImage(img, 0, 0, drawW, drawH);
    ctx.restore();

    // Temperature (warm/cool overlay)
    if (adjustments.temperature !== 0) {
      ctx.save();
      const t = adjustments.temperature;
      if (t > 0) {
        ctx.fillStyle = `rgba(255, 140, 0, ${t * 0.003})`;
      } else {
        ctx.fillStyle = `rgba(0, 100, 255, ${-t * 0.003})`;
      }
      ctx.globalCompositeOperation = "overlay";
      ctx.fillRect(0, 0, dw, dh);
      ctx.restore();
    }

    // Vignette
    if (adjustments.vignette > 0) {
      ctx.save();
      const v = adjustments.vignette / 100;
      const cx = dw / 2, cy = dh / 2;
      const r = Math.max(dw, dh) * 0.7;
      const grad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, `rgba(0,0,0,${v * 0.8})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, dw, dh);
      ctx.restore();
    }

    // Apply curves (pixel-level)
    if (!curvesAreIdentity) {
      const imageData = ctx.getImageData(0, 0, dw, dh);
      const d = imageData.data;
      const lutR = curveLUTs.r, lutG = curveLUTs.g, lutB = curveLUTs.b, lutRGB = curveLUTs.rgb;
      for (let i = 0; i < d.length; i += 4) {
        d[i]     = lutRGB[lutR[d[i]]];
        d[i + 1] = lutRGB[lutG[d[i + 1]]];
        d[i + 2] = lutRGB[lutB[d[i + 2]]];
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Grain
    if (adjustments.grain > 0) {
      const imageData = ctx.getImageData(0, 0, dw, dh);
      const d = imageData.data;
      const intensity = adjustments.grain * 0.5;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity;
        d[i]     = clamp(d[i] + noise, 0, 255);
        d[i + 1] = clamp(d[i + 1] + noise, 0, 255);
        d[i + 2] = clamp(d[i + 2] + noise, 0, 255);
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Sharpness (simple unsharp mask via temporary canvas)
    if (adjustments.sharpness > 0) {
      const amount = adjustments.sharpness / 100;
      const tmpCanvas = document.createElement("canvas");
      tmpCanvas.width = dw;
      tmpCanvas.height = dh;
      const tmpCtx = tmpCanvas.getContext("2d")!;
      tmpCtx.filter = `blur(1px)`;
      tmpCtx.drawImage(canvas, 0, 0);
      ctx.save();
      ctx.globalAlpha = amount * 0.6;
      ctx.globalCompositeOperation = "difference";
      ctx.drawImage(tmpCanvas, 0, 0);
      ctx.restore();
    }

    // Compute histogram
    const finalData = ctx.getImageData(0, 0, dw, dh);
    histogramRef.current = computeHistogram(finalData);

    // Before/After mode: draw original on left side
    if (showBeforeAfter && originalDataRef.current && imgRef.current) {
      const splitX = Math.round(dw * splitPos);
      // Draw original on left
      const tmpC = document.createElement("canvas");
      tmpC.width = dw;
      tmpC.height = dh;
      const tmpCtx2 = tmpC.getContext("2d")!;
      tmpCtx2.save();
      tmpCtx2.translate(dw / 2, dh / 2);
      tmpCtx2.rotate((rotation * Math.PI) / 180);
      if (flipH) tmpCtx2.scale(-1, 1);
      if (flipV) tmpCtx2.scale(1, -1);
      const dW2 = isRotated ? dh : dw;
      const dH2 = isRotated ? dw : dh;
      tmpCtx2.translate(-dW2 / 2, -dH2 / 2);
      tmpCtx2.drawImage(img, 0, 0, dW2, dH2);
      tmpCtx2.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, dh);
      ctx.clip();
      ctx.drawImage(tmpC, 0, 0);
      ctx.restore();

      // Draw split line
      ctx.save();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, dh);
      ctx.stroke();
      ctx.restore();

      // Labels
      ctx.save();
      ctx.font = "bold 11px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillText("AVANT", 8, 20);
      ctx.fillText("APRES", splitX + 8, 20);
      ctx.restore();
    }
  }, [adjustments, combinedCSS, curveLUTs, curvesAreIdentity, rotation, flipH, flipV, showBeforeAfter, splitPos]);

  /* ═══════════════ EFFECTS ═══════════════ */

  useEffect(() => {
    if (imageLoaded) render();
  }, [imageLoaded, render]);

  // Push to history on meaningful state changes (debounced)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!imageLoaded) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      pushHistory();
    }, 400);
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adjustments, activeFilter, curvePoints, layers, rotation, flipH, flipV]);

  // Resize handler
  useEffect(() => {
    if (!imageLoaded) return;
    const handler = () => render();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [imageLoaded, render]);

  /* ═══════════════ FILE HANDLING ═══════════════ */

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        // Store original data
        const tmpC = document.createElement("canvas");
        tmpC.width = img.naturalWidth;
        tmpC.height = img.naturalHeight;
        const tmpCtx = tmpC.getContext("2d")!;
        tmpCtx.drawImage(img, 0, 0);
        originalDataRef.current = tmpCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

        // Reset all state
        setAdjustments({ ...DEFAULT_ADJ });
        setActiveFilter("Original");
        setCurvePoints({
          rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
          r:   [{ x: 0, y: 0 }, { x: 1, y: 1 }],
          g:   [{ x: 0, y: 0 }, { x: 1, y: 1 }],
          b:   [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        });
        setLayers([{ id: uid(), name: "Image", type: "image", opacity: 100, blendMode: "normal", visible: true }]);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setHistory([]);
        setHistoryIdx(-1);
        setShowBeforeAfter(false);
        setImageLoaded(true);

        // Generate filter thumbnails after a tick
        setTimeout(() => generateFilterThumbnails(img), 50);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  /* ═══════════════ FILTER THUMBNAILS ═══════════════ */

  const generateFilterThumbnails = (img: HTMLImageElement) => {
    FILTER_PRESETS.forEach((preset) => {
      const canvas = filterThumbCanvasRefs.current.get(preset.name);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = 60;
      canvas.height = 60;
      const scale = Math.max(60 / img.naturalWidth, 60 / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (60 - w) / 2;
      const y = (60 - h) / 2;
      if (preset.name !== "Original") {
        ctx.filter = filterPresetToCSS(preset.css);
      }
      ctx.drawImage(img, x, y, w, h);
    });
  };

  /* ═══════════════ AUTO-ENHANCE ═══════════════ */

  const autoEnhance = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    // Sample the image
    const tmpC = document.createElement("canvas");
    const sz = 200;
    tmpC.width = sz;
    tmpC.height = sz;
    const tmpCtx = tmpC.getContext("2d")!;
    tmpCtx.drawImage(img, 0, 0, sz, sz);
    const data = tmpCtx.getImageData(0, 0, sz, sz).data;

    let totalBri = 0, totalSat = 0, count = 0;
    for (let i = 0; i < data.length; i += 16) { // sample every 4th pixel
      const r = data[i], g = data[i + 1], b = data[i + 2];
      totalBri += (r + g + b) / 3;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      totalSat += max === 0 ? 0 : (max - min) / max;
      count++;
    }
    const avgBri = totalBri / count;
    const avgSat = totalSat / count;

    // Target: brightness ~128, moderate saturation
    const briAdj = clamp(Math.round((128 - avgBri) * 0.6), -40, 40);
    const contAdj = avgBri < 100 ? 15 : avgBri > 160 ? -10 : 8;
    const satAdj = clamp(Math.round((0.5 - avgSat) * 60), -20, 30);

    setAdjustments(prev => ({
      ...prev,
      brightness: briAdj,
      contrast: contAdj,
      saturate: satAdj,
    }));
  }, []);

  /* ═══════════════ DOWNLOAD ═══════════════ */

  const download = useCallback(() => {
    const img = imgRef.current;
    const offscreen = offscreenCanvasRef.current;
    if (!img || !offscreen) return;
    const ctx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const isRotated = rotation === 90 || rotation === 270;
    const ow = isRotated ? img.naturalHeight : img.naturalWidth;
    const oh = isRotated ? img.naturalWidth : img.naturalHeight;
    offscreen.width = ow;
    offscreen.height = oh;

    ctx.save();
    ctx.clearRect(0, 0, ow, oh);
    ctx.translate(ow / 2, oh / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);
    if (flipV) ctx.scale(1, -1);
    const dw = isRotated ? oh : ow;
    const dh = isRotated ? ow : oh;
    ctx.translate(-dw / 2, -dh / 2);
    ctx.filter = combinedCSS;
    ctx.drawImage(img, 0, 0, dw, dh);
    ctx.restore();

    // Temperature overlay
    if (adjustments.temperature !== 0) {
      ctx.save();
      const t = adjustments.temperature;
      if (t > 0) ctx.fillStyle = `rgba(255, 140, 0, ${t * 0.003})`;
      else ctx.fillStyle = `rgba(0, 100, 255, ${-t * 0.003})`;
      ctx.globalCompositeOperation = "overlay";
      ctx.fillRect(0, 0, ow, oh);
      ctx.restore();
    }

    // Vignette
    if (adjustments.vignette > 0) {
      ctx.save();
      const v = adjustments.vignette / 100;
      const cx2 = ow / 2, cy2 = oh / 2;
      const rr = Math.max(ow, oh) * 0.7;
      const grad = ctx.createRadialGradient(cx2, cy2, rr * 0.3, cx2, cy2, rr);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, `rgba(0,0,0,${v * 0.8})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, ow, oh);
      ctx.restore();
    }

    // Curves
    if (!curvesAreIdentity) {
      const imageData = ctx.getImageData(0, 0, ow, oh);
      const d = imageData.data;
      const lutR = curveLUTs.r, lutG = curveLUTs.g, lutB = curveLUTs.b, lutRGB = curveLUTs.rgb;
      for (let i = 0; i < d.length; i += 4) {
        d[i]     = lutRGB[lutR[d[i]]];
        d[i + 1] = lutRGB[lutG[d[i + 1]]];
        d[i + 2] = lutRGB[lutB[d[i + 2]]];
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Grain
    if (adjustments.grain > 0) {
      const imageData = ctx.getImageData(0, 0, ow, oh);
      const d = imageData.data;
      const intensity = adjustments.grain * 0.5;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity;
        d[i]     = clamp(d[i] + noise, 0, 255);
        d[i + 1] = clamp(d[i + 1] + noise, 0, 255);
        d[i + 2] = clamp(d[i + 2] + noise, 0, 255);
      }
      ctx.putImageData(imageData, 0, 0);
    }

    const link = document.createElement("a");
    link.download = fileName.replace(/\.[^.]+$/, "") + "-edite.png";
    link.href = offscreen.toDataURL("image/png");
    link.click();
  }, [fileName, adjustments, combinedCSS, curveLUTs, curvesAreIdentity, rotation, flipH, flipV]);

  /* ═══════════════ LAYER ACTIONS ═══════════════ */

  const addAdjustmentLayer = () => {
    const newLayer: Layer = {
      id: uid(),
      name: `Ajustement ${layers.filter(l => l.type === "adjustment").length + 1}`,
      type: "adjustment",
      opacity: 100,
      blendMode: "normal",
      visible: true,
      adjustments: { brightness: 0, contrast: 0, saturate: 0 },
    };
    setLayers(prev => [...prev, newLayer]);
  };

  const updateLayer = (id: string, patch: Partial<Layer>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  };

  const removeLayer = (id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id || l.type === "image"));
  };

  const moveLayer = (id: string, dir: -1 | 1) => {
    setLayers(prev => {
      const idx = prev.findIndex(l => l.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  const flattenLayers = () => {
    setLayers(prev => [prev.find(l => l.type === "image") || prev[0]]);
  };

  /* CurveWidget is extracted as a standalone component below */

  /* ═══════════════ BEFORE/AFTER SPLIT DRAG ═══════════════ */

  const handleSplitMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    splitDragging.current = true;
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!splitDragging.current) return;
      const canvas = mainCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const pos = clamp((e.clientX - rect.left) / rect.width, 0.05, 0.95);
      setSplitPos(pos);
    };
    const handleUp = () => { splitDragging.current = false; };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  /* ═══════════════ KEYBOARD SHORTCUTS ═══════════════ */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  /* ═══════════════════ AI FEATURES (must be before any early return) ═══════════════════ */
  renderRef.current = render;
  pushHistoryRef.current = pushHistory;

  const loadTransformersTop = useCallback(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).__transformers) return (window as any).__transformers;
    setAiProgress("Chargement de Transformers.js...");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod = await (new Function('return import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.0/dist/transformers.min.js")'))() as any;
    mod.env.allowLocalModels = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__transformers = mod;
    return mod;
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAIPipelineTop = useCallback(async (task: string, model: string, opts?: any) => {
    const key = `${task}:${model}`;
    if (aiCacheRef.current.has(key)) return aiCacheRef.current.get(key);
    const tf = await loadTransformersTop();
    setAiProgress("Telechargement du modele (premiere fois)...");
    const pipe = await tf.pipeline(task, model, opts);
    aiCacheRef.current.set(key, pipe);
    return pipe;
  }, [loadTransformersTop]);

  const getCanvasDataURLTop = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  }, []);

  // Helper: convert a RawImage (from Transformers.js) to a data URL
  // RawImage has .data (Uint8ClampedArray), .width, .height, .channels
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawImageToDataURL = useCallback((raw: any): string => {
    const c = document.createElement("canvas");
    c.width = raw.width; c.height = raw.height;
    const ctx = c.getContext("2d")!;
    // Ensure RGBA
    let rgba = raw;
    if (raw.channels === 1 || raw.channels === 3) {
      rgba = raw.channels === 1 ? raw.rgb().rgba() : raw.rgba();
    }
    const imgData = new ImageData(new Uint8ClampedArray(rgba.data), raw.width, raw.height);
    ctx.putImageData(imgData, 0, 0);
    return c.toDataURL("image/png");
  }, []);

  const [depthIntensity, setDepthIntensity] = useState(50);
  const [depthMode, setDepthMode] = useState<"preview" | "bokeh">("bokeh");

  const aiRemoveBackground = useCallback(async () => {
    if (!imgRef.current) return;
    setAiLoading(true); setAiError("");
    try {
      const segmenter = await getAIPipelineTop("background-removal", "Xenova/modnet");
      setAiProgress("Suppression de l'arriere-plan...");
      const dataURL = getCanvasDataURLTop();
      if (!dataURL) throw new Error("Impossible de lire le canvas");
      const result = await segmenter(dataURL);
      // result is a RawImage — convert to data URL via our helper
      const resultURL = rawImageToDataURL(result);
      const newImg = new Image();
      await new Promise<void>((resolve, reject) => {
        newImg.onload = () => resolve();
        newImg.onerror = () => reject(new Error("Erreur chargement resultat"));
        newImg.src = resultURL;
      });
      pushHistoryRef.current();
      imgRef.current = newImg;
      renderRef.current();
    } catch (e) {
      console.error("AI BG removal error:", e);
      setAiError(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setAiLoading(false); setAiProgress("");
    }
  }, [getAIPipelineTop, getCanvasDataURLTop]);

  const aiDepthMap = useCallback(async () => {
    if (!imgRef.current) return;
    setAiLoading(true); setAiError("");
    try {
      const estimator = await getAIPipelineTop("depth-estimation", "Xenova/depth-anything-small-hf");
      setAiProgress("Estimation de la profondeur...");
      const dataURL = getCanvasDataURLTop();
      if (!dataURL) throw new Error("Impossible de lire le canvas");
      const result = await estimator(dataURL);
      // result.depth is a RawImage — convert to a canvas for pixel operations
      const depthRaw = result.depth;
      const depthDataURL = rawImageToDataURL(depthRaw);
      const depthImg = new Image();
      await new Promise<void>((res, rej) => { depthImg.onload = () => res(); depthImg.onerror = () => rej(); depthImg.src = depthDataURL; });
      pushHistoryRef.current();
      if (depthMode === "preview") {
        imgRef.current = depthImg;
      } else {
        const img = imgRef.current;
        const w = img.naturalWidth, h = img.naturalHeight;
        const srcC = document.createElement("canvas"); srcC.width = w; srcC.height = h;
        const srcCtx = srcC.getContext("2d")!; srcCtx.drawImage(img, 0, 0, w, h);
        const blurC = document.createElement("canvas"); blurC.width = w; blurC.height = h;
        const blurCtx = blurC.getContext("2d")!; blurCtx.filter = `blur(${Math.round(depthIntensity / 5)}px)`; blurCtx.drawImage(img, 0, 0, w, h); blurCtx.filter = "none";
        const dC = document.createElement("canvas"); dC.width = w; dC.height = h;
        dC.getContext("2d")!.drawImage(depthImg, 0, 0, w, h);
        const depthData = dC.getContext("2d")!.getImageData(0, 0, w, h).data;
        const srcData = srcCtx.getImageData(0, 0, w, h);
        const blurData = blurCtx.getImageData(0, 0, w, h);
        const outData = srcCtx.createImageData(w, h);
        for (let i = 0; i < depthData.length; i += 4) {
          const d = depthData[i] / 255;
          outData.data[i] = srcData.data[i] * d + blurData.data[i] * (1 - d);
          outData.data[i + 1] = srcData.data[i + 1] * d + blurData.data[i + 1] * (1 - d);
          outData.data[i + 2] = srcData.data[i + 2] * d + blurData.data[i + 2] * (1 - d);
          outData.data[i + 3] = 255;
        }
        const resC = document.createElement("canvas"); resC.width = w; resC.height = h;
        resC.getContext("2d")!.putImageData(outData, 0, 0);
        const newImg = new Image();
        await new Promise<void>((res, rej) => { newImg.onload = () => res(); newImg.onerror = () => rej(); newImg.src = resC.toDataURL("image/png"); });
        imgRef.current = newImg;
      }
      renderRef.current();
    } catch (e) {
      console.error("AI depth error:", e);
      setAiError(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setAiLoading(false); setAiProgress("");
    }
  }, [getAIPipelineTop, getCanvasDataURLTop, depthMode, depthIntensity]);

  const aiSuperRes = useCallback(async () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    if (img.naturalWidth > 1024 || img.naturalHeight > 1024) {
      if (!confirm("L'image est grande. Le traitement peut prendre 30-60 secondes. Continuer ?")) return;
    }
    setAiLoading(true); setAiError("");
    try {
      const upscaler = await getAIPipelineTop("image-to-image", "Xenova/swin2SR-classical-sr-x2-64");
      setAiProgress("Amelioration de la resolution (x2)...");
      const dataURL = getCanvasDataURLTop();
      if (!dataURL) throw new Error("Impossible de lire le canvas");
      const result = await upscaler(dataURL);
      const resultURL = rawImageToDataURL(result);
      pushHistoryRef.current();
      const newImg = new Image();
      await new Promise<void>((res, rej) => { newImg.onload = () => res(); newImg.onerror = () => rej(); newImg.src = resultURL; });
      imgRef.current = newImg;
      renderRef.current();
    } catch (e) {
      console.error("AI super-res error:", e);
      setAiError(`Erreur : ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setAiLoading(false); setAiProgress("");
    }
  }, [getAIPipelineTop, getCanvasDataURLTop]);

  /* ═══════════════ RENDER ═══════════════ */

  // ---- Drop page (light theme, before image loaded) ----
  if (!imageLoaded) {
    return (
      <>
        <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="mx-auto max-w-5xl px-5">
            <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Image</p>
            <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Editeur <span style={{ color: "var(--primary)" }}>Photo</span>
            </h1>
            <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Retouche avancee : ajustements, filtres VSCO, courbes, calques. Tout dans le navigateur.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-5 py-16">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed p-20 text-center transition-all"
            style={{
              borderColor: dragging ? "var(--primary)" : "var(--border)",
              background: dragging ? "rgba(13,79,60,0.04)" : "var(--surface)",
            }}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "rgba(13,79,60,0.08)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              Glissez une photo ici
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              ou cliquez pour parcourir — PNG, JPEG, WebP
            </p>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }} />
          </div>

          {/* SEO block */}
          <div className="mt-12 rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Retouche photo professionnelle en ligne</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              <p>Un editeur photo complet avec ajustements fins (luminosite, contraste, saturation, temperature, teinte), 15 filtres style VSCO/Instagram, des courbes de luminosite interactives par canal RGB, et un systeme de calques avec modes de fusion.</p>
              <p>Tout le traitement se fait localement dans votre navigateur. Vos photos ne sont jamais envoyees sur un serveur. Export en PNG a resolution originale.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // AI features are defined above (before the early return) to respect React hooks rules
  // ---- Dark workspace (image loaded) ----

  const TABS: { id: TabId; label: string }[] = [
    { id: "adjust",  label: "Ajuster" },
    { id: "filters", label: "Filtres" },
    { id: "curves",  label: "Courbes" },
    { id: "layers",  label: "Calques" },
    { id: "ai",      label: "IA" },
  ];

  return (
    <div style={{ background: DARK.bg, minHeight: "100vh", color: DARK.textBright }}>
      {/* ═══════ TOP TOOLBAR ═══════ */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: DARK.bg2, borderBottom: `1px solid ${DARK.border}` }}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: DARK.accent }}>Editeur Photo</span>
          <span className="text-xs truncate max-w-[200px]" style={{ color: DARK.text }}>{fileName}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Undo */}
          <button onClick={undo} disabled={!canUndo} title="Annuler (Ctrl+Z)"
            className="p-2 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: DARK.text }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13" />
            </svg>
          </button>
          {/* Redo */}
          <button onClick={redo} disabled={!canRedo} title="Retablir (Ctrl+Shift+Z)"
            className="p-2 rounded-lg transition-colors disabled:opacity-30"
            style={{ color: DARK.text }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016.69 3L21 13" />
            </svg>
          </button>

          <div className="w-px h-5 mx-1" style={{ background: DARK.border }} />

          {/* Rotate left */}
          <button onClick={() => setRotation(r => (r + 270) % 360)} title="Rotation gauche"
            className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: DARK.text }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
          </button>
          {/* Rotate right */}
          <button onClick={() => setRotation(r => (r + 90) % 360)} title="Rotation droite"
            className="p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: DARK.text }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
            </svg>
          </button>
          {/* Flip H */}
          <button onClick={() => setFlipH(f => !f)} title="Miroir horizontal"
            className="p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: flipH ? DARK.accent : DARK.text }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v18" /><path d="M16 7l4 5-4 5" /><path d="M8 7L4 12l4 5" />
            </svg>
          </button>
          {/* Flip V */}
          <button onClick={() => setFlipV(f => !f)} title="Miroir vertical"
            className="p-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: flipV ? DARK.accent : DARK.text }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18" /><path d="M7 8L12 4l5 4" /><path d="M7 16l5 4 5-4" />
            </svg>
          </button>

          <div className="w-px h-5 mx-1" style={{ background: DARK.border }} />

          {/* Before/After */}
          <button onClick={() => setShowBeforeAfter(v => !v)} title="Avant / Apres"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{
              background: showBeforeAfter ? DARK.accent : "transparent",
              color: showBeforeAfter ? "#000" : DARK.text,
            }}>
            A/B
          </button>

          <div className="w-px h-5 mx-1" style={{ background: DARK.border }} />

          {/* New image */}
          <button onClick={() => { setImageLoaded(false); setFileName(""); imgRef.current = null; }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
            style={{ color: DARK.text }}>
            Nouvelle image
          </button>

          {/* Download */}
          <button onClick={download}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:brightness-110"
            style={{ background: DARK.accent, color: "#000" }}>
            Telecharger
          </button>
        </div>
      </div>

      {/* ═══════ MAIN AREA ═══════ */}
      <div className="flex" style={{ height: "calc(100vh - 44px)" }}>
        {/* ═══════ CANVAS AREA ═══════ */}
        <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-hidden"
          style={{ background: `repeating-conic-gradient(${DARK.bg3} 0% 25%, ${DARK.bg} 0% 50%) 0 0 / 20px 20px` }}>

          <div className="relative">
            <canvas ref={mainCanvasRef} style={{ borderRadius: 4, display: "block" }} />

            {/* Before/After split handle */}
            {showBeforeAfter && canvasSize.w > 0 && (
              <div
                onMouseDown={handleSplitMouseDown}
                className="absolute top-0 bottom-0 flex items-center justify-center cursor-col-resize"
                style={{
                  left: `${splitPos * 100}%`,
                  width: 20,
                  transform: "translateX(-50%)",
                  zIndex: 10,
                }}
              >
                <div className="w-1 h-10 rounded-full" style={{ background: "rgba(255,255,255,0.8)" }} />
              </div>
            )}
          </div>

          {/* Mini histogram overlay */}
          {histogramRef.current && !showBeforeAfter && (
            <div className="absolute bottom-4 left-4 rounded-lg overflow-hidden" style={{ background: "rgba(0,0,0,0.6)", padding: 4 }}>
              <MiniHistogram data={histogramRef.current} />
            </div>
          )}
        </div>

        {/* ═══════ RIGHT PANEL ═══════ */}
        <div className="flex flex-col" style={{ width: 320, background: DARK.bg2, borderLeft: `1px solid ${DARK.border}` }}>
          {/* Tabs */}
          <div className="flex" style={{ borderBottom: `1px solid ${DARK.border}` }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
                style={{
                  color: activeTab === tab.id ? DARK.accent : DARK.text,
                  borderBottom: activeTab === tab.id ? `2px solid ${DARK.accent}` : "2px solid transparent",
                  background: activeTab === tab.id ? "rgba(74,222,128,0.04)" : "transparent",
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${DARK.border} transparent` }}>
            {/* ═══════ ADJUST TAB ═══════ */}
            {activeTab === "adjust" && (
              <div className="space-y-5">
                {/* Auto-enhance */}
                <button onClick={autoEnhance}
                  className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:brightness-110"
                  style={{ background: DARK.accent, color: "#000" }}>
                  Auto-enhance
                </button>

                {SLIDER_DEFS.map(sd => {
                  const val = adjustments[sd.key];
                  const isChanged = val !== DEFAULT_ADJ[sd.key];
                  return (
                    <div key={sd.key}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider"
                          style={{ color: isChanged ? DARK.accent : DARK.text }}>
                          {sd.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold tabular-nums" style={{ color: isChanged ? DARK.textBright : DARK.text }}>
                            {val > 0 ? `+${val}` : val}
                          </span>
                          {isChanged && (
                            <button onClick={() => setAdjustments(prev => ({ ...prev, [sd.key]: DEFAULT_ADJ[sd.key] }))}
                              className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                              style={{ color: DARK.text, fontSize: 11 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="range" min={sd.min} max={sd.max} step={sd.step} value={val}
                        onChange={(e) => setAdjustments(prev => ({ ...prev, [sd.key]: Number(e.target.value) }))}
                        className="w-full accent-[#4ade80]"
                        style={{ height: 4 }}
                      />
                    </div>
                  );
                })}

                {/* Reset all */}
                <button onClick={() => setAdjustments({ ...DEFAULT_ADJ })}
                  className="w-full py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
                  style={{ color: DARK.text, border: `1px solid ${DARK.border}` }}>
                  Reinitialiser tout
                </button>
              </div>
            )}

            {/* ═══════ FILTERS TAB ═══════ */}
            {activeTab === "filters" && (
              <div className="grid grid-cols-3 gap-2">
                {FILTER_PRESETS.map(preset => {
                  const isActive = activeFilter === preset.name;
                  return (
                    <button key={preset.name} onClick={() => setActiveFilter(preset.name)}
                      className="flex flex-col items-center gap-1.5 p-1.5 rounded-lg transition-all"
                      style={{
                        background: isActive ? "rgba(74,222,128,0.08)" : "transparent",
                        border: isActive ? `2px solid ${DARK.accent}` : `2px solid transparent`,
                      }}>
                      <canvas
                        ref={(el) => { if (el) filterThumbCanvasRefs.current.set(preset.name, el); }}
                        width={60} height={60}
                        className="rounded"
                        style={{ width: 60, height: 60, background: DARK.bg3 }}
                      />
                      <span className="text-[10px] font-semibold truncate w-full text-center"
                        style={{ color: isActive ? DARK.accent : DARK.text }}>
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ═══════ CURVES TAB ═══════ */}
            {activeTab === "curves" && (
              <div className="space-y-3">
                {/* Channel selector */}
                <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${DARK.border}` }}>
                  {(["rgb", "r", "g", "b"] as CurveChannel[]).map(ch => {
                    const isActive = curveChannel === ch;
                    const colors: Record<CurveChannel, string> = { rgb: "#fff", r: "#ef4444", g: "#22c55e", b: "#3b82f6" };
                    return (
                      <button key={ch} onClick={() => setCurveChannel(ch)}
                        className="flex-1 py-1.5 text-xs font-bold uppercase transition-colors"
                        style={{
                          background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                          color: isActive ? colors[ch] : DARK.text,
                          borderBottom: isActive ? `2px solid ${colors[ch]}` : "2px solid transparent",
                        }}>
                        {ch.toUpperCase()}
                      </button>
                    );
                  })}
                </div>

                {/* Curve widget */}
                <CurveWidget channel={curveChannel} points={curvePoints[curveChannel]} histogram={histogramRef.current} onPointsChange={(pts) => setCurvePoints(prev => ({ ...prev, [curveChannel]: pts }))} />

                <p className="text-[10px] leading-relaxed" style={{ color: DARK.text }}>
                  Cliquez pour ajouter un point. Double-cliquez un point pour le supprimer. Glissez pour ajuster.
                </p>

                {/* Reset curves */}
                <button onClick={() => setCurvePoints({
                  rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
                  r: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
                  g: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
                  b: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
                })}
                  className="w-full py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
                  style={{ color: DARK.text, border: `1px solid ${DARK.border}` }}>
                  Reinitialiser les courbes
                </button>
              </div>
            )}

            {/* ═══════ LAYERS TAB ═══════ */}
            {activeTab === "layers" && (
              <div className="space-y-3">
                {/* Add & Flatten */}
                <div className="flex gap-2">
                  <button onClick={addAdjustmentLayer}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all hover:brightness-110"
                    style={{ background: DARK.accent, color: "#000" }}>
                    + Ajustement
                  </button>
                  <button onClick={flattenLayers}
                    className="flex-1 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
                    style={{ color: DARK.text, border: `1px solid ${DARK.border}` }}>
                    Aplatir
                  </button>
                </div>

                {/* Layer list (reversed, top layer first) */}
                <div className="space-y-2">
                  {[...layers].reverse().map((layer) => (
                    <div key={layer.id} className="rounded-lg p-3"
                      style={{ background: DARK.bg3, border: `1px solid ${DARK.border}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        {/* Visibility toggle */}
                        <button onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
                          className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                          style={{ color: layer.visible ? DARK.accent : DARK.text }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {layer.visible ? (
                              <>
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </>
                            ) : (
                              <>
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                              </>
                            )}
                          </svg>
                        </button>

                        <span className="flex-1 text-xs font-semibold truncate" style={{ color: DARK.textBright }}>
                          {layer.name}
                        </span>

                        {/* Move up/down */}
                        {layer.type !== "image" && (
                          <>
                            <button onClick={() => moveLayer(layer.id, 1)}
                              className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                              style={{ color: DARK.text, fontSize: 10 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 15l-6-6-6 6" /></svg>
                            </button>
                            <button onClick={() => moveLayer(layer.id, -1)}
                              className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                              style={{ color: DARK.text, fontSize: 10 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                            </button>
                            <button onClick={() => removeLayer(layer.id)}
                              className="w-5 h-5 flex items-center justify-center rounded transition-colors hover:bg-white/10"
                              style={{ color: "#ef4444", fontSize: 10 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Opacity */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: DARK.text, width: 50 }}>Opacite</span>
                        <input type="range" min={0} max={100} value={layer.opacity}
                          onChange={(e) => updateLayer(layer.id, { opacity: Number(e.target.value) })}
                          className="flex-1 accent-[#4ade80]" style={{ height: 3 }} />
                        <span className="text-[10px] font-bold tabular-nums w-8 text-right" style={{ color: DARK.text }}>{layer.opacity}%</span>
                      </div>

                      {/* Blend mode */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: DARK.text, width: 50 }}>Mode</span>
                        <select value={layer.blendMode}
                          onChange={(e) => updateLayer(layer.id, { blendMode: e.target.value })}
                          className="flex-1 rounded px-2 py-1 text-[10px]"
                          style={{ background: DARK.bg, color: DARK.textBright, border: `1px solid ${DARK.border}` }}>
                          {BLEND_MODES.map(bm => (
                            <option key={bm} value={bm}>{bm.charAt(0).toUpperCase() + bm.slice(1).replace("-", " ")}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════ AI TAB ═══════ */}
            {activeTab === "ai" && (
              <div className="space-y-4">
                <p className="text-[10px] leading-relaxed" style={{ color: DARK.text }}>
                  Traitement IA 100% local dans votre navigateur. Les modeles sont telecharges et mis en cache au premier usage.
                </p>

                {aiError && (
                  <div className="rounded-lg p-3 text-xs" style={{ background: "#ef444420", color: "#ef4444" }}>{aiError}</div>
                )}

                {aiLoading && (
                  <div className="rounded-lg p-4 text-center" style={{ background: DARK.bg3 }}>
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full" style={{ background: `${DARK.accent}15` }}>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK.accent} strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: DARK.textBright }}>{aiProgress || "Traitement..."}</p>
                    <p className="mt-1 text-[10px]" style={{ color: DARK.text }}>Ne fermez pas cet onglet</p>
                  </div>
                )}

                {!aiLoading && (
                  <>
                    {/* Background Removal */}
                    <div className="rounded-lg p-4" style={{ background: DARK.bg3, border: `1px solid ${DARK.border}` }}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg" style={{ background: `${DARK.accent}15` }}>✂️</div>
                        <div className="flex-1">
                          <p className="text-xs font-bold" style={{ color: DARK.textBright }}>Supprimer l&apos;arriere-plan</p>
                          <p className="mt-0.5 text-[10px]" style={{ color: DARK.text }}>Modele MODNet — 6.6 Mo — Apache 2.0</p>
                        </div>
                      </div>
                      <button onClick={aiRemoveBackground} disabled={!imgRef.current}
                        className="mt-3 w-full rounded-lg py-2.5 text-xs font-bold transition-all hover:brightness-110 disabled:opacity-40"
                        style={{ background: DARK.accent, color: "#000" }}>
                        Supprimer le fond
                      </button>
                    </div>

                    {/* Depth Map + Bokeh */}
                    <div className="rounded-lg p-4" style={{ background: DARK.bg3, border: `1px solid ${DARK.border}` }}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg" style={{ background: "rgba(99,102,241,0.15)" }}>🔮</div>
                        <div className="flex-1">
                          <p className="text-xs font-bold" style={{ color: DARK.textBright }}>Profondeur &amp; Bokeh</p>
                          <p className="mt-0.5 text-[10px]" style={{ color: DARK.text }}>Depth Anything — 20 Mo — Apache 2.0</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-1.5">
                        <button onClick={() => setDepthMode("bokeh")}
                          className="flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all"
                          style={{ background: depthMode === "bokeh" ? "#6366f1" : DARK.bg, color: depthMode === "bokeh" ? "#fff" : DARK.text }}>
                          Effet Bokeh
                        </button>
                        <button onClick={() => setDepthMode("preview")}
                          className="flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all"
                          style={{ background: depthMode === "preview" ? "#6366f1" : DARK.bg, color: depthMode === "preview" ? "#fff" : DARK.text }}>
                          Carte de profondeur
                        </button>
                      </div>
                      {depthMode === "bokeh" && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[10px]" style={{ color: DARK.text }}>Flou</span>
                          <input type="range" min={10} max={100} value={depthIntensity}
                            onChange={(e) => setDepthIntensity(Number(e.target.value))}
                            className="flex-1 accent-[#6366f1]" />
                          <span className="w-6 text-right text-[10px] font-bold tabular-nums" style={{ color: "#6366f1" }}>{depthIntensity}</span>
                        </div>
                      )}
                      <button onClick={aiDepthMap} disabled={!imgRef.current}
                        className="mt-2 w-full rounded-lg py-2.5 text-xs font-bold transition-all hover:brightness-110 disabled:opacity-40"
                        style={{ background: "#6366f1", color: "#fff" }}>
                        {depthMode === "bokeh" ? "Appliquer le Bokeh" : "Generer la carte"}
                      </button>
                    </div>

                    {/* Super Resolution */}
                    <div className="rounded-lg p-4" style={{ background: DARK.bg3, border: `1px solid ${DARK.border}` }}>
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg" style={{ background: "rgba(232,150,62,0.15)" }}>🔍</div>
                        <div className="flex-1">
                          <p className="text-xs font-bold" style={{ color: DARK.textBright }}>Super Resolution x2</p>
                          <p className="mt-0.5 text-[10px]" style={{ color: DARK.text }}>Swin2SR — 16 Mo — Apache 2.0</p>
                        </div>
                      </div>
                      {imgRef.current && (imgRef.current.naturalWidth > 1024 || imgRef.current.naturalHeight > 1024) && (
                        <p className="mt-2 text-[10px] rounded px-2 py-1" style={{ background: "#e8963e20", color: "#e8963e" }}>
                          Image &gt; 1024px : le traitement peut prendre 30-60s
                        </p>
                      )}
                      <button onClick={aiSuperRes} disabled={!imgRef.current}
                        className="mt-3 w-full rounded-lg py-2.5 text-xs font-bold transition-all hover:brightness-110 disabled:opacity-40"
                        style={{ background: "#e8963e", color: "#000" }}>
                        Ameliorer la resolution (x2)
                      </button>
                    </div>

                    {/* Info */}
                    <div className="rounded-lg p-3" style={{ background: DARK.bg }}>
                      <p className="text-[10px] leading-relaxed" style={{ color: DARK.text }}>
                        Les modeles IA sont telecharges depuis Hugging Face et mis en cache dans votre navigateur.
                        Premier usage = 6-20 Mo de telechargement. Ensuite, c&apos;est instantane.
                        Aucune donnee n&apos;est envoyee — tout est local.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvases */}
      <canvas ref={offscreenCanvasRef} className="hidden" />
    </div>
  );
}

/* ═══════════════ CURVE WIDGET (standalone component) ═══════════════ */

function CurveWidget({ channel, points, histogram, onPointsChange }: {
  channel: CurveChannel;
  points: CurvePoint[];
  histogram: { r: number[]; g: number[]; b: number[]; lum: number[] } | null;
  onPointsChange: (pts: CurvePoint[]) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const size = 256;

  const channelColor = channel === "rgb" ? "#fff" : channel === "r" ? "#ef4444" : channel === "g" ? "#22c55e" : "#3b82f6";

  // Build path from spline
  const pathD = useMemo(() => {
    const lut = buildLUT(points);
    let d = `M 0 ${size - lut[0]}`;
    for (let i = 1; i < 256; i++) {
      d += ` L ${i} ${size - lut[i]}`;
    }
    return d;
  }, [points]);

  // Histogram background
  const histBars = useMemo(() => {
    if (!histogram) return null;
    const data = channel === "rgb" ? histogram.lum : channel === "r" ? histogram.r : channel === "g" ? histogram.g : histogram.b;
    const max = Math.max(...data, 1);
    const barW = size / 256;
    return data.map((v, i) => {
      const h = (v / max) * size * 0.5;
      return (
        <rect key={i} x={i * barW} y={size - h} width={barW} height={h}
          fill={channel === "rgb" ? "rgba(255,255,255,0.08)" : channel === "r" ? "rgba(239,68,68,0.12)" : channel === "g" ? "rgba(34,197,94,0.12)" : "rgba(59,130,246,0.12)"} />
      );
    });
  }, [channel, histogram]);

  const getPos = (e: React.MouseEvent | MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: clamp((e.clientX - rect.left) / rect.width, 0, 1),
      y: clamp(1 - (e.clientY - rect.top) / rect.height, 0, 1),
    };
  };

  const handleMouseDown = (idx: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragIdx(idx);
  };

  useEffect(() => {
    if (dragIdx === null) return;
    const handleMove = (e: MouseEvent) => {
      const pos = getPos(e);
      const arr = [...points];
      arr[dragIdx] = pos;
      onPointsChange(arr);
    };
    const handleUp = () => setDragIdx(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragIdx, points, onPointsChange]);

  const handleClick = (e: React.MouseEvent) => {
    if (dragIdx !== null) return;
    const pos = getPos(e);
    const near = points.some(p => Math.abs(p.x - pos.x) < 0.04 && Math.abs(p.y - pos.y) < 0.04);
    if (!near) {
      onPointsChange([...points, pos]);
    }
  };

  const handleDoubleClick = (idx: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (points.length <= 2) return;
    onPointsChange(points.filter((_, i) => i !== idx));
  };

  return (
    <svg ref={svgRef} viewBox={`0 0 ${size} ${size}`} className="w-full cursor-crosshair"
      style={{ background: DARK.bg, border: `1px solid ${DARK.border}`, borderRadius: 8 }}
      onClick={handleClick}>
      {/* Grid */}
      {[0.25, 0.5, 0.75].map(f => (
        <g key={f}>
          <line x1={f * size} y1={0} x2={f * size} y2={size} stroke={DARK.border} strokeWidth={0.5} />
          <line x1={0} y1={f * size} x2={size} y2={f * size} stroke={DARK.border} strokeWidth={0.5} />
        </g>
      ))}
      {/* Identity diagonal */}
      <line x1={0} y1={size} x2={size} y2={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="4 4" />
      {/* Histogram */}
      {histBars}
      {/* Curve */}
      <path d={pathD} fill="none" stroke={channelColor} strokeWidth={2} />
      {/* Control points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x * size} cy={(1 - p.y) * size} r={6}
          fill={dragIdx === i ? channelColor : DARK.bg3}
          stroke={channelColor} strokeWidth={2}
          style={{ cursor: "grab" }}
          onMouseDown={handleMouseDown(i)}
          onDoubleClick={handleDoubleClick(i)} />
      ))}
    </svg>
  );
}

/* ═══════════════ MINI HISTOGRAM ═══════════════ */

function MiniHistogram({ data }: { data: { r: number[]; g: number[]; b: number[]; lum: number[] } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = 128, h = 48;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    const maxLum = Math.max(...data.lum, 1);
    const barW = w / 256;

    // Draw R, G, B channels
    const channels: [number[], string][] = [
      [data.r, "rgba(239,68,68,0.4)"],
      [data.g, "rgba(34,197,94,0.4)"],
      [data.b, "rgba(59,130,246,0.4)"],
    ];
    for (const [ch, color] of channels) {
      const maxC = Math.max(...ch, 1);
      ctx.fillStyle = color;
      for (let i = 0; i < 256; i++) {
        const barH = (ch[i] / maxC) * h;
        ctx.fillRect(i * barW, h - barH, barW, barH);
      }
    }

    // Luminance outline
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 256; i++) {
      const y = h - (data.lum[i] / maxLum) * h;
      if (i === 0) ctx.moveTo(0, y);
      else ctx.lineTo(i * barW, y);
    }
    ctx.stroke();
  }, [data]);

  return <canvas ref={canvasRef} style={{ width: 128, height: 48, display: "block" }} />;
}
