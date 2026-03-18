"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const BOISSONS = [
  { id: "biere", label: "Biere (25cl, 5%)", icon: "\u{1F37A}", alcoolGrammes: 10 },
  { id: "vin", label: "Vin (12cl, 12%)", icon: "\u{1F377}", alcoolGrammes: 11.4 },
  { id: "champagne", label: "Champagne (12cl, 12%)", icon: "\u{1F942}", alcoolGrammes: 11.4 },
  { id: "cocktail", label: "Cocktail (20cl, 15%)", icon: "\u{1F378}", alcoolGrammes: 24 },
  { id: "spiritueux", label: "Spiritueux (4cl, 40%)", icon: "\u{1F943}", alcoolGrammes: 12.8 },
  { id: "shot", label: "Shot (3cl, 40%)", icon: "\u{1FAD7}", alcoolGrammes: 9.6 },
];

export default function CalculateurAlcoolemie() {
  const [verres, setVerres] = useState<Record<string, number>>({});
  const [poids, setPoids] = useState("75");
  const [sexe, setSexe] = useState<"homme" | "femme">("homme");
  const [heures, setHeures] = useState("1");
  const [aJeun, setAJeun] = useState(false);

  const p = parseFloat(poids) || 70;
  const h = parseFloat(heures) || 0;

  const totalAlcool = BOISSONS.reduce((sum, b) => sum + (verres[b.id] || 0) * b.alcoolGrammes, 0);

  // Widmark formula
  const coefficient = sexe === "homme" ? 0.68 : 0.55;
  const coeffJeun = aJeun ? 1.0 : 0.85;
  const alcoolemie = Math.max(0, (totalAlcool * coeffJeun) / (p * coefficient) - h * 0.15);

  const tempsRetourZero = alcoolemie > 0 ? alcoolemie / 0.15 : 0;
  const heuresRetour = Math.floor(tempsRetourZero);
  const minutesRetour = Math.round((tempsRetourZero - heuresRetour) * 60);

  const couleur = alcoolemie === 0 ? "var(--primary)" : alcoolemie < 0.5 ? "#f59e0b" : "#dc2626";
  const statut = alcoolemie === 0 ? "Sobre" : alcoolemie < 0.2 ? "Leger" : alcoolemie < 0.5 ? "Limite legale" : alcoolemie < 0.8 ? "Au-dessus de la limite" : "Dangereux";

  const totalVerres = Object.values(verres).reduce((s, v) => s + v, 0);

  const setVerre = (id: string, delta: number) => {
    setVerres((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Sante</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Alcoolemie</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Estimez votre taux d&apos;alcoolemie et le temps necessaire pour revenir a zero. Outil a visee educative uniquement.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Drinks */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Consommation</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {BOISSONS.map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }}>
                    <span className="text-sm font-medium">{b.icon} {b.label}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setVerre(b.id, -1)}
                        className="h-8 w-8 rounded-full border text-lg font-bold" style={{ borderColor: "var(--border)" }}>-</button>
                      <span className="w-6 text-center text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>{verres[b.id] || 0}</span>
                      <button onClick={() => setVerre(b.id, 1)}
                        className="h-8 w-8 rounded-full text-lg font-bold text-white" style={{ background: "var(--primary)" }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parameters */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parametres</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Poids (kg)</label>
                  <input type="number" min="30" max="200" value={poids} onChange={(e) => setPoids(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Sexe</label>
                  <div className="mt-1 flex gap-2">
                    <button onClick={() => setSexe("homme")} className="flex-1 rounded-xl border px-3 py-3 text-sm font-medium"
                      style={{ borderColor: sexe === "homme" ? "var(--primary)" : "var(--border)", background: sexe === "homme" ? "rgba(13,79,60,0.05)" : "transparent", color: sexe === "homme" ? "var(--primary)" : "var(--muted)" }}>
                      Homme
                    </button>
                    <button onClick={() => setSexe("femme")} className="flex-1 rounded-xl border px-3 py-3 text-sm font-medium"
                      style={{ borderColor: sexe === "femme" ? "var(--primary)" : "var(--border)", background: sexe === "femme" ? "rgba(13,79,60,0.05)" : "transparent", color: sexe === "femme" ? "var(--primary)" : "var(--muted)" }}>
                      Femme
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Heures ecoulees</label>
                  <input type="number" min="0" step="0.5" value={heures} onChange={(e) => setHeures(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3 text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>A jeun ?</label>
                  <button onClick={() => setAJeun(!aJeun)} className="mt-1 w-full rounded-xl border px-3 py-3 text-sm font-medium"
                    style={{ borderColor: aJeun ? "var(--primary)" : "var(--border)", background: aJeun ? "rgba(13,79,60,0.05)" : "transparent", color: aJeun ? "var(--primary)" : "var(--muted)" }}>
                    {aJeun ? "Oui" : "Non"}
                  </button>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Alcoolemie estimee</p>
              <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: couleur }}>
                {alcoolemie.toFixed(2)}
              </p>
              <p className="mt-1 text-lg font-semibold" style={{ color: couleur }}>{statut}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>g/L de sang</p>

              {totalVerres > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{totalVerres}</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>verres</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{totalAlcool.toFixed(0)}g</p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>alcool pur</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: alcoolemie > 0 ? "#f59e0b" : "var(--primary)" }}>
                      {heuresRetour}h{minutesRetour.toString().padStart(2, "0")}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>pour revenir a 0</p>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-2xl border-2 p-6" style={{ borderColor: "#f59e0b", background: "rgba(245,158,11,0.05)" }}>
              <p className="text-sm font-bold" style={{ color: "#f59e0b" }}>Avertissement</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Ce calculateur est un outil <strong className="text-[var(--foreground)]">purement educatif</strong>. Les resultats sont des estimations basees sur la formule de Widmark et peuvent varier significativement selon le metabolisme, les medicaments, l&apos;alimentation et d&apos;autres facteurs. <strong className="text-[var(--foreground)]">Ne conduisez jamais</strong> en vous basant sur ces resultats. La limite legale en France est de 0,5 g/L (0,2 g/L pour les jeunes conducteurs).
              </p>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment est calculee l&apos;alcoolemie ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Formule de Widmark</strong> : Alcoolemie = (masse d&apos;alcool en grammes) / (poids x coefficient) - (temps x 0,15 g/L/h).</p>
                <p>Le coefficient de diffusion est de 0,68 pour les hommes et 0,55 pour les femmes. L&apos;organisme elimine en moyenne 0,15 g/L par heure.</p>
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
