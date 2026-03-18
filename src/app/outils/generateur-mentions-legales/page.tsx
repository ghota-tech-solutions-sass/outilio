"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";

export default function GenerateurMentionsLegales() {
  const [form, setForm] = useState({
    siteUrl: "",
    siteName: "",
    type: "individual" as "individual" | "company",
    name: "",
    company: "",
    siret: "",
    address: "",
    phone: "",
    email: "",
    host: "",
    hostAddress: "",
    collectsData: true,
  });
  const [copied, setCopied] = useState(false);

  const update = (key: string, value: string | boolean) => setForm({ ...form, [key]: value });

  const text = generateMentions(form);

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
            Generateur de <span style={{ color: "var(--primary)" }}>mentions legales</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Creez des mentions legales conformes a la loi francaise et au RGPD pour votre site.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations du site</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input label="Nom du site" value={form.siteName} onChange={(v) => update("siteName", v)} />
                <Input label="URL du site" value={form.siteUrl} onChange={(v) => update("siteUrl", v)} placeholder="https://" />
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Editeur du site</h2>
              <div className="mt-4 flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                <button onClick={() => update("type", "individual")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{ background: form.type === "individual" ? "var(--primary)" : "transparent", color: form.type === "individual" ? "white" : "var(--muted)" }}>
                  Particulier
                </button>
                <button onClick={() => update("type", "company")}
                  className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                  style={{ background: form.type === "company" ? "var(--primary)" : "transparent", color: form.type === "company" ? "white" : "var(--muted)" }}>
                  Entreprise
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input label="Nom complet" value={form.name} onChange={(v) => update("name", v)} />
                {form.type === "company" && <Input label="Raison sociale" value={form.company} onChange={(v) => update("company", v)} />}
                {form.type === "company" && <Input label="SIRET" value={form.siret} onChange={(v) => update("siret", v)} />}
                <Input label="Adresse" value={form.address} onChange={(v) => update("address", v)} className="col-span-2" />
                <Input label="Telephone" value={form.phone} onChange={(v) => update("phone", v)} />
                <Input label="Email" value={form.email} onChange={(v) => update("email", v)} />
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Hebergeur</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Input label="Nom de l'hebergeur" value={form.host} onChange={(v) => update("host", v)} placeholder="Ex: OVH, Vercel..." />
                <Input label="Adresse de l'hebergeur" value={form.hostAddress} onChange={(v) => update("hostAddress", v)} />
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Mentions legales generees</h2>
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

function generateMentions(f: Record<string, unknown>): string {
  const name = (f.name as string) || "[Votre nom]";
  const company = (f.company as string) || "[Raison sociale]";
  const siret = (f.siret as string) || "[Numero SIRET]";
  const address = (f.address as string) || "[Votre adresse]";
  const phone = (f.phone as string) || "[Votre telephone]";
  const email = (f.email as string) || "[Votre email]";
  const siteName = (f.siteName as string) || "[Nom du site]";
  const siteUrl = (f.siteUrl as string) || "[URL du site]";
  const host = (f.host as string) || "[Nom de l'hebergeur]";
  const hostAddress = (f.hostAddress as string) || "[Adresse de l'hebergeur]";
  const isCompany = f.type === "company";

  return `MENTIONS LEGALES

Conformement aux dispositions des articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'economie numerique, il est porte a la connaissance des utilisateurs et visiteurs du site ${siteName} (${siteUrl}) les presentes mentions legales.

1. EDITEUR DU SITE

${isCompany ? `Raison sociale : ${company}
SIRET : ${siret}
Representant legal : ${name}` : `Editeur : ${name}`}
Adresse : ${address}
Telephone : ${phone}
Email : ${email}

2. HEBERGEUR

Le site ${siteName} est heberge par :
${host}
Adresse : ${hostAddress}

3. PROPRIETE INTELLECTUELLE

L'ensemble du contenu de ce site (textes, images, videos) est protege par le droit d'auteur. Toute reproduction, meme partielle, est interdite sans autorisation prealable.

4. DONNEES PERSONNELLES (RGPD)

Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes, vous disposez d'un droit d'acces, de rectification, de suppression et de portabilite de vos donnees personnelles.

Pour exercer ces droits, contactez : ${email}

5. COOKIES

Ce site peut utiliser des cookies pour ameliorer l'experience utilisateur et a des fins statistiques. Vous pouvez a tout moment desactiver les cookies dans les parametres de votre navigateur.

6. LIMITATION DE RESPONSABILITE

Les informations fournies sur ce site le sont a titre indicatif. L'editeur ne saurait etre tenu responsable des erreurs, d'une absence de disponibilite des informations ou de la presence de virus sur le site.

Derniere mise a jour : ${new Date().toLocaleDateString("fr-FR")}`;
}
