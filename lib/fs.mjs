/**
 * Shared filesystem utilities for rui CLI skills.
 * Imported by rui-bot, rui-npm, and other `.claude/rui-*` skills.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ─── project root ──────────────────────────────────────────────────

/**
 * Walk upward from `startDir` until we find a directory that contains
 * `CLAUDE.md` or a `.git` folder — that's the project root.
 *
 * CONTRACT — keep this in sync with the Python counterpart:
 *   .claude/rui-skill/scripts/run_eval.py :: find_project_root()
 * Both implementations MUST resolve the same directory for any given
 * `startDir`, otherwise the JS/Python toolchains will disagree about
 * where skill artifacts and .claude/commands/ live.
 */
export function findProjectRoot(startDir) {
  let dir = startDir;
  while (true) {
    if (existsSync(join(dir, "CLAUDE.md")) || existsSync(join(dir, ".git"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return startDir;
}

/**
 * Read the project name from the first `# ` heading in the project root's
 * CLAUDE.md. Falls back to the basename of the project root directory.
 */
export function readProjectName(projectRoot) {
  const mdPath = join(projectRoot, "CLAUDE.md");
  if (existsSync(mdPath)) {
    const content = readFileSync(mdPath, "utf-8");
    const match = content.match(/^#\s+(.+)$/m);
    if (match) return match[1].trim();
  }
  return projectRoot.split("/").pop() || "project";
}

// ─── module helpers ────────────────────────────────────────────────

/**
 * Returns `true` when `metaUrl` is the main entry point (i.e. executed
 * directly, not imported by another module). Usage:
 *
 *   const _isMain = isMain(import.meta.url);
 *   if (_isMain) { main(); }
 */
export function isMain(metaUrl) {
  if (!metaUrl) return false;
  const entry = process.argv[1] ? String(process.argv[1]) : "";
  const self = fileURLToPath(metaUrl);
  return entry.endsWith(self) || entry.endsWith(self.replace(/\.mjs$/, ".js"));
}

// ─── datetime ──────────────────────────────────────────────────────

/** ISO-8601 datetime with seconds, local timezone offset. */
export function nowISO() {
  const d = new Date();
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? "+" : "-";
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds()) +
    sign +
    pad(Math.floor(Math.abs(off) / 60)) +
    ":" +
    pad(Math.abs(off) % 60)
  );
}

/** Human-readable display timestamp: "YYYY-MM-DD HH:mm:ss". */
export function fmtDisplay(iso) {
  return iso ? iso.replace("T", " ").replace(/[+-]\d{2}:\d{2}$/, "") : "";
}
