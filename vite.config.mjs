import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";

const copyDirectory = (from, to) => {
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const source = join(from, entry);
    const target = join(to, entry);
    if (statSync(source).isDirectory()) copyDirectory(source, target);
    else copyFileSync(source, target);
  }
};

const copyRemotionAssets = () => ({
  name: "copy-remotion-assets",
  closeBundle() {
    copyDirectory("remotion-hero/out", "dist/remotion-hero/out");
  },
});

export default defineConfig({
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT || 5173),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          prompts: ["/src/js/main.js"],
        },
      },
    },
  },
  plugins: [copyRemotionAssets()],
});
