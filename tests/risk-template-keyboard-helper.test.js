const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("safe prompt template tabs explain risk choice and support keyboard navigation", () => {
  assert.match(html, /id="risk-template-choice-helper"/);
  assert.match(html, /Which risk level should I choose\?/);
  assert.match(html, /Low = public learning/);
  assert.match(html, /Medium = internal work after placeholders/);
  assert.match(html, /High = confidential, regulated, or personal data/);
  assert.match(html, /aria-describedby="risk-template-choice-helper"/);
  assert.match(html, /function handleRiskTemplateKeydown\(event\)/);
  assert.match(html, /\['ArrowRight', 'ArrowDown'\]/);
  assert.match(html, /\['ArrowLeft', 'ArrowUp'\]/);
  assert.match(html, /event\.key === 'Home'/);
  assert.match(html, /event\.key === 'End'/);
  assert.match(html, /nextTab\.focus\(\)/);
});
