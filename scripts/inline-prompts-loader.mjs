// One-shot transform: replace the inline `const PROMPTS = [...]` literal in
// index.html with a `let PROMPTS = [];` stub + a lazy `loadPromptLibrary`
// fetcher that pulls data from /data/prompt-library.json on demand.
//
// Idempotent: if the inline array is already gone, this is a no-op.
//
// Run AFTER scripts/extract-inline-prompts.mjs has produced the JSON, so the
// page never ships without its data.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const HTML_PATH = join(ROOT, "index.html");

const html = readFileSync(HTML_PATH, "utf8");

// Find `const PROMPTS = [` (the literal). If it's already been replaced by
// `let PROMPTS`, exit early.
const startMarker = /(\s*)const PROMPTS\s*=\s*\[/;
const startMatch = html.match(startMarker);

if (!startMatch) {
  console.warn("[inline-prompts-loader] Inline `const PROMPTS = [` not found — skipping.");
  process.exit(0);
}

const indent = startMatch[1].replace(/^\n/, "") || "      ";
const startIdx = startMatch.index + startMatch[1].length;
const bracketStart = html.indexOf("[", startIdx);

// Walk to the matching `]`.
const findArrayEnd = (source, openIdx) => {
  let depth = 0;
  let i = openIdx;
  let inString = null;
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
  throw new Error("[inline-prompts-loader] Could not find closing `]` for inline PROMPTS array");
};

const bracketEnd = findArrayEnd(html, bracketStart);

// The literal ends at `]` followed (on same/next line) by `;`. Consume the
// trailing `;` so we don't leave a dangling semicolon.
let cutEnd = bracketEnd + 1;
while (cutEnd < html.length && /[\s;]/.test(html[cutEnd])) {
  if (html[cutEnd] === ";") {
    cutEnd += 1;
    break;
  }
  cutEnd += 1;
}

// New stub: lazy-loader. Keeps the same `PROMPTS` global so all downstream
// code (renderPmGrid, buildCategoryChips, favorites, etc.) is unchanged.
const stub = `let PROMPTS = [];
${indent}let __promptsLoaded = false;
${indent}let __promptsLoadingPromise = null;
${indent}// Show a friendly loading state in the prompt library while data is in flight.
${indent}function __setPromptLibraryLoading(state) {
${indent}  const empty = document.getElementById("pm-empty");
${indent}  const grid = document.getElementById("pm-grid");
${indent}  const count = document.getElementById("pm-count");
${indent}  if (grid) grid.setAttribute("aria-busy", state === "loading" ? "true" : "false");
${indent}  if (state === "loading") {
${indent}    if (count) count.textContent = "…";
${indent}    if (empty) {
${indent}      empty.classList.add("visible");
${indent}      const title = empty.querySelector("h3");
${indent}      const body = empty.querySelector("p");
${indent}      if (title) title.textContent = "Loading prompt library…";
${indent}      if (body) body.textContent = "Fetching paste-ready prompts only when you need them.";
${indent}    }
${indent}  } else if (state === "error") {
${indent}    if (count) count.textContent = "0";
${indent}    if (empty) {
${indent}      empty.classList.add("visible");
${indent}      const title = empty.querySelector("h3");
${indent}      const body = empty.querySelector("p");
${indent}      if (title) title.textContent = "Prompt library unavailable";
${indent}      if (body) body.textContent = "Refresh the page or check your connection.";
${indent}    }
${indent}  }
${indent}}
${indent}function loadPromptLibrary() {
${indent}  if (__promptsLoaded) return Promise.resolve(PROMPTS);
${indent}  if (__promptsLoadingPromise) return __promptsLoadingPromise;
${indent}  __setPromptLibraryLoading("loading");
${indent}  const url = (typeof document !== "undefined" && document.documentElement.getAttribute("data-base"))
${indent}    ? document.documentElement.getAttribute("data-base") + "data/prompt-library.json"
${indent}    : "data/prompt-library.json";
${indent}  __promptsLoadingPromise = fetch(url, { cache: "force-cache" })
${indent}    .then(function (response) {
${indent}      if (!response.ok) throw new Error("prompt-library: " + response.status);
${indent}      return response.json();
${indent}    })
${indent}    .then(function (data) {
${indent}      PROMPTS = Array.isArray(data) ? data : [];
${indent}      __promptsLoaded = true;
${indent}      if (typeof buildCategoryChips === "function") buildCategoryChips();
${indent}      if (typeof renderPmGrid === "function") renderPmGrid();
${indent}      if (typeof renderPracticePrompt === "function") renderPracticePrompt();
${indent}      if (typeof renderFavoritePrompts === "function") renderFavoritePrompts();
${indent}      return PROMPTS;
${indent}    })
${indent}    .catch(function (err) {
${indent}      console.error("[prompt-library]", err);
${indent}      __promptsLoadingPromise = null;
${indent}      __setPromptLibraryLoading("error");
${indent}      return [];
${indent}    });
${indent}  return __promptsLoadingPromise;
${indent}}
${indent}// Kick off the fetch when the browser is idle, or right away on slow paths,
${indent}// or when the prompt-master section is about to enter the viewport.
${indent}function __schedulePromptLoad() {
${indent}  const trigger = function () { loadPromptLibrary(); };
${indent}  const target = document.getElementById("prompt-master");
${indent}  if (target && "IntersectionObserver" in window) {
${indent}    const io = new IntersectionObserver(function (entries) {
${indent}      entries.forEach(function (entry) {
${indent}        if (entry.isIntersecting) {
${indent}          io.disconnect();
${indent}          trigger();
${indent}        }
${indent}      });
${indent}    }, { rootMargin: "600px 0px" });
${indent}    io.observe(target);
${indent}  }
${indent}  if (typeof requestIdleCallback === "function") {
${indent}    requestIdleCallback(trigger, { timeout: 4000 });
${indent}  } else {
${indent}    setTimeout(trigger, 1500);
${indent}  }
${indent}  // Hash-link straight to #prompt-master shouldn't have to wait for idle.
${indent}  if (window.location && window.location.hash === "#prompt-master") trigger();
${indent}}
${indent}__schedulePromptLoad();`;

const before = html.slice(0, startIdx);
const after = html.slice(cutEnd);
const next = before + stub + after;

writeFileSync(HTML_PATH, next);

const removed = html.length - next.length;
console.log(
  `[inline-prompts-loader] Replaced inline PROMPTS array. Saved ~${(removed / 1024).toFixed(1)} KB from index.html (${html.length} → ${next.length} bytes).`,
);
