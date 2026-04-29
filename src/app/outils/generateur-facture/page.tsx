"use client";

import { useState, useRef } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
}

export default function GenerateurFacture() {
  const [emetteur, setEmetteur] = useState({ nom: "", adresse: "", siret: "", email: "", iban: "" });
  const [client, setClient] = useState({ nom: "", adresse: "", email: "" });
  const [numero, setNumero] = useState("FAC-001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lignes, setLignes] = useState<LigneFacture[]>([
    { description: "", quantite: 1, prixUnitaire: 0 },
  ]);
  const [tva, setTva] = useState("20");
  const [echeance, setEcheance] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [conditionsPaiement, setConditionsPaiement] = useState("Virement bancaire a 30 jours");
  const [penalitesRetard, setPenalitesRetard] = useState("3");
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
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Facturation</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur de <span style={{ color: "var(--primary)" }}>factures</span> gratuit
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Creez des factures professionnelles et imprimez-les en PDF. Mentions legales obligatoires incluses.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
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
                <Input label="IBAN / RIB" value={emetteur.iban} onChange={(v) => setEmetteur({ ...emetteur, iban: v })} className="sm:col-span-2" />
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
                <Input label="Date d'emission" value={date} onChange={setDate} type="date" />
                <Input label="TVA (%)" value={tva} onChange={setTva} type="number" />
                <Input label="Date d'echeance" value={echeance} onChange={setEcheance} type="date" />
                <Input label="Conditions de paiement" value={conditionsPaiement} onChange={setConditionsPaiement} className="sm:col-span-2" />
              </div>
              <div className="mt-3">
                <Input label="Taux penalites de retard (%)" value={penalitesRetard} onChange={setPenalitesRetard} type="number" />
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Minimum legal : 3x le taux d&apos;interet legal. L&apos;indemnite forfaitaire de recouvrement de 40 &euro; est ajoutee automatiquement.
                </p>
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

            <div className="no-print">
              <ToolHowToSection
                title="Comment creer une facture conforme en France"
                description="Le generateur inclut toutes les mentions legales obligatoires (article L441-9 du Code de commerce). Verifiez votre statut (auto-entrepreneur, SAS, EURL) pour adapter les mentions specifiques."
                steps={[
                  {
                    name: "Renseigner l'emetteur",
                    text:
                      "Nom ou raison sociale, adresse complete, SIRET, code APE, capital social pour les societes. Pour un auto-entrepreneur, le SIRET et la mention 'EI' (Entrepreneur Individuel) suffisent. Pour les professions liberales, ajouter le numero d'identification ADELI ou Ordre.",
                  },
                  {
                    name: "Renseigner le client",
                    text:
                      "Nom ou raison sociale, adresse. Pour un client professionnel B2B, ajouter son SIRET et son numero de TVA intracommunautaire (mentions obligatoires si > 150 EUR HT).",
                  },
                  {
                    name: "Decrire les prestations / produits",
                    text:
                      "Pour chaque ligne : designation precise, quantite, prix unitaire HT. Une description trop vague ('prestation de service') peut faire l'objet d'un redressement. Soyez specifique : 'Conception graphique logo - 5 propositions et 2 retouches'.",
                  },
                  {
                    name: "Choisir le taux de TVA et les conditions",
                    text:
                      "20 % par defaut, 10 % restauration/hebergement, 5,5 % alimentation/livres, 2,1 % medicaments rembourses. Pour la franchise en base, mettez 0 % et ajoutez 'TVA non applicable, art. 293 B du CGI'. Conditions de paiement : delai (30j legal max en B2B), mode et penalites de retard.",
                  },
                  {
                    name: "Telecharger en PDF",
                    text:
                      "Cliquez sur 'Imprimer / Sauvegarder en PDF'. Choisissez 'Enregistrer au format PDF' dans la fenetre d'impression. Conservez le PDF dans votre comptabilite pendant 10 ans (obligation comptable francaise).",
                  },
                ]}
              />
            </div>

            <section
              className="rounded-xl border p-6 md:p-8 shadow-sm no-print"
              style={{ background: "var(--surface)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
              >
                Mentions legales obligatoires en 2026
              </h2>
              <div className="mt-4 space-y-3 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  En France, une facture doit obligatoirement contenir certaines mentions legales
                  pour etre valide (article L441-9 du Code de commerce) :
                </p>
                <ul className="ml-6 list-disc space-y-1" style={{ color: "var(--muted)" }}>
                  <li><strong style={{ color: "var(--foreground)" }}>Identite de l&apos;emetteur</strong> : nom ou raison sociale, adresse, SIRET</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Identite du client</strong> : nom ou raison sociale, adresse</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Numero de facture</strong> : unique et sequentiel</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Date d&apos;emission</strong> et date d&apos;echeance</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Detail des prestations</strong> : designation, quantite, prix unitaire HT</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Montants</strong> : total HT, taux et montant de TVA, total TTC</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Conditions de paiement</strong> : delai, mode de reglement</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Penalites de retard</strong> : taux applicable et indemnite forfaitaire de recouvrement (40 EUR, art. D441-5)</li>
                </ul>
                <p>
                  <strong>Facturation electronique 2026.</strong> Depuis 2024 et progressivement
                  jusqu&apos;en 2026, la facturation electronique devient obligatoire pour les
                  entreprises assujetties a la TVA. Le format PDF reste accepte tant que la
                  reception se fait via une plateforme de dematerialisation partenaire (PDP).
                </p>
                <p>
                  <strong>Source.</strong> Code de commerce art. L441-9, L441-10 et D441-5. Code
                  general des impots art. 289 et 242 nonies A. Verifications a impots.gouv.fr.
                </p>
              </div>
            </section>

            <div className="no-print">
              <ToolFaqSection
                intro="Les questions les plus frequentes sur la facturation en France."
                items={[
                  {
                    question: "Une facture sans TVA est-elle valide ?",
                    answer:
                      "Oui. Si vous etes auto-entrepreneur en franchise de TVA (article 293 B du CGI), vous devez indiquer la mention 'TVA non applicable, art. 293 B du CGI' sur vos factures. Mettez simplement le taux de TVA a 0 % dans notre outil.",
                  },
                  {
                    question: "Comment numerote-t-on ses factures ?",
                    answer:
                      "La numerotation doit etre chronologique et continue, sans trou. Vous pouvez utiliser un format comme FAC-2026-001 ou simplement 001, 002, 003. L'important est que chaque facture ait un numero unique et que la sequence soit ininterrompue. Vous pouvez utiliser des suffixes/prefixes par client si vous gardez la chronologie globale.",
                  },
                  {
                    question: "Combien de temps conserver ses factures ?",
                    answer:
                      "En France, les factures doivent etre conservees pendant 10 ans (obligation comptable, art. L123-22 du Code de commerce) ou 6 ans (obligation fiscale, art. L102 B du Livre des procedures fiscales). Le delai le plus long s'applique. Les factures electroniques au format PDF sont acceptees comme preuves legales depuis la loi de 2017.",
                  },
                  {
                    question: "Quel delai de paiement legal en France ?",
                    answer:
                      "30 jours par defaut (art. L441-10 Code commerce). Maximum 60 jours apres date d'emission ou 45 jours fin de mois entre professionnels. Pour les particuliers, pas de delai legal mais 30 jours est une norme. Au-dela : penalites de retard (3 fois le taux interet legal, soit ~12 % en 2026) et indemnite forfaitaire 40 EUR.",
                  },
                  {
                    question: "Faut-il facturer la TVA pour un client a l'etranger ?",
                    answer:
                      "Pour un client B2B intracommunautaire (UE), la facture est en general HT avec mention 'autoliquidation par le preneur, art. 196 directive 2006/112/CE'. Pour un client B2C intracommunautaire, le guichet OSS regroupe les declarations. Hors UE (export), pas de TVA francaise mais ajouter 'Exoneration TVA, art. 262 ter I du CGI' (livraisons de biens) ou 'art. 259-1' (services).",
                  },
                  {
                    question: "Le generateur conserve-t-il mes donnees ?",
                    answer:
                      "Non. Tous les calculs et la generation du PDF se font localement dans votre navigateur. Aucune donnee saisie (informations entreprise, client, lignes de facture, IBAN) n'est envoyee a un serveur ni stockee. L'outil fonctionne sans inscription.",
                  },
                  {
                    question: "Les factures generees sont-elles juridiquement valides ?",
                    answer:
                      "Oui, le PDF genere contient toutes les mentions obligatoires legales pour etre valide en France. Vous restez responsable de la verification finale (notamment SIRET, taux de TVA applicable, mentions specifiques a votre statut). Le format PDF est accepte par l'administration fiscale et les tribunaux.",
                  },
                ]}
              />
            </div>
          </div>

          <aside className="space-y-6 no-print">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>A propos</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Ce generateur inclut les mentions legales obligatoires (art. L441-9 Code de commerce).
                Vos donnees restent dans votre navigateur et ne sont jamais transmises a un serveur.
                Verifiez toujours vos factures avant envoi.
              </p>
            </div>
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
              <p className="text-sm">Echeance : {echeance}</p>
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

          {emetteur.iban && (
            <div className="mt-8 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
              <h3 className="font-semibold">Coordonnees bancaires</h3>
              <p className="mt-1 text-sm font-mono tracking-wide">{emetteur.iban}</p>
            </div>
          )}

          <div className="mt-6 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
            <h3 className="font-semibold">Conditions de paiement</h3>
            <p className="mt-1 text-sm">{conditionsPaiement}</p>
            <p className="mt-1 text-sm">Date d&apos;echeance : {echeance}</p>
          </div>

          <div className="mt-4 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
            <p>En cas de retard de paiement, une penalite de {penalitesRetard}% par mois sera appliquee (taux annuel), conformement a l&apos;article L.441-10 du Code de commerce. Une indemnite forfaitaire de 40 &euro; pour frais de recouvrement est due de plein droit (art. D.441-5 du Code de commerce).</p>
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
