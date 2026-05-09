import { existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";

const outputPath = "remotion-hero/out/hero-ambient.mp4";
const minimumBytes = 250_000;
const skipRequested = process.env.SKIP_REMOTION_RENDER === "1";

const hasUsableRender = () => existsSync(outputPath) && statSync(outputPath).size > minimumBytes;

if (hasUsableRender()) {
  console.log(`Remotion render already exists at ${outputPath}; skipping render.`);
  process.exit(0);
}

if (skipRequested) {
  console.warn(`SKIP_REMOTION_RENDER=1 set, but ${outputPath} is missing or too small.`);
  console.warn("Continuing without rendering so CI/deploys can use the CSS hero fallback.");
  process.exit(0);
}

console.log(`Rendering Remotion hero to ${outputPath}...`);
const result = spawnSync("npm", ["--prefix", "remotion-hero", "run", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
