import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.env.URL || "http://localhost:5174/";
const tag = process.argv[2] || "after";
const viewport = process.argv[3] || "360";
mkdirSync("/tmp", { recursive: true });

const sizes = {
  "360": { width: 360, height: 640 },
  "768": { width: 768, height: 1024 },
};
const vp = sizes[viewport] || sizes["360"];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2 });

async function shoot(theme, sectionId, label) {
  // fresh page per shot to avoid state leak
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
  await page.waitForTimeout(400);

  if (sectionId === "hero") {
    await page.evaluate(() => window.scrollTo(0, 0));
  } else if (sectionId === "footer-area") {
    // First scroll to footer to make sure all content is loaded then to bottom.
    await page.evaluate(() => {
      const f = document.getElementById('footer');
      if (f) f.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  } else {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, sectionId);
  }
  await page.waitForTimeout(800);
  const path = `/tmp/mobile-${theme}-${label}-${tag}.png`;
  await page.screenshot({ path, fullPage: false });
  console.log(`saved ${path}  scrollY=${await page.evaluate(() => window.scrollY)}`);
  await page.close();
}

async function audit(theme) {
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
  await page.waitForTimeout(300);

  // hscroll
  const r = await page.evaluate(() => {
    const w = document.documentElement.scrollWidth;
    const cw = document.documentElement.clientWidth;
    const off = [];
    document.querySelectorAll("*").forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.right > cw + 1 || b.left < -1) {
        off.push({
          t: el.tagName,
          c: (el.className || "").toString().slice(0, 60),
          l: Math.round(b.left),
          rr: Math.round(b.right),
        });
      }
    });
    return { w, cw, off: off.slice(0, 25) };
  });
  console.log(`[${theme}] scrollWidth=${r.w} clientWidth=${r.cw} offenders=${r.off.length}`);
  r.off.forEach((o) => console.log(`   - ${o.t} ${o.c} [${o.l},${o.rr}]`));

  // tap targets
  const tt = await page.evaluate(() => {
    const SEL = [
      ".theme-toggle",
      ".nav-mobile-btn",
      ".pm-expand-btn",
      ".pm-copy-btn",
      ".pm-cat-chip",
      ".pm-diff-chip",
      ".risk-template-tab",
      ".review-trigger",
      ".scroll-top",
      ".m-cta-bar a",
      ".btn",
      ".m-collapsible > summary",
    ];
    const small = [];
    SEL.forEach((s) => {
      document.querySelectorAll(s).forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 && b.height === 0) return;
        if (b.width < 44 || b.height < 44) {
          small.push({ s, w: Math.round(b.width), h: Math.round(b.height) });
        }
      });
    });
    return small.slice(0, 20);
  });
  if (tt.length) {
    console.log(`[${theme}] tap-target offenders (<44):`);
    tt.forEach((o) => console.log(`   - ${o.s} ${o.w}x${o.h}`));
  } else {
    console.log(`[${theme}] all sampled tap targets >= 44`);
  }
  await page.close();
}

await audit("light");
await audit("dark");

for (const theme of ["light", "dark"]) {
  for (const [section, label] of [
    ["hero", "hero"],
    ["learning-path", "learning"],
    ["prompt-master", "prompts"],
    ["footer-area", "footer"],
  ]) {
    await shoot(theme, section, label);
  }
}

await browser.close();
console.log("done");
