/**
 * Test helper utilities for rui skill test suites.
 * Imported by rui-bot/tests, rui-npm/tests.
 */

import { existsSync, readFileSync } from "node:fs";

/**
 * Check whether a file exists at `projectRelativePath` (relative to cwd).
 * @param {string} projectRelativePath
 * @returns {boolean}
 */
export function fileExists(projectRelativePath) {
  return existsSync(projectRelativePath);
}

/**
 * Read a file at `projectRelativePath` (relative to cwd) as a UTF-8 string.
 * @param {string} projectRelativePath
 * @returns {string}
 */
export function readFile(projectRelativePath) {
  return readFileSync(projectRelativePath, "utf-8");
}
