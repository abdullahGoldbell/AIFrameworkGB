import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".claude/worktrees/**",
      "node_modules/**",
      "remotion-hero/node_modules/**",
      "remotion-hero/out/**",
      "public/data/prompt-library.json",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Browser-runtime modules: served to the page or run inside the SW.
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        location: "readonly",
        fetch: "readonly",
        Element: "readonly",
        IntersectionObserver: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        HTMLInputElement: "readonly",
        HTMLSelectElement: "readonly",
        console: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        // Standard browser APIs used by the new web-vitals + pwa modules.
        addEventListener: "readonly",
        performance: "readonly",
        PerformanceObserver: "readonly",
        Blob: "readonly",
        URL: "readonly",
        matchMedia: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-console": ["warn", { allow: ["warn", "error", "log"] }],
    },
  },
  {
    // Service worker context: Worker globals only.
    files: ["public/sw.js"],
    languageOptions: {
      globals: {
        self: "readonly",
        caches: "readonly",
        clients: "readonly",
        Request: "readonly",
        Response: "readonly",
        URL: "readonly",
        fetch: "readonly",
        Promise: "readonly",
        console: "readonly",
      },
    },
  },
);
