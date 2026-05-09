const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('homepage includes an accessible AI confidence quiz for beginner safety habits', () => {
  assert.match(html, /<section class="section" id="ai-confidence-quiz"/);
  assert.match(html, /<li><a href="#ai-confidence-quiz">Quiz<\/a><\/li>/);
  assert.match(html, /<a href="#ai-confidence-quiz" class="mobile-link">Quiz<\/a>/);
  assert.match(html, /class="quiz-options" role="radiogroup" aria-label="AI confidence quiz answers"/);
  assert.match(html, /data-quiz-option="ask-first"/);
  assert.match(html, /data-quiz-option="paste-all"/);
  assert.match(html, /data-quiz-option="use-as-is"/);
  assert.match(html, /id="quiz-feedback"[^>]*aria-live="polite"/);
  assert.match(html, /function chooseQuizAnswer\(answerId\)/);
  assert.match(html, /const AI_CONFIDENCE_QUIZ = \{/);
  assert.match(html, /No personal data is stored/);
});
