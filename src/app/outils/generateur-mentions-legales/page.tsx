"use client";

import { useState, useSyncExternalStore } from "react";
import AdPlaceholder from "@/components/AdPlaceholder";
import ToolFaqSection from "@/components/ToolFaqSection";
import ToolHowToSection from "@/components/ToolHowToSection";

type EditorType = "individual" | "ei" | "company";

interface MentionsForm {
  siteUrl: string;
  siteName: string;
  type: EditorType;
  anonymous: boolean;
  name: string;
  company: string;
  legalForm: string;
  capital: string;
  siret: string;
  rcs: string;
  tvaIntra: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  host: string;
  hostAddress: string;
  hostPhone: string;
}

export default function GenerateurMentionsLegales() {
  const [form, setForm] = useState<MentionsForm>({
    siteUrl: "",
    siteName: "",
    type: "individual",
    anonymous: false,
    name: "",
    company: "",
    legalForm: "",
    capital: "",
    siret: "",
    rcs: "",
    tvaIntra: "",
    address: "",
    phone: "",
    email: "",
    director: "",
    host: "",
    hostAddress: "",
    hostPhone: "",
  });
  const [copied, setCopied] = useState(false);

  const update = <K extends keyof MentionsForm>(key: K, value: MentionsForm[K]) => setForm({ ...form, [key]: value });

  // Date calculée côté client uniquement (évite un écart avec le HTML statique généré au build).
  const today = useSyncExternalStore(
    () => () => {},
    () => new Date().toLocaleDateString("fr-FR"),
    () => "",
  );
  const text = generateMentions(form, today);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé ou permission refusée)
    }
  };

  const types: { id: EditorType; label: string }[] = [
    { id: "individual", label: "Particulier (non pro)" },
    { id: "ei", label: "Entrepreneur individuel" },
    { id: "company", label: "Société / association" },
  ];

  return (
    <>
      <section className="relative py-14" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Légal</p>
          <h1 className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Générateur de <span style={{ color: "var(--primary)" }}>mentions légales</span>
          </h1>
          <p className="animate-fade-up stagger-2 mt-3 max-w-xl text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Créez les mentions légales de votre site conformément à la loi pour la confiance dans l&apos;économie numérique (LCEN).
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Informations du site</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Nom du site" value={form.siteName} onChange={(v) => update("siteName", v)} />
                <Input label="URL du site" value={form.siteUrl} onChange={(v) => update("siteUrl", v)} placeholder="https://" />
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Éditeur du site</h2>
              <div className="mt-4 flex flex-wrap gap-1 rounded-xl p-1" style={{ background: "var(--surface-alt)" }}>
                {types.map((t) => (
                  <button key={t.id} type="button" onClick={() => update("type", t.id)}
                    className="flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all"
                    style={{ background: form.type === t.id ? "var(--primary)" : "transparent", color: form.type === t.id ? "white" : "var(--muted)" }}>
                    {t.label}
                  </button>
                ))}
              </div>

              {form.type === "individual" && (
                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-sm" style={{ background: "var(--surface-alt)" }}>
                  <input type="checkbox" checked={form.anonymous} onChange={(e) => update("anonymous", e.target.checked)}
                    className="mt-0.5 h-4 w-4" style={{ accentColor: "var(--primary)" }} />
                  <span>
                    Rester anonyme (site non professionnel) : seules les coordonnées de l&apos;hébergeur sont publiées. Vous devez avoir communiqué votre identité à votre hébergeur (art. 1-1 II LCEN).
                  </span>
                </label>
              )}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {form.type === "company" && <Input label="Dénomination sociale" value={form.company} onChange={(v) => update("company", v)} />}
                {form.type === "company" && <Input label="Forme juridique (SAS, SARL, association...)" value={form.legalForm} onChange={(v) => update("legalForm", v)} />}
                {form.type === "company" && <Input label="Capital social" value={form.capital} onChange={(v) => update("capital", v)} placeholder="Ex : 1 000 €" />}
                {!(form.type === "individual" && form.anonymous) && (
                  <Input label={form.type === "company" ? "Représentant légal" : "Nom et prénom"} value={form.name} onChange={(v) => update("name", v)} />
                )}
                {form.type !== "individual" && <Input label="SIREN / SIRET" value={form.siret} onChange={(v) => update("siret", v)} />}
                {form.type !== "individual" && <Input label="RCS / RM + ville (si immatriculé)" value={form.rcs} onChange={(v) => update("rcs", v)} placeholder="Ex : RCS Lyon 123 456 789" />}
                {form.type !== "individual" && <Input label="N° TVA intracommunautaire (si assujetti)" value={form.tvaIntra} onChange={(v) => update("tvaIntra", v)} />}
                {!(form.type === "individual" && form.anonymous) && (
                  <>
                    <Input label={form.type === "company" ? "Adresse du siège social" : "Adresse"} value={form.address} onChange={(v) => update("address", v)} className="sm:col-span-2" />
                    <Input label="Téléphone" value={form.phone} onChange={(v) => update("phone", v)} />
                    <Input label="Email" value={form.email} onChange={(v) => update("email", v)} />
                  </>
                )}
                {form.type !== "individual" && (
                  <Input label="Directeur de la publication" value={form.director} onChange={(v) => update("director", v)} placeholder="Par défaut : le représentant légal" className="sm:col-span-2" />
                )}
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Hébergeur</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Nom / dénomination de l'hébergeur" value={form.host} onChange={(v) => update("host", v)} placeholder="Ex : OVH SAS, Vercel Inc..." />
                <Input label="Téléphone de l'hébergeur" value={form.hostPhone} onChange={(v) => update("hostPhone", v)} />
                <Input label="Adresse de l'hébergeur" value={form.hostAddress} onChange={(v) => update("hostAddress", v)} className="sm:col-span-2" />
              </div>
            </div>

            <div className="rounded-2xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--accent)" }}>Mentions légales générées</h2>
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
                Les champs vides apparaissent entre crochets : complétez-les avant publication. Ce modèle couvre les cas courants et ne remplace pas un conseil juridique.
              </p>
            </div>

            <ToolHowToSection
              title="Comment générer vos mentions légales conformes à la LCEN"
              description="Le générateur structure votre texte selon les articles 1-1 et 19 de la loi n° 2004-575 du 21 juin 2004 (LCEN), dans leur rédaction issue de la loi SREN du 21 mai 2024."
              steps={[
                {
                  name: "Renseigner l'identité de l'éditeur",
                  text:
                    "Choisissez votre statut. Société : dénomination, forme juridique, capital, siège social, SIREN, RCS, téléphone, email et directeur de la publication. Entrepreneur individuel : nom, mention « EI », adresse, SIREN et RCS/RM le cas échéant. Particulier éditant un site non professionnel : vous pouvez rester anonyme si vous avez communiqué votre identité à votre hébergeur (article 1-1 II de la LCEN).",
                },
                {
                  name: "Ajouter les coordonnées de l'hébergeur",
                  text:
                    "Nom ou dénomination, adresse et numéro de téléphone de votre hébergeur (OVH, Vercel, Netlify, AWS, Scaleway, Hostinger...). Cette mention est obligatoire même pour un site personnel. L'information se trouve dans le contrat d'hébergement ou sur le site de l'hébergeur, rubrique « Mentions légales » ou « Contact ».",
                },
                {
                  name: "Copier-coller dans une page dédiée /mentions-legales",
                  text:
                    "Cliquez sur Copier puis collez le texte dans une page accessible depuis le pied de page de votre site, sous le libellé « Mentions légales ». Ces informations doivent être facilement et directement accessibles. Mettez le texte à jour dès qu'un élément change (changement d'hébergeur, déménagement).",
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
                Cas d&apos;usage du générateur de mentions légales
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Site vitrine TPE / EURL / SASU
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Dès qu&apos;une activité professionnelle est présentée : dénomination, forme juridique, capital, SIREN,
                    RCS, siège social et directeur de la publication. Ajoutez le numéro de TVA intracommunautaire si vous
                    êtes assujetti.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Boutique e-commerce
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Les mentions LCEN sont la base, mais une boutique en ligne doit aussi publier ses conditions générales
                    de vente et l&apos;information précontractuelle du Code de la consommation (prix, livraison, droit de
                    rétractation, médiateur de la consommation). Faites relire ces documents par un professionnel du droit.
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Blog perso ou portfolio
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Même un site non professionnel doit identifier son hébergeur. Avec l&apos;option « Particulier »,
                    vous pouvez rester anonyme à condition d&apos;avoir communiqué votre identité à l&apos;hébergeur,
                    qui peut la transmettre à l&apos;autorité judiciaire (art. 1-1 II LCEN).
                  </p>
                </div>
                <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                    Application SaaS B2B
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Les mentions indiquent l&apos;éditeur (votre société) et l&apos;hébergeur du service (AWS, Cloudflare,
                    Render...). Complétez avec une politique de confidentialité, un accord de sous-traitance (DPA, article
                    28 du RGPD) si vous traitez des données pour vos clients, et un registre des traitements.
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
                Conformité légale : ce qu&apos;il faut savoir
              </h2>

              <div className="mt-4 space-y-4 leading-relaxed" style={{ color: "var(--foreground)" }}>
                <p>
                  <strong>LCEN article 1-1 : la base légale.</strong> Depuis la loi SREN du 21 mai 2024, les obligations
                  d&apos;identification des éditeurs figurent à l&apos;article 1-1 de la loi n° 2004-575 du 21 juin 2004 (elles
                  étaient auparavant à l&apos;article 6-III). L&apos;éditeur doit mettre à disposition du public son identité, ses
                  coordonnées, le nom du directeur de la publication et l&apos;identité de l&apos;hébergeur. Le non-respect est puni
                  d&apos;un an d&apos;emprisonnement et de 75 000 € d&apos;amende (article 1-2), l&apos;amende pouvant atteindre 375 000 €
                  pour une personne morale.
                </p>
                <p>
                  <strong>Site perso vs pro : l&apos;exception de l&apos;anonymat.</strong> Une personne qui édite un site à titre
                  non professionnel peut ne publier que les coordonnées de son hébergeur, à condition de lui avoir communiqué
                  son identité (article 1-1 II). Cette exception ne s&apos;applique pas dès lors que le site relève d&apos;une
                  activité professionnelle (vente, prestations, revenus publicitaires ou d&apos;affiliation significatifs).
                </p>
                <p>
                  <strong>Mentions légales et RGPD : deux documents distincts.</strong> Les mentions légales identifient
                  l&apos;éditeur. La politique de confidentialité explique quelles données personnelles sont collectées, pourquoi,
                  combien de temps elles sont conservées et comment exercer ses droits (article 13 du RGPD). Dès qu&apos;un site
                  collecte des données (formulaire de contact, statistiques, publicité), il lui faut les deux, ainsi qu&apos;un
                  recueil du consentement pour les cookies non exemptés.
                </p>
                <p>
                  <strong>Récapitulatif.</strong> Éditeur (nom ou dénomination, adresse ou siège, téléphone, email, SIREN et
                  RCS/RM si immatriculé, capital social pour les sociétés, TVA intracommunautaire si assujetti), directeur de
                  la publication, hébergeur (nom, adresse, téléphone). Pour une activité réglementée, ajoutez l&apos;autorité
                  ayant délivré l&apos;autorisation et faites valider par un avocat.
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Sources :{" "}
                  <a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>loi n° 2004-575 (LCEN) sur Légifrance</a>,{" "}
                  <a href="https://entreprendre.service-public.gouv.fr/vosdroits/F31228" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>service-public (obligations d&apos;un site internet)</a>,{" "}
                  <a href="https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--primary)" }}>CNIL (cookies)</a>.
                </p>
              </div>
            </section>

            <ToolFaqSection
              title="Questions fréquentes"
              intro="Les questions les plus posées sur les mentions légales obligatoires."
              items={[
                {
                  question: "Les mentions légales sont-elles obligatoires en France ?",
                  answer:
                    "Oui, pour tout éditeur d'un service de communication au public en ligne (article 1-1 de la LCEN du 21 juin 2004, tel que modifié par la loi SREN de 2024). Un particulier éditant un site non professionnel peut toutefois rester anonyme en ne publiant que les coordonnées de son hébergeur. Sanction : un an d'emprisonnement et 75 000 € d'amende (375 000 € pour une personne morale).",
                },
                {
                  question: "Que doit contenir une page de mentions légales ?",
                  answer:
                    "Identité de l'éditeur (nom ou dénomination, adresse ou siège social, téléphone, email), SIREN et numéro RCS/RM si l'éditeur est immatriculé, forme juridique et capital social pour une société, numéro de TVA intracommunautaire si assujetti, nom du directeur de la publication, et nom, adresse et téléphone de l'hébergeur. Une clause de propriété intellectuelle et un renvoi vers la politique de confidentialité sont recommandés.",
                },
                {
                  question: "Quelle différence entre mentions légales et politique de confidentialité ?",
                  answer:
                    "Les mentions légales (LCEN) identifient l'éditeur du site et l'hébergeur. La politique de confidentialité (RGPD) explique quelles données personnelles sont collectées, pourquoi, sur quelle base légale, combien de temps, et comment exercer ses droits. Les deux sont complémentaires dès qu'un site traite des données personnelles.",
                },
                {
                  question: "Le texte généré est-il suffisant pour la conformité ?",
                  answer:
                    "Pour un site vitrine ou un blog standard, il couvre les mentions exigées par la LCEN. Pour une activité réglementée (santé, finance, droit), un site e-commerce ou une plateforme, des mentions supplémentaires sont nécessaires : faites valider le texte par un professionnel du droit.",
                },
                {
                  question: "Particulier : dois-je afficher mon adresse personnelle ?",
                  answer:
                    "Non. L'article 1-1 II de la LCEN permet à une personne éditant un site à titre non professionnel de ne publier que le nom, la dénomination ou la raison sociale et l'adresse de son hébergeur, à condition de lui avoir communiqué ses éléments d'identification. Cette exception ne vaut plus dès que le site relève d'une activité professionnelle.",
                },
                {
                  question: "Faut-il un directeur de la publication distinct ?",
                  answer:
                    "Pour une société, le directeur de la publication est en principe le représentant légal (gérant de SARL/EURL, président de SAS/SASU). Pour une association, c'est généralement le président. Pour un entrepreneur individuel, c'est l'éditeur lui-même. Le nom du directeur de la publication doit figurer dans les mentions légales des éditeurs professionnels.",
                },
                {
                  question: "Mes informations sont-elles envoyées à un serveur ?",
                  answer:
                    "Non. La génération se fait localement dans votre navigateur : le nom, le SIRET, l'adresse ou l'email saisis ne sont ni transmis ni stockés. Le site utilise par ailleurs des outils de mesure d'audience et de publicité, qui ne reçoivent pas le contenu du formulaire.",
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

function generateMentions(f: MentionsForm, today: string): string {
  const or = (v: string, fallback: string) => v.trim() || fallback;
  const name = or(f.name, f.type === "company" ? "[Nom du représentant légal]" : "[Nom et prénom]");
  const company = or(f.company, "[Dénomination sociale]");
  const legalForm = or(f.legalForm, "[Forme juridique]");
  const capital = or(f.capital, "[Montant du capital]");
  const siret = or(f.siret, "[Numéro SIREN/SIRET]");
  const address = or(f.address, f.type === "company" ? "[Adresse du siège social]" : "[Votre adresse]");
  const phone = or(f.phone, "[Votre téléphone]");
  const email = or(f.email, "[Votre email]");
  const siteName = or(f.siteName, "[Nom du site]");
  const siteUrl = or(f.siteUrl, "[URL du site]");
  const host = or(f.host, "[Nom de l'hébergeur]");
  const hostAddress = or(f.hostAddress, "[Adresse de l'hébergeur]");
  const hostPhone = or(f.hostPhone, "[Téléphone de l'hébergeur]");
  const director = or(f.director, name);

  let editor: string;
  if (f.type === "company") {
    editor = `Dénomination sociale : ${company}
Forme juridique : ${legalForm}
Capital social : ${capital}
Siège social : ${address}
SIREN/SIRET : ${siret}${f.rcs.trim() ? `\nImmatriculation : ${f.rcs.trim()}` : ""}${f.tvaIntra.trim() ? `\nN° TVA intracommunautaire : ${f.tvaIntra.trim()}` : ""}
Représentant légal : ${name}
Téléphone : ${phone}
Email : ${email}

Directeur de la publication : ${director}`;
  } else if (f.type === "ei") {
    editor = `Éditeur : ${name}, entrepreneur individuel (EI)
Adresse : ${address}
SIREN/SIRET : ${siret}${f.rcs.trim() ? `\nImmatriculation : ${f.rcs.trim()}` : ""}${f.tvaIntra.trim() ? `\nN° TVA intracommunautaire : ${f.tvaIntra.trim()}` : ""}
Téléphone : ${phone}
Email : ${email}

Directeur de la publication : ${director}`;
  } else if (f.anonymous) {
    editor = `Le site ${siteName} est édité à titre non professionnel par une personne physique qui, conformément à l'article 1-1 II de la loi n° 2004-575 du 21 juin 2004, a choisi de ne pas publier ses coordonnées. Ses éléments d'identification ont été communiqués à l'hébergeur mentionné ci-dessous.`;
  } else {
    editor = `Éditeur et directeur de la publication : ${name}
Adresse : ${address}
Téléphone : ${phone}
Email : ${email}`;
  }

  const contact = f.type === "individual" && f.anonymous ? "l'éditeur, par l'intermédiaire de l'hébergeur" : email;

  return `MENTIONS LÉGALES

Conformément aux articles 1-1 et 19 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), les présentes mentions légales sont portées à la connaissance des utilisateurs du site ${siteName} (${siteUrl}).

1. ÉDITEUR DU SITE

${editor}

2. HÉBERGEUR

Le site ${siteName} est hébergé par :
${host}
Adresse : ${hostAddress}
Téléphone : ${hostPhone}

3. PROPRIÉTÉ INTELLECTUELLE

L'ensemble des contenus de ce site (textes, images, vidéos, logos) est protégé par le droit d'auteur et le droit des marques, sauf mention contraire. Toute reproduction ou représentation, totale ou partielle, sans autorisation préalable de l'éditeur est interdite.

4. DONNÉES PERSONNELLES

Les traitements de données personnelles réalisés sur ce site sont décrits dans la politique de confidentialité. Conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés, vous disposez notamment d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Pour exercer ces droits, contactez ${contact}. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).

5. COOKIES

Les cookies strictement nécessaires au fonctionnement du site sont déposés sans consentement. Les autres cookies et traceurs (mesure d'audience non exemptée, publicité, réseaux sociaux) ne sont déposés qu'après votre consentement, que vous pouvez refuser aussi facilement qu'accepter et retirer à tout moment via le module de gestion des cookies.

6. LIMITATION DE RESPONSABILITÉ

Les informations publiées sur ce site sont fournies à titre indicatif. L'éditeur s'efforce d'en assurer l'exactitude et la mise à jour, mais ne saurait être tenu responsable des erreurs, omissions ou indisponibilités du site.

Dernière mise à jour : ${today || "[date]"}`;
}
