// Quick visual capture of the #stories section across viewports.
// Usage: node scripts/screenshot-stories.mjs
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const playwrightPath = process.env.PLAYWRIGHT_PATH || "playwright";
let pw;
try {
  pw = require(playwrightPath);
} catch {
  pw = require("/Users/abdullah/.npm-global/lib/node_modules/playwright");
}
const { chromium } = pw;

const BASE = process.env.BASE_URL || "http://127.0.0.1:5179/";
const OUT = process.env.OUT_DIR || join(process.cwd(), "screenshots");
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "stories-desktop", width: 1366, height: 900 },
  { name: "stories-tablet", width: 820, height: 1180 },
  { name: "stories-mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate(() => {
      const det = document.querySelector('details.m-collapsible[data-m-collapse="stories"]');
      if (det) det.open = true;
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("revealed", "is-visible");
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    });
    const section = page.locator("#stories");
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const out = join(OUT, `${vp.name}.png`);
    await section.screenshot({ path: out });
    console.log("wrote", out);

    if (vp.name === "stories-desktop") {
      const card = page.locator("#stories .story-card").first();
      await card.hover();
      await page.waitForTimeout(400);
      const hoverOut = join(OUT, `${vp.name}-hover.png`);
      await section.screenshot({ path: hoverOut });
      console.log("wrote", hoverOut);
    }
    await ctx.close();
  }
} finally {
  await browser.close();
}
