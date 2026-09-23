"use client";

import { useState, useSyncExternalStore } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

interface PolicyForm {
  siteName: string;
  siteUrl: string;
  company: string;
  email: string;
  address: string;
  collectsEmail: boolean;
  collectsName: boolean;
  collectsPhone: boolean;
  collectsAddress: boolean;
  collectsPayment: boolean;
  usesContactForm: boolean;
  usesAccounts: boolean;
  usesOrders: boolean;
  usesAnalytics: boolean;
  analyticsName: string;
  usesAds: boolean;
  usesNewsletter: boolean;
  usesThirdParty: boolean;
  thirdPartyNames: string;
  transfersOutsideEU: boolean;
  retentionPeriod: string;
  dpoName: string;
  dpoEmail: string;
}

export default function GenerateurPolitiqueConfidentialite() {
  const [form, setForm] = useState<PolicyForm>({
    siteName: "",
    siteUrl: "",
    company: "",
    email: "",
    address: "",
    collectsEmail: true,
    collectsName: true,
    collectsPhone: false,
    collectsAddress: false,
    collectsPayment: false,
    usesContactForm: true,
    usesAccounts: false,
    usesOrders: false,
    usesAnalytics: true,
    analyticsName: "Google Analytics",
    usesAds: false,
    usesNewsletter: false,
    usesThirdParty: false,
    thirdPartyNames: "",
    transfersOutsideEU: true,
    retentionPeriod: "36",
    dpoName: "",
    dpoEmail: "",
  });
  const [copied, setCopied] = useState(false);

  const update = <K extends keyof PolicyForm>(key: K, value: PolicyForm[K]) => setForm({ ...form, [key]: value });

  // Date calculée côté client uniquement (évite un écart avec le HTML statique généré au build).
  const today = useSyncExternalStore(
    () => () => {},
    () => new Date().toLocaleDateString("fr-FR"),
    () => "",
  );
  const text = generatePolicy(form, today);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé ou permission refusée)
    }
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Légal</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Générateur de <span style={{ color: "var(--primary)" }}>politique de confidentialité</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Créez une politique de confidentialité reprenant les informations exigées par l&apos;article 13 du RGPD et les règles de la CNIL sur les cookies.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Site Info */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Responsable du traitement</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Nom du site" value={form.siteName} onChange={(v) => update("siteName", v)} />
                <Input label="URL du site" value={form.siteUrl} onChange={(v) => update("siteUrl", v)} placeholder="https://" />
                <Input label="Société / Éditeur" value={form.company} onChange={(v) => update("company", v)} />
                <Input label="Email de contact" value={form.email} onChange={(v) => update("email", v)} />
                <Input label="Adresse" value={form.address} onChange={(v) => update("address", v)} className="sm:col-span-2" />
              </div>
            </div>

            {/* Data Collected */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Données collectées</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Toggle label="Adresse email" checked={form.collectsEmail} onChange={(v) => update("collectsEmail", v)} />
                <Toggle label="Nom / Prénom" checked={form.collectsName} onChange={(v) => update("collectsName", v)} />
                <Toggle label="Téléphone" checked={form.collectsPhone} onChange={(v) => update("collectsPhone", v)} />
                <Toggle label="Adresse postale" checked={form.collectsAddress} onChange={(v) => update("collectsAddress", v)} />
                <Toggle label="Données de paiement" checked={form.collectsPayment} onChange={(v) => update("collectsPayment", v)} />
              </div>
              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Collectées via</h3>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Toggle label="Formulaire de contact" checked={form.usesContactForm} onChange={(v) => update("usesContactForm", v)} />
                <Toggle label="Compte utilisateur" checked={form.usesAccounts} onChange={(v) => update("usesAccounts", v)} />
                <Toggle label="Commandes / achats" checked={form.usesOrders} onChange={(v) => update("usesOrders", v)} />
              </div>
            </div>

            {/* Features */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Services utilisés</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Toggle label="Mesure d'audience" checked={form.usesAnalytics} onChange={(v) => update("usesAnalytics", v)} />
                <Toggle label="Publicité (AdSense...)" checked={form.usesAds} onChange={(v) => update("usesAds", v)} />
                <Toggle label="Newsletter" checked={form.usesNewsletter} onChange={(v) => update("usesNewsletter", v)} />
                <Toggle label="Autres services tiers" checked={form.usesThirdParty} onChange={(v) => update("usesThirdParty", v)} />
                <Toggle label="Transferts hors Union européenne" checked={form.transfersOutsideEU} onChange={(v) => update("transfersOutsideEU", v)} />
              </div>
              {form.usesAnalytics && (
                <div className="mt-3">
                  <Input label="Outil de mesure d'audience" value={form.analyticsName} onChange={(v) => update("analyticsName", v)} placeholder="Ex : Google Analytics, Matomo..." />
                </div>
              )}
              {form.usesThirdParty && (
                <div className="mt-3">
                  <Input label="Noms des services tiers" value={form.thirdPartyNames} onChange={(v) => update("thirdPartyNames", v)} placeholder="Ex : Stripe, Brevo, Google Maps..." />
                </div>
              )}
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Google Analytics, AdSense et la plupart des outils américains impliquent un transfert de données hors UE : cochez « Transferts hors Union européenne » si vous les utilisez.
              </p>
            </div>

            {/* DPO & Retention */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>DPO et conservation</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Nom du DPO (optionnel)" value={form.dpoName} onChange={(v) => update("dpoName", v)} />
                <Input label="Email du DPO (optionnel)" value={form.dpoEmail} onChange={(v) => update("dpoEmail", v)} />
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Conservation des données de contact (mois)</label>
                  <input type="number" value={form.retentionPeriod} onChange={(e) => update("retentionPeriod", e.target.value)} min="1"
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    La CNIL retient 3 ans après le dernier contact pour les données de prospects.
                  </p>
                </div>
              </div>
            </div>

            {/* Generated Text */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Politique générée</h2>
                <button type="button" onClick={copy}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "var(--primary-light)" : "var(--primary)" }}>
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
              <div className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl p-4 text-sm leading-relaxed"
                style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>
                {text}
              </div>
              <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                Ce modèle couvre les traitements courants d&apos;un site vitrine ou d&apos;un blog. Adaptez-le à vos traitements réels ; il ne remplace ni un bandeau de consentement aux cookies conforme, ni un conseil juridique. Sources :{" "}
                <a href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3#Article13" target="_blank" rel="noopener noreferrer" className="underline">article 13 du RGPD (CNIL)</a>,{" "}
                <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi" target="_blank" rel="noopener noreferrer" className="underline">règles CNIL sur les cookies</a>.
              </p>
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

function Input({ label, value, onChange, placeholder, className }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5" style={{ background: "var(--surface-alt)" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded" style={{ accentColor: "var(--primary)" }} />
      <span className="text-sm">{label}</span>
    </label>
  );
}

function generatePolicy(f: PolicyForm, today: string): string {
  const or = (v: string, fallback: string) => v.trim() || fallback;
  const siteName = or(f.siteName, "[Nom du site]");
  const siteUrl = or(f.siteUrl, "[URL du site]");
  const company = or(f.company, "[Nom de la société ou de l'éditeur]");
  const email = or(f.email, "[Email de contact]");
  const address = or(f.address, "[Adresse]");
  const retention = parseInt(f.retentionPeriod, 10) > 0 ? parseInt(f.retentionPeriod, 10) : 36;
  const analyticsName = or(f.analyticsName, "[Outil de mesure d'audience]");

  const dataTypes: string[] = [];
  if (f.collectsName) dataTypes.push("Nom et prénom");
  if (f.collectsEmail) dataTypes.push("Adresse email");
  if (f.collectsPhone) dataTypes.push("Numéro de téléphone");
  if (f.collectsAddress) dataTypes.push("Adresse postale");
  if (f.collectsPayment) dataTypes.push("Données de paiement (traitées directement par notre prestataire de paiement ; nous ne conservons pas vos numéros de carte)");
  if (f.usesAnalytics || f.usesAds) dataTypes.push("Données de navigation (adresse IP, identifiants de cookies, pages consultées, type d'appareil)");
  const dataList = dataTypes.length > 0 ? dataTypes.map((d) => `- ${d}`).join("\n") : "- Aucune donnée personnelle n'est collectée directement";

  const sources: string[] = [];
  if (f.usesContactForm) sources.push("vous remplissez le formulaire de contact ou nous écrivez");
  if (f.usesAccounts) sources.push("vous créez un compte utilisateur");
  if (f.usesOrders) sources.push("vous passez une commande");
  if (f.usesNewsletter) sources.push("vous vous inscrivez à la newsletter");
  if (f.usesAnalytics || f.usesAds) sources.push("vous naviguez sur le site, via des cookies, si vous y avez consenti");

  // Finalités et bases légales (art. 13.1.c RGPD)
  const purposes: string[] = [];
  if (f.usesContactForm) purposes.push("- Répondre à vos demandes de contact : intérêt légitime à répondre aux sollicitations (art. 6.1.f du RGPD)");
  if (f.usesAccounts) purposes.push("- Créer et gérer votre compte : exécution du contrat ou des conditions d'utilisation (art. 6.1.b)");
  if (f.usesOrders) purposes.push("- Traiter vos commandes, paiements et livraisons : exécution du contrat (art. 6.1.b)\n- Tenir la comptabilité et conserver les factures : obligation légale (art. 6.1.c)");
  if (f.usesNewsletter) purposes.push("- Vous envoyer la newsletter : votre consentement (art. 6.1.a), que vous pouvez retirer à tout moment");
  if (f.usesAnalytics) purposes.push(`- Mesurer l'audience du site avec ${analyticsName} : votre consentement (art. 6.1.a et art. 82 de la loi Informatique et Libertés), sauf mesure d'audience exemptée de consentement au sens des lignes directrices de la CNIL`);
  if (f.usesAds) purposes.push("- Afficher des publicités, personnalisées ou non : votre consentement pour le dépôt des cookies publicitaires (art. 6.1.a)");
  purposes.push("- Assurer la sécurité du site et prévenir les abus : intérêt légitime (art. 6.1.f)");

  const recipients: string[] = ["- Les personnes habilitées de " + company];
  recipients.push("- Notre hébergeur, en qualité de sous-traitant");
  if (f.usesAnalytics) recipients.push(`- ${analyticsName} (mesure d'audience)`);
  if (f.usesAds) recipients.push("- Nos partenaires publicitaires (par exemple Google AdSense), pour les cookies publicitaires auxquels vous avez consenti");
  if (f.usesNewsletter) recipients.push("- Notre prestataire d'envoi d'emails");
  if (f.collectsPayment) recipients.push("- Notre prestataire de paiement");
  if (f.usesThirdParty) recipients.push(`- Les services tiers suivants : ${or(f.thirdPartyNames, "[Services tiers]")}`);

  const sections: { title: string; body: string }[] = [];

  sections.push({
    title: "RESPONSABLE DU TRAITEMENT",
    body: `${company}
Adresse : ${address}
Email : ${email}${f.dpoName.trim() ? `\n\nDélégué à la protection des données (DPO) : ${f.dpoName.trim()}\nEmail : ${or(f.dpoEmail, email)}` : ""}`,
  });

  sections.push({
    title: "DONNÉES PERSONNELLES COLLECTÉES",
    body: `Nous traitons les données suivantes :
${dataList}${sources.length > 0 ? `\n\nCes données sont collectées lorsque :\n${sources.map((s) => `- ${s}`).join("\n")}` : ""}

Les champs signalés comme obligatoires dans nos formulaires sont nécessaires pour traiter votre demande ; à défaut, nous ne pourrons pas y donner suite.`,
  });

  sections.push({
    title: "FINALITÉS ET BASES LÉGALES",
    body: `Vos données sont traitées pour les finalités suivantes, sur les bases légales indiquées :
${purposes.join("\n")}`,
  });

  sections.push({
    title: "DESTINATAIRES",
    body: `Vos données sont destinées à :
${recipients.join("\n")}

Nous ne vendons pas vos données personnelles.`,
  });

  if (f.transfersOutsideEU) {
    sections.push({
      title: "TRANSFERTS HORS DE L'UNION EUROPÉENNE",
      body: `Certains de nos prestataires peuvent traiter des données en dehors de l'Union européenne, notamment aux États-Unis. Ces transferts sont encadrés par une décision d'adéquation de la Commission européenne (par exemple le cadre de protection des données UE–États-Unis, pour les entreprises certifiées) ou, à défaut, par les clauses contractuelles types de la Commission européenne. Vous pouvez obtenir une copie de ces garanties en nous écrivant à ${email}.`,
    });
  }

  sections.push({
    title: "DURÉE DE CONSERVATION",
    body: `- Données de contact et de prospection : ${retention} mois à compter du dernier contact de votre part${f.usesAccounts ? "\n- Données de compte : pendant la durée d'utilisation du compte, puis suppression après une période d'inactivité" : ""}${f.usesOrders ? "\n- Données de commande et factures : 10 ans (obligation comptable, art. L123-22 du Code de commerce)" : ""}${f.usesNewsletter ? "\n- Newsletter : jusqu'à votre désinscription" : ""}${f.usesAnalytics || f.usesAds ? "\n- Cookies et traceurs soumis à consentement : 13 mois maximum ; votre choix (acceptation ou refus) est conservé pour une durée limitée avant de vous être redemandé" : ""}

Au-delà, les données sont supprimées ou anonymisées, sauf obligation légale de conservation plus longue.`,
  });

  if (f.usesAnalytics || f.usesAds) {
    sections.push({
      title: "COOKIES ET TRACEURS",
      body: `Un cookie est un petit fichier déposé sur votre terminal lors de la consultation du site.

- Cookies strictement nécessaires : indispensables au fonctionnement du site, ils ne nécessitent pas votre consentement.${f.usesAnalytics ? `\n- Cookies de mesure d'audience (${analyticsName}) : déposés uniquement avec votre consentement, sauf s'ils remplissent les conditions d'exemption fixées par la CNIL.` : ""}${f.usesAds ? "\n- Cookies publicitaires : déposés uniquement avec votre consentement." : ""}

Lors de votre première visite, un bandeau vous permet d'accepter ou de refuser ces cookies, avec la même simplicité. Vous pouvez modifier votre choix à tout moment via le lien de gestion des cookies présent sur le site, ainsi que dans les paramètres de votre navigateur.`,
    });
  }

  if (f.usesNewsletter) {
    sections.push({
      title: "NEWSLETTER",
      body: "Si vous vous inscrivez à notre newsletter, votre adresse email est utilisée pour vous envoyer nos communications. Vous pouvez vous désinscrire à tout moment grâce au lien présent dans chaque email.",
    });
  }

  if (f.usesThirdParty) {
    sections.push({
      title: "SERVICES TIERS",
      body: `Nous utilisons les services tiers suivants : ${or(f.thirdPartyNames, "[Services tiers]")}.

Lorsqu'ils agissent pour leur propre compte, ces services traitent les données conformément à leurs propres politiques de confidentialité, que nous vous invitons à consulter.`,
    });
  }

  sections.push({
    title: "VOS DROITS",
    body: `Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :
- Droit d'accès : obtenir une copie de vos données
- Droit de rectification : corriger vos données inexactes
- Droit à l'effacement : demander la suppression de vos données
- Droit à la limitation : restreindre le traitement de vos données
- Droit à la portabilité : recevoir vos données dans un format structuré
- Droit d'opposition : vous opposer au traitement fondé sur notre intérêt légitime, et à tout moment à la prospection
- Droit de retirer votre consentement à tout moment, sans remettre en cause la licéité du traitement effectué avant ce retrait
- Droit de définir des directives relatives au sort de vos données après votre décès (art. 85 de la loi Informatique et Libertés)

Pour exercer ces droits, contactez-nous à : ${or(f.dpoEmail, email)}. Nous répondons dans un délai d'un mois.

Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (www.cnil.fr).`,
  });

  sections.push({
    title: "SÉCURITÉ",
    body: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.",
  });

  sections.push({
    title: "MODIFICATIONS",
    body: `Nous pouvons modifier cette politique de confidentialité pour tenir compte de l'évolution de nos traitements ou de la réglementation. Toute modification est publiée sur cette page avec une date de mise à jour.

Pour toute question, contactez-nous à : ${email}`,
  });

  const numbered = sections.map((s, i) => `${i + 1}. ${s.title}\n\n${s.body}`).join("\n\n");

  return `POLITIQUE DE CONFIDENTIALITÉ

Dernière mise à jour : ${today || "[date]"}

La présente politique de confidentialité décrit comment ${company} collecte, utilise et protège vos données personnelles lorsque vous utilisez le site ${siteName} (${siteUrl}), conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés.

${numbered}`;
}
