/**
 * rui-trends — GitHub Trending 查询
 * 用法: node .claude/rui-trends/rui-trends.mjs [options]
 *
 * ⚠️  HTML scraping fragility:
 * GitHub does not publish an official Trending API, so this module
 * scrapes https://github.com/trending with regex-based extractors.
 * Any change to GitHub's HTML structure (class names, attribute order,
 * SVG markup) will silently drop fields — verify after GitHub redesigns.
 *
 * If GitHub blocks scraping (HTTP 429/403) or returns empty markup,
 * the script reports zero repos rather than crashing. Switch to the
 * GitHub Search API (`https://api.github.com/search/repositories?sort=stars`)
 * if this becomes unreliable.
 */

import { NODE_ARGV_OFFSET } from "../../lib/constants.mjs";
import { dim, cyan, yellow } from "../../lib/tty.mjs";

const GITHUB_TRENDING = "https://github.com/trending";

// --- regex extractors (named for clarity; update here when GitHub redesigns) --
const REPO_BLOCK_RE     = /<h2[^>]*class="[^"]*h3[^"]*lh-condensed[^"]*"[^>]*>[\s\S]*?<a\s+href="\/([^"]+)"[^>]*>[\s\S]*?<span[^>]*>([^<]*)<\/span>\s*\/\s*([^<]*\S)\s*<\/a>[\s\S]*?<\/h2>/gi;
const REPO_DESC_RE      = /<p\s+class="col-9\s+color-fg-muted\s+my-1\s+pr-4"[^>]*>\s*([\s\S]*?)\s*<\/p>/gi;
const REPO_LANG_RE      = /<span\s+itemprop="programmingLanguage"[^>]*>\s*([^<]+)\s*<\/span>/gi;
const REPO_STARS_RE     = /<a\s+(?:[^>]*\s+)?href="\/[^"]+\/stargazers"[^>]*>\s*<svg[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)\s*<\/a>/gi;
const REPO_STARS_TODAY_RE = /<span\s+class="d-inline-block\s+float-sm-right"[^>]*>\s*<svg[^>]*>[\s\S]*?<\/svg>\s*([\d,]+)\s+stars?\s+(today|this week)/gi;

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
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "rui-trends/1.0 (+https://github.com)" },
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}`, repos: [], url, html: "" };
    }
    const html = await res.text();
    return { ok: true, repos: parseRepos(html), url, html };
  } catch (err) {
    clearTimeout(timeout);
    return { ok: false, error: err.message, repos: [], url, html: "" };
  }
}

function parseRepos(html) {
  const repos = [];
  let match;
  REPO_BLOCK_RE.lastIndex = 0;
  while ((match = REPO_BLOCK_RE.exec(html)) !== null) {
    const fullName = match[1]; // owner/repo
    const [, owner, name] = fullName.match(/^(.+?)\/(.+)$/) || ["", "", fullName];
    repos.push({
      owner: owner.trim(),
      name: name.trim(),
      fullName,
      description: "",
      language: "",
      stars: "",
      starsToday: "",
      url: `https://github.com/${fullName}`,
    });
  }

  // Fill descriptions
  let fieldMatch;
  let idx = 0;
  REPO_DESC_RE.lastIndex = 0;
  while ((fieldMatch = REPO_DESC_RE.exec(html)) !== null && idx < repos.length) {
    repos[idx].description = fieldMatch[1].replace(/<[^>]+>/g, "").trim();
    idx++;
  }

  // Fill language
  idx = 0;
  REPO_LANG_RE.lastIndex = 0;
  while ((fieldMatch = REPO_LANG_RE.exec(html)) !== null && idx < repos.length) {
    repos[idx].language = fieldMatch[1].trim();
    idx++;
  }

  // Fill total stars
  idx = 0;
  REPO_STARS_RE.lastIndex = 0;
  while ((fieldMatch = REPO_STARS_RE.exec(html)) !== null && idx < repos.length) {
    repos[idx].stars = fieldMatch[1].trim();
    idx++;
  }

  // Fill today's stars
  idx = 0;
  REPO_STARS_TODAY_RE.lastIndex = 0;
  while ((fieldMatch = REPO_STARS_TODAY_RE.exec(html)) !== null && idx < repos.length) {
    repos[idx].starsToday = fieldMatch[1].trim();
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

  if (result.repos.length === 0) {
    // Empty result but request succeeded — most likely GitHub HTML
    // structure changed and our regex extractors missed everything.
    console.error(yellow(
      "[rui-trends] ⚠️  HTTP 200 但解析到 0 个仓库。GitHub HTML 结构可能已变更，请检查上方 REPO_*_RE 正则或切换到 GitHub Search API。"
    ));
  }

  console.log(formatTable(result.repos, result.url, opts.lang, opts.since));
  console.error(dim(`[rui-trends] 共 ${result.repos.length} 个仓库`));
}

main().catch((e) => {
  console.error(yellow(`[rui-trends] 错误: ${e.message}`));
  process.exit(1);
});
