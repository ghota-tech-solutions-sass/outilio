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

function durationMs(mode: PomodoroMode, settings: Settings): number {
  switch (mode) {
    case "work":
      return settings.work * 60_000;
    case "shortBreak":
      return settings.shortBreak * 60_000;
    case "longBreak":
      return settings.longBreak * 60_000;
  }
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h} h ${m.toString().padStart(2, "0")} min`;
  return `${m} min`;
}

// Millisecondes restantes avant l'horodatage donné (appelé uniquement depuis des gestionnaires d'événements)
function msUntil(end: number): number {
  return Math.max(0, end - Date.now());
}

function clampInt(value: string, min: number, max: number): number {
  return Math.min(max, Math.max(min, parseInt(value) || min));
}

export default function Pomodoro() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [mode, setMode] = useState<PomodoroMode>("work");
  // Durée totale de la session en cours et temps restant, en millisecondes
  const [runDurationMs, setRunDurationMs] = useState(DEFAULT_SETTINGS.work * 60_000);
  const [remainingMs, setRemainingMs] = useState(DEFAULT_SETTINGS.work * 60_000);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [stats, setStats] = useState<DayStats>({
    completedSessions: 0,
    totalWorkSeconds: 0,
    totalBreakSeconds: 0,
  });

  // Heure de fin (horodatage) : pas de comptage de ticks, donc pas de dérive en arrière-plan
  const endTimeRef = useRef(0);
  const finishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoStartRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const completeRef = useRef<() => void>(() => {});

  // SVG circle calculations
  const RADIUS = 140;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = runDurationMs > 0 ? Math.min(1, Math.max(0, remainingMs / runDurationMs)) : 1;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  const remainingSeconds = Math.ceil(remainingMs / 1000);

  // Color based on mode
  const modeColor = mode === "work" ? "var(--primary)" : "var(--accent)";
  const modeBgLight = mode === "work" ? "rgba(13, 79, 60, 0.08)" : "rgba(232, 150, 62, 0.08)";

  // Crée ou réactive le contexte audio pendant un clic (sinon le navigateur peut bloquer le son)
  const prepareAlerts = useCallback(() => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      if (audioCtxRef.current.state === "suspended") void audioCtxRef.current.resume();
    } catch {
      // Web Audio non disponible
    }
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const playTones = useCallback((endedMode: PomodoroMode) => {
    try {
      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") void ctx.resume();
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
      // Tonalité descendante = pause, montante = retour au travail
      const freqs = endedMode === "work" ? [880, 660, 440] : [440, 660, 880];
      freqs.forEach((f, i) => playTone(ctx.currentTime + i * 0.5, f));
    } catch {
      // Web Audio non disponible
    }
  }, []);

  const notify = useCallback((body: string) => {
    if (typeof Notification === "undefined" || Notification.permission !== "granted" || !document.hidden) return;
    try {
      new Notification("Pomodoro", { body });
    } catch {
      // Constructeur Notification indisponible (Chrome Android)
    }
  }, []);

  const tick = useCallback(() => {
    if (endTimeRef.current === 0) return;
    const left = endTimeRef.current - Date.now();
    if (left <= 0) {
      endTimeRef.current = 0;
      completeRef.current();
    } else {
      setRemainingMs(left);
    }
  }, []);

  const clearFinishTimeout = () => {
    if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    finishTimeoutRef.current = null;
  };

  const cancelAutoStart = () => {
    if (autoStartRef.current) clearTimeout(autoStartRef.current);
    autoStartRef.current = null;
  };

  const beginRun = (ms: number) => {
    clearFinishTimeout();
    endTimeRef.current = Date.now() + ms;
    setRemainingMs(ms);
    setIsRunning(true);
    // Minuterie unique : plus fiable qu'un intervalle quand l'onglet est en arrière-plan
    finishTimeoutRef.current = setTimeout(tick, ms + 20);
  };

  // Rafraîchissement de l'affichage pendant que le timer tourne
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [isRunning, tick]);

  // Fin d'une session : statistiques, son, passage à la session suivante
  const complete = () => {
    clearFinishTimeout();
    setIsRunning(false);
    playTones(mode);
    let next: PomodoroMode;
    if (mode === "work") {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      setStats((prev) => ({
        ...prev,
        completedSessions: prev.completedSessions + 1,
        totalWorkSeconds: prev.totalWorkSeconds + Math.round(runDurationMs / 1000),
      }));
      next = newCount % settings.sessionsBeforeLong === 0 ? "longBreak" : "shortBreak";
      notify(next === "longBreak" ? "Session terminée : place à la pause longue." : "Session terminée : place à la pause.");
    } else {
      setStats((prev) => ({
        ...prev,
        totalBreakSeconds: prev.totalBreakSeconds + Math.round(runDurationMs / 1000),
      }));
      next = "work";
      notify("Pause terminée : retour au travail.");
    }
    const nextMs = durationMs(next, settings);
    setMode(next);
    setRunDurationMs(nextMs);
    setRemainingMs(nextMs);
    if (settings.autoStart) {
      cancelAutoStart();
      autoStartRef.current = setTimeout(() => {
        autoStartRef.current = null;
        beginRun(nextMs);
      }, 1500);
    }
  };

  useEffect(() => {
    completeRef.current = complete;
  });

  // Nettoyage
  useEffect(() => {
    return () => {
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
      if (autoStartRef.current) clearTimeout(autoStartRef.current);
      if (audioCtxRef.current) void audioCtxRef.current.close();
    };
  }, []);

  // Temps restant dans le titre de l'onglet pendant une session
  useEffect(() => {
    if (!isRunning) return;
    const original = document.title;
    document.title = `${formatTime(remainingSeconds)} – ${MODE_LABELS[mode]}`;
    return () => {
      document.title = original;
    };
  }, [isRunning, remainingSeconds, mode]);

  const stopAll = () => {
    cancelAutoStart();
    clearFinishTimeout();
    endTimeRef.current = 0;
    setIsRunning(false);
  };

  const loadMode = (newMode: PomodoroMode) => {
    const ms = durationMs(newMode, settings);
    setMode(newMode);
    setRunDurationMs(ms);
    setRemainingMs(ms);
  };

  // Handlers
  const handleStart = () => {
    if (remainingMs <= 0) return;
    prepareAlerts();
    cancelAutoStart();
    beginRun(remainingMs);
  };

  const handlePause = () => {
    const left = endTimeRef.current > 0 ? msUntil(endTimeRef.current) : remainingMs;
    stopAll();
    setRemainingMs(left);
  };

  const handleReset = () => {
    stopAll();
    loadMode(mode);
  };

  // Passer : la session en cours n'est pas comptée dans les statistiques
  const handleSkip = () => {
    stopAll();
    loadMode(mode === "work" ? "shortBreak" : "work");
  };

  const handleModeSwitch = (newMode: PomodoroMode) => {
    stopAll();
    loadMode(newMode);
  };

  const handleResetStats = () => {
    setStats({ completedSessions: 0, totalWorkSeconds: 0, totalBreakSeconds: 0 });
    setSessionCount(0);
  };

  const updateSetting = (key: keyof Settings, value: number | boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    // Met à jour le timer affiché s'il n'a pas encore démarré
    const untouched = !isRunning && autoStartRef.current === null && remainingMs === runDurationMs;
    if (untouched && key === mode) {
      const ms = durationMs(mode, updated);
      setRunDurationMs(ms);
      setRemainingMs(ms);
    }
  };

  const isPaused = !isRunning && remainingMs > 0 && remainingMs < runDurationMs;

  // Session dots
  const sessionDots = Array.from({ length: settings.sessionsBeforeLong }, (_, i) => i);
  const filledDots =
    mode === "longBreak" && sessionCount > 0 && sessionCount % settings.sessionsBeforeLong === 0
      ? settings.sessionsBeforeLong
      : sessionCount % settings.sessionsBeforeLong;

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ color: "var(--accent)" }}
          >
            Productivité
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Chronomètre <span style={{ color: "var(--primary)" }}>Pomodoro</span>
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Boostez votre productivité avec la méthode Pomodoro : sessions de travail concentré
            alternées avec des pauses régulières.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
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
                      {formatTime(remainingSeconds)}
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
                              i < filledDots
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
                      {isPaused ? "Reprendre" : "Démarrer"}
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
                    Réinitialiser
                  </button>
                  <button
                    onClick={handleSkip}
                    className="rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all hover:opacity-80"
                    style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    Passer
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
                  Statistiques de la session
                </h2>
                {stats.completedSessions > 0 && (
                  <button
                    onClick={handleResetStats}
                    className="text-xs font-semibold transition-all hover:opacity-70"
                    style={{ color: "var(--muted)" }}
                  >
                    Réinitialiser
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
                  Paramètres
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
                        onChange={(e) => updateSetting("work", clampInt(e.target.value, 1, 120))}
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
                          updateSetting("shortBreak", clampInt(e.target.value, 1, 60))
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
                          updateSetting("longBreak", clampInt(e.target.value, 1, 60))
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
                            clampInt(e.target.value, 2, 10)
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
                        <span className="text-sm font-semibold">Enchaînement automatique</span>
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
                La méthode Pomodoro
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed"
                style={{ color: "var(--muted)" }}
              >
                <p>
                  <strong className="text-[var(--foreground)]">Qu&apos;est-ce que la technique Pomodoro ?</strong>{" "}
                  Inventée par Francesco Cirillo à la fin des années 1980, la méthode Pomodoro est une
                  technique de gestion du temps qui découpe le travail en intervalles de 25 minutes
                  (appelés &laquo; pomodoros &raquo;), séparés par de courtes pauses.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Comment ça marche ?</strong> Choisissez
                  une tâche, lancez le timer de 25 minutes et travaillez sans interruption. À la fin,
                  prenez une pause de 5 minutes. Après 4 pomodoros, accordez-vous une pause longue de
                  15 à 30 minutes. Le bouton Passer saute la session en cours sans la comptabiliser.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Pourquoi ça fonctionne ?</strong> En
                  fractionnant le travail, vous maintenez un haut niveau de concentration, réduisez la
                  fatigue mentale et gardez une vision claire de votre productivité grâce au compteur
                  de sessions.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">En arrière-plan.</strong> Le timer se base sur
                  l&apos;heure de fin de la session : le décompte reste exact si vous changez d&apos;onglet, et le
                  temps restant s&apos;affiche dans le titre de l&apos;onglet. Autorisez les notifications pour
                  être prévenu à la fin de chaque session ; si l&apos;onglet reste longtemps masqué, le navigateur
                  peut retarder le signal de quelques secondes, voire d&apos;une minute. Les statistiques ne sont pas enregistrées : elles
                  repartent de zéro si vous rechargez la page.
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
                <li>Définissez votre tâche avant de démarrer</li>
                <li>Évitez toute distraction pendant un pomodoro</li>
                <li>Notez les interruptions pour les traiter plus tard</li>
                <li>Utilisez les pauses pour bouger et vous hydrater</li>
                <li>Ajustez les durées selon votre rythme</li>
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
                Repères
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
                  <strong className="text-[var(--foreground)]">1 cycle</strong> = 1 h 40 de travail (2 h 10 avec les pauses)
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
