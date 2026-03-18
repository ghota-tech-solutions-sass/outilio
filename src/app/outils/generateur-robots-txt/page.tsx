"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface Rule {
  id: number;
  userAgent: string;
  disallow: string[];
  allow: string[];
}

let nextId = 1;

export default function GenerateurRobotsTxt() {
  const [rules, setRules] = useState<Rule[]>([
    { id: nextId++, userAgent: "*", disallow: ["/admin/", "/private/"], allow: [] },
  ]);
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [copied, setCopied] = useState(false);

  const addRule = () => {
    setRules((prev) => [...prev, { id: nextId++, userAgent: "Googlebot", disallow: [], allow: [] }]);
  };

  const removeRule = (id: number) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const updateUserAgent = (id: number, value: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, userAgent: value } : r)));
  };

  const addPath = (ruleId: number, type: "disallow" | "allow") => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        return { ...r, [type]: [...r[type], "/example/"] };
      })
    );
  };

  const updatePath = (ruleId: number, type: "disallow" | "allow", index: number, value: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        const arr = [...r[type]];
        arr[index] = value;
        return { ...r, [type]: arr };
      })
    );
  };

  const removePath = (ruleId: number, type: "disallow" | "allow", index: number) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id !== ruleId) return r;
        return { ...r, [type]: r[type].filter((_, i) => i !== index) };
      })
    );
  };

  const output = useMemo(() => {
    const lines: string[] = [];

    for (const rule of rules) {
      lines.push(`User-agent: ${rule.userAgent}`);
      for (const d of rule.disallow) {
        if (d.trim()) lines.push(`Disallow: ${d.trim()}`);
      }
      for (const a of rule.allow) {
        if (a.trim()) lines.push(`Allow: ${a.trim()}`);
      }
      if (crawlDelay.trim()) {
        lines.push(`Crawl-delay: ${crawlDelay.trim()}`);
      }
      lines.push("");
    }

    if (sitemapUrl.trim()) {
      lines.push(`Sitemap: ${sitemapUrl.trim()}`);
    }

    return lines.join("\n").trim();
  }, [rules, sitemapUrl, crawlDelay]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    {
      name: "Tout autoriser",
      apply: () => {
        setRules([{ id: nextId++, userAgent: "*", disallow: [], allow: ["/"] }]);
        setCrawlDelay("");
      },
    },
    {
      name: "Tout bloquer",
      apply: () => {
        setRules([{ id: nextId++, userAgent: "*", disallow: ["/"], allow: [] }]);
        setCrawlDelay("");
      },
    },
    {
      name: "Standard (admin bloque)",
      apply: () => {
        setRules([{ id: nextId++, userAgent: "*", disallow: ["/admin/", "/api/", "/private/", "/tmp/"], allow: [] }]);
        setCrawlDelay("");
      },
    },
    {
      name: "WordPress",
      apply: () => {
        setRules([{ id: nextId++, userAgent: "*", disallow: ["/wp-admin/", "/wp-includes/", "/wp-content/plugins/", "/trackback/", "/feed/", "/?s="], allow: ["/wp-admin/admin-ajax.php"] }]);
        setCrawlDelay("");
      },
    },
  ];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>SEO</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur <span style={{ color: "var(--primary)" }}>robots.txt</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Creez un fichier robots.txt valide pour votre site. Bloquer des chemins, autoriser les robots, definir le sitemap.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Presets */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Presets rapides</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button key={p.name} onClick={p.apply}
                    className="rounded-lg border px-4 py-2 text-xs font-semibold transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    style={{ borderColor: "var(--border)" }}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules */}
            {rules.map((rule) => (
              <div key={rule.id} className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Regle</h2>
                  {rules.length > 1 && (
                    <button onClick={() => removeRule(rule.id)} className="text-xs font-semibold transition-all hover:opacity-70" style={{ color: "var(--muted)" }}>
                      Supprimer
                    </button>
                  )}
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>User-agent</label>
                    <select value={rule.userAgent} onChange={(e) => updateUserAgent(rule.id, e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-bold" style={{ borderColor: "var(--border)" }}>
                      <option value="*">* (Tous les robots)</option>
                      <option value="Googlebot">Googlebot</option>
                      <option value="Bingbot">Bingbot</option>
                      <option value="Yandex">Yandex</option>
                      <option value="DuckDuckBot">DuckDuckBot</option>
                      <option value="Baiduspider">Baiduspider</option>
                      <option value="GPTBot">GPTBot (OpenAI)</option>
                      <option value="CCBot">CCBot (Common Crawl)</option>
                      <option value="ChatGPT-User">ChatGPT-User</option>
                      <option value="anthropic-ai">Anthropic AI</option>
                    </select>
                  </div>

                  {/* Disallow paths */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Disallow (bloquer)</label>
                      <button onClick={() => addPath(rule.id, "disallow")} className="text-xs font-semibold" style={{ color: "var(--primary)" }}>+ Ajouter</button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {rule.disallow.map((path, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="text" value={path} onChange={(e) => updatePath(rule.id, "disallow", i, e.target.value)}
                            className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", fontFamily: "monospace" }}
                            placeholder="/chemin/" />
                          <button onClick={() => removePath(rule.id, "disallow", i)} className="text-xs font-semibold" style={{ color: "var(--muted)" }}>x</button>
                        </div>
                      ))}
                      {rule.disallow.length === 0 && (
                        <p className="text-xs italic" style={{ color: "var(--muted)" }}>Aucun chemin bloque</p>
                      )}
                    </div>
                  </div>

                  {/* Allow paths */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Allow (autoriser)</label>
                      <button onClick={() => addPath(rule.id, "allow")} className="text-xs font-semibold" style={{ color: "var(--primary)" }}>+ Ajouter</button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {rule.allow.map((path, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="text" value={path} onChange={(e) => updatePath(rule.id, "allow", i, e.target.value)}
                            className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)", fontFamily: "monospace" }}
                            placeholder="/chemin/" />
                          <button onClick={() => removePath(rule.id, "allow", i)} className="text-xs font-semibold" style={{ color: "var(--muted)" }}>x</button>
                        </div>
                      ))}
                      {rule.allow.length === 0 && (
                        <p className="text-xs italic" style={{ color: "var(--muted)" }}>Aucun chemin specifiquement autorise</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addRule}
              className="w-full rounded-2xl border-2 border-dashed py-4 text-xs font-semibold transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              + Ajouter une regle
            </button>

            {/* Global settings */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Parametres globaux</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>URL du Sitemap</label>
                  <input type="url" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)", fontFamily: "monospace" }}
                    placeholder="https://example.com/sitemap.xml" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Crawl-delay (secondes, optionnel)</label>
                  <input type="number" min="0" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)}
                    className="mt-2 w-full rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }}
                    placeholder="10" />
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Fichier robots.txt</h2>
                <button onClick={copyToClipboard}
                  className="rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                  {copied ? "Copie !" : "Copier"}
                </button>
              </div>
              <div className="mt-4 rounded-xl p-4" style={{ background: "#1a1a2e" }}>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed" style={{ fontFamily: "monospace", color: "#a3e635" }}>
                  {output}
                </pre>
              </div>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Placez ce fichier a la racine de votre site : <code style={{ color: "var(--primary)" }}>https://votresite.com/robots.txt</code>
              </p>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Guide robots.txt</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">User-agent</strong> : Identifie le robot concerne. &quot;*&quot; cible tous les robots.</p>
                <p><strong className="text-[var(--foreground)]">Disallow</strong> : Interdit l&apos;acces a un chemin. &quot;/&quot; bloque tout le site.</p>
                <p><strong className="text-[var(--foreground)]">Allow</strong> : Autorise un chemin specifique, utile pour creer des exceptions dans un Disallow.</p>
                <p><strong className="text-[var(--foreground)]">Sitemap</strong> : Indique l&apos;emplacement du sitemap XML pour faciliter l&apos;indexation.</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Robots courants</h3>
              <div className="mt-3 space-y-2">
                {[
                  { bot: "Googlebot", desc: "Google" },
                  { bot: "Bingbot", desc: "Microsoft Bing" },
                  { bot: "GPTBot", desc: "OpenAI" },
                  { bot: "CCBot", desc: "Common Crawl" },
                  { bot: "Yandex", desc: "Yandex" },
                  { bot: "DuckDuckBot", desc: "DuckDuckGo" },
                ].map((r) => (
                  <div key={r.bot} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: "var(--surface-alt)" }}>
                    <span className="text-xs font-bold" style={{ fontFamily: "monospace" }}>{r.bot}</span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
