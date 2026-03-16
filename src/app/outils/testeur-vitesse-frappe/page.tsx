"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const TEXTS = [
  "Le petit chat gris dormait paisiblement sur le rebord de la fenetre. Dehors, la pluie tombait doucement sur les toits de la ville endormie. Les passants pressaient le pas, proteges par leurs parapluies colores. Dans la boulangerie du coin, le boulanger preparait deja les croissants du lendemain matin.",
  "La science nous apprend que le cerveau humain est capable de traiter des milliers de informations chaque seconde. Cette capacite extraordinaire nous permet de resoudre des problemes complexes, de creer des oeuvres artistiques et de communiquer avec les autres. Chaque jour, nous utilisons cette faculte sans meme y penser.",
  "Les montagnes se dressaient fierement sous le ciel bleu. Le vent soufflait dans les arbres, faisant danser les feuilles dorees de automne. Un ruisseau serpentait entre les rochers, emportant avec lui les souvenirs de ete. Les randonneurs profitaient des derniers rayons de soleil avant le retour du froid.",
  "La technologie a transforme notre facon de vivre et de travailler. Nos telephones sont devenus des outils indispensables qui nous connectent au monde entier. Les applications nous aident a organiser notre quotidien, a apprendre de nouvelles competences et a rester en contact avec nos proches, ou que nous soyons dans le monde.",
  "Dans la cuisine, les aromes se melaient pour creer une symphonie de saveurs. La grand-mere preparait son fameux gateau au chocolat, suivant la recette transmise de generation en generation. Les enfants attendaient impatiemment, les yeux brillants de gourmandise, que le dessert soit enfin pret a etre decoupe et partage.",
  "Le voyage est une source inepuisable de decouverte et de enrichissement personnel. Chaque nouvelle destination nous offre une perspective differente sur le monde et ses cultures. Les rencontres que nous faisons en chemin deviennent souvent des souvenirs inoubliables qui marquent notre vie pour toujours et changent notre vision des choses.",
  "La musique accompagne les etres humains depuis la nuit des temps. Elle exprime nos joies, nos peines, nos espoirs et nos reves les plus profonds. Que ce soit le son du piano, la melodie du violon ou le rythme de la guitare, chaque instrument raconte une histoire unique et touche notre coeur de maniere singuliere.",
  "Le jardin etait un veritable havre de paix au milieu de la ville. Les roses rouges et blanches bordaient les allees de gravier. Un vieux banc en bois invitait les visiteurs a prendre un moment de repos. Les oiseaux chantaient dans les branches du grand chene, creant une atmosphere sereine et apaisante.",
];

type GameState = "idle" | "running" | "finished";
type Duration = 30 | 60 | 120;

export default function TesteurVitesseFrappe() {
  const [duration, setDuration] = useState<Duration>(60);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [typedChars, setTypedChars] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [finalWpm, setFinalWpm] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(0);
  const [finalErrors, setFinalErrors] = useState(0);
  const [finalChars, setFinalChars] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentText = TEXTS[currentTextIndex];

  // Pick a random text that is different from the current one
  const pickNewText = useCallback(() => {
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * TEXTS.length);
    } while (newIndex === currentTextIndex && TEXTS.length > 1);
    setCurrentTextIndex(newIndex);
  }, [currentTextIndex]);

  // Real-time WPM calculation
  const currentWpm = useMemo(() => {
    if (gameState !== "running") return 0;
    const elapsed = (duration - timeLeft);
    if (elapsed <= 0) return 0;
    const correctChars = typedChars.split("").filter((ch, i) => ch === currentText[i]).length;
    const words = correctChars / 5;
    return Math.round((words / elapsed) * 60);
  }, [gameState, duration, timeLeft, typedChars, currentText]);

  // Real-time accuracy
  const currentAccuracy = useMemo(() => {
    if (totalTyped === 0) return 100;
    return Math.round(((totalTyped - errors) / totalTyped) * 100);
  }, [totalTyped, errors]);

  // End the game
  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("finished");

    const elapsed = duration;
    const correctChars = typedChars.split("").filter((ch, i) => ch === currentText[i]).length;
    const words = correctChars / 5;
    const wpm = Math.round((words / elapsed) * 60);

    setFinalWpm(wpm);
    setFinalAccuracy(totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100);
    setFinalErrors(errors);
    setFinalChars(totalTyped);
  }, [duration, typedChars, currentText, totalTyped, errors]);

  // Start the timer on first keypress
  const startGame = useCallback(() => {
    setGameState("running");
    startTimeRef.current = Date.now();
    setTimeLeft(duration);

    const endTime = Date.now() + duration * 1000;
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        // We'll call endGame via effect
      }
    }, 100);
  }, [duration]);

  // End game when time runs out
  useEffect(() => {
    if (gameState === "running" && timeLeft <= 0) {
      endGame();
    }
  }, [timeLeft, gameState, endGame]);

  // Handle typing input
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (gameState === "finished") return;

      const value = e.target.value;

      // Start game on first character
      if (gameState === "idle" && value.length > 0) {
        startGame();
      }

      // Count new errors
      if (value.length > typedChars.length) {
        const newCharIndex = value.length - 1;
        setTotalTyped((prev) => prev + 1);
        if (newCharIndex < currentText.length && value[newCharIndex] !== currentText[newCharIndex]) {
          setErrors((prev) => prev + 1);
        }
      }

      setTypedChars(value);
    },
    [gameState, typedChars, currentText, startGame]
  );

  // Reset everything
  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("idle");
    setTypedChars("");
    setTimeLeft(duration);
    setErrors(0);
    setTotalTyped(0);
    setFinalWpm(0);
    setFinalAccuracy(0);
    setFinalErrors(0);
    setFinalChars(0);
    pickNewText();
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [duration, pickNewText]);

  // Change duration
  const changeDuration = useCallback(
    (newDuration: Duration) => {
      if (gameState === "running") return;
      setDuration(newDuration);
      setTimeLeft(newDuration);
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
        if (typedChars[i] === char) {
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
        <div className="mx-auto max-w-5xl px-5">
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
            Mesurez votre vitesse de frappe en mots par minute (WPM) et votre precision. Recopiez le
            texte affiche le plus vite possible.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
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
                Duree du test
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
                  Precision
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
                Texte a recopier
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
                  {gameState === "idle" ? "Commencez a taper pour lancer le chrono" : "Continuez a taper..."}
                </h2>
                <textarea
                  ref={inputRef}
                  value={typedChars}
                  onChange={handleInput}
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
                  placeholder="Tapez le texte ci-dessus ici..."
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
                  Resultats du test
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">WPM</p>
                    <p className="mt-1 text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                      {finalWpm}
                    </p>
                  </div>
                  <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Precision</p>
                    <p className="mt-1 text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                      {finalAccuracy}%
                    </p>
                  </div>
                  <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Caracteres</p>
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
                  {finalWpm >= 80 && "Excellent ! Vous etes un dactylographe tres rapide."}
                  {finalWpm >= 50 && finalWpm < 80 && "Tres bien ! Votre vitesse est au-dessus de la moyenne."}
                  {finalWpm >= 30 && finalWpm < 50 && "Pas mal ! Continuez a pratiquer pour ameliorer votre vitesse."}
                  {finalWpm < 30 && "Continuez a vous entrainer, la pratique rend parfait !"}
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
                Test de vitesse de frappe en francais
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  <strong className="text-[var(--foreground)]">Comment ca marche</strong> : Choisissez
                  une duree (30s, 60s ou 120s), puis recopiez le texte affiche le plus rapidement
                  possible. Le chrono demarre automatiquement des la premiere lettre tapee.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">WPM (mots par minute)</strong> : Un
                  &quot;mot&quot; est defini comme 5 caracteres. Seuls les caracteres corrects sont
                  comptes dans le calcul du WPM. La moyenne pour un adulte se situe entre 35 et 45 WPM.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Conseils</strong> : Gardez les yeux sur
                  le texte source plutot que sur votre clavier. Privilegiez la precision a la vitesse :
                  les erreurs penalisent votre score. Pratiquez regulierement pour progresser.
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
                Baremes de vitesse
              </h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Debutant</span>
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
                <li>Precision avant la vitesse</li>
                <li>Entrainez-vous chaque jour</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
