"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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

            <ToolHowToSection
              title="Comment estimer votre alcoolemie en 4 etapes"
              description="L'estimation utilise la formule de Widmark, methode standard utilisee en toxicologie pour evaluer le taux d'alcoolemie. Outil educatif uniquement."
              steps={[
                {
                  name: "Indiquer les verres consommes",
                  text:
                    "Cliquez sur + pour ajouter une biere, un verre de vin, un cocktail, etc. Chaque type est calibre selon les volumes et degres standards de la consommation francaise. Un 'verre standard' contient environ 10 grammes d'alcool pur.",
                },
                {
                  name: "Renseigner votre poids et votre sexe",
                  text:
                    "Le poids influe sur la dilution de l'alcool dans le sang. Le coefficient de Widmark est 0,68 pour les hommes et 0,55 pour les femmes (la repartition de l'eau corporelle differe). Ces moyennes statistiques peuvent varier selon votre morphologie reelle.",
                },
                {
                  name: "Indiquer le temps ecoule",
                  text:
                    "Saisissez le nombre d'heures depuis votre premier verre. L'organisme elimine en moyenne 0,15 g/L par heure, mais cette vitesse varie de 0,1 a 0,2 g/L/h selon les individus. Cette variation peut faire passer ou rester au-dessus de la limite legale.",
                },
                {
                  name: "Lire le resultat avec prudence",
                  text:
                    "Le calculateur affiche une estimation et un statut indicatif. Les ecarts reels peuvent etre importants : medicaments, fatigue, etat de sante, prise alimentaire pendant la consommation, tous ces facteurs modifient l'alcoolemie reelle. Un alcootest reste la seule mesure fiable.",
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
                Limites legales et regles en France
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>0,5 g/L de sang (0,25 mg/L d&apos;air expire).</strong> Limite legale pour la
                  conduite des conducteurs experimentes (permis de plus de 3 ans). En cas de depassement,
                  amende forfaitaire 135 EUR + 6 points retires + immobilisation possible. Au-dessus de
                  0,8 g/L, c&apos;est un delit : 4 500 EUR d&apos;amende, 2 ans de prison, 6 points et
                  suspension du permis.
                </p>
                <p>
                  <strong>0,2 g/L pour les jeunes conducteurs.</strong> Permis probatoire de moins de 3
                  ans, conducteurs en periode d&apos;apprentissage et chauffeurs de transport en commun.
                  Une seule biere peut faire depasser ce seuil chez certains profils. La sanction est
                  identique pour tout depassement.
                </p>
                <p>
                  <strong>0,0 pour certains professionnels.</strong> Les chauffeurs scolaires ont un seuil
                  de 0 g/L. Toute trace d&apos;alcool est sanctionnee. Pensez aussi que certains
                  medicaments (sirops contre la toux, par exemple) peuvent contenir de l&apos;alcool
                  detecte par alcootest.
                </p>
                <p>
                  <strong>Sources de reference.</strong> Securite Routiere, Code de la route (articles
                  L234-1 a L234-18), Sante publique France. Le seuil de risque sanitaire recommande par
                  l&apos;OMS est de 10 verres par semaine maximum, sans depasser 2 verres par jour, avec
                  des jours sans consommation.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur l'estimation de l'alcoolemie."
              items={[
                {
                  question: "Le calcul est-il fiable ?",
                  answer:
                    "Non, c'est une ESTIMATION. La formule de Widmark donne un ordre de grandeur, mais la realite varie selon le metabolisme, l'etat de sante, les medicaments, l'alimentation, la prise simultanee d'eau, le rythme de consommation, etc. Seul un alcootest ou un test sanguin donne une valeur reelle.",
                },
                {
                  question: "Combien de temps pour eliminer 1 verre d'alcool ?",
                  answer:
                    "L'organisme elimine en moyenne 0,15 g/L par heure, soit environ 1 verre standard (10 g d'alcool) par heure et demie. Le foie ne peut pas accelerer cette elimination : ni cafe, ni douche froide, ni sport ne reduisent l'alcoolemie - seul le temps fonctionne.",
                },
                {
                  question: "Pourquoi le calcul est-il different homme/femme ?",
                  answer:
                    "La repartition de l'eau corporelle est differente : environ 65 % chez l'homme contre 55 % chez la femme. L'alcool se diluant dans l'eau du corps, a quantite et poids egal, l'alcoolemie est plus elevee chez la femme. Le coefficient de Widmark traduit cet ecart (0,68 H, 0,55 F).",
                },
                {
                  question: "Manger en buvant fait-il vraiment baisser l'alcoolemie ?",
                  answer:
                    "Pas exactement : la quantite finale absorbee reste la meme. En revanche, manger ralentit l'absorption intestinale, ce qui etale le pic d'alcoolemie dans le temps. C'est pourquoi le calculateur applique un facteur 0,85 si vous n'etes PAS a jeun (vs 1,0 a jeun).",
                },
                {
                  question: "Puis-je conduire si le resultat est en-dessous de 0,5 g/L ?",
                  answer:
                    "L'outil etant indicatif et l'estimation pouvant varier de 30 % par rapport a la realite, NE CONDUISEZ PAS en vous basant uniquement sur ce calcul. Si vous etes proche de la limite, attendez ou prenez un taxi/Uber. La regle d'or : 'Si tu doutes, tu ne conduis pas.'",
                },
                {
                  question: "Que vaut un 'verre standard' ?",
                  answer:
                    "En France, un verre standard contient environ 10 grammes d'alcool pur, equivalent a : 25 cl de biere a 5 %, 12 cl de vin a 12 %, 4 cl d'alcool fort a 40 %. Mais en bar, les serveurs versent souvent 1,5 a 2 verres standards (notamment pour les cocktails ou les rallonges).",
                },
                {
                  question: "Combien de temps avant de conduire le lendemain ?",
                  answer:
                    "Apres une soiree avec 6 verres, comptez minimum 6 heures de sommeil + 2 a 3 heures avant de conduire. Beaucoup de controles routiers ont lieu le matin et reveillent des alcoolemies positives chez ceux qui pensaient avoir dessoule. Dans le doute, utilisez un alcootest ou attendez davantage.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui. Tous les calculs sont realises localement dans votre navigateur. Aucune donnee de consommation n'est envoyee a un serveur ni stockee. L'outil fonctionne sans inscription et sans tracker tiers.",
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
