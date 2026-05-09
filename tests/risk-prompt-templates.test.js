const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('homepage includes beginner safe prompt templates by risk level', () => {
  assert.match(html, /id="safe-prompt-templates"/);
  assert.match(html, /Safe prompt templates by risk level/);
  assert.match(html, /role="tablist"[^>]*aria-label="Choose a prompt safety level"/);
  assert.match(html, /data-risk-template="low"/);
  assert.match(html, /data-risk-template="medium"/);
  assert.match(html, /data-risk-template="high"/);
  assert.match(html, /Low risk/);
  assert.match(html, /Medium risk/);
  assert.match(html, /High risk/);
  assert.match(html, /Use placeholders before AI sees the work/);
  assert.match(html, /Do not paste customer, HR, finance, legal, or personal data/);
  assert.match(html, /id="risk-template-prompt"/);
  assert.match(html, /function selectRiskTemplate\(level\)/);
  assert.match(html, /function copyRiskTemplate\(btn\)/);
  assert.match(html, /aria-live="polite"/);
});
