"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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

            <ToolHowToSection
              title="Comment utiliser le convertisseur de temperature"
              description="Trois echelles, une saisie : entrez votre temperature et obtenez les equivalents Celsius, Fahrenheit et Kelvin instantanement, avec thermometre visuel et reperes contextuels."
              steps={[
                {
                  name: "Choisir l'echelle source",
                  text:
                    "Cliquez sur l'echelle qui correspond a votre valeur d'entree : Celsius (degC) pour la France et la majorite du monde, Fahrenheit (degF) pour les Etats-Unis, ou Kelvin (K) pour la physique et les calculs scientifiques.",
                },
                {
                  name: "Saisir la valeur a convertir",
                  text:
                    "Tapez la temperature dans le champ. Les valeurs negatives sont acceptees en Celsius et Fahrenheit. En Kelvin, la borne minimale est 0 K (zero absolu). Les conversions sont calculees en local, sans envoi serveur.",
                },
                {
                  name: "Lire les trois resultats simultanement",
                  text:
                    "Les trois cartes affichent la valeur convertie dans chaque echelle. Le thermometre colore (bleu pour froid, vert pour tempere, orange et rouge pour chaud) donne un repere visuel rapide. Le tableau de reference contextualise la valeur (congelation, temperature corporelle, four pizza).",
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
                Cas d&apos;usage du convertisseur de temperature
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Voyageur aux Etats-Unis
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    La meteo americaine annonce 75 degF a New York : la conversion donne 23,9 degC,
                    soit une journee printaniere. Indispensable pour preparer sa valise et eviter
                    de partir en T-shirt quand 50 degF (10 degC) annonce un fond de l&apos;air frais.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Cuisinier sur recette anglo-saxonne
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une recette US demande un four a 425 degF : conversion = 218 degC, soit
                    th. 7-8. Eviter d&apos;arrondir grossierement, une difference de 10 degC change
                    drastiquement la coloration et la cuisson d&apos;un gateau ou d&apos;un roti.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Etudiant en physique-chimie
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    La loi des gaz parfaits PV = nRT exige des temperatures en Kelvin. Convertir
                    25 degC en 298,15 K est un automatisme indispensable au lycee et en prepa.
                    Le Kelvin etant additif, il evite les divisions par zero qui se produisent
                    a 0 degC en Celsius.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Bricoleur ou artisan
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Soudure a l&apos;etain (env. 230 degC = 446 degF), cuisson email ceramique
                    (1 050 degC = 1 922 degF), point de fusion d&apos;un plastique. Les fiches
                    techniques internationales melangent souvent les unites, le convertisseur
                    evite les erreurs critiques sur du materiel sensible.
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
                A savoir sur les echelles de temperature
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Le zero absolu vaut -273,15 degC, soit 0 K.</strong> C&apos;est la
                  temperature theorique a laquelle toute agitation thermique cesse. Elle n&apos;a
                  jamais ete atteinte experimentalement : les laboratoires actuels descendent en
                  dessous du nanokelvin mais jamais a zero exact. C&apos;est aussi pour cela que
                  le Kelvin n&apos;a pas de valeurs negatives.
                </p>
                <p>
                  <strong>Celsius et Kelvin partagent la meme amplitude.</strong> Une variation
                  de 1 degC equivaut exactement a une variation de 1 K. La seule difference est
                  le decalage de 273,15 unites. C&apos;est pour cela qu&apos;en physique on
                  parle d&apos;ecart en kelvins (et non en degres kelvin) lorsque l&apos;on
                  exprime une difference de temperature.
                </p>
                <p>
                  <strong>Fahrenheit utilise une echelle plus fine.</strong> Entre la
                  congelation (32 degF) et l&apos;ebullition (212 degF) de l&apos;eau, il y a
                  180 degres Fahrenheit contre 100 degres Celsius. Le Fahrenheit est donc 1,8
                  fois plus precis a chiffres ronds, ce qui explique sa popularite persistante
                  pour les temperatures meteo aux Etats-Unis.
                </p>
                <p>
                  <strong>Astuce mentale rapide.</strong> Pour passer de degF a degC, soustrayez
                  30 puis divisez par 2 (au lieu du calcul exact -32 puis x 5/9). 70 degF donne
                  ainsi environ 20 degC (valeur reelle 21,1). C&apos;est suffisant pour estimer
                  une meteo ou une recette, sans calculatrice.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur la conversion de temperatures."
              items={[
                {
                  question: "Comment convertir rapidement des Fahrenheit en Celsius ?",
                  answer:
                    "La formule exacte est degC = (degF - 32) x 5/9. Pour une estimation rapide de tete, soustrayez 30 puis divisez par 2. Exemple : 80 degF donne environ (80-30)/2 = 25 degC (valeur exacte 26,67 degC). Cette astuce reste fiable a 1-2 degC pres pour les temperatures meteo courantes.",
                },
                {
                  question: "A quoi correspond 0 Kelvin ?",
                  answer:
                    "0 Kelvin (-273,15 degC) est le zero absolu, la temperature la plus basse theoriquement atteignable. A cette temperature, l'agitation thermique des atomes cesse. C'est pour cela que l'echelle Kelvin n'a pas de valeurs negatives. Elle est utilisee en physique car elle simplifie les calculs en thermodynamique et en chimie des gaz.",
                },
                {
                  question: "Quelle temperature pour les recettes en Fahrenheit ?",
                  answer:
                    "Les recettes americaines utilisent le Fahrenheit. Equivalences cuisine courantes : 325 degF = 163 degC, 350 degF = 177 degC (four modere), 375 degF = 190 degC, 400 degF = 204 degC (four chaud), 425 degF = 218 degC, 450 degF = 232 degC (four tres chaud). Pour une recette americaine, utilisez la conversion exacte plutot qu'un arrondi.",
                },
                {
                  question: "Pourquoi le Fahrenheit est-il encore utilise aux Etats-Unis ?",
                  answer:
                    "Le Fahrenheit a ete conserve par habitude culturelle et inertie administrative. Il offre une echelle plus granulaire pour la meteo (180 degres entre la congelation et l'ebullition de l'eau, contre 100 en Celsius). Les Etats-Unis, le Liberia et les iles Cayman sont les principaux pays a l'utiliser officiellement. Le reste du monde, y compris la science americaine, utilise le Celsius ou le Kelvin.",
                },
                {
                  question: "Quelle est la difference entre degre Kelvin et Kelvin ?",
                  answer:
                    "Il n'y a pas de degre Kelvin. La bonne notation est simplement K (sans le mot degre, ni le symbole deg). On dit 'la temperature est de 300 kelvins'. C'est une particularite du Systeme international depuis 1967 : seuls le Celsius et le Fahrenheit utilisent le mot 'degre'.",
                },
                {
                  question: "Quelle est la temperature ideale d'un frigo ou d'un congelateur ?",
                  answer:
                    "Frigo : entre 0 et 4 degC (32 a 39 degF) pour la conservation des aliments frais. Congelateur : -18 degC (0 degF) ou plus froid pour une conservation longue duree. En Fahrenheit, retenir 0 degF pour le congelo est un repere mnemotechnique pratique.",
                },
                {
                  question: "Mes calculs sont-ils confidentiels ?",
                  answer:
                    "Oui. Toutes les conversions sont effectuees localement dans votre navigateur en JavaScript. Aucune valeur saisie n'est envoyee a un serveur ni stockee. L'outil fonctionne sans inscription et sans tracker.",
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
