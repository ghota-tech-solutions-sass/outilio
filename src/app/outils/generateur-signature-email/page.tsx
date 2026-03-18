"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

const TEMPLATES = [
  { id: "classique", label: "Classique" },
  { id: "moderne", label: "Moderne" },
  { id: "minimal", label: "Minimal" },
];

const COLORS_LIST = ["#0d4f3c", "#16785c", "#3b82f6", "#8b5cf6", "#ef4444", "#e8963e", "#1a1a1a"];

export default function GenerateurSignatureEmail() {
  const [nom, setNom] = useState("Jean Dupont");
  const [titre, setTitre] = useState("Directeur Marketing");
  const [entreprise, setEntreprise] = useState("Acme SAS");
  const [telephone, setTelephone] = useState("+33 1 23 45 67 89");
  const [email, setEmail] = useState("jean.dupont@acme.fr");
  const [site, setSite] = useState("https://acme.fr");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [template, setTemplate] = useState("classique");
  const [couleur, setCouleur] = useState("#0d4f3c");
  const [copied, setCopied] = useState(false);

  const signatureHTML = useMemo(() => {
    const socialLinks: string[] = [];
    if (linkedin) socialLinks.push(`<a href="${linkedin}" style="color:${couleur};text-decoration:none;font-size:12px;">LinkedIn</a>`);
    if (twitter) socialLinks.push(`<a href="${twitter}" style="color:${couleur};text-decoration:none;font-size:12px;">Twitter</a>`);
    const socialLine = socialLinks.length > 0 ? `<p style="margin:4px 0 0 0;">${socialLinks.join(" &middot; ")}</p>` : "";

    if (template === "classique") {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;">
  <tr>
    <td style="padding-right:15px;border-right:3px solid ${couleur};vertical-align:top;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:${couleur};">${nom}</p>
      <p style="margin:2px 0 0 0;font-size:13px;color:#666666;">${titre}</p>
      ${entreprise ? `<p style="margin:2px 0 0 0;font-size:13px;font-weight:bold;">${entreprise}</p>` : ""}
    </td>
    <td style="padding-left:15px;vertical-align:top;">
      ${telephone ? `<p style="margin:0;font-size:12px;">Tel: ${telephone}</p>` : ""}
      ${email ? `<p style="margin:2px 0 0 0;font-size:12px;"><a href="mailto:${email}" style="color:${couleur};text-decoration:none;">${email}</a></p>` : ""}
      ${site ? `<p style="margin:2px 0 0 0;font-size:12px;"><a href="${site}" style="color:${couleur};text-decoration:none;">${site}</a></p>` : ""}
      ${socialLine}
    </td>
  </tr>
</table>`;
    } else if (template === "moderne") {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;">
  <tr>
    <td style="padding:12px 20px;background-color:${couleur};border-radius:8px 8px 0 0;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:#ffffff;">${nom}</p>
      <p style="margin:2px 0 0 0;font-size:12px;color:rgba(255,255,255,0.8);">${titre}${entreprise ? ` | ${entreprise}` : ""}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 20px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;">
      ${telephone ? `<p style="margin:0;font-size:12px;">Tel: ${telephone}</p>` : ""}
      ${email ? `<p style="margin:4px 0 0 0;font-size:12px;"><a href="mailto:${email}" style="color:${couleur};text-decoration:none;">${email}</a></p>` : ""}
      ${site ? `<p style="margin:4px 0 0 0;font-size:12px;"><a href="${site}" style="color:${couleur};text-decoration:none;">${site}</a></p>` : ""}
      ${socialLine}
    </td>
  </tr>
</table>`;
    } else {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;">
  <tr>
    <td>
      <p style="margin:0;font-size:15px;font-weight:bold;color:${couleur};">${nom}</p>
      <p style="margin:2px 0 0 0;font-size:12px;color:#999999;">${titre}${entreprise ? ` - ${entreprise}` : ""}</p>
      <p style="margin:6px 0 0 0;font-size:11px;color:#999999;">${[telephone, email, site].filter(Boolean).join(" | ")}</p>
      ${socialLine}
    </td>
  </tr>
</table>`;
    }
  }, [nom, titre, entreprise, telephone, email, site, linkedin, twitter, template, couleur]);

  const handleCopy = () => {
    navigator.clipboard.writeText(signatureHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Business</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur <span style={{ color: "var(--primary)" }}>Signature Email</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Creez une signature email HTML professionnelle. Copiez le code et collez-le dans votre client email.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Form */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Nom complet</label>
                  <input type="text" value={nom} onChange={(e) => setNom(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Titre / Poste</label>
                  <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Entreprise</label>
                  <input type="text" value={entreprise} onChange={(e) => setEntreprise(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Telephone</label>
                  <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Site web</label>
                  <input type="url" value={site} onChange={(e) => setSite(e.target.value)}
                    className="mt-1 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>LinkedIn (URL)</label>
                  <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..."
                    className="mt-1 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Twitter / X (URL)</label>
                  <input type="url" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="https://x.com/..."
                    className="mt-1 w-full rounded-xl border px-4 py-3" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {/* Style */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Style</h2>
              <div className="mt-4 flex gap-2">
                {TEMPLATES.map((t) => (
                  <button key={t.id} onClick={() => setTemplate(t.id)}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition-all"
                    style={{ borderColor: template === t.id ? "var(--primary)" : "var(--border)", background: template === t.id ? "rgba(13,79,60,0.05)" : "transparent", color: template === t.id ? "var(--primary)" : "var(--muted)" }}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Couleur</label>
                <div className="mt-2 flex gap-2">
                  {COLORS_LIST.map((c) => (
                    <button key={c} onClick={() => setCouleur(c)}
                      className="h-8 w-8 rounded-full transition-all" style={{ background: c, outline: couleur === c ? `3px solid ${c}` : "none", outlineOffset: "2px" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Apercu</h2>
                <button onClick={handleCopy}
                  className="rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all"
                  style={{ background: copied ? "#16a34a" : "var(--primary)" }}>
                  {copied ? "Copie !" : "Copier le HTML"}
                </button>
              </div>
              <div className="mt-4 rounded-xl border p-6" style={{ borderColor: "var(--border)", background: "#ffffff" }}
                dangerouslySetInnerHTML={{ __html: signatureHTML }} />
            </div>

            {/* HTML Code */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Code HTML</h2>
              <pre className="mt-4 overflow-x-auto rounded-xl p-4 text-xs" style={{ background: "var(--surface-alt)" }}>
                <code>{signatureHTML}</code>
              </pre>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Comment utiliser la signature ?</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Gmail</strong> : Parametres &gt; Voir tous les parametres &gt; Signature &gt; collez le HTML.</p>
                <p><strong className="text-[var(--foreground)]">Outlook</strong> : Fichier &gt; Options &gt; Courrier &gt; Signatures &gt; collez la signature.</p>
                <p><strong className="text-[var(--foreground)]">Thunderbird</strong> : Parametres du compte &gt; cochez &quot;Utiliser HTML&quot; &gt; collez le code.</p>
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
