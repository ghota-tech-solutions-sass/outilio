"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type Unit = "celsius" | "fahrenheit" | "kelvin";

const UNITS: { id: Unit; label: string; symbol: string }[] = [
  { id: "celsius", label: "Celsius", symbol: "\u00B0C" },
  { id: "fahrenheit", label: "Fahrenheit", symbol: "\u00B0F" },
  { id: "kelvin", label: "Kelvin", symbol: "K" },
];

function convert(value: number, from: Unit, to: Unit): number {
  // Convert to Celsius first
  let celsius: number;
  switch (from) {
    case "celsius": celsius = value; break;
    case "fahrenheit": celsius = (value - 32) * 5 / 9; break;
    case "kelvin": celsius = value - 273.15; break;
  }
  // Convert from Celsius to target
  switch (to) {
    case "celsius": return celsius;
    case "fahrenheit": return celsius * 9 / 5 + 32;
    case "kelvin": return celsius + 273.15;
  }
}

const REFERENCES = [
  { label: "Zero absolu", celsius: -273.15 },
  { label: "Congelation eau", celsius: 0 },
  { label: "Temperature corporelle", celsius: 37 },
  { label: "Ebullition eau", celsius: 100 },
  { label: "Four pizza", celsius: 300 },
];

export default function ConvertisseurTemperature() {
  const [input, setInput] = useState("20");
  const [source, setSource] = useState<Unit>("celsius");

  const value = parseFloat(input) || 0;

  const results = UNITS.map((u) => ({
    ...u,
    value: convert(value, source, u.id),
  }));

  // Thermometer: map celsius to visual (-40 to 120)
  const celsiusValue = convert(value, source, "celsius");
  const thermPct = Math.max(0, Math.min(100, ((celsiusValue + 40) / 160) * 100));
  const thermColor = celsiusValue < 0 ? "#3b82f6" : celsiusValue < 20 ? "#06b6d4" : celsiusValue < 37 ? "#16a34a" : celsiusValue < 60 ? "#f59e0b" : "#dc2626";

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Conversion</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur <span style={{ color: "var(--primary)" }}>Temperature</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez instantanement entre Celsius, Fahrenheit et Kelvin avec thermometre visuel.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Input */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex gap-2 mb-4">
                {UNITS.map((u) => (
                  <button key={u.id} onClick={() => setSource(u.id)}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                    style={{ borderColor: source === u.id ? "var(--primary)" : "var(--border)", background: source === u.id ? "rgba(13,79,60,0.05)" : "transparent", color: source === u.id ? "var(--primary)" : "var(--muted)" }}>
                    {u.label} ({u.symbol})
                  </button>
                ))}
              </div>
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Temperature en {UNITS.find((u) => u.id === source)?.label}</label>
              <input type="number" value={input} onChange={(e) => setInput(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
            </div>

            {/* Results */}
            <div className="grid grid-cols-3 gap-4">
              {results.map((r) => (
                <div key={r.id} className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: r.id === source ? "var(--primary)" : "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: r.id === source ? "var(--primary)" : "var(--accent)" }}>{r.label}</p>
                  <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: r.id === source ? "var(--primary)" : "var(--foreground)" }}>
                    {fmt(r.value)}
                  </p>
                  <p className="text-lg" style={{ color: "var(--muted)" }}>{r.symbol}</p>
                </div>
              ))}
            </div>

            {/* Visual thermometer */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Thermometre</h2>
              <div className="mt-6 flex items-end gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs mb-1" style={{ color: "var(--muted)" }}>120\u00B0C</span>
                  <div className="relative w-10 rounded-full overflow-hidden" style={{ height: "250px", background: "var(--surface-alt)" }}>
                    <div className="absolute bottom-0 w-full rounded-full transition-all duration-500" style={{ height: `${thermPct}%`, background: thermColor }} />
                  </div>
                  <span className="text-xs mt-1" style={{ color: "var(--muted)" }}>-40\u00B0C</span>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: thermColor }}>
                    {fmt(celsiusValue)} \u00B0C
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {celsiusValue < 0 ? "En dessous de zero - Gel" : celsiusValue < 15 ? "Froid" : celsiusValue < 25 ? "Temperature agreable" : celsiusValue < 35 ? "Chaud" : celsiusValue < 45 ? "Tres chaud" : "Extreme"}
                  </p>
                </div>
              </div>
            </div>

            {/* Reference temperatures */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Temperatures de reference</h2>
              <div className="mt-4 space-y-2">
                {REFERENCES.map((ref) => (
                  <div key={ref.label} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-sm font-medium">{ref.label}</span>
                    <div className="flex gap-4 text-sm font-mono">
                      <span>{ref.celsius}\u00B0C</span>
                      <span style={{ color: "var(--muted)" }}>{convert(ref.celsius, "celsius", "fahrenheit").toFixed(1)}\u00B0F</span>
                      <span style={{ color: "var(--muted)" }}>{convert(ref.celsius, "celsius", "kelvin").toFixed(1)}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Formules de conversion</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">\u00B0C &rarr; \u00B0F</strong> : F = C &times; 9/5 + 32</p>
                <p><strong className="text-[var(--foreground)]">\u00B0F &rarr; \u00B0C</strong> : C = (F - 32) &times; 5/9</p>
                <p><strong className="text-[var(--foreground)]">\u00B0C &rarr; K</strong> : K = C + 273,15</p>
                <p><strong className="text-[var(--foreground)]">K &rarr; \u00B0C</strong> : C = K - 273,15</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le convertisseur de temperature
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Ce convertisseur de temperature gratuit permet de passer instantanement entre les echelles Celsius, Fahrenheit et Kelvin. Il est utile au quotidien pour comprendre la meteo americaine, pour les recettes de cuisine anglo-saxonnes ou pour les calculs scientifiques.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Selectionnez l&apos;echelle source</strong> : choisissez Celsius (&deg;C), Fahrenheit (&deg;F) ou Kelvin (K).</li>
                  <li><strong className="text-[var(--foreground)]">Saisissez la temperature</strong> : entrez la valeur a convertir. Les resultats s&apos;affichent en temps reel dans les trois echelles.</li>
                  <li><strong className="text-[var(--foreground)]">Consultez le thermometre visuel</strong> : une representation graphique colore indique si la temperature est froide, agreable ou chaude.</li>
                  <li><strong className="text-[var(--foreground)]">Utilisez les reperes</strong> : le tableau de temperatures de reference (congelation de l&apos;eau, temperature corporelle, etc.) vous aide a contextualiser les valeurs.</li>
                </ul>
                <p>
                  En France, le Celsius est l&apos;echelle standard. Le Fahrenheit est utilise aux Etats-Unis et dans quelques autres pays. Le Kelvin est l&apos;unite du Systeme international, utilisee principalement en physique et en chimie.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment convertir rapidement des Fahrenheit en Celsius ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    La formule exacte est : &deg;C = (&deg;F - 32) &times; 5/9. Pour une estimation rapide de tete, soustrayez 30 puis divisez par 2. Par exemple, 80 &deg;F donne environ (80-30)/2 = 25 &deg;C (la valeur exacte est 26,67 &deg;C). Cette astuce fonctionne bien pour les temperatures courantes.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>A quoi correspond 0 Kelvin ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    0 Kelvin (-273,15 &deg;C) est le zero absolu, la temperature la plus basse theoriquement atteignable. A cette temperature, les atomes cessent tout mouvement thermique. C&apos;est la raison pour laquelle l&apos;echelle Kelvin ne comporte pas de valeurs negatives. Elle est utilisee en physique car elle permet des calculs plus simples en thermodynamique.
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle temperature pour les recettes en Fahrenheit ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Les recettes americaines utilisent le Fahrenheit. Voici les equivalences les plus courantes en cuisine : 350 &deg;F = 177 &deg;C (four modere), 375 &deg;F = 190 &deg;C, 400 &deg;F = 204 &deg;C (four chaud), 425 &deg;F = 218 &deg;C, 450 &deg;F = 232 &deg;C (four tres chaud). Utilisez cet outil pour obtenir la conversion exacte de n&apos;importe quelle temperature de recette.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
