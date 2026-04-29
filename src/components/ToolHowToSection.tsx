type Step = {
  name: string;
  text: string;
};

type Props = {
  title?: string;
  description?: string;
  totalTime?: string;
  steps: Step[];
};

export default function ToolHowToSection({
  title = "Comment utiliser cet outil",
  description,
  totalTime,
  steps,
}: Props) {
  return (
    <section
      className="rounded-xl border p-6 md:p-8 shadow-sm"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <h2
        className="text-2xl md:text-3xl font-extrabold"
        style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          {description}
        </p>
      ) : null}

      <ol className="mt-6 space-y-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold"
              style={{ background: "var(--primary)", color: "white" }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                {step.name}
              </h3>
              <p className="mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>
                {step.text}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: title,
            description,
            ...(totalTime ? { totalTime } : {}),
            step: steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.name,
              text: s.text,
            })),
          }),
        }}
      />
    </section>
  );
}
