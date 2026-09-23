"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

type Unit = "celsius" | "fahrenheit" | "kelvin";

const UNITS: { id: Unit; label: string; symbol: string }[] = [
  { id: "celsius", label: "Celsius", symbol: "°C" },
  { id: "fahrenheit", label: "Fahrenheit", symbol: "°F" },
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
  { label: "Zéro absolu", celsius: -273.15 },
  { label: "Congélation de l'eau", celsius: 0 },
  { label: "Température corporelle", celsius: 37 },
  { label: "Ébullition de l'eau", celsius: 100 },
  { label: "Four à pizza", celsius: 300 },
];

export default function ConvertisseurTemperature() {
  const [input, setInput] = useState("20");
  const [source, setSource] = useState<Unit>("celsius");

  const parsed = parseFloat(input);
  const value = Number.isFinite(parsed) ? parsed : 0;

  const results = UNITS.map((u) => ({
    ...u,
    value: convert(value, source, u.id),
  }));

  // Thermometer: map celsius to visual (-40 to 120)
  const celsiusValue = convert(value, source, "celsius");
  const thermPct = Math.max(0, Math.min(100, ((celsiusValue + 40) / 160) * 100));
  const thermColor = celsiusValue < 0 ? "#3b82f6" : celsiusValue < 20 ? "#06b6d4" : celsiusValue < 37 ? "#16a34a" : celsiusValue < 60 ? "#f59e0b" : "#dc2626";

  // En dessous du zéro absolu, la température n'a pas de sens physique
  const belowAbsoluteZero = celsiusValue < -273.15 - 1e-9;

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtRef = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Conversion</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur de <span style={{ color: "var(--primary)" }}>température</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez instantanément entre Celsius, Fahrenheit et Kelvin, avec thermomètre visuel.
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
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Température en {UNITS.find((u) => u.id === source)?.label}</label>
              <input type="number" value={input} onChange={(e) => setInput(e.target.value)}
                className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
              {belowAbsoluteZero && (
                <p className="mt-2 text-sm font-semibold" style={{ color: "#dc2626" }}>
                  Valeur impossible : aucune température ne peut être inférieure au zéro absolu (0 K = −273,15 °C = −459,67 °F).
                </p>
              )}
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
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Thermomètre</h2>
              <div className="mt-6 flex items-end gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs mb-1" style={{ color: "var(--muted)" }}>120°C</span>
                  <div className="relative w-10 rounded-full overflow-hidden" style={{ height: "250px", background: "var(--surface-alt)" }}>
                    <div className="absolute bottom-0 w-full rounded-full transition-all duration-500" style={{ height: `${thermPct}%`, background: thermColor }} />
                  </div>
                  <span className="text-xs mt-1" style={{ color: "var(--muted)" }}>-40°C</span>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: thermColor }}>
                    {fmt(celsiusValue)} °C
                  </p>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    {belowAbsoluteZero ? "Sous le zéro absolu : valeur impossible" : celsiusValue < 0 ? "En dessous de zéro : gel" : celsiusValue < 15 ? "Froid" : celsiusValue < 25 ? "Température agréable" : celsiusValue < 35 ? "Chaud" : celsiusValue < 45 ? "Très chaud" : "Extrême"}
                  </p>
                </div>
              </div>
            </div>

            {/* Reference temperatures */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Températures de référence</h2>
              <div className="mt-4 space-y-2">
                {REFERENCES.map((ref) => (
                  <div key={ref.label} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-sm font-medium">{ref.label}</span>
                    <div className="flex gap-4 text-sm font-mono">
                      <span>{fmtRef(ref.celsius)} °C</span>
                      <span style={{ color: "var(--muted)" }}>{fmtRef(convert(ref.celsius, "celsius", "fahrenheit"))} °F</span>
                      <span style={{ color: "var(--muted)" }}>{fmtRef(convert(ref.celsius, "celsius", "kelvin"))} K</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Formules de conversion</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">°C &rarr; °F</strong> : °F = °C &times; 9/5 + 32</p>
                <p><strong className="text-[var(--foreground)]">°F &rarr; °C</strong> : °C = (°F − 32) &times; 5/9</p>
                <p><strong className="text-[var(--foreground)]">°C &rarr; K</strong> : K = °C + 273,15</p>
                <p><strong className="text-[var(--foreground)]">K &rarr; °C</strong> : °C = K − 273,15</p>
              </div>
            </div>

            <ToolHowToSection
              title="Comment utiliser le convertisseur de température"
              description="Trois échelles, une saisie : entrez votre température et obtenez les équivalents Celsius, Fahrenheit et Kelvin instantanément, avec thermomètre visuel et repères contextuels."
              steps={[
                {
                  name: "Choisir l'échelle source",
                  text:
                    "Cliquez sur l'échelle qui correspond à votre valeur d'entrée : Celsius (°C) pour la France et la majorité du monde, Fahrenheit (°F) pour les États-Unis, ou Kelvin (K) pour la physique et les calculs scientifiques.",
                },
                {
                  name: "Saisir la valeur à convertir",
                  text:
                    "Tapez la température dans le champ. Les valeurs négatives sont acceptées en Celsius et Fahrenheit. En Kelvin, la borne minimale est 0 K (zéro absolu) : l'outil signale toute valeur inférieure. Les conversions sont calculées dans votre navigateur, sans envoi à un serveur.",
                },
                {
                  name: "Lire les trois résultats simultanément",
                  text:
                    "Les trois cartes affichent la valeur convertie dans chaque échelle. Le thermomètre coloré (bleu pour froid, vert pour tempéré, orange et rouge pour chaud) donne un repère visuel rapide. Le tableau de référence contextualise la valeur (congélation, température corporelle, four à pizza).",
                },
              ]}
            />

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Cas d&apos;usage du convertisseur de température
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Voyageur aux États-Unis
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    La météo américaine annonce 75 °F à New York : la conversion donne 23,9 °C,
                    soit une journée printanière. Indispensable pour préparer sa valise et éviter
                    de partir en T-shirt quand 50 °F (10 °C) annoncent un fond de l&apos;air frais.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Cuisinier sur recette anglo-saxonne
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une recette américaine demande un four à 425 °F : conversion = 218 °C, soit
                    th. 7-8. Évitez d&apos;arrondir grossièrement : une différence de 10 °C change
                    nettement la coloration et la cuisson d&apos;un gâteau ou d&apos;un rôti.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Étudiant en physique-chimie
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    La loi des gaz parfaits PV = nRT exige des températures en kelvins. Convertir
                    25 °C en 298,15 K est un automatisme indispensable au lycée et en prépa.
                    Le kelvin étant une échelle absolue (0 K = zéro absolu), les rapports de
                    températures ont un sens, ce qui n&apos;est pas le cas en degrés Celsius.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Bricoleur ou artisan
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Soudure à l&apos;étain (env. 230 °C = 446 °F), cuisson d&apos;émail sur céramique
                    (1 050 °C = 1 922 °F), point de fusion d&apos;un plastique. Les fiches
                    techniques internationales mélangent souvent les unités : le convertisseur
                    évite les erreurs critiques sur du matériel sensible.
                  </p>
                </div>
              </div>
            </section>

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm"
              style={{ background: "var(--surface-alt)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                À savoir sur les échelles de température
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Le zéro absolu vaut −273,15 °C, soit 0 K.</strong> C&apos;est la
                  température théorique la plus basse possible, où l&apos;agitation thermique est
                  minimale. Elle n&apos;a jamais été atteinte expérimentalement : les laboratoires
                  descendent en dessous du nanokelvin, mais jamais à zéro exact. C&apos;est pour cela
                  que l&apos;échelle Kelvin n&apos;a pas de valeurs négatives.
                </p>
                <p>
                  <strong>Celsius et Kelvin partagent le même pas.</strong> Une variation
                  de 1 °C équivaut exactement à une variation de 1 K. La seule différence est
                  le décalage de 273,15 unités. C&apos;est pour cela qu&apos;en physique on
                  exprime volontiers un écart de température en kelvins (et jamais en « degrés
                  kelvin »).
                </p>
                <p>
                  <strong>Le Fahrenheit a un degré plus petit.</strong> Entre la
                  congélation (32 °F) et l&apos;ébullition (212 °F) de l&apos;eau, il y a
                  180 degrés Fahrenheit contre 100 degrés Celsius : un degré Fahrenheit vaut
                  5/9 de degré Celsius. Les températures météo s&apos;expriment ainsi en nombres
                  entiers plus fins, un argument souvent avancé aux États-Unis.
                </p>
                <p>
                  <strong>Astuce mentale rapide.</strong> Pour passer de °F à °C, soustrayez
                  30 puis divisez par 2 (au lieu du calcul exact : − 32 puis × 5/9). 70 °F donne
                  ainsi environ 20 °C (valeur réelle 21,1 °C). C&apos;est suffisant pour estimer
                  une météo, sans calculatrice ; pour une recette, préférez la conversion exacte.
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus posées sur la conversion de températures."
              items={[
                {
                  question: "Comment convertir rapidement des Fahrenheit en Celsius ?",
                  answer:
                    "La formule exacte est °C = (°F − 32) × 5/9. Pour une estimation rapide de tête, soustrayez 30 puis divisez par 2. Exemple : 80 °F donne environ (80 − 30) / 2 = 25 °C (valeur exacte 26,67 °C). Cette astuce reste fiable à 1 ou 2 °C près pour les températures météo courantes (entre 30 et 90 °F).",
                },
                {
                  question: "À quoi correspond 0 kelvin ?",
                  answer:
                    "0 kelvin (−273,15 °C, −459,67 °F) est le zéro absolu, la température la plus basse théoriquement possible, où l'agitation thermique des atomes est minimale. C'est pour cela que l'échelle Kelvin n'a pas de valeurs négatives. Elle est utilisée en physique car elle simplifie les calculs en thermodynamique et en chimie des gaz.",
                },
                {
                  question: "Quelle température pour les recettes en Fahrenheit ?",
                  answer:
                    "Les recettes américaines utilisent le Fahrenheit. Équivalences courantes en cuisine : 325 °F = 163 °C, 350 °F = 177 °C (four modéré), 375 °F = 191 °C, 400 °F = 204 °C (four chaud), 425 °F = 218 °C, 450 °F = 232 °C (four très chaud). Pour une recette américaine, utilisez la conversion exacte plutôt qu'un arrondi grossier.",
                },
                {
                  question: "Pourquoi le Fahrenheit est-il encore utilisé aux États-Unis ?",
                  answer:
                    "Le Fahrenheit a été conservé par habitude culturelle et inertie administrative. Son degré, plus petit, donne une échelle plus fine pour la météo (180 degrés entre la congélation et l'ébullition de l'eau, contre 100 en Celsius). Les États-Unis et quelques territoires ou pays (dont les îles Caïmans, les Bahamas, le Belize, Palaos et le Liberia) l'utilisent encore au quotidien. Le reste du monde, y compris la science américaine, utilise le Celsius ou le kelvin.",
                },
                {
                  question: "Faut-il dire degré Kelvin ou kelvin ?",
                  answer:
                    "On ne dit pas « degré Kelvin ». Depuis 1967-1968, l'unité du Système international s'appelle simplement le kelvin, de symbole K (sans le symbole °). On dit « la température est de 300 kelvins ». Seuls le Celsius et le Fahrenheit utilisent le mot « degré ».",
                },
                {
                  question: "Quelle est la température idéale d'un frigo ou d'un congélateur ?",
                  answer:
                    "Réfrigérateur : entre 0 et 4 °C (32 à 39 °F) pour la conservation des aliments frais. Congélateur : −18 °C (0 °F) ou plus froid pour une conservation de longue durée. En Fahrenheit, retenir 0 °F pour le congélateur est un repère mnémotechnique pratique.",
                },
                {
                  question: "Mes calculs sont-ils confidentiels ?",
                  answer:
                    "Oui. Toutes les conversions sont effectuées localement dans votre navigateur. Aucune valeur saisie n'est envoyée à un serveur ni stockée. L'outil fonctionne sans inscription ; le site utilise des outils de mesure d'audience et de publicité, qui n'ont pas accès à vos saisies.",
                },
              ]}
            />
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
