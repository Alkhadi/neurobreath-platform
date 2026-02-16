#!/usr/bin/env node
/**
 * Dependency-free SVG raster reference validator
 *
 * Usage:
 *   node web/scripts/validate-svg-no-raster.mjs --dirs web/public/templates/nb-wallet/templates-bundle
 *
 * Fails if any SVG references raster images (png/jpg/jpeg/gif/webp/bmp/tiff/avif/ico)
 * via href/xlink:href, CSS url(...), or data:image/* (non-SVG).
 */

import fs from "node:fs/promises";
import path from "node:path";

const RASTER_EXT_RE = /\.(png|jpe?g|gif|webp|bmp|tiff?|avif|ico)(\?|#|$)/i;
const DATA_RASTER_RE = /data:image\/(png|jpe?g|gif|webp|bmp|tiff?|avif|ico)\b/i;

function parseArgs(argv) {
  const dirs = [];

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dirs") {
      const next = argv[i + 1];
      if (!next) throw new Error("Missing value for --dirs");
      dirs.push(...next.split(",").map((s) => s.trim()).filter(Boolean));
      i += 1;
      continue;
    }
    if (arg === "-h" || arg === "--help") {
      return { help: true, dirs: [] };
    }
    throw new Error(`Unknown arg: ${arg}`);
  }

  return { help: false, dirs };
}

async function* walkFiles(startDir) {
  const entries = await fs.readdir(startDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(fullPath);
      continue;
    }
    if (entry.isFile()) {
      yield fullPath;
    }
  }
}

function findRasterRefs(svgText) {
  const issues = [];

  // href / xlink:href attribute values
  const hrefAttrRe = /\b(?:href|xlink:href)\s*=\s*(["'])(.*?)\1/gi;
  for (const m of svgText.matchAll(hrefAttrRe)) {
    const value = (m[2] ?? "").trim();
    if (!value) continue;
    if (DATA_RASTER_RE.test(value)) {
      issues.push({ kind: "data-uri", value });
      continue;
    }
    // Allow inline SVG data URIs
    if (/^data:image\/svg\+xml\b/i.test(value)) continue;
    if (RASTER_EXT_RE.test(value)) {
      issues.push({ kind: "href", value });
    }
  }

  // CSS url(...)
  const cssUrlRe = /url\(\s*(["']?)([^"')\s]+)\1\s*\)/gi;
  for (const m of svgText.matchAll(cssUrlRe)) {
    const value = (m[2] ?? "").trim();
    if (!value) continue;
    if (DATA_RASTER_RE.test(value)) {
      issues.push({ kind: "css-data-uri", value });
      continue;
    }
    if (/^data:image\/svg\+xml\b/i.test(value)) continue;
    if (RASTER_EXT_RE.test(value)) {
      issues.push({ kind: "css-url", value });
    }
  }

  // Direct data:image/* occurrences (catch-all)
  if (DATA_RASTER_RE.test(svgText)) {
    // avoid double-reporting by only adding a generic issue if href/css didn't catch
    // (still useful if embedded in unexpected attribute)
    const already = issues.some((i) => i.kind.includes("data"));
    if (!already) issues.push({ kind: "data-uri", value: "data:image/*" });
  }

  return issues;
}

async function main() {
  const { help, dirs } = parseArgs(process.argv);
  if (help || dirs.length === 0) {
    // eslint-disable-next-line no-console
    console.log(
      [
        "validate-svg-no-raster.mjs",
        "",
        "Usage:",
        "  node web/scripts/validate-svg-no-raster.mjs --dirs <dir1,dir2,...>",
        "",
        "Example:",
        "  node web/scripts/validate-svg-no-raster.mjs --dirs web/public/templates/nb-wallet/templates-bundle",
      ].join("\n")
    );
    process.exit(help ? 0 : 2);
  }

  const repoRoot = process.cwd();
  const svgFiles = [];
  for (const dir of dirs) {
    const abs = path.isAbsolute(dir) ? dir : path.join(repoRoot, dir);
    try {
      const stat = await fs.stat(abs);
      if (!stat.isDirectory()) throw new Error("not a directory");
    } catch (e) {
      throw new Error(`--dirs contains missing/invalid directory: ${dir}`);
    }

    for await (const file of walkFiles(abs)) {
      if (file.toLowerCase().endsWith(".svg")) svgFiles.push(file);
    }
  }

  const failures = [];
  for (const svgPath of svgFiles) {
    const text = await fs.readFile(svgPath, "utf8");
    const issues = findRasterRefs(text);
    if (issues.length > 0) {
      failures.push({ svgPath, issues });
    }
  }

  if (failures.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`❌ Raster references found in ${failures.length} SVG file(s):`);
    for (const f of failures) {
      const rel = path.relative(repoRoot, f.svgPath);
      // eslint-disable-next-line no-console
      console.error(`\n- ${rel}`);
      for (const issue of f.issues) {
        // eslint-disable-next-line no-console
        console.error(`  - ${issue.kind}: ${issue.value}`);
      }
    }
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`✅ OK: scanned ${svgFiles.length} SVG file(s), no raster references found.`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(`validate-svg-no-raster.mjs failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(2);
});
