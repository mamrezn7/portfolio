// The words on the built /cv/ page, and a hash of them. The downloadable PDF
// is printed from that page, so the hash says which version of the CV a PDF
// holds: cv-pdf.mjs records it, check-cv-pdf.mjs compares it after a build.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Not import.meta.dirname: Cloudflare's build image may run an older Node.
export const scriptsDir = fileURLToPath(new URL(".", import.meta.url));
export const PDF_NAME = "Mohammadreza-Shirazi-CV.pdf";
export const HASH_FILE = join(scriptsDir, "cv-pdf.sha256");

export function cvText(outDir) {
  const html = readFileSync(join(outDir, "cv/index.html"), "utf8");
  const article = html.match(/<article class="wrap cv"[\s\S]*?<\/article>/);
  if (!article) throw new Error("No CV article in out/cv/index.html; did the build run?");
  return article[0]
    // Structured data carries the build time, which isn't CV text.
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const cvHash = (outDir) => createHash("sha256").update(cvText(outDir)).digest("hex");
