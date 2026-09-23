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
      lines.push(`User-agent: ${rule.userAgent.trim() || "*"}`);
      const allow = rule.allow.map((a) => a.trim()).filter(Boolean);
      const disallow = rule.disallow.map((d) => d.trim()).filter(Boolean);
      // Allow first: parsers that apply the first matching rule (instead of
      // Google's "most specific rule wins") then still honor the exceptions.
      for (const a of allow) lines.push(`Allow: ${a}`);
      for (const d of disallow) lines.push(`Disallow: ${d}`);
      // A group must contain at least one rule; an empty Disallow means "allow all".
      if (allow.length === 0 && disallow.length === 0) lines.push("Disallow:");
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

  const warnings = useMemo(() => {
    const list: string[] = [];
    const badPaths = rules.flatMap((r) => [...r.allow, ...r.disallow]).map((p) => p.trim()).filter((p) => p && !p.startsWith("/") && !p.startsWith("*"));
    if (badPaths.length > 0) {
      list.push(`Les chemins doivent commencer par « / » (ou « * ») : ${badPaths.join(", ")}`);
    }
    const sitemap = sitemapUrl.trim();
    if (sitemap && !/^https?:\/\//i.test(sitemap)) {
      list.push("L'URL du sitemap doit être absolue (https://votresite.fr/sitemap.xml).");
    }
    if (crawlDelay.trim()) {
      list.push("Googlebot ignore la directive Crawl-delay (Bing la prend en compte).");
    }
    return list;
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
        setRules([{ id: nextId++, userAgent: "*", disallow: [], allow: [] }]);
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
      name: "Standard (admin bloqué)",
      apply: () => {
        setRules([{ id: nextId++, userAgent: "*", disallow: ["/admin/", "/api/", "/private/", "/tmp/"], allow: [] }]);
        setCrawlDelay("");
      },
    },
    {
      name: "WordPress",
      apply: () => {
        // CSS/JS (wp-includes, plugins) must stay crawlable: Google needs them to render pages.
        setRules([{ id: nextId++, userAgent: "*", disallow: ["/wp-admin/", "/?s=", "/search/"], allow: ["/wp-admin/admin-ajax.php"] }]);
        setCrawlDelay("");
      },
    },
    {
      name: "Bloquer les robots IA",
      apply: () => {
        setRules([
          { id: nextId++, userAgent: "*", disallow: [], allow: [] },
          ...["GPTBot", "ClaudeBot", "CCBot", "Google-Extended"].map((ua) => ({ id: nextId++, userAgent: ua, disallow: ["/"], allow: [] })),
        ]);
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
            Générateur <span style={{ color: "var(--primary)" }}>robots.txt</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Créez un fichier robots.txt valide pour votre site. Bloquer des chemins, autoriser les robots, définir le sitemap.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Presets */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Préréglages rapides</h2>
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

            <datalist id="user-agents">
              <option value="*">Tous les robots</option>
              <option value="Googlebot">Google</option>
              <option value="Bingbot">Microsoft Bing</option>
              <option value="Yandex">Yandex</option>
              <option value="DuckDuckBot">DuckDuckGo</option>
              <option value="Baiduspider">Baidu</option>
              <option value="GPTBot">OpenAI (entraînement)</option>
              <option value="ChatGPT-User">ChatGPT (navigation)</option>
              <option value="ClaudeBot">Anthropic (Claude)</option>
              <option value="Google-Extended">Google (entraînement IA Gemini)</option>
              <option value="CCBot">Common Crawl</option>
            </datalist>

            {/* Rules */}
            {rules.map((rule) => (
              <div key={rule.id} className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Règle</h2>
                  {rules.length > 1 && (
                    <button onClick={() => removeRule(rule.id)} className="text-xs font-semibold transition-all hover:opacity-70" style={{ color: "var(--muted)" }}>
                      Supprimer
                    </button>
                  )}
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>User-agent</label>
                    <input type="text" list="user-agents" value={rule.userAgent} onChange={(e) => updateUserAgent(rule.id, e.target.value)}
                      className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-bold" style={{ borderColor: "var(--border)", fontFamily: "monospace" }}
                      placeholder="* (tous les robots)" />
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
                        <p className="text-xs italic" style={{ color: "var(--muted)" }}>Aucun chemin bloqué</p>
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
                        <p className="text-xs italic" style={{ color: "var(--muted)" }}>Aucun chemin spécifiquement autorisé</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={addRule}
              className="w-full rounded-2xl border-2 border-dashed py-4 text-xs font-semibold transition-all hover:border-[var(--primary)] hover:text-[var(--primary)]"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
              + Ajouter une règle
            </button>

            {/* Global settings */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Paramètres globaux</h2>
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
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
              <div className="mt-4 rounded-xl p-4" style={{ background: "#1a1a2e" }}>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed" style={{ fontFamily: "monospace", color: "#a3e635" }}>
                  {output}
                </pre>
              </div>
              {warnings.length > 0 && (
                <ul className="mt-3 space-y-1 rounded-xl p-3 text-xs" style={{ background: "#fffbeb", color: "#92400e" }}>
                  {warnings.map((w) => <li key={w}>{w}</li>)}
                </ul>
              )}
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Placez ce fichier à la racine de votre site : <code style={{ color: "var(--primary)" }}>https://votresite.com/robots.txt</code>
              </p>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Guide robots.txt</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">User-agent</strong> : Identifie le robot concerné (champ libre : vous pouvez saisir n&apos;importe quel nom de robot). &quot;*&quot; cible tous les robots.</p>
                <p><strong className="text-[var(--foreground)]">Disallow</strong> : Interdit l&apos;accès à un chemin. &quot;/&quot; bloque tout le site.</p>
                <p><strong className="text-[var(--foreground)]">Allow</strong> : Autorise un chemin spécifique, utile pour créer des exceptions dans un Disallow. Un groupe sans règle reçoit automatiquement « Disallow: » (vide), qui signifie « tout autoriser ».</p>
                <p><strong className="text-[var(--foreground)]">Sitemap</strong> : Indique l&apos;emplacement du sitemap XML pour faciliter l&apos;indexation.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment créer un fichier robots.txt pour votre site
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Le fichier robots.txt indique aux moteurs de recherche quelles pages de votre site peuvent être explorées.
                  C&apos;est un élément clé du référencement technique (SEO) qui doit être placé à la racine de votre site.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Utilisez un preset</strong> : choisissez parmi 5 configurations courantes (standard, WordPress, tout autoriser, tout bloquer, bloquer les robots IA)</li>
                  <li><strong className="text-[var(--foreground)]">Ajoutez des règles</strong> : définissez les chemins à bloquer (Disallow) ou autoriser (Allow) par user-agent</li>
                  <li><strong className="text-[var(--foreground)]">Configurez le sitemap</strong> : indiquez l&apos;URL de votre sitemap XML pour faciliter l&apos;indexation</li>
                  <li><strong className="text-[var(--foreground)]">Bloquez les robots IA</strong> : GPTBot, ClaudeBot, CCBot, Google-Extended et autres crawlers d&apos;intelligence artificielle</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Où placer le fichier robots.txt ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le fichier robots.txt doit être placé à la racine de votre domaine, accessible à l&apos;URL <code style={{ color: "var(--primary)" }}>https://votresite.com/robots.txt</code>. Il doit être en texte brut (pas de HTML) et accessible publiquement.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Le robots.txt empêche-t-il l&apos;indexation ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le robots.txt empêche l&apos;exploration (crawling) mais pas nécessairement l&apos;indexation. Google peut indexer une URL bloquée par robots.txt s&apos;il la trouve via des liens. Pour empêcher l&apos;indexation, utilisez la balise meta <code style={{ color: "var(--primary)" }}>noindex</code> ou l&apos;en-tête HTTP X-Robots-Tag.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Faut-il bloquer les robots d&apos;IA comme GPTBot ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>C&apos;est un choix éditorial. Bloquer GPTBot (OpenAI), ClaudeBot (Anthropic), CCBot (Common Crawl) ou Google-Extended (Gemini) demande à ces robots de ne pas utiliser votre contenu pour entraîner des modèles d&apos;IA ; le respect de la directive dépend de chaque éditeur. Bloquer ces agents n&apos;affecte pas votre référencement sur Google ou Bing, car Googlebot et Bingbot sont des robots distincts.</p>
                </div>
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
                  { bot: "ClaudeBot", desc: "Anthropic" },
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
