import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Project configuration
const designBaselinePath = resolve(root, "docs/specs/DESIGN.md");
const designExtensionPath = resolve(root, "docs/specs/DESIGN-EXTENSION.md");
const stylesheetPath = resolve(root, "frontend/src/styles.css");

function runCommand(command, args, input = "") {
  const result = spawnSync(command, args, { encoding: "utf8", input });
  if (result.status !== 0) {
    const stderr = result.stderr?.trim() || "";
    const stdout = result.stdout?.trim() || "";
    throw new Error(
      `${command} ${args.join(" ")} failed.\n${stderr || stdout || "No output."}`,
    );
  }
  return result.stdout;
}

function runYq(args) {
  return runCommand("yq", args);
}

function runNpx(args, input = "") {
  return runCommand("npx", args, input);
}

function mergeDesignFrontmatter() {
  return runYq([
    "ea",
    "--front-matter=extract",
    "select(fi==0) * select(fi==1)",
    designBaselinePath,
    designExtensionPath,
  ]).trim();
}

function sanitizeTokenName(name) {
  return name.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeDtcgValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((part) => normalizeDtcgValue(part)).join(" ").trim();
  }
  if (isObject(value)) {
    if (typeof value.hex === "string") return value.hex;
    if (typeof value.value === "string" || typeof value.value === "number") {
      return String(value.value);
    }
  }
  return "";
}

function collectTokenVars(node, path = [], out = []) {
  if (!isObject(node)) return out;
  if ("$value" in node) {
    const value = normalizeDtcgValue(node.$value);
    if (value && path.length > 0) {
      const name = `--${path.map(sanitizeTokenName).join("-")}`;
      out.push([name, value]);
    }
    return out;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    collectTokenVars(value, [...path, key], out);
  }
  return out;
}

function buildMergedDesignDocument(frontmatterYaml) {
  return `---\n${frontmatterYaml}\n---\n\n## Overview\nMerged token source for stylesheet generation.\n`;
}

function exportMergedDtcg(designDocument) {
  const raw = runNpx([
    "@google/design.md",
    "export",
    "--format",
    "dtcg",
    "-",
  ], designDocument);
  return JSON.parse(raw);
}

function buildCss(vars) {
  const lines = [":root {"];
  for (const [name, value] of vars) {
    lines.push(`  ${name}: ${value};`);
  }
  lines.push("}", "");
  return lines.join("\n");
}

function main() {
  const mergedFrontmatter = mergeDesignFrontmatter();
  const mergedDesign = buildMergedDesignDocument(mergedFrontmatter);
  const tokens = exportMergedDtcg(mergedDesign);
  const vars = collectTokenVars(tokens).sort(([a], [b]) => a.localeCompare(b));
  writeFileSync(stylesheetPath, buildCss(vars));
  console.log("Generated token stylesheet from merged DESIGN frontmatter.");
}

main();
