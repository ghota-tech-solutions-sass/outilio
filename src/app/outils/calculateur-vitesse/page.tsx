"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type CalcMode = "speed" | "distance" | "time";

export default function CalculateurVitesse() {
  const [mode, setMode] = useState<CalcMode>("speed");
  const [distance, setDistance] = useState("100");
  const [distanceUnit, setDistanceUnit] = useState("km");
  const [time, setTime] = useState("1");
  const [timeUnit, setTimeUnit] = useState("h");
  const [speed, setSpeed] = useState("50");
  const [speedUnit, setSpeedUnit] = useState("kmh");

  const result = useMemo(() => {
    // Convert distance to km
    const distKm = (() => {
      const d = parseFloat(distance) || 0;
      switch (distanceUnit) {
        case "m": return d / 1000;
        case "km": return d;
        case "mi": return d * 1.60934;
        default: return d;
      }
    })();

    // Convert time to hours
    const timeH = (() => {
      const t = parseFloat(time) || 0;
      switch (timeUnit) {
        case "s": return t / 3600;
        case "min": return t / 60;
        case "h": return t;
        default: return t;
      }
    })();

    // Convert speed to km/h
    const speedKmh = (() => {
      const s = parseFloat(speed) || 0;
      switch (speedUnit) {
        case "kmh": return s;
        case "ms": return s * 3.6;
        case "mph": return s * 1.60934;
        default: return s;
      }
    })();

    let resultSpeedKmh: number;
    let resultDistKm: number;
    let resultTimeH: number;

    switch (mode) {
      case "speed":
        if (timeH <= 0 || distKm <= 0) return null;
        resultSpeedKmh = distKm / timeH;
        resultDistKm = distKm;
        resultTimeH = timeH;
        break;
      case "distance":
        if (speedKmh <= 0 || timeH <= 0) return null;
        resultDistKm = speedKmh * timeH;
        resultSpeedKmh = speedKmh;
        resultTimeH = timeH;
        break;
      case "time":
        if (speedKmh <= 0 || distKm <= 0) return null;
        resultTimeH = distKm / speedKmh;
        resultSpeedKmh = speedKmh;
        resultDistKm = distKm;
        break;
      default:
        return null;
    }

    return {
      speed: {
        kmh: resultSpeedKmh,
        ms: resultSpeedKmh / 3.6,
        mph: resultSpeedKmh / 1.60934,
      },
      distance: {
        km: resultDistKm,
        m: resultDistKm * 1000,
        mi: resultDistKm / 1.60934,
      },
      time: {
        hours: resultTimeH,
        minutes: resultTimeH * 60,
        seconds: resultTimeH * 3600,
        formatted: (() => {
          const h = Math.floor(resultTimeH);
          const m = Math.floor((resultTimeH - h) * 60);
          const s = Math.floor(((resultTimeH - h) * 60 - m) * 60);
          const parts: string[] = [];
          if (h > 0) parts.push(`${h}h`);
          if (m > 0) parts.push(`${m}min`);
          if (s > 0 || parts.length === 0) parts.push(`${s}s`);
          return parts.join(" ");
        })(),
      },
    };
  }, [mode, distance, distanceUnit, time, timeUnit, speed, speedUnit]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const modes: { key: CalcMode; label: string; desc: string }[] = [
    { key: "speed", label: "Vitesse", desc: "Distance + Temps" },
    { key: "distance", label: "Distance", desc: "Vitesse + Temps" },
    { key: "time", label: "Temps", desc: "Vitesse + Distance" },
  ];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Outils</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>vitesse</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez vitesse, distance ou temps a partir de deux valeurs connues. Conversions km/h, m/s et mph.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Mode selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Je cherche</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {modes.map((m) => (
                  <button key={m.key} onClick={() => setMode(m.key)}
                    className="rounded-xl border px-4 py-3 text-center transition-all"
                    style={{
                      borderColor: mode === m.key ? "var(--primary)" : "var(--border)",
                      background: mode === m.key ? "var(--primary)" : "transparent",
                      color: mode === m.key ? "#fff" : "inherit",
                    }}>
                    <span className="block text-sm font-bold">{m.label}</span>
                    <span className="block text-[10px] opacity-80">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Valeurs connues</h2>
              <div className="mt-4 space-y-4">
                {mode !== "distance" && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Distance</label>
                      <input type="number" step="any" value={distance} onChange={(e) => setDistance(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div className="w-28">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Unite</label>
                      <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-3 py-3 text-sm font-bold" style={{ borderColor: "var(--border)" }}>
                        <option value="m">m</option>
                        <option value="km">km</option>
                        <option value="mi">miles</option>
                      </select>
                    </div>
                  </div>
                )}
                {mode !== "time" && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Temps</label>
                      <input type="number" step="any" value={time} onChange={(e) => setTime(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div className="w-28">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Unite</label>
                      <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-3 py-3 text-sm font-bold" style={{ borderColor: "var(--border)" }}>
                        <option value="s">sec</option>
                        <option value="min">min</option>
                        <option value="h">heures</option>
                      </select>
                    </div>
                  </div>
                )}
                {mode !== "speed" && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Vitesse</label>
                      <input type="number" step="any" value={speed} onChange={(e) => setSpeed(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    </div>
                    <div className="w-28">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Unite</label>
                      <select value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)}
                        className="mt-2 w-full rounded-xl border px-3 py-3 text-sm font-bold" style={{ borderColor: "var(--border)" }}>
                        <option value="kmh">km/h</option>
                        <option value="ms">m/s</option>
                        <option value="mph">mph</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {result && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border p-5 text-center" style={{ background: mode === "speed" ? "var(--primary)" : "var(--surface)", borderColor: "var(--border)", color: mode === "speed" ? "#fff" : "inherit" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ opacity: mode === "speed" ? 0.8 : 1, color: mode === "speed" ? undefined : "var(--muted)" }}>Vitesse</p>
                    <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.speed.kmh)} km/h</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: mode === "distance" ? "var(--primary)" : "var(--surface)", borderColor: "var(--border)", color: mode === "distance" ? "#fff" : "inherit" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ opacity: mode === "distance" ? 0.8 : 1, color: mode === "distance" ? undefined : "var(--muted)" }}>Distance</p>
                    <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{fmt(result.distance.km)} km</p>
                  </div>
                  <div className="rounded-2xl border p-5 text-center" style={{ background: mode === "time" ? "var(--primary)" : "var(--surface)", borderColor: "var(--border)", color: mode === "time" ? "#fff" : "inherit" }}>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ opacity: mode === "time" ? 0.8 : 1, color: mode === "time" ? undefined : "var(--muted)" }}>Temps</p>
                    <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{result.time.formatted}</p>
                  </div>
                </div>

                <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Conversions detaillees</h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>Vitesse</p>
                      {[
                        { label: "km/h", value: fmt(result.speed.kmh) },
                        { label: "m/s", value: fmt(result.speed.ms) },
                        { label: "mph", value: fmt(result.speed.mph) },
                      ].map((v) => (
                        <div key={v.label} className="flex justify-between rounded-lg px-3 py-1.5 mb-1" style={{ background: "var(--surface-alt)" }}>
                          <span className="text-xs">{v.label}</span>
                          <span className="text-xs font-bold">{v.value}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>Distance</p>
                      {[
                        { label: "m", value: fmt(result.distance.m) },
                        { label: "km", value: fmt(result.distance.km) },
                        { label: "miles", value: fmt(result.distance.mi) },
                      ].map((v) => (
                        <div key={v.label} className="flex justify-between rounded-lg px-3 py-1.5 mb-1" style={{ background: "var(--surface-alt)" }}>
                          <span className="text-xs">{v.label}</span>
                          <span className="text-xs font-bold">{v.value}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>Temps</p>
                      {[
                        { label: "Secondes", value: fmt(result.time.seconds) },
                        { label: "Minutes", value: fmt(result.time.minutes) },
                        { label: "Heures", value: fmt(result.time.hours) },
                      ].map((v) => (
                        <div key={v.label} className="flex justify-between rounded-lg px-3 py-1.5 mb-1" style={{ background: "var(--surface-alt)" }}>
                          <span className="text-xs">{v.label}</span>
                          <span className="text-xs font-bold">{v.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Formule vitesse / distance / temps</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Vitesse</strong> = Distance / Temps</p>
                <p><strong className="text-[var(--foreground)]">Distance</strong> = Vitesse x Temps</p>
                <p><strong className="text-[var(--foreground)]">Temps</strong> = Distance / Vitesse</p>
                <p><strong className="text-[var(--foreground)]">Conversions</strong> : 1 km/h = 0,2778 m/s = 0,6214 mph</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Vitesses de reference</h3>
              <div className="mt-3 space-y-2">
                {[
                  { nom: "Marche", vitesse: "5 km/h" },
                  { nom: "Velo", vitesse: "20 km/h" },
                  { nom: "Ville (50)", vitesse: "50 km/h" },
                  { nom: "Route", vitesse: "80 km/h" },
                  { nom: "Autoroute", vitesse: "130 km/h" },
                  { nom: "TGV", vitesse: "320 km/h" },
                ].map((r) => (
                  <div key={r.nom} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-semibold">{r.nom}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{r.vitesse}</span>
                  </div>
                ))}
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
