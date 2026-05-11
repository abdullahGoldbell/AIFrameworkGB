// Service Worker for AI Spark — multi-strategy cache.
//
// Strategies:
//   - Navigation requests: network-first, fall back to cached `/index.html`
//     for offline support. Updates are ALWAYS shipped fresh when online.
//   - Same-origin static assets (JS, CSS, fonts, images): cache-first with
//     background update (stale-while-revalidate).
//   - Same-origin /data/*.json: stale-while-revalidate so the prompt
//     library stays usable offline but freshens on every visit.
//   - Cross-origin (Google Fonts, etc.): runtime cache, opaque-friendly.
//
// Cache versioning: bump CACHE_VERSION on each release to evict old caches.
// The `updateViaCache: "none"` registration setting means this file itself
// is always re-fetched on lifecycle events, so the version bump propagates.

const CACHE_VERSION = "v1.1.0";
const STATIC_CACHE = `aispark-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `aispark-runtime-${CACHE_VERSION}`;
const DATA_CACHE = `aispark-data-${CACHE_VERSION}`;

const PRECACHE = ["/", "/index.html", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) =>
        Promise.all(
          PRECACHE.map((url) =>
            cache
              .add(new Request(url, { cache: "reload" }))
              // 404s during install must not abort the SW lifecycle.
              .catch(() => null),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([STATIC_CACHE, RUNTIME_CACHE, DATA_CACHE]);
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

const isNavigationRequest = (request) =>
  request.mode === "navigate" ||
  (request.method === "GET" && request.headers.get("accept")?.includes("text/html"));

const isSameOrigin = (url) => {
  try {
    return new URL(url).origin === self.location.origin;
  } catch {
    return false;
  }
};

const isDataRequest = (url) => {
  try {
    return new URL(url).pathname.startsWith("/data/");
  } catch {
    return false;
  }
};

const isStaticAsset = (url) => {
  try {
    const path = new URL(url).pathname;
    return /\.(?:js|mjs|css|woff2?|ttf|otf|svg|png|jpe?g|gif|webp|avif|ico)$/i.test(path);
  } catch {
    return false;
  }
};

const networkFirst = async (request, cacheName, fallback) => {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone()).catch(() => null);
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (fallback) {
      const fb = await caches.match(fallback);
      if (fb) return fb;
    }
    throw err;
  }
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone()).catch(() => null);
      return response;
    })
    .catch(() => null);
  return cached || networkPromise || fetch(request);
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    // Background refresh
    fetch(request)
      .then((response) => {
        if (response && response.ok) cache.put(request, response.clone()).catch(() => null);
      })
      .catch(() => null);
    return cached;
  }
  const response = await fetch(request);
  if (response && response.ok) cache.put(request, response.clone()).catch(() => null);
  return response;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET — POSTs (forms, etc.) are passthrough.
  if (request.method !== "GET") return;

  // Skip non-http(s) requests (chrome-extension, etc.).
  if (!request.url.startsWith("http")) return;

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE, "/index.html"));
    return;
  }

  if (isSameOrigin(request.url) && isDataRequest(request.url)) {
    event.respondWith(staleWhileRevalidate(request, DATA_CACHE));
    return;
  }

  if (isSameOrigin(request.url) && isStaticAsset(request.url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Cross-origin (Google Fonts, etc.) — runtime cache with SWR.
  if (!isSameOrigin(request.url)) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
    return;
  }
});

// Allow the page to ask the SW to skip-waiting immediately on user action.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
