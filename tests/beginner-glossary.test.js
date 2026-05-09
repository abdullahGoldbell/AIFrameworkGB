const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("homepage includes an accessible beginner AI glossary explorer", () => {
  assert.match(html, /<section class="section" id="beginner-glossary"/);
  assert.match(html, /<li><a href="#beginner-glossary">Glossary<\/a><\/li>/);
  assert.match(html, /<a href="#beginner-glossary" class="mobile-link">Glossary<\/a>/);
  assert.match(html, /id="glossary-term-panel"[^>]*aria-live="polite"/);
  assert.match(html, /data-glossary-term="prompt"/);
  assert.match(html, /data-glossary-term="hallucination"/);
  assert.match(html, /data-glossary-term="context"/);
  assert.match(html, /function selectGlossaryTerm\(termId\)/);
  assert.match(html, /aria-pressed="\$\{term.id === activeGlossaryTerm\}"/);
});
