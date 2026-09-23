import type { Metadata } from "next";
import { BLOG_AUTHOR, getArticle } from "./articles";

const BASE_URL = "https://outilis.fr";

/** Métadonnées SEO d'un article, générées depuis _data/articles.ts. */
export function articleMetadata(slug: string): Metadata {
  const a = getArticle(slug);
  const url = `${BASE_URL}/blog/${slug}`;
  return {
    title: a.seoTitle,
    description: a.description,
    keywords: a.keywords,
    authors: [{ name: BLOG_AUTHOR.name, url: BLOG_AUTHOR.url }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      siteName: "Outilis.fr",
      url,
      title: a.title,
      description: a.description,
      publishedTime: a.datePublished,
      modifiedTime: a.dateModified,
      authors: [BLOG_AUTHOR.name],
      section: a.category,
    },
    twitter: {
      card: "summary_large_image",
      title: a.title,
      description: a.description,
    },
  };
}

/** Métadonnées d'une ancienne URL devenue redirection (non indexée, canonique vers la cible). */
export function redirectMetadata(target: string): Metadata {
  return {
    title: "Article déplacé",
    robots: { index: false, follow: true },
    alternates: { canonical: `${BASE_URL}${target}` },
  };
}
