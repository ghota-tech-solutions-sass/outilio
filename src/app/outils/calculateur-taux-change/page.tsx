"use client";

import { useState, useMemo, useEffect } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateToEUR: number; // How many of this currency = 1 EUR
  fixed?: boolean; // taux fixe (ex: XOF = 655,957 par accord avec le Tresor)
  staticNote?: string; // note pour les devises hors API
}

// Codes a fetch via frankfurter (devises hors API gardees en dur : XOF fixe, MAD non disponible)
const FRANKFURTER_CODES = ["USD", "GBP", "CHF", "CAD", "JPY", "AUD", "CNY"];

// Taux fallback (dernieres valeurs connues - mis a jour dynamiquement via frankfurter.app / BCE)
const FALLBACK_CURRENCIES: Currency[] = [
  { code: "EUR", name: "Euro", symbol: "€", flag: "\u{1F1EA}\u{1F1FA}", rateToEUR: 1 },
  { code: "USD", name: "Dollar americain", symbol: "$", flag: "\u{1F1FA}\u{1F1F8}", rateToEUR: 1.085 },
  { code: "GBP", name: "Livre sterling", symbol: "\u00A3", flag: "\u{1F1EC}\u{1F1E7}", rateToEUR: 0.855 },
  { code: "CHF", name: "Franc suisse", symbol: "CHF", flag: "\u{1F1E8}\u{1F1ED}", rateToEUR: 0.945 },
  { code: "CAD", name: "Dollar canadien", symbol: "C$", flag: "\u{1F1E8}\u{1F1E6}", rateToEUR: 1.485 },
  { code: "JPY", name: "Yen japonais", symbol: "\u00A5", flag: "\u{1F1EF}\u{1F1F5}", rateToEUR: 162.5 },
  { code: "AUD", name: "Dollar australien", symbol: "A$", flag: "\u{1F1E6}\u{1F1FA}", rateToEUR: 1.65 },
  { code: "CNY", name: "Yuan chinois", symbol: "¥", flag: "\u{1F1E8}\u{1F1F3}", rateToEUR: 7.85 },
  { code: "MAD", name: "Dirham marocain", symbol: "MAD", flag: "\u{1F1F2}\u{1F1E6}", rateToEUR: 10.85, staticNote: "taux indicatif (hors API BCE)" },
  { code: "XOF", name: "Franc CFA (BCEAO)", symbol: "CFA", flag: "\u{1F1F8}\u{1F1F3}", rateToEUR: 655.957, fixed: true, staticNote: "taux fixe par accord monetaire avec le Tresor francais" },
];

export default function CalculateurTauxChange() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState(0); // EUR
  const [toCurrency, setToCurrency] = useState(1); // USD
  const [CURRENCIES, setCurrencies] = useState<Currency[]>(FALLBACK_CURRENCIES);
  const [ratesDate, setRatesDate] = useState<string | null>(null);
  const [apiError, setApiError] = useState<boolean>(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("https://api.frankfurter.app/latest?from=EUR", { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("API down");
        return r.json();
      })
      .then((data: { rates: Record<string, number>; date: string }) => {
        setRatesDate(data.date);
        setCurrencies((prev) =>
          prev.map((c) => {
            if (c.code === "EUR" || c.fixed || !FRANKFURTER_CODES.includes(c.code)) return c;
            const r = data.rates[c.code];
            return r ? { ...c, rateToEUR: r } : c;
          })
        );
      })
      .catch((e) => {
        if (e.name !== "AbortError") setApiError(true);
      });
    return () => ctrl.abort();
  }, []);

  const result = useMemo(() => {
    const val = parseFloat(amount) || 0;
    const from = CURRENCIES[fromCurrency];
    const to = CURRENCIES[toCurrency];
    if (!from || !to || val === 0) return null;

    // Convert to EUR first, then to target
    const inEUR = val / from.rateToEUR;
    const converted = inEUR * to.rateToEUR;
    const rate = to.rateToEUR / from.rateToEUR;
    const inverseRate = from.rateToEUR / to.rateToEUR;

    return { converted, rate, inverseRate, from, to };
  }, [amount, fromCurrency, toCurrency, CURRENCIES]);

  const allConversions = useMemo(() => {
    const val = parseFloat(amount) || 0;
    const from = CURRENCIES[fromCurrency];
    if (!from || val === 0) return [];

    const inEUR = val / from.rateToEUR;
    return CURRENCIES.filter((_, i) => i !== fromCurrency).map((c) => ({
      ...c,
      converted: inEUR * c.rateToEUR,
    }));
  }, [amount, fromCurrency, CURRENCIES]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    if (result) {
      setAmount(formatNumber(result.converted));
    }
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Finance</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Convertisseur de <span style={{ color: "var(--primary)" }}>devises</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Convertissez entre EUR, USD, GBP, CHF, CAD, JPY, AUD, CNY, MAD et XOF.{" "}
            {ratesDate ? (
              <span>Taux BCE du <strong className="text-[var(--foreground)]">{new Date(ratesDate).toLocaleDateString("fr-FR")}</strong> (via frankfurter.app).</span>
            ) : apiError ? (
              <span>Taux indicatifs (API indisponible).</span>
            ) : (
              <span>Chargement des taux BCE...</span>
            )}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Converter */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Conversion</h2>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>De</label>
                    <select value={fromCurrency} onChange={(e) => setFromCurrency(parseInt(e.target.value))}
                      className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }}>
                      {CURRENCIES.map((c, i) => (
                        <option key={i} value={i}>{c.flag} {c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={swap} className="mb-0.5 rounded-xl p-2.5 transition-all hover:bg-[var(--surface-alt)]" title="Inverser">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 16l-4-4 4-4" /><path d="M17 8l4 4-4 4" /><path d="M3 12h18" />
                    </svg>
                  </button>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Vers</label>
                    <select value={toCurrency} onChange={(e) => setToCurrency(parseInt(e.target.value))}
                      className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }}>
                      {CURRENCIES.map((c, i) => (
                        <option key={i} value={i}>{c.flag} {c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                    className="rounded-xl border px-4 py-3 text-center text-lg font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                  <span className="text-lg font-bold" style={{ color: "var(--muted)" }}>=</span>
                  <div className="rounded-xl px-4 py-3 text-center text-lg font-bold" style={{ background: "var(--surface-alt)", fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                    {result ? `${formatNumber(result.converted)} ${CURRENCIES[toCurrency].code}` : "—"}
                  </div>
                </div>

                {result && (
                  <div className="flex justify-center gap-6 text-xs" style={{ color: "var(--muted)" }}>
                    <span>1 {result.from.code} = {formatNumber(result.rate)} {result.to.code}</span>
                    <span>1 {result.to.code} = {formatNumber(result.inverseRate)} {result.from.code}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Result card */}
            {result && (
              <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                  {amount} {result.from.flag} {result.from.code}
                </p>
                <p className="mt-4 text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {formatNumber(result.converted)} {result.to.symbol}
                </p>
                <p className="mt-2 text-sm font-semibold" style={{ color: "var(--muted)" }}>
                  {result.to.flag} {result.to.name}
                </p>
              </div>
            )}

            {/* All conversions */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                {amount || "0"} {CURRENCIES[fromCurrency].code} dans toutes les devises
              </h2>
              <div className="mt-4 space-y-2">
                {allConversions.map((c) => (
                  <div key={c.code} className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{ background: c.code === CURRENCIES[toCurrency]?.code ? "var(--primary)" : "var(--surface-alt)", color: c.code === CURRENCIES[toCurrency]?.code ? "white" : undefined }}>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <span className="text-lg">{c.flag}</span>
                      {c.code} - {c.name}
                    </span>
                    <span className="font-mono text-sm font-bold">
                      {formatNumber(c.converted)} {c.symbol}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate table */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>
                Taux de reference (base EUR)
                {ratesDate && (
                  <span className="ml-2 text-[10px] font-normal normal-case tracking-normal" style={{ color: "var(--muted)" }}>
                    BCE du {new Date(ratesDate).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>
                      <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider">Devise</th>
                      <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider">1 EUR =</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CURRENCIES.filter((c) => c.code !== "EUR").map((c) => (
                      <tr key={c.code} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td className="py-2">
                          <span className="mr-2">{c.flag}</span>
                          {c.code} - {c.name}
                          {c.staticNote && (
                            <span className="ml-2 text-[10px] italic" style={{ color: "var(--muted)" }}>{c.staticNote}</span>
                          )}
                        </td>
                        <td className="py-2 text-right font-mono font-bold" style={{ color: "var(--primary)" }}>
                          {formatNumber(c.rateToEUR)} {c.symbol}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>A propos des taux de change</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Source des taux</strong> : Les taux affiches sont les taux de reference de la <strong className="text-[var(--foreground)]">Banque Centrale Europeenne (BCE)</strong>, recuperes en temps reel via l&apos;API publique frankfurter.app. Ils sont mis a jour chaque jour ouvre vers 16h CET. Les taux reels varient selon les banques et les plateformes de change.</p>
                <p><strong className="text-[var(--foreground)]">Franc CFA</strong> : Le XOF (Franc CFA de la BCEAO) a un taux fixe de 655,957 pour 1 EUR, garanti par le Tresor francais via l&apos;accord de cooperation monetaire. Le dirham marocain (MAD) n&apos;est pas couvert par l&apos;API BCE : son taux est indicatif.</p>
                <p><strong className="text-[var(--foreground)]">Frais de change</strong> : Les banques appliquent generalement une marge de 1-3% sur le taux interbancaire. Pour les meilleurs taux, comparez les services de transfert en ligne.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le convertisseur de devises
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>Notre convertisseur de devises vous permet de calculer instantanement la valeur d&apos;un montant dans une autre monnaie. Ideal pour preparer un voyage, verifier un prix en ligne ou comparer des offres internationales.</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Selectionnez les devises</strong> : choisissez la devise de depart et la devise d&apos;arrivee parmi EUR, USD, GBP, CHF, CAD, JPY, MAD et XOF.</li>
                  <li><strong className="text-[var(--foreground)]">Entrez le montant</strong> : saisissez la somme a convertir. Le resultat s&apos;affiche en temps reel.</li>
                  <li><strong className="text-[var(--foreground)]">Inversez en un clic</strong> : utilisez le bouton d&apos;inversion pour echanger les devises instantanement.</li>
                  <li><strong className="text-[var(--foreground)]">Vue d&apos;ensemble</strong> : consultez le tableau complet pour voir votre montant converti dans toutes les devises disponibles.</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Pourquoi les taux de change varient-ils selon les banques ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Les banques et bureaux de change appliquent une marge (spread) sur le taux interbancaire, qui est le taux de reference entre banques. Cette marge, generalement de 1 a 3%, constitue leur remuneration. Les services de transfert en ligne comme Wise ou Revolut proposent souvent des marges plus faibles que les banques traditionnelles.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Qu&apos;est-ce que le taux fixe EUR/XOF ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le Franc CFA (XOF) de la zone BCEAO (Afrique de l&apos;Ouest) a un taux de change fixe avec l&apos;euro : 1 &euro; = 655,957 XOF. Ce taux est garanti par le Tresor francais depuis la creation de la zone franc. Cela signifie que ce taux ne fluctue pas sur les marches, contrairement aux autres devises.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Comment obtenir le meilleur taux de change pour un voyage ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Evitez les bureaux de change des aeroports qui pratiquent des marges elevees. Privilegiez le paiement par carte bancaire sans frais de change (type Revolut, N26 ou Boursorama Ultim), ou retirez dans des distributeurs locaux. Comparez toujours plusieurs options et refusez la &laquo; conversion dynamique &raquo; (DCC) proposee par certains terminaux de paiement a l&apos;etranger.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Devises populaires</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li><strong>EUR/USD</strong> : Paire la plus echangee au monde</li>
                <li><strong>EUR/GBP</strong> : Echanges europeens</li>
                <li><strong>EUR/CHF</strong> : Valeur refuge</li>
                <li><strong>EUR/MAD</strong> : Transferts Maghreb</li>
                <li><strong>EUR/XOF</strong> : Taux fixe (655,957)</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}

function formatNumber(n: number): string {
  if (!isFinite(n)) return "\u2014";
  if (Math.abs(n) >= 1000) return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (Math.abs(n) < 0.01 && n !== 0) return n.toFixed(6);
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}
