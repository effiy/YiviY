/**
 * Help text layout helpers for rui CLI skill help output.
 * Imported by rui-bot/help.mjs, rui-npm/help.mjs.
 *
 * Each function returns a string ready for console.log with template
 * literal substitution.
 */

/**
 * Section header — renders bold, leaves a blank line before.
 * @param {string} text
 * @returns {string}
 */
export function hdr(text) {
  return `\n${text}\n`;
}

/**
 * Sub-section header — renders bold with a leading blank line.
 * @param {string} text
 * @returns {string}
 */
export function subhdr(text) {
  return `\n${text}`;
}

/**
 * Single help item: description line + indented command line.
 * @param {string} cmd - the command to run
 * @param {string} desc - description of what it does
 * @param {function} [colorFn] - optional colour function for the command
 * @returns {string}
 */
export function item(cmd, desc, colorFn) {
  const c = colorFn ? colorFn(cmd) : cmd;
  return `  ${c}\n    ${desc}\n`;
}

/**
 * Scene heading — a named usage scenario.
 * @param {string} label
 * @returns {string}
 */
export function scene(label) {
  return `\n  ${label}:`;
}
