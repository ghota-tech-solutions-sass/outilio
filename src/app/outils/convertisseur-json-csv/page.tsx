"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

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
      <section className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            Convertisseur JSON / CSV
          </h1>
          <p className="mt-2 text-gray-600">
            Convertissez vos donnees entre JSON et CSV instantanement.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("json-to-csv")}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    mode === "json-to-csv"
                      ? "bg-[#2563eb] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  JSON &rarr; CSV
                </button>
                <button
                  onClick={() => setMode("csv-to-json")}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    mode === "csv-to-json"
                      ? "bg-[#2563eb] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  CSV &rarr; JSON
                </button>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  {mode === "json-to-csv" ? "JSON" : "CSV"} (entree)
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="mt-1 h-40 w-full rounded-lg border border-gray-300 p-3 font-mono text-sm focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                onClick={convert}
                className="mt-4 w-full rounded-lg bg-[#2563eb] py-3 font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Convertir
              </button>

              {error && (
                <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
              )}

              {output && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {mode === "json-to-csv" ? "CSV" : "JSON"} (resultat)
                    </label>
                    <button
                      onClick={download}
                      className="text-sm font-medium text-[#2563eb] hover:underline"
                    >
                      Telecharger
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={output}
                    className="mt-1 h-40 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 font-mono text-sm"
                  />
                </div>
              )}
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
