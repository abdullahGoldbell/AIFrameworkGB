const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage includes accessible beginner AI terms flashcards practice mode", () => {
  assert.match(html, /<section class="section" id="ai-terms-flashcards"/);
  assert.match(html, /<li><a href="#ai-terms-flashcards">Flashcards<\/a><\/li>/);
  assert.match(html, /<a href="#ai-terms-flashcards" class="mobile-link">Flashcards<\/a>/);
  assert.match(html, /id="flashcard-practice-card"[^>]*aria-live="polite"/);
  assert.match(html, /data-flashcard-action="flip"/);
  assert.match(html, /data-flashcard-action="next"/);
  assert.match(html, /id="flashcard-progress"/);
  assert.match(html, /function renderFlashcard\(\)/);
  assert.match(html, /function flipFlashcard\(\)/);
  assert.match(html, /function nextFlashcard\(\)/);
  assert.match(html, /Use placeholders before sharing context/);
});
