"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const PRESETS = [5, 10, 15, 20, 25];

export default function CalculateurPourboire() {
  const [montant, setMontant] = useState("50");
  const [pourcentage, setPourcentage] = useState(15);
  const [personnes, setPersonnes] = useState("2");
  const [arrondi, setArrondi] = useState(false);

  const m = parseFloat(montant) || 0;
  const p = parseInt(personnes) || 1;

  const pourboire = m * (pourcentage / 100);
  const totalBrut = m + pourboire;
  const pourboireParPersonne = pourboire / p;
  const totalParPersonne = totalBrut / p;

  const arrondirSup = (n: number) => Math.ceil(n);
  const totalArrondi = arrondi ? arrondirSup(totalParPersonne) : totalParPersonne;
  const pourboireArrondi = arrondi ? totalArrondi - m / p : pourboireParPersonne;

  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Restaurant</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Pourboire</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez le pourboire ideal et partagez l&apos;addition entre convives.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Montant de l&apos;addition (&euro;)</label>
                  <input type="number" min="0" step="0.01" value={montant} onChange={(e) => setMontant(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nombre de personnes</label>
                  <input type="number" min="1" max="50" value={personnes} onChange={(e) => setPersonnes(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-4 text-2xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Pourboire : {pourcentage}%</label>
                <input type="range" min="0" max="30" step="1" value={pourcentage} onChange={(e) => setPourcentage(Number(e.target.value))}
                  className="mt-2 w-full" />
                <div className="mt-2 flex gap-2">
                  {PRESETS.map((pct) => (
                    <button key={pct} onClick={() => setPourcentage(pct)}
                      className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all"
                      style={{ borderColor: pourcentage === pct ? "var(--primary)" : "var(--border)", background: pourcentage === pct ? "rgba(13,79,60,0.05)" : "transparent", color: pourcentage === pct ? "var(--primary)" : "var(--muted)" }}>
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <input type="checkbox" checked={arrondi} onChange={(e) => setArrondi(e.target.checked)} className="h-4 w-4" />
                  Arrondir au-dessus (par personne)
                </label>
              </div>
            </div>

            {/* Results */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Pourboire total</p>
                  <p className="mt-2 text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                    {fmt(pourboire)} &euro;
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Total avec pourboire</p>
                  <p className="mt-2 text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(totalBrut)} &euro;
                  </p>
                </div>
              </div>
            </div>

            {p > 1 && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Par personne ({p} personnes)</p>
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Pourboire</p>
                    <p className="mt-1 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                      {fmt(pourboireArrondi)} &euro;
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--muted)" }}>Total a payer</p>
                    <p className="mt-1 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                      {fmt(totalArrondi)} &euro;
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comparison table */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Comparaison des taux</h2>
              <div className="mt-4 space-y-2">
                {[5, 10, 15, 20, 25].map((pct) => {
                  const tip = m * (pct / 100);
                  return (
                    <div key={pct} className="flex items-center justify-between rounded-lg px-4 py-2"
                      style={{ background: pct === pourcentage ? "rgba(13,79,60,0.05)" : "var(--surface-alt)" }}>
                      <span className="text-sm font-bold" style={{ color: pct === pourcentage ? "var(--primary)" : "var(--foreground)" }}>{pct}%</span>
                      <span className="text-sm" style={{ color: "var(--muted)" }}>Pourboire : {fmt(tip)} &euro;</span>
                      <span className="text-sm font-bold">Total : {fmt(m + tip)} &euro;</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Les usages du pourboire</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>En <strong className="text-[var(--foreground)]">France</strong>, le service est inclus dans les prix (15%). Le pourboire est un geste apprecie mais pas obligatoire, generalement 5-10%.</p>
                <p>Aux <strong className="text-[var(--foreground)]">Etats-Unis</strong>, le pourboire est quasi-obligatoire : 15-20% au restaurant, 10-15% pour les taxis.</p>
                <p>Au <strong className="text-[var(--foreground)]">Japon</strong>, laisser un pourboire est considere comme impoli.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur de pourboire
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Notre calculateur de pourboire vous permet de determiner rapidement le montant a laisser au restaurant ou dans tout autre etablissement de service. Il suffit de renseigner le montant de l&apos;addition et le pourcentage souhaite pour obtenir le resultat instantanement.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Entrez le montant de l&apos;addition</strong> : saisissez la somme totale hors pourboire en euros.</li>
                  <li><strong className="text-[var(--foreground)]">Choisissez le pourcentage</strong> : utilisez le curseur ou les boutons predefinis (5%, 10%, 15%, 20%, 25%) selon votre satisfaction.</li>
                  <li><strong className="text-[var(--foreground)]">Partagez entre convives</strong> : indiquez le nombre de personnes pour diviser equitablement l&apos;addition et le pourboire.</li>
                  <li><strong className="text-[var(--foreground)]">Option d&apos;arrondi</strong> : activez l&apos;arrondi au-dessus pour simplifier le paiement par personne.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Le pourboire est-il obligatoire en France ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non, en France le service est inclus dans les prix affiches (15% du prix hors taxe). Le pourboire est un geste de remerciement facultatif. Il est toutefois courant de laisser entre 5% et 10% de l&apos;addition pour un service apprecie, surtout au restaurant.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quel pourcentage de pourboire laisser au restaurant ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>En France, 5 a 10% est la norme pour un bon service. Pour un service exceptionnel, vous pouvez aller jusqu&apos;a 15%. Aux Etats-Unis, le pourboire standard est de 15 a 20%, car les serveurs dependent largement des pourboires pour leur revenu.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment partager equitablement l&apos;addition entre plusieurs personnes ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Indiquez le nombre de convives dans le champ prevu et notre outil divisera automatiquement le total (addition + pourboire) par personne. L&apos;option d&apos;arrondi permet d&apos;obtenir un montant entier par personne, ce qui facilite le paiement en especes.</p>
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
