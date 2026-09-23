"use client";

import { useState, useMemo } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

type EmailType = "followup" | "thankyou" | "cold" | "meeting" | "resignation";

interface EmailTemplate {
  key: EmailType;
  label: string;
  icon: string;
  fields: { key: string; label: string; placeholder: string; multiline?: boolean }[];
  generate: (data: Record<string, string>) => { subject: string; body: string };
}

const TEMPLATES: EmailTemplate[] = [
  {
    key: "followup",
    label: "Relance",
    icon: "\u{1F504}",
    fields: [
      { key: "recipientName", label: "Nom du destinataire", placeholder: "Monsieur Dupont" },
      { key: "context", label: "Contexte de la relance", placeholder: "notre échange du 15 septembre concernant le devis n° 42" },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
    ],
    generate: (d) => ({
      subject: `Relance - ${d.context || "Notre échange précédent"}`,
      body: `Bonjour ${d.recipientName || "[Nom]"},

Je me permets de revenir vers vous concernant ${d.context || "[contexte]"}.

N'ayant pas eu de retour de votre part, je souhaitais savoir si vous aviez eu l'occasion d'examiner ma demande.

Je reste à votre entière disposition pour tout complément d'information.

Dans l'attente de votre retour, je vous souhaite une excellente journée.

Cordialement,
${d.senderName || "[Votre nom]"}`,
    }),
  },
  {
    key: "thankyou",
    label: "Remerciement",
    icon: "\u{1F64F}",
    fields: [
      { key: "recipientName", label: "Nom du destinataire", placeholder: "Madame Durand" },
      { key: "reason", label: "Raison du remerciement", placeholder: "notre entretien de ce matin" },
      { key: "detail", label: "Détail / suite à donner", placeholder: "Je vous confirme mon intérêt pour le poste...", multiline: true },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
    ],
    generate: (d) => ({
      subject: `Remerciement - ${d.reason || "Notre échange"}`,
      body: `Bonjour ${d.recipientName || "[Nom]"},

Je tenais à vous remercier sincèrement pour ${d.reason || "[raison]"}.

${d.detail || "Cet échange a été très enrichissant."}

N'hésitez pas à me contacter si vous avez besoin de quoi que ce soit.

Bien cordialement,
${d.senderName || "[Votre nom]"}`,
    }),
  },
  {
    key: "cold",
    label: "Prise de contact",
    icon: "\u{1F4E7}",
    fields: [
      { key: "recipientName", label: "Nom du destinataire", placeholder: "Monsieur Bernard" },
      { key: "company", label: "Entreprise du destinataire", placeholder: "Acme Corp" },
      { key: "proposal", label: "Votre proposition de valeur", placeholder: "une solution qui permet de réduire vos coûts de 30 %...", multiline: true },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
      { key: "senderRole", label: "Votre poste", placeholder: "Directrice commerciale chez XYZ" },
    ],
    generate: (d) => ({
      subject: `${d.company || "[Entreprise]"} - Proposition de collaboration`,
      body: `Bonjour ${d.recipientName || "[Nom]"},

Je me permets de vous contacter car j'ai découvert ${d.company || "[entreprise]"} et je suis convaincu(e) que nous pourrions collaborer de manière fructueuse.

En tant que ${d.senderRole || "[poste]"}, je vous propose ${d.proposal || "[proposition de valeur]"}.

Seriez-vous disponible pour un échange de 15 minutes cette semaine ou la semaine prochaine ?

Au plaisir d'échanger avec vous.

Cordialement,
${d.senderName || "[Votre nom]"}${d.senderRole ? `\n${d.senderRole}` : ""}`,
    }),
  },
  {
    key: "meeting",
    label: "Demande de réunion",
    icon: "\u{1F4C5}",
    fields: [
      { key: "recipientName", label: "Nom du destinataire", placeholder: "l'équipe projet" },
      { key: "subject", label: "Sujet de la réunion", placeholder: "le point d'avancement du projet Alpha" },
      { key: "date", label: "Date / créneau proposé", placeholder: "mardi 6 octobre à 14 h" },
      { key: "duration", label: "Durée estimée", placeholder: "30 minutes" },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
    ],
    generate: (d) => ({
      subject: `Réunion - ${d.subject || "[Sujet]"}`,
      body: `Bonjour ${d.recipientName || "[Nom / Équipe]"},

Je souhaiterais organiser une réunion pour discuter de ${d.subject || "[sujet]"}.

Créneau proposé : ${d.date || "[date et heure]"}
Durée estimée : ${d.duration || "[durée]"}

Merci de me confirmer votre disponibilité ou de me proposer un autre créneau.

L'ordre du jour et les documents préparatoires vous seront envoyés en amont.

Cordialement,
${d.senderName || "[Votre nom]"}`,
    }),
  },
  {
    key: "resignation",
    label: "Démission",
    icon: "\u{1F4DD}",
    fields: [
      { key: "recipientName", label: "Formule d'appel (manager/RH)", placeholder: "Madame, Monsieur" },
      { key: "position", label: "Votre poste actuel", placeholder: "Développeur senior" },
      { key: "company", label: "Nom de l'entreprise", placeholder: "Acme Corp" },
      { key: "lastDay", label: "Date de fin souhaitée", placeholder: "30 novembre 2026" },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
    ],
    generate: (d) => ({
      subject: "Démission",
      body: `${d.recipientName || "Madame, Monsieur"},

Par la présente, je vous informe de ma décision de démissionner de mon poste de ${d.position || "[poste]"} au sein de ${d.company || "[entreprise]"}.

Conformément aux dispositions de mon contrat de travail et de la convention collective applicable, j'effectuerai mon préavis. Sauf accord de votre part pour en modifier la durée, la fin de mon contrat interviendra à l'issue de ce préavis ; je souhaiterais, si possible, que mon départ soit fixé au ${d.lastDay || "[date]"}.

Je tiens à vous remercier pour la confiance que vous m'avez accordée et pour les opportunités de développement professionnel dont j'ai pu bénéficier.

Je m'engage à assurer une transition fluide de mes dossiers.

Je vous prie d'agréer, ${d.recipientName || "Madame, Monsieur"}, l'expression de mes salutations distinguées.

${d.senderName || "[Votre nom]"}`,
    }),
  },
];

export default function GenerateurEmailProfessionnel() {
  const [selectedType, setSelectedType] = useState<EmailType>("followup");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const template = TEMPLATES.find((t) => t.key === selectedType)!;

  const email = useMemo(() => {
    return template.generate(formData);
  }, [template, formData]);

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = async () => {
    const fullEmail = `Objet : ${email.subject}\n\n${email.body}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copiez l'email ci-dessous :", fullEmail);
    }
  };

  const handleTypeChange = (type: EmailType) => {
    setSelectedType(type);
    setFormData({});
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Business</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Générateur d{"'"}<span style={{ color: "var(--primary)" }}>email professionnel</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Choisissez un type d&apos;email, remplissez les détails et obtenez un email professionnel prêt à envoyer.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Type selector */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Type d&apos;email</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {TEMPLATES.map((t) => (
                  <button key={t.key} onClick={() => handleTypeChange(t.key)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{
                      background: selectedType === t.key ? "var(--primary)" : "var(--surface-alt)",
                      color: selectedType === t.key ? "white" : "var(--muted)",
                    }}>
                    <span>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Détails</h2>
              <div className="mt-4 space-y-4">
                {template.fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{field.label}</label>
                    {field.multiline ? (
                      <textarea
                        value={formData[field.key] || ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="mt-2 w-full resize-none rounded-xl border px-4 py-3 text-sm"
                        style={{ borderColor: "var(--border)" }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.key] || ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="mt-2 w-full rounded-xl border px-4 py-3 text-sm"
                        style={{ borderColor: "var(--border)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Aperçu</h2>
                <button onClick={copyToClipboard}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                  {copied ? "Copié !" : "Copier l'email"}
                </button>
              </div>
              <div className="mt-4 rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  Objet : <span className="text-[var(--foreground)]">{email.subject}</span>
                </p>
                <hr className="my-3" style={{ borderColor: "var(--border)" }} />
                <pre className="whitespace-pre-wrap text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  {email.body}
                </pre>
              </div>
            </div>

            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Conseils pour un email professionnel efficace</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p><strong className="text-[var(--foreground)]">Objet clair</strong> : l&apos;objet doit permettre au destinataire de comprendre immédiatement le but de l&apos;email.</p>
                <p><strong className="text-[var(--foreground)]">Concision</strong> : allez à l&apos;essentiel. Un email professionnel ne devrait pas dépasser 5-6 phrases dans le corps du texte.</p>
                <p><strong className="text-[var(--foreground)]">Ton adapté</strong> : ajustez la formalité selon le destinataire et le contexte. Nos modèles utilisent un registre soutenu que vous pouvez adapter.</p>
                <p><strong className="text-[var(--foreground)]">Relecture</strong> : relisez toujours votre email avant envoi et personnalisez les éléments entre crochets.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le générateur d&apos;email professionnel
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Cet outil génère des emails professionnels prêts à envoyer pour les situations courantes du monde du travail en France.
                  Choisissez un modèle, personnalisez les champs et copiez le résultat.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Sélectionnez le type d&apos;email</strong> : relance, remerciement, prise de contact, demande de réunion ou démission</li>
                  <li><strong className="text-[var(--foreground)]">Remplissez les champs</strong> : nom du destinataire, contexte, votre nom et les détails spécifiques</li>
                  <li><strong className="text-[var(--foreground)]">Prévisualisation instantanée</strong> : l&apos;email se génère en temps réel avec l&apos;objet et le corps du message</li>
                  <li><strong className="text-[var(--foreground)]">Copiez et personnalisez</strong> : adaptez le ton et les détails avant l&apos;envoi</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Les emails générés respectent-ils les conventions françaises ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, les modèles utilisent les formules de politesse et les conventions épistolaires françaises : &laquo; salutations distinguées &raquo;, vouvoiement, formules de clôture formelles. Vous pouvez les adapter selon le contexte.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>La lettre de démission générée a-t-elle une valeur juridique ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le Code du travail n&apos;impose aucune forme particulière pour démissionner : la volonté de quitter l&apos;entreprise doit simplement être claire et non équivoque. Votre contrat ou votre convention collective peut toutefois prévoir une forme précise. Pour garder une preuve de la date (point de départ du préavis), envoyez plutôt la lettre en recommandé avec accusé de réception ou remettez-la en main propre contre décharge, plutôt que par simple email. Vérifiez la durée de préavis dans votre convention collective et faites-vous conseiller pour les cas particuliers (CDD, période d&apos;essai, rupture conventionnelle).</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Puis-je modifier les modèles après génération ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Absolument. Les emails générés sont un point de départ. Copiez le texte, collez-le dans votre client email et personnalisez-le selon vos besoins. Il est toujours recommandé de relire et d&apos;adapter le contenu avant l&apos;envoi. Le texte saisi reste dans votre navigateur : il n&apos;est envoyé à aucun serveur.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Bonnes pratiques</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Personnalisez toujours le modèle</li>
                <li>Vérifiez l&apos;orthographe et la grammaire</li>
                <li>Envoyez aux heures de bureau</li>
                <li>Utilisez une signature professionnelle</li>
                <li>Relancez après 3 à 5 jours ouvrés</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
