"use client";

import { useState, useRef } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
}

export default function GenerateurFacture() {
  const [emetteur, setEmetteur] = useState({ nom: "", adresse: "", siret: "", email: "" });
  const [client, setClient] = useState({ nom: "", adresse: "", email: "" });
  const [numero, setNumero] = useState("FAC-001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lignes, setLignes] = useState<LigneFacture[]>([
    { description: "", quantite: 1, prixUnitaire: 0 },
  ]);
  const [tva, setTva] = useState("20");
  const printRef = useRef<HTMLDivElement>(null);

  const addLigne = () => setLignes([...lignes, { description: "", quantite: 1, prixUnitaire: 0 }]);
  const removeLigne = (i: number) => setLignes(lignes.filter((_, idx) => idx !== i));
  const updateLigne = (i: number, field: keyof LigneFacture, value: string | number) => {
    const updated = [...lignes];
    updated[i] = { ...updated[i], [field]: value };
    setLignes(updated);
  };

  const totalHT = lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0);
  const montantTVA = totalHT * ((parseFloat(tva) || 0) / 100);
  const totalTTC = totalHT + montantTVA;

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handlePrint = () => window.print();

  return (
    <>
      <section className="relative py-14 no-print" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Facturation</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur de <span style={{ color: "var(--primary)" }}>factures</span> gratuit
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Creez des factures professionnelles et imprimez-les en PDF. Conforme a la legislation francaise.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6 no-print">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations emetteur</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Nom / Societe" value={emetteur.nom} onChange={(v) => setEmetteur({ ...emetteur, nom: v })} />
                <Input label="SIRET" value={emetteur.siret} onChange={(v) => setEmetteur({ ...emetteur, siret: v })} />
                <Input label="Adresse" value={emetteur.adresse} onChange={(v) => setEmetteur({ ...emetteur, adresse: v })} />
                <Input label="Email" value={emetteur.email} onChange={(v) => setEmetteur({ ...emetteur, email: v })} />
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations client</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Nom / Societe" value={client.nom} onChange={(v) => setClient({ ...client, nom: v })} />
                <Input label="Email" value={client.email} onChange={(v) => setClient({ ...client, email: v })} />
                <Input label="Adresse" value={client.adresse} onChange={(v) => setClient({ ...client, adresse: v })} className="sm:col-span-2" />
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Details de la facture</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input label="Numero de facture" value={numero} onChange={setNumero} />
                <Input label="Date" value={date} onChange={setDate} type="date" />
                <Input label="TVA (%)" value={tva} onChange={setTva} type="number" />
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Lignes de facturation</h2>
              {lignes.map((l, i) => (
                <div key={i} className="mt-3 grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    {i === 0 && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Description</label>}
                    <input
                      type="text"
                      value={l.description}
                      onChange={(e) => updateLigne(i, "description", e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div className="col-span-2">
                    {i === 0 && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Quantite</label>}
                    <input
                      type="number"
                      min="1"
                      value={l.quantite}
                      onChange={(e) => updateLigne(i, "quantite", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div className="col-span-3">
                    {i === 0 && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Prix unit. HT</label>}
                    <input
                      type="number"
                      step="0.01"
                      value={l.prixUnitaire}
                      onChange={(e) => updateLigne(i, "prixUnitaire", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div className="col-span-2 flex gap-1">
                    <span className="py-2 text-sm font-medium" style={{ color: "var(--foreground)" }}>{fmt(l.quantite * l.prixUnitaire)} &euro;</span>
                    {lignes.length > 1 && (
                      <button onClick={() => removeLigne(i)} className="text-lg" style={{ color: "#dc2626" }}>&times;</button>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={addLigne} className="mt-3 text-sm font-medium hover:underline" style={{ color: "var(--primary)" }}>
                + Ajouter une ligne
              </button>

              <div className="mt-4 border-t pt-4 text-right space-y-1" style={{ borderColor: "var(--border)" }}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Total HT : <span className="font-medium" style={{ color: "var(--foreground)" }}>{fmt(totalHT)} &euro;</span></p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>TVA ({tva}%) : <span className="font-medium" style={{ color: "var(--foreground)" }}>{fmt(montantTVA)} &euro;</span></p>
                <p className="text-lg font-bold" style={{ color: "var(--primary)" }}>Total TTC : {fmt(totalTTC)} &euro;</p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="w-full rounded-2xl py-3 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              Imprimer / Sauvegarder en PDF
            </button>
          </div>

          <aside className="space-y-6 no-print">
            <AdPlaceholder className="h-[250px]" />
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>

        {/* Printable invoice */}
        <div ref={printRef} className="hidden print:block print:p-8">
          <div className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold">{emetteur.nom || "Votre societe"}</h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{emetteur.adresse}</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>SIRET : {emetteur.siret}</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{emetteur.email}</p>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>FACTURE</h1>
              <p className="text-sm">{numero}</p>
              <p className="text-sm">Date : {date}</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
            <h3 className="font-semibold">Facturer a :</h3>
            <p>{client.nom}</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{client.adresse}</p>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{client.email}</p>
          </div>

          <table className="mt-6 w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th className="pb-2 text-left">Description</th>
                <th className="pb-2 text-right">Qte</th>
                <th className="pb-2 text-right">Prix unit. HT</th>
                <th className="pb-2 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((l, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-2">{l.description}</td>
                  <td className="py-2 text-right">{l.quantite}</td>
                  <td className="py-2 text-right">{fmt(l.prixUnitaire)} &euro;</td>
                  <td className="py-2 text-right">{fmt(l.quantite * l.prixUnitaire)} &euro;</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-right space-y-1">
            <p>Total HT : {fmt(totalHT)} &euro;</p>
            <p>TVA ({tva}%) : {fmt(montantTVA)} &euro;</p>
            <p className="text-lg font-bold">Total TTC : {fmt(totalTTC)} &euro;</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
        style={{ borderColor: "var(--border)" }}
      />
    </div>
  );
}
