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

            <ToolHowToSection
              title="Comment installer votre signature dans votre client mail"
              description="La methode varie selon le client mail. Le HTML genere est compatible Gmail, Outlook desktop et web, Apple Mail, Thunderbird et la plupart des clients pro."
              steps={[
                {
                  name: "Personnaliser et copier le code",
                  text:
                    "Remplissez nom, titre, entreprise, contacts et reseaux sociaux. Choisissez un template (classique, moderne, minimal) et une couleur de marque. Cliquez sur 'Copier le HTML' : le code est immediatement dans votre presse-papier.",
                },
                {
                  name: "Coller dans Gmail",
                  text:
                    "Allez dans Parametres (engrenage) puis 'Voir tous les parametres' puis onglet 'General' puis section 'Signature'. Cliquez 'Creer une signature', puis collez en utilisant Ctrl+V. Gmail affichera automatiquement le rendu visuel. Sauvegardez en bas de page.",
                },
                {
                  name: "Coller dans Outlook (desktop)",
                  text:
                    "Fichier > Options > Courrier > Signatures. Cliquez 'Nouveau', collez le HTML dans la zone d'edition (mode visuel). Outlook 2016+ accepte directement le HTML colle. Configurez par defaut pour 'Nouveaux messages' et 'Reponses/transferts'.",
                },
                {
                  name: "Tester avant deploiement",
                  text:
                    "Envoyez un email test a vous-meme et verifiez le rendu sur mobile (smartphone Android ET iOS) et bureau. Certains clients (Outlook desktop) gerent mal les border-radius : si le rendu est cassé, choisissez le template Classique qui est le plus compatible.",
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
                    Aller a l&apos;essentiel
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Une signature efficace comporte 4 a 6 lignes maximum : nom, fonction + entreprise,
                    contact direct, lien web. Plus elle est longue, moins elle est lue. Evitez les
                    citations philosophiques et les disclaimers a rallonge sauf obligation legale.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Conformite RGPD et mentions legales
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Pour une signature B2B, ajoutez le numero RCS, la forme juridique et le capital
                    social si vous communiquez en tant qu&apos;entreprise. Evitez d&apos;y inclure
                    une mention de consentement marketing : c&apos;est inefficace juridiquement.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Couleur de marque coherente
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Reprenez la couleur principale de votre charte graphique (verte pour
                    l&apos;ecologie, bleue pour la finance, etc.). Une couleur unique est plus pro
                    qu&apos;un arc-en-ciel. Le contraste doit rester suffisant pour la lisibilite.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Ne pas inclure d&apos;image distante
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Beaucoup de clients mail bloquent par defaut les images distantes (anti-tracking
                    et anti-phishing). Privilegiez le texte stylise pour les coordonnees plutot que
                    des images. Le HTML genere ici est full-text, donc toujours visible.
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
                A savoir avant de deployer une signature HTML
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>Pourquoi des `&lt;table&gt;` et pas du CSS Flex ?</strong> Les clients mail
                  (Outlook surtout) ont un support CSS limite. La methode universelle reste le
                  layout par tables, qui rend de maniere identique partout depuis 30 ans. Le HTML
                  genere ici suit cette regle pour une compatibilite maximale.
                </p>
                <p>
                  <strong>Tailles d&apos;ecran et responsive.</strong> Une signature compacte
                  s&apos;affiche bien sur mobile sans modification. Si vous personnalisez le HTML,
                  testez sur un smartphone avant deploiement : 60 % des emails sont desormais
                  ouverts sur mobile (source : Litmus 2024).
                </p>
                <p>
                  <strong>Cas particulier des reponses.</strong> Beaucoup de clients mail collent
                  votre signature sous l&apos;email cite. Pour les reponses internes courtes,
                  envisagez une 'signature courte' (juste prenom + titre) en plus de la signature
                  complete pour les emails initiaux.
                </p>
                <p>
                  <strong>Centralisation pour les equipes.</strong> Pour deployer une signature
                  homogene a toute une entreprise, utilisez les outils du fournisseur (par exemple
                  la signature globale Gmail dans Google Workspace). Cela garantit la coherence et
                  facilite la maintenance.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus frequentes sur la signature email professionnelle."
              items={[
                {
                  question: "Le HTML genere fonctionne-t-il dans Outlook ?",
                  answer:
                    "Oui, les 3 templates sont compatibles Outlook 2016+, Outlook 365 et Outlook Web. Pour des versions tres anciennes (2007/2010), preferez le template 'Classique' qui utilise les balises les plus basiques.",
                },
                {
                  question: "Puis-je ajouter mon logo a la signature ?",
                  answer:
                    "Pas directement avec ce generateur. Pour ajouter un logo, hebergez-le sur un domaine accessible (Cloudinary, votre site web), puis ajoutez une balise <img src='URL' alt='logo'> dans le HTML genere. Beaucoup de clients mail bloquent par defaut les images distantes : un logo peut donc etre invisible chez le destinataire.",
                },
                {
                  question: "Comment faire une signature pour mobile uniquement ?",
                  answer:
                    "iPhone et Android permettent une signature simple texte par compte. Copiez les infos de votre signature complete (sans HTML), collez dans Reglages > Mail > Signature. Pour une signature HTML sur mobile, utilisez l'app native de Gmail ou Outlook qui supporte le HTML serveur.",
                },
                {
                  question: "Quelle taille de police choisir ?",
                  answer:
                    "Le HTML genere utilise 13 px en taille de base, 18 px pour le nom. C'est un bon equilibre lisibilite / sobriete. Evitez en dessous de 11 px (illisible) et au-dessus de 16 px en taille de base (l'aspect devient amateur).",
                },
                {
                  question: "Puis-je inclure un lien de prise de rendez-vous Calendly ?",
                  answer:
                    "Oui. Dans la URL du site web, mettez votre lien Calendly directement (https://calendly.com/votre-nom). C'est une excellente technique de conversion en B2B : 1 clic pour proposer un creneau, sans aller-retour mail.",
                },
                {
                  question: "Mes donnees sont-elles confidentielles ?",
                  answer:
                    "Oui, le HTML est genere localement dans votre navigateur. Aucune information saisie (nom, email, entreprise) n'est envoyee a un serveur ni stockee. Vous pouvez generer autant de signatures que necessaire, sans inscription.",
                },
                {
                  question: "Pourquoi mon Outlook affiche un rendu cassé ?",
                  answer:
                    "Outlook desktop (notamment Outlook 2016/2019/2021) utilise le moteur de rendu Word, qui ignore certains styles CSS. Les bordures arrondies ne sont pas supportees. Si le template Moderne (qui utilise border-radius) s'affiche mal, basculez sur Classique.",
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
