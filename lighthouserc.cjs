module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["http://localhost:4173/index.html"],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      // Categories: tightened after the inline-CSS / inline-JS / PROMPTS-array
      // refactor. The previous baseline was set when index.html was 4 MB; with
      // the lazy-fetched JSON + extracted CSS we now expect headroom on every
      // category.
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "categories:pwa": ["warn", { minScore: 0.7 }],

        // Core Web Vitals — Google's "good" thresholds.
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],
        "speed-index": ["warn", { maxNumericValue: 3400 }],
        interactive: ["warn", { maxNumericValue: 3800 }],

        // Page-weight / asset budgets.
        "total-byte-weight": ["warn", { maxNumericValue: 2 * 1024 * 1024 }],
        "unused-javascript": "warn",
        "unused-css-rules": "warn",
        "uses-responsive-images": "warn",
        "uses-text-compression": "error",
        "uses-long-cache-ttl": "warn",
        "render-blocking-resources": "warn",
        "modern-image-formats": "warn",
        "efficient-animated-content": "warn",
      },
      // Per-resource-type budgets enforced by Lighthouse's "performance budget"
      // assertion. Picked so a normal release of the site stays well within
      // them; bump if a justified asset is added.
      budgets: [
        {
          path: "/*",
          resourceSizes: [
            { resourceType: "script", budget: 100 },
            { resourceType: "stylesheet", budget: 60 },
            { resourceType: "image", budget: 200 },
            { resourceType: "font", budget: 80 },
            { resourceType: "document", budget: 60 },
            { resourceType: "third-party", budget: 80 },
            { resourceType: "total", budget: 600 },
          ],
          resourceCounts: [
            { resourceType: "script", budget: 5 },
            { resourceType: "stylesheet", budget: 3 },
            { resourceType: "third-party", budget: 10 },
          ],
        },
      ],
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
