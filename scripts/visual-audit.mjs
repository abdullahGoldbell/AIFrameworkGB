// Quick visual audit: spin up a headless browser, walk through each major
// section of the page, and write screenshots + console errors to disk.
//
// Run AFTER `npm run serve` is up on port 4173. Output lives in
// /tmp/visual-audit/ so we can spot regressions without bothering the user.

import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const URL = process.env.URL || "http://127.0.0.1:4173/";
const VIEWPORT = { width: 1280, height: 800 }; // similar to user screenshot
const OUT_DIR = "/tmp/visual-audit";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const SECTIONS = [
  { id: "hero", label: "01-hero" },
  { id: "why-ai", label: "02-why-ai" },
  { id: "try-it-now", label: "03-try-it" },
  { id: "newsletter", label: "04-newsletter" },
  { id: "learning-path", label: "05-learning" },
  { id: "ai-confidence-quiz", label: "06-quiz" },
  { id: "ai-terms-flashcards", label: "07-flashcards" },
  { id: "first-prompt-builder", label: "08-builder" },
  { id: "stories", label: "09-stories" },
  { id: "prompt-master", label: "10-prompt-master" },
  { id: "footer", label: "11-footer" },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
const page = await context.newPage();

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(`PAGEERROR: ${err.message}`));

const requestFailures = [];
page.on("requestfailed", (req) => requestFailures.push(`${req.failure()?.errorText} ${req.url()}`));

console.log(`Visiting ${URL} ...`);
await page.goto(URL, { waitUntil: "networkidle" });

// Full-page shot first.
await page.screenshot({
  path: `${OUT_DIR}/00-fullpage.png`,
  fullPage: true,
});

// Per-section shots.
for (const { id, label } of SECTIONS) {
  const handle = await page.$(`#${id}`);
  if (!handle) {
    console.log(`  ${label} (#${id}): NOT FOUND`);
    continue;
  }
  const box = await handle.boundingBox();
  if (!box) {
    console.log(`  ${label} (#${id}): no bounding box`);
    continue;
  }
  console.log(
    `  ${label} (#${id}): width=${Math.round(box.width)} height=${Math.round(box.height)}`,
  );
  try {
    // `element.screenshot()` clips to the element automatically, regardless
    // of where it sits on the page. Cap super-tall sections so we don't
    // generate 4000px PNGs.
    await handle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    if (box.height > VIEWPORT.height * 1.5) {
      // Fallback for tall sections: viewport-clip after scroll.
      await page.screenshot({
        path: `${OUT_DIR}/${label}.png`,
        clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      });
    } else {
      await handle.screenshot({ path: `${OUT_DIR}/${label}.png` });
    }
  } catch (err) {
    console.log(`  ${label}: screenshot failed — ${err.message}`);
  }
}

writeFileSync(
  `${OUT_DIR}/console.txt`,
  [
    `=== Console errors ===`,
    ...consoleErrors,
    "",
    `=== Failed requests ===`,
    ...requestFailures,
  ].join("\n"),
);

console.log(`\nDone. Output in ${OUT_DIR}`);
console.log(`  Console errors: ${consoleErrors.length}`);
console.log(`  Failed requests: ${requestFailures.length}`);

await browser.close();
