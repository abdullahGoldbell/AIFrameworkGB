// Web Vitals reporter — uses native PerformanceObserver so we don't pull in
// the `web-vitals` package. Reports LCP, CLS, INP, FCP, and TTFB.
//
// Output sinks (in order of preference):
//   1. window.AISparkVitals.onMetric(metric)  — page-level hook
//   2. console.info on dev / when ?debug-vitals is in the URL
//   3. sendBeacon to data-vitals-endpoint on <html> (when set)
//
// Each metric is delivered as:
//   { name, value, rating, id, navigationType }
//
// Ratings follow Google's public thresholds:
//   https://web.dev/articles/vitals
//
// This file is loaded as part of the new site-extras entry, so it's deferred
// and never blocks first paint.

const isDebug =
  typeof window !== "undefined" &&
  (location.search.includes("debug-vitals") ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1");

const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

const rateMetric = (name, value) => {
  const t = THRESHOLDS[name];
  if (!t) return "unknown";
  if (value <= t.good) return "good";
  if (value <= t.poor) return "needs-improvement";
  return "poor";
};

const generateId = () => `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const navigationType = () => {
  const nav = performance.getEntriesByType?.("navigation")?.[0];
  return nav?.type || "navigate";
};

const dispatch = (metric) => {
  // Page-level hook
  const hook = window.AISparkVitals?.onMetric;
  if (typeof hook === "function") {
    try {
      hook(metric);
    } catch (err) {
      // Hook errors must never break vitals reporting.
      if (isDebug) console.warn("[web-vitals] onMetric hook threw:", err);
    }
  }

  // sendBeacon to a configured endpoint
  const endpoint = document.documentElement.getAttribute("data-vitals-endpoint");
  if (endpoint && navigator.sendBeacon) {
    try {
      const blob = new Blob([JSON.stringify(metric)], { type: "application/json" });
      navigator.sendBeacon(endpoint, blob);
    } catch {
      // ignore beacon failures
    }
  }

  // Dev / debug logging
  if (isDebug) {
    const color =
      metric.rating === "good" ? "#0c6b66" : metric.rating === "poor" ? "#b84f36" : "#bd7b13";
    // eslint-disable-next-line no-console
    console.info(
      `%c[vitals] ${metric.name} ${metric.value.toFixed(metric.name === "CLS" ? 3 : 0)} (${metric.rating})`,
      `color:${color};font-weight:600`,
    );
  }
};

const safeObserve = (type, callback, options) => {
  try {
    const obs = new PerformanceObserver(callback);
    obs.observe({ type, buffered: true, ...options });
    return obs;
  } catch {
    return null;
  }
};

const observeLCP = () => {
  let last = null;
  const obs = safeObserve("largest-contentful-paint", (list) => {
    const entries = list.getEntries();
    if (entries.length) last = entries[entries.length - 1];
  });
  if (!obs) return;

  const finalize = () => {
    if (!last) return;
    obs.disconnect();
    const value = last.renderTime || last.loadTime || last.startTime;
    dispatch({
      name: "LCP",
      value,
      rating: rateMetric("LCP", value),
      id: generateId(),
      navigationType: navigationType(),
    });
    last = null;
  };
  addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") finalize();
  });
  addEventListener("pagehide", finalize, { once: true });
};

const observeCLS = () => {
  let total = 0;
  let sessionValue = 0;
  let sessionEntries = [];
  const obs = safeObserve("layout-shift", (list) => {
    for (const entry of list.getEntries()) {
      if (entry.hadRecentInput) continue;
      const first = sessionEntries[0];
      const last = sessionEntries[sessionEntries.length - 1];
      if (
        sessionEntries.length &&
        entry.startTime - last.startTime < 1000 &&
        entry.startTime - first.startTime < 5000
      ) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }
      if (sessionValue > total) total = sessionValue;
    }
  });
  if (!obs) return;

  const finalize = () => {
    obs.takeRecords?.().forEach(() => {
      /* drained above */
    });
    obs.disconnect();
    dispatch({
      name: "CLS",
      value: total,
      rating: rateMetric("CLS", total),
      id: generateId(),
      navigationType: navigationType(),
    });
  };
  addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") finalize();
  });
  addEventListener("pagehide", finalize, { once: true });
};

const observeINP = () => {
  let worst = 0;
  const obs = safeObserve(
    "event",
    (list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > worst) worst = entry.duration;
      }
    },
    { durationThreshold: 16 },
  );
  if (!obs) return;

  const finalize = () => {
    obs.disconnect();
    if (worst > 0) {
      dispatch({
        name: "INP",
        value: worst,
        rating: rateMetric("INP", worst),
        id: generateId(),
        navigationType: navigationType(),
      });
    }
  };
  addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") finalize();
  });
  addEventListener("pagehide", finalize, { once: true });
};

const observeFCP = () => {
  safeObserve("paint", (list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        dispatch({
          name: "FCP",
          value: entry.startTime,
          rating: rateMetric("FCP", entry.startTime),
          id: generateId(),
          navigationType: navigationType(),
        });
      }
    }
  });
};

const reportTTFB = () => {
  const nav = performance.getEntriesByType?.("navigation")?.[0];
  if (!nav) return;
  const ttfb = nav.responseStart - nav.startTime;
  if (ttfb >= 0) {
    dispatch({
      name: "TTFB",
      value: ttfb,
      rating: rateMetric("TTFB", ttfb),
      id: generateId(),
      navigationType: navigationType(),
    });
  }
};

export function reportWebVitals() {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") return;
  reportTTFB();
  observeFCP();
  observeLCP();
  observeCLS();
  observeINP();
}
