---
name: testing-ai-spark
description: Test the AI Spark static site end-to-end. Use when validating AIFrameworkGB UI, build, deployment, prompt library, theme, or animation changes.
---

# Devin Secrets Needed

None for local build and UI validation.

# Setup

Run from the repo root:

```bash
npm install
npx playwright install chromium
npm run build
```

# Quality gates

```bash
npm run lint
npm run lint:styles
npm run format:check
npm run typecheck
npm run test:remotion
npm run scan:secrets
npm run test:e2e
```

# Local runtime validation

Production server:

```bash
PORT=4173 npm start
```

Development server:

```bash
npm run dev -- --host 127.0.0.1
```

Expected ports:

- Production preview: `http://127.0.0.1:4173/`
- Vite dev app: `http://127.0.0.1:5173/`
- Remotion Studio: `http://127.0.0.1:3000/`

# Browser flows to verify

- Hero loads with heading `AI field notes for real work` and no console exceptions.
- Hero CTA scrolls to `Your 5-step AI starter guide`.
- Starter guide second tab becomes `aria-selected="true"` and panel mentions `tasks involving language`.
- Prompt library search for `email` shows nonzero results; expanding and copying the first prompt shows success feedback.
- Framework playground with task/context text returns output containing the entered task/context.
- Subscription form rejects `not-an-email` and accepts a valid email.
- Reset `localStorage.ai-spark-theme` to `light` before checking dark mode persistence, then toggle dark and reload.
- Repeated confetti is triggered by clicking `.nav-logo` five times, waiting briefly, then clicking it five more times. Probe `requestAnimationFrame`/`cancelAnimationFrame` to ensure a later launch cancels a defined prior frame.
- Mobile width around 390px should have no horizontal overflow. Open the `Open menu` button and target `#mobile-menu a[href='#prompt-master']` directly to verify prompt navigation.

# Lighthouse note

The repo has `lighthouserc.cjs` for CI budgets. If LHCI cannot launch its own Chrome in Devin, start `PORT=4173 npm start` and run Lighthouse against the already-running Devin Chrome CDP port:

```bash
npx --yes lighthouse@12.8.2 "http://127.0.0.1:4173/" --port=29229 --preset=desktop --output=json --output=html --output-path="/home/ubuntu/aiframeworkgb-test-artifacts/lighthouse-final" --quiet --chrome-flags="--headless=new --no-sandbox --disable-dev-shm-usage --disable-gpu"
```
