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
      { key: "recipientName", label: "Nom du destinataire", placeholder: "M. Dupont" },
      { key: "context", label: "Contexte de la relance", placeholder: "Notre echange du 15 mars concernant..." },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
    ],
    generate: (d) => ({
      subject: `Relance - ${d.context || "Notre echange precedent"}`,
      body: `Bonjour ${d.recipientName || "[Nom]"},

Je me permets de revenir vers vous concernant ${d.context || "[contexte]"}.

N'ayant pas eu de retour de votre part, je souhaitais savoir si vous aviez eu l'occasion d'examiner ma demande.

Je reste a votre entiere disposition pour tout complement d'information.

Dans l'attente de votre retour, je vous prie d'agreer, ${d.recipientName || "[Nom]"}, mes salutations distinguees.

Cordialement,
${d.senderName || "[Votre nom]"}`,
    }),
  },
  {
    key: "thankyou",
    label: "Remerciement",
    icon: "\u{1F64F}",
    fields: [
      { key: "recipientName", label: "Nom du destinataire", placeholder: "Mme Durand" },
      { key: "reason", label: "Raison du remerciement", placeholder: "notre entretien de ce matin" },
      { key: "detail", label: "Detail / suite a donner", placeholder: "Je confirme mon interet pour le poste..." },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
    ],
    generate: (d) => ({
      subject: `Remerciement - ${d.reason || "Notre echange"}`,
      body: `Bonjour ${d.recipientName || "[Nom]"},

Je tenais a vous remercier sincerement pour ${d.reason || "[raison]"}.

${d.detail || "Cet echange a ete tres enrichissant et je souhaitais vous en remercier."}

N'hesitez pas a me contacter si vous avez besoin de quoi que ce soit.

Bien cordialement,
${d.senderName || "[Votre nom]"}`,
    }),
  },
  {
    key: "cold",
    label: "Prise de contact",
    icon: "\u{1F4E7}",
    fields: [
      { key: "recipientName", label: "Nom du destinataire", placeholder: "M. Bernard" },
      { key: "company", label: "Entreprise du destinataire", placeholder: "Acme Corp" },
      { key: "proposal", label: "Votre proposition de valeur", placeholder: "une solution qui permet de reduire vos couts de 30%..." },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
      { key: "senderRole", label: "Votre poste", placeholder: "Directrice commerciale chez XYZ" },
    ],
    generate: (d) => ({
      subject: `${d.company || "[Entreprise]"} - Proposition de collaboration`,
      body: `Bonjour ${d.recipientName || "[Nom]"},

Je me permets de vous contacter car j'ai decouvert ${d.company || "[entreprise]"} et je suis convaincu(e) que nous pourrions collaborer de maniere fructueuse.

En tant que ${d.senderRole || "[poste]"}, je propose ${d.proposal || "[proposition de valeur]"}.

Seriez-vous disponible pour un echange de 15 minutes cette semaine ou la semaine prochaine ?

Au plaisir d'echanger avec vous.

Cordialement,
${d.senderName || "[Votre nom]"}
${d.senderRole || ""}`,
    }),
  },
  {
    key: "meeting",
    label: "Demande de reunion",
    icon: "\u{1F4C5}",
    fields: [
      { key: "recipientName", label: "Nom du destinataire", placeholder: "Equipe projet" },
      { key: "subject", label: "Sujet de la reunion", placeholder: "Point d'avancement du projet Alpha" },
      { key: "date", label: "Date / creneau propose", placeholder: "mardi 20 mars a 14h" },
      { key: "duration", label: "Duree estimee", placeholder: "30 minutes" },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
    ],
    generate: (d) => ({
      subject: `Reunion - ${d.subject || "[Sujet]"}`,
      body: `Bonjour ${d.recipientName || "[Nom / Equipe]"},

Je souhaiterais organiser une reunion pour discuter de ${d.subject || "[sujet]"}.

Creneau propose : ${d.date || "[date et heure]"}
Duree estimee : ${d.duration || "[duree]"}

Merci de me confirmer votre disponibilite ou de proposer un creneau alternatif.

L'ordre du jour et les documents preparatoires vous seront envoyes en amont.

Cordialement,
${d.senderName || "[Votre nom]"}`,
    }),
  },
  {
    key: "resignation",
    label: "Demission",
    icon: "\u{1F4DD}",
    fields: [
      { key: "recipientName", label: "Nom du destinataire (manager/RH)", placeholder: "M. le Directeur des Ressources Humaines" },
      { key: "position", label: "Votre poste actuel", placeholder: "Developpeur senior" },
      { key: "company", label: "Nom de l'entreprise", placeholder: "Acme Corp" },
      { key: "lastDay", label: "Date de fin souhaitee", placeholder: "30 avril 2025" },
      { key: "senderName", label: "Votre nom", placeholder: "Marie Martin" },
    ],
    generate: (d) => ({
      subject: "Lettre de demission",
      body: `${d.recipientName || "[Destinataire]"},

Par la presente, je vous informe de ma decision de demissionner de mon poste de ${d.position || "[poste]"} au sein de ${d.company || "[entreprise]"}.

Conformement aux dispositions de mon contrat de travail et de la convention collective applicable, je respecterai mon preavis. Ma date de depart souhaitee est le ${d.lastDay || "[date]"}.

Je tiens a vous remercier pour la confiance que vous m'avez accordee durant cette periode et pour les opportunites de developpement professionnel dont j'ai pu beneficier.

Je m'engage a assurer une transition fluide de mes responsabilites et a former mon successeur si necessaire.

Je vous prie d'agreer, ${d.recipientName || "[Destinataire]"}, l'expression de mes salutations distinguees.

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

  const copyToClipboard = () => {
    const fullEmail = `Objet : ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
            Generateur d{"'"}<span style={{ color: "var(--primary)" }}>email professionnel</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Choisissez un type d&apos;email, remplissez les details et obtenez un email professionnel pret a envoyer.
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
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Details</h2>
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
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Apercu</h2>
                <button onClick={copyToClipboard}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "var(--accent)" : "var(--primary)" }}>
                  {copied ? "Copie !" : "Copier l'email"}
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
                <p><strong className="text-[var(--foreground)]">Objet clair</strong> : L&apos;objet doit permettre au destinataire de comprendre immediatement le but de l&apos;email.</p>
                <p><strong className="text-[var(--foreground)]">Concision</strong> : Allez a l&apos;essentiel. Un email professionnel ne devrait pas depasser 5-6 phrases dans le corps du texte.</p>
                <p><strong className="text-[var(--foreground)]">Ton adapte</strong> : Ajustez la formalite selon le destinataire et le contexte. Nos modeles utilisent un registre soutenu que vous pouvez adapter.</p>
                <p><strong className="text-[var(--foreground)]">Relecture</strong> : Relisez toujours votre email avant envoi, personnalisez les elements entre crochets.</p>
              </div>
            </div>

            {/* SEO Content */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Comment utiliser le generateur d&apos;email professionnel
              </h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                <p>
                  Cet outil genere des emails professionnels prets a envoyer pour les situations courantes du monde du travail en France.
                  Choisissez un modele, personnalisez les champs et copiez le resultat.
                </p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><strong className="text-[var(--foreground)]">Selectionnez le type d&apos;email</strong> : relance, remerciement, prise de contact, demande de reunion ou demission</li>
                  <li><strong className="text-[var(--foreground)]">Remplissez les champs</strong> : nom du destinataire, contexte, votre nom et les details specifiques</li>
                  <li><strong className="text-[var(--foreground)]">Previsualisation instantanee</strong> : l&apos;email se genere en temps reel avec l&apos;objet et le corps du message</li>
                  <li><strong className="text-[var(--foreground)]">Copiez et personnalisez</strong> : adaptez le ton et les details avant l&apos;envoi</li>
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
              <div className="mt-6 space-y-5">
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Les emails generes respectent-ils les conventions francaises ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, les modeles utilisent les formules de politesse et les conventions epistolaires francaises : &laquo; salutations distinguees &raquo;, vouvoiement, formules de cloture formelles. Vous pouvez les adapter selon le contexte.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>La lettre de demission generee a-t-elle une valeur juridique ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le modele genere respecte les elements essentiels d&apos;une lettre de demission en droit du travail francais (intention claire, mention du preavis). Toutefois, il est recommande de verifier votre convention collective et de consulter un professionnel pour les cas complexes.</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Puis-je modifier les modeles apres generation ?</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Absolument. Les emails generes sont un point de depart. Copiez le texte, collez-le dans votre client email et personnalisez-le selon vos besoins. Il est toujours recommande de relire et d&apos;adapter le contenu avant l&apos;envoi.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <AdPlaceholder className="h-[250px]" />
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Bonnes pratiques</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <li>Personnalisez toujours le modele</li>
                <li>Verifiez l&apos;orthographe et la grammaire</li>
                <li>Envoyez aux heures de bureau</li>
                <li>Utilisez une signature professionnelle</li>
                <li>Relancez apres 3-5 jours ouvrables</li>
              </ul>
            </div>
            <AdPlaceholder className="h-[600px]" />
          </aside>
        </div>
      </div>
    </>
  );
}
