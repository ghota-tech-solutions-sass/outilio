# CLAUDE.md - Outilis.fr

## Project overview

Outilis.fr is a Next.js 16 static site hosting 40+ free online tools (calculators, generators, converters). All tools run 100% client-side. Deployed to GitHub Pages via GitHub Actions.

- **Live site:** https://outilis.fr
- **Repo:** https://github.com/ghota-tech-solutions-sass/outilio

## Tech stack

| Technology | Details |
|---|---|
| Framework | Next.js 16.1.6 (static export via `output: "export"`) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (with `@tailwindcss/postcss`) |
| React | 19.2.3 |
| Hosting | GitHub Pages (custom domain: outilis.fr) |
| CI/CD | GitHub Actions (`.github/workflows/deploy.yml`) |
| Analytics | Google Analytics `G-GPSSC5CMYK` |

## Directory structure

```
mes-outils/
├── .github/workflows/deploy.yml   # Auto-deploy on push to main
├── public/
│   ├── CNAME                       # Custom domain: outilis.fr
│   ├── sitemap.xml                 # SEO sitemap
│   ├── robots.txt                  # Robots directives
│   └── google87a43a9a1fa4ac88.html # Search Console verification
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (fonts, GA, metadata, Header/Footer)
│   │   ├── page.tsx                # Homepage (tool grid, hero, features)
│   │   ├── globals.css             # CSS variables, animations, Tailwind import
│   │   └── outils/
│   │       └── [tool-name]/        # Each tool is a folder
│   │           ├── layout.tsx      # Tool-specific Metadata (SEO)
│   │           └── page.tsx        # Tool UI ("use client")
│   └── components/
│       ├── Header.tsx              # Site header/navigation
│       ├── Footer.tsx              # Site footer
│       ├── ToolCard.tsx            # Card component used on homepage
│       └── AdPlaceholder.tsx       # Internal promo sidebar widget
├── next.config.ts                  # Static export config
├── package.json
├── tsconfig.json
├── postcss.config.mjs
└── eslint.config.mjs
```

## Design system

### CSS variables (defined in `src/app/globals.css`)

```css
--background: #faf9f6
--foreground: #1a1a1a
--primary: #0d4f3c        /* Dark green - main brand color */
--primary-light: #16785c   /* Lighter green */
--accent: #e8963e          /* Orange - accent/CTA color */
--accent-light: #f4c27f    /* Light orange */
--surface: #ffffff          /* Card backgrounds */
--surface-alt: #f0ede8      /* Alternate section backgrounds */
--muted: #8a8578            /* Secondary text */
--border: #e2ded6           /* Border color */
```

### Fonts

- **Display:** DM Serif Display (headings) via `var(--font-display)`
- **Body:** DM Sans (body text) via `var(--font-body)`
- Loaded with `next/font/google` in `src/app/layout.tsx`

### Important: Use CSS variables via inline styles

The project uses CSS variables with inline `style` props rather than Tailwind arbitrary values. Example:

```tsx
<h1 style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
  Title
</h1>
<p style={{ color: "var(--muted)" }}>Description</p>
<div style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
```

## How to add a new tool

1. **Create the tool folder:**
   ```
   src/app/outils/[tool-slug]/
   ```

2. **Create `layout.tsx`** with SEO Metadata:
   ```tsx
   import type { Metadata } from "next";

   export const metadata: Metadata = {
     title: "Tool Title - Gratuit",
     description: "Description for SEO...",
     keywords: ["keyword1", "keyword2"],
   };

   export default function Layout({ children }: { children: React.ReactNode }) {
     return children;
   }
   ```

3. **Create `page.tsx`** with `"use client"` directive:
   ```tsx
   "use client";

   import { useState } from "react";
   import AdPlaceholder from "@/components/AdPlaceholder";

   export default function ToolName() {
     // Tool implementation
     return (
       <section className="py-12">
         <div className="mx-auto max-w-6xl px-5">
           <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
             <div>
               {/* Main tool content */}
             </div>
             <aside className="hidden lg:block">
               <AdPlaceholder className="min-h-[250px]" />
               <AdPlaceholder className="mt-6 min-h-[250px]" />
             </aside>
           </div>
         </div>
       </section>
     );
   }
   ```

4. **Add the tool to the homepage** in `src/app/page.tsx` (add entry to the `tools` array).

5. **Update the sitemap** in `public/sitemap.xml`.

## Build commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Build static site to ./out/
npm run lint      # Run ESLint
```

## Deployment

- **Automatic:** GitHub Actions deploys on every push to `main`
- **Workflow:** `.github/workflows/deploy.yml`
- **Output:** Static files in `./out/` uploaded to GitHub Pages
- **Custom domain:** `outilis.fr` (configured via `public/CNAME`)

## SEO

- Each tool has its own `Metadata` in its `layout.tsx`
- Root metadata with template `"%s | Outilis.fr"` in `src/app/layout.tsx`
- `public/sitemap.xml` — list of all pages
- `public/robots.txt` — crawler directives
- Structured data (JSON-LD `WebSite` schema) in root layout
- Google Search Console verified via `public/google87a43a9a1fa4ac88.html`

## Important patterns

- All tool pages must have `"use client"` since they use React state/hooks
- Import `AdPlaceholder` from `@/components/AdPlaceholder` for sidebar promo widgets
- Use CSS variables via inline `style` props (not Tailwind arbitrary values)
- Animations: use utility classes `animate-fade-up`, `animate-fade-in`, `animate-slide-in`, `animate-scale-in` with `stagger-N` for delays
- Print support: add `no-print` class to elements that should be hidden when printing

## Google Analytics

- **ID:** `G-GPSSC5CMYK`
- Loaded via `next/script` with `afterInteractive` strategy in root layout
