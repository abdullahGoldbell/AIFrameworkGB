const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage includes a beginner AI task decision helper", () => {
  assert.match(html, /<section class="section" id="task-decision-helper"/);
  assert.match(html, /<li><a href="#task-decision-helper">Start<\/a><\/li>/);
  assert.match(html, /<a href="#task-decision-helper" class="mobile-link">Start<\/a>/);
  assert.match(html, /class="decision-helper" aria-label="Choose your beginner AI starting point"/);
  assert.match(html, /id="decision-goal"/);
  assert.match(html, /id="decision-risk"/);
  assert.match(html, /id="decision-recommendation" aria-live="polite"/);
  assert.match(html, /data-decision-link="#first-prompt-builder"/);
  assert.match(html, /data-decision-link="#output-review-checklist"/);
  assert.match(html, /function updateDecisionHelper\(\)/);
  assert.match(html, /Start with the prompt builder/);
  assert.match(html, /Review confidentiality first/);
});
