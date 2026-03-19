"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const PORTE_DEFAUT = { largeur: 0.9, hauteur: 2.1 };
const FENETRE_DEFAUT = { largeur: 1.2, hauteur: 1.2 };

const TAILLES_POTS = [
  { label: "0,5 L", litres: 0.5 },
  { label: "2,5 L", litres: 2.5 },
  { label: "5 L", litres: 5 },
  { label: "10 L", litres: 10 },
];

export default function CalculateurPeinture() {
  const [longueur, setLongueur] = useState("5");
  const [largeur, setLargeur] = useState("4");
  const [hauteur, setHauteur] = useState("2.5");

  const [nbPortes, setNbPortes] = useState("1");
  const [porteLargeur, setPorteLargeur] = useState(String(PORTE_DEFAUT.largeur));
  const [porteHauteur, setPorteHauteur] = useState(String(PORTE_DEFAUT.hauteur));

  const [nbFenetres, setNbFenetres] = useState("2");
  const [fenetreLargeur, setFenetreLargeur] = useState(String(FENETRE_DEFAUT.largeur));
  const [fenetreHauteur, setFenetreHauteur] = useState(String(FENETRE_DEFAUT.hauteur));

  const [couches, setCouches] = useState("2");
  const [rendement, setRendement] = useState("10");
  const [plafond, setPlafond] = useState(false);

  const result = useMemo(() => {
    const l = parseFloat(longueur) || 0;
    const w = parseFloat(largeur) || 0;
    const h = parseFloat(hauteur) || 0;
    const nPortes = parseInt(nbPortes) || 0;
    const pL = parseFloat(porteLargeur) || 0;
    const pH = parseFloat(porteHauteur) || 0;
    const nFenetres = parseInt(nbFenetres) || 0;
    const fL = parseFloat(fenetreLargeur) || 0;
    const fH = parseFloat(fenetreHauteur) || 0;
    const nCouches = parseInt(couches) || 2;
    const rend = parseFloat(rendement) || 10;

    if (l <= 0 || w <= 0 || h <= 0) return null;

    // Perimetre de la piece
    const perimetre = 2 * (l + w);
    // Surface totale des murs
    const surfaceMurs = perimetre * h;
    // Surface des ouvertures
    const surfacePortes = nPortes * pL * pH;
    const surfaceFenetres = nFenetres * fL * fH;
    const surfaceOuvertures = surfacePortes + surfaceFenetres;
    // Surface nette murs
    const surfaceNetteMurs = Math.max(0, surfaceMurs - surfaceOuvertures);
    // Surface plafond
    const surfacePlafond = plafond ? l * w : 0;
    // Surface totale a peindre
    const surfaceTotale = surfaceNetteMurs + surfacePlafond;
    // Litres necessaires
    const litres = (surfaceTotale * nCouches) / rend;

    // Nombre de pots pour chaque taille
    const pots = TAILLES_POTS.map((pot) => ({
      ...pot,
      nombre: Math.ceil(litres / pot.litres),
    }));

    return {
      surfaceMurs,
      surfaceOuvertures,
      surfaceNetteMurs,
      surfacePlafond,
      surfaceTotale,
      litres,
      pots,
      nCouches,
    };
  }, [longueur, largeur, hauteur, nbPortes, porteLargeur, porteHauteur, nbFenetres, fenetreLargeur, fenetreHauteur, couches, rendement, plafond]);

  const fmt = (n: number, dec = 2) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
            Travaux
          </p>
          <h1
            className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Calculateur de <span style={{ color: "var(--primary)" }}>peinture</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Calculez la quantite de peinture necessaire pour votre piece. Deduction des portes et fenetres, choix du nombre de couches et du rendement.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Dimensions de la piece */}
            <div className="animate-fade-up stagger-3 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Dimensions de la piece
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Longueur (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={longueur}
                    onChange={(e) => setLongueur(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Largeur (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={largeur}
                    onChange={(e) => setLargeur(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Hauteur (m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={hauteur}
                    onChange={(e) => setHauteur(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                  />
                </div>
              </div>
            </div>

            {/* Ouvertures */}
            <div className="animate-fade-up stagger-4 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Ouvertures a deduire
              </h2>

              {/* Portes */}
              <div className="mt-4">
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Portes</p>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Nombre
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={nbPortes}
                      onChange={(e) => setNbPortes(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Largeur (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={porteLargeur}
                      onChange={(e) => setPorteLargeur(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Hauteur (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={porteHauteur}
                      onChange={(e) => setPorteHauteur(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Fenetres */}
              <div className="mt-5">
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Fenetres</p>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Nombre
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={nbFenetres}
                      onChange={(e) => setNbFenetres(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Largeur (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={fenetreLargeur}
                      onChange={(e) => setFenetreLargeur(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      Hauteur (m)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={fenetreHauteur}
                      onChange={(e) => setFenetreHauteur(e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                      style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="animate-fade-up stagger-5 rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Options de peinture
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Nombre de couches
                  </label>
                  <div className="mt-2 flex gap-2">
                    {["1", "2", "3"].map((n) => (
                      <button
                        key={n}
                        onClick={() => setCouches(n)}
                        className="flex-1 rounded-xl border px-4 py-3 text-lg font-bold transition-all"
                        style={{
                          borderColor: couches === n ? "var(--primary)" : "var(--border)",
                          background: couches === n ? "var(--primary)" : "transparent",
                          color: couches === n ? "#fff" : "inherit",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                    Rendement (m&sup2;/L)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={rendement}
                    onChange={(e) => setRendement(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-lg font-bold"
                    style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                  />
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    Standard : 10-12 m&sup2;/L
                  </p>
                </div>
              </div>

              {/* Plafond toggle */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setPlafond(!plafond)}
                  className="relative h-7 w-12 rounded-full transition-colors"
                  style={{ background: plafond ? "var(--primary)" : "var(--border)" }}
                  aria-label="Inclure le plafond"
                >
                  <span
                    className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform"
                    style={{ transform: plafond ? "translateX(20px)" : "translateX(0)" }}
                  />
                </button>
                <span className="text-sm font-semibold">Inclure le plafond</span>
              </div>
            </div>

            {/* Resultats */}
            {result && (
              <>
                {/* Surface totale a peindre */}
                <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                    Surface totale a peindre
                  </p>
                  <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {fmt(result.surfaceTotale)}
                  </p>
                  <p className="mt-1 text-lg font-semibold" style={{ color: "var(--muted)" }}>m&sup2;</p>
                </div>

                {/* Detail surfaces */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: "Murs bruts", value: `${fmt(result.surfaceMurs)} m\u00B2` },
                    { label: "Ouvertures", value: `- ${fmt(result.surfaceOuvertures)} m\u00B2` },
                    { label: "Murs nets", value: `${fmt(result.surfaceNetteMurs)} m\u00B2` },
                    { label: "Plafond", value: plafond ? `${fmt(result.surfacePlafond)} m\u00B2` : "Non inclus" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl p-4 text-center"
                      style={{ background: "var(--surface-alt)" }}
                    >
                      <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>{item.label}</p>
                      <p className="mt-1 text-sm font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Litres necessaires */}
                <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                    Peinture necessaire ({result.nCouches} couche{result.nCouches > 1 ? "s" : ""})
                  </p>
                  <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                    {fmt(result.litres, 1)}
                  </p>
                  <p className="mt-1 text-lg font-semibold" style={{ color: "var(--muted)" }}>litres</p>
                </div>

                {/* Nombre de pots */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {result.pots.map((pot) => (
                    <div
                      key={pot.label}
                      className="rounded-2xl border p-6 text-center"
                      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                        Pots de {pot.label}
                      </p>
                      <p className="mt-2 text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                        {pot.nombre}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                        pot{pot.nombre > 1 ? "s" : ""} necessaire{pot.nombre > 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Conseils */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Conseils pour bien peindre
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  <strong className="text-[var(--foreground)]">2 couches minimum</strong> sont recommandees pour un rendu uniforme, surtout si vous changez de couleur.
                </p>
                <p>
                  Le <strong className="text-[var(--foreground)]">rendement reel</strong> depend de la nature du support (platre, beton, papier peint) et du type de peinture (acrylique, glycero). Consultez l&apos;etiquette du pot.
                </p>
                <p>
                  Prevoyez <strong className="text-[var(--foreground)]">5 a 10% de peinture en plus</strong> pour les retouches et les pertes lors de l&apos;application.
                </p>
                <p>
                  Pour le plafond, utilisez une peinture <strong className="text-[var(--foreground)]">speciale plafond</strong> (plus epaisse, anti-goutte) et appliquez en bandes paralleles a la source de lumiere.
                </p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le calculateur de peinture
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Ce calculateur de peinture vous permet d&apos;estimer avec precision la quantite de peinture necessaire pour peindre une piece. Il prend en compte les ouvertures (portes et fenetres) pour eviter de surestimer vos besoins, et calcule le nombre de pots selon les formats courants.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Dimensions de la piece</strong> : saisissez la longueur, la largeur et la hauteur sous plafond en metres.</li>
                  <li><strong className="text-[var(--foreground)]">Ouvertures a deduire</strong> : indiquez le nombre et les dimensions de vos portes et fenetres. Les dimensions standard sont pre-remplies.</li>
                  <li><strong className="text-[var(--foreground)]">Options</strong> : choisissez le nombre de couches (1 a 3), le rendement de votre peinture (indique sur le pot) et si vous souhaitez inclure le plafond.</li>
                </ul>
                <p>L&apos;outil calcule la surface nette a peindre, le volume de peinture en litres et le nombre de pots necessaires en formats 0,5 L, 2,5 L, 5 L et 10 L. Prevoyez 5 a 10% de peinture supplementaire pour les retouches.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Combien de litres de peinture pour une piece de 20 m&sup2; ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Pour une piece de 20 m&sup2; au sol (par exemple 5 x 4 m) avec une hauteur de 2,50 m, la surface des murs est d&apos;environ 45 m&sup2; apres deduction d&apos;une porte et deux fenetres. Avec 2 couches et un rendement de 10 m&sup2;/L, il faut environ 9 litres de peinture, soit 1 pot de 10 L ou 2 pots de 5 L. Ajoutez le plafond (20 m&sup2;) si vous souhaitez le peindre aussi.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Faut-il appliquer une sous-couche avant de peindre ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Une sous-couche (ou primaire d&apos;accrochage) est recommandee sur les supports neufs (platre, placoplatre), absorbants ou lorsque vous changez radicalement de couleur (par exemple du fonce vers du clair). Elle ameliore l&apos;adherence de la peinture, uniformise l&apos;absorption du support et peut reduire le nombre de couches de finition necessaires. Son rendement est legerement inferieur (8 a 10 m&sup2;/L).</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quelle peinture choisir : acrylique ou glycero ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>La peinture acrylique (a l&apos;eau) est la plus utilisee : elle seche vite, degage peu d&apos;odeur et se nettoie a l&apos;eau. Elle convient a la plupart des pieces. La peinture glycero (a l&apos;huile) offre une meilleure resistance a l&apos;humidite et aux chocs, ce qui la rend adaptee aux cuisines, salles de bain et boiseries. Cependant, la reglementation francaise limite de plus en plus les peintures a solvants au profit des formules aqueuses.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Rendements courants
              </h3>
              <div className="mt-3 space-y-2">
                {[
                  { type: "Peinture acrylique", rend: "10-12 m\u00B2/L" },
                  { type: "Peinture glycero", rend: "10-12 m\u00B2/L" },
                  { type: "Sous-couche", rend: "8-10 m\u00B2/L" },
                  { type: "Laque / Satinee", rend: "10-14 m\u00B2/L" },
                  { type: "Peinture plafond", rend: "8-12 m\u00B2/L" },
                  { type: "Peinture facade", rend: "5-8 m\u00B2/L" },
                ].map((r) => (
                  <div
                    key={r.type}
                    className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{ background: "var(--surface-alt)" }}
                  >
                    <span className="text-xs font-semibold">{r.type}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{r.rend}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                Dimensions standard
              </h3>
              <div className="mt-3 space-y-2">
                {[
                  { element: "Porte standard", dim: "0,90 x 2,10 m" },
                  { element: "Porte-fenetre", dim: "1,40 x 2,15 m" },
                  { element: "Fenetre standard", dim: "1,20 x 1,20 m" },
                  { element: "Velux / Fenetre toit", dim: "0,78 x 0,98 m" },
                  { element: "Baie vitree", dim: "2,40 x 2,15 m" },
                ].map((r) => (
                  <div
                    key={r.element}
                    className="flex items-center justify-between rounded-xl px-3 py-2"
                    style={{ background: "var(--surface-alt)" }}
                  >
                    <span className="text-xs font-semibold">{r.element}</span>
                    <span className="text-xs font-bold" style={{ color: "var(--primary)" }}>{r.dim}</span>
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
