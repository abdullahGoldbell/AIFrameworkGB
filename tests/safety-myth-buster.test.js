const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage includes an accessible AI safety myth buster for beginners", () => {
  assert.match(html, /<section class="section" id="ai-safety-myth-buster"/);
  assert.match(html, /<li><a href="#ai-safety-myth-buster">Myths<\/a><\/li>/);
  assert.match(html, /<a href="#ai-safety-myth-buster" class="mobile-link">Myths<\/a>/);
  assert.match(html, /role="radiogroup" aria-label="Common AI safety myths"/);
  assert.match(html, /data-myth-option="sounds-final"/);
  assert.match(html, /data-myth-option="public-tool"/);
  assert.match(html, /data-myth-option="more-context"/);
  assert.match(html, /id="myth-buster-feedback"[^>]*aria-live="polite"/);
  assert.match(html, /function chooseSafetyMyth\(mythId\)/);
  assert.match(html, /AI_SAFETY_MYTHS/);
  assert.match(html, /Safer workplace habit/);
  assert.match(html, /Use placeholders and approved tools before sharing work context/);
});
