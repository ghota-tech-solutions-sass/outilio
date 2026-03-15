"use client";

export default function AdPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border-2 border-dashed text-xs tracking-wider uppercase ${className}`}
      style={{
        minHeight: 90,
        borderColor: "var(--border)",
        background: "var(--surface-alt)",
        color: "var(--muted)",
      }}
    >
      {/* Replace with: <ins class="adsbygoogle" ... /> */}
      Espace publicitaire
    </div>
  );
}
