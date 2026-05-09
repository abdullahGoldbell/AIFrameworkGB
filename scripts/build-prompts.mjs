import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";

const ROOT = process.cwd();
const PROMPTS_DIR = join(ROOT, "Scraped Prompts");
const OUT_FILE = join(ROOT, "public", "data", "prompts.json");

const categoryMeta = {
  Admin: { icon: "🧭", color: "cat-orange", label: "Admin & Ops" },
  Finance: { icon: "📊", color: "cat-green", label: "Finance" },
  IT: { icon: "⚙️", color: "cat-blue", label: "IT & AI" },
  Marketing: { icon: "📣", color: "cat-rose", label: "Marketing" },
  Personal: { icon: "🌱", color: "cat-teal", label: "Personal Growth" },
};

const difficultyByNumber = (number) => {
  if (number % 5 === 0) return "Advanced";
  if (number % 2 === 0) return "Intermediate";
  return "Beginner";
};

const titleCase = (value) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return path.endsWith(".md") && basename(path) !== "README.md" ? [path] : [];
  });

const stripMarkdown = (value) =>
  value
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/^>\s?/gm, "")
    .trim();

const getTitle = (body, filePath) => {
  const heading = body.match(/^#{1,6}\s*(.+)$/m)?.[1];
  if (heading) return stripMarkdown(heading).replace(/^Prompt\s+\d+\s+[—-]\s+/, "");
  return titleCase(basename(filePath, ".md").replace(/^\d+-Prompt-\d+-?/, ""));
};

const getPromptNumber = (filePath, body) => {
  const fromFile = basename(filePath).match(/Prompt-(\d+)/i)?.[1];
  const fromBody = body.match(/Prompt\s+(\d+)/i)?.[1];
  return Number(fromFile || fromBody || 1);
};

const getMeta = (body, key) => {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return body.match(new RegExp(`^${escaped}:\\s*(.+)$`, "im"))?.[1]?.trim() || "";
};

const getExplanation = (body, title) => {
  const cleaned = stripMarkdown(body)
    .split("---")[0]
    .replace(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), "")
    .replace(/^Prompt\s+\d+\s+[—-]\s+/, "")
    .trim();
  const sentence = cleaned.split(/(?<=[.!?])\s+/).find(Boolean) || cleaned;
  return sentence.slice(0, 180).trim();
};

const prompts = walk(PROMPTS_DIR)
  .sort((a, b) => relative(PROMPTS_DIR, a).localeCompare(relative(PROMPTS_DIR, b)))
  .map((filePath, index) => {
    const body = readFileSync(filePath, "utf8").trim();
    const rel = relative(PROMPTS_DIR, filePath);
    const [rawCategory, rawCourse, rawModule] = rel.split(/[\\/]/);
    const promptNumber = getPromptNumber(filePath, body);
    const title = getTitle(body, filePath);
    const meta = categoryMeta[rawCategory] || {
      icon: "✨",
      color: "cat-purple",
      label: titleCase(rawCategory),
    };

    return {
      id: index + 1,
      title,
      category: titleCase(rawCategory),
      source: meta.label,
      module: getMeta(body, "Source module") || titleCase(rawModule || rawCourse || rawCategory),
      difficulty: difficultyByNumber(promptNumber),
      explanation: getExplanation(body, title),
      prompt: body,
      icon: meta.icon,
      color: meta.color,
      path: rel,
    };
  });

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, `${JSON.stringify(prompts, null, 0)}\n`);
console.log(`Wrote ${prompts.length} prompts to ${relative(ROOT, OUT_FILE)}`);
