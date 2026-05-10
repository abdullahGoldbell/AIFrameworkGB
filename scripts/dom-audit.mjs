// Automated DOM/layout audit — looks for visible anomalies that suggest a
// layout bug (e.g. an element that's much taller than its visible content,
// horizontal overflow, hidden-but-space-occupying nodes).

import { chromium } from "@playwright/test";

const URL = process.env.URL || "http://127.0.0.1:4173/";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

await page.goto(URL, { waitUntil: "networkidle" });

// Anomaly checks run in the page so we can use computed styles + bounding rects.
// The function body executes in the browser, so the `getComputedStyle` global
// is provided by the page — eslint runs on this source under node and would
// otherwise flag those references.
/* global getComputedStyle */
const findings = await page.evaluate(() => {
  const out = [];

  const trim = (s, n = 60) => (s.length > n ? s.slice(0, n) + "…" : s);

  // 1. Elements that have height > 4× their visible content height.
  //    Heuristic: cards with collapsed-but-space-occupying inner content.
  const scanContainers = document.querySelectorAll(
    [
      ".nl-card",
      ".pm-card",
      ".story-card",
      ".feature-card",
      ".step-item",
      ".faq-item",
      ".scenario-card",
      ".checklist-item",
      ".risk-template",
      ".tryit-card",
      ".tryit-step",
    ].join(","),
  );
  for (const el of scanContainers) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    // Sum the visible heights of direct text-bearing children.
    let visibleChildSum = 0;
    let totalChildren = 0;
    for (const child of el.children) {
      const cs = getComputedStyle(child);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const r = child.getBoundingClientRect();
      if (r.height === 0) continue;
      // Skip absolutely-positioned overlays.
      if (cs.position === "absolute" || cs.position === "fixed") continue;
      visibleChildSum += r.height;
      totalChildren += 1;
    }
    // If the container is dramatically taller than its visible children,
    // something invisible is reserving space.
    const ratio = visibleChildSum > 0 ? rect.height / visibleChildSum : Infinity;
    if (rect.height > 280 && ratio > 1.4 && totalChildren > 0) {
      out.push({
        kind: "tall-container",
        selector: el.className.toString().split(" ").slice(0, 3).join("."),
        height: Math.round(rect.height),
        visibleChildSum: Math.round(visibleChildSum),
        ratio: ratio.toFixed(2),
        sampleText: trim(el.textContent.replace(/\s+/g, " ").trim()),
      });
    }
  }

  // 2. Horizontal overflow detector — anything that scrolls past viewport.
  const docWidth = document.documentElement.clientWidth;
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.right > docWidth + 1 && r.width > 8 && r.height > 8) {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.position === "absolute") continue;
      const tag = el.tagName.toLowerCase();
      const id = el.id ? `#${el.id}` : "";
      const classes = el.className.toString
        ? el.className.toString().split(" ").filter(Boolean).slice(0, 2).join(".")
        : "";
      out.push({
        kind: "h-overflow",
        selector: `${tag}${id}${classes ? "." + classes : ""}`,
        right: Math.round(r.right),
        docWidth,
      });
      // Cap to avoid spamming: most h-overflow comes from a few culprit roots.
      if (out.filter((x) => x.kind === "h-overflow").length > 6) break;
    }
  }

  // 3. Buttons / links missing an accessible name.
  const interactive = document.querySelectorAll("button, a, [role='button']");
  let unnamed = 0;
  for (const el of interactive) {
    const text = el.textContent.trim();
    const aria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");
    const title = el.getAttribute("title");
    if (!text && !aria && !title) {
      unnamed += 1;
      if (unnamed <= 5) {
        out.push({
          kind: "no-accessible-name",
          tag: el.tagName.toLowerCase(),
          html: trim(el.outerHTML),
        });
      }
    }
  }
  if (unnamed > 5) out.push({ kind: "no-accessible-name-overflow", more: unnamed - 5 });

  // 4. Images missing alt text.
  let noAlt = 0;
  for (const img of document.querySelectorAll("img")) {
    if (!img.hasAttribute("alt")) {
      noAlt += 1;
      if (noAlt <= 5) out.push({ kind: "img-missing-alt", src: img.getAttribute("src") || "" });
    }
  }
  if (noAlt > 5) out.push({ kind: "img-missing-alt-overflow", more: noAlt - 5 });

  // 5. Headings with empty content (rare but breaks SR users).
  for (const h of document.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
    if (!h.textContent.trim()) {
      out.push({ kind: "empty-heading", tag: h.tagName.toLowerCase() });
    }
  }

  return out;
});

await browser.close();

console.log("=== DOM AUDIT FINDINGS ===");
console.log(JSON.stringify(findings, null, 2));
console.log(`\n=== Console errors (${consoleErrors.length}) ===`);
console.log(consoleErrors.join("\n"));
