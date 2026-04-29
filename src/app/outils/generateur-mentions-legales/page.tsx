"use client";

import { useState } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

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

            <ToolHowToSection
              title="Comment generer vos mentions legales conformes LCEN"
              description="Le generateur structure votre texte selon les articles 6-III et 19 de la loi LCEN du 21 juin 2004, plus une clause RGPD prete a publier."
              steps={[
                {
                  name: "Renseigner l&apos;identite de l&apos;editeur",
                  text:
                    "Indiquez votre statut (particulier ou entreprise). En entreprise : raison sociale, SIRET, adresse du siege social, representant legal, telephone et email. En particulier pour un site non commercial : nom, prenom et email suffisent ; vous pouvez masquer votre adresse postale en cas de blog perso (article 6-III-2 LCEN).",
                },
                {
                  name: "Ajouter les coordonnees de l&apos;hebergeur",
                  text:
                    "Nom et adresse complete de votre hebergeur (OVH, Vercel, Netlify, AWS, Scaleway, Hostinger...). Cette mention est obligatoire meme pour un site personnel. L&apos;information se trouve dans le contrat d&apos;hebergement ou sur le site de l&apos;hebergeur, rubrique &quot;Mentions legales&quot; ou &quot;Contact&quot;.",
                },
                {
                  name: "Copier-coller dans une page dediee /mentions-legales",
                  text:
                    "Cliquez sur Copier puis collez dans une page accessible depuis le footer de votre site, sous le libelle &quot;Mentions legales&quot;. Cette page doit etre directement accessible (1 clic depuis n&apos;importe quelle page), conformement a l&apos;article 6-III-1 LCEN. Mettez a jour le texte des qu&apos;un element change (changement d&apos;hebergeur, demenagement).",
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
                Cas d&apos;usage du generateur de mentions legales
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Site vitrine TPE / EURL / SASU
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Indispensable des qu&apos;une activite professionnelle est presentee : le SIRET et le representant legal sont
                    obligatoires. Ne negligez pas le numero de TVA intracommunautaire si vous etes assujetti, ainsi que le numero
                    RCS si applicable.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Boutique e-commerce
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Les mentions LCEN sont la base, mais une boutique en ligne doit y ajouter : CGV obligatoires (art. L221-1 a
                    L221-29 Code de la consommation), politique de retours, conditions de livraison. Generez les mentions ici puis
                    completez-les avec un avocat ou un modele LegalPlace.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Blog perso ou portfolio
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Meme un site non commercial doit afficher des mentions legales (art. 6-III LCEN). Vous pouvez choisir
                    l&apos;option Particulier et masquer votre adresse personnelle en deposant ces informations chez l&apos;hebergeur
                    (qui les communiquera sur requisition judiciaire). C&apos;est l&apos;option pseudonymat legal.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Application SaaS B2B
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Les mentions doivent indiquer l&apos;editeur (votre societe) et l&apos;hebergeur du SaaS (qui peut etre AWS,
                    Cloudflare, Render). Couplez avec une politique de confidentialite RGPD detaillee, un DPA si vous traitez
                    des donnees pour le compte de vos clients (sous-traitance article 28 RGPD), et un registre des traitements.
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
                Conformite legale : ce qu&apos;il faut savoir
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>LCEN article 6 : la base legale.</strong> La Loi pour la Confiance dans l&apos;Economie Numerique
                  (n&deg;2004-575 du 21 juin 2004) impose a tout editeur de site web professionnel d&apos;afficher des mentions legales
                  accessibles. L&apos;article 6-III liste les informations obligatoires : identification de l&apos;editeur, du
                  directeur de publication, et de l&apos;hebergeur. L&apos;absence de mentions legales est sanctionnee par une
                  amende pouvant atteindre 75 000 EUR (personnes physiques) ou 375 000 EUR (personnes morales).
                </p>
                <p>
                  <strong>Site perso vs pro : l&apos;exception du pseudonymat.</strong> Un particulier qui edite un site non
                  commercial peut s&apos;identifier sous pseudonyme dans les mentions, a condition d&apos;avoir communique son
                  identite reelle a l&apos;hebergeur. C&apos;est l&apos;article 6-III-2 LCEN. Cette exception ne s&apos;applique pas des
                  qu&apos;il y a une activite commerciale (vente, affiliation, sponsoring), meme occasionnelle.
                </p>
                <p>
                  <strong>RGPD vs CNIL : ce ne sont pas des mentions legales.</strong> Les mentions legales (LCEN) et la
                  politique de confidentialite (RGPD) sont deux documents distincts. Les mentions legales identifient
                  l&apos;editeur. La politique de confidentialite explique quelles donnees personnelles sont collectees, pourquoi,
                  combien de temps elles sont conservees, et comment exercer ses droits. Les deux sont obligatoires des qu&apos;un
                  site collecte la moindre donnee (formulaire de contact, cookies analytics).
                </p>
                <p>
                  <strong>Mentions obligatoires recapitulatif.</strong> Editeur (nom, adresse, SIRET pour entreprise),
                  directeur de publication (par defaut le representant legal), email de contact, hebergeur (nom et adresse
                  complete), numero RCS et TVA intracommunautaire si applicable, capital social pour les societes,
                  coordonnees de la CNIL si traitement de donnees personnelles. Le generateur produit un texte qui couvre
                  tous ces points pour les cas standards. Pour une activite reglementee (sante, finance, droit), faites
                  valider par un avocat specialise.
                </p>
              </div>
            </section>

            <ToolFaqSection
              intro="Les questions les plus posees sur les mentions legales obligatoires."
              items={[
                {
                  question: "Les mentions legales sont-elles obligatoires en France ?",
                  answer:
                    "Oui pour tout site web edite depuis la France ou destine au public francais. La LCEN du 21 juin 2004 (article 6-III) le rend obligatoire pour les sites pro et perso. Sanction maximale : 75 000 EUR pour une personne physique, 375 000 EUR pour une personne morale, plus 1 an de prison en cas de defaut volontaire d&apos;identification.",
                },
                {
                  question: "Que doit contenir une page de mentions legales ?",
                  answer:
                    "Identite de l&apos;editeur (nom, adresse, SIRET pour les entreprises), directeur de publication, coordonnees de contact (email obligatoire), informations de l&apos;hebergeur (nom et adresse complete), numero RCS et TVA si applicable, capital social pour les societes, clause de propriete intellectuelle, et la mention RGPD avec les modalites d&apos;exercice des droits.",
                },
                {
                  question: "Quelle difference entre mentions legales et politique de confidentialite ?",
                  answer:
                    "Les mentions legales (LCEN) identifient l&apos;editeur du site et l&apos;hebergeur. La politique de confidentialite (RGPD) explique quelles donnees personnelles sont collectees, pourquoi, comment, combien de temps, et comment exercer ses droits. Les deux sont obligatoires et complementaires des qu&apos;un site collecte la moindre donnee personnelle.",
                },
                {
                  question: "Le texte genere est-il suffisant pour la conformite ?",
                  answer:
                    "Pour un site vitrine ou un blog standard, oui. Pour une activite reglementee (sante, finance, droit, e-commerce avec collecte de donnees sensibles), le generateur fournit une base solide mais des clauses sectorielles supplementaires sont necessaires. Faites valider par un avocat ou utilisez un service comme LegalPlace pour les cas complexes.",
                },
                {
                  question: "Particulier : dois-je afficher mon adresse personnelle ?",
                  answer:
                    "Non, pas obligatoirement. L&apos;article 6-III-2 LCEN permet a un particulier editant un site non commercial de masquer son adresse en deposant son identite et ses coordonnees chez son hebergeur. Vous mentionnez alors uniquement votre nom (ou pseudonyme), votre email et les coordonnees de l&apos;hebergeur. Cette exception tombe des qu&apos;une activite commerciale apparait.",
                },
                {
                  question: "Faut-il un directeur de publication distinct ?",
                  answer:
                    "Pour une entreprise, le representant legal est par defaut le directeur de publication (gerant de SARL/EURL, president de SAS/SASU). Pour une association, c&apos;est le president. Pour un site perso, c&apos;est l&apos;editeur lui-meme. Une nomination distincte est obligatoire seulement pour les sites de presse en ligne (entreprises de presse au sens de la loi du 29 juillet 1881).",
                },
                {
                  question: "Mes informations sont-elles envoyees a un serveur ?",
                  answer:
                    "Non. Toute la generation se fait localement dans votre navigateur. Aucune information saisie (nom, SIRET, adresse, email) n&apos;est transmise, journalisee ou stockee. Vous pouvez fermer l&apos;onglet immediatement apres avoir copie le texte, sans laisser de trace cote serveur.",
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
