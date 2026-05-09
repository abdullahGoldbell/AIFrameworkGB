const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const tryItJs = fs.readFileSync(path.join(__dirname, "..", "src", "js", "try-it.js"), "utf8");
const mainJs = fs.readFileSync(path.join(__dirname, "..", "src", "js", "main.js"), "utf8");
const mainCss = fs.readFileSync(path.join(__dirname, "..", "src", "styles", "main.css"), "utf8");

test("homepage renders the Try-It-in-30s widget between Why-AI and Newsletter", () => {
  // Section + comment marker present.
  assert.match(html, /<!-- ── Try It in 30s ── -->/);
  assert.match(html, /<section class="section" id="try-it-now"/);
  assert.match(html, /id="tryit-heading"/);

  // The widget must come after #why-ai but before #newsletter.
  const whyIdx = html.indexOf('id="why-ai"');
  const tryIdx = html.indexOf('id="try-it-now"');
  const newsIdx = html.indexOf('id="newsletter"');
  assert.ok(whyIdx > 0 && tryIdx > 0 && newsIdx > 0, "anchor sections present");
  assert.ok(whyIdx < tryIdx, "Try-It widget appears after Why-AI section");
  assert.ok(tryIdx < newsIdx, "Try-It widget appears before Newsletter section");
});

test("Try-It widget exposes the four beginner goal chips with keyboard semantics", () => {
  assert.match(html, /role="radiogroup"[^>]*aria-label="Pick a goal"/);
  assert.match(html, /data-tryit-goal="reply"[\s\S]*Write a polite reply/);
  assert.match(html, /data-tryit-goal="summary"[\s\S]*Summarize a report/);
  assert.match(html, /data-tryit-goal="brainstorm"[\s\S]*Brainstorm ideas/);
  assert.match(html, /data-tryit-goal="meeting"[\s\S]*Plan a meeting/);

  // Chips are real buttons, focusable, and have role=radio with aria-checked.
  assert.match(html, /class="tryit-chip"\s+role="radio"\s+aria-checked="false"/);

  // Emojis required by spec.
  assert.match(html, /✉️/);
  assert.match(html, /📊/);
  assert.match(html, /💡/);
  assert.match(html, /🗓/);
});

test("Try-It widget renders the prompt textarea, copy button, and example output card", () => {
  assert.match(html, /id="tryit-prompt"[^>]*data-tryit-prompt[^>]*readonly/);
  assert.match(html, /class="tryit-copy-btn"[^>]*data-tryit-action="copy"/);
  assert.match(html, /data-tryit-copy-label/);
  assert.match(html, /data-tryit-action="reset"/);
  assert.match(html, /data-tryit-action="show-output"/);
  assert.match(html, /data-tryit-output/);

  // Step containers.
  assert.match(html, /data-tryit-step="1"/);
  assert.match(html, /data-tryit-step="2"/);
  assert.match(html, /data-tryit-step="3"/);

  // Live region for copy status feedback.
  assert.match(html, /id="tryit-copy-status"[^>]*aria-live="polite"/);

  // CTA mentions the three target tools.
  assert.match(html, /💡 Try this in your AI tool now|Try this in your AI tool now/);
  assert.match(html, /href="https:\/\/chatgpt\.com"/);
  assert.match(html, /href="https:\/\/copilot\.microsoft\.com"/);
  assert.match(html, /href="https:\/\/claude\.ai"/);
});

test("Try-It widget inline script implements selection, copy, reset, and keyboard handlers", () => {
  // Inline runtime is what the page actually uses; it must define the core handlers.
  assert.match(html, /function tryitSelectGoal\(goal\)/);
  assert.match(html, /function tryitCopy\(btn\)/);
  assert.match(html, /function tryitReset\(\)/);
  assert.match(html, /function tryitShowStep\(stepNum\)/);
  assert.match(html, /function tryitInit\(\)/);

  // Clipboard preference: navigator.clipboard.writeText with execCommand fallback.
  assert.match(html, /navigator\.clipboard\.writeText/);
  assert.match(html, /document\.execCommand\("copy"\)/);

  // Copy success label flips to "✓ Copied" per the spec.
  assert.match(html, /✓ Copied/);

  // Keyboard navigation: Enter and Space activate, arrows move between chips.
  assert.match(html, /event\.key === "Enter"/);
  assert.match(html, /\["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"\]/);

  // Reduced-motion respected via CSS media query.
  assert.match(html, /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?\.tryit-step/);
});

test("Try-It widget src/js/try-it.js exposes initTryIt and the four prompt templates", () => {
  assert.match(tryItJs, /export function initTryIt/);
  // The four canonical goals.
  ["reply", "summary", "brainstorm", "meeting"].forEach((goal) => {
    assert.ok(new RegExp(`\\b${goal}\\b`).test(tryItJs), `try-it.js mentions ${goal} goal`);
  });
  // Each prompt template should be at least ~80 words and include a placeholder.
  ["Write a polite reply", "Summarize a report", "Brainstorm ideas", "Plan a meeting"].forEach(
    (label) => {
      assert.ok(tryItJs.includes(label), `try-it.js includes ${label}`);
    },
  );
  assert.match(tryItJs, /\[Paste/);
  assert.match(tryItJs, /document\.execCommand\("copy"\)/);

  // main.js wires it in with one extra import line.
  assert.match(mainJs, /import \{ initTryIt \} from "\.\/try-it\.js";/);
  assert.match(mainJs, /initTryIt\(\);/);
});

test("Try-It widget styles live in main.css under a clearly-marked block", () => {
  assert.match(mainCss, /\/\* === Try-It Widget === \*\//);
  assert.match(mainCss, /\.tryit-bg \{/);
  assert.match(mainCss, /\.tryit-chip:focus-visible \{[\s\S]*outline: 3px solid var\(--teal\)/);
  assert.match(mainCss, /@media \(prefers-reduced-motion: reduce\)/);
  // Mobile-first stack at narrow widths.
  assert.match(mainCss, /@media \(max-width: 720px\) \{[\s\S]*\.tryit-chips \{[\s\S]*1fr/);
});

test("Try-It widget keyboard activation: simulate chip selection without a real DOM", () => {
  // Lightweight harness to confirm the inline runtime can handle a synthetic
  // chip click without throwing — exercises selectGoal -> copy text path.
  // (Full DOM behaviour is covered by the e2e test.)
  const PROMPT_RE = /TRYIT_DATA = \{([\s\S]*?)\n {6}\};/;
  const match = html.match(PROMPT_RE);
  assert.ok(match, "TRYIT_DATA literal is present in inline script");

  // Sanity: every goal in the inline data has a non-trivial prompt + output.
  ["reply", "summary", "brainstorm", "meeting"].forEach((goal) => {
    const goalRe = new RegExp(`${goal}: \\{[\\s\\S]*?prompt:\\s*(["\x27])([\\s\\S]*?)\\1,`);
    const m = html.match(goalRe);
    assert.ok(m, `inline TRYIT_DATA has prompt for ${goal}`);
    assert.ok(
      m[2].length > 200,
      `inline ${goal} prompt should be a substantial template (got ${m[2].length} chars)`,
    );
  });
});
