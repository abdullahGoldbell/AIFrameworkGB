#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const tracked = spawnSync("git", ["ls-files", "-z"], { encoding: "utf8" });
if (tracked.status !== 0) {
  console.error(tracked.stderr || "Unable to list tracked files.");
  process.exit(tracked.status || 1);
}

const binaryExtensions = new Set([
  ".gif",
  ".ico",
  ".jpg",
  ".jpeg",
  ".lock",
  ".mp4",
  ".png",
  ".webm",
]);

const secretPatterns = [
  ["Private key", /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/],
  ["GitLab token", /\bglpat-[A-Za-z0-9_-]{20,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ["OpenAI key", /\bsk-[A-Za-z0-9_-]{32,}\b/],
  ["Stripe key", /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{24,}\b/],
];

const findings = [];
for (const file of tracked.stdout.split("\0").filter(Boolean)) {
  const lower = file.toLowerCase();
  if ([...binaryExtensions].some((extension) => lower.endsWith(extension))) continue;

  let contents;
  try {
    contents = readFileSync(file, "utf8");
  } catch {
    continue;
  }

  for (const [label, pattern] of secretPatterns) {
    const match = pattern.exec(contents);
    if (!match) continue;
    const line = contents.slice(0, match.index).split("\n").length;
    findings.push(`${file}:${line} ${label}`);
  }
}

if (findings.length > 0) {
  console.error("Potential secrets found:");
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exit(1);
}

console.log(
  `Secret scan passed for ${tracked.stdout.split("\0").filter(Boolean).length} tracked files.`,
);
