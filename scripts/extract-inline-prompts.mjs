// One-time-ish utility: read index.html, extract the inline `const PROMPTS = [...]`
// literal (which is a JS array literal, not JSON), evaluate it in a sandbox,
// and write the result to public/data/prompt-library.json so the page can
// fetch it lazily instead of carrying it inline (~12k lines of JS).
//
// Idempotent: running this script after the inline array has been removed
// from index.html is a no-op (logs a warning).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const HTML_PATH = join(ROOT, "index.html");
const OUT_PATH = join(ROOT, "public", "data", "prompt-library.json");

const html = readFileSync(HTML_PATH, "utf8");

// Locate the start of the inline `const PROMPTS = [` literal.
const startMarker = /const PROMPTS\s*=\s*\[/g;
const startMatch = startMarker.exec(html);

if (!startMatch) {
  console.warn(
    "[extract-inline-prompts] No `const PROMPTS = [` found in index.html — skipping (already extracted?).",
  );
  process.exit(0);
}

// `bracketStart` points at the opening `[` of the array literal.
const bracketStart = startMatch.index + startMatch[0].length - 1;

// Walk the array literal char-by-char, tracking string/template/comment state
// and bracket depth, so we find the matching closing `]`.
const findArrayEnd = (source, openIdx) => {
  let depth = 0;
  let i = openIdx;
  let inString = null; // null | '"' | "'" | "`"
  let inLineComment = false;
  let inBlockComment = false;
  let escapeNext = false;

  while (i < source.length) {
    const ch = source[i];
    const next = source[i + 1];

    if (escapeNext) {
      escapeNext = false;
      i += 1;
      continue;
    }

    if (inLineComment) {
      if (ch === "\n") inLineComment = false;
      i += 1;
      continue;
    }
    if (inBlockComment) {
      if (ch === "*" && next === "/") {
        inBlockComment = false;
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }

    if (inString) {
      if (ch === "\\") {
        escapeNext = true;
        i += 1;
        continue;
      }
      if (ch === inString) {
        inString = null;
        i += 1;
        continue;
      }
      // Inside a template string, `${` opens an expression but the inline
      // PROMPTS data only uses plain template strings without interpolation,
      // so we don't need to recurse here. Treat as plain text.
      i += 1;
      continue;
    }

    if (ch === "/" && next === "/") {
      inLineComment = true;
      i += 2;
      continue;
    }
    if (ch === "/" && next === "*") {
      inBlockComment = true;
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      i += 1;
      continue;
    }
    if (ch === "[") {
      depth += 1;
      i += 1;
      continue;
    }
    if (ch === "]") {
      depth -= 1;
      if (depth === 0) return i;
      i += 1;
      continue;
    }
    i += 1;
  }
  throw new Error("Could not find matching closing `]` for inline PROMPTS array");
};

const bracketEnd = findArrayEnd(html, bracketStart);
const literal = html.slice(bracketStart, bracketEnd + 1);

// Evaluate the array literal in a fresh VM context — no globals, no IO.
const promptsArray = runInNewContext(`(${literal})`, {});

if (!Array.isArray(promptsArray)) {
  console.error("[extract-inline-prompts] Evaluated value is not an array, refusing to write.");
  process.exit(1);
}

// Sanity check on shape.
const expectedKeys = ["id", "title", "category", "source", "module", "prompt"];
const sample = promptsArray[0] ?? {};
const missing = expectedKeys.filter((key) => !(key in sample));
if (missing.length) {
  console.warn(
    "[extract-inline-prompts] First entry missing expected keys:",
    missing,
    "— writing anyway, but verify shape.",
  );
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, JSON.stringify(promptsArray));

console.log(
  `[extract-inline-prompts] Wrote ${promptsArray.length} prompts to ${OUT_PATH} (${(JSON.stringify(promptsArray).length / 1024).toFixed(1)} KB).`,
);
