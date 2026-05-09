# AIFrameworkGB Beginner Interactive Polish Sprint

## 2026-05-09 11:03:07 SGT
- Chosen slice: Add an accessible beginner AI glossary explorer with tap-to-select plain-English definitions, examples, and safe-use tips.
- Files changed:
  - `index.html`
  - `tests/beginner-glossary.test.js`
  - `.hermes/AIFrameworkGB-polish-sprint.md`
- Verification:
  - RED: `node --test tests/beginner-glossary.test.js` failed before implementation because `#beginner-glossary` did not exist.
  - GREEN targeted: `node --test tests/beginner-glossary.test.js` passed.
  - Build: `npm run build` passed after installing missing Remotion dependencies; generated build artifacts were reverted to avoid unrelated changes.
- Commit hash: `c4d6f49` (`feat: add beginner AI glossary explorer`).
- Next suggested slice: Add a beginner-friendly “first prompt builder” that lets users choose role, task, tone, and format, then copies a composed starter prompt.

## 2026-05-09 11:38:30 SGT
- Chosen slice: Add a beginner-friendly first prompt builder that composes a safe starter prompt from role, task, tone, format, and anonymized context choices.
- Files changed:
  - `index.html`
  - `tests/prompt-builder.test.js`
  - `.hermes/AIFrameworkGB-polish-sprint.md`
- Verification:
  - RED: `node --test tests/prompt-builder.test.js` failed before implementation because `#first-prompt-builder` did not exist.
  - GREEN targeted: `node --test tests/prompt-builder.test.js` passed.
  - Regression/build: `node --test tests/*.test.js && npm run build` passed; generated `remotion-hero/out/hero-ambient.mp4` was reverted to avoid unrelated artifact churn.
- Commit hash: `85831d7` (`feat: add beginner prompt builder`).
- Next suggested slice: Add a persistent beginner progress checklist with localStorage so users can tick off first actions across visits.
