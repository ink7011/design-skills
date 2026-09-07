#!/usr/bin/env node
// Batch-export SVG badges to PNG (@2x, transparent background).
// Manifest-driven: node export-png.mjs manifest.json
//
// manifest.json:
//   [ ["path/badge.svg", "path/badge.png", 960, 300], ... ]
//
// Playwright resolution order:
//   1. $PLAYWRIGHT_PATH (absolute path to a playwright module)
//   2. plain require("playwright")

import { resolve } from "node:path";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const require = createRequire(import.meta.url);

function loadPlaywright() {
  const candidates = [];
  if (process.env.PLAYWRIGHT_PATH) candidates.push(process.env.PLAYWRIGHT_PATH);
  candidates.push("playwright");
  for (const c of candidates) {
    try {
      return require(c);
    } catch {
      /* try next */
    }
  }
  throw new Error(
    "playwright not found. Install it (npm i playwright && npx playwright install chromium) " +
      "or set PLAYWRIGHT_PATH to an existing playwright module.",
  );
}

const manifestFile = process.argv[2];
if (!manifestFile) {
  console.error("usage: node export-png.mjs <manifest.json>");
  process.exit(1);
}

const files = JSON.parse(await readFile(resolve(manifestFile), "utf8"));
const playwright = loadPlaywright();
const browser = await playwright.chromium.launch({ headless: true });

for (const [src, out, width, height] of files) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
  });
  const svg = await readFile(resolve(src), "utf8");
  await page.setContent(
    `<!doctype html><html><body style="margin:0;background:transparent">${svg}</body></html>`,
  );
  await page.locator("svg").screenshot({ path: out, omitBackground: true });
  await page.close();
  console.log(`exported: ${out}`);
}

await browser.close();
