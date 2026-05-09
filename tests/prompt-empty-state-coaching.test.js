const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('prompt library empty state coaches beginners toward safe searches and reset paths', () => {
  assert.match(html, /id="pm-empty"[^>]*aria-live="polite"/);
  assert.match(html, /No prompts found yet — let’s get you unstuck/);
  assert.match(html, /Try beginner-safe searches/);
  assert.match(html, /data-empty-search="email"/);
  assert.match(html, /data-empty-search="meeting"/);
  assert.match(html, /data-empty-search="summary"/);
  assert.match(html, /Use anonymized words like “client update” instead of real names/);
  assert.match(html, /function applyEmptySearchSuggestion\(term\)/);
  assert.match(html, /pmSearch = term/);
  assert.match(html, /document\.getElementById\('pm-search'\)\.value = term/);
});
