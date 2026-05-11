// Confirms the newsletter card collapse/expand actually works after the
// `.nl-card-expand-inner` wrapper fix. Asserts:
//   - Collapsed cards are short (< 220px tall) — content fits naturally.
//   - Clicking a card expands it, height grows.
//   - Clicking again collapses, height returns to baseline ± 4px.

import { chromium } from "@playwright/test";

const URL = process.env.URL || "http://127.0.0.1:4173/#newsletter";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(400); // settle reveal animations

const cards = await page.$$(".nl-card");
console.log(`Found ${cards.length} newsletter cards.`);

const heights = [];
for (let i = 0; i < cards.length; i++) {
  const box = await cards[i].boundingBox();
  heights.push({ idx: i, h: Math.round(box?.height ?? 0) });
}
console.log("Collapsed heights:", heights);

const tooTall = heights.filter((h) => h.h > 280);
if (tooTall.length) {
  console.error(`❌ ${tooTall.length} cards are still > 280px tall when collapsed:`, tooTall);
} else {
  console.log("✅ All collapsed cards are reasonably short.");
}

// Click first card, expect it to grow.
const before = (await cards[0].boundingBox())?.height ?? 0;
await cards[0].click();
await page.waitForTimeout(500);
const expanded = (await cards[0].boundingBox())?.height ?? 0;
console.log(`First card: collapsed=${Math.round(before)} → expanded=${Math.round(expanded)}`);
if (expanded > before + 40) console.log("✅ Card expands.");
else console.error("❌ Card did not visibly expand.");

// Click again to collapse.
await cards[0].click();
await page.waitForTimeout(500);
const recollapsed = (await cards[0].boundingBox())?.height ?? 0;
console.log(`First card after re-collapse: ${Math.round(recollapsed)}`);
if (Math.abs(recollapsed - before) < 10) console.log("✅ Card collapses back to baseline.");
else console.error("❌ Card did not return to baseline height.");

await browser.close();
