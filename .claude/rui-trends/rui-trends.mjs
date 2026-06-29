#!/usr/bin/env node
/**
 * rui-trends — GitHub Trending 查询
 * 用法: node .claude/rui-trends/rui-trends.mjs [options]
 */

import { NODE_ARGV_OFFSET } from "../../lib/constants.mjs";
import { dim, cyan, yellow } from "../../lib/tty.mjs";

const GITHUB_TRENDING = "https://github.com/trending";

// --- args ---------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(NODE_ARGV_OFFSET);
  if (args.length === 0 || args.includes("--help") || args.includes("-h") || args.includes("help")) {
    showUsage();
    process.exit(0);
  }

  const opts = { lang: "", since: "daily" };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--lang" || args[i] === "-l") opts.lang = args[++i] || "";
    else if (args[i] === "--since") opts.since = args[++i] || "daily";
    else if (args[i].startsWith("--lang=")) opts.lang = args[i].split("=")[1];
    else if (args[i].startsWith("--since=")) opts.since = args[i].split("=")[1];
  }
  return opts;
}

function showUsage() {
  console.log(`
rui-trends — GitHub Trending 查询

用法:
  node .claude/rui-trends/rui-trends.mjs [options]

选项:
  --lang, -l <语言>     编程语言过滤（如 TypeScript, Python, Go）
  --since daily|weekly   时间窗口，默认 daily
`);
}

// --- fetch --------------------------------------------------------------------

async function fetchTrending(opts) {
  let url = GITHUB_TRENDING;
  if (opts.lang) url += `/${encodeURIComponent(opts.lang.toLowerCase())}`;
  url += `?since=${opts.since}`;

  console.error(dim(`[rui-trends] 查询: ${url}`));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}`, repos: [] };
    const html = await res.text();
    return { ok: true, repos: parseRepos(html), url };
  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, error: err.message, repos: [], url };
  }
}

function parseRepos(html) {
  const repos = [];
  // Match repo blocks: <h2 class="h3 lh-condensed">...<a href="/owner/repo">...</h2>
  const repoRegex = /<h2[^>]*class="[^"]*h3[^"]*lh-condensed[^"]*"[^>]*>[\s\S]*?<a\s+href="\/([^"]+)"[^>]*>[\s\S]*?<span[^>]*>([^<]*)<\/span>\s*\/\s*([^<]*\S)\s*<\/a>[\s\S]*?<\/h2>/gi;
  let match;
  while ((match = repoRegex.exec(html)) !== null) {
    const fullName = match[1]; // owner/repo
    const [, owner, name] = fullName.match(/^(.+?)\/(.+)$/) || ["", "", fullName];
    repos.push({ owner: owner.trim(), name: name.trim(), fullName, description: "", language: "", stars: "", starsToday: "", url: `https://github.com/${fullName}` });
  }

  // Fill descriptions - find <p> after each repo block
  const descRegex = /<p\s+class="col-9\s+color-fg-muted\s+my-1\s+pr-4"[^>]*>\s*([\s\S]*?)\s*<\/p>/gi;
  let descMatch, idx = 0;
  while ((descMatch = descRegex.exec(html)) !== null && idx < repos.length) {
    repos[idx].description = descMatch[1].replace(/<[^>]+>/g, "").trim();
    idx++;
  }

  // Fill language
  const langRegex = /<span\s+itemprop="programmingLanguage"[^>]*>\s*([^<]+)\s*<\/span>/gi;
  let langMatch; idx = 0;
  while ((langMatch = langRegex.exec(html)) !== null && idx < repos.length) {
    repos[idx].language = langMatch[1].trim();
    idx++;
  }

  // Fill total stars
  const starsRegex = /<a\s+(?:[^>]*\s+)?href="\/[^"]+\/stargazers"[^>]*>\s*<svg[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)\s*<\/a>/gi;
  let starMatch; idx = 0;
  while ((starMatch = starsRegex.exec(html)) !== null && idx < repos.length) {
    repos[idx].stars = starMatch[1].trim();
    idx++;
  }

  // Fill today's stars
  const todayStarsRegex = /<span\s+class="d-inline-block\s+float-sm-right"[^>]*>\s*<svg[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)\s+stars?\s+(today|this week)/gi;
  let tsMatch; idx = 0;
  while ((tsMatch = todayStarsRegex.exec(html)) !== null && idx < repos.length) {
    repos[idx].starsToday = tsMatch[1].trim();
    idx++;
  }

  return repos;
}

// --- format -------------------------------------------------------------------

function formatTable(repos, url, lang, since) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  let out = "";
  out += `## rui-trends — GitHub Trending\n\n`;
  out += `> 数据源: ${url} | 查询时间: ${ts}\n`;
  if (lang) out += `> 语言: ${lang} | 窗口: ${since}\n`;
  out += `\n`;
  out += `| 排名 | 仓库 | Stars | 语言 | 今日 | 描述 |\n`;
  out += `|------|------|-------|------|------|------|\n`;

  for (let i = 0; i < repos.length; i++) {
    const r = repos[i];
    const desc = r.description ? r.description.slice(0, 100) : "";
    out += `| ${i + 1} | [${r.fullName}](${r.url}) | ${r.stars} | ${r.language} | +${r.starsToday} | ${desc} |\n`;
  }

  return out;
}

// --- main ---------------------------------------------------------------------

async function main() {
  const opts = parseArgs();
  console.error(dim("[rui-trends] GitHub Trending 查询中..."));
  const result = await fetchTrending(opts);

  if (!result.ok) {
    console.error(yellow(`[rui-trends] 查询失败: ${result.error}`));
    console.log(`\n> ⚠️ 无法获取 GitHub Trending 数据\n> 请手动访问: ${result.url || GITHUB_TRENDING}`);
    process.exit(1);
  }

  console.log(formatTable(result.repos, result.url, opts.lang, opts.since));
  console.error(dim(`[rui-trends] 共 ${result.repos.length} 个仓库`));
}

main().catch((e) => {
  console.error(yellow(`[rui-trends] 错误: ${e.message}`));
  process.exit(1);
});
