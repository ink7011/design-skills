#!/usr/bin/env node
// Minimum-size readability check: render one SVG at several widths
// (default 480 / 240 / 160 / 120) into a single comparison PNG.
//
// usage: node size-check.mjs path/badge.svg [out.png]
//
// Playwright resolution: $PLAYWRIGHT_PATH first, then require("playwright").

import { resolve } from "node:path";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";

const require = createRequire(import.meta.url);

function loadChromium() {
  const candidates = [];
  if (process.env.PLAYWRIGHT_PATH) candidates.push(process.env.PLAYWRIGHT_PATH);
  candidates.push("playwright");
  for (const c of candidates) {
    try {
      return require(c).chromium;
    } catch {
      /* try next */
    }
  }
  throw new Error("playwright not found; set PLAYWRIGHT_PATH or npm i playwright");
}

const [svgPath, outPath] = process.argv.slice(2);
if (!svgPath) {
  console.error("usage: node size-check.mjs <badge.svg> [out.png]");
  process.exit(1);
}
const out = outPath || svgPath.replace(/\.svg$/, "") + "-size-check.png";

const widths = [480, 240, 160, 120];
const rowH = 170; // 960x300 aspect at 480 wide = 150 + label padding
const W = 1040;
const H = rowH * widths.length + 30;

const svg = await readFile(resolve(svgPath), "utf8");
const chromium = loadChromium();
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: W, height: H } });

const rows = widths
  .map(
    (w, i) =>
      `<div style="position:absolute;left:20px;top:${i * rowH + 20}px"><div style="font:600 12px Arial;color:#666;margin-bottom:4px">${w}px</div><div style="width:${w}px">${svg.replace(/width="\d+" height="\d+"/, "")}</div></div>`,
  )
  .join("");

await page.setContent(
  `<!doctype html><html><body style="margin:0;background:#fff">${rows}</body></html>`,
);
await page.locator("body").screenshot({ path: out });
await browser.close();
console.log(`size check written: ${out}`);
