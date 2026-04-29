"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  title?: string;
  intro?: string;
  items: FaqItem[];
};

export default function ToolFaqSection({ title = "Questions frequentes", intro, items }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="rounded-xl border p-6 md:p-8 shadow-sm" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <h2
        className="text-2xl md:text-3xl font-extrabold"
        style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          {intro}
        </p>
      ) : null}

      <ul className="mt-6 divide-y" style={{ borderColor: "var(--border)" }}>
        {items.map((item, i) => {
          const expanded = open === i;
          return (
            <li key={i} className="py-3" style={{ borderColor: "var(--border)" }}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <span className="font-semibold leading-snug" style={{ color: "var(--foreground)" }}>
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 transition-transform"
                  style={{
                    color: "var(--primary)",
                    transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>
              {expanded ? (
                <p className="mt-3 leading-relaxed" style={{ color: "var(--muted)" }}>
                  {item.answer}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((it) => ({
              "@type": "Question",
              name: it.question,
              acceptedAnswer: { "@type": "Answer", text: it.answer },
            })),
          }),
        }}
      />
    </section>
  );
}
