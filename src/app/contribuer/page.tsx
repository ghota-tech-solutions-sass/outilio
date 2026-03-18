"use client";

import { useState } from "react";
import Link from "next/link";

const REPO_URL = "https://github.com/ghota-tech-solutions-sass/outilio";

const CATEGORIES = [
  "Finance",
  "Immobilier",
  "Business",
  "Carriere",
  "Sante",
  "Texte",
  "Dev",
  "Outils",
  "Legal",
  "Securite",
  "Conversion",
  "Design",
  "Maths",
  "Image",
  "PDF",
  "Video",
  "Audio",
  "Autre",
];

const STEPS = [
  {
    num: "1",
    title: "Forkez le repository",
    description: (
      <>
        Rendez-vous sur{" "}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
          style={{ color: "var(--primary)" }}
        >
          GitHub
        </a>{" "}
        et cliquez sur &quot;Fork&quot;.
      </>
    ),
  },
  {
    num: "2",
    title: "Creez votre outil",
    description: (
      <>
        Ajoutez un dossier dans{" "}
        <code
          className="rounded px-1.5 py-0.5 text-xs"
          style={{ background: "var(--surface-alt)" }}
        >
          src/app/outils/mon-outil/
        </code>{" "}
        avec un <code className="rounded px-1.5 py-0.5 text-xs" style={{ background: "var(--surface-alt)" }}>layout.tsx</code> (metadata SEO) et un{" "}
        <code className="rounded px-1.5 py-0.5 text-xs" style={{ background: "var(--surface-alt)" }}>page.tsx</code> (&quot;use client&quot;).
      </>
    ),
  },
  {
    num: "3",
    title: "Suivez la structure existante",
    description:
      "Regardez un outil existant comme modele. Utilisez les CSS variables du projet et importez AdPlaceholder pour la sidebar.",
  },
  {
    num: "4",
    title: "Ouvrez une Pull Request",
    description:
      "Poussez votre branche et ouvrez une PR. Decrivez l'outil, son utilite et ajoutez une capture d'ecran si possible.",
  },
];

export default function ContribuerPage() {
  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("");
  const [description, setDescription] = useState("");
  const [casUsage, setCasUsage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const title = `[Suggestion] ${nom}`;
    const body = [
      `## Nom de l'outil\n${nom}`,
      `## Categorie\n${categorie}`,
      `## Description\n${description}`,
      casUsage ? `## Cas d'usage\n${casUsage}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const url = `${REPO_URL}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=suggestion`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const isValid = nom.trim() && categorie && description.trim();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b py-16 md:py-20" style={{ borderColor: "var(--border)" }}>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, #0d4f3c 0%, transparent 40%), radial-gradient(circle at 70% 60%, #e8963e 0%, transparent 35%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 2xl:max-w-[1400px]">
          <div className="max-w-2xl">
            <p
              className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--accent)" }}
            >
              Communaute
            </p>
            <h1
              className="animate-fade-up stagger-1 mt-3 text-4xl tracking-tight md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contribuer a{" "}
              <span style={{ color: "var(--primary)" }}>Outilis</span>
            </h1>
            <p
              className="animate-fade-up stagger-2 mt-4 text-lg leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Suggerez un outil qui vous manque ou contribuez directement au code.
              Le projet est open source et ouvert a tous.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] py-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Section 1: Suggerer un outil */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "var(--accent)" }}
              >
                1
              </span>
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Suggerer un outil
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Remplissez le formulaire ci-dessous. Votre suggestion sera envoyee
              comme issue GitHub pour que la communaute puisse en discuter.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Nom */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Nom de l&apos;outil <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Calculateur de TVA inversee"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                />
              </div>

              {/* Categorie */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Categorie <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <select
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                  required
                  className="w-full appearance-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                    color: categorie ? "var(--foreground)" : "var(--muted)",
                  }}
                >
                  <option value="" disabled>
                    Choisir une categorie...
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Description <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Decrivez l'outil : que ferait-il, comment fonctionnerait-il ?"
                  maxLength={500}
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                />
                <p className="mt-1 text-right text-xs" style={{ color: "var(--muted)" }}>
                  {description.length}/500
                </p>
              </div>

              {/* Cas d'usage */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Cas d&apos;usage{" "}
                  <span className="font-normal" style={{ color: "var(--muted)" }}>
                    (optionnel)
                  </span>
                </label>
                <textarea
                  value={casUsage}
                  onChange={(e) => setCasUsage(e.target.value)}
                  placeholder="Dans quelles situations utiliseriez-vous cet outil ?"
                  maxLength={300}
                  rows={3}
                  className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface)",
                  }}
                />
              </div>

              {/* Note GitHub */}
              <div
                className="flex items-start gap-3 rounded-xl border p-4"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface-alt)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--muted)" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                  Un compte GitHub est necessaire pour soumettre une suggestion.
                  Le formulaire ouvrira une issue pre-remplie sur notre repository.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: isValid
                    ? "linear-gradient(135deg, var(--accent) 0%, #d4822e 100%)"
                    : "var(--muted)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Envoyer la suggestion sur GitHub
              </button>
            </form>
          </div>

          {/* Section 2: Contribuer au code */}
          <div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "var(--primary)" }}
              >
                2
              </span>
              <h2
                className="text-2xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Contribuer au code
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Le projet est open source. Vous pouvez ajouter un outil, corriger
              un bug ou ameliorer le site directement.
            </p>

            {/* Steps */}
            <div className="mt-8 space-y-6">
              {STEPS.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(13,79,60,0.08)",
                      color: "var(--primary)",
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p
                      className="mt-1 text-sm leading-relaxed"
                      style={{ color: "var(--muted)" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* File structure */}
            <div
              className="mt-8 rounded-2xl border p-6"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              <h3 className="text-sm font-semibold">Structure d&apos;un outil</h3>
              <pre
                className="mt-4 overflow-x-auto rounded-xl p-4 text-xs leading-relaxed"
                style={{
                  background: "var(--surface-alt)",
                  color: "var(--foreground)",
                }}
              >
{`src/app/outils/mon-outil/
├── layout.tsx    # Metadata SEO
└── page.tsx      # UI ("use client")`}
              </pre>

              <h3 className="mt-6 text-sm font-semibold">Interface Tool</h3>
              <pre
                className="mt-3 overflow-x-auto rounded-xl p-4 text-xs leading-relaxed"
                style={{
                  background: "var(--surface-alt)",
                  color: "var(--foreground)",
                }}
              >
{`interface Tool {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
  category: string;
}`}
              </pre>
            </div>

            {/* CTA GitHub */}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 rounded-full border px-8 py-3.5 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-[#0d4f3c]/5"
              style={{
                borderColor: "var(--primary)",
                color: "var(--primary)",
                background: "rgba(13,79,60,0.04)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Voir le repository sur GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <section
        className="border-t py-16 text-center"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface-alt)",
        }}
      >
        <div className="mx-auto max-w-xl px-5">
          <h2
            className="text-2xl tracking-tight md:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Chaque contribution compte
          </h2>
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Qu&apos;il s&apos;agisse d&apos;une idee d&apos;outil, d&apos;un bug reporte ou d&apos;une
            ligne de code, vous aidez des milliers de Francais au quotidien.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-semibold transition-all hover:bg-[#0d4f3c]/5"
              style={{ borderColor: "var(--border)" }}
            >
              Retour a l&apos;accueil
            </Link>
            <a
              href={`${REPO_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-[1.01]"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, #1a6b4f 100%)",
              }}
            >
              Voir les suggestions existantes
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
