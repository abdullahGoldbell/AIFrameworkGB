const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('homepage includes keyboard-accessible beginner workflow scenario tabs', () => {
  assert.match(html, /<section class="section" id="beginner-scenarios"/);
  assert.match(html, /<li><a href="#beginner-scenarios">Scenarios<\/a><\/li>/);
  assert.match(html, /<a href="#beginner-scenarios" class="mobile-link">Scenarios<\/a>/);
  assert.match(html, /role="tablist" aria-label="Beginner AI workflow scenarios"/);
  assert.match(html, /data-scenario-tab="email"/);
  assert.match(html, /data-scenario-tab="meeting"/);
  assert.match(html, /data-scenario-tab="spreadsheet"/);
  assert.match(html, /data-scenario-tab="policy"/);
  assert.match(html, /id="scenario-panel"[^>]*role="tabpanel"/);
  assert.match(html, /const BEGINNER_SCENARIOS = \[/);
  assert.match(html, /function selectScenario\(scenarioId, focusTab = false\)/);
  assert.match(html, /function handleScenarioKeydown\(event, scenarioId\)/);
});
