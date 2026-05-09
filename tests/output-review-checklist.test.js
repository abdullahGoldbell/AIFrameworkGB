const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage includes an accessible AI output review checklist accordion", () => {
  assert.match(html, /<section class="section" id="output-review-checklist"/);
  assert.match(html, /<li><a href="#output-review-checklist">Review<\/a><\/li>/);
  assert.match(html, /<a href="#output-review-checklist" class="mobile-link">Review<\/a>/);
  assert.match(html, /class="review-accordion" aria-label="AI output review checklist"/);
  assert.match(html, /data-review-panel="facts"/);
  assert.match(html, /data-review-panel="tone"/);
  assert.match(html, /data-review-panel="assumptions"/);
  assert.match(html, /data-review-panel="confidentiality"/);
  assert.match(html, /aria-expanded="true" aria-controls="review-panel-facts"/);
  assert.match(html, /id="review-panel-facts" role="region"/);
  assert.match(html, /function toggleReviewChecklist\(panelId\)/);
  assert.match(html, /Verify facts before forwarding/);
  assert.match(html, /Do not paste secrets, customer data, or private HR details/);
});
