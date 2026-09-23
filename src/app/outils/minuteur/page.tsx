"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type Mode = "timer" | "stopwatch";
type TimerStatus = "idle" | "running" | "paused" | "done";

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "25 min", seconds: 1500 },
  { label: "30 min", seconds: 1800 },
  { label: "60 min", seconds: 3600 },
];

function formatTime(totalMs: number): string {
  const totalSeconds = Math.floor(totalMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const cs = Math.floor((totalMs % 1000) / 10);
  if (h > 0) return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${cs.toString().padStart(2, "0")}`;
}

function formatTimerDisplay(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function inputToSeconds(minutes: string, seconds: string): number {
  return Math.max(0, parseInt(minutes) || 0) * 60 + Math.max(0, parseInt(seconds) || 0);
}

export default function Minuteur() {
  const [mode, setMode] = useState<Mode>("timer");

  // Minuteur : l'heure de fin est mémorisée (horodatage), pas de comptage de ticks,
  // donc pas de dérive quand l'onglet est en arrière-plan.
  const [timerMinutes, setTimerMinutes] = useState("5");
  const [timerSeconds, setTimerSeconds] = useState("0");
  const [timerRemainingMs, setTimerRemainingMs] = useState(300_000);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>("idle");
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerEndRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);

  // Chronomètre
  const [swElapsed, setSwElapsed] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const swStartRef = useRef(0);
  const swAccumulatedRef = useRef(0);

  // Crée ou réactive le contexte audio pendant un clic (sinon le navigateur peut bloquer l'alarme)
  const prepareAlerts = useCallback(() => {
    try {
      if (!audioRef.current) audioRef.current = new AudioContext();
      if (audioRef.current.state === "suspended") void audioRef.current.resume();
    } catch {
      // Web Audio non disponible
    }
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const playAlarm = useCallback(() => {
    try {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
      const playBeep = (time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        osc.start(time);
        osc.stop(time + 0.3);
      };
      for (let i = 0; i < 4; i++) playBeep(ctx.currentTime + i * 0.5);
    } catch {
      // Web Audio non disponible
    }
    if (typeof Notification !== "undefined" && Notification.permission === "granted" && document.hidden) {
      try {
        new Notification("Minuteur", { body: "Temps écoulé !" });
      } catch {
        // Constructeur Notification indisponible (Chrome Android)
      }
    }
  }, []);

  const clearTimerHandles = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    timerIntervalRef.current = null;
    timerTimeoutRef.current = null;
  }, []);

  const finishTimer = useCallback(() => {
    if (timerEndRef.current === 0) return;
    timerEndRef.current = 0;
    clearTimerHandles();
    setTimerRemainingMs(0);
    setTimerStatus("done");
    playAlarm();
  }, [clearTimerHandles, playAlarm]);

  const startTimer = useCallback(() => {
    const ms = timerStatus === "paused" ? timerRemainingMs : inputToSeconds(timerMinutes, timerSeconds) * 1000;
    if (ms <= 0) return;
    prepareAlerts();
    clearTimerHandles();
    timerEndRef.current = Date.now() + ms;
    setTimerRemainingMs(ms);
    setTimerStatus("running");
    timerIntervalRef.current = setInterval(() => {
      const left = timerEndRef.current - Date.now();
      if (left <= 0) finishTimer();
      else setTimerRemainingMs(left);
    }, 200);
    // Minuterie unique non répétée : moins bridée par les navigateurs en arrière-plan qu'un intervalle
    timerTimeoutRef.current = setTimeout(finishTimer, ms);
  }, [timerStatus, timerRemainingMs, timerMinutes, timerSeconds, prepareAlerts, clearTimerHandles, finishTimer]);

  const pauseTimer = useCallback(() => {
    if (timerEndRef.current === 0) return;
    const left = Math.max(0, timerEndRef.current - Date.now());
    timerEndRef.current = 0;
    clearTimerHandles();
    setTimerRemainingMs(left);
    setTimerStatus("paused");
  }, [clearTimerHandles]);

  const resetTimer = useCallback(() => {
    timerEndRef.current = 0;
    clearTimerHandles();
    setTimerStatus("idle");
    setTimerRemainingMs(inputToSeconds(timerMinutes, timerSeconds) * 1000);
  }, [clearTimerHandles, timerMinutes, timerSeconds]);

  const applyPreset = useCallback((seconds: number) => {
    timerEndRef.current = 0;
    clearTimerHandles();
    setTimerStatus("idle");
    setTimerMinutes(Math.floor(seconds / 60).toString());
    setTimerSeconds((seconds % 60).toString());
    setTimerRemainingMs(seconds * 1000);
  }, [clearTimerHandles]);

  // Chronomètre
  const startStopwatch = useCallback(() => {
    setSwRunning(true);
    swStartRef.current = Date.now();
    swRef.current = setInterval(() => {
      setSwElapsed(swAccumulatedRef.current + (Date.now() - swStartRef.current));
    }, 10);
  }, []);

  const stopStopwatch = useCallback(() => {
    if (swRef.current) clearInterval(swRef.current);
    swRef.current = null;
    swAccumulatedRef.current += Date.now() - swStartRef.current;
    setSwElapsed(swAccumulatedRef.current);
    setSwRunning(false);
  }, []);

  const resetStopwatch = useCallback(() => {
    if (swRef.current) clearInterval(swRef.current);
    swRef.current = null;
    setSwRunning(false);
    setSwElapsed(0);
    swAccumulatedRef.current = 0;
    setLaps([]);
  }, []);

  const addLap = useCallback(() => {
    const now = swAccumulatedRef.current + (Date.now() - swStartRef.current);
    setLaps((prev) => [now, ...prev]);
  }, []);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      if (swRef.current) clearInterval(swRef.current);
      if (audioRef.current) void audioRef.current.close();
    };
  }, []);

  const timerDisplay = formatTimerDisplay(Math.ceil(timerRemainingMs / 1000));
  const timerRunning = timerStatus === "running";
  const timerDone = timerStatus === "done";

  // Temps restant dans le titre de l'onglet, pratique quand la page est en arrière-plan
  useEffect(() => {
    if (!timerRunning && !timerDone) return;
    const original = document.title;
    document.title = timerDone ? "Temps écoulé ! – Minuteur" : `${timerDisplay} – Minuteur`;
    return () => {
      document.title = original;
    };
  }, [timerRunning, timerDone, timerDisplay]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Outils</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            <span style={{ color: "var(--primary)" }}>Minuteur</span> et chronomètre
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Compte à rebours avec alarme sonore et chronomètre avec tours. Simple, rapide, gratuit.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex gap-2">
                <button onClick={() => setMode("timer")}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                  style={{ background: mode === "timer" ? "var(--primary)" : "var(--surface-alt)", color: mode === "timer" ? "white" : "var(--muted)" }}>
                  Minuteur
                </button>
                <button onClick={() => setMode("stopwatch")}
                  className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                  style={{ background: mode === "stopwatch" ? "var(--primary)" : "var(--surface-alt)", color: mode === "stopwatch" ? "white" : "var(--muted)" }}>
                  Chronomètre
                </button>
              </div>
            </div>

            {mode === "timer" && (
              <>
                {/* Presets */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Présélections</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <button key={p.seconds} onClick={() => applyPreset(p.seconds)}
                        className="rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:opacity-80"
                        style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timer input */}
                {timerStatus === "idle" && (
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Durée personnalisée</h2>
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <div className="text-center">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Minutes</label>
                        <input type="number" min="0" max="999" value={timerMinutes} onChange={(e) => { setTimerMinutes(e.target.value); setTimerRemainingMs(inputToSeconds(e.target.value, timerSeconds) * 1000); }}
                          className="mt-2 w-24 rounded-xl border px-4 py-3 text-center text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                      </div>
                      <span className="mt-6 text-3xl font-bold" style={{ color: "var(--muted)" }}>:</span>
                      <div className="text-center">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Secondes</label>
                        <input type="number" min="0" max="59" value={timerSeconds} onChange={(e) => { setTimerSeconds(e.target.value); setTimerRemainingMs(inputToSeconds(timerMinutes, e.target.value) * 1000); }}
                          className="mt-2 w-24 rounded-xl border px-4 py-3 text-center text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Timer display */}
                <div className="rounded-2xl border p-10 text-center" style={{
                  background: timerDone ? "var(--accent)" : "var(--surface)",
                  borderColor: timerDone ? "var(--accent)" : "var(--border)",
                }}>
                  <p className="text-8xl font-bold tabular-nums md:text-9xl" style={{
                    fontFamily: "var(--font-display)",
                    color: timerDone ? "white" : "var(--primary)",
                  }}>
                    {timerDisplay}
                  </p>
                  {timerDone && <p className="mt-4 text-lg font-semibold text-white">Temps écoulé !</p>}
                  {timerStatus === "paused" && <p className="mt-4 text-sm font-semibold" style={{ color: "var(--muted)" }}>En pause</p>}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  {(timerStatus === "idle" || timerStatus === "paused") && (
                    <button onClick={startTimer} className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                      {timerStatus === "paused" ? "Reprendre" : "Démarrer"}
                    </button>
                  )}
                  {timerRunning && (
                    <button onClick={pauseTimer} className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--accent)" }}>
                      Pause
                    </button>
                  )}
                  <button onClick={resetTimer} className="rounded-xl border px-8 py-3 text-sm font-semibold transition-all" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                    Réinitialiser
                  </button>
                </div>
              </>
            )}

            {mode === "stopwatch" && (
              <>
                {/* Stopwatch display */}
                <div className="rounded-2xl border p-10 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-7xl font-bold tabular-nums md:text-8xl" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {formatTime(swElapsed)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  {!swRunning ? (
                    <button onClick={startStopwatch} className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                      {swElapsed > 0 ? "Reprendre" : "Démarrer"}
                    </button>
                  ) : (
                    <>
                      <button onClick={stopStopwatch} className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--accent)" }}>
                        Pause
                      </button>
                      <button onClick={addLap} className="rounded-xl border px-8 py-3 text-sm font-semibold transition-all" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                        Tour
                      </button>
                    </>
                  )}
                  <button onClick={resetStopwatch} className="rounded-xl border px-8 py-3 text-sm font-semibold transition-all" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                    Réinitialiser
                  </button>
                </div>

                {/* Laps */}
                {laps.length > 0 && (
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Tours</h2>
                    <div className="mt-4 space-y-2">
                      {laps.map((lap, i) => {
                        const previous = laps[i + 1] ?? 0;
                        return (
                          <div key={laps.length - i} className="flex items-center justify-between rounded-xl px-4 py-2" style={{ background: "var(--surface-alt)" }}>
                            <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Tour {laps.length - i}</span>
                            <span className="font-mono text-sm font-bold" style={{ color: "var(--primary)" }}>
                              +{formatTime(lap - previous)}
                              <span className="ml-3 text-xs font-normal" style={{ color: "var(--muted)" }}>{formatTime(lap)}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Minuteur et chronomètre en ligne</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Minuteur</strong> : définissez une durée et lancez le compte à rebours. Une alarme sonore retentit quand le temps est écoulé. Idéal pour la cuisine, le sport, le travail (méthode Pomodoro).</p>
                <p><strong className="text-[var(--foreground)]">Chronomètre</strong> : mesurez le temps écoulé avec précision. La fonction tour enregistre des temps intermédiaires (temps du tour et cumul). Parfait pour le sport et les mesures de performance.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le minuteur et le chronomètre en ligne
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Notre outil combine un minuteur (compte à rebours) et un chronomètre dans une interface simple et gratuite.
                  Parfait pour la méthode Pomodoro, la cuisine, le sport ou toute activité chronométrée.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Minuteur</strong> : choisissez une présélection (1, 5, 25 min…) ou saisissez une durée personnalisée. Pause et reprise conservent le temps restant.</li>
                  <li><strong className="text-[var(--foreground)]">Alarme sonore</strong> : un signal sonore retentit automatiquement à la fin du compte à rebours, avec une notification si vous l&apos;avez autorisée.</li>
                  <li><strong className="text-[var(--foreground)]">Chronomètre</strong> : mesurez le temps écoulé au centième de seconde.</li>
                  <li><strong className="text-[var(--foreground)]">Fonction tours</strong> : enregistrez des temps intermédiaires pour comparer vos performances.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qu&apos;est-ce que la méthode Pomodoro ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La technique Pomodoro est une méthode de gestion du temps inventée par Francesco Cirillo à la fin des années 1980. Elle consiste à travailler pendant 25 minutes, puis à prendre une pause de 5 minutes. Après 4 cycles, on prend une pause longue de 15 à 30 minutes. Utilisez notre minuteur avec la présélection 25 min, ou notre timer Pomodoro dédié qui enchaîne les sessions.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Le minuteur fonctionne-t-il en arrière-plan ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, le minuteur se base sur l&apos;heure de fin et non sur un comptage de secondes : il reste exact si vous changez d&apos;onglet, et le temps restant s&apos;affiche dans le titre de l&apos;onglet. L&apos;alarme sonore se déclenche à la fin du compte à rebours (les navigateurs peuvent la retarder d&apos;une seconde environ en arrière-plan). Autorisez les notifications pour être prévenu même si l&apos;onglet est masqué, et vérifiez que le son n&apos;est pas coupé. Sur mobile, gardez l&apos;écran allumé : un téléphone en veille peut suspendre la page.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la précision du chronomètre ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le chronomètre calcule le temps écoulé à partir de l&apos;horloge du système (<code style={{ color: "var(--primary)" }}>Date.now()</code>) et rafraîchit l&apos;affichage toutes les 10 millisecondes. La précision affichée est au centième de seconde, ce qui suffit pour la plupart des usages (sport, cuisine, mesures de performance), mais ne remplace pas un chronométrage officiel.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Méthode Pomodoro</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>25 min de travail concentré</li>
                <li>5 min de pause courte</li>
                <li>Répétez 4 fois</li>
                <li>15 à 30 min de pause longue</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
