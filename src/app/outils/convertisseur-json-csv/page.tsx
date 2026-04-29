"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return "";
  const headers = [...new Set(arr.flatMap((obj) => Object.keys(obj)))];
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const rows = arr.map((obj) => headers.map((h) => escape(obj[h])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

function csvToJson(csv: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return "[]";
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const result = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? "";
    });
    return obj;
  });
  return JSON.stringify(result, null, 2);
}

export default function ConvertisseurJsonCsv() {
  const [mode, setMode] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [input, setInput] = useState(
    '[\n  {"nom": "Dupont", "prenom": "Jean", "age": 30},\n  {"nom": "Martin", "prenom": "Marie", "age": 25}\n]'
  );
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    try {
      if (mode === "json-to-csv") {
        setOutput(jsonToCsv(input));
      } else {
        setOutput(csvToJson(input));
      }
    } catch (e) {
      setError(`Erreur : ${e instanceof Error ? e.message : "Format invalide"}`);
      setOutput("");
    }
  };

  const download = () => {
    if (!output) return;
    const ext = mode === "json-to-csv" ? "csv" : "json";
    const type = mode === "json-to-csv" ? "text/csv" : "application/json";
    const blob = new Blob([output], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversion.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="py-12" style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <h1
            className="animate-fade-up stagger-1 text-3xl font-extrabold md:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
          >
            Convertisseur JSON / CSV
          </h1>
          <p
            className="animate-fade-up stagger-2 mt-2"
            style={{ color: "var(--muted)" }}
          >
            Convertissez vos donnees entre JSON et CSV instantanement.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div
              className="rounded-xl p-6 shadow-sm"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("json-to-csv")}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition"
                  style={
                    mode === "json-to-csv"
                      ? { background: "var(--primary)", color: "#ffffff" }
                      : { background: "var(--surface-alt)", color: "var(--muted)" }
                  }
                >
                  JSON &rarr; CSV
                </button>
                <button
                  onClick={() => setMode("csv-to-json")}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition"
                  style={
                    mode === "csv-to-json"
                      ? { background: "var(--primary)", color: "#ffffff" }
                      : { background: "var(--surface-alt)", color: "var(--muted)" }
                  }
                >
                  CSV &rarr; JSON
                </button>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                  {mode === "json-to-csv" ? "JSON" : "CSV"} (entree)
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="mt-1 h-40 w-full rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-2"
                  style={{ border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
                />
              </div>

              <button
                onClick={convert}
                className="mt-4 w-full rounded-lg py-3 font-semibold text-white transition"
                style={{ background: "var(--primary)" }}
              >
                Convertir
              </button>

              {error && (
                <p className="mt-3 rounded-lg p-3 text-sm" style={{ background: "#fef2f2", color: "#dc2626" }}>{error}</p>
              )}

              {output && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                      {mode === "json-to-csv" ? "CSV" : "JSON"} (resultat)
                    </label>
                    <button
                      onClick={download}
                      className="text-sm font-medium hover:underline"
                      style={{ color: "var(--primary)" }}
                    >
                      Telecharger
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={output}
                    className="mt-1 h-40 w-full rounded-lg p-3 font-mono text-sm"
                    style={{ border: "1px solid var(--border)", background: "var(--surface-alt)", color: "var(--foreground)" }}
                  />
                </div>
              )}
            </div>

            <ToolHowToSection
              title="Comment utiliser le convertisseur JSON / CSV"
              description="Quatre etapes pour passer du JSON au CSV ou inversement, sans installer de logiciel."
              steps={[
                {
                  name: "Choisir le sens de conversion",
                  text:
                    "Cliquez sur JSON vers CSV pour convertir un tableau d'objets JSON en feuille de calcul tabulaire, ou CSV vers JSON pour transformer un export Excel en structure exploitable par une API. Le bouton actif change l'interpretation de votre saisie.",
                },
                {
                  name: "Coller vos donnees source",
                  text:
                    "Collez le contenu dans la zone de texte. Pour le JSON, fournissez un tableau d'objets type [ { 'nom': 'Dupont', 'age': 30 } ]. Pour le CSV, la premiere ligne doit contenir les en-tetes de colonne, separes par des virgules. Les valeurs avec virgule sont entourees de guillemets.",
                },
                {
                  name: "Lancer la conversion",
                  text:
                    "Le bouton Convertir traite instantanement vos donnees. En cas d'erreur (JSON malforme, CSV incomplet), un message rouge precise la cause. La conversion gere automatiquement l'echappement des caracteres speciaux (virgules dans les valeurs, guillemets, sauts de ligne).",
                },
                {
                  name: "Telecharger le resultat",
                  text:
                    "Le bouton Telecharger genere un fichier conversion.csv ou conversion.json directement dans votre dossier de telechargements. Le CSV s'ouvre dans Excel, Google Sheets, LibreOffice Calc ou Numbers. Le JSON est compatible avec n'importe quelle API REST ou base NoSQL.",
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
                Cas d&apos;usage du convertisseur JSON CSV
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Data analyst et BI
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Importer rapidement un export d&apos;API (Stripe, Shopify, HubSpot) en JSON
                    dans Excel ou Power BI pour un dashboard ad-hoc. Convertir des donnees
                    Salesforce, Pipedrive ou Notion entre les formats avant analyse statistique
                    ou visualisation Tableau.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Developpeur full-stack
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Preparer un fichier de seed pour une base de donnees, importer un dataset
                    public (data.gouv.fr en CSV) dans une application MongoDB ou Firebase qui
                    attend du JSON. Tester rapidement un endpoint API en envoyant des donnees
                    issues d&apos;un Excel.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Marketeur et CRM manager
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Convertir une liste d&apos;abonnes Mailchimp ou Brevo (CSV) vers un JSON
                    importable dans une nouvelle plateforme. Preparer un import contacts pour
                    Salesforce, HubSpot ou ActiveCampaign en respectant le mapping de colonnes
                    attendu.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Comptable et controleur de gestion
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Reformatter un export bancaire JSON (issues d&apos;une API type Bridge ou
                    Budget Insight) en CSV exploitable dans un grand livre Excel ou un logiciel
                    de comptabilite (Sage, Cegid, Pennylane). Reconciliation manuelle simplifiee.
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
                Pieges classiques avec JSON et CSV
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Excel et l&apos;encodage UTF-8.</strong> Excel sur Windows ouvre les CSV
                  en encodage local (CP1252 ou CP1253) par defaut, ce qui casse les accents
                  francais. Solution : utiliser Donnees puis Importer depuis CSV avec encodage
                  UTF-8, ou ajouter un BOM (caractere invisible 0xFEFF) en debut de fichier.
                </p>
                <p>
                  <strong>Cles imbriquees et tableaux.</strong> Le CSV est plat (tableau 2D), le
                  JSON peut etre hierarchique. Si votre JSON contient des objets imbriques (ex :
                  user.address.street), la conversion CSV serialise comme [object Object]. Mieux
                  vaut aplatir manuellement avec des cles type address_street avant conversion.
                </p>
                <p>
                  <strong>Caracteres specials a echapper.</strong> Une valeur CSV contenant une
                  virgule, un guillemet ou un saut de ligne doit etre entouree de guillemets et
                  les guillemets internes doubles. L&apos;outil gere automatiquement, mais un CSV
                  fait main peut casser : verifiez que &laquo; Hello, world &raquo; est bien encadre.
                </p>
                <p>
                  <strong>Header manquant en CSV.</strong> Le mode CSV vers JSON suppose que la
                  premiere ligne contient les noms de colonnes. Si votre CSV n&apos;a pas
                  d&apos;en-tete, ajoutez-en un manuellement (col1,col2,col3) ou la premiere
                  ligne de donnees deviendra par erreur les cles JSON.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Tout savoir sur la conversion entre JSON et CSV."
              items={[
                {
                  question: "Quel format JSON est accepte ?",
                  answer:
                    "L'outil accepte un tableau d'objets JSON ou un objet unique qui sera automatiquement converti en tableau a une ligne. Chaque cle de l'objet devient un en-tete de colonne dans le CSV genere. Les valeurs imbriquees (sous-objets, sous-tableaux) sont serialisees mais perdent leur structure.",
                },
                {
                  question: "Le CSV genere est-il compatible avec Excel ?",
                  answer:
                    "Oui. Le CSV produit utilise la virgule comme separateur et echappe correctement les valeurs contenant des virgules, guillemets ou sauts de ligne. Il s'ouvre directement dans Excel, Google Sheets ou LibreOffice Calc. Sur Windows en francais, utilisez Donnees puis Convertir pour forcer l'encodage UTF-8.",
                },
                {
                  question: "Puis-je convertir des fichiers CSV volumineux ?",
                  answer:
                    "L'outil fonctionne dans votre navigateur, donc la taille est limitee par la memoire disponible. Il gere sans probleme plusieurs milliers de lignes. Au-dela de 100 000 lignes, preferez un script Python (pandas) ou un outil dedie cote serveur pour de meilleures performances.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui. La conversion est effectuee 100 % localement dans votre navigateur. Aucune donnee saisie ou convertie n'est envoyee a un serveur ou stockee. Vous pouvez convertir des donnees clients, financieres ou medicales en toute securite, conformement RGPD.",
                },
                {
                  question: "Le separateur peut-il etre un point-virgule au lieu d'une virgule ?",
                  answer:
                    "Cet outil utilise la virgule (standard RFC 4180). Pour un separateur point-virgule (souvent prefere en France pour Excel), modifiez manuellement le CSV apres conversion, ou utilisez le menu Donnees puis Texte en colonnes dans Excel pour parser correctement.",
                },
                {
                  question: "Comment gerer les colonnes manquantes en JSON ?",
                  answer:
                    "Si certains objets JSON n'ont pas toutes les cles, l'outil collecte l'union des cles de tous les objets et laisse les cellules vides pour les valeurs absentes. Le CSV produit reste valide avec des trous explicites, comportement standard et compatible Excel.",
                },
                {
                  question: "Que se passe-t-il si mon JSON ou CSV est invalide ?",
                  answer:
                    "Un message d'erreur rouge s'affiche en cas de syntaxe invalide (JSON mal forme, CSV avec moins de 2 lignes). Le message indique la cause detaillee : virgule manquante, guillemet non ferme, etc. Corrigez la source avant de relancer la conversion.",
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
