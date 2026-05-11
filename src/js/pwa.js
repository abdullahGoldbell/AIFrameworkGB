// PWA service-worker registration and install-prompt UX.
//
// Loaded as part of the deferred site-extras entry, so registration never
// blocks first paint. Skips registration on `localhost`-only dev sessions to
// avoid stale-cache headaches while iterating.

// Compute deploy-base-aware paths. Vite's `base` may be `/` (root deploy)
// or `./` (relative deploy, e.g. GitHub Pages subpath). We want both to
// resolve to the right SW location at runtime, so we derive the base from
// the current document URL rather than hardcoding `/sw.js`.
const computeBase = () => {
  const baseEl = document.querySelector("base");
  if (baseEl?.href) return new URL(baseEl.href).pathname;
  // Strip the document filename so we're always at a directory boundary.
  const path = location.pathname;
  return path.endsWith("/") ? path : path.replace(/[^/]+$/, "");
};

const BASE = computeBase();
const SW_URL = `${BASE}sw.js`;
const SW_SCOPE = BASE;

// On Vite dev server we still want the option to test the SW (?force-sw),
// but the default is "no SW in dev" so HMR + stale caching don't fight.
const isDevHost = () => {
  const h = location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0";
};

const shouldRegister = () => {
  if (!("serviceWorker" in navigator)) return false;
  if (location.search.includes("no-sw")) return false;
  if (isDevHost() && !location.search.includes("force-sw")) return false;
  return true;
};

const wireInstallPrompt = () => {
  let deferred = null;
  const root = document.documentElement;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event;
    root.setAttribute("data-can-install", "true");
    // Page-level hook: lets index.html show its own install button if present.
    const button = document.querySelector("[data-pwa-install]");
    if (button) {
      button.hidden = false;
      button.addEventListener(
        "click",
        async () => {
          if (!deferred) return;
          deferred.prompt();
          const { outcome } = await deferred.userChoice;
          deferred = null;
          button.hidden = true;
          root.removeAttribute("data-can-install");
          // eslint-disable-next-line no-console
          if (outcome === "accepted") console.info("[pwa] install accepted");
        },
        { once: true },
      );
    }
  });

  window.addEventListener("appinstalled", () => {
    deferred = null;
    root.removeAttribute("data-can-install");
    root.setAttribute("data-installed", "true");
  });
};

const wireUpdateFlow = (registration) => {
  if (!registration) return;
  registration.addEventListener("updatefound", () => {
    const incoming = registration.installing;
    if (!incoming) return;
    incoming.addEventListener("statechange", () => {
      if (incoming.state === "installed" && navigator.serviceWorker.controller) {
        // A new SW is waiting. Surface a soft toast if one exists; otherwise
        // just log so the page can pick it up later.
        const root = document.documentElement;
        root.setAttribute("data-sw-update", "ready");
        const toast = document.getElementById("toast");
        if (toast) {
          toast.textContent = "New version available — refresh to update.";
          toast.classList.add("show");
          clearTimeout(toast._t);
          toast._t = setTimeout(() => toast.classList.remove("show"), 4000);
        }
      }
    });
  });

  // When the controller switches, give the page a hook to soft-refresh.
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    if (location.search.includes("auto-reload-sw")) location.reload();
  });
};

export async function registerServiceWorker() {
  if (!shouldRegister()) return null;
  try {
    const registration = await navigator.serviceWorker.register(SW_URL, {
      scope: SW_SCOPE,
      updateViaCache: "none",
    });
    wireUpdateFlow(registration);
    wireInstallPrompt();
    return registration;
  } catch (err) {
    // Fail silently — SW is a progressive enhancement.
    console.warn("[pwa] service worker registration failed:", err);
    return null;
  }
}
