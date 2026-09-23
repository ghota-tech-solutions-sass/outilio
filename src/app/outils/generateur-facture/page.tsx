"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

interface LigneFacture {
  description: string;
  quantite: number;
  prixUnitaire: number;
}

type NatureOperation = "services" | "biens" | "mixte";
type TypeClient = "pro" | "particulier";

const TAUX_TVA = ["20", "10", "5.5", "2.1", "0"];

const NATURE_LABELS: Record<NatureOperation, string> = {
  services: "Prestations de services",
  biens: "Livraisons de biens",
  mixte: "Livraisons de biens et prestations de services",
};

/** Arrondi au centime (évite les écarts d'affichage type 0,1 + 0,2). */
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const fmt = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtTaux = (t: string) => (parseFloat(t) || 0).toLocaleString("fr-FR", { maximumFractionDigits: 2 });

const fmtDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("fr-FR");
};

const isoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const PRINT_CSS = `
@media print {
  body > *:not(main), main > *:not([data-print-keep]), .google-auto-placed, ins.adsbygoogle { display: none !important; }
  [data-print-keep] { max-width: none !important; padding: 0 !important; margin: 0 !important; }
  .invoice-print { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .invoice-print tr, .invoice-print .avoid-break { break-inside: avoid; }
  @page { size: A4; margin: 14mm; }
}`;

export default function GenerateurFacture() {
  const [emetteur, setEmetteur] = useState({
    nom: "",
    formeJuridique: "",
    capital: "",
    adresse: "",
    siren: "",
    rcs: "",
    tvaIntra: "",
    email: "",
    telephone: "",
    iban: "",
  });
  const [client, setClient] = useState({
    nom: "",
    adresse: "",
    adresseLivraison: "",
    siren: "",
    tvaIntra: "",
    email: "",
  });
  const [typeClient, setTypeClient] = useState<TypeClient>("pro");
  const [numero, setNumero] = useState("FAC-2026-001");
  const [date, setDate] = useState(() => isoDate(new Date()));
  const [dateOperation, setDateOperation] = useState(() => isoDate(new Date()));
  const [bonCommande, setBonCommande] = useState("");
  const [nature, setNature] = useState<NatureOperation>("services");
  const [lignes, setLignes] = useState<LigneFacture[]>([
    { description: "", quantite: 1, prixUnitaire: 0 },
  ]);
  const [tva, setTva] = useState("20");
  const [franchise, setFranchise] = useState(false);
  const [optionDebits, setOptionDebits] = useState(false);
  const [echeance, setEcheance] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return isoDate(d);
  });
  const [conditionsPaiement, setConditionsPaiement] = useState("Virement bancaire à 30 jours");
  const [escompte, setEscompte] = useState("néant");
  const [penalitesRetard, setPenalitesRetard] = useState("");
  const [mentionsLibres, setMentionsLibres] = useState("");

  // Rendu de la facture imprimable uniquement côté client : les dates par défaut
  // dépendent du jour courant et différeraient du HTML statique généré au build.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const addLigne = () => setLignes([...lignes, { description: "", quantite: 1, prixUnitaire: 0 }]);
  const removeLigne = (i: number) => setLignes(lignes.filter((_, idx) => idx !== i));
  const updateLigne = (i: number, field: keyof LigneFacture, value: string | number) => {
    const updated = [...lignes];
    updated[i] = { ...updated[i], [field]: value };
    setLignes(updated);
  };

  // Calculs arrondis au centime : total de ligne, puis HT, TVA et TTC = HT + TVA arrondis.
  const totalLigne = (l: LigneFacture) => round2(l.quantite * l.prixUnitaire);
  const tauxTVA = franchise ? 0 : parseFloat(tva) || 0;
  const totalHT = round2(lignes.reduce((sum, l) => sum + totalLigne(l), 0));
  const montantTVA = round2(totalHT * (tauxTVA / 100));
  const totalTTC = round2(totalHT + montantTVA);

  const isPro = typeClient === "pro";
  const sirenDigits = emetteur.siren.replace(/\s/g, "");
  const sirenInvalide = sirenDigits !== "" && !/^(\d{9}|\d{14})$/.test(sirenDigits);
  const clientSirenDigits = client.siren.replace(/\s/g, "");
  const clientSirenInvalide = clientSirenDigits !== "" && !/^(\d{9}|\d{14})$/.test(clientSirenDigits);
  const echeanceAvantEmission = echeance !== "" && date !== "" && echeance < date;
  const penalitesNum = parseFloat(penalitesRetard.replace(",", "."));

  const handlePrint = () => {
    // Le titre du document sert de nom de fichier par défaut pour « Enregistrer au format PDF ».
    const previousTitle = document.title;
    const safeNumero = numero.trim().replace(/[\\/:*?"<>|]+/g, "-") || "facture";
    document.title = `Facture ${safeNumero}`;
    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  const penalitesTexte =
    penalitesRetard.trim() === "" || Number.isNaN(penalitesNum)
      ? "au taux d'intérêt appliqué par la Banque centrale européenne à son opération de refinancement la plus récente, majoré de 10 points de pourcentage"
      : `au taux annuel de ${penalitesNum.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} %`;

  return (
    <>
      <section className="relative py-14 no-print" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Facturation</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Générateur de <span style={{ color: "var(--primary)" }}>factures</span> gratuit
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Créez des factures professionnelles et imprimez-les en PDF. Les principales mentions obligatoires sont prévues dans le formulaire.
          </p>
        </div>
      </section>

      <div data-print-keep className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <style>{PRINT_CSS}</style>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6 no-print">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations émetteur</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Nom / Dénomination sociale" value={emetteur.nom} onChange={(v) => setEmetteur({ ...emetteur, nom: v })} />
                <Input label="Forme juridique (EI, SASU, SARL...)" value={emetteur.formeJuridique} onChange={(v) => setEmetteur({ ...emetteur, formeJuridique: v })} />
                <Input label="SIREN ou SIRET" value={emetteur.siren} onChange={(v) => setEmetteur({ ...emetteur, siren: v })} />
                <Input label="RCS / RM + ville (si immatriculé)" value={emetteur.rcs} onChange={(v) => setEmetteur({ ...emetteur, rcs: v })} />
                <Input label="Capital social (sociétés)" value={emetteur.capital} onChange={(v) => setEmetteur({ ...emetteur, capital: v })} />
                <Input label="N° TVA intracommunautaire (ex : FR12345678901)" value={emetteur.tvaIntra} onChange={(v) => setEmetteur({ ...emetteur, tvaIntra: v })} />
                <Input label="Email" value={emetteur.email} onChange={(v) => setEmetteur({ ...emetteur, email: v })} />
                <Input label="Téléphone" value={emetteur.telephone} onChange={(v) => setEmetteur({ ...emetteur, telephone: v })} />
                <Input label="Adresse (siège social)" value={emetteur.adresse} onChange={(v) => setEmetteur({ ...emetteur, adresse: v })} className="sm:col-span-2" />
                <Input label="IBAN / RIB" value={emetteur.iban} onChange={(v) => setEmetteur({ ...emetteur, iban: v })} className="sm:col-span-2" />
              </div>
              {sirenInvalide && (
                <p className="mt-2 text-xs" style={{ color: "#b45309" }}>
                  Un SIREN comporte 9 chiffres et un SIRET 14 chiffres : vérifiez la saisie.
                </p>
              )}
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Entrepreneur individuel : faites figurer « EI » ou « Entrepreneur individuel » avant ou après votre nom (forme juridique « EI »). Société : forme juridique, capital social, RCS et adresse du siège.
              </p>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations client</h2>
              <div className="mt-4 flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                {([
                  { id: "pro", label: "Client professionnel" },
                  { id: "particulier", label: "Client particulier" },
                ] as { id: TypeClient; label: string }[]).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTypeClient(t.id)}
                    className="flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
                    style={{ background: typeClient === t.id ? "var(--primary)" : "transparent", color: typeClient === t.id ? "#fff" : "var(--muted)" }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Nom / Dénomination" value={client.nom} onChange={(v) => setClient({ ...client, nom: v })} />
                <Input label="Email" value={client.email} onChange={(v) => setClient({ ...client, email: v })} />
                {isPro && (
                  <>
                    <Input label="SIREN du client" value={client.siren} onChange={(v) => setClient({ ...client, siren: v })} />
                    <Input label="N° TVA intracommunautaire du client" value={client.tvaIntra} onChange={(v) => setClient({ ...client, tvaIntra: v })} />
                  </>
                )}
                <Input label="Adresse de facturation" value={client.adresse} onChange={(v) => setClient({ ...client, adresse: v })} className="sm:col-span-2" />
                <Input label="Adresse de livraison (si différente)" value={client.adresseLivraison} onChange={(v) => setClient({ ...client, adresseLivraison: v })} className="sm:col-span-2" />
              </div>
              {isPro && clientSirenInvalide && (
                <p className="mt-2 text-xs" style={{ color: "#b45309" }}>
                  Le SIREN du client comporte 9 chiffres (14 pour un SIRET).
                </p>
              )}
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Le numéro de TVA intracommunautaire du vendeur et celui du client professionnel sont obligatoires, sauf pour les factures d&apos;un montant HT inférieur ou égal à 150 €. Le SIREN du client et l&apos;adresse de livraison font partie des nouvelles mentions de la réforme de la facturation électronique.
              </p>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détails de la facture</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input label="Numéro de facture" value={numero} onChange={setNumero} />
                <Input label="Date d'émission" value={date} onChange={setDate} type="date" />
                <Input label="Date de la vente / prestation" value={dateOperation} onChange={setDateOperation} type="date" />
                <Input label="N° de bon de commande (si existant)" value={bonCommande} onChange={setBonCommande} />
                <Input label="Date d'échéance" value={echeance} onChange={setEcheance} type="date" />
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nature de l&apos;opération</label>
                  <select
                    value={nature}
                    onChange={(e) => setNature(e.target.value as NatureOperation)}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  >
                    <option value="services">Prestations de services</option>
                    <option value="biens">Livraisons de biens</option>
                    <option value="mixte">Biens et services</option>
                  </select>
                </div>
              </div>
              {echeanceAvantEmission && (
                <p className="mt-2 text-xs" style={{ color: "#b45309" }}>
                  La date d&apos;échéance est antérieure à la date d&apos;émission.
                </p>
              )}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Taux de TVA</label>
                  <select
                    value={franchise ? "0" : tva}
                    onChange={(e) => setTva(e.target.value)}
                    disabled={franchise}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none disabled:opacity-60"
                    style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                  >
                    {TAUX_TVA.map((t) => (
                      <option key={t} value={t}>{fmtTaux(t)} %</option>
                    ))}
                  </select>
                </div>
                <Checkbox
                  label="Franchise en base de TVA (auto/micro-entrepreneur)"
                  checked={franchise}
                  onChange={setFranchise}
                />
                <Checkbox
                  label="Option pour le paiement de la TVA d'après les débits"
                  checked={optionDebits}
                  onChange={setOptionDebits}
                  disabled={franchise}
                />
              </div>
              {franchise && (
                <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                  La mention « TVA non applicable, art. 293 B du CGI » sera imprimée sur la facture.
                </p>
              )}
              {!franchise && tauxTVA === 0 && (
                <p className="mt-2 text-xs" style={{ color: "#b45309" }}>
                  TVA à 0 % hors franchise : précisez le motif dans « Mentions complémentaires » (ex. « Autoliquidation », « Exonération de TVA, art. 262 ter I du CGI »).
                </p>
              )}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input label="Conditions de paiement" value={conditionsPaiement} onChange={setConditionsPaiement} className="sm:col-span-2" />
                <Input label="Escompte pour paiement anticipé" value={escompte} onChange={setEscompte} />
              </div>
              {isPro && (
                <div className="mt-3">
                  <Input label="Taux annuel des pénalités de retard (%)" value={penalitesRetard} onChange={setPenalitesRetard} type="number" />
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    Laissez vide pour appliquer le taux légal par défaut (taux de refinancement de la BCE majoré de 10 points). Un taux conventionnel ne peut pas être inférieur à 3 fois le taux d&apos;intérêt légal. L&apos;indemnité forfaitaire de recouvrement de 40 € est ajoutée automatiquement (clients professionnels).
                  </p>
                </div>
              )}
              <div className="mt-3">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Mentions complémentaires (optionnel)</label>
                <textarea
                  value={mentionsLibres}
                  onChange={(e) => setMentionsLibres(e.target.value)}
                  rows={2}
                  placeholder="Ex. : Autoliquidation – Membre d'une association agréée – Assurance professionnelle..."
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Lignes de facturation</h2>
              {lignes.map((l, i) => (
                <div key={i} className="mt-3 grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-12 sm:col-span-5">
                    {i === 0 && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Désignation</label>}
                    <input
                      type="text"
                      value={l.description}
                      onChange={(e) => updateLigne(i, "description", e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    {i === 0 && <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Quantité</label>}
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={l.quantite}
                      onChange={(e) => updateLigne(i, "quantite", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
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
                  <div className="col-span-4 sm:col-span-2 flex gap-1">
                    <span className="py-2 text-sm font-medium" style={{ color: "var(--foreground)" }}>{fmt(totalLigne(l))} &euro;</span>
                    {lignes.length > 1 && (
                      <button type="button" aria-label="Supprimer la ligne" onClick={() => removeLigne(i)} className="text-lg" style={{ color: "#dc2626" }}>&times;</button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addLigne} className="mt-3 text-sm font-medium hover:underline" style={{ color: "var(--primary)" }}>
                + Ajouter une ligne
              </button>
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                Un seul taux de TVA par facture : si vos lignes relèvent de taux différents, établissez une facture par taux ou utilisez un logiciel de facturation.
              </p>

              <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total HT</p>
                    <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
                      {fmt(totalHT)} &euro;
                    </p>
                  </div>
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                      {franchise ? "TVA (franchise en base)" : `TVA (${fmtTaux(tva)} %)`}
                    </p>
                    <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }}>
                      {fmt(montantTVA)} &euro;
                    </p>
                  </div>
                  <div className="rounded-xl border p-4" style={{ borderColor: "var(--primary)", background: "rgba(13,79,60,0.06)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Total TTC</p>
                    <p className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                      {fmt(totalTTC)} &euro;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-5 text-sm leading-relaxed" style={{ background: "rgba(232,150,62,0.08)", borderColor: "var(--accent-light)" }}>
              <p className="font-semibold" style={{ color: "var(--foreground)" }}>Facturation électronique : ce que change la réforme</p>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Depuis le 1er septembre 2026, toutes les entreprises assujetties à la TVA établies en France doivent pouvoir <strong>recevoir</strong> des factures électroniques. L&apos;obligation d&apos;<strong>émettre</strong> des factures électroniques s&apos;applique aux grandes entreprises et ETI depuis le 1er septembre 2026, et s&apos;appliquera aux PME et micro-entreprises (y compris les micro-entrepreneurs en franchise de TVA) au 1er septembre 2027. Une facture électronique doit être émise dans un format structuré (UBL, CII ou Factur-X) et transmise via une plateforme agréée : un PDF, même envoyé par email, n&apos;en est pas une.
              </p>
              <p className="mt-2" style={{ color: "var(--muted)" }}>
                Ce générateur produit une facture PDF, adaptée aux clients particuliers, aux clients étrangers et, pour les PME et micro-entreprises, aux factures entre entreprises jusqu&apos;au 31 août 2027. Dès que l&apos;obligation d&apos;émission vous concerne, vos factures entre entreprises assujetties établies en France devront passer par une plateforme agréée.
              </p>
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                Sources :{" "}
                <a href="https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique" target="_blank" rel="noopener noreferrer" className="underline">impots.gouv.fr</a>,{" "}
                <a href="https://www.impots.gouv.fr/professionnel/questions/franchise-en-base-micro-entrepreneur-ou-auto-entrepreneur-suis-je-concerne" target="_blank" rel="noopener noreferrer" className="underline">impots.gouv.fr (franchise en base)</a>,{" "}
                <a href="https://entreprendre.service-public.gouv.fr/vosdroits/F31808" target="_blank" rel="noopener noreferrer" className="underline">entreprendre.service-public.gouv.fr</a>.
              </p>
            </div>

            {/* Cross-link CTAs */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
                Vous pourriez aussi vouloir
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CrossLinkCard
                  href="/outils/calculateur-tva"
                  emoji="📊"
                  title="Calculer la TVA"
                  desc="HT, TTC, taux 20/10/5,5/2,1 %"
                />
                <CrossLinkCard
                  href="/outils/calculateur-tjm-freelance"
                  emoji="💼"
                  title="Définir son TJM"
                  desc="Taux journalier moyen freelance"
                />
                <CrossLinkCard
                  href="/outils/calculateur-marge"
                  emoji="📈"
                  title="Calculer une marge"
                  desc="Marge commerciale, taux, coefficient"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full rounded-2xl py-3 font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              Imprimer / Sauvegarder en PDF
            </button>

            <div className="no-print">
              <ToolHowToSection
                title="Comment créer une facture conforme en France"
                description="Le formulaire reprend les mentions obligatoires des articles L441-9 du Code de commerce et 242 nonies A de l'annexe II du CGI. Adaptez-les à votre statut (micro-entrepreneur, EI, SAS, EURL...)."
                steps={[
                  {
                    name: "Renseigner l'émetteur",
                    text:
                      "Nom ou dénomination sociale, adresse du siège, SIREN ou SIRET, forme juridique. Pour une société : capital social et numéro RCS avec la ville du greffe. Pour un entrepreneur individuel : la mention « EI » ou « Entrepreneur individuel » à côté du nom. Le code APE n'est pas obligatoire sur une facture.",
                  },
                  {
                    name: "Renseigner le client",
                    text:
                      "Nom ou dénomination et adresse de facturation. Pour un client professionnel : son SIREN et son numéro de TVA intracommunautaire (obligatoire sauf facture de 150 € HT ou moins), et l'adresse de livraison si elle diffère de l'adresse de facturation.",
                  },
                  {
                    name: "Décrire les prestations ou produits",
                    text:
                      "Pour chaque ligne : désignation précise, quantité, prix unitaire HT. Indiquez la nature de l'opération (biens, services ou les deux) et la date de la vente ou de la prestation. Soyez précis : « Conception graphique logo - 5 propositions et 2 retouches » plutôt que « prestation de service ».",
                  },
                  {
                    name: "Choisir le taux de TVA et les conditions",
                    text:
                      "20 % (taux normal), 10 % (restauration, travaux de rénovation...), 5,5 % (alimentation, livres...), 2,1 % (médicaments remboursables, presse). En franchise en base, cochez la case dédiée : la mention « TVA non applicable, art. 293 B du CGI » est ajoutée. Indiquez la date d'échéance, les conditions d'escompte et, pour un client professionnel, le taux des pénalités de retard.",
                  },
                  {
                    name: "Enregistrer en PDF",
                    text:
                      "Cliquez sur « Imprimer / Sauvegarder en PDF » puis choisissez « Enregistrer au format PDF » dans la fenêtre d'impression. Conservez vos factures 10 ans (obligation comptable).",
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
                Mentions obligatoires sur une facture en 2026
              </h2>
              <div className="mt-4 space-y-3 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  Entre professionnels, une facture doit notamment comporter les mentions suivantes
                  (article L441-9 du Code de commerce, article 242 nonies A de l&apos;annexe II du CGI) :
                </p>
                <ul className="ml-6 list-disc space-y-1" style={{ color: "var(--muted)" }}>
                  <li><strong style={{ color: "var(--foreground)" }}>Date d&apos;émission et numéro</strong> unique, basé sur une séquence chronologique et continue</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Date de la vente ou de la prestation</strong> (ou de l&apos;acompte)</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Identité du vendeur</strong> : nom ou dénomination, adresse, SIREN, forme juridique (mention « EI » pour un entrepreneur individuel), capital social et RCS pour une société</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Identité du client</strong> : nom ou dénomination et adresse de facturation</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Numéros de TVA intracommunautaire</strong> du vendeur et du client professionnel (sauf facture de 150 € HT ou moins)</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Numéro du bon de commande</strong> s&apos;il a été établi par l&apos;acheteur</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Détail des produits ou services</strong> : désignation, quantité, prix unitaire HT, taux de TVA, réductions éventuelles</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Montants</strong> : total HT, montant de la TVA par taux, total TTC</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Date d&apos;échéance</strong> et conditions d&apos;escompte (ou « Escompte pour paiement anticipé : néant »)</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Pénalités de retard</strong> et indemnité forfaitaire de recouvrement de 40 € (clients professionnels, art. L441-10 et D441-5)</li>
                  <li><strong style={{ color: "var(--foreground)" }}>Mentions particulières</strong> : « TVA non applicable, art. 293 B du CGI » en franchise, « Autoliquidation » le cas échéant</li>
                </ul>
                <p>
                  <strong>Nouvelles mentions de la réforme.</strong> Quatre mentions deviennent obligatoires
                  avec la facturation électronique : le SIREN du client, l&apos;adresse de livraison si elle
                  diffère de l&apos;adresse du client, la nature des opérations (livraisons de biens,
                  prestations de services ou les deux) et, le cas échéant, la mention « Option pour le
                  paiement de la taxe d&apos;après les débits ». Elles s&apos;appliquent aux mêmes dates que
                  l&apos;obligation d&apos;émission (1er septembre 2026 pour les grandes entreprises et ETI,
                  1er septembre 2027 pour les PME et micro-entreprises). Le générateur permet déjà de les
                  renseigner.
                </p>
                <p>
                  <strong>Sources.</strong>{" "}
                  <a href="https://entreprendre.service-public.gouv.fr/vosdroits/F31808" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>Mentions obligatoires sur une facture (service-public)</a>
                  {" "}; Code de commerce art. L441-9, L441-10 et D441-5 ; CGI art. 289 et 293 B ;{" "}
                  <a href="https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>facturation électronique (impots.gouv.fr)</a>.
                </p>
              </div>
            </section>

            <div className="no-print">
              <ToolFaqSection
                title="Questions fréquentes"
                intro="Les questions les plus fréquentes sur la facturation en France."
                items={[
                  {
                    question: "Une facture sans TVA est-elle valide ?",
                    answer:
                      "Oui. Si vous êtes micro-entrepreneur en franchise en base de TVA (article 293 B du CGI), vous devez indiquer la mention « TVA non applicable, art. 293 B du CGI ». Cochez simplement la case « Franchise en base de TVA » : la TVA passe à 0 % et la mention est imprimée automatiquement.",
                  },
                  {
                    question: "Comment numéroter ses factures ?",
                    answer:
                      "La numérotation doit être unique et reposer sur une séquence chronologique et continue, sans trou. Vous pouvez utiliser un format comme FAC-2026-001 ou 001, 002, 003. Plusieurs séries distinctes (par exemple une par année ou par établissement) sont admises si chacune reste chronologique et continue.",
                  },
                  {
                    question: "Combien de temps conserver ses factures ?",
                    answer:
                      "10 ans au titre de l'obligation comptable (art. L123-22 du Code de commerce) et 6 ans au titre du droit fiscal (art. L102 B du Livre des procédures fiscales). En pratique, conservez-les 10 ans.",
                  },
                  {
                    question: "Quel délai de paiement légal en France ?",
                    answer:
                      "Entre professionnels, à défaut d'accord, le délai est de 30 jours après la réception des marchandises ou l'exécution de la prestation. Le délai convenu ne peut pas dépasser 60 jours après la date d'émission de la facture (ou 45 jours fin de mois si c'est prévu au contrat). En cas de retard : pénalités au taux prévu, au moins égal à 3 fois le taux d'intérêt légal (à défaut, taux BCE majoré de 10 points), plus une indemnité forfaitaire de recouvrement de 40 € (art. L441-10 et D441-5 du Code de commerce).",
                  },
                  {
                    question: "Faut-il facturer la TVA pour un client à l'étranger ?",
                    answer:
                      "Pour une prestation de services à un professionnel établi dans un autre pays de l'UE, la facture est HT avec la mention « Autoliquidation » ; indiquez le numéro de TVA du client. Pour une livraison de biens intracommunautaire : « Exonération de TVA, article 262 ter I du CGI ». Pour une exportation de biens hors UE : « Exonération de TVA, article 262 I du CGI ». Les ventes à distance à des particuliers de l'UE relèvent du guichet unique OSS. Utilisez le champ « Mentions complémentaires » pour ces mentions.",
                  },
                  {
                    question: "Le numéro de TVA intracommunautaire est-il obligatoire sur une facture ?",
                    answer:
                      "Oui : le numéro de TVA du vendeur et celui du client professionnel doivent figurer sur la facture, sauf si son montant HT est inférieur ou égal à 150 €. Le format français est FR + 2 caractères de clé + SIREN (ex. : FR12 345 678 901). Vous pouvez vérifier un numéro sur le service VIES de la Commission européenne. Un micro-entrepreneur en franchise n'a en principe pas de numéro de TVA tant qu'il ne réalise pas d'opérations intracommunautaires.",
                  },
                  {
                    question: "Quand la facturation électronique devient-elle obligatoire ?",
                    answer:
                      "Toutes les entreprises assujetties à la TVA établies en France doivent pouvoir recevoir des factures électroniques depuis le 1er septembre 2026. L'émission est obligatoire depuis le 1er septembre 2026 pour les grandes entreprises et les ETI, et le sera au 1er septembre 2027 pour les PME et micro-entreprises, micro-entrepreneurs en franchise de TVA compris. Une facture électronique est un fichier structuré (UBL, CII ou Factur-X) transmis via une plateforme agréée ; un PDF envoyé par email n'en est pas une. Source : impots.gouv.fr.",
                  },
                  {
                    question: "Le générateur conserve-t-il mes données ?",
                    answer:
                      "Non. Les calculs et la mise en page du PDF se font localement dans votre navigateur. Les informations saisies (entreprise, client, lignes, IBAN) ne sont ni envoyées à un serveur ni stockées. Le site utilise par ailleurs des outils de mesure d'audience et de publicité, qui ne reçoivent pas le contenu de vos factures.",
                  },
                  {
                    question: "Les factures générées sont-elles juridiquement valables ?",
                    answer:
                      "Une facture PDF est valable tant que l'obligation d'émission électronique ne vous concerne pas (ou pour les clients particuliers et étrangers), à condition de comporter les mentions obligatoires. Le formulaire prévoit les principales mentions, mais vous restez responsable de leur exactitude et des mentions propres à votre activité (assurance décennale, association agréée, éco-participation...).",
                  },
                ]}
              />
            </div>
          </div>

          <aside className="space-y-6 no-print">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>À propos</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Ce générateur reprend les mentions obligatoires de l&apos;article L441-9 du Code de commerce.
                Les données saisies restent dans votre navigateur et ne sont jamais transmises à un serveur.
                Vérifiez toujours vos factures avant envoi.
              </p>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>

        {/* Printable invoice */}
        {mounted && (
        <div className="invoice-print hidden print:block" style={{ color: "#1a1a1a", fontSize: 12 }}>
          <div className="flex justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold">
                {emetteur.nom || "Votre entreprise"}
                {emetteur.formeJuridique && ` – ${emetteur.formeJuridique}`}
              </h2>
              {emetteur.adresse && <p className="text-sm">{emetteur.adresse}</p>}
              {emetteur.siren && <p className="text-sm">SIREN/SIRET : {emetteur.siren}</p>}
              {emetteur.rcs && <p className="text-sm">{emetteur.rcs}</p>}
              {emetteur.capital && <p className="text-sm">Capital social : {emetteur.capital}</p>}
              {emetteur.tvaIntra && <p className="text-sm">N° TVA intracommunautaire : {emetteur.tvaIntra}</p>}
              {emetteur.email && <p className="text-sm">{emetteur.email}</p>}
              {emetteur.telephone && <p className="text-sm">{emetteur.telephone}</p>}
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold" style={{ color: "var(--primary)" }}>FACTURE</h1>
              <p className="text-sm">N° {numero}</p>
              <p className="text-sm">Date d&apos;émission : {fmtDate(date)}</p>
              {dateOperation && <p className="text-sm">Date de la vente / prestation : {fmtDate(dateOperation)}</p>}
              {bonCommande && <p className="text-sm">Bon de commande : {bonCommande}</p>}
            </div>
          </div>

          <div className="avoid-break mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
              <h3 className="font-semibold">Facturé à :</h3>
              <p>{client.nom}</p>
              {client.adresse && <p className="text-sm">{client.adresse}</p>}
              {isPro && client.siren && <p className="text-sm">SIREN : {client.siren}</p>}
              {isPro && client.tvaIntra && <p className="text-sm">N° TVA intracommunautaire : {client.tvaIntra}</p>}
              {client.email && <p className="text-sm">{client.email}</p>}
            </div>
            {client.adresseLivraison && (
              <div className="rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                <h3 className="font-semibold">Adresse de livraison :</h3>
                <p className="text-sm">{client.adresseLivraison}</p>
              </div>
            )}
          </div>

          <p className="mt-4 text-sm">Nature de l&apos;opération : {NATURE_LABELS[nature]}</p>

          <table className="mt-4 w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th className="pb-2 text-left">Désignation</th>
                <th className="pb-2 text-right">Qté</th>
                <th className="pb-2 text-right">Prix unit. HT</th>
                <th className="pb-2 text-right">TVA</th>
                <th className="pb-2 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((l, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-2">{l.description}</td>
                  <td className="py-2 text-right">{l.quantite.toLocaleString("fr-FR")}</td>
                  <td className="py-2 text-right">{fmt(l.prixUnitaire)} &euro;</td>
                  <td className="py-2 text-right">{fmtTaux(String(tauxTVA))} %</td>
                  <td className="py-2 text-right">{fmt(totalLigne(l))} &euro;</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="avoid-break mt-4 text-right space-y-1">
            <p>Total HT : {fmt(totalHT)} &euro;</p>
            <p>{franchise ? "TVA : 0,00 €" : `TVA (${fmtTaux(tva)} %) : ${fmt(montantTVA)} €`}</p>
            <p className="text-lg font-bold">Total TTC : {fmt(totalTTC)} &euro;</p>
            {franchise && <p className="text-sm font-semibold">TVA non applicable, art. 293 B du CGI</p>}
            {!franchise && optionDebits && <p className="text-sm">Option pour le paiement de la taxe d&apos;après les débits</p>}
          </div>

          {emetteur.iban && (
            <div className="avoid-break mt-8 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
              <h3 className="font-semibold">Coordonnées bancaires</h3>
              <p className="mt-1 text-sm font-mono tracking-wide">{emetteur.iban}</p>
            </div>
          )}

          <div className="avoid-break mt-6 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
            <h3 className="font-semibold">Conditions de paiement</h3>
            {conditionsPaiement && <p className="mt-1 text-sm">{conditionsPaiement}</p>}
            <p className="mt-1 text-sm">Date d&apos;échéance : {fmtDate(echeance)}</p>
            <p className="mt-1 text-sm">Escompte pour paiement anticipé : {escompte || "néant"}</p>
          </div>

          {(isPro || mentionsLibres) && (
            <div className="avoid-break mt-4 space-y-1 text-xs leading-relaxed" style={{ color: "#555" }}>
              {isPro && (
                <p>
                  En cas de retard de paiement, des pénalités sont exigibles de plein droit, sans rappel préalable, {penalitesTexte} (art. L441-10 du Code de commerce). Une indemnité forfaitaire pour frais de recouvrement de 40 € est également due (art. D441-5 du Code de commerce).
                </p>
              )}
              {mentionsLibres && <p style={{ whiteSpace: "pre-line" }}>{mentionsLibres}</p>}
            </div>
          )}
        </div>
        )}
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

function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className="flex cursor-pointer items-center gap-2 self-end rounded-xl px-3 py-2 text-xs"
      style={{ background: "var(--surface-alt)", opacity: disabled ? 0.5 : 1 }}
    >
      <input
        type="checkbox"
        checked={checked && !disabled}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4"
        style={{ accentColor: "var(--primary)" }}
      />
      <span>{label}</span>
    </label>
  );
}

function CrossLinkCard({
  href,
  emoji,
  title,
  desc,
}: {
  href: string;
  emoji: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface-alt)" }}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold transition-colors group-hover:text-[#0d4f3c]"
          style={{ color: "var(--foreground)" }}
        >
          {title} <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">&rarr;</span>
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
          {desc}
        </p>
      </div>
    </Link>
  );
}
