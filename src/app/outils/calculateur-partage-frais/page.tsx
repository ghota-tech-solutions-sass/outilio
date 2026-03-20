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

  const resultats = useMemo(() => {
    if (personnes.length === 0) return { total: 0, partParPersonne: 0, soldes: new Map<string, number>(), remboursements: [] as Remboursement[] };

    const total = depenses.reduce((sum, d) => sum + (parseFloat(d.montant) || 0), 0);
    const partParPersonne = total / personnes.length;

    // Calculer le solde de chaque personne (positif = on lui doit, negatif = il doit)
    const soldes = new Map<string, number>();
    personnes.forEach((p) => soldes.set(p, 0));

    depenses.forEach((d) => {
      const montant = parseFloat(d.montant) || 0;
      const current = soldes.get(d.payeur) || 0;
      soldes.set(d.payeur, current + montant);
    });

    // Convertir en ecarts par rapport a la part equitable
    personnes.forEach((p) => {
      const paye = soldes.get(p) || 0;
      soldes.set(p, paye - partParPersonne);
    });

    // Algorithme de compensation minimale
    const debiteurs: { nom: string; montant: number }[] = [];
    const crediteurs: { nom: string; montant: number }[] = [];

    soldes.forEach((solde, nom) => {
      if (solde < -0.01) debiteurs.push({ nom, montant: -solde });
      if (solde > 0.01) crediteurs.push({ nom, montant: solde });
    });

    debiteurs.sort((a, b) => b.montant - a.montant);
    crediteurs.sort((a, b) => b.montant - a.montant);

    const remboursements: Remboursement[] = [];
    let i = 0;
    let j = 0;

    while (i < debiteurs.length && j < crediteurs.length) {
      const montant = Math.min(debiteurs[i].montant, crediteurs[j].montant);
      if (montant > 0.01) {
        remboursements.push({
          de: debiteurs[i].nom,
          a: crediteurs[j].nom,
          montant,
        });
      }
      debiteurs[i].montant -= montant;
      crediteurs[j].montant -= montant;
      if (debiteurs[i].montant < 0.01) i++;
      if (crediteurs[j].montant < 0.01) j++;
    }

    // Calculer les depenses totales par personne (pour affichage)
    const depensesParPersonne = new Map<string, number>();
    personnes.forEach((p) => depensesParPersonne.set(p, 0));
    depenses.forEach((d) => {
      const montant = parseFloat(d.montant) || 0;
      const current = depensesParPersonne.get(d.payeur) || 0;
      depensesParPersonne.set(d.payeur, current + montant);
    });

    return { total, partParPersonne, soldes, remboursements, depensesParPersonne };
  }, [personnes, depenses]);

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
            Ajoutez les participants et les depenses, l&apos;outil calcule automatiquement qui doit rembourser qui avec un minimum de transactions.
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
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Depenses</h2>
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
                    <span className="text-xs" style={{ color: "var(--muted)" }}>a paye</span>
                    <div className="relative">
                      <input
                        type="number"
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
                + Ajouter une depense
              </button>
            </div>

            {/* Total */}
            <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Total des depenses</p>
              <p className="mt-3 text-6xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                {fmt(resultats.total)} &euro;
              </p>
              <p className="mt-2 text-lg font-semibold" style={{ color: "var(--accent)" }}>
                {fmt(resultats.partParPersonne)} &euro; / personne
              </p>
            </div>

            {/* Resume par personne */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Resume par personne</h2>
              <div className="mt-4 space-y-3">
                {personnes.map((p) => {
                  const depenseTotal = resultats.depensesParPersonne?.get(p) || 0;
                  const solde = resultats.soldes.get(p) || 0;
                  return (
                    <div key={p} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--surface-alt)" }}>
                      <div>
                        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{p}</span>
                        <span className="ml-3 text-xs" style={{ color: "var(--muted)" }}>a paye {fmt(depenseTotal)} &euro;</span>
                      </div>
                      <span className="text-lg font-bold" style={{
                        fontFamily: "var(--font-display)",
                        color: solde > 0.01 ? "#16a34a" : solde < -0.01 ? "#dc2626" : "var(--muted)",
                      }}>
                        {solde > 0.01 ? `+${fmt(solde)}` : solde < -0.01 ? fmt(solde) : "0,00"} &euro;
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Remboursements */}
            {resultats.remboursements.length > 0 && (
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Remboursements necessaires</h2>
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
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment partager les frais equitablement ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Le partage de frais entre amis, colocataires ou collegues peut vite devenir un casse-tete. Cet outil automatise le calcul en utilisant un algorithme de <strong className="text-[var(--foreground)]">compensation minimale</strong> qui reduit le nombre de transactions necessaires au strict minimum.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Ajoutez les participants</strong> : toutes les personnes concernees par le partage.</li>
                  <li><strong className="text-[var(--foreground)]">Saisissez chaque depense</strong> : qui a paye, combien, et pour quoi.</li>
                  <li><strong className="text-[var(--foreground)]">Obtenez le resultat</strong> : l&apos;outil calcule automatiquement le solde de chacun et les remboursements optimaux a effectuer.</li>
                </ul>
                <p>Toutes les depenses sont partagees a parts egales entre tous les participants. Le calcul est instantane et se met a jour en temps reel.</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment fonctionne l&apos;algorithme de compensation minimale ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>L&apos;algorithme calcule d&apos;abord le solde de chaque personne (ce qu&apos;elle a paye moins sa part equitable). Ensuite, il associe les debiteurs aux crediteurs en minimisant le nombre de transactions. Par exemple, si 3 personnes doivent de l&apos;argent a 2 autres, l&apos;algorithme peut parfois reduire les 6 transactions possibles a seulement 3 ou 4.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Les depenses sont-elles partagees a parts egales ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, dans cette version chaque depense est repartie equitablement entre tous les participants. Le total des depenses est divise par le nombre de personnes pour obtenir la part de chacun. La difference entre ce que chacun a paye et sa part determine les remboursements necessaires.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Mes donnees sont-elles sauvegardees ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non, tout le calcul se fait localement dans votre navigateur. Aucune donnee n&apos;est envoyee a un serveur. Si vous fermez la page, les donnees seront perdues. Pensez a noter les remboursements avant de quitter.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Quand utiliser un outil de partage de frais ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Cet outil est ideal pour les vacances entre amis, les collocations, les repas de groupe, les sorties, les cadeaux communs ou tout evenement ou plusieurs personnes avancent des depenses pour le groupe. Plus besoin de tableur ou de calculs manuels.</p>
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
