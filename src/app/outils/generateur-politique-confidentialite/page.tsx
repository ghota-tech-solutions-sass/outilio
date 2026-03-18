"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function GenerateurPolitiqueConfidentialite() {
  const [form, setForm] = useState({
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
    usesCookies: true,
    usesAnalytics: true,
    usesNewsletter: false,
    usesThirdParty: false,
    thirdPartyNames: "",
    retentionPeriod: "12",
    dpoName: "",
    dpoEmail: "",
  });
  const [copied, setCopied] = useState(false);

  const update = (key: string, value: string | boolean) => setForm({ ...form, [key]: value });

  const text = generatePolicy(form);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Legal</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Generateur de <span style={{ color: "var(--primary)" }}>politique de confidentialite</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Creez une politique de confidentialite conforme au RGPD pour votre site web.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Site Info */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations du site</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input label="Nom du site" value={form.siteName} onChange={(v) => update("siteName", v)} />
                <Input label="URL du site" value={form.siteUrl} onChange={(v) => update("siteUrl", v)} placeholder="https://" />
                <Input label="Societe / Editeur" value={form.company} onChange={(v) => update("company", v)} />
                <Input label="Email de contact" value={form.email} onChange={(v) => update("email", v)} />
                <Input label="Adresse" value={form.address} onChange={(v) => update("address", v)} className="col-span-2" />
              </div>
            </div>

            {/* Data Collected */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Donnees collectees</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Toggle label="Adresse email" checked={form.collectsEmail} onChange={(v) => update("collectsEmail", v)} />
                <Toggle label="Nom / Prenom" checked={form.collectsName} onChange={(v) => update("collectsName", v)} />
                <Toggle label="Telephone" checked={form.collectsPhone} onChange={(v) => update("collectsPhone", v)} />
                <Toggle label="Adresse postale" checked={form.collectsAddress} onChange={(v) => update("collectsAddress", v)} />
                <Toggle label="Donnees de paiement" checked={form.collectsPayment} onChange={(v) => update("collectsPayment", v)} />
              </div>
            </div>

            {/* Features */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Services utilises</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Toggle label="Cookies" checked={form.usesCookies} onChange={(v) => update("usesCookies", v)} />
                <Toggle label="Analytics (Google, Matomo...)" checked={form.usesAnalytics} onChange={(v) => update("usesAnalytics", v)} />
                <Toggle label="Newsletter" checked={form.usesNewsletter} onChange={(v) => update("usesNewsletter", v)} />
                <Toggle label="Services tiers" checked={form.usesThirdParty} onChange={(v) => update("usesThirdParty", v)} />
              </div>
              {form.usesThirdParty && (
                <div className="mt-3">
                  <Input label="Noms des services tiers" value={form.thirdPartyNames} onChange={(v) => update("thirdPartyNames", v)} placeholder="Ex: Stripe, Mailchimp, Google Maps..." />
                </div>
              )}
            </div>

            {/* DPO & Retention */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>DPO et conservation</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input label="Nom du DPO (optionnel)" value={form.dpoName} onChange={(v) => update("dpoName", v)} />
                <Input label="Email du DPO (optionnel)" value={form.dpoEmail} onChange={(v) => update("dpoEmail", v)} />
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Duree de conservation (mois)</label>
                  <input type="number" value={form.retentionPeriod} onChange={(e) => update("retentionPeriod", e.target.value)} min="1"
                    className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: "var(--border)" }} />
                </div>
              </div>
            </div>

            {/* Generated Text */}
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Politique generee</h2>
                <button onClick={copy}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: copied ? "var(--primary-light)" : "var(--primary)" }}>
                  {copied ? "Copie !" : "Copier"}
                </button>
              </div>
              <div className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl p-4 text-sm leading-relaxed"
                style={{ background: "var(--surface-alt)", color: "var(--muted)" }}>
                {text}
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

function generatePolicy(f: Record<string, unknown>): string {
  const siteName = (f.siteName as string) || "[Nom du site]";
  const siteUrl = (f.siteUrl as string) || "[URL du site]";
  const company = (f.company as string) || "[Nom de la societe]";
  const email = (f.email as string) || "[Email de contact]";
  const address = (f.address as string) || "[Adresse]";
  const retention = (f.retentionPeriod as string) || "12";
  const dpoName = (f.dpoName as string) || "";
  const dpoEmail = (f.dpoEmail as string) || email;

  const dataTypes: string[] = [];
  if (f.collectsName) dataTypes.push("Nom et prenom");
  if (f.collectsEmail) dataTypes.push("Adresse email");
  if (f.collectsPhone) dataTypes.push("Numero de telephone");
  if (f.collectsAddress) dataTypes.push("Adresse postale");
  if (f.collectsPayment) dataTypes.push("Donnees de paiement (traitees par un prestataire securise)");

  const dataList = dataTypes.length > 0 ? dataTypes.map((d) => `- ${d}`).join("\n") : "- Aucune donnee personnelle collectee";

  let cookieSection = "";
  if (f.usesCookies) {
    cookieSection = `\n5. COOKIES

Ce site utilise des cookies pour ameliorer votre experience de navigation. Les cookies sont de petits fichiers texte stockes sur votre appareil.

Types de cookies utilises :
- Cookies essentiels : necessaires au fonctionnement du site
- Cookies de performance : pour analyser l'utilisation du site${f.usesAnalytics ? "\n- Cookies analytiques : Google Analytics ou equivalent, pour des statistiques anonymisees" : ""}

Vous pouvez a tout moment desactiver les cookies dans les parametres de votre navigateur. La desactivation de certains cookies peut affecter votre experience sur le site.`;
  }

  let newsletterSection = "";
  if (f.usesNewsletter) {
    newsletterSection = `\n\n6. NEWSLETTER

Si vous vous inscrivez a notre newsletter, votre adresse email sera utilisee pour vous envoyer des communications. Vous pouvez vous desinscrire a tout moment en cliquant sur le lien de desinscription present dans chaque email.`;
  }

  let thirdPartySection = "";
  if (f.usesThirdParty) {
    const names = (f.thirdPartyNames as string) || "[Services tiers]";
    thirdPartySection = `\n\n${f.usesNewsletter ? "7" : "6"}. SERVICES TIERS

Nous utilisons les services tiers suivants : ${names}

Ces services peuvent collecter des donnees conformement a leurs propres politiques de confidentialite. Nous vous invitons a consulter leurs conditions respectives.`;
  }

  let dpoSection = "";
  if (dpoName) {
    dpoSection = `\n\nDelegue a la protection des donnees (DPO) :
Nom : ${dpoName}
Email : ${dpoEmail}`;
  }

  return `POLITIQUE DE CONFIDENTIALITE

Derniere mise a jour : ${new Date().toLocaleDateString("fr-FR")}

La presente politique de confidentialite decrit comment ${company} (ci-apres "${siteName}") collecte, utilise et protege vos donnees personnelles lorsque vous visitez ${siteUrl}, conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes.

1. RESPONSABLE DU TRAITEMENT

${company}
Adresse : ${address}
Email : ${email}${dpoSection}

2. DONNEES PERSONNELLES COLLECTEES

Nous collectons les donnees suivantes :
${dataList}

Ces donnees sont collectees lorsque vous :
- Remplissez un formulaire sur le site
- Creez un compte utilisateur
- Effectuez un achat
- Nous contactez directement

3. FINALITES DU TRAITEMENT

Vos donnees personnelles sont traitees pour les finalites suivantes :
- Gestion de la relation client
- Fourniture et amelioration de nos services
- Communication et reponse a vos demandes
${f.usesNewsletter ? "- Envoi de newsletters (avec votre consentement)\n" : ""}- Respect de nos obligations legales

La base juridique du traitement est :
- Votre consentement (article 6.1.a du RGPD)
- L'execution d'un contrat (article 6.1.b du RGPD)
- Le respect d'une obligation legale (article 6.1.c du RGPD)

4. DUREE DE CONSERVATION

Vos donnees personnelles sont conservees pendant une duree maximale de ${retention} mois a compter de votre derniere interaction avec ${siteName}, sauf obligation legale de conservation plus longue.${cookieSection}${newsletterSection}${thirdPartySection}

${!f.usesNewsletter && !f.usesThirdParty ? "6" : f.usesNewsletter && f.usesThirdParty ? "8" : "7"}. VOS DROITS

Conformement au RGPD, vous disposez des droits suivants :
- Droit d'acces : obtenir une copie de vos donnees
- Droit de rectification : corriger vos donnees inexactes
- Droit a l'effacement : demander la suppression de vos donnees
- Droit a la limitation : restreindre le traitement de vos donnees
- Droit a la portabilite : recevoir vos donnees dans un format structure
- Droit d'opposition : vous opposer au traitement de vos donnees

Pour exercer ces droits, contactez-nous a : ${email}

Vous disposez egalement du droit d'introduire une reclamation aupres de la CNIL (www.cnil.fr).

${!f.usesNewsletter && !f.usesThirdParty ? "7" : f.usesNewsletter && f.usesThirdParty ? "9" : "8"}. SECURITE

Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees pour proteger vos donnees personnelles contre tout acces non autorise, modification, divulgation ou destruction.

${!f.usesNewsletter && !f.usesThirdParty ? "8" : f.usesNewsletter && f.usesThirdParty ? "10" : "9"}. MODIFICATIONS

Nous nous reservons le droit de modifier cette politique de confidentialite a tout moment. Toute modification sera publiee sur cette page avec une date de mise a jour actualisee.

Pour toute question, contactez-nous a : ${email}`;
}
