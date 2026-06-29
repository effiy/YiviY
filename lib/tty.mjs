/**
 * Terminal formatting helpers for rui CLI skill help output.
 * Imported by rui-bot/help.mjs, rui-npm/help.mjs.
 *
 * Uses ANSI escape codes directly — zero dependencies.
 */

const ANSI = { reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m", yellow: "\x1b[33m", cyan: "\x1b[36m" };

const apply = (code) => (text) => `${code}${text}${ANSI.reset}`;

export const bold = apply(ANSI.bold);
export const dim = apply(ANSI.dim);
export const yellow = apply(ANSI.yellow);
export const cyan = apply(ANSI.cyan);
