#!/usr/bin/env node
/* eslint-disable */
// One-command runner. Renders the Remotion video if missing, then serves
// the site at http://localhost:5173 with auto-open.

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5173;
const VIDEO = path.join("remotion-hero", "out", "hero-ambient.mp4");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
};

const log = (msg) => console.log(msg);

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit", shell: true, ...opts });
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))
    );
  });
}

async function main() {
  if (!fs.existsSync(VIDEO)) {
    log(
      `${c.yellow}${c.bold}!${c.reset} ${c.yellow}Hero video not found.${c.reset} ${c.dim}Rendering once now (1-2 min, only on first run)…${c.reset}`
    );
    log(
      `${c.dim}  Skip with: set NO_RENDER=1 npm start (page falls back to CSS animation)${c.reset}\n`
    );
    if (!process.env.NO_RENDER) {
      try {
        await run("npm", ["run", "render"]);
      } catch (e) {
        log(
          `${c.red}Render failed.${c.reset} Page will still load with CSS animation fallback.`
        );
      }
    }
  }

  const url = `http://localhost:${PORT}/`;
  log("");
  log(
    `${c.green}${c.bold}▶ AI Newsletter${c.reset} ${c.dim}— serving at${c.reset} ${c.cyan}${c.bold}${url}${c.reset}`
  );
  log(`${c.dim}  (Page served from index.html — no version suffix.)${c.reset}`);
  log(
    `${c.dim}  Press Ctrl+C to stop. Edit the hero animation in ${c.reset}remotion-hero/src/HeroAmbient.tsx ${c.dim}+ \`npm run studio\` for live preview.${c.reset}`
  );
  log("");

  // Open browser after a short delay so server is ready.
  setTimeout(() => {
    const opener =
      process.platform === "darwin"
        ? "open"
        : process.platform === "win32"
        ? "start"
        : "xdg-open";
    spawn(opener, [url], { stdio: "ignore", detached: true, shell: true }).unref();
  }, 1500);

  // Hand off to `serve` (replaces this process so Ctrl+C works cleanly).
  await run("npx", [
    "--yes",
    "serve",
    "-l",
    String(PORT),
    "-n",
    ".",
  ]);
}

main().catch((e) => {
  console.error(`${c.red}error:${c.reset}`, e.message);
  process.exit(1);
});
