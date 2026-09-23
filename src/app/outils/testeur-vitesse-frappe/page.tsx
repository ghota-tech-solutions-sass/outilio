"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

// Textes accentués (le test est en français). « œ » est écrit « oe » pour rester tapable sur tous les claviers.
const TEXTS = [
  "Le petit chat gris dormait paisiblement sur le rebord de la fenêtre. Dehors, la pluie tombait doucement sur les toits de la ville endormie. Les passants pressaient le pas, protégés par leurs parapluies colorés. Dans la boulangerie du coin, le boulanger préparait déjà les croissants du lendemain matin.",
  "La science nous apprend que le cerveau humain est capable de traiter des milliers d'informations chaque seconde. Cette capacité extraordinaire nous permet de résoudre des problèmes complexes, de créer des oeuvres artistiques et de communiquer avec les autres. Chaque jour, nous utilisons cette faculté sans même y penser.",
  "Les montagnes se dressaient fièrement sous le ciel bleu. Le vent soufflait dans les arbres, faisant danser les feuilles dorées de l'automne. Un ruisseau serpentait entre les rochers, emportant avec lui les souvenirs de l'été. Les randonneurs profitaient des derniers rayons de soleil avant le retour du froid.",
  "La technologie a transformé notre façon de vivre et de travailler. Nos téléphones sont devenus des outils indispensables qui nous connectent au monde entier. Les applications nous aident à organiser notre quotidien, à apprendre de nouvelles compétences et à rester en contact avec nos proches, où que nous soyons dans le monde.",
  "Dans la cuisine, les arômes se mêlaient pour créer une symphonie de saveurs. La grand-mère préparait son fameux gâteau au chocolat, suivant la recette transmise de génération en génération. Les enfants attendaient impatiemment, les yeux brillants de gourmandise, que le dessert soit enfin prêt à être découpé et partagé.",
  "Le voyage est une source inépuisable de découverte et d'enrichissement personnel. Chaque nouvelle destination nous offre une perspective différente sur le monde et ses cultures. Les rencontres que nous faisons en chemin deviennent souvent des souvenirs inoubliables qui marquent notre vie pour toujours et changent notre vision des choses.",
  "La musique accompagne les êtres humains depuis la nuit des temps. Elle exprime nos joies, nos peines, nos espoirs et nos rêves les plus profonds. Que ce soit le son du piano, la mélodie du violon ou le rythme de la guitare, chaque instrument raconte une histoire unique et touche notre coeur de manière singulière.",
  "Le jardin était un véritable havre de paix au milieu de la ville. Les roses rouges et blanches bordaient les allées de gravier. Un vieux banc en bois invitait les visiteurs à prendre un moment de repos. Les oiseaux chantaient dans les branches du grand chêne, créant une atmosphère sereine et apaisante.",
];

type GameState = "idle" | "running" | "finished";
type Duration = 30 | 60 | 120;

// Apostrophe typographique et espaces insécables comptent comme leurs équivalents clavier
function normalizeChar(c: string | undefined): string | undefined {
  if (c === "’" || c === "ʼ") return "'";
  if (c === " " || c === " ") return " ";
  return c;
}

function sameChar(a: string | undefined, b: string | undefined): boolean {
  return normalizeChar(a) === normalizeChar(b);
}

function countCorrect(typed: string, reference: string): number {
  let n = 0;
  for (let i = 0; i < typed.length && i < reference.length; i++) if (sameChar(typed[i], reference[i])) n++;
  return n;
}

// Mots par minute : 1 mot = 5 caractères corrects (convention internationale)
function computeWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  return Math.round(correctChars / 5 / (elapsedMs / 60_000));
}

export default function TesteurVitesseFrappe() {
  const [duration, setDuration] = useState<Duration>(60);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [typedChars, setTypedChars] = useState("");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [finalWpm, setFinalWpm] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(0);
  const [finalErrors, setFinalErrors] = useState(0);
  const [finalChars, setFinalChars] = useState(0);
  const [finalSeconds, setFinalSeconds] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Nombre de caractères déjà comptabilisés (évite de compter deux fois les touches mortes / compositions)
  const countedRef = useRef(0);
  const composingRef = useRef(false);
  const typedRef = useRef("");
  const totalRef = useRef(0);
  const errorsRef = useRef(0);
  const finishedRef = useRef(false);

  const currentText = TEXTS[currentTextIndex];
  const textRef = useRef(currentText);
  useEffect(() => {
    textRef.current = currentText;
  }, [currentText]);

  // Pick a random text that is different from the current one
  const pickNewText = useCallback(() => {
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * TEXTS.length);
    } while (newIndex === currentTextIndex && TEXTS.length > 1);
    setCurrentTextIndex(newIndex);
  }, [currentTextIndex]);

  const timeLeft = Math.max(0, Math.ceil((duration * 1000 - elapsedMs) / 1000));

  // WPM et précision en temps réel
  // Plancher d'une seconde pour éviter un pic absurde dans les premiers instants
  const currentWpm = gameState === "running" ? computeWpm(countCorrect(typedChars, currentText), Math.max(1000, elapsedMs)) : 0;
  const currentAccuracy = totalTyped === 0 ? 100 : Math.round(((totalTyped - errors) / totalTyped) * 100);

  // Fin du test (temps écoulé ou texte terminé) : lit uniquement des refs, donc stable
  const finishGame = useCallback((elapsed: number) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    // Au moins une seconde pour éviter un WPM absurde sur une frappe éclair
    const effectiveMs = Math.max(1000, elapsed);
    const total = totalRef.current;
    setGameState("finished");
    setElapsedMs(elapsed);
    setFinalWpm(computeWpm(countCorrect(typedRef.current, textRef.current), effectiveMs));
    setFinalAccuracy(total > 0 ? Math.round(((total - errorsRef.current) / total) * 100) : 100);
    setFinalErrors(errorsRef.current);
    setFinalChars(total);
    setFinalSeconds(Math.round(effectiveMs / 1000));
  }, []);

  // Démarre le chrono à la première frappe
  const startGame = useCallback(() => {
    finishedRef.current = false;
    setGameState("running");
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    const limitMs = duration * 1000;
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= limitMs) finishGame(limitMs);
      else setElapsedMs(elapsed);
    }, 100);
  }, [duration, finishGame]);

  // Comptabilise les caractères nouvellement saisis (frappes et erreurs)
  const countNewChars = useCallback((value: string) => {
    if (value.length <= countedRef.current) {
      countedRef.current = value.length;
      return;
    }
    let added = 0;
    let newErrors = 0;
    for (let i = countedRef.current; i < value.length; i++) {
      added++;
      if (i < textRef.current.length && !sameChar(value[i], textRef.current[i])) newErrors++;
    }
    countedRef.current = value.length;
    totalRef.current += added;
    errorsRef.current += newErrors;
    setTotalTyped(totalRef.current);
    setErrors(errorsRef.current);
  }, []);

  const afterInput = useCallback(
    (value: string) => {
      countNewChars(value);
      if (value.length >= textRef.current.length && startTimeRef.current > 0) {
        finishGame(Date.now() - startTimeRef.current);
      }
    },
    [countNewChars, finishGame]
  );

  // Handle typing input
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (gameState === "finished") return;
      const value = e.target.value;

      if (gameState === "idle" && value.length > 0) {
        startGame();
      }

      typedRef.current = value;
      setTypedChars(value);

      // Pendant une composition (touche morte ^ ou ¨, IME), on attend le caractère final
      const composing = composingRef.current || (e.nativeEvent as InputEvent).isComposing;
      if (!composing) afterInput(value);
    },
    [gameState, startGame, afterInput]
  );

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLTextAreaElement>) => {
      composingRef.current = false;
      if (gameState === "finished") return;
      const value = e.currentTarget.value;
      typedRef.current = value;
      afterInput(value);
    },
    [gameState, afterInput]
  );

  // Reset everything
  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    finishedRef.current = false;
    startTimeRef.current = 0;
    countedRef.current = 0;
    totalRef.current = 0;
    errorsRef.current = 0;
    typedRef.current = "";
    setGameState("idle");
    setTypedChars("");
    setElapsedMs(0);
    setErrors(0);
    setTotalTyped(0);
    setFinalWpm(0);
    setFinalAccuracy(0);
    setFinalErrors(0);
    setFinalChars(0);
    setFinalSeconds(0);
    pickNewText();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [pickNewText]);

  // Change duration
  const changeDuration = useCallback(
    (newDuration: Duration) => {
      if (gameState === "running") return;
      setDuration(newDuration);
    },
    [gameState]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Render the text with color coding
  const renderText = () => {
    return currentText.split("").map((char, i) => {
      let color = "var(--muted)"; // not yet typed
      let bgColor = "transparent";

      if (i < typedChars.length) {
        if (sameChar(typedChars[i], char)) {
          color = "#16a34a"; // green - correct
        } else {
          color = "#ffffff"; // white text on red bg
          bgColor = "#dc2626"; // red background - error
        }
      } else if (i === typedChars.length) {
        // Current cursor position
        bgColor = "var(--accent-light)";
        color = "var(--foreground)";
      }

      return (
        <span
          key={i}
          style={{
            color,
            backgroundColor: bgColor,
            borderRadius: bgColor !== "transparent" && i === typedChars.length ? "2px" : undefined,
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Outils
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Testeur de <span style={{ color: "var(--primary)" }}>vitesse de frappe</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Mesurez votre vitesse de frappe en mots par minute (WPM) et votre précision. Recopiez le
            texte affiché, accents compris, le plus vite possible.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Duration selector */}
            <div
              className="animate-fade-up stagger-1 rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Durée du test
              </h2>
              <div className="mt-4 flex gap-2">
                {([30, 60, 120] as Duration[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => changeDuration(d)}
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                    style={{
                      background: duration === d ? "var(--primary)" : "var(--surface-alt)",
                      color: duration === d ? "white" : "var(--muted)",
                      opacity: gameState === "running" ? 0.5 : 1,
                      cursor: gameState === "running" ? "not-allowed" : "pointer",
                    }}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time stats bar */}
            <div
              className="animate-fade-up stagger-2 grid grid-cols-3 gap-4"
            >
              <div
                className="rounded-2xl border p-4 text-center"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--muted)" }}
                >
                  Temps
                </p>
                <p
                  className="mt-1 text-3xl font-bold tabular-nums"
                  style={{ fontFamily: "var(--font-display)", color: timeLeft <= 10 && gameState === "running" ? "var(--accent)" : "var(--primary)" }}
                >
                  {formatTime(timeLeft)}
                </p>
              </div>
              <div
                className="rounded-2xl border p-4 text-center"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--muted)" }}
                >
                  WPM
                </p>
                <p
                  className="mt-1 text-3xl font-bold tabular-nums"
                  style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
                >
                  {gameState === "running" ? currentWpm : gameState === "finished" ? finalWpm : 0}
                </p>
              </div>
              <div
                className="rounded-2xl border p-4 text-center"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--muted)" }}
                >
                  Précision
                </p>
                <p
                  className="mt-1 text-3xl font-bold tabular-nums"
                  style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
                >
                  {gameState === "running" ? currentAccuracy : gameState === "finished" ? finalAccuracy : 100}%
                </p>
              </div>
            </div>

            {/* Text to type */}
            <div
              className="animate-fade-up stagger-3 rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--accent)" }}
              >
                Texte à recopier
              </h2>
              <div
                className="mt-4 select-none rounded-xl p-5 text-lg leading-relaxed"
                style={{
                  background: "var(--surface-alt)",
                  fontFamily: "'Courier New', Courier, monospace",
                  letterSpacing: "0.02em",
                  lineHeight: "1.8",
                  fontSize: "1.05rem",
                }}
              >
                {renderText()}
              </div>
            </div>

            {/* Input area */}
            {gameState !== "finished" ? (
              <div
                className="animate-fade-up stagger-4 rounded-2xl border p-6"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--accent)" }}
                >
                  {gameState === "idle" ? "Commencez à taper pour lancer le chrono" : "Continuez à taper…"}
                </h2>
                <textarea
                  ref={inputRef}
                  value={typedChars}
                  onChange={handleInput}
                  onCompositionStart={() => {
                    composingRef.current = true;
                  }}
                  onCompositionEnd={handleCompositionEnd}
                  onPaste={(e) => e.preventDefault()}
                  onDrop={(e) => e.preventDefault()}
                  maxLength={currentText.length}
                  aria-label="Zone de saisie du texte à recopier"
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  className="mt-4 w-full resize-none rounded-xl border px-5 py-4 text-base leading-relaxed outline-none transition-all focus:ring-2"
                  style={{
                    borderColor: "var(--border)",
                    fontFamily: "'Courier New', Courier, monospace",
                    letterSpacing: "0.02em",
                    lineHeight: "1.8",
                    fontSize: "1.05rem",
                    minHeight: "120px",
                    background: "var(--background)",
                    // @ts-expect-error CSS custom property for focus ring
                    "--tw-ring-color": "var(--primary)",
                  }}
                  placeholder="Tapez le texte ci-dessus ici…"
                />
              </div>
            ) : (
              /* Results */
              <div
                className="animate-fade-up rounded-2xl border p-8"
                style={{ background: "var(--primary)", borderColor: "var(--primary)" }}
              >
                <h2
                  className="text-center text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Résultats du test
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">WPM</p>
                    <p className="mt-1 text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                      {finalWpm}
                    </p>
                  </div>
                  <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Précision</p>
                    <p className="mt-1 text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                      {finalAccuracy}%
                    </p>
                  </div>
                  <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Caractères</p>
                    <p className="mt-1 text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                      {finalChars}
                    </p>
                  </div>
                  <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Erreurs</p>
                    <p className="mt-1 text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                      {finalErrors}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-white/70">
                  <p>Mesuré sur {finalSeconds} s{finalSeconds < duration ? " (texte terminé avant la fin du temps)" : ""}.</p>
                  <p className="mt-1">
                    {finalWpm >= 80 && "Excellent ! Vous êtes un dactylographe très rapide."}
                    {finalWpm >= 50 && finalWpm < 80 && "Très bien ! Votre vitesse est au-dessus de la moyenne."}
                    {finalWpm >= 30 && finalWpm < 50 && "Pas mal ! Continuez à pratiquer pour améliorer votre vitesse."}
                    {finalWpm < 30 && "Continuez à vous entraîner, c'est en forgeant qu'on devient forgeron !"}
                  </p>
                </div>
              </div>
            )}

            {/* Restart button */}
            <div className="flex justify-center">
              <button
                onClick={resetGame}
                className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: gameState === "finished" ? "var(--accent)" : "var(--primary)" }}
              >
                {gameState === "finished" ? "Recommencer" : "Nouveau texte"}
              </button>
            </div>

            {/* Info section */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Test de vitesse de frappe en français
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  <strong className="text-[var(--foreground)]">Comment ça marche</strong> : choisissez
                  une durée (30 s, 60 s ou 120 s), puis recopiez le texte affiché le plus rapidement
                  possible. Le chrono démarre automatiquement dès la première lettre tapée. Si vous
                  terminez le texte avant la fin, le test s&apos;arrête et le score est calculé sur le temps réel.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">WPM (mots par minute)</strong> : un
                  &quot;mot&quot; est défini comme 5 caractères, espaces et ponctuation compris. Seuls les
                  caractères corrects sont comptés dans le calcul du WPM. Une lettre accentuée compte pour un
                  caractère, y compris si vous la tapez avec une touche morte (^ puis e pour ê). La moyenne
                  pour un adulte se situe autour de 35 à 45 WPM.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Conseils</strong> : gardez les yeux sur
                  le texte source plutôt que sur votre clavier. Privilégiez la précision à la vitesse :
                  les erreurs pénalisent votre score. Pratiquez régulièrement pour progresser. Le texte
                  saisi reste dans votre navigateur.
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Barèmes de vitesse
              </h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Débutant</span>
                  <span style={{ fontWeight: 600 }}>&lt; 30 WPM</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Moyen</span>
                  <span style={{ fontWeight: 600 }}>30-50 WPM</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Rapide</span>
                  <span style={{ fontWeight: 600 }}>50-80 WPM</span>
                </li>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Expert</span>
                  <span style={{ fontWeight: 600 }}>&gt; 80 WPM</span>
                </li>
              </ul>
            </div>
            <div
              className="rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Astuces
              </h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Utilisez les 10 doigts</li>
                <li>Position de base : QSDF - JKLM</li>
                <li>Ne regardez pas le clavier</li>
                <li>La précision avant la vitesse</li>
                <li>Entraînez-vous chaque jour</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
