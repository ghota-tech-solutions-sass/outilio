import Link from "next/link";

/**
 * Page de redirection pour un article retiré ou fusionné.
 * GitHub Pages ne permet pas de 301 : on combine meta refresh (hissée dans <head> par React 19),
 * canonique vers la cible (via redirectMetadata) et lien visible en secours.
 */
export default function RedirectStub({ target, label }: { target: string; label: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="text-3xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Cet article a été déplacé
          </h1>
          <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
            Son contenu a été regroupé et mis à jour. Vous allez être redirigé automatiquement.
          </p>
          <Link
            href={target}
            className="mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--primary)" }}
          >
            {label} &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
