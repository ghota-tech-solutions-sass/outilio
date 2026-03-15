"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const FORMES = [
  { id: "dalle", label: "Dalle / Plancher", icon: "\u{1F7EB}" },
  { id: "fondation", label: "Fondation / Semelle", icon: "\u{1F3D7}\uFE0F" },
  { id: "poteau", label: "Poteau / Cylindre", icon: "\u{1F4CF}" },
];

export default function CalculateurBeton() {
  const [forme, setForme] = useState("dalle");
  const [longueur, setLongueur] = useState("5");
  const [largeur, setLargeur] = useState("3");
  const [epaisseur, setEpaisseur] = useState("0.15");
  const [diametre, setDiametre] = useState("0.3");
  const [hauteur, setHauteur] = useState("2.5");

  let volume = 0;
  if (forme === "dalle" || forme === "fondation") {
    const l = parseFloat(longueur) || 0;
    const w = parseFloat(largeur) || 0;
    const e = parseFloat(epaisseur) || 0;
    volume = l * w * e;
  } else {
    const d = parseFloat(diametre) || 0;
    const h = parseFloat(hauteur) || 0;
    volume = Math.PI * Math.pow(d / 2, 2) * h;
  }

  const volumeAvecPerte = volume * 1.1; // +10% perte
  const sacs25 = Math.ceil(volumeAvecPerte / 0.012); // ~12L par sac de 25kg
  const sacs35 = Math.ceil(volumeAvecPerte / 0.017); // ~17L par sac de 35kg
  const densiteBeton = 2400; // kg/m3
  const poids = volume * densiteBeton;

  const fmt = (n: number, d = 2) => n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Construction</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Beton</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le volume de beton necessaire et le nombre de sacs pour vos travaux. Dalle, fondation ou poteau.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Shape selection */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Type d&apos;ouvrage</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {FORMES.map((f) => (
                  <button key={f.id} onClick={() => setForme(f.id)}
                    className="rounded-xl border p-4 text-center transition-all"
                    style={{ borderColor: forme === f.id ? "var(--primary)" : "var(--border)", background: forme === f.id ? "rgba(13,79,60,0.05)" : "transparent" }}>
                    <span className="text-2xl">{f.icon}</span>
                    <p className="mt-1 text-xs font-semibold" style={{ color: forme === f.id ? "var(--primary)" : "var(--muted)" }}>{f.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Dimensions (en metres)</h2>
              {(forme === "dalle" || forme === "fondation") ? (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Longueur (m)</label>
                    <input type="number" step="0.01" min="0" value={longueur} onChange={(e) => setLongueur(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Largeur (m)</label>
                    <input type="number" step="0.01" min="0" value={largeur} onChange={(e) => setLargeur(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Epaisseur (m)</label>
                    <input type="number" step="0.01" min="0" value={epaisseur} onChange={(e) => setEpaisseur(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Diametre (m)</label>
                    <input type="number" step="0.01" min="0" value={diametre} onChange={(e) => setDiametre(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Hauteur (m)</label>
                    <input type="number" step="0.01" min="0" value={hauteur} onChange={(e) => setHauteur(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Volume de beton necessaire</p>
              <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {fmt(volume)}
              </p>
              <p className="mt-1 text-lg font-semibold" style={{ color: "var(--muted)" }}>m&sup3;</p>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                Avec 10% de marge : <strong className="text-[var(--foreground)]">{fmt(volumeAvecPerte)} m&sup3;</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Sacs de 25 kg</p>
                <p className="mt-2 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{sacs25}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>sacs necessaires</p>
              </div>
              <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Sacs de 35 kg</p>
                <p className="mt-2 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{sacs35}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>sacs necessaires</p>
              </div>
              <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Poids total</p>
                <p className="mt-2 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(poids / 1000, 1)}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>tonnes</p>
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Conseils pour le beton</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Prevoyez toujours <strong className="text-[var(--foreground)]">10% de beton en plus</strong> pour compenser les pertes, irregularites du terrain et les residus dans la betonniere.</p>
                <p>Pour les gros volumes (plus de 1 m&sup3;), il est souvent plus economique de commander du beton pret a l&apos;emploi (BPE) livre par camion toupie.</p>
                <p>Le dosage standard pour du beton de fondation est de 350 kg de ciment par m&sup3; de beton.</p>
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
