// Prints the built /cv/ page to public/Mohammadreza-Shirazi-CV.pdf with
// headless Chrome (or Edge), copies it into out/, and records which version
// of the CV it holds. Run after `npm run build`:  npm run cv:pdf
//
// Local only: Cloudflare's build doesn't run it. The committed PDF is
// deployed as is, and check-cv-pdf.mjs fails the build if it's out of date.

import { createServer } from "node:http";
import { copyFileSync, existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { execFile } from "node:child_process";
import { extname, join, normalize } from "node:path";
import { HASH_FILE, PDF_NAME, cvHash, scriptsDir } from "./cv-text.mjs";

const root = join(scriptsDir, "..");
const out = join(root, "out");
const target = join(root, "public", PDF_NAME);

const browsers = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error("No Chrome or Edge found; set CHROME to its path.");
if (!existsSync(join(out, "cv/index.html"))) throw new Error("Run `npm run build` first.");

const types = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png", ".webp": "image/webp",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".txt": "text/plain",
};

// A tiny static server for out/, so the page loads its CSS and fonts as on the live site.
const server = createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  let file = join(out, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!file.startsWith(out) || !existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
try {
  // Async, because a blocking call would stop the server Chrome is loading from.
  await new Promise((resolve, reject) =>
    execFile(
      browser,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--virtual-time-budget=10000",
        `--print-to-pdf=${target}`,
        `http://127.0.0.1:${port}/cv/`,
      ],
      (err) => (err ? reject(err) : resolve()),
    ),
  );
} finally {
  server.close();
}

copyFileSync(target, join(out, PDF_NAME));
writeFileSync(HASH_FILE, cvHash(out) + "\n");
console.log(`Wrote public/${PDF_NAME} (${Math.round(statSync(target).size / 1024)} KB) and scripts/cv-pdf.sha256.`);
