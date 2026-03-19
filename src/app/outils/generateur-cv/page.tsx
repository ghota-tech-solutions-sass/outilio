"use client";

import { useState, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Experience {
  poste: string;
  entreprise: string;
  debut: string;
  fin: string;
  description: string;
}

interface Formation {
  diplome: string;
  etablissement: string;
  annee: string;
}

interface InfosPerso {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  titre: string;
}

type Template = "classique" | "moderne";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function GenerateurCV() {
  const [infos, setInfos] = useState<InfosPerso>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    ville: "",
    titre: "",
  });
  const [profil, setProfil] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([
    { poste: "", entreprise: "", debut: "", fin: "", description: "" },
  ]);
  const [formations, setFormations] = useState<Formation[]>([
    { diplome: "", etablissement: "", annee: "" },
  ]);
  const [competences, setCompetences] = useState<string[]>([]);
  const [compInput, setCompInput] = useState("");
  const [template, setTemplate] = useState<Template>("classique");
  const previewRef = useRef<HTMLDivElement>(null);

  /* ---------- helpers ---------- */
  const addExperience = () =>
    setExperiences([...experiences, { poste: "", entreprise: "", debut: "", fin: "", description: "" }]);
  const removeExperience = (i: number) => setExperiences(experiences.filter((_, idx) => idx !== i));
  const updateExperience = (i: number, field: keyof Experience, value: string) => {
    const copy = [...experiences];
    copy[i] = { ...copy[i], [field]: value };
    setExperiences(copy);
  };

  const addFormation = () =>
    setFormations([...formations, { diplome: "", etablissement: "", annee: "" }]);
  const removeFormation = (i: number) => setFormations(formations.filter((_, idx) => idx !== i));
  const updateFormation = (i: number, field: keyof Formation, value: string) => {
    const copy = [...formations];
    copy[i] = { ...copy[i], [field]: value };
    setFormations(copy);
  };

  const addCompetence = () => {
    const tag = compInput.trim();
    if (tag && !competences.includes(tag)) {
      setCompetences([...competences, tag]);
    }
    setCompInput("");
  };
  const removeCompetence = (i: number) => setCompetences(competences.filter((_, idx) => idx !== i));

  const handlePrint = () => window.print();

  const fullName = `${infos.prenom} ${infos.nom}`.trim();

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* ---- Hero ---- */}
      <section
        className="py-12 no-print"
        style={{ background: "linear-gradient(to bottom, var(--surface-alt), var(--background))" }}
      >
        <div className="mx-auto max-w-7xl px-6 2xl:max-w-[1400px] animate-fade-up">
          <h1
            className="text-3xl font-extrabold md:text-4xl"
            style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
          >
            Generateur de CV gratuit
          </h1>
          <p className="mt-2" style={{ color: "var(--muted)" }}>
            Remplissez vos informations, choisissez un style et telechargez votre CV en PDF. 100% gratuit, sans inscription.
          </p>
        </div>
      </section>

      {/* ---- Main layout : form left / preview right ---- */}
      <div className="mx-auto max-w-[1400px] px-5 py-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* ===================== FORM ===================== */}
          <div className="space-y-6 no-print">
            {/* Template selector */}
            <div
              className="rounded-xl p-5 animate-fade-up stagger-1"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                Modele
              </h2>
              <div className="mt-3 flex gap-3">
                {(["classique", "moderne"] as Template[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTemplate(t)}
                    className="rounded-lg px-5 py-2.5 text-sm font-medium transition-all"
                    style={
                      template === t
                        ? { background: "var(--primary)", color: "#fff" }
                        : { background: "var(--surface-alt)", color: "var(--foreground)", border: "1px solid var(--border)" }
                    }
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Infos personnelles */}
            <div
              className="rounded-xl p-5 animate-fade-up stagger-2"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                Informations personnelles
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Prenom" value={infos.prenom} onChange={(v) => setInfos({ ...infos, prenom: v })} />
                <Field label="Nom" value={infos.nom} onChange={(v) => setInfos({ ...infos, nom: v })} />
                <Field label="Titre / Poste recherche" value={infos.titre} onChange={(v) => setInfos({ ...infos, titre: v })} className="sm:col-span-2" />
                <Field label="Email" value={infos.email} onChange={(v) => setInfos({ ...infos, email: v })} type="email" />
                <Field label="Telephone" value={infos.telephone} onChange={(v) => setInfos({ ...infos, telephone: v })} type="tel" />
                <Field label="Ville" value={infos.ville} onChange={(v) => setInfos({ ...infos, ville: v })} />
              </div>
            </div>

            {/* Profil / Resume */}
            <div
              className="rounded-xl p-5 animate-fade-up stagger-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                Profil / Resume
              </h2>
              <textarea
                value={profil}
                onChange={(e) => setProfil(e.target.value)}
                rows={3}
                placeholder="Decrivez votre profil en 2-3 phrases..."
                className="mt-3 w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1px solid var(--border)", background: "var(--background)" }}
              />
            </div>

            {/* Experiences */}
            <div
              className="rounded-xl p-5 animate-fade-up stagger-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                Experiences professionnelles
              </h2>
              {experiences.map((exp, i) => (
                <div
                  key={i}
                  className="mt-4 rounded-lg p-4"
                  style={{ background: "var(--surface-alt)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                      Experience {i + 1}
                    </span>
                    {experiences.length > 1 && (
                      <button
                        onClick={() => removeExperience(i)}
                        className="text-sm font-medium hover:opacity-70"
                        style={{ color: "#dc2626" }}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Poste" value={exp.poste} onChange={(v) => updateExperience(i, "poste", v)} />
                    <Field label="Entreprise" value={exp.entreprise} onChange={(v) => updateExperience(i, "entreprise", v)} />
                    <Field label="Date debut" value={exp.debut} onChange={(v) => updateExperience(i, "debut", v)} placeholder="ex: Jan 2022" />
                    <Field label="Date fin" value={exp.fin} onChange={(v) => updateExperience(i, "fin", v)} placeholder="ex: Present" />
                  </div>
                  <div className="mt-3">
                    <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(i, "description", e.target.value)}
                      rows={2}
                      className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                      style={{ border: "1px solid var(--border)", background: "var(--background)" }}
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addExperience}
                className="mt-3 text-sm font-medium hover:underline"
                style={{ color: "var(--primary)" }}
              >
                + Ajouter une experience
              </button>
            </div>

            {/* Formations */}
            <div
              className="rounded-xl p-5 animate-fade-up stagger-5"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                Formations
              </h2>
              {formations.map((f, i) => (
                <div
                  key={i}
                  className="mt-4 rounded-lg p-4"
                  style={{ background: "var(--surface-alt)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                      Formation {i + 1}
                    </span>
                    {formations.length > 1 && (
                      <button
                        onClick={() => removeFormation(i)}
                        className="text-sm font-medium hover:opacity-70"
                        style={{ color: "#dc2626" }}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Field label="Diplome" value={f.diplome} onChange={(v) => updateFormation(i, "diplome", v)} />
                    <Field label="Etablissement" value={f.etablissement} onChange={(v) => updateFormation(i, "etablissement", v)} />
                    <Field label="Annee" value={f.annee} onChange={(v) => updateFormation(i, "annee", v)} placeholder="ex: 2020" />
                  </div>
                </div>
              ))}
              <button
                onClick={addFormation}
                className="mt-3 text-sm font-medium hover:underline"
                style={{ color: "var(--primary)" }}
              >
                + Ajouter une formation
              </button>
            </div>

            {/* Competences */}
            <div
              className="rounded-xl p-5 animate-fade-up stagger-6"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                Competences
              </h2>
              <div className="mt-3 flex gap-2">
                <input
                  value={compInput}
                  onChange={(e) => setCompInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCompetence();
                    }
                  }}
                  placeholder="Tapez une competence puis Entree..."
                  className="flex-1 rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1px solid var(--border)", background: "var(--background)" }}
                />
                <button
                  onClick={addCompetence}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ background: "var(--primary)" }}
                >
                  Ajouter
                </button>
              </div>
              {competences.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {competences.map((c, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
                      style={{ background: "var(--surface-alt)", color: "var(--primary)", border: "1px solid var(--border)" }}
                    >
                      {c}
                      <button
                        onClick={() => removeCompetence(i)}
                        className="ml-1 text-base leading-none hover:opacity-60"
                        style={{ color: "var(--muted)" }}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="w-full rounded-xl py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 animate-fade-up stagger-7"
              style={{ background: "var(--primary)" }}
            >
              Telecharger en PDF
            </button>
            <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
              Utilisez &laquo; Enregistrer au format PDF &raquo; dans la boite de dialogue d&apos;impression.
            </p>
          </div>

          {/* ===================== PREVIEW ===================== */}
          <div className="no-print">
            <div
              className="sticky top-8 rounded-xl p-2 animate-fade-up stagger-3"
              style={{ background: "var(--surface-alt)", border: "1px solid var(--border)" }}
            >
              <h2
                className="mb-2 text-center text-sm font-semibold"
                style={{ color: "var(--muted)" }}
              >
                Apercu en temps reel
              </h2>
              <div
                className="overflow-hidden rounded-lg shadow-lg"
                style={{ background: "#fff", aspectRatio: "210/297" }}
              >
                <div
                  style={{
                    transform: "scale(0.48)",
                    transformOrigin: "top left",
                    width: "210mm",
                    minHeight: "297mm",
                  }}
                >
                  {template === "classique" ? (
                    <CVClassique
                      infos={infos}
                      fullName={fullName}
                      profil={profil}
                      experiences={experiences}
                      formations={formations}
                      competences={competences}
                    />
                  ) : (
                    <CVModerne
                      infos={infos}
                      fullName={fullName}
                      profil={profil}
                      experiences={experiences}
                      formations={formations}
                      competences={competences}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== SEO CONTENT ===================== */}
      <div className="mx-auto max-w-[1400px] px-5 pb-8 space-y-6 no-print">
        {/* SEO Content */}
        <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Comment creer votre CV en ligne gratuitement
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            <p>
              Notre generateur de CV gratuit vous permet de creer un curriculum vitae professionnel en quelques minutes.
              Remplissez les champs, choisissez un modele et telechargez directement en PDF. Aucune inscription requise.
            </p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong className="text-[var(--foreground)]">Remplissez vos informations</strong> : coordonnees, profil, experiences, formations et competences</li>
              <li><strong className="text-[var(--foreground)]">Choisissez un modele</strong> : classique (sobre et traditionnel) ou moderne (avec barre laterale coloree)</li>
              <li><strong className="text-[var(--foreground)]">Previsualisation en temps reel</strong> : votre CV se met a jour au fur et a mesure de la saisie</li>
              <li><strong className="text-[var(--foreground)]">Telechargez en PDF</strong> : via la boite de dialogue d&apos;impression de votre navigateur</li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border p-8" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <h2 className="text-2xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Questions frequentes</h2>
          <div className="mt-6 space-y-5">
            <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Le CV genere est-il au format A4 ?</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Oui, les modeles sont concus au format A4 (210 x 297 mm), le standard en France et en Europe. Lors du telechargement PDF, assurez-vous de selectionner le format A4 dans les parametres d&apos;impression.</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Mes donnees sont-elles sauvegardees ?</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Non, aucune donnee personnelle n&apos;est stockee sur nos serveurs. Tout le traitement se fait localement dans votre navigateur. Vos informations disparaissent des que vous fermez la page.</p>
            </div>
            <div className="rounded-xl p-5" style={{ background: "var(--surface-alt)" }}>
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Puis-je ajouter une photo sur mon CV ?</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>Le modele moderne affiche vos initiales dans un avatar. En France, la photo n&apos;est pas obligatoire sur un CV. De nombreux recruteurs recommandent meme de ne pas en mettre pour favoriser l&apos;egalite des chances.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== PRINT VERSION ===================== */}
      <div ref={previewRef} className="hidden print:block">
        {template === "classique" ? (
          <CVClassique
            infos={infos}
            fullName={fullName}
            profil={profil}
            experiences={experiences}
            formations={formations}
            competences={competences}
          />
        ) : (
          <CVModerne
            infos={infos}
            fullName={fullName}
            profil={profil}
            experiences={experiences}
            formations={formations}
            competences={competences}
          />
        )}
      </div>
    </>
  );
}

/* ================================================================== */
/*  CV TEMPLATES                                                       */
/* ================================================================== */

interface CVProps {
  infos: InfosPerso;
  fullName: string;
  profil: string;
  experiences: Experience[];
  formations: Formation[];
  competences: string[];
}

/* ---------- CLASSIQUE ---------- */
function CVClassique({ infos, fullName, profil, experiences, formations, competences }: CVProps) {
  const hasContact = infos.email || infos.telephone || infos.ville;
  return (
    <div style={{ fontFamily: "sans-serif", padding: "40px 48px", color: "#1a1a1a", lineHeight: 1.5 }}>
      {/* Header */}
      <div style={{ borderBottom: "2px solid #0d4f3c", paddingBottom: 16, marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0d4f3c", margin: 0 }}>
          {fullName || "Votre Nom"}
        </h1>
        {infos.titre && (
          <p style={{ fontSize: 16, color: "#8a8578", marginTop: 4 }}>{infos.titre}</p>
        )}
        {hasContact && (
          <p style={{ fontSize: 12, color: "#666", marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
            {infos.email && <span>{infos.email}</span>}
            {infos.telephone && <span>{infos.telephone}</span>}
            {infos.ville && <span>{infos.ville}</span>}
          </p>
        )}
      </div>

      {/* Profil */}
      {profil && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#0d4f3c", marginBottom: 8 }}>
            Profil
          </h2>
          <p style={{ fontSize: 13, color: "#444", whiteSpace: "pre-line" }}>{profil}</p>
        </div>
      )}

      {/* Experiences */}
      {experiences.some((e) => e.poste || e.entreprise) && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#0d4f3c", marginBottom: 8 }}>
            Experience professionnelle
          </h2>
          {experiences.map((exp, i) =>
            (exp.poste || exp.entreprise) ? (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{exp.poste}</p>
                  {(exp.debut || exp.fin) && (
                    <span style={{ fontSize: 12, color: "#8a8578" }}>
                      {exp.debut}{exp.debut && exp.fin ? " - " : ""}{exp.fin}
                    </span>
                  )}
                </div>
                {exp.entreprise && (
                  <p style={{ fontSize: 13, color: "#0d4f3c", margin: "2px 0 0" }}>{exp.entreprise}</p>
                )}
                {exp.description && (
                  <p style={{ fontSize: 12, color: "#555", marginTop: 4, whiteSpace: "pre-line" }}>
                    {exp.description}
                  </p>
                )}
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Formations */}
      {formations.some((f) => f.diplome || f.etablissement) && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#0d4f3c", marginBottom: 8 }}>
            Formation
          </h2>
          {formations.map((f, i) =>
            (f.diplome || f.etablissement) ? (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{f.diplome}</p>
                  {f.annee && <span style={{ fontSize: 12, color: "#8a8578" }}>{f.annee}</span>}
                </div>
                {f.etablissement && (
                  <p style={{ fontSize: 13, color: "#666", margin: "2px 0 0" }}>{f.etablissement}</p>
                )}
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Competences */}
      {competences.length > 0 && (
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#0d4f3c", marginBottom: 8 }}>
            Competences
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {competences.map((c, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  padding: "4px 12px",
                  borderRadius: 4,
                  background: "#e8f5e9",
                  color: "#0d4f3c",
                  fontWeight: 500,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- MODERNE ---------- */
function CVModerne({ infos, fullName, profil, experiences, formations, competences }: CVProps) {
  const hasContact = infos.email || infos.telephone || infos.ville;
  return (
    <div style={{ fontFamily: "sans-serif", display: "flex", minHeight: "297mm", color: "#1a1a1a" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          flexShrink: 0,
          background: "linear-gradient(180deg, #0d4f3c 0%, #1a6b4f 100%)",
          color: "#fff",
          padding: "40px 24px",
        }}
      >
        {/* Avatar placeholder */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {(infos.prenom[0] || "").toUpperCase()}
          {(infos.nom[0] || "").toUpperCase()}
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", margin: 0, lineHeight: 1.3 }}>
          {fullName || "Votre Nom"}
        </h1>
        {infos.titre && (
          <p style={{ fontSize: 12, textAlign: "center", opacity: 0.85, marginTop: 4 }}>{infos.titre}</p>
        )}

        {/* Contact */}
        {hasContact && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.7, marginBottom: 12 }}>
              Contact
            </h3>
            <div style={{ fontSize: 12, lineHeight: 2 }}>
              {infos.email && (
                <p style={{ margin: 0, wordBreak: "break-all" }}>{infos.email}</p>
              )}
              {infos.telephone && <p style={{ margin: 0 }}>{infos.telephone}</p>}
              {infos.ville && <p style={{ margin: 0 }}>{infos.ville}</p>}
            </div>
          </div>
        )}

        {/* Competences in sidebar */}
        {competences.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, opacity: 0.7, marginBottom: 12 }}>
              Competences
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {competences.map((c, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "40px 36px", lineHeight: 1.5 }}>
        {/* Profil */}
        {profil && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0d4f3c", marginBottom: 8, paddingBottom: 6, borderBottom: "2px solid #e8963e" }}>
              Profil
            </h2>
            <p style={{ fontSize: 13, color: "#444", whiteSpace: "pre-line" }}>{profil}</p>
          </div>
        )}

        {/* Experiences */}
        {experiences.some((e) => e.poste || e.entreprise) && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0d4f3c", marginBottom: 8, paddingBottom: 6, borderBottom: "2px solid #e8963e" }}>
              Experience professionnelle
            </h2>
            {experiences.map((exp, i) =>
              (exp.poste || exp.entreprise) ? (
                <div key={i} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: "3px solid #e2ded6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#1a1a1a" }}>{exp.poste}</p>
                    {(exp.debut || exp.fin) && (
                      <span style={{ fontSize: 11, color: "#8a8578", flexShrink: 0, marginLeft: 12 }}>
                        {exp.debut}{exp.debut && exp.fin ? " - " : ""}{exp.fin}
                      </span>
                    )}
                  </div>
                  {exp.entreprise && (
                    <p style={{ fontSize: 13, color: "#e8963e", fontWeight: 500, margin: "2px 0 0" }}>{exp.entreprise}</p>
                  )}
                  {exp.description && (
                    <p style={{ fontSize: 12, color: "#555", marginTop: 4, whiteSpace: "pre-line" }}>
                      {exp.description}
                    </p>
                  )}
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Formations */}
        {formations.some((f) => f.diplome || f.etablissement) && (
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0d4f3c", marginBottom: 8, paddingBottom: 6, borderBottom: "2px solid #e8963e" }}>
              Formation
            </h2>
            {formations.map((f, i) =>
              (f.diplome || f.etablissement) ? (
                <div key={i} style={{ marginBottom: 12, paddingLeft: 16, borderLeft: "3px solid #e2ded6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{f.diplome}</p>
                    {f.annee && <span style={{ fontSize: 11, color: "#8a8578" }}>{f.annee}</span>}
                  </div>
                  {f.etablissement && (
                    <p style={{ fontSize: 13, color: "#666", margin: "2px 0 0" }}>{f.etablissement}</p>
                  )}
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Shared field component                                              */
/* ================================================================== */
function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
        style={{ border: "1px solid var(--border)", background: "var(--background)" }}
      />
    </div>
  );
}
