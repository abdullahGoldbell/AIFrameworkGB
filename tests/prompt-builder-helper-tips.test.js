const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

test("prompt builder explains each choice with beginner helper tips", () => {
  assert.match(html, /class="builder-helper-tips"[^>]*aria-label="Why each prompt choice matters"/);
  assert.match(html, /id="builder-role-help"/);
  assert.match(html, /id="builder-task-help"/);
  assert.match(html, /id="builder-tone-help"/);
  assert.match(html, /id="builder-format-help"/);
  assert.match(html, /id="builder-context-help"/);
  assert.match(html, /select id="builder-role"[^>]*aria-describedby="builder-role-help"/);
  assert.match(html, /select id="builder-task"[^>]*aria-describedby="builder-task-help"/);
  assert.match(html, /select id="builder-tone"[^>]*aria-describedby="builder-tone-help"/);
  assert.match(html, /select id="builder-format"[^>]*aria-describedby="builder-format-help"/);
  assert.match(html, /<strong>Role<\/strong> tells AI which perspective to use/);
  assert.match(html, /<strong>Task<\/strong> makes the expected action explicit/);
  assert.match(html, /<strong>Tone<\/strong> controls how the answer should sound/);
  assert.match(html, /<strong>Format<\/strong> reduces rework by asking for the shape you need/);
});
