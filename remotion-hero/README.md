# remotion-hero

Ambient backdrop loop for the AI newsletter hero section. Renders a subtle 8-second seamlessly looping animation of three pastel circles morphing under a slowly rotating colour halo with drifting micro-particles. The chips, robot card, headline, and buttons stay as real DOM in `ai-newsletter-v2.html` so they remain hover/click interactive — this video sits behind them as ambience.

## One-time setup

```bash
cd remotion-hero
npm install
```

The first install pulls Chromium (~300 MB) for headless rendering.

## Preview in browser

```bash
npm start
```

Opens the Remotion Studio at <http://localhost:3000>. Scrub the timeline, tweak `src/HeroAmbient.tsx`, hot-reload.

## Render to MP4 (used by the page)

```bash
npm run build
```

Outputs to `out/hero-ambient.mp4`.

The HTML hero section references `remotion-hero/out/hero-ambient.mp4` via a `<video autoplay loop muted playsinline>` element. Until you render once, the page falls back to a CSS-only ambient backdrop — no broken state.

For better browser support and a smaller file, also render WebM:

```bash
npm run build:both
```

## Tuning

`src/HeroAmbient.tsx`:

- `BLOBS` — three pastel circles. Change `baseX`/`baseY` to reposition, `size` to scale, `hue` for colour, `driftAmp`/`driftSpeed` for motion intensity.
- `PARTICLES` — 28 micro-dots; bump the count for denser ambience.
- `Composition` props in `src/Root.tsx` — `width`/`height` (1280×1280 to match the hero visual square), `durationInFrames` (240 frames @ 30 fps = 8 s loop).

The composition is designed to loop seamlessly: drift speeds and halo rotation complete a whole-number of cycles per loop, so the closing frame matches the opening frame.
