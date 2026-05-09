const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('homepage includes an interactive prompt comparison tool for beginners', () => {
  assert.match(html, /id="prompt-comparison-tool"[^>]*aria-live="polite"/);
  assert.match(html, /What changed\? Prompt comparison/);
  assert.match(html, /Weak prompt/);
  assert.match(html, /Improved prompt/);
  assert.match(html, /data-comparison-toggle="role"/);
  assert.match(html, /data-comparison-toggle="context"/);
  assert.match(html, /data-comparison-toggle="format"/);
  assert.match(html, /function updatePromptComparison\(\)/);
  assert.match(html, /comparison-prompt-output/);
  assert.match(html, /Role adds the point of view/);
  assert.match(html, /Context narrows the situation without exposing private details/);
  assert.match(html, /Format tells AI what shape to return/);
});
