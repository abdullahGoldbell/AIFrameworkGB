// One-shot transform: move the inline `<style>...</style>` block from
// index.html into src/styles/main.css and replace it with a single
// `<link rel="stylesheet" href="/src/styles/main.css">` so Vite can
// minify, hash, and HTTP-cache it as a separate asset.
//
// Idempotent: if no `<style>` block remains, this is a no-op.
//
// Why we overwrite src/styles/main.css instead of merging:
//   The pre-existing main.css was a stale snapshot from a prior modular
//   refactor. The inline `<style>` in index.html is the live source of
//   truth (it has all the new section styles added since). Overwriting
//   gives us the current production CSS in one trip.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const HTML_PATH = join(ROOT, "index.html");
const CSS_PATH = join(ROOT, "src", "styles", "main.css");

const html = readFileSync(HTML_PATH, "utf8");

// Find the unique top-of-document `<style>` block. It's at indent 4 spaces
// (inside `<head>`), and there's only one, so we match anchored lines.
const styleOpenRe = /(?:^|\n)( {4})<style>\n/;
const openMatch = html.match(styleOpenRe);
if (!openMatch) {
  console.warn("[extract-inline-css] No `<style>` block in index.html — skipping.");
  process.exit(0);
}

const indent = openMatch[1];
const openIdx = openMatch.index + (openMatch[0].startsWith("\n") ? 1 : 0);
const innerStart = openIdx + openMatch[0].slice(openMatch[0].startsWith("\n") ? 1 : 0).length;

const closeMarker = `\n${indent}</style>`;
const closeIdx = html.indexOf(closeMarker, innerStart);
if (closeIdx === -1) {
  console.error("[extract-inline-css] Could not find matching `</style>`.");
  process.exit(1);
}

const innerCss = html.slice(innerStart, closeIdx);

// Dedent: every line is prefixed with `indent + "  "` (style block is
// indented one level deeper than the tag itself). Strip that to give
// well-formed standalone CSS.
const dedentRe = new RegExp(`^${indent}  ?`, "gm");
const css = innerCss.replace(dedentRe, "").trim() + "\n";

mkdirSync(dirname(CSS_PATH), { recursive: true });
writeFileSync(CSS_PATH, css);

const replacement = `${indent}<link rel="stylesheet" href="/src/styles/main.css" />`;
const before = html.slice(0, openIdx);
const after = html.slice(closeIdx + closeMarker.length);
// Find and consume the trailing newline that lived after `</style>`.
const next = before + replacement + after;

writeFileSync(HTML_PATH, next);

const removed = html.length - next.length;
console.log(
  `[extract-inline-css] Moved ${(innerCss.length / 1024).toFixed(1)} KB of inline CSS into src/styles/main.css.\n` +
    `  index.html: ${html.length} → ${next.length} bytes (saved ${(removed / 1024).toFixed(1)} KB).\n` +
    `  CSS file:   ${css.length} bytes.`,
);
