const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage includes a persistent beginner progress checklist", () => {
  assert.match(html, /<section class="section" id="beginner-checklist"/);
  assert.match(html, /<li><a href="#beginner-checklist">Checklist<\/a><\/li>/);
  assert.match(html, /<a href="#beginner-checklist" class="mobile-link">Checklist<\/a>/);
  assert.match(html, /id="beginner-checklist-progress"[^>]*aria-live="polite"/);
  assert.match(html, /data-checklist-action="try-prompt-builder"/);
  assert.match(html, /data-checklist-action="copy-safe-prompt"/);
  assert.match(html, /data-checklist-action="review-ai-output"/);
  assert.match(html, /const CHECKLIST_STORAGE_KEY = 'ai-spark-beginner-checklist'/);
  assert.match(html, /function toggleChecklistItem\(itemId, checked\)/);
  assert.match(html, /localStorage\.setItem\(CHECKLIST_STORAGE_KEY/);
});
