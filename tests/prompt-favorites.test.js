const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('prompt library includes a persistent beginner favorites tray', () => {
  assert.match(html, /id="prompt-favorites-tray"[^>]*aria-live="polite"/);
  assert.match(html, /Save useful prompts here as your beginner practice list/);
  assert.match(html, /AI_SPARK_FAVORITE_PROMPTS/);
  assert.match(html, /function togglePromptFavorite\(btn, id\)/);
  assert.match(html, /function renderFavoritePrompts\(\)/);
  assert.match(html, /localStorage\.setItem\(FAVORITE_PROMPTS_STORAGE_KEY/);
  assert.match(html, /data-favorite-prompt/);
  assert.match(html, /aria-pressed="\$\{isFavorite\}"/);
  assert.match(html, /Saved to your prompt favorites/);
});
