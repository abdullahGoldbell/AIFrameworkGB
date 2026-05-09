const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('prompt library includes a beginner practice mode walkthrough', () => {
  assert.match(html, /id="prompt-practice-mode"[^>]*aria-live="polite"/);
  assert.match(html, /Practice mode: one safe prompt at a time/);
  assert.match(html, /data-practice-step="try"/);
  assert.match(html, /data-practice-step="copy"/);
  assert.match(html, /data-practice-step="review"/);
  assert.match(html, /function getBeginnerPracticePrompts\(\)/);
  assert.match(html, /function renderPracticePrompt\(\)/);
  assert.match(html, /function nextPracticePrompt\(\)/);
  assert.match(html, /function copyPracticePrompt\(btn\)/);
  assert.match(html, /pmDifficulty = 'Beginner'/);
  assert.match(html, /Review before sending: check facts, tone, assumptions, and confidentiality/);
});
