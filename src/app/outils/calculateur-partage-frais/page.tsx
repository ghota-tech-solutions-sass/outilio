"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface Depense {
  id: number;
  payeur: string;
  montant: string;
  description: string;
}

interface Remboursement {
  de: string;
  a: string;
  montant: number;
}

let nextId = 1;

// Montant saisi converti en centimes entiers (les négatifs et valeurs invalides comptent pour 0)
function enCentimes(montant: string): number {
  const v = parseFloat(montant);
  return Number.isFinite(v) && v > 0 ? Math.round(v * 100) : 0;
}

// Calcul en centimes entiers : les parts, soldes et remboursements tombent juste au centime près.
function calculerPartage(personnes: string[], depenses: Depense[]) {
  const soldes = new Map<string, number>();
  const depensesParPersonne = new Map<string, number>();
  const remboursements: Remboursement[] = [];
  if (personnes.length === 0) return { total: 0, partParPersonne: 0, partsInegales: false, soldes, remboursements, depensesParPersonne };

  const payeCentimes = new Map<string, number>();
  personnes.forEach((p) => payeCentimes.set(p, 0));
  let totalCentimes = 0;
  depenses.forEach((d) => {
    if (!payeCentimes.has(d.payeur)) return;
    const c = enCentimes(d.montant);
    totalCentimes += c;
    payeCentimes.set(d.payeur, (payeCentimes.get(d.payeur) || 0) + c);
  });

  // Part de chacun : division entière, les centimes restants sont attribués un par un
  // aux premiers participants de la liste (écart maximal d'un centime entre deux parts).
  const n = personnes.length;
  const base = Math.floor(totalCentimes / n);
  const reste = totalCentimes - base * n;
  const soldesCentimes = new Map<string, number>();
  personnes.forEach((p, i) => {
    const part = base + (i < reste ? 1 : 0);
    soldesCentimes.set(p, (payeCentimes.get(p) || 0) - part);
  });

  // Compensation gloutonne : le plus gros débiteur rembourse le plus gros créancier.
  // Au plus n − 1 virements (pas toujours le minimum absolu, qui est un problème NP-difficile).
  const debiteurs: { nom: string; montant: number }[] = [];
  const crediteurs: { nom: string; montant: number }[] = [];
  soldesCentimes.forEach((solde, nom) => {
    if (solde < 0) debiteurs.push({ nom, montant: -solde });
    if (solde > 0) crediteurs.push({ nom, montant: solde });
  });
  debiteurs.sort((a, b) => b.montant - a.montant);
  crediteurs.sort((a, b) => b.montant - a.montant);

  let i = 0;
  let j = 0;
  while (i < debiteurs.length && j < crediteurs.length) {
    const montant = Math.min(debiteurs[i].montant, crediteurs[j].montant);
    remboursements.push({ de: debiteurs[i].nom, a: crediteurs[j].nom, montant: montant / 100 });
    debiteurs[i].montant -= montant;
    crediteurs[j].montant -= montant;
    if (debiteurs[i].montant === 0) i++;
    if (crediteurs[j].montant === 0) j++;
  }

  soldesCentimes.forEach((c, nom) => soldes.set(nom, c / 100));
  payeCentimes.forEach((c, nom) => depensesParPersonne.set(nom, c / 100));

  return { total: totalCentimes / 100, partParPersonne: totalCentimes / 100 / n, partsInegales: reste > 0, soldes, remboursements, depensesParPersonne };
}

export default function CalculateurPartageFrais() {
  const [personnes, setPersonnes] = useState<string[]>(["Alice", "Bob"]);
  const [nouvellePersonne, setNouvellePersonne] = useState("");
  const [depenses, setDepenses] = useState<Depense[]>([
    { id: nextId++, payeur: "Alice", montant: "60", description: "Restaurant" },
    { id: nextId++, payeur: "Bob", montant: "30", description: "Courses" },
  ]);

  const ajouterPersonne = () => {
    const nom = nouvellePersonne.trim();
    if (nom && !personnes.includes(nom)) {
      setPersonnes([...personnes, nom]);
      setNouvellePersonne("");
    }
  };

  const supprimerPersonne = (nom: string) => {
    setPersonnes(personnes.filter((p) => p !== nom));
    setDepenses(depenses.filter((d) => d.payeur !== nom));
  };

  const ajouterDepense = () => {
    if (personnes.length === 0) return;
    setDepenses([
      ...depenses,
      { id: nextId++, payeur: personnes[0], montant: "", description: "" },
    ]);
  };

  const modifierDepense = (id: number, champ: keyof Depense, valeur: string) => {
    setDepenses(depenses.map((d) => (d.id === id ? { ...d, [champ]: valeur } : d)));
  };

  const supprimerDepense = (id: number) => {
    setDepenses(depenses.filter((d) => d.id !== id));
  };

  const resultats = useMemo(() => calculerPartage(personnes, depenses), [personnes, depenses]);

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Quotidien</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Calculateur <span style={{ color: "var(--primary)" }}>Partage de Frais</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Ajoutez les participants et les dépenses : l&apos;outil calcule automatiquement qui doit rembourser qui, avec peu de virements.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Personnes */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Participants</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {personnes.map((p) => (
                  <span key={p} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium" style={{ background: "var(--surface-alt)", color: "var(--foreground)" }}>
                    {p}
                    <button onClick={() => supprimerPersonne(p)} className="ml-1 text-xs opacity-50 hover:opacity-100" aria-label={`Supprimer ${p}`}>&times;</button>
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={nouvellePersonne}
                  onChange={(e) => setNouvellePersonne(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && ajouterPersonne()}
                  placeholder="Nom du participant"
                  className="flex-1 rounded-xl border px-4 py-3 text-sm"
                  style={{ borderColor: "var(--border)" }}
                />
                <button
                  onClick={ajouterPersonne}
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-white"
                  style={{ background: "var(--primary)" }}
                >
                  Ajouter
                </button>
              </div>
            </div>

            {/* Depenses */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Dépenses</h2>
              <div className="mt-4 space-y-3">
                {depenses.map((d) => (
                  <div key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl p-3" style={{ background: "var(--surface-alt)" }}>
                    <select
                      value={d.payeur}
                      onChange={(e) => modifierDepense(d.id, "payeur", e.target.value)}
                      className="rounded-lg border px-3 py-2 text-sm font-medium"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {personnes.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>a payé</span>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={d.montant}
                        onChange={(e) => modifierDepense(d.id, "montant", e.target.value)}
                        placeholder="0"
                        className="w-28 rounded-lg border px-3 py-2 text-sm font-bold"
                        style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--muted)" }}>&euro;</span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>pour</span>
                    <input
                      type="text"
                      value={d.description}
                      onChange={(e) => modifierDepense(d.id, "description", e.target.value)}
                      placeholder="Description"
                      className="flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-sm"
                      style={{ borderColor: "var(--border)" }}
                    />
                    <button onClick={() => supprimerDepense(d.id)} className="text-sm opacity-50 hover:opacity-100" aria-label="Supprimer">&times;</button>
                  </div>
                ))}
              </div>
              <button
                onClick={ajouterDepense}
                className="mt-4 w-full rounded-xl border-2 border-dashed px-4 py-3 text-sm font-semibold transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                + Ajouter une dépense
              </button>
            </div>

            {/* Total */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Total des dépenses</p>
              <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {fmt(resultats.total)} &euro;
              </p>
              <p className="mt-2 text-lg font-semibold" style={{ color: "var(--accent)" }}>
                {fmt(resultats.partParPersonne)} &euro; / personne
              </p>
              {resultats.partsInegales && (
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Le total ne se divise pas au centime près : certaines parts sont arrondies d&apos;un centime pour que la somme tombe juste.
                </p>
              )}
            </div>

            {/* Resume par personne */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Résumé par personne</h2>
              <div className="mt-4 space-y-3">
                {personnes.map((p) => {
                  const depenseTotal = resultats.depensesParPersonne?.get(p) || 0;
                  const solde = resultats.soldes.get(p) || 0;
                  return (
                    <div key={p} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
                      <div>
                        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{p}</span>
                        <span className="ml-3 text-xs" style={{ color: "var(--muted)" }}>a payé {fmt(depenseTotal)} &euro;</span>
                      </div>
                      <span className="text-lg font-bold" style={{
                        fontFamily: "var(--font-display)",
                        color: solde > 0.005 ? "#16a34a" : solde < -0.005 ? "#dc2626" : "var(--muted)",
                      }}>
                        {solde > 0.005 ? `+${fmt(solde)}` : solde < -0.005 ? fmt(solde) : "0,00"} &euro;
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Remboursements */}
            {resultats.remboursements.length > 0 && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Remboursements nécessaires</h2>
                <div className="mt-4 space-y-3">
                  {resultats.remboursements.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-4" style={{ background: "var(--surface-alt)" }}>
                      <span className="text-sm font-bold" style={{ color: "#dc2626" }}>{r.de}</span>
                      <span className="flex-1 border-b border-dashed" style={{ borderColor: "var(--border)" }} />
                      <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{fmt(r.montant)} &euro;</span>
                      <span className="flex-1 border-b border-dashed" style={{ borderColor: "var(--border)" }} />
                      <span className="text-sm font-bold" style={{ color: "#16a34a" }}>{r.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contenu SEO */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment partager les frais équitablement ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Le partage de frais entre amis, colocataires ou collègues peut vite devenir un casse-tête. Cet outil automatise le calcul grâce à un algorithme de <strong className="text-[var(--foreground)]">compensation des soldes</strong> qui limite le nombre de virements : jamais plus que le nombre de participants moins un.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Ajoutez les participants</strong> : toutes les personnes concernées par le partage.</li>
                  <li><strong className="text-[var(--foreground)]">Saisissez chaque dépense</strong> : qui a payé, combien, et pour quoi.</li>
                  <li><strong className="text-[var(--foreground)]">Obtenez le résultat</strong> : l&apos;outil calcule automatiquement le solde de chacun et les remboursements à effectuer, au centime près.</li>
                </ul>
                <p>Toutes les dépenses sont partagées à parts égales entre tous les participants. Le calcul est instantané et se met à jour en temps réel. Supprimer un participant supprime aussi les dépenses qu&apos;il a payées.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment fonctionne l&apos;algorithme de compensation ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>L&apos;algorithme calcule d&apos;abord le solde de chaque personne (ce qu&apos;elle a payé moins sa part), en centimes entiers pour éviter les erreurs d&apos;arrondi. Ensuite, il fait rembourser le plus gros débiteur au plus gros créancier, et ainsi de suite. On obtient au plus « nombre de participants − 1 » virements : si 3 personnes doivent de l&apos;argent à 2 autres, 4 virements au maximum suffisent au lieu de 6. Ce n&apos;est pas toujours le minimum absolu, mais c&apos;est très proche en pratique.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Les dépenses sont-elles partagées à parts égales ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, dans cette version chaque dépense est répartie à parts égales entre tous les participants. Le total des dépenses est divisé par le nombre de personnes pour obtenir la part de chacun ; si le total ne tombe pas juste, les centimes restants sont attribués un par un pour que la somme des parts corresponde exactement au total. La différence entre ce que chacun a payé et sa part détermine les remboursements.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Mes données sont-elles sauvegardées ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non, tout le calcul se fait localement dans votre navigateur : les noms et montants saisis ne sont envoyés à aucun serveur. Si vous fermez la page, les données sont perdues. Pensez à noter les remboursements avant de quitter.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quand utiliser un outil de partage de frais ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Cet outil est idéal pour les vacances entre amis, les colocations, les repas de groupe, les sorties, les cadeaux communs ou tout événement où plusieurs personnes avancent des dépenses pour le groupe. Plus besoin de tableur ni de calculs manuels.</p>
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
