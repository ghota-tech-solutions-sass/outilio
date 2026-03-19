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
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Construction</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Beton</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le volume de beton necessaire et le nombre de sacs pour vos travaux. Dalle, fondation ou poteau.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
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

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur de beton
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Notre calculateur de beton vous permet d&apos;estimer avec precision le volume de beton necessaire pour vos travaux de construction ou de renovation. Que vous couliez une dalle de terrasse, une fondation de maison ou un poteau, l&apos;outil calcule automatiquement le volume en m&sup3;, le nombre de sacs et le poids total.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Choisissez le type d&apos;ouvrage</strong> : dalle/plancher, fondation/semelle ou poteau/cylindre selon votre projet.</li>
                  <li><strong className="text-[var(--foreground)]">Entrez les dimensions en metres</strong> : longueur, largeur et epaisseur pour une dalle, ou diametre et hauteur pour un poteau.</li>
                  <li><strong className="text-[var(--foreground)]">Lisez les resultats</strong> : volume exact en m&sup3;, volume avec 10% de marge de securite, nombre de sacs de 25 kg et 35 kg, et poids total en tonnes.</li>
                </ul>
                <p>Les quantites incluent automatiquement une marge de 10% pour compenser les pertes liees au coulage, aux irregularites du sol et aux residus dans la betonniere. La densite utilisee est de 2 400 kg/m&sup3;, valeur standard pour le beton arme en France.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien de sacs de beton pour 1 m&sup3; ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Il faut environ 84 sacs de 25 kg (soit ~12 litres chacun) ou 59 sacs de 35 kg (~17 litres chacun) pour obtenir 1 m&sup3; de beton. Ces chiffres sont des estimations basees sur du beton pret a l&apos;emploi en sac. Pour les gros volumes, un camion toupie de beton pret a l&apos;emploi (BPE) est plus economique et pratique.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle epaisseur de beton pour une dalle de terrasse ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Pour une dalle de terrasse pietons, une epaisseur de 10 a 12 cm est generalement suffisante. Pour une dalle carrossable (passage de vehicules), prevoyez 15 a 20 cm. Dans tous les cas, le beton doit reposer sur un lit de gravier compacte de 10 a 15 cm pour assurer un drainage correct.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle est la difference entre beton et mortier ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le beton est compose de ciment, sable, gravier et eau. Il est utilise pour les ouvrages structurels (dalles, fondations, poteaux). Le mortier ne contient pas de gravier : il est compose uniquement de ciment, sable et eau. On l&apos;utilise pour la pose de briques, parpaings et enduits. Ce calculateur est concu pour le beton, pas le mortier.</p>
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
