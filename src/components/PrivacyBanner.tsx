export default function PrivacyBanner() {
  return (
    <section className="py-16" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto max-w-6xl px-5">
        <div
          className="rounded-2xl px-8 py-10 md:px-12 md:py-12"
          style={{ background: "var(--primary)" }}
        >
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-8">
            {/* Icons */}
            <div className="flex shrink-0 gap-3">
              {/* Shield icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              {/* Lock icon */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            {/* Text */}
            <div>
              <h3
                className="text-xl tracking-tight text-white md:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Vos donnees restent chez vous.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
                Tous nos outils fonctionnent 100% dans votre navigateur. Aucune
                donnee n&apos;est envoyee a un serveur. Aucun cookie de tracking.
                Aucune inscription requise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
