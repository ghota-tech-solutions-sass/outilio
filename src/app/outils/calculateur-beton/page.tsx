"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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

            <ToolHowToSection
              title="Comment utiliser le calculateur de beton"
              description="Estimez le volume de beton, le nombre de sacs et le poids pour dalle, fondation ou poteau."
              steps={[
                {
                  name: "Choisissez le type d'ouvrage",
                  text:
                    "Selectionnez dalle/plancher, fondation/semelle ou poteau/cylindre selon votre projet. La fondation et la dalle utilisent un calcul rectangulaire (longueur x largeur x epaisseur), le poteau utilise un calcul cylindrique (Pi x rayon au carre x hauteur). Cela determine la formule appliquee automatiquement.",
                },
                {
                  name: "Entrez les dimensions en metres",
                  text:
                    "Pour une dalle ou fondation : longueur, largeur, epaisseur (10-12 cm pour une dalle pieton, 15-20 cm carrossable, 30-40 cm pour fondation de maison). Pour un poteau : diametre et hauteur. Toutes les dimensions sont attendues en metres (0,15 m = 15 cm).",
                },
                {
                  name: "Lisez les resultats : volume, sacs et poids",
                  text:
                    "L'outil affiche le volume exact en m3, le volume avec marge de 10% (recommandee), le nombre de sacs de 25 kg et 35 kg necessaires, et le poids total en tonnes. Pour plus de 1 m3, comparez avec un BPE livre en toupie : souvent plus economique et plus rapide.",
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
                Cas d&apos;usage du calculateur beton
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Dalle de terrasse maison
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une terrasse de 5 m x 4 m sur 12 cm d&apos;epaisseur = 2,4 m3 de beton, soit
                    environ 220 sacs de 25 kg avec marge. Au-dela de 1 m3, le BPE livre en toupie
                    devient plus rentable que les sacs (compter 110 a 140 EUR/m3 livre vs ~150 EUR
                    en sacs).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Fondation chantier maison neuve
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une semelle filante de 10 m x 0,4 m x 0,4 m = 1,6 m3 par cote. Une maison de
                    100 m2 au sol demande typiquement 4 a 6 m3 de beton de fondation au dosage 350
                    kg/m3 ciment. Toujours prevoir l&apos;armature (treillis soude ou ferraillage)
                    selon l&apos;etude de sol.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Plot pour cabane de jardin
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Quatre plots beton de 30 cm de diametre et 60 cm de hauteur = 4 x 0,042 m3 =
                    0,17 m3 au total. Soit environ 16 sacs de 25 kg. Ideal pour ancrer un abri de
                    jardin, une terrasse en bois sur lambourdes ou un carport leger.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Allee carrossable garage
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Allee de 8 m x 3 m sur 15 cm d&apos;epaisseur = 3,6 m3. Une dalle carrossable
                    necessite 15-20 cm minimum, sur lit de gravier compacte de 10-15 cm. Au-dela de
                    3 m3, faites livrer par toupie et armer avec un treillis soude ST25C pour
                    eviter la fissuration.
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
                A savoir sur le dosage du beton
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>La norme NF EN 206-1 encadre la composition du beton structurel.</strong> Pour
                  un beton standard de classe C25/30 (resistance 25 MPa), le dosage classique est
                  350 kg de ciment par m3 de beton, soit environ 1 sac de 35 kg pour 100 L. Pour un
                  beton de proprete sans charge, on descend a 150-250 kg/m3. Pour du beton arme
                  structurel, montez a 400 kg/m3.
                </p>
                <p>
                  <strong>Le ratio eau/ciment (E/C) idealement vise est 0,5.</strong> Trop d&apos;eau
                  affaiblit la resistance et favorise la fissuration ; trop peu rend le beton
                  inmaniable. Pour 350 kg de ciment, comptez environ 175 L d&apos;eau. La regle
                  pratique : le beton doit etre maniable mais ne pas couler tout seul de la
                  betonniere (slump 8-12 cm).
                </p>
                <p>
                  <strong>Composition type pour 1 m3 de beton dose a 350 kg/m3 :</strong> 350 kg de
                  ciment CEM II/B 32,5, 700 kg de sable 0/4, 1 100 kg de gravier 4/20, et 175 L
                  d&apos;eau. Soit en volume environ 1 part ciment, 2 parts sable, 3 parts gravier
                  (memoriser : 1-2-3). Adapter selon la granulometrie et l&apos;humidite des
                  granulats.
                </p>
                <p>
                  <strong>Differences fondation vs dalle.</strong> Une fondation reprend les charges
                  du batiment et descend hors gel (80 cm en zone H1, 50 cm en zone H3). Une dalle
                  repartit la charge sur le sol mais ne porte pas de mur. Les deux requierent un
                  treillis soude ou un ferraillage selon les charges. La densite retenue ici (2 400
                  kg/m3) correspond au beton arme courant.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions frequentes sur le calcul et le coulage du beton."
              items={[
                {
                  question: "Combien de sacs de beton pour 1 m3 ?",
                  answer:
                    "Environ 84 sacs de 25 kg (soit 12 litres chacun) ou 59 sacs de 35 kg (17 litres chacun) pour obtenir 1 m3 de beton. Ces chiffres sont des estimations basees sur du beton pret a l'emploi en sac. Pour les gros volumes (plus de 1 m3), le BPE en camion toupie est generalement plus economique et plus rapide.",
                },
                {
                  question: "Quelle epaisseur de beton pour une dalle de terrasse ?",
                  answer:
                    "Pour une dalle de terrasse pieton, 10 a 12 cm est generalement suffisant. Pour une dalle carrossable (passage de vehicules), prevoyez 15 a 20 cm. Dans tous les cas, le beton doit reposer sur un lit de gravier compacte de 10 a 15 cm pour assurer un bon drainage et eviter les remontees d'humidite.",
                },
                {
                  question: "Quelle est la difference entre beton et mortier ?",
                  answer:
                    "Le beton est compose de ciment, sable, gravier et eau. Il est utilise pour les ouvrages structurels (dalles, fondations, poteaux). Le mortier ne contient pas de gravier : seulement ciment, sable et eau. On l'utilise pour la pose de briques, parpaings et enduits. Ce calculateur est concu pour le beton, pas le mortier.",
                },
                {
                  question: "Quel dosage de ciment pour du beton de fondation ?",
                  answer:
                    "Le dosage standard pour du beton de fondation est de 350 kg de ciment par m3 de beton, conformement a la norme NF EN 206-1 (classe C25/30). Pour du beton de proprete sans charge, on descend a 150-250 kg/m3. Pour du beton arme structurel ou expose, montez a 400 kg/m3.",
                },
                {
                  question: "Pourquoi prevoir 10% de beton en plus ?",
                  answer:
                    "La marge de 10% compense les pertes inevitables : irregularites du terrain, residus dans la betonniere ou la toupie, eclaboussures, eventuelles erreurs de coffrage. Sans cette marge, vous risquez une rupture d'approvisionnement en plein coulage, ce qui cree une reprise de betonnage (point faible structurel).",
                },
                {
                  question: "Sacs ou camion toupie : quel choix selon le volume ?",
                  answer:
                    "Sous 1 m3 : les sacs sont plus pratiques (pas de minimum de livraison, pas de creneau a tenir). Entre 1 et 3 m3 : equivalent en cout, le BPE livre est moins fatiguant. Au-dela de 3 m3 : la toupie est nettement plus economique (110-140 EUR/m3 livre) et indispensable pour eviter les reprises de betonnage.",
                },
                {
                  question: "Le beton arme necessite-t-il un ferraillage ?",
                  answer:
                    "Oui, des qu'il y a une charge significative (dalle carrossable, plancher, fondation de maison). Treillis soude ST25C minimum pour une dalle, armatures HA10-HA12 pour fondations et poteaux. Sans armature, le beton resiste tres bien en compression mais cede en traction et fissure rapidement.",
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
