"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

// Adds "ligne X, colonne Y" to a JSON.parse error when the engine only gives
// a character offset (V8: "... at position 42").
function describeJsonError(e: unknown, source: string): string {
  const msg = e instanceof Error ? e.message : String(e);
  const m = msg.match(/position (\d+)/);
  if (m && !/line \d+/i.test(msg)) {
    const before = source.slice(0, Number(m[1]));
    const line = before.split("\n").length;
    const col = before.length - before.lastIndexOf("\n");
    return `JSON invalide (ligne ${line}, colonne ${col}) : ${msg}`;
  }
  return `JSON invalide : ${msg}`;
}

/* Lossless JSON reading (same approach as the JSON optimizer): JSON.parse would
 * round integers above 2^53, e.g. an ID 12345678901234567890 would become
 * 12345678901234567000 in the CSV. Numbers are copied exactly as written. */
type JNode =
  | { t: "obj"; entries: [string, JNode][] }
  | { t: "arr"; items: JNode[] }
  | { t: "lit"; raw: string };

function parseLossless(src: string): JNode {
  let i = 0;
  const ws = () => {
    while (i < src.length && (src[i] === " " || src[i] === "\n" || src[i] === "\t" || src[i] === "\r")) i++;
  };
  const str = (): string => {
    const start = i;
    i++; // opening quote
    while (src[i] !== '"') i += src[i] === "\\" ? 2 : 1;
    i++; // closing quote
    return src.slice(start, i);
  };
  const value = (): JNode => {
    ws();
    const ch = src[i];
    if (ch === "{") {
      i++;
      const entries: [string, JNode][] = [];
      ws();
      if (src[i] === "}") { i++; return { t: "obj", entries }; }
      for (;;) {
        ws();
        const key = str();
        ws();
        i++; // colon
        entries.push([key, value()]);
        ws();
        if (src[i++] === "}") return { t: "obj", entries };
      }
    }
    if (ch === "[") {
      i++;
      const items: JNode[] = [];
      ws();
      if (src[i] === "]") { i++; return { t: "arr", items }; }
      for (;;) {
        items.push(value());
        ws();
        if (src[i++] === "]") return { t: "arr", items };
      }
    }
    if (ch === '"') return { t: "lit", raw: str() };
    const start = i;
    while (i < src.length && !/[\s,\]}]/.test(src[i])) i++;
    return { t: "lit", raw: src.slice(start, i) };
  };
  return value();
}

function printLossless(node: JNode, indent: string, level = 0): string {
  const nl = indent ? "\n" : "";
  const pad = indent.repeat(level + 1);
  const end = indent.repeat(level);
  const sep = indent ? ": " : ":";
  if (node.t === "lit") return node.raw;
  if (node.t === "arr") {
    if (node.items.length === 0) return "[]";
    return `[${nl}${node.items.map((v) => pad + printLossless(v, indent, level + 1)).join("," + nl)}${nl}${end}]`;
  }
  if (node.entries.length === 0) return "{}";
  return `{${nl}${node.entries.map(([k, v]) => pad + k + sep + printLossless(v, indent, level + 1)).join("," + nl)}${nl}${end}}`;
}

function jsonToCsv(json: string): string {
  try {
    JSON.parse(json);
  } catch (e) {
    throw new Error(describeJsonError(e, json));
  }
  const root = parseLossless(json);
  const items: JNode[] = root.t === "arr" ? root.items : [root];
  if (items.length === 0) return "";
  // Primitive values (numbers, strings, null) become a single "valeur" column.
  const rows: Map<string, JNode>[] = items.map((item) =>
    item.t === "obj"
      ? new Map(item.entries.map(([k, v]) => [JSON.parse(k) as string, v] as [string, JNode]))
      : new Map([["valeur", item]])
  );
  const headers = [...new Set(rows.flatMap((row) => [...row.keys()]))];
  const cell = (node: JNode | undefined): string => {
    if (!node) return "";
    // Nested objects / arrays are written as JSON instead of "[object Object]"
    if (node.t !== "lit") return printLossless(node, "");
    if (node.raw === "null") return "";
    return node.raw.startsWith('"') ? (JSON.parse(node.raw) as string) : node.raw;
  };
  const escape = (s: string) => (/[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const lines = rows.map((row) => headers.map((h) => escape(cell(row.get(h)))).join(","));
  return [headers.map(escape).join(","), ...lines].join("\r\n");
}

// Picks the most frequent candidate delimiter (outside quotes) on the header line:
// French Excel exports use ";", some tools use tabs.
function detectDelimiter(csv: string): string {
  const firstLine: string[] = [];
  let inQuotes = false;
  for (const ch of csv) {
    if (ch === '"') inQuotes = !inQuotes;
    if (!inQuotes && (ch === "\n" || ch === "\r")) break;
    if (!inQuotes) firstLine.push(ch);
  }
  const count = (d: string) => firstLine.filter((c) => c === d).length;
  const candidates = [",", ";", "\t"];
  return candidates.reduce((best, d) => (count(d) > count(best) ? d : best), ",");
}

// RFC 4180 parser: handles quoted fields containing delimiters, doubled quotes
// and line breaks, plus CRLF line endings. Unquoted fields are trimmed.
function parseCsv(csv: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let inQuotes = false;
  const pushField = () => {
    row.push(quoted ? field : field.trim());
    field = "";
    quoted = false;
  };
  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (inQuotes) {
      if (ch === '"') {
        if (csv[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"' && field.trim() === "") {
      inQuotes = true;
      quoted = true;
      field = "";
    } else if (ch === delimiter) {
      pushField();
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && csv[i + 1] === "\n") i++;
      pushField();
      rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (inQuotes) throw new Error("Guillemet non fermé dans le CSV.");
  if (field !== "" || quoted || row.length > 0) {
    pushField();
    rows.push(row);
  }
  // Ignore empty lines
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

function csvToJson(csv: string): string {
  const input = csv.replace(/^\uFEFF/, "");
  const rows = parseCsv(input, detectDelimiter(input));
  if (rows.length < 2) {
    throw new Error("Le CSV doit contenir une ligne d'en-têtes et au moins une ligne de données.");
  }
  const headers = rows[0].map((h, i) => h || `colonne_${i + 1}`);
  const result = rows.slice(1).map((values) => {
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
      setError(e instanceof Error ? e.message : "Format invalide");
      setOutput("");
    }
  };

  const download = () => {
    if (!output) return;
    const ext = mode === "json-to-csv" ? "csv" : "json";
    const type = mode === "json-to-csv" ? "text/csv" : "application/json";
    // BOM for CSV so that Excel opens accented characters correctly as UTF-8
    const blob = new Blob([mode === "json-to-csv" ? "\uFEFF" + output : output], { type: `${type};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversion.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
            Convertissez vos données entre JSON et CSV instantanément.
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
                  onClick={() => { setMode("json-to-csv"); setOutput(""); setError(""); }}
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
                  onClick={() => { setMode("csv-to-json"); setOutput(""); setError(""); }}
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
                  {mode === "json-to-csv" ? "JSON" : "CSV"} (entrée)
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
                      {mode === "json-to-csv" ? "CSV" : "JSON"} (résultat)
                    </label>
                    <button
                      onClick={download}
                      className="text-sm font-medium hover:underline"
                      style={{ color: "var(--primary)" }}
                    >
                      Télécharger
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
              description="Quatre étapes pour passer du JSON au CSV ou inversement, sans installer de logiciel."
              steps={[
                {
                  name: "Choisir le sens de conversion",
                  text:
                    "Cliquez sur JSON vers CSV pour convertir un tableau d'objets JSON en feuille de calcul tabulaire, ou CSV vers JSON pour transformer un export Excel en structure exploitable par une API. Le bouton actif change l'interprétation de votre saisie.",
                },
                {
                  name: "Coller vos données source",
                  text:
                    "Collez le contenu dans la zone de texte. Pour le JSON, fournissez un tableau d'objets type [ { 'nom': 'Dupont', 'age': 30 } ]. Pour le CSV, la première ligne doit contenir les en-têtes de colonne. Le séparateur (virgule, point-virgule ou tabulation) est détecté automatiquement. Les valeurs contenant le séparateur doivent être entourées de guillemets.",
                },
                {
                  name: "Lancer la conversion",
                  text:
                    "Le bouton Convertir traite instantanément vos données. En cas d'erreur (JSON malformé, CSV incomplet), un message rouge précise la cause. La conversion gère automatiquement l'échappement des caractères spéciaux (virgules dans les valeurs, guillemets, sauts de ligne).",
                },
                {
                  name: "Télécharger le résultat",
                  text:
                    "Le bouton Télécharger génère un fichier conversion.csv ou conversion.json directement dans votre dossier de téléchargements. Le CSV est encodé en UTF-8 avec BOM pour que les accents s'affichent correctement dans Excel. Il s'ouvre dans Excel, Google Sheets, LibreOffice Calc ou Numbers. Le JSON est compatible avec n'importe quelle API REST ou base NoSQL.",
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
                    dans Excel ou Power BI pour un dashboard ad-hoc. Convertir des données
                    Salesforce, Pipedrive ou Notion entre les formats avant analyse statistique
                    ou visualisation Tableau.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Développeur full-stack
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Préparer un fichier de seed pour une base de données, importer un dataset
                    public (data.gouv.fr en CSV) dans une application MongoDB ou Firebase qui
                    attend du JSON. Tester rapidement un endpoint API en envoyant des données
                    issues d&apos;un Excel.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Marketeur et CRM manager
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Convertir une liste d&apos;abonnés Mailchimp ou Brevo (CSV) vers un JSON
                    importable dans une nouvelle plateforme. Préparer un import contacts pour
                    Salesforce, HubSpot ou ActiveCampaign en respectant le mapping de colonnes
                    attendu.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Comptable et contrôleur de gestion
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Reformater un export bancaire JSON (issu d&apos;une API type Bridge ou
                    Budget Insight) en CSV exploitable dans un grand livre Excel ou un logiciel
                    de comptabilité (Sage, Cegid, Pennylane). Rapprochement bancaire simplifié.
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
                Pièges classiques avec JSON et CSV
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Excel et l&apos;encodage UTF-8.</strong> Excel sur Windows ouvre les CSV
                  en encodage local (Windows-1252) par défaut, ce qui casse les accents
                  français. Solution : utiliser Données puis Importer depuis CSV avec encodage
                  UTF-8, ou ajouter un BOM (caractère invisible U+FEFF) en début de fichier, ce que
                  fait automatiquement le bouton Télécharger de cet outil.
                </p>
                <p>
                  <strong>Clés imbriquées et tableaux.</strong> Le CSV est plat (tableau 2D), le
                  JSON peut être hiérarchique. Si votre JSON contient des objets imbriqués (ex :
                  user.address.street), l&apos;outil place le sous-objet sérialisé en JSON dans une
                  seule cellule. Pour obtenir une colonne par champ, aplatissez d&apos;abord avec des
                  clés type address_street.
                </p>
                <p>
                  <strong>Caractères spéciaux à échapper.</strong> Une valeur CSV contenant une
                  virgule, un guillemet ou un saut de ligne doit être entourée de guillemets et
                  les guillemets internes doublés. L&apos;outil gère automatiquement, mais un CSV
                  fait main peut casser : vérifiez que &laquo; Hello, world &raquo; est bien encadré.
                </p>
                <p>
                  <strong>Header manquant en CSV.</strong> Le mode CSV vers JSON suppose que la
                  première ligne contient les noms de colonnes. Si votre CSV n&apos;a pas
                  d&apos;en-tête, ajoutez-en un manuellement (col1,col2,col3) ou la première
                  ligne de données deviendra par erreur les clés JSON.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Tout savoir sur la conversion entre JSON et CSV."
              items={[
                {
                  question: "Quel format JSON est accepté ?",
                  answer:
                    "L'outil accepte un tableau d'objets JSON ou un objet unique qui sera automatiquement converti en tableau à une ligne. Chaque clé de l'objet devient un en-tête de colonne dans le CSV généré. Les valeurs imbriquées (sous-objets, sous-tableaux) sont écrites en JSON dans une seule cellule. Les éléments qui ne sont pas des objets (nombres, textes) sont placés dans une colonne « valeur ».",
                },
                {
                  question: "Le CSV généré est-il compatible avec Excel ?",
                  answer:
                    "Oui. Le CSV produit utilise la virgule comme séparateur et échappe correctement les valeurs contenant des virgules, guillemets ou sauts de ligne. Il s'ouvre directement dans Excel, Google Sheets ou LibreOffice Calc, et le fichier téléchargé inclut un BOM UTF-8 pour conserver les accents. Si Excel en français affiche tout dans une seule colonne (il attend le point-virgule), passez par Données > À partir d'un fichier texte/CSV et choisissez la virgule comme délimiteur.",
                },
                {
                  question: "Puis-je convertir des fichiers CSV volumineux ?",
                  answer:
                    "L'outil fonctionne dans votre navigateur, donc la taille est limitée par la mémoire disponible. Il gère sans problème plusieurs milliers de lignes. Au-delà de 100 000 lignes, préférez un script Python (pandas) ou un outil dédié côté serveur pour de meilleures performances.",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. La conversion est effectuée 100 % localement dans votre navigateur. Aucune donnée saisie ou convertie n'est envoyée à un serveur ou stockée. Vous pouvez convertir des données clients, financières ou médicales en toute confidentialité.",
                },
                {
                  question: "Le séparateur peut-il être un point-virgule au lieu d'une virgule ?",
                  answer:
                    "En lecture (CSV vers JSON), oui : l'outil détecte automatiquement la virgule, le point-virgule (export Excel français) ou la tabulation. En écriture (JSON vers CSV), il produit toujours un CSV séparé par des virgules (standard RFC 4180) ; dans Excel, utilisez Données > À partir d'un fichier texte/CSV pour l'importer correctement.",
                },
                {
                  question: "Comment gérer les colonnes manquantes en JSON ?",
                  answer:
                    "Si certains objets JSON n'ont pas toutes les clés, l'outil collecte l'union des clés de tous les objets et laisse les cellules vides pour les valeurs absentes. Le CSV produit reste valide avec des trous explicites, comportement standard et compatible Excel.",
                },
                {
                  question: "Que se passe-t-il si mon JSON ou CSV est invalide ?",
                  answer:
                    "Un message d'erreur rouge s'affiche en cas de syntaxe invalide (JSON mal formé, CSV sans ligne de données, guillemet non fermé). Pour le JSON, le message du navigateur indique la cause et, si possible, la ligne et la colonne de l'erreur. Corrigez la source avant de relancer la conversion.",
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
