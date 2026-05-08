# AI Framework GB — newsletter site

Static HTML newsletter (`ai-newsletter-v2.html`) with an animated, interactive hero. The hero combines:

- A **Remotion** ambient video loop that plays behind the visual (`remotion-hero/`)
- A **DOM interactivity layer** layered on top — split-text headline reveal, SVG underline draw, mouse-parallax chips, magnetic CTAs, click ripples, robot bounce, stat count-up.

## Run locally

```bash
npm install
npm start
```

The first run installs both the root and `remotion-hero/` dependencies, renders `remotion-hero/out/hero-ambient.mp4` (only if missing), then serves the site at <http://localhost:5173/ai-newsletter-v2.html>.

Subsequent `npm start` skips the render and just serves.

To force a re-render after editing the Remotion composition:

```bash
npm run force-render
```

To open the Remotion studio side-by-side with the page (live edit + live preview):

```bash
npm run dev
```

## Deploy

The same repo deploys cleanly to **Railway** and **GitHub Pages**. Both targets use the rendered video as a static asset — neither needs to run the full Remotion toolchain at request time.

### Option A — commit the rendered video (simplest, works on both)

1. Render once locally: `npm install && npm run render`
2. Commit the result: `git add remotion-hero/out/*.mp4 remotion-hero/out/*.webm && git commit -m "Render hero video"`
3. Push to your repo. The video ships as part of the repo and both deploy targets just serve it.

The included `.gitignore` is already configured to keep `remotion-hero/out/` while ignoring `node_modules`.

### Option B — render in CI on every deploy

#### Railway

Push the repo. `railway.json` + `nixpacks.toml` tell Railway to:

1. Install `nodejs_20`, `ffmpeg`, and `chromium` in the build image.
2. `npm install` (which installs `remotion-hero/` deps via `postinstall`).
3. `npm run render` to produce the MP4.
4. `npm run start:railway` to serve the static files on `$PORT`.

No env vars required.

#### GitHub Pages

1. In the repo: Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. Push to `main` (or `master`). The workflow at `.github/workflows/deploy-pages.yml` installs deps, renders the video, stages the static files into `_site/`, and publishes.
3. The site will be at `https://<username>.github.io/<repo>/ai-newsletter-v2.html`.

The workflow installs Chromium-related libs via apt so Remotion can render headlessly on Ubuntu runners.

## Project layout

```
ai-newsletter-v2.html      # The page itself (single file, all CSS+JS inline)
remotion-hero/             # Remotion project for the ambient hero video
  src/
    HeroAmbient.tsx        # The composition
    Root.tsx
    index.ts
  out/                     # Rendered MP4 / WebM lands here (committed)
package.json               # Top-level scripts + concurrently
railway.json               # Railway build/deploy config
nixpacks.toml              # System deps for Railway build (Chromium, ffmpeg)
.github/workflows/         # GitHub Pages auto-deploy on push
.nojekyll                  # Tell GitHub Pages not to run Jekyll
.gitignore                 # Excludes node_modules, keeps remotion-hero/out
Scraped Prompts/           # Source content (not deployed)
```

## Tweaking the hero

- Animation/colours/timing → `remotion-hero/src/HeroAmbient.tsx`
- Hero markup, chip copy, headline → `<section id="hero">` in `ai-newsletter-v2.html`
- Hero CSS → search for `── Hero v2: Remotion ambient + interactive layer ──` in the same file
- Hero JS interactivity → bottom of the file, search for `Hero v2 interactivity`
