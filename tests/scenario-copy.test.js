const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("beginner scenario prompts include accessible copy controls with fallback messaging", () => {
  assert.match(html, /data-scenario-copy/);
  assert.match(html, /onclick="copyScenarioPrompt\(this\)"/);
  assert.match(html, /aria-describedby="scenario-copy-status"/);
  assert.match(html, /id="scenario-copy-status"[^>]*aria-live="polite"/);
  assert.match(html, /function copyScenarioPrompt\(btn\)/);
  assert.match(html, /function writeClipboardText\(text\)/);
  assert.match(html, /document\.execCommand\('copy'\)/);
  assert.match(html, /Starter prompt copied — paste it into your approved AI tool/);
});
