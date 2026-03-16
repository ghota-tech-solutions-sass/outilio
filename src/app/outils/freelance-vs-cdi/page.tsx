"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const WORKING_DAYS_YEAR = 218;

function calcCDI(brutAnnuel: number, parts: number) {
  const netAvantImpot = brutAnnuel * 0.78;
  const impot = calcImpot(netAvantImpot, parts);
  return {
    brutAnnuel,
    brutMensuel: brutAnnuel / 12,
    netAvantImpot,
    netMensuelAvantImpot: netAvantImpot / 12,
    impotAnnuel: impot,
    netApresImpot: netAvantImpot - impot,
    netMensuelApresImpot: (netAvantImpot - impot) / 12,
    coutEmployeur: brutAnnuel * 1.45,
    conges: 25,
    avantages: ["Conges payes", "Mutuelle", "Chomage", "Retraite", "Formation", "Stabilite"],
  };
}

function calcFreelance(tjm: number, joursParAn: number, statut: string, parts: number) {
  const ca = tjm * joursParAn;
  let charges: number, fraisPro: number;

  if (statut === "micro") {
    charges = ca * 0.22; // BNC micro
    fraisPro = 0;
  } else if (statut === "eurl") {
    charges = ca * 0.45;
    fraisPro = ca * 0.05;
  } else {
    // SASU
    charges = ca * 0.55;
    fraisPro = ca * 0.05;
  }

  const revenuImposable = statut === "micro" ? ca * 0.66 : ca - charges - fraisPro;
  const impot = calcImpot(revenuImposable, parts);
  const netApresImpot = ca - charges - fraisPro - impot;

  return {
    ca,
    caMensuel: ca / 12,
    charges,
    fraisPro,
    revenuImposable,
    impotAnnuel: impot,
    netApresImpot,
    netMensuelApresImpot: netApresImpot / 12,
    joursParAn,
    joursConges: WORKING_DAYS_YEAR - joursParAn,
    avantages: statut === "micro"
      ? ["Simplicite", "Pas de TVA (<36.8k)", "Abattement 34%", "Liberte"]
      : ["Optimisation fiscale", "Deduction frais", "Credibilite", "Liberte"],
  };
}

function calcImpot(revenu: number, parts: number) {
  const q = revenu / parts;
  let impot = 0;
  const tranches = [
    { min: 0, max: 11294, rate: 0 },
    { min: 11294, max: 28797, rate: 0.11 },
    { min: 28797, max: 82341, rate: 0.30 },
    { min: 82341, max: 177106, rate: 0.41 },
    { min: 177106, max: Infinity, rate: 0.45 },
  ];
  for (const t of tranches) {
    if (q <= t.min) break;
    impot += (Math.min(q, t.max) - t.min) * t.rate;
  }
  return impot * parts;
}

export default function FreelanceVsCDI() {
  const [salaireBrut, setSalaireBrut] = useState("45000");
  const [tjm, setTjm] = useState("500");
  const [joursAn, setJoursAn] = useState("200");
  const [statut, setStatut] = useState("micro");
  const [parts, setParts] = useState("1");

  const partsNum = parseFloat(parts) || 1;
  const cdi = useMemo(() => calcCDI(parseFloat(salaireBrut) || 0, partsNum), [salaireBrut, partsNum]);
  const freelance = useMemo(
    () => calcFreelance(parseFloat(tjm) || 0, parseInt(joursAn) || 200, statut, partsNum),
    [tjm, joursAn, statut, partsNum]
  );

  const diff = freelance.netMensuelApresImpot - cdi.netMensuelApresImpot;
  const fmt = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 0 });

  // TJM equivalent pour matcher le CDI
  const tjmEquivalent = useMemo(() => {
    let low = 0, high = 5000;
    for (let i = 0; i < 50; i++) {
      const mid = (low + high) / 2;
      const fl = calcFreelance(mid, parseInt(joursAn) || 200, statut, partsNum);
      if (fl.netApresImpot < cdi.netApresImpot) low = mid;
      else high = mid;
    }
    return Math.round((low + high) / 2);
  }, [cdi.netApresImpot, joursAn, statut, partsNum]);

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-5xl px-5">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Carriere</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            <span style={{ color: "var(--primary)" }}>Freelance</span> vs CDI
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Comparez les revenus nets reels entre freelance et salarie. TJM equivalent, charges, impots.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--primary)" }}>CDI</h2>
                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Salaire brut annuel</label>
                  <div className="relative mt-2">
                    <input type="number" value={salaireBrut} onChange={(e) => setSalaireBrut(e.target.value)}
                      className="w-full rounded-xl border px-4 py-3 text-xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>&euro;/an</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Freelance</h2>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>TJM</label>
                    <div className="relative mt-1">
                      <input type="number" value={tjm} onChange={(e) => setTjm(e.target.value)}
                        className="w-full rounded-xl border px-4 py-3 text-xl font-bold" style={{ borderColor: "var(--border)", fontFamily: "var(--font-display)" }} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--muted)" }}>&euro;/j</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Jours/an</label>
                      <input type="number" value={joursAn} onChange={(e) => setJoursAn(e.target.value)}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Statut</label>
                      <select value={statut} onChange={(e) => setStatut(e.target.value)}
                        className="mt-1 w-full rounded-lg border px-2 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                        <option value="micro">Micro</option>
                        <option value="eurl">EURL</option>
                        <option value="sasu">SASU</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-3" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3 px-3">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Parts fiscales</label>
                <input type="number" step="0.5" min="1" value={parts} onChange={(e) => setParts(e.target.value)}
                  className="w-20 rounded-lg border px-3 py-2 text-sm text-center" style={{ borderColor: "var(--border)" }} />
              </div>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <CompareCard label="CDI" subtitle="Net/mois apres impot" value={`${fmt(cdi.netMensuelApresImpot)} €`}
                winner={cdi.netMensuelApresImpot >= freelance.netMensuelApresImpot} color="var(--primary)" />
              <CompareCard label="Freelance" subtitle="Net/mois apres impot" value={`${fmt(freelance.netMensuelApresImpot)} €`}
                winner={freelance.netMensuelApresImpot > cdi.netMensuelApresImpot} color="var(--accent)" />
            </div>

            {/* Verdict */}
            <div className="rounded-2xl border p-6 text-center" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--muted)" }}>Difference mensuelle</p>
              <p className="mt-2 text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: diff >= 0 ? "var(--primary)" : "#dc2626" }}>
                {diff >= 0 ? "+" : ""}{fmt(diff)} &euro;/mois
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                en faveur du {diff >= 0 ? "freelance" : "CDI"}
              </p>
              <div className="mt-4 rounded-xl p-4" style={{ background: "var(--surface-alt)" }}>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  TJM minimum pour egaliser le CDI : <strong className="text-[var(--foreground)]" style={{ fontFamily: "var(--font-display)" }}>{tjmEquivalent} &euro;/jour</strong>
                </p>
              </div>
            </div>

            {/* Detail tables */}
            <div className="grid grid-cols-2 gap-4">
              <DetailTable title="CDI" color="var(--primary)" rows={[
                ["Brut annuel", `${fmt(cdi.brutAnnuel)} €`],
                ["Charges (~22%)", `- ${fmt(cdi.brutAnnuel - cdi.netAvantImpot)} €`],
                ["Net avant impot", `${fmt(cdi.netAvantImpot)} €`],
                ["Impot", `- ${fmt(cdi.impotAnnuel)} €`],
                ["Net apres impot", `${fmt(cdi.netApresImpot)} €`],
                ["Cout employeur", `${fmt(cdi.coutEmployeur)} €`],
              ]} />
              <DetailTable title="Freelance" color="var(--accent)" rows={[
                ["CA annuel", `${fmt(freelance.ca)} €`],
                ["Charges", `- ${fmt(freelance.charges)} €`],
                ["Frais pro", `- ${fmt(freelance.fraisPro)} €`],
                ["Imposable", `${fmt(freelance.revenuImposable)} €`],
                ["Impot", `- ${fmt(freelance.impotAnnuel)} €`],
                ["Net apres impot", `${fmt(freelance.netApresImpot)} €`],
              ]} />
            </div>

            {/* Advantages comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--primary)" }}>Avantages CDI</h3>
                <ul className="mt-3 space-y-1.5">
                  {cdi.avantages.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                      <span style={{ color: "var(--primary)" }}>{"\u2713"}</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Avantages Freelance</h3>
                <ul className="mt-3 space-y-1.5">
                  {freelance.avantages.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm" style={{ color: "var(--muted)" }}>
                      <span style={{ color: "var(--accent)" }}>{"\u2713"}</span> {a}
                    </li>
                  ))}
                </ul>
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

function CompareCard({ label, subtitle, value, winner, color }: { label: string; subtitle: string; value: string; winner: boolean; color: string }) {
  return (
    <div className="rounded-2xl border p-5 text-center transition-all" style={{
      background: "var(--surface)", borderColor: winner ? color : "var(--border)",
      boxShadow: winner ? `0 0 0 2px ${color}20` : "none",
    }}>
      <p className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{label}</p>
      <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>{subtitle}</p>
      <p className="mt-2 text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color }}>{value}</p>
      {winner && <span className="mt-2 inline-block rounded-full px-3 py-0.5 text-[10px] font-bold text-white" style={{ background: color }}>GAGNANT</span>}
    </div>
  );
}

function DetailTable({ title, color, rows }: { title: string; color: string; rows: string[][] }) {
  return (
    <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <h3 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color }}>{title}</h3>
      <div className="mt-3 space-y-1.5">
        {rows.map(([label, value], i) => (
          <div key={i} className="flex justify-between text-sm">
            <span style={{ color: "var(--muted)" }}>{label}</span>
            <span className={i === rows.length - 1 ? "font-bold" : "font-medium"} style={i === rows.length - 1 ? { color, fontFamily: "var(--font-display)" } : {}}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
