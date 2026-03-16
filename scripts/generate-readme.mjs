/**
 * Auto-generate README.md from tools.ts data.
 * Run: node scripts/generate-readme.mjs
 * Called automatically before each build via "prebuild" npm script.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Parse tools from tools.ts (simple regex extraction, no TS compiler needed)
const toolsSrc = readFileSync(resolve(ROOT, "src/data/tools.ts"), "utf-8");

const toolRegex = /\{\s*title:\s*"([^"]+)"[\s\S]*?description:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?\}/g;

const tools = [];
let match;
while ((match = toolRegex.exec(toolsSrc)) !== null) {
  tools.push({
    title: match[1],
    description: match[2],
    href: match[3],
    category: match[4],
  });
}

// Group by category
const byCategory = new Map();
for (const tool of tools) {
  if (!byCategory.has(tool.category)) byCategory.set(tool.category, []);
  byCategory.get(tool.category).push(tool);
}

// Sort categories by number of tools (desc)
const sortedCategories = [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length);

// Build README
const lines = [];

lines.push("# Outilis.fr");
lines.push("");
lines.push(`> **${tools.length} outils en ligne gratuits** pour simplifier votre quotidien. 100% client-side, sans inscription, respectueux de la vie privee.`);
lines.push("");
lines.push("[![Deploy](https://github.com/ghota-tech-solutions-sass/outilio/actions/workflows/deploy.yml/badge.svg)](https://github.com/ghota-tech-solutions-sass/outilio/actions/workflows/deploy.yml)");
lines.push("");
lines.push("## Site");
lines.push("");
lines.push("**[https://outilis.fr](https://outilis.fr)**");
lines.push("");
lines.push("## Stack");
lines.push("");
lines.push("| | |");
lines.push("|---|---|");
lines.push("| Framework | Next.js 16 (static export) |");
lines.push("| Langage | TypeScript |");
lines.push("| Style | Tailwind CSS v4 |");
lines.push("| Hosting | GitHub Pages |");
lines.push("| CI/CD | GitHub Actions |");
lines.push("");
lines.push(`## Outils (${tools.length})`);
lines.push("");

for (const [category, catTools] of sortedCategories) {
  lines.push(`### ${category} (${catTools.length})`);
  lines.push("");
  lines.push("| Outil | Description |");
  lines.push("|---|---|");
  for (const tool of catTools) {
    const link = `[${tool.title}](https://outilis.fr${tool.href})`;
    lines.push(`| ${link} | ${tool.description} |`);
  }
  lines.push("");
}

lines.push("## Developpement");
lines.push("");
lines.push("```bash");
lines.push("npm install");
lines.push("npm run dev       # http://localhost:3000");
lines.push("npm run build     # Static export -> ./out/");
lines.push("```");
lines.push("");
lines.push("## Contribuer");
lines.push("");
lines.push("- [Suggerer un outil](https://outilis.fr/contribuer)");
lines.push("- [Signaler un bug](https://github.com/ghota-tech-solutions-sass/outilio/issues/new?template=bug-report.yml)");
lines.push("- [Guide contribution](https://outilis.fr/contribuer)");
lines.push("");
lines.push("## Licence");
lines.push("");
lines.push("MIT");
lines.push("");
lines.push("---");
lines.push("");
lines.push("*Ce README est auto-genere depuis `src/data/tools.ts`. Ne pas modifier manuellement.*");
lines.push("");

writeFileSync(resolve(ROOT, "README.md"), lines.join("\n"), "utf-8");
console.log(`README.md generated with ${tools.length} tools in ${sortedCategories.length} categories.`);
