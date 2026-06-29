/**
 * Lightweight vitest-compatible test runner adapter.
 *
 * Provides `describe`, `it`, `assert`, and `run` so skill test suites
 * can run with `node <test-file>` without installing vitest.
 *
 * Usage:
 *   import { describe, it, assert, run } from "../../../lib/vitest-adapter.mjs";
 *   describe("suite", () => {
 *     it("case", () => { assert.ok(true); });
 *   });
 *   const exitCode = await run();
 *
 * Imported by rui-bot/tests, rui-npm/tests.
 */

const registry = [];

/**
 * Register a test suite.
 * @param {string} name
 * @param {() => void | Promise<void>} fn
 */
export function describe(name, fn) {
  const suite = { type: "suite", name, fn, _tests: [] };
  registry.push(suite);
  // Execute the callback immediately so it() calls inside register their tests.
  fn();
}

/**
 * Register a test case within the current suite.
 * @param {string} name
 * @param {() => void | Promise<void>} fn
 * @param {number} [timeout] - ignored in this runner (vitest compat)
 */
export function it(name, fn, _timeout) {
  const suite = registry[registry.length - 1];
  if (!suite || suite.type !== "suite") throw new Error("it() must be called inside describe()");
  if (!suite._tests) suite._tests = [];
  suite._tests.push({ name, fn });
}

// ─── assertion helpers ──────────────────────────────────────────────

class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
}

export const assert = {
  ok(cond, msg) {
    if (!cond) throw new AssertionError(msg || "assert.ok failed");
  },
  equal(a, b, msg) {
    if (a !== b) throw new AssertionError(msg || `expected ${JSON.stringify(a)} === ${JSON.stringify(b)}`);
  },
  fail(msg) {
    throw new AssertionError(msg || "assert.fail");
  },
};

// ─── runner ─────────────────────────────────────────────────────────

/**
 * Run all registered suites and return a POSIX exit code (0 = all pass).
 * Prints TAP-compatible output to stdout.
 * @returns {Promise<number>}
 */
export async function run() {
  let passed = 0;
  let failed = 0;
  const errors = [];

  for (const suite of registry) {
    if (suite.type !== "suite") continue;
    const tests = suite._tests || [];
    for (const t of tests) {
      try {
        await t.fn();
        console.log(`✓ ${suite.name} › ${t.name}`);
        passed++;
      } catch (e) {
        const msg = e.message || String(e);
        console.log(`✗ ${suite.name} › ${t.name}`);
        console.log(`  ${msg}`);
        failed++;
        errors.push({ suite: suite.name, test: t.name, error: msg });
      }
    }
  }

  const total = passed + failed;
  console.log(`\n${passed}/${total} passed${failed > 0 ? `, ${failed} failed` : ""}`);
  if (errors.length > 0) {
    console.log(`\nFailures:`);
    for (const e of errors) console.log(`  ✗ ${e.suite} › ${e.test}: ${e.error}`);
  }
  return failed > 0 ? 1 : 0;
}
