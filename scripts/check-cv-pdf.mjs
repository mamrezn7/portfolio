// Runs after every build (npm's postbuild, also on Cloudflare). Fails the
// build when the CV page has changed since the downloadable PDF was printed,
// so a stale PDF never ships. Fix: npm run cv:pdf, then commit the PDF.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { HASH_FILE, PDF_NAME, cvHash, scriptsDir } from "./cv-text.mjs";

const root = join(scriptsDir, "..");
const out = join(root, "out");

if (!existsSync(join(root, "public", PDF_NAME)) || !existsSync(HASH_FILE)) {
  console.error(`CV PDF missing: run \`npm run cv:pdf\` and commit public/${PDF_NAME} and scripts/cv-pdf.sha256.`);
  process.exit(1);
}
if (readFileSync(HASH_FILE, "utf8").trim() !== cvHash(out)) {
  console.error(`The /cv/ page changed since public/${PDF_NAME} was printed: run \`npm run cv:pdf\` and commit the result.`);
  process.exit(1);
}
console.log("CV PDF matches the /cv/ page.");
