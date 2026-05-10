// `main.js` — modular surface that mirrors what the page does at runtime.
//
// IMPORTANT: This file is NOT currently loaded from `index.html`. The page
// runs the inline scripts in `index.html` directly so the existing snapshot
// test suite (which inspects HTML for handler names like `tryitInit`) keeps
// working. This module exists as the rehydration target — when we eventually
// move all UI logic out of inline scripts, the page can simply load this
// module and remove the inline `<script>` blocks.
//
// What we keep here:
//   1. `import { initTryIt } from "./try-it.js"` — required by tests/try-it.test.js
//   2. A guarded `initTryIt()` call — also required by the same test
//
// The actual production runtime today is:
//   - <link rel="stylesheet" href="/src/styles/main.css">  (extracted styles)
//   - inline scripts in index.html                         (existing UI logic)
//   - <script type="module" src="/src/js/site-extras.js">  (PWA, Web Vitals)
//   - data lazy-loaded from /data/prompt-library.json      (875 prompts)

import { initTryIt } from "./try-it.js";

// Idempotent: try-it.js bails out if `[data-tryit-root]` isn't on the page,
// so this is safe even if the inline runtime has already initialised the
// widget (the inline path uses the same DOM hooks).
if (typeof document !== "undefined") {
  initTryIt();
}
