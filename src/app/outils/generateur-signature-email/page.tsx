"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

const TEMPLATES = [
  { id: "classique", label: "Classique" },
  { id: "moderne", label: "Moderne" },
  { id: "minimal", label: "Minimal" },
];

const COLORS_LIST = ["#0d4f3c", "#16785c", "#3b82f6", "#8b5cf6", "#ef4444", "#e8963e", "#1a1a1a"];

/** Échappe les caractères spéciaux HTML (&, <, >, ", ') d'une saisie utilisateur. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** N'accepte que les liens http(s) ; ajoute https:// si le protocole est absent. Renvoie "" sinon. */
function safeWebUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  const withProto = /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v.replace(/^\/+/, "")}`;
  try {
    const u = new URL(withProto);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : "";
  } catch {
    return "";
  }
}

/** Nettoie un numéro de téléphone pour un lien tel: (chiffres et + uniquement). */
function telHref(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  return digits.length >= 4 ? `tel:${digits}` : "";
}

/** Adresse email plausible (pas d'espace, un @, un point dans le domaine). */
function isEmail(raw: string): boolean {
  return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(raw.trim());
}

export default function GenerateurSignatureEmail() {
  const [nom, setNom] = useState("Jean Dupont");
  const [titre, setTitre] = useState("Directeur marketing");
  const [entreprise, setEntreprise] = useState("Acme SAS");
  const [telephone, setTelephone] = useState("+33 1 23 45 67 89");
  const [email, setEmail] = useState("jean.dupont@acme.fr");
  const [site, setSite] = useState("https://acme.fr");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [template, setTemplate] = useState("classique");
  const [couleur, setCouleur] = useState("#0d4f3c");
  const [copied, setCopied] = useState<"" | "rich" | "html">("");
  const [copyError, setCopyError] = useState("");

  const signatureHTML = useMemo(() => {
    const e = escapeHtml;
    const n = e(nom);
    const t = e(titre);
    const ent = e(entreprise);
    const tel = e(telephone);
    const tHref = telHref(telephone);
    const mail = isEmail(email) ? email.trim() : "";
    const siteUrl = safeWebUrl(site);
    const siteLabel = e(site.trim().replace(/^https?:\/\//i, "").replace(/\/$/, ""));
    const liUrl = safeWebUrl(linkedin);
    const xUrl = safeWebUrl(twitter);

    const telHtml = telephone.trim()
      ? tHref
        ? `<a href="${e(tHref)}" style="color:#333333;text-decoration:none;">${tel}</a>`
        : tel
      : "";
    const mailHtml = mail ? `<a href="mailto:${e(mail)}" style="color:${couleur};text-decoration:none;">${e(mail)}</a>` : email.trim() ? e(email) : "";
    const siteHtml = siteUrl ? `<a href="${e(siteUrl)}" style="color:${couleur};text-decoration:none;">${siteLabel}</a>` : "";

    const socialLinks: string[] = [];
    if (liUrl) socialLinks.push(`<a href="${e(liUrl)}" style="color:${couleur};text-decoration:none;font-size:12px;">LinkedIn</a>`);
    if (xUrl) socialLinks.push(`<a href="${e(xUrl)}" style="color:${couleur};text-decoration:none;font-size:12px;">X (Twitter)</a>`);
    const socialLine = socialLinks.length > 0 ? `<p style="margin:4px 0 0 0;">${socialLinks.join(" &middot; ")}</p>` : "";

    if (template === "classique") {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;">
  <tr>
    <td style="padding-right:15px;border-right:3px solid ${couleur};vertical-align:top;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:${couleur};">${n}</p>
      ${t ? `<p style="margin:2px 0 0 0;font-size:13px;color:#666666;">${t}</p>` : ""}
      ${ent ? `<p style="margin:2px 0 0 0;font-size:13px;font-weight:bold;">${ent}</p>` : ""}
    </td>
    <td style="padding-left:15px;vertical-align:top;">
      ${telHtml ? `<p style="margin:0;font-size:12px;">Tél. : ${telHtml}</p>` : ""}
      ${mailHtml ? `<p style="margin:2px 0 0 0;font-size:12px;">${mailHtml}</p>` : ""}
      ${siteHtml ? `<p style="margin:2px 0 0 0;font-size:12px;">${siteHtml}</p>` : ""}
      ${socialLine}
    </td>
  </tr>
</table>`;
    } else if (template === "moderne") {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;">
  <tr>
    <td style="padding:12px 20px;background-color:${couleur};border-radius:8px 8px 0 0;">
      <p style="margin:0;font-size:18px;font-weight:bold;color:#ffffff;">${n}</p>
      <p style="margin:2px 0 0 0;font-size:12px;color:#eeeeee;">${[t, ent].filter(Boolean).join(" | ")}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:12px 20px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px;">
      ${telHtml ? `<p style="margin:0;font-size:12px;">Tél. : ${telHtml}</p>` : ""}
      ${mailHtml ? `<p style="margin:4px 0 0 0;font-size:12px;">${mailHtml}</p>` : ""}
      ${siteHtml ? `<p style="margin:4px 0 0 0;font-size:12px;">${siteHtml}</p>` : ""}
      ${socialLine}
    </td>
  </tr>
</table>`;
    } else {
      return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333333;">
  <tr>
    <td>
      <p style="margin:0;font-size:15px;font-weight:bold;color:${couleur};">${n}</p>
      <p style="margin:2px 0 0 0;font-size:12px;color:#999999;">${[t, ent].filter(Boolean).join(" - ")}</p>
      <p style="margin:6px 0 0 0;font-size:11px;color:#999999;">${[telHtml, mailHtml, siteHtml].filter(Boolean).join(" | ")}</p>
      ${socialLine}
    </td>
  </tr>
</table>`;
    }
  }, [nom, titre, entreprise, telephone, email, site, linkedin, twitter, template, couleur]);

  const plainText = useMemo(
    () =>
      [
        nom,
        [titre, entreprise].filter(Boolean).join(" - "),
        telephone ? `Tél. : ${telephone}` : "",
        email,
        safeWebUrl(site),
        safeWebUrl(linkedin),
        safeWebUrl(twitter),
      ]
        .filter(Boolean)
        .join("\n"),
    [nom, titre, entreprise, telephone, email, site, linkedin, twitter]
  );

  const flash = (kind: "rich" | "html") => {
    setCopyError("");
    setCopied(kind);
    setTimeout(() => setCopied(""), 2000);
  };

  /** Copie la signature « mise en forme » (text/html) : à coller directement dans Gmail, Outlook, Apple Mail. */
  const handleCopyRich = async () => {
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([signatureHTML], { type: "text/html" }),
            "text/plain": new Blob([plainText], { type: "text/plain" }),
          }),
        ]);
        flash("rich");
        return;
      }
    } catch {
      // on tente la méthode de secours ci-dessous
    }
    try {
      const container = document.createElement("div");
      container.innerHTML = signatureHTML;
      container.style.position = "fixed";
      container.style.left = "-9999px";
      document.body.appendChild(container);
      const range = document.createRange();
      range.selectNodeContents(container);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      const ok = document.execCommand("copy");
      sel?.removeAllRanges();
      document.body.removeChild(container);
      if (ok) flash("rich");
      else setCopyError("Copie impossible : sélectionnez l'aperçu à la souris puis faites Ctrl+C (Cmd+C sur Mac).");
    } catch {
      setCopyError("Copie impossible : sélectionnez l'aperçu à la souris puis faites Ctrl+C (Cmd+C sur Mac).");
    }
  };

  /** Copie le code source HTML (pour les clients qui acceptent un fichier ou un champ HTML). */
  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(signatureHTML);
      flash("html");
    } catch {
      setCopyError("Copie impossible : sélectionnez le code ci-dessous puis faites Ctrl+C (Cmd+C sur Mac).");
    }
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Business</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Générateur de <span style={{ color: "var(--primary)" }}>signature email</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Créez une signature email HTML professionnelle. Copiez-la et collez-la dans votre client email.
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
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Téléphone</label>
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Aperçu</h2>
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleCopyRich}
                    className="rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all"
                    style={{ background: copied === "rich" ? "#16a34a" : "var(--primary)" }}>
                    {copied === "rich" ? "Copiée !" : "Copier la signature"}
                  </button>
                  <button onClick={handleCopyHtml}
                    className="rounded-full border px-4 py-1.5 text-xs font-semibold transition-all"
                    style={{ borderColor: copied === "html" ? "#16a34a" : "var(--border)", color: copied === "html" ? "#16a34a" : "var(--foreground)" }}>
                    {copied === "html" ? "Code copié !" : "Copier le code HTML"}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                « Copier la signature » copie le rendu mis en forme, à coller directement dans Gmail, Outlook ou Apple Mail.
                « Copier le code HTML » copie le code source, pour les outils qui acceptent du HTML brut.
              </p>
              {copyError && (
                <p className="mt-2 text-xs" style={{ color: "#dc2626" }}>{copyError}</p>
              )}
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

            <ToolHowToSection
              title="Comment installer votre signature dans votre client mail"
              description="La méthode varie selon le client mail. Le HTML généré, à base de tableaux et de styles en ligne, est conçu pour Gmail, Outlook (bureau et web), Apple Mail et Thunderbird ; testez toujours le rendu chez vous."
              steps={[
                {
                  name: "Personnaliser et copier la signature",
                  text:
                    "Remplissez nom, titre, entreprise, contacts et réseaux sociaux. Choisissez un modèle (classique, moderne, minimal) et une couleur de marque. Cliquez sur « Copier la signature » : le rendu mis en forme est placé dans votre presse-papiers.",
                },
                {
                  name: "Coller dans Gmail",
                  text:
                    "Allez dans Paramètres (roue dentée) > « Voir tous les paramètres » > onglet « Général » > section « Signature ». Cliquez sur « Créer », puis collez avec Ctrl+V (Cmd+V sur Mac) la signature copiée via « Copier la signature ». Ne collez pas le code HTML brut : Gmail l'afficherait tel quel. Enregistrez en bas de page.",
                },
                {
                  name: "Coller dans Outlook (bureau)",
                  text:
                    "Fichier > Options > Courrier > Signatures. Cliquez sur « Nouveau », puis collez dans la zone d'édition la signature copiée via « Copier la signature » (rendu mis en forme). Choisissez ensuite la signature par défaut pour « Nouveaux messages » et « Réponses/transferts ».",
                },
                {
                  name: "Tester avant déploiement",
                  text:
                    "Envoyez un email test à vous-même et vérifiez le rendu sur mobile (Android et iOS) et sur ordinateur. Certains clients (Outlook bureau) gèrent mal les coins arrondis : si le rendu est cassé, choisissez le modèle Classique, le plus compatible.",
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
                Conseils pour une signature efficace
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Aller à l&apos;essentiel
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une signature efficace comporte 4 à 6 lignes maximum : nom, fonction + entreprise,
                    contact direct, lien web. Plus elle est longue, moins elle est lue. Évitez les
                    citations et les avertissements à rallonge, sauf obligation légale.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Conformité RGPD et mentions légales
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour une société, il est recommandé d&apos;indiquer la dénomination, la forme juridique,
                    le capital social et le numéro RCS, mentions exigées sur les documents commerciaux
                    (art. R123-237 et R123-238 du Code de commerce). Une mention de consentement
                    marketing placée dans une signature ne vaut pas consentement au sens du RGPD.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Couleur de marque cohérente
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Reprenez la couleur principale de votre charte graphique (vert pour
                    l&apos;écologie, bleu pour la finance, etc.). Une couleur unique est plus pro
                    qu&apos;un arc-en-ciel. Le contraste doit rester suffisant pour la lisibilité.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Ne pas inclure d&apos;image distante
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Beaucoup de clients mail bloquent par défaut les images distantes (anti-pistage
                    et anti-hameçonnage). Privilégiez le texte stylisé pour les coordonnées plutôt que
                    des images. Le HTML généré ici est uniquement textuel, donc toujours visible.
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
                À savoir avant de déployer une signature HTML
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Pourquoi des &lt;table&gt; et pas du CSS Flex ?</strong> Les clients mail
                  (Outlook surtout) ont un support CSS limité. La méthode la plus fiable reste la
                  mise en page par tableaux avec des styles en ligne. Le HTML généré ici suit cette
                  règle pour une compatibilité maximale.
                </p>
                <p>
                  <strong>Tailles d&apos;écran et responsive.</strong> Une signature compacte
                  s&apos;affiche bien sur mobile sans modification. Si vous personnalisez le HTML,
                  testez sur un smartphone avant déploiement : une part importante des emails est
                  aujourd&apos;hui ouverte sur mobile.
                </p>
                <p>
                  <strong>Cas particulier des réponses.</strong> Beaucoup de clients mail ajoutent
                  votre signature au-dessus de l&apos;email cité. Pour les réponses internes courtes,
                  envisagez une « signature courte » (prénom + titre) en plus de la signature
                  complète pour les emails initiaux.
                </p>
                <p>
                  <strong>Centralisation pour les équipes.</strong> Pour déployer une signature
                  homogène dans toute une entreprise, utilisez les outils de votre fournisseur de
                  messagerie (règles de signature dans la console d&apos;administration Google Workspace
                  ou Microsoft 365). Cela garantit la cohérence et facilite la maintenance.
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus fréquentes sur la signature email professionnelle."
              items={[
                {
                  question: "Le HTML généré fonctionne-t-il dans Outlook ?",
                  answer:
                    "Les 3 modèles utilisent des tableaux et des styles en ligne, la technique la plus compatible avec Outlook (bureau, Microsoft 365 et web). Outlook bureau ignore toutefois les coins arrondis : le modèle « Classique » est le plus sûr. Faites toujours un envoi test.",
                },
                {
                  question: "Puis-je ajouter mon logo à la signature ?",
                  answer:
                    "Pas directement avec ce générateur. Pour ajouter un logo, hébergez-le sur un domaine accessible (votre site web par exemple), puis ajoutez une balise <img src=\"URL\" alt=\"logo\"> dans le HTML généré. Beaucoup de clients mail bloquent par défaut les images distantes : un logo peut donc être invisible chez le destinataire.",
                },
                {
                  question: "Comment faire une signature pour mobile ?",
                  answer:
                    "Les applications mail mobiles gèrent surtout des signatures en texte simple. Sur iPhone : Réglages > Apps > Mail > Signature (ou Réglages > Mail > Signature selon la version d'iOS). Les signatures configurées dans Gmail ou Outlook sur ordinateur ne sont pas toujours reprises par les applis mobiles : vérifiez les réglages de chaque appli.",
                },
                {
                  question: "Quelle taille de police choisir ?",
                  answer:
                    "Le HTML généré utilise 13 px en taille de base et 18 px pour le nom. C'est un bon équilibre entre lisibilité et sobriété. Évitez de descendre sous 11 px (difficile à lire) et de dépasser 16 px en taille de base.",
                },
                {
                  question: "Puis-je inclure un lien de prise de rendez-vous Calendly ?",
                  answer:
                    "Oui. Dans le champ « Site web », indiquez directement votre lien de prise de rendez-vous (par exemple https://calendly.com/votre-nom). Vos interlocuteurs réservent un créneau en un clic, sans aller-retour par email.",
                },
                {
                  question: "Mes données sont-elles confidentielles ?",
                  answer:
                    "Oui. Le HTML est généré localement dans votre navigateur : les informations saisies (nom, email, entreprise) ne sont ni envoyées à un serveur ni stockées. Comme le reste du site, cette page utilise Google Analytics (mesure d'audience) et Google AdSense, qui ne reçoivent pas le contenu de vos champs. Vous pouvez générer autant de signatures que nécessaire, sans inscription.",
                },
                {
                  question: "Pourquoi mon Outlook affiche-t-il un rendu cassé ?",
                  answer:
                    "Outlook bureau (notamment 2016, 2019, 2021) utilise le moteur de rendu de Word, qui ignore certains styles CSS, dont les bordures arrondies. Si le modèle Moderne (qui utilise border-radius) s'affiche mal, basculez sur Classique.",
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
