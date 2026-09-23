"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { tools } from "@/data/tools";
import { CATEGORY_SCHEMA } from "@/data/categories";

export default function ToolJsonLd() {
  const pathname = usePathname();

  const jsonLd = useMemo(() => {
    const current = tools.find((t) => t.href === pathname);
    if (!current) return null;

    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: current.title,
      description: current.description,
      url: `https://outilis.fr${current.href}`,
      applicationCategory: CATEGORY_SCHEMA[current.category] ?? "UtilitiesApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      browserRequirements: "Requires JavaScript",
      softwareVersion: "1.0",
      creator: {
        "@type": "Organization",
        name: "Outilis.fr",
        url: "https://outilis.fr",
      },
    };
  }, [pathname]);

  if (!jsonLd) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
