const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage includes an interactive first prompt builder for beginners", () => {
  assert.match(html, /<section class="section" id="first-prompt-builder"/);
  assert.match(html, /<li><a href="#first-prompt-builder">Builder<\/a><\/li>/);
  assert.match(html, /<a href="#first-prompt-builder" class="mobile-link">Builder<\/a>/);
  assert.match(html, /id="prompt-builder-output"[^>]*aria-live="polite"/);
  assert.match(html, /data-builder-field="role"/);
  assert.match(html, /data-builder-field="task"/);
  assert.match(html, /data-builder-field="tone"/);
  assert.match(html, /data-builder-field="format"/);
  assert.match(html, /function updatePromptBuilder\(\)/);
  assert.match(html, /function copyBuiltPrompt\(btn\)/);
  assert.match(
    html,
    /Review before using: remove confidential details and fact-check important claims\./,
  );
});
