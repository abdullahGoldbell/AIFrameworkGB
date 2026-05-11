// Site-extras: deferred Vite entry that adds modern progressive enhancements
// without touching the existing inline UI logic in index.html.
//
// Responsibilities:
//   - Register the PWA service worker (offline + install prompt).
//   - Report Web Vitals (LCP, CLS, INP, FCP, TTFB) for perf observability.
//   - Apply prefers-reduced-motion runtime guards beyond what CSS handles.
//   - Mark elements lazy that the inline HTML hasn't already.
//
// Loaded via `<script type="module" defer>` so it only runs after HTML parse.

import { registerServiceWorker } from "./pwa.js";
import { reportWebVitals } from "./web-vitals.js";

// ── Reduced-motion runtime guard ───────────────────────────────────────────
//
// Stops any in-flight smooth-scroll animations the inline JS may have queued
// when the user toggles "reduce motion" mid-session. CSS already covers most
// of this (transition/animation durations), but `scrollTo({ behavior: "smooth" })`
// is a JS-only call, so we patch the global to fall back to "auto" while
// reduced-motion is active.
const installReducedMotionGuard = () => {
  if (typeof window === "undefined" || !window.scrollTo) return;
  const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (!mq) return;

  const root = document.documentElement;
  const apply = () => {
    if (mq.matches) {
      root.setAttribute("data-reduced-motion", "true");
    } else {
      root.removeAttribute("data-reduced-motion");
    }
  };
  apply();
  mq.addEventListener?.("change", apply);

  const originalScrollTo = window.scrollTo.bind(window);
  window.scrollTo = (...args) => {
    if (mq.matches && args.length === 1 && args[0] && typeof args[0] === "object") {
      const opts = args[0];
      if (opts.behavior === "smooth") {
        return originalScrollTo({ ...opts, behavior: "auto" });
      }
    }
    return originalScrollTo(...args);
  };

  const elScrollTo = Element.prototype.scrollTo;
  if (elScrollTo) {
    Element.prototype.scrollTo = function (...args) {
      if (mq.matches && args.length === 1 && args[0] && typeof args[0] === "object") {
        const opts = args[0];
        if (opts.behavior === "smooth") {
          return elScrollTo.call(this, { ...opts, behavior: "auto" });
        }
      }
      return elScrollTo.apply(this, args);
    };
  }
};

// ── Lazy-load resource hints ───────────────────────────────────────────────
//
// Backstops for any <img> in the page that didn't get loading="lazy" /
// decoding="async" set inline. Native loading=lazy + a sensible decoding
// hint dramatically improves LCP without touching layout.
const installLazyImageBackstop = () => {
  const images = document.querySelectorAll("img:not([loading]):not([data-no-lazy])");
  images.forEach((img) => {
    img.loading = "lazy";
    if (!img.decoding) img.decoding = "async";
  });
  const iframes = document.querySelectorAll("iframe:not([loading])");
  iframes.forEach((iframe) => {
    iframe.loading = "lazy";
  });
};

// ── Boot ───────────────────────────────────────────────────────────────────
const boot = () => {
  installReducedMotionGuard();
  installLazyImageBackstop();
  reportWebVitals();
  // Service worker registration is async + non-blocking. Fire-and-forget.
  void registerServiceWorker();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
