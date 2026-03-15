"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type Mode = "timer" | "stopwatch";

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
  const ms = Math.floor((totalMs % 1000) / 10);
  if (h > 0) return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

function formatTimerDisplay(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Minuteur() {
  const [mode, setMode] = useState<Mode>("timer");

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState("5");
  const [timerSeconds, setTimerSeconds] = useState("0");
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  // Stopwatch state
  const [swElapsed, setSwElapsed] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const swStartRef = useRef(0);
  const swAccumulatedRef = useRef(0);

  // Play alarm sound using Web Audio API
  const playAlarm = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
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
      // Audio not supported
    }
  }, []);

  // Timer logic
  const startTimer = useCallback(() => {
    const totalSeconds = (parseInt(timerMinutes) || 0) * 60 + (parseInt(timerSeconds) || 0);
    if (totalSeconds <= 0) return;
    setTimerRemaining(totalSeconds);
    setTimerDone(false);
    setTimerRunning(true);

    const endTime = Date.now() + totalSeconds * 1000;
    timerRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimerRemaining(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimerRunning(false);
        setTimerDone(true);
        playAlarm();
      }
    }, 100);
  }, [timerMinutes, timerSeconds, playAlarm]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerDone(false);
    const totalSeconds = (parseInt(timerMinutes) || 0) * 60 + (parseInt(timerSeconds) || 0);
    setTimerRemaining(totalSeconds);
  }, [timerMinutes, timerSeconds]);

  const applyPreset = useCallback((seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerDone(false);
    setTimerMinutes(Math.floor(seconds / 60).toString());
    setTimerSeconds((seconds % 60).toString());
    setTimerRemaining(seconds);
  }, []);

  // Stopwatch logic
  const startStopwatch = useCallback(() => {
    setSwRunning(true);
    swStartRef.current = Date.now();
    swRef.current = setInterval(() => {
      setSwElapsed(swAccumulatedRef.current + (Date.now() - swStartRef.current));
    }, 10);
  }, []);

  const stopStopwatch = useCallback(() => {
    if (swRef.current) clearInterval(swRef.current);
    swAccumulatedRef.current += Date.now() - swStartRef.current;
    setSwRunning(false);
  }, []);

  const resetStopwatch = useCallback(() => {
    if (swRef.current) clearInterval(swRef.current);
    setSwRunning(false);
    setSwElapsed(0);
    swAccumulatedRef.current = 0;
    setLaps([]);
  }, []);

  const addLap = useCallback(() => {
    setLaps((prev) => [swElapsed, ...prev]);
  }, [swElapsed]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (swRef.current) clearInterval(swRef.current);
      if (audioRef.current) audioRef.current.close();
    };
  }, []);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Outils</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            <span style={{ color: "var(--primary)" }}>Minuteur</span> et chronometre
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Compte a rebours avec alarme sonore et chronometre avec tours. Simple, rapide, gratuit.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
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
                  Chronometre
                </button>
              </div>
            </div>

            {mode === "timer" && (
              <>
                {/* Presets */}
                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Preselections</h2>
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
                {!timerRunning && !timerDone && (
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Duree personnalisee</h2>
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <div className="text-center">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Minutes</label>
                        <input type="number" min="0" max="999" value={timerMinutes} onChange={(e) => { setTimerMinutes(e.target.value); setTimerRemaining((parseInt(e.target.value) || 0) * 60 + (parseInt(timerSeconds) || 0)); }}
                          className="mt-2 w-24 rounded-xl border px-4 py-3 text-center text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                      </div>
                      <span className="mt-6 text-3xl font-bold" style={{ color: "var(--muted)" }}>:</span>
                      <div className="text-center">
                        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Secondes</label>
                        <input type="number" min="0" max="59" value={timerSeconds} onChange={(e) => { setTimerSeconds(e.target.value); setTimerRemaining((parseInt(timerMinutes) || 0) * 60 + (parseInt(e.target.value) || 0)); }}
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
                    {formatTimerDisplay(timerRemaining)}
                  </p>
                  {timerDone && <p className="mt-4 text-lg font-semibold text-white">Temps ecoule !</p>}
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-3">
                  {!timerRunning && !timerDone && (
                    <button onClick={startTimer} className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--primary)" }}>
                      Demarrer
                    </button>
                  )}
                  {timerRunning && (
                    <button onClick={stopTimer} className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "var(--accent)" }}>
                      Pause
                    </button>
                  )}
                  <button onClick={resetTimer} className="rounded-xl border px-8 py-3 text-sm font-semibold transition-all" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
                    Reinitialiser
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
                      {swElapsed > 0 ? "Reprendre" : "Demarrer"}
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
                    Reinitialiser
                  </button>
                </div>

                {/* Laps */}
                {laps.length > 0 && (
                  <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                    <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Tours</h2>
                    <div className="mt-4 space-y-2">
                      {laps.map((lap, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2" style={{ background: "var(--surface-alt)" }}>
                          <span className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Tour {laps.length - i}</span>
                          <span className="font-mono text-sm font-bold" style={{ color: "var(--primary)" }}>{formatTime(lap)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Minuteur et chronometre en ligne</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Minuteur</strong> : Definissez une duree et lancez le compte a rebours. Une alarme sonore retentit quand le temps est ecoule. Ideal pour la cuisine, le sport, le travail (methode Pomodoro).</p>
                <p><strong className="text-[var(--foreground)]">Chronometre</strong> : Mesurez le temps ecoule avec precision. Fonction tour pour enregistrer des temps intermediaires. Parfait pour le sport et les mesures de performance.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Methode Pomodoro</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>25 min de travail concentre</li>
                <li>5 min de pause courte</li>
                <li>Repetez 4 fois</li>
                <li>15-30 min de pause longue</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
