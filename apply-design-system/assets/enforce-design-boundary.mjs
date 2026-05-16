import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

// Project configuration
const srcDir = join(root, "src");
const allowedRawCssFile = join(srcDir, "styles.css");
const sourceExtensions = new Set([".ts", ".tsx", ".css"]);

const patterns = [
  {
    name: "hex color",
    regex: /#[0-9a-fA-F]{3,8}\b/g,
  },
  {
    name: "rgb/hsl color",
    regex: /\b(?:rgb|rgba|hsl|hsla)\s*\(/g,
  },
  {
    name: "pixel unit",
    regex: /\b\d+(?:\.\d+)?px\b/g,
  },
  {
    name: "rem unit",
    regex: /\b\d+(?:\.\d+)?rem\b/g,
  },
  {
    name: "em unit",
    regex: /-?\d+(?:\.\d+)?em\b/g,
  },
  {
    name: "font-weight number",
    regex: /\bfont(?:Weight|-weight)\s*[:=]\s*["']?[1-9]00\b/g,
  },
];

function listFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
      continue;
    }
    if (sourceExtensions.has(extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function indexToLineCol(content, index) {
  const before = content.slice(0, index);
  const lines = before.split("\n");
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

const files = listFiles(srcDir).filter((file) => file !== allowedRawCssFile);
const violations = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  for (const pattern of patterns) {
    const matches = content.matchAll(pattern.regex);
    for (const match of matches) {
      const idx = match.index ?? 0;
      const position = indexToLineCol(content, idx);
      violations.push({
        file: relative(root, file),
        line: position.line,
        col: position.col,
        kind: pattern.name,
        value: match[0],
      });
    }
  }
}

if (violations.length > 0) {
  console.error(
    "Design boundary violations found (use design tokens instead of raw values):",
  );
  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line}:${violation.col} ${violation.kind} -> ${violation.value}`,
    );
  }
  process.exit(1);
}

console.log("Design boundary check passed.");
