"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type PomodoroMode = "work" | "shortBreak" | "longBreak";

interface Settings {
  work: number;
  shortBreak: number;
  longBreak: number;
  sessionsBeforeLong: number;
  autoStart: boolean;
}

interface DayStats {
  completedSessions: number;
  totalWorkSeconds: number;
  totalBreakSeconds: number;
}

const DEFAULT_SETTINGS: Settings = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsBeforeLong: 4,
  autoStart: true,
};

const MODE_LABELS: Record<PomodoroMode, string> = {
  work: "Travail",
  shortBreak: "Pause courte",
  longBreak: "Pause longue",
};

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}min`;
  return `${m} min`;
}

export default function Pomodoro() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_SETTINGS.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [stats, setStats] = useState<DayStats>({
    completedSessions: 0,
    totalWorkSeconds: 0,
    totalBreakSeconds: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Derive total duration for current mode
  const totalDuration = (() => {
    switch (mode) {
      case "work":
        return settings.work * 60;
      case "shortBreak":
        return settings.shortBreak * 60;
      case "longBreak":
        return settings.longBreak * 60;
    }
  })();

  // SVG circle calculations
  const RADIUS = 140;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = totalDuration > 0 ? timeRemaining / totalDuration : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  // Color based on mode
  const modeColor = mode === "work" ? "var(--primary)" : "var(--accent)";
  const modeBgLight = mode === "work" ? "rgba(13, 79, 60, 0.08)" : "rgba(232, 150, 62, 0.08)";

  // Play beep sound via Web Audio API
  const playBeep = useCallback(() => {
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const playTone = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
        osc.start(time);
        osc.stop(time + 0.4);
      };
      // Different sounds for work end vs break end
      if (mode === "work") {
        // Descending tone = relax
        playTone(ctx.currentTime, 880);
        playTone(ctx.currentTime + 0.5, 660);
        playTone(ctx.currentTime + 1.0, 440);
      } else {
        // Ascending tone = back to work
        playTone(ctx.currentTime, 440);
        playTone(ctx.currentTime + 0.5, 660);
        playTone(ctx.currentTime + 1.0, 880);
      }
    } catch {
      // Audio not supported
    }
  }, [mode]);

  // Switch to next mode
  const goToNextMode = useCallback(() => {
    if (mode === "work") {
      // Update stats
      setStats((prev) => ({
        ...prev,
        completedSessions: prev.completedSessions + 1,
        totalWorkSeconds: prev.totalWorkSeconds + settings.work * 60,
      }));
      const newCount = sessionCount + 1;
      setSessionCount(newCount);

      if (newCount % settings.sessionsBeforeLong === 0) {
        setMode("longBreak");
        setTimeRemaining(settings.longBreak * 60);
      } else {
        setMode("shortBreak");
        setTimeRemaining(settings.shortBreak * 60);
      }
    } else {
      // Break finished
      setStats((prev) => ({
        ...prev,
        totalBreakSeconds:
          prev.totalBreakSeconds +
          (mode === "shortBreak" ? settings.shortBreak : settings.longBreak) * 60,
      }));
      setMode("work");
      setTimeRemaining(settings.work * 60);
    }
  }, [mode, sessionCount, settings]);

  // Stop the timer interval
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Timer tick logic
  const startInterval = useCallback(() => {
    clearTimer();
    endTimeRef.current = Date.now() + timeRemaining * 1000;
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        clearTimer();
        setIsRunning(false);
      }
    }, 100);
  }, [timeRemaining, clearTimer]);

  // Handle timer reaching zero
  useEffect(() => {
    if (timeRemaining === 0 && !isRunning && intervalRef.current === null) {
      // Only trigger transition if we were previously running (endTimeRef > 0)
      if (endTimeRef.current > 0) {
        playBeep();
        endTimeRef.current = 0;

        if (settings.autoStart) {
          // Small delay to let the beep play, then auto-advance
          const timeout = setTimeout(() => {
            goToNextMode();
          }, 1500);
          return () => clearTimeout(timeout);
        } else {
          goToNextMode();
        }
      }
    }
  }, [timeRemaining, isRunning, playBeep, goToNextMode, settings.autoStart]);

  // Auto-start next session
  useEffect(() => {
    if (settings.autoStart && timeRemaining > 0 && !isRunning && endTimeRef.current === 0 && sessionCount > 0) {
      // Delay auto-start so user can see the mode change
      const timeout = setTimeout(() => {
        setIsRunning(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [mode, timeRemaining, isRunning, settings.autoStart, sessionCount]);

  // Start/stop the interval when isRunning changes
  useEffect(() => {
    if (isRunning) {
      startInterval();
    } else {
      clearTimer();
    }
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimer();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, [clearTimer]);

  // Handlers
  const handleStart = () => {
    if (timeRemaining <= 0) return;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    // Recalculate remaining from end time
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setTimeRemaining(remaining);
  };

  const handleReset = () => {
    setIsRunning(false);
    endTimeRef.current = 0;
    switch (mode) {
      case "work":
        setTimeRemaining(settings.work * 60);
        break;
      case "shortBreak":
        setTimeRemaining(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTimeRemaining(settings.longBreak * 60);
        break;
    }
  };

  const handleSkip = () => {
    setIsRunning(false);
    endTimeRef.current = 0;
    goToNextMode();
  };

  const handleModeSwitch = (newMode: PomodoroMode) => {
    setIsRunning(false);
    endTimeRef.current = 0;
    setMode(newMode);
    switch (newMode) {
      case "work":
        setTimeRemaining(settings.work * 60);
        break;
      case "shortBreak":
        setTimeRemaining(settings.shortBreak * 60);
        break;
      case "longBreak":
        setTimeRemaining(settings.longBreak * 60);
        break;
    }
  };

  const handleResetStats = () => {
    setStats({ completedSessions: 0, totalWorkSeconds: 0, totalBreakSeconds: 0 });
    setSessionCount(0);
  };

  const updateSetting = (key: keyof Settings, value: number | boolean) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      // Update current timer if not running
      if (!isRunning) {
        if (key === "work" && mode === "work") setTimeRemaining((value as number) * 60);
        if (key === "shortBreak" && mode === "shortBreak") setTimeRemaining((value as number) * 60);
        if (key === "longBreak" && mode === "longBreak") setTimeRemaining((value as number) * 60);
      }
      return updated;
    });
  };

  // Session dots
  const sessionDots = Array.from({ length: settings.sessionsBeforeLong }, (_, i) => i);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Productivite
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Chronometre <span style={{ color: "var(--primary)" }}>Pomodoro</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Boostez votre productivite avec la methode Pomodoro. Sessions de travail concentre
            alternees avec des pauses regulieres.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode selector */}
            <div
              className="animate-fade-up stagger-3 rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex gap-2">
                {(["work", "shortBreak", "longBreak"] as PomodoroMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleModeSwitch(m)}
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
                    style={{
                      background:
                        mode === m
                          ? m === "work"
                            ? "var(--primary)"
                            : "var(--accent)"
                          : "var(--surface-alt)",
                      color: mode === m ? "white" : "var(--muted)",
                    }}
                  >
                    {MODE_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer circle */}
            <div
              className="animate-fade-up stagger-4 rounded-2xl border p-8 md:p-12"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex flex-col items-center">
                {/* SVG circular timer */}
                <div className="relative" style={{ width: 320, height: 320 }}>
                  <svg
                    width="320"
                    height="320"
                    viewBox="0 0 320 320"
                    style={{ transform: "rotate(-90deg)" }}
                  >
                    {/* Background circle */}
                    <circle
                      cx="160"
                      cy="160"
                      r={RADIUS}
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="160"
                      cy="160"
                      r={RADIUS}
                      fill="none"
                      stroke={modeColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={strokeDashoffset}
                      style={{
                        transition: isRunning ? "stroke-dashoffset 0.3s linear" : "stroke-dashoffset 0.5s ease",
                      }}
                    />
                  </svg>
                  {/* Center content */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ transform: "none" }}
                  >
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.15em]"
                      style={{ color: modeColor }}
                    >
                      {MODE_LABELS[mode]}
                    </span>
                    <span
                      className="mt-2 text-7xl font-bold tabular-nums md:text-8xl"
                      style={{ fontFamily: "var(--font-display)", color: modeColor }}
                    >
                      {formatTime(timeRemaining)}
                    </span>
                    {/* Session dots */}
                    <div className="mt-4 flex gap-2">
                      {sessionDots.map((i) => (
                        <div
                          key={i}
                          className="rounded-full"
                          style={{
                            width: 10,
                            height: 10,
                            background:
                              i < sessionCount % settings.sessionsBeforeLong
                                ? modeColor
                                : "var(--border)",
                            transition: "background 0.3s ease",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-8 flex items-center gap-3">
                  {!isRunning ? (
                    <button
                      onClick={handleStart}
                      className="rounded-xl px-10 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: modeColor }}
                    >
                      {timeRemaining < totalDuration && timeRemaining > 0 ? "Reprendre" : "Demarrer"}
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="rounded-xl px-10 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "var(--accent)" }}
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all hover:opacity-80"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleSkip}
                    className="rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all hover:opacity-80"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div
              className="animate-fade-up stagger-5 rounded-2xl border p-6"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--accent)" }}
                >
                  Statistiques du jour
                </h2>
                {stats.completedSessions > 0 && (
                  <button
                    onClick={handleResetStats}
                    className="text-xs font-semibold transition-all hover:opacity-70"
                    style={{ color: "var(--muted)" }}
                  >
                    Reinitialiser
                  </button>
                )}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: modeBgLight }}
                >
                  <p
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
                  >
                    {stats.completedSessions}
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                    Sessions
                  </p>
                </div>
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: modeBgLight }}
                >
                  <p
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
                  >
                    {formatDuration(stats.totalWorkSeconds)}
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                    Travail
                  </p>
                </div>
                <div
                  className="rounded-xl p-4 text-center"
                  style={{ background: modeBgLight }}
                >
                  <p
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}
                  >
                    {formatDuration(stats.totalBreakSeconds)}
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                    Pauses
                  </p>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div
              className="rounded-2xl border"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.15em]"
                  style={{ color: "var(--accent)" }}
                >
                  Parametres
                </h2>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    color: "var(--muted)",
                    transform: showSettings ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {showSettings && (
                <div className="border-t px-6 pb-6 pt-4" style={{ borderColor: "var(--border)" }}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Travail (min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={settings.work}
                        onChange={(e) => updateSetting("work", Math.max(1, parseInt(e.target.value) || 1))}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-center text-lg font-bold"
                        style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                      />
                    </div>
                    <div>
                      <label
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Pause courte (min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={settings.shortBreak}
                        onChange={(e) =>
                          updateSetting("shortBreak", Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-center text-lg font-bold"
                        style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                      />
                    </div>
                    <div>
                      <label
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Pause longue (min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={settings.longBreak}
                        onChange={(e) =>
                          updateSetting("longBreak", Math.max(1, parseInt(e.target.value) || 1))
                        }
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-center text-lg font-bold"
                        style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--muted)" }}
                      >
                        Sessions avant pause longue
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="10"
                        value={settings.sessionsBeforeLong}
                        onChange={(e) =>
                          updateSetting(
                            "sessionsBeforeLong",
                            Math.max(2, parseInt(e.target.value) || 2)
                          )
                        }
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-center text-lg font-bold"
                        style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 w-full"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <input
                          type="checkbox"
                          checked={settings.autoStart}
                          onChange={(e) => updateSetting("autoStart", e.target.checked)}
                          className="h-4 w-4 rounded accent-[#0d4f3c]"
                        />
                        <span className="text-sm font-semibold">Enchainement auto</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SEO content */}
            <div
              className="rounded-2xl border p-8"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                La methode Pomodoro
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  <strong className="text-[var(--foreground)]">Qu&apos;est-ce que la technique Pomodoro ?</strong>{" "}
                  Inventee par Francesco Cirillo dans les annees 1980, la methode Pomodoro est une
                  technique de gestion du temps qui decoupe le travail en intervalles de 25 minutes
                  (appeles &laquo; pomodoros &raquo;), separes par de courtes pauses.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Comment ca marche ?</strong> Choisissez
                  une tache, lancez le timer de 25 minutes et travaillez sans interruption. A la fin,
                  prenez une pause de 5 minutes. Apres 4 pomodoros, accordez-vous une pause longue de
                  15 a 30 minutes.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Pourquoi ca fonctionne ?</strong> En
                  fractionnant le travail, vous maintenez un haut niveau de concentration, reduisez la
                  fatigue mentale et gardez une vision claire de votre productivite grace au compteur
                  de sessions.
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
              <h3
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Conseils Pomodoro
              </h3>
              <ul
                className="mt-3 space-y-2 text-xs leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <li>Definissez votre tache avant de demarrer</li>
                <li>Evitez toute distraction pendant un pomodoro</li>
                <li>Notez les interruptions pour les traiter plus tard</li>
                <li>Utilisez les pauses pour bouger et vous hydrater</li>
                <li>Ajustez les durees selon votre rythme</li>
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
                Raccourcis
              </h3>
              <ul
                className="mt-3 space-y-2 text-xs leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <li>
                  <strong className="text-[var(--foreground)]">4 sessions</strong> = 1 cycle complet
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">25 + 5</strong> = 30 min par pomodoro
                </li>
                <li>
                  <strong className="text-[var(--foreground)]">4 cycles</strong> = ~2h de travail
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
