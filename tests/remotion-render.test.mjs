import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { open, stat } from "node:fs/promises";
import { test } from "node:test";
import { URL } from "node:url";

const heroVideo = new URL("../remotion-hero/out/hero-ambient.mp4", import.meta.url);

test("committed Remotion hero render is a usable MP4 asset", async () => {
  const metadata = await stat(heroVideo);
  assert.ok(metadata.size > 500_000, "hero video should not be an empty placeholder");

  const handle = await open(heroVideo, "r");
  const buffer = Buffer.alloc(8);
  await handle.read(buffer, 0, 8, 4);
  await handle.close();
  assert.equal(buffer.toString("utf8"), "ftypisom");
});
